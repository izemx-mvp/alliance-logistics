/**
 * English copy for the 6 services (same structure as services.ts).
 */
import type { ServiceSlug, ServiceText } from "./services";

export const servicesEn: Record<ServiceSlug, ServiceText> = {
  "transport-international": {
    title: "International freight",
    short: "Multimodal import & export — ocean, air and road — organised door to door.",
    intro:
      "We manage your import and export flows end to end: routing, booking, pickup, shipping, customs clearance and final delivery. A single point of contact runs your file, whatever the combination of modes.",
    capabilities: [
      {
        title: "Ocean — FCL",
        text: "Full containers: dry 20'/40'/40'HC, open top, flat rack and reefer, on the main global lanes.",
      },
      {
        title: "Ocean — LCL & break bulk",
        text: "Weekly LCL groupage, break bulk and chartering for specific volumes or project cargo.",
      },
      {
        title: "Air",
        text: "Express and standard solutions, with a 24/7 temperature-controlled air service for sensitive goods.",
      },
      {
        title: "International road",
        text: "FTL, groupage, reefer and tautliner to Europe and Morocco's partner countries.",
      },
      {
        title: "Pharmaceuticals",
        text: "Qualified temperature chains, health documents and dedicated end-to-end monitoring.",
      },
      {
        title: "Dangerous goods",
        text: "IMDG and IATA-DGR classes: classification, packing, documentation and declaration by trained teams.",
      },
      {
        title: "Turnkey logistics",
        text: "We handle the whole operation: transport, customs clearance, insurance and delivery.",
      },
    ],
    steps: [
      {
        title: "Needs analysis",
        text: "Review of your flow: goods, lead times, budget and regulatory constraints.",
      },
      { title: "Planning & booking", text: "Choice of route and mode, booking with carriers." },
      {
        title: "Pickup & shipping",
        text: "Collection from your supplier or customer, consolidation and departure.",
      },
      {
        title: "Clearance & delivery",
        text: "Customs formalities on arrival and final delivery to the address given.",
      },
    ],
    faq: [
      {
        question: "Which transport modes do you handle?",
        answer:
          "Ocean (FCL and LCL), air and international road, alone or combined into a multimodal solution depending on your lead times and budget.",
      },
      {
        question: "Do you handle dangerous goods?",
        answer:
          "Yes, with teams trained in IMDG (ocean) and IATA-DGR (air) classes, from classification to declaration.",
      },
      {
        question: "Can I track my file?",
        answer:
          "Yes. Each file has a tracking number available from the client area on the Tracking page.",
      },
    ],
    chips: [
      "FCL",
      "LCL / groupage",
      "Air freight",
      "International road",
      "IMDG / IATA-DGR",
      "Door to door",
      "Multimodal",
    ],
  },
  "agence-en-douane": {
    title: "Customs brokerage",
    short: "Import & export clearance: declarations, customs procedures and regulatory advice.",
    intro:
      "Our in-house customs brokerage has been the heart of our business for 45 years. We file your import and export customs declarations, secure your customs procedures and advise you on tariff classification and rules of origin.",
    capabilities: [
      {
        title: "Import & export declarations",
        text: "Filing of the DUM (single goods declaration) and related declarations within regulatory deadlines.",
      },
      {
        title: "Customs procedures",
        text: "Temporary admission, transit, bonded warehouse, re-export: we secure the right procedure for your operation.",
      },
      {
        title: "Classification & origin",
        text: "Advice on HS codes, rules of origin and preferential documents (free trade agreements).",
      },
      {
        title: "Document compliance",
        text: "Checking of documents: invoices, packing lists, certificates, licences and permits.",
      },
      {
        title: "Disputes & appeals",
        text: "Support in case of disputes over value, classification or origin, and follow-up of appeals.",
      },
      {
        title: "Regulatory advice",
        text: "Monitoring of changes in Moroccan and international customs regulations.",
      },
    ],
    steps: [
      {
        title: "File reception",
        text: "Collection and review of commercial and technical documents.",
      },
      {
        title: "Declaration filing",
        text: "DUM entry: classification, value, origin and customs procedure.",
      },
      {
        title: "Customs passage",
        text: "Follow-up of the control channel and handling of any inspections.",
      },
      {
        title: "Release order",
        text: "Obtaining the release order and passing it immediately to logistics.",
      },
    ],
    faq: [
      {
        question: "Are you a licensed customs broker?",
        answer:
          "Yes, customs clearance is our original trade: our customs brokerage is part of the company and operates daily at the port and airport of Casablanca.",
      },
      {
        question: "Which documents do I need to provide?",
        answer:
          "Commercial invoice, packing list, transport document and, depending on the goods, specific certificates or permits. We help you complete the file.",
      },
      {
        question: "How long does customs clearance take?",
        answer:
          "It depends on the control channel applied to your declaration. We follow each file in real time and inform you as soon as the goods are released.",
      },
    ],
    chips: [
      "DUM",
      "BADR",
      "Customs procedures",
      "Temporary admission",
      "Preferential origin",
      "HS classification",
      "Release order",
    ],
  },
  "transport-national-entreposage": {
    title: "Domestic transport & warehousing",
    short: "Distribution across Morocco with our own fleet, and secure warehousing.",
    intro:
      "We deliver your goods throughout Morocco with our own transport resources, and offer flexible warehousing space, from a single pallet to a full lot.",
    capabilities: [
      {
        title: "Domestic distribution",
        text: "Delivery across Morocco, from full loads to single pallets.",
      },
      {
        title: "Own assets",
        text: "Fleet and equipment operated in-house: continuity of service and control of lead times.",
      },
      {
        title: "Warehousing",
        text: "Short or long-term storage, with areas suited to sensitive products.",
      },
      {
        title: "Stock management",
        text: "Inbound/outbound tracking, inventories and order preparation.",
      },
      { title: "Groupage & parcels", text: "Optimised rounds and multi-drop deliveries." },
      {
        title: "Port / warehouse shuttle",
        text: "Collection at the port or airport and storage before distribution.",
      },
    ],
    steps: [
      { title: "Goods reception", text: "Collection at the port, airport or supplier." },
      { title: "Warehousing", text: "Reception, inspection and storage in our warehouse." },
      {
        title: "Preparation",
        text: "Picking, packing and consolidation according to your instructions.",
      },
      { title: "Delivery", text: "Distribution across Morocco with proof of delivery." },
    ],
    faq: [
      {
        question: "Do you deliver everywhere in Morocco?",
        answer:
          "Yes, our distribution covers the whole country, for full loads as well as groupage.",
      },
      {
        question: "Do you operate your own vehicles?",
        answer:
          "Yes, it is one of our pillars: we run our own transport and warehousing resources, which guarantees continuity of service.",
      },
      {
        question: "Can goods be stored for a short time?",
        answer:
          "Yes, storage is possible from a few days to several months, depending on your flows.",
      },
    ],
    chips: [
      "Morocco distribution",
      "Own fleet",
      "Storage",
      "Stock management",
      "Picking",
      "Proof of delivery",
    ],
  },
  "agence-maritime": {
    title: "Shipping agency",
    short: "Ship agency and owner representation: port calls, documentation and coordination.",
    intro:
      "We represent shipowners in Casablanca: we coordinate port calls, manage maritime documentation and act as the interface between the vessel, customs and shippers.",
    capabilities: [
      {
        title: "Ship agency",
        text: "Representing the shipowner at the port: formalities, port call and coordination.",
      },
      {
        title: "Maritime documentation",
        text: "Issuing and managing bills of lading (B/L) and ship's documents.",
      },
      {
        title: "Port call follow-up",
        text: "Coordination of pilotage, towage, handling and customs during the call.",
      },
      {
        title: "Shipper relations",
        text: "Interface between the shipowner, shippers and local service providers.",
      },
      {
        title: "Charges & demurrage",
        text: "Follow-up of port call charges and demurrage, and re-invoicing to the parties concerned.",
      },
      {
        title: "Owner reporting",
        text: "Port call reports and budget follow-up for the shipowner.",
      },
    ],
    steps: [
      { title: "Nomination", text: "Taking charge of the call and the shipowner's instructions." },
      { title: "Call preparation", text: "Coordination with authorities, handling and customs." },
      { title: "Operations", text: "Follow-up of loading/unloading and documentation." },
      { title: "Closing & reporting", text: "Port call report and closing of files." },
    ],
    faq: [
      {
        question: "Which ports do you operate in?",
        answer:
          "Mainly the port of Casablanca, in coordination with the other ports of the Kingdom depending on the needs of the shipowners we represent.",
      },
      {
        question: "Do you handle vessel documentation?",
        answer:
          "Yes: bills of lading, manifests and port call documents are issued and tracked by our teams.",
      },
      {
        question: "Do you work for foreign shipowners?",
        answer:
          "Yes, ship agency precisely means representing shipowners before local authorities and customers.",
      },
    ],
    chips: [
      "Ship agency",
      "Port call",
      "Bill of lading (B/L)",
      "Manifest",
      "Port of Casablanca",
      "Shipowners",
    ],
  },
  "transport-frigorifique": {
    title: "Reefer transport",
    short: "Controlled cold chain by sea, air and road, for sensitive goods and pharma.",
    intro:
      "Food, pharmaceuticals or sensitive raw materials: we maintain the cold chain throughout transport, with reefer containers and vehicles monitored continuously.",
    capabilities: [
      {
        title: "Reefer containers",
        text: "Ocean FCL reefer with temperature setting and logging.",
      },
      {
        title: "24/7 reefer air freight",
        text: "Temperature-controlled air freight, available around the clock.",
      },
      {
        title: "Reefer road transport",
        text: "Refrigerated trucks for import, export and domestic distribution.",
      },
      {
        title: "Pharmaceuticals",
        text: "Qualified transport, health documents and compliance with good distribution practice (GDP).",
      },
      { title: "Monitoring & traceability", text: "Temperature logs and end-to-end traceability." },
      {
        title: "Packaging advice",
        text: "Packaging and pre-conditioning recommendations by product.",
      },
    ],
    steps: [
      { title: "Product review", text: "Set temperature, duration, regulations and packaging." },
      { title: "Pre-cooling", text: "Pre-conditioning of the container or vehicle." },
      { title: "Controlled transport", text: "Shipping with temperature and file monitoring." },
      { title: "Delivery & logs", text: "Delivery with temperature logs handed over." },
    ],
    faq: [
      {
        question: "Which temperature ranges do you cover?",
        answer:
          "From chilled positive temperatures to frozen negative temperatures, depending on the product and the transport mode.",
      },
      {
        question: "Do you handle pharmaceuticals?",
        answer:
          "Yes, with qualified chains, dedicated health documentation and reinforced monitoring.",
      },
      {
        question: "How is the temperature monitored?",
        answer:
          "Refrigeration units record the temperature continuously and logs are handed over with the delivery.",
      },
    ],
    chips: [
      "Reefer",
      "Cold chain",
      "Fresh produce",
      "Pharmaceuticals",
      "Temperature logs",
      "24/7 air",
    ],
  },
  "transport-exceptionnel": {
    title: "Oversize transport",
    short: "Oversize convoys and special loads: surveys, permits and convoy management.",
    intro:
      "Industrial machinery, construction equipment, transformers or bulky structures: we organise out-of-gauge transport, from feasibility study to on-site positioning.",
    capabilities: [
      {
        title: "Feasibility study",
        text: "Route survey, clearances, engineering structures and local constraints.",
      },
      {
        title: "Special permits",
        text: "Applications for movement permits and orders for oversize convoys.",
      },
      {
        title: "Suitable equipment",
        text: "Extendable trailers, flat racks and platforms depending on the load.",
      },
      {
        title: "Blocking & lashing",
        text: "Lashing, lifting and securing plans tailored to each load.",
      },
      { title: "Pilot cars & escorts", text: "Convoy management with pilot vehicles and signage." },
      {
        title: "Multimodal coordination",
        text: "Combining road, sea and port handling for project cargo.",
      },
    ],
    steps: [
      { title: "Project study", text: "Dimensions, weight, lifting points and route." },
      { title: "Permits", text: "Obtaining permits and coordinating with authorities." },
      { title: "Execution", text: "Loading, convoying and supervision of the convoy." },
      { title: "Positioning", text: "Unloading and positioning on site, with reports." },
    ],
    faq: [
      {
        question: "What sizes can you transport?",
        answer:
          "Each project is studied case by case: we determine the equipment, route and permits required for your load.",
      },
      {
        question: "Do you handle the paperwork?",
        answer: "Yes, we apply for movement permits and coordinate escorts and pilot vehicles.",
      },
      {
        question: "Do you also organise the sea leg?",
        answer:
          "Yes, the ocean leg (flat rack, chartering) is handled by our international freight team.",
      },
    ],
    chips: ["Out of gauge", "Oversize convoy", "Flat rack", "Permits", "Escort", "Project cargo"],
  },
};
