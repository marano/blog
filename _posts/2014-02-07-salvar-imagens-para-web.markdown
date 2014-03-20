---
published: true
author: Dirceu Pauka
layout: post
title: "Como salvar imagens para web"
comments: true
categories:
  - design
  - otimização
  - dirceu 


---

Já reparou quanto tempo leva para carregar uma página na internet nos dias de hoje? Você clica em um link e espera, espera mais um pouco, para então, o conteúdo aparecer. Pior ainda se feito pelo celular.

O tempo que uma página leva para carregar é uma característica que deve ser observada pelos desenvolvedores. Não importa se é uma página agradável e bonita se ela demora para funcionar. Imagens pesam mais, por isso, nesse artigo você vai aprender salvar no melhor formato para pesar menos na hora de carregá-las na sua página da web!

<!--more-->

## Use o melhor formato

Para imagens que contenham ilustrações ou ícones, use o formato **PNG 8-bit** ou **GIF** e reduza o número de cores na palheta de forma que não comprometa a qualidade. Alguns programas de edição, como o Photoshop, permitem você salvar imagens para web e ajustar diversas opções. Reduzir a paleta de cores de 256 para 32, diminuirá o tamanho do arquivo. Menos cores na imagem, menor o tamanho do arquivo.

![image](/blog/images/posts/2014-02-07/filetypes.jpg)

Para imagens com detalhes, muito coloridas ou fotografias, use **JPG** ou **PNG 24-bit**. Eles possuem uma paleta de cor maior. O **PNG 24-bit** produz qualidade de imagem melhor ao custo de um arquivo maior. Quando possível, use **JPG** e ajuste as opções para comprimir o máximo sem "estragar" a qualidade da imagem.

![image](/blog/images/posts/2014-02-07/filetype_jpg.jpg)

O **JPG** possui uma opção chamada modo "Progressivo”. Essa opção adiciona algumas cópias da imagem em menor resolução para que ela apareça mais rápido na tela, enquanto carrega com todos detalhes.

**PNG** oferece o modo “Interlaçado”. Esse modo exibe a imagem em etapas, carregando algumas linhas primeiro e preenchendo os espaços em cada etapa seguinte.

Essas opções são interessantes para exibir algo rapidamente para seus usuários antes de terminar de carregar. Porém, elas aumentam o tamanho total da imagem e dependendo do caso, não são necessárias.

## Desenhe pensando em produzir arquivos menores

Como o **PNG 8-bit** e **GIF** podem produzir arquivos menores, matenha isso em mente ao desenhar ou usar ilustrações nas suas páginas. Quanto menos cores utilizadas, menor o tamanho do arquivo.

## Redimensione a imagem

Salve a imagem com o tamanho que ela será usada. Se não existe espaço para exibir com detalhes, crie uma versão pequena da imagem, em baixa resolução, como link para a imagem em alta resolução.

Se a intenção é que a imagem apareça perfeita em monitores com maior resolução, [exiba a imagem em alta resolução somente para que tem esse monitor](http://sergiolopes.org/media-queries-retina/). Para todos os demais monitores, salve a imagem em resolução normal.
