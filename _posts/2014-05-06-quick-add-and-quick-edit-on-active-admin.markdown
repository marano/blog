---
layout: post
title: "Quick add and quick edit on Active Admin"
author: Tomás Augusto Müller
comments: true
categories:
  - active admin
---

In this post we'll learn how to implement a "quick add" and "quick edit" feature on active admin that you can use to give users more agility on administrative operations.

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

To accomplish both of our objectives we are going to use modal dialogs. Here specifically, we will use [Fancybox](https://github.com/fancyapps/fancyBox).
After installing Fancybox into your application (you can use [this gem](https://github.com/kyparn/fancybox2-rails/)), change the active admin assets to look like this:

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

Edit the `app/admin/project.rb` and add the following action item to let users open the quick add modal only from project index:

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
    render 'quick_response', layout: false
  end
end
{% endhighlight %}

Finally, the views:

app/views/admin/projects/**quick_add.html.slim**:

{% highlight haml linenos %}
#modal
  h2 New Project
  p.modal-description Project Quick Add.

  section#quick-errors
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

app/views/admin/projects/**quick_response.js.erb**:

{% highlight erb linenos %}
<% if @project.errors.any? %>
  var html = "<%= escape_javascript(render 'error_messages', object: @project) %>";
  $('#quick-add-errors').html(html);
<% else %>
  window.location.reload();
<% end %>
{% endhighlight %}

Note the usage of an `error_messages` partial. Here I'm using [the one included by Pah](https://github.com/Helabs/pah/blob/master/lib/pah/files/app/views/application/_error_messages.html.slim).
Also, this same file will be used as response for the quick edit feature that follows.

## The quick edit

Add the following routes to your application:

{% highlight ruby linenos %}
get '/admin/projects/:id/edit/quick_edit' => 'admin/projects#quick_edit', as: :admin_project_quick_edit
post '/admin/projects/:id/quick_update' => 'admin/projects#quick_update', as: :admin_project_quick_update
{% endhighlight %}

Edit the `app/admin/project.rb` and override the index page. The trick here is how we append our new quick edit link to the default ones:

{% highlight ruby linenos %}
index do
  column :id
  column :name
  column :client
  column :budget
  # more columns definitions...

  actions defaults: true do |project|
    link_to 'Quick Edit', admin_project_quick_edit_path(project), class: 'fancybox', data: { 'fancybox-type' => 'ajax' }
  end
end
{% endhighlight %}

Still on `app/admin/project.rb`, implement the `quick_edit` and `quick_update` controller actions.

{% highlight ruby linenos %}
controller do
  # def quick_add...
  # def quick_create...

  def quick_edit
    @project = Project.new
    render layout: false
  end

  def quick_update
    @project = Project.find(params[:id])
    @project.update(permitted_params[:project])
    render 'quick_response', layout: false
  end
end
{% endhighlight %}

Finally, the view:

app/views/admin/projects/**quick_edit.html.slim**:

{% highlight haml linenos %}
#modal
  h2 Quick Edit Project
  p.modal-description Edit Project Budget.

  section#quick-errors
    = render 'error_messages', object: @project

  section.form-fluid
    = simple_form_for(@project, url: admin_project_quick_update_path, remote: true) do |f|
      .form-inputs
        = f.input :budget
      ul.form-actions
        li
          = f.submit 'Save'
{% endhighlight %}
