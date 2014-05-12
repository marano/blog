---
layout: post
title: "Brazil Zipcode API - Brapi"
author: Ali Ismayilov
comments: true
categories:
  - brapi
  - api
  - brazil
  - zipcode
  - ibge
  - ali ismayilov
  - english
---

Today we announce our new Heroku addon - Brapi. Brapi will provide programmatic access to zipcode, city, POI, address information about Brazil. It is built for developers, like us.

<!--more-->

![image](/blog/images/posts/2014-04-01/brapi.png)

Currently, Brapi provides following endpoints:

- Zipcode GET _by zipcode numbers_
- City GET _by IBGE code_
- Zipcode POST _update/create_

Response you get is a JSON object:

{% highlight json linenos %}
{
  "neighborhood": "Centro",
  "street_name": "Presidente Vargas",
  "street_type": "Avenida",
  "formatted_zipcode": "20071-905",
  "zipcode_numbers": "20071905",
  "complement": "- de 585 a 1261 - lado ímpar",
  "location": null,
  "city": {
    "name": "Rio de Janeiro",
    "ibge_code": "3304557",
    "state": "RJ",
    "state_ibge_code": "33"
  }
}
{% endhighlight %}


We, at HE:labs try to make our customers lives easy. We try to solve their problems with simpler solutions. We believe that keeping things simple makes us more productive. Also we contribute for [open source](http://helabs.com.br/opensource/) to make developers lives easy too.

Here we present alpha access to our brand new API - Brapi. Brapi will allow developers easily provide access to Brazilian zipcodes and cities. By programmatically accessing this data developers can build better UX for their customers with less effort.

To keep things simple, we will provide Brapi service through Heroku Addons. The service was already reviewed by Heroku team, and ready for use. But before going public, we'd like to give exclusive access to our readers. This way we want to receive early feedback and meet the most desired features.

If your application is already on Heroku (being on alpha you need to be invited also), all you need to do is to run:
{% highlight bash linenos %}
$ heroku addons:add brapi
-----> Adding brapi to sharp-mountain-4005... done, v18 (free)
{% endhighlight %}

This will set `BRAPI_TOKEN` variable on your app which you can use to make authenticated requests to Brapi.

To get an early access write us on [tech@helabs.com.br](mailto:tech@helabs.com.br).

If you are interested in integrating the API in your software, keep reading us and we'll tell you more about Brapi's [Ruby](https://github.com/Helabs/brapi-ruby) and [PHP](https://github.com/Helabs/brapi-php) clients on our next blog posts :wink:.
