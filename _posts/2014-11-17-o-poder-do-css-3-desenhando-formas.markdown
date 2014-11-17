---
layout: post
title: "O Poder do CSS 3 - Desenhando Formas"
author: Matheus Costa
categories:
  - matheus costa
  - css3
  - shapes
  - drawing
  - css power
---

Sem imagens, sem javascript, muito menos flash! E com poucas tags HTML.

![PacMan](/blog/images/posts/2014-11-14/pac-man.png)

<!--more-->

## A Origem das Formas ##

Nos primórdios da web, todo web designer era forçado a fazer seu site seguindo retângulos e quadrados. Caso quisesse algo um pouco diferente, utilizava imagens, mas ainda assim não tinha um resultado tão legal.

Um pouco mais adiante veio o flash (R.I.P), expandindo esse universo de maneira simples, porém pesada.

Em seguida, surgiu o javascript, que era meio complicado comparado aos outros mas bem mais leve.

E por fim o CSS na sua 3 versão, disponibilizou seletores capazes de realizarem essas transformações de forma rápida e prática.

## Porque Desenhá-las ##

As formas são necessárias na hora de diversificar um layout e fazendo isso por CSS você tem vários pontos a seu favor:

- É mais leve do que usar imagens.
- Tem melhor resultado do que as imagens.
- É mais simples do que fazer canvas.
- O cross-browser é alto.
- Muito fácil de usar.

Abaixo segue alguns exemplos de layouts usando formas de modo avassalador, feitos com CSS3:

- [Diesel Legworkstudio](http://diesel.legworkstudio.com/)
- [Lacca](http://www.lacca.com.br/lacca/)
- [Built by Buffalo](http://builtbybuffalo.com/)
- [Unfold](http://unfold.no/)
- [Gold Interactive](http://www.goldinteractive.ch/intro)

## Como Começar ##

Existem diversas maneiras de se fazer as formas. Vou abordar os métodos mais simples pra ficar bem fácil o entendimento, evitando o uso de Mixins, Extends e sem simplificar muito o SASS.

### ■ Quadriláteros

As formas mais básicas são os quadriláteros. Alguns nem exigem CSS3 pra reproduzi-los, como é o caso do quadrado, retângulo e trapézio. No paralelogramo eu usei o o seletor `transform: skew(20deg);` pra deixar no ângulo correto e no caso do losango  apenas rotacionei o quadrado com `transform: rotate(45deg);`.

<p data-height="268" data-theme-id="9813" data-slug-hash="KBiAn" data-default-tab="result" data-user="matheusagcosta" class='codepen'>See the Pen <a href='http://codepen.io/matheusagcosta/pen/KBiAn/'>Quad Shapes</a> by Matheus Costa (<a href='http://codepen.io/matheusagcosta'>@matheusagcosta</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script><br>

### ▲ Triláteros

Tão simples quanto o quadrado, os triângulos equiláteros também não exigem nenhuma função específica de CSS3. Precisa fazer uma seta? Com 5 linhas de CSS você pode fazer, sem necessidade de importar imagens.

<p data-height="268" data-theme-id="0" data-slug-hash="gsqkm" data-default-tab="result" data-user="matheusagcosta" class='codepen'>See the Pen <a href='http://codepen.io/matheusagcosta/pen/gsqkm/'>Triangle Shapes</a> by Matheus Costa (<a href='http://codepen.io/matheusagcosta'>@matheusagcosta</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script><br>

### ● Circunferências

Vem sendo muito utilizado em avatares e são feitos com um simples `border-radius: 50%`. Aqui na foto da página de perfil de cada integrante da HE pode ser vista como exemplo.

A lua foi feita com `box-shadow`, mas também poderia ser feita com `:after`, duplicando o contéudo e invertendo a cor.

<p data-height="268" data-theme-id="0" data-slug-hash="fncBq" data-default-tab="result" data-user="matheusagcosta" class='codepen'>See the Pen <a href='http://codepen.io/matheusagcosta/pen/fncBq/'>Circle Shapes</a> by Matheus Costa (<a href='http://codepen.io/matheusagcosta'>@matheusagcosta</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script><br>

## ᗣ Pac-Man Ghost ##

Como bônus do post de hoje eu vou mostrar como eu fiz o Blinky, fantasminha vermelho do pac-man.

### O Markup

Usei apenas 5 classes: `.ghost` pra área geral; `.head` pro formato da cabeça; `.eyeBack` pro fundo do olho; `.eye` pro olho e `.legs` pra "saia" ou "pés" do fantasma.

{% highlight bash linenos %}
<div class="ghost">
  <div class="head">
    <div class="eyeBack">
      <div class="eye"></div>
    </div>
    <div class="eyeBack">
      <div class="eye"></div>
    </div>
  </div>
  <div class="legs"></div>
  <div class="legs"></div>
</div>
{% endhighlight %}

### Estilo da Área Geral

O motivo de eu ter usado `[class*="ghost"]` é de reaproveitar o mesmo estilo para os outros 3 fantasmas, já que o que muda são apenas as cores.

{% highlight sass linenos %}
[class*="ghost"] {
  height: 200px;
  margin: 25px;
  position: relative;
  width: 200px;
}
{% endhighlight %}

### Estilo da Cabeça

Levando em conta que `$Blinky: red;`, aqui eu deixei metade da altura pra área da cabeça e com `border-radius` eu fiz a curvatura.

{% highlight sass linenos %}
.head {
  background: $Blinky;
  height: 100px;
  position: relative;
  width: 152px;
  border-radius: 100px 100px 0 0;
  -moz-border-radius: 100px 100px 0 0;
  -webkit-border-radius: 100px 100px 0 0;
}
{% endhighlight %}

### Estilo pros Olhos

Eu poderia ter feito os olhos apenas usando uma classe e com pseudo elementos faria a íris, mas no próximo post vai ficar claro porque decidi fazer separado.

{% highlight sass linenos %}

.eye,
.eyeBack {
  position: relative;
  border-radius: 100%;
  -moz-border-radius: 100%;
  -webkit-border-radius: 100%;
}
.eyeBack {
  background: #FFF;
  height: 50px;
  width: 50px;

  &:first-child {
    float: left;
    margin: 50px 0 0 25px;
  }
  &:last-child {
    float: right;
    margin: 50px 25px 0 0;
  }
}
.eye {
  background: #0d2bd7;
  height: 25px;
  margin:10%;
  width: 25px;
}
{% endhighlight %}

### Estilo das pernas

Por fim, nas pernas não fiz nada mais do que dois triângulos lado a lado usando `border-`.

{% highlight sass linenos %}
.legs {
  border-right: 38px solid $Blinky;
  border-left: 38px solid $Blinky;
  border-bottom: 40px solid transparent;
  display: block;
  float: left;
  height: 40px;
  width: 0;
}
{% endhighlight %}

## Resultado ##

Pronto! Tá feito o Blinky sem usar imagem nenhuma, apenas CSS! No próximo post vamos dar vida pra ele.

<p data-height="335" data-theme-id="9813" data-slug-hash="dPyNEe" data-default-tab="result" data-user="matheusagcosta" class='codepen'>See the Pen <a href='http://codepen.io/matheusagcosta/pen/dPyNEe/'>Blinky Pac-Man</a> by Matheus Costa (<a href='http://codepen.io/matheusagcosta'>@matheusagcosta</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script><br>

Tem uma galera que faz desenhos representando personagens ou ícones famosos pela web. Você pode encontrá-los em sites como o [Codepen](http://codepen.io/), o [Mozilla Demo Studio](https://developer.mozilla.org/pt-BR/demos/) e o [CSS Deck](http://cssdeck.com/).

Valeu!



