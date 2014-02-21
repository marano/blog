---
published: true
author: Ali Ismayilov
layout: post
title: "How to upload big files to Amazon S3 while using Heroku"
date: 2014-02-21 15:16
comments: true
categories:
  - ali ismayilov
  - rails
  - heroku
  - s3
  - s3_direct_upload
  - english

post-styles: hints

---

On the last [MVP](http://startupdev.com.br/pt/servicos-para-startups/mvp/) we had an issue with storing big photos. We solved it with filepicker.io. But filepicker.io is kinda [expensive](https://www.inkfilepicker.com/pricing/) and not always the client can be happy with that.

<!--more-->

The project [Cliqx](http://www.cliqx.com.br/) was using [paperclip](https://github.com/thoughtbot/paperclip) to manage photo uploads and [aws-sdk](https://github.com/aws/aws-sdk-ruby) to store them on S3. If user would upload a file, it would go to Heroku webserver, stored in ```/tmp/cache``` and then would be pushed to Amazon S3. The problem with uploading to Heroku is that it has explicit 30 seconds of maximum timeout. If you didn't finish uploading your file in 30 seconds, you are screwed.

The solution is to upload a file directly to S3 and attach it to the model. Happily, there's a gem for that:

## S3DirectUpload

[README](https://github.com/waynehoover/s3_direct_upload) says:

> Easily generate a form that allows you to upload directly to Amazon S3. Multi file uploading supported by jquery-fileupload.

I've already created project on github to make use of it: [https://github.com/aliismayilov/bigphotoblog](https://github.com/aliismayilov/bigphotoblog)

I'll walk through the key parts of the project.

### S3 Bucket configuration

First of all you'll need to add CORS configuration to your S3 bucket. It looks like this:

{% highlight xml linenos %}
<CORSConfiguration>
  <CORSRule>
    <AllowedOrigin>http://0.0.0.0:3000</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>POST</AllowedMethod>
    <AllowedMethod>PUT</AllowedMethod>
    <MaxAgeSeconds>3000</MaxAgeSeconds>
    <AllowedHeader>*</AllowedHeader>
  </CORSRule>
</CORSConfiguration>
{% endhighlight %}

**NOTE: Don't forget to change ```AllowedOrigin``` to the heroku app url.**

### Paperclip initializer

Paperclip initializer looks like usual. It's configured for S3 storage.

{% highlight ruby linenos %}
# config/initializers/paperclip.rb
Paperclip::Attachment.default_options[:storage] = :s3
Paperclip::Attachment.default_options[:bucket] = ENV['S3_BUCKET']
Paperclip::Attachment.default_options[:s3_permissions] = :public_read
Paperclip::Attachment.default_options[:s3_credentials] = {
  access_key_id: ENV['AWS_ID'],
  secret_access_key: ENV['AWS_KEY']
}
{% endhighlight %}

### S3DirectUpload initializer

It also needs to know about AWS credentials to connect directly to the bucket.

{% highlight ruby linenos %}
# config/initializers/s3_direct_upload.rb
S3DirectUpload.config do |c|
  c.access_key_id = ENV['AWS_ID']
  c.secret_access_key = ENV['AWS_KEY']
  c.bucket = ENV['S3_BUCKET']
  c.region = nil
  c.url = nil
end
{% endhighlight %}

**NOTE: Don't forget to put ENV variables in your ```.env``` file and/or set them as Heroku env variables.**

### Asset files

{% highlight coffeescript linenos %}
# app/assets/javascripts/application.coffee
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require s3_direct_upload
//= require_tree .

ready = ->
  $("#s3-uploader").S3Uploader()

$(document).ready(ready)
$(document).on('page:load', ready)
{% endhighlight %}

{% highlight sass linenos %}
// app/assets/stylesheets/application.scss
/*
*= require_self
*= require s3_direct_upload_progress_bars
*= require_tree .
*/
{% endhighlight %}

In the forementioned project I used bootstrap-sass and its progressbar stylings.

* [application.coffee](https://github.com/aliismayilov/bigphotoblog/blob/master/app/assets/javascripts/application.coffee)
* [application.scss](https://github.com/aliismayilov/bigphotoblog/blob/master/app/assets/stylesheets/application.scss)


### Form view

This snippet will render s3_direct_upload form with its progress bars:

{% highlight haml linenos %}
= s3_uploader_form callback_url: model_url, callback_param: "model[image_url]", id: "s3-uploader"
  = file_field_tag :file, multiple: true

erb:
  <script id="template-upload" type="text/x-tmpl">
    <div id="file-{{ "{%" }}=o.unique_id%}" class="upload">
      {{ "{%" }}=o.name%}
      <div class="progress"><div class="bar" style="width: 0%"></div></div>
    </div>
  </script>

{% endhighlight %}


### ActiveRecord creation

As soon as the file is saved on S3 there will be a callback to the url specified as ```callback_url```. By default it will be a POST request. By the Rails REST convention it will trigger ```ModelsController#create``` method. Here's our snippet from the controller:

{% highlight ruby linenos %}
# app/controllers/photos_controller.rb
  def create
    current_user.photos.create upload: URI.parse(URI.unescape(params['url']))
  end
# Photo is an activerecord model. Photo#upload is a paperclip field.
{% endhighlight %}

Yes, all we need is to parse ```'url'``` param which comes from S3. Our Heroku app will quickly download that file, do all the processing (e.g. thumbnail creation) and store it back in S3. As Heroku apps are hosted on Amazon servers, download latency and speed will be very good. Longest delay can happen with the post-processing of the file.

If the post-processing of the file takes longer, consider using delayed jobs. But that is a topic for another blogpost 😉

## Happy photo

Here's how it was working for me. Happy coding!

![Screenshot](/blog/images/posts/2014-02-06/2014.02.06_screenshot.png "Screenshot")

