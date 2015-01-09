---
layout: post
title: "Mastering Sass - Mixin vs Extend"
author: Thiago Gonzalez
hide_author_link: true
categories:
  - sass
  - css
  - front-end
  - mixin
  - extend
---

Essa é a primeira parte de uma série de posts sobre Sass e como tirar o máximo proveito dele. Vamos começar esta série buscando entender o que é e como utilizar [Mixins](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#mixins) e [Extends](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#extend), suas diferenças e as melhores situações para aplicar cada um.
<!--more-->

Sass é um pré-processador de CSS que possui diversas funções que ajudam a reutilizar seu código e a escrevê-lo de forma organizada, mas muitas pessoas não utilizam nem 10% de todos recursos disponíveis.

## Mixin
Quando você utiliza Mixins, seu código é repetido toda vez que o mixin é chamado. É uma boa prática para quem quer utilizar parâmetros que mudam conforme suas chamadas, por exemplo:

{% highlight sass linenos %}
@mixin container-style($value: 10px, $background: #fff) {
  & {
    background: $background;
    padding: $value;
  }
}

.one { @include container-style($value: 20px, $background: #000) }
.two { @include container-style }
{% endhighlight %}

Veja como é o output deste código, depois de gerado:

{% highlight sass linenos %}
.one {
  background: #000;
  padding: 20px;
}

.two {
  background: #fff;
  padding: 10px;
}
{% endhighlight %}

O código é gerado de acordo com os parâmetros que foram passados no Mixin, então, como os valores que vão ser gerados não são sempre os mesmos, a utilização de Mixin é recomendada.
Podemos utilizar Mixins sem parâmetros também, mas o código será repetido, exatamente como ele é, em todo local que ele for chamado. Veja:

{% highlight sass linenos %}
@mixin container-style {
  & {
    background: #fff;
    padding: 10px;
  }
}

.one { @include container-style }
.two { @include container-style }
{% endhighlight %}

Veja como é o output deste código, depois de gerado:

{% highlight sass linenos %}
.one {
  background: #fff;
  padding: 10px;
}

.two {
  background: #fff;
  padding: 10px;
}
{% endhighlight %}

Não existem contra indicações para se usar Mixins. Você pode utilizar dentro ou fora de media queries, declarando fora e chamando dentro, ou vice-versa.


## Extend
Quando você utiliza Extend, seu código não é repetido, ele é declarado onde você solicitar, reutilizando as regras escritas. Veja o mesmo exemplo dado no Mixin, mas utilizando Extend:

{% highlight sass linenos %}
%container-style {
  & {
    background: #fff;
    padding: 10px;
  }
}

.one { @extend %container-style }
.two { @extend %container-style }
{% endhighlight %}

Veja como é o output deste código, depois de gerado:

{% highlight sass linenos %}
.one, .two {
  background: #fff;
  padding: 10px;
}
{% endhighlight %}

Veja uma outra forma de se utilizar Extend:

{% highlight sass linenos %}
.container {
  background: #fff;
  padding: 10px;

  h3 { font-size: 2em } 
}

.one { @extend .container }
.two { @extend .container }
{% endhighlight %}

Veja como é o output deste código, depois de gerado:

{% highlight sass linenos %}
.container, .one, .two {
  background: #fff;
  padding: 10px;
}

.container h3, .one h3, .two h3 { font-size: 2em }
{% endhighlight %}

Como você pode ver, existe um padrão de estilo dentro de `.container`, onde `.one` e `.two` também utilizam.
Um lado negativo na utilização do Extend é que não podemos estender um estilo que esteja fora da media query para alguém dentro dela, ou vice-versa.

Como você utiliza seus Extends e Mixins? Qual você prefere? Utiliza os dois ou "viciou" apenas em um?
Deixe seu comentário :)
