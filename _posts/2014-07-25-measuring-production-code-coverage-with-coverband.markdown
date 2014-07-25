INTRODUCTION

No examples on how to use it with a heroku app

---------------------------------

ABOUT THE APP

used pah to generate the app

example: legacy blog app, added support for categories and comments and later removed (just the links and the code that displays it on the page)

from readme, after 30 minutes on prod, removed around 2k lines of code

https://techblog.livingsocial.com/blog/2013/12/17/coverband-production-ruby-code-coverage/

https://github.com/danmayer/coverband#clearing-line-coverage-data

-------------------
SETUP

data will be stored on redis
add to gemfile, bundle install

FROM GEM'S README

  After installing the gem. There are a few steps to gather data, view reports, and for cleaning up the data.

  First configure cover band options using the config file, See the section below
  Then configure Rake, with helpful tasks. Make sure things are working by recording your Coverband baseline. See the section below
  Setup the rack middleware, the middleware is what makes Coverband gather metrics when your app runs. See below for details
  I setup Coverband in my rackup config.ru you can also set it up in rails middleware, but it may miss recording some code coverage early in the rails process. It does improve performance to have it later in the middleware stack. So there is a tradeoff there.
  To debug in development mode, I recommend turning verbose logging on config.verbose = true and passing in the Rails.logger config.logger = Rails.logger to the Coverband config. This makes it easy to follow in development mode. Be careful to not leave these on in production as they will effect performance.
  Start your server with rackup config.ru If you use rails s make sure it is using your config.ru or Coverband won't be recording any data.
  Hit your development server exercising the endpoints you want to verify Coverband is recording.
  Now to view changes in live coverage run rake coverband:coverage again, previously it should have only shown the baseline data of your app initializing. After using it in development it should show increased coverage from the actions you have exercised.


configure [coverband options](LINK TO FILE), make sure to comment the options or at least point to the readme
configure [rake tasks](LINK TO FILE)
configure [middleware](LINK TO FILE)

[rake task to collect data from heroku](LINK)

heroku addons:add redistogo

https://github.com/danmayer/coverband/issues/3

deployed to heroku

prerelease / new 1.0.0 on the way

make sure it clears data on deploy

-----------------------------------


looking at the results

run rake task

* using slim it considers part of the template as not covered (even though it gets rendered, link to stuff on erb)
* lots of lines not taken into consideration
* TODO: check if unused associations will be picked up
* models that are not in use will be hard to spot unless they have some custom logic that is not going to be hit and will lower its coverage
* coverband VS rails assets
* redis free addon limitations (no backup, storage capacity....)
* https://twitter.com/danmayer/status/492793622765379586


-------------------------------------

TODO: Generate coverage from the heroku app

Works because of single dyno

figure out the performance impact on a real app

--------------------------------

conclusion

>>>>>>>>>>>>>>>>>>>>>

at he labs we strive for [100% code coverage from day one](), but that doesn't mean that what we write are actually in use on production

tks to danmayer and xxxxx for reviewing
