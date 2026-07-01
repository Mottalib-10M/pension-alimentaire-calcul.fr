import { describe, it, expect } from 'vitest';
import {
  calculatePensionAlimentaire,
  calculatePrestationCompensatoire,
  calculateRevenuDisponible,
  type PensionInput,
  type PrestationInput,
} from './engine';
import { MINIMUM_VITAL_2026 } from './baremes-2026';

// ──────────────────────────────────────────────
// calculateRevenuDisponible
// ──────────────────────────────────────────────

describe('calculateRevenuDisponible', () => {
  it('déduit le minimum vital du revenu brut', () => {
    const result = calculateRevenuDisponible(2000);
    expect(result).toBe(2000 - MINIMUM_VITAL_2026);
  });

  it('déduit le minimum vital ET les charges', () => {
    const result = calculateRevenuDisponible(2000, 200);
    expect(result).toBe(2000 - MINIMUM_VITAL_2026 - 200);
  });

  it('retourne 0 si le revenu est inférieur au minimum vital', () => {
    const result = calculateRevenuDisponible(400);
    expect(result).toBe(0);
  });

  it('retourne 0 si le revenu est exactement le minimum vital', () => {
    const result = calculateRevenuDisponible(MINIMUM_VITAL_2026);
    expect(result).toBe(0);
  });
});

// ──────────────────────────────────────────────
// calculatePensionAlimentaire
// ──────────────────────────────────────────────

describe('calculatePensionAlimentaire', () => {
  it('calcule la pension DVH classique pour 1 enfant', () => {
    const input: PensionInput = {
      revenuDebiteur: 2500,
      revenuCreancier: 1200,
      nbEnfants: 1,
      typeDVH: 'dvh_classique',
    };
    const result = calculatePensionAlimentaire(input);
    // Revenu disponible = 2500 - 635 = 1865
    // Montant = 1865 × 13.5% = 251.78 (arrondi)
    expect(result.revenuDisponible).toBe(1865);
    expect(result.montantParEnfant).toBeCloseTo(251.78, 1);
    expect(result.montantTotal).toBeCloseTo(251.78, 1);
    expect(result.tauxApplique).toBeCloseTo(0.135, 4);
  });

  it('calcule la pension DVH réduit pour 2 enfants', () => {
    const input: PensionInput = {
      revenuDebiteur: 3000,
      revenuCreancier: 1500,
      nbEnfants: 2,
      typeDVH: 'dvh_reduit',
    };
    const result = calculatePensionAlimentaire(input);
    // Revenu disponible = 3000 - 635 = 2365
    // Montant par enfant = 2365 × 18% = 425.70
    // Total = 425.70 × 2 = 851.40
    expect(result.revenuDisponible).toBe(2365);
    expect(result.montantParEnfant).toBeCloseTo(425.70, 1);
    expect(result.montantTotal).toBeCloseTo(851.40, 1);
  });

  it('calcule la pension DVH élargi pour 3 enfants', () => {
    const input: PensionInput = {
      revenuDebiteur: 4000,
      revenuCreancier: 1800,
      nbEnfants: 3,
      typeDVH: 'dvh_elargi',
    };
    const result = calculatePensionAlimentaire(input);
    // Revenu disponible = 4000 - 635 = 3365
    // Montant par enfant = 3365 × 11.5% = 386.98
    // Total = 386.98 × 3 = 1160.93
    expect(result.revenuDisponible).toBe(3365);
    expect(result.montantParEnfant).toBeCloseTo(386.98, 0);
    expect(result.montantTotal).toBeCloseTo(1160.93, 0);
  });

  it('calcule la pension en garde alternée pour 2 enfants', () => {
    const input: PensionInput = {
      revenuDebiteur: 3500,
      revenuCreancier: 2000,
      nbEnfants: 2,
      typeDVH: 'garde_alternee',
    };
    const result = calculatePensionAlimentaire(input);
    // Revenu disponible = 3500 - 635 = 2865
    // Montant par enfant = 2865 × 9% = 257.85
    // Total = 257.85 × 2 = 515.70
    expect(result.revenuDisponible).toBe(2865);
    expect(result.montantParEnfant).toBeCloseTo(257.85, 1);
    expect(result.montantTotal).toBeCloseTo(515.70, 1);
  });

  it('applique le coefficient dégressif pour 7 enfants', () => {
    const input: PensionInput = {
      revenuDebiteur: 5000,
      revenuCreancier: 1000,
      nbEnfants: 7,
      typeDVH: 'dvh_classique',
    };
    const result = calculatePensionAlimentaire(input);
    // Revenu disponible = 5000 - 635 = 4365
    // Taux = 13.5% × 0.95 = 12.825%
    // Montant par enfant = 4365 × 0.12825 = 559.81
    expect(result.tauxApplique).toBeCloseTo(0.135 * 0.95, 5);
    expect(result.montantParEnfant).toBeCloseTo(559.81, 0);
  });

  it('prend en compte les charges spéciales', () => {
    const input: PensionInput = {
      revenuDebiteur: 2500,
      revenuCreancier: 1200,
      nbEnfants: 1,
      typeDVH: 'dvh_classique',
      chargesSpeciales: 300,
    };
    const result = calculatePensionAlimentaire(input);
    // Revenu disponible = 2500 - 635 - 300 = 1565
    expect(result.revenuDisponible).toBe(1565);
    expect(result.montantParEnfant).toBeCloseTo(1565 * 0.135, 1);
  });

  it('retourne 0 pour 0 enfants', () => {
    const input: PensionInput = {
      revenuDebiteur: 3000,
      revenuCreancier: 1500,
      nbEnfants: 0,
      typeDVH: 'dvh_classique',
    };
    const result = calculatePensionAlimentaire(input);
    expect(result.montantParEnfant).toBe(0);
    expect(result.montantTotal).toBe(0);
  });

  it('retourne 0 si le revenu est inférieur au minimum vital', () => {
    const input: PensionInput = {
      revenuDebiteur: 500,
      revenuCreancier: 1500,
      nbEnfants: 2,
      typeDVH: 'dvh_classique',
    };
    const result = calculatePensionAlimentaire(input);
    expect(result.revenuDisponible).toBe(0);
    expect(result.montantParEnfant).toBe(0);
    expect(result.montantTotal).toBe(0);
  });
});

// ──────────────────────────────────────────────
// calculatePrestationCompensatoire
// ──────────────────────────────────────────────

describe('calculatePrestationCompensatoire', () => {
  it('calcule une prestation compensatoire standard', () => {
    const input: PrestationInput = {
      revenuDebiteur: 4000,
      revenuCreancier: 1500,
      dureeMariage: 15,
      ageDebiteur: 50,
    };
    const result = calculatePrestationCompensatoire(input);
    // Différence annuelle = (4000 - 1500) × 12 = 30 000
    // Capital = 1/3 × 30 000 × 15 × 0.75 = 112 500
    expect(result.differenceAnnuelle).toBe(30000);
    expect(result.coefficientAge).toBe(0.75);
    expect(result.capitalEstime).toBe(112500);
    expect(result.estimationBasse).toBe(90000);
    expect(result.estimationHaute).toBe(135000);
  });

  it('applique le coefficient d\'âge pour un débiteur jeune (< 35 ans)', () => {
    const input: PrestationInput = {
      revenuDebiteur: 3000,
      revenuCreancier: 1000,
      dureeMariage: 5,
      ageDebiteur: 30,
    };
    const result = calculatePrestationCompensatoire(input);
    expect(result.coefficientAge).toBe(0.5);
    // Différence annuelle = 2000 × 12 = 24 000
    // Capital = 1/3 × 24 000 × 5 × 0.5 = 20 000
    expect(result.capitalEstime).toBe(20000);
  });

  it('applique le coefficient d\'âge pour un débiteur âgé (>= 65 ans)', () => {
    const input: PrestationInput = {
      revenuDebiteur: 5000,
      revenuCreancier: 1000,
      dureeMariage: 30,
      ageDebiteur: 68,
    };
    const result = calculatePrestationCompensatoire(input);
    expect(result.coefficientAge).toBe(1.0);
    // Différence annuelle = 4000 × 12 = 48 000
    // Capital = 1/3 × 48 000 × 30 × 1.0 = 480 000
    expect(result.capitalEstime).toBe(480000);
  });

  it('plafonne la durée à 40 ans', () => {
    const input: PrestationInput = {
      revenuDebiteur: 3000,
      revenuCreancier: 1000,
      dureeMariage: 50,
      ageDebiteur: 70,
    };
    const result = calculatePrestationCompensatoire(input);
    expect(result.dureePriseEnCompte).toBe(40);
  });

  it('retourne 0 si le créancier gagne plus que le débiteur', () => {
    const input: PrestationInput = {
      revenuDebiteur: 1500,
      revenuCreancier: 3000,
      dureeMariage: 10,
      ageDebiteur: 45,
    };
    const result = calculatePrestationCompensatoire(input);
    expect(result.capitalEstime).toBe(0);
    expect(result.renteMensuelle).toBe(0);
  });

  it('calcule la rente mensuelle sur 8 ans', () => {
    const input: PrestationInput = {
      revenuDebiteur: 4000,
      revenuCreancier: 1500,
      dureeMariage: 15,
      ageDebiteur: 50,
    };
    const result = calculatePrestationCompensatoire(input);
    // Capital = 112 500 / 96 mois = 1171.88
    expect(result.renteMensuelle).toBeCloseTo(1171.88, 0);
  });
});
