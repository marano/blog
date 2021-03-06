---
layout: post
title: "Controllers mais limpos com facade"
author: Rafael Fiuza
categories:
  - Rails
  - Ruby
  - Padrões de linguagem
---


Já teve aquela sensação de que algo é tão comum que todos conhecem mas raramente é aplicado? Então, é sobre um desses casos que irei tratar rapidamente.

<!--more-->
Confesso que nunca fui um grande apreciador de usar facade no ruby, principalmente nos controllers. O proprio padrão de linguagem me deixava sempre confuso pela forma livre como é implementada e explicada. Em teoria, um facade é usado para criar uma interface simplificada para algum objeto ou funcionalidade.

Somente quando li sobre as 4 regras basicas da [Sandi Metz](http://robots.thoughtbot.com/sandi-metz-rules-for-developers), mais precisamente a quarta regra, vim a conhecer essa forma de escrever os controllers. 

Veja um exemplo (que não deve ser seguido. É um mal exemplo):
{% highlight ruby linenos %}
class PlayersController < ApplicationController
  def show
    @player = Player.find_by(params[:id])
    @guild_players = @player.guild.players
    @player_rank = Rank.for(@player)
    @related_players = related_player    
  end

  private
  def related_player
    return [] unless @player.tags.any?
    Player.active.with_tag(@player.tags).limit(10)
  end
end
{% endhighlight %}

Esse controller expõe 4 variaveis de instância para a view e estamos instanciando 2 models diferentes. Dessa forma, na view, fariamos algo semelhante a:

{% highlight html linenos %}
<%= render 'rank', rank: @player_rank %>
<%= render 'player' %>
<%= render 'guild_players', players: @guild_players %>
<%= render 'related_players', players: @related_players %>

{% endhighlight %}

Existem varias formas de escrever o controller acima deixando-o simples. Ouso dizer que a mais utilizada é a de extrair para metodos no proprio model. Prefiro o facade quando os metodos são somente usados para representar dados na view, portanto extrair para o model seria desnecessário.

Com facade faríamos uma interface das funcionalidades que queremos representar no controller tornando possível expormos apenas uma variavel para a view e tornando o teste dessas funcionalidades muito mais simples.

{% highlight ruby linenos %}
class PlayersController < ApplicationController
  def show
    @profile = ProfileFacade.new(params[:id])
  end
end

class ProfileFacade
  def initialize(id)
    @player = Player.find(id)
  end

  def guild_player
    player.guild.players
  end

  def rank
    Rank.for(player)
  end

  def related_player
    return [] unless player.tags.any?
    Player.active.with_tag(player.tags).limit(10)
  end

  private
  attr_reader :player
end
{% endhighlight %}

E na view

{% highlight html linenos %}
<%= render 'rank', rank: @profile.rank %>
<%= render 'player' %>
<%= render 'guild_players', players: @profile.guild_players %>
<%= render 'related_players', players: @profile.related_players %>

{% endhighlight %}