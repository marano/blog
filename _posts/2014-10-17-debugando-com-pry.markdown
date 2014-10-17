---
layout: post
title: "Debugando com pry"
author: Pedro Henrique
categories:
  - ruby
  - rails
  - debug
  - pry
---

As vezes procuramos uma ferramenta pra auxiliar no debug de uma aplicação,
que nem sempre é uma tarefa muito tranquila. Veja como pry pode facilitar
esse processo.
<!--more-->
**O que é pry?**

Pry é uma alternativa para o irb, que traz consigo, uma série de recursos
que nos auxiliam bastante no desenvolvimento de uma aplicação, como syntax
highlighting, suporte a plugins e acesso a documentação da linguagem.

**Instalação**

O primeiro passo, é instalarmos a gem [pry](https://github.com/pry/pry):
{% highlight bash linenos %}
  $ gem install pry
{% endhighlight %}

ou então adicionarmos ao nosso gemfile, e dar bundle install:

{% highlight ruby linenos %}
  # Gemfile
  gem 'pry'
{% endhighlight %}

{% highlight bash linenos %}
  $ bundle install
{% endhighlight %}

**Utilizando o pry**

Podemos iniar o pry de várias formas, dependendo da sua intenção com o mesmo:

se quiser iniciar uma sessão interativa no lugar do irb, por exemplo, basta
chamar o comando no terminal:

{% highlight bash linenos %}
  $ pry
{% endhighlight %}

ou então fazendo debug de algum código, e para isso, basta adicionarmos um
biding.pry na linha em que deseja fazer debug:

{% highlight ruby linenos %}
  #hello_.rb
  def say__hello(user)
    binding.pry
    puts "Hello, #{user}"
  end
{% endhighlight %}
