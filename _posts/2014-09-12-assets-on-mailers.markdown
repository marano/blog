---
layout: post
title: Assets on Mailers
author: Matheus Bras
categories:
  - actionmailer
  - asset_pipeline
---

You start making mailers and decide to have a nice template for your emails.
You want to put your logo at the header of the email to make it look very cool.
And then you try to send it, or view it on the preview, and the logo is broken.
Bummer.

<!--more-->

So before you create a directory called `/images` on `/public`
and throw a copy of your logo and start making weird interpolations
with the url of your app, like `image_tag "#{root_url}/images/logo.png"`, check out this little config.

Go to your environment config file and add this:

{% highlight ruby linenos %}
  # production.rb
  config.action_mailer.asset_host = 'http://yourapp.com'
{% endhighlight %}

And done. Your images will show up correctly from now on.

This can also be useful if you store your assets in a CDN.
So make sure you set this config when using images and other types of assets on your mailers.

That's it for now. Hope this helps someone.
