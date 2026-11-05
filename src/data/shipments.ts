/**
 * Demo shipments for /suivi and /espace-client/dossiers (demonstration data, no backend).
 * `statusIndex` and each event's `step` index into TRACKING_STEP_COUNT steps,
 * whose labels live in the i18n dictionaries (tracking.steps).
 */
import type { Localized } from "@/i18n";

export const TRACKING_STEP_COUNT = 7;

export type ShipmentMode = "Maritime" | "Aérien" | "Routier";

export type ShipmentDocument = {
  label: string;
  description: Localized;
  available: boolean;
};

export type ShipmentEvent = {
  /** ISO date (YYYY-MM-DD). */
  date: string;
  step: number;
  label: Localized;
  location: string;
};

export type Shipment = {
  reference: string;
  client: string;
  mode: ShipmentMode;
  route: { from: Localized; to: Localized };
  incoterm: string;
  goods: Localized;
  /** ISO date. */
  eta: string;
  statusIndex: number;
  events: ShipmentEvent[];
  documents: ShipmentDocument[];
};

export const shipments: Shipment[] = [
  {
    reference: "AL-2026-0142",
    client: "CONTENU EXEMPLE À REMPLACER",
    mode: "Maritime",
    route: {
      from: { fr: "Shanghai, Chine", en: "Shanghai, China" },
      to: { fr: "Casablanca, Maroc", en: "Casablanca, Morocco" },
    },
    incoterm: "FOB",
    goods: {
      fr: "Équipements industriels — 1 × 40'HC",
      en: "Industrial equipment — 1 × 40'HC",
    },
    eta: "2026-11-10",
    statusIndex: 3,
    events: [
      {
        date: "2026-10-08",
        step: 0,
        location: "Casablanca",
        label: {
          fr: "Dossier ouvert — réservation confirmée",
          en: "File opened — booking confirmed",
        },
      },
      {
        date: "2026-10-12",
        step: 1,
        location: "Shanghai",
        label: { fr: "Conteneur chargé à bord", en: "Container loaded on board" },
      },
      {
        date: "2026-10-13",
        step: 2,
        location: "Shanghai",
        label: { fr: "Départ du navire", en: "Vessel departed" },
      },
      {
        date: "2026-11-04",
        step: 3,
        location: "Casablanca",
        label: {
          fr: "Arrivée au port de Casablanca — déchargement",
          en: "Arrived at the port of Casablanca — discharged",
        },
      },
    ],
    documents: [
      {
        label: "B/L",
        available: true,
        description: { fr: "Connaissement maritime", en: "Bill of lading" },
      },
      {
        label: "Facture",
        available: true,
        description: { fr: "Facture commerciale", en: "Commercial invoice" },
      },
      {
        label: "Colisage",
        available: true,
        description: { fr: "Liste de colisage", en: "Packing list" },
      },
      {
        label: "DUM",
        available: false,
        description: {
          fr: "Déclaration unique des marchandises",
          en: "Single goods declaration (DUM)",
        },
      },
    ],
  },
  {
    reference: "AL-2026-0157",
    client: "CONTENU EXEMPLE À REMPLACER",
    mode: "Aérien",
    route: {
      from: { fr: "Casablanca, Maroc", en: "Casablanca, Morocco" },
      to: { fr: "Dubaï, Émirats arabes unis", en: "Dubai, United Arab Emirates" },
    },
    incoterm: "CPT",
    goods: {
      fr: "Composants électroniques — fret aérien express",
      en: "Electronic components — express air freight",
    },
    eta: "2026-11-06",
    statusIndex: 5,
    events: [
      {
        date: "2026-10-30",
        step: 0,
        location: "Casablanca",
        label: { fr: "Dossier ouvert", en: "File opened" },
      },
      {
        date: "2026-10-31",
        step: 1,
        location: "Casablanca (CMN)",
        label: {
          fr: "Réception et chargement à l'aéroport",
          en: "Received and loaded at the airport",
        },
      },
      {
        date: "2026-11-01",
        step: 2,
        location: "CMN → DXB",
        label: { fr: "Vol en cours", en: "In flight" },
      },
      {
        date: "2026-11-02",
        step: 3,
        location: "Dubaï (DXB)",
        label: { fr: "Arrivé à destination", en: "Arrived at destination" },
      },
      {
        date: "2026-11-03",
        step: 4,
        location: "Dubaï (DXB)",
        label: { fr: "Dédouanement à destination", en: "Clearance at destination" },
      },
      {
        date: "2026-11-04",
        step: 5,
        location: "Dubaï (DXB)",
        label: { fr: "Bon à enlever obtenu", en: "Release order obtained" },
      },
    ],
    documents: [
      {
        label: "LTA",
        available: true,
        description: { fr: "Lettre de transport aérien (AWB)", en: "Air waybill (AWB)" },
      },
      {
        label: "Facture",
        available: true,
        description: { fr: "Facture commerciale", en: "Commercial invoice" },
      },
      {
        label: "DUM",
        available: true,
        description: { fr: "Déclaration export", en: "Export declaration" },
      },
    ],
  },
];

export function normalizeReference(reference: string): string {
  return reference.trim().toUpperCase().replace(/\s+/g, "");
}

export function findShipment(reference: string): Shipment | undefined {
  const normalized = normalizeReference(reference);
  return shipments.find((s) => s.reference === normalized);
}

/** Reference format used by the cotation form success screen. */
export function generateReference(): string {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `AL-2026-${n}`;
}
