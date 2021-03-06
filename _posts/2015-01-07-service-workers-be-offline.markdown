---
layout: post
title: "Service Workers: Be Offline"
author: Beto Muniz
hide_author_link: true
categories:
  - service workers
  - javascript
  - beto muniz
  - offline
  - offline first
  - user experience
  - ux
---

Offline... Um estado totalmente fora do propósito principal da web que é: Estabelecer **comunicação** e estar **online** na grande rede mundial, mas partindo das seguintes perguntas: E se a conexão do usuário cair? Como se comunicar com o usuário de um sistema web sem a necessidade do browser? Como criar um elo entre o mundo Online e Offline para uma melhor experiência dos usuários? Enfim...Estes e outros inúmeros problemas surgiram com o decorrer da evolução da web, e é justamente para solucionar alguns destes problemas que foi criado o padrão **Service Workers**. E para entender melhor sobre o padrão, precisamos compreender a real necessidade de criar uma aplicação *Offline Friendly*, e para tal, precisamos entender o conceito **Offline First**.
<!--more-->
## Offline First

Partindo do próprio nome do conceito, a definição básica sugere um foco no estado Offline de qualquer funcionalidade ou etapa da aplicação, seja no ambiente de execução, planejamento, desenvolvimento entre outros aspectos para concepção de uma aplicação web ou não, pois o objetivo real com isso é que independente de como for a experiência criada, o produto final não irá perder seus estados funcionais e comunicativos com o usuário caso não exista conexão.

![Google Chrome Offline Experience](http://i.imgur.com/clwc4Qw.gif)

## Beleza, mas e esse Service Workers? Onde entra nisso?

Service Workers é um tipo de Web Worker, que por sua vez é uma execução em background, ou seja, fora do runtime da aplicação, que inclui funcionalidades para se trabalhar com recursos Offline, mesmo que a etapa deste processo se inicie pelo meio Online.

**Beleza, mas isso não é nada diferente do que eu encontraria lendo a especificação. E por isso...**<br>

Prefiro definir o Service Workers, como um guarda-chuva de funcionalidades, que facilitam o trabalho Offline através de recursos como: background sync, push notifications, cacheamento de requisições e segurança na implementação. Mas não vamos deixar isso pra lá, porque não falar um pouco de alguns dos conceitos sob esse guarda-chuva, não é? 

**E lá vamos nós...**

## Background Sync

Mecanismo que proporciona e facilita a sincronia de operações entre servidor e aplicação, sem depender de um intermediário, ou seja, o browser. O *Background Sync* cria processos locais em background que habilitam plena execução de sua aplicação offline e sem a necessidade de um browser aberto para resolução de tais processos.

## Push API

A Push API permite a captura de "mensagens" do servidor para seu webapp, e isso quer dizer que será possível habilitar a comunicação de Server Events com sua aplicação, e claro, sem necessidade de ter um browser aberto. Mas entenda que mensagens, não quer dizer apenas Notificações Desktop, mas também dados sendo enviados pelo servidor para uma aplicação "instalada" no seu computador.

## Request Interception

Request Interception significa, claro interceptação, mas também armazenamento local de qualquer tipo de requisição, ou seja, será possível armazenar requisições de folhas de estilos, scripts JavaScript, imagens, XHR, beacons, etc. Com exceção apenas para requisições adicionadas de Iframes e Objects ou adicionadas pelos mesmos, a requisição do próprio Service Worker e também requisições feitas dentro do Service Worker. A aplicação dessa funcionalidade, talvez seja a mais destacada, pois de certa forma cria a possibilidade de armazenar/instalar toda a aplicação dentro do browser para acesso Offline, visto que se por exemplo, você armazenar as requisições de todos os arquivos do domínio *`mywebsite.com`*, você poderá acessar este domínio pelo browser, mesmo sem internet e ele irá requisitar os arquivos locais, mas isso claro, obriga que você tenha acessado este site com internet pelo menos uma vez anteriomente.

## HTTPS Only

A ideia de deixar a utilização de Service Workers funcional apenas com HTTPS habilitado, talvez tenha sido uma das melhores ideias adotadas dentro desse guarda-chuva, pois ela abre um potencial enorme de uso, além dos já demonstrados claro, pois essa adoção valida o uso consciente e seguro de Service Workers, sendo assim, o uso do padrão terá que ser obrigatóriamente HTTPS, e isso vale também para qualquer uma das requisições armazenadas. Uma dica para quem gosta de fazer testes, é utilizar o Github Pages.

**Ok! E como fazemos para controlar o potencial dos Services Workers?**

Para utilização dos Service Workers foi criada uma API para que os browsers possam utilizar eventos disparados quando detectado o uso da funcionalidade, e esses eventos por sua vez são controlados via JavaScript.

## Lifecycle dos Service Workers

**install**: Evento disparado no momento de registro do algoritmo de aplicação do Service Worker no navegador.<br>
**activate**: Evento disparado quando já existe ou o worker for ativo.<br>
**fetch**: Evento disparado como requisição, este evento retorna um *Response Object* que pode ser capturado por um Objeto de cacheamento e manipulado.

## Mas melhor do que falar...

Um simples **hello world** do uso de Service Workers seria:

Primeiramente, a detecção de suporte da funcionalidade pelo browser corrente e registro do script do Service Worker desejado.

{% highlight javascript linenos %}
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(function(registration) {
    // Registro realizado com sucesso (NOTA: Observe que declaro um arquivo chamado sw.js, ele é onde colocaremos as notações do nosso Service Workers)
    console.log('O ServiceWorker foi registrado com escopo: ',    registration.scope);
  }).catch(function(err) {
    // O registro falhou :(
    console.log('O registro do ServiceWorker falhou com o erro: ', err);
  });
}
{% endhighlight %}

No arquivo *sw.js* é definido o nome do Service Worker, o que será cacheado em um *Array* e por fim na **instalação** do Service Worker utilizamos o **objeto de cache** retornado para adicionar **todos** os arquivos previamente declarados para cacheamento.

{% highlight javascript linenos %}
var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  '/index.html',
  '/styles/main.css',
  '/script/main.js'
];

self.addEventListener('install', function(event) {
  event.waitUntil( /* Este método estende o evento ONINSTALL e aplica um estado ao evento chamado ONINSTALLING */
    caches.open(CACHE_NAME) /* O objeto caches é criado com um namespace e retorna uma Promise */
      .then(function(cache) {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache); /* E por fim, conseguimos manipular o objeto de cache corrente */
      })
  );
});
{% endhighlight %}

## Interessante, mas onde vou poder trabalhar com esta funcionalidade?

Como mencionei no início, Service Workers é um padrão guarda-chuva de outros padrões e para entender o real suporte desses padrões nos browsers atuais, recomendo que acessem o site [Is Service Worker Ready?](https://jakearchibald.github.io/isserviceworkerready/), pois nele é possível analisar todos os padrões abaixo desse guarda-chuva e também quais browsers implementaram cada um deles.

## E pra fechar...

Gostaria de agradecer a leitura e espero que este post seja apenas mais um ou o primeiro de muitos que você venha a ler sobre este padrão que surge para quebrar de vez a barreira do Online e do Offline na web. 

## Referências
 - [Introduction to Service Worker](http://www.html5rocks.com/en/tutorials/service-worker/introduction/)
 - [Dominando o ambiente offline por Erick Belfort](https://speakerdeck.com/erickbelfy/serviceworker-dominando-o-ambiente-offline)
 - [Offline Web com Service Workers por Sérgio Lopes](http://pt.slideshare.net/caelumdev/serviceworkers-sergio)
 - [W3C Spec](http://www.w3.org/TR/service-workers/)
 - [Service Worker](https://github.com/slightlyoff/ServiceWorker)
 - [event.waitUntil](https://slightlyoff.github.io/ServiceWorker/spec/service_worker/#wait-until-method)
