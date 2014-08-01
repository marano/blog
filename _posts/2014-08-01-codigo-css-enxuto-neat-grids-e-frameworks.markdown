---
layout: post
title: "Código CSS Enxuto, Neat, Grids e Frameworks"
author: Mikael Carrara
date: 2014-08-1 15:30
comments: true
categories:
  - neat
  - frameworks
  - css
---

Particularmente nunca gostei muito de usar frameworks para desenvolvimento front-end. Sempre procurei deixar meu código o mais limpo possível, livre de qualquer coisa que ofusque sua nitidez e intuitividade.

<!--more-->

Sigo um raciocínio um pouco conservador em meus projetos, por exemplo, não vou instalar a biblioteca [Font Awesome](http://fortawesome.github.io/Font-Awesome/) só porque ela é bonita mas que na prática vou usá-la em 2 situações isoladas dentro do projeto. Talvez optaria por ela se eu tivesse que usar uns dez ícones, para aí sim compensar sua importação.

Uma opção mais enxuta seria transformar esses ícones em imagens e embutí-las no meu CSS sprite. Obviamente isso não é muito produtivo mas é limpo e simples de entender se tiver duas linhas explicando no readme.md do projeto como adicionar ou remover ícones da interface. Além disso o próprio **SASS/COMPASS** já facilita esse tipo de coisa. Você pode montar seu sprite automaticamente usando ferramentas também como por exemplo: [InstantSprite](http://instantsprite.com/).

Nesse tipo de coisa, ainda continuarei tendo uma postura conservadora. Mas uma coisa que me deixa um pouco incomodado sendo conservador é quando eu tento construir um sistema de grids “na unha” e depois tento documentar como a lógica de layout desse meu sistema de grid como um todo funciona para designers posteriores darem continuidade no meu trabalho.

Tentei vários frameworks procurando um que poderia ser intuitivo e convidativo o bastante para que um novo membro no time se sinta motivado a estudar uma nova tecnologia. Convenhamos, designers são bastante radicais, por exemplo, se ele abre o código CSS e não entende, ele simplesmente re-escreve tudo de uma forma que fique melhor pra ele construir novas coisas depois. 

De longe, o único que realmente valeu a pena parar tudo o que eu estava fazendo para estudar foi o [Neat](http://neat.bourbon.io/), da [Thoughtbot](http://thoughtbot.com/). Ele é extremamente intuitivo e bem documentado, o que resolveu nosso problema aqui na HE:labs que era alinhar a metodologia entre todos os designers. Fica realmente muito difícil cada pessoa nova que colocar a mão no CSS entender e dar continuidade quando não se tem um padrão bem documentado e intuitivo  para construir grids. Agora qualquer novo membro no time pode dar continuidade facilmente no projeto apenas estudando a documentação do framework.

Minha sugestão seria chegar num equilíbrio entre usar ou não esse tipo de ferramenta. Coisas básicas como o container principal e seus breakpoints, por exemplo, acho mais fácil fazer na unha e documentar. Usar o Neat para casos que envolvam grids mais complexas e não como uma resposta para todos os problemas.
