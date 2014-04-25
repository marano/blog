---
published: true
author: Thiago Belem
layout: post
title: "Thread-safing your objects with the Lockable concern"
date: 2014-04-25 14:00
comments: true
categories:
  - threadsafe
  - lock
  - concern
  - Thiago Belem
  
---

Sometimes, you just want to make your database objects threadsafe and run parallel/concurrent tasks on them without making a mess.

Imagine the following situation:

* You have a background job (cheers, [Sidekiq](http://sidekiq.org/)!) that will run and update/modify a list of database records based on some logic.
* You have more than one of this job running at the same time.

What would happend if two jobs want to update the same record, at the same time?

Wouldn't be lovely if the 2nd job **skips** the first record if the 1st job is working on it?

Thats why I created the following concern:

{% highlight ruby linenos %}
# app/models/concerns/lockable.rb

require 'active_support/concern'

module Lockable
  @locked = false

  def locked?
    @locked == true
  end

  def lock!
    raise Exception, 'You should define the lock! method inside your class'
  end

  def unlock!
    raise Exception, 'You should define the unlock! method inside your class'
  end

  def while_locked
    return false if locked?

    lock!
    needs_unlock = true

    yield
  ensure
    unlock! if needs_unlock
  end
end
{% endhighlight %}

Here is the Lockable concern specs if you're wondering: [gist.github.com/TiuTalk/10433564](https://gist.github.com/TiuTalk/10433564)

Remember to override the persistence methods on your model, like this:

{% highlight ruby linenos %}
class MyModel < ActiveRecord::Base
  include Lockable

  def lock!
    update_attribute(:locked, true)
  end

  def unlock!
    update_attribute(:locked, false)
  end
end
{% endhighlight %}

And you can wrap your code with the **while_locked** method, like this:

{% highlight ruby linenos %}
object = MyModel.find(12)

object.while_locked do
  object.some_serious_shit!
end
{% endhighlight %}

With this, you can have multiple simultaneous processes running on your database records without one messing with the other! How fancy is that?

See ya'll!
