---
layout: post
title: Porque usar Concerns?
author: Pedro Henrique
categories:
  - Rails
  - Concerns
---

Com a chegada do rails 4, tivemos o incremento de diversas features no framework,
e em uma dessas features, temos os Concerns, que podem ajudar a deixar seu código mais limpo.
<!--more-->
Provavelmente você já deve ter tido ou tem em sua aplicação, um monte de código se repetindo nos
seus models e controllers e se perguntou o que poderia fazer pra deixar esse código menos repetitivo,
e é aí que entram os concerns.

Como podemos observar, os dois models possuem código repetido, e que por sua vez, apresentam o mesmo comportamento:

{% highlight ruby linenos %}
#app/models/post.rb
class Post < ActiveRecord::Base
  def permalink
    [self.title, self.id].join('-')
  end

  def seo_title
    self.title unless self.seo_title
  end

  def seo_category
    self.category unless self.seo_category
  end

  def seo_description
    self.description unless self.seo_description
  end
end
{% endhighlight %}

{% highlight ruby linenos %}
#app/models/event.rb
class Event < ActiveRecord::Base
  def permalink
    [self.title, self.id].join('-')
  end

  def seo_title
    self.title unless self.seo_title
  end

  def seo_category
    self.category unless self.seo_category
  end

  def seo_description
    self.description unless self.seo_description
  end
end
{% endhighlight %}

Em uma situação em que temos diversos models como esses e seja necessária uma modificação, teriamos
bastante trabalho, e além do mais demandaria muito tempo.

Escrevendo tudo isso em um concern, precisariamos escrever apenas um arquivo com o mesmo código, tendo
somente que incluir uma linha nos nossos models.

{% highlight ruby linenos %}
#app/models/concerns/seo/post.rb
module Seo
  extend ActiveSupport::Concern

  def permalink
    [self.title, self.id].join('-')
  end

  def seo_title
    self.title unless self.seo_title
  end

  def seo_category
    self.category unless self.seo_category
  end

  def seo_description
    self.description unless self.seo_description
  end
end
{% endhighlight %}

{% highlight ruby linenos %}
#app/models/post.rb
class Post < ActiveRecord::Base
  include Seo
end
{% endhighlight %}

{% highlight ruby linenos %}
#app/models/event.rb
class Event < ActiveRecord::Base
  include Seo
end
{% endhighlight %}

