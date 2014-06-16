---
layout: post
title: "Enums no rails com enumerize"
author: Marcio Junior
comments: true
categories:
  - Rails
  - Marcio Junior
  - Enums
---

É muito comum uma classe ter certos atributos que tem valores predeterminados. Como por exemplo
uma fatura pode ter um campo `status` que pode ter os valores `["pending", "canceled", "paid"]`.
Como não queremos ter esses valores hardcoded no código, podemos criar constantes representando cada um deles.
Assim sempre estaremos atribuindo ou comparando o status com os valores dessas constantes evitando por exemplo status inválidos como `"padi"`.

Para resolver esse problema podemos implementar algo assim:

app/model/**invoice.rb**:

{% highlight ruby linenos %}
class Invoice
  class Status            
    VALUES = [PENDING = "pending", CANCELED = "canceled", PAID = "paid"]

    def self.translate(status)
      I18n.t(status, scope: "enums.invoice.status") 
    end                   

    def self.form_options 
      @options ||= VALUES.map do |status|
        [translate(status), status]    
      end         
    end                   
  end

  validates :status, inclusion: Status::VALUES
end
{% endhighlight %}

Como estamos usando o `I18n.t` precisamos adicionar a tradução de cada status, nesse exemplo ele fica assim:

config/locales/**app.pt-BR.yml**:

{% highlight yaml linenos %}
pt-BR:                    
   # outras traduções
   enums:                  
     invoice:              
       status:             
         pending: pendente 
         canceled: cancelada
         paid: paga 
{% endhighlight %}

Para verificarmos o status de uma instância invoice podemos usar as constantes declaradas em `Invoice::Status`

{% highlight ruby linenos %}
if invoice.status == Invoice::Status::PENDING
  # faz algo com a fatura pendente
end
{% endhighlight %}

E para traduzir um determinado status usamos o `Invoice::Status.translate`

{% highlight ruby linenos %}
  invoice.status = Invoice::Status::PAID
  Invoice::Status.translate(invoice.status) # "paga"
{% endhighlight %}

No nosso formulário usamos o `Invoice::Status.form_options`, para exibir os labels dos selects traduzidos.

app/views/invoices/**_form.html.slim**:

{% highlight haml linenos %}
= simple_form_for(@invoice) do |f|
   = f.error_notification

   .form-inputs
     / outros campos
     = f.input :status, collection: Invoice::Status.form_options

   .form-action
     = f.button :submit
{% endhighlight %}

Isso funciona bem, mas para cada campo que precisarmos que seja uma enumeração temos que ficar criando estruturas como essa.
E nada disso é referente a regras de negócio, apenas estamos gastando tempo criando enumerações, que geram linhas de código que
geram manutenção.

Toda vez que me vejo fazendo coisas como essa penso: "Com certeza deve existir algo que já resolva esse problema". Então comecei
a pesquisar no github uma gem que pudesse ajudar com isso. Foi quando achei a [enumerize](https://github.com/brainspec/enumerize)

Usando ela podemos fazer uma limpa na nossa classe `Invoice` deixando ela assim:

app/model/**invoice.rb**:

{% highlight ruby linenos %}
  class Invoice
    extend Enumerize
    enumerize :status, in: [:pending, :canceled, :paid]
  end
{% endhighlight %}

Essa gem adiciona alguns métodos pra resolverem os problemas de tradução e opções em formulários.
Podemos substituir o `Invoice::Status.form_options` criado anteriormente pelo `Invoice.status.options` gerado pela gem.

app/views/invoices/**_form.html.slim**:

{% highlight haml linenos %}
= simple_form_for(@invoice) do |f|
   = f.error_notification

   .form-inputs
     / outros campos
     = f.input :status, collection: Invoice.status.options

   .form-action
     = f.button :submit
{% endhighlight %}

Para perguntar se a fatura está em um determinado status, podemos usar o nome do status com
um `?` no final, o qual é bem mais ruby like do que a feita anteriormente.

{% highlight ruby linenos %}
  invoice.status = :canceled
  invoice.status.canceled? # true
  invoice.status.paid? # false
{% endhighlight %}

E para pegar a sua tradução simplesmente fazemos um `status.text`:

{% highlight ruby linenos %}
  invoice.status = :canceled
  invoice.status.text # "cancelada"
{% endhighlight %}

Os testes ficam bem mais legíveis por causa do matcher que a gem nos oferece:

app/specs/models/**invoice_spec.rb**:

{% highlight ruby linenos %}
  describe Invoice do
    it { should enumerize(:status).in(:pending, :canceled, :paid) }
  end
{% endhighlight %}

Você pode conferir a lista completa de todas as funcionalidades visitando o [repositório no github](https://github.com/brainspec/enumerize)

### Rails 4.1

Como enumerações vinham sendo muito requisitadas, o rails 4.1 adicionou o [ActiveRecord::Enum](http://edgeapi.rubyonrails.org/classes/ActiveRecord/Enum.html), 
que vai disponibilizar pra você um método de classe chamado `enum`, pelo qual você poderá criar uma enumeração de forma parecida com o enumerize.
Usando ele no nosso exemplo fica assim:

{% highlight ruby linenos %}
  class Invoice
    enum status: [:pending, :canceled, :paid]
  end
{% endhighlight %}

### Conclusão

Quando se vir brigando com coisas repetitivas, dê uma pesquisada no github se esse problema já não foi resolvido.
A comunidade ruby é famosa por se unir pra resolver problemas comuns. Não reinvente a roda!
