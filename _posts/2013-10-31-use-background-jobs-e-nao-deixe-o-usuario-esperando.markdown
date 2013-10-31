---
published: true
author: Matheus Bras
layout: post
title: "Use Background Jobs e não deixe o usuário esperando"
date: 2013-10-31 10:00
comments: true
categories:
  - matheus bras
  - background job
  - rails

---

Muitas aplicações Rails precisam enviar emails e muitas deixam o usuário esperando até que o mesmo seja enviado e não usam background jobs para fazer esse trabalho. Vamos tentar melhorar isso.

<!--more-->

Vamos imaginar o seguinte cenário. Temos este model User:

{% highlight ruby linenos %}
class User
  # validations
  # associations

  def send_confirmation
    SomeMailer.confirmation(self).deliver
  end
end
{% endhighlight %}

E este controller:

{% highlight ruby linenos %}
class UsersController < ApplicationController
  def resend_confirmation
    @user.send_confirmation
  end
end
{% endhighlight %}

Então, o usuário vai até a página para pedir o reenvio do email de confirmação e clica no botão. No controller será chamado o método send_confirmation, que está no model User para que o envio do email seja feito. Até aí ok! O email vai ser enviado sem problemas. Porém, o usuário vai precisar esperar até que o envio do email seja efetuado. E por que isso?

O problema nisso é que o Rails é single-threaded. O que significa: quando você quer enviar um email, o Rails precisa parar tudo o que está fazendo para executar o envio. Então o usuário precisa ficar esperando que isso aconteça. Ninguém vai poder interagir com a aplicação enquanto o raio do email seja enviado. E é claro que não queremos isso.

Para resolver isso, usamos Background Jobs! Para esse exemplo, vou usar o [delayed_job](https://github.com/collectiveidea/delayed_job), mas existem muitas outras soluções para background jobs no Rails: [sucker_punch](https://github.com/brandonhilkert/sucker_punch), [sidekiq](https://github.com/mperham/sidekiq), [resque](https://github.com/resque/resque). No caso do delayed_job no Heroku, precisamos de um [Worker](https://blog.heroku.com/archives/2009/7/15/background_jobs_with_dj_on_heroku) para executar a fila de jobs.

## Criando um job para o envio de email de confirmação

Primeiro, criamos uma classe ConfirmationEmailJob. Podemos colocá-la na pasta app/jobs.

{% highlight ruby linenos %}
class ConfirmationEmailJob
  def perform(user_id)
    return if !load_user(user_id)
    SomeMailer.confirmation(@user).deliver
  end

  private
    def load_user
      @user = User.find_by(id: user_id)
    end
end
{% endhighlight %}

E então, no model User:

{% highlight ruby linenos %}
class User
  # validations
  # associations

  def send_confirmation
    ConfirmationEmailJob.new.delay.perform(id)
  end
end
{% endhighlight %}

Por fim, quando o usuário pedir o reenvio do email de confirmação, vamos enfilerar um job para que ele seja enviado. O delayed_job vai se encarregar de fazer isso em background sem precisar que o usuário fique esperando.

É uma boa prática usar background jobs para outras tarefas como: acessar APIs externas, upload de arquivos muito grandes, geração de PDFs, thumbnails e etc. Algo que for muito intensivo e demorado, deve ser executado com background jobs.
