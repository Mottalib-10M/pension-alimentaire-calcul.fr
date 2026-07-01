/**
 * Moteur de calcul — Pension alimentaire & prestation compensatoire
 * Basé sur la table de référence indicative du Ministère de la Justice (2026)
 */

import {
  type TypeDVH,
  TAUX_PAR_ENFANT,
  MINIMUM_VITAL_2026,
  getCoefficientDegressif,
  PRESTATION_COMPENSATOIRE,
} from './baremes-2026';

// ──────────────────────────────────────────────
// Types d'entrée / sortie
// ──────────────────────────────────────────────

export interface PensionInput {
  /** Revenu net mensuel du débiteur (parent qui verse) en euros */
  revenuDebiteur: number;
  /** Revenu net mensuel du créancier (parent qui reçoit) en euros */
  revenuCreancier: number;
  /** Nombre d'enfants à charge */
  nbEnfants: number;
  /** Type de droit de visite et d'hébergement */
  typeDVH: TypeDVH;
  /** Charges spéciales mensuelles (frais médicaux, handicap, etc.) */
  chargesSpeciales?: number;
}

export interface PensionResult {
  /** Revenu disponible du débiteur après déduction du minimum vital */
  revenuDisponible: number;
  /** Montant mensuel par enfant */
  montantParEnfant: number;
  /** Montant mensuel total pour tous les enfants */
  montantTotal: number;
  /** Taux appliqué (après coefficient dégressif) */
  tauxApplique: number;
  /** Minimum vital déduit */
  minimumVital: number;
  /** Nombre d'enfants pris en compte */
  nbEnfants: number;
  /** Type de DVH utilisé */
  typeDVH: TypeDVH;
}

export interface PrestationInput {
  /** Revenu net mensuel du débiteur (époux aux revenus supérieurs) */
  revenuDebiteur: number;
  /** Revenu net mensuel du créancier (époux aux revenus inférieurs) */
  revenuCreancier: number;
  /** Durée du mariage en années */
  dureeMariage: number;
  /** Âge du débiteur au moment du divorce */
  ageDebiteur: number;
}

export interface PrestationResult {
  /** Capital estimé (prestation compensatoire en capital) */
  capitalEstime: number;
  /** Estimation basse (fourchette -20 %) */
  estimationBasse: number;
  /** Estimation haute (fourchette +20 %) */
  estimationHaute: number;
  /** Rente mensuelle équivalente (si versée sur 8 ans) */
  renteMensuelle: number;
  /** Différence annuelle de revenus */
  differenceAnnuelle: number;
  /** Coefficient d'âge appliqué */
  coefficientAge: number;
  /** Durée prise en compte */
  dureePriseEnCompte: number;
}

// ──────────────────────────────────────────────
// Fonctions de calcul
// ──────────────────────────────────────────────

/**
 * Calcule le revenu disponible du débiteur.
 * Revenu disponible = revenu net - minimum vital (RSA personne seule)
 * Le résultat ne peut pas être négatif.
 */
export function calculateRevenuDisponible(
  revenuBrut: number,
  charges: number = 0,
): number {
  const disponible = revenuBrut - MINIMUM_VITAL_2026 - charges;
  return Math.max(0, disponible);
}

/**
 * Calcule la pension alimentaire selon le barème du Ministère de la Justice.
 *
 * Formule :
 *   Revenu disponible = revenu débiteur - minimum vital - charges spéciales
 *   Taux unitaire = taux DVH × coefficient dégressif (si > 6 enfants)
 *   Pension par enfant = revenu disponible × taux unitaire
 *   Pension totale = pension par enfant × nombre d'enfants
 */
export function calculatePensionAlimentaire(input: PensionInput): PensionResult {
  const {
    revenuDebiteur,
    nbEnfants,
    typeDVH,
    chargesSpeciales = 0,
  } = input;

  // Validation
  if (nbEnfants <= 0) {
    return {
      revenuDisponible: 0,
      montantParEnfant: 0,
      montantTotal: 0,
      tauxApplique: 0,
      minimumVital: MINIMUM_VITAL_2026,
      nbEnfants: 0,
      typeDVH,
    };
  }

  const revenuDisponible = calculateRevenuDisponible(revenuDebiteur, chargesSpeciales);

  // Taux de base selon le type de DVH
  const tauxBase = TAUX_PAR_ENFANT[typeDVH];

  // Coefficient dégressif pour les familles nombreuses (> 6 enfants)
  const coeff = getCoefficientDegressif(nbEnfants);
  const tauxApplique = tauxBase * coeff;

  // Montant par enfant
  const montantParEnfant = Math.round(revenuDisponible * tauxApplique * 100) / 100;

  // Montant total
  const montantTotal = Math.round(montantParEnfant * nbEnfants * 100) / 100;

  return {
    revenuDisponible,
    montantParEnfant,
    montantTotal,
    tauxApplique,
    minimumVital: MINIMUM_VITAL_2026,
    nbEnfants,
    typeDVH,
  };
}

/**
 * Calcule une estimation de prestation compensatoire selon la méthode des 1/3.
 *
 * Formule :
 *   Différence annuelle = (revenu débiteur - revenu créancier) × 12
 *   Capital = 1/3 × différence annuelle × durée mariage × coefficient d'âge
 *
 * Le résultat est une estimation indicative. Le juge apprécie librement.
 */
export function calculatePrestationCompensatoire(input: PrestationInput): PrestationResult {
  const { revenuDebiteur, revenuCreancier, dureeMariage, ageDebiteur } = input;

  // Différence mensuelle (le débiteur a les revenus les plus élevés)
  const differenceMensuelle = Math.max(0, revenuDebiteur - revenuCreancier);
  const differenceAnnuelle = differenceMensuelle * 12;

  // Durée plafonnée
  const dureePriseEnCompte = Math.min(dureeMariage, PRESTATION_COMPENSATOIRE.DUREE_MAX_ANNEES);

  // Coefficient d'âge
  const coefficientAge = PRESTATION_COMPENSATOIRE.coefficientAge(ageDebiteur);

  // Capital estimé
  const capitalEstime = Math.round(
    PRESTATION_COMPENSATOIRE.FRACTION * differenceAnnuelle * dureePriseEnCompte * coefficientAge
  );

  // Fourchette ±20 %
  const estimationBasse = Math.round(capitalEstime * 0.8);
  const estimationHaute = Math.round(capitalEstime * 1.2);

  // Rente mensuelle équivalente (versement sur 8 ans = 96 mois)
  const renteMensuelle = capitalEstime > 0 ? Math.round((capitalEstime / 96) * 100) / 100 : 0;

  return {
    capitalEstime,
    estimationBasse,
    estimationHaute,
    renteMensuelle,
    differenceAnnuelle,
    coefficientAge,
    dureePriseEnCompte,
  };
}
