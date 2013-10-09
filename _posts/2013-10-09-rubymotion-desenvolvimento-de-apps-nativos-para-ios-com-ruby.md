---
published: true
author: Francisco Martins
layout: post
title: "Rubymotion - Desenvolvimento de apps nativos para iOS com Ruby"
date_pt_BR: 09 Oct 2013
comments: true
categories:
  - Francisco Martins
  - Rubymotion
  - iOS
  - Mobile
  
---

Há quase dois anos, comecei a me interessar pelo desenvolvimento de aplicativos mobile. Na época, comecei com Android, mas graças à influência de alguém que considero um mentor, acabei despertando o interesse pelo desenvolvimento para iOS e me focando nisso.
<!--more-->

No início, minha maior dificuldade era me adaptar ao Objective-c, mas depois de alguns meses, consegui superar essa dificuldade e me familiarizei com a plataforma. No fim, a linguagem já não era mais um problema, mas eu ainda não era tão produtivo quanto gostaria, principalmente em situações atípicas.

Pouco antes de optar por focar em apps nativos, pesquisei sobre alternativas, como Phonegap, Sencha Touch e vi até o Delphi para iOS graças a alguns colegas de trabalho que estavam interessados em começar também. A princípio, eu era radicalmente contra esse tipo de abordagem. Para mim, não fazia sentido sacrificar o conforto que o usuário teria ao usar um app notoriamente mais performático só para facilitar a vida do desenvolvedor. Quer desenvolver para Android? Aprenda java. Para iOS? Objective-c. Simples assim.

Hoje eu não tenho mais uma opinião tão radical. Até fiz experimentos com Phonegap depois de assistir um Café com Dev com o Diego Dukão ([veja o post sobre](http://helabs.com.br/blog/2013/07/12/retrospectiva-cafe-com-dev-28-de-junho/)). Webapps são notoriamente menos performáticos, mas também são bem mais baratos porque são mais fáceis de se fazer e consomem menos tempo. Então, penso que há casos em que podem ser uma alternativa válida.

Há alguns meses, ouvi falar do RubyMotion e mês passado, na Rubyconf, conheci o [Laurent Sansonetti][0] - ex funcionário da Apple e criador do framework. Fiquei surpreso com o poder da ferramenta. Ela não só torna possível desenvolver apps nativos para iOS com Ruby, como também fornece uma série de facilidades para o desenvolvedor, como por exemplo o BubbleWrap - coleção de helpers e wrappers que abstraem o Cocoa Touch e AppKit com a proposta de deixar as coisas mais "ruby-like". Em teoria, pelo menos, parece unir o melhor dos dois mundos: a performance do app nativo com a produtividade do Ruby. Yay!

Comprei a licença (199 dólares) e comecei a fazer experimentos. Tem valido a pena.

O trabalho com Rubymotion é baseado no terminal, então, pra quem já usa Rails, é bem tranquilo. Para criar um projeto, por exemplo:

{% highlight bash linenos %}
$ motion create projeto
{% endhighlight %}

E para executar no simulador:

{% highlight bash linenos %}
$ rake
{% endhighlight %}

Se quiser rodar direto no dispositivo (necessário ter uma licença ios developer):

{% highlight bash linenos %}
$ rake device
{% endhighlight %}

O código gerado é o mais simples possível. De importante temos um AppDelegate limpo, um Gemfile (é possível criar gems pro iOS e já têm umas bem legais) e um Rakefile onde você vai colocar algumas configurações do aplicativo. Temos também um arquivo exemplo de testes e uma ferramenta de BDD embutida.

O terminal interativo é bem legal. É quase ao "rails console", com a diferença de que tudo feito nele afeta o app no simulador. Vamos fazer um "Hello World" via terminal pra mostrar como funciona. Nele, abra o projeto recém criado e execute:

{% highlight bash linenos %}
$ rake
{% endhighlight %}

O simulador do iOS vai abrir com uma tela preta.

![image](/blog/images/posts/2013-10-01/01.png)

Volte ao terminal e execute:

{% highlight bash linenos %}
$ alert = UIAlertView.alloc.init
$ alert.message = "Hello World"
$ alert.addButtonWithTitle "Ok"
$ alert.show
{% endhighlight %}

E um alerta é exibido. :)

![image](/blog/images/posts/2013-10-01/02.png)

Agora, para o mesmo exemplo usando o BubbleWrap, adicione a gem "bubble-wrap" no gem file e execute o "bundle install".

{% highlight ruby linenos %}
gem 'bubble-wrap'
{% endhighlight %}

Depois, no rakefile adicione:

{% highlight ruby linenos %}
require 'bubble-wrap/core'
{% endhighlight %}

Agora execute o projeto:

{% highlight bash linenos %}
$ rake
{% endhighlight %}

E no terminal, execute:

{% highlight bash linenos %}
$ App.alert "Hello World II"
{% endhighlight %}

![image](/blog/images/posts/2013-10-01/03.png)

Fácil, não? Achei bem maneiro alterar o app no terminal interativo sem precisar compilar de novo.

Estou trabalhando em um projeto pessoal com Rubymotion e nos próximos dias pretendo contar mais sobre a experiência e mostrar alguns exemplos.

Outra coisa bacana é que o RubyMotion possibilitou a crição de gems como a [ProMotion][1], que tem uma sintaxe bem mais legal - dica do [Pedro Nascimento][2]. Meu desafio seguinte será experimentar essa gem ou similar para formar minha opinião a respeito.

E aí, já conhecia o RubyMotion?

[0]: https://twitter.com/lrz
[1]: https://github.com/clearsightstudio/ProMotion
[2]: https://twitter.com/lunks