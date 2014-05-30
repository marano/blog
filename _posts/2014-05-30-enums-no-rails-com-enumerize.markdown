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

É muito comum uma classe ter certos atributos que tem valores predeterminados, como por exemplo: 
uma fatura pode ter um campo `status` que pode ter os valores `["pending", "canceled", "paid"]`.
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

Para verificarmos o status do invoice podemos usar as constantes declaradas em `Invoice::Status`

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
