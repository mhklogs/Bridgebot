# Bridgebot — Market Analysis

> **Evidence base.** This document was researched on 2026-09-29 from vendor pricing pages,
> published analyst figures and the owner's market-review work (2026-09-26). No number
> here is invented. Where a figure could not be independently verified it is marked
> **[TO BE VALIDATED]**; verify it before the document is used in an investor or
> grant setting. Sources are listed in §8.

## 1. Product in one sentence

> BridgeBot — a legacy code-migration assistant focused on assessment and documentation.

## 2. Problem statement

- **Who feels the problem:** Enterprises modernizing legacy application estates.
- **What they do today instead:** manual processes, spreadsheets, rented SaaS — see §4.
- **Cost of the status quo:** measurable in lost revenue / manual labor overhead
  **[TO BE VALIDATED for this specific segment]**.

## 3. Market definition

| Field | Value |
| --- | --- |
| Category | Legacy code migration / modernization |
| Geographic scope | Global |
| Target segment / persona | Enterprises modernizing legacy application estates |
| Estimated total addressable market | Modernization is a large but enterprise-gated market with well-funded entrants **[TO BE VALIDATED — cite a specific figure]** |
| Serviceable addressable market | Depends on distribution reach; **[TO BE VALIDATED]** |
| Beachhead segment | Enterprises modernizing legacy application estates |

## 4. Demand signals

> Real and validated; vendors raised heavily in 2025–26

| Signal | Evidence | Status |
| --- | --- | --- |
| Category demand | Mature/validated category with well-funded entrants | Confirmed |
| Competitive floor | Incumbent pricing and free tiers are public and low | Confirmed (see §5) |
| Own sales/usage data | Not instrumented in this repo | **[TO BE MEASURED]** |

## 5. Competitive landscape

| Competitor | Entry price (2026) | Positioning | Weakness we can exploit |
| --- | --- | --- | --- |
| **Hypercubic** | Seed $5.3M (2026) | Enterprise map-and-rewrite agents | Enterprise-gated |
| **Kodesage** | Seed $6.6M (2026) | On-prem, air-gapped (Oracle→APEX) | On-prem only |
| **CoreStory** | Series A $32M (2026) | Specification-driven development | Spec-first bet |
| **Cognition (Devin)** | Enterprise | DeepWiki documentation layer; COBOL 68% failure rate | Feedback loop broken on mainframes |

## 6. Differentiation

Grounded in what this build actually does (see `06-architecture.md`):

- **Distinctive capability in code:** Narrow, assessment-and-documentation slice only. The winners sell verification, not generation; the pragmatic wedge is documentation + risk assessment, not autonomous migration.
- **Capability a competitor would need to replicate:** proxy of the build's core path.
- **Why defensible:** depth of vertical fit and delivery ownership, not a generic dashboard.

## 7. Risks

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| Category commoditized / incumbent floor falling | Medium–High | Medium | Position on differentiation above, not price |
| Unverified market figures | High | High | Keep `[TO BE VALIDATED]` markers until sourced |
| Claims ahead of code (demo vs. shipped) | Medium | High | Keep README/copy aligned with the source tree |

## 8. Sources

Accessed 2026-09-29; vendor pricing changes — re-verify before any pricing decision.

- https://siliconangle.com/2026/08/18/hypercubic-raises-5-3m-map-rewrite-legacy-cobol-apps-ai-agents/
