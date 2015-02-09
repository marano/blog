---
layout: post
title: "O Poder do CSS 3 - Transições"
author: Matheus Costa
categories:
  - matheus-costa
  - front-end
  - css3
  - css power
  - transitions
---

Mudando com classe.

![Pac-Man](/blog/images/posts/2015-01-21/ghost.gif)

<!--more-->

## Transitions x Animations

No geral, transitions são usadas para alterar o estilo de um elemento gradativamente, ou seja, mudar a aparência de uma maneira mais suave do que o normal. Geralmente aplica-se em botões, links, menus e ultimamente vem sido implementados em radios e checkboxes tambem, trazendo uma experiência de uso mais agradável.

A grande diferença da transition pra animation, é que a transition precisa de um 'gatilho' para funcionar. Seja ele um `:hover`, `:focus` ou mesmo uma chamada via javascript.

# Propriedades <br><br>

- ** transition-delay**

*pode ser tempo em segundos, `initial` ou `inherit`*

- ** transition-duration**

*mesmos valores válidos para o delay.*

- ** transition-property**

*`none`, `all`, `initial`, `inherit` ou uma propriedade como `width` por exemplo.*

- ** transition-timing-function**

*aceita `ease`, `linear`, `ease-in`, `ease-out`, `ease-in-out`, `cubic-bezier()`, `initial`, ou `inherit`*

## Exemplo 1 - Hover

Mais simples e mais utilizado, é a transition no `:hover`. Eu vou mudar o estado do Blinky de normal para quando ele fica vulnerável, ou em outras palavras, quando o Pac-man come as pastilhas maiores e fica de cara feia.

Como o fantasma tem vários outros elementos que vão ser alterados, eu logo defini que a transição vai acontecer em todas as `<div>` dentro da `.field` (que é a classe que mantém tudo alinhado).

{% highlight sass linenos %}

.field { 
  display: table;
  margin: 5% auto; 
  
  &:hover {
  
    div {
      @include transition(all 0.3s ease-in-out);      
    }  
  } 
} 

{% endhighlight %}

Então assim que o mouse estiver em cima da `.field`, os olhos ficarão vermelhos e a cabeça e as pernas vão ficar brancas.

{% highlight sass linenos %}

.head {
  background: $Light;
}

.eye {      
  background: $Blinky;
}

.legs {      
  border-right-color: $Light;
  border-left-color: $Light;
}

{% endhighlight %}

Além disso, vai aparecer a boca em formato zigue-zague na mesma cor dos olhos. Abaixo segue como eu fiz ela de uma maneira bem fácil usando um mixin do [Compass](http://compass-style.org/reference/compass/css3/images/).

{% highlight sass linenos %}

.mouth {
  position: absolute;
  left: 10%;
  top: 60%;
  height: 10px;
  visibility: visible;
  width: 111px;
  z-index: 1;

  &:before {
    content: '';
    position: absolute;
    background-repeat: repeat-x;
    z-index: -1;
    @include background(
      linear-gradient(135deg, $bg, $bg  75%, $zig 75%, $zig),
      linear-gradient(225deg, $bg, $bg  75%, $zig 75%, $zig),
      linear-gradient(45deg, $bg, $bg  75%, $zig 75%, $zig),
      linear-gradient(315deg, $bg, $bg  75%, $zig 75%, $zig)
    );
    background-position: 0.5em 0.5em, 0.5em 0.5em, 0 0.5em, 0 0.5em;
    background-size: 1em 1em;
    left: 0;
    top: -1em;
    height: 1em;
    width: 100%;
  } 
}

{% endhighlight %}

O resultado e o código completo estão no frame abaixo.

<p data-height="350" data-theme-id="9813" data-slug-hash="gbLjBE" data-default-tab="result" data-user="matheusagcosta" class='codepen'>See the Pen <a href='http://codepen.io/matheusagcosta/pen/gbLjBE/'>Blinky Pac-Man Transition</a> by Matheus Costa (<a href='http://codepen.io/matheusagcosta'>@matheusagcosta</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>
<br><br>
## Exemplo 2 - Javascript 

Quando combinados com Javascript, podemos criar interações mais complexas. E para isso a transition é recomendado, pois o animation possui as `@keyframes` com as especificações corretas para a animação, isso não deixa muito intutivo para ser alterado via JS.

No caso, vamos criar movimentos com cliques. Conforme o usuário clica em algum canto da tela, o fantasma faz o percurso. Para que esse movimento seja suave, vamos adicionar a transition.

{% highlight sass linenos %}

.object {
  @include transition(left .5s ease-in-out, top .5s ease-in-out);
  left: 50px;
  position: relative;
  top: 50px;
}

{% endhighlight %}

O javascript vai fazer todo o resto: 

- Configurar o `getClickPosition` para pegar cada clique dentro da `.area`;
- Calcular o ponto exato do Clique; 
- Setar as posições `left` e `top` na `div` do fantasma para que a transition mova suavemente;

{% highlight javascript linenos %}

var theThing = document.querySelector(".object");
var container = document.querySelector(".area");
 
container.addEventListener("click", getClickPosition, false);
 
function getClickPosition(e) {
    var parentPosition = getPosition(e.currentTarget);
    var xPosition = e.clientX - parentPosition.x - (theThing.clientWidth / 2);
    var yPosition = e.clientY - parentPosition.y - (theThing.clientHeight / 2);
     
    theThing.style.left = xPosition + "px";
    theThing.style.top = yPosition + "px";
}
 
function getPosition(element) {
    var xPosition = 0;
    var yPosition = 0;
      
    while (element) {
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        element = element.offsetParent;
    }
    return { x: xPosition, y: yPosition };
}

{% endhighlight %}

Com isso temos o seguinte resultado (Clique na area preta):

<p data-height="350" data-theme-id="9813" data-slug-hash="LEOyRW" data-default-tab="result" data-user="matheusagcosta" class='codepen'>See the Pen <a href='http://codepen.io/matheusagcosta/pen/LEOyRW/'>Blinky Moving</a> by Matheus Costa (<a href='http://codepen.io/matheusagcosta'>@matheusagcosta</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>
<br><br>

## Conclusão

Não deixe seus elementos que mudam de estado sem transition, o feedback gradativo além de trazer elegância pro site, faz os usuários entenderem melhor o funcionamento das ações.