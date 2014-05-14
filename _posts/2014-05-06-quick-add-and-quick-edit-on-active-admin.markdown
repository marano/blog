---
layout: post
title: "Quick add and quick edit on Active Admin"
author: Tomás Augusto Müller
comments: true
categories:
  - active admin
---

Ah, administrative interfaces. Sometimes so simples, sometimes so complex. The only sure is that they will stay with us
for years. In this post we'll learn how to implement a "quick add" and "quick edit" feature on active admin that you can
leverage if your admin panel is rapidly becoming a mess.

<!--more-->

![Bad UI](/blog/images/posts/2014-05-06/bad_ui.jpg)
<div style="text-align: center;">Not quite a web interface, but you get the point.</div>
<p> </p>

## Application Setup

Let's skip some steps here by using the [Pah](https://github.com/Helabs/pah) gem to setup and configure a fresh Rails app for us.
Pah is the base Rails application used here at [HE:labs](http://helabs.com.br). With a configured and running Rails app the
 next step is [install active admin](https://github.com/gregbell/active_admin/blob/master/docs/0-installation.md),
 and set up a simple user authentication system, so users can log in into our administrative area.
 If you are starting from point zero, you can check the user authentication mechanism using Facebook Login implemented
 on [Strawberrycake](https://github.com/FlaviaFortes/strawberrycake) project, and
 later on add [Facebook authentication on active admin](http://helabs.com.br/blog/2014/04/07/facebook-authentication-on-activeadmin/).

Or, if you already have all of the above, just skip these steps and lets get our hands dirty!

## Our sample model

Imagine that you have to build a administrative panel to manage the projects of your company. You have a Project model that
have a <u>name</u>, <u>description</u>, <u>client</u>, <u>start date</u>, <u>end date</u>, <u>participants</u>,
<u>tags</u>, <u>budget</u>, <u>documents</u>, <u>images</u>, <u>links</u>, etc. The list of attributes and associations can easily continue.

Considering the objectives of this post let's suppose that inserting a new project and updating the budget are the most common operations.

Instead of offering only the project admin panel, will all project fields and associations available, where users will
access just add or edit one or two fields, it would be very handy if we could quick insert new projects only by supplying
the project name and client, without leaving the list of projects and loosing any filter previously applied to the projects
index. Also, having link to update the project budget, with the same behavior, could let our users even happier.

## Preparing active admin

To accomplish both of our objectives we are going to use modal dialogs. Among the bests is [Fancybox](https://github.com/fancyapps/fancyBox).
FancyBox is a tool that offers a nice and elegant way to add zooming functionality for images, html content and multi-media on your webpages.
It is built on the top of the popular JavaScript framework jQuery and is both easy to implement and a snap to customize.
Licensed under [Creative Commons Attribution-NonCommercial 3.0](http://creativecommons.org/licenses/by-nc/3.0/) license, you are free to use fancyBox
for your personal or non-profit website projects, or you can get the author's permission to use fancyBox for commercial
websites by [paying a fee](http://fancyapps.com/store/).

After installing fancybox into your application, change the active admin assets to look like this:

app/assets/javascripts/**active_admin.js.coffee:**
{% highlight coffeescript linenos %}
#= require active_admin/base
#= require fancybox
jQuery ->
  $('a.fancybox').fancybox()
{% endhighlight %}

app/assets/stylesheets/**active_admin.css.scss:**
{% highlight sass linenos %}
@import "active_admin/mixins";
@import "active_admin/base";
@import "fancybox";
{% endhighlight %}

Finally, considering our sample model `Project`, create the projects admin panel:
{% highlight ruby linenos %}
rails generate active_admin:resource Project
{% endhighlight %}


## The quick add

Add the following routes to your application:

{% highlight ruby linenos %}
get '/admin/projects/new/quick_add' => 'admin/projects#quick_add', as: :admin_project_quick_add
post '/admin/projects/quick_create' => 'admin/projects#quick_create', as: :admin_project_quick_create
{% endhighlight %}

Edit the `app/admin/project.rb` and add the following action item to open the quick add modal from project index:

{% highlight ruby linenos %}
action_item only: :index do
  link_to 'Quick add', admin_project_quick_add_path, class: 'fancybox', data: { 'fancybox-type' => 'ajax' }
end
{% endhighlight %}

Still on `app/admin/project.rb`, implement the `quick_add` and `quick_create` controller actions, and don't forget
to [setup the permitted params](https://github.com/gregbell/active_admin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters).

{% highlight ruby linenos %}
controller do
  def quick_add
    @project = Project.new
    render layout: false
  end

  def quick_create
    @project = Project.new(permitted_params[:project])
    @project.save
  end
end
{% endhighlight %}

Finally, the views:

app/views/admin/projects/**quick_add.html.slim**:

{% highlight haml linenos %}
#modal
  h2 New Project
  p.modal-description Project Quick Add.

  section#quick-add-errors
    = render 'error_messages', object: @project

  section.form-fluid
    = simple_form_for(@project, url: admin_project_quick_create_path, remote: true) do |f|
      .form-inputs
        = f.input :name
        = f.input :client
      ul.form-actions
        li
          = f.submit 'Save'
{% endhighlight %}

app/views/admin/projects/**quick_create.js.erb**:

{% highlight erb linenos %}
<% if @project.errors.any? %>
  var html = "<%= escape_javascript(render 'error_messages', object: @project) %>";
  $('#quick-add-errors').html(html);
<% else %>
  window.location.reload();
<% end %>
{% endhighlight %}

## The quick edit

TODO from tomasmuller: write here about quick edit.