## Criando seu post

1) Clone o repositório
git@github.com:Helabs/blog.git

2) Vá para o branch gh-pages:
git checkout gh-pages

3) Cria uma branch com o titulo do seu post:
git checkout -b post/titulo-do-seu-post

4) Crie o seu post:
rake new_post["Titulo do seu post"] ou se você estiver usando zsh rake "new_post[Titulo do seu post]"

5) Edite o seu post em _posts/ com o formato abaixo

```
---
published: false
author: Seu Nome
layout: post
title: "Título"
date: AAAA-MM-DD HH:MM
comments: true
categories:
  - Tags
  - Tags
---
Conteúdo do post
```

6) Veja se ficou bom executando: foreman start

7) Acesse no browser: http://localhost:4000/blog/

8) Commit as mudanças: git commit -am 'post: Titulo do seu post'

9) Push na branch: git push origin post/titulo-do-seu-post

10) Mande um pull request

11) **Merge no branch gh-pages e está publicado.**

## Observações da nova versão

### Code Highlighting

Usem a tag "{% highlight ruby linenos %}" e fechem com {% endhighlight %}

### Imagens

As imagens ficam em "/blog/images/post/YYYY-MM-DD/"

## License

[Blog da HE:labs](http://helabs.com.br/blog/) e seu conteúdo está licenciado sob uma [licença Creative Commons Atribuição-NãoComercial-CompartilhaIgual 3.0 Não Adaptada](http://creativecommons.org/licenses/by-nc-sa/3.0/deed.pt_BR).
