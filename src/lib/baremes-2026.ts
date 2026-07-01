/**
 * Barème indicatif de la pension alimentaire 2026
 * Source : Table de référence du Ministère de la Justice
 *
 * Le barème utilise un pourcentage du revenu disponible du débiteur
 * (revenu net - minimum vital) appliqué par enfant selon le mode
 * de garde / droit de visite et d'hébergement (DVH).
 */

/** Types de droit de visite et d'hébergement */
export type TypeDVH =
  | 'dvh_reduit'     // Droit de visite et d'hébergement réduit
  | 'dvh_classique'  // 1 week-end sur 2 + moitié des vacances scolaires
  | 'dvh_elargi'     // Droit de visite et d'hébergement élargi
  | 'garde_alternee'; // Résidence alternée (50/50)

/** Labels lisibles pour chaque type de DVH */
export const DVH_LABELS: Record<TypeDVH, string> = {
  dvh_reduit: 'DVH réduit (droit de visite minimal)',
  dvh_classique: 'DVH classique (1 WE/2 + ½ vacances)',
  dvh_elargi: 'DVH élargi (droits élargis)',
  garde_alternee: 'Garde alternée (résidence alternée 50/50)',
};

/**
 * Pourcentage du revenu disponible par enfant selon le type de DVH.
 * Ces taux sont issus de la table de référence indicative du Ministère
 * de la Justice, actualisée pour 2026.
 */
export const TAUX_PAR_ENFANT: Record<TypeDVH, number> = {
  dvh_reduit: 0.18,       // 18 % par enfant
  dvh_classique: 0.135,   // 13,5 % par enfant
  dvh_elargi: 0.115,      // 11,5 % par enfant
  garde_alternee: 0.09,   // 9 % par enfant
};

/**
 * Minimum vital 2026 : montant du RSA socle pour une personne seule
 * sans enfant. Ce montant est déduit du revenu du débiteur avant
 * application du barème.
 */
export const MINIMUM_VITAL_2026 = 635; // euros/mois (RSA socle personne seule)

/**
 * Coefficient dégressif par nombre d'enfants.
 * Au-delà de 6 enfants, le taux unitaire est réduit pour tenir
 * compte de la charge globale.
 *
 * Clé = nombre d'enfants, valeur = coefficient multiplicateur
 * appliqué au taux unitaire.
 */
export const COEFFICIENTS_DEGRESSIFS: Record<number, number> = {
  1: 1.0,
  2: 1.0,
  3: 1.0,
  4: 1.0,
  5: 1.0,
  6: 1.0,
  7: 0.95,
  8: 0.90,
  9: 0.85,
  10: 0.80,
};

/**
 * Retourne le coefficient dégressif pour un nombre d'enfants donné.
 * Au-delà de 10 enfants, le coefficient plancher est de 0.75.
 */
export function getCoefficientDegressif(nbEnfants: number): number {
  if (nbEnfants <= 0) return 0;
  if (nbEnfants <= 6) return 1.0;
  if (nbEnfants in COEFFICIENTS_DEGRESSIFS) {
    return COEFFICIENTS_DEGRESSIFS[nbEnfants];
  }
  return 0.75; // plancher pour > 10 enfants
}

/**
 * Prestation compensatoire — Méthode des 1/3
 *
 * Formule indicative (non contraignante) :
 *   Capital = (1/3) × (différence de revenus annuels) × durée mariage (années) × coefficient d'âge
 *
 * Le coefficient d'âge varie de 0.5 (débiteur jeune, forte capacité
 * à se reconstituer) à 1.0 (débiteur âgé).
 */
export const PRESTATION_COMPENSATOIRE = {
  /** Fraction de la différence de revenus */
  FRACTION: 1 / 3,

  /**
   * Coefficient selon l'âge du débiteur au moment du divorce.
   * Plus le débiteur est âgé, plus le coefficient est élevé car
   * le créancier aura moins de temps pour se reconstituer
   * une situation financière.
   */
  coefficientAge(age: number): number {
    if (age < 35) return 0.5;
    if (age < 45) return 0.6;
    if (age < 55) return 0.75;
    if (age < 65) return 0.85;
    return 1.0;
  },

  /** Durée maximale prise en compte pour le calcul (années) */
  DUREE_MAX_ANNEES: 40,
};

/**
 * Contribution aux charges du mariage durant la séparation.
 * En cas de séparation de fait avant le divorce, le devoir de
 * secours subsiste. La contribution est généralement fixée à
 * environ 1/3 de la différence de revenus du couple.
 */
export const CONTRIBUTION_CHARGES_MARIAGE = {
  FRACTION: 1 / 3,
};
