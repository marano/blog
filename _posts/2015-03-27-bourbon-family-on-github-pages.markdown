---
layout: post
title: "Bourbon family on GitHub pages"
author: Thiago Borges
categories:
  - thiago borges
  - github
  - sass
  - jekyll
---

Few weeks ago I got impressed with [proteus](http://thoughtbot.github.io/proteus/) marketing. It allows you to create a new project using HAML, Coffeescript, Sass, Bourbon, Neat and Bitters right from the beginning.

<!--more-->

It looked really nice, but I didn't like the workflow: creating a different git branch for the generated code results in some inconveniences. After researching a little bit, I have found what I consider a better solution to deploy static websites on GitHub pages.

GitHub pages is a great and free way to host static pages using Jekyll, a static site generator made with Ruby, or pure HTML. When GitHub pages started [supporting Jekyll 2.2.0](https://github.com/blog/1867-github-pages-now-runs-jekyll-2-2-0), it also started compiling the .coffee, .sass and .scss during the build after `git push`, simplifying the development flow for complex websites which required solutions like [guard-sass](https://github.com/hawx/guard-sass), [Grunt](http://gruntjs.com/) or [Gulp](http://gulpjs.com/).

Since GitHub started supporting Sass, it became quite simple to add the Bourbon family ([Bourbon](http://bourbon.io/), [Neat](http://neat.bourbon.io/) and [Bitters](http://bitters.bourbon.io/)) to a static page on GitHub Pages.

### Install

* You will need Ruby on your machine. Mac OS X and Linux usually have it pre-installed.

The steps are:

1. Install github-pages gem:
  `gem install github-pages`

2. Start you project with jekyll (included on github-pages):
  `jekyll new your-new-page`

3. Install bourbon, neat and bitters gems:
  `gem install bourbon neat bitters`

4. Open `_sass` folder on you project and generate bourbon family files:
  `bourbon install && neat install && bitters install`

5. Edit css/main.scss file to include the generated files.
{% highlight sass %}
// Import partials from `sass_dir` (defaults to `_sass`)
@import "base/base",
        "bourbon/bourbon",
        "neat/neat"
;
{% endhighlight %}

## Why does it matter?

Bourbon is a mixin library for Sass. It is much better than Twitter Bootstrap, for example, because you don't need to include tons of useless code. Bourbon family encourages you to write modular and well written Sass. This is the best way I know to write Sass in a productive way and keep the code clean. Even the grid system is great, not requiring you to add classes like `.col-xs-4` or `.grid_2` on your HTML, making its usage just a matter of adding mixins like the following in your Sass:

{% highlight sass %}
.main-menu {
  @include span-columns(6);
}
{% endhighlight %}
