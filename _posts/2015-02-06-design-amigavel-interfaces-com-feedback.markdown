---
layout: post
title: "Design Amigável: Interfaces com feedback"
author: Márcio Costa
categories:
  - UX
  - User friendly
  - Interfaces
  - Design
  - Usabilidade
  - IHC
---

Informe aos usuários o que está acontecendo, deixe-os confiantes e seguros.
<!--more-->

Muitas vezes construimos belas interfaces, com belos alinhamentos, cores, fontes e tudo o mais. E deixamos de lembrar do que acontece depois de certas ações. Esquecemos do feedback que o usuário precisa para seguir adiante ou simplesmente para saber se o que ele fez está certo ou errado. São as entrelinhas da prototipação, que muitas vezes na velocidade de um processo ágil deixamos passar.

Prover resposta ao usuário, a princípio é algo que parece simples e de tão simples acabamos por esquecer, quer ver um exemplo?

![formulario](/blog/images/posts/2015-02-06/exform.jpg)

No formulário acima parece estar tudo ok, mas onde informo os campos requeridos e os opcionais? em casos de formulários extensos é muito bom indicar estas informações, por que aqui entre nós, preencher formulários não é tarefa das mais legais em um app, então, ver que um campo é opcional em um formulário é um alívio.

A forma na qual você irá mostrar seus feedbacks, é óbvio que não seguem regras, você irá estudar e adaptar de acordo com o seu projeto, porém, tenha cuidado, ao usar alerts, modais, ou algo do tipo para dar informações sobre ações realizadas, motivo? eles interrompem abruptamente a navegação do usuário. É como se ele estivesse falando com você e você o interrompesse, gera "cliques" desnecessários, enfim, mantenha-se cauteloso.

![toast](/blog/images/posts/2015-02-06/toast.gif)

Uma boa saída para esses casos seria um "toast", é um aviso que entra, fica alguns segundos e some, como foi ilustrado na interação acima.

## Ao prover feedback, prenda a atenção.
### Não adianta ele estar lá se ele não for visto

Um ponto importante na hora de mostrar retorno ao usuário, é focar a atenção dele no retorno. Vamos supor que o usuário esteja em uma lista onde ele pode adicionar ou remover itens é muito importante assinalar que o item foi adicionado ou removido. Muitas vezes fazemos isso, mas somente assinalar que há um item no carrinho não é o suficiente, pois, em uma listagem extensa de produtos, o carrinho (geralmente lá no topo) acaba despercebido, nesse caso, podemos recorrer a pequenas animações para chamar a atenção do usuário à ação que ele acaba de executar:

![basket](/blog/images/posts/2015-02-06/addtobasket.gif)

Dessa maneira você dá ao usuário conhecimento e informação do que aconteceu e está acontecendo na ação.

## Dê oportunidades.
### Ops! Excluí sem querer... ufa, tem um desfazer!

Muitas vezes podemos aproveitar os nossos retornos para inserirmos ações contrárias que podem salvar a vida de quem executou alguma tarefa que não queria (já nem conto as vezes que fui salvo por um "desfazer"). Podemos ver um exemplo muito bom no app do gmail, onde, ao arquivar um email ele mostra que o email foi arquivado, porém, te dá a oportunidade de desfazer esta ação:

![undo](/blog/images/posts/2015-02-06/undo.png)

Enfim, usei alguns exemplos de usabilidade onde o retorno das ações tornam a vida do usuário mais simples. São pequenos detalhes, que somados, trazem conforto, informação e segurança para o seu app. Vamos sempre nos lembrar que nossas interfaces são a ponte da interação entre as pessoas e as máquinas. E se nossas interfaces se comunicam bem com os nossos usuários, a chance de um app causar uma boa impressão aumenta. Tenhamos isso sempre em mente e mãos à obra!

Obrigado.
