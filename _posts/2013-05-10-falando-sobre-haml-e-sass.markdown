---
layout: post
title: "Falando sobre HAML e SASS"
author: Rodrigo Gomes
categories:
  - Rodrigo Gomes
  - HAML

---

A [HAML](http://www.haml.info/) é uma _gem_ que facilita toda a parte visual de uma aplicação web.

O framework **Ruby on Rails** ajuda bastante no quesito agilidade. E por que não ser mais ágil, não precisando ficar fechando tags do HTML? Isso é resolvido criando estilos mais ágeis e legíveis para alguém que, futuramente, venha mexer no seu código.

<!--more-->

Eu, particularmente, estou começando a aprender e usá-la em alguns projetos web. Tenho mais costume com o HTML tradicional, mas é bem tranquilo usar a HAML. Ela utiliza as mesmas tags do HTML, mas a vantagen é que não precisa ficar fechando as tags. Em vez disso, você usa prefixos como `%` ou `.` para chamar as tags HTML. Não se preocupe, pois quando executado no browser, o HTML gerado será o tradicional.

Antes o nome do arquivo que era `index.html` passa a ser `index.haml`.

Mostrando na prática, citarei dois exemplos: com o HTML tradicional e o outro no HAML.

Método tradicional do **HTML**:

{% highlight html linenos %}
<html>
  <head>
    <title>HE:labs </title>
  </head>
  <body>
    <h1>Meu 1 post | blog</h1>
  </body>
</html>
{% endhighlight %}

No HAML ficaria assim:

{% highlight haml linenos %}
%html
  %head
    %title HE:labs
  %body
    %h1
      Meu 1 post | blog
{% endhighlight %}

Um dos cuidados que se deve ter com o **HAML** é a sua indentação. Ela deve ficar de forma correta (alinhada), pois se o código estiver desalinhado, não rodará.

Assim está errado:

{% highlight haml linenos %}
%html
        %head
%title
   HE:labs
         %body
        %h1
         Meu 1 post  |  blog
{% endhighlight %}

Bem mais prático e tranquilo sobrescrever o HTML com o HAML, onde o código fica mais organizado e limpo. Outra coisa ainda não mencionada é a possibilidade de adicionar código **Ruby** dentro do HAML.

# SASS

O SASS faz parte do HAML e consiste em criar os css de um modo ágil, prático e legível. Não é necessesário instalar nada, porém, esses procedimentos que citarei logo abaixo, devem ser seguidos para que se tenha uma boa utilização. Lembrando que quando você executar o seu projeto no browse, o css vai ser interpretado de forma tradicional.

Forma tradicional do CSS:

{% highlight css linenos %}
body {
  background-color: #000;
  font-size: 16pt;
}
{% endhighlight %}

No SASS funciona da seguinte maneira:

{% highlight sass linenos %}
body
  background-color: #000
  font-size: 16pt
{% endhighlight %}

*Obs: Notem que não utilizamos mais as chaves e o ponto e vírgula. E ainda, o uso do espaço entre a propriedade e o valor.*


## Adicionando o estilo ao HAML:

{% highlight haml linenos %}
= stylesheets_link_tag "nome_do_estilo"
%html
  %head
    %title HE:labs
{% endhighlight %}

## Vamos agora aprender como instalar a _gem_ do HAML

A instalação é bem fácil: basta rodar o comando abaixo em seu terminal. Não esqueça de adicionar a _gem_ dentro do projeto.

{% highlight ruby linenos %}
gem install haml
{% endhighlight %}

Quando a etapa acima for concluída, rode o próximo comando que será adicionado no seu projeto:

{% highlight ruby linenos %}
haml --rails meuprojeto/app
{% endhighlight %}

Depois de executado, uma mensagem será exibida:

{% highlight ruby linenos %}
Haml plugin added to meuprojeto
{% endhighlight %}

Pronto, agora você já tem o HAML instalado na sua aplicação web pronto para uso.

Até a próxima galera.
