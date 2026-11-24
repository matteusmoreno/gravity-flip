# TECHNICAL SPECIFICATION — Gravity Flip

Versão 1.0 do documento · 24/11/2026 · Decisões referenciadas em `DECISIONS.md` (D-xx).

## 1. Stack (D-45, D-46, D-47, D-49)

| Camada | Tecnologia | Papel |
|---|---|---|
| Linguagem | TypeScript (strict) | Código tipado em todo o projeto |
| Build | Vite | Dev server, build e otimização |
| Motor de jogo | Phaser 3 | Cenas, física arcade, partículas, entrada, câmera, HUD |
| Interface | React | Menu, recordes, painel rápido, pause e game over |
| Estilos | Tailwind CSS | Estilo das telas em React; tokens do tema |
| Estado de UI | Zustand (store leve) | Volume, mudo, efeitos reduzidos, recordes, carteira |
| Persistência | LocalStorage versionado | Atrás de uma interface de repositório |
| Áudio | Web Audio API | Efeitos sintetizados; música como arquivo livre |
| Testes | Vitest e Playwright | Lógica pura e fluxos essenciais |
| Qualidade | ESLint, Prettier, `tsc --noEmit` | Padronização e checagem de tipos |

Nenhuma tecnologia adicional é introduzida. Não há backend no MVP (D-51).

## 2. Princípios de arquitetura

1. **Lógica pura separada do Phaser:** pontuação, combo, dificuldade, geração de trechos e persistência vivem em módulos sem dependência do Phaser, testáveis com Vitest.
2. **Phaser cuida do gameplay e do HUD** (canvas); **React cuida das telas** por cima do canvas.
3. **Comunicação por eventos tipados** entre jogo e interface; nenhum lado importa o outro diretamente.
4. **Passo de física fixo** (ex.: 60 Hz) para o jogo se comportar igual em qualquer taxa de quadros.
5. **Parâmetros de balanceamento centralizados** em arquivos de configuração (recarga, velocidades, pontos), para ajuste sem mexer na lógica.
6. **Persistência atrás de interface**, para trocar LocalStorage por backend sem refatorar.

## 3. Estrutura de pastas proposta

```
gravity-flip/
├─ public/
│  └─ audio/                 # música (licença livre) e créditos
├─ src/
│  ├─ main.tsx               # entrada: monta React e o Phaser
│  ├─ app/                   # shell React
│  │  ├─ App.tsx
│  │  ├─ screens/            # MainMenu, Pause, GameOver, Records, QuickSettings
│  │  ├─ components/         # Button, Panel, Slider, Toggle, ScoreCounter
│  │  └─ store/              # stores Zustand (settings, records, wallet)
│  ├─ game/                  # Phaser
│  │  ├─ config.ts           # configuração do Phaser
│  │  ├─ scenes/             # BootScene, MenuBackdropScene, GameScene, HudScene
│  │  ├─ entities/           # Player, Obstacle, Coin, Shield
│  │  ├─ systems/            # GravitySystem, SpawnSystem, CollisionSystem, ComboSystem, StageSystem, EffectsSystem
│  │  ├─ effects/            # inversão, partículas, parallax, tremor
│  │  └─ audio/              # AudioManager, sintetizador de efeitos, música
│  ├─ core/                  # lógica pura, sem Phaser
│  │  ├─ scoring.ts          # pontuação e combo
│  │  ├─ difficulty.ts       # estágios e curva
│  │  ├─ patterns/           # biblioteca de trechos e validador
│  │  ├─ generator.ts        # sorteio e encadeamento de trechos
│  │  └─ constants.ts        # parâmetros de balanceamento
│  ├─ services/
│  │  ├─ events.ts           # barramento de eventos tipados
│  │  └─ storage/            # StorageRepository, LocalStorageRepository, migrações
│  ├─ styles/                # Tailwind e tokens do tema
│  └─ types/
├─ tests/
│  ├─ unit/                  # Vitest
│  └─ e2e/                   # Playwright
├─ docs/                     # decisões técnicas adicionais (ADRs)
└─ (documentos de projeto na raiz)
```

## 4. Cenas do Phaser

| Cena | Responsabilidade |
|---|---|
| `BootScene` | Carrega recursos, inicializa o áudio após a primeira interação, vai ao menu |
| `MenuBackdropScene` | Fundo animado do menu (esfera e cidade em movimento lento) |
| `GameScene` | Loop da partida: jogador, obstáculos, moedas, colisões, estágios |
| `HudScene` | Pontuação, combo, vidas, escudo e anel de recarga (sobreposta à `GameScene`) |

Pause: a `GameScene` é pausada e o React exibe o painel de pause. Game over: a `GameScene` emite o resultado e o React exibe a tela.

## 5. Entidades

| Entidade | Dados principais |
|---|---|
| `Player` | Lado atual (chão/teto), velocidade vertical, vidas, escudo, invulnerável, recarga restante |
| `Obstacle` | Tipo (bloco, espinho, barreira), posição, lado, hitbox |
| `Coin` | Posição, valor, coletada |
| `Shield` | Item coletável e estado ativo no jogador |
| `Pattern` | Trecho de obstáculos e moedas, largura, dificuldade, lados de entrada e saída |

Objetos de jogo (obstáculos, moedas, partículas) usam **pooling** para evitar coleta de lixo durante a partida (D-50).

## 6. Sistemas

- **GravitySystem:** trata a inversão, a recarga de 0,3 s, o buffer de entrada de ~0,1 s e a aceleração até a superfície.
- **SpawnSystem:** pede trechos ao gerador e os posiciona à frente da câmera; recicla o que saiu da tela.
- **CollisionSystem:** hitbox reduzida (~80%), dano, invulnerabilidade de ~1,5 s e absorção pelo escudo.
- **ComboSystem:** quase-colisões (distância mínima a um obstáculo sem colidir) e moedas em sequência; expiração do combo.
- **StageSystem:** avança o estágio a cada ~20-30 s; ajusta velocidade e peso dos trechos.
- **EffectsSystem:** rotação, pulso, rastro, tremor e glitch; respeita o modo "efeitos reduzidos".

## 7. Comunicação jogo e interface

Barramento de eventos tipado (sem dependência entre camadas):

| Evento | Direção | Dados |
|---|---|---|
| `game:start` | UI para jogo | — |
| `game:pause` / `game:resume` | UI para jogo | — |
| `game:over` | Jogo para UI | pontuação, moedas, maior combo, quase-colisões, tempo |
| `settings:changed` | UI para jogo | volumes, mudo, efeitos reduzidos |
| `record:new` | Jogo para UI | pontuação |

## 8. Persistência (D-47)

- Interface `StorageRepository` (`load`, `save`, `migrate`).
- Implementação `LocalStorageRepository` com uma chave por área e campo `version`.
- Dados do MVP: recorde, top 10 do ranking local, total de moedas, partidas jogadas, configurações de áudio e de efeitos.
- Migrações: ao carregar uma versão antiga, aplicar migrações em sequência; em caso de dado corrompido, usar valores padrão sem travar o jogo.
- Trocar para um backend no futuro significa criar outra implementação da mesma interface.

## 9. Entrada e responsividade (D-36, D-48)

- Entrada abstraída em uma única ação `flip`, disparada por teclado, mouse ou toque.
- Eventos de toque com `preventDefault` e CSS `touch-action: none` para impedir zoom e rolagem.
- Escala do Phaser em modo `FIT`, centralizada, com resolução lógica fixa (ex.: 1280x720) e ajuste por densidade de pixels limitado.
- Orientação: paisagem; em retrato, o React mostra um aviso pedindo para girar o aparelho.
- Pausa automática ao perder o foco da aba (`visibilitychange`).

## 10. Áudio (D-43, D-44)

- `AudioManager` com dois canais de ganho (música e efeitos) e mudo geral.
- Efeitos gerados com osciladores e envelopes (Web Audio).
- Música em arquivo de licença livre; a licença e a fonte de cada faixa ficam registradas em `public/audio/CREDITS.md`.
- O contexto de áudio só é retomado após o primeiro gesto do usuário.

## 11. Desempenho (D-50)

- Meta: 60 FPS em celulares de nível médio.
- Pooling de obstáculos, moedas e partículas.
- Limite de partículas ativas e redução automática se o FPS cair.
- Passo de física fixo.
- Build abaixo de ~2 MB; carregamento sob demanda de áreas fora do jogo.
- Efeitos de glow preferencialmente por sprites pré-renderizados ou blend aditivo, evitando filtros caros por quadro.

## 12. Compatibilidade

Chrome, Edge, Firefox e Safari recentes (desktop e mobile, incluindo iOS Safari). O iOS Safari será testado desde as primeiras entregas por causa de áudio e tela cheia.

## 13. Estratégia de testes (D-49)

| Nível | Ferramenta | O que cobre |
|---|---|---|
| Unitário | Vitest | Pontuação, combo, estágios, gerador, validador de trechos, persistência e migrações |
| Validação de dados | Vitest | Todo trecho da biblioteca é jogável com a recarga e a velocidade do estágio |
| Ponta a ponta | Playwright | Abrir o jogo, iniciar, jogar, morrer, ver o game over, recorde salvo, pause e painel de som |
| Manual | Roteiro de QA | Sensação de controle, balanceamento, duração das partidas, desempenho em dispositivos reais, iOS Safari |

Critério mínimo de qualidade por entrega: `tsc` sem erros, lint limpo, testes unitários passando e o fluxo e2e principal passando.

## 14. Licenças e assets

- Gráficos gerados por código ou criados no projeto; nenhuma arte de terceiros sem licença registrada.
- Fontes com licença livre (OFL), registradas na documentação.
- Música com licença livre (CC0 ou equivalente), com fonte e termos em `CREDITS.md`.

## 15. Implantação

- Site estático (Vercel, Netlify ou GitHub Pages) com deploy automático a cada alteração na branch principal (D-51).
- Sem variáveis de ambiente sensíveis no MVP.

## 16. Riscos técnicos

| Risco | Mitigação |
|---|---|
| Desempenho com efeitos de glow em celulares | Sprites pré-renderizados, limite de partículas, redução automática |
| Divergência entre React e Phaser | Eventos tipados e único ponto de integração |
| Áudio bloqueado no iOS | Retomar o contexto no primeiro gesto; teste cedo no iOS |
| Física dependente de FPS | Passo fixo e lógica de movimento desacoplada da renderização |
| Dados salvos corrompidos ou antigos | Versionamento, migrações e fallback para padrão |
