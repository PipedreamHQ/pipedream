const CARRIER_OPTIONS: {
  label: string;
  value: string;
}[] = [
  {
    label: "Angel DE",
    value: "angel_de",
  },
  {
    label: "Cargo International",
    value: "cargo_international",
  },
  { label: "DHL", value: "dhl" },
  { label: "DHL Express", value: "dhl_express" },
  { label: "dpag", value: "dpag" },
  { label: "DPD", value: "dpd" },
  { label: "GLS", value: "gls" },
  { label: "go", value: "go" },
  { label: "hermes", value: "hermes" },
  { label: "iloxx (MyDPD Business", value: "iloxx" },
  { label: "PARCEL.ONE", value: "parcel_one" },
  { label: "UPS", value: "ups" },
];

const SERVICE_OPTIONS: string[] = [
  "standard",
  "one_day",
  "one_day_early",
  "returns",
  "asendia_epaq_standard_economy",
  "asendia_epaq_standard_priority",
  "cargo_international_express",
  "dhl_europaket",
  "dhl_prio",
  "dhl_warenpost",
  "dpag_warenpost",
  "dpag_warenpost_signature",
  "dpag_warenpost_untracked",
  "gls_express_0800",
  "gls_express_0900",
  "gls_express_1000",
  "gls_express_1200",
  "ups_express_1200",
];

const WEBHOOK_EVENT_TYPES: string[] = [
  "shipment.*",
  "shipment.status.*",
  "shipment.status.deleted",
  "shipment.tracking.*",
  "shipment.tracking.awaits_pickup_by_receiver",
  "shipment.tracking.canceled",
  "shipment.tracking.delayed",
  "shipment.tracking.delivered",
  "shipment.tracking.destroyed",
  "shipment.tracking.exception",
  "shipment.tracking.label_created",
  "shipment.tracking.not_delivered",
  "shipment.tracking.notification",
  "shipment.tracking.out_for_delivery",
  "shipment.tracking.picked_up",
  "shipment.tracking.transit",
  "shipment.tracking.unknown",
];

export { CARRIER_OPTIONS, SERVICE_OPTIONS, WEBHOOK_EVENT_TYPES };
