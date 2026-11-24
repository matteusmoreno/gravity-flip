# UI/UX SPECIFICATION — Gravity Flip

Versão 1.0 do documento · 24/11/2026 · Decisões referenciadas em `DECISIONS.md` (D-xx).

## 1. Identidade visual

- **Estilo:** neon vetorial com glow sobre fundo escuro (D-23). A interface e o gameplay usam a mesma linguagem: contornos luminosos, formas geométricas limpas e brilho.
- **Sensação:** energético, rápido, polido. Nada de aparência genérica: cada elemento tem brilho, ritmo e resposta ao toque.
- **Regra de ouro:** o fundo nunca compete com o que importa. Primeiro plano em alto contraste, fundo escuro e menos saturado.

## 2. Paleta de cores (D-24)

| Papel | Cor | Hex (inicial) |
|---|---|---|
| Fundo | Azul-noite | `#0B0B1E` |
| Fundo, camadas distantes | Azul-noite mais claro | `#14143A` |
| Jogador, lado de baixo, ações positivas | Ciano | `#19F0FF` |
| Perigo, lado de cima, obstáculos | Magenta | `#FF2E9A` |
| Moedas e destaques | Amarelo-neon | `#FFE94D` |
| Escudo | Azul-elétrico | `#4D7CFF` |
| Texto principal | Branco-gelo | `#EAF6FF` |
| Texto secundário | Cinza-azulado | `#8FA3C7` |

Os valores são pontos de partida e serão afinados com testes de contraste. Meta de acessibilidade: texto com contraste mínimo 4,5:1; elementos importantes distinguíveis por **forma e brilho**, não só por cor (para daltonismo parcial).

Os tokens ficam no tema do Tailwind e em um módulo de constantes usado pelo Phaser, para ter uma única fonte de verdade.

## 3. Tipografia (D-28)

- **Títulos e números:** fonte futurista de licença livre (candidatas: Orbitron, Audiowide).
- **Textos e rótulos:** fonte limpa de licença livre (candidatas: Inter, Rajdhani).
- Escala: título 48-64 px; subtítulo 24-32 px; corpo 16-20 px; HUD numérico 32-40 px. Tamanhos fluidos conforme a tela.
- Números de pontuação com fonte tabular para não "pularem".
- Escolha final de fontes validada na primeira entrega de UI.

## 4. Telas do MVP

### 4.1 Menu principal (D-32)
- Fundo: esfera e cidade neon em movimento lento (`MenuBackdropScene`).
- Elementos: logo, botão **Jogar** em destaque, botão **Recordes**, ícone de som (abre o painel rápido), melhor recorde.
- Iniciar: clique/toque no botão, Enter ou espaço.
- Música do menu: tema mais calmo, iniciado no primeiro gesto.

### 4.2 Gameplay e HUD (D-33)
- Topo: pontuação (grande) e multiplicador de combo, sem cobrir a área de jogo.
- Vidas: 3 ícones; indicador visível quando o escudo está ativo.
- Anel de recarga ao redor da esfera.
- Botão de pause discreto em um canto, longe da área de toque principal (D-34).
- Moedas da partida **não** aparecem no HUD; ficam no game over.
- Animação do combo: o multiplicador pulsa e muda de brilho conforme cresce.

### 4.3 Pause (D-34)
- Abre por botão, P/Esc ou pausa automática ao perder o foco.
- Ações: Continuar, Reiniciar, Sair para o menu, painel rápido (volume, mudo, efeitos reduzidos).
- Ao continuar, contagem curta (3-2-1) antes de retomar, para o jogador se reposicionar.

### 4.4 Game over (D-35)
- Pontuação contando de baixo para cima; destaque especial e som de fanfarra se for novo recorde.
- Estatísticas: tempo, moedas, maior combo, quase-colisões.
- Botão **Jogar de novo** em destaque (um toque ou espaço reinicia na hora); botão secundário **Menu**.
- Meta: reinício em menos de 2 segundos do fim da partida.

### 4.5 Recordes (D-05)
- Top 10 do ranking local: posição, pontuação e data.
- Destaque da última pontuação, se estiver na lista.
- Estado vazio amigável: convite para a primeira partida.
- Botão Voltar.

### 4.6 Painel rápido de configurações (D-31)
- Acessível pelo menu e pelo pause.
- Controles: volume da música, volume dos efeitos, mudo geral, modo **efeitos reduzidos**.
- Alterações aplicadas e salvas imediatamente.

## 5. Telas da versão 1.0

| Tela | Conteúdo |
|---|---|
| Splash | Logo curto durante o carregamento |
| Configurações completas | Painel rápido ampliado, controles, créditos e licenças |
| Loja e personalização | Skins da esfera e do rastro, com preço em moedas e bloqueio por conquista |
| Conquistas | Lista de ~10 metas, progresso e recompensas |

## 6. Fluxo de navegação

```
Splash (1.0) → Menu principal ──► Jogar ──► Gameplay ◄──► Pause
                    │                          │             │
                    ├─► Recordes               ▼             ├─► Reiniciar
                    ├─► Painel rápido      Game over         └─► Menu
                    └─► (1.0) Loja / Conquistas / Configurações
                                               │
                                  Jogar de novo ─► Gameplay
                                  Menu ─► Menu principal
```

## 7. Efeitos, animação e feedback (D-26, D-27, D-29)

| Momento | Feedback |
|---|---|
| Inversão | Rotação curta do cenário, pulso de cor com onda de choque, rastro esticado, som de inversão |
| Pouso (chão/teto) | Tremor leve e poeira de movimento |
| Moeda | Faíscas, "pop" e som cristalino |
| Dano | Explosão de partículas, tremor, piscar da esfera e som de impacto |
| Escudo | Brilho azul ao redor da esfera; quebra com estilhaços |
| Combo | Pulso do multiplicador e tom que sobe |
| Novo recorde | Destaque visual na tela de game over e fanfarra |
| Transições de tela | Fade de 200-300 ms com glow |

- Glitch e tremor mais fortes só em momentos especiais (por exemplo, mudança de estágio).
- **Efeitos reduzidos:** desliga rotação do cenário, glitch e tremor; mantém pulso discreto e rastro.
- Sem flashes de tela cheia em alta frequência.

## 8. Componentes de interface

| Componente | Observações |
|---|---|
| Botão primário e secundário | Contorno neon, estado de foco visível, resposta ao toque |
| Painel/modal | Fundo translúcido escuro com borda luminosa |
| Slider de volume | Operável por mouse, toque e teclado |
| Toggle | Estados claros e rótulo textual |
| Contador de pontuação | Fonte tabular e animação de contagem |
| Ícones de vida e escudo | Formas distintas e não só cores diferentes |
| Aviso de orientação | Pede para girar o aparelho em retrato |

## 9. Responsividade (D-36)

- Resolução lógica fixa (ex.: 1280x720) com ajuste proporcional à tela (modo FIT), sem distorção.
- Paisagem como padrão; em retrato, aviso para girar.
- Telas em React usam unidades fluidas; áreas de toque mínimas de 44x44 px.
- Respeitar áreas seguras (notch e barras do sistema) em celulares.
- Toque em qualquer ponto inverte a gravidade; botões de interface ficam fora dessa área ou impedem a propagação.

## 10. Acessibilidade

- Modo efeitos reduzidos e mudo geral.
- Contraste mínimo 4,5:1 no texto; elementos de jogo distinguíveis por forma e brilho.
- Navegação por teclado nas telas em React, com foco visível.
- Rótulos acessíveis nos controles e respeito a `prefers-reduced-motion` para ativar efeitos reduzidos por padrão.
- Sem dependência exclusiva de som para informação importante.

## 11. Critérios de qualidade da UI

- Menu até a primeira partida em até 2 toques/cliques.
- Todas as telas utilizáveis em celulares de 360 px de largura (paisagem) e em desktops.
- Sem sobreposição do HUD com a área crítica de jogo.
- Identidade visual consistente entre telas em React e elementos do Phaser.
