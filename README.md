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
published: false
author: Your Name
layout: post
title: "Title"
date: YYYY-MM-DD HH:MM
comments: true
categories:
  - Tag1
  - Tag2
---

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
$ git checkout -b <nome_do_branch> origin/<nome_do_branch>
```
 
3) After review/modification, checkout the gh-pages branch:
 
```
$ git checkout gh-pages
```
 
4) Merge post's branch into gh-pages:
 
```
$ git merge <nome_do_branch>
```
 
5) If everything is ok, update the remote repo to publish it:
 
```
$ git push
```

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

## LICENSE

[Blog of HE:labs](http://helabs.com.br/blog/) and its content is licensed under an [Attribution-NonCommercial-ShareAlike 3.0 Unported license](http://creativecommons.org/licenses/by-nc-sa/3.0/legalcode).
