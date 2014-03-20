---
published: true
author: Rodrigo Reginato
layout: post
title: "State Machine"
comments: true
categories:
  - Rodrigo Reginato
  - State Machine
  - rails
  - ruby
  
---

Nesse post mostrarei algumas funcionalidades da gem [state_machine](https://github.com/pluginaweek/state_machine) para gerenciar e simplificar o comportamento de uma classe.

<!--more-->

O estado do objeto normalmente é mantido através de vários estados booleanos, isso pode-se tornar complicado de manter quando a complexidade da classe aumenta.
Com o [state_machine](https://github.com/pluginaweek/state_machine), fica bem visível para qualquer desenvolvedor que olhe o código e observe as transições dos estados que são possíveis.

Primeiro, farei uma validação de inclusão desses estados:
 
{% highlight ruby linenos %}
validates :status, :inclusion => { :in => %w(new allowed disabled) }
{% endhighlight %}

Agora, vamos ao código do state_machine:

{% highlight ruby linenos %}
class Permission < ActiveRecord::Base
  state_machine :status, initial: :new do
      event :allow do
        transition [:new, :disabled] => :allowed
      end
      event :disable do
        transition [:new, :allowed] => :disabled
      end
      event :restart do
        transition [:disabled, :allowed] => :new
      end
  end
end
{% endhighlight %}

Temos o estado inicial que é **:new**. Sempre que um novo objeto for criado, o primeiro estado deve ser **:new**.
Existem 3 eventos possíveis nesse caso: **:allow**, **:disable** e **:restart**.

No primeiro evento (**:allow**), se o status for **:new** ou **:disabled**, a transição para **:allowed** é válida quando executado o comando abaixo:

{% highlight ruby linenos %}
  @permission.allow
{% endhighlight %}

Executando o evento **:disable**: só será válido se o status estiver **:new** ou **:allowed**.

{% highlight ruby linenos %}
  @permission.disable
{% endhighlight %}

E no Terceiro evento (**:restart**), se o status for **:disabled** ou **:allowed**, a transição para **:new** é válida quando executado o comando abaixo:

{% highlight ruby linenos %}
  @permission.restart
{% endhighlight %}

Uma função muito utilizada é o after_transaction.

{% highlight ruby linenos %}
  after_transition :new => :allowed do |permission, transition|
     permission.send_mail_to_user(permission.user)
  end
{% endhighlight %}

Nesse exemplo, após a transição do status de **:new** para **:allowed**, é enviado um email para o usuário informando que a permissão foi concedida.

E como não poderia faltar, um exemplo de teste para as transições:

{% highlight ruby linenos %}
  describe 'status state machine' do
    let!(:user) { create(:user) }
    let!(:permission) { create(:permission, user: user, status: "new") }

    it 'permission allowed' do
      expect{
        permission.allow
      }.to change(permission, :status).from('new').to('allowed')
    end

    it 'permission is disabled' do
      expect{
        permission.disable
      }.to change(permission, :status).from('new').to('disabled')
    end
  end
{% endhighlight %}

Apenas um exemplo básico.
Para o evento **restart**, é basicamente o mesmo código.

Um abraço.
