---
author: Eduardo Fiorezi
layout: post
title: "Refatoração Parte II - Mal cheiros"
date: 2014-02-30 9:00
comments: true
categories:
  - desenvolvimento agil
  - refactoring
  - eduardo fiorezi

---

Refatoração Parte II - Mal cheiros

Você decide fazer uma festinha em sua casa, convida todo mundo, e ao chegar em casa sente um cheiro ruim na cozinha, torce o nariz e fica procurando por aquele cheiro sem saber onde exatamente ele está, pode ser difícil de encontrar mas você sabe que tem algo errado. Então continua procurando e finalmente descobre de onde sai aquele cheiro ruim.

<!--more-->

![image](/blog/images/posts/2014-02-30/refatoracao-casa.png)
Link da foto: [http://desenvolvimentoagil.com.br/xp/praticas/refatoracao](http://desenvolvimentoagil.com.br/xp/praticas/refatoracao)

Em algumas horas essa festa vai rolar, então sua prioridade é eliminar esse cheiro, você não gostaria de ver alguém reclamar do cheiro.

Durante o processo de desenvolvimento de software você se depara com a mesma situação, em algum momento você topará com um código que deixa a sensação que tem algo errado, mas por algum motivo você não deu muita prioridade em deixá-lo da melhor maneira. Este código vai encomodar na próxima vez que você for revisá-lo, seja para adicionar alguma funcionalidade ou para resolver algum bug.

Os mal cheiros são isso, são sensações de que algo está errado no seu código, algumas são fáceis de detectar, outras são minuciosas e quando mais conhecimento você adquirir, mais simples será essa detecção.

A seguir vou explicar, o que são na minha opinião, os 3 mal cheiros mais comuns:

##Código duplicado

É bem fácil de identificar código duplicado, ele grita na sua cara para que seja resolvido, então corra para resolver a duplicação. Se você ver o mesmo código em 2 lugares diferentes na mesma classe é hora de [extrair o método](http://www.refactoring.com/catalog/extractMethod.html). Se você tem o mesmo método em duas subclasses, é hora de [“subir o método”](http://www.refactoring.com/catalog/pullUpMethod.html).
Existem várias refatorações que você pode seguir para eliminar esse mal cheiro, citei apenas duas.

##Métodos longos

Procure sempre manter os métodos pequenos e com bons nomes, isso vai facilitar o uso em outros lugares e esse método será valioso no seu software. Um método com um bom nome não necessita da análise do seu código facilitando durante o desenvolvimento.
[Rrocar variável temporária por query](http://www.refactoring.com/catalog/replaceTempWithQuery.html) e [trocar método por objeto método](http://www.refactoring.com/catalog/replaceMethodWithMethodObject.html), são duas refatorações que você poderá usar quando sentir esse mal cheiro.

##Classes grandes

Isso ocorre quando uma classe faz mais do que deveria. Tente unir variáveis e comportamentos que fazem sentido viverem juntos fora desta classe. Várias variáveis com o mesmo prefixo é um bom ponto incial. Uma classe grande, geralmente tem alguma duplicação de código, elimine a redundância, as refatorações mais usadas aqui serão [extrair classe](http://www.refactoring.com/catalog/extractClass.html), [extrair módulo](http://www.refactoring.com/catalog/extractModule.html) e [extrair subclasse](http://www.refactoring.com/catalog/extractSubclass.html)

...

Começar cuidando desses 3 mal cheiros já é um bom começo, você vai começar a notar que seu código ficará cada vez melhor. Após isso, comece a agregar aos poucos, outras refatorações.

Os livros [Refactoring Ruby Edition](http://www.amazon.com/Refactoring-Ruby-Edition-Jay-Fields/dp/0321603508) e [Refactoring: Improving the Design of Existing Code](http://www.amazon.com/Refactoring-Improving-Design-Existing-Code/dp/0201485672/ref=sr_1_1?s=books&ie=UTF8&qid=1376873268&sr=1-1&keywords=refactoring+improving+the+design+of+existing+code) são os livros básicos para utilizar a técnica de maneira fundamentada e servem de referência para quem trabalha com outras linguagens.

Dependendo da linguagem e framework que você trabalha, outras refatorações serão derivadas destes catálogos básicos.

...

Leia também o post [Refatoração Parte I - O Que é](/blog/2013/06/17/refatoracao-parte-i-o-que-e/)

Siga-me no Twitter: [@eduardofiorezi](http://twitter.com/eduardofiorezi)
