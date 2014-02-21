---
published: true
author: Krystal Campioni
layout: post
title: "The perks of using SASS - variables to design faster"
date: 2014-02-21 17:16
comments: true
categories:
  - front-end
  - css
  - krystal campioni
  - design
  
---

The same way i did <a href="http://helabs.com.br/blog/2014/01/21/prevent-common-problems-when-writing-css-from-scratch/">on my last post</a>, i want to share with you some patterns i use to code faster. On <a href="http://startupdev.com.br/pt/servicos-para-startups/mvp/">our MVP projects </a> , we only have 2 days to deliver beautiful and useful web application, this means that we can't waste time. Finding ways to prevent us from writing the same basic code at the begging of each project means we can spend that time on the actual design of the app. 

An interesting way to set up color pallets for the web is using SASS variables:
<!--more-->
{% highlight ruby linenos %}

$main-color: #d0eefc;
$darker-color: darken( $main-color, 10% ) ;
$lighter-color: lighten( $main-color, 10% );
{% endhighlight %}
This means we only have to set up one value for the main color used on the layout, and the darker and lighter tones are defined by percentage.

<h1>Using the color pallet on the elements</h1> 

<img src="/blog/images/posts/2014-02-21/example1.png" style="display: inline ! important; margin-top: 1em;">

<h1>Changing the color scheme using one single value</h1> 

<img src="/blog/images/posts/2014-02-21/example2.png" style="display: inline ! important; margin-top: 1em;">




