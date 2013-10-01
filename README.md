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

## Observações da nova versão

### Code Highlighting

Usem a tag "{% highlight ruby linenos %}" e fechem com {% endhighlight %}

### Imagens

As imagens ficam em "/blog/images/post/YYYY-MM-DD/"

## License
(The MIT License)

Copyright © 2009-2011 Brandon Mathis, HE:labs

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the ‘Software’), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED ‘AS IS’, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
