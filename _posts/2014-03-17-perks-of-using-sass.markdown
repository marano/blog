---
published: true
author: Krystal Campioni
layout: post
title: "The perks of using SASS - Creating color pallets with variables and functions"
comments: true
categories:
  - front-end
  - css
  - krystal campioni
  - design
  - english
  
---

The same way I did <a href="http://helabs.com.br/blog/2014/01/21/prevent-common-problems-when-writing-css-from-scratch/">on my last post</a>, I want to share with you some patterns I use to code faster. On <a href="http://startupdev.com.br/pt/servicos-para-startups/mvp/">our MVP projects </a> , we only have 2 days to deliver beautiful and useful web application, this means that we can't waste time. Finding ways to prevent us from writing the same basic code at the begging of each project means we can spend that time on the actual design of the app. 

An interesting way to set up color pallets for the web is using SASS variables:
<!--more-->
{% highlight ruby linenos %}

$main-color: #970000;
$darker-color: darken( $main-color, 20% ) ;
$lighter-color: lighten( $main-color, 20% );
$lightest-color: lighten( $main-color, 60% );
{% endhighlight %}

This means we only have to set up one value for the main color used on the layout, and the darker and lighter tones are defined by functions using percentages.

<h2>Defining a color scheme</h2> 

On the example bellow, the main color used, was a #970000 red. 

<img src="/blog/images/posts/2014-02-21/example1.png">

Using the variables we wrote, i added color to some elements:

{% highlight ruby linenos %}

header{
  background: $main-color;
}

h1{
    color:$darker-color;
  }

img{
  border-left: 12px ridge $lighter-color;
}

ul{
  background:$lightest-color;
}

footer{
  background: $darker-color;
  color:$lightest-color;
}


{% endhighlight %}


<h2>Changing the color scheme using one single value</h2> 

Notice that we'd only written one color value to determine all the colors we've used on the layout. That means that if we change the main-color value, for example to a #10528a blue, we get this result:

<img src="/blog/images/posts/2014-02-21/example2.png">


<h2>Other usefull functions to work with colors</h2>

The same way we used functions to determine darker and lighter color tones, we could use them to create different variations like saturation for example:

{% highlight ruby linenos %}
$main-color: #34638a;
$saturate: saturate( $main-color, 50% ) ;
$desaturate: desaturate( $main-color, 50% );
{% endhighlight %}


<img src="/blog/images/posts/2014-02-21/example3.png">

In this post, I've talked about structuring a color scheme using SASS. It's up to your creativity to use these tips as you think will fit best in your projects :)
