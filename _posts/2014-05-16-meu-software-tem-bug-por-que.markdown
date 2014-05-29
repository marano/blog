---
layout: post
title: "Meu software tem bug! Por quê?!"
author: Sylvestre Mergulhão
comments: true
categories:
  - sylvestre mergulhao
  - bugs
  - agile
  - boas praticas
---

Escrever software é uma atividade intelectual. Como toda atividade desse tipo, exige concentração e uma bem generosa quantidade de tempo de quem está realizando o trabalho.

<!--more-->

Cada pessoa tem um nível de conhecimento do problema que precisa ser resolvido. Também varia o nível de conhecimento sobre as ferramentas que são utilizadas para resolver esses problemas, nesse caso as linguagens de programação.

Os bugs são gerados quando na implementação de uma funcionalidade existe alguma falta de entendimento do problema, falta de conhecimento das ferramentas, um lapso de atenção ou um mix desses.

Existem também bugs que passam a ocorrer por conta de dependências externas (integrações com Facebook, Paypal, etc). Não entrarei no mérito desses, pois é o caso de manutenção normal do sistema, que precisa sempre ocorrer.

Analisando cada um dos casos separadamente podemos entendê-los melhor e assim propor soluções melhores para cada situação.

## Conhecimento do problema

Para elevar o conhecimento das pessoas envolvidas sobre o problema a ser resolvido, em [nossa metodologia](http://helabs.com.br/magica/) nós separamos um dia de trabalho de cada semana, a reunião de planejamento. Neste dia rodamos uma dinâmica e detalhamos cada porção do problema. Tudo isso para que tenhamos certeza de que o problema a ser resolvido está claro para todos, inclusive para o nosso cliente.

É por isso que esse dia é tão importante. Não é um dia para programação. É um dia para entendimento completo do problema.

## Conhecimento sobre as ferramentas

Para sempre elevarmos o nível de conhecimento de cada [membro do time](http://helabs.com.br/nosso-time/), temos dias de investimento, onde as pessoas trabalham em [projetos opensource](http://helabs.com.br/opensource/), workshops, techtalks, posts para nosso blog, etc.

Esses dias não são cobrados dos clientes e por isso são chamados de **dias de investimento**. É investimento da empresa, nas pessoas do time. Tudo isso tem muitos benefícios, difunde o conhecimento das ferramentas que utilizamos entre os membros do time e contribui com toda a comunidade opensource.

## O que pode causar um lapso de atenção?

A falta de atenção pode ser causada por muita coisa, mas a nossa experiência nos mostra que os piores problemas de atenção foram causados pela pressa.

A pressa nesse caso é realmente a maior inimiga da perfeição. Quando se tenta fazer mais do que é possível num ritmo sustentável, é preciso se apressar para conseguir "resolver tudo a tempo". Num primeiro momento, pode até parecer que funcionou. Mas depois terá que voltar para consertar o que ficou para trás. Ou seja: de nada adianta correr, pois o trabalho que precisa ser feito, vai ter que ser feito em algum momento e vai consumir tempo de trabalho hoje ou mais tarde.

Na HE:labs, todos os membros da equipe são orientados a jamais subestimar o trabalho que precisa ser feito. Às vezes, por uma pressão do cliente acabamos não resistindo a correr um pouco. E depois sempre somos surpreendidos com coisas que foram esquecidas... pela pressa. Num outro post eu falei um pouco sobre [prazos e estimativas](http://helabs.com.br/blog/2014/01/10/prazos-e-estimativas-segundo-klaus-wuestefeld/).

Atuando também no quesito lapso entra o [TDD](http://desenvolvimentoagil.com.br/xp/praticas/tdd/). Apesar de ser uma **técnica específica de programação**, ela faz com que o programador precise pensar em mais **casos e situações de negócio** que precisam funcionar para que o software tenha o comportamento desejado e não tenha os comportamentos indesejados. Usar TDD favorece a redução dos lapsos de atenção.

Existe um fator muito relevante que impacta negativamente nos lapsos, favorecendo com que eles ocorram: **interrupções**.

O trabalho de programação exige concentração intensa e foco, muito foco. E... mais um pouco de foco. Trabalhando na codificação, é como se fossemos empilhando diversos pratos. A cada solução de um conjunto de problemas colocamos mais um prato na pilha. Depois de algum tempo, temos dezenas de pratos empilhados. Quando somos interrompidos, é como se puxassem o prato do início da pilha, fazendo com que toda a pilha caia e se quebrem todos os pratos. Para retornar ao estado anterior é preciso empilhar todos os pratos novamente. O [processo do sono humano](http://pt.wikipedia.org/wiki/Sono) é similar, por isso temos a sensação de que não dormimos bem, quando temos uma daquelas noites em que acordamos muitas vezes.

Estamos sempre disponíveis online, realizando o trabalho, mas em geral o contato com o cliente no dia-a-dia (exceto no dia da reunião de planejamento) ocorre no [começo e/ou no final do dia](http://desenvolvimentoagil.com.br/xp/praticas/reuniao_pe), quando não estamos num momento de codificação.

Mantendo todas essas práticas alcançamos, no longo prazo de execução de cada projeto, níveis baixos de bugs comuns e níveis extremamente baixos de bugs críticos, que impactam o uso pelos usuários em produção.

Quais são as suas dicas para reduzir o número de bugs?!