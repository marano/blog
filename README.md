## Creating your post

Run ```rake new_post['Title of the post']```. This command will create a file and the branch for your post.

Or you can follow these steps:

1) Clone the repository [git@github.com:Helabs/blog.git](https://github.com/Helabs/blog) and make sure the branch is `gh-pages`.

2) Create the post file and local branch

```
$ rake new_post['Title of the post']
```

3) Make sure that the project runs and you can open it on your browser [http://localhost:4000/blog/](http://localhost:4000/blog/) (Don't forget to put trailing '/').

```
$ foreman start
```

4) Write your post and commit it.

```
$ git commit -am 'post: Title of your post'
```

5) Push the branch.

```
$ git push --set-upstream origin post/title-of-your-post
```

6) Send a pull request by GitHub web interface.

## Publishing a post

1) Go to the post pull request on GitHub web interface.

2) Check if the publish date is correct on the post filename. It should be the current day. If it's wrong, ask the author to fix it.

3) Merge it clicking on the green button.

4) Remove the branch clicking on the gray button.

5) See if it's working live!

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
