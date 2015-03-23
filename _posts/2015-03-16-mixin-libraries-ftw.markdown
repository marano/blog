---
layout: post
title: "Mixin libraries FTW"
author: Matheus Costa
categories:
  - mixin libraries
  - pre-processors
  - sass
  - less
  - stylus
---

Get the most out of preprocessors
<!--more-->

![Mixin Libraries FTW](/blog/images/posts/2015-03-16/mixin-libraries.png)

##Goodbye CSS

The most common preprocessors are [Less](http://lesscss.org/), [Stylus](http://learnboost.github.io/stylus/) and [Sass](http://sass-lang.com/). They have some particularities like syntax and dependencies, but in the end, they do the same output.<br>Today preprocessors are unavoidable. If you are in a huge project you really need to use it. The advantages are some like:

* Nested syntax
* Define variables
* Mixins
* Inheritance
* Functions
* Reduce Writing
* Performance
* Crossbrowser

As we can see, the focus is to spend less time and increase productivity. What if I say we can boost even more? Yes, we can.
<br>Mixin libraries are way better to get stuff ready to be used and we don't have to create a lot of useful mixins.<br>
So let's take a look in some of then.

##Nib

[Nib](http://tj.github.io/nib/) is the best (and only) mixin library for Stylus. it has some awesome features and is pretty easy to use.<br>
One amazing mixin of this library is the __Reset__. Putting this `global-reset()` in your code the output will be like:

{% highlight sass linenos %}
html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td {
  margin: 0;
  padding: 0;
  border: 0;
  outline: 0;
  font-weight: inherit;
  font-style: inherit;
  font-family: inherit;
  font-size: 100%;
  vertical-align: baseline;
}
body {
  line-height: 1;
  color: #000;
  background: #fff;
}
ol,
ul {
  list-style: none;
}
table {
  border-collapse: separate;
  border-spacing: 0;
  vertical-align: middle;
}
caption, th, td {
  text-align: left;
  font-weight: normal;
  vertical-align: middle;
}
a img {
  border: none;
}
{% endhighlight %}

Awesome huh?

##Compass

[Compass](http://compass-style.org/) is one option for Sass. It's very robust and perfect to work with sprites and images.

In other hand, is very heavy compared to the next one below.

##Bourbon

[Bourbon](http://bourbon.io/) is another option for Sass and it's also our choice for the projects in the company.

Bourbon is much more simple and light compared to Compass, but it gets better when combined with [Neat](http://neat.bourbon.io/), [Bitters](http://bitters.bourbon.io/) and [Reffils](http://refills.bourbon.io/).

##Less Hat

[Less Hat](http://lesshat.madebysource.com/)

##Try it

If you haven't work with none of this libraries before you can test for free on [Codepen](http://codepen.io).

You just need to create a pen and click on the gear besides CSS to choose one of then. (See screenshot below).

![Codepen](/blog/images/posts/2015-03-16/codepen.png)

That's it guys, hope you enjoy it.

