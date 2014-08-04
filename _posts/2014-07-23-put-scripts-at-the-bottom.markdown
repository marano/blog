---
layout: post
title: "Put Scripts at the Bottom"
author: Dirceu Pauka Jr
hide_author_link: true
categories:
  - javascript
  - otimização
  - dirceu
---

While a script is downloading the browser won't start any other downloads, even on different hostnames. Have you ever noticed in some websites where the page seems to be loaded but the screen hangs white for some time while it's still loading more?

<!--more-->

This does not happen when all scripts are placed at the bottom. It is a best practice in order to speed up your website: *Put scripts at the bottom*.

In some situations, it isn’t easy to move scripts to the bottom. It’s also a best practice not to have inline JavaScript in your pages. But it may have some inside a specific page and it may need a variable or a framework to work correctly.

In this case and when using HAML you can define a place in your layout to page specific scripts be executed after what they need is loaded:

{% highlight haml linenos %}
<script src="/jquery.js"></script>
<script src="/app.js"></script>
= yield :after_js_code
{% endhighlight %}

And then in the specific page:

{% highlight haml linenos %}
- content_for :after_js_code do
  :javascript
    $('section').hide();
{% endhighlight %}

### One more thing

Loading secondary content after page style and script will help your page load faster. For external widgets, for example, Facebook Like box, you can do the following:

{% highlight javascript linenos %}
$(window).load(function() {
  $('#facebook_like_box')
    .html('<iframe src="https://www.facebook.com/...></iframe>');
});
{% endhighlight %}

For images you can use [Lazyload](https://github.com/vvo/lazyload), the standalone JavaScript lazyloader or the [jQuery Lazyload plugin](http://www.appelsiini.net/projects/lazyload).

Thank you for your attention and for making a faster Internet.

More best practices for speeding up your website: [https://developer.yahoo.com/performance/rules.html](https://developer.yahoo.com/performance/rules.html)
