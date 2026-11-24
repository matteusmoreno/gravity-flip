# GAME DESIGN DOCUMENT — Gravity Flip

Versão 1.0 do documento · 24/11/2026 · Decisões referenciadas em `DECISIONS.md` (D-xx).

## 1. Conceito

Gravity Flip é um endless runner 2D de visão lateral para navegadores. O jogador controla uma esfera luminosa que corre automaticamente por uma cidade neon, e o único controle é **inverter a gravidade**: a esfera alterna entre correr pelo chão e correr pelo teto. O objetivo é desviar de obstáculos, coletar moedas, manter um combo e bater o próprio recorde.

**Pilares**
1. **Um controle, muita profundidade:** inverter no momento certo é toda a habilidade.
2. **O mundo reage a você:** cada inversão vira o cenário, muda a cor e sacode a câmera.
3. **Justo e rápido de recomeçar:** colisões generosas e reinício imediato.
4. **Visual e som coerentes:** neon, energia e feedback em tudo.

## 2. Público e posicionamento

- Público: jogadores casuais de todas as idades (D-02).
- Tom: energético e neon-arcade (D-01).
- Duração da partida: 1 a 3 minutos (D-03).
- Gancho de retorno: bater o recorde pessoal e subir no ranking (D-04).
- Referências: Geometry Dash (energia e reinício instantâneo), VVVVVV (inversão de gravidade) e Super Hexagon (alto contraste e dificuldade crescente) (D-06).
- Diferencial: o mundo reage à inversão (D-07).

## 3. Estrutura de jogo

- Endless runner, visão lateral 2D (D-08).
- O cenário avança sozinho; a esfera mantém posição horizontal fixa na tela.
- Um modo de jogo no MVP.

## 4. Mecânicas

### 4.1 Inversão de gravidade (D-09)
- Entrada: espaço ou seta para cima (teclado), clique (mouse) ou toque em qualquer ponto.
- Ao inverter, a esfera acelera até a superfície oposta (chão ou teto) com aceleração curta, sem ficar parada no ar por tempo longo.
- **Recarga:** ~0,3 s entre inversões. O anel ao redor da esfera mostra a recarga se enchendo. Entradas feitas durante a recarga ficam em buffer por até ~0,1 s e são executadas assim que a recarga termina, para o controle não parecer "travado".
- Valores (recarga, aceleração, buffer) são parâmetros configuráveis para ajuste em testes.

### 4.2 Movimento (D-10)
- Corrida automática com velocidade que aumenta por estágios.
- O jogador não controla mais nada além da inversão.

### 4.3 Colisões e dano (D-18, D-19, D-20)
- O jogador começa com **3 vidas**.
- A hitbox da esfera é menor que o desenho (por exemplo, ~80% do raio visual) para dar sensação de justiça.
- Ao colidir: perde 1 vida, toca a explosão de partículas, tremor leve de câmera e **~1,5 s de invulnerabilidade** com a esfera piscando.
- **Escudo:** ao coletar o item, o próximo dano é absorvido sem perder vida. Apenas 1 escudo ativo por vez; sem invulnerabilidade longa ao quebrar (apenas a janela curta do dano).
- A partida termina quando as vidas chegam a zero.

### 4.4 Obstáculos (D-11, D-12)

| Tipo | Fase | Descrição |
|---|---|---|
| Blocos e espinhos fixos | MVP | Presos ao chão ou ao teto; exigem inverter na hora certa |
| Barreiras com passagem | MVP | Paredes com abertura em cima ou embaixo; obrigam a escolher o lado |
| Obstáculos móveis (serras, lasers) | 1.0 | Movimento periódico; exigem ler o ritmo |
| Zonas perigosas | 1.0 | Trechos elétricos ocupando parte do cenário por um tempo |

### 4.5 Geração por padrões (D-13)
- Uma biblioteca de **trechos pré-desenhados** (cada um com largura, dificuldade e lado de entrada/saída).
- Cada trecho é validado como jogável com a recarga de 0,3 s e a velocidade do estágio.
- O gerador sorteia trechos compatíveis com o estágio atual e garante que a saída de um trecho conecta com a entrada do próximo.
- Meta do MVP: ao menos 20 trechos distribuídos nos estágios.

### 4.6 Itens (D-14)

| Item | Fase | Efeito |
|---|---|---|
| Moeda | MVP | +pontos; soma na carteira permanente |
| Escudo | MVP | Absorve 1 colisão |
| Ímã de moedas | 1.0 | Atrai moedas próximas por alguns segundos |
| Multiplicador | 1.0 | Dobra os pontos por alguns segundos |

Moedas aparecem em linhas e arcos, algumas em posições arriscadas, perto de obstáculos, para recompensar o risco.

### 4.7 Combo e pontuação (D-15, D-16)

**Pontuação** = distância percorrida + bônus por moeda, multiplicados pelo combo.

- Distância: pontos contínuos por metro percorrido.
- Moeda: bônus fixo por moeda.
- **Combo:** o multiplicador sobe quando o jogador faz uma **quase-colisão** (passa rente a um obstáculo) ou coleta moedas em sequência. Ele cai a zero ao levar dano, ou desce se passar tempo demais sem nenhum dos dois eventos.
- Os valores exatos (pontos por metro, bônus por moeda, limiar de quase-colisão, teto do multiplicador, tempo de expiração) serão definidos como constantes e ajustados em testes.

### 4.8 Progressão da dificuldade (D-17)
- A cada ~20-30 s, a partida avança de **estágio**.
- Cada estágio aumenta a velocidade e libera trechos mais difíceis no sorteio.
- Limite de velocidade máxima para manter o jogo legível.
- Na versão 1.0, cada estágio também muda o bioma visual (D-21).

### 4.9 Condição de fim
- Vidas = 0.
- Resultado: tela de game over com pontuação, recorde, estatísticas e botão Jogar de novo.

## 5. Progressão e retenção

| Sistema | MVP | 1.0 | Futuro |
|---|---|---|---|
| Recorde pessoal | Sim | | |
| Ranking local (top 10) | Sim | | |
| Ranking online | | | Sim |
| Carteira de moedas | Acumula | Gasta na loja | |
| Estatísticas salvas | Recorde, moedas, partidas | | Completas |
| Skins (esfera e rastro) | | Sim | |
| Conquistas (~10) | | Sim | |
| Desafio diário e missões diárias | | | Sim |

Skins são compradas com moedas; algumas skins especiais são recompensa de conquistas (D-40).

## 6. Identidade visual (resumo; detalhes em `UI_UX_SPECIFICATION.md`)

- Estilo neon vetorial com glow, fundo escuro azul-noite (D-23).
- Ciano = jogador e lado de baixo; magenta = perigo e lado de cima (D-24).
- Cidade neon em parallax ao fundo, mais escura e menos saturada que o primeiro plano (D-25).
- **Efeito de inversão** (D-26): rotação curta do cenário, pulso de cor com onda de choque e rastro esticado em toda inversão; tremor e glitch mais fortes só em momentos especiais. Modo "efeitos reduzidos" desliga rotação, glitch e tremor.
- Partículas: moedas, explosão de dano, poeira de movimento e animação do combo (D-27).

## 7. Áudio (D-41 a D-44)

- Música eletrônica em loop de licença livre; tema mais calmo no menu.
- Efeitos sintetizados via Web Audio: inversão, moeda, colisão, combo, novo recorde, game over.
- Volume de música e de efeitos separados e mudo geral.
- O áudio só inicia após a primeira interação do usuário (política dos navegadores).

## 8. Controles (D-48)

| Plataforma | Inverter | Pausar | Menus |
|---|---|---|---|
| Teclado | Espaço ou seta para cima | P ou Esc | Enter / setas |
| Mouse | Clique em qualquer ponto | Botão de pause | Clique |
| Toque | Toque em qualquer ponto | Botão de pause | Toque |

## 9. Métricas de sucesso (para validação em testes)

- Um jogador novo entende a mecânica em menos de 10 segundos.
- Duração média da partida entre 1 e 3 minutos (risco: as 3 vidas podem alongá-la).
- Tempo entre morrer e começar de novo menor que 2 segundos.
- 60 FPS em celulares de nível médio.

## 10. Riscos de design

| Risco | Mitigação |
|---|---|
| Recarga da inversão passar sensação de controle travado | Recarga curta, buffer de entrada e anel visível; parâmetros ajustáveis |
| 3 vidas alongarem demais as partidas | Medir em testes; ajustar velocidade/dificuldade dos estágios |
| Escudo redundante com as vidas | Reavaliar após testes; opção de trocar por "restaura vida" |
| Efeitos visuais cansarem ou incomodarem | Camadas, intensidade controlada e modo "efeitos reduzidos" |
| Geração por padrões gerar monotonia | Biblioteca ampla, variação de espelhamento (teto/chão) e sorteio ponderado |
