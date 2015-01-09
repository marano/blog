---
layout: post
title: "Quick Tip: Usando #each_with_object"
author: Matheus Bras
hide_author_link: true
categories:
  - ruby
  - rails
  - quicktip
---

Em alguns momentos nos deparamos com a necessidade de iterar sobre uma coleção para gerar outra. E quase sempre pra fazer isso acabamos usando uma variável temporária para inicializar o objeto da nova coleção. Porém, podemos usar #each_with_object para não precisarmos de variáveis temporárias no nosso código.

<!--more-->

Inicialmente temos:

{% highlight ruby linenos %}
array = []

collection.each do |item|
  # do something with the item
  array << item
end

array
{% endhighlight %}

Podemos refatorar isso para:

{% highlight ruby linenos %}
collection.each_with_object([]) do |item, array|
  # do something with the item
  array << item
end
{% endhighlight %}

O método `#each_with_object` irá retornar o array com os itens ao final da iteração na coleção.

Outro exemplo:

{% highlight ruby linenos %}
hash = {}

collection.each do |item|
  if hash[item]
    hash[item] += 1
  else
    hash[item] = 1
  end
end

hash
{% endhighlight %}

Podemos refatorar para:

{% highlight ruby linenos %}
collection.each_with_object(Hash.new(0)) do |item, hash|
  hash[item] += 1
end
{% endhighlight %}

Usando `Hash.new(0)` nós já temos um hash que tem suas keys inicializadas com 0 automaticamente. Então só nos resta incrementar o valor dentro do loop.

É importanter notar que este método funciona com objetos mutáveis, não funcionando com inteiros, por exemplo. Porém, existe um [gotcha](http://stackoverflow.com/questions/19064209/how-is-each-with-object-supposed-to-work/19064234#19064234) quanto a strings.

{% highlight ruby linenos %}
str = ""
str += "abc" # retorna um novo objeto mantendo o antigo em seu estado original.
str << "abc" # modifica o objeto original
{% endhighlight %}

Então, se for usar uma String como o objeto no método `#each_with_object`, lembre-se que `+=` não irá modificar o objeto, logo o retorno será a própria string.
