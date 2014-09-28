---
layout: post
title: "Ruby Memoization - Part I"
author: Flavia Fortes
categories:
  - flavia fortes
  - ruby
  - memoization
  - conditional assignment operator
---

Hello, guys! How have you been doing? :) Today I'll talk a little bit about memoization for ruby developers.

<!--more-->

First of all, what's memoization? Well, memoization is a caching technique applied to optimize routines. Like, for example, when you store a returned value so next time you need to use it you avoid another call.

The simpler way to use memoization in ruby is by using the conditional assignment operator: ```||=```.

{% highlight ruby linenos %}
class User
   # other methods
  def facebook_friends
    @facebook_friends ||= FacebookApi.get(:friends_list, self.facebook_id)
  end
end
{% endhighlight %}

Note that when using facebook_friends you don't make uneeded calls to facebook api, because the result is memoized:

{% highlight ruby linenos %}
user.facebook_friends # => query the facebook api and return the friends
user.facebook_friends # => return the cached result
{% endhighlight %}

Basically, the code above means:
 ```@facebook_friends = @facebook_friends || FacebookApi.get(:friends_list, self.facebook_id)```.

 OK, there are some fun controversies about this matter, some really smart guys say that the actual behavior is:
```@facebook_friends || @facebook_friends = FacebookApi.get(:friends_list, self.facebook_id)```.

For further information check [this article](http://www.rubyinside.com/what-rubys-double-pipe-or-equals-really-does-5488.html), but let me show you why I think this is enjoyable:


### Local variables

This is a classical example, using local variables:

{% highlight ruby linenos %}
> x = nil
  => nil
> x ||= 1
  => 1
{% endhighlight %}

On another irb session:

{% highlight ruby linenos %}
> x = nil
 => nil
> x = x || 1
 => 1
> x = x || 2
 => 1    #just like we want
{% endhighlight %}

So far, it feels like ```x = x || 1```, don't you think?


### Hashes

Right, so we define a Hash like that:

{% highlight ruby linenos %}
> h = Hash.new(1)
 => {}
{% endhighlight %}

The default value is what a Hash return without a defined key.

{% highlight ruby linenos %}
> h[:x]
 => 1
{% endhighlight %}

But the Hash itself remains empty, as expected:

{% highlight ruby linenos %}
> h
 => {}
{% endhighlight %}

And then:

{% highlight ruby linenos %}
> h[:x] ||= 2
 => 1
> h
 => {}
{% endhighlight %}

WOW, what just happened here? Wasn't ```h```  supposed to equal ```{:x=>1}```?

And then we try this:

{% highlight ruby linenos %}
> h[:x] = h[:x] || 2
 => 1
> h
 => {:x=>1}
{% endhighlight %}

Right, different responses. So it doesn't feel like ```x ||= 1``` behaves like ```x = x || 1``` anymore.

If you're wondering, this doesn't happen if the Hash is set without a default value, like ```h = Hash.new```.
See for yourself:

{% highlight ruby linenos %}
> h = Hash.new
 => {}
> h[:x]
 => nil
> h[:x] ||= 1
 => 1
> h
 => {:x=>1}
{% endhighlight %}


### Undefined variables

In these three examples below I used a new irb session, take a look:

{% highlight ruby linenos %}
> x ||= 1
 => 1
{% endhighlight %}

{% highlight ruby linenos %}
> x || x = 1
NameError: undefined local variable or method `x' for main:Object
{% endhighlight %}

{% highlight ruby linenos %}
> x = x || 1
 => 1
{% endhighlight %}

Annnnnnnd, are we back to the ```x = x || 1``` behavior?


##Observations

The main difference between ```x = x || 1``` and ```x || x = 1``` is essentially if you're assigning the value before or after the ```or``` comparison. So, yes, the second behavior makes more sense, but I couldn't find an explanation towards the undefined variables scenario. Something happens inside the ruby mechanisms. Anyway, feel free to add your opinions on our comments section. I'll be glad to hear your standpoints. :)


##Plus

###The boolean problem

Both nil and false are considered falsy values when found in boolean expressions, so look what happen when you use the conditional assignment operator with them:

{% highlight ruby linenos %}
> f = false
 => false
> f ||= true
 => true
{% endhighlight %}

Or, on a more daily example:

{% highlight ruby linenos %}
class User
  # other methods
  def has_credit?
    @has_credit ||= begin
      payload = BankAccountApi.get_balance(self.bank_account_id)
      payload[:balance] > 0
    end
  end
end
{% endhighlight %}

If ```payload[:balance] > 0``` returns false, the begin block will run again and again, making every api call until ```payload[:balance] > 0``` returns true.

Whenever you need to memoize a method or variable that might return nil or false, avoid using the ```||=``` idiom.

And that was what inspired this post, hahaha. Be very careful my friends! See you next time.