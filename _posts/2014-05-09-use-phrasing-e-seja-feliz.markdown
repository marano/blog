---
author: Rafael Fiuza
layout: post
title: "Use Phrasing e seja feliz"
comments: true
categories:
  - Rails
  - Ruby
  - Gems

---

Talvez o título desse post seja um pouco tendencioso. Mas bem pouco.
Imagine a cena: No meio da semana, com diversas tarefas para serem feitas e que precisam estar prontos na quinta feira, seu cliente pede para alterar um texto em produção. Agora imagine que você pode dizer para ele: "Mude você!".

<!--more-->

Ok, provavelmente não seria bem assim que diria. Mas imagine dar o poder de alterar o texto do site 'on the fly', sem tela de admin, sem formulários e sem burocracia.
Sim, isso já é possivel. Apresento a vocês a gem [Phrasing](https://github.com/infinum/phrasing).


A instalação é simples e está bem descrito na pagina da gem no github. E a forma de uso também. Fiz um pequeno [projeto](https://github.com/guiloyins/test-phrasing) para ilustrar. O mesmo pode ser testado [aqui](http://phrasing-test.herokuapp.com/edit).
Para esse exemplo precisaremos de tesoura, cola e um simples projeto em rails.

Após adicionar a `gem "phrasing"` no Gemfile, rodar `bundle`, `rake phrasing:install` e `rake db:migrate`. Ao fazer o `rake phrasing:install` será também adicionado um arquivo chamado phrasing_helper.rb na pasta helpers. Nesse helper o metodo can_edit_phrases precisa ser implementado para controlar quem e quando pode editar algo.

{% highlight ruby linenos %}
module PhrasingHelper

  def can_edit_phrases?
    request.subdomains.first == 'edit' && current_user.admin?
  end
end
{% endhighlight %}

Finalmente, na view basta adicionar `phrase('whatever')` onde deseja que possa ser editado. Nesse caso, se existir um arquivo de internacionalização com a tag 'whatever', o texto já virá populado com o conteúdo do yml. Caso não exista, aparecerá 'whatever' na tela. De qualquer forma, pode ser editado.

Enfim, é uma ótima gem e bem poderosa, inclusive permitindo que ela altere dados sem precisar de um formulario.

Usem e digam o que acharam.

Até a próxima!

