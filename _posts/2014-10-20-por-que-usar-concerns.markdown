---
layout: post
title: Por que usar Concerns?
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
    [title, id].join('-')
  end

  def seo_title
    title unless seo_title
  end

  def seo_category
    category unless seo_category
  end

  def seo_description
    description unless seo_description
  end
end
{% endhighlight %}

{% highlight ruby linenos %}
#app/models/event.rb
class Event < ActiveRecord::Base
  def permalink
    [title, id].join('-')
  end

  def seo_title
    title unless seo_title
  end

  def seo_category
    category unless seo_category
  end

  def seo_description
    description unless seo_description
  end
end
{% endhighlight %}

Em uma situação em que temos diversos models como esses e seja necessária uma modificação, teriamos
bastante trabalho, e além do mais demandaria muito tempo.

Escrevendo tudo isso em um concern, precisariamos escrever apenas um arquivo com o mesmo código, tendo
somente que incluir uma linha nos nossos models.

{% highlight ruby linenos %}
#app/models/concerns/seo.rb
module Seo
  extend ActiveSupport::Concern

  def permalink
    [title, id].join('-')
  end

  def seo_title
    title unless seo_title
  end

  def seo_category
    category unless seo_category
  end

  def seo_description
    description unless seo_description
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
Dessa forma, deixamos nossos models bem mais limpos, pois compartilhamos as responsabilidades que são
comuns entre eles.

Se quiser saber um pouco mais sobre Concerns, recomendo dar uma lida na [documentação](http://api.rubyonrails.org/classes/ActiveSupport/Concern.html)
