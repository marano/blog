---
layout: post
title: "Usando HTTPS em uma aplicação Rails - Parte 2"
author: Alex Stoll
categories:
  - segurança
  - ruby
  - rails
  - HTTPS
  - SSL
---

Esta é a parte final do artigo que publiquei no final do último mês
sobre HTTPS em Rails. Aqui, configuraremos nosso ambiente de desenvolvimento
usando o NGINX como proxy reverso e criaremos uma pequena biblioteca para forçar
o redirecionamento via HTTP daquelas áreas de nossa aplicação que são
de fato "inseguras".
<!--more-->

Parte final do artigo sobre uso do HTTPS em aplicações Rails. Se você perdeu a primeira
parte, clique [aqui](http://helabs.com.br/blog/2014/10/30/usando-https-em-uma-aplicacao-rails-parte-1/) para a ler antes de continuar.

Com pressa? Vá direto ao [repositório](https://github.com/alexbrahastoll/demo-https-rails) criado para esta demonstração no GitHub.

### Melhorando nossas especificações

Nosso controlador DemoHttpsController deve fazer os redirecionamentos
com o protocolo correto para cada cenário. Se o usuário tentar acessar
a área insegura com HTTPS, devemos fazer o redirecionamento via HTTP;
em contrapartida, o redirecionamento deve ser via HTTPS caso o usuário
tente acessar a parte segura de nossa app usando o HTTP.

Como especificado na [RFC 2616](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.3.2)
do [W3C](http://www.w3.org/), redirecionamentos 301 (Moved Permanently) devem possuir, no campo Location do cabeçalho da resposta, uma URI (curiosidade: [URIs x URLs](http://danielmiessler.com/study/url_vs_uri/)) que identifica o recurso para o qual deve ocorrer o redirecionamento. Em nosso contexto, podemos
sempre esperar uma URL, o que significa que estará lá incluso o protocolo a ser utilizado (HTTP ou HTTPS) .
Para obter o protocolo a ser usado no redirecionamento, podemos adicionar a seguinte linha a
nossa especificação:

{% highlight ruby linenos %}
  let(:redirect_protocol) { response.header['Location'].split(':').first }
{% endhighlight %}

E, depois, verificar se o redirecionamento está ocorrendo com o protocolo correto para cada um
dos contextos. Por fim, nossas especificações vão ficar assim:

{% highlight ruby linenos %}
require 'rails_helper'

RSpec.describe DemoHttpsController do
  render_views
  let(:redirect_protocol) { response.header['Location'].split(':').first }

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

      it { expect(response).to have_http_status(301) }
      it { expect(redirect_protocol).to eq('http') }
    end
  end

  describe 'GET secure_area' do
    context 'with HTTP' do
      before { get :secure_area }

      it { expect(response).to have_http_status(301) }
      it { expect(redirect_protocol).to eq('https') }
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

Observação: incluí uma chamada a `render_views` porque não escreverei especificações para a
camada de visão nesse tutorial. `render_views` fará as interfaces relacionadas a cada ação
serem processadas, o que vai nos alertar sobre algum erro grosseiro que possamos ter cometido
ao codificá-las. Você pode conferir as interfaces deste tutorial no
[reposítorio GitHub](https://github.com/alexbrahastoll/demo-https-rails)
criado para este artigo.

### Implementando o método force_http

É bem capaz que uma aplicação possua áreas nas quais não é necessário o acesso
via HTTPS. Melhor ainda: é possível que em uma aplicação haja áreas nas quais o acesso
via HTTPS irá causar problemas, já que é necessário - por exemplo - exibir imagens
ou incluir arquivos JavaScript disponíveis em um servidor que não está dando suporte
ao SSL (no caso de imagens, apenas será exibido um alerta; no entanto, scripts incluídos
via HTTP em uma página que foi carregada via HTTPS nem chegarão a ser executados).

Para evitar que essas áreas de nossa aplicação sejam acessadas via HTTPS, iremos criar um
método muito parecido com o `force_ssl` disponibilizado pelo Rails. Para aqueles que são
curiosos como eu, recomendo inclusive que explorem o [código fonte](https://github.com/rails/rails/blob/v4.1.6/actionpack/lib/action_controller/metal/force_ssl.rb)
do `force_ssl`.

Esse método é simples e o seu objetivo já deve estar claro pelo próprio nome que escolhemos:
ele se chamará `force_http` porque a ideia é justamente forçar o acesso a certas áreas via HTTP,
fazendo um redirecionamento caso o acesso inicial tenha acontecido via HTTPS. Seu arquivo de
código fonte ficará em lib/force_http.rb e a sua implementação será a seguinte:

{% highlight ruby linenos %}
module ForceHTTP
  def self.included(base)
    base.extend ClassMethods
  end

  module ClassMethods
    def force_http(actions)
      before_action :force_http_redirect, only: actions
    end
  end

  def force_http_redirect
    if request.ssl?
      options = {
        protocol: 'http://',
        host: request.host,
        path: request.fullpath
      }

      flash.keep
      insecure_url = ActionDispatch::Http::URL.url_for(options)
      redirect_to insecure_url, status: :moved_permanently
    end
  end
end
{% endhighlight %}

A ideia é que esse método possa ser usado de forma muito parecida com o `force_ssl`, isso
direto em nossos controladores. Por isso, faremos com que ele faça parte da classe
`ActionController::Base` (`ApplicationController` por padrão é subclasse de `ActionController::Base`).
A estratégia que adotaremos requer dois passos. Primeiro, temos de adicionar o diretório lib
ao `autoload_paths` do Rails:

{% highlight ruby linenos %}
config.autoload_paths << Rails.root.join('lib')
{% endhighlight %}

Depois, criaremos config/initializers/action_controller_ext.rb, onde `ActionController::Base`
será aberta e lá incluíremos o nosso módulo `ForceHTTP`:

{% highlight ruby linenos %}
ActionController::Base.class_eval do
  include ForceHTTP
end
{% endhighlight %}

Quando nossa aplicação Rails for iniciada, o initializer action_controller_ext.rb será interpretado,
resultando nos seguintes acontecimentos:

1. Estamos tentando incluir o módulo `ForceHTTP` à classe `ActionController::Base`, no entanto
esse módulo ainda não foi carregado. Como adicionamos o diretório lib ao `autoloads_path`
do Rails, o framework também procurará ali por um arquivo nomeado force_http.rb. O arquivo
não só existe como também define corretamente o módulo `ForceHTTP`, resultando no carregamento
desse módulo sem que ocorra qualquer problema.
2. Graças ao código do método `included` de `ForceHTTP`, os métodos dentro do módulo interno
`ClassMethods` serão incluídos como métodos de classe em `ActionController::Base`. Resultado final:
`force_http` ficará disponível como um método de classe para `ActionController::Base` e suas
subclasses, enquanto que `force_http_redirect` ficará disponível como um método de instância (o que
é perfeito já que este método será chamado pelas instâncias do controlador `DemoHttpsController` - que criaremos a seguir - quando houver a necessidade de redirecionar o usuário via HTTP).

### Implementando DemoHttpsController

Agora que já temos nossas especificações de controlador prontas e também o método
`force_http` implementado, é hora de partirmos para o controlador `DemoHttpsController`.

Conforme as especificações que escrevemos antes, esse controlador devo possuir duas
actions: `insecure_area` é a nossa área insegura e `secure_area` é a nossa área
protegida. Caso uma ação seja acessada com o protocolo errado, deve haver um redirecionamento
usando o protocolo adequado para a ação em questão. Isso será feito por meio dos métodos
`force_ssl` e `force_http`.

O código de `DemoHttpsController` ficará assim:

{% highlight ruby linenos %}
class DemoHttpsController < ApplicationController
  force_ssl only: [:secure_area]
  force_http [:insecure_area]

  def insecure_area
  end

  def secure_area
  end
end
{% endhighlight %}

As interfaces relacionadas a cada uma dessas actions estão disponíveis no [repositório GitHub](https://github.com/alexbrahastoll/demo-https-rails)
criado para este demo.

### Configurando hosts e o NGINX

Para acessar nossa app mais facilmente pelo browser e garantir que as configurações que iremos
fazer no NGINX não afetem (quando ele estiver rodando) outras aplicações com as quais estejamos
trabalhando localmente, adicionaremos o seguinte mapeamento no arquivo hosts (pesquise onde
fica esse arquivo em sua distribuição Linux ou na versão do OS X que estiver usando):

```
127.0.0.1  dev.demo-https-rails
```

Usaremos o NGINX como um proxy reverso, ou seja, ele irá receber todas as requisições feitas
para dev.demo-https-rails e as encaminhará para o servidor de aplicação que está executando
nossa app (você pode usar o que preferir; a aplicação demo que disponibilizo está usando o Puma).

Pelas pesquisas e testes que fiz, a forma mais fácil de rodar uma app Rails que utilize HTTPS
é assim com o NGINX (ou Apache se preferir) sendo usado como proxy reverso. Como HTTP e HTTPS usam portas diferentes,
os redirecionamentos de um protocolo para o outro não funcionarão _out of the box_ se estivermos
utilizando apenas um servidor de aplicação como o Puma por exemplo.

Nossas configurações do NGINX ficarão como segue:

_Os caminhos dos arquivos são os de uma instação padrão do NGINX no Ubuntu._

**(/etc/nginx/nginx.conf)**

```
user  nginx;
worker_processes  1;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;

    include /etc/nginx/conf.d/rev_proxy_ruby.conf;
}
```

**(/etc/nginx/conf.d/rev_proxy_ruby.conf)**

```
# HTTP / HTTPS reverse proxy to a Ruby webserver

server {
  server_name   dev.demo-https-rails;
  listen        80;
  listen        443 ssl;
  send_timeout  3600; # Timeout only after 1 hour (for debugging with breakpoints)

  ssl_certificate            /etc/nginx/server.crt;
  ssl_certificate_key        /etc/nginx/server.key;
  ssl_session_cache          shared:SSL:1m;
  ssl_session_timeout        5m;
  ssl_ciphers                HIGH:!aNULL:!MD5;
  ssl_prefer_server_ciphers  on;

  location / {
    proxy_set_header  Host $host;
    proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header  X-Forwarded-Proto $scheme;
    proxy_redirect    off;
    proxy_pass        http://localhost:3000;
  }
}
```
### Gerando nosso certificado digital

Na primeira parte deste artigo, explicamos os dois principais propósitos
de um certificado digital: assegurar que o site sendo acessado é, de fato,
aquele que se deseja visitar e também transmitir ao cliente a chave pública
usada pelo servidor.

Os navegadores modernos só aceitam automaticamente certificados assinados por autoridades
de certificação. Nesta seção do artigo criaremos nossa própria chave pública e assinaremos
nosso próprio certificado. Isso fará o navegador nos alertar sobre o certificado inseguro
quando acessarmos nossa aplicação, no entanto esses alertas não nos impedirão de navegarmos
em nossa app e testarmos os comportamentos esperados.

Para criar uma chave pública e assinar um certificado usando o [OpenSSL](https://www.openssl.org/)
(é necessário ter o toolkit do OpenSSL instalado em sua máquina), execute o seguinte comando:

```
openssl req -new -newkey rsa:2048 -sha1 -days 365 -nodes -x509 -keyout server.key -out server.crt
```
Ao executar esse comando, lembre-se de usar o nome do mapeamento que criamos acima no arquivo
hosts (_dev.demo-https-rails_) no momento em que for pedido um valor para o _Common Name_.
Assim, o browser não acusará que o certificado não pertence
ao servidor que está sendo acessado (ainda assim, o navegador alertará que o certificado não
foi assinado por uma CA - Certificate Authority).

Rode esse comando dentro de **/etc/nginx** ou lembre-se de copiar os arquivos gerados para esse
diretório (note que é o caminho usado em **rev_proxy_ruby.conf**, o arquivo de configuração que acabamos
de criar no passo anterior).

Caso queira entender o que cada um dos parâmetros da chamada ao openssl significa, [veja aqui](http://makandracards.com/makandra/15901-howto-create-a-self-signed-certificate).

### Executando e testando nossa aplicação

_Importante: nesta seção, considero que nossas interfaces já estão prontas. Caso
você queira ver um exemplo interessante de como poderíamos criar interfaces simples
para testar as funcionalidades aqui implementadas, veja o
[repositório](https://github.com/alexbrahastoll/demo-https-rails/tree/master/app/views) deste projeto._

Estamos prontos para ver o funcionamento de nossa aplicação no navegador! Antes disso,
no entanto, vamos verificar se todas as nossas especificações estão passando:

**(dentro do diretório raiz do projeto)**

```
bundle exec rspec
```

Agora que todos os specs passaram, estamos prontos para ver no browser o funcionamento
de nossa app.

Recarregue os arquivos de configuração do NGINX

```
sudo nginx -s reload
```

_Ou inicie o servidor com `sudo nginx`_

**(dentro do diretório raiz do projeto)**

```
bundle exec rails s
```

Caso o seu navegador mostre um alerta de segurança quando você tentar acessar
[https://dev.demo-https-rails/secure_area](https://dev.demo-https-rails/secure_area),
basta confirmar que deseja realmente acessar a página e continuar.

![Alerta de certificado digital não confiável no Google Chrome](/blog/images/posts/2014-12-11/demo-certificate-not-trusted.png)

_No Google Chrome, basta clicar em "Show advanced" e depois em "Proceed to dev.demo-https-rails (unsafe)"._

Pronto! Navegue entre as diferentes páginas e observe que cada seção só pode ser
acessada usando-se o protocolo que foi especificado para ela. Dica: use o console
de seu navegador predileto para observar as respostas às requisições HTTP / HTTPS
e os redirecionamentos acontecendo quando tentamos acessar uma das áreas com o protocolo
inadequado.

![Página da área segura da aplicação](/blog/images/posts/2014-12-11/demo-secure-area.png)

_Interface da área segura. Disponível no repositório GitHub deste demo._

### Considerações finais

Caso você queira implantar uma app em produção com suporte ao HTTPS, você irá precisar
comprar um certificado digital de um Certificate Authority. Existem vários
tipos de certificado (essa [resposta](http://security.stackexchange.com/a/13454)
do StackExchange enumera e explica as diferenças entre os diversos tipos), sendo
que os mais simples podem ser comprados por menos de US$ 20,00.

Apesar de não ter sido o foco do artigo, você certamente pode usar as configurações
do NGINX aqui mostradas como um ponto de partida, especialmente se a sua aplicação não exigir
uma infraestrutura complexa.

Hoje, o processo de compra e configuração de um certificado é um pouco burocrático
e demanda certo tempo e conhecimento. No entanto, é bem possível que para meados
de 2015 esse processo se torne muito mais rápido, graças a uma iniciativa da
[Electronic Frontier Foundation](https://www.eff.org/). O projeto, batizado
de [Let's Encrypt](https://www.eff.org/deeplinks/2014/11/certificate-authority-encrypt-entire-web),
vai permitir que certificados sejam obtidos gratuitamente e de maneira automatizada, em cerca
de 30 segundos apenas!

Espero que o artigo tenha sido útil a vocês, leitores. Caso tenham uma dúvida ou queiram fazer
algum outro tipo de colocação, é só deixar um comentário! Até a próxima.










