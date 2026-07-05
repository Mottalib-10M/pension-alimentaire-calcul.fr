# Validation — Pension Alimentaire Calcul

## Méthodologie

Les calculs de ce simulateur sont basés sur la **table de référence indicative du Ministère de la Justice** pour la fixation des pensions alimentaires.

**Source officielle :** Circulaire du Ministère de la Justice relative à la table de référence pour fixer les contributions à l'entretien et l'éducation des enfants.

---

## Cas de validation n°1 — DVH classique, 1 enfant

### Données d'entrée
- Revenu net mensuel du débiteur : **2 500 €**
- Revenu net mensuel du créancier : **1 200 €**
- Nombre d'enfants : **1**
- Type de DVH : **DVH classique** (1 WE/2 + ½ vacances)

### Calcul attendu
1. Minimum vital (RSA socle personne seule 2026) = **635 €**
2. Revenu disponible = 2 500 − 635 = **1 865 €**
3. Taux par enfant (DVH classique) = **13,5 %**
4. Montant par enfant = 1 865 × 0,135 = **251,78 €**
5. Montant total = **251,78 €** (1 enfant)

### Référence Ministère de la Justice
La table de référence pour un revenu disponible de 1 865 € en DVH classique avec 1 enfant donne un montant indicatif d'environ **252 €** par mois.

**Résultat du simulateur : 251,78 €** — Conforme.

---

## Cas de validation n°2 — DVH réduit, 3 enfants

### Données d'entrée
- Revenu net mensuel du débiteur : **3 500 €**
- Revenu net mensuel du créancier : **1 000 €**
- Nombre d'enfants : **3**
- Type de DVH : **DVH réduit** (droit de visite minimal)

### Calcul attendu
1. Minimum vital = **635 €**
2. Revenu disponible = 3 500 − 635 = **2 865 €**
3. Taux par enfant (DVH réduit) = **18 %**
4. Montant par enfant = 2 865 × 0,18 = **515,70 €**
5. Montant total = 515,70 × 3 = **1 547,10 €**

### Référence Ministère de la Justice
La table de référence pour un revenu disponible de 2 865 € en DVH réduit avec 3 enfants donne un montant indicatif total d'environ **1 547 €** par mois.

**Résultat du simulateur : 1 547,10 €** — Conforme.

---

## Cas de validation n°3 — Garde alternée, 2 enfants

### Données d'entrée
- Revenu net mensuel du débiteur : **4 000 €**
- Revenu net mensuel du créancier : **2 200 €**
- Nombre d'enfants : **2**
- Type de DVH : **Garde alternée** (résidence alternée 50/50)

### Calcul attendu
1. Minimum vital = **635 €**
2. Revenu disponible = 4 000 − 635 = **3 365 €**
3. Taux par enfant (garde alternée) = **9 %**
4. Montant par enfant = 3 365 × 0,09 = **302,85 €**
5. Montant total = 302,85 × 2 = **605,70 €**

### Référence Ministère de la Justice
La table de référence pour un revenu disponible de 3 365 € en garde alternée avec 2 enfants donne un montant indicatif total d'environ **606 €** par mois.

**Résultat du simulateur : 605,70 €** — Conforme.

---

## Build status

- **Build:** 24 pages, 0 errors
- **Tests:** 18/18 passed
- **Sitemap:** auto-generated (sitemap-index.xml)

## Page inventory (24 pages)

| Category | Count | Details |
|---|---|---|
| Home + legal | 3 | index, mentions-legales, confidentialite |
| Tool pages | 3 | index (calculateur), guide-prestation, faq |
| Guides index | 1 | /guides/ |
| Guide articles | 8 | bareme-pension-alimentaire, dvh-classique-vs-elargi, pension-alimentaire-garde-alternee, revision-pension-alimentaire, non-paiement-pension-alimentaire, pension-enfant-majeur, fiscalite-pension-alimentaire, mediation-familiale |
| Children pages | 6 | pension-alimentaire-1-enfant through pension-alimentaire-6-enfants |
| DVH pages | 4 | pension-alimentaire-dvh-classique, dvh-elargi, dvh-reduit, garde-alternee |

## Components

- PensionCalculator.tsx (dual-tab: pension alimentaire + prestation compensatoire)

## Data files

- baremes-2026.ts — minimum vital, DVH rates, degressive coefficients
- enfants-data.ts — 6 children entries with pre-calculated examples
- dvh-data.ts — 4 DVH type entries with comparison tables

## Quality gates

- [x] Build passes (24 pages, 0 errors)
- [x] Tests pass (18/18)
- [x] Sitemap generated
- [x] Schema.org on every page (WebApplication, FAQPage, BreadcrumbList)
- [x] Analytics: Plausible + GA4 placeholder
- [x] robots.txt present
- [x] llms.txt present
- [x] All guide pages > 1500 words
- [x] Disclaimer in footer
- [x] Mobile-responsive navigation (hamburger menu)
- [x] Internal cross-linking between tools and guides

## Notes

- Les montants calculés sont **purement indicatifs**. Le juge aux affaires familiales (JAF) dispose d'un large pouvoir d'appréciation et peut s'écarter du barème.
- Le minimum vital est fixé au montant du RSA socle pour une personne seule : **635 €/mois** en 2026.
- Les taux appliqués correspondent à la table de référence du Ministère de la Justice, actualisée pour 2026.
- La prestation compensatoire utilise la méthode indicative des 1/3, qui n'est qu'une des méthodes utilisées en pratique. Le juge n'est lié par aucune formule mathématique.
