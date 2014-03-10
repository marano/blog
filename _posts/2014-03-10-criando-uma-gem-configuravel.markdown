---
published: true
author: Francisco Martins
layout: post
title: "Criando uma gem configurável"
date: 2014-03-10 12:00
comments: true
categories:
  - ruby
  - gem
---

Há alguns meses eu vi que a Riot estava trabalhando numa [API][api] para o League Of Legends, e resolvi criar uma [gem][riot_client] que serviria de interface para essa API, a título de prática.

Eu acabei desanimando em continuar quando vi que a API BR estava um pouco atrás da internacional e encontrei um bug (que não foi corrigido até hoje), mas independente disso, a experiência ficou e eu prometi fazer um post a respeito.

<!--more-->

### Criando uma gem

A criação de uma gem é bastante simples e o processo está bem documentado [aqui][guides].

Uma dica que falta neste guia é que você pode usar o bundler para criar o esqueleto da gem, o que facilita um pouco.

{% highlight ruby linenos %}
  $ bundle gem minha_gem
{% endhighlight %}

### Adicionando suporte à configurações

Você já deve ter percebido que algumas gems possuem uma opção de configuração, como:

{% highlight ruby linenos %}
RSpec.configure do |config|
  config.fixture_path = "#{::Rails.root}/spec/fixtures"
end

Devise.setup do |config|
  config.mailer_sender = "please-change-me-at-config-initializers-devise@example.com"
end

Rollbar.configure do |config|
  config.access_token = ENV['ROLLBAR_ACCESS_TOKEN']
end

ActiveSupport.on_load(:active_model_serializers) do
  ActiveModel::Serializer.root = false
end
{% endhighlight %}

Tornar sua gem configurável permite que ela seja usada em diferentes projetos de forma customizada e é bastante simples. No caso da RiotClient, cada projeto que a utilizasse precisaria ter sua própria ApiKey e seria muito mais elegante fazer dessa forma do que passar como parametro cada vez que a classe fosse instanciada.

O primeiro passo é criar uma classe que vai representar os dados de cofiguração:

{% highlight ruby linenos %}
  module MinhaGem
    class Configuration
      attr_accessor :value1, :value2
    end
  end
{% endhighlight %}

E usar isso no arquivo lib/minha_gem.rb:

{% highlight ruby linenos %}
  module MinhaGem
    class << self
      attr_accessor :configuration

      def configure
        self.configuration ||= Configuration.new
        yield(configuration)
      end
    end
  end
{% endhighlight %}

Dica:

{% highlight ruby linenos %}
  class << self
    def configure
    end
  end
{% endhighlight %}

é o mesmo que

{% highlight ruby linenos %}
  def self.configure
  end
{% endhighlight %}

É valido se você for adicionar vários métodos de classe.

Agora, para usar esse bloco de configuração, por exemplo no Rails, é só criar um arquivo na pasta /config/initializers/minha_gem.rb com o conteúdo:

{% highlight ruby linenos %}
  MinhaGem.configure do |config|
    config.value1 = "foo"
    config.value2 = "bar"
  end
{% endhighlight %}

Se precisar acessar esses valores por algum motivo em algum lugar da aplicação, é simples:

{% highlight ruby linenos %}
  $ MinhaGem.configuration.value1
  => "foo"
  $ MinhaGem.configuration.value2
  => "bar"
{% endhighlight %}

Gostou da dica?

[api]: https://developer.riotgames.com/
[riot_client]: https://github.com/franciscomxs/riot_client
[guides]: http://guides.rubygems.org/make-your-own-gem/
[bundler]: http://bundler.io/rubygems.html
