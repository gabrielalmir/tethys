# PI3-AlertaAlagamento.
Projeto Integrador - Cidades Inteligentes: Desenvolvimento de um Sistema de Alerta

# Fatec Itapira – Dr. Ogari de Castro Pacheco
## DSM – Tecnologia em Desenvolvimento de Software Multiplataforma
### Projeto Interdisciplinar – 3º período (PI-3)

O objetivo desse documento é descrever o Projeto Integrador (PI) do 3º período de DSM.

## Integrantes 👩‍💻👨‍💻
- <a href = "https://github.com/gabrielalmir">Gabriel Almir</a><br>
 Responsabilidades: Backend,utilizando a linguagem de Programação PHP,além disso sendo responsável pela organização da equipe.
- <a href="https://github.com/julianoAlessandro">Juliano Alessandro dos Santos</a><br>
 Responsabilidades: Consumo de API, utilização do FrameWork fastAPI, e hospedagem do código Python.<br>
- <a href="https://github.com/RafaelAntunes2">Rafael Antunes</a><br>
 Responsabilidades: Consumir uma API destinada ao envio de SMS, para os usuarios,além da utilização do frameWork fastAPI e hospedagem do código Python.<br>
- <a href="https://github.com/ogustavobrianti">Gustavo Brianti</a><br>
 Responsabilidades:Frontend, utilização de FrameWork Bootstrap,responsividade do site, e utilização da linguagem javascript.<br>
- <a href="https://github.com/cwilliam956">Celso William</a><br>
Responsabilidades:Frontend,utilização do FrameWork Boostrap,responsividade do site,e utilização da linguagem javascript.<br>

## Introdução 📖

O Projeto Pedagógico do Curso de Tecnologia em Desenvolvimento de Software Multiplataforma (DSM) da FATEC Itapira descreve o desenvolvimento de 6 Projetos Interdisciplinares (PIs), um em cada período do curso. O PI não é apenas uma junção de disciplinas, é, também, uma oportunidade de trabalho colaborativo entre os professores responsáveis pelas disciplinas, o coordenador do curso e os alunos. A aplicação das metodologias de ensino-aprendizagem baseadas em Projetos ou Problemas e a interdisciplinaridade auxiliarão no desenvolvimento das competências socioemocionais, tais como: autonomia, proatividade, trabalho em equipe, comunicação, resolução de problemas, entre outros. Cada PI constitui uma parte do Portifólio Digital do aluno, que será incrementado durante o curso.

Para o PI do 3º período (PI-3) são contempladas as seguintes disciplinas:
- Disciplina-chave: Gestão Ágil de Projetos (Ana Célia)
- Disciplinas-satélite:
  - Desenvolvimento Web III (Junior),
  - Banco de Dados não Relacional (Mateus),
  - Interação Humano Computador (Thiago).

## Recursos e ferramentas 🛠️

Para o desenvolvimento do PI-3 serão empregados conhecimentos, práticas, técnicas e ferramentas relacionadas com métodos ágeis de desenvolvimento de software. O PI será dividido em entregas parciais semanais que serão integradas para compor o produto. Para a construção do produto serão utilizados:

- PMCanvas (Project Model Canvas) para o planejamento preliminar do projeto
- Trello (ou Jira ou Planner), para registro e acompanhamento das tarefas e do projeto
- GitHub para repositório do projeto
- Banco de dados MongoDB
- conceitos e práticas de Desenvolvimento Web
- conceitos e práticas de IHC
- modelos e diagramas da UML

O resultado do projeto será um produto de software e a documentação associada.

## Tema

**Cidades Inteligentes**: proposta de solução tecnológica para melhorar a vida dos cidadãos.

*Cidades inteligentes são aquelas que otimizam a utilização dos recursos para servir melhor os cidadãos. Isso vale para a mobilidade, a energia ou para qualquer serviço necessário à vida das pessoas* (inovacaosebraeminas.com.br).

*Com o crescimento das cidades, torná-las inteligentes é essencial. Universidades, empresas e instituições públicas podem unir forças para que soluções sejam aplicadas e sirvam os cidadãos de forma cada vez mais eficaz. Por mais que existam muitos conceitos, esse é o objetivo principal. O que muda é a forma como chegamos lá – se por meio de tecnologias avançadas, se por intermédio de projetos simples, mas que mudam completamente a vida da população* (inovacaosebraeminas.com.br).

## Instruções ✏️

- O trabalho será desenvolvido em grupos de até 5 alunos.
- O trabalho será desenvolvido preferencialmente nas aulas da disciplina de Gestão Ágil de Projetos.
- O projeto deve contemplar as disciplinas envolvidas no PI-3 (Gestão ágil de projetos, IHC, Banco de Dados Não Relacional, Desenvolvimento Web).
- O produto deve envolver consumo de APIs.
- A solução proposta no PI-3 será usada também no PI-4 e, portanto, deve ter espaço para futuramente envolver conceitos e técnicas de IOT (Internet das Coisas e Aplicações).

## Entrega 🗳️

A entrega será composta por:
- Planejamento o projeto com o PMCanvas.
- Backlog do produto no formato de Histórias de Usuário incluindo prioridade e estimativas.
- Modelagem de classe.
- Software executável e código fonte.
- Link para o repositório do projeto.

## Apresentação 🚀

O resultado do PI será apresentado em um seminário. Cada grupo terá de 20 minutos para a apresentação. Durante a apresentação os trabalhos serão avaliados pelos professores das disciplinas envolvidas no PI e demais convidados. Os colegas da turma irão participar ativamente respondendo a Avaliação por Pares. Ao final, cada aluno deve responder a Autoavaliação.
## Branch do Projeto  🔨
  Nesta seção  do Projeto será  destinado a apresentar  as principais funcionalidades aplicadas a este projeto assim como demonstrar e detalhar  as etapas realizadas
em cada branch para cada integrante do grupo.
- <a href= "https://github.com/gabrielalmir/tethys/tree/api-auth">API-auth</a><br>
realizar a autenticação das APIs, criadas por juliano e Rafael.<br>
- <a href= "https://github.com/gabrielalmir/tethys/tree/api-envio-sms">api-envio-sms</a><br>
API:TWILIO<BR>
API destinada ao envio de SMS,para os usuarios que se cadastraram  no nosso site,logo tal API, encaminhará uma mensagem de alerta  ao usuário caso, os indices pluviométricos atinjam o parametro calculado e estipulado pelo grupo.<br>
- <a href = "https://github.com/gabrielalmir/tethys/tree/api-indice-pluviometrico">api-indice-pluviometrico</a><br>
API: MICROSOFT AZURE<br>
Realizando o consumo desta API, os dados que serão retornados serão os indices pluviométricos, para uma determina localidade,dado uma determinada latitude e longitude,além disso com um terceiro parâmetro é possível estipular uma previsão de  umidade para aquela referida localdiade.
- <a href= "https://github.com/gabrielalmir/tethys/tree/frontend">frontend</a><br>
  Parte do Projeto destinado ao designer do site que será apresentado ao usuário que irá se cadastrar para o nosso sistema de alerta de alagamento.
 - linguagem de marcação: HTML
 - linguagem de desgner: CSS3
 - FrameWork:bootstrap
 - Linguagem de Programação:Javascript
- <a href= "https://github.com/gabrielalmir/tethys/tree/task-alerta-alagamento">task-alerta-alagamento</a>


## Referências

- Projeto Pedagógico do Curso de Tecnologia em Desenvolvimento de Software Multiplataforma, da Fatec Itapira, em [link](https://www.fatecitapira.edu.br/files/cursos/proj_ped_DSM.pdf), acessado em março de 2022.
- Manual de Projetos Interdisciplinares para o CST em Desenvolvimento de Software Multiplataforma, versão 1.0.0, de 22/04/2021, elaborado pela CESU – Unidade de Ensino Superior de Graduação, do Centro Paula Souza.

