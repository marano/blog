---
layout: post
title: "construindo um cliente de reddit com emberjs"
author: Marcio Junior
comments: true
categories:
  - Ember.js
  - Javascript
  - Marcio Junior
---

Ember.js é um framework javascript MVC que atua do lado cliente. Seus criadores foram Yehuda Katz e Tom Dale,
mas atualmente recebe contribuições de diversos desenvolvedores no github. 

Iremos aprender a criar um cliente com base na api do reddit.

<!--more-->

# Pre requisitos

Para esse tutorial usaremos o [ember-cli](http://www.ember-cli.com/), que é a interface de linha de comando que
te dá todo o ferramental necessário para usar geradores, rodar o servidor, executar testes, minificar o javascript, etc.
Ember-cli é feito em [node](http://nodejs.org/) e usa o [bower](http://bower.io/) pra resolver algumas dependencias 
então será necessário ter essas duas ferramentas instaladas também.

# Instalando o ember-cli

Utilizaremos nesse tutorial a versão 0.0.40 que é a mais atual no tempo que escrevo esse post.

{% highlight bash linenos %}
npm install -g ember-cli@0.0.20
# npm noise ...
ember --version
# version: 0.0.40
# node: 0.10.26
# npm: 1.4.21
{% endhighlight %}

# Criando o projeto

Uma vez instalado o ember-cli você terá disponível na sua linha de comando o comando `ember`. Para cria uma nova
aplicação utilizaremos:

{% highlight bash linenos %}
ember new ember-reddit && cd ember-reddit
# installing
#   create several files
# Installed packages for tooling via npm.
# Installed browser packages via Bower.
# Sucessfully initialized git
{% endhighlight %}

Uma vez dentro do diretório da aplicação podemos levantar o servidor usando `ember server` ou `ember s` e visitar a url
http://localhost:4200. Se tudo ocorrer bem, você verá um título com *Welcome to Ember.js*.

# Criando a primeira rota

TODO
