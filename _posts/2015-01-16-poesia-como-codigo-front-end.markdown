---
author: Mikael Carrara
layout: post
title: "Poesia como código front-end"
date: 2015-01-09 15:00
comments: true
categories:
  - design
  - css
  - mikael carrara
  - front-end
  - html
  - organizacao

---

A primeira vez que entrei no site [wordpress.org](http://wordpress.org) estava escrito no footer **"Code is poetry"**. Fiquei pensando sobre isso, sobre tratar o código como se fosse uma poesia. Nunca mais esqueci essa frase, ela ainda faz parte do footer do site da wordpress.org e é minha sitação favorita por espelhar diretamente minha filosofia de trabalho.

<!--more-->

Mas como tratar o código front-end como se fosse uma poesia? Poderia ser algo como: Códigos limpos, organizados, refatoráveis, modulares e o mais importante, bem escritos, documentados, sem redundâncias e inconsistências na sintaxe.

Por exemplo, se você escreve num lugar assim:

{% highlight css linenos %}
div {
  display: none;
}
{% endhighlight %}

Não vá escrever assim mais pra frente no código:

{% highlight css linenos %}
p { display: none }
{% endhighlight %}

A Plataformatec tem uma [guideline](http://guidelines.plataformatec.com.br/css.html) execelente sobre como escrever um CSS elegante.

Outro exemplo bastante comum é quando o designer está usando SASS e usa-o apenas para aninhar os componentes, gerando posteriormente um código completamente redundante do tipo:

{% highlight css linenos %}
#menu ul li a.active {
}
{% endhighlight %}

Enquanto apenas isto resolveria:

{% highlight css linenos %}
.active {
}
{% endhighlight %}

Ou assim:

{% highlight css linenos %}
#menu .active {
}
{% endhighlight %}

Caso a classe **.active** seja usada em outros contextos também.

Parece bom senso querer manter um código organizado, livre de todo ruído e redundâncias, mas a verdade é que poucos designers se preocupam realmente com isso. Conheço designers que infelizmente sentem dores de barriga quando falo sobre HTML, CSS ou código em geral. Muitos não se interessam pelos conceitos de front-end, enquanto poderiam se interessar até por conceitos de back-end e programação em geral.

Se tratando de Web Design, você querendo ou não, aceitando ou não: O código é a parte mais importante. Se ele não estiver saudável, isso vai refletir na qualidade visual também da interface, cedo ou tarde, por mais incrível que seja as habilidades do designer no Photoshop ou qualquer outro software.

No fim não é o layout que vai ser o produto final. Perca mais tempo no código do que no editor de imagens. Aprenda a gostar do código e escreva-o como se fosse uma "poesia". Trate o código front-end como design e não apenas como uma ferramenta para "recortar e montar HTML". Crie um sistema modular inteligente facilmente refatorável.

Não estou tirando a importância de criar layouts/mockups. A criação e a implementação são igualmente importantes. O que estou tentando dizer é para deixar refinamentos muito específicos para serem executados diretos no código e quando o fizer, faça-o de forma crítica, escrevendo um código elegante e funcional.

Assim tanto você quanto o próximo que pegar no código vai entender e sentir-se a vontade para trabalhar com ele. Consequentemente a qualidade do design visual final será sempre a esperada.

Existe essa diferença entre projetar algo que será impresso e algo que será interpretado em um navegador. O material impresso é impresso e pronto. O design de um site ou aplicação pode e deve ser melhorado continuamente, em forma de código. Ele não tem validade.

Friso a importância de suar para manter a qualidade do código em dia para que assim novas funcionalidades possam ser implementadas por pessoas diferentes posteriormente, sem maiores complicações.


## Links

- [Linkedin](br.linkedin.com/in/mikaelcarrara/)
- [Portfólio no Dribbble](http://dribbble.com/mikaelcarrara)
