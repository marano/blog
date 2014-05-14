---
author: Sylvestre Mergulhão
layout: post
title: "Routes: to spec or not to spec in a Rails app?"
comments: true
categories:
  - rails
  - routes
  - rspec
  - bdd
  - tdd
  - sylvestre mergulhao
  - english

---

This is a topic with some controversy about the benefits of having well spec'ed all your routes that **exist** and that **do not exist**. So I will tell you about my personal experience which later became what we do nowadays at HE:labs.

<!--more-->

Some time ago I was hired to work on a company that had a huge Rails app with millions of users. The website was like a swiss cheese with lots of holes everywhere and we had to start blocking access to urls that **should not** exist anymore, but were there, public, and being banged by a lot of bots and users with a high risk of having security issues. At that time, to have a **huge** website in Rails was not as common as it is today. We were probably on the TOP 20 (maybe TOP 10? Does anyone have any kind of statistic of big Rails apps during 2006-2010?) website in the world using Rails in terms of number of visits. In my hands the website moved from Rails 1 to Rails 2 and then to Rails 3 (Rails 3 beta when I left to found HE:labs), and had one major redesign.

When I joined the team we had poor code coverage by tests. Almost nonexistent to be true. It was buggy. Thousands of exceptions were happening everyday. Lots of slow queries. Very unstable. So first of all I had to start learning the code and the business. But it was a **lot** of code for a website that was not so big in terms of features... I was walking on thin ice when doing any little change. It wasn't always possible to predict what would be the effects of a change in the business logic.

For every change I made in code, I wrote a test. At that time we used Test::Unit. We moved to Rspec some years later. I was making sure that what I was doing was going to have the desired result. If something got broken with my changes, I had to write another test to catch that undesired behavior and fix it. With these little steps, when I left the company, we were with almost 99% of the code covered by specs, including the routes. It was a slow process. I wasn't the only developer in the team, but it wasn't until I decided to act that we started to get the app back on track.

## What was the deal with the routes?

In the past, Rails was known to be more flexible with routes. The RESTful concept was implemented into the Rails routes after the app was already written. So there were **a lot** of routes that did not make any sense in terms of the RESTful routes of Rails.

To make things even worse, Rails added the following code at the end of the ``routes.rb`` file by default:

{% highlight ruby linenos %}
map.connect ':controller/:action/:id'
map.connect ':controller/:action/:id.:format'
{% endhighlight %}

If those of you that are not from that time: it means that we could have many routes in the beginning of the ``routes.rb`` file, **BUT** if an accessed url did not match with any of the routes defined before, Rails would look:

1. In the controllers, if there was any controller with the name that matched with the requested url;
2. Inside the controller the requested action;
3. And then it would try to pass to the action (as ``params[:id]``) a possible id that was after the last slash in the given url.

This was a terrible thing because you wouldn't even know if any of those actions are still meant to be accessible or not. In our case, the code was really bad, there was a lot of unused actions. How to distinguish the code that is in use to the ones that is not? Remember, there were almost no tests in the beginning! [See more about Rails 1.2 routes][rails-1-2-routing] and also about [named routes][named-routes].

The request could go into the action the way I explained, no matter what HTTP verb was used (GET/POST did not matter). This means that many bots crawled the website following links that were supposed to be POST requests, with expectation of some params being given, which caused a lot of unuseful hits and lots of exceptions (at that time, the code mostly did not check if the requested parameters for an action were present in ``params`` or not).

Thanks Rails, looking to those times, I can say that we're much better today. ;-)

## Things can be even worse

We had a website tuned for SEO. Every page was important to exist, the way it was, keeping its url untouched. There were also a lot of redirects of all kinds that should be kept. Any misstep would be a disaster to our pagerank.

The easier way to discover which routes were more important was to use the website in localhost, observing the logs to see which of the controllers and actions were activated by every click in the browser. Based on these experiments I started creating tests for the routes. But the major problem was not to discover the ones that were in use. The biggist problem was discovering what were the routes **really not in use**, so we could block any access to it and just return what is expected to a nonexistent url: 404.

This is the point where the tests or specs on routes are so important. To define which routes exists and which one are not supposed to exist.

## How it should be done?

It's a lot easier to forget unused routes when using [resources][resources] (if you're not using resources you're wrong, ok?). Who never left a:

{% highlight ruby linenos %}
resources :articles
{% endhighlight %}

When the desired was:

{% highlight ruby linenos %}
resources :articles, only: [:index]
{% endhighlight %}

If you had written the specs of which routes **should not** exist, it would alert you about that and you would fix the code before committing or going to production. That's the most important thing about testing routes.

You can say that it's not a problem to leave these lost routes there. After all, there is no link to it in any place... It may not be a problem now. But what if, some months later, another developer inherits ``ArticlesController`` from [inherited resources][inherited-resources]? You will start exposing to public actions that should not even exist. It's likely that bots that exploit these flaws in Rails applications already exist.

Other issues could happen too... Like Rails being exposed to a security issue that exploits undefined actions with open routes? (no more futurology from this point, I promise ;-)

Is it worth taking a risk like this, because of lazyness to write a simple test file with 20 lines of code? I don't think so. In this case, the use of [Defensive programming][defensive-programming] is highly desirable.

I'm not saying that if you do not write route specs, your website will become like the website in this story. Definitely our problem was not **only** the missing routing tests. But I'm assuming you know the [Broken windows theory][Broken_windows_theory], right? So I don't need to say anything else.

This is an example of what I think is a good approach to spec the code above:

{% highlight ruby linenos %}
describe ArticlesController do
  describe :routing do
    it { expect(get("/articles")).to route_to("articles#index") }
    it { expect(get("/articles/new")).to_not be_routable }
    it { expect(post("/articles")).to_not be_routable }
    it { expect(get("/articles/1")).to_not be_routable }
    it { expect(get("/articles/1/edit")).to_not be_routable }
    it { expect(put("/articles/1")).to_not be_routable }
    it { expect(delete("/articles/1")).to_not be_routable }
  end

  describe :helpers do
    it { expect(articles_path).to eq("/articles") }
  end
end
{% endhighlight %}

As you can see, I cover not only the accessible action, but also the remaining REST actions that are not accessible.

It's also good to cover the url helpers of the routes that exists. It ensures that they exist correctly (as you will use it in links and/or forms) and that the urls are being well generated, according to the given params (in this case, no params).

## The end

Routes specs are really connected with controller specs. For me, it should live in the same file. I mean: the ``routing`` and the ``helpers`` describes from the routes spec file would live inside the regular controller spec file. I already tried it some months ago (still in Rails 3), but it did not work there. Rspec has some glue that only works inside the ``spec/routes`` directory. I never tried it again later.

To the curious ones: the website was Redeparede.com. Some years later sold to [Clasificados.com][clasificados].

[named-routes]: http://railscasts.com/episodes/34-named-routes
[rails-1-2-routing]: http://apidock.com/rails/v1.2.0/ActionController/Routing
[resources]: http://guides.rubyonrails.org/routing.html#resources-on-the-web
[inherited-resources]: https://github.com/josevalim/inherited_resources
[clasificados]: http://www.clasificados.com/
[defensive-programming]: http://en.wikipedia.org/wiki/Defensive_programming
[Broken_windows_theory]: http://en.wikipedia.org/wiki/Broken_windows_theory
