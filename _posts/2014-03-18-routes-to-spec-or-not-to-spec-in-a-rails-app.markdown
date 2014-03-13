---
published: true
author: Sylvestre Mergulhão
layout: post
title: "Routes: to spec or not to spec in a Rails app?"
date: 2014-03-18 14:00
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

This is a topic with some controversy about the benefits of having well spec'ed all your routes that **exist** and that **do not exist**. So I will tell you about my personal experience which later became the input to what we do nowadays at HE:labs.

<!--more-->

Many time ago I was hired to work on a company that had a huge Rails app with millions of users. At that time to have a **huge** website in Rails was not as common as it is today. We were probably on the TOP 20 (maybe TOP 10? Do anyone have any kind of statistic of big Rails apps in the period of 2007-2010?) biggest website in the world using Rails in terms of number of accesses. In my hands the website moved from Rails 1 to Rails 2 and then to Rails 3 (Rails 3 beta when I left to found HE:labs) and had one major redesign.

When I joined the team we had poor code coverage by tests. Almost nonexistent to be true. It was buggy. Thousants of exceptions happens everyday. Lot's of slow queries. Much unstability. So first of all I had to start learning the code and the business. But it was a **lot** of code to a website that was not so big in terms of features... I was walking on thin ice when doing any little change. Not always was possible to forecast what would be the effects of a change in the business logic.

For every step I did in code, I wrote a test (At that time we used Test::Unit. Some years later we moved to Rspec.), at least to make sure that what I was doing was going to have the desired result. If anything breaks together with my changes, I had to write another test to catch that undesired behavior and fix it. In these little steps when I left the company we was with almost 99% of the code covered by specs, including the routes. It was a slow process. I was not the only person in the team, but was with me that we started to put the app on the road.

## What was the deal with the routes?

In the past, Rails was know to be more flexible with routes. The RESTful concept implemented in the Rails routes became when the app was already written. So there was **a lot** of routes that did not make any sense if you would think in terms of the kind of REST that Rails implemented.

To make things even worst, Rails by default added at the end of the ``routes.rb`` file the following code:

{% highlight ruby linenos %}
map.connect ':controller/:action/:id'
map.connect ':controller/:action/:id.:format'
{% endhighlight %}

To the ones that are not from that time: it means that we can have many routes in the beginning of the ``routes.rb`` file. **BUT** if an accessed url did not match with any of the routes defined before, Rails would look in the controllers if there was any ``controller`` with name that matched with the desired url and then with the desired ``action`` and pass to the action (as ``params[:id]``) a possible ``id`` that was after the last dash in the url given.

This was a terrible thing because you could have a controller with no routes defined in the ``routes.rb`` file, with a lot of actions inside and you can't even know if any of that actions are still in use or not. In our case, the code was really bad, so there was a lot of unused code/actions. How to distinguish the code that is in use to the ones that is not? Remember, there was almost no tests in the beginning! [See more about Rails 1.2 routes][rails-1-2-routing] and also about [named routes][named-routes].

Look that the request would go into the action the way I explained no matter what was the HTTP verb used (GET/POST did not matter). This means that many bots crawled the website following links that was supposed to be POST requests, with expectation of some params being given, which caused a lot of unuseful hits and lots of exceptions (at that time, the code mostly did not check if the desired parameters for an action were present in ``params``).

Thanks Rails, looking to this past time, remembers me that we're much better today than was there. ;-)

## Things can be even worst

We were a website tunned in SEO. Every page was important to exist, the way it was, keeping there url untouched. There were also a lot of redirects of all kinds that should be kept.

The easier way to discover what was the more important routes was use the website in localhost, keeping the eyes on the logs to see which was the controllers and actions activated in every click I did in the browser. Based on these experiments I started creating tests to the routes. But the major problem was not to discover the ones that were in use. The big problem was to discover what were the routes **really not in use**, so we could block any access to it and just return what is expected to a nonexistent url: 404.

The website was like a swiss cheese with lots of holes everywhere and we had to start blocking access to urls that **should not** exist anymore, but were there, public, and being banged by a lot of bots and users with a high risk of having security issues.

This is the point where the tests or specs on routes are so important. To define which routes exists and which one are not supposed to exist.

## How it should be done?

It's a lot easy to forget unused routes when using [resources][resources] (if you're not using resources you're wrong, ok?). Who never left a:

{% highlight ruby linenos %}
resources :articles
{% endhighlight %}

When the desired was:

{% highlight ruby linenos %}
resources :articles, only: [:index]
{% endhighlight %}

If you had written the specs of what routes **should not** exist, it would alert you about that and you would fix the code before commit or go to production. That's the most importance of testing routes in Rails today.

You can say that it's not a problem to leave these lost routes there. After all there is no link to it in any place... It may not be a problem now. But what if, some months later, other developer inherit ``ArticlesController`` from [inherited resources][inherited-resources]? You will start exposing to public actions that should not even exist. I would not think it's hard if do already exists bots, just for Rails applications, seeking flaws like this.

Other issues could happens... Like Rails being exposed to a security issue that exploits undefined actions with open routes? (no more futurology from this point, I promess ;-)

Is it worth taking a risk like these, because of lazyness to write a simple test file with 20 lines of code? I don't think so. In this case the use of [Defensive programming][defensive-programming] is highly desirable.

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

As you can see, I cover, not the only the accessible action, but also the remaining REST actions that are not accessible.

It's also good to cover the url helpers of the routes that exists. It ensures that they correctly exists (as you will use it in links and/or forms) and that urls are being well generated, according to the given params (in this case, no params).

## The end

Routes specs are a lot connected with controller specs. For me, it should live in the same file. I mean: the ``routing`` and the ``helpers`` describes from the routes spec file would live inside the regular controller spec file. I already tried it some months ago (still in Rails 3), but it did not works there. Rspec have some glue that makes it only works inside ``spec/routes`` directory. I never tried it again later.

Hope it helps to convince you how important is to spec your routes.

To the curious: the website was Redeparede.com. Some years later sold to [Clasificados.com][clasificados].

[named-routes]: http://railscasts.com/episodes/34-named-routes
[rails-1-2-routing]: http://apidock.com/rails/v1.2.0/ActionController/Routing
[resources]: http://guides.rubyonrails.org/routing.html#resources-on-the-web
[inherited-resources]: https://github.com/josevalim/inherited_resources
[clasificados]: http://www.clasificados.com/
[defensive-programming]: http://en.wikipedia.org/wiki/Defensive_programming