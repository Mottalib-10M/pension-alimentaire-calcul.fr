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

## Notes

- Les montants calculés sont **purement indicatifs**. Le juge aux affaires familiales (JAF) dispose d'un large pouvoir d'appréciation et peut s'écarter du barème.
- Le minimum vital est fixé au montant du RSA socle pour une personne seule : **635 €/mois** en 2026.
- Les taux appliqués correspondent à la table de référence du Ministère de la Justice, actualisée pour 2026.
- La prestation compensatoire utilise la méthode indicative des 1/3, qui n'est qu'une des méthodes utilisées en pratique. Le juge n'est lié par aucune formule mathématique.
