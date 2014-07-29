---
layout: post
title: "Measuring production code coverage with coverband"
author: Fábio Rehm
categories:
  - fabio rehm
  - coverband
  - code coverage
  - heroku
  - english
---

Here at HE:labs we strive for 100% code coverage on our projects [from day one](https://github.com/Helabs/pah),
but that doesn't mean that the code we write are actually being used on production
by real users. For sure we can get some insights by looking at analytics data,
figuring out which pages are being accessed and things like that but this data
won't tell us which code paths are actually being executed. That's where [coverband](https://github.com/danmayer/coverband)
comes in.

<!--more-->

Coverband is an awesome gem built by [Dan Mayer](http://mayerdan.com/) that had its
initial release back in [December 2013](https://techblog.livingsocial.com/blog/2013/12/17/coverband-production-ruby-code-coverage/)
and just reached maturity with a 1.0.0 release [last sunday](https://github.com/danmayer/coverband/commit/c7edb6895e143150d96f514f73011547918e308c).

From its README:

> It can be used as Rack middleware, wrapping a block with sampling, or manually
configured to meet any need (like coverage on background jobs).

What caught my attention when I first found out about the gem what [this section](https://github.com/danmayer/coverband#success)
from the project's README:

> After running in production for 30 minutes, we were able very easily delete 2000
LOC after looking through the data. We expect to be able to clean up much more after
it has collected more data.

In my opinion, that's an impressive mark for such a small sampling and I got really
curious to understand how well the gem would behave on the wild. Last week I started
getting my hands dirty and on this post I'll go through the process of setting
things up for collecting production coverage from Ruby on Rails apps that are
deployed to Heroku and also what kind of information we can get out of it.

## Le application

In order to keep things simple, I laid out a "[legacy blog application](https://github.com/fgrehm/legacy-blog-app)"
that has a few characteristics we are likely to find on old Ruby on Rails apps out
in the wild.

Imagine that the app has a good code coverage (_just so you know it doesn't_), has
been running on production for a few years and lots of things have changed along
the way. The team initially implemented support for assigning categories to blog
posts, allowed editing / removing comments and also highlighting posts for an
old "Featured" section. But, the product team has decided that all of the features
above were not needed and the team didn't take enough care to remove all the code
related to make them work.

Now imagine that the company behind that app decided to hire the consultancy shop
you work for to improve the system and you've been assigned to the project. How
will you know what is actually being used? On this contrived example it is pretty
simple to spot but on a real world medium / large sized Rails application it probably
won't ;)

## Setting up coverband for our app

The coverage data will be stored on [redis](http://redis.io/) so make sure you
have it running on your machine to try things out and also on the production
environment so you can collect the data. For my tests, I chose to use the
[Redis To Go](https://addons.heroku.com/redistogo) Heroku addon on its free plan.

With redis in place, we can then add the gem reference to our `Gemfile` and
`bundle install` it:

{% highlight ruby linenos %}
# We don't need coverband on the test env, so we'll just require it when needed
gem 'coverband', '1.0.0', require: false
{% endhighlight %}

After installing the gem, there are a few things we need to do before collecting
data and generating reports.

First we'll have to configure coverband options using its [config file](https://github.com/danmayer/coverband#configure-coverband-options).
There are a few options we can set but the ones I found out to be the most important
ones are described on the [config provided with the legacy blog app](https://github.com/fgrehm/legacy-blog-app/blob/master/config/coverband.rb).
For the purpose of my experiments I've set up the most "aggressive" settings but
on a real app you will probaly use a more "conservative" approach or you'll
experience some significant performance issues.

Then you have to configure some [Rake tasks](https://github.com/fgrehm/legacy-blog-app/blob/master/lib/tasks/coverband.rake#L1-L3).
You can test that things are working by running a `rake coverband:baseline` and
a `rake coverband:coverage`. If all goes well you should see a code coverage
report at your `coverage/index.html` with information about your application
initialization process.

Last but not least, we have to set up the [rack middleware](https://github.com/danmayer/coverband#configure-rack-middleware)
on our [config.ru](https://github.com/fgrehm/legacy-blog-app/blob/master/config.ru#L5-L7).
The middleware is what makes Coverband collect metrics when our app runs.

Those settings should be enough to start collecting data about our app, so fire
up a server with `rails server`, exercise the endpoints you want to verify
Coverband is recording and run `rake coverband:coverage` again. Previously it
should have only shown the baseline data of our app initializing and after using
it in development the report should show increased coverage from the actions we
have exercised.

## Setting things up for Heroku

Right now there are no examples on how to use coverband on Heroku, the only thing
I could find was [this issue](https://github.com/danmayer/coverband/issues/3) and
I hope that this post will serve as a starting point for some docs on setting
things up over there.

In order to generate reports using data from the Heroku app we'll need to:

1. Reset coverage data on each deploy so that the metrics reflect the latest deployed code.
2. Download baseline information about the application startup.
3. Connect to the remote redis instance and run `rake coverband:coverage` pointing to it.

To automate that process, I've [created a couple rake tasks](https://github.com/fgrehm/legacy-blog-app/blob/master/lib/tasks/coverband.rake#L5)
to generate a report using production data and also to reset the remote stats
from my machine.

Here at HE:labs we use a gem we've created called [jumpup](https://github.com/Helabs/jumpup)
and its [heroku plugin](https://github.com/Helabs/jumpup-heroku) to automate the
integration process and making it clear the remote coverage stats was just a
matter of [adding the appropriate task to the list of integration tasks](https://github.com/fgrehm/legacy-blog-app/blob/master/lib/tasks/jumpup.rake#L10).
Given that it is just a rake task you can easily adapt it to your own deployment
process / scripts.

## Exercising the sample app and looking at the results

The app is pretty small, so after deploying the app to Heroku I did "everything"
that is possible to do through the UI, namely "[CRUD](http://en.wikipedia.org/wiki/Create,_read,_update_and_delete)"ing
blog posts and commenting on them.

The full report is available at [LINK](gh-pages) and here's what I found out.

### There's no magic

Fist of all, don't expect coverband (or even [simplecov](https://github.com/colszowka/simplecov)
which is used under the hood) to be magical. If a class body gets evaluated it
will be considered as a hit. For example, things that are evaluated within the
class body (like ActiveRecord validations) are always considered to be executed
and you'll need additional information in order to better understand what is
actually covered.

### Models

If you look at the codebase, there is no [Category]() usage on the app apart
from an [association with the Post]()
model that is [considered to be a hit]().
Unfortunately there is no easy way we can properly detect that the Category model
is not being used unless it have some additional logic. Simple models like that
will just be evaluated and will be considered to be 100% covered but some hints
like additional methods the model might have or inline hooks (like the crazy
[before_save]()
I implemented) are a good source of information.

One tricky issue I found was related to identifying dead scopes. Single liners
like [this one]() will be considered as a hit by coverband while scopes that
spans multiple lines will be reported as not covered. I haven't checked if
this is an issue with Coverband or SimpleCov but it is something we need to
keep in mind when looking at the results.

On a real world app, our models will have much more logic than what is present on
the sample app and besides the issues pointed out above I believe we can get
a lot of information about their usage with coverband.

### Controllers

* dead controllers / actions

### Views

* dead views
* using slim it considers part of the template as not covered (even though it gets rendered, link to stuff on erb)

### Routes

* test with redirect

### Helpers

* highlighted post helper

--------------------------------

CONCLUSION


figure out the performance impact on a real app
link to report by dan

* redis free addon limitations (no backup, storage capacity....)

tks to danmayer and xxxxx for reviewing

coverband_ext
https://github.com/danmayer/coverband_ext

* report has to be generated with the same revision as the prod version
