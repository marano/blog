---
published: true
author: Mikael Carrara
layout: post
title: "Um Pouco de Git para Designers"
date: 2014-05-26 10:30
comments: true
categories:
  - git
  - designers
  - pull request
---

Muitos ainda se questionam sobre o quão longe um web designer precisa se aventurar no mundo dos códigos. Para mim, quanto mais longe ele for, mais longe ele irá como designer também. 

<!--more-->

Quando você se interessa por código, muitas oportunidades de participar de projetos interessantes espalhados pelo mundo todo aparecem, além de poder contribuir também com projetos open source. 

O objetivo desse post, é passar um pouco da minha experiência com Git para outros web designers interessados em começar a fazer seus primeiros commits.

Recentemente participei de uma competição para um redesign do site oficial da linguagem Ruby. Infelizmente não fui o vencedor, mas valeu a experiência. Vou usar minha [Pull Request](https://github.com/ruby/www.ruby-lang.org/pull/341) na competição como exemplo para o post.

Geralmente o primeiro comando que você usa do Git é o git clone, para “clonar” (copiar para sua máquina) o reposítorio com todo o código do projeto através de uma chave SSH, por exemplo:

{% highlight bash linenos %}
git clone git@github.com:ruby/www.ruby-lang.org.git
{% endhighlight %}

## Commit

Depois de clonado o repositório e entrado no diretório correto, você está pronto pra começar a "commitar". Sempre antes de um *commit* você precisa adicionar suas alterações:

{% highlight bash linenos %}
git add .
{% endhighlight %}

E então você pode commitar:

{% highlight bash linenos %}
git commit -m "Improvement on header"
{% endhighlight %}

Quando você commita, você cria um "nó" no histórico dos documentos envolvidos naquele *commit*, então quando no futuro você precisar voltar pra uma versão mais antiga da interface, basta apenas voltar para esse "nó" específico. Você não corre o risco de perder ou duplicar código. Além disso fica melhor documentado todas as versões da interface.

## Branch

Uma branch é uma espécie de "perfil" dentro do Git, quando você cria uma nova *branch*, você se isola para testar novas funcionalidades. Posteriormente, quando essa nova funcionalidade for aprovada pelo resto do time através de uma *Pull Request*, por exemplo, então ela pode ser "mergeada" com a *branch* **master**, ou seja, juntar suas alterações com o "perfil" principal do repositório. Por default, você está na *branch* **master**.

No caso da competição do site do Ruby, cada participante trabalhou numa branch pessoal com sua respectiva proposta de redesign. Apenas o vencedor teve sua *branch* mergeada com a **master** e com isso seus commits aceitos. Minha *branch* com minha proposta era a **design-mikael**.

Para visualizar quais *branchs* estão disponíveis no repositório, rode na linha de comando:

{% highlight bash linenos %}
git branch
{% endhighlight %}

Para criar uma nova *branch*:

{% highlight bash linenos %}
git branch design-mikael
{% endhighlight %}

Para entrar nessa nova *branch*:

{% highlight bash linenos %}
git checkout design-mikael
{% endhighlight %}

Da mesma forma que para voltar para a *branch* **master**:

{% highlight bash linenos %}
git checkout master
{% endhighlight %}

## Pull

É interessante também sempre antes de começar a trabalhar rodar o comando:

{% highlight bash linenos %}
git pull
{% endhighlight %}

Esse é comando que vai deixar o repositório (baixado na sua máquina) em dia com as alterações feitas por outros colaboradores. Quando você roda o **git pull**, o Git baixa todas as alterações disponíveis no servidor e junta com a sua versão local. É importante sempre trabalhar com o código atualizado para evitar conflitos no futuro.

## Push

**Push** é o comando responsável por mandar suas alterações/commits para o servidor. Quando você faz um git push na *branch* **master**, todos os seus commits são enviados para o servidor.

Se você estiver numa outra *branch*, ao dar *Push*, você vai alimentar com os *commits*, a *Pull Request* relacionada a essa *branch*.

Por exemplo, quando eu estava trabalhando no projeto do Ruby, sempre que eu rodava no terminal o comando **git push**, meus *commits* alimentavam minha *Pull Request* lá no Github dentro da *branch* **design-mikael**:

[https://github.com/ruby/www.ruby-lang.org/pull/341/commits](https://github.com/ruby/www.ruby-lang.org/pull/341/commits)

Se eu tivesse permissão para apenas rodar o **git push** na *branch* **master**, essa minha nova proposta de design teria simplesmente sobrescrevido a versão em produção antes que os jurados da competição pudessem julgar minha proposta.

## Conclusão

Criar uma *branch* e fazer um *Pull Request* com o que você criou de novo, é o conceito chave para usar o Git como ferramenta para sair propondo novos designs por aí. Isso possibilita inúmeras pessoas opinarem sobre o que você está propondo com sua *Pull Request*, propor melhorias, etc. O que parece bastante produtivo tanto para projetos open source quanto para projetos privados.


## Recurso

A Code School oferece um console pra você fazer seus primeiros testes com Git:
[https://try.github.io/levels/1/challenges/1](https://try.github.io/levels/1/challenges/1)
