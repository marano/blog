---
author: Mikael Carrara
layout: post
title: "Usando CSS Reset De Forma Mais Crítica"
categories:
  - design
  - css
  - mikael carrara
  - front-end

---

Qualquer website ou aplicação web faz uso de alguma forma de *CSS Reset*. Se você ainda não sabe pra que serve, *CSS Reset* é um arquivo *CSS* comum que, basicamente, "limpa" os estilos padrões do navegador. Por exemplo, um parágrafo no *Internet Explorer* e *Firefox* podem ter uma margem diferente e por isso seu layout vai ter um comportamento divergente em diferentes browsers. A ideia, então, é diminuir essas diferenças.

<!--more-->

A discussão sobre *CSS Reset* começou num <a href="http://meyerweb.com/eric/thoughts/2007/04/18/reset-reasoning/">post de 2007</a>, caso tenha interesse.

Particularmente eu nunca gostei do conceito original de *CSS Reset* que é simplesmente deletar tudo o que se vê na frente. Sempre usei uma versão pessoal de Reset que tenta não exagerar muito. Em 2008, quando fazia um curso de extensão sobre Padrões Web, Usabilidade e Acessibilidade, acabei desenvolvendo uma proposta própria de *CSS Reset*, na época chamado **ResCSS**, mas não fui atrás de amadurecer o produto e divulgá-lo. Abandonei.

Como nunca gostei do conceito original, minha proposta tentava fazer um pouco diferente. Ao invés de resetar todos os estilos, apenas tentava sutilmente alinhar algumas coisas para que os browsers ficassem mais consistentes. Eu incluía também um script chamado **IE7.js**, que tentava deixar o *IE6* mais parecido com o *IE7*.

Soluções famosas de *CSS Reset*, como o **Yahoo! (YUI 3) Reset CSS**, simplesmente pegam e deletam os bullets de todas as litagens, por exemplo. Depois seu cliente manda um email perguntando porque ele não consegue usar os bullets das listagens no gerenciador de conteúdo dele. O mesmo acontece para itálico, negrito, etc, que são geralmente resetados no conceito original de *CSS Reset*.

No **ResCSS**, em vez de simplesmente deletar a margen padrão do meu parágrafo, eu setava um valor para ela. Assim, tanto o *IE* quanto o *Firefox*, por exemplo, teriam os parágrafos com a mesma margem.

Isso me parece um problema bastante óbvio e, é claro, que mais pessoas pensariam numa solução parecida. Existem hoje algumas soluções que executam conceitualmente melhor o que eu tentei fazer em 2008: **normalize.css** é uma delas.

Particularmente, eu como purista, adoro o conceito do **normalize.css**, mas ainda assim ele não me agrada 100%, pois tenta abranger muita coisa e acaba, às vezes, trazendo mais pra frente muita redundância como re-estilização de *headlines* (h1, h2, h3, etc), por exemplo.

Escrevendo este post, senti vontade de criar um novo *CSS Reset* baseado na minha versão pessoal que amadureci com o tempo. Se você tiver interesse em usá-lo, <a href="https://github.com/mikaelcarrara/css-healing">subi no Github</a>:

Quando for desenvolver sua próxima interface Web, tente seguir o conceito do **normalize.css** sendo mais crítico e tomando cuidado ao mexer com estilos padrões do navegador. Isso pode afetar o funcionamento correto dos componentes básicos do seu projeto. Evite redundâncias e configurações que possam fazer você perder o controle no futuro.

## Links

- [Site Pessoal](http://www.mikaelcarrara.com)
- [Linkedin](br.linkedin.com/in/mikaelcarrara/)
- [Portfólio no Dribbble](http://dribbble.com/mikaelcarrara)
