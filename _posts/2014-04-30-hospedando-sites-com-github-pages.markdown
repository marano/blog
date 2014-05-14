---
author: Israel Ribeiro
layout: post
title: "Hospedando sites com Github Pages"
comments: true
categories:
  - israel ribeiro
  - github
  - hosting

---

O Github passou a ser uma das ferramentas mais utilizada no desenvolvimento de software nos dias de hoje. Seja para manter um repositório remoto como backup ou gerenciar um time de desenvolvedores trabalhando em uma mesma aplicação, é difícil imaginar nosso trabalho sem a ajuda dessa poderosa plataforma. Mas o que algumas pessoas não sabem, é que o Github, além de toda interface amigável sobre o git e facilidade para centralizar as discuções e revisões sobre o código, também permite que sejam hospedados sites estáticos gratuitamente, direto de seus repositórios.

<!--more-->

Existem dois tipos de página que você pode gerar, a User page e a Project page.

## User Pages

![Repositório para user page](/blog/images/posts/2014-04-30/user-page-repo.png "Repositório para user page")

Cada usuário pode ter uma única user page, bastando criar um repositório no formato __username.github.io__. O Github irá procurar por um arquivo _index.html_ válido no branch _master_ desse repositório, e caso encontre, irá servi-lo a web na mesma URL utilizada para nomear o repositório.

User pages são úteis para servir sites pessoais, blogs estáticos ou sites de empresas, por exemplo. O [site](http://helabs.com.br) da [HE:labs](https://github.com/Helabs/helabs.github.com) é hospedado utilizando essa modalidade.

## Project Pages

![Repositório para project page](/blog/images/posts/2014-04-30/project-page-repo.png "Repositório para project page")

Project pages, como diz o nome, são páginas que podem ser geradas para cada repositório criado. Para isso, crie uma branch chamada _gh-pages_ e utilize-a para armazenar os arquivos a serem servidos. A página ficará disponível no mesmo domínio da user page seguido do nome do repositório: __username.github.io/projeto__

Não é necessária a existência de uma user page para que a project page funcione, porém, caso não exista, o acesso a user page resultará em uma página 404.

Um exemplo de project page é o jogo [HE-2048](http://israveri.github.io/he-2048), versão modificada do famoso 2048 que utiliza as fotos de alguns membros do time da HE:labs.
O próprio [2048](http://gabrielecirulli.github.io/2048/) utiliza a mesma hospedagem.

Project pages são úteis para hospedar um blog sem precisar utilizar a user page, ou para criar páginas para seus projetos.

## Conclusão

Utilizar o Github pages é uma forma extremamente simples (para não dizer barata) de hospedar sites estáticos. Este post cobre apenas o básico sobre o serviço, que dá suporte a diversas funcionalidades, como domínios customizados e suporte ao [Jekyll](http://jekyllrb.com/).

Para mais informações, visite a [página oficial do serviço](https://pages.github.com/).
