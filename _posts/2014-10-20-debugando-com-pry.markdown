---
layout: post
title: "Debugando com pry"
author: Pedro Henrique
hide_author_link: true
categories:
  - ruby
  - rails
  - debug
  - pry
---

As vezes procuramos uma ferramenta pra auxiliar no debug de uma aplicação, que nem sempre é uma tarefa muito tranquila. Veja como Pry pode facilitar esse processo.
<!--more-->
**O que é pry?**

Pry é um [REPL](http://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop) que serve como alternativa para o irb, que traz consigo, uma série de recursos
que nos auxiliam bastante no desenvolvimento de uma aplicação, como syntax highlighting, suporte a plugins e acesso a documentação da linguagem.

**Instalação**

O primeiro passo, é instalarmos a gem [Pry](https://github.com/pry/pry):
{% highlight bash linenos %}
  $ gem install pry -v '0.10.1'
{% endhighlight %}

ou então adicionarmos ao nosso gemfile, e dar bundle install:

{% highlight ruby linenos %}
  # Gemfile
  gem 'pry', '0.10.1'
{% endhighlight %}

{% highlight bash linenos %}
  $ bundle install
{% endhighlight %}

**Utilizando o pry**

Podemos inciar o Pry de várias formas, dependendo da sua intenção com o mesmo:

Se quiser iniciar uma sessão interativa no lugar do irb, por exemplo, basta chamar o comando no terminal:

{% highlight bash linenos %}
  $ pry
{% endhighlight %}

Ou então fazendo debug de algum código, e para isso, basta adicionarmos um binding.pry na linha em que deseja fazer debug:

{% highlight ruby linenos %}
  #hello_.rb
  def say__hello(user)
    binding.pry
    puts "Hello, #{user}"
  end
 {% endhighlight %}

 A execução do método irá parar onde foi adicionado o binding.pry, e então chama o Pry, permitindo a utilização de todas as suas ferramentas.

 Se quiser conhecer mais sobre essa maravilhosa gem, basta dar uma olhada na [documentação](https://github.com/pry/pry/wiki)

