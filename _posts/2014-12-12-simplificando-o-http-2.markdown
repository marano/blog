---
layout: post
title: Simplificando o HTTP 2.0
author: Beto Muniz
hide_author_link: true
categories:
  - beto muniz
  - protocolos
  - http2
  - spdy
---

Antes de começar o post, quero destacar que o assunto abordado nele é sem dúvidas um dos principais tópicos sobre o futuro da web, e por isso é imprescindível sua leitura, mas tenha em mente que isso não é tudo, ou seja, não deixe de buscar mais conteúdo sobre **HTTP 2.0** daqui pra frente.
<!--more-->

Mas vamos lá...vamos ao que interessa...

## HTTP 2.0? Um novo carro? Outro Duro de Matar?

Para entendermos a nova versão do **HTTP**, é interessante conhecermos a atual versão e o que é de fato o HTTP.

### HyperText Transfer Protocol

Sendo bem objetivo, HTTP é a sigla para *HyperText Transfer Protocol*, e que por sua vez, é um protocolo de comunicação entre sistemas para transferência de dados e que tem o seu maior uso na web, e neste mesmo cenário ele utiliza mais dois protocolos, que são o **TCP** e o **IP**, necessários para conexão entre *Web Clients* e *Web Servers*.

Mas melhor do que escrever, a imagem abaixo ilustra como funciona este fluxo de comunicação dos Web Clients e Web Servers, mais especificadamente **browsers** e **servidores**:

![HTTP Flow](/blog/images/posts/2014-12-12/http-flow.png)

Bem simples, não é? E é isso que acontece a cada requisição feita pelas páginas que você navega.

## HTTP/1.1 Sucks

Para contrastarmos a nova versão do protocolo HTTP, vale realçar os problemas da versão atual de implementação, tanto para o mundo web futuro e também para o atual, para isso irei listar fatores negativos do **HTTP/1.1**:

**Insegurança**: Dando como exemplo um caso não muito antigo, temos a *NSA*, que utilizou-se de interceptações de comunicação HTTP para capturar dados sem autorização de vários indíviduos, mas o problema real neste caso, é que hoje nem toda comunicação é feita utilizando **SSL** e mesmo as que atualmente utilizam tal forma de criptografia poderiam ser melhoradas.

**Performance**: Atualmente você envia uma requisição *(request)*, espera o processamento do servidor e por fim recebe uma resposta *(response)*, isso é até funcional, porém infelizmente tanto os cabeçalhos da request e também o corpo da response são poluídos e não recebem otimizações em momento algum, o que aumenta o trabalho de processamento e o volume de trafégo.

**Comprensão e Otimização**: Toda compressão, seja minificando o tamanho dos arquivos e/ou aplicando gzip é manual e também deficiente, por exemplo, quando você aplica *GZIP* em um arquivo, apenas o corpo da response é comprimido, sem contar que aplicações de técnicas como Sprites CSS, Concatenação, Minificação ou aplicação inline de JavaScript ou CSS são necessárias e também manuais, e muita das vezes fora do contexto da plataforma web.

**Limitação de Requests**: Dependendo do browser, você consegue fazer de **4 a 8 requisições simultâneas** por domínio, mas pensando no atual estado de desenvolvimento, 4 ou até 8 requests, somando imagens, folhas de estilos, scripts JavaScript, etc. **É muito pouco**, mesmo podendo amplificar isso com o uso de *CDN's* ainda não é o ideal, pois de qualquer maneira, você não poderá contar com várias funcionalidades da web moderna, como *HTML Imports*, *ECMAScript modules* entre outras, ou seja, não podemos continuar limitando a evolução da web, e por isso surgiu esta nova versão do HTTP.

## Legal...então o que é o HTTP/2.0?

Basicamente, é uma nova versão para o HTTP que foi idealizada pela Google beseando-se no SPDY, que por sua vez, também é um protocolo de transporte de dados desenvolvido pela Google.

Mas seguindo o modelo anterior, irei listar os benefícios que a versão 2.0 do HTTP aplica:

## HTTP/2.0 Rocks

**Segurança**: SSL por default, ou seja, todo servidor que for trabalhar com HTTP/2.0 deverá **obrigatoriamente ser HTTPS** em qualquer estado de comunicação. Outro ponto forte sobre segurança é a representação eficiente dos headers utilizando-se de **HPACK** (Header Compression). E por fim, a **conversão binária dos dados** já criptografados e otimizados em todas as requisições, seja *request* ou *response*.

**Performance**: GZIP por default, visando otimização de trafégo.

**Requests**: Através do **Multiplexing**, que basicamente é uma **conexão TCP assíncrona**, poderemos transcender as limitações atuais para **múltiplos requests simultâneos**, sem esperar a resposta do servidor de requests bloqueantes e assim, não sendo mais necessário fazer concatenação de arquivos, Sprites CSS, etc. Sim, parece mentira, mas não é, pois qual é o sentido de você ter 100gb de velocidade de internet e poder baixar apenas 4/8 arquivos por vez? Eis agora a solução.

**Otimizações**: Ainda falando de *requests*, mas também de *responses*, ambos os estados de comunicação serão otimizados a nível de processamento, visto que muito dado trafegado é redundante, como o *METHOD*, *HOST*, etc. Agora, apenas o que é necessário, será selecionado e cacheado, mas sempre atualizando caso exista alguma informação nova.

**Prorização de conteúdo**: Este benefício é muito legal, visto que como agora estamos falando em requests assíncronos, em primeiro momento iremos notar que não teremos controle no time de load de alguns recursos, por exemplo, ao abrir uma página que possui requisições para um arquivo **index.html**, **style.css** e **imagem.jpg**, o primeiro arquivo que preciso carregar seria obviamente o *index.html*, mas nesse mundo assíncrono, o *index.html* poderia ser último a chegar, o nome deste recurso é chamado de Server Push, que basicamente enviará todos os arquivos requisitados de uma vez e não em fila, mas tal técnica, pode e deve ser cancelada para determinados casos, no nosso exemplo, iríamos cancelar o Server Push para o *index.html*, mas com relação ao *style.css* ou o *imagem.jpg* não tem importância a ordem de carregamento, sendo assim, deixaríamos o carregamento ser simultâneo e  otimizaríamos o loading da página.

Irado né? Isso é o que teremos pra trabalhar...

## Beleza... vou instalar hoje!

O único problema do HTTP/2.0 é que nem todos os servidores e navegadores dão suporte ainda, abaixo segue uma lista de navegadores que já adotaram de certa forma a nova versão do protocolo.

  - No Internet Explorer é suportado no IE 11 do Windows 10 Technical Preview;
  - No Firefox está habilitado por default desde a versão 34;
  - No Chrome é suportado, mas não por defeault, para habilitar, é necessario ativar a flag "*--enable-spdy4*".

Daí aparece aquela velha dúvida ...e se caso você ou o usuário do seu sistema precise utilizar um browser antigo ou uma conexão sem SSL? O que basicamente irá acontecer, será uma conversão automatizada do protocolo para o uso default do HTTP/1.1, é como se o browser perguntasse pro servidor: Ei servidor, você tem HTTP/2.0 habilitado? Se ele tiver, ele já responde com a nova forma, caso contrário, ele responde da forma comum na web, é bem traquilo, isso é chamado de **Graceful Degradation**. E por falar em servidores...

Os atuais servidores ou plataformas que já possuem módulos para HTTP/2.0 são:

  - Nginx
  - Ruby
  - GoLang
  - NodeJS
  - Java

Mas há outros em implementação, dê uma olhada no respositório do projeto [HTTP2](https://github.com/http2/http2-spec/wiki/Implementations) para saber mais sobre isso.

E além disso tudo, também existe o SPDY, como mencionei anteriormente, mas explicando melhor, ele é como um *Polyfill* do HTTP/2.0 que possibilita trabalhar com algumas das features do protocolo padrão e em quase todos os browsers atuais, como pode ser visto [aqui](http://caniuse.com/#search=spdy). E com relação a servidores e plataformas, as implementações mais estáveis do SPDY são no NodeJS, Ruby, Nginx, Apache e no Jetty.

## E pra finalizar...

Vale lembrar que o HTTP/2.0 é um padrão e que será finalizado no dia 08 de Junho de 2015, o que já é motivo suficiente para aprender mais sobre ele desde já, mas vale mencionar que *drafts* relacionadas a **versão 3.0** do protocolo estão saindo, ou seja, fique ligado, pois isso será uma realidade comum e quanto antes aprender melhor...

Mas é isso pessoal, espero que tenham gostado e qualquer dúvida, é só deixar um comentário...

## Referências

[Especificação do HTTP/2.0](http://http2.github.io/http2-spec)
[Portal oficial do desenvolvimento do HTTP/2.0](https://http2.github.io/)<br>
[Nine Things to Expect from HTTP/2.0](https://www.mnot.net/blog/2014/01/30/http2_expectations)<br>
[As fantásticas novidades do HTTP 2.0 e do SPDY by Caelum](http://blog.caelum.com.br/as-fantasticas-novidades-do-http-2-0-e-do-spdy/)<br>
[Slides: Rumo ao HTTP 2.0 - O que vem por aí e o que você pode utilizar com SPDY by Sérgio Lopes](https://docs.google.com/a/helabs.com.br/presentation/d/1BVyBcR5AE2kwY7akcmM0O3dDJ5TccY3ew0U9Ux7wsQs/pub?start=false&loop=false&delayms=3000&utm_content=buffer7886e&utm_medium=social&utm_source=twitter.com&utm_campaign=buffer&slide=id.p)<br>
[Wikipedia FTW!](http://en.wikipedia.org/wiki/HTTP/2)