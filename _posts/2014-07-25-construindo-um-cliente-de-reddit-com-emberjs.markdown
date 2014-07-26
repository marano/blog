---
layout: post
title: "construindo um cliente de reddit com emberjs"
author: Marcio Junior
comments: true
categories:
  - Ember.js
  - Javascript
  - Marcio Junior
---

Ember.js é um framework javascript MVC que atua do lado cliente. Seus criadores foram Yehuda Katz e Tom Dale,
mas atualmente recebe contribuições de diversos desenvolvedores no github. 

Iremos aprender a criar um cliente com base na api do reddit.

<!--more-->

# Pre requisitos

Para esse tutorial usaremos o [ember-cli](http://www.ember-cli.com/), que é a interface de linha de comando que
te dá todo o ferramental necessário para usar geradores, rodar o servidor, executar testes, minificar o javascript, etc.
Ember-cli é feito em [node](http://nodejs.org/) e usa o [bower](http://bower.io/) pra resolver algumas dependencias 
então será necessário ter essas duas ferramentas instaladas também.

# Instalando o ember-cli

Utilizaremos nesse tutorial a versão 0.0.40 que é a mais atual no tempo que escrevo esse post.

{% highlight bash linenos %}
npm install -g ember-cli@0.0.20
# npm noise ...
ember --version
# version: 0.0.40
# node: 0.10.26
# npm: 1.4.21
{% endhighlight %}

# Criando o projeto

Uma vez instalado o ember-cli você terá disponível na sua linha de comando o comando `ember`. Para cria uma nova
aplicação utilizaremos:

{% highlight bash linenos %}
ember new ember-reddit && cd ember-reddit
# installing
#   create several files
# Installed packages for tooling via npm.
# Installed browser packages via Bower.
# Sucessfully initialized git
{% endhighlight %}

Uma vez dentro do diretório da aplicação podemos levantar o servidor usando `ember server` ou `ember s` e visitar a url
[http://localhost:4200](http://localhost:4200). Se tudo ocorrer bem, você verá um título com *Welcome to Ember.js*.

![image](/blog/images/posts/ember-reddit/welcome.png)

Para dar uma cara melhor ao projeto iremos utilizar o twitter boostrap, para instala-lo utilize `bower install bootstrap --save`.
E para adiciona-lo na asset pipeline do ember-cli mude o arquivo Brocfile.js para:

{% highlight javascript linenos %}
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp();
app.import('vendor/bootstrap/dist/css/bootstrap.css');

module.exports = app.toTree();
{% endhighlight %}

Obs: o arquivo Brocfile.js não é recarregado automaticamente então você terá que reiniciar o servidor para pegar as alterações.

Ao atualizar a página você verá que o título *Welcome to Ember.js* está um pouco maior, o que indica que os estilos do boostrap estão sendo usados.

![image](/blog/images/posts/ember-reddit/welcome-boostrap.png)

# Criando nosso primeiro teste

O ember.js vem com uma biblioteca de testes que usa uma dsl com uma sintaxe bem intuitiva e que tenta abstrair ao máximo possível as execuções
assíncronas, já que ajax é muito comum em SPA's. Você pode encontrar mais informações a respeito dela no [guia oficial de testes](http://emberjs.com/guides/testing/). 
Essa biblioteca vem integrada por padrão no [qunit](http://qunitjs.com/) então você não precisa ficar fazendo `asyncStart`, `start` e `stop` 
velhos conhecidos quando precisamos testar [códigos assíncronos](http://api.qunitjs.com/category/async-control/).
Tanto a biblioteca de testes do ember como o qunit ja vem integrados no ember-cli, portanto você não precisa realizar nenhuma configuração ;).

Vamos criar um teste simples para verificar se o título principal do site(h1) é igual a "Ember reddit". 
Para isso vamos usar os geradores do ember-cli para criar um teste te aceitação:

{% highlight bash linenos %}
ember generate acceptance-test index
# version: 0.0.40
# installing
#   create tests/acceptance/index-test.js
{% endhighlight %}

Vamos alterar o teste gerado pelo ember-cli e adicionar o cenário esperado para a nossa app:

{% highlight javascript linenos %}
test('visiting /', function() {
  visit('/');

  andThen(function() {
    equal(find('h1').text(), 'Ember reddit');
  });
});
{% endhighlight %}

Algumas explicações sobre o que o teste acima está fazendo: O `visit('/')` simula uma requisição para a raiz da aplicação. O `andThen` executa uma 
função assim que o visit carrega a página, no nosso caso quando a página for carregada queremos verificar que o texto do elemento 'h1' é igual a 'Ember reddit'.
O `find('h1').text()` nada mais é que uma chamada ao jQuery, é o mesmo que `$('h1').text()`.

Para ver os testes executando visite [http://localhost:4200/tests](http://localhost:4200/tests). 
Você verá que esse teste vai falhar, faremos ele passar mas primeiro vamos entender como o ember renderiza os templates.

O ember.js usa convenção sobre configuração, então caso editássemos o arquivo **app/router.js** e criássemos uma rota chamada 'foo':

{% highlight javascript linenos %}
Router.map(function() {
  this.route('foo');
});
{% endhighlight %}

Ao acessar '/foo' seria renderizado o template **app/templates/foo.hbs** usando como layout o template **app/templates/application.hbs**.

No nosso caso mesmo não tendo nenhuma rota criada ainda, o ember cria o seguinte mapeamento por padrão:

{% highlight javascript linenos %}
Router.map(function() {
  // rota criada por padrão
  // this.route('index', { path: '/' });
});
{% endhighlight %}

Ou seja, uma rota chamada `index` que mapea para a url raiz da nossa aplicação. Logo ele está renderizando o template **app/templates/index.hbs**
usando o layout **app/templates/application.hbs**. Como não temos o arquivo `index.hbs` ele não é renderizado apenas o seu layout.

Agora que entendemos o que está acontecendo, podemos alterar o nosso layout para o seguinte código:

{% highlight html linenos %}
{% raw %}
<h1>Ember reddit</h1>

{{outlet}}
{% endraw %}
{% endhighlight %}

O `{% raw %}{{outlet}}{% endraw %}` é onde cada template será renderizado.

Após essa alteração você verá que todos os testes estão passando =).

# Coletando dados da api do reddit

Listaremos os tópicos populares do reddit, para isso precisamos consumir a [api rest](http://www.reddit.com/dev/api) deles.
Como faremos algumas chamadas ajax, é interessante coloca-las num serviço para mante-las todas num lugar só.
Vamos criar esse serviço usando o seguinte comando:

{% highlight bash linenos %}
ember generate service reddit
# version: 0.0.40
# installing
#   create app/initializers/reddit.js
#   create app/services/reddit.js
#   create tests/unit/services/reddit-test.js
{% endhighlight %}

O endpoint a ser consumido é [http://www.reddit.com/hot.json](http://www.reddit.com/hot.json) que retorna um json. Esse json vai
mudar de tempos em tempos porque o conteúdo retornado por ele é atualizado periodicamente, para nossos testes sempre trabalharem
com o mesmo conteúdo vamos mockar essa chamada.

**tests/helper/hot-fixture.js** 
{% highlight javascript linenos %}
import { defineFixture } from 'ic-ajax';

var data = [...]; // adicione o json retornado pela api aqui

export default defineFixture('http://www.reddit.com/hot.json', {
  response: data,
  jqXHR: {},
  textStatus: 'success'
});
{% endhighlight %}

O ember-cli já vem com o [ic-ajax](https://github.com/instructure/ic-ajax), que é uma versão do `jQuery.ajax` mais integrada com
o ember.js. Além disso o ic-ajax possui um método para simularmos requisições ajax que é o `defineFixture` que estamos usando acima.

Agora que temos a chamada da api mockada, vamos criar um teste:

**tests/unit/services/reddit-test.js**
{% highlight javascript linenos %}
import { test, moduleFor } from 'ember-qunit';
import { defineFixture } from 'ic-ajax';
import { hotFixture } from '../../helpers/hot-fixture';


moduleFor('service:reddit', 'RedditService', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
});

// Replace this with your real tests.
test('it exists', function() {
  var service = this.subject();
  ok(service);
});

test('it fetch the data', function() {
  expect(2);
  var service = this.subject();
  service.hot().then(function(data) {
    equal(data.kind, 'Listing');
    equal(data.data.children.length, 25);
  });
});
{% endhighlight %}

Se você verificar o código acima, `moduleFor` e `this.subject` não são métodos do qunit. Esses métodos são adicionados por outra
biblioteca chamada [ember-qunit](https://github.com/rwjblue/ember-qunit), que facilita a criação de testes unitários no ember.js.
O `moduleFor` serve para especificar qual objeto queremos testar e suas dependencias. O `this.subject()` cria uma nova instancia
desse objeto e resolve as suas dependencias.

Ao rodar esses testes, como esperado eles falham pois não criamos o método `hot` ainda. Então vamos cria-lo:

**app/services/reddit.js**
{% highlight javascript linenos %}
import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Object.extend({
  host: 'http://www.reddit.com/',
  request: function(path) {
    return ajax(this.host + path + '.json');
  },
  hot: function() {
    return this.request('hot');
  }
});
{% endhighlight %}

