---
layout: post
title: "O Poder do CSS 3 - Animações"
author: Matheus Costa
categories:
  - matheus costa
  - css3
  - animation
  - css power
---

Hora de dar vida as coisas.

![Pac-Man](/blog/images/posts/2014-11-12/pac-man.gif)

<!--more-->

## Fácil Como Tirar Doce de Criança ##

No post anterior eu falei sobre formas (Ou shapes), de como elas vem sendo exploradas muito além de quadrados e retângulos e de como é simples fazer isso com CSS conseguindo produzir coisas insanas. Agora vou partir pra parte que deixa ela mais interessante: Botar pra mexer.

É muito simples fazer uma animação com css, você basicamente precisa de 3 passos:

- Escolher um nome para cada animação 
- Setar os estilos na regra `@keyframes` de cada animação
- Linkar as animações em seus devidos seletores

## Nomes das Animações ##

Para fazer a animação da imagem acima, eu defini que: 

- **mouth** e **mouthR** - faz o abre e fecha da boca do pac-man;
- **route** - faz a rota do pac-man
- **routeGhost** - rota do fantasma
- **looking** - mexe os olhos do fantasma

## @Keyframes ##

É necessário ao menos 2 pontos para realizar uma animação, um _começo_ e o _fim_. Abaixo seguem os `@keyframes` que setei pra cada item detalhadamente

# mouth e mouthR #

A boca do pac-man é dividida em 2 partes, superior e inferior. Com isso eu consigo realizar o movimento de abre e fecha apenas alternando o angulo entre -45° e 0° com **mouth** e 45° e 0° na **mouthR**.

{% highlight sass linenos %}

@keyframes mouth {
	0% { transform: rotate(-45deg); }
	100% { transform: rotate(0deg); }
}
@-webkit-keyframes mouth {
	0% { -webkit-transform: rotate(-45deg); }
	100% { -webkit-transform: rotate(0deg); }
}

@keyframes mouthR {
	0% { transform: rotate(45deg); }
	100% { transform: rotate(0deg); }
}
@-webkit-keyframes mouthR{
	0% { -webkit-transform: rotate(45deg); }
	100% { -webkit-transform: rotate(0deg); }
}
{% endhighlight %}

# route #

Aqui é o caminho que o pac-man vai percorrer, para isso, um simples _left_, _right_, _top_ e _bottom_ resolve. Porem, sabemos que o pac-man não fica apenas na horizontal, então com o `transform` eu rotaciono ele de acordo com o lado da tela que ele for percorrer.

{% highlight sass linenos %}

@keyframes route
{
	0%   { left:0px; top:0px; }
	25%  { left:560px; top:0px; transform: rotate(90deg); }
	50%  { left:560px; top:360px; transform: rotate(180deg); }
	75%  { left:0px; top:360px; transform: rotate(270deg); }
	100% { left:0px; top:0px; transform: rotate(360deg); }
}
  
@-webkit-keyframes route
{
	0%   { left:0px; top:0px; }
	25%  { left:560px; top:0px; -webkit-transform: rotate(90deg); }
	50%  { left:560px; top:360px; -webkit-transform: rotate(180deg); }
	75%  { left:0px; top:360px; -webkit-transform: rotate(270deg); }
	100% { left:0px; top:0px; -webkit-transform: rotate(360deg); }
}

{% endhighlight %}

# routeGhost #

O fantasma faz o mesmo percurso, só que em posição diferente e como ele não rotaciona, com _top_ e _left_ resolve sua animação tranquilamente.

{% highlight sass linenos %}

@keyframes routeGhost
{
	0%   { left:600px; top:-220px; }
	25%  { left:600px; top:160px; }
	50%  { left:0px; top:160px; }
	75%  { left:0px; top:-220px; }
	100% { left:600px; top:-220px; }
}

@-webkit-keyframes routeGhost
{
	0%   { left:600px; top:-220px; }
	25%  { left:600px; top:160px; }
	50%  { left:0px; top:160px; }
	75%  { left:0px; top:-220px; }
	100% { left:600px; top:-220px; }
}

{% endhighlight %}

# looking #

Os olhos se movem de acordo com o fantama, então não precisa de nenhum seletor especial.

{% highlight sass linenos %}

@keyframes looking
{
	0%   { left:0px; top:15px; }
	25%  { left:5px; top:0px; }
	50%  { left:15px; top:0px; }
	75%  { left:15px; top:15px; }
	100% { left:0px; top:15px; }
}

@-webkit-keyframes looking
{
	0%   { left:0px; top:15px; }
	25%  { left:5px; top:0px; }
	50%  { left:15px; top:0px; }
	75%  { left:15px; top:15px; }
	100% { left:0px; top:15px; }
}

{% endhighlight %}




<p data-height="680" data-theme-id="9813" data-slug-hash="jJGam" data-default-tab="result" data-user="matheusagcosta" class='codepen'>See the Pen <a href='http://codepen.io/matheusagcosta/pen/jJGam/'>Pacman animation</a> by Matheus Costa (<a href='http://codepen.io/matheusagcosta'>@matheusagcosta</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>