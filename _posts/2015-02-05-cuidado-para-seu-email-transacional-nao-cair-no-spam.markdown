---
layout: post
title: "Cuidado para seu email transacional não cair no spam"
author: Mauro George
categories:
  - email
  - sendgrid
  - mandrill
  - spam
  - email transactional
---

Todos os seus [emails transacionais](http://blog.mailchimp.com/what-is-transactional-email/) estão sendo entregues corretamente ou estão caindo em spams? Vamos ver algumas dicas de como evitar os emails cairem na caixa de spam.

<!--more-->

## Configurando o DNS

É comum utilizarmos serviços como o [SendGrid](https://sendgrid.com/) e o [Mandrill](http://mandrill.com) que nos facilitam muito o envio de emails. No entanto será que estamos configurando o nosso DNS corretamente? Tanto o SPF quanto o DKIM são protocolos que ajudam os [ISPs](http://en.wikipedia.org/wiki/Internet_service_provider) verificarem a autenticidade de um email enviado. Tenha certeza de ter definido o [SPF](http://en.wikipedia.org/wiki/Sender_Policy_Framework) e o [DKIM](http://en.wikipedia.org/wiki/DomainKeys_Identified_Mail) nos seus servidores de DNS.

### SendGrid

- [SPF](https://sendgrid.com/docs/User_Guide/Setting_Up_Your_Server/Whitelabeling/spf.html)
- [DKIM](https://sendgrid.com/docs/User_Guide/whitelabel_wizard.html#-DNS-Records)

Desde o [plano](https://sendgrid.com/transactional-email/pricing) mais básico o SendGrid oferece suporte ao DKIM, customização do DKIM a partir do plano Silver.

### Mandrill

- [SPF e DKIM](http://help.mandrill.com/entries/21681347-how-do-i-set-up-sending-domains)

O Mandrill oferece as mesmas funcionalidades independente do plano utilizado.

## Conteúdo do email

É importante estar atento no texto do seu email transacional pois algumas palavras costumam ser consideradas um gatilho de spam e fazendo sua mensagem ser marcada como spam. Então temos que evitar palavras que façam o email soar como promoção ou propaganda, afinal é isto que o filtro anti-spam está removendo. Também devemos evitar palavras que possam ser consideradas como [phishing](http://pt.wikipedia.org/wiki/Phishing). Infelizmente não temos um banco de dados com estas palavras, mas podemos usar as ferramentas conhecidas como *Spam checkers*.

### Spam checkers

Antes de enviarmos nossos emails é uma boa pratica verificarmos se ele não será considerado spam. Para isso podemos utilizar o [SpamAssassin](http://spamassassin.apache.org/) da Apache Software Foundation. Ou ainda se não quisermos nos preocupar em instalar nada podemos utilizar o serviço do [ISnotSPAM](http://www.isnotspam.com/).

## Versão em texto do email

Uma dica bem simples que ajuda nossos emails não serem considerados spam é enviar uma versão em texto do email. Se sua aplicação é em rails pode fazer isto facilmente dando uma olhada direto no [guides](http://guides.rubyonrails.org/action_mailer_basics.html). Lembrando que isso ainda ajuda quem por ventura não recebe emails como HTML.

## Blacklists

Se o seu servidor de email foi parar em alguma blacklist será complicado de conseguir enviar os emails de uma forma confiável. A primeira coisa a ser feita é verificar se não está em nenhuma blacklist utilizando um dos serviços abaixo:

- [Blacklist Lookup](https://www.senderscore.org/blacklistlookup/)
- [Blacklist Check](http://mxtoolbox.com/blacklists.aspx)
- [Spam Database Lookup](http://www.dnsstuff.com/docs/ip4r/)

Caso seja encontrado em uma das listas entre em contato com o site que adicionou você nela, esta informação é liberado pelas ferramentas acima.

E você já teve algum problema no envio de emails? Tem alguma dica que não falamos? Posta aí nos comentários.

## Referências

- https://sendgrid.com/docs/User_Guide/Setting_Up_Your_Server/Whitelabeling/spf.html
- https://sendgrid.com/docs/User_Guide/whitelabel_wizard.html#-DNS-Records
- https://sendgrid.com/blog/how-to-authenticate-your-email-in-5-steps/
- https://sendgrid.com/blog/10-tips-to-keep-email-out-of-the-spam-folder/
- http://help.mandrill.com/entries/21681347-how-do-i-set-up-sending-domains
- http://help.mandrill.com/entries/21751322-What-are-SPF-and-DKIM-and-do-I-need-to-set-them-up-

