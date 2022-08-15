import { OptionsObject } from "./types";

const CARRIER_OPTIONS: OptionsObject[] = [
  {
    label: "Angel DE",
    value: "angel_de",
  },
  {
    label: "Cargo International",
    value: "cargo_international",
  },
  {
    label: "DHL",
    value: "dhl",
  },
  {
    label: "DHL Express",
    value: "dhl_express",
  },
  {
    label: "DPAG",
    value: "dpag",
  },
  {
    label: "DPD",
    value: "dpd",
  },
  {
    label: "GLS",
    value: "gls",
  },
  {
    label: "go",
    value: "go",
  },
  {
    label: "hermes",
    value: "hermes",
  },
  {
    label: "iloxx (MyDPD Business",
    value: "iloxx",
  },
  {
    label: "PARCEL.ONE",
    value: "parcel_one",
  },
  {
    label: "UPS",
    value: "ups",
  },
];

const SERVICE_OPTIONS: OptionsObject[] = [
  {
    label: "Standard",
    value: "standard",
  },
  {
    label: "One Day",
    value: "one_day",
  },
  {
    label: "One Day Early",
    value: "one_day_early",
  },
  {
    label: "Returns",
    value: "returns",
  },
  {
    label: "Asendia e-PAQ Standard Economy",
    value: "asendia_epaq_standard_economy",
  },
  {
    label: "Asendia e-PAQ Standard Priority",
    value: "asendia_epaq_standard_priority",
  },
  {
    label: "Cargo International Express",
    value: "cargo_international_express",
  },
  {
    label: "DHL Europaket",
    value: "dhl_europaket",
  },
  {
    label: "DHL Prio",
    value: "dhl_prio",
  },
  {
    label: "DHL Warenpost",
    value: "dhl_warenpost",
  },
  {
    label: "DPAG Warenpost",
    value: "dpag_warenpost",
  },
  {
    label: "DPAG Warenpost Signature",
    value: "dpag_warenpost_signature",
  },
  {
    label: "DPAG Warenpost Untracked",
    value: "dpag_warenpost_untracked",
  },
  {
    label: "GLS Express 0800",
    value: "gls_express_0800",
  },
  {
    label: "GLS Express 0900",
    value: "gls_express_0900",
  },
  {
    label: "GLS Express 1000",
    value: "gls_express_1000",
  },
  {
    label: "GLS Express 1200",
    value: "gls_express_1200",
  },
  {
    label: "UPS Express 1200",
    value: "ups_express_1200",
  },
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

export {
  CARRIER_OPTIONS, SERVICE_OPTIONS, WEBHOOK_EVENT_TYPES,
};
