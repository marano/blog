---
layout: post
title: "Construindo um cliente de reddit com emberjs"
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

### Pre requisitos

Para esse tutorial usaremos o [ember-cli](http://www.ember-cli.com/), que é a interface de linha de comando que
te dá todo o ferramental necessário para usar geradores, rodar o servidor, executar testes, minificar o javascript, etc.
Ember-cli é feito em [node](http://nodejs.org/) e usa o [bower](http://bower.io/) pra resolver algumas dependencias 
então será necessário ter essas duas ferramentas instaladas também.

### Instalando o ember-cli

Utilizaremos nesse tutorial a versão 0.0.40 que é a mais atual no tempo que escrevo esse post.

{% highlight bash linenos %}
npm install -g ember-cli@0.0.40
# npm noise ...
ember --version
# version: 0.0.40
# node: 0.10.26
# npm: 1.4.21
{% endhighlight %}

### Criando o projeto

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

### Criando nosso primeiro teste

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
O `find('h1').text()` nada mais é que uma chamada ao jQuery, é quase igual a `$('h1').text()`.

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
<div class="container">
  <h1>Ember reddit</h1>
  {{outlet}}
</div>
{% endraw %}
{% endhighlight %}

O `{% raw %}{{outlet}}{% endraw %}` é onde cada template será renderizado.

Após essa alteração você verá que todos os testes estão passando =).

### Coletando dados da api do reddit

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
Se você está curioso a respeito da sintaxe `import { defineFixture } from 'ic-ajax';` ela nada mais é do que a forma de referenciar
módulos que está sobre aprovação na próxima versão do javascript. É seguro usa-la no ember-cli porque ela é transpilada usando o
[es6-module-transpiler](https://github.com/esnext/es6-module-transpiler).

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

No serviço criado acima foi feito um método chamado `hot()` que realizada uma requisição ajax para o endpoint [http://www.reddit.com/hot.json](http://www.reddit.com/hot.json)

### Criando nossa primeira rota

Agora que temos o nosso serviço funcionando e testado, é hora de usa-lo no sistema. Para isso vamos criar uma rota chamada hot:

{% highlight bash linenos %}
ember generate route hot
# version: 0.0.40
# installing
#   create app/routes/hot.js
#   create app/templates/hot.hbs
#   create tests/unit/routes/hot-test.js
{% endhighlight %}

Além disso vamos criar um teste de aceitação para certificar que o conteúdo vindo da api do reddit realmente está sendo mostrado para o usuário.

{% highlight bash linenos %}
ember generate acceptance-test hot
# version: 0.0.40
# installing
#   create tests/acceptance/hot-test.js
{% endhighlight %}

**tests/acceptance/hot-test.js**
{% highlight javascript linenos %}
import Ember from 'ember';
import startApp from '../helpers/start-app';
import { hotFixture } from '../helpers/hot-fixture';

var App;

module('Acceptance: Hot', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('visiting /hot', function() {
  visit('/hot');

  andThen(function() {
    equal(find('h4').eq(0).text(), 'My buddy is an NFL running back. His kids dressed as Flash and Batman to fight him dressed as Bane.');
    equal(find('h4').eq(1).text(), 'More selfies drawn by strangers');
  });
});
{% endhighlight %}

No teste acima é verificado os dois primeiros h4's. Esse elemento será usado para o título de cada item da lista vinda do reddit.
Esse exemplo ficará diferente na sua applicação se você estiver realizando passo a passo esse tutorial, pois esses dados
vem da fixture gerada anteriormente.

O ember.js usa muito convenção sobre configuração tanto na organização dos arquivos quanto para resolver problemas comuns.
Nesse caso o que queremos fazer é: carregar os dados iniciais, a.k.a model, de uma determinada tela. Para isso existe um método chamado
`model`, ele é chamado pelo framework e espera algum objeto ou uma promise. Se for retornado uma promise ele irá esperar ela ser finalizada, 
pegar o conteúdo dela e utilizar como model. No nosso caso como o `reddit.hot()` executa uma requisição ajax incapsulada numa promise
o json retornado pela api será o nosso model. O código ficará assim:

**app/routes/hot.js**
{% highlight javascript linenos %}
import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.reddit.hot();
  }
});
{% endhighlight %}

É importante notar que o nosso serviço `reddit` é magicamente injetado na nossa rota. Na verdade essa mágica acontece quando geramos o serviço
via `ember generate service reddit` nesse momento além de serem criados a rota e o teste unitário dela também é criado um `initializer` em
`app/initializers/reddit.js`. Arquivos dentro dessa pasta são executados quando o framework inicializa, sendo uma boa oportunidade para registrar
dependencias como no exemplo acima.

Vamos adicionar o template que será responsável por renderizar o conteúdo do endpoint /hot

**app/templates/hot.hbs**
{% highlight html linenos %}
{% raw %}
{{#each model.data.children}}
  <div class="media" >
    <div class="pull-left">
      {{data.score}}
    </div>
    {{#if data.thumbnail}}
      <a class="pull-left" {{bind-attr href=data.url}}>
        <img class="media-object" {{bind-attr src=data.thumbnail}}>
      </a>
    {{/if}}
    <div class="media-body">
      <a {{bind-attr href=data.url}}>
        <h4 class="media-heading">{{data.title}}</h4>
      </a>
    </div>
  </div>
{{/each}}
{% endraw %}
{% endhighlight %}

O ember.js usa a biblioteca [handlebars.js](http://handlebarsjs.com/) para renderizar seu conteúdo. Ela é bem interessante porque
possibilita que escrevamos:

{% highlight html linenos %}
{% raw %}
{{#each people}}
  <p>Hello {{name}}</p>
{{/each}}
{% endraw %}
{% endhighlight %}

ao invéz de:

{% highlight javascript linenos %}
var html = "";
for(var i = 0; i < people.length; i++) {
  var person = people[i];
  html += "<p>" + person.name + "</p>";
}
// adiciona o html
{% endhighlight %}

O #each é um helper do handlebars que renderiza os elementos de um array. Existem outros, e é possível criar o seu prórpio caso necessário.

Um pouco de explicação sobre o que está acontecendo no `hot.hbs`:
O `{% raw %}{{#each model.data.children}}{% endraw %}` executa o bloco passando como contexto cada item do array. O `{% raw %}{{#if data.thumbnail}}{% endraw %}`
verifica se existe uma url pro thumbnail para só assim renderizar a imagem. E por fim o `{% raw %}{{bind-attr src=data.thumbnail}}{% endraw %}`
é usado para vincular um atributo do html a um propriedade de um objeto, nesse caso o atributo `src` a propriedade `data.thumbnail`.
O ideal é que fosse apenas `{% raw %}<img src={{data.thumbnail}}/>{% endraw %}` mas isso ainda não é possível e deve ser usado o `bind-attr`.
Após criar esse template, provavelmente agora os testes estão passando. Abaixo está uma imagem de como está a aplicação:

![image](/blog/images/posts/ember-reddit/reddit-list.png)

### Controllers e propriedades compuatadas

Podemos ver que as vezes aparecem imagens quebradas, eu não sei porque mas as vezes a api do reddit retorna os valores: `"self", "default", "nsfw"` para o campo
`thumbnail`. E no momento só verificamos a presença da imagem usando `{% raw %}{{#if data.thumbnail}}{% endraw %}`. Existem algumas maneiras de resolver
esse problema, mas pra manter as coisas simples vamos ignorar imagens que não comecem com http ou https. 
A primeira coisa que vem a mente é adicionar um if no template verificando isso com uma regex. Por exemplo:

{% highlight html linenos %}
{% raw %}
...
{{#if /^http[s]?:\/\//.test(data.thumbnail)}}
  <a class="pull-left" {{bind-attr href=data.url}}>
    <img class="media-object" {{bind-attr src=data.thumbnail}}>
  </a>
{{/if}}
...
{% endraw %}
{% endhighlight %}

Mas isso não funciona, e nesse caso não funciona de próposito. Por ser muito comum existirem templates com um monte de código jogado, que com o tempo
acaba sendo díficil dar manutenção, pois não se entende do que se trata. Decidiram limitar o que o handlebars processa e ele não executa expressões.
O que funcionaria seria o seguinte:

{% highlight html linenos %}
{% raw %}
...
{{#if validThumbnailUrl}}
  <a class="pull-left" {{bind-attr href=data.url}}>
    <img class="media-object" {{bind-attr src=data.thumbnail}}>
  </a>
{{/if}}
...
{% endraw %}
{% endhighlight %}

Mas daí teríamos que alterar o model da rota, e adicionar uma propriedade chamada `validThumbnailUrl` em cada dado:

{% highlight javascript linenos %}
export default Ember.Route.extend({
  model: function() {
    return this.reddit.hot().then(function(result) {
      result.data.children.forEach(function(child) {
        child.validThumbnailUrl = /^http[s]?:\/\//.test(child.data.thumbnail);
      });
      return result;
    })
  }
});
{% endhighlight %}

Isso funciona, mas podemos fazer melhor.

No ember existe uma camada de controller mas ela se comporta um pouco diferente do padrão MVC que estamos habituados. Os controllers no ember
se comportam muito mais como presenters ou decorators. Cada controller é vínculado a um model, e quando existe uma propriedade referenciada
no template, ela é primeiro procurada no controller e caso não exista é delegada ao model. Isso é bem interessante pois podemos mover as
lógicas para esses controllers, deixando os models apenas com os dados.

Vamos criar um controller e chama-lo de `entry` usando o seguinte comando:

{% highlight bash linenos %}
ember generate controller entry
# version: 0.0.40
# installing
#   create app/controllers/entry.js
#   create tests/unit/controllers/entry-test.js
{% endhighlight %}

No nosso teste queremos que ao fazer um `this.get('validThumbnailUrl')` ele seja true se `this.get('data.thumbnail')` retornar uma url válida.

**tests/unit/controllers/entry-test.js**
{% highlight javascript linenos %}
test('#validThumbnailUrl returns true for http urls', function() {
  var controller = this.subject();
  controller.set('model', { data: {} });
  controller.set('data.thumbnail', 'http://foo.com');
  ok(controller.get('validThumbnailUrl'));
});

test('#validThumbnailUrl returns true for https urls', function() {
  var controller = this.subject();
  controller.set('model', { data: {} });
  controller.set('data.thumbnail', 'http://foo.com');
  ok(controller.get('validThumbnailUrl'));
});

test('#validThumbnailUrl returns false for empty urls', function() {
  var controller = this.subject();
  controller.set('model', { data: {} });
  controller.set('data.thumbnail', '');
  ok(!controller.get('validThumbnailUrl'));
});

test('#validThumbnailUrl returns false for not valid urls', function() {
  var controller = this.subject();
  controller.set('model', { data: {} });
  controller.set('data.thumbnail', 'hue');
  ok(!controller.get('validThumbnailUrl'));
});
{% endhighlight %}

Perceba que estamos usando `this.get('prop')` e `this.set('prop', value)` ao invéz de `this.prop` e `this.prop = value`.
Usa-se o `get` porque o controller é um proxy do model, ou seja, se a propriedade não existir no controller ele tenta achar no `model`.
E o `set` é necessário para o controller mudar o valor do model.

Para implementar o `validThumbnailUrl` no nosso controller vamos usar uma [propriedade computada](http://emberjs.com/guides/object-model/computed-properties/)

**app/controllers/entry.js**
{% highlight javascript linenos %}
import Ember from 'ember';

export default Ember.ObjectController.extend({
  validThumbnailUrl: function() {
    return /^http[s]?:\/\//.test(this.get('data.thumbnail'));
  }.property('data.thumbnail')
});
{% endhighlight %}

Após adicionar esse controller os testes agora passam.

Uma vez criado esse controller precisamos fazer com que o framework use ele para cada item renderizado pelo `{% raw %}{{#each}}{% endraw %}`. Para
isso podemos usar o atributo `itemController` passando o nome do nosso controller, que nesse caso é `entry`.

**app/templates/hot.hbs**
{% highlight html linenos %}
{% raw %}
{{#each model.data.children itemController="entry"}}
  ...
{{/each}}
{% endraw %}
{% endhighlight %}
