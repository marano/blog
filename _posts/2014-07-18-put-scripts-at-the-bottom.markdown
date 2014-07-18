---
layout: post
title: "Put Scripts at the Bottom"
author: Dirceu Pauka Jr
categories:
  - javascript
  - otimização
  - dirceu
---

While a script is downloading the browser won't start any other downloads, even on different hostnames. Have you ever noticed in some websites where the page seems to be loaded but the screen continue white for some time while it stills loading something more?

This does not happen when all scripts are placed in the bottom. It is a best practice in order to speed up your website: Put Scripts at the Bottom.

In some situations isn’t easy to move scripts to the bottom. It’s also a best practice to not have inline JavaScript in your pages. But it may have some inside a specific page and it may need a variable or a framework to work correctly.

In this case and when using HAML you can define a place in your layout to page specific scripts be executed after what they need is loaded:

`
  <script src=”/jquery.js”></script>
  <script src=”/app.js”></script>
  = yield :after_js_code
`

And then in the specific page:

`
  - content_for :after_js_code do
    :javascript
     $(‘section’).hide();
`

###One more thing

Loading secondary content after page style and script will help a lot your page seems to load faster. For external widgets, for example Facebook Like Box you can do :

`
  $(window).load(function() {
    $('#facebook_like_box')
      .html('<iframe src="https://www.facebook.com/...></iframe>');
  });
`

For images you can use [Lazyload](https://github.com/vvo/lazyload), the standalone JavaScript lazyloader or the [jQuery Lazyload plugin](http://www.appelsiini.net/projects/lazyload);

Thank you for attention and for making a faster Internet.

More best practices for speeding up your website: [https://developer.yahoo.com/performance/rules.html](https://developer.yahoo.com/performance/rules.html)

