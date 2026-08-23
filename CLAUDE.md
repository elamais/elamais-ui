# CLAUDE.md — elamais-ui

Design system ELA+ como pacote npm — tokens + componentes Vue consumidos pelos
4 apps. Semente dos tokens: `frontend/tokens.css` do elamais-plano.

- Champagne (#D8B99A) é DECORATIVO; texto usa #7A5A2E/#B08A4F (contraste AA).
- Tom de voz nos microtextos: feminino, elegante, "valor, não preço" — textos
  fazem parte dos componentes (empty states, erros).
- Componentes-chave do produto: tela de código/QR com countdown, carteirinha de
  membro, extrato de economia ("você economizou R$ X"), carteira de XP
  (disponível × pendente). Versionar por SemVer; breaking = major.

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
