---
layout: post
title: "Testes de aceitação com capybara e cucumber"
author: Rodrigo Reginato
hide_author_link: true
categories:
  - rodrigo reginato
  - cucumber
  - capybara
  - testes de aceitação


---

A ideia desse post é mostrar um pouco como funciona o **capybara** com o **cucumber**.

<!--more-->

Vou criar um projeto com apenas um formulário para usar de exemplo para os testes de aceitação. Usarei o _ruby 2.0.0-p0_ e _rails 3.2.13_.

**Cucumber** é uma _gem_ que cria um novo ambiente no projeto e permite a escrita de testes de aceitação em uma linguagem muito próxima da natural.

**Capybara** também é uma _gem_ que ajuda a testar aplicações web, simulando como um usuário real iria interagir com o aplicativo.

Primeira etapa é adicionar a _gem_ **cucumber** em seu gemfile. Adicione também a _gem_ **database_cleaner**. Ela não é obrigatória, mas altamente recomendável. E por último, o **'bundle install'**.

{% highlight ruby linenos %}
group :test do
  gem 'cucumber-rails', :require => false
  gem 'database_cleaner'
end
{% endhighlight %}

Após a instalação das gems, rode o comando para gerar os aquivos de configuração do cucumber.

{% highlight bash linenos %}
$ rails generate cucumber:install
{% endhighlight %}

Agora execute o comando:

{% highlight bash linenos %}
$ rake cucumber
{% endhighlight %}
Você deve obter o resultado a seguir:

{% highlight bash linenos %}
0 scenarios
0 steps
0m0.000s
{% endhighlight %}

Crie um arquivo “/features/valida_form.feature” onde será escrito os **Cenários**. Descreva a ação de como o sistema deve se comportar.

{% highlight cucumber linenos %}
# encoding: utf-8
# language: pt
Funcionalidade: Preencher o formulário

  Cenário: Deve preencher todos os campos do forumlário e salvar com sucesso
    Dado que eu estou na página do formulario
    Quando eu preencher todos os campos
    E clicar em "Salvar"
    Então deve ver receber a mensagem "Usuarios cadastrado com sucesso"
{% endhighlight %}

Após salvar este arquivo, execute novamente o comando:

{% highlight bash linenos %}
$ rake cucumber
{% endhighlight %}

O resultado obtido será:

{% highlight bash linenos %}
1 scenario (1 undefined)
4 steps (4 undefined)
0m0.812s
{% endhighlight %}

Próximo passo para agilizar o processo será a criação de um **scaffold** de Usuário e validar a presença de todos os campos.

{% highlight bash linenos %}
$ rails g scaffold usuario nome:string endereco:string telefone:string estado:string tipo:string
$ rake db:migrate
{% endhighlight %}

Vários **Cenários** podem ser criados. Um exemplo é não preencher todos os campos do formulário para um novo usuário e clicar em salvar. E sim, criar um passo onde deve-se garantir que não foi redirecionado para o “show” do usuário, mantendo-o na mesma página “new”.
O **capybara** vai nos ajudar a preencher os fields do formulário.

Agora crie um arquivo “/features/step_definitions/valida_form_steps.rb” com o conteúdo abaixo:

{% highlight cucumber linenos %}
# encoding: utf-8
Dado /^que eu estou na página do formulario$/ do
  visit new_usuario_path
end

Quando /^eu preencher todos os campos$/ do
  fill_in "usuario_nome", :with=> "Rodrigo Reginato"
  fill_in "usuario_endereco", :with=> "Rua alagoas 3872"
  fill_in "usuario_telefone", :with=> '4398765425'
  page.select "SC", :from => 'usuario_estado'
  page.choose("usuario_tipo_fisico")
end

E /^clicar em "(.*?)"$/ do |nome_do_botao|
  find_button(nome_do_botao).click
  save_and_open_page
end

Então /^deve ver receber a mensagem "(.*?)"$/ do |mensagem|
  page.has_content?(mensagem)
end
{% endhighlight %}

Após adicionar este código rode novamente o comando:

{% highlight bash linenos %}
$ rake cucumber
{% endhighlight %}

O resultado obtido será:

{% highlight bash linenos %}
1 scenario (1 passed)
4 steps (4 passed)
0m0.425s
{% endhighlight %}

##Dicas

Para facilitar a nossa vida, existem algumas funções que são fundamentais, como:

{% highlight ruby linenos %}
save_and_open_page
{% endhighlight %}

Para utilizarmos este recurso, é necessário instalar a _gem_:

{% highlight ruby linenos %}
gem 'launchy'
{% endhighlight %}

Um browser é aberto no momento que este comando é adicionado entre os steps, facilitando para encontrar possíveis erros.

No caso da página ter algum javascript ou se quiser ver todo o processo passo a passo como se o usuário estivesse digitando os dados, é necessário instalar a _gem_ [selenium-webdriver](https://github.com/vertis/selenium-webdriver).

Existem outras opções como o [capybara-webkit](https://github.com/thoughtbot/capybara-webkit), mas apresentou um erro na hora do bundle. Já o [selenium-webdriver](https://github.com/vertis/selenium-webdriver), funcionou perfeitamente.

{% highlight ruby linenos %}
gem 'selenium-webdriver'
{% endhighlight %}

Adicione @javascript na primeira linha antes do **Cenário** iniciar.

{% highlight cucumber linenos %}
@javascript
Cenário: Deve preencher todos os campos do formulário e salvar com sucesso
{% endhighlight %}

Um browser será aberto logo no início do processo  e todos os passos que descrevi acima ficarão visíveis como se um usuário estivesse preenchendo os campos.

É isso pessoal, até a próxima.
