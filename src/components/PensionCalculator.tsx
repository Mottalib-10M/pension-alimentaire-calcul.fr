import { useState, type FormEvent } from 'react';
import {
  calculatePensionAlimentaire,
  calculatePrestationCompensatoire,
  type PensionResult,
  type PrestationResult,
} from '../lib/engine';
import { DVH_LABELS, type TypeDVH } from '../lib/baremes-2026';

type Tab = 'pension' | 'prestation';

function formatEuro(n: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n);
}

// ──────────────────────────────────────────────
// Tab: Pension Alimentaire
// ──────────────────────────────────────────────

function PensionTab() {
  const [revenuDebiteur, setRevenuDebiteur] = useState('');
  const [revenuCreancier, setRevenuCreancier] = useState('');
  const [nbEnfants, setNbEnfants] = useState('1');
  const [typeDVH, setTypeDVH] = useState<TypeDVH>('dvh_classique');
  const [chargesSpeciales, setChargesSpeciales] = useState('');
  const [result, setResult] = useState<PensionResult | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const res = calculatePensionAlimentaire({
      revenuDebiteur: parseFloat(revenuDebiteur) || 0,
      revenuCreancier: parseFloat(revenuCreancier) || 0,
      nbEnfants: parseInt(nbEnfants) || 0,
      typeDVH,
      chargesSpeciales: parseFloat(chargesSpeciales) || 0,
    });
    setResult(res);
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Revenu net mensuel du débiteur (€)
            </label>
            <input
              type="number"
              min="0"
              step="50"
              required
              value={revenuDebiteur}
              onChange={(e) => setRevenuDebiteur(e.target.value)}
              placeholder="Ex : 2 500"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Revenu net mensuel du créancier (€)
            </label>
            <input
              type="number"
              min="0"
              step="50"
              value={revenuCreancier}
              onChange={(e) => setRevenuCreancier(e.target.value)}
              placeholder="Ex : 1 200"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nombre d'enfants
            </label>
            <input
              type="number"
              min="1"
              max="15"
              required
              value={nbEnfants}
              onChange={(e) => setNbEnfants(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Charges spéciales mensuelles (€)
            </label>
            <input
              type="number"
              min="0"
              step="10"
              value={chargesSpeciales}
              onChange={(e) => setChargesSpeciales(e.target.value)}
              placeholder="0"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Type de droit de visite et d'hébergement (DVH)
          </label>
          <select
            value={typeDVH}
            onChange={(e) => setTypeDVH(e.target.value as TypeDVH)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition"
          >
            {(Object.entries(DVH_LABELS) as [TypeDVH, string][]).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-primary-700 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors cursor-pointer"
        >
          Calculer la pension alimentaire
        </button>
      </form>

      {result && (
        <div className="mt-8 bg-primary-50 border border-primary-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-primary-900 mb-4">
            Résultat indicatif
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-500">Montant par enfant / mois</p>
              <p className="text-2xl font-bold text-primary-700">
                {formatEuro(result.montantParEnfant)}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-500">
                Montant total / mois ({result.nbEnfants} enfant{result.nbEnfants > 1 ? 's' : ''})
              </p>
              <p className="text-2xl font-bold text-secondary-600">
                {formatEuro(result.montantTotal)}
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-1 text-sm text-gray-600">
            <p>Revenu disponible du débiteur : {formatEuro(result.revenuDisponible)}</p>
            <p>Minimum vital déduit : {formatEuro(result.minimumVital)}</p>
            <p>Taux appliqué : {(result.tauxApplique * 100).toFixed(2)} %</p>
          </div>
          <p className="mt-4 text-xs text-gray-500 italic">
            Ce calcul est purement indicatif et basé sur la table de référence du Ministère de la
            Justice. Le montant définitif est fixé par le juge aux affaires familiales (JAF) en
            tenant compte de l'ensemble des circonstances.
          </p>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// Tab: Prestation Compensatoire
// ──────────────────────────────────────────────

function PrestationTab() {
  const [revenuDebiteur, setRevenuDebiteur] = useState('');
  const [revenuCreancier, setRevenuCreancier] = useState('');
  const [dureeMariage, setDureeMariage] = useState('');
  const [ageDebiteur, setAgeDebiteur] = useState('');
  const [result, setResult] = useState<PrestationResult | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const res = calculatePrestationCompensatoire({
      revenuDebiteur: parseFloat(revenuDebiteur) || 0,
      revenuCreancier: parseFloat(revenuCreancier) || 0,
      dureeMariage: parseInt(dureeMariage) || 0,
      ageDebiteur: parseInt(ageDebiteur) || 0,
    });
    setResult(res);
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Revenu net mensuel de l'époux le mieux rémunéré (€)
            </label>
            <input
              type="number"
              min="0"
              step="50"
              required
              value={revenuDebiteur}
              onChange={(e) => setRevenuDebiteur(e.target.value)}
              placeholder="Ex : 4 000"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Revenu net mensuel de l'autre époux (€)
            </label>
            <input
              type="number"
              min="0"
              step="50"
              required
              value={revenuCreancier}
              onChange={(e) => setRevenuCreancier(e.target.value)}
              placeholder="Ex : 1 500"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Durée du mariage (années)
            </label>
            <input
              type="number"
              min="0"
              max="60"
              required
              value={dureeMariage}
              onChange={(e) => setDureeMariage(e.target.value)}
              placeholder="Ex : 15"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Âge du débiteur au moment du divorce
            </label>
            <input
              type="number"
              min="18"
              max="100"
              required
              value={ageDebiteur}
              onChange={(e) => setAgeDebiteur(e.target.value)}
              placeholder="Ex : 50"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-primary-700 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors cursor-pointer"
        >
          Estimer la prestation compensatoire
        </button>
      </form>

      {result && (
        <div className="mt-8 bg-primary-50 border border-primary-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-primary-900 mb-4">
            Estimation indicative
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-500">Estimation basse</p>
              <p className="text-xl font-bold text-gray-600">
                {formatEuro(result.estimationBasse)}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border-2 border-primary-300">
              <p className="text-sm text-gray-500">Capital estimé</p>
              <p className="text-2xl font-bold text-primary-700">
                {formatEuro(result.capitalEstime)}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-500">Estimation haute</p>
              <p className="text-xl font-bold text-gray-600">
                {formatEuro(result.estimationHaute)}
              </p>
            </div>
          </div>
          <div className="mt-4 bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-500">Rente mensuelle équivalente (sur 8 ans)</p>
            <p className="text-xl font-bold text-secondary-600">
              {formatEuro(result.renteMensuelle)} / mois
            </p>
          </div>
          <div className="mt-4 space-y-1 text-sm text-gray-600">
            <p>Différence annuelle de revenus : {formatEuro(result.differenceAnnuelle)}</p>
            <p>Coefficient d'âge appliqué : {result.coefficientAge}</p>
            <p>Durée prise en compte : {result.dureePriseEnCompte} ans</p>
          </div>
          <p className="mt-4 text-xs text-gray-500 italic">
            Cette estimation utilise la méthode indicative des 1/3. Le montant réel est déterminé
            par le juge en tenant compte de la situation globale des époux (patrimoine, sacrifices
            de carrière, état de santé, etc.).
          </p>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────

export default function PensionCalculator() {
  const [activeTab, setActiveTab] = useState<Tab>('pension');

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Tab headers */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('pension')}
          className={`flex-1 py-4 px-6 text-sm font-semibold transition-colors cursor-pointer ${
            activeTab === 'pension'
              ? 'bg-primary-700 text-white'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          Pension alimentaire
        </button>
        <button
          onClick={() => setActiveTab('prestation')}
          className={`flex-1 py-4 px-6 text-sm font-semibold transition-colors cursor-pointer ${
            activeTab === 'prestation'
              ? 'bg-primary-700 text-white'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          Prestation compensatoire
        </button>
      </div>

      {/* Tab content */}
      <div className="p-6 md:p-8">
        {activeTab === 'pension' ? <PensionTab /> : <PrestationTab />}
      </div>
    </div>
  );
}
