---
layout: post
title: "Usando HTTPS em uma aplicação Rails - Parte 1"
author: Alex Stoll
categories:
  - segurança
  - ruby
  - rails
  - HTTPS
  - SSL
---

Garantir que dados sigilosos sejam transmitidos com segurança entre o servidor
e o computador do usuário é de primeira importância. Este artigo explica o
que é o HTTPS e como habilitá-lo em sua aplicação Ruby on Rails.
<!--more-->
Atualmente, muitas aplicações lidam com dados importantes e sigilosos, como senhas
(muitos usuários reutilizam uma mesma senha em várias aplicações) e dados de
cartão de crédito. É, portanto, crucial que os desenvolvedores usem as tecnologias
adequadas para garantir que essas informações não sejam expostas.

Este é um artigo introdutório ao uso de HTTPS em aplicações Ruby on Rails. Nele,
veremos um pouco da teoria por trás do HTTPS e também o início do desenvolvimento
de uma aplicação para demonstrar os conceitos aqui explicados. Ao fim deste artigo,
a aplicação ainda **não** estará terminada, nem poderá ainda ser executada. Usar
HTTPS em ambiente de desenvolvimento requer algumas configurações um pouco trabalhosas,
que serão cobertas apenas na segunda parte desta série.

### HTTPS

É o protocolo HTTP (_Hypertext Transfer Protocol_) **em modo seguro**. Na verdade,
o HTTPS não é um protocolo por si só, mas sim o protocolo HTTP em funcionamento
sobre o protocolo SSL / TLS (_Secure Sockets Layer / Transport Layer Security_). O resultado
dessa combinação é podermos ter aplicações web normais, acessadas via navegador, que realizem
a transmissão de dados importantes com segurança.

O HTTPS é seguro porque, ao usarmos esse "protocolo", as mensagens trocadas entre
o computador do usuário e o servidor onde está a nossa aplicação trafegam cifradas pela
Internet. Dessa forma, mesmo que sejam interceptadas, não poderão ser compreendidas ou
modificadas pelo atacante.

Se você deseja saber mais detalhes sobre esses protocolos,
suas páginas na Wikipedia ([HTTP Secure](http://en.wikipedia.org/wiki/HTTP_Secure) |
[SSL / TLS](http://en.wikipedia.org/wiki/Transport_Layer_Security))
são um bom ponto de partida (estão bem escritas e ancoradas por fontes confiáveis).

### Entendendo a criptografia com chaves simétricas e assimétricas

No uso do HTTPS, ocorre a utilização de criptografia com
chaves simétricas e também assimétricas. Na seção a seguir, serão explicados os passos
de acesso a uma página Web via HTTPS com maiores detalhes. Por enquanto, é importante entender
a diferença entre essas duas técnicas: se a criptografia utilizar chaves simétricas, **a mesma chave** é usada
para cifrar e para decifrar a mensagem; por outro lado, quando são utilizadas
chaves assimétricas, **códigos diferentes** são utilizados para cifrar e decifrar mensagens.

### O que acontece quando acesso uma página Web via HTTPS?

1. O servidor envia seu certificado digital, autenticado por uma autoridade de certificação.
Esse certificado serve a dois principais propósitos: assegurar que a resposta veio
de fato do site que se desejava acessar e informar a **chave pública** do servidor.

2. O cliente verifica o certificado e, caso não haja problemas, **gera uma chave simétrica**
que será usada para a sessão atual. A chave gerada é, então, cifrada com a **chave pública
do servidor** e por fim lhe é enviada.

3. A mensagem chega ao servidor e é decifrada com o uso da **chave privada do servidor**. A partir
desse ponto, as mensagens trocadas pelo servidor e pelo computador do usuário (somente na sessão atual)
serão cifradas com a **chave simétrica criada pelo computador do usuário** no passo 2.

É importante entender que as **chaves assimétricas** são utilizadas com o objetivo de transmitir com segurança
a **chave simétrica** gerada pelo computador do usuário. É esta última, de fato, que vai ser utilizada
para cifrar as mensagens que serão trocadas pelo servidor e pelo cliente após esse processo inicial de validação
ser concluído.

(Se você tem um bom ouvido para Inglês - e consegue entender sotaques - recomendo [este vídeo](https://www.youtube.com/watch?v=JCvPnwpWVUQ&list=FLt15cp4Q09BpKVUryBOg2hQ&index=3)
para uma explicação bastante detalhada e fácil de entender sobre HTTPS)

### Iniciando nossa aplicação de demonstração

Para nossa aplicação de demonstração, usaremos as versões mais novas do Ruby e do Rails disponíveis
no momento em que este artigo é escrito: Ruby 2.1.3 e Rails 4.1.6

Nossa aplicação de demonstração será extremamente simples e terá os seguintes objetivos:

- Demonstrar como fazer especificações RSpec de controlador que testem o uso do HTTP / HTTPS
em diferentes ações de um controlador
- Demonstrar o redirecionamento de HTTP para HTTPS usando o force_ssl do próprio Rails
- Desenvolver nosso próprio force_http, que fará o inverso do force_ssl (na parte 2 deste artigo)
- Ser capaz de testar manualmente nossa aplicação, mesmo em ambiente de desenvolvimento (na parte 2 deste artigo)

### Começando pelas especificações

Nossa aplicação terá duas áreas (duas ações no controlador DemoHttpsController): na área insegura,
forçaremos o uso do HTTP; na área segura, sempre deverá ser usado o HTTPS.

{% highlight ruby linenos %}
require 'rails_helper'

RSpec.describe DemoHttpsController do
  describe 'GET insecure_area' do
    context 'with HTTP' do
      before { get :insecure_area }

      it { expect(response).to be_success }
    end

    context 'with HTTPS' do
      before do
        request.env['rack.url_scheme'] = 'https'
        get :insecure_area
      end

      it { expect(response).to have_http_status('301') }
    end
  end

  describe 'GET secure_area' do
    context 'with HTTP' do
      before { get :secure_area }

      it { expect(response).to have_http_status('301') }
    end

    context 'with HTTPS' do
      before do
        request.env['rack.url_scheme'] = 'https'
        get :secure_area
      end

      it { expect(response).to be_success }
    end
  end
end
{% endhighlight %}

Como a especificação define, a área insegura (_insecure_area_) faz o redirecionamento de requisições
via HTTPS para que usem HTTP. A área segura (_secure_area_), por sua vez, força o HTTPS fazendo o redirecionamento
de requisições que tenham sido realizadas via HTTP.

Nesse código, é importante destacarmos a seguinte linha:

{% highlight ruby %} request.env['rack.url_scheme'] = 'https' {% endhighlight %}

Essa linha é fundamental para que a requisição seja feita usando o HTTPS e possamos testar essa funcionalidade
de nossa aplicação.

### Escrevendo o controlador DemoHttpsController

Agora que já temos nossa especificação RSpec do controlador, é hora de começar a implementar o seu código.
Aqui, usaremos o método force_ssl do Rails, especificando a quais ações ele deve se aplicar.
Para as ações configuradas, será feito um redirecionamento usando o HTTPS caso a requisição
original do usuário tenha sido realizada via HTTP.

{% highlight ruby linenos %}
class DemoHttpsController < ApplicationController
  force_ssl only: [:secure_area]

  def insecure_area
  end

  def secure_area
  end
end
{% endhighlight %}

Para maiores informações sobre o force_ssl, [veja seus detalhes](http://api.rubyonrails.org/classes/ActionController/ForceSSL/ClassMethods.html#method-i-force_ssl)
na documentação da API do Rails.

### Continua...

Na parte 2 deste artigo, escreveremos nosso método force_http para fazer o oposto do force_ssl
e veremos um exemplo de configuração para se rodar a aplicação - incluindo o uso de HTTPS -
em um ambiente local de desenvolvimento.
