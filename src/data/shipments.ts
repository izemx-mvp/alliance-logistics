/**
 * Demo shipments for the /suivi tracking page (demonstration data, no backend).
 * Status index maps onto the shared timeline steps.
 */

export const trackingSteps = [
  "Dossier ouvert",
  "Chargé",
  "En transit",
  "Arrivé au port",
  "En dédouanement",
  "Bon à enlever",
  "Livré",
] as const;

export type ShipmentMode = "Maritime" | "Aérien" | "Routier";

export type ShipmentDocument = {
  label: string;
  description: string;
};

export type Shipment = {
  reference: string;
  client: string;
  mode: ShipmentMode;
  route: { from: string; to: string };
  incoterm: string;
  goods: string;
  eta: string;
  statusIndex: number; // index into trackingSteps
  events: { date: string; label: string }[];
  documents: ShipmentDocument[];
};

export const shipments: Shipment[] = [
  {
    reference: "AL-2026-0142",
    client: "CONTENU EXEMPLE À REMPLACER",
    mode: "Maritime",
    route: { from: "Shanghai, Chine", to: "Casablanca, Maroc" },
    incoterm: "FOB",
    goods: "Équipements industriels — 1 × 40'HC",
    eta: "24/11/2026",
    statusIndex: 3,
    events: [
      { date: "02/11/2026", label: "Dossier ouvert" },
      { date: "06/11/2026", label: "Chargé — enlèvement usine Shanghai" },
      { date: "09/11/2026", label: "En transit — départ navire" },
      { date: "28/11/2026", label: "Arrivée prévue au port de Casablanca" },
    ],
    documents: [
      { label: "BL", description: "Connaissement maritime (B/L)" },
      { label: "Facture", description: "Facture commerciale" },
      { label: "DUM", description: "Déclaration unique des marchandises (en préparation)" },
    ],
  },
  {
    reference: "AL-2026-0157",
    client: "CONTENU EXEMPLE À REMPLACER",
    mode: "Aérien",
    route: { from: "Casablanca, Maroc", to: "Dubaï, Émirats arabes unis" },
    incoterm: "CPT",
    goods: "Composants électroniques — fret aérien express",
    eta: "07/11/2026",
    statusIndex: 5,
    events: [
      { date: "03/11/2026", label: "Dossier ouvert" },
      { date: "04/11/2026", label: "Chargé — réception aéroport CMN" },
      { date: "05/11/2026", label: "En transit — vol CMN → DXB" },
      { date: "06/11/2026", label: "Arrivé à destination" },
      { date: "06/11/2026", label: "En dédouanement — DXB" },
      { date: "07/11/2026", label: "Bon à enlever" },
    ],
    documents: [
      { label: "LTA", description: "Lettre de transport aérien (AWB)" },
      { label: "Facture", description: "Facture commerciale" },
      { label: "DUM", description: "Déclaration unique des marchandises" },
    ],
  },
];

export function findShipment(reference: string): Shipment | undefined {
  const normalized = reference.trim().toUpperCase().replace(/\s+/g, "");
  return shipments.find((s) => s.reference.toUpperCase() === normalized);
}

/** Reference format used by the cotation form success screen. */
export function generateReference(): string {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `AL-2026-${n}`;
}
