---
layout: post
title: "Dicas de front-end para um novato no Rails"
author: Mauro George
categories:
  - mauro george
  - rails
  - front-end
---

Então você é acostumado a produzir HTML e entra para um time que usa Rails e uma engine de templates #comofaz? Fica comigo que vou te dar as dicas para sobreviver a este mundo.
<!--more-->

## Slim

O [slim](http://slim-lang.com/) é uma engine de templates, como você já está acostumado a escrever HTML não terá dificuldades aqui. Basicamente apenas temos que apenas "abrir" a tag e identar o nosso conteúdo dentro dela.

{% highlight html linenos %}
<div class="content">
  <h1>Fila de Análise</h1>
</div>
{% endhighlight %}

Para gerarmos um HTML como o exibido acima, no slim fazemos assim:

{% highlight slim linenos %}
.content
  h1 Fila de Análise
{% endhighlight %}

Para maiores informações sobre o slim de uma olhada em sua [documentação](http://rdoc.info/gems/slim/frames).

## Geração de links

Agora que está acostumado com o slim, talvez você queira criar um link para a sua aplicação com algo como:

{% highlight slim linenos %}
a href='/' Home
{% endhighlight %}

Ele funciona e nos da o HTML experado a seguir.

{% highlight html linenos %}
<a href="/">Home</a>
{% endhighlight %}

No entanto o ideal é utilizarmos do helper `link_to` que o rails nos fornece.

{% highlight erb linenos %}
= link_to 'Home', '/'
{% endhighlight %}

Mas não é uma boa prática criarmos os links na "mão", pois temos helpers do rails para isso. Para descobrimos nossas rotas utilizamos do seguinte comando.

{% highlight bash linenos %}
$ rake routes
{% endhighlight %}

Que nos gera todas as nossas rotas.

{% highlight text linenos %}
-----------------------------------------------------------------------------------------
        Prefix Verb  URI Pattern                                       Controller#Action
          root GET   /                                                 customers#new
     customers GET   /customers(.:format)                              customers#index
               POST  /customers(.:format)                              customers#create
 edit_customer GET   /customers/:id/edit(.:format)                     customers#edit
      customer PATCH /customers/:id(.:format)                          customers#update
               PUT   /customers/:id(.:format)                          customers#update
{% endhighlight %}

Ou se preferir ainda pode acessar uma url qualquer que não exista como `http://localhost:3000/wrong` que será exibido no seu browser a mesma informação.

Olhando na lista vemos que o helper para gerar a rota para `/` é o `root` então vamos alterar nosso link.

{% highlight erb linenos %}
= link_to 'Home', root_path
{% endhighlight %}

Perceba que adicionamos o sufixo `_path` isto é necessário para o helper funcionar, neste caso ele gerará apenas `/`. Em um [email](http://helabs.com.br/blog/2014/09/12/assets-on-mailers/) por exemplo não podemos mandar um link para `/` apenas temos que ter o dominio todo no link, temos que ter a url. Para este caso adicionamos o sufixo `_url`.

{% highlight erb linenos %}
= link_to 'Home', root_url
{% endhighlight %}

> Humm... legal. Mas eu to nesta página aqui e não sei qual o helper dela, sei a url olhando no browser, como que eu faço um link para ela?

Neste caso abra o seu log, e procure por algo como isto:

{% highlight erb linenos %}
  Started GET "/" for 127.0.0.1 at 2014-11-28 14:33:43 -0200
    ActiveRecord::SchemaMigration Load (0.7ms)  SELECT "schema_migrations".* FROM "schema_migrations"
    Processing by CustomersController#new as HTML
{% endhighlight %}

Observe que no começo temos `GET "/"` ou seja o endereço acessado, e no final `Processing by CustomersController#new as HTML` podemos interpretar isto como `customers#new` e assim o achamos na nossa lista com as rotas que este é o `root`.

É comum termos que adicionar atributos a nossos links como por exemplo uma classe, para isto simplesmente fazemos assim.

{% highlight erb linenos %}
= link_to 'Home', root_url, class: 'logo'
{% endhighlight %}

Podemos adiconar id, data-attributes etc, para mais informações fique com a documentação do [link_to](http://api.rubyonrails.org/classes/ActionView/Helpers/UrlHelper.html#method-i-link_to).

Outro caso que é comum nos depararmos é quando precisamos definir  um link em que precisa englobar outros elementos. Para este caso utilizamos de um bloco.

{% highlight erb linenos %}
= link_to root_path, class: 'logo' do
  | Rock
  span &
  | Roll
{% endhighlight %}

## Imagem

Todas as nossas imagens ficam em `app/assets/images/`. Para gerar uma tag de imagem como esta.

{% highlight html linenos %}
<img alt="Logo" src="/assets/logo.png" />
{% endhighlight %}

Utilizamos do helper `image_tag` do rails.

{% highlight erb linenos %}
= image_tag 'logo.png'
{% endhighlight %}

Perceba que passamos apenas o nome da imagem, sem a necessidade de passar um caminho completo.

Podemos adicionar classes e outros atributos também como fizemos com o link.

{% highlight erb linenos %}
= image_tag 'logo.png', class: 'logo'
{% endhighlight %}

Para mais detalhes sobre o `image_tag` fique com a [documentação](http://api.rubyonrails.org/classes/ActionView/Helpers/AssetTagHelper.html#method-i-image_tag).

### No SCSS

É comum termos que referenciar nossas imagens no SCSS. Como por exemplo para definir um background.

{% highlight sass linenos %}
.logo {
  background: image-url('logo.png');
  width: 200px;
  height: 80px;
}
{% endhighlight %}

Perceba que utilizando o `image-url` não precisamos definir o caminho completo da imagem. Para mais detalhes a [documentação](http://guides.rubyonrails.org/asset_pipeline.html#coding-links-to-assets).

## Formulários

Não adianta criarmos um formulário usando apenas o slim se ele não tiver os valores definidos corretos para trabalhar com o rails. Então a forma correta de criarmos um formulário é utilizando do `form_for`.

{% highlight erb linenos %}
= form_for @customer do |f|
  = f.label :name
  = f.text_field :name
  = f.label :phone
  = f.text_field :phone
  = f.label :cellphone
  = f.text_field :cellphone
  = f.submit
{% endhighlight %}

Utilizamos do `f.label` para definir o label e do `f.text_field` para definirmos um input de texto e finalizamos com o botão de submit. Mais informações na [documentação](http://guides.rubyonrails.org/form_helpers.html).

### Simple Form

Em projetos que é utilizado do Simple Form, não precisamos definir label e input separados definimos ambos ao mesmo tempo utilizando apenas `f.input` e passamos o nome do atributo.

{% highlight erb linenos %}
= simple_form_for @customer do |f|
  = f.error_notification
  = f.input :name
  = f.input :phone
  = f.input :cellphone
  = f.button :submit
{% endhighlight %}

Com o Simple Form é legal definirmos também o `f.error_notification` em que é exibida uma mensagem padrão para a verificação dos erros. Mais informações na [documentação](https://github.com/plataformatec/simple_form).

> Tá! Mas como que eu sei o nome que o desenvolvedor criou no banco de dados.

Para isto abra o arquivo `db/schema.rb` e procure pela tabela correspondente, no caso de `@customer` a tabela `customers` lá terá listado todos os campos que tal tabela possui e você poderá utilizar no seu formulário.

## Internacionalização

Nosso formulário foi criado anteriormente, no entanto todos os campos estão em inglês, do modo que foram criados no banco de dados, vamos ver agora como traduzir para melhorar a experiência dos nossos usuários.

### Formulários

Para criarmos a tradução dos nossos campos abrimos o arquivo `config/locales/app.pt-BR.yml`(utilizamos o `app.pt-BR.yml` e deixamos o `pt-BR.yml` sem alteração para ser fácil de se atualizar) e adicionamos o modelo, no nosso caso `customer` e seus atributos.

{% highlight yaml linenos %}
pt-BR:
  models_and_attributes: &models_and_attributes
    attributes:
      customer:
        name: Nome
        phone: Telefone
        cellphone: Celular
{% endhighlight %}

Para traduzirmos os inputs de submit ainda no `config/locales/app.pt-BR.yml` criamos uma sessão de helpers e adicionamos lá a nossa tradução.

{% highlight yaml linenos %}
pt-BR:
  helpers:
    submit:
      customer:
        create: 'Criar cliente'
        update: 'Atualizar cliente'
{% endhighlight %}

Mais informações sobre internacionalização na [documentação](http://guides.rubyonrails.org/i18n.html#translations-for-active-record-models).
O Simple Form possui diversas opções de Internacionalização como labels, hints e placeholders veja mais na [documentação](https://github.com/plataformatec/simple_form#i18n).

### Data e tempo

Na nossa aplicação está sendo exibida a data de criação do cliente.

{% highlight erb linenos %}
= customer.created_at
{% endhighlight %}

No entanto o valor é exibido como `2014-11-27 17:11:10 -0200`, e no nosso layout gostariamos de exibir apenas o dia/mês/ano.

Se obervarmos no nosso `config/locales/pt-BR.yml` temos a definição dos formatos de `time`.

{% highlight yaml linenos %}
  time:
    formats:
      default: ! '%a, %d de %B de %Y, %H:%M:%S %z'
      long: ! '%d de %B de %Y, %H:%M'
      short: ! '%d de %B, %H:%M'
      simple: ! '%d/%m/%Y'
{% endhighlight %}

E olhando ao formato `simple`, ele parece atender a nossa necessidade. Para aplicar o formato simplesmente utilizamos do helper `l` e definir o formato que iremos usar.

{% highlight erb linenos %}
= l(customer.created_at, format: :simple)
{% endhighlight %}

Assim resolvemos o nosso problema e exibimos a data formatada como dia/mês/ano.

Em outra área do nosso app temos que exibir apenas o ano. E olhando para o nosso arquivo de tradução, nenhum formato exibe apenas o ano. Então vamos criar este novo formato. Para isto no arquivo `config/locales/app.pt-BR.yml`  criamos a sessão time e adicionamos o novo formato.

{% highlight yaml linenos %}
pt-BR:
  time:
    formats:
      only_year: ! '%Y'
{% endhighlight %}

Lembrando que nunca inserimos nada no `config/locales/pt-BR.yml`, utilizamos sempre o `app.pt-BR.yml`.

Para exibir uma data no nosso novo formato simplesmente trocamos o valor de `format` no helper `l`.

{% highlight erb linenos %}
= l(customer.created_at, format: :only_year)
{% endhighlight %}

O campo `created_at` por padrão é um `datetime` se estivermos lidando com um campo `date` trocamos a chave `time` para `date` no nosso arquivo de tradução.

Mais informações na [documentação](http://guides.rubyonrails.org/i18n.html#adding-date-time-formats).

## Partials

Dando uma olhada no layout da nossa aplicação vemos que ele está bastante grande, seria legal se podessemos separar ele em arquivos menores.

{% highlight slim linenos %}
#wrapper
  header
    // Conteúdo do header
  = yield
{% endhighlight %}

Para começar vamos extrar o `header` para uma partial. Para isso criamos nossa partial em `app/views/application/_header.html.slim`

{% highlight slim linenos %}
header
  // Conteudo do header
{% endhighlight %}

Agora que movemos nosso header para um partial vamos renderizar esta partial no layout novamente. Para isso simplesmente chamamos `render` e o nome de nossa partial.

{% highlight slim linenos %}
#wrapper
  = render 'header'
  = yield
{% endhighlight %}

O diretório `app/views/application/` é ideal para partial que possam ser utilizadas em diversas views, como um widget de comentário.


Espero que com estas dicas ter lhe ajudado a entrar um pouco no mundo do front-end em aplicações Rails.
