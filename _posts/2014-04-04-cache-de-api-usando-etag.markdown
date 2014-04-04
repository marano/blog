---
author: Thiago Borges
layout: post
title: Cache de API usando ETag
comments: true
categories:
  - thiago borges
  - cache
  - api
  - etag

---

Duas preocupações que existem ao desenvolver uma API com boa performance são tempo de resposta e trafegar "pouca" informação. Uma das soluções para essa situação é o uso do cache e nesse post vou abordar a técnica usando ETag.

<!--more-->

ETag, abreviação de "entity tag", é um mecanismo de cache a nível do protocolo HTTP. O uso de ETags é padrão no Rails desde sua versão 3.0 e seu valor, que é determinado por um *digest* do conteúdo gerado no servidor, é enviado no cabeçalho das requisições HTTP. Sempre que um conteúdo relevante é alterado na resposta do servidor, a ETag também muda e expira. Desta forma, o servidor define se o cliente pode usar o conteúdo previamente armazenado na última requisição (HTTP status-code: 304) ou se o servidor precisa enviar uma nova resposta (HTTP status-code: 200).

Ao chamar a API pela primeira vez, não temos nenhum valor de ETag armazenado no cliente.

{% highlight bash %}
  $ curl -I http://localhost:3000/articles/1.json
  HTTP/1.1 200 OK
  Etag: "0835b0c055a88af2d0ef4f6890cee95d"
{% endhighlight %}

Agora, se fizer uma nova requisição com essa ETag, a resposta é diferente:

{% highlight bash %}
  $ curl -H 'If-None-Match: "0835b0c055a88af2d0ef4f6890cee95d"' -I http://localhost:3000/articles/1.json
  HTTP/1.1 304 Not Modified
  Etag: "0835b0c055a88af2d0ef4f6890cee95d"
{% endhighlight %}

O HTTP status-code é 304 e isto quer dizer que o conteúdo não foi modificado. Essa "economia" só existe se o ETag for enviado no cabeçalho da requisição. E então, esse comportamento deve ser tratado pelo cliente. Como a resposta é "não modificado", o corpo dessa requisição vem completamente em branco.

Como descrito acima, o padrão do Rails é usar o conteúdo da resposta para gerar o ETag e a performance cai muito quando a resposta é grande. Uma alternativa é utilizar os metodos `stale?` ou `fresh_when` que estão no módulo [ActionController::ConditionalGet][conditional_get].

#### #stale?
`stale?`, que quer dizer vencido/expirado, verifica se a ETag e/ou Last-Modified da requisição ainda são válidos ou já expiraram. Caso ainda forem válidos, ele chama `head :not_modified` e o cliente pode confiar no conteúdo que já possui. Já, se os valores não forem mais iguais, o bloco é executado.


{% highlight ruby linenos %}
def show
  @article = Article.find(params[:id])

  if stale?(@article)
    render json: @article
  end
end
{% endhighlight %}


#### #fresh_when
Este método faz o mesmo que `stale?`, porém sua estrutura é simplificada.

{% highlight ruby linenos %}
def show
  @article = Article.find(params[:id])

  fresh_when @article
  if response.status == 200
    render json: @article
  end
end
{% endhighlight %}

Note que, internamente, `fresh_when` já determina o status da resposta
como 304 "Not Modified". Esse método faz mais sentido quando não precisa
de um render customizado após o seu uso. É o caso de aplicações web que executam
o render padrão.

Usar esses métodos com objeto do ActiveRecord retorna o MD5 do `@article#cache_key`
associado à ETag e também @article#updated_at associado à Last-Modified.

## Resultado
Após usar o metodo `stale?`, o tempo de processamento do servidor é
reduzido consideravelmente. Vai de `(Views: 0.5ms | ActiveRecord: 0.1ms)`
para `(ActiveRecord: 0.1ms)`. Economizamos 0.5ms deixando de renderizar um json mínimo.
Este benchmark é impreciso, pois está rodando com as configurações locais
em ambiente de desenvolvimento. Porém, já podemos ter uma noção do ganho.
O correto seria avaliar no ambiente real, usando ferramentas melhor elaboradas
como [New Relic](http://www.newrelic.com).

## Conclusão
Para diminuir a complexidade da demonstração, uma API foi usada como exemplo.
Porém, os mesmos conceitos deste post podem ser aplicados em aplicações web.

Outro ponto é que não é interessante se preocupar com tanta otimização no
início da aplicação. Isso aumenta a complexidade, além de dificultar a
testabilidade e manutenibilidade. Como foi falado no post do [Mergulhão](mergulhao_heroku),
a hora de um bom desenvolvedor geralmente é o recurso mais caro no processo
de desenvolvimento de software. Então um upgrade em uma plataforma como o
heroku não parece mais tão caro.

O uso de ETags já é nativo nos browsers mais modernos, desde que seja
implementado no servidor. Caso seja algum outro tipo de cliente
consumindo, como um aplicativo mobile, toda a lógica de armazenamento de
ETag e análise das respostas devem ser implementadas pelo desenvolvedor.
Isso vai salvar sua aplicação do consumo excessivo de dados e poupar o
processamento do servidor.


Referências:

* [Adam Hawkins - Advanced caching](http://hawkins.io/2012/07/advanced_caching_part_1-caching_strategies/)
* [Heroku Devcenter](https://devcenter.heroku.com/articles/http-caching-ruby-rails)

[conditional_get]: http://api.rubyonrails.org/classes/ActionController/ConditionalGet.html
[mergulhao_heroku]: http://helabs.com.br/blog/2013/07/23/custos-invisiveis/
