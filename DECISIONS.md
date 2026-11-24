# DECISIONS — Gravity Flip

Registro das decisões aprovadas durante a entrevista de descoberta (24/11/2026). Cada decisão pode ser reaberta pelo dono do produto.

Legenda de status: **Aprovada** (escolha do dono do produto), **Aprovada (rec.)** (alinhada com a recomendação da direção), **Aprovada (contra rec.)** (escolhida em vez da recomendação inicial; riscos registrados).

## Etapa 1 — Visão e posicionamento

| # | Decisão | Alternativas consideradas | Justificativa | Status |
|---|---|---|---|---|
| D-01 | Identidade energética e neon-arcade | Zen/hipnótico, fofo/cartoon, hardcore | Combina com a inversão de gravidade e dá espaço a efeitos fortes | Aprovada (rec.) |
| D-02 | Público casual, todas as idades | Jovens 13-25, hardcore, público de portfólio | Regras simples e curva de aprendizado curta | Aprovada (rec.) |
| D-03 | Partidas de 1 a 3 minutos | 30-90 s, 3-5 min, variável | Tempo para a dificuldade evoluir e criar tensão | Aprovada |
| D-04 | Motivos para rejogar: recorde pessoal e ranking | Skins, conquistas e missões | Recorde é o gancho central do endless runner | Aprovada |
| D-05 | Ranking local no MVP, online em versão futura | Online desde o MVP; só local | Evita backend e anti-trapaça no MVP; persistência desenhada para trocar de fonte | Aprovada (rec.) |
| D-06 | Referências escolhidas pela direção: Geometry Dash, VVVVVV, Super Hexagon | Sem referências; exemplos visuais | O dono do produto não conhecia os jogos | Aprovada |
| D-07 | Diferencial: o mundo reage à inversão (cenário, cores, câmera) | Obstáculos teto/chão, risco e recompensa, trilha reativa | Torna cada virada espetacular e é a assinatura do jogo | Aprovada (rec.) |

## Etapa 2 — Gameplay e mecânicas

| # | Decisão | Alternativas consideradas | Justificativa | Status |
|---|---|---|---|---|
| D-08 | Endless runner, visão lateral 2D | Fases; ambos | Foco em recorde e sem custo de level design manual | Aprovada (rec.) |
| D-09 | Inversão com tempo de recarga curto (~0,3 s), indicador visível | Inversão livre; energia limitada | Escolha do dono do produto. Risco: sensação de controle "travado"; mitigado com recarga curta e anel visível | Aprovada (contra rec.) |
| D-10 | Corrida automática; o jogador só inverte | Movimento horizontal; velocidade livre | Um único controle funciona em teclado, mouse e toque | Aprovada (rec.) |
| D-11 | Obstáculos no MVP: blocos/espinhos fixos e barreiras com passagem | 3 ou 4 tipos no MVP | Reduz balanceamento no MVP | Aprovada (rec.) |
| D-12 | Obstáculos móveis e zonas perigosas na versão 1.0 | Tudo no MVP | Escopo | Aprovada (rec.) |
| D-13 | Geração por padrões pré-desenhados, sorteados e combinados | Aleatório total; sequência fixa | Garante que tudo é jogável e permite controlar a dificuldade | Aprovada (rec.) |
| D-14 | MVP com moedas e escudo; ímã e multiplicador na 1.0 | Só moedas; tudo no MVP | Escopo | Aprovada (rec.) |
| D-15 | Pontuação: distância + moedas + combo | Só distância; distância + moedas | Escolha do dono do produto; combo recompensa habilidade | Aprovada |
| D-16 | Combo cresce com quase-colisões e moedas em sequência | Inversões perfeitas; só moedas | Fácil de entender e recompensa o risco | Aprovada (rec.) |
| D-17 | Dificuldade em estágios de 20-30 s (velocidade + padrões) | Contínua; adaptativa | Mudança perceptível e mantém o ritmo | Aprovada (rec.) |
| D-18 | Sistema de 3 vidas | Colisão = fim de jogo | Escolha do dono do produto. Risco: partidas podem passar de 3 min para jogadores bons; validar em testes | Aprovada (contra rec.) |
| D-19 | Escudo protege de 1 colisão sem perder vida | Escudo restaura vida; remover escudo | Escolha do dono do produto. Risco: sobreposição com as vidas; avaliar em testes | Aprovada (contra rec.) |
| D-20 | Hitbox generosa e ~1,5 s de invulnerabilidade após o dano | Hitbox exata; sem invulnerabilidade | Sensação de justiça e evita perder várias vidas em sequência | Aprovada (rec.) |
| D-21 | Extra: fases de bioma na versão 1.0 | Desafio diário; fase bônus | Variedade visual sem mudar regras | Aprovada |

## Etapa 3 — Personagem e identidade visual

| # | Decisão | Alternativas consideradas | Justificativa | Status |
|---|---|---|---|---|
| D-22 | Personagem: esfera brilhante com rastro de luz | Esfera com olhos; forma que se transforma | Legível em qualquer tela e simples de animar | Aprovada (rec.) |
| D-23 | Estilo: neon vetorial com glow | Synthwave retrô; pixel art | Gerado em grande parte por código; sem problema de licença de assets | Aprovada (rec.) |
| D-24 | Paleta: ciano (jogador, lado de baixo) e magenta (perigo, lado de cima) sobre azul-noite (#0B0B1E) | Verde-ácido/roxo; laranja/azul | Contraste forte e leitura clara | Aprovada (rec.) |
| D-25 | Obstáculos magenta em destaque; cidade neon em parallax ao fundo, mais escura | Fundo abstrato; circuito | O fundo não compete com o gameplay | Aprovada (rec.) |
| D-26 | Efeito de inversão em camadas (rotação, pulso, rastro; tremor e glitch mais fortes em momentos especiais), com modo "efeitos reduzidos" | Todos os efeitos sempre; só 2 efeitos | Impacto sem cansar a vista; acessibilidade a movimento e luz | Aprovada (rec.) |
| D-27 | Partículas no MVP: moedas, explosão de dano, poeira de movimento, animação do combo | Subconjuntos | Baixo custo e alto retorno em sensação de jogo | Aprovada |
| D-28 | Tipografia: fonte futurista (títulos/números) e fonte limpa (textos), ambas de licença livre | Fonte pixel; fonte do sistema | Identidade visual com licença segura | Aprovada (rec.) |
| D-29 | Transições: fades de 200-300 ms com glow | Transições elaboradas; cortes secos | Reinício sempre rápido | Aprovada (rec.) |

## Etapa 4 — Telas e experiência do usuário

| # | Decisão | Alternativas consideradas | Justificativa | Status |
|---|---|---|---|---|
| D-30 | Telas do MVP: menu, gameplay, pause, game over (com resultados) e recordes | Incluir configurações e splash | Núcleo mínimo para um jogo completo | Aprovada |
| D-31 | Painel rápido (volume, mudo, efeitos reduzidos) no menu e no pause; tela de Configurações completa na 1.0 | Tela completa no MVP; sem controles | Cumpre a acessibilidade com custo baixo | Aprovada (rec.) |
| D-32 | Menu enxuto: logo, Jogar, Recordes, ícone de som, esfera animada, melhor recorde | Menu com muitas opções; sem menu | Poucos elementos e botão principal em destaque | Aprovada (rec.) |
| D-33 | HUD: pontuação e combo, vidas e escudo, anel de recarga na esfera | Contador de moedas no HUD | Tela limpa; moedas aparecem no game over | Aprovada |
| D-34 | Pause: botão discreto, P/Esc no desktop, pausa automática ao perder o foco | Só teclado; só automático | Garante pause no celular | Aprovada (rec.) |
| D-35 | Game over: pontuação, recorde e destaque de novo recorde, estatísticas da partida, botão Jogar de novo | Compartilhar pontuação | Compartilhar fica para versões futuras | Aprovada |
| D-36 | Mobile: paisagem como padrão, ajuste automático, toque em qualquer ponto, aviso em retrato | Suportar retrato; foco em desktop | Balanceamento previsível | Aprovada (rec.) |

## Etapa 5 — Progressão e retenção

| # | Decisão | Alternativas consideradas | Justificativa | Status |
|---|---|---|---|---|
| D-37 | Moedas valem pontos e vão para uma carteira permanente (gasta na 1.0) | Só pontos; upgrades de gameplay | Progressão entre partidas sem desequilibrar o jogo | Aprovada (rec.) |
| D-38 | Estatísticas salvas no MVP: recorde, total de moedas, partidas jogadas | Estatísticas completas | Mínimo que sustenta ranking e carteira; formato versionado | Aprovada (rec.) |
| D-39 | Versão 1.0: skins (esfera e rastro) e conquistas (~10) | Desafio e missões diárias | Missões e desafio diários ficam para futuras versões | Aprovada |
| D-40 | Skins compradas com moedas; algumas especiais por conquistas | Só moedas; só conquistas | Liga os dois sistemas | Aprovada (rec.) |

## Etapa 6 — Áudio e efeitos

| # | Decisão | Alternativas consideradas | Justificativa | Status |
|---|---|---|---|---|
| D-41 | Trilha eletrônica em loop, licença livre; tema mais calmo no menu | Trilha adaptativa; sem música | Atmosfera neon com escopo controlado | Aprovada (rec.) |
| D-42 | Efeitos do MVP: inversão, moeda, colisão, combo, novo recorde, game over | Incluir escudo e cliques de UI | Escudo e UI ficam sem som no MVP | Aprovada |
| D-43 | Efeitos sintetizados por código (Web Audio); só a música é arquivo | Bancos CC0; sons originais | Elimina risco de licença nos efeitos e deixa o jogo leve | Aprovada (rec.) |
| D-44 | Volume de música e de efeitos separados, mais mudo geral, salvos no navegador | Volume único; só mudo | Flexibilidade com custo baixo | Aprovada (rec.) |

## Etapa 7 — Tecnologia e arquitetura

| # | Decisão | Alternativas consideradas | Justificativa | Status |
|---|---|---|---|---|
| D-45 | TypeScript, Vite, Phaser 3 (gameplay e HUD) e React (menu, recordes, painel) | Só Phaser; React + Canvas puro | Cada ferramenta no que faz melhor | Aprovada (rec.) |
| D-46 | Manter Tailwind CSS para as telas em React | CSS simples; UI no Phaser | Agilidade e consistência; tokens do tema | Aprovada (rec.) |
| D-47 | Estado da partida no Phaser; store leve (ex.: Zustand) para a UI; LocalStorage versionado atrás de uma interface de repositório | Redux; Context + LocalStorage direto | Tamanho do estado não justifica mais; pronto para trocar por backend | Aprovada (rec.) |
| D-48 | Controles: teclado, mouse e toque; gamepad em versões futuras | Incluir gamepad | Escopo | Aprovada (rec.) |
| D-49 | Testes: Vitest na lógica pura, Playwright nos fluxos essenciais, jogabilidade validada à mão | Só unitários; só manuais | Boa cobertura para portfólio | Aprovada (rec.) |
| D-50 | Meta: 60 FPS em celulares de nível médio; navegadores atuais (incl. iOS Safari); pooling, limite de partículas, passo de física fixo, build < ~2 MB | Só desktop; sem meta | Requisito de funcionar em desktop e mobile | Aprovada (rec.) |
| D-51 | Sem backend no MVP; hospedagem estática gratuita com deploy automático | Backend simples no MVP | Coerente com ranking local | Aprovada (rec.) |

## Etapa 8 — Escopo

| # | Decisão | Status |
|---|---|---|
| D-52 | Classificação MVP / Versão 1.0 / Futuras versões conforme `ROADMAP.md` | Aprovada |

## Pontos de atenção (decisões contra a recomendação)

- **D-09 (recarga na inversão):** validar a sensação de controle. Parâmetro ajustável (0,3 s inicial).
- **D-18 (3 vidas):** pode alongar partidas além de 3 min e reduzir a tensão. Medir duração média em testes.
- **D-19 (escudo + vidas):** funções parecidas. Reavaliar o valor do escudo após os primeiros testes.

## Detalhes propostos pela direção (não discutidos na entrevista; sujeitos a ajuste)

- Buffer de entrada de ~0,1 s durante a recarga da inversão (GDD 4.1, US-02).
- Hitbox com ~80% do raio visual (GDD 4.3).
- Contagem 3-2-1 ao retomar do pause (UI 4.3).
- Ranking local com 10 posições (UI 4.5).
- Ativar "efeitos reduzidos" por padrão quando o sistema indicar `prefers-reduced-motion` (UI 10).
- Mínimo de 20 trechos na biblioteca do MVP (GDD 4.5).
- Tela de carregamento simples no MVP (sem splash screen), conduzida pela `BootScene`.

## Itens em aberto (a definir durante a implementação)

- Valores numéricos de pontuação e combo (pontos por metro, bônus por moeda, limiar de quase-colisão, teto e expiração do multiplicador).
- Escolha final das fontes, da trilha musical e do nome/logo visual.
- Velocidades por estágio e curva final de dificuldade.
- Quantidade e preços das skins da versão 1.0.

## Observações de balanceamento (M2)

- **Faixa do meio livre:** com blocos e espinhos de 50-90 px de altura, a faixa central da tela fica livre durante a travessia. Dois obstáculos de lados opostos, mesmo muito próximos, ainda são passáveis, porque o jogador atravessa pelo meio. Só as barreiras (que ocupam quase toda a altura) forçam de fato o lado e o tempo da inversão. Avaliar no M9: blocos mais altos, mais barreiras nos estágios avançados ou obstáculos que ocupem o meio.
- **Validador de trechos:** simula a mesma física do jogo e confirma que existe ao menos um caminho. O `quick-zigzag` é impossível acima do estágio 5, e por isso tem `maxStage` 5.

## Notas do M6 (identidade visual e efeitos)
- D-53: Fontes self-hosted via `@fontsource/orbitron` (display) e `@fontsource/inter` (corpo), ambas OFL; o jogo só inicia depois de `document.fonts.load` para o canvas usar a fonte certa.
- D-54: HUD em cena própria (`HudScene`) sobre a `GameScene`, lendo `hudState()` e o evento `hud:popup`; efeitos do mundo em três camadas (fundo, mundo, brilho com blend ADD).
- D-55: Perfil de efeitos (`effectProfile`): "efeitos reduzidos" desliga inclinação, tremor, glitch e clarão e reduz partículas; queda sustentada de FPS (<45) ativa modo leve automático.

## Notas do M7 (áudio)
- D-56: Áudio 100% sintetizado por Web Audio (sem arquivos e sem licenças a registrar). Receitas dos efeitos em `src/services/audio/sfx.ts` e música procedural em `src/core/music.ts` (dados puros, testáveis); o `AudioEngine` só toca esses dados.
- D-57: O `AudioContext` só é criado no primeiro gesto do usuário (política de autoplay). Efeitos chegam por eventos do barramento (`audio:sfx`, `audio:stage`), então o jogo não depende do áudio.
- D-58: Música: 128 BPM, Am-F-C-G; bumbo e baixo sempre, chimbal no estágio 2, arpejo no estágio 3. Toca só durante a partida, abaixa no pause e para no game over/menu. Volumes de música e efeitos são separados, e "mudo" zera o master.
- D-59: O evento `record:new` passou a ser emitido ao bater o recorde (toca a fanfarra do recorde).

## Notas do M9 (balanceamento) — medições com bot
Método: bot que planeja com a física real (busca de até 2 inversões num horizonte curto), com reação atrasada e falhas de atenção; 3 perfis, 100 partidas por perfil, limite de 300 s, 3 vidas. É uma referência, **não substitui jogadores reais**.
- Mediana de duração: casual ≈ 108 s (p10 67 s, p90 228 s); médio ≈ 80 s (p10 22 s, p90 154 s). Dentro da meta de 1 a 3 minutos.
- Com 2 vidas: casual ≈ 80 s, médio ≈ 64 s. Mantido 3 vidas (D-anterior), pois 2 já encosta no limite inferior da meta.
- Bot perfeito (expert) sobrevive aos 300 s em ~99% das partidas: o jogo é resolvível e o teto de dificuldade (estágio 8, velocidade ×1,8) não encurrala; aceitável para um endless casual, a reavaliar na V1 (obstáculos móveis).
- Quase-colisões: ~1 a cada 9–12 s nos perfis que as buscam; frequência adequada, `NEAR_MISS_PX` mantido em 28.
- Escudo: 6 a 17 coletas por 100–300 s; excesso de escudo para jogadores ruins. Mantido para o MVP (jogo casual); reavaliar após feedback de jogadores.
- Combo ×5 é atingido por todos os perfis (muitas moedas na faixa segura); `COMBO_STEP` 6 não mudou o resultado. Não alterado; candidato a ajuste na V7 (ex.: menos moedas ou timeout menor).
- Constantes de balanceamento não foram alteradas no M9.
