---
layout: post
title: "First steps on building a Single Page App with AngularJS"
author: Fábio Rehm
categories:
  - fabio rehm
  - javascript
  - angularjs
  - single page apps
  - english
---

I've been willing to try out [AngularJS](https://angularjs.org/) for a long time
and on this post I'll talk about my journey building [rubygems-charts](https://github.com/fgrehm/rubygems-charts),
a simple Single Page Application that fetches RubyGems downloads count from the
RubyGems API for each released version and displays that data on a chart.

<!--more-->

For a sneak peek at what we're going to build, check out the [live demo](http://rubygems-charts.herokuapp.com/).

## Why AngularJS?

I've done a lot of [Backbone](http://backbonejs.org/) on the past and I remember
having to write a lot of boilerplate code to make things work, being [data binding](http://en.wikipedia.org/wiki/Data_binding)
a big chunk of it. I know that these days there are nice plugins for Backbone that
solves this problem but I really wanted to learn something new. AngularJS comes
with support for data binding out of the box and is actually one of its [strengths](https://docs.angularjs.org/guide/databinding),
so I picked it as my next MV\* JavaScript framework to learn.

Also, from [its website](https://angularjs.org):

> HTML is great for declaring static documents, but it falters when we try to use
it for declaring dynamic views in web-applications. AngularJS lets you extend HTML
vocabulary for your application. The resulting environment is extraordinarily
expressive, readable, and quick to develop.


## A little bit about the framework

Angular [is a complete client-side solution](https://docs.angularjs.org/guide/introduction#a-complete-client-side-solution)
that _"is not a single piece in the overall puzzle of building the client-side
of a web application. It handles all of the DOM and AJAX glue code you once
wrote by hand and puts it in a well-defined structure"_.

The frameworks is made out of many different "things" but here's a list of
concepts that you need to be familiar with to better understand this post:

| Concept | Description |
| ------- | ----------- |
| View    | What the user sees (the DOM) |
| [Directive](https://docs.angularjs.org/guide/directive) | Markers on a DOM element (such as an attribute, element name, comment or CSS class) that tell AngularJS's HTML compiler to attach a specified behavior to that DOM element or transform the DOM element and its children. |
| [Template](https://docs.angularjs.org/guide/templates) | HTML with additional markup that gets rendered into a view. |
| [Controller](https://docs.angularjs.org/guide/controller) | The business logic behind views. |
| [Services](https://docs.angularjs.org/guide/services) | Reusable business logic independent of views. |
| Models | The data shown to the user in the view and with which the user interacts. |
| [Scopes](https://docs.angularjs.org/guide/scope) | Context where the model is stored so that controllers, directives and expressions can access it. |
| [Expressions](https://docs.angularjs.org/guide/expression) | How you access variables and functions from the scope. |
| [Dependency injection](https://docs.angularjs.org/guide/di) | A software design pattern that deals with how components get hold of their dependencies. |
| [Router](https://docs.angularjs.org/api/ngRoute/service/$route) | A service that is used for deep-linking URLs to controllers and views. It's a module that is distributed separately from the core Angular framework. |

_To find out about other framework concepts please check the [Developer Guide](https://docs.angularjs.org/guide/)_


## Initial setup

First of all, make sure you have [node.js](http://nodejs.org/) and [npm](https://www.npmjs.org/)
installed as they'll be needed to scaffold the application and to run the web
server.

With node.js and npm in place, we'll need to install [Yeoman](http://yeoman.io/)
and its [angular generator](https://github.com/yeoman/generator-angular) so that
we can scaffold our app:

{% highlight sh %}
npm install yo generator-angular -g
{% endhighlight %}


## Generate the application

To scaffold the app, all we need to do is create the new project folder, `cd` into
it and run `yo angular`. In other words:

{% highlight sh linenos %}
mkdir rubygems-charts && cd rubygems-charts
yo angular
{% endhighlight %}

The generator will ask you a couple questions to scaffold the app and I recommend
that you answer "No" to use [Sass](http://sass-lang.com/) and [Compass](http://compass-style.org/)
when asked, unless you know what they are and are willing to use them. Also, please
make sure you keep the `angular-route` module option selected when asked which
AngularJS modules you'd like to include since we'll be using it on rubygems-charts.

Once the bootstrapping process is done, we should be able to fire up a web server
with `grunt serve` and visit `http://localhost:9000` to see a "Hello world" page
like the one below:

![image](/blog/images/posts/2014-06-13/hello-world.png)

## Fetching RubyGems API data and displaying it to the user

Instead of building the chart right away, we'll start by reading the Gem name using
a form and render the downloads stats data in a `<ul>` to make things simpler so we
can better understand how the pieces fit together.

### Preparing our view to render the data

Given that we already have a list of downloads stats for each released version of a
given RubyGem on a controller's scope (we'll get there in a few ;), we can
change the template at `app/views/main.html` to something like this:

{% highlight html linenos %}
<ul>
  <li ng-repeat="version in rubyGemVersions">
    {% raw %}{{version.number}} was downloaded {{version.downloads_count}} times{% endraw %}
  </li>
</ul>
{% endhighlight %}

When rendering that template, the [`ng-repeat` directive](https://docs.angularjs.org/api/ng/directive/ngRepeat)
will perform a loop over the `rubyGemVersions` model available on our controller scope
and will assign each element of the array into the `stats` variable within the
`ng-repeat` "block". The  `{% raw %}{{<EXPRESSION>}}{% endraw %}` is how we tell
Angular to render some attribute of our `version` JavaScript object into the HTML.

If you try refreshing the page with the code above, you'll notice that nothing gets
displayed since we haven't set the `rubyGemVersions` variable anywhere. Before
getting to loading the data from the RubyGems API, let's first make sure our
template works with some fake data. So open up your `app/scripts/controllers/main.js`
and change it to:

{% highlight js linenos %}
angular.module('rubygemsChartsApp')
  .controller('MainCtrl', function ($scope) {
    $scope.rubyGemVersions = [
      { number: "1.0.0", downloads_count: 123 },
      { number: "2.0.0", downloads_count: 456 }
    ]
  });
{% endhighlight %}

In case you are wondering where does that `$scope` variable comes from, it's AngularJS
that "injects" it into our controller when building it. The framework is smart enough
to read the variable name that we used on the `function` signature and do its "magic"
to prepare the arguments required for it. For more information about how that works,
please have a look at AngularJS docs for [dependency injection](https://docs.angularjs.org/guide/di).

The result of that is something that should look like this:

![image](/blog/images/posts/2014-06-13/hard-coded-list.png)

### Hooking up the controller with real data from the RubyGems API

Now that we know how to connect our controller with the view, let's move on to loading
the data from the real RubyGems API into our list.

The data that we want to use comes from the [Gem versions endpoint](http://guides.rubygems.org/rubygems-org-api/#gem-version-methods)
of the RubyGems API but unfortunately we can't access it directly from the browser because of the
[same origin policy](http://en.wikipedia.org/wiki/Same_origin_policy). Luckily,
there is already a service built by [@i2bskn](https://github.com/i2bskn) available at
[http://rubygems-jsonp.herokuapp.com](http://rubygems-jsonp.herokuapp.com) that wraps
the RubyGems API for [JSONP](http://en.wikipedia.org/wiki/JSONP) so we can work around
that.

To abstract our API calls from the controller, we'll create a custom service that will
fetch our data and will act as a wrapper around AngularJS' built-in [`$http` service](https://docs.angularjs.org/api/ng/service/$http)
that is used for communication with remote HTTP servers. To make things easier, we'll
use Yeoman's angular generator to create the service with `yo angular:service RubyGemsApi`,
then we'll change the `app/scripts/services/rubygemsapi.js` file to:

{% highlight js linenos %}
angular.module('rubygemsChartsApp')
  .factory('RubyGemsApi', function($http) {
    var rgApi = {};

    rgApi.fetchDownloadStats = function(gemName) {
      var url = 'http://rubygems-jsonp.herokuapp.com/versions/' + gemName + '?callback=JSON_CALLBACK';
      return $http({
        method: 'JSONP',
        url:    url
      });
    };

    return rgApi;
  });
{% endhighlight %}

With the first two lines, we get hold of our app's [module](https://docs.angularjs.org/guide/module)
and register our service (`RubyGemsApi`) into it. Notice that we pass `$http` as a
parameter to the service constructor. As with the `$scope` argument provided to the
controller above, this tells Angular that our service depends on the `$http` service so
that we don't have to worry about creating it ourselves.

To make use of `RubyGemsApi` on our controller, it's just a matter of adding the service
as a parameter to the controller initializer `function` and call the `fetchDownloadStats`
method with a gem name:

{% highlight js linenos %}
angular.module('rubygemsChartsApp')
  .controller('MainCtrl', function ($scope, RubyGemsApi) {
    $scope.rubyGemVersions = [];
    RubyGemsApi.fetchDownloadStats('letter_opener').success(function(response) {
      $scope.rubyGemVersions = response.data;
    });
  });
{% endhighlight %}

Now if you reload the page you'll see the numbers for the [letter_opener](https://github.com/ryanb/letter_opener)
gem coming directly from the API.

![image](/blog/images/posts/2014-06-13/letter_opener.png)

### Reading user input from a form

Loading the stats for a single gem is not very exciting, let's create a form to ask the
user which gem he / she will like to see the stats for.

First, we'll add a form on top of the template at `app/views/main.html`:

{% highlight html linenos %}
<form ng-submit="loadGemStats()">
  <input type="text" ng-model="gemName">
</form>
{% endhighlight %}

And we'll change the controller to read the value from the form's textbox when it gets
submitted:

{% highlight js linenos %}
angular.module('rubygemsChartsApp')
  .controller('MainCtrl', function ($scope, RubyGemsApi) {
    $scope.rubyGemVersions = [];
    $scope.loadGemStats = function() {
      RubyGemsApi.fetchDownloadStats($scope.gemName).success(function(response) {
        $scope.rubyGemVersions = response.data;
      });
    }
  });
{% endhighlight %}

Notice that even though we don't declare the `gemName` variable within our `$scope`, it
gets "automagically" set by AngularJS because of the [`ng-model` directive](https://docs.angularjs.org/api/ng/directive/ngModel).
Now go back to the browser and try using the form, if all goes well you should see a list
of download stats under the form we've created after filling in the input and hitting
enter.


## Plotting user provided information on a chart

Cool, we are able to read the gem name from a form, load the data from the API. But what
about the chart? To make things easier, we'll use an Angular plugin called [angular-google-chart](https://github.com/bouil/angular-google-chart)
that provides a `google-chart` directive we can use in our apps so that we don't have
to reinvent the wheel.

### Installing and configuring angular-google-chart

I haven't mentioned it yet, but the application we are working on is using [Bower](http://bower.io/)
to manage our front-end dependencies. Bower is a package manager that helps you find and
install your application dependencies (like CSS frameworks and JS libraries) without the
need to manually download and update them. Bower should have been installed alongside
the application bootstrap, but if it is not, you can run `npm install bower -g`.

With Bower in place, we'll run `bower install angular-google-chart --save` to install
the package and we'll update the `app/index.html` file to include its JS file. Search
for a `bower:js` HTML comment "block" within that file and add a reference to the
angular-googler-chart JS file:

{% highlight HTML linenos %}
<!-- bower:js -->
<!-- ... other bower references here ... -->
<script src="bower_components/angular-google-chart/ng-google-chart.js"></script>
<!-- endbower -->
{% endhighlight %}

This will load the JS for the component, but we also need to tell Angular that our app
depends on it before using it. For that, we need to change our app's `module` definition
at `app/scripts/app.js` to load the `googlechart` module alongside other dependencies.

On `app/scripts/app.js`, we'll find some code like this:

{% highlight js linenos %}
angular
  .module('rubygemsChartsApp', [
    // ... other dependencies ...
    'ngRoute'
  ])
{% endhighlight %}

That will vary depending on which services you've selected when scaffolding the app with
Yeoman, but to load the `googlechart` module, it's a matter of adding a new string to that
array and we should be good to go:

{% highlight js linenos %}
angular
  .module('rubygemsChartsApp', [
    // ... other dependencies ...
    'ngRoute',
    'googlechart'
  ])
{% endhighlight %}

### Building the chart with RubyGems data

Given that the Google Chart module is properly set up, we can now replace our ugly
`<ul>` with a nice looking chart, so open up `app/views/main.html` and change the
unordered list to:

{% highlight html linenos %}
<div google-chart chart="rubyGemVersionsChart"></div>
{% endhighlight %}

Change the controller's code to build the proper data for the chart:

{% highlight js linenos %}
angular.module('rubygemsChartsApp')
  .controller('MainCtrl', function ($scope, RubyGemsApi) {
    $scope.loadGemStats = function() {
      RubyGemsApi.fetchDownloadStats($scope.gemName).success(function(response) {
        var rows = [];
        for (var i = 0; i < response.data.length; i++) {
          var version = response.data[i];
          rows.unshift({
            c: [ { v: version.number }, { v: version.downloads_count } ]
          });
        }

        $scope.rubyGemVersionsChart = {
          type: 'LineChart',
          data: {
            cols: [
              {id: "t", label: "Versions",  type: "string"},
              {id: "s", label: "Downloads", type: "number"}
            ],
            rows: rows
          }
        };
      });
    }
  });
{% endhighlight %}

And voilà:

![image](/blog/images/posts/2014-06-13/rails-chart.png)

## Sharing the chart with others

At this point we are able to display the data on the chart, but what if we wanted to
tweet about it? Right now there is no way we can do that because in order to build the
chart we need to use the form and the gem name is not embedded on the URL. To fix that
we are going to make use of AngularJS's [Router](https://docs.angularjs.org/api/ngRoute/service/$route).

Setting things up is pretty easy, first we'll have to add a new route at
`app/scripts/app.js`:

{% highlight js linenos %}
angular
  .module('rubygemsChartsApp', [
    // ...
  ])
  .config(function ($routeProvider) {
    $routeProvider
      // This is the new route
      .when('/:gemName', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      // ... other routes go here
  });
{% endhighlight %}

With that in place we'll have a variable `gemName` set on the [`$routeParams` service](https://docs.angularjs.org/api/ngRoute/service/$routeParams)
and to trigger a redirect, we'll use the [`$location` service](https://docs.angularjs.org/api/ng/service/$location).
Thanks to AngularJS' magic, changing the controller to work with those services is
pretty easy and is commented out on the snippet below:

{% highlight js linenos %}
angular.module('rubygemsChartsApp')
  // Here we added the $location and $routeParams services
  .controller('MainCtrl', function ($scope, $location, $routeParams, RubyGemsApi) {
    // Here we renamed the method from loadGemStats to buildChart
    $scope.buildChart = function() {
      // ...same code as before to build the chart...
    };
    // Trigger a redirect when the form is submitted
    $scope.loadGemStats = function() {
      $location.path($scope.gemName);
    };
    // Set the form input value
    $scope.gemName = $routeParams.gemName;
    // Load the chart if a gemName is set
    if ($scope.gemName) {
      $scope.buildChart($scope.gemName);
    }
  });
{% endhighlight %}

Now when you visit `http://localhost:9000/#/rails`, you'll see that the chart is built
right away without the need to submit the form!


## Deploy

Now that the app is "done", it's time to go live and deploy it somewhere.

The application is basically a set of HTML, CSS and JavaScript files that are generated
using `grunt build`, when you run that command, everything gets compiled and dropped
on the `dist` folder of your project. Hosting them on an Apache or nginx server is a
matter of uploading the files to the appropriate directory. Deploying to [GitHub Pages](https://pages.github.com/)
is as simple as creating a `gh-pages` branch on your git repository and committing +
pushing the files generated over there.

I chose to deploy it to [Heroku](https://www.heroku.com/) but it required a few changes
to the app so that I can let it do the compilation and I don't have to worry about
committing generated files into source control.

### Building the app after a `git push` on Heroku

First thing we'll do is [customize the build process](https://devcenter.heroku.com/articles/nodejs-support#customizing-the-build-process)
in order to install bower dependencies and compile the application assets. Looking at
Heroku's documentation for node.js apps, I found out that we can tell it to run some
commands after the default `npm install` with the `postinstall` config of the
`scripts` section of the `package.json` file:

{% highlight json linenos %}
{
  "name": "rubygemscharts",
  // ... other configs here ...
  "scripts": {
    "test": "grunt test",
    // This will tell heroku to install our Bower dependencies and build the app
    "postinstall": "bower install && grunt build"
  }
}
{% endhighlight %}

Another thing we'll need to do is to `npm install grunt-cli bower --save` and change the
`package.json` "dependencies" config to include [Grunt](http://gruntjs.com/) related
packages as they are currently set to development only and will have their installation
skipped on Heroku by default because of the `--production` flag that [gets provided to `npm install`](https://github.com/heroku/heroku-buildpack-nodejs/blob/master/bin/compile#L94).

### Serving static files

We are almost ready to push the app to Heroku, but since it does not know how to serve
the static files out of the box, we'll use [node-static](https://github.com/cloudhead/node-static)
to run a simple static file server.

To set things up, run `npm install node-static --save` and add `static -p $PORT dist`
to the "start" config of your "scripts" section of the `package.json` file.

### The final `package.json`

The versions you'll end up having on your `package.json` will vary, but this is how
your `package.json` should look like:

{% highlight json lineos %}
{
  "name": "rubygemscharts",
  "version": "0.0.0",
  "dependencies": {
    "bower": "^1.3.5",
    "grunt": "~0.4.1",
    "grunt-autoprefixer": "~0.4.0",
    "grunt-bower-install": "~1.0.0",
    "grunt-cli": "^0.1.13",
    "grunt-concurrent": "~0.5.0",
    "grunt-contrib-clean": "~0.5.0",
    "grunt-contrib-concat": "~0.3.0",
    "grunt-contrib-connect": "~0.5.0",
    "grunt-contrib-copy": "~0.4.1",
    "grunt-contrib-cssmin": "~0.7.0",
    "grunt-contrib-htmlmin": "~0.1.3",
    "grunt-contrib-imagemin": "~0.3.0",
    "grunt-contrib-jshint": "~0.7.1",
    "grunt-contrib-uglify": "~0.2.0",
    "grunt-contrib-watch": "~0.5.2",
    "grunt-google-cdn": "~0.2.0",
    "grunt-karma": "^0.8.3",
    "grunt-newer": "~0.6.1",
    "grunt-ngmin": "~0.0.2",
    "grunt-rev": "~0.1.0",
    "grunt-svgmin": "~0.2.0",
    "grunt-usemin": "~2.0.0",
    "jshint-stylish": "~0.1.3",
    "load-grunt-tasks": "~0.4.0",
    "node-static": "^0.7.3",
    "time-grunt": "~0.2.1"
  },
  "devDependencies": {
    "karma": "^0.12.16",
    "karma-jasmine": "^0.1.5",
    "karma-phantomjs-launcher": "^0.1.4"
  },
  "engines": {
    "node": ">=0.10.0"
  },
  "scripts": {
    "test": "grunt test",
    "start": "static -p $PORT dist",
    "postinstall": "bower install && grunt build"
  }
}
{% endhighlight %}

Now you should be a `git push heroku master && heroku ps:scale web=1` away from having
your app up and running on Heroku.


## Conclusion

This was a looong post, but I hope you enjoyed reading it and that it has given you a
good introduction on the basic concepts of building a single page application using
AngularJS. Overall, I found it to be a pretty easy to use framework and I hope that
I'll have a chance to use it on a real app soon.

Bear in mind, though, that the framework is very powerful and we've barely scratched
the surface in terms of what it has to offer and we didn't analyze anything in great
depth. If you are interested on learning more about Angular, I recommend reading its
great tutorial available at [https://docs.angularjs.org/tutorial](https://docs.angularjs.org/tutorial).

Sources for the app can be found at [https://github.com/fgrehm/rubygems-charts](https://github.com/fgrehm/rubygems-charts)
and you can try it out on [http://rubygems-charts.herokuapp.com](http://rubygems-charts.herokuapp.com).
