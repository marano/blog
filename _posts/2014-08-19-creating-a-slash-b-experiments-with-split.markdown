---
layout: post
title: "Creating A/B experiments with Split"
author: Thiago Belem
hide_author_link: true
categories:
  - split
  - a/b test
  - a/b experiment
  - rails
---

[Split](https://github.com/andrew/split) is a rack based ab testing framework designed to work with Rails, Sinatra or any other rack based app.

<!--more-->

With the [Split](https://github.com/andrew/split) gem you can create and automate your A/B experiments and improve your website messages/buttons/colors with little to no effort! :watermelon:

## Live example

I've created an [example application](http://fathomless-ocean-1935.herokuapp.com/) with an A/B running on the call to action button.

On the above example, the button text can be "Sign-up!", "Join us" or "Go go go".

You can also check the [Split dashboard](http://fathomless-ocean-1935.herokuapp.com/split), with the results of the experiment.

The source code for this application is [available on GitHub](https://github.com/TiuTalk/split-example).

## Installation

We are going to use the version **0.7.2** of Split for this tutorial.

Add the gem to your **Gemfile**:

{% highlight ruby linenos %}
gem 'split', '~> 0.7.2'
{% endhighlight %}

If you have any doubt, follow the [setup](https://github.com/andrew/split#setup) guide and make sure you have met all the [requirements](https://github.com/andrew/split#requirements).

## Create your first experiment

The simplest A/B experiment you can do is changing the color or text of a button/link on a view:

{% highlight html+erb linenos %}
<div class="container" role="main">
  <div call="hero">
    <h1>Our products are fantastic!</h1>
    
    <% ab_test('call_to_action', 'Sign-up!', 'Join us', 'Go go go') do |text| %>
      <%= link_to(text, pages_signup_path, class: 'btn btn-primary btn-lg') %>
    <% end %>
  </div>
</div>
{% endhighlight %}

Every time a **different user** access this page, he will see one of the texts.

And then you **finish the experiment** when the user reaches the next page or the end of the goal:

{% highlight html+erb linenos %}
<div class="container" role="main">
  <div call="hero">
    <h1>Thank you!</h1>

    <% finished('call_to_action') %>

    <%= link_to('Go back to the home', root_path, class: 'btn') %>
  </div>
</div>
{% endhighlight %}

And that's it! The experiment is finished and the option the user saw (and clicked) gains a point.

Creating and finishing experiments via the view is not the only way of doing things with Split.. you can do the same via Controllers too. Be sure to read the [README](https://github.com/andrew/split#split) for more information.

## Using another A/B algorithm

By default, Split will show a random option for every user and you can change this behavior using the `algorithm` option, on the split initializer:


{% highlight ruby linenos %}
# config/initializers/split.rb

Split.configure do |config|
  config.algorithm = Split::Algorithms::Whiplash
end
{% endhighlight %}

The **Whiplash** is an implementation of a [multi-armed bandit algorithm](http://stevehanov.ca/blog/index.php?id=132). This algorithm will automatically weight the alternatives based on their relative performance, choosing the better-performing ones more often as trials are completed.

## Accessing the Split dashboard

Split comes with a very nice dashboard so you can see how every experiment/options is doing:

![](http://cl.ly/image/2B3E2h2D230O/Screen%20Shot%202014-08-01%20at%206.39.07%20PM.png)

To enable this dashboard you need to add a require param to your **Gemfile**:

{% highlight ruby linenos %}
gem 'split', '~> 0.7.2', require: 'split/dashboard'
{% endhighlight %}

And mount the split routes:

{% highlight ruby linenos %}
# config/routes.rb

Rails.application.routes.draw do
  # ... other routes ...

  mount Split::Dashboard, at: 'split'
end
{% endhighlight %}

And when you access the `/split` endpoint on your browser, you should see the Split dashboard! :four_leaf_clover:

As you can see on the above picture, on the dashboard you can see the status of every experiment and options, conversion rates and etc. You can also choose an option to be used (finishing the experiment).

That's all for now folks, see you on my next post! :+1:
