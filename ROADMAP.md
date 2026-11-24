# ROADMAP — Gravity Flip

Versão 1.0 do documento · 24/11/2026 · Complexidade: B (baixa), M (média), A (alta). IDs de histórias em `BACKLOG.md`.

## 1. Visão geral

| Fase | Objetivo |
|---|---|
| **MVP** | Uma experiência completa, divertida e publicável: jogar, morrer, recomeçar, bater recorde |
| **Versão 1.0** | Produto polido: mais conteúdo, personalização e retenção |
| **Futuras versões** | Ranking online, desafios diários e extras |

## 2. Etapas de desenvolvimento do MVP

Cada etapa termina com uma entrega funcional e testada. Ao final de cada uma serão apresentados: o que foi implementado, arquivos criados ou modificados, testes executados, problemas e próximas atividades.

| # | Etapa | Entregas | Complexidade | Depende de |
|---|---|---|---|---|
| M0 | Fundação | Projeto Vite + TypeScript + Phaser + React + Tailwind; lint, formatação, Vitest e Playwright configurados; deploy estático | B | — |
| M1 | Núcleo jogável | Cena de jogo, jogador, corrida automática, inversão de gravidade com recarga e buffer, entrada por teclado, mouse e toque, passo de física fixo | M | M0 |
| M2 | Obstáculos e geração | Blocos, espinhos e barreiras; biblioteca de trechos, validador e gerador; pooling | A | M1 |
| M3 | Dano e regras | Hitbox reduzida, 3 vidas, invulnerabilidade, escudo, fim de partida | M | M2 |
| M4 | Pontuação e dificuldade | Moedas, pontuação, combo (quase-colisões e sequência), estágios de dificuldade | M | M3 |
| M5 | Interface e persistência | HUD no Phaser; menu, pause, game over e recordes em React; painel rápido; LocalStorage versionado, ranking local e carteira | M | M4 |
| M6 | Identidade visual e efeitos | Estética neon, parallax, efeito de inversão em camadas, partículas, transições, modo efeitos reduzidos | A | M1 (em paralelo a M3-M5) |
| M7 | Áudio | Sintetizador de efeitos, música, volumes separados e mudo | M | M1 |
| M8 | Mobile e desempenho | Escala e orientação, toque, pausa automática, otimização, testes em dispositivos e iOS Safari | M | M5, M6, M7 |
| M9 | Balanceamento e QA | Ajuste de recarga, vidas, escudo, combo e curva de dificuldade; testes e2e; correção de bugs; documentação | M | M8 |

Caminho crítico: **M0 → M1 → M2 → M3 → M4 → M5 → M8 → M9**. M6 e M7 podem andar em paralelo depois de M1.

### Critérios de conclusão do MVP

- Todas as histórias de prioridade **Must** do backlog concluídas.
- Partida completa jogável do menu ao game over e ao reinício, em desktop e celular.
- 60 FPS em celular de nível médio e sem erros no console no fluxo principal.
- Duração média da partida entre 1 e 3 minutos em testes (ou ajuste documentado).
- `tsc`, lint, testes unitários e fluxo e2e principal passando.
- Todos os assets e fontes com licença registrada.
- Publicado em hospedagem estática.

## 3. Versão 1.0

| # | Etapa | Entregas | Complexidade | Depende de |
|---|---|---|---|---|
| V1 | Novos obstáculos | Obstáculos móveis e zonas perigosas; novos trechos e validação | A | M2 |
| V2 | Power-ups | Ímã de moedas e multiplicador, com indicadores e sons | M | M4 |
| V3 | Biomas | Mudança de visual a cada estágio | M | M4, M6 |
| V4 | Loja e skins | Tela de loja, skins de esfera e rastro, compra com moedas, seleção | M | M5 (carteira) |
| V5 | Conquistas | ~10 conquistas, tela, recompensas (inclui skins especiais) | M | M5, V4 |
| V6 | Configurações completas e splash | Tela de Configurações, créditos e licenças, splash | B | M5 |
| V7 | Polimento | Sons de escudo e UI, ajustes de balanceamento, acessibilidade | M | todas |

Critérios de conclusão da 1.0: todas as histórias **Should** concluídas, conquistas e skins funcionando com migração de dados sem perda, e revisão de acessibilidade feita.

## 4. Futuras versões

| Item | Complexidade | Dependências |
|---|---|---|
| Ranking online | A | Backend, banco de dados e anti-trapaça |
| Desafio diário | A | Semente determinística; ranking online para comparação global |
| Missões diárias | M | Persistência e relógio confiável |
| Fase bônus de moedas | M | Geração por padrões |
| Compartilhar pontuação | B | — |
| Suporte a gamepad | B | Camada de entrada abstrata |
| Estatísticas completas | B | Tela de estatísticas |

## 5. Riscos e dependências principais

| Risco | Etapa | Resposta |
|---|---|---|
| Geração por padrões injusta ou repetitiva | M2 | Validador automático e biblioteca ampla |
| Sensação de controle com recarga | M1, M9 | Parâmetros ajustáveis e testes de jogo cedo |
| Partidas longas demais com 3 vidas | M9 | Medir e ajustar a dificuldade |
| Desempenho em celular | M6, M8 | Sprites pré-renderizados, limite de partículas, teste em dispositivo real |
| iOS Safari (áudio e tela) | M7, M8 | Testar desde M1 |
| Escopo do MVP crescer | todas | Mudanças passam pelo backlog e por `DECISIONS.md` |

## 6. Manutenção do roadmap

O roadmap será atualizado ao fim de cada etapa (status, desvios e novas dependências). Mudanças de escopo exigem aprovação e registro em `DECISIONS.md`.
