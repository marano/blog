## Criando seu post

Execute ```rake new_post['Titulo do Post']```. Esse comando irá criar um branch e o arquivo do seu post.

Ou siga esses passos:

1) Clone o repositório [git@github.com:Helabs/blog.git](https://github.com/Helabs/blog) e tenha certeza de que está no branch `gh-pages`.

2) Crie uma branch com o título do seu post.

```
$ git checkout -b post/titulo-do-seu-post
```

3) Crie um arquivo em `_posts/titulo-do-seu-post.markdown` com o seguinte formato.

```
---
published: false
author: Seu Nome
layout: post
title: "Título"
date: AAAA-MM-DD HH:MM
comments: true
categories:
  - Tag1
  - Tag2
---

Conteúdo do post
```

4) Veja se ficou bom executando o projeto e acessando pelo browser o endereço [http://localhost:4000/blog/](http://localhost:4000/blog/) (Precisa de "/" no final do endereço).

```
$ foreman start
```

5) Commit as mudanças.

```
$ git add .
$ git commit -am 'post: Titulo do seu post'
```

6) Push na branch.

```
$ git push origin post/titulo-do-seu-post
```

7) Mande um pull request pela interface web do Github.

## Publicando um post

TODO.

## Observações

### Code Highlighting

Usar a seguinte sintaxe:

```
{% highlight ruby linenos %}
class Say
  def hello
    say "Hello!"
  end
end
{% endhighlight %}
```

### Imagens

Salve suas imagens em `/images/posts/YYYY-MM-DD/`, lembrando que em termos de url vai ficar `/blog/images/posts/YYYY-MM-DD/`.

## Licença

[Blog da HE:labs](http://helabs.com.br/blog/) e seu conteúdo está licenciado sob uma [licença Creative Commons Atribuição-NãoComercial-CompartilhaIgual 3.0 Não Adaptada](http://creativecommons.org/licenses/by-nc-sa/3.0/deed.pt_BR).
