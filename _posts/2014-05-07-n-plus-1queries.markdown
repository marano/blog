---
layout: post
title: "N + 1 Queries in Rails"
author: Flavia Fortes
hide_author_link: true
categories:
  - flavia fortes
  - n+1 query
  - rails
  - performance
  - active record
---

On my last [post](http://helabs.com.br/blog/2013/12/18/performance-protips/) I described what I've done to fix a server time out caused by performance issues that occurred in one of our applications. As I promised, I'm coming back to talk about a very important point on the refactoring process.

<!--more-->

So, today's topic are those nasty n + 1 queries that occur when we have associations. For example:

{% highlight ruby linenos %}
#model
class Post < ActiveRecord::Base
  belongs_to :user
end
{% endhighlight %}

{% highlight ruby linenos %}
#controller
class PostsController < ApplicationController

  def index
    @posts = Post.limit(10)
  end
end
{% endhighlight %}

{% highlight ruby linenos %}
#view
 - @posts.each do |post|
    = post.user.name
{% endhighlight %}

In the code above, it's being executed not only 1 query to find 10 posts <strong>(1)</strong>, but actually 1
query to find 10 posts and + 10 queries to find the creator of each post. <strong>(N + 1)</strong>
This situation is very common, because the code looks good at first sight, but behind the scenes it really doesn't. Take a look:

{% highlight ruby linenos %}
Started GET "/posts" for 127.0.0.1 at 2014-05-06 16:34:59 -0300
Processing by PostsController#index as HTML
  User Load (0.8ms)  SELECT "users".* FROM "users" WHERE "users"."id" = $1 LIMIT 1  [["id", 1]]
   (1.2ms)  SELECT COUNT(count_column) FROM (SELECT 1 AS count_column FROM "posts" LIMIT 10) subquery_for_count
  Post Load (38.6ms)  SELECT "posts".* FROM "posts" LIMIT 10
  User Load (1.2ms)  SELECT "users".* FROM "users" WHERE "users"."id" = $1 LIMIT 1  [["id", 1]]
  User Load (1.0ms)  SELECT "users".* FROM "users" WHERE "users"."id" = $1 LIMIT 1  [["id", 2]]
  User Load (0.7ms)  SELECT "users".* FROM "users" WHERE "users"."id" = $1 LIMIT 1  [["id", 3]]
  User Load (0.7ms)  SELECT "users".* FROM "users" WHERE "users"."id" = $1 LIMIT 1  [["id", 4]]
  User Load (0.9ms)  SELECT "users".* FROM "users" WHERE "users"."id" = $1 LIMIT 1  [["id", 5]]
  User Load (1.2ms)  SELECT "users".* FROM "users" WHERE "users"."id" = $1 LIMIT 1  [["id", 6]]
  User Load (0.8ms)  SELECT "users".* FROM "users" WHERE "users"."id" = $1 LIMIT 1  [["id", 7]]
  User Load (0.7ms)  SELECT "users".* FROM "users" WHERE "users"."id" = $1 LIMIT 1  [["id", 8]]
  User Load (0.6ms)  SELECT "users".* FROM "users" WHERE "users"."id" = $1 LIMIT 1  [["id", 9]]
  User Load (0.6ms)  SELECT "users".* FROM "users" WHERE "users"."id" = $1 LIMIT 1  [["id", 10]]
  Rendered posts/index.html.haml within layouts/application (65.9ms)
Completed 200 OK in 80ms (Views: 28.6ms | ActiveRecord: 49.3ms)
{% endhighlight %}

So, how do we fix that? With [Eager Loading Associations](http://guides.rubyonrails.org/active_record_querying.html#eager-loading-associations)

In our controller we specify which associations we want to load at the same time posts are being loaded from the database. We use the includes method, like this:

{% highlight ruby linenos %}
#controller
class PostsController < ApplicationController

  def index
    @posts = Post.includes(:user).limit(10)
  end
end
{% endhighlight %}

And, that's it. No more N + 1 Queries! See for yourself:

{% highlight ruby linenos %}
Started GET "/posts" for 127.0.0.1 at 2014-05-06 16:37:50 -0300
Processing by PostsController#index as HTML
  User Load (1.5ms)  SELECT "users".* FROM "users" WHERE "users"."id" = $1 LIMIT 1  [["id", 1]]
   (2.3ms)  SELECT COUNT(count_column) FROM (SELECT 1 AS count_column FROM "posts" LIMIT 10) subquery_for_count
  Post Load (39.6ms)  SELECT "posts".* FROM "posts" LIMIT 10
  User Load (42.4ms)  SELECT "users".* FROM "users" WHERE "users"."id" IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
  Rendered posts/index.html.haml within layouts/application (120.6ms)
Completed 200 OK in 161ms (Views: 39.7ms | ActiveRecord: 102.0ms)
{% endhighlight %}

Ok, but I bet there are many n + 1 queries in your application and you have no idea that it's going on. Instead of looking for them on the app's logs, let me introduce you an easier way to discover them, the [Bullet Gem](https://github.com/flyerhzm/bullet). Add this to your development group on Gemfile:

{% highlight ruby linenos %}
#Gemfile
group :development do
  gem 'bullet'
end
{% endhighlight %}

Configure it as stated on Bullet's README and everytime you have a n + 1 query it will warn you. :)

Whenever you feel that your app is getting slower, check out the queries! Solved that, there are still 2 important topics remaining: Select versus Pluck and Ruby Memoization. Both I'm looking forward to explain for you next time!

Hope you liked it!
Hugs!


