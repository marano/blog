---
published: false
author: Rafael Fiuza
layout: post
title: "Use Phrasing e seja feliz"
date: 2014-04-14 12:00
comments: true
categories:
  - Rails
  - Ruby
  - Gems
  
---

Talvez o titulo desse post seja um pouco tendencioso. Mas bem pouco.
Imagine a cena: No meio da semana, com diversas tarefas para serem feitas e que precisam estar prontos na quinta feira, seu cliente pede para alterar um texto em produção. Agora imagine que você pode dizer para ele: "Mude você!".

<!--more-->

Ok, provavelmente não seria bem assim que diria. Mas imagine dar o poder de alterar o texto do site on the fly, sem tela de admin, sem burocracia. 
Sim, isso já é possivel. Apresento a vocês a gem [Phrasing](https://github.com/infinum/phrasing).


A instalação é simples e está bem descrito no github. E a forma de uso também. Fiz um pequeno [projeto]() para ilustrar.
Para esse exemplo precisaremos de tesoura, cola e um simples projeto em rails.

Após adicionar o `gem "phrasing"` no Gemfile, rodar `bundle`, `rake phrasing:install` e `rake db:migrate` será adicionado um arquivo chamado phrasing_helper.rb. 

```
module PhrasingHelper

  def can_edit_phrases?
    request.subdomains.first == 'edit' && current_user.admin?
  end
end
```



