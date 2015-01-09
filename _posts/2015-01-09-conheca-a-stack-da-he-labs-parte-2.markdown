---
layout: post
title: "Conheça a stack da HE:labs - parte 2"
author: Beatriz Correia
categories:
  - Frontend
  - Framework
  - Stack
  - Time de Design
---

Na primeira parte desse post sobre as tecnologias que utilizamos aqui na HE:labs, você teve acesso à nossa stack quando nos referimos à backend. Neste novo post vamos falar sobre as guidelines que usamos para construir um bom front-end. 

<!--more-->

Para entender as escolhas que fizemos em relação a front-end, você deve se lembrar que no backend a gentre trabalha com Ruby on Rails. Por isso, muitas das ferramentas que usamos, são ferramentas cuja natureza se desenvolve melhor nesse meio. 

###Por onde começamos? 

Vamos começar por pontos muito básicos. Acho justo a gente dar uma olhada primeiro em como é organizado o nosso código segundo às "boas práticas" de organização antes de entrar no mérito das ferramentas. 

## Best-pratices


- Usamos a sintaxe do SASS (ver sobre SASS nos próximos ítens)
- Seguimos a organização de propriedades do guia [Plataformatech](http://guidelines.plataformatec.com.br/css.html)
- Definimos as cores por hexa-decimal (e não rbg/rgba)
- Evitamos usar mais de 3 níveis de identação. 
- Organizamos os atributos em ordem alfabética (Fn+F5 no sublime já faz isso pra você)
- Procuramos sempre estar nos atualizando às melhores praticas de organização de front-end e aplicando elas ao nosso guia interno. 


## Ferramentas


### O SASS

Esse é um "pré-processador" de folha de estilo que te ajuda a otimizar a construção do seu código. Ele dispõe de muitos recursos que agilizam o processo, um exemplo disso é: o uso de variáveis, pseudo-elementos, operações, funções, interpolação, mixins, includes, entre outros. Vale a pena pesquisar e experimentar o [SASS](http://sass-lang.com/) se você ainda não conhece. Para instalar no MAC é muito simples, mas se você usa windows, é preciso ter o ruby instalado na sua máquina. 

### O HAML 

"HTML abstraction markup language". Para leigos eu diria que é uma forma "mais simples e limpa" de escrever html. Se você entendeu o que o SASS está para o CSS, é mais ou menos o que o [HAML](http://haml.info/) está para o HTML, em questão de agilidade de processo e flexibilidade para diversas situações. 

## Organizando os arquivos
A nossa estrutura inicial dos arquivos deve estar organizada dessa forma:

![Organizando 1](/blog/images/posts/2014-11-14/org1.png)

A partir dessa organização, a gente costumiza como melhor se adaptar à estrutura do seu projeto. 

### Sobre layouts

Outra coisa que a gente costuma fazer é separar em uma pasta chamada "layout" os layouts de cada parte separada que irá ser aplicada na interface. Por exemplo: 

![Organizando 2](/blog/images/posts/2014-11-14/org2.png)

## Frameworks

Uma pratica que vem se enraizando na HE:labs desde muito cedo, é o uso de frameworks para auxiliar de diversas formas a agilidade na hora de construir o front-end. Eles tem se revelado como ferramentas essenciais no nosso dia a dia e recomendamos pra quem tem um background de processo parecido com o nosso. 

- O [Bourbon](http://bourbon.io/) é uma biblioteca de mixins usada para criar muitas coisas como por exemplo animações, backgrounds. Quando instalado ele fica em "stand by" e seu código só é lido se chamado no sass. 
- O [Neat](http://neat.bourbon.io/) É um framework de grids que trabalha junto com as mixing do bourbon e sass. 
- O [Bitters](http://bitters.bourbon.io/) te ajuda com variáveis e estruturas pré-definidas para projetos que usam bourbon. 
- E por fim o [Refills](http://refills.bourbon.io/) disponibilia recursos como patterns e components pra quem trabalha com a família bourbon. 

A família bourbon foi desenvolvida pela [Thoughtbot](http://thoughtbot.com/)

## Conclusão

Na stack de front-end nós nos preocupamos em estar sempre atualizados em relação às tecnologias utilizadas, conhecer novas técnicas e ferramentas que ajudem no desenvolvimento dos nossos projetos. Espero que tenham gostado de conhecer um pouco sobre os recursos que a gente usa no dia-a-dia e que isso tenha acrescentando na sua visão de tecnologia e ferramentas de trabalho para front-end. 

Até a próxima. 


