---
layout: post
title: "Facebook authentication on ActiveAdmin"
date: 2014-02-03 17:00
categories:
author: Matheus Bras
comments: true
published: false
post_styles: hints
---

This is a quick tip on how to make facebook authentication work on ActiveAdmin.

<!--more-->

ActiveAdmin is a very nice admin interface for Ruby on Rails applications. It provides some nice defaults and it's also customisable enough to do something not so trivial.

Facebook authentication is also a very nice feature to have in your application. Let Facebook handle the credentials and don't worry about saving/salting/encrypting passwords on your side.

ActiveAdmin allow us to change the default authentication system that it uses, that is Devise. You can change this to your own solution. Let's see where you need to change it.

I won't go on full details on how to implement the authentication with Facebook. For that, you can read my [other post](http://helabs.com.br/blog/2013/06/24/implementando-login-via-facebook-na-sua-app-rails) on how to achieve this.

### Creating the controller helper methods

You'll need to have these two helper methods on your `ApplicationController`.

{% highlight ruby linenos %}
class ApplicationController < ActionController::Base
  # ...

  private

  def authenticate_user!
    redirect_to(root_url, notice: "You need to be authenticated") unless current_user
  end

  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  rescue ActiveRecord::RecordNotFound
    session.delete(:user_id)
    nil
  end

end
{% endhighlight %}

The `#authenticate_user!` method will be used in a before_action to check if there is an User logged in. The `#current_user` just finds the User based on the id that is set on the session.

We now need to configure ActiveAdmin to use these methods. Just open the `config/initializers/active_admin.rb` file. This is the configuration file for ActiveAdmin.

Find the line that configures the authentication method. It is around line 58.

{% highlight ruby linenos %}
# ...

# This setting changes the method which Active Admin calls
# within the controller.
config.authentication_method = :authenticate_admin_user!

# ...
{% endhighlight %}

Change the authentication method to the one on your `ApplicationController`.

{% highlight ruby linenos %}
  # ...

  # This setting changes the method which Active Admin calls
  # within the controller.
  config.authentication_method = :authenticate_user!

  # ...
{% endhighlight %}

Next, search for the line that configures the method that ActiveAdmin will use to identify the current logged in user. It's around the line 85.

{% highlight ruby linenos %}
# ...

# == Current User
#
# Active Admin will associate actions with the current
# user performing them.
#
# This setting changes the method which Active Admin calls
# to return the currently logged in user.
config.current_user_method = :current_admin_user

# ...
{% endhighlight %}

By default, the method is set to `#current_admin_user`. Let's change it to the `#current_user` method we implemented on our `ApplicationController`.

{% highlight ruby linenos %}
# ...
config.current_user_method = :current_user
# ...
{% endhighlight %}

And we're done. Now when the user log in via Facebook they will also have access to the admin. I hope this helps someone.
