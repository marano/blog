---
author: Thiago Gonzalez
hide_author_link: true
layout: post
title: "Doing vertical align on elements like a boss"
categories:
  - thiago gonzalez
  - html
  - css
  - sass
  - mixin
  - english
  
---

How often have you had to align text or element vertically into another? Which method do you usually use? See a "like a boss" solution for it :)

<!--more-->

- Line-height?
- Position: absolute?
- "Display: table" on the parent element and "display: table-cell" on the children?

The simplest method of doing this is using the "transform" parameter of CSS 3 in our favor. See:

{% highlight ruby linenos %}
position: relative;
top: 50%;
transform: translateY(-50%);
{% endhighlight %}

With this we don't need to define a fixed height for the parent element. Just need to declare this to the element that must be positioned to the center.

If you often use SASS, you can create this mixin:

{% highlight ruby linenos %}
@mixin vertical-align {
  position: relative;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}
{% endhighlight %}

Now just apply to the element like this:

{% highlight ruby linenos %}
.wrap p { @include vertical-align }
{% endhighlight %}

The best notice: it's crossbrowser even in Internet Explorer 9!

What do you think about this method of centralizing elements vertically? Did you already know that? Comment here :)
