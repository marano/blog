---
published: true
author: Francisco Martins
layout: post
title: "Olá, Firefox OS"
date: 2014-01-23 17:00
comments: true
categories:
  - francisco martins
  - Firefox OS
  - Mobile
  
---

Já faz um tempo que eu curto desenvolvimento de apps para smartphones. Falei anteriormente [sobre Rubymotion][0] para iOS e agora vou falar sobre a minha pequena experiência com Firefox OS há pouco tempo. Conheci esse OS na Campus Party 2013 e curti bastante o conceito: uma plataforma que nativamente tem apps em HTML/JS/CSS.

Foi uma experiência interessante e é sobre isso que eu vou falar nesse post.

<!--more-->

Hoje, o Firefox OS ainda não tem muita aceitação e dificilmente conquistará uma parcela significativa no mercado de smartphones. Isto deve-se por não ser fácil competir com a Apple, Google e Microsoft, mas apesar disso, eu tinha vontade de me aventurar nessa plataforma.

Nosso cliente na HE:labs pediu que transformássemos seu site num aplicativo para essa plataforma. Eu, de prontidão, tomei a frente e peguei a tarefa para mim.

A primeira coisa que você precisa entender é: existem 2 tipos de aplicativos que podemos fazer (**Packaged** e **hosted**).

Minha tarefa era transformar o site em um app instalável para FFOS. Então, é um **hosted**. Se você for usar arquivos locais e fazer requisições com ajax, é um app **Packaged**.

É bem simples: seu site precisa fornecer um arquivo de manifesto com a extensão *.webapp* e o *Content-Type* da resposta deve ser "application/x-web-app-manifest+json".
Por exemplo: *http://meusite.com/manifest.webapp* retorna uma resposta com um json no formato abaixo:


{% highlight json linenos %}
  {
    "version": "1.0",
    "name": "Nome do Site",
    "description": "",
    "launch_path": "/",
    "icons": {
      "128": "/images/icon-128.png"
    },
    "developer": {
      "name": "Seu nome aqui",
      "url": "http://seusiteaqui.com.br"
    },
    "installs_allowed_from": ["*"],
    "default_locale": "pt-BR"
  }
{% endhighlight %}

Em desenvolvimento, é possível testar isso usando o **curl** e o simulador do FFOS.

{% highlight bash linenos %}
$ curl -I http://localhost:3000/manifest.webapp
 HTTP/1.1 200 OK
 Content-Type: application/x-web-app-manifest+json
 ...
{% endhighlight %}

Para validar seu manifesto, você pode usar o [validador da Mozilla][1]. A documentação completa você encontra [aqui][2].

Se você tiver um site com visual mobile *first* ou *responsivo*, é super fácil. E ainda, se preferir um app **Packaged**, o manifest vai ser um arquivo local junto com o html, css e js.

Para testar no simulador do FFOS, você deverá instalar o simulador como um plugin do Firefox, disponível [aqui][3].



[0]: http://helabs.com.br/blog/2013/10/09/rubymotion-desenvolvimento-de-apps-nativos-para-ios-com-ruby/
[1]: https://marketplace.firefox.com/developers/validator
[2]: https://developer.mozilla.org/en-US/Apps/Developing/Manifest
[3]: https://addons.mozilla.org/pt-br/firefox/addon/firefox-os-simulator/
