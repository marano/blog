---
published: true
author: Mikael Carrara
layout: post
title: "CSS Para Mídia Impressa"
date: 2014-04-02 10:00
comments: true
categories:
  - impressao
  - css
  - midia impressa
  - mikael carrara
---

Estamos acostumados a projetar interfaces web sem nos preocupar muito com a versão para impressão do conteúdo. Mas em determinados tipos de projetos, como um blog por exemplo, em que a leitura é o foco de toda experiência, precisamos tomar cuidado para que a versão para impressão tenha uma experiência agradável.

<!--more-->

Um usuário quando decide imprimir um determinado conteúdo, está interessado numa parte específica da interface. Ele não está interessado na barra lateral, nem no rodapé e muitos menos em links, pois como é de se esperar, as pessoas não podem clicar neles em páginas físicas.

A maioria dos componentes de interface indesejados são estrategicamente removidos na mídia impressa, mas os links precisam ser substituídos apenas pelo valor do seu atributo href. Você pode fazer isso usando apenas CSS:

{% highlight css linenos %}
a[href^=http]:after {
  content:" <" attr(href) "> ";
}
{% endhighlight %}

Remova os componentes que não fazem sentido depois de impressos:

{% highlight css linenos %}
aside,
footer {
  display: none;
}
{% endhighlight %}

É importante também fazer alguns ajustes no box-model, como por exemplo, o container do conteúdo poderia ocupar a folha inteira já que sumimos com a barra lateral:

{% highlight css linenos %}
#content {
  width: 90%;
  margin: 0;
  padding: 0 5%;
}
{% endhighlight %}

Para referenciar uma folha de estilos específica para impressão diretamente no HTML:

{% highlight html linenos %}
<link rel="stylesheet" type="text/css" media="print.css">
{% endhighlight %}

Você também pode referenciá-la usando @media, por exemplo:

{% highlight css linenos %}
@media print {
  body {
    font-family: Georgia, serif;
  }
}
{% endhighlight %}

Ou ainda melhor, usando @import. Todos os navegadores depois do IE6 suportam a regra @import. Use-a sem medo:

{% highlight css linenos %}
@import /styles/print.css print;
{% endhighlight %}

Num próximo post tentarei falar um pouco sobre seletores de página avançados e o problema das cores ao se desenvolver para mídia impressa. Existem ainda muito pontos que precisam ser considerados para se tirar o máximo proveito das folhas de estilo com saída para impressão. Procure pelas melhores práticas.
