---
published: true
author: Thiago Belem
layout: post
title: Gerando dados "reais" com o Faker
date: 2013-11-06 16:00
comments: true
categories:
  - thiago belem
  - faker

---

Com o Faker, você pode gerar dados aleatórios muito mais próximos do que o seu
usuário final irá criar. Com isso, as suas factories ficariam mais realistas.

<!--more-->

![Gerando dados reais com o Faker](http://nyulocal.com/wp-content/uploads/2013/01/mclovin.jpg)

[Faker](https://github.com/stympy/faker) é uma gem que te ajuda a gerar dados fictícios. Com ela você pode criar:

* [Endereços](https://github.com/stympy/faker/wiki/Address) (cidades, estados, endereços, CEPs, países);
* Dados de [empresas](https://github.com/stympy/faker/wiki/Company) (nomes, slogans e etc.);
* Dados de [Internet](https://github.com/stympy/faker/wiki/Internet) (emais, usuários, domínios, IPv4, IPv6 e URLs);
* [Lorem Ipsums](https://github.com/stympy/faker/wiki/Lorem) (palavras, frases, parágrafos);
* [Nomes](https://github.com/stympy/faker/wiki/Name) (nomes, sobrenomes, sufixos e prefixo);
* [Telefones](https://github.com/stympy/faker/wiki/Phone-number)

Com esses recursos, fica muito mais fácil criar factories
(do [FactoryGirl](https://github.com/thoughtbot/factory_girl)) que tem dados mais parecidos com o que o usuário final vai produzir.

Para ilustrar seu funcionamento, vamos imaginar que você tem os seguintes models:

{% highlight ruby linenos %}
class Post < ActiveRecord::Base
  belongs_to :author

  validates :title, :content, presence: true
  validates :title, uniqueness: true
end
{% endhighlight %}

{% highlight ruby linenos %}
class Author < ActiveRecord::Base
  has_many :posts

  validates :name, :email, :city, presence: true
  validates :name, :email, uniqueness: true
end
{% endhighlight %}

E teríamos, inicialmente, as seguintes factories:

{% highlight ruby linenos %}
FactoryGirl.define do
  factory :post do
    title 'Título do post'
    content 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    author
  end
end
{% endhighlight %}

{% highlight ruby linenos %}
FactoryGirl.define do
  factory :author do
    name 'Fulano da Silva'
    email 'fulano@silva.com.br'
    city 'Rio de Janeiro'
  end
end
{% endhighlight %}

Não há nada de errado com essas factories. O problema surge quando precisamos criar, por exemplo, uma lista de posts com `FactoryGirl.create_list(:post, 3)` e iremos receber diversos erros das validações de `uniqueness` dos dois models.

Para isso, poderíamos usar [sequences](https://github.com/thoughtbot/factory_girl/blob/master/GETTING_STARTED.md#sequences) do FactoryGirl para tentar contornar isso, mas não acho que "Fulano da Silva 1" ou "Fulano da Silva 2" sejam o caminho.

### Factories dinâmicas com Faker

Podemos modificar nossas factories para usar dados gerados pelo Faker:

{% highlight ruby linenos %}
FactoryGirl.define do
  factory :post do
    title { Faker::Lorem.sentence(8) }
    content { Faker::Lorem.paragraph(4) }
    author
  end
end
{% endhighlight %}

{% highlight ruby linenos %}
FactoryGirl.define do
  factory :author do
    name { Faker::Name.name }
    email { Faker::Internet.email }
    city { Faker::Address.city }
  end
end
{% endhighlight %}

E assim teremos posts com títulos e conteúdos diferentes (ok, Lorem Ipsum não é
a melhor coisa do mundo), mas também teremos autores com nomes como "Davion Fay" e emails como "haylee_hayes@reynoldssanford.info".

O problema do uniqueness foi resolvido. Exceto em alguns casos bem raros onde,
se você criar muitos registros, pode acabar gerando dois com o mesmo nome ou
email, mas aí pode ser uma questão para você repensar o seu caso de teste.

### Gerando dados em Português

Os dados gerados pelo Faker são, por padrão, nomes, endereços e cidades em inglês.
O que pode deixar o seu sistema não tão real assim... Para resolver esse problema
é só definir qual idioma o Faker irá usar no seu `spec_helper.rb`:

{% highlight ruby linenos %}
Faker::Config.locale = :"pt-br"
{% endhighlight %}

Com isso, os dados gerados serão como "Alessandro Silva", "Rio de Janeiro" e etc.

Até a próxima!
