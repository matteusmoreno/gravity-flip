# BACKLOG — Gravity Flip

Versão 1.0 do documento · 24/11/2026.

Prioridade: **Must** (MVP), **Should** (versão 1.0), **Could** (futuras versões). Complexidade: B, M, A. Decisões em `DECISIONS.md` (D-xx).

## 1. Histórias de usuário

### Épico A — Núcleo de jogo

| ID | História | Prioridade | Compl. | Critérios de aceitação |
|---|---|---|---|---|
| US-01 | Como jogador, quero inverter a gravidade com um toque, clique ou tecla, para desviar dos obstáculos | Must | M | Espaço/seta para cima, clique e toque invertem; a esfera vai à superfície oposta; funciona igual nas três entradas |
| US-02 | Como jogador, quero ver quando posso inverter de novo, para entender a recarga | Must | B | Anel ao redor da esfera mostra ~0,3 s de recarga; entrada durante a recarga (até ~0,1 s antes do fim) é executada ao terminar |
| US-03 | Como jogador, quero que o jogo corra sozinho, para me concentrar na inversão | Must | B | Velocidade automática; a velocidade sobe por estágio até um limite |
| US-04 | Como jogador, quero enfrentar blocos, espinhos e barreiras com passagem, para ter desafio variado | Must | A | Os três tipos aparecem em chão e teto; colisões respeitam a hitbox reduzida |
| US-05 | Como jogador, quero percursos sempre possíveis e variados, para sentir justiça | Must | A | Todo trecho é validado automaticamente como jogável; o sorteio respeita o estágio; sem repetição óbvia em sequência |
| US-06 | Como jogador, quero ter 3 vidas e um período de proteção após o dano, para não perder tudo de uma vez | Must | M | Dano remove 1 vida; ~1,5 s de invulnerabilidade com piscar; 0 vidas encerra a partida |
| US-07 | Como jogador, quero coletar um escudo que absorve 1 colisão | Must | M | Escudo ativo é indicado; o próximo dano é absorvido sem perder vida; só um ativo por vez |
| US-08 | Como jogador, quero coletar moedas, para ganhar pontos e acumular na carteira | Must | M | Moedas somam pontos e vão para a carteira permanente, mesmo que eu perca |
| US-09 | Como jogador, quero um combo por quase-colisões e moedas em sequência, para ser recompensado pelo risco | Must | M | O multiplicador sobe pelos dois eventos e zera ao levar dano; indicador visível no HUD |
| US-10 | Como jogador, quero que a dificuldade suba em estágios, para o jogo ficar mais desafiador | Must | M | A cada ~20-30 s há mudança perceptível de velocidade e de padrões; há teto de velocidade |

### Épico B — Interface e navegação

| ID | História | Prioridade | Compl. | Critérios de aceitação |
|---|---|---|---|---|
| US-11 | Como jogador, quero um menu simples com Jogar e Recordes | Must | M | Menu com logo, Jogar, Recordes, ícone de som, melhor recorde e fundo animado; chegar ao jogo em até 2 interações |
| US-12 | Como jogador, quero ver pontuação, combo, vidas e escudo durante a partida | Must | M | HUD legível sem cobrir a área de jogo; moedas não aparecem no HUD |
| US-13 | Como jogador, quero pausar o jogo | Must | M | Botão discreto, P/Esc no desktop e pausa automática ao perder o foco; contagem 3-2-1 ao retomar |
| US-14 | Como jogador, quero ver meu resultado e recomeçar rápido | Must | M | Game over mostra pontuação, recorde, destaque de novo recorde e estatísticas; Jogar de novo reinicia em menos de 2 s |
| US-15 | Como jogador, quero ver meus melhores resultados | Must | B | Top 10 local com pontuação e data; estado vazio amigável |
| US-16 | Como jogador, quero ajustar volumes e efeitos reduzidos rapidamente | Must | M | Painel rápido no menu e no pause; música e efeitos separados, mudo geral e efeitos reduzidos; valores salvos |
| US-17 | Como jogador de celular, quero jogar em paisagem com toque em qualquer ponto | Must | M | Escala sem distorção; aviso em retrato; toque em qualquer ponto inverte sem acionar zoom ou rolagem |

### Épico C — Identidade visual e áudio

| ID | História | Prioridade | Compl. | Critérios de aceitação |
|---|---|---|---|---|
| US-18 | Como jogador, quero que o mundo reaja à inversão, para sentir impacto | Must | A | Rotação, pulso e rastro em toda inversão; tremor e glitch em momentos especiais; modo efeitos reduzidos os desliga |
| US-19 | Como jogador, quero feedback visual de moedas, dano, escudo e combo | Must | M | Partículas e animações conforme `UI_UX_SPECIFICATION.md` |
| US-20 | Como jogador, quero uma estética neon consistente | Must | A | Paleta, tipografia, parallax e transições seguem a especificação de UI |
| US-21 | Como jogador, quero música e efeitos sonoros | Must | M | Sons de inversão, moeda, colisão, combo, novo recorde e game over; música em loop (menu e jogo); áudio só inicia após interação |

### Épico D — Dados e qualidade

| ID | História | Prioridade | Compl. | Critérios de aceitação |
|---|---|---|---|---|
| US-22 | Como jogador, quero que meu recorde, ranking, moedas e ajustes fiquem salvos | Must | B | Dados persistem entre sessões; formato versionado; dados corrompidos não travam o jogo |
| US-23 | Como jogador, quero que o jogo rode fluido | Must | M | 60 FPS em celular de nível médio no fluxo principal; sem travadas perceptíveis |
| US-24 | Como mantenedor, quero testes automatizados | Must | M | Vitest cobre pontuação, combo, dificuldade, gerador, validador e persistência; Playwright cobre o fluxo principal |
| US-25 | Como mantenedor, quero publicação automática | Must | B | Deploy estático a cada alteração na branch principal |

### Versão 1.0

| ID | História | Prioridade | Compl. | Critérios de aceitação |
|---|---|---|---|---|
| US-26 | Como jogador, quero obstáculos móveis e zonas perigosas | Should | A | Novos tipos validados pelo validador de trechos |
| US-27 | Como jogador, quero ímã de moedas e multiplicador | Should | M | Efeitos temporários com indicador na tela e som |
| US-28 | Como jogador, quero que cada estágio mude o bioma visual | Should | M | Visual muda por estágio sem alterar as regras |
| US-29 | Como jogador, quero comprar skins de esfera e rastro com moedas | Should | M | Loja, preços, seleção e persistência; moedas acumuladas do MVP são preservadas |
| US-30 | Como jogador, quero conquistas | Should | M | ~10 conquistas, progresso visível e skins especiais como recompensa |
| US-31 | Como jogador, quero uma tela de Configurações completa e splash | Should | B | Configurações, créditos e licenças; splash curta |
| US-32 | Como jogador, quero sons de escudo e de interface | Should | B | Sons de ativação/quebra do escudo e cliques de UI |

### Futuras versões

| ID | História | Prioridade | Compl. |
|---|---|---|---|
| US-33 | Ranking online | Could | A |
| US-34 | Desafio diário e missões diárias | Could | A |
| US-35 | Fase bônus de moedas | Could | M |
| US-36 | Compartilhar pontuação | Could | B |
| US-37 | Suporte a gamepad | Could | B |
| US-38 | Estatísticas completas | Could | B |

## 2. Requisitos funcionais (resumo)

- RF-01 Inversão de gravidade com recarga e buffer de entrada (US-01, US-02).
- RF-02 Geração de percurso por trechos validados (US-04, US-05).
- RF-03 Sistema de 3 vidas, invulnerabilidade e escudo (US-06, US-07).
- RF-04 Pontuação por distância, moedas e combo (US-08, US-09).
- RF-05 Dificuldade em estágios (US-10).
- RF-06 Telas: menu, gameplay, pause, game over, recordes e painel rápido (US-11 a US-16).
- RF-07 Persistência local versionada (US-22).
- RF-08 Áudio com volumes separados e mudo (US-16, US-21).
- RF-09 Entrada por teclado, mouse e toque (US-01, US-17).

## 3. Requisitos não funcionais

| ID | Requisito | Meta |
|---|---|---|
| RNF-01 | Desempenho | 60 FPS em celulares de nível médio |
| RNF-02 | Compatibilidade | Chrome, Edge, Firefox e Safari recentes, inclusive iOS |
| RNF-03 | Tamanho | Build abaixo de ~2 MB |
| RNF-04 | Responsividade | Paisagem em telas a partir de 360 px de largura; ajuste sem distorção |
| RNF-05 | Acessibilidade | Modo efeitos reduzidos, contraste 4,5:1 no texto, navegação por teclado nas telas |
| RNF-06 | Latência de entrada | Resposta visual à inversão no mesmo quadro ou no seguinte |
| RNF-07 | Qualidade de código | TypeScript estrito, lint limpo, módulos pequenos e tipados |
| RNF-08 | Licenças | Nenhum asset sem licença registrada compatível com portfólio |
| RNF-09 | Resiliência | Dados salvos antigos ou corrompidos não impedem o jogo de abrir |
| RNF-10 | Privacidade | Nenhum dado pessoal coletado; tudo local no MVP |

## 4. Ordem sugerida de implementação

M0 (US-24, US-25) → M1 (US-01 a US-03) → M2 (US-04, US-05) → M3 (US-06, US-07) → M4 (US-08 a US-10) → M5 (US-11 a US-16, US-22) → M6 e M7 em paralelo (US-18 a US-21) → M8 (US-17, US-23) → M9 (balanceamento e QA).
