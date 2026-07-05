/**
 * Données programmatiques — Pages par type de DVH
 * Utilisé par /pension-alimentaire-[dvh].astro
 */

import { calculatePensionAlimentaire } from './engine';
import { TAUX_PAR_ENFANT, MINIMUM_VITAL_2026, type TypeDVH } from './baremes-2026';

export interface DVHPageData {
  /** Identifiant technique du type de DVH */
  typeDVH: TypeDVH;
  /** Slug URL : "dvh-reduit", "dvh-classique", etc. */
  slug: string;
  /** Titre court */
  titre: string;
  /** Titre long pour la page */
  titreLong: string;
  /** Description courte pour les meta tags */
  metaDescription: string;
  /** Taux par enfant */
  taux: number;
  /** Description du type de DVH */
  description: string;
  /** Contenu SEO détaillé (500+ mots) */
  contenuSeo: string;
  /** Questions FAQ spécifiques */
  faq: { question: string; reponse: string }[];
  /** Exemples pré-calculés : par nombre d'enfants et niveaux de revenu */
  exemples: DVHExemple[];
}

export interface DVHExemple {
  nbEnfants: number;
  labelEnfants: string;
  revenu: number;
  montantParEnfant: number;
  montantTotal: number;
}

const REVENUS_REFERENCE = [2000, 3000, 4000];
const NB_ENFANTS_REFERENCE = [1, 2, 3, 4, 5, 6];

function genererExemplesDVH(typeDVH: TypeDVH): DVHExemple[] {
  const exemples: DVHExemple[] = [];
  for (const revenu of REVENUS_REFERENCE) {
    for (const nb of NB_ENFANTS_REFERENCE) {
      const result = calculatePensionAlimentaire({
        revenuDebiteur: revenu,
        revenuCreancier: 0,
        nbEnfants: nb,
        typeDVH,
      });
      exemples.push({
        nbEnfants: nb,
        labelEnfants: nb === 1 ? '1 enfant' : `${nb} enfants`,
        revenu,
        montantParEnfant: result.montantParEnfant,
        montantTotal: result.montantTotal,
      });
    }
  }
  return exemples;
}

export const DVH_DATA: DVHPageData[] = [
  {
    typeDVH: 'dvh_reduit',
    slug: 'dvh-reduit',
    titre: 'DVH réduit',
    titreLong: 'Pension alimentaire avec DVH réduit (droit de visite minimal)',
    metaDescription:
      'Calculez la pension alimentaire avec un droit de visite et d\'hébergement réduit. Taux de 18 % par enfant selon le barème 2026 du Ministère de la Justice.',
    taux: TAUX_PAR_ENFANT.dvh_reduit,
    description:
      "Le droit de visite et d'hébergement réduit correspond aux situations où le parent non gardien voit l'enfant de manière limitée, sans hébergement régulier ou avec un hébergement très restreint. Le taux de pension est le plus élevé (18 % par enfant) car le parent débiteur n'assume que peu de charges directes au quotidien.",
    contenuSeo: `
Le droit de visite et d'hébergement réduit (DVH réduit) est la modalité de garde qui entraîne le taux de pension alimentaire le plus élevé dans le barème du Ministère de la Justice. Avec un taux de **${(TAUX_PAR_ENFANT.dvh_reduit * 100).toFixed(1)} % du revenu disponible par enfant**, cette configuration reflète le fait que le parent débiteur assume très peu de frais quotidiens pour l'enfant.

### Qu'est-ce que le DVH réduit ?

Le DVH réduit correspond à des situations où le parent non gardien a des contacts limités avec l'enfant. Cela peut prendre plusieurs formes :

- **Droit de visite sans hébergement** : le parent peut voir l'enfant lors de visites encadrées ou libres, mais l'enfant ne dort pas chez lui. Cette situation peut résulter d'un choix parental, de contraintes matérielles (logement inadapté) ou d'une décision du juge.
- **Hébergement très occasionnel** : le parent accueille l'enfant seulement quelques jours par mois ou pendant une partie des vacances scolaires.
- **Droit de visite en milieu protégé** : dans les cas les plus sensibles, le juge peut ordonner un droit de visite médiatisé, c'est-à-dire exercé dans un lieu neutre (point rencontre) en présence d'un tiers professionnel.

### Pourquoi le taux est-il le plus élevé ?

La logique du barème est proportionnelle : plus le parent non gardien passe de temps avec l'enfant, moins il verse de pension, car il assume directement des frais (hébergement, repas, activités). À l'inverse, un DVH réduit signifie que le parent gardien assume l'essentiel des charges quotidiennes de l'enfant. Le taux de 18 % par enfant compense cette prise en charge quasi totale.

Concrètement, pour un revenu net de 2 500 € avec un enfant :
- Revenu disponible : 2 500 - ${MINIMUM_VITAL_2026} = **1 865 €**
- Pension mensuelle : 1 865 x 18 % = **335,70 €**

Ce montant est 33 % plus élevé que celui obtenu avec un DVH classique (251,78 €) et deux fois supérieur à celui en garde alternée (167,85 €).

### Dans quels cas le DVH réduit est-il prononcé ?

Le juge aux affaires familiales prononce un DVH réduit dans plusieurs situations :

**Par accord des parents** : les parents peuvent convenir d'un DVH réduit, par exemple lorsque l'un d'eux vit géographiquement éloigné (mutation professionnelle, résidence à l'étranger) ou lorsque son emploi du temps professionnel ne permet pas un accueil régulier de l'enfant.

**Par décision judiciaire** : le juge peut imposer un DVH réduit lorsqu'il estime que l'intérêt de l'enfant le commande. Les motifs peuvent inclure : des antécédents de violence, des problèmes d'addiction, un logement inadapté du parent non gardien, ou le souhait de l'enfant (si celui-ci est suffisamment mature pour être auditionné).

**Situation transitoire** : le DVH réduit est souvent une mesure temporaire, en attendant que le parent non gardien stabilise sa situation (trouver un logement adapté, suivre un traitement, etc.). Le juge peut réviser le DVH à la demande de l'un des parents.

### Le DVH réduit et la relation parent-enfant

Les professionnels de la famille (psychologues, médiateurs) soulignent l'importance de maintenir un lien de qualité entre le parent et l'enfant, même avec un DVH réduit. Des visites régulières, même courtes, sont préférables à des contacts rares et prolongés. Le parent en DVH réduit peut maintenir le lien par d'autres moyens : appels téléphoniques, visioconférence, correspondance.

La loi du 2 janvier 2002 pose le principe du maintien des relations personnelles entre l'enfant et chacun de ses parents. Le DVH réduit ne doit pas conduire à une rupture du lien parental, mais à un aménagement adapté aux circonstances.

### Évolution du DVH réduit vers d'autres formules

Le DVH réduit n'est pas définitif. Le parent concerné peut demander au juge une extension de son droit de visite et d'hébergement lorsque les circonstances le justifient. Le passage d'un DVH réduit à un DVH classique entraîne une réduction du taux de pension de 18 % à 13,5 % par enfant, soit une diminution significative du montant mensuel. Cette transition peut être progressive, avec une période d'adaptation pour l'enfant.

### Impact financier comparé

Le DVH réduit génère la pension la plus élevée. Pour un parent avec 3 enfants gagnant 3 000 € nets, la différence est considérable :
- DVH réduit : 2 365 x 18 % x 3 = **1 277,10 € / mois**
- DVH classique : 2 365 x 13,5 % x 3 = **957,83 € / mois**
- Garde alternée : 2 365 x 9 % x 3 = **638,55 € / mois**

Le parent qui souhaite réduire sa pension a donc intérêt à demander un élargissement de son DVH, ce qui bénéficie aussi à l'enfant en renforçant la relation parentale.
    `.trim(),
    faq: [
      {
        question: 'Quel est le taux de pension avec un DVH réduit en 2026 ?',
        reponse:
          "Le taux est de 18 % du revenu disponible par enfant. Le revenu disponible est calculé en déduisant le minimum vital de 635 € du revenu net mensuel du parent débiteur. C'est le taux le plus élevé des quatre types de DVH prévus par le barème indicatif du Ministère de la Justice.",
      },
      {
        question: 'Peut-on passer d\'un DVH réduit à un DVH classique ?',
        reponse:
          "Oui, le parent peut saisir le juge aux affaires familiales pour demander un élargissement de son droit de visite et d'hébergement. Il faut justifier d'un changement de circonstances (logement adapté, stabilisation personnelle, etc.). Le passage au DVH classique réduit le taux de pension de 18 % à 13,5 % par enfant.",
      },
      {
        question: 'Le DVH réduit signifie-t-il que le parent ne voit pas son enfant ?',
        reponse:
          "Non, le DVH réduit ne signifie pas l'absence de contact. Il implique des contacts moins fréquents qu'un DVH classique : visites sans hébergement, hébergement occasionnel, ou visites en lieu médiatisé. Le principe légal est le maintien du lien entre l'enfant et chacun de ses parents, sauf danger avéré pour l'enfant.",
      },
    ],
    exemples: genererExemplesDVH('dvh_reduit'),
  },
  {
    typeDVH: 'dvh_classique',
    slug: 'dvh-classique',
    titre: 'DVH classique',
    titreLong: 'Pension alimentaire avec DVH classique (1 WE/2 + ½ vacances)',
    metaDescription:
      'Calculez la pension alimentaire avec un droit de visite classique : 1 week-end sur 2 + moitié des vacances. Taux de 13,5 % par enfant (barème 2026).',
    taux: TAUX_PAR_ENFANT.dvh_classique,
    description:
      "Le DVH classique est la formule la plus courante : le parent non gardien accueille l'enfant un week-end sur deux et la moitié des vacances scolaires. Le taux de pension est de 13,5 % du revenu disponible par enfant.",
    contenuSeo: `
Le droit de visite et d'hébergement classique (DVH classique) est la modalité de garde la plus fréquemment ordonnée par les juges aux affaires familiales en France. Avec un taux de **${(TAUX_PAR_ENFANT.dvh_classique * 100).toFixed(1)} % du revenu disponible par enfant**, il constitue la référence du barème indicatif du Ministère de la Justice.

### Définition du DVH classique

Le DVH classique correspond à un schéma d'accueil standardisé :

- **Un week-end sur deux** : du vendredi soir (sortie d'école ou de travail) au dimanche soir (ou lundi matin si le parent dépose l'enfant à l'école).
- **La moitié des vacances scolaires** : les vacances d'été, de Noël, de février, de printemps et de la Toussaint sont partagées entre les deux parents, en alternant généralement la première et la deuxième moitié d'une année à l'autre.

Ce schéma représente environ 25 % du temps total avec l'enfant pour le parent non gardien, contre 75 % pour le parent gardien. Cette répartition asymétrique justifie le versement d'une pension alimentaire.

### Calcul de la pension avec un DVH classique

La formule est simple et transparente :

**Pension par enfant = (Revenu net - ${MINIMUM_VITAL_2026} €) x 13,5 %**

Exemples concrets :
- **Revenu de 2 000 €** : (2 000 - ${MINIMUM_VITAL_2026}) x 13,5 % = **184,28 €** par enfant/mois
- **Revenu de 3 000 €** : (3 000 - ${MINIMUM_VITAL_2026}) x 13,5 % = **319,28 €** par enfant/mois
- **Revenu de 4 000 €** : (4 000 - ${MINIMUM_VITAL_2026}) x 13,5 % = **454,28 €** par enfant/mois

### Pourquoi le DVH classique est-il le plus courant ?

Plusieurs facteurs expliquent la prédominance du DVH classique dans les décisions judiciaires :

**Stabilité pour l'enfant** : le DVH classique offre un cadre stable à l'enfant qui a un domicile principal identifié. Les repères scolaires, amicaux et d'activités sont préservés, tandis que les moments chez le second parent constituent des parenthèses régulières et prévisibles.

**Praticité pour les parents** : ce schéma est compatible avec la plupart des organisations professionnelles. Le parent non gardien conserve ses semaines complètes pour travailler, tandis que les week-ends et vacances sont consacrés à l'enfant.

**Cadre judiciaire éprouvé** : les juges et les avocats maîtrisent parfaitement cette formule, ce qui facilite les décisions et les négociations. En l'absence d'accord entre les parents, c'est souvent la solution retenue par défaut.

### Les variantes du DVH classique

Le DVH classique peut être aménagé selon les besoins de la famille :

**Avec un mercredi** : le parent non gardien peut accueillir l'enfant le mercredi en journée (ou le mercredi après-midi). Cette variante reste dans le cadre du DVH classique si le temps total reste proche de 25 %.

**Week-end étendu** : le week-end peut être étendu du vendredi au lundi matin, ce qui facilite la logistique pour les parents qui vivent éloignés de l'école.

**Alternance des jours fériés** : les ponts et jours fériés sont généralement partagés selon un calendrier alterné, précisé dans la convention ou le jugement.

### Le DVH classique et le quotidien de l'enfant

Le succès du DVH classique repose sur la qualité de la communication entre les parents. Les spécialistes recommandent :

- Un **cahier de liaison** ou une application de co-parentalité pour transmettre les informations importantes (santé, scolarité, événements).
- Le respect strict des **horaires de transition** pour minimiser le stress de l'enfant.
- La préparation d'un **espace dédié** à l'enfant chez le parent non gardien (sa chambre, ses affaires, ses jouets).
- L'absence de **conflit devant l'enfant** lors des passages d'un foyer à l'autre.

### Transition vers d'autres modes de garde

Le DVH classique peut évoluer dans le temps. Avec la croissance de l'enfant et la maturation de la séparation, les parents peuvent envisager :

- Un passage au **DVH élargi** (avec des jours en semaine supplémentaires), ce qui réduit le taux de pension de 13,5 % à 11,5 %.
- Un passage à la **garde alternée** (une semaine sur deux), ce qui réduit le taux à 9 %. La garde alternée nécessite que les deux parents vivent à proximité et qu'ils soient capables de communiquer efficacement.

Chaque changement de formule nécessite soit un accord des parents (homologué par le juge), soit une décision du juge sur saisine de l'un des parents.

### Questions financières liées au DVH classique

Le parent non gardien en DVH classique supporte des charges liées à l'accueil de l'enfant les week-ends et vacances : alimentation, activités, transport, éventuellement logement adapté. Ces charges ne sont pas déduites de la pension dans le barème, mais le juge peut en tenir compte si elles sont exceptionnellement élevées (par exemple, éloignement géographique impliquant des frais de transport importants).

La pension versée avec un DVH classique est intégralement déductible du revenu imposable du parent débiteur (pour les enfants mineurs). Le parent créancier doit déclarer les sommes reçues comme revenus imposables.
    `.trim(),
    faq: [
      {
        question: 'Comment fonctionne le DVH classique au quotidien ?',
        reponse:
          "Le DVH classique prévoit que l'enfant est chez le parent non gardien un week-end sur deux (du vendredi soir au dimanche soir) et la moitié des vacances scolaires. L'enfant passe environ 25 % de son temps chez le parent non gardien. Les modalités exactes (horaires, jour de transition) sont précisées dans le jugement ou la convention parentale.",
      },
      {
        question: 'Quel est le montant moyen de la pension avec un DVH classique ?',
        reponse:
          "Le montant dépend du revenu du parent débiteur. Le taux est de 13,5 % du revenu disponible (revenu net moins 635 € de minimum vital) par enfant. Pour un revenu de 2 500 €, cela donne environ 252 € par enfant et par mois. Le montant moyen constaté en France avec un DVH classique est d'environ 170 € à 350 € par enfant.",
      },
      {
        question: 'Peut-on modifier un DVH classique en garde alternée ?',
        reponse:
          "Oui, les parents peuvent demander au juge de passer d'un DVH classique à une garde alternée. Il faut que les conditions soient réunies : proximité géographique des deux domiciles, capacité de communication entre les parents, logement adapté chez chaque parent. Ce changement réduit le taux de pension de 13,5 % à 9 % par enfant.",
      },
    ],
    exemples: genererExemplesDVH('dvh_classique'),
  },
  {
    typeDVH: 'dvh_elargi',
    slug: 'dvh-elargi',
    titre: 'DVH élargi',
    titreLong: 'Pension alimentaire avec DVH élargi (droits élargis)',
    metaDescription:
      'Calculez la pension alimentaire avec un droit de visite élargi. Taux de 11,5 % par enfant selon le barème 2026 du Ministère de la Justice.',
    taux: TAUX_PAR_ENFANT.dvh_elargi,
    description:
      "Le DVH élargi correspond à un droit de visite et d'hébergement plus étendu que le DVH classique, avec des jours supplémentaires en semaine. Le taux de pension est de 11,5 % du revenu disponible par enfant.",
    contenuSeo: `
Le droit de visite et d'hébergement élargi (DVH élargi) représente une formule intermédiaire entre le DVH classique et la garde alternée. Avec un taux de **${(TAUX_PAR_ENFANT.dvh_elargi * 100).toFixed(1)} % du revenu disponible par enfant**, il reflète un partage du temps parental plus équilibré, sans atteindre la parité de la résidence alternée.

### Définition du DVH élargi

Le DVH élargi se distingue du DVH classique par un temps d'accueil plus important chez le parent non gardien. Les configurations les plus fréquentes sont :

- **Un week-end sur deux + un ou deux jours en semaine** : par exemple, un week-end sur deux plus le mercredi (journée ou nuit), ce qui porte le temps chez le parent non gardien à environ 30-35 % du temps total.
- **Un week-end sur deux étendu + vacances élargies** : week-ends du vendredi au lundi matin avec une part de vacances supérieure à la moitié.
- **Trois jours par quinzaine hors week-ends** : certains aménagements prévoient des jours en semaine supplémentaires sans modifier le rythme des week-ends.

L'enfant passe globalement entre 30 % et 40 % de son temps chez le parent non gardien, contre 25 % en DVH classique et 50 % en garde alternée.

### Calcul de la pension avec un DVH élargi

**Pension par enfant = (Revenu net - ${MINIMUM_VITAL_2026} €) x 11,5 %**

Exemples :
- **Revenu de 2 000 €** : (2 000 - ${MINIMUM_VITAL_2026}) x 11,5 % = **156,98 €** par enfant/mois
- **Revenu de 3 000 €** : (3 000 - ${MINIMUM_VITAL_2026}) x 11,5 % = **271,98 €** par enfant/mois
- **Revenu de 4 000 €** : (4 000 - ${MINIMUM_VITAL_2026}) x 11,5 % = **386,98 €** par enfant/mois

Comparé au DVH classique (13,5 %), le DVH élargi représente une économie de 2 points de pourcentage par enfant, soit environ 15 % de réduction du montant de la pension.

### Quand le DVH élargi est-il approprié ?

Le DVH élargi convient dans plusieurs situations :

**Parents vivant à proximité** : lorsque les deux parents résident dans la même commune ou à faible distance, le DVH élargi avec des jours en semaine est pratique. L'enfant peut aller à l'école depuis les deux domiciles sans contrainte logistique majeure.

**Parent non gardien très impliqué** : un parent qui souhaite être davantage présent dans le quotidien de l'enfant (aide aux devoirs, activités en semaine, repas) peut demander un DVH élargi. Cette implication renforcée est bénéfique pour l'enfant et justifie un taux de pension réduit.

**Transition vers la garde alternée** : le DVH élargi peut constituer une étape intermédiaire avant la mise en place d'une garde alternée. Il permet à l'enfant et aux parents de s'adapter progressivement à un partage du temps plus équilibré.

**Enfants en âge scolaire** : pour les enfants d'âge scolaire, un DVH élargi incluant le mercredi est particulièrement adapté, car le mercredi est souvent un jour sans école ou avec un emploi du temps allégé.

### Avantages du DVH élargi

Le DVH élargi présente plusieurs avantages par rapport au DVH classique :

**Pour l'enfant** : un contact plus fréquent avec le parent non gardien renforce le lien affectif et offre une plus grande stabilité émotionnelle. L'enfant bénéficie de la présence régulière de ses deux parents, y compris dans son quotidien scolaire.

**Pour le parent non gardien** : une implication plus large dans la vie quotidienne de l'enfant (devoirs, activités, routine du coucher) permet de maintenir un rôle éducatif actif. Le parent non gardien ne se limite plus au rôle de « parent des loisirs » du week-end.

**Pour le parent gardien** : des moments de répit supplémentaires en semaine permettent au parent gardien de mieux concilier vie professionnelle et vie personnelle. La charge mentale est partiellement partagée.

**Financièrement** : le taux réduit de 11,5 % (contre 13,5 % en DVH classique) représente une économie pour le parent débiteur, compensée par les frais directement assumés lors de l'accueil élargi de l'enfant.

### Mise en place pratique

La mise en place d'un DVH élargi nécessite :

**Un accord sur le calendrier** : les parents doivent définir précisément les jours et horaires de l'accueil élargi. Un calendrier annuel partagé (via une application de co-parentalité) est recommandé.

**Un logement adapté** : le parent non gardien doit disposer d'un logement permettant d'accueillir l'enfant en semaine, avec un espace pour les devoirs et le repos. La proximité de l'école est un critère important.

**Une communication fluide** : le DVH élargi implique des transitions plus fréquentes entre les deux foyers. Les parents doivent communiquer efficacement sur les aspects pratiques (repas, devoirs, activités, rendez-vous médicaux).

### Impact sur le montant de la pension

Le passage d'un DVH classique à un DVH élargi réduit la pension d'environ 15 %. Pour un parent avec 2 enfants et un revenu de 3 000 € :
- DVH classique : 2 365 x 13,5 % x 2 = **638,55 €/mois**
- DVH élargi : 2 365 x 11,5 % x 2 = **543,95 €/mois**
- Économie : **94,60 €/mois** (soit 1 135 €/an)

Cette réduction est justifiée par les charges supplémentaires directement assumées par le parent non gardien (repas en semaine, transport supplémentaire, énergie, etc.).
    `.trim(),
    faq: [
      {
        question: 'Quelle est la différence entre le DVH élargi et le DVH classique ?',
        reponse:
          "Le DVH élargi prévoit un temps d'accueil supérieur au DVH classique : en plus d'un week-end sur deux et de la moitié des vacances, le parent non gardien accueille l'enfant un ou plusieurs jours en semaine (typiquement le mercredi). Le taux de pension passe de 13,5 % (classique) à 11,5 % (élargi) par enfant, soit environ 15 % de réduction.",
      },
      {
        question: 'Comment demander un DVH élargi au juge ?',
        reponse:
          "Vous devez saisir le juge aux affaires familiales par requête, en démontrant que le DVH élargi est dans l'intérêt de l'enfant. Les arguments favorables incluent : la proximité géographique, la disponibilité du parent, un logement adapté, et le souhait de l'enfant (s'il est assez âgé). Un avocat peut vous accompagner dans cette démarche.",
      },
      {
        question: 'Le DVH élargi est-il une étape vers la garde alternée ?',
        reponse:
          "Oui, le DVH élargi peut servir de transition vers la garde alternée. Il permet à l'enfant et aux parents de s'habituer progressivement à un partage du temps plus équilibré. Si l'expérience est positive, les parents peuvent ensuite demander au juge de passer en résidence alternée (taux réduit à 9 % par enfant).",
      },
    ],
    exemples: genererExemplesDVH('dvh_elargi'),
  },
  {
    typeDVH: 'garde_alternee',
    slug: 'garde-alternee',
    titre: 'Garde alternée',
    titreLong: 'Pension alimentaire en garde alternée (résidence alternée 50/50)',
    metaDescription:
      'Calculez la pension alimentaire en garde alternée (résidence alternée). Taux de 9 % par enfant selon le barème 2026. Simulateur gratuit et guide complet.',
    taux: TAUX_PAR_ENFANT.garde_alternee,
    description:
      "La garde alternée (ou résidence alternée) correspond à un partage égal du temps de l'enfant entre les deux parents (une semaine sur deux). Le taux de pension est le plus faible (9 % par enfant) car chaque parent assume directement la moitié des frais quotidiens.",
    contenuSeo: `
La garde alternée, juridiquement appelée **résidence alternée**, est le mode de garde qui entraîne le taux de pension alimentaire le plus bas : **${(TAUX_PAR_ENFANT.garde_alternee * 100).toFixed(1)} % du revenu disponible par enfant**. Cette formule, de plus en plus fréquente en France, repose sur un partage égal du temps parental, généralement une semaine sur deux.

### Qu'est-ce que la garde alternée ?

La résidence alternée est le mode de garde dans lequel l'enfant réside alternativement chez chacun de ses parents, selon un rythme régulier. Les configurations les plus courantes sont :

- **Une semaine sur deux** : l'enfant change de domicile chaque semaine, le plus souvent le lundi (transition via l'école) ou le vendredi soir.
- **Deux jours / deux jours / trois jours** : pour les très jeunes enfants, un rythme plus rapide peut être mis en place (2 jours chez un parent, 2 jours chez l'autre, 3 jours chez le premier, puis inversion).
- **Quinze jours / quinze jours** : plus rarement, un rythme bimensuel peut être adopté, notamment lorsque les parents vivent dans des communes différentes.

### Pourquoi une pension en garde alternée ?

Même en garde alternée, une pension alimentaire peut être due. Le barème du Ministère de la Justice prévoit un taux de 9 % par enfant, applicable lorsque les revenus des deux parents sont déséquilibrés. La logique est la suivante :

- Si les deux parents ont des revenus similaires, la pension sera faible ou nulle.
- Si un parent gagne significativement plus que l'autre, une pension est versée pour que l'enfant bénéficie d'un **niveau de vie équivalent** dans les deux foyers.

Le calcul se fait sur le revenu du parent aux revenus les plus élevés. Par exemple, si un parent gagne 4 000 € et l'autre 2 000 € :
- Revenu disponible du parent le mieux rémunéré : 4 000 - ${MINIMUM_VITAL_2026} = **3 365 €**
- Pension par enfant : 3 365 x 9 % = **302,85 €/mois**

### Conditions de mise en place de la garde alternée

La garde alternée nécessite des conditions favorables :

**Proximité géographique** : les deux domiciles doivent être suffisamment proches pour que l'enfant puisse fréquenter la même école, les mêmes activités et maintenir son réseau amical. En pratique, les deux logements sont généralement situés dans la même commune ou dans des communes limitrophes.

**Logement adapté** : chaque parent doit disposer d'un logement suffisant pour accueillir l'enfant dans de bonnes conditions, avec sa propre chambre (ou un espace dédié), ses affaires de base (vêtements, matériel scolaire) dans chaque foyer.

**Communication entre les parents** : la garde alternée exige un niveau élevé de communication et de coopération entre les parents. Les conflits récurrents et l'incapacité à communiquer sont les principaux motifs de refus de la garde alternée par le juge.

**Souhait de l'enfant** : le juge prend en compte l'avis de l'enfant, notamment à partir de l'adolescence. Un enfant qui exprime une préférence forte pour un domicile principal peut conduire le juge à écarter la garde alternée.

### Les avantages de la garde alternée

**Pour l'enfant** : la garde alternée permet à l'enfant de maintenir un lien fort et régulier avec ses deux parents. Des études montrent que les enfants en résidence alternée présentent généralement un meilleur bien-être psychologique que ceux en résidence principale avec DVH, à condition que la garde alternée se déroule sans conflit parental majeur.

**Pour les parents** : chaque parent bénéficie de semaines complètes pour ses activités professionnelles et personnelles, tout en étant pleinement parent lors de sa semaine d'accueil. La charge éducative est partagée de manière équitable.

**Financièrement** : le taux de pension réduit à 9 % (contre 13,5 % en DVH classique) allège la charge du parent débiteur. Les allocations familiales et les parts fiscales peuvent être partagées entre les deux parents, ce qui optimise la situation fiscale globale.

### Les inconvénients et défis

**Coût du double logement** : deux logements adaptés aux enfants représentent un coût immobilier important, surtout dans les grandes villes.

**Logistique** : les transitions hebdomadaires nécessitent une organisation rigoureuse (affaires scolaires, vêtements, médicaments, activités). Le « sac à dos » hebdomadaire est un défi pour les enfants comme pour les parents.

**Stabilité de l'enfant** : certains enfants s'adaptent mal aux changements fréquents de domicile. Les très jeunes enfants (moins de 3 ans) et les adolescents sont les tranches d'âge les plus sensibles.

### Fiscalité de la garde alternée

En garde alternée, les parts fiscales sont partagées entre les deux parents :
- Chaque parent bénéficie de 0,25 part pour les deux premiers enfants et 0,5 part à partir du troisième.
- Les allocations familiales peuvent être versées intégralement à un parent ou partagées (sur demande à la CAF).
- La pension versée en garde alternée n'est **pas déductible** du revenu imposable du parent débiteur si les enfants sont en résidence alternée (puisque chaque parent bénéficie du partage de parts).

Cette règle fiscale est importante : en garde alternée, le parent débiteur ne peut pas à la fois bénéficier du partage de parts et déduire la pension. Il doit choisir la solution la plus avantageuse.

### La garde alternée est-elle toujours assortie d'une pension ?

Non, si les deux parents ont des revenus équivalents, le juge peut décider qu'aucune pension n'est due. Chaque parent assume alors directement les frais de l'enfant pendant sa semaine d'accueil, et les frais communs (scolarité, santé, activités) sont partagés à parts égales.
    `.trim(),
    faq: [
      {
        question: 'Faut-il verser une pension alimentaire en garde alternée ?',
        reponse:
          "Oui, une pension peut être due en garde alternée si les revenus des deux parents sont déséquilibrés. Le barème prévoit un taux de 9 % du revenu disponible par enfant. Si les revenus sont similaires, le juge peut décider qu'aucune pension n'est nécessaire. L'objectif est que l'enfant bénéficie d'un niveau de vie équivalent dans les deux foyers.",
      },
      {
        question: 'Comment sont partagées les allocations familiales en garde alternée ?',
        reponse:
          "En garde alternée, les allocations familiales peuvent être partagées entre les deux parents (50/50) ou versées intégralement à l'un d'entre eux, selon l'accord des parents ou la décision du juge. Pour demander le partage, il faut en faire la demande à la CAF. Les parts fiscales sont automatiquement partagées.",
      },
      {
        question: 'La pension en garde alternée est-elle déductible des impôts ?',
        reponse:
          "La question est complexe. En principe, si les enfants sont en résidence alternée et que chaque parent bénéficie du partage de parts fiscales, la pension n'est pas déductible. Cependant, si un seul parent rattache les enfants (par accord), l'autre peut déduire la pension. Il est recommandé de consulter un conseiller fiscal pour optimiser votre situation.",
      },
    ],
    exemples: genererExemplesDVH('garde_alternee'),
  },
];

/** Retourne les données d'une page DVH par son slug */
export function getDVHBySlug(slug: string): DVHPageData | undefined {
  return DVH_DATA.find((d) => d.slug === slug);
}

/** Retourne tous les slugs pour getStaticPaths */
export function getAllDVHSlugs(): string[] {
  return DVH_DATA.map((d) => d.slug);
}
