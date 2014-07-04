---
layout: post
title: "Rendering custom error pages with Rails"
author: Israel Ribeiro
categories:
  - israel ribeiro
  - rails
  - english
  - code
---

There are a lot of different ways of doing anything with Rails. In this post I'll quickly write about my prefered way of rendering custom error pages like 404 and 500 error pages.

<!--more-->

Let's suppose you're writing a generic controller that queries a resource and instantiates a variable with the query results:

{% highlight ruby linenos %}
class WorkersController < ApplicationController
  def index
    @troopers = Stormtrooper.find_by(cause_of_death: 'rebounded shot')
  end
end
{% endhighlight %}

On `ApplicationController`, write a method that will raise an appropriate exception for the error you're dealing with. In this case, as we're treating a simple 404 error, we'll raise `ActiveRecord::RecordNotFound`:

{% highlight ruby linenos %}
class ApplicationController < ActionController::Base
  # ...

  def not_found
    raise ActiveRecord::RecordNotFound
  end
end
{% endhighlight %}

Then you `rescue_from` it and render the page:

{% highlight ruby linenos %}
class ApplicationController < ActionController::Base
  rescue_from ActiveRecord::RecordNotFound, with: :four_oh_four_page

  # ...

  def not_found
    raise ActiveRecord::RecordNotFound
  end

  def four_oh_four_page
    render file: Rails.root.join('/public/404'), status: 404
  end
end
{% endhighlight %}

Back at our controller, we can then do things like:

{% highlight ruby linenos %}
class WorkersController < ApplicationController
  def index
    @troopers = Stormtrooper.find_by(cause_of_death: 'rebounded shot') || not_found
  end
end
{% endhighlight %}

And *voilà*, there's our 404 page being rendered!

# Conclusion

This is a really simple way of implementing a reusable mechanism to catch those common errors without clutering our controllers with repeated code. You can even create a class or a module to isolate this raise-the-error/treat-the-error logic without much effort.

Share your thoughts with us and comment about your prefered way of doing things!