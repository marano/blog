---
layout: post
title: "Reducing cost of change - Part 1: Duck Typing"
author: Oswaldo Ferreira
categories:
  - duck-typing
  - reducing-cost-of-change
  - oo-design
---

As we already know, software is something that changes a lot. But, as developers,
we can manage a path through a loosely coupled codebase that doesn't make we
cry everytime we need to change it.

Today we gonna learn a technique known as [*duck typing*](http://en.wikipedia.org/wiki/Duck_typing).

<!--more-->

## Definition

Duck types are defined as a public and common interface that are used by
multiple objects.

> Duck typed objects are chamaleons that are defined more by their behavior
than by their class.
>> - Sandi Metz

So it's how the technique gets it's name, "If a an object quacks like a duck and walks like a
duck, it's a duck". When combined with [SRP](http://en.wikipedia.org/wiki/Single_responsibility_principle) (Single Responsibility Principle),
Duck Typing can make a great flexibility improvement of your application.

## Understanding by Examples

Let's be abstract here. It's time to learn how and when to apply Duck typing.

In this example, we are dealing with an application that abstractedly prepares
a party:

{% highlight ruby linenos %}
class Party
  attr_reader :name, :theme, :allowed_age_group

  def self.components
    [Organizer, Designer, DiskJokey, BarMan]
  end

  def prepare
    self.class.components.each do |component|
      if component.is_a? Organizer
        component.create_facebook_event(name)
      elsif component.is_a? Designer
        component.create_ticket_art(name, theme)
      elsif component.is_a? DiskJokey
        component.prepare_musical_base(theme)
      elsif component.is_a? BarMan
        component.buy_drinks(allowed_age_group)
      end
    end
  end
end

class Organizer
  def create_facebook_event(name)
    # ...
  end
end

class Designer
  def create_ticket_art(name, theme)
    # ...
  end
end

class DiskJokey
  def prepare_musical_base(theme)
    # ...
  end
end

class BarMan
  def buy_drinks(allowed_age_group)
    # ...
  end
end
{% endhighlight %}

I know what are you thinking, it's like a seven errors game. Take a look on
the code before proceeding. Did it? Alright. Time to see what's wrong here.

- Party knows each and every component that prepares the party (Dependency).
- Party knows the interface of every component object, and which messages it
should send to them (Dependency).
- Party knows what parameters every component messages need (Dependency).
- Those if's and elses makes our eyes bleed (That's bad).

There's a duck type hiding there, we just need some time to see it. Every party
component prepares a party right? So there's a common interface there.

So the improved code:

{% highlight ruby linenos %}
class Party
  attr_reader :name, :theme, :allowed_age_group

  def prepare
    PartyPreparer.prepare(self)
  end
end

class Organizer
  def prepare_party(party)
    create_facebook_event(party.name)
  end

  private

  def create_facebook_event(name)
    # ...
  end
end

class PartyPreparer
  def self.prepare(party)
    components.each { |component| component.prepare_party(party) }
  end

  def self.components
    [Organizer, Designer, DiskJokey, BarMan]
  end
end


class Designer
  def prepare_party(party)
    create_ticket_art(party.name, party.theme)
  end

  def create_ticket_art(name, theme)
    # ...
  end
end

class DiskJokey
  def prepare_party(party)
    prepare_musical_base(party.theme)
  end

  private

  def prepare_musical_base(theme)
    # ...
  end
end

class BarMan
  def prepare_party(party)
    buy_drinks(party.allowed_age_group)
  end

  private

  def buy_drinks(allowed_age_group)
    # ...
  end
end
{% endhighlight %}

> Once you have a duck type in mind, define its interface, implement that
interface where necessary, and then trust those implementers to behave correctly
>> - Sandi Metz

Now our party components know how to prepare a party with a common interface.
In addition to that, party now only knows that it has a preparer. We now trust
on the preparer to behave correctly when it's called.

The perception to see when we can apply a duck type comes with time. It's easy
to implement it, but not so easy to realize when to use it. The first insights
should come when we see a lot of type checking, like those:

{% highlight ruby linenos %}
def prepare
  @components.each do |component|
    if component.is_a? Organizer
      component.create_facebook_event(name)
    elsif component.is_a? Designer
      component.create_ticket_art(name, theme)
    elsif component.is_a? DiskJokey
      component.prepare_musical_base(theme)
    elsif component.is_a? BarMan
      component.buy_drinks(allowed_age_group)
    end
  end
end
{% endhighlight %}

## Conclusion

So these are the points that we improved on our older code:

- Created a **PartyPreparer** class that encapsulates party preparing behavior.
- Created a common interface for all components that responds preparer.
- Simplified **Party** class. It doesn't need to know how to prepare itself.

Notice that we moved unstable methods interface to private in each component.
Those components methods can change any time, also they can horizontaly grow.
The **Designer** class could have a new #send_to_graphic method.
That method would also be called into Designer#prepare_party, and
it would not affect any of previous behavior.

So it's pretty much that for the first post of the "Reducing cost of changes"
series. We learned how to improve our public interfaces realizing how to
apply Duck typing technique.


