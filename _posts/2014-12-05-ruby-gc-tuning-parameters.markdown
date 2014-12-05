---
layout: post
title: "Ruby GC Tuning Parameters"
author: Tomás Müller
categories:
  - Ruby VM
  - Ruby GC
  - performance
  - tuning
  - unicorn
  - heroku
---

**Quick question**: how many GC tuning environment variables are available for you since Ruby 2.1.1?

<!--more-->

Eleven. This is the right answer. At least for now where the latest Ruby version is 2.1.5 this number remains
the same. [Check the source for yourself](https://github.com/ruby/ruby/blob/v2_1_5/gc.c#L5702).

So what?

Every now and then I keep hearing Ruby programmers complaining about the memory usage increase when switching from
Ruby 2.0 to Ruby 2.1. The objective of this blog post is to help those people who are stucked on MRI 2.0, giving a overview of each one of the
GC tuning parameters, explaining how you can benefit your app by using them.


## TL;DR;

Sorry, this kind of thing does not exists when the subject is memory profiling or performance tuning. There's no silver
bullet or one answer for all. [Just profile, experiment, analyse and repeat](https://www.youtube.com/watch?v=wBoRkg5-Ieg). A lot.


## Ruby GC recap

"Everything in Ruby is an object" - You probably already heard this statement. So, a running Ruby program is made up of
objects. Thousands of them. Thanks to the **G**arbage **C**ollector we don't have to manage memory allocation manually.

Each major release of Ruby has included improvements to the garbage collector, most of them about speed. This because for
the GC to do its work it needs to pause the program execution while it's running.

Since the birth of Ruby it's garbage collector is based on Mark & Sweep algorithm, which is made up of two phases (Effective Ruby, 2014):

1. Traverse the object graph. Objects that are still reachable from your code are considered alive and subsequently **marked**.
2. Next, any objects that were not marked in the first phase are considered garbage and *swept* away, releasing memory back to Ruby and possibly to the operating system.

This is a high level and simple view of the Mark & Sweep process.

Now, can you imagine how expensive is to traverse the object graph of a running program with thousands and thousands of
objects? That's why the team behind this complex piece of software engineering concentrates so much efforts seeking
quality and performance improvements.

Here's the history of CRuby's GC evolution (Incremental GC for Ruby interpreter, K.Sasada, 2014):

- 1993/12 Ruby 0.9: Conservative mark and sweep GC
  - Simple algorithm
  - Easy to implement C extensions
- 2011/10 Ruby 1.9.3: Lazy sweep
  - To reduce pause time on sweep
- 2013/02 Ruby 2.0: Bitmap marking
  - To make CoW friendly
- 2013/12 Ruby 2.1: RGenGC
  - To improve throughput

According with K.Sasada work, we can expect another major update on Ruby 2.2 GC which among other things, will introduce
incremental GC algorithm into major GC to reduce long pause time (RincGC: Restricted Incremental GC algorithms).

## GC Tuning Parameters

Remember: Ruby is not just Rails. You can think [Rails as something that potentiates the usage of the WEB as a delivery mechanism](http://www.confreaks.com/videos/759-rubymidwest2011-keynote-architecture-the-lost-years). Rails is optimized for programmer happiness just as Ruby. And the history ends here.

What I'm trying to say is: the Ruby VM is not totally optimized out-of-the-box for every kind of Rails application running on any environment.
One is not built exclusively for the other.

Ruby internals evolved. Rails evolved too. There are defaults set on Ruby VM that you have to know and likely want to adjust them according to your app weight,
pondering with the computing resources at your disposal.

Just to be clear, each one of these GC tuning parameters have a default value, meaning that if you don't set this variable
on your application environment, the default value will take place.

So, if your app is suffering with memory outage after upgrading to Ruby 2.1, I strongly recommend that you start here. There is
a lot of other things that you can do (and probably will have to), mostly of them related to your application server. Later in this
post I'll give a bonus topic for those who are using Unicorn as application server.

Roll up your sleeves. Below the explanation behind each GC tuning variable available today.

1. **RUBY_GC_HEAP_INIT_SLOTS**

    TODO: describe.

2. **RUBY_GC_HEAP_FREE_SLOTS**

    TODO: describe.

3. **RUBY_GC_HEAP_GROWTH_FACTOR** (new from 2.1)

    TODO: describe.

4. **RUBY_GC_HEAP_GROWTH_MAX_SLOTS** (new from 2.1)

    TODO: describe.

5. **RUBY_GC_HEAP_OLDOBJECT_LIMIT_FACTOR** (new from 2.1.1)

    TODO: describe.

6. **RUBY_GC_MALLOC_LIMIT**

    TODO: describe.

7. **RUBY_GC_MALLOC_LIMIT_MAX** (new from 2.1)

    TODO: describe.

8. **RUBY_GC_MALLOC_LIMIT_GROWTH_FACTOR** (new from 2.1)

    TODO: describe.

9. **RUBY_GC_OLDMALLOC_LIMIT** (new from 2.1)

    TODO: describe.

10. **RUBY_GC_OLDMALLOC_LIMIT_MAX** (new from 2.1)

    TODO: describe.

11. **RUBY_GC_OLDMALLOC_LIMIT_GROWTH_FACTOR** (new from 2.1)

    TODO: describe.

**Obsolete:**

- RUBY_FREE_MIN ~> RUBY_GC_HEAP_FREE_SLOTS (from 2.1)
- RUBY_HEAP_MIN_SLOTS ~> RUBY_GC_HEAP_INIT_SLOTS (from 2.1)

Again: all listed environment variables above are for Ruby 2.1. Ruby 2.2 will probably have an impact on these settings.
Tune them only if you really know what you are doing.

## Profiling your app

TODO write about gems available for doing this.

TODO write about NewRelic.

TODO write about Librato.

TODO write about Skylight.

TODO write about metrics tab on the new Heroku dashboard.

TODO https://github.com/ko1/gc_tracer

TODO https://github.com/SamSaffron/memory_profiler


## Bonus: making your Unicorn fly high

TODO write about how to use https://github.com/tmm1/gctools with Unicorn

## Conclusion

Identify the bottleneck of your application, set up some profiling tools to analise the resource consumption and tune them.

TODO write about how important is knowing the environment resources available where your app is running.

TODO write about remembering there are defaults for almost everything, including the GC Tuning Parameters. So, you **must** know your resources and adjust accordingly to your app weight.

## References

- [Aman Gupta, Ruby 2.1: RGenGC](http://tmm1.net/ruby21-rgengc/)
- [Aman Gupta, Ruby 2.1: Out-of-Band GC](http://tmm1.net/ruby21-oobgc/)
- [Bug #9607 Change the full GC timing](https://bugs.ruby-lang.org/issues/9607)
- [K.Sasada: Incremental GC for Ruby interpreter](http://www.atdot.net/~ko1/activities/2014_rubyconf_pub.pdf)
- [K.Sasada: Speedup Ruby Interpreter](http://www.atdot.net/~ko1/activities/2014_deccanrubyconf_pub.pdf)
- [K.Sasada: Memory Management Tuning in Ruby](http://www.atdot.net/~ko1/activities/2014_rubyconf_ph_pub.pdf)
- [K.Sasada: Toward more efficient Ruby 2.1](http://www.atdot.net/~ko1/activities/Euruko2013-ko1.pdf)
- [Peter J. Jones, Effective Ruby](http://www.effectiveruby.com/)
- [ruby/v2_1_5/gc.c](https://github.com/ruby/ruby/blob/v2_1_5/gc.c#L5702)
- [Sam Saffron, Ruby 2.1 Garbage Collection: ready for production](http://samsaffron.com/archive/2014/04/08/ruby-2-1-garbage-collection-ready-for-production)
- Sam Saffron, Why Ruby 2.1 excites me? [slides](https://speakerdeck.com/samsaffron/why-ruby-2-dot-1-excites-me), [video](http://vimeo.com/89491942)
