## Creating your post

Run ```rake new_post['Title of the post']```. This command will create a file and the branch for your post.

Or you can follow these steps:

1) Clone the repository [git@github.com:Helabs/blog.git](https://github.com/Helabs/blog) and make sure the branch is `gh-pages`.

2) Create a branch with the title of your post.

```
$ git checkout -b post/title-of-your-post
```

3) Create a file with name format `_posts/YYYY-MM-DD-title-of-your-post.markdown`.

```
---
layout: post
title: "Title"
author: Your Name
comments: true
categories:
  - Tag1
  - Tag2
---
Intro
<!--more-->              <- please don't forget this
Post content
```

4) Make sure that the project runs and you can open it on your browser [http://localhost:4000/blog/](http://localhost:4000/blog/) (Don't forget to put trailing '/').

```
$ foreman start
```

5) Commit changes.

```
$ git add .
$ git commit -am 'post: Title of your post'
```

6) Push the branch.

```
$ git push origin post/title-of-your-post
```

7) Send a pull request by GitHub web interface.

## Publishing a post

1) Make sure your gh-pages branch is updated:

```
$ git pull --rebase
```

2) Pull the post to a branch to do reviews and/or modifications:

```
$ git checkout -b <name-of-the-branch> origin/<name-of-the-branch>
```

3) After review/modification, checkout the gh-pages branch:

```
$ git checkout gh-pages
```

4) Merge post's branch into gh-pages:

```
$ git merge <name-of-the-branch>
```

5) If everything is ok, update the remote repo to publish it:

```
$ git push
```

## Maintainers

- [Bia](https://github.com/beatrizcp87)

## Notes

### Code Highlighting

Use the following syntax:

```
{% highlight ruby linenos %}
class Say
  def hello
    say "Hello!"
  end
end
{% endhighlight %}
```

### Images

Save your images in `/images/posts/YYYY-MM-DD/`. Your image URL will look like this: `/blog/images/posts/YYYY-MM-DD/`.

### Create a list

For create a list on your post, always use hifen (the "-"), like this:

```
- item1
- item2
- item3
```

And it will look like this:

- item1
- item2
- item3

Don't use asterisk, otherwise the list will break.

Or, you can use simples html like this:

```
<ul>
  <li>item 1</li>
  <li>item 2</li>
  <li>item 3</li>
</ul>

or

<ol>
  <li>item 1</li>
  <li>item 2</li>
  <li>item 3</li>
</ol>
```
And it will be like this:

<ul>
  <li>item 1</li>
  <li>item 2</li>
  <li>item 3</li>
</ul>

or

<ol>
  <li>item 1</li>
  <li>item 2</li>
  <li>item 3</li>
</ol>

## LICENSE

[Blog of HE:labs](http://helabs.com.br/blog/) and its content is licensed under an [Attribution-NonCommercial-ShareAlike 3.0 Unported license](http://creativecommons.org/licenses/by-nc-sa/3.0/legalcode).
