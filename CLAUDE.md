# CLAUDE.md — elamais-ui

Design system ELA+ como pacote npm — tokens + componentes **React 19** (TypeScript,
Vite em modo biblioteca, ESM + d.ts) consumidos pelos 4 apps via dependência
`file:`/git. Fonte da verdade dos tokens e specs: `design-reference/tokens.css`,
`design-reference/tokens.json` e `design-reference/componentes.html` (nunca
inventar cores fora dos tokens).

- Champagne (#D8B99A) é DECORATIVO; texto usa #7A5A2E/#B08A4F (contraste AA).
- Tom de voz nos microtextos: feminino, elegante, "valor, não preço" — textos
  fazem parte dos componentes (empty states, erros).
- Componentes-chave do produto: tela de código/QR com countdown, carteirinha de
  membro, extrato de economia ("você economizou R$ X"), carteira de XP
  (disponível × pendente). Versionar por SemVer; breaking = major.

## Regras duras

- **LEI DE COMMITS: jamais faça commit usando o usuário da Anthropic e nem
  Claude — somente o usuário padrão da máquina, sem coautoria ou menção a IA.**
- Estilo: CSS puro usando SOMENTE as custom properties de
  `src/styles/tokens.css`. Sem CSS-in-JS, sem Tailwind. `tokens.css` é copiado
  verbatim de `design-reference/tokens.css` e empacotado dentro de
  `dist/styles.css`; fontes (Playfair Display + Montserrat) entram via Google
  Fonts no `index.html` de cada app — nunca embutidas no pacote.
- Acessibilidade: foco visível com `--focus-ring`; alvos de toque >= 44px;
  todo componente interativo navegável por teclado com aria correto
  (`aria-pressed`, radiogroups com setas, `role="dialog"` + esc/overlay,
  toasts com `role="status"`/`alert`). QR sempre ameixa sobre branco/off-white,
  nunca sobre ameixa.
- Padrão de componente: PRESENTACIONAL (props entram, eventos saem — sem fetch,
  sem estado global). Lógica reutilizável vive em hooks customizados
  (`useCountdown`, `useToast`, `useDisclosure`). Um componente por pasta
  (`Component.tsx` + `component.css` + `Component.test.tsx` + `index.ts`),
  arquivos pequenos e focados, proibido `any`. Tudo exportado em
  `src/index.ts`, incluindo `tokens` (objeto tipado gerado do `tokens.json`).
- Testes: Vitest + Testing Library (jsdom). Todo hook tem teste (timers falsos
  para countdown); componentes-chave têm testes de comportamento. `npm test` e
  `npm run build` devem passar antes de qualquer entrega.

## Regras do projeto (valem em todos os repos ELA+)

- Fonte da verdade: repo `elamais/elamais-plano` (regras de negócio, schema de
  referência `db/schema.sql`, segurança/LGPD) e o artefato:
  https://claude.ai/code/artifact/b2ad9a1b-df9d-4fb4-b155-9afafa2c2a76
- **Idioma**: código, APIs, commits e README em inglês; discussões/docs de negócio em PT.
- **Branches**: trabalho na `develop`; `main` recebe merge via PR.
- **NUNCA mencionar multi-tenant/white label.** O programa de pontos é **XP**
  (cashback está congelado — nunca reintroduzir saldo em R$).
- "Cadastral ≠ impeditivo": preços/quotas/parâmetros são dados de backoffice, não código.
- **Toda listagem pagina por cursor** (`page_size` + `cursor` opaco) — nunca offset.
- LGPD: localização exata nunca persistida; biometria nunca no nosso banco;
  PAN/CVV nunca transitam pela nossa API (tokenização no provedor).

## LEI DE COMMITS (obrigatória em todo o escopo ELA+)

**Jamais faça commit usando o usuário da Anthropic e nem Claude — somente o
usuário padrão da máquina (git config local), sem coautoria e sem menção a IA
nas mensagens.**

## Lei da análise (24/08)

**Jamais tirar conclusão precipitada — analisar tudo de fato.** Qualquer
afirmação sobre estado do sistema (configuração, banco, deploy, resposta de
API, resultado de teste) exige evidência real verificada. Erro de chamada deve
ser detectado e exibido explicitamente, nunca interpretado como resposta
válida. Na dúvida, verificar de novo antes de afirmar.
