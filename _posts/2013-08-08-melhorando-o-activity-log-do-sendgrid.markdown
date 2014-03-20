---
published: true
author: Cayo Medeiros (yogodoshi)
layout: post
title: "Melhorando o Email Activity do SendGrid"
comments: true
categories:
  - SendGrid
  - Métricas
  - yogodoshi

---

Depois de anos utilizando o [SendGrid](http://sendgrid.com/) para envio de emails transacionais em diversos projetos, surgiu a necessidade de **descobrir se emails de um mailer específico haviam sido enviados** recentemente ou não. E aí, #comofas?

<!--more-->

Fazendo o login no SendGrid, temos duas opções do menu que poderiam resolver esse problema: "Statistics Dashboard" e o "Email Activity".

O primeiro mostra uma série de **gráficos indicando números de taxa de abertura, de cliques, etc**. O último é como um **log dos emails enviados**, porém, por padrão, basicamente as únicas informações que você tem de cada email são:

* o email de quem recebeu;
* a data e o horário do envio;
* o status (enviado, aberto, clicado...);

Não acreditei que ele não teria pelo menos o subject do email salvo! Aí, pesquisei e descobri que o SendGrid possui duas coisas que poderiam me ajudar nesse caso: **Category** e **Unique Arguments**.

###[Category](http://sendgrid.com/docs/API_Reference/SMTP_API/categories.html)

O próprio nome já diz pra que serve, é uma categoria/ tag pra **agrupar seus emails**. Você pode adicionar até 10 categorias em cada email!

No meu caso, utilizei as categorias para salvar o nome do Mailer e o método utilizado no envio do mesmo.

Exemplo: FacebookMailer e FacebookMailer.session_expired.

###[Unique Arguments](http://sendgrid.com/docs/API_Reference/SMTP_API/unique_arguments.html)

Os Unique Arguments são basicamente um JSON/ Hash de argumentos que você pode passar em cada email. Eu os utilizo para passar os parâmetros recebidos pelo método do mailer.

Seguindo o exemplo acima do FacebookMailer.session_expired, o argumento seria { :user_id => 1234 }.

###Implementação

Para implementar é bem fácil, [neste post do Henrik Nyh](http://thepugautomatic.com/2012/08/sendgrid-metadata-and-rails/), você encontra o código necessário para implementar tanto a parte da categoria quanto os argumentos únicos de uma só vez no Rails.

###Testando com Rspec

Uma coisa que o Henrik não mostrou foi falar sobre como testar isso. Eu testei de uma forma bem simples. Para cada método de envio do mailer, utilizei o rspec:

{% highlight ruby linenos %}
it "should contain some categories on its header" do
  mailer.header['X-SMTPAPI'].to_s.should include("FacebookMailer")
  mailer.header['X-SMTPAPI'].to_s.should include("FacebookMailer#session_expired")
end

it "should contain unique arguments on its header" do
  mailer.header['X-SMTPAPI'].to_s.should include("user_id")
  mailer.header['X-SMTPAPI'].to_s.should include("1234")
end
{% endhighlight %}

###Um cuidado

Depois de implementar as categorias e os *unique arguments* e colocar em produção, alguns dos links dos emails enviados pelo SendGrid começaram a aparecer com trocentos caracteres. Mais caracteres até do que é permitido pelos navegadores em uma URL! Ou seja: **links quebrando**.

Entrei em contato com o suporte do SendGrid. Eles, mesmo após dias de tentativas, não conseguiram entender o que estava causando isso. Resumindo a história: o problema era o código que o SendGrid utiliza para codificar os links de cada email para conseguir trackear os cliques. Utilizava também, as categorias e os unique arguments do email!

Em cada link do email estava codificado:

* a URL correta para onde o usuário deveria ser redirecionado ao clicar no link;
* as categorias do email;
* os unique arguments do email;
* informações que identificariam a minha conta do SendGrid;
* informações que identificariam este link específico;

Por isso, **tome cuidado com a quantidade de informações que você passará nas categorias e nos argumentos únicos dos emails**. Isso pode fazer com que alguns dos seus links quebrem!

Para resolver esse problema, eu tive que **refatorar todos os meus métodos de envio de email para receber apenas IDs**, não mais instâncias de objetos.

###Concluindo

A seção de Email Activity do dashboard do SendGrid será muito mais útil pra você depois disso. Você poderá saber exatamente quais emails foram enviados, quem atuou nesse processo e tudo mais!

Seria lindo se o SendGrid permitisse que fizéssemos uma busca por Unique Arguments e Categories, mas ainda não é possível. Quem sabe numa próxima atualização =)
