---
layout: post
title: "Atualize o browser automaticamente com LiveReload"
author: Thiago Borges
categories:
  - thiago borges
  - front-end
  - rails
  - livereload
---

O fluxo do desenvolvimento front-end pode se tornar repetitivo e trabalhoso quando o sistema está sendo desenvolvido para múltiplos devices e browsers, o que é muito comum. Uma boa alternativa para melhorar este fluxo é usar o [LiveReload](http://livereload.com/) para atualizar a página no browser automaticamente assim que um arquivo de layout é salvo, como por exemplo ERB, HAML, SLIM, CSS, JavaScript ou qualquer outro tipo de arquivo que quiser configurar.
<!--more-->

Podemos usar o LiveReload através de diversas ferramentas como [Grunt](http://gruntjs.com/), [Gulp](http://gulpjs.com/), o próprio [LiveReload](http://livereload.com/), e também com o [Guard](https://github.com/guard/guard), uma gem do Ruby que verifica os arquivos, e executa uma ação caso o mesmo tenha sido modificado. O Guard é muito usado no mundo Ruby e Rails para executar os testes automaticamente com o auxílio do [guard-rspec](https://github.com/guard/guard-rspec), e é bem simples de ser adicionado ao projeto.


## Instalação e configuração

Adicione as gems `guard`, `guard-livereload` e `rack-livereload` ao grupo `development` do Gemfile.

{% highlight ruby linenos %}
group :development do
  gem 'guard'
  gem 'guard-livereload', require: false
  gem 'rack-livereload'
end
{% endhighlight %}

Após isso, execute `guard init livereload` no seu terminal para gerar Guardfile, arquivo necessário para configurar onde o Guard vai checar por alterações nos arquivos do seu projeto, como por exemplo `app/assets/....`.

Por último adicione `config.middleware.use Rack::LiveReload` ao bloco principal do seu arquivo `config/environments/development.rb`.

A maior vantagem de usar o Rack::LiveReload é que você não precisa instalar nenhum plugin no browser, que em alguns casos nem existe, como é o exemplo dos browsers para iOS. Ele injeta um JavaScript nas páginas html que envia o sinal de atualização em tempo real usando WebSockets ou Flash como fallback para navegadores mais antigos.

## Usando

Para utilizar é bem simples, basta iniciar o guard executando `guard` no terminal e iniciar o seu servidor Rails. Assim que você salvar um arquivo que interfira no seu layout, sua tela irá atualizar-se automaticamente. Quando é JavaScript ou CoffeeScript, a tela é completamente atualizada e todos os dados preenchidos serão perdidos. Já quando um arquivo CSS/Sass/LESS é atualizado, ele recarrega apenas o CSS, o que pode causar bugs em alguns casos, porém é possível modificar a configuração do LiveReload para atualizar a tela completamente quando um CSS é atualizado.

## Conclusão

Não considero o LiveReload necessário o tempo todo e nunca usei ele no meu dia a dia. Acredito que ele se encaixe melhor quando múltiplos devices precisam ser testados ao mesmo tempo.

Fiz uma pequena demonstração da tela sendo atualizada automaticamente na minha máquina de desenvolvimento e no iPad:

<iframe width="560" height="315" src="//www.youtube.com/embed/6Lafzj5OT5Q" frameborder="0" allowfullscreen></iframe>
