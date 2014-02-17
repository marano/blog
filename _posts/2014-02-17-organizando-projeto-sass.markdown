---
published: true
author: Bruno Fernando
layout: post
title: "Organizando projeto Sass"
date: 2014-02-17 15:33
comments: true
categories:
  - Bruno Fernando
  - CSS
  - Sass
  - SCSS
  
---
Muitos desenvolvedores front-end já usam o **Sass** em seus projetos, mas poucos mantêm uma organização mínima dos seus arquivos. No Sass, há vários recursos [úteis](http://sass-lang.com/documentation/file.SASS_REFERENCE.html), como o [*@import*](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#import) para incluir os estilos individualmente em um arquivo principal.

<!-- more -->

Vou apresentar algumas dicas que utilizo no meu workflow.

# Estrutura básica
É uma boa prática separar seus arquivos por pastas que sejam fáceis de identificar. Eu gosto da estrutura dos meus projetos assim:

{% highlight ruby linenos %}
.
└── stylesheets
    ├── general.scss
    ├── core
    │   ├── base.scss
    │   ├── fonts.scss
    │   ├── layout.scss
    │   └── reset.scss
    ├── helpers
    │   ├── _buttons.scss
    │   ├── _tags.scss
    │   └── _icon-fonts.scss
    │   └── _cards.scss
    │   └── _posts.scss
    ├── modules
    │   ├── tags.scss
    │   ├── buttons.scss
    │   ├── works.scss
    │   ├── posts.scss
    │   ├── slide.scss
    │   ├── main-footer.scss
    │   └── main-header.scss
    └── vendor
        ├── bourbon
        └── neat

{% endhighlight %}

# Core, Helpers, Modules e Vendor
Como podem ver, os estilos estão divididos em 4 pastas. *Core*, *Helpers*, *Modules* e *Vendor*.

  - No diretório **core**, são definidos os blocos de layout e formatação dos elementos genéricos.
  - O diretório **helpers** é reservado para os arquivos **Sass** que não têm um output. Como declarações mixin, function e extends e sua nomenclatura é iniciada com um underscore.  ([conceito de partials](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#partials /)).
  - No diretório **modules**, é definido o CSS dos módulos do seu site. É sempre bom ter módulos "estreitos", ou seja, bem divididos (*buttons*, *forms*, *headers*, *footers* e etc).
  - O diretório **vendor** é reservado para CSS de terceiros ([Bourbon](http://bourbon.io/), [Neat](http://neat.bourbon.io/), [Bitters](http://bitters.bourbon.io/) e etc).
  - No arquivo **_settings**, são definidas as variáveis. Como esse arquivo não irá ter um output, segue o mesmo princípio da nomenclatura dos arquivos do helpers.

#Arquivo principal
No arquivo **general**, importo todos os arquivos na seguinte ordem:
{% highlight sass linenos %}
  // Vendor
  //Rails => @import "bourbon";
  @import "vendor/bourbon/bourbon";
  @import "settings";
  //Rails => @import "neat";
  @import "vendor/neat/neat";
  //...

  // Helpers
  @import "helpers/buttons";
  @import "helpers/icon-fonts";
  @import "helpers/posts";
  //...

  // Core
  @import "core/reset";
  @import "core/fonts";
  @import "core/base";
  @import "core/layout";
  //...

  // Modules
  @import "modules/tags;
  @import "modules/buttons";
  @import "modules/works;
  @import "modules/posts;
  @import "modules/posts-full;
  @import "modules/slide;
  @import "modules/main-footer";
  @import "modules/main-header";
  //...
{% endhighlight %}

# E no Rails?
Faço o *[require](http://guides.rubyonrails.org/asset_pipeline.html)* do arquivo **general** no **application.css**. Só lembrando: no Rails a extensão muda para "**.css.sass**" ou "**.css.scss**".

{% highlight css linenos %}
/* ...
 *= require general
 */
{% endhighlight %}


# Pro alto e avante!

Essa estrutura funciona muito bem para mim, não significa que seja a ideal. Existem várias outras recomendações de organização de CSS. Veja qual é a melhor e monte seu workflow.

- [SMACSS](http://smacss.com) - NICE **:)**
- [OOCSS](http://oocss.org)
- [MVCSS](http://mvcss.github.io)

