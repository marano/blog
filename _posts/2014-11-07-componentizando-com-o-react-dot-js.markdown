---
layout: post
title: "Componentizando com o React.js"
author: Marcio Junior
categories:
  - React.js
  - Javascript
  - Rails
---

Normalmente quando é escrito código em javascript numa applicação rails, para adicionar plugins ou dar alguma característica
especial a algum elemento, é costume fazer o seguinte:

<!--more-->

{% highlight javascript linenos %}
$(function() {
  $('.fancybox').fancybox();
});
{% endhighlight %}

Assim todo elemento com essa classe `fancybox` vai incorporar essa funcionalidade.
Se precisarmos passar opções pra esse elemento podemos usar data attributes e mandar um json com as opções vindo do rails.
Como por exemplo:

{% highlight html linenos %}
<div class="fancybox" data-options='#{fancybox_options.to_json}'></div>
{% endhighlight %}

E alterar o javascript para passar essas opções ao usasr o plugin

{% highlight javascript linenos %}
$(function() {
  $('.fancybox').each(function() {
    var elem = $(this);
    var options = JSON.parse(elem.data('options'));
    elem.fancybox(options);
  });
});
{% endhighlight %}

Bom, isso funciona e não está muito ruim, mas o problema é que quando a app começa a crescer, vão ter vários id's, classes, ou data attributes
que são dificeis de identificar se estão ali porque está sendo usado no css ou no javascript. E se por algum incidente uma classe for alterada, ou 
alguma hierarquia de elementos mudar, já que dados podem estar sendo alterados usando seletores como $('foo bar .user-name'), os scripts
vao começar a quebrar. Tambem fica dificil identificar aonde começa e terminar o seu componente, e se ele depende de alguma
outra coisa que pode estar fora dele.

Outro problema é que `<div class="fancybox">` não expressa muito a nossa intenção pensando nas semanticas do html. Classes servem pra ser
compartilhar estilos comuns pra vários elementos, e não determinar o que ele é.
Já pensou se pra mostrar um video tivessemos que usar `<div class="video"></div>` ao invez de `<video></video>`. E numa app grande
é fácil ter varios plugins usando seletores obscuros como `#alert`, `.grid` etc.

Num mundo perfeito o ideal é que utilizemos o nome da tag para descrever seu comportamento `<fancy-box />`, `<alert message="Olá" />` etc.
O legal é que isso já existe, e são os [webcomponents](http://webcomponents.org/), não vou entrar em detalhes, mas essa é uma especificação 
quer permite que você extenda o html e crie suas próprias tags/componentes, e importe nas suas páginas. O problema é que por ser algo novo
só funciona nos browser mais modernos e eu normalmente opto por bibliotecas que tenham um suporte a browsers mais antigos, pra evitar maiores
problemas. Pesquisando por alternativas encontrei o [react](http://facebook.github.io/react/) do facebook, que não utiliza as api's novas 
do webcomponents, mas sim reimplementa o seu próprio dom (Virtual dom).

As vantagens que vi no react foram:

1. O arquivo é pegueno cerca de 47kb minificado
1. Tem uma boa performance graças ao virtual dom
1. Pode ser usado em apenas uma parte da página ou até pra construir uma aplicação inteira
1. Pre-renderização na parte do servidor, melhorando o carregamento inicial da página pelo navegador
1. Bom suporte a [navegadores](http://facebook.github.io/react/docs/working-with-the-browser.html#browser-support-and-polyfills) não tão modernos como ie8
