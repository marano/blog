---
layout: post
title: "Exploring Attribute Methods"
author: Thiago Borges
comments: true
categories:
  - Thiago Borges
  - Rails
  - TDD
  - ActiveModel
  - English

---

During the development process, it is very common to
explore some Ruby code using [CTags][ctags].
Mostly to see some documentation, also to understand how
the method works under the hood and learn some tricks.
During this process, I found out about
ActiveModel::AttributeMethods and I'll explore it using
TDD on this post.

<!--more-->

First of all, what Attribute Methods is?

It is module that provides an easy way to create
prefixed and suffixed methods. For example on
ActiveModel::Dirty:

{% highlight ruby linenos %}
person = Person.new(name: 'Peter')
person.name = 'Bob'
person.name          # => "Bob"
person.name_changed? # => true
person.name_was?     # => "Peter"
person.name_change   # => ["Peter", "Bob"]
person.reset_name!   # => "Peter"
{% endhighlight %}

All these **_changed?** **was?** **change** and
**reset_ !** are set using the facilities of Attribute
Methods.

Why should I care about it?

In the example above, the only attribute is `name`.
But what if I have to implement all that prefix,
suffix and affix for many attributes like `email`,
`phone`, `address`? It would be a hell of duplication,
which means a big chance of bugs and inconsistency.


To implement something like *Dirty* module, we have to
implement the requirements:

1. Include ActiveModel::AttributeMethods in your class.
2. Call each of its method you want to add, such as attribute_method_suffix or attribute_method_prefix.
3. Call define_attribute_methods after the other methods are called.
4. Define the various generic _attribute methods that you have declared.

Now that we all know how it behaves and what is necessary, we can start the process. I'm assuming the project is set up with Active Model and RSpec, just to simplify the example.

### Example
The idea is to implement a method *_taken?* that checks if the attribute
is included on a predefined resource. It simple returns true if the
attribute value already exists or false if it doesn't.

As we know what we want, let's create the first tests

{% highlight ruby linenos %}
describe Person do
  describe 'check existent attributes' do
    context 'name' do
      it 'says Thiago name is already taken' do
        person = Person.new(name: 'Thiago')
        expect(person.name_taken?).to be_true
      end

      it 'says Gumercindo name is not taken' do
        person = Person.new(name: 'Gumercindo')
        expect(person.name_taken?).to be_false
      end
    end
  end
end
{% endhighlight %}

Nice, based on this rspec test, I can drive the design of my Person
class.

As mentioned above, I need 4 steps to setup a Attribute Method based
class.

{% highlight ruby linenos %}
require 'active_model'
class Person
  include ActiveModel::AttributeMethods  # Step 1
  attr_accessor :name

  attribute_method_suffix '_taken?'      # Step 2
  define_attribute_methods %w(name)      # Step 3

   def initialize(params)
     @name = params[:name]
   end

  def attribute_taken?(attr)             # Step 4     def name_taken?(name)
    send("#{attr}_collection").include?(send(attr)) #   name_collection.include?(name)
  end                                               # end

  private
    def name_collection
      %w(Thiago Anézio Paulo Camila)
    end

 end
{% endhighlight %}

On ordinary Rails projets, you don't need to worry about the first line,
since Rails preloads all gems.

The triky part is using metaprogramming to call attribute specific
methods, like on line *14*, which calls the private method
*#name_collection*.

Now that the tests are passing, I can create the test for the email
attribute:

{% highlight ruby linenos %}
describe Person do
  describe 'check existent attributes' do
    context 'email' do
      it 'says thiago@gmail.com is already taken' do
        person = Person.new(email: 'thiago@gmail.com')
        expect(person.email_taken?).to be_true
      end

      it 'says gomercindo@example.com is not taken' do
        person = Person.new(email: 'gomercindo@example.com')
        expect(person.email_taken?).to be_false
      end
    end
  end
end
{% endhighlight %}

And it is very simple to extend the class for the email attribute:


{% highlight ruby linenos %}
require 'active_model'
class Person
  include ActiveModel::AttributeMethods
  attr_accessor :name, :email

  attribute_method_suffix '_taken?'
  define_attribute_methods %w(name email)

  def initialize(params)
    @name = params[:name]
    @email = params[:email]
  end

  def attribute_taken?(attr)                        # def name_taken?(name)
    send("#{attr}_collection").include?(send(attr)) #   name_collection.include?(name)
  end                                               # end

  private
    def name_collection
      %w(Thiago Anézio Paulo Camila)
    end

    def email_collection
      %w(thiago@gmail.com anezio@uol.com.br paulo@ig.com.br camila@terra.com.br)
    end
end
{% endhighlight %}

You can check the diff here.

It is important to have name conventions too implement reusable code like this, and attribute methods guide us to this direction.


### Conclusion

It is always important to keep the code as DRY as possible.
We, at HE:labs, use CodeClimate to point the bad smells, like
duplication, complexity, and chorn. We also have 100% test coverage
to help us refactoring with confidence.

This kind of refactoring is recommended when the whole team
is confortable with this approach and in some cases it will become
harder to change if the attributes start diverging the shared
behavior. If this day come, your tests will be there to support
you.


[ctags]: http://ctags.sourceforge.net/
