---
layout: post
title: "N + 1 Queries in Rails"
author: Flavia Fortes
comments: true
categories:
  - flavia fortes
  - n+1 query
  - rails
  - performance
  - active record
---

On my last [post](http://helabs.com.br/blog/2013/12/18/performance-protips/) I described what I've done to fix a server time out caused by performance issues that occurred in one of our applications. As I promised, I'm coming back to talk about a very important point on the refactoring process.

<!--more-->

So, today's topic are those nasty n + 1 queries that occurs when we have associations. For example:

{% highlight ruby linenos %}
#model
class Exam < ActiveRecord::Base
  belongs_to :creator, class_name: "User",
                  foreign_key: "creator_id"
end
{% endhighlight %}

{% highlight ruby linenos %}
#controller
class ExamsController < ApplicationController

  def index
    @exams = Exam.limit(100)
  end
end
{% endhighlight %}

{% highlight ruby linenos %}
#view
 - @exams.each do |exam|
    = exam.creator
{% endhighlight %}

In this case, it's being executed not only 1 query to find 100 exams, but actually 1 + 100
queries to find the creator of each exam.
This situation is very common, because the code above looks good at first sight, but behind the scenes it doesn't.

So, how do we fix that? With [Eager Loading Associations](http://guides.rubyonrails.org/active_record_querying.html#eager-loading-associations)

In our controller we specify which associations we want to be loaded at the same time exams are being loaded from the database, using the includes method:

{% highlight ruby linenos %}
#controller
class ExamsController < ApplicationController

  def index
    @exams = Exam.includes(:creator).limit(100)
  end
end
{% endhighlight %}

And, that's it. No more N + 1 Queries!

Ok, but I bet there are many n + 1 queries in your application and you have no idea that it's going on. Instead of looking for them on the app's logs, let me introduce you an easier way to discover them, the [Bullet Gem](https://github.com/flyerhzm/bullet). Add this to your development group on Gemfile:

{% highlight ruby linenos %}
#Gemfile
group :development do
  gem 'bullet'
end
{% endhighlight %}

Configure it as stated on Bullet's README and everytime you have a n + 1 query it will warn you. :)

Whenever you feel that your app is getting slower, check out the queries! Solved that, there are still 2 important topics remaining: Select versus Pluck and Ruby Memoization. Both I'm looking forward to explain for you next time!

Hope you like it!
Hugs!


