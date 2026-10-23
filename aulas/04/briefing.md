


Briefing para produção audiovisual e de conteúdo 
Aula Completa
2026.2



Professor: Luan Tavares Lourenço
Disciplina: Frontend


Aula:
1☐ 2☐ 3☐ 4☒ 5☐ 6☐ 7☐ 8☐ 9☐ 10☐ 11☐ 12☐ 13☐ 14☐ 15☐ 16☐ 


Título da aula: 

Navegadores Web e API


Opção do TA:  Vídeo ☐Texto ☒

1 - Introdução
A primeira grande meta do semestre já foi cumprida: o frontend passou a conversar de verdade com o backend construído no semestre passado, fechando o ciclo de requisição e resposta com Axios. A partir de agora, o objetivo muda de construir para refinar — refinar a forma como as duas camadas se comunicam, se protegem e se apoiam na própria estrutura do navegador. É por isso que esta aula começa olhando para o navegador em si: ele é, depois do sistema operacional, o programa mais complexo que o usuário roda no dia a dia, e é dentro dele que tudo o que já foi construído — DOM, seletores, eventos, requisições — de fato acontece. Entender o navegador como esse ambiente maior, com memória própria, ferramentas de inspeção e mecanismos de armazenamento, é a base para os dois refinamentos que fecham a aula: cookies, JWT e CORS.
2 - O Navegador e o Objeto window
2.1 - O que é um navegador
O navegador (browser) não é só um programa que "mostra HTML". É, depois do próprio sistema operacional, o programa mais complexo que um usuário comum roda no seu computador ou celular. Dentro dele convivem, entre outras peças: um motor de renderização (que transforma HTML/CSS em pixels na tela), um motor de JavaScript (que interpreta e executa o JS), uma pilha de rede completa (que fala HTTP, TLS, DNS), e um conjunto de mecanismos de armazenamento (cookies, localStorage, sessionStorage, cache, IndexedDB). Cada aba aberta é, em boa parte dos navegadores modernos, isolada em seu próprio processo — o que explica por que uma aba travando não derruba o navegador inteiro.
Essa complexidade importa para o curso porque tudo que já foi construído até aqui — DOM, seletores, eventos, requisições — só existe porque o navegador decidiu expor essas capacidades através de uma API própria (a Vendor API). O navegador é o ambiente de execução do frontend, da mesma forma que o Node é o ambiente de execução do backend.
2.2 - O objeto window
Até aqui, document foi tratado como ponto de entrada para tudo. Na prática, document é apenas uma propriedade de um objeto maior: window. window representa a própria aba/janela do navegador — é o objeto global do JS de frontend, e é dentro dele que document vive.
// document é uma propriedade de window
// window.document === document  →  true


console.log(window.document === document); // true
Isso significa que tudo que parecia "solto" no JS de frontend — document, console, localStorage, sessionStorage, fetch, alert, setTimeout — é, na verdade, propriedade ou método de window. O JS de frontend simplesmente permite omitir o prefixo window. para esses membros globais.
// window guarda outras informações do ambiente do navegador


console.log(window.innerWidth, window.innerHeight); // dimensões da viewport


console.log(window.location.href);                  // URL atual


console.log(window.navigator.userAgent);            // dados do navegador/dispositivo
E assim como qualquer HTMLElement aceita addEventListener, o próprio window também aceita — para eventos que pertencem à janela como um todo, não a um elemento específico da árvore. Os dois exemplos mais comuns são resize (a janela do navegador muda de tamanho) e scroll (a página é rolada):
// resize dispara sempre que as dimensões da janela mudam
window.addEventListener("resize", function () {
  console.log("nova largura:", window.innerWidth);
});


// scroll dispara sempre que a posição de rolagem da página muda
window.addEventListener("scroll", function () {
  console.log("posição do scroll:", window.scrollY);
});
Fixar essa hierarquia — window acima, document como uma de suas propriedades, e window com seus próprios eventos — é o que sustenta o restante da aula: cookies e storage também são acessados a partir de window (via document.cookie, window.localStorage e window.sessionStorage), e não de um objeto isolado.
3 - A Memória do Navegador e o Inspetor (DevTools)
Se o navegador é um programa complexo, ele também tem memória própria: o DOM em si, variáveis JS em execução, cookies, localStorage, sessionStorage, cache de rede. O Inspetor (DevTools) é a ferramenta que expõe essa memória para o desenvolvedor, aba por aba — o atalho de teclado para abri-lo é Ctrl+Shift+I. Esta aula foca em três abas — Elements, Console e Network — a aba Application fica reservada para a seção de cookies.
3.1 - Aba Elements
A aba Elements não mostra o HTML original recebido do servidor — mostra o DOM em memória, já parseado. É por isso que alterações feitas por JS em tempo de execução (um append, um setAttribute) aparecem ali. A aba permite:
Selecionar um elemento na árvore e vê-lo destacado (highlight) na página renderizada, e vice-versa;
Editar a árvore diretamente — duplo clique em uma tag, atributo ou texto edita o DOM ao vivo, sem alterar nenhum arquivo;
Ver, na prática, a mesma estrutura de pai/filho/irmão que forma o DOM.
Ao lado direito dessa árvore fica o painel de Styles (e, ao lado dele, Computed): ali aparece exatamente o CSS renderizado para o elemento selecionado — todas as regras que se aplicam a ele, na ordem de especificidade que o navegador usou para decidir o resultado final. Esse painel também é editável em tempo real: dá para ligar/desligar uma propriedade, mudar um valor (uma cor, um tamanho) e ver o efeito instantaneamente na página — sem tocar em nenhum arquivo CSS. É a forma mais rápida de testar um ajuste visual antes de escrevê-lo de verdade no código.
Uma edição feita ali — seja na árvore, seja no painel de estilos — é temporária: some ao recarregar a página, porque existe apenas na memória do navegador.
3.2 - Aba Console
A aba Console tem duas funções que costumam ser confundidas: exibir logs e funcionar como um terminal de JavaScript que executa dentro do contexto real da página aberta.
Exibição de logs: tudo que o código chama via console.log, console.warn e console.error aparece ali, junto com erros não tratados que o próprio navegador reporta (um script que falhou ao carregar, uma exceção lançada);
Execução de JS ao vivo: qualquer linha digitada no Console roda no mesmo window/document da aba aberta — dá para chamar document.querySelector, criar variáveis, disparar funções já carregadas pela página, e ver o resultado imediatamente.
// digitado diretamente no Console do DevTools:


document.querySelectorAll(".destaque").length   // roda contra o DOM real da página


window.location.href                             // lê o objeto window da aba aberta


document.cookie                                  // lê os cookies acessíveis via JS (seção 4)
Esse acesso direto ao window e ao document da aba é o que torna o Console uma ferramenta de depuração tão mais poderosa do que apenas ler mensagens — ele é uma porta de entrada viva para o ambiente de execução do frontend.
3.3 - Aba Network e a cascata de requisições
A aba Network registra toda requisição HTTP feita pela aba, na ordem em que aconteceu, com timing detalhado (DNS, conexão, espera, download). O ponto central desta aula é entender por que essas requisições aparecem em cascata, e não todas de uma vez.
O navegador não sabe, de antemão, todos os arquivos que uma página vai precisar. Ele descobre isso conforme processa a resposta:
O navegador faz a primeira requisição, pedindo o documento HTML (ex.: GET /index.html);
A resposta chega como string e o navegador começa a parsear esse HTML, construindo o DOM linha a linha;
Conforme o parser encontra tags que referenciam outros arquivos — <link rel="stylesheet">, <script src="...">, <img src="...">, @font-face no CSS — ele dispara uma nova requisição para cada um desses assets, no momento em que os encontra;
Cada asset baixado pode, por sua vez, referenciar outros: um CSS pode importar uma fonte, um JS pode fazer uma chamada para uma API assim que executa.
É essa descoberta progressiva — pedir o próximo recurso só depois de encontrar a referência a ele no que já chegou — que forma a "cascata" (waterfall) visível na aba Network: cada linha começa um pouco depois da anterior, e o gráfico de barras mostra visualmente essa dependência em cadeia. Alguns recursos são bloqueantes (um <script> sem defer/async no <head> pausa o parsing do HTML até terminar de baixar e executar), o que também aparece na cascata como um atraso no carregamento dos itens seguintes.
Entender essa cascata explica, na prática, por que a ordem e a forma como os arquivos são referenciados no HTML afeta diretamente a performance percebida da página — e é a mesma aba Network que será usada para conferir as chamadas feitas via Axios.
4 - Cookies
4.1 - O que são cookies
HTTP é um protocolo stateless: cada requisição chega ao servidor sem memória da requisição anterior. Cookies existem para resolver exatamente esse problema — são pequenos pedaços de dado (texto, no formato chave=valor), armazenados pelo navegador e associados a um domínio, que o próprio navegador reenvia automaticamente em toda requisição futura para aquele mesmo domínio. É assim que um site "lembra" que o usuário está logado entre uma página e outra, mesmo sem o backend guardar nenhuma conexão aberta.
4.2 - Manipulando cookies pelo window (document.cookie)
Do lado do frontend, cookies são acessados através de document.cookie — lembrando a hierarquia da seção 2.2, isso é, na prática, window.document.cookie. document.cookie funciona como uma string única, mas se comporta como getter e setter:
// LER: retorna todos os cookies acessíveis via JS, como uma única string
console.log(document.cookie);
// "tema=escuro; idioma=pt-BR"


// ESCREVER: cada atribuição adiciona/atualiza um cookie, não sobrescreve os outros
document.cookie = "tema=escuro; path=/; max-age=3600";
document.cookie = "idioma=pt-BR; path=/";
4.3 - Enviando cookies para o backend
O desenvolvedor não precisa (nem deve) anexar o cookie manualmente em cada chamada de API. Para qualquer requisição — de formulário, de axios, de fetch — feita para o mesmo domínio que definiu o cookie, o próprio navegador anexa automaticamente os cookies daquele domínio na requisição, através de um header HTTP específico.
4.4 - O header Cookie e o header Set-Cookie
Cookies trafegam por dois headers HTTP diferentes, dependendo da direção:
Na requisição (frontend → backend), o navegador envia o header Cookie, juntando todos os cookies do domínio em uma única linha:
GET /usuarios/perfil HTTP/1.1
Host: api.meusite.com
Cookie: sessionId=a1b2c3; tema=escuro
Na resposta (backend → frontend), o servidor define ou atualiza um cookie usando o header Set-Cookie — um header por cookie, com atributos extras separados por ponto e vírgula:
HTTP/1.1 200 OK
Set-Cookie: sessionId=a1b2c3; HttpOnly; Secure; SameSite=Strict; Max-Age=3600
Set-Cookie: tema=escuro; Path=/
Ao receber essa resposta, é o próprio navegador quem interpreta o header Set-Cookie e monta/atualiza o cookie na sua memória (aba Application, seção 4.6) — o frontend não precisa rodar nenhum código para isso acontecer.
4.5 - Max-Age, HttpOnly e Secure: os três atributos que mais importam
Entre todos os atributos que um Set-Cookie pode carregar, três merecem destaque porque aparecem em praticamente qualquer cookie de autenticação em produção:
Max-Age — define, em segundos, por quanto tempo o cookie continua válido. Passado esse tempo, o próprio navegador descarta o cookie automaticamente, sem precisar de nenhuma ação do backend ou do frontend. Um Max-Age=3600, por exemplo, mantém o cookie vivo por uma hora; sem esse atributo (ou com Expires no passado), o cookie de sessão some assim que a aba é fechada.
HttpOnly — torna o cookie invisível para document.cookie: o JS de frontend simplesmente não consegue lê-lo nem escrevê-lo, mesmo estando na mesma origem. Cookies sensíveis, como o de sessão/autenticação, devem ser definidos com HttpOnly exatamente para impedir que um script malicioso (ex.: injetado via XSS) consiga roubar ou manipular esse valor pelo frontend. A regra prática: o frontend recebe o cookie de sessão automaticamente em toda requisição, mas nunca precisa — nem deve conseguir — manipulá-lo diretamente; quem cria, atualiza e expira esse cookie é sempre o backend, via Set-Cookie.
Secure — garante que o cookie só é enviado pelo navegador em conexões HTTPS. Em uma conexão HTTP comum (sem criptografia), um cookie Secure simplesmente não é anexado à requisição, protegendo o valor de ser capturado em trânsito por alguém observando a rede.
Juntos, esses três atributos definem por quanto tempo o cookie vive (Max-Age), quem pode acessá-lo (HttpOnly bloqueia o próprio frontend) e em que condições ele trafega pela rede (Secure exige HTTPS) — as três perguntas que qualquer cookie de autenticação precisa responder.
4.6 - Aba Application
No DevTools, é a aba Application que expõe essa memória: em Cookies, aparece cada cookie do domínio atual, com colunas para valor, domínio, path, expiração e as flags HttpOnly/Secure/SameSite — dá para ver visualmente, ali, que um cookie HttpOnly existe no navegador mesmo sem aparecer em document.cookie no Console.
4.7 - Local Storage e Session Storage (breve)
A mesma aba Application também mostra Local Storage e Session Storage — outros dois mecanismos de armazenamento no navegador, acessados via window.localStorage e window.sessionStorage. Sem entrar em profundidade (não é o foco desta aula): localStorage persiste indefinidamente até ser apagado, sessionStorage dura só a sessão daquela aba, e nenhum dos dois é enviado automaticamente ao backend como o cookie — ficam só no navegador, a menos que o próprio JS os leia e mande manualmente.
5 - JWT (JSON Web Token)
5.1 - O que é um JWT
JWT é um formato de token usado para autenticação stateless: em vez de o backend guardar a sessão em memória/banco, ele emite um token auto-contido, assinado, que carrega os dados de identificação do usuário dentro dele mesmo. Um JWT é uma string dividida em três partes separadas por ponto, cada uma em Base64:
header.payload.signature
Um JWT real, antes de decodificado, se parece com isto:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQyLCJub21lIjoiQW5hIiwicm9sZSI6InVzdWFyaW8iLCJpYXQiOjE3MzEwMDAwMDAsImV4cCI6MTczMTAwMzYwMH0.4f8s9dK2p...
Decodificando cada parte (o header e o payload são só Base64, não são criptografados):
// header — identifica o algoritmo de assinatura
{
  "alg": "HS256",
  "typ": "JWT"
}


// payload — os dados (claims) do usuário
{
  "userId": 42,
  "nome": "Ana",
  "role": "usuario",
  "iat": 1731000000,   // issued at: quando o token foi emitido
  "exp": 1731003600    // expiration: quando o token deixa de ser válido
}


// signature — não é legível: é o resultado de uma função de hash
// aplicada sobre header + payload, usando uma chave secreta
Qualquer um pode ler o payload de um JWT — é só Base64, dá para decodificar em qualquer site ou no próprio Console. O que ninguém sem a chave secreta consegue fazer é forjar um JWT válido, porque a signature só bate se for gerada com a mesma chave usada originalmente. É isso que garante integridade (o payload não foi alterado no caminho), não sigilo do conteúdo.
5.2 - O secret: onde ele mora
Essa chave usada para gerar e validar a assinatura — o secret — nunca deve sair do backend. Ela fica armazenada apenas dentro do próprio servidor da aplicação, tipicamente como uma variável de ambiente em um arquivo .env, que não é versionado no repositório nem exposto ao frontend de forma alguma:
# .env (arquivo dentro do backend, nunca enviado ao frontend)
JWT_SECRET=uma_chave_bem_longa_e_dificil_de_adivinhar_123!
// backend: gera o token usando o secret guardado no .env
import jwt from "jsonwebtoken";


const token = jwt.sign(
  { userId: 42, nome: "Ana", role: "usuario" },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);


// backend: valida um token recebido usando o mesmo secret
jwt.verify(token, process.env.JWT_SECRET);
Se esse secret vazasse, qualquer pessoa poderia gerar tokens forjados e se passar por qualquer usuário — por isso ele nunca deve aparecer em código de frontend, em repositório público, nem em nenhuma resposta enviada ao navegador. O frontend recebe e reenvia o token pronto; quem assina e quem verifica é sempre o backend.
5.3 - JWT dentro de um cookie
A prática mais segura é o backend devolver o JWT dentro de um cookie HttpOnly (seção 4.5), em vez de o frontend guardá-lo manualmente em localStorage. Isso combina os dois mecanismos:
Autenticação: o JWT no cookie é enviado automaticamente em toda requisição (seção 4.3), sem o frontend precisar montar nenhum header manualmente;
Expiração: o Max-Age do cookie e o exp dentro do payload do JWT trabalham juntos para definir por quanto tempo aquela sessão é válida;
Segurança: por estar em um cookie HttpOnly, o token fica protegido de ser lido ou roubado via document.cookie pelo próprio frontend.
Essa combinação — JWT + cookie HttpOnly + expiração — é exatamente o que abre a porta para a próxima aula, de segurança e API contextual: é a partir desse token que o backend vai saber quem está fazendo cada requisição, sem depender de sessão em memória.
6 - CORS
6.1 - O que é CORS, explicado sem jargão
Por padrão, o navegador aplica uma regra de segurança chamada same-origin policy: JavaScript rodando em uma página só pode fazer requisições livremente para o mesmo domínio (origin) de onde a página foi carregada. Origin é a combinação de três coisas: protocolo (http/https), domínio (ex.: meusite.com) e porta (ex.: 3000). Se qualquer uma dessas três muda, já é considerado um domínio diferente para essa regra — inclusive só trocar a porta.
Exemplo prático que será simulado em aula: uma página servida em http://localhost:5173 (o frontend, rodando no Vite) tentando chamar uma API em http://localhost:3000 (o backend). Mesmo sendo o mesmo computador, mesmo domínio localhost, a porta diferente (5173 ≠ 3000) já torna essas duas origens distintas aos olhos do navegador. Por padrão, o navegador bloqueia a resposta dessa requisição antes de entregá-la ao JS — não porque o backend recusou, mas porque o próprio navegador decidiu não repassar.
CORS (Cross-Origin Resource Sharing) é exatamente o mecanismo que permite o backend liberar essa exceção, dizendo explicitamente ao navegador, via header de resposta, que aquela outra origem tem permissão para receber os dados.
6.2 - Liberando CORS via header
O backend inclui, na resposta, o header Access-Control-Allow-Origin, informando qual origem (ou * para qualquer uma) pode consumir aquela API:
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:5173
Content-Type: application/json
Em uma aplicação Express (Node), isso costuma ser feito assim:
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
Sem esse header, o navegador continua bloqueando a leitura da resposta pelo JS, mesmo que a requisição chegue e seja processada normalmente pelo servidor — o bloqueio é do lado do navegador, na entrega ao script, não do lado do backend ao processar.
7 - Conclusão
Com a comunicação entre frontend e backend já funcionando, esta aula voltou um passo para refinar o entendimento do ambiente onde tudo isso acontece: o navegador, com document como propriedade de window — que por sua vez tem seus próprios eventos, como resize e scroll. O Inspetor (Ctrl+Shift+I) mostrou essa memória na prática: a aba Elements expondo o DOM em memória e o painel de estilos renderizados e editáveis ao lado, a aba Console servindo tanto para logs quanto para executar JS ao vivo, e a aba Network revelando a cascata de requisições conforme o navegador descobre e pede assets durante o parsing. Cookies entraram como resposta ao caráter stateless do HTTP, com Max-Age, HttpOnly e Secure como os três atributos que definem por quanto tempo, para quem e em que condições um cookie existe — tudo visível na aba Application, ao lado de Local e Session Storage. O JWT mostrou sua estrutura completa (header, payload e signature), com o secret guardado apenas no backend, em um .env, e como ele se combina com um cookie HttpOnly para autenticação com expiração. Por fim, CORS explicou por que trocar apenas a porta já basta para o navegador tratar dois domínios como origens diferentes, e como o backend libera essa comunicação através do header Access-Control-Allow-Origin.
8 - Referências
MDN — Window, Window.document, Window.localStorage, Window.sessionStorage.
MDN — Document.cookie, Using HTTP cookies, HTTP headers Set-Cookie e Cookie.
MDN — Chrome DevTools: Elements, Console, Network panel (waterfall).
MDN/JWT.io — JSON Web Tokens: estrutura, uso e boas práticas.
MDN — Cross-Origin Resource Sharing (CORS), Same-origin policy.


Questões do TA:



QUESTÃO 1 

Sobre a relação entre os objetos window e document no navegador, é correto afirmar que:

A) window e document são objetos independentes, sem nenhuma relação hierárquica entre si.

B) document é uma propriedade de window, que representa a própria janela/aba do navegador, expõe outras APIs como localStorage e sessionStorage, e aceita seus próprios eventos, como resize e scroll.

C) window é uma propriedade de document, sendo acessível apenas depois que o DOM termina de ser parseado.

D) window só existe em ambientes de backend (Node), enquanto document é exclusivo do navegador.

E) window e document são sempre idênticos, e window.document !== document retorna false apenas em navegadores desatualizados.

Gabarito: B

Misturar as alternativas? ( x) Sim (  ) Não


QUESTÃO 2

Sobre os atributos Max-Age, HttpOnly e Secure de um cookie, é correto afirmar que:
A) HttpOnly impede que o cookie seja lido ou escrito via document.cookie pelo JS de frontend, Max-Age define por quantos segundos o cookie permanece válido antes de ser descartado automaticamente pelo navegador, e Secure garante que o cookie só seja enviado em conexões HTTPS.
B) Max-Age define o algoritmo de criptografia do cookie, enquanto HttpOnly e Secure controlam apenas o domínio de origem.
C) Um cookie HttpOnly continua acessível normalmente via document.cookie, servindo apenas como recomendação sem efeito prático no navegador.
D) Secure impede que o cookie expire, tornando o atributo Max-Age desnecessário quando os dois são usados juntos.
E) HttpOnly e Secure são atributos equivalentes, ambos controlando exclusivamente por quanto tempo o cookie é válido.

Gabarito: A)

Misturar as alternativas? (x ) Sim (  ) Não


QUESTÃO 3

Sobre a estrutura de um JWT e o armazenamento do secret usado para assiná-lo, é correto afirmar que:
A) O JWT é composto por header, payload e signature, separados por ponto; o payload pode ser lido por qualquer pessoa (é apenas Base64), mas o secret usado para gerar e validar a signature fica armazenado somente no backend, tipicamente em uma variável de ambiente no .env, nunca exposto ao frontend.
B) O secret usado para assinar o JWT deve ficar salvo no frontend, para que o navegador consiga validar sozinho a assinatura de cada token recebido.
C) O payload de um JWT é criptografado e ilegível sem a chave secreta, o que impede qualquer pessoa de ver os dados nele contidos.
D) A signature de um JWT tem como única função identificar o algoritmo usado no header, sem relação com o payload.
E) Armazenar o secret em um arquivo .env no backend é uma prática desnecessária, já que o valor pode ser escrito diretamente no código-fonte versionado sem nenhum risco.

Gabarito: A

Misturar as alternativas? (x ) Sim (  ) Não


