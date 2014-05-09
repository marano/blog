---
layout: post
title: "Como criar um sprite responsivo"
author: Thiago Gonzalez
comments: true
categories:
  - front-end
  - css
  - sass
  - html
  - responsive design
  - sprite
---
Sprite é o conceito de unir várias imagens que servem uma aplicação numa mesma imagem, evitando inúmeras requisições e diminuindo o tempo de carregamento de sua página. Mas como fazer isso quando estas imagens devem ser responsivas?

<!--more-->
Vamos imaginar o seguinte exemplo: uma lista de escudos de times. Temos 5 escudos de 64x64 e gostaríamos de uní-los para criar um sprite. Se formos pensar apenas na criação deste sprite, utilizando o tamanho original das imagens, teríamos algo como:

## Sprite gerado com os 5 escudos:
![Escudos](https://www.evernote.com/shard/s218/sh/b265dcfd-26cf-4e5d-ac9a-be3f88088dda/ed446d33b20e4e4267172574dfe53ad3/deep/0/crests.png)

## HTML:
{% highlight ruby linenos %}
<ul id="crests">
  <li class="crest team-a"><a href="#">Team A</a></li>
  <li class="crest team-b"><a href="#">Team B</a></li>
  <li class="crest team-c"><a href="#">Team C</a></li>
  <li class="crest team-d"><a href="#">Team D</a></li>
  <li class="crest team-e"><a href="#">Team E</a></li>
</ul>
{% endhighlight %}

## CSS:
{% highlight sass linenos %}
* {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

#crests {
  $crest-size: 64px; // Tamanho dos escudos

  .crest {
    float: left;
    margin-right: 10px;

    a {
      background-image: url('crests.png');
      background-repeat: no-repeat;
      display: block;
      height: $crest-size;
      text-indent: -9999em;
      width: $crest-size;
    }

    &.team-a a { background-position: ($crest-size * 0) 0 }
    &.team-b a { background-position: ($crest-size * -1) 0 }
    &.team-c a { background-position: ($crest-size * -2) 0 }
    &.team-d a { background-position: ($crest-size * -3) 0 }
    &.team-e a { background-position: ($crest-size * -4) 0 }
  }
}
{% endhighlight %}

Veja este exemplo [neste link](http://jsfiddle.net/LDL39/).

Apenas isso funcionaria bem para o básico, ou seja, utilizarmos os escudos no tamanho original deles, sem pensarmos em responsivo.
Imaginem que temos um breakpoint para mobile, com um valor máximo de 768px. Nossos escudos devem iniciar em 64px e ir diminuindo, dependendo da resolução do device. Os cinco escudos devem sempre ficar na mesma linha. Como faremos para exibir escudos com tamanhos diferentes, se só temos um sprite com tamanho fixo? Vejam a versão atualizada do CSS mostrado acima, já preparado para o modelo responsivo:

## CSS:
{% highlight sass linenos %}
* {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

$how-many-crests: 5; // Número de colunas
$crest-max-size: 64px; // Tamanho máximo dos escudos

#crests .crest {
  float: left;
  margin-right: 10px;

  a {
    background-image: url('crests.png');
    background-repeat: no-repeat;
    background-size: $how-many-crests * 100%;
    display: block;
    height: 0;
    padding-bottom: 100%;
    text-indent: -9999em;
    width: $crest-max-size;
  }

  &.team-a a { background-position: 0 0 }
  &.team-b a { background-position: 25% 0 }
  &.team-c a { background-position: 50% 0 }
  &.team-d a { background-position: 75% 0 }
  &.team-e a { background-position: 100% 0 }
}

@media screen and (max-width: 768px) {
  #crests {
    margin: 0 auto;
    width: 80%;

    .crest {
      margin: 0;
      padding: 0 10px;
      width: 100% / $how-many-crests;

      a {
        margin: 0 auto;
        max-width: 64px;
        width: 100%;
      }
    }
  }
}
{% endhighlight %}

Veja que utilizei porcentagem para posicionar cada imagem dentro do sprite e também utilizei `background-size`, onde 100% significa um escudo. Já que temos 5, então o valor será de 500%. O `padding-bottom` com valor de 100%, podemos utilizar para "imitar" a largura na altura. Como temos um valor de largura indefinido (100% sempre), a altura também se ajustará a este valor. Como a altura será baseada no padding de 100%.

Veja o resultado deste trabalho [neste link](http://jsfiddle.net/uyst4/).

Aumente e diminua a janela do resultado que você verá os escudos aumentando e diminuindo, de acordo com a resolução.

Infelizmente, esta solução é feita apenas para imagens quadradas. Para padrões de imagens diferentes, o trabalho é maior, que ficará para outro post.
