---
layout: post
title: "A simple way to monitor Sidekiq's queue (on Rails and Sinatra)"
author: Alex Stoll
categories:
  - monitoring
  - sidekiq
  - rails
  - sinatra
---

Sidekiq is a Ruby gem that provides simple and efficient background processing for Ruby. Although it works very well, things are much likely to go bad at some point: a worker will eventually raise an exception or the Sidekiq process itself will segfault or crash the Ruby VM. Therefore, it is essencial to monitor Sidekiq in applications that already are on production. This article will explore a simple way to specifically monitor the jobs queue (both on a Rails and a Sinatra app), allowing your team to have a timely response when jobs get stuck.
<!--more-->

A simple way to monitor the health of Sidekiq's queue is to keep an eye on the amount of jobs waiting in the queue. Although the number of enqueued jobs will vary depending on the user traffic and the specifics of your app, it is probably not that hard for your team to determine a number that - if exceeded - indicates that Sidekiq might be in a bad shape.

The technique that we will explore in this article consists in creating a route that will return the current health of Sidekiq's queue and monitoring this state using a service like [UptimeRobot](http://uptimerobot.com/),
[Pingdom](https://www.pingdom.com/) or [PagerDuty](http://www.pagerduty.com/).
Our final objective is to have a setup that will alert our team via email and / or SMS when something seems to be wrong with Sidekiq.

### Monitoring Sidekiq's queue with a Sinatra app

Let's start by writing a specification to describe the behaviour we expect our route to have. Here, we will
considerer an amout of 50 waiting jobs or more as an indicative of a problem with Sidekiq. The desired
behaviour is to have our route return plain text with the queue status as OK if the number of enqueued
jobs is lower than 50 and with the status of WARNING otherwise. As a plus, our route will also
return the current number of waiting jobs. We can write this specification using RSpec and Rack::Test as follows:

{% highlight ruby linenos %}
describe 'GET /health/sidekiq-queue' do
  context 'when the Sidekiq queue is healthy' do
    before do
      allow_any_instance_of(Sidekiq::Queue).to receive(:size).and_return(1)
      get '/health/sidekiq-queue'
    end

    it { expect(last_response.body).to eq('OK. QUEUE SIZE: 1') }
  end

  context 'when the Sidekiq queue is probably having issues' do
    before do
      allow_any_instance_of(Sidekiq::Queue).to receive(:size).and_return(50)
      get '/health/sidekiq-queue'
    end

    it { expect(last_response.body).to eq('WARNING: TOO MANY JOBS ENQUEUED. QUEUE SIZE: 50') }
  end
end
{% endhighlight %}

Before running your specs, add the following to spec_helper.rb:

{% highlight ruby linenos %}
require 'sidekiq/api'
{% endhighlight %}

A basic implementation for the specifications we wrote above might look like this:

{% highlight ruby linenos %}
namespace '/health' do
  get '/sidekiq-queue' do
    status 200
    headers 'Content-Type' => 'text/plain'
    queue_size = Sidekiq::Queue.new.size
    queue_size_msg = "QUEUE SIZE: #{queue_size}"
    if queue_size < 50
      "OK. #{queue_size_msg}"
    else
      "WARNING: TOO MANY JOBS ENQUEUED. #{queue_size_msg}"
    end
  end
end
{% endhighlight %}

_Observation: For didactic purposes, all the implementation is inside the route definition itself. If you
feel that is too much code together with a route definition, you can always use
[Sinatra's helpers](https://github.com/sinatra/sinatra#helpers)._

### Monitoring Sidekiq's queue with a Rails app

Having a route on a Rails app (Rails 4.2, Ruby 2.2.0) to monitor Sidekiq's queue is also not that hard.

First, a request spec to describe the expected route behaviour (very similar to the one we wrote for the Sinatra application):

__spec/requests/health_sidekiq_queue_spec.rb__
{% highlight ruby linenos %}
require 'rails_helper'

RSpec.describe 'Sidekiq queue health' do
  describe 'GET /health/sidekiq-queue' do
    context 'when the Sidekiq queue is healthy' do
      before do
        allow_any_instance_of(Sidekiq::Queue).to receive(:size).and_return(1)
        get '/health/sidekiq-queue'
      end

      it { expect(response.body).to eq('OK. QUEUE SIZE: 1') }
    end

    context 'when the Sidekiq queue is probably having issues' do
      before do
        allow_any_instance_of(Sidekiq::Queue).to receive(:size).and_return(50)
        get '/health/sidekiq-queue'
      end

      it { expect(response.body).to eq('WARNING: TOO MANY JOBS ENQUEUED. QUEUE SIZE: 50') }
    end
  end
end
{% endhighlight %}

Before running your specs, add the following to spec_helper.rb:

__spec/spec_helper.rb__
{% highlight ruby linenos %}
require 'sidekiq/api'
{% endhighlight %}

Then, to have the implementation as simple as possible, let's code it as a proc that is associated with our route:

__config/routes.rb__
{% highlight ruby linenos %}
Rails.application.routes.draw do
  namespace :health do
    get 'sidekiq-queue' => proc {
      queue_size = Sidekiq::Queue.new.size
      queue_size_msg = "QUEUE SIZE: #{queue_size}"
      if queue_size < 50
        queue_health_msg = "OK. #{queue_size_msg}"
      else
        queue_health_msg = "WARNING: TOO MANY JOBS ENQUEUED. #{queue_size_msg}"
      end
      [
        200,
        { 'Content-Type' => 'text/plain' },
        [queue_health_msg]
      ]
    }
  end
end
{% endhighlight %}

This is enough to implement our health monitoring route. You could, off course, extract this code into a controller's action. Another good practice would be to write a spec for the route itself. Since my goal here is to be as succinct as possible, I will leave these improvements for you to do when adapting this solution to your app.

### Configuring the monitoring service

Depending on the monitoring service you are using, the step by step configuration of the
monitor we want to set up will obviously differ a little bit. The basic idea, however, will be the same:
we want our monitor to alert our team if the keyword WARNING was found as part of the plain text
returned when the route we have just implemented is accessed.

If you are using UptimeRobot, a monitor to do this will look similar to the screenshot below:

![UptimeRobot Keyword Monitor](/blog/images/posts/2015-02-13/uptime-robot-keyword-monitor.png)

### Additional resources

One additional resource you should definitely check out is the [Sidekiq Wiki](https://github.com/mperham/sidekiq/wiki). It explains very well how to implement jobs following Sidekiq's best practices. It also includes many interesting tips.

A section that I strongly recommend you to take a look at is the one about [monitoring](https://github.com/mperham/sidekiq/wiki/Monitoring) (much of this article is based on the materials found there). To wrap up, I would like to mention that a monitoring technique that can be even better (depending on the specifics of your application) than monitoring the amount of waiting jobs is to keep an eye on the [latency of jobs](https://github.com/mperham/sidekiq/wiki/Monitoring#monitoring-queue-latency).

I hope you enjoyed the article! If you have any doubts, do not hesitate on posting a comment below (either in Portuguese or English).