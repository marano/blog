---
layout: post
title: "Conheça a stack da HE:labs"
author: Sylvestre Mergulhão
categories:
  - Sylvestre Mergulhao
  - Rails
  - Ruby
  - Postgresql
  - Heroku
  - GitHub
  - HTML5
  - CSS3
  - JavaScript
  - jQuery
  - AngularJS
  - Ember.js
  - Memcached
  - Redis
  - Elasticsearch
  - Hadoop
  - SendGrid
  - DNSimple
---

Na HE:labs nós trabalhamos com aplicativos web e integrações. Algumas pessoas me perguntam quais são as tecnologias e serviços que utilizamos. Vou listar algumas dessas ferramentas, também citando os principais motivos de as utilizarmos.

<!--more-->

## Framework web: Rails

Nós utilizamos muito [Ruby on Rails](http://en.wikipedia.org/wiki/Ruby_on_Rails). Quando fundei a HE:labs em 2010 haviam poucas empresas no Brasil que trabalhavam majoritariamente com Ruby on Rails. Eu já era fascinado pelo framework há muitos anos, tendo trabalhado por algum tempo com ele para empresas do Brasil e do exterior. Não havia nenhum interesse em voltar a trabalhar com ambientes de desenvolvimento burocráticos e engessados. Então ficou definido que, pelo menos por um bom tempo (que ainda não acabou), essa seria nossa plataforma principal.

Foi muito bom esse foco, nos trouxe especialização na plataforma e hoje somos capazes de implementar coisas extremamente complexas em muito pouco tempo. Nos deu a capacidade de possuir um time coeso onde todos tem um grande domínio do framework e também da linguagem, que é o [Ruby](http://en.wikipedia.org/wiki/Ruby_(programming_language\)).

Isso não quer dizer que não possamos utilizar outras tecnologias, mas com restrições. Se um cliente quer desenvolver uma _plataforma inteira_ exclusivamente em [PHP](http://en.wikipedia.org/wiki/PHP) ou [Java](http://en.wikipedia.org/wiki/Java_(programming_language\)), por exemplo, não pegamos o trabalho. Mas temos a flexibilidade de conhecer o suficiente dessas e outras linguagens para fazer integrações necessárias entre softwares que as utilizem e as plataformas em Ruby on Rails. Já fizemos esses tipos de integrações utilizando Java, PHP, Python e até coisas em linguagens bem mais exóticas.

Também já trabalhamos em aplicativos com [Node.js](http://en.wikipedia.org/wiki/Node.js), o que mostrou que ele pode ter um futuro promissor, mas ainda imaturo no momento.

Mesmo em outras linguagens, fora do mundo Ruby, ainda desconheço um framework tão avançado, maduro e completo quanto o Ruby on Rails que possa se tornar um novo divisor de águas no médio prazo para aplicações web complexas. Então, por enquanto, o Ruby on Rails vai continuar fazendo parte da nossa stack principal.

## Banco de dados: PostgreSQL

Há alguns anos atrás o [MySQL](http://en.wikipedia.org/wiki/MySQL) reinava como banco de dados open source principal do universo. Em muitas empresas ainda é assim, mas sua adoção vem caindo consideravelmente desde a aquisição pela Oracle. Mesmo antes dessa aquisição, optamos por ficar com o [PostgreSQL](http://en.wikipedia.org/wiki/PostgreSQL) por inúmeros motivos, dentre eles: o fato de ser um banco de dados de altíssimo nível, suportado por uma comunidade open source muito comprometida, alto desempenho, com funcionalidades que de outra forma só estariam disponíveis em bancos proprietários. Em resumo: um banco de dados de verdade para aplicações sérias.

Nesse meio tempo, o [Heroku](http://en.wikipedia.org/wiki/Heroku) (explicado abaixo) adotou o PostgreSQL como banco de dados do seu serviço de hosting, o que para nós foi uma mão na roda.

Conforme o tempo passou o PostgreSQL foi se tornando ainda mais completo e bem suportado, o que mostrou um grande acerto na nossa aposta de termos o adotado.

Em diversos projetos já utilizamos [MongoDB](http://en.wikipedia.org/wiki/MongoDB), mas em nenhum deles ficamos convencidos de que foi realmente a melhor opção. Sempre funcionou, mas nunca demonstrou nada que o PostgreSQL também não pudesse resolver perfeitamente. Em suas últimas versões o PostgreSQL adicionou funcionalidades características de bancos [NoSQL](http://en.wikipedia.org/wiki/NoSQL) e também de fornecimento de dados utilizando [JSON](http://en.wikipedia.org/wiki/JSON). O que parece desbancar por completo a utilização do MongoDB no curto prazo.

Além dos citados, também já tivemos que fazer integrações, importações e outras coisas do gênero em bancos de dados como [Firebird](http://en.wikipedia.org/wiki/Firebird_(database_server\)), [MS SQL](http://en.wikipedia.org/wiki/Microsoft_SQL_Server) e outras esquisitices.

## Hospedagem: Heroku

Hospedagem é um problema desde que a internet existe. Em tempos remotos da era da internet, com a queda de um serviço, as vezes era necessário alguém se deslocar fisicamente até um local para simplesmente apertar um botão. Felizmente esse tempo já passou pra mim há muitos anos. Com os serviços em cloud popularizados pela [Amazon AWS](http://en.wikipedia.org/wiki/Amazon_Web_Services) ficou muito fácil e barato manter uma infraestrutura com alta disponibilidade e alta escalabilidade com administração 100% remota.

Mas, apesar de ser 100% remoto, isso não exclui a necessidade de existir essa administração. Softwares precisam ser atualizados. Patches de segurança precisam ser aplicados. Logs precisam ser monitorados. Serviços que param de funcionar precisam ser reiniciados. A manutenção existe e precisa ter alguém tomando conta dessa infraestrutura.

O [Heroku](http://en.wikipedia.org/wiki/Heroku), que começou como um editor online para aplicativos Ruby on Rails, faz um [pivot](http://en.wikipedia.org/wiki/Lean_startup#Pivot) em sua proposta de valor e passa a endereçar o problema da administração da infraestrutura de aplicativos web. No começo suportando apenas Ruby on Rails, mas hoje com suporte a dezenas de plataformas.

Para a HE:labs, que quer sempre entregar o máximo valor para o cliente no menor custo possível é o casamento perfeito. Nos permite focar no que somos os melhores que é fazer aplicativos web incríveis, muito rapidamente. E assim podemos deixar toda a administração e monitoramento da infraestrutura dos aplicativos com o Heroku. Eles tem feito isso de forma sensacional, melhor a cada dia. Já experimentamos outras plataformas como serviço, [PAAS](http://en.wikipedia.org/wiki/Platform_as_a_service) no termo em inglês, mas todas estão a anos-luz de distância.

Mesmo assim, alguns clientes optam por terem sua própria infraestrutura. Uns por simples opção, outros por questões legais, o que dá para entender nos dois casos. Isso gerou um conflito interno na empresa. Afinal queremos é fazer o melhor software do mercado e não ficar tomando conta de servidores. Para resolver esses casos criamos um branch, chamado [HE:clouds](http://heclouds.com.br/), que trata exclusivamente de administração de infraestrutura, incluindo serviços de suporte 24x7, e atende os clientes que não tem interesse em utilizar o Heroku.

Ainda hoje me perguntam: "Mas você não tem sala de servidores na sua empresa?". Eu digo: "Não, pra que?". E depois tenho que rir!

## Controle de versão: GitHub

Quando se está desenvolvendo software é necessário que o código fonte do projeto esteja armazenado em algum lugar. Esse lugar precisa estar acessível para todos os envolvidos no projeto. Mais importante do que simplesmente guardar os arquivos, esse lugar precisa permitir verificar que mudanças foram feitas no software, quando foram feitas, por qual motivo, etc. No meio acadêmico da [engenharia da computação](http://pt.wikipedia.org/wiki/Engenharia_de_computa%C3%A7%C3%A3o) isso de chama [gerência de configuração](http://pt.wikipedia.org/wiki/Ger%C3%AAncia_de_configura%C3%A7%C3%A3o_de_software).

Nós utilizamos o [GitHub](http://en.wikipedia.org/wiki/GitHub), que na nossa visão é o que dispõe das melhores funcionalidades para trabalhar em softwares que estão com desenvolvimento ativo. O GitHub utiliza o controlador de versão [Git](http://en.wikipedia.org/wiki/Git_(software\)) como backend.

## Front-end

Como estamos falando de web, ou seja, principalmente aplicativos que rodam no navegador, algumas coisas são básicas como [HTML 5](http://en.wikipedia.org/wiki/HTML5), [CSS 3](http://en.wikipedia.org/wiki/Cascading_Style_Sheets#CSS_3), [JavaScript](http://en.wikipedia.org/wiki/JavaScript) em diversos frameworks ([jQuery](http://en.wikipedia.org/wiki/JQuery), [Angular](http://en.wikipedia.org/wiki/AngularJS), [Ember.js](http://en.wikipedia.org/wiki/Ember.js), etc) e estão todas dentro do nosso escopo de trabalho e largamente utilizadas.

Nos meus estudos recentes me parece que o Ember.js é uma ótima aposta de um framework JavaScript que pode ter um grande futuro. O tempo dirá.

## Outros

Há outros softwares que também estão presentes com frequência nas aplicações que desenvolvemos.

Se precisamos salvar dados específicos para fazermos consultas rápidas chave/valor ou sistemas de cache é comum utilizarmos [Memcached](http://en.wikipedia.org/wiki/Memcached) ou [Redis](http://en.wikipedia.org/wiki/Redis).

Quando precisamos fazer uma busca inteligente em uma grande massa de dados utilizamos o [Elasticsearch](http://en.wikipedia.org/wiki/Elasticsearch), sendo o [Hadoop](http://en.wikipedia.org/wiki/Apache_Hadoop) também uma ótima opção para massas de dados gigantes.

Para disparar e-mail usamos o sensacional [SendGrid](http://en.wikipedia.org/wiki/SendGrid), que nunca, na vida, me retornou uma mensagem de erro! Esses caras são brabos.

Também utilizamos o [DNSimple](https://dnsimple.com/), que deixa extremamente fácil configurar o DNS de todos os seus domínios.

Compartilhe também o que você utiliza e recomenda. Um abraço!