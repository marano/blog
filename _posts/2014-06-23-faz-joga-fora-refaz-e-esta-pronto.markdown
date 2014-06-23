---
layout: post
title: "Faz, joga fora, refaz e está pronto!"
author: Rafael Lima
categories:
  - agile
  - otimização
  - boas praticas
  - performance
  - upload de imagens
  - rafael lima
---

Uma história real da implementação de uma funcionalidade deixa claro que, diferente do que parece, o fato de usarmos bibliotecas prontas, não torna trivial o desenvolvimento do sistema e que muitas vezes vale a pena mudar a estratégia escolhida, mesmo que isso signifique mais trabalho. De quebra compartilho minhas decisões técnicas para a implementação de um sistema de upload de arquivos.

Este post tem um viés técnico, mas é de fácil leitura e relevante para quem está contratando desenvolvimento ou orientando uma equipe.
<!--more-->

## A falácia da programação como pecinhas de Lego.

Atualmente estou programando o [Boleto Simples](http://boletosimples.com.br), um produto que sou um dos fundadores e que está sendo desenvolvido também pela HE:labs.

O Boleto Simples é um sistema que requer uma série de validações de segurança. Dentre todas, é requerido que o usuário envie cópia dos documentos pessoais, comprovante de endereço, e outros arquivos. Para tal se fez necessário um _"simples upload de arquivo"_.

<span title="Homenagem ao Vinis ;-)">Pára tudo!</span> Eu sempre digo que **NENHUMA funcionalidade é simples**. As funcionalidades podem ser fáceis para algum desenvolvedor, e fácil é diferente de simples. Desenvolver software é um trabalho complexo por natureza, visto que **nenhum software é igual a outro**. Se você está desenvolvendo qualquer coisa, é por que não existe outra igual já feita. Ter isso com premissa, te fará mais feliz ao fazer o seu próprio software.

A parte de qualquer sistema que pode ser aproveitada em outro software acaba virando uma biblioteca, as vezes pagas e as vezes open-source. Elas são usados para agilizar o desenvolvimento de novos softwares. Isso é muito comum na nossa realidade. A HE:labs, por exemplo, colabora com [alguns projetos open-source](http://helabs.com.br/opensource/).

Diferente do que parece, o fato de usar bibliotecas prontas não torna o desenvolvimento trivial. Eu já ouvi diversas vezes pessoas falando: "Mas isso já foi feito antes, então agora você vai fazer rapidinho. É só montar o que está pronto."

Realmente, olhando de fora e considerando que existem partes prontas, parece que o trabalho se resume apenas a montar as peças, como brincar de Lego. Pois bem, não é assim que funciona. Quando estamos programando, as decisões de como estruturar o código de programação vão muito além disso. Muito mais difícil que montar as *pecinhas*, é escolher que *pecinhas* usar. Invariavelmente existem dezenas de *pecinhas* que "fazem a mesma coisa". O grande problema é que embora existam bibliotecas (as *pecinhas*) que resolvem o mesmo problema, cada uma faz de forma diferente. E a forma com que resolvem um mesmo problema, faz toda a diferença no resultado final.

Fora isso, mesmo que você use bibliotecas, o resultado final também muda bastante, por que cada software tem contexto, restrições e necessidades especiais. Vejamos um exemplo.

## Fiz 100 vezes a mesma coisa pela primeira vez.

Eu já implementei fucionalidades de upload de arquivos, no mínimo uma centena de vezes na minha vida. Sim, você leu certo, mais de 100 vezes. Desde a minha época de programar em [Perl](http://www.perl.org/) (em 1998) eu já implementava upload de arquivo. A partir dessa informação você me diz:

\- "Sendo assim, tendo experiência o suficiente, fazer um *upload de arquivo* é simples, certo?"

Eu respondo:

\- "Não. Errado."

Você insiste:

\- "Você já fez isso diversas vezes, certamente já sabe quanto tempo demora pra fazer, e por consequência quanto custa fazer *um upload de arquivo*?"

Eu respondo:

\- "Não faço a mínima ideia."

Você pensa:

\- "Esse cara é retardado. Como é possível ter feito a mesma coisa 100 vezes e não saber quanto tempo vai demorar e quanto vai custar!?"

Eu penso na mesma hora:

\- "Ele está achando que eu estou de sacanagem. Hora de me explicar."

Existe uma pegadinha nessa história. E ela está na premissa de que eu fiz a mesma coisa diversas vezes. Embora estamos nos referindo a *upload de arquivo* como uma coisa única, não é.

Considerando que eu implementei *upload de arquivo* 100 vezes, posso afirmar tranquilamente que no mínimo foram 80 implementações COMPLETAMENTE diferentes. Em outras palavras, posso garantir que 80% da vezes foram implementações diferentes. Então na verdade, na maioria das vezes eu implementei *o upload de arquivos* pela primeira vez.

Eu não sou retardado :)

Um parênteses. Parece que estou escrevendo isso para meus os cliente, certo? Sim, quero que eles entendam essas coisas, mas eu escrevo aqui principalmente para os desenvolvedores. Eu canso de ver desenvolvedor que acha que "*upload de arquivo*" ou "*formulário de contato*" são demandas estanques e previsíveis. Não são.

No caso do upload de arquivos, são inúmeras as variáveis que fazem com que uma implementação seja diferente da outra. Vamos lá, vou listar apenas algumas:

- Qual a linguagem de programação será usada?
- O envio é de apenas um arquivo ou múltiplos arquivos?
- Os arquivos são textos, binários ou imagens?
- Qual o tamanho médio dos arquivos?
- Qual o fluxo de telas para o upload?
- Como esses arquivos serão armazenados?
- Quais os botões e cliques até que o arquivo seja enviado?
- Qual o feedback visual que o usuário precisa receber para certificar que o arquivo está sendo enviado?
- O que fazer quando ocorre um erro de conexão no meio do envio?
- Qual o processamento que será feito com o arquivo após o envio?
- Que tipo de validação precisa ser feita? Tipo de arquivo? Tamanho do arquivos?
- Precisa mostrar uma pré-visualização antes de enviar (no caso de imagens)?

Enfim, a regra aqui é nunca considerar que você já sabe como fazer a funcionalidade da forma ideal de primeira. Para concluir a melhor forma de fazer, é necessário algumas experimentações. Temos até o nome pra isso, chama-se [Spike](http://www.extremeprogramming.org/rules/spike.html).

## Uma história real de implementação de "upload de arquivos".

Quando comecei a implementação do upload de documentos no Boleto Simples eu escolhi fazer da forma mais comum que é sugerida na maioria dos casos para aplicações [Rails](http://rubyonrails.org/).

Para o back-end eu escolhi usar o [Paperclip](https://github.com/thoughtbot/paperclip), uma biblioteca muito boa e completa. Há quem diga que o [Carrierwave](https://github.com/carrierwaveuploader/carrierwave) é melhor. Conheço e já usei, mas não foi minha escolha.

Para o front-end eu escolhi usar o [dropzonejs](http://www.dropzonejs.com/) que já estava presente no [FlatLab](http://themeforest.net/item/flatlab-bootstrap-3-responsive-admin-template/5902687), tema que eu uso no projeto.

A hospedagem fica a cargo do [Heroku](http://heroku.com) e o storage dos arquivos foi configurado para usar a [Amazon S3](http://aws.amazon.com/pt/s3/).

Cheguei a implementar o fluxo de telas, cliques, submissão do formulário, configurações, etc.

O que ocorreu de inusitado é que depois de tudo praticamente pronto, eu avaliei a implementação, e tive a vontade de mudar tudo. Sim, apagar o que tinha feito e refazer a programação toda!

Eu queria mudar por que não gostei da estratégia. Na implementação que eu fiz, o arquivo era enviado do navegador diretamente para o back-end e depois era enviado para o Amazon S3. Um fluxo assim:

Navegador (Front-end) -> Heroku (Back-end) -> Amazon S3 (Storage)

Essa foi a forma mais rápida de implementar, fiz em menos de um dia. Mas eu não gostei, por que em termos de escalabilidade de infra-estrutura, enviar um arquivo direto para o back-end da própria aplicação, principalmente no Heroku, é um problema.

O back-end deve sempre "liberar" as chamadas que recebe do front-end de forma bem rápida (em milissegundos). Nessa estratégia descrita acima, cada chamada de envio de arquivo do front-end para o back-end iria demorar o tempo de transferência do arquivo. Então, caso o usuário enviasse um arquivo grande (de 5 megabytes por exemplo), a requisição ia ficar "presa" por minutos (ao invés de milissegundos). Isso iria causar um grande problema de performance, principalmente por que como se trata de envio de documentos que em geral são digitalizados, o risco de vários usuários enviarem arquivos grande é muito alto.

Aí que vem o dilema. Manter do jeito que está ou implementar de uma forma que resolva a performance?

## A decisão de refazer tudo é sensata!?

Uma parte de mim quer gastar o mínimo possível de tempo e dinheiro e ter a funcionalidade feita o mais rápido possível, de forma mais otimizada, economizando no que puder. Esse é meu lado empreendedor.

A minha outra parte quer fazer de forma que funcione bem, que não gere suporte, que não dê erro nenhum e que esteja garantido que vai funcionar. Esse é meu lado desenvolvedor.

Essas duas visões são conflitantes. E chegar no equilíbrio é bem difícil. O grande desafio é conseguir chegar no ponto em que gasta-se o necessário para ter algo que funcione bem.

Esse dilema acontece com frequencia nos meu projetos pessoais. Para mim, tomar essa decisão é **relativamente** fácil visto que eu sou ao mesmo tempo o cliente e o desenvolvedor e consigo avaliar rapidamente o trade-off.

Mesmo assim, antes de tomar a decisão de refazer tudo que eu tinha feito, eu "deixei o código descançar". Ou seja, eu parei o que eu estava fazendo, deixei um dia passar, dormi pensando no problema e só depois tomei a decisão. Nesse momento eu estava decidindo o peso que eu queria dar para o meu lado empreendedor e pro meu lado desenvolvedor.

## Qual seria uma opção melhor (para esse caso)?

Eu comecei a buscar como seria a outra forma de fazer, que evitasse que o arquivo fosse enviado direto do front-end para o back-end da minha aplicação.

Na última vez que me deparei com essa necessidade, a solução era usar um Flash que fazia upload direto do navegador para o Amazon S3. Mas ter que usar Flash é sempre ruim e isso eu não estava disposto a fazer.

Pensei em criar uma outra app somente para receber os arquivos. Com isso, poderia configurar o deploy de forma específica e otimizada para requisições grandes e demoradas e isso não ia criar gargalo na aplicação principal. Essa é uma solução interessante, porém cara de fazer e principalmente de difícil manutenção.

Eu queria uma solução que não gerasse um overhead de manutenção, fosse relativamente fácil de implementar e principalmente escalável, mesmo que ficasse mais cara. Veja quantas coisas sendo avaliadas aqui!

Depois de alguns estudos e de me atualizar nas novidades do mercado, encontrei dois serviços que podiam me ajudar. O [Transloadit](https://transloadit.com/) e o [Cloudinary](http://cloudinary.com/). Ambos possuem add-ons no Heroku e são pagos. Optar por usá-los iria aumentar o custo mensal da aplicação.

Eu estudei os dois. Quando digo estudar os dois, isso significa criar uma conta, ler as APIs, e rodar uns códigos pra ver como o webservice funciona. Isso toma tempo.

No final desses estudos eu já tinha informação o suficiente para poder fazer minha escolha.

## Fazendo a escolha mais difícil, porém a melhor (para esse caso).

Escolher por jogar tudo fora e refazer era mais difícil. Mas foi isso que eu fiz.

Eu escolhi por usar o Cloudinary. Por conta de escolher o Cloudinary eu tive que mudar todo o stack. O Cloudinary funcionou como parte do back-end e storage dos arquivos. O Amazon S3 como backup e para o front-end passei a usar o [jQuery File Upload](https://github.com/blueimp/jQuery-File-Upload), por que ela é dependência da [biblioteca front-end do Cloudinary](http://cloudinary.com/documentation/jquery_integration). O fluxo ficou mais ou menos assim:

Navegador (Front-end) -> Cloudinary (Back-end/Storage) -> Amazon S3 (Storage/Backup)

Ou seja, o upload do arquivo nem passa pela minha aplicação no Heroku.

Foi custoso implementar tudo baseado nesse serviço, pois tive que entender no detalhe o fluxo, as APIs, etc. Mas acabei com uma solução bastante escalável que pode crescer.

Aí você pode perguntar: "Mas isso não seria otimização pré-matura? Não deveria deixar pra depois?"

Eu digo que nesse caso não. Embora essa decisão pareça técnica, ela foi muito mais de negócio do que técnica.

O Boleto Simples é um sistema que só faz sentido se tiver um volume alto de usuários. Nas metas internas estamos prevendo a entrada de centenas de novos usuários por mês já a partir do primeiro mês, chegando na casa dos milhares de novos usuários mensalmente.

Essa funcionalidade será usada por todos os usuários que irão gerar receita. Ou seja, é uma parte crítica para que o negócio começe a dar dinheiro. Ter problema nessa funcionalidade significaria perder receita diretamente. Poderia ser uma funcionalidade a parte, menos relevante e usada por um número mínimo de usuários, mas não é.

Ter uma solução que desse conta de centenas de usuários de uma só vez era super relevante. Por isso fiquei feliz com o resultado final e não me arrependo. No mais, vale dizer que a decisão foi tomada após eu já ter feito da forma mais simples, ou seja, eu tinha todas as informações em mãos para poder comparar.

## Lições aprendidas

Sabe que lição que eu aprendi nesse caso?

Nenhuma!

Sinceramente eu não aprendi nada aqui. O que aconteceu é natural pra mim, eu sei que desenvolver software é assim e tudo que aconteceu está dentro da minha expectativa.

Eu sei que na próxima vez que eu implementar qualquer coisa, inclusive um upload de arquivo, esse dilema pode acontecer novamente e invariavelmente a necessidade de refazer tudo também.

Hoje o Cloudinary resolveu o meu problema, mas não quer dizer que ele vai resolver sempre. Vou continuar usando a estratégia de enviar direto pro back-end em alguns casos. Também vou avaliar outros serviços, como o Transloadit em outros casos. Enfim, o fato de ter feito assim dessa vez não garante que é dessa forma que tenho que fazer sempre.

Eu poderia ter evitado esse trabalho a mais?

Teoricamente sim, mas na prática não.

**Na prática, desenvolver software é um processo de descoberta.**

Achar que vai ser possível acertar de primeira, sem fazer spikes e sem fazer experimentações é burrice. A tecnologia evolui, as bibliotecas evoluem, os protocolos mudam, os navegadores são atualizados com mais suportes.

Eu não falei aqui por exemplo da barra de progresso que mostra o percentual do arquivo que já foi enviado para o servidor. Voltando lá nos anos 90 isso não era nem possível de fazer, a web não suportava isso. Hoje em dia já suporta. Na minha próxima implementação de upload de arquivo é possível que já hajam novas bibliotecas com recursos mais avançados para upload em dispositivos móveis, por exemplo. Pode ser que exista um novo serviço de processamento mais poderoso. E por aí vai....

Essa evolução natural vai fazer com que eu tenha que aprender tudo de novo e estruturar o meu código de outra forma.

É inocência achar que agora estou livre de ter que jogar uma parte do código fora pra fazer outro. Isso sempre vai acontecer! Se não acontecer é por que tem alguma coisa muito errada e que o código ficou uma bosta.

Espero que esse caso real possa ajudá-lo a enxergar o desenvolvimento de software com mais clareza, a aceitar refazer para melhorar e por fim te faça mais feliz fazendo o seu sistema, seja como empreendedor ou como desenvolvedor.

Um abraço e até a próxima.
