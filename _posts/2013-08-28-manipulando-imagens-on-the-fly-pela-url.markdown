---
published: true
author: Matheus Bras
layout: post
title: "Manipulando imagens on-the-fly pela URL"
comments: true
categories:
  - Matheus Bras
  - Dragonfly
  - Upload de imagens

---

Digamos que você possui uma API e precisa que algumas imagens sejam cropadas, ou redimencionadas, de vários tamanhos *on-the-fly* pela URL. Por exemplo: **/image/1/w/300/h/400** Retornaria uma imagem que você já salvou redimencionada para 300x400. É possível fazer mais do que redimencionar a imagem, mas vamos nos focar somente nisso por enquanto.

<!--more-->

Para essa funcionalidade, usaremos a gem [Dragonfly][1] para lidar com o upload e processamento das imagens. A instalação é bem fácil e rápida. Com [poucos passos][2] já estaremos preparados.

## Fazendo o Setup do Dragonfly:

**Adicione estas gems no seu Gemfile:**

{% highlight ruby linenos %}
  gem 'rack-cache', :require => 'rack/cache'
  gem 'dragonfly', '~>0.9.15'
{% endhighlight %}

Você vai precisar do *rack-cache* para manter um cache da imagem gerada pela nossa url. Isso vai melhorar a performance da sua app.

**Agora crie um initializer (dragonfly.rb):**

{% highlight ruby linenos %}
  require 'dragonfly'
  app = Dragonfly[:images]
  app.configure_with(:imagemagick)
  app.configure_with(:rails)
{% endhighlight %}

Digamos que exista um model *Photo* e vamos salvar nossas imagens no campo para *image*.

{% highlight ruby linenos %}
  add_column :photos, :image_uid,  :string
{% endhighlight %}

No nosso model definimos:

{% highlight ruby linenos %}
class Photo < ActiveRecord::Base
    image_accessor :image
    #…
end
{% endhighlight %}

No nossa view o formulário ficará desta forma:

{% highlight erb linenos %}
<% form_for @photo, :html => {:multipart => true} do |f| %>
    ...
    <%= f.file_field :image %>
    ...
<% end %>
{% endhighlight %}

Então nos finalmentes, definimos no nosso *routes.rb*:

{% highlight ruby linenos %}
match '/blog/images/:uid/w/:width/h/:height' => Dragonfly[:images].endpoint { |params, app|
    app.fetch(params[:uid]).process(:thumb, "#{params[:width}x#{params[:height}")
}
{% endhighlight %}

E agora, quando acessarmos */blog/images/12345/w/400/h/400*, geraremos uma versão 400x400 da imagem que nós salvamos anteriormente. Você pode facilmente adicionar mais parâmetros e manipular a imagem como precisar (adicionar marcas d'água, cropar e qualquer outro processamento possível através do [imagemagick][3]).

[1]: https://github.com/markevans/dragonfly
[2]: https://github.com/markevans/dragonfly#for-the-lazy-rails-user
[3]: http://www.imagemagick.org/script/index.php

