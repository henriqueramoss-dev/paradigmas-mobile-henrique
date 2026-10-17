# paradigmas-mobile-henrique

**Paradigmas do desenvolvimento mobile**

Atividade da disciplina sobre as diferenças entre desenvolver para a web e para dispositivos móveis. O repositório reúne a fundamentação teórica, a análise de dois aplicativos de uso diário e a reconstrução de uma Navbar web como componente React Native em um projeto Expo.

## Sumário

1. [Fundamentação](#1-fundamentação)
2. [Pesquisa de campo](#2-pesquisa-de-campo-análise-de-2-aplicativos)
3. [Prática: da web para o React Native](#3-prática-da-web-para-o-react-native)
4. [Conclusão](#4-conclusão)
5. [Referências](#referências)
6. [Declaração de uso de IA](#declaração-de-uso-de-ia)

## Como executar

```bash
npm install
npx expo start
```

Depois é só escanear o QR Code com o app **Expo Go** (Android ou iOS) ou apertar `w` para abrir no navegador.

---

## 1. Fundamentação

### 1.1 Ciclo de build e distribuição

Na web, o caminho entre salvar o arquivo e o usuário ver a mudança é curto. O código passa por um build (bundler, minificação), vai para um servidor ou CDN e, no próximo carregamento da página, todo mundo já recebe a versão nova. Se aparecer um bug, eu faço outro deploy e em minutos ele some para todos. Quem controla a versão que o usuário roda sou eu.

No mobile essa lógica se inverte. O código precisa ser compilado para cada plataforma (um `.apk`/`.aab` no Android e um `.ipa` no iOS), assinado digitalmente com certificados do desenvolvedor e enviado para a loja. Antes de ficar disponível, o app passa por revisão:

- **App Store (Apple):** a revisão é feita por pessoas e segue as *App Review Guidelines*. Costuma levar de algumas horas a alguns dias e pode recusar o app por motivos como travamentos, uso de permissão sem justificativa, conteúdo ou modelo de pagamento fora das regras.
- **Google Play:** a revisão é mais automatizada e normalmente mais rápida, mas também existe e pode barrar o app. O Google ainda permite liberar a versão aos poucos (*staged rollout*), para uma porcentagem dos usuários.

Mesmo depois de aprovada, a versão nova não chega a todos ao mesmo tempo. Cada pessoa atualiza quando quer (ou quando a atualização automática roda), e muita gente fica meses com uma versão antiga instalada. Isso tem consequências práticas:

- o back-end precisa continuar aceitando requisições de versões antigas do app (APIs versionadas, campos novos opcionais);
- um bug publicado não some com um novo deploy; ele continua no celular de quem não atualizou;
- às vezes é preciso implementar um "forçar atualização", bloqueando versões muito antigas.

No ecossistema Expo existe um meio-termo: as atualizações OTA (*over-the-air*, com o `expo-updates`/EAS Update), que trocam apenas o bundle JavaScript sem passar pela loja. Elas servem para correções na parte JS, mas qualquer mudança em código nativo (uma biblioteca nova com módulo nativo, uma permissão nova) exige um build completo e uma nova revisão.

| | Web | Mobile |
|---|---|---|
| Publicação | Deploy no servidor/CDN | Build assinado + envio para a loja |
| Revisão de terceiros | Não existe | Apple e Google revisam |
| Tempo até o usuário | Minutos | Horas a dias (mais o tempo do usuário atualizar) |
| Versões em uso | Uma só | Várias ao mesmo tempo |
| Rollback | Novo deploy | Nova versão na loja (ou OTA, quando possível) |

### 1.2 Ciclo de vida do aplicativo

Um app mobile não fica simplesmente "aberto" ou "fechado". O sistema operacional controla em que estado ele está, porque precisa economizar bateria e memória. De forma simplificada, os estados são:

- **Ativo (*active* / *foreground*):** o app está na tela e recebendo toques.
- **Inativo (*inactive*, mais visível no iOS):** um estado de transição, por exemplo quando chega uma ligação ou a central de controle é puxada por cima do app.
- **Em segundo plano (*background*):** o usuário foi para outro app ou para a tela inicial. O app ainda está na memória, mas fica praticamente congelado; só pode rodar tarefas curtas ou específicas (tocar música, baixar arquivo, receber localização) se pedir isso ao sistema.
- **Encerrado pelo sistema (*terminated*):** se faltar memória, o sistema mata o processo sem avisar. Quando o usuário volta, o app abre do zero, e ele espera encontrar a tela onde estava.

No React Native dá para acompanhar essas mudanças com a API `AppState`, que informa quando o app passa de `active` para `background` e vice-versa. É o momento de salvar um rascunho, pausar um vídeo ou recarregar dados que podem estar desatualizados.

**Comparando com a web e o desktop:**

- **Aba de navegador:** também tem algo parecido (a Page Visibility API avisa quando a aba fica oculta, e navegadores congelam ou descartam abas inativas), mas o desenvolvedor web costuma ignorar isso, porque fechar a aba é uma ação explícita do usuário e recarregar a página é algo esperado.
- **Programa de desktop:** em geral continua rodando em segundo plano com todos os recursos até o usuário fechar. Memória e bateria raramente forçam o encerramento.
- **App mobile:** o encerramento pode acontecer a qualquer momento e sem aviso, então o app precisa ser pensado para salvar e restaurar estado o tempo todo.

### 1.3 Restrições do dispositivo

- **Bateria:** tudo que mantém o processador, o GPS, a tela ou o rádio de rede ativos gasta bateria. Requisições em excesso, animações pesadas e localização em tempo real precisam de justificativa. Os sistemas limitam tarefas em segundo plano justamente por isso.
- **Memória:** celulares têm menos RAM livre que um computador e o sistema mata apps que exageram. Listas longas precisam ser virtualizadas (`FlatList` em vez de renderizar tudo com `map`), e imagens grandes devem ser redimensionadas.
- **Rede instável ou ausente:** o usuário entra no elevador, no metrô ou está no 3G da estrada. O app precisa tratar *timeout*, mostrar estado de carregamento, guardar dados em cache e, quando fizer sentido, funcionar offline e sincronizar depois. Também é preciso lembrar que o plano de dados é limitado.
- **Tamanho e densidade de tela:** existem telas de 4" a tablets de 13", com densidades diferentes. Por isso o React Native trabalha com *density-independent pixels* (dp/pt): um valor `16` ocupa um tamanho físico parecido em qualquer aparelho, e as imagens precisam de versões `@2x`/`@3x`.
- **Orientação:** o usuário pode girar o celular. O layout precisa se adaptar (ou o app deve travar a orientação, como faz o `"orientation": "portrait"` do `app.json`). O `useWindowDimensions` ajuda a reagir a essa mudança.
- **Notch e safe area:** o entalhe da câmera, a *Dynamic Island*, os cantos arredondados e a barra de gestos inferior ocupam parte da tela. Conteúdo importante precisa ficar dentro da *safe area*, o que se resolve com `react-native-safe-area-context` ou com *paddings* calculados.
- **Permissões:** câmera, microfone, localização, contatos, fotos e notificações dependem de autorização explícita do usuário, que pode negar ou revogar depois nas configurações. A boa prática é pedir no momento em que a funcionalidade é usada, explicando o motivo, e o app precisa continuar funcionando (mesmo que parcialmente) se a resposta for "não". No iOS, o texto que justifica a permissão é obrigatório e é verificado na revisão da loja.

### 1.4 Entrada e interação

- **Toque x mouse e teclado:** o mouse é preciso (um pixel) e tem estados intermediários, como passar por cima (*hover*) e clique direito. O dedo cobre uma área grande, esconde o que está embaixo dele e não tem *hover*. Por isso, tudo o que na web depende de *hover* (menus, *tooltips*) precisa de outra solução no mobile.
- **Área mínima de toque:** a Apple recomenda no mínimo **44 × 44 pt** e o Material Design recomenda **48 × 48 dp** para qualquer elemento tocável. Um ícone pode ser visualmente pequeno, mas a área tocável em volta precisa ter esse tamanho (no React Native, com `padding` ou `hitSlop`).
- **Feedback ao toque:** como não há *hover*, o usuário precisa ver que o toque foi registrado: mudança de opacidade, cor de fundo ao pressionar (`Pressable` com estado `pressed`), vibração leve.
- **Gestos:** deslizar para voltar, puxar para atualizar (*pull to refresh*), deslizar um item para apagar, pinça para zoom, toque longo. Os gestos são rápidos, mas não aparecem na tela, então as ações importantes precisam também de um botão visível.
- **Teclado virtual:** quando um campo recebe foco, o teclado ocupa quase metade da tela e pode esconder o próprio campo ou o botão de enviar. É necessário usar `KeyboardAvoidingView` ou rolar a tela, escolher o tipo de teclado certo (`keyboardType="email-address"`, `numeric`) e permitir fechar o teclado tocando fora.

### 1.5 UX mobile

- **Contexto de uso:** no computador, a pessoa geralmente está sentada, com atenção e tempo. No celular, ela está em pé no ônibus, andando, com uma mão ocupada, no sol forte ou com pressa. As sessões são curtas e interrompidas, então a tarefa principal precisa ser resolvida em poucos toques e o app precisa lembrar onde o usuário parou.
- **Zona do polegar:** como muita gente usa o celular com uma mão só, a parte de baixo e o centro da tela são fáceis de alcançar com o polegar, enquanto os cantos superiores são difíceis (principalmente em telas grandes). Por isso as ações principais migraram para baixo: barras de abas inferiores, botão flutuante no canto inferior, barra de busca embaixo em alguns navegadores.

```
┌───────────────┐
│ ✗ difícil   ✗ │   ← cantos de cima: ações raras (configurações, perfil)
│               │
│   ~ alcance   │
│     médio     │
│               │
│  ✓ fácil  ✓   │   ← parte de baixo: navegação e ação principal
└───────────────┘
   (uso com a mão direita)
```

- **Padrões de navegação mobile:**
  - **Tab bar (barra de abas inferior):** de 3 a 5 seções principais sempre visíveis; é o padrão mais comum hoje.
  - **Stack (pilha):** cada tela nova é empilhada sobre a anterior, com botão e gesto de voltar.
  - **Drawer (menu lateral / hambúrguer):** esconde muitas opções, mas reduz a descoberta, e por isso costuma ficar para itens secundários.
  - **Modais e *bottom sheets*:** para tarefas curtas sem perder o contexto da tela de trás.
