---
author: Mauro George
layout: post
title: "Criando páginas não tão estáticas no rails"
categories:
  - mauro george
  - rails
  - High Voltage
  - Static Content
  - Active Admin

---

Em algum momento em nosso desenvolvimento de apps em rails teremos que criar páginas estáticas. Sim, aquelas páginas de "sobre", "a equipe" etc. Temos N formas de fazer isso como falado pelo Akita [neste link aqui](www.akitaonrails.com/2011/11/11/paginas-estaticas-no-rails) e no [RailsCasts](http://railscasts.com/episodes/117-semi-static-pages). Vamos ver mais uma forma de fazer isso, só que mais poderosa, deixando o cliente cadastrar o conteúdo da página.

<!--more-->

## A missão

Criar uma página "sobre" que resida em "/sobre" e que o cliente possa facilmente alterar o seu conteúdo.

## O arsenal

Para esta brincadeira, iremos usar as seguintes ferramentas:

- [High Voltage](https://github.com/thoughtbot/high_voltage): um gerador de páginas estáticas;
- [Static Content](https://github.com/Helabs/static_content): utiliza chave e valor para gerar conteúdo estático de forma fácil;
- [Active Admin](https://github.com/gregbell/active_admin): interface administrativa para apps rails.

## Criando a página

Para criarmos a nossa página estática, utilizaremos o [High Voltage](https://github.com/thoughtbot/high_voltage) da [thoughtbot](http://www.thoughtbot.com/). Para isso, adicione no seu Gemfile:

{% highlight ruby linenos %}
gem 'high_voltage', '1.2.4'
{% endhighlight %}

em seguida rode `bundle`.

Como vemos no próprio readme do High Voltage, temos que criar uma pasta "pages" e adicionar nosso arquivo lá:

{% highlight bash linenos %}
$ mkdir app/views/pages
$ touch app/views/pages/sobre.html.haml
{% endhighlight %}

Por padrão, as páginas são acessíveis após o `/pages`. Ou seja, a nossa é acessível em `/pages/sobre`. Como vamos usar o endereço `/sobre`, temos que definir o seguinte no `config/initializers/high_voltage.rb`:

{% highlight ruby linenos %}
HighVoltage.route_drawer = HighVoltage::RouteDrawers::Root
{% endhighlight %}

Não se esqueça de definir no seu menu um link para a página "sobre". Para isso, utilize o helper `page_path`. Exemplo:

{% highlight ruby linenos %}
page_path('sobre')
{% endhighlight %}

### Testes

Não se esqueça de definir os testes para a sua nova página. Para isso, iniciaremos com o teste de rota, que reside em `spec/routing/pages_routing_spec.rb`:

{% highlight ruby linenos %}
require "spec_helper"

describe HighVoltage::PagesController do

  describe "routing" do

    it "routes to #sobre" do
      expect(get("/sobre")).to route_to("high_voltage/pages#show", id: "sobre")
    end
  end

  describe "route helpers" do

    it "page_path" do
      expect(page_path(:sobre)).to eq("/sobre")
    end
  end
end
{% endhighlight %}

Como pudemos observar, testamos a nossa rota e o helper da mesma.

Agora vamos testar o nosso controller pages, que reside em `spec/controllers/pages_controller_spec.rb`. Veja como fica nossa spec:

{% highlight ruby linenos %}
require 'spec_helper'

describe HighVoltage::PagesController do

  describe "GET 'sobre'" do

    before do
      get :show, id: :sobre
    end

    it { should respond_with(:success) }
    it { should render_template('sobre') }
    it { should render_with_layout(:application) }
  end
end
{% endhighlight %}

Como observado, foram poucos testes e estes, bem simples. Não se esqueça de instalar o [shoulda-matchers](https://github.com/thoughtbot/shoulda-matchers) se ainda não o usa. E caso queira começar um novo projeto e usar as ferramentas que usamos aqui na HE:labs, dê uma olhada na nossa gem [Pah](https://github.com/Helabs/pah) que utilizamos para começar todos nossos projetos em rails.

## Criando o conteúdo da página

Para criarmos o conteúdo de nossa página, utilizaremos o [Static Content](https://github.com/Helabs/static_content). Para isso, adicione no seu Gemfile:

{% highlight ruby linenos %}
gem 'static_content', '2.0.0'
{% endhighlight %}

Em seguida, rode `bundle`.

Após instalar a gem, temos que rodar um generator. Este, gerará o model `Content` para nós. Para isto, execute:

{% highlight bash linenos %}
$ rails g static_content:install
{% endhighlight %}

Depois de termos instalado o Static Content, iremos usá-lo em nossa view. Altere a sua view `app/views/pages/sobre.html.haml` deixando ela assim:

{% highlight haml linenos %}
%h1
  = rc :about_title, default: "Título da página de sobre"

= c :about_content, default: "Conteúdo da página de sobre"
{% endhighlight %}

Utilizamos 2 helpers diferentes: no título o `rc`, pois aqui queremos o conteúdo raw, sem conversão para HTML; e no conteúdo, o `c`, que neste caso, queremos que o conteúdo seja convertido de markdown para HTML. E perceba que em ambos os casos definimos um valor default.

## Criando a área administrativa

Instale o Active Admin adicionando no seu Gemfile:

{% highlight ruby linenos %}
gem 'activeadmin', '0.6.0'
{% endhighlight %}

Em seguida, rode `bundle`.

Após instalar a gem, rode o seguinte generator:

{% highlight bash linenos %}
$ rails generate active_admin:install
{% endhighlight %}

Rode as migrações com:

{% highlight bash linenos %}
$ rake db:migrate
{% endhighlight %}

Neste momento já é possível acessar o admin. Visualize "/admin" com os seguintes dados:

- User: admin@example.com
- Password: password

Como pode-se notar, ainda não temos o nosso model Content.

Ps: Caso tenha algum problema na instalação do Active Admin, veja a sua [documentação com mais detalhes aqui](http://activeadmin.info/documentation.html).

### Adicionando o content ao Active Admin

Para criarmos nosso model `Content` no Active Admin, utilizaremos o seguinte gerador:

{% highlight bash linenos %}
$ rails generate active_admin:resource Content
{% endhighlight %}

Com isso, ele cria um arquivo em `app/admin/contents.rb`.

Como o Static Content utiliza chave e valor, não é legal mostrar para nosso cliente o nome da chave em inglês. Podemos traduzir as chaves do Static Content que são exibidas no nosso index no active admin. Para isso, altere `app/admin/contents.rb` deixando-o assim:

{% highlight ruby linenos %}
ActiveAdmin.register Content do

  index do
    column :slug do |c|
      t(c.slug, scope: 'static_content.slugs')
    end
    column :text
    column :updated_at

    default_actions
  end
end
{% endhighlight %}

E por último, criamos as nossas traduções das chaves do Static Content em `config/locales/static_content.pt-BR.yml`, ficando assim:

{% highlight yaml linenos %}
pt-BR:
  static_content:
    slugs:
      about_title: Título de sobre
      about_content: Conteúdo de sobre
{% endhighlight %}

## Conclusão

Agora nosso cliente pode alterar o texto de sua página estática usando todo o poder do Markdown. E estas páginas são facilmente estendidas.

E você, como resolve este problema de página estática? Fala aí ;)
