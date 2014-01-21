---
published: false
author: Krystal Campioni
layout: post
title: "Prevent common problems when writing CSS from scratch"
date: 2014-01-16 17:16
comments: true
categories:
  - Front-end
  - CSS
  - krystal campioni
---

Many times when I started writing the classes of a brand new site, i had two problems that bothered me very much: keeping the footer always at the bottom of the page - even if the page has few content - and using padding values in divs without influencing the overall width of the div.

Then I decided to always put the same basic classes on the css file, no matter what the layout would look like:

<!--more-->

<h1>Solving the footer position issue</h1>

<img src="/blog/images/posts/2014-01-16/a1.png" style="display: inline ! important; margin-top: 1em; background: none repeat scroll 0% 0% transparent; border: medium none; width: auto; max-width: 90%;">
<p>
First of all, your HAML structure should be like this:
</p>
{% highlight ruby linenos %}
#wrapper
  %header
    // content of the header
  #main-content
     // content of the body
  %footer
     // content of the footer
{% endhighlight %}

Then, the following classes should do the job:

{% highlight ruby linenos %}
<style media="screen" type="text/css">
    html,
    body {
        margin:0;
        padding:0;
        height:100%;
    }
    #wrapper {
        min-height:100%;
        position:relative;
    }

    #main-content{
        padding:10px;
        padding-bottom:60px;    /* Height of the footer */
    }
    footer {
        position:absolute;
        bottom:0;
        width:100%;
        height:60px;            /* Height of the footer */
    }
    
    </style>

{% endhighlight %}

This should keep the footer at the bottom as you add more content to the page or if don't have enough content to force the footer down.


<h1>Avoiding problems width paddings and widths</h1>

Imagine that you created a layout that has 3 boxes of the same width aligned besides each other. All of these boxes are divs with 100px of width inside a div of 360px of width. The HAML structure would be like this:


{% highlight ruby linenos %}
.boxes-container
  .box xxx
  .box xxx
  .box xxx
{% endhighlight %}


and this would be the CSS:

{% highlight ruby linenos %}
  .boxes-container{
    float:left;
    width:360px;
    background:#000;
  }
  .box {
      background: none repeat scroll 0 0 #FFFFFF;
      float: left;
      margin: 10px;
      padding: 10px;
      width: 100px;
  }
 {% endhighlight %}   
<div style="float:left;width:99%">
Regularly, CSS would add the padding value to the with of the box div, causing the last one to fall down, because the sum of the elements width would be 420px that is larger than the 360px of the box-container.
( Each div would add 100px of width with 10px of margin-left and 10px of margin-right width 10px width 10px of padding-left and 10px of padding-right. 140px of overall width x 3 divs)
</div>
<img src="/blog/images/posts/2014-01-16/01.png" style="display: inline ! important; margin-top: 1em;">

<div style="float:left;width:100%">
If we use the CSS box-sizing property, though, we can fix this problem by keeping the padding value inside the div and mantaining the correct width. I usually apply the universal selector to all elements and pseudo-elements on the site:
</div>

<div style="float:left;width:100%">
{% highlight ruby linenos %}
  *, *:before, *:after {
      -webkit-box-sizing: border-box;
         -moz-box-sizing: border-box;
              box-sizing: border-box;
  }
{% endhighlight %}
This is the result of using the box-sizing property:
</div>
<img src="/blog/images/posts/2014-01-16/02.png" style="display: inline ! important; margin-top: 1em;">

So remember: Using box-sizing to all elements on the CSS and position absolute to the footer can save you from a lot of headache :) 


