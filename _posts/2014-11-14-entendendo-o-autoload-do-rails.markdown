---
layout: post
title: "Entendendo o autoload do rails"
author: Marcio Junior
categories:
  - rails
  - ruby
---

Embora não seja uma pratica legal, as vezes precisamos fazer monkey patches em algumas classes para disponibilizar novos métodos.
Como por exemplo, vamos supor que customizamos alguns emails do [devise](https://github.com/plataformatec/devise), e precisamos usar
alguns helpers nesses emails. Uma maneira de fazer isso é aplicando um monkey patch na classe base de todos os mailers do devise, que é 
`Devise::Mailer`, e incluindo o helper `ApplicationHelper`. Normalmente isso vai estar em um initializer vamos supor que esteja em 
`config/initializers/devise_mailer_ext.rb`.

<!--more-->

{% highlight ruby linenos %}
Devise::Mailer.class_eval do
  helper ApplicationHelper
end
{% endhighlight %}

Isso funciona, e não vai gerar problemas em produção. Mas durante o processo de desenvolvimento, principalmente quando se usa o [spring](https://github.com/rails/spring),
podem começar a surgir erros inesperados, como por exemplo: ao enviar um email do devise, ele dizer que um método do application helper não existe,
como se o monkey patch acima fosse desfeito.

Em fato, initializers não são o lugar correto pra se fazer isso, porque esses arquivos são carregados apenas uma vez quando a aplicação sobe, seja com rails s
ou rails c etc. Mas o que poderia estar fazendo com que a classe perdesse esse monkey patch?

O rails tem uma funcionalidade bem mágica que faz acharmos que isso vem do próprio ruby, que é o fato de podermos referenciar os models no controller sem
precisar fazer requires, e também recarregar as classes quando fazemos alguma alteração. Por exemplo:

{% highlight ruby linenos %}
class BankBilletsController < ApplicationController

  def index
    @bank_billets = BankBillet.all
  end

end
{% endhighlight %}

Perceba que não existe `require 'app/models/bank_billet'` em canto nenhum e ele simplesmente acha o BankBillet.
Graças a flexibilidade da linguagem ruby é possível fazer essa mágica, e no rails o módulo responsável por isso é o [ActiveSupport::Dependencies](https://github.com/rails/rails/blob/master/activesupport/lib/active_support/dependencies.rb)
Ele tem um propriedade chamada `autoload_paths` com um array de diretórios onde essa mágica deve ser aplicada. Já que não é interessante aplicar
isso em todos os diretórios já que esse lookup dinamico causa um certo overhead.
Você pode verificar quais diretórios estão sendo carregados automaticamente inspecionando `ActiveSupport::Dependencies.autoload_paths` no seu rails console:


{% highlight bash linenos%}
$ rails c
ActiveSupport::Dependencies.autoload_paths.each { |a| p a }
"/home/marcio/workspace/helabs/boletosimples-app/app/assets"
"/home/marcio/workspace/helabs/boletosimples-app/app/controllers"
"/home/marcio/workspace/helabs/boletosimples-app/app/forms"
"/home/marcio/workspace/helabs/boletosimples-app/app/helpers"
"/home/marcio/workspace/helabs/boletosimples-app/app/mailers"
"/home/marcio/workspace/helabs/boletosimples-app/app/middlewares"
"/home/marcio/workspace/helabs/boletosimples-app/app/models"
"/home/marcio/workspace/helabs/boletosimples-app/app/policies"
"/home/marcio/workspace/helabs/boletosimples-app/app/serializers"
"/home/marcio/workspace/helabs/boletosimples-app/app/services"
"/home/marcio/workspace/helabs/boletosimples-app/app/subscribers"
"/home/marcio/workspace/helabs/boletosimples-app/app/validators"
"/home/marcio/workspace/helabs/boletosimples-app/app/workers"
"/home/marcio/workspace/helabs/boletosimples-app/app/controllers/concerns"
"/home/marcio/workspace/helabs/boletosimples-app/app/models/concerns"
"/home/marcio/.rvm/gems/ruby-2.0.0-p451@boletosimples/gems/xray-rails-0.1.14/app/assets"
"/home/marcio/.rvm/gems/ruby-2.0.0-p451@boletosimples/bundler/gems/activeadmin-8b6586c23a62/app/assets"
"/home/marcio/.rvm/gems/ruby-2.0.0-p451@boletosimples/gems/inherited_resources-1.4.1/app/controllers"
"/home/marcio/.rvm/gems/ruby-2.0.0-p451@boletosimples/gems/bourbon-3.2.3/app/assets"
"/home/marcio/.rvm/gems/ruby-2.0.0-p451@boletosimples/gems/doorkeeper-1.4.0/app/assets"
"/home/marcio/.rvm/gems/ruby-2.0.0-p451@boletosimples/gems/doorkeeper-1.4.0/app/controllers"
"/home/marcio/.rvm/gems/ruby-2.0.0-p451@boletosimples/gems/doorkeeper-1.4.0/app/helpers"
"/home/marcio/.rvm/gems/ruby-2.0.0-p451@boletosimples/gems/doorkeeper-1.4.0/app/validators"
"/home/marcio/.rvm/gems/ruby-2.0.0-p451@boletosimples/gems/devise-3.4.0/app/controllers"
"/home/marcio/.rvm/gems/ruby-2.0.0-p451@boletosimples/gems/devise-3.4.0/app/helpers"
"/home/marcio/.rvm/gems/ruby-2.0.0-p451@boletosimples/gems/devise-3.4.0/app/mailers"
"/home/marcio/.rvm/gems/ruby-2.0.0-p451@boletosimples/gems/cocoon-1.2.6/app/assets"
"/home/marcio/.rvm/gems/ruby-2.0.0-p451@boletosimples/gems/zeroclipboard-rails-0.1.0/app/assets"
"/home/marcio/.rvm/gems/ruby-2.0.0-p451@boletosimples/gems/fancybox2-rails-0.2.8/app/assets"
"/home/marcio/.rvm/gems/ruby-2.0.0-p451@boletosimples/gems/font-awesome-rails-4.2.0.0/app/assets"
"/home/marcio/.rvm/gems/ruby-2.0.0-p451@boletosimples/gems/font-awesome-rails-4.2.0.0/app/helpers"
"/home/marcio/.rvm/gems/ruby-2.0.0-p451@boletosimples/gems/formtastic-3.0.0/app/assets"
"/home/marcio/.rvm/gems/ruby-2.0.0-p451@boletosimples/gems/jquery-ui-rails-5.0.2/app/assets"
"/home/marcio/.rvm/gems/ruby-2.0.0-p451@boletosimples/gems/secure_headers-1.3.4/app/controllers"
{% endhighlight %}

Perceba que os arquivos do diretório app estão sendo referenciados, e também o de outras gems.
Então por exemplo se adicionamos um método novo em BankBillet, a classe é redefinida, ou seja, ela é removida e carregada de novo.
Isso é importante, porque é diferente de apenas carregar o arquivo de novo, já que se removessemos um método e adicionassemos outro,
ela ficaria com 2 métodos ao invéz de ficar com o último.

Voltando ao problema do monkey patch do devise, se alterarmos algum arquivo nesses diretórios, o `Devise::Mailer` vai ser recarregado
e como o nosso initializer devise_mailer_ext não recarrega, ele vai ficar sem o `ApplicationHelper`, então agora que entendemos o problema
como fazer pra resolve-lo?

Felizmente o rails tem um hook especialmente pra isso. Ele executa toda as vezes que os arquivos são recarregados e apenas uma vez quando a app
é carregada em produção por exemplo. O nome dele é [to_prepare](http://api.rubyonrails.org/classes/Rails/Railtie/Configuration.html#method-i-to_prepare).
E como o modulo principal da nossa applicação é uma railtie, podemos adicionar o seguinte no arquivo `application.rb`

{% highlight ruby linenos %}
module Boletosimples
  class Application < Rails::Application
    # others configurations ...

    config.to_prepare do
      Devise::Mailer.class_eval do
        helper ApplicationHelper
      end
    end

  end
end
{% endhighlight %}

Depois de reiniciar o servidor agora o problema do monkey patch não ocorre mais, já que embora o `Devise::Mailer` esteja sendo recarregado logo em 
seguida o monkey patch é aplicado já que estamos registrados no hook `to_prepare`.

### Conclusão

Não utilize os initializers pra alterar o comportamento de classes que estão no `autoload_paths`. E também tire um tempo pra tentar entender como
as ferramentas que você usa funcionam. Quando estudei como essa parte do rails funcionava, era mais por questão de curiosidade pois embora
existam coisas muito mágicas no rails e até difíceis de entender, ter um entendimento médio de como elas funcionam é muito benéfico, pois ajuda
você a ter uma visão maior do que está acontecendo.

E quando você ver um diff desse:

![image](/blog/images/posts/entendendo-autoload-rails/image.png)

Pode acreditar que existe toda uma ciência por trás disso :D

Abraços!
