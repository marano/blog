---
published: true
author: Mauro George
layout: post
title: "How do I test an application_controller on a rails app"
date: 2014-01-31 15:16
comments: true
categories:
  - mauro george
  - rails
  - application_controller
  - test
  
post-styles: hints 
  
---

Have you ever in your life as a rails developer needed to test an application controller? How did you do that? Let's take a look at the dos and dontdos.

<!--more-->

## A simple application_controller on a rails app

I will use the [strawberrycake](https://github.com/FlaviaFortes/strawberrycake) of Flavia, as an example. It is a simple app that uses a login via facebook. Lets take a look at the [`application_controller.rb`](https://github.com/FlaviaFortes/strawberrycake/blob/67933d2ac94a2c0347852d6a21e3d00b3d7d7a86/app/controllers/application_controller.rb).

{% highlight ruby linenos %}
class ApplicationController < ActionController::Base
  protect_from_forgery
  ensure_security_headers # See more: https://github.com/twitter/secureheaders
  helper_method :current_user, :user_signed_in?

  private

  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
    rescue ActiveRecord::RecordNotFound
      session.delete(:user_id)
      nil
  end

  def user_signed_in?
    !current_user.nil?
  end

  def authenticate!
    user_signed_in? || redirect_to(root_url, notice: "Você precisa estar autenticado...")
  end
end
{% endhighlight %}

We have 3 private methods, that we will use in our controllers like a [`posts_controller`](https://github.com/FlaviaFortes/strawberrycake/blob/67933d2ac94a2c0347852d6a21e3d00b3d7d7a86/app/controllers/posts_controller.rb). Lets take a look at the specs.

{% highlight ruby linenos %}
require 'spec_helper'

describe ApplicationController do
  let!(:user) { create(:user) }

  # ...

  describe "user_signed_in? helper" do
    context "with user logged in" do
      before do
        session[:user_id] = user.id
      end

      it "returns true" do
        expect(controller.send(:user_signed_in?)).to be_true
      end
    end

    context "without user logged in" do
      it "returns false" do
        expect(controller.send(:user_signed_in?)).to be_false
      end
    end
  end
end
{% endhighlight %}

I showed only a few lines, but for our example it is ok. We need to focus on how the tests are made. They are using `controller.send` to access a private method. It is a good practice to not test private methods. A private method is an implementation detail that should be hidden to the users of the class. If our private method has big responsibility and doing a lot of stuffs, it is better to extract this private methods to its own class. Let's refactor these specs!

## Meet the anonymous controller

The RSpec Rails have the [anonymous controller](https://www.relishapp.com/rspec/rspec-rails/docs/controller-specs/anonymous-controller) it is a nice way to test the application_controller. Let's use it.

### The current_user

The objective of the `current_user` method it is to return the current user if it is present, or to return `nil` if we don't have a current user. Let's change the specs to use the anonymous controller.

{% highlight ruby linenos %}
describe ApplicationController do

  controller do

    def index
      @current_user = current_user
      render text: 'Hello World'
    end
  end

  let!(:user) do
    create(:user)
  end

  describe '#current_user' do

    context 'with user logged in' do

      before do
        sign_in_via_facebook(user)
        get :index
      end

      it 'assigns the current_user' do
        expect(assigns(:current_user)).to eq(user)
      end
    end

    context 'without user logged in' do

      it 'current_user be nil' do
        get :index
        expect(assigns(:current_user)).to be_nil
      end
    end

    context "can't find the user" do

      before do
        session[:user_id] = '#77'
        get :index
      end

      it 'current_user be nil' do
        expect(assigns(:current_user)).to be_nil
      end

      it 'unsets the session[:user_id]' do
        expect(session[:user_id]).to be_nil
      end
    end
  end
end
{% endhighlight %}

First we create a controller using the block `controller`, with this we can create an anonymous controller that behaves like a regular controller inherited from `ApplicationController`. In this controller we create a single action that assigns `@current_user` with the value of `current_user`.

Now we can test `index` action the way we test all regular actions. We don't need the `send` method. We just need to test the value of `@current_user` only.


### The user\_signed\_in?

The same way we create an `index` action, we can create a `new` action. The anonymous controller have all the resource routes. If you try a custom route on this controller you get an `ActionController::RoutingError`.

{% highlight ruby linenos %}
describe ApplicationController do

  controller do

    def index
      @current_user = current_user
      render text: 'Hello World'
    end

    def show
      if user_signed_in?
        render text: 'Signed user'
      else
        render text: 'Not signed user'
      end
    end
  end

  let!(:user) do
    create(:user)
  end

  # ...

  describe '#user_signed_in?' do

    context 'with user logged in' do

      before do
        sign_in_via_facebook(user)
        get :show, id: 2
      end

      it 'be a signed user' do
        expect(response.body).to include('Signed user')
      end
    end

    context 'without user logged in' do

      it 'returns false' do
        get :show, id: 2
        expect(response.body).to include('Not signed user')
      end
    end
  end
end
{% endhighlight %}

To test the `user_signed_in?` we create a `show` action. This action shows a text based state of user, if it's logged in or not. This way we can simply test the response, as a regular controller.

### The last one is the authenticate!

To finish, we create an action `new` on our controller. If you still have a doubt if the controller block is a controller, you should add a `before_filter` in the `new` action.

{% highlight ruby linenos %}
describe ApplicationController do

  controller do
    before_filter :authenticate!, only: [:new]

    def index
      @current_user = current_user
      render text: 'Hello World'
    end

    def show
      if user_signed_in?
        render text: 'Signed user'
      else
        render text: 'Not signed user'
      end
    end

    def new
      render text: 'A new thing'
    end
  end

  # ...

  describe '#authenticate!' do

    include_examples "authentication required" do
      let(:action) { get :new }
    end

    context "logged in" do

      before do
        sign_in_via_facebook(user)
        get :new
      end

      it { should respond_with(:success) }
    end
  end
end
{% endhighlight %}

We use the actual shared example of authentication and make a simple test that the action answers with success when user is logged in.

## Conclusion

Using anonymous controller we can make our tests on the application controller without the need to use `send`. This way we can keep our specs testing the behavior and not the implementation details.

Keep hacking!