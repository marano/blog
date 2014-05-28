---
author: Dirceu Pauka
layout: post
title: "Speed up your website with InstantClick"
date: 2014-04-14 09:00
categories:
  - javascript
  - otimização
  - dirceu


---

The subject of Performance Optimization has a bunch of techniques and tools such as *inlining* (in cases where it is better to have CSS and Javascript inside the HTML file or even [images inside CSS](http://stackoverflow.com/questions/1207190/embedding-base64-images)), *spriting* (when we join images of a page on a single image file) and *Ajax* (when new content is loaded in the background). In this article we will go into details of a technique to speed up your site called *pjax* and a tool called *InstantClick*.

<!--more-->

### pjax

**pjax** works by grabbing HTML from your server via Ajax and replacing the content of the body on your page with the ajax loaded HTML body. It then updates the browser's current URL using HTML5 [pushState](http://badassjs.com/post/840846392/location-hash-is-dead-long-live-html5-pushstate), without reloading your page layout or any other resources (JS, CSS), giving the appearance of a fast, full page load. But really it's just **Ajax and pushState**. For browsers that do not support pushState, link clicks will result in a normal full page load.

### InstantClick

As latency is inevitable with today's internet architecture, [InstantClick](http://instantclick.io/) JavaScript library cheats by preloading links visitors are likely to click on. Before visitors click on a link, they hover over that link. Between these two events **InstantClick preloads the page** (with pjax), so that the page is already there when the user clicks.

We are using this library on our own website. You can navigate through internal links to see how fast is it: [helabs.com.br](http://helabs.com.br/).

### Related links:

[InstantClick](http://instantclick.io/)

[jquery-pjax](https://github.com/defunkt/jquery-pjax)

[YUI Pjax](http://yuilibrary.com/yui/docs/pjax/)

[PACE.js - Automatic page load progress bar](http://github.hubspot.com/pace/docs/welcome/)
