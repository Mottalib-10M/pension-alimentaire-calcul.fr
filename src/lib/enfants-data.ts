/**
 * Données programmatiques — Pages par nombre d'enfants
 * Utilisé par /pension-alimentaire-[enfants].astro
 */

import { calculatePensionAlimentaire } from './engine';
import { TAUX_PAR_ENFANT, MINIMUM_VITAL_2026, type TypeDVH } from './baremes-2026';

export interface EnfantPageData {
  /** Nombre d'enfants (1 à 6) */
  nombre: number;
  /** Slug URL : "1-enfant", "2-enfants", etc. */
  slug: string;
  /** Label formaté : "1 enfant", "2 enfants", etc. */
  label: string;
  /** Label long pour les titres : "un enfant", "deux enfants", etc. */
  labelLong: string;
  /** Conseils contextuels spécifiques au nombre d'enfants */
  conseil: string;
  /** Contenu SEO détaillé (500+ mots) */
  contenuSeo: string;
  /** Questions FAQ spécifiques */
  faq: { question: string; reponse: string }[];
  /** Exemples pré-calculés pour le tableau comparatif */
  exemples: ExempleCalcul[];
}

export interface ExempleCalcul {
  revenu: number;
  typeDVH: TypeDVH;
  labelDVH: string;
  montantParEnfant: number;
  montantTotal: number;
}

const REVENUS_REFERENCE = [2000, 3000, 4000];
const DVH_TYPES: { type: TypeDVH; label: string }[] = [
  { type: 'dvh_reduit', label: 'DVH réduit' },
  { type: 'dvh_classique', label: 'DVH classique' },
  { type: 'dvh_elargi', label: 'DVH élargi' },
  { type: 'garde_alternee', label: 'Garde alternée' },
];

function genererExemples(nbEnfants: number): ExempleCalcul[] {
  const exemples: ExempleCalcul[] = [];
  for (const revenu of REVENUS_REFERENCE) {
    for (const dvh of DVH_TYPES) {
      const result = calculatePensionAlimentaire({
        revenuDebiteur: revenu,
        revenuCreancier: 0,
        nbEnfants,
        typeDVH: dvh.type,
      });
      exemples.push({
        revenu,
        typeDVH: dvh.type,
        labelDVH: dvh.label,
        montantParEnfant: result.montantParEnfant,
        montantTotal: result.montantTotal,
      });
    }
  }
  return exemples;
}

export const ENFANTS_DATA: EnfantPageData[] = [
  {
    nombre: 1,
    slug: '1-enfant',
    label: '1 enfant',
    labelLong: 'un enfant',
    conseil:
      "Avec un seul enfant, le taux du barème s'applique intégralement sans coefficient dégressif. Le montant de la pension représente la part la plus élevée par enfant. Il est essentiel de bien évaluer les besoins spécifiques de l'enfant (scolarité, activités, santé) pour s'assurer que le montant couvre l'ensemble des frais.",
    contenuSeo: `
La pension alimentaire pour un enfant unique constitue le cas de figure le plus fréquent en France. Selon les statistiques du Ministère de la Justice, près de 45 % des séparations impliquant des enfants concernent des familles avec un seul enfant à charge. Le calcul est alors relativement simple puisqu'il s'agit d'appliquer directement le taux correspondant au type de droit de visite et d'hébergement (DVH) au revenu disponible du parent débiteur.

### Comment est calculée la pension pour 1 enfant en 2026 ?

Le barème du Ministère de la Justice prévoit quatre taux selon le mode de garde. Pour un seul enfant, le taux est appliqué sans coefficient dégressif. La formule est la suivante :

**Pension mensuelle = (Revenu net du débiteur - ${MINIMUM_VITAL_2026} €) x Taux DVH**

Par exemple, pour un parent débiteur percevant 2 500 € nets mensuels avec un DVH classique (un week-end sur deux et la moitié des vacances scolaires), le calcul donne : (2 500 - ${MINIMUM_VITAL_2026}) x 13,5 % = **251,78 € par mois**.

### Les taux applicables pour 1 enfant

- **DVH réduit** : ${(TAUX_PAR_ENFANT.dvh_reduit * 100).toFixed(1)} % du revenu disponible, soit le taux le plus élevé car le parent débiteur assume moins de charges directes au quotidien.
- **DVH classique** : ${(TAUX_PAR_ENFANT.dvh_classique * 100).toFixed(1)} % du revenu disponible, correspondant au schéma d'un week-end sur deux plus la moitié des vacances.
- **DVH élargi** : ${(TAUX_PAR_ENFANT.dvh_elargi * 100).toFixed(1)} % du revenu disponible, pour des droits de visite plus étendus (par exemple avec un mercredi en plus).
- **Garde alternée** : ${(TAUX_PAR_ENFANT.garde_alternee * 100).toFixed(1)} % du revenu disponible, car le parent débiteur prend en charge la moitié des frais quotidiens.

### Ce que le juge prend en compte au-delà du barème

Pour un enfant unique, le juge aux affaires familiales peut s'écarter du barème en tenant compte de facteurs spécifiques : frais de scolarité élevés (école privée, cours particuliers), besoins médicaux particuliers (orthodontie, suivi psychologique), activités extrascolaires coûteuses (sport de haut niveau, musique), ou encore le train de vie antérieur de la famille. Le juge examine aussi les revenus et charges de chaque parent pour garantir un équilibre.

### L'impact fiscal pour un enfant unique

Lorsqu'un seul enfant est concerné, la question du rattachement fiscal est importante. Le parent débiteur doit choisir entre déduire la pension alimentaire versée de son revenu imposable ou rattacher l'enfant à son foyer fiscal (dans le cas d'une garde alternée). Pour un enfant unique en résidence principale chez le parent créancier, la déduction de la pension est généralement plus avantageuse pour le débiteur, tandis que le créancier devra déclarer les sommes reçues.

### Révision de la pension pour 1 enfant

Les besoins d'un enfant unique évoluent avec l'âge. L'entrée au collège, au lycée ou dans les études supérieures peut justifier une demande de révision à la hausse. À l'inverse, une perte d'emploi du parent débiteur ou une augmentation significative des revenus du parent créancier peut motiver une révision à la baisse. Chaque parent peut saisir le juge aux affaires familiales du tribunal judiciaire pour demander une modification du montant.

### Pension alimentaire et enfant majeur

L'obligation alimentaire ne cesse pas automatiquement à la majorité de l'enfant. Si l'enfant poursuit des études sérieuses ou se trouve dans l'impossibilité de subvenir à ses besoins, la pension peut être maintenue. L'enfant majeur peut même directement saisir le juge pour réclamer une contribution à son parent. En pratique, la pension pour un enfant majeur est souvent versée directement à l'enfant lui-même.
    `.trim(),
    faq: [
      {
        question: 'Quel est le montant moyen de la pension alimentaire pour 1 enfant en 2026 ?',
        reponse:
          "Le montant varie selon les revenus du parent débiteur et le type de DVH. Pour un revenu net de 2 500 € et un DVH classique, le barème indicatif donne environ 252 € par mois. Le montant moyen constaté en France est d'environ 170 € à 350 € par enfant selon les études du Ministère de la Justice.",
      },
      {
        question: 'La pension pour 1 enfant est-elle déductible des impôts ?',
        reponse:
          "Oui, la pension alimentaire versée pour un enfant mineur est intégralement déductible du revenu imposable du parent débiteur, à condition qu'elle soit fixée par décision de justice ou par convention homologuée. Pour un enfant majeur, la déduction est plafonnée à 6 674 € par an en 2026. Le parent qui reçoit la pension doit la déclarer comme revenu imposable.",
      },
      {
        question: 'Comment demander une révision de la pension pour 1 enfant ?',
        reponse:
          "Il faut saisir le juge aux affaires familiales (JAF) du tribunal judiciaire du lieu de résidence de l'enfant par une requête en modification de la pension alimentaire. Vous devez justifier d'un changement significatif de circonstances : variation importante des revenus, changement de mode de garde, nouveaux besoins de l'enfant, etc. Un avocat n'est pas obligatoire mais recommandé.",
      },
    ],
    exemples: genererExemples(1),
  },
  {
    nombre: 2,
    slug: '2-enfants',
    label: '2 enfants',
    labelLong: 'deux enfants',
    conseil:
      "Avec deux enfants, le montant total de la pension est doublé par rapport à un seul enfant, car le taux par enfant reste identique. Il est fréquent que le juge ajuste le montant en fonction des besoins différents de chaque enfant (âge, scolarité, activités). Les parents peuvent convenir d'un montant global ou d'un montant individualisé par enfant.",
    contenuSeo: `
La pension alimentaire pour deux enfants est le deuxième cas de figure le plus courant dans les séparations en France. Avec deux enfants à charge, le montant total de la pension est naturellement plus élevé puisque le taux du barème s'applique à chaque enfant individuellement, sans coefficient dégressif pour cette configuration.

### Calcul de la pension alimentaire pour 2 enfants en 2026

La formule de calcul reste identique au cas d'un seul enfant, mais le montant total est multiplié par deux :

**Pension totale = (Revenu net - ${MINIMUM_VITAL_2026} €) x Taux DVH x 2 enfants**

Prenons l'exemple d'un parent débiteur avec un revenu net de 3 000 € et un DVH classique :
- Revenu disponible : 3 000 - ${MINIMUM_VITAL_2026} = **2 365 €**
- Montant par enfant : 2 365 x 13,5 % = **319,28 €**
- Montant total : 319,28 x 2 = **638,55 € par mois**

Ce montant représente environ 21,3 % du revenu net du débiteur, ce qui constitue une charge significative. Le barème ne prévoit pas de coefficient dégressif pour deux enfants, le taux unitaire restant à 100 %.

### Les particularités de la pension pour 2 enfants

Lorsque deux enfants sont concernés, plusieurs situations spécifiques peuvent se présenter :

**Enfants d'âges différents** : les besoins d'un adolescent au lycée sont généralement plus élevés que ceux d'un enfant en maternelle. Le juge peut fixer des montants différenciés pour chaque enfant, même si le barème prévoit un taux unique. Les frais de cantine, de transport, d'activités extrascolaires et de vêtements augmentent avec l'âge.

**Modes de garde différents** : il arrive que les deux enfants ne bénéficient pas du même mode de garde. Par exemple, l'aîné peut être en garde alternée tandis que le cadet réside principalement chez un parent. Dans ce cas, le calcul est effectué séparément pour chaque enfant avec le taux correspondant à son DVH.

**Fratrie et partage** : le maintien du lien entre les frères et sœurs est un principe important pour le juge. Les décisions de garde tendent à garder les enfants ensemble, mais des exceptions existent lorsque les besoins de chaque enfant le justifient.

### Impact sur le budget du parent débiteur

Avec deux enfants, la pension représente une part importante du budget. Pour un revenu de 2 500 € avec un DVH classique, la pension totale s'élève à environ 504 €, soit plus de 20 % du revenu net. Il est important de rappeler que le minimum vital de ${MINIMUM_VITAL_2026} € est déduit en amont pour garantir que le débiteur conserve un revenu suffisant pour ses besoins essentiels.

Le parent débiteur qui rencontre des difficultés financières temporaires (perte d'emploi, maladie) peut demander une réduction provisoire au juge. En aucun cas, il ne doit cesser unilatéralement de verser la pension, sous peine de poursuites pour abandon de famille.

### Allocations familiales et pension alimentaire

À partir de deux enfants, la famille bénéficie des allocations familiales versées par la CAF. En cas de séparation, les allocations sont en principe versées au parent chez qui les enfants résident habituellement. En garde alternée, les allocations peuvent être partagées entre les deux parents ou versées intégralement à l'un d'entre eux, selon le choix des parents ou la décision du juge.

Les allocations familiales ne sont pas déduites du montant de la pension alimentaire dans le calcul du barème. Toutefois, le juge peut en tenir compte dans son appréciation globale de la situation financière des parents.

### Fiscalité de la pension pour 2 enfants

Le parent débiteur peut déduire l'intégralité de la pension versée pour les deux enfants mineurs de son revenu imposable. Pour les enfants majeurs, la déduction est plafonnée à 6 674 € par enfant et par an. Le parent créancier déclare les sommes reçues comme revenus imposables. En garde alternée, le partage des parts fiscales (0,25 part par enfant pour chacun des deux premiers enfants) compense en partie l'absence de déduction.

### Évolution de la pension dans le temps

La pension pour deux enfants est amenée à évoluer. Lorsque l'aîné atteint la majorité et devient financièrement autonome, le parent débiteur peut demander une révision à la baisse du montant global. La pension pour le cadet demeure inchangée, sauf circonstances nouvelles justifiant une modification. Il est recommandé d'anticiper ces évolutions et de prévoir des clauses de révision dans la convention parentale.
    `.trim(),
    faq: [
      {
        question: 'Combien de pension alimentaire pour 2 enfants avec un salaire de 2 500 € ?',
        reponse:
          "Avec un revenu net de 2 500 € et un DVH classique (un week-end sur deux + moitié des vacances), le barème 2026 donne : (2 500 - 635) x 13,5 % = 251,78 € par enfant, soit 503,55 € au total pour les deux enfants. Ce montant est indicatif et peut être ajusté par le juge.",
      },
      {
        question: 'Peut-on fixer des montants différents pour chaque enfant ?',
        reponse:
          "Oui, le juge peut fixer des montants différenciés pour chaque enfant en fonction de leurs besoins spécifiques (âge, scolarité, santé, activités). Il peut aussi appliquer des taux de DVH différents si les deux enfants n'ont pas le même mode de garde. Les parents peuvent également convenir d'un arrangement personnalisé dans leur convention.",
      },
      {
        question: 'Les allocations familiales sont-elles déduites de la pension pour 2 enfants ?',
        reponse:
          "Non, les allocations familiales ne sont pas déduites du calcul du barème de la pension alimentaire. Toutefois, le juge peut en tenir compte dans son appréciation globale. En cas de garde alternée, les allocations peuvent être partagées entre les deux parents. À partir de 2 enfants, les allocations familiales s'élèvent à environ 141 € par mois en 2026.",
      },
    ],
    exemples: genererExemples(2),
  },
  {
    nombre: 3,
    slug: '3-enfants',
    label: '3 enfants',
    labelLong: 'trois enfants',
    conseil:
      "Pour trois enfants, le montant total de la pension est trois fois le montant unitaire. Le barème ne prévoit pas encore de coefficient dégressif, mais le juge peut adapter le montant global. À partir de trois enfants, les allocations familiales sont plus importantes et la part fiscale par enfant augmente significativement.",
    contenuSeo: `
La pension alimentaire pour trois enfants représente un enjeu financier majeur pour les deux parents. Avec trois enfants à charge, le montant total de la pension peut atteindre un tiers du revenu disponible du parent débiteur dans certaines configurations de DVH, ce qui nécessite une analyse attentive de la situation financière globale de la famille.

### Méthode de calcul pour 3 enfants en 2026

Le barème du Ministère de la Justice applique le même taux unitaire pour chaque enfant, sans coefficient dégressif jusqu'à 6 enfants. La formule reste :

**Pension totale = (Revenu net - ${MINIMUM_VITAL_2026} €) x Taux DVH x 3**

Illustration pour un parent avec un revenu net de 3 000 € et un DVH classique :
- Revenu disponible : 3 000 - ${MINIMUM_VITAL_2026} = **2 365 €**
- Montant par enfant : 2 365 x 13,5 % = **319,28 €**
- Montant total : 319,28 x 3 = **957,83 € par mois**

Ce montant, qui représente près de 32 % du revenu net, illustre la charge financière considérable que peut représenter la pension pour trois enfants. Le juge veille à ce que le parent débiteur conserve des ressources suffisantes pour maintenir un cadre de vie convenable lors de l'accueil des enfants.

### Spécificités des familles avec 3 enfants

**Famille nombreuse** : à partir de trois enfants, la famille bénéficie du statut de famille nombreuse, ouvrant droit à certains avantages (carte famille nombreuse SNCF, réductions diverses). Ce statut est maintenu après la séparation pour le parent qui a la charge principale des enfants.

**Allocations familiales majorées** : les allocations familiales augmentent significativement à partir du troisième enfant. En 2026, pour trois enfants, elles s'élèvent à environ 322 € par mois (montant de base sans condition de ressources). Un complément familial peut s'y ajouter sous conditions de ressources.

**Part fiscale supplémentaire** : le troisième enfant donne droit à une part fiscale entière (au lieu d'une demi-part pour les deux premiers), ce qui représente un avantage fiscal significatif pour le parent qui les rattache à son foyer.

### Gestion pratique de la pension pour 3 enfants

La gestion quotidienne de la pension pour trois enfants nécessite une organisation rigoureuse. Voici les aspects pratiques à considérer :

**Versement unique ou individualisé** : le jugement peut fixer un montant global ou un montant par enfant. L'individualisation est préférable lorsque les enfants ont des besoins très différents ou des modes de garde distincts. Elle facilite également la révision ultérieure lorsqu'un enfant devient autonome.

**Indexation annuelle** : la pension alimentaire est généralement indexée sur l'indice des prix à la consommation (IPC). Cette indexation est automatique et permet de maintenir le pouvoir d'achat de la pension au fil des années. Le parent débiteur doit procéder à la revalorisation chaque année à la date anniversaire du jugement.

**Frais exceptionnels** : au-delà de la pension mensuelle, les parents doivent souvent partager les frais exceptionnels : voyages scolaires, lunettes, appareil dentaire, séjours linguistiques, inscription dans une école privée, etc. La répartition de ces frais est généralement fixée dans le jugement ou la convention (50/50 ou au prorata des revenus).

### Impact de la séparation sur les enfants d'une fratrie de 3

Les psychologues et médiateurs familiaux soulignent l'importance de préserver la cohésion de la fratrie après la séparation. Le juge tend à maintenir les trois enfants ensemble, chez le même parent, sauf circonstances exceptionnelles. Lorsqu'un enfant de la fratrie atteint l'adolescence, il peut exprimer le souhait de changer de résidence principale, ce qui nécessite une adaptation du montant de la pension.

### Cas pratiques fréquents

**Revenus modestes et 3 enfants** : lorsque le parent débiteur dispose de revenus modestes (par exemple 2 000 € nets), la pension totale avec un DVH classique s'élève à environ 553 € (184 € x 3), soit plus de 27 % du revenu net. Le juge peut alors moduler le montant à la baisse pour préserver la capacité du débiteur à accueillir dignement ses enfants.

**Revenus élevés et 3 enfants** : pour un revenu de 5 000 € nets avec un DVH classique, la pension s'élève à environ 1 769 € (589 € x 3). À ce niveau de revenus, le juge peut considérer que le montant du barème est excessif par rapport aux besoins réels des enfants et fixer un montant inférieur.

### Anticiper les évolutions

Avec trois enfants, les besoins évoluent rapidement et de manière différenciée. Il est conseillé de prévoir dans la convention parentale des mécanismes de révision automatique (à l'entrée au collège, au lycée, dans le supérieur) ou de recourir à la médiation familiale pour adapter régulièrement les montants sans passer systématiquement par le juge.
    `.trim(),
    faq: [
      {
        question: 'Quel budget prévoir pour une pension alimentaire de 3 enfants ?',
        reponse:
          "Le montant dépend de vos revenus et du mode de garde. Pour un revenu net de 3 000 € avec un DVH classique, le barème 2026 donne environ 957 € par mois (319 € x 3). Avec un DVH réduit, ce serait 1 277 € (426 € x 3). En garde alternée, la pension serait d'environ 639 € (213 € x 3). Le juge peut ajuster ces montants.",
      },
      {
        question: 'Y a-t-il un plafond de pension alimentaire pour 3 enfants ?',
        reponse:
          "Il n'existe pas de plafond légal pour la pension alimentaire. Cependant, le juge veille à ce que le montant total soit proportionné aux revenus du débiteur et aux besoins réels des enfants. En pratique, la pension ne dépasse que rarement 40 % du revenu net du débiteur, minimum vital déduit. Le juge s'assure que le débiteur conserve un niveau de vie suffisant.",
      },
      {
        question: 'Comment la pension est-elle répartie entre 3 enfants d\'âges différents ?',
        reponse:
          "Le barème indicatif applique le même taux par enfant, quel que soit son âge. Toutefois, le juge peut individualiser les montants : un adolescent au lycée avec des activités coûteuses peut recevoir davantage qu'un enfant en maternelle. Les parents peuvent aussi convenir d'une répartition personnalisée dans leur convention parentale.",
      },
    ],
    exemples: genererExemples(3),
  },
  {
    nombre: 4,
    slug: '4-enfants',
    label: '4 enfants',
    labelLong: 'quatre enfants',
    conseil:
      "Avec quatre enfants, la pension totale représente une charge très importante. Le barème s'applique sans coefficient dégressif, mais le juge peut adapter le montant global pour préserver l'équilibre financier du débiteur. Les allocations familiales et le complément familial constituent des ressources complémentaires importantes.",
    contenuSeo: `
La pension alimentaire pour quatre enfants constitue une situation financière complexe qui nécessite une analyse approfondie des ressources et des besoins de chaque membre de la famille. Avec quatre enfants à charge, le montant total de la pension peut représenter une part très significative du revenu du parent débiteur, rendant l'équilibre budgétaire particulièrement délicat.

### Calcul de la pension pour 4 enfants selon le barème 2026

Le barème du Ministère de la Justice ne prévoit pas de coefficient dégressif pour quatre enfants. Le taux unitaire s'applique intégralement à chaque enfant :

**Pension totale = (Revenu net - ${MINIMUM_VITAL_2026} €) x Taux DVH x 4**

Pour un parent avec un revenu de 3 500 € nets et un DVH classique :
- Revenu disponible : 3 500 - ${MINIMUM_VITAL_2026} = **2 865 €**
- Montant par enfant : 2 865 x 13,5 % = **386,78 €**
- Montant total : 386,78 x 4 = **1 547,10 € par mois**

Ce montant, qui représente 44,2 % du revenu net, montre la nécessité pour le juge d'adapter le barème à la réalité économique de la famille. En pratique, le juge s'écarte souvent du barème indicatif pour les familles de quatre enfants et plus.

### Les enjeux spécifiques des familles de 4 enfants

**Charge financière globale** : avec quatre enfants, les dépenses courantes (alimentation, habillement, logement adapté, transport) sont considérables pour les deux parents. Le juge doit trouver un équilibre entre la contribution du débiteur et sa capacité à maintenir un cadre de vie acceptable lorsqu'il accueille les enfants chez lui. Un logement suffisamment grand pour quatre enfants représente un coût important.

**Besoins différenciés** : dans une fratrie de quatre enfants, les écarts d'âge peuvent être importants. Les besoins d'un enfant de 3 ans et d'un adolescent de 16 ans sont très différents. Le juge peut individualiser les montants pour refléter ces disparités.

**Économies d'échelle** : bien que le barème ne les intègre pas formellement, les économies d'échelle existent dans une famille nombreuse (vêtements transmis, chambre partagée, achats groupés). Le juge peut en tenir compte dans son appréciation.

### Aides et allocations pour les familles de 4 enfants

Les familles de quatre enfants bénéficient d'aides significatives de la CAF :

- **Allocations familiales** : environ 463 € par mois pour quatre enfants en 2026 (montant de base).
- **Complément familial** : environ 190 € par mois sous conditions de ressources, versé aux familles d'au moins trois enfants de plus de 3 ans.
- **Allocation de rentrée scolaire (ARS)** : versée sous conditions de ressources pour chaque enfant scolarisé de 6 à 18 ans.
- **Carte famille nombreuse** : réductions sur les transports SNCF et divers services.

Ces aides ne sont pas déduites de la pension dans le barème, mais le juge peut en tenir compte dans son évaluation globale. Elles sont en principe versées au parent chez qui les enfants résident habituellement.

### Stratégies de gestion financière

Avec quatre enfants, une organisation financière rigoureuse est indispensable :

**Compte dédié** : certains parents ouvrent un compte bancaire dédié aux dépenses des enfants, alimenté par la pension et les allocations. Cette transparence facilite le suivi et réduit les conflits.

**Convention détaillée** : il est recommandé de rédiger une convention parentale précise, détaillant les frais couverts par la pension, les frais exceptionnels partagés et leur mode de répartition (50/50, au prorata des revenus).

**Médiation familiale** : en cas de désaccord sur le montant ou la répartition des charges, la médiation familiale est particulièrement recommandée pour les familles nombreuses. Elle permet de trouver des solutions adaptées sans recourir systématiquement au juge.

### La garde alternée avec 4 enfants

La garde alternée pour quatre enfants pose des défis logistiques et financiers importants. Chaque parent doit disposer d'un logement suffisamment grand pour accueillir quatre enfants, ce qui génère des charges de logement élevées. En garde alternée, le taux de la pension est réduit à ${(TAUX_PAR_ENFANT.garde_alternee * 100).toFixed(1)} % par enfant, mais une pension peut tout de même être due si les revenus des parents sont déséquilibrés.

La garde alternée présente l'avantage de permettre le partage des allocations familiales et des parts fiscales, ce qui peut contribuer à l'équilibre financier global. Cependant, elle implique une coordination étroite entre les deux foyers, particulièrement en ce qui concerne les activités scolaires et extrascolaires de chaque enfant.

### Évolution de la pension dans le temps

Avec quatre enfants, la pension est amenée à évoluer fréquemment. L'accession progressive de chaque enfant à l'autonomie financière réduit le montant total. Il est judicieux de prévoir des paliers de révision dans la convention, par exemple à la majorité de chaque enfant ou à la fin de ses études. Une clause de révision automatique évite de multiplier les procédures judiciaires.
    `.trim(),
    faq: [
      {
        question: 'La pension pour 4 enfants est-elle vraiment 4 fois celle d\'un enfant unique ?',
        reponse:
          "Selon le barème indicatif, oui : le taux par enfant est identique pour 1 à 6 enfants, sans coefficient dégressif. Cependant, en pratique, le juge aux affaires familiales adapte souvent le montant pour les familles nombreuses, en tenant compte des économies d'échelle et de la capacité financière réelle du débiteur. Le montant total dépasse rarement 40 % du revenu net.",
      },
      {
        question: 'Quelles aides de la CAF complètent la pension pour 4 enfants ?',
        reponse:
          "Pour quatre enfants, vous pouvez percevoir : les allocations familiales (environ 463 €/mois), le complément familial (environ 190 €/mois sous conditions), l'allocation de rentrée scolaire, et l'ASF (allocation de soutien familial) en cas de non-paiement de la pension. La carte famille nombreuse donne aussi droit à des réductions sur les transports.",
      },
      {
        question: 'Comment organiser la garde alternée avec 4 enfants ?',
        reponse:
          "La garde alternée de 4 enfants nécessite que chaque parent dispose d'un logement adapté (au moins 3 chambres). Le taux de pension est réduit à 9 % par enfant en garde alternée, soit 36 % du revenu disponible au total. Les allocations familiales peuvent être partagées. Une convention détaillée organisant les aspects pratiques (transport, activités, santé) est indispensable.",
      },
    ],
    exemples: genererExemples(4),
  },
  {
    nombre: 5,
    slug: '5-enfants',
    label: '5 enfants',
    labelLong: 'cinq enfants',
    conseil:
      "Pour cinq enfants, le montant cumulé de la pension est très élevé. Bien que le barème ne prévoie pas encore de coefficient dégressif, le juge adapte quasi systématiquement le montant à la capacité contributive réelle du débiteur. La médiation familiale est fortement recommandée pour trouver un équilibre viable.",
    contenuSeo: `
La pension alimentaire pour cinq enfants est une situation relativement rare mais financièrement très significative. Les familles de cinq enfants ou plus représentent moins de 3 % des séparations, mais elles nécessitent une attention particulière en raison de l'importance des montants en jeu et de la complexité de l'organisation familiale post-séparation.

### Le calcul théorique pour 5 enfants

Le barème 2026 ne prévoit aucun coefficient dégressif jusqu'à 6 enfants. En théorie, le calcul est le suivant :

**Pension totale = (Revenu net - ${MINIMUM_VITAL_2026} €) x Taux DVH x 5**

Pour un revenu de 4 000 € nets avec un DVH classique :
- Revenu disponible : 4 000 - ${MINIMUM_VITAL_2026} = **3 365 €**
- Montant par enfant : 3 365 x 13,5 % = **454,28 €**
- Montant total : 454,28 x 5 = **2 271,38 € par mois**

Ce montant théorique de 2 271 € représente 56,8 % du revenu net, ce qui est manifestement excessif. C'est pourquoi le juge s'écarte presque systématiquement du barème pour les familles très nombreuses.

### L'adaptation judiciaire du barème

Pour cinq enfants, le juge aux affaires familiales prend en compte de nombreux facteurs au-delà du barème indicatif :

**Capacité contributive réelle** : le juge calcule le reste à vivre du parent débiteur après déduction de la pension et de ses charges incompressibles (logement, transport, alimentation). Le débiteur doit conserver un niveau de vie suffisant pour accueillir dignement ses enfants lors des droits de visite.

**Besoins réels des enfants** : plutôt que d'appliquer mécaniquement le barème, le juge évalue les besoins concrets de chaque enfant et le coût réel de leur entretien. Les économies d'échelle dans une famille de cinq enfants sont significatives (logement, alimentation en quantité, vêtements transmis entre les enfants).

**Revenus du parent créancier** : l'article 371-2 du Code civil prévoit que la contribution est fixée en proportion des ressources de chaque parent. Si le parent créancier dispose de revenus confortables, le montant de la pension peut être réduit.

### Organisation pratique après la séparation

La séparation d'une famille de cinq enfants nécessite une organisation logistique importante :

**Le logement** : chaque parent doit disposer d'un logement suffisamment grand. Pour cinq enfants, un minimum de quatre chambres est nécessaire, ce qui implique des charges de logement élevées dans les deux foyers. Le juge en tient compte dans la fixation de la pension.

**Les transports** : avec cinq enfants, les déplacements entre les deux domiciles sont complexes et coûteux, surtout si les parents ne vivent pas à proximité. Un véhicule adapté (monospace, 7 places) est souvent nécessaire.

**La scolarité** : cinq enfants impliquent potentiellement cinq établissements scolaires différents, cinq emplois du temps à coordonner, cinq inscriptions à des activités extrascolaires. La convention parentale doit organiser précisément la répartition de ces charges.

### Aides spécifiques pour les très grandes familles

Au-delà des allocations familiales de base (environ 604 € par mois pour 5 enfants), les familles très nombreuses peuvent bénéficier de :

- **Le complément familial majoré** : sous conditions de ressources très strictes.
- **L'AEEH** : allocation d'éducation de l'enfant handicapé, si l'un des enfants est en situation de handicap.
- **Les bourses scolaires** : les critères d'attribution tiennent compte du nombre d'enfants et favorisent les familles nombreuses.
- **Les aides au logement** : le montant des APL ou ALF est majoré en fonction du nombre d'enfants.

### Stratégies de négociation

Pour les familles de cinq enfants, la négociation amiable ou la médiation familiale sont fortement recommandées :

**Approche globale** : plutôt que de fixer une pension par enfant, les parents peuvent convenir d'un montant global couvrant l'ensemble des besoins de la fratrie, avec une clause de révision à chaque changement de situation (majorité d'un enfant, changement de mode de garde, variation de revenus).

**Partage des frais** : une convention détaillée peut prévoir le partage précis des frais spécifiques (frais médicaux, activités, vacances, vêtements) au-delà de la pension de base, au prorata des revenus de chaque parent.

**Clause d'indexation** : l'indexation annuelle sur l'indice des prix à la consommation est automatique. Mais pour cinq enfants, il est judicieux de prévoir des mécanismes de révision plus fréquents.

### Perspectives d'évolution

Avec cinq enfants d'âges différents, la pension est en constante évolution. La stratégie la plus prudente consiste à anticiper les étapes-clés : entrée au collège et au lycée de chaque enfant, début des études supérieures, entrée dans la vie active. Chaque étape peut justifier une réévaluation du montant. La planification financière à long terme, idéalement avec l'aide d'un conseiller, est recommandée pour les deux parents.
    `.trim(),
    faq: [
      {
        question: 'Le juge applique-t-il vraiment le barème pour 5 enfants ?',
        reponse:
          "En pratique, non. Le barème indicatif donnerait des montants totaux souvent supérieurs à 50 % du revenu net du débiteur, ce qui n'est pas viable. Le juge s'en écarte pour fixer un montant adapté à la capacité contributive réelle du parent. Il évalue les besoins concrets des enfants et les économies d'échelle d'une famille nombreuse.",
      },
      {
        question: 'Quel montant de pension alimentaire prévoir pour 5 enfants avec un salaire de 3 000 € ?',
        reponse:
          "Le barème indicatif donnerait 1 597 € (319 € x 5) avec un DVH classique, soit 53 % du revenu. En pratique, le juge fixerait un montant inférieur, généralement entre 900 € et 1 200 € au total, selon les charges et les besoins réels. La médiation familiale est recommandée pour trouver un accord adapté.",
      },
      {
        question: 'Comment réduire le montant de la pension quand les enfants grandissent ?',
        reponse:
          "Chaque fois qu'un enfant devient financièrement autonome (fin d'études, premier emploi), le parent débiteur peut saisir le juge pour demander une réduction proportionnelle. Il est conseillé de prévoir dans la convention parentale des clauses de révision automatique liées aux étapes-clés de chaque enfant.",
      },
    ],
    exemples: genererExemples(5),
  },
  {
    nombre: 6,
    slug: '6-enfants',
    label: '6 enfants',
    labelLong: 'six enfants',
    conseil:
      "Six enfants représentent le seuil maximal avant l'application du coefficient dégressif. Le montant total est très élevé et le juge adapte systématiquement le barème à la réalité économique. Une approche concertée entre les parents, idéalement accompagnée par un médiateur familial, est indispensable.",
    contenuSeo: `
La pension alimentaire pour six enfants représente le cas limite du barème du Ministère de la Justice sans application de coefficient dégressif. C'est à partir de sept enfants que le taux unitaire est réduit par un coefficient multiplicateur. Pour six enfants, le taux plein s'applique en théorie, mais la réalité judiciaire impose presque toujours des ajustements significatifs.

### Calcul théorique pour 6 enfants (barème 2026)

Le barème prévoit un coefficient de 1,0 (pas de dégressivité) pour 6 enfants :

**Pension totale = (Revenu net - ${MINIMUM_VITAL_2026} €) x Taux DVH x 6**

Pour un revenu de 4 000 € nets avec un DVH classique :
- Revenu disponible : 4 000 - ${MINIMUM_VITAL_2026} = **3 365 €**
- Montant par enfant : 3 365 x 13,5 % = **454,28 €**
- Montant total : 454,28 x 6 = **2 725,65 € par mois**

Ce montant représente 68,1 % du revenu net, ce qui est manifestement inapplicable. Ce calcul illustre les limites du barème indicatif pour les très grandes familles et la nécessité de l'adaptation judiciaire.

### La réalité judiciaire pour les familles de 6 enfants

Les familles de six enfants ou plus sont statistiquement très rares dans les séparations (moins de 1 % des affaires familiales). Lorsqu'elles se présentent, le juge aux affaires familiales adopte une approche pragmatique :

**Évaluation budgétaire complète** : le juge demande aux deux parents de produire un budget détaillé de leurs charges et de leurs revenus. Il fixe ensuite la pension en fonction de la capacité contributive effective du débiteur, après prise en compte de ses charges incompressibles.

**Besoins évalués globalement** : plutôt que de multiplier mécaniquement un montant par enfant par six, le juge évalue le coût global de l'entretien de six enfants chez le parent créancier, en tenant compte des économies d'échelle significatives (logement, alimentation, vêtements transmis, activités partagées).

**Plafonnement de fait** : en pratique, la pension totale pour six enfants dépasse rarement 35 à 40 % du revenu net du débiteur. Le juge veille à préserver la capacité du parent débiteur à maintenir un niveau de vie décent et à accueillir ses enfants dans des conditions satisfaisantes.

### Le seuil du coefficient dégressif

Six enfants constituent le dernier palier avant l'introduction du coefficient dégressif dans le barème :
- **1 à 6 enfants** : coefficient 1,0 (taux plein)
- **7 enfants** : coefficient 0,95
- **8 enfants** : coefficient 0,90
- **9 enfants** : coefficient 0,85
- **10 enfants et plus** : coefficient 0,80 (plancher 0,75)

Ce mécanisme reconnaît que la charge par enfant diminue au-delà d'un certain seuil en raison des économies d'échelle. Pour six enfants, même si le coefficient est encore à 1,0, le juge anticipe cette logique dans son appréciation.

### Aides et dispositifs pour les familles de 6 enfants

Les familles de six enfants bénéficient d'un ensemble conséquent d'aides sociales :

- **Allocations familiales** : environ 745 € par mois pour 6 enfants (montant de base 2026).
- **Complément familial** : environ 190 € par mois sous conditions de ressources.
- **Allocation de rentrée scolaire** : versée pour chaque enfant de 6 à 18 ans, soit potentiellement six versements annuels.
- **Aides au logement majorées** : le nombre d'enfants est pris en compte dans le calcul des APL/ALF.
- **Exonérations et avantages fiscaux** : les parts fiscales pour six enfants (2 + 1 + 1 + 0,5 + 0,5 + 0,5 = 5,5 parts pour un parent isolé) représentent un avantage fiscal très significatif.

### Aspects pratiques et logistiques

**Logement** : accueillir six enfants nécessite un logement d'au moins cinq chambres. Deux logements de cette taille (un pour chaque parent) représentent un coût immobilier considérable. Le juge tient compte de cette réalité dans la fixation de la pension.

**Organisation quotidienne** : la gestion du quotidien de six enfants (repas, devoirs, activités, rendez-vous médicaux, transports) est un défi logistique majeur pour le parent qui en a la charge principale. Le temps consacré par le parent créancier à la gestion familiale peut être pris en compte par le juge, notamment s'il limite sa capacité à exercer une activité professionnelle à temps plein.

### Recommandations pour les parents de 6 enfants

**Médiation obligatoire** : avant toute saisine du juge, une tentative de médiation familiale est fortement recommandée (et souvent imposée par le tribunal). Un médiateur spécialisé dans les grandes familles peut aider les parents à construire un accord équilibré.

**Convention exhaustive** : la convention parentale doit être extrêmement détaillée, couvrant non seulement la pension mais aussi la répartition des frais spécifiques de chaque enfant, les modalités de garde, les vacances et les situations exceptionnelles.

**Accompagnement professionnel** : pour les familles de six enfants, l'accompagnement par un avocat spécialisé en droit de la famille est indispensable. La complexité de la situation financière et logistique justifie un conseil juridique personnalisé pour protéger les intérêts de chaque parent et de chaque enfant.

**Planification financière** : un conseiller financier ou un comptable peut aider les deux parents à planifier leur budget post-séparation, en intégrant les pensions, les allocations, les charges et les perspectives d'évolution. Cette planification à long terme est essentielle pour éviter les situations d'impayés et les conflits récurrents.
    `.trim(),
    faq: [
      {
        question: 'Le barème est-il réaliste pour 6 enfants ?',
        reponse:
          "Non, le barème indicatif donne des montants totaux souvent supérieurs à 60 % du revenu net, ce qui est inapplicable. Le juge s'en écarte systématiquement pour fixer un montant adapté, généralement plafonné entre 35 % et 40 % du revenu net du débiteur. L'évaluation se fait au cas par cas en fonction des besoins réels des enfants et des capacités du parent.",
      },
      {
        question: 'À partir de combien d\'enfants le coefficient dégressif s\'applique-t-il ?',
        reponse:
          "Le coefficient dégressif du barème s'applique à partir de 7 enfants (coefficient 0,95). Pour 1 à 6 enfants, le coefficient est de 1,0 (taux plein). Cependant, même sans coefficient dégressif formel, le juge adapte le montant pour les familles nombreuses en tenant compte des économies d'échelle et de la capacité contributive réelle du parent débiteur.",
      },
      {
        question: 'Quelles aides existent pour un parent seul avec 6 enfants ?',
        reponse:
          "Un parent isolé avec 6 enfants peut bénéficier : des allocations familiales (environ 745 €/mois), du complément familial (environ 190 €/mois sous conditions), de l'ASF en cas de non-paiement de la pension, des aides au logement majorées, de l'allocation de rentrée scolaire pour chaque enfant scolarisé, et de nombreuses aides locales (CCAS, départementales). L'ensemble peut représenter plus de 1 000 €/mois.",
      },
    ],
    exemples: genererExemples(6),
  },
];

/** Retourne les données d'une page enfant par son slug */
export function getEnfantBySlug(slug: string): EnfantPageData | undefined {
  return ENFANTS_DATA.find((e) => e.slug === slug);
}

/** Retourne tous les slugs pour getStaticPaths */
export function getAllEnfantsSlugs(): string[] {
  return ENFANTS_DATA.map((e) => e.slug);
}
