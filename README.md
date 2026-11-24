# Gravity Flip

Endless runner 2D neon para navegadores. Documentação do projeto na raiz: `GAME_DESIGN_DOCUMENT.md`, `TECHNICAL_SPECIFICATION.md`, `UI_UX_SPECIFICATION.md`, `ROADMAP.md`, `BACKLOG.md` e `DECISIONS.md`.

## Comandos

```
npm install
npm run dev        # servidor de desenvolvimento
npm run typecheck  # checagem de tipos
npm run lint
npm test           # testes unitários (Vitest)
npm run test:e2e   # testes ponta a ponta (Playwright)
npm run build
```

## Status

M0 a M4 concluídos; M5 (interface e persistência) em validação.

Parâmetros de teste na URL: `?seed=123` reproduz uma partida, `?lives=1` começa com 1 vida e `?debug=1` mostra estágio e velocidade.
- M6: identidade visual e efeitos implementados (rode `npm install` para as fontes).
- M7: áudio sintetizado (efeitos + música procedural) implementado.
- M9: balanceamento medido com bot (ver DECISIONS.md); nenhuma constante alterada.
