---
published: true
author: Rafael Fiuza
layout: post
title: "Simplificando com Query Objects"
date: 2014-01-28 15:00
comments: true
categories:
  - rafael fiuza
  - rails
  - query objects
  
---

Um dos grandes motivos do RubyOnRails ter esse alcance que tem hoje é a quantidade de funcionalidades que ficaram essenciais por diminuirem, melhorarem ou tornarem divertidos o processo de desenvolvimento.
**Scopes**, do *ActiveRecord*, é uma dessas funcionalidades. O problema surge quando o que é para ser solução, torna-se problema.

<!--more-->

Atualmente, é muito comum termos models cheios de lógica. A expressão *"Fat model, skinny controller"* nunca foi tão seguida. E o scope tem a sua parcela de culpa nessa tendência no rails.
Em geral, quando temos uma query é comum torná-la um scope, mesmo que ela só seja chamada em um lugar.

Uma das ótimas dicas que o Bryan Helmkamp deu no post chamado ["7 Patterns to Refactor Fat ActiveRecord Models"](http://blog.codeclimate.com/blog/2012/10/17/7-ways-to-decompose-fat-activerecord-models/) é extrair as *queries* para suas próprias **query objects**. No entanto, sentia falta de poder usar as "scopes" em cadeia, já que essa técnica só permite juntar duas queries através de composição.

Eu estava com um model que estava se tornando um problema quando veio um amigo, [@maurogeorge](https://twitter.com/maurogeorge), e me mostrou essa forma de extração com um passo a mais.

Imagine um model chamado Pokemon (apesar de esse nome levantar uma série de suposições) e que esse model estava tornando-se complexo e os scopes não estavam ajudando.

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

E eu precisava fazer a query em cadeia:

{% highlight ruby linenos %}
Pokemon.with_skill("lightning").with_weakness("water").is_available(DateTime.now)
{% endhighlight %}

Uma das funcionalidades que não é muito divulgada é a possibilidade de extender qualquer objeto ActiveRecord::Relation com suas scopes. Dessa forma, é possível extrair os *scopes* para **query objects** e manter a chamada em cadeia:

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

Assim, extraímos as **queries do model** e mantivemos a possibilidade de chamar em cadeia, como precisava:

{% highlight ruby linenos %}
PokemonQuery.new.search.with_skill("lightning").with_weakness("water").is_available(DateTime.now)
{% endhighlight %}

Ou podemos adicionar métodos que já encadeiam dentro do próprio objeto, como:

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


Thats all, folks!