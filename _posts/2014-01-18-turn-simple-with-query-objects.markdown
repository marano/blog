---
author: Rafael Fiuza
layout: post
title: "Turn simple with Query Objects"
categories:
  - Rafael Fiuza
  - Rails
  - Query Objects
  
---

Ruby on Rails provides features that can simplify and improve our development process. That is one of the reasons why it is so popular and fun to use.
Scopes is one of those features. The problem is when what is to be the solution becomes the problem.

<!--more-->

It is very common to have a model full of logic. The term "Fat model, skinny controller" has never been so true. And the scope has its share of blame in this trend on rails. 
Make every query a scope is also common. Even if it is only called in one place.

One of the greatest tips that Bryan Helmkamp gave in the post called ["7 Patterns to refactor ActiveRecord Fat Models"](http://blog.codeclimate.com/blog/2012/10/17/7-ways-to-decompose- fat-activerecord-models /) is to extract the queries to their own query objects. However, I missed being able to use the "scopes" chain, since this technique only allows joining two queries using composition.

I had a model that was becoming huge. [Mauro George](https://twitter.com/maurogeorge) showed me this extraction method with a step further.

Imagine a model called Pokemon (although that name raise a series of assumptions). And imagine that this model was becoming complex and the scopes were not helping.

{% highlight ruby linenos %}
class Pokemon < ActiveRecord::Base
  # Validations and associations stuffs

  # Devise stuffs

  scope :with_skill, -> (skill){ joins(:pokemon_skills).where("pokemon_skills.name = ?", skill) }
  scope :is_available, -> (date){ joins(:schedules).where('schedules.day_of_week = ?', time(date).wday) }-
  scope :with_weakness, -> (weakness){ joins(:pokemon_weakness).where("pokemon_weakness.name = ?", weakness) }

  # Lot of model logic and stuffs

end
{% endhighlight %}

And I needed to do a chain scope like:

{% highlight ruby linenos %}
Pokemon.with_skill("lightning").with_weakness("water").is_available(DateTime.now)
{% endhighlight %}

There's a little unknown feature that allow to extend any ActiveRecord::Relation object with their scopes. Using that it's possible to extract the query objects and scopes in order to keep the call chain:
  
{% highlight ruby linenos %}
class PokemonQuery
  def initialize(relation = Pokemon.all)
    @relation = relation.extending(Scopes)
  end

  def search
    @relation
  end

  module Scopes
    def with_skill(skill)
      joins(:pokemon_skills).where("pokemon_skills.name = ?", skill)
    end

    def is_available(date)
      joins(:schedules).where('schedules.day_of_week = ?', time(date).wday)
    end

    def with_weakness(weakness)
      joins(pokemon_weakness).where("pokemon_weakness.name = ?", weakness)      
    end
  end

end
{% endhighlight %}

This way we extract the queries of the model and maintain the ability to chain scope, as needed:

{% highlight ruby linenos %}
PokemonQuery.new.search.with_skill("lightning").with_weakness("water").is_available(DateTime.now)
{% endhighlight %}

Or we can add methods that already chain together inside the own object, such as:

{% highlight ruby linenos %}
class PokemonQuery
  def initialize(relation = Pokemon.all)
    @relation = relation.extending(Scopes)
  end

  def search
    @relation
  end

  def like_pikachu
    search.with_skill('eletric').with_weakness('ground')
  end

  module Scopes
    def with_skill(skill)
      joins(:pokemon_skills).where("pokemon_skills.name = ?", skill)
    end

    def is_available(date)
      joins(:schedules).where('schedules.day_of_week = ?', time(date).wday)
    end

    def with_weakness(weakness)
      joins(pokemon_weakness).where("pokemon_weakness.name = ?", weakness)      
    end
  end
end

PokemonQuery.new.like_pikachu
{% endhighlight %}

That is all folks!