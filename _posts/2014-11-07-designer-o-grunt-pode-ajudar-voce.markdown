---
layout: post
title: "Designer, o grunt pode ajudar você!"
author: Márcio Costa
categories:
  - grunt.js
  - automatização
  - workflow
  - non-rails apps
---

Automatizando processos e melhorarando a performance do seu projeto.
<!--more-->
![grunt](/blog/images/posts/2014-10-17/grunt_work.jpg)

Se você em algum momento precisou otimizar todas as imagens em seu projeto,
precisou minificar todo o seu css, todo o seu javascript e teve que fazer tudo
isso "na mão" ou recorreu a algumas ferramentas online (que ainda assim é um processo mecânico).
Saiba que seu sofrimento foi em vão, o grunt.js está aí para fazer isso e muito mais por você.

Em poucas palavras, o Grunt é um automatizador de processos. Você instala os plugins que achar necessários,
os configura e gera tarefas para que ele execute pra você o que você teria que fazer
manualmente, como por exemplo, minificar todos os seus arquivos css em um só.

Para que o post não fique muito longo, vou evitar falar como instalar mas vou deixar um link
[aqui](http://gruntjs.com/getting-started).

Com o grunt instalado, chega a hora de você criar suas primeiras tasks e configurá-las dentro
do seu projeto. É aí que a coisa fica interessante, você pode aproveitar este momento para
oganizar o worflow do projeto (vou falar sobre isso logo na sequência).

Vou listar aqui as tasks que adotei por padrão para os meus projetos.

## Uglify
### Juntando seus arquivos js em um só

O [uglify](https://www.npmjs.org/package/uglify-js), entre outras coisas. Minifica todos os seus
arquivos js em um só arquivo de saída, abaixo, peguei todos os meus scripts que estavam dentro de `dev` e
criou o main.js dentro de `dist`.

{% highlight javascript linenos %}
uglify: {
  'dist/js/main.js': [
    'dev/js/javascript1.js',
    'dev/js/javascript2.js'
    'dev/js/javascript3.js'
   ],
},
{% endhighlight %}


## Cssmin
### Compactando os seus arquivos de css

Essa [task](https://www.npmjs.org/package/grunt-css) funciona basicamente no mesmo esquema do uglify.
Em `keepSpecialComments` você pode escolher entre `*` para deixar o css com comentários,
 `1` para manter somente comentários especiais e `0` para remover todos.

{% highlight javascript linenos %}
cssmin: {
  'dist/css/util.css': [
    'dev/css/fontface.css',
    'dev/css/external1.css',
    'dev/css/libx.css'
  ],
  options:{
      keepSpecialComments: 0
  }
},
{% endhighlight %}

## Sass
### Compile e comprima

Nesse caso irei falar de sass, mas não é difícil achar essa task para outros pré-processadores. Instalando
o [plugin](https://www.npmjs.org/package/grunt-contrib-scss) você tem diversos estilos de saída para arquivos
sass, no meu caso configurei para `compressed` e não estou deixando que os arquivos sassc entrem em cache usando
o `noCache: true`. Estou pegando meu arquivo sass dentro de `dev` e jogando para o diretório de distribuição `dist`

{% highlight javascript linenos %}
sass: {
  'dist/css/main.css': ['dev/sass/main.sass'],
  options:{
      style: 'compressed',
      noCache: true
  }
},
{% endhighlight %}

## Watch
### Observe eventos e execute tarefas
Talvez, essa seja a task mais interessante dentre as que vou listar. Ao adcionar esta tarefa, eu configurei para que ela
observasse determinados arquivos sass para que assim que eles fossem alterados, a task compilasse os arquivos alterados
e desse um livereload no arquivo de saida `main.css`.

{% highlight javascript linenos %}
watch: {
  sass: {
    files: ['dev/sass/main.sass','dev/sass/internal.sass','dev/sass/utilities.sass'],
    tasks: ['sass']
  },
  livereload: {
    options: { livereload: true },
    files: ['dist/css/main.css']
  }
},

{% endhighlight %}

Em `files` eu listo os arquivos que quero observar, em `tasks` eu configuro o watch para executar uma tarefa quando os arquivos listados forem alterados, acho isso muito irado :). O watch também pode ser usado para javascript, no meu caso eu não configurei para isso por mexer pouco com js.

## Imagemin
### Otimize suas imagens
Essa task é de vital importância para o desempenho do projeto. ela vai pegar todas as imagens dentro de um diretório e otimizá-las, minha experiência com essa task é muito boa, ela consegue otimizar no mínimo em 20% o tamanho das suas imagens e conservando a qualidade delas.

{% highlight javascript linenos %}
imagemin: {
  dynamic: {
    files: [{
      expand: true,
      cwd: 'dev/img/',
      src: ['*.{png,jpg,gif}'],
      dest: 'dist/img/'
    }]
  }
}
{% endhighlight %}

Usei as configurações dentro de `dynamic` para que eu não precise adcionar as imagens uma por uma, isso é uma configuração do grunt e não do plugin, ela permite que façamos um array de arquivos. Vou deixar um link para que vocês leiam mais sobre tarefas dinâmicas [aqui](http://gruntjs.com/configuring-tasks#building-the-files-object-dynamically).

Em `cwd` eu inseri o diretório das imagens que quero otimizar, em `src` os formatos que eu quero que sejam otimizados e em `dest` o diretório de destino para as imagens. Só para reforçar, isso é possível por que eu criei uma task dinâmica como falei acima.

## O Arquivo Final!
### O meu gruntfile.js
Bom, essas são as tasks que adciono como padrão nos meus projetos e vou deixar abaixo como fica o arquivo final, lembrando que isso não é uma lei, você pode usar esse arquivo como um norte e alterá-lo para se adequar as suas necessidades assim como adcionar mais tasks.

{% highlight javascript linenos %}
module.exports = function(grunt) {
  grunt.initConfig({
    uglify: {
      'dist/js/main.js': [
        'dev/js/javascript1.js',
        'dev/js/javascript2.js'
        'dev/js/javascript3.js'
       ],
    },

    cssmin: {
      'dist/css/util.css': [
        'dev/css/fontface.css',
        'dev/css/external1.css',
        'dev/css/libx.css'
      ],
      options:{
          keepSpecialComments: 0
      }
    },

    sass: {
      'dist/css/main.css': ['dev/sass/main.sass'],
      options:{
          style: 'compressed',
          noCache: true
      }
    },

    watch: {
      sass: {
        files: ['dev/sass/main.sass','dev/sass/internal.sass','dev/sass/utilities.sass'],
        tasks: ['sass']
      },
      livereload: {
        options: { livereload: true },
        files: ['dist/css/main.css']
      }
    },

    imagemin: {
      dynamic: {
        files: [{
            expand: true,
            cwd: 'dev/img/',
            src: ['*.{png,jpg,gif}'],
            dest: 'dist/img/'
        }]
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['uglify','cssmin','sass','imagemin']);

  grunt.registerTask('filewatch', ['watch']);

  grunt.registerTask('less-img', ['less','imagemin']);

};
{% endhighlight %}

## Workflow
### Iniciar um projeto quando ele não tem uma organização sólida é bem chato e pode complicar a sua vida bastante no futuro.
Lá no início do post eu falei que você poderia aproveitar o grunt para definir worklow para o seu projeto. Já trabalhei em diversos projetos, com muitas equipes e infelizmente, nem todas tem uma metodologia ou até mesmo um padrão para organizar arquivos, diretórios, assets, enfim.

Felizmente aqui na HE fazemos isso, e bem <3. Mas, se na sua equipe ou em seus projetos pessoais isso é um entrave o grunt pode te ajudar demais com isso. Se vocês observarem, há um pequeno padrão na organização de arquivos e diretórios no meu gruntfile.js, a coisa fica mais ou menos assim:

{% highlight html linenos %}
dist
  |_ css
  |_ js
  |_ img
dev
  |_css
  |_js
  |_img
index.html
gruntfile.js
package.json
{% endhighlight %}

Dessa forma, na hora do deploy você pode optar por não subir os arquivos do diretório dev, publicando somente o index e o diretório dist. Só pra lembrar: No seu arquivos index não esquece de chamar o que tiver dentro de dist e não de dev.

### Protip:
Sempre que você achar algum plugin bacana e ver que ele vai ter serventia em mais projetos, instale usando o `--save-dev` no final, ele vai salvar nas dependências do seu `package.json` evitando que você tenha que instalar separadamente. Feito isto ao iniciar um novo projeto, use o `npm install` que ele vai buscar todos os plugins listados nas dependências do `package.json`.

## Workflow High Level
### yeoman, bower e outras coisas mais.
Para finalizar, quero dizer que o workflow acima é um modelo muito básico que eu desenvolvi para mim mesmo nos últimos meses.
Existem alternativas muito mais completas e com uma abrangência muito maior. Se você já é familiarizado com grunt ou [gulp](http://gulpjs.com/) você já pode ir muito mas além desse modelo que fiz para mim.

O que falei até aqui é a ponta do iceberg para automatizar, melhorar o desempenho do seu projeto e definir um workflow. Já tem por aí umas coisas muito bacanas como o [yeoman](http://yeoman.io/) e o [bower](http://bower.io/) para elevar o nível de elaboração do seu workflow. Talvez, falar sobre esses caras me rendam mais 2 ou três posts.

Se você achou mais plugins e tasks bacanas, deixa aqui nos comentários :D.

Um abraço e até a próxima.
