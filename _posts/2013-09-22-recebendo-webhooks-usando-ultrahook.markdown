---
published: false
author: Thiago Borges
layout: post
title: "Recebendo webhooks usando Ultrahook"
date: 2013-10-01 14:00
comments: true
categories:
  - webhook
  - ultrahook
  - Thiago Borges
---

Durante uma integração com um sistema pagamento, precisava saber quando o status do pagamento era alterado. Uma solução seria rodar um cron job pra ficar verificando este status. O processamento poderia demorar 2 segundos ou 2 dias, então esta maneira não é tão eficiente. Com que frequência eu deveria checar esse status? Felizmente, alguns serviços enviam um _ping_ avisando que o status do pagamento foi atualizado e assim, quando eu quiser, posso tomar alguma providência. Nesse caso, a providência foi checar o status do pagamento na API do provedor de pagamento e atualizar o seu valor no sistema. Esse _ping_ é o webhook e é dele que vou falar nesse post.

<!--more-->

Webhook é uma excelente alternativa para ser notificado quando algum evento ocorre no lado do serviço utilizado. Serviços como [Github][github], [Stripe][stripe], [ActiveCampaign][activecampaign] e [Papertrail][papertrail] utilizam webhooks. No caso do Github, seu webhook envia um JSON com as informações do evento que acabou de acontecer. O template em Ruby que gera essas informações no formato JSON pode ser visto [aqui][gh-template].

Uma característica dos webhooks é que eles são enviados como POST, mas infelizmente é difícil receber essa notificação em ambiente de desenvolvimento, visto que mesmo que meu IP seja enviado para receber o callback do webhook, geralmente estamos atrás de um roteador com firewall. Definir o meu IP no código fonte para receber a chamada pode dificultar muito quando estamos trabalhando em equipe, além de ser errado, então encontrei a solução para todos esses problemas: o [Ultrahook][ultrahook].

Ultrahook é uma gem que cria um endpoint público do tipo: `http://borges.projeto.ultrahook.com` onde `projeto` é o namespace e `borges` é definido quando executo o ultrahook da seguinte forma: `ultrahook borges 3000`.

Esta gem não expõe completamente seu servidor de desenvolvimento. Ela apenas redireciona as requisições do tipo POST para o seu servidor, logo, ninguém conseguirá acessar seu sistema.

Como fazer pra usá-la nos projetos tendo o mínimo de [overhead][]?

#### Registre-se gratuitamente no site do [ultrahook][] e salve sua API key.


#### Adicione ao seu projeto a variável de ambiente contento o chave do ultrahook:
  {% highlight bash %}
  export ULTRAHOOK_API_KEY=0pMcxt1yJrTjUBrGabXrezCRzGRjPsig
{% endhighlight %}
  Essa chave é a mesma usada no exemplo do site oficial, então não tem problema colocar aqui.

#### Altere a url do callback caso o projeto seja executado em desenvolvimento:
  {% highlight ruby linenos %}
def charge(callback_uri)
  callback_uri = "http://#{ENV['USER']}.projeto.ultrahook.com/callback" if Rails.env.development?
  client.charge({
    amount: 10.0,
    callback_uri: callback_uri
  })
end
{% endhighlight %}

Usar a variável de ambiente **USER** foi a melhor maneira que encontrei pra evitar colisão com outros membros da equipe.

#### Adicione a gem ao seu Gemfile apenas no grupo development:
  
  {% highlight ruby %}
  gem 'ultrahook', group: :development
{% endhighlight %}

#### Quando estiver esperando por uma resposta, execute o seguinte comando, onde 3000 é a porta padrão do servidor Rails:
  
  {% highlight bash %}
  ultrahook $USER 3000
{% endhighlight %}

# Conclusão

Esta foi a maneira mais fácil de solucionar o meu problema. No caso do callback de pagamento, geralmente a única informação que chega é o ID do pagamento que deve ser consultado em seguida.

Embora seja feita em Ruby, esta gem pode ser usada no desenvolvimento de qualquer sistema, precisando apenas de uma adaptação mínima da equipe. O resultado final é que em poucos passos e apenas um comando, uma tarefa que seria complexa se torna extremamente simples.

Você gostou dessa solução ou conhece alguma outra? Deixe seu comentário.

#### Links

- [Site Pessoal](http://www.thiagoborg.es)
- [Twitter](http://twitter.com/tgabrielborges)
- [Github](https://github.com/thiagogabriel)

[ultrahook]: http://www.ultrahook.com/
[github]: https://github.com
[stripe]: https://stripe.com
[activecampaign]: http://www.activecampaign.com
[papertrail]: https://papertrailapp.tenderapp.com
[overhead]: http://pt.wikipedia.org/wiki/Overhead_(computa%C3%A7%C3%A3o)
[dotenv-rails]: https://rubygems.org/gems/dotenv-rails
[gh-template]: https://gist.github.com/tekkub/2732968
