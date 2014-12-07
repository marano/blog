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
objects. Thousands of them. Thanks to the **G**arbage **C**ollector you don't have to manage memory allocation manually.

Each major release of Ruby has included improvements to the garbage collector, most of them about speed. This because for
the GC to do its work it needs to pause the program execution while it is running.

Since the birth of Ruby its garbage collector is based on Mark & Sweep algorithm, which is made up of two phases (Effective Ruby, 2014):

1. Traverse the object graph (the Ruby heap). Objects that are still reachable from your code are considered alive and subsequently **marked**.
2. Next, any objects that were not marked in the first phase are considered garbage and *swept* away, releasing memory back to Ruby and possibly to the operating system.

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

## Generational GC

The garbage collector in Ruby 2.1 introduced the Generational GC, using Mark & Sweep algorithm to maintain the Ruby heap
classifying objects in two categories (generations).

This technique treats new objects differently than older ones. A new (young) object is one that has just been created by your program.
An old object (also referenced as *mature* object) is one that will continue to be used by your program.

The reason behind this categorization is based on the weak generational hypothesis, which means: "most objects die young".
In other words, new objects will probably die young. Having this "life expectancy" differences between new and old objects,
different GC algorithms and strategies can be applied for each *generation*.

Enter the *minor* and *major* GC runs:

- Minor GC: should be faster than major GC, run often, traversing only the young objects.
- Major GC: traverses the whole object graph, including the old generation.

To classify an object as young or old the GC does the following:

1. On a minor GC, when it marks an object in the mark phase, it promote the object to the old generation (remember: when an object is marked, means that the object will survive the current GC run).
2. Sweep away unmarked objects.
3. During the next minor GC, the entire old generation section will be ignored by the GC, traversing only the young generation.

Above is just the basics for you to understand the GC tuning parameters topic below. The entire garbage collection process implemented in Ruby 2.1 (RGenGC) is much
more complex in order to solve all existent problems. For a detailed view of how it works take a look on this post references.

When Ruby 2.2 goes out we can expect another major update into the garbage collector, where it will probably introduce a three-generation GC.

## GC Tuning Parameters

Before we continue let's see some key points about the Ruby heap:

- The heap is the memory managed by Ruby and which we have access.
- The heap is divided into pages and slots.
- Each heap **page** holds 408 slots (`GC::INTERNAL_CONSTANTS[:HEAP_OBJ_LIMIT]`).
- Internally, a [Ruby object is represented as a struct called RVALUE](https://github.com/ruby/ruby/blob/v2_1_5/gc.c#L330).
- Each heap **slot** has the size of one RVALUE, which is 40 bytes (`GC::INTERNAL_CONSTANTS[:RVALUE_SIZE]`). So, sufficient size to hold one Ruby object.
- The size of each heap **page** is around 16kb (`408 * 40 = 16320 bytes`).

Ok, now we have the minimum amount of information to understand the existent GC tuning environment variables.

Following the idea of each application should be treated as a unique case, there are defaults set on Ruby VM that you have to
know and likely want to adjust them according to the app weight, pondering with the computing resources at your disposal.

Just to be clear, each one of these GC tuning parameters have a default value, meaning that if you don't set this variable
on your application environment, the default value will take place.

So, if your app starts running out of memory after upgrading to Ruby 2.1, this is a good place to start.

In the case of a Rails application there is a lot of other things that you can do (and probably will have to), mostly of
them related to the application server. Later in this post I'll give a bonus topic for those who are using Unicorn as
application server.

Roll up your sleeves. Below the explanation behind each GC tuning variable available today.

1. **RUBY_GC_HEAP_INIT_SLOTS**

    Initial number of slots allocated on Ruby's heap. Increasing this value from its default can reduce GC activity during application boot.

    Default value: 10000

2. **RUBY_GC_HEAP_FREE_SLOTS**

    After a GC execution, the minimum number of free slots that should be available.

    Default value: 4096

3. **RUBY_GC_HEAP_GROWTH_FACTOR** (new from 2.1)

    When the heap needs to be expanded, allocate slots by this factor: `(next slots number) = (current slots number) * (this factor)`

    Default value: 1.8

4. **RUBY_GC_HEAP_GROWTH_MAX_SLOTS** (new from 2.1)

    Set the maximum number of slots that Ruby is allowed to add to the heap at once. When disabled, Ruby uses the heap
    growth factor to determine by how much to grow the heap.

    Default value: 0 (meaning that this limit is disabled)

5. **RUBY_GC_HEAP_OLDOBJECT_LIMIT_FACTOR** (new from 2.1.1)

    Factor to control major GC timing, given by: `control threshold = this factor * number of old objects from the last major GC`.

    The `control threshold` is compared with the current number of old objects. If the `control threshold` is exceeded
    by the number of old objects since the last major marking phase, another major GC will happen.

    Special note: if you want to disable generational garbage collection, you can specify 0.9 (any number lesser than 1.0).

    Default value: 2.0 (meaning that old objects have to double to trigger another major GC)

6. **RUBY_GC_MALLOC_LIMIT**

    Internally the VM keeps track of `malloc_increase`, which is the number of bytes that have been allocated but not yet
    freed. This is effectively the memory growth of the process.

    This parameter hold the minimum value for `GC.stat[:malloc_limit]`. If `malloc_increase` exceeds the `malloc_limit` a minor GC is triggered.

    Default value: 16777216 (16MB)

7. **RUBY_GC_MALLOC_LIMIT_MAX** (new from 2.1)

    Sets the maximum value for `GC.stat[:malloc_limit]` from going too high (`malloc_limit` changes dynamically by the growth factor below, tuning number 8).

    To remove this upper limit set the value 0.

    Default value: 33554432 (32MB)

8. **RUBY_GC_MALLOC_LIMIT_GROWTH_FACTOR** (new from 2.1)

    The growth factor that controls the `GC.stat[:malloc_limit]` value grows over time. Given by:
    `new malloc_limit = current malloc_limit * this factor`.

    Default value: 1.4

9. **RUBY_GC_OLDMALLOC_LIMIT** (new from 2.1)

    The old generation memory growth is tracked separately by the VM in `oldmalloc_increase`.

    This parameter hold the minimum value for `GC.stat[:oldmalloc_limit]`. If `oldmalloc_increase` exceeds the `oldmalloc_limit` a major GC is triggered.

    Default value: 16777216 (16MB)

10. **RUBY_GC_OLDMALLOC_LIMIT_MAX** (new from 2.1)

    TODO: describe.

11. **RUBY_GC_OLDMALLOC_LIMIT_GROWTH_FACTOR** (new from 2.1)

    TODO: describe.

**Obsolete:**

- RUBY_FREE_MIN ~> RUBY_GC_HEAP_FREE_SLOTS (from 2.1)
- RUBY_HEAP_MIN_SLOTS ~> RUBY_GC_HEAP_INIT_SLOTS (from 2.1)

Again: all listed environment variables above are for Ruby 2.1. Ruby 2.2 will probably have an impact on these settings.
Tune them only if you really know what you are doing.

## Profiling

> “One thing I have learned in a long life: that all our science, measured against reality, is primitive and childlike -- and yet it is the most precious thing we have.”
― Albert Einstein

Think about. This Einstein's quote fits perfectly here.

In order to accomplish this hard work surround yourself with great tools. I'm sharing my list below. Using different thing?
Please don't hesitate and send your comment at the end of this post.

- Ruby `GC::stat` - Return a hash with interesting information about the garbage collector.
- Ruby `ObjectSpace` - The ObjectSpace module contains a number of routines that interact with the garbage collection
facility and allow you to traverse all living objects with an iterator. The objspace library extends the ObjectSpace module
and adds several methods to get internal statistic information about object/memory management.
- [NewRelic](http://newrelic.com) - The Ruby VMs tab under monitoring menu give a good set of graphics about the situation
of memory and garbage collection.
- [Librato](https://www.librato.com/)
- [Skylight](https://www.skylight.io/)
- [Heroku App Dashboard Metrics tab](https://devcenter.heroku.com/articles/metrics)
- [gc_tracer](https://github.com/ko1/gc_tracer)
- [memory_profiler](https://github.com/SamSaffron/memory_profiler)

Also, the [What I Learned About Hunting Memory Leaks in Ruby 2.1](http://blog.skylight.io/hunting-for-leaks-in-ruby/) blog post from Peter W.
describes an approach to collect and analyse heap dumps from your running application. Heap dumps are the devil's house. Precious raw data lives there.

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
- [Pat Shaughnessy, Ruby Under a Microscope: Learning Ruby Internals Through Experiment](http://patshaughnessy.net/ruby-under-a-microscope)
- [Peter J. Jones, Effective Ruby](http://www.effectiveruby.com/)
- [Peter Wagenet, What I Learned About Hunting Memory Leaks in Ruby 2.1](http://blog.skylight.io/hunting-for-leaks-in-ruby/)
- [ruby/v2_1_5/gc.c](https://github.com/ruby/ruby/blob/v2_1_5/gc.c#L5702)
- [Sam Saffron, Ruby 2.1 Garbage Collection: ready for production](http://samsaffron.com/archive/2014/04/08/ruby-2-1-garbage-collection-ready-for-production)
- Sam Saffron, Why Ruby 2.1 excites me? [slides](https://speakerdeck.com/samsaffron/why-ruby-2-dot-1-excites-me), [video](http://vimeo.com/89491942)
