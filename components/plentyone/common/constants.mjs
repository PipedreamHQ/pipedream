const ORDER_TYPE_OPTIONS = [
  {
    label: "Sales order",
    value: 1,
  },
  {
    label: "Delivery",
    value: 2,
  },
  {
    label: "Returns",
    value: 3,
  },
  {
    label: "Credit note",
    value: 4,
  },
  {
    label: "Warranty",
    value: 5,
  },
  {
    label: "Repair",
    value: 6,
  },
  {
    label: "Offer",
    value: 7,
  },
  {
    label: "Advance order",
    value: 8,
  },
  {
    label: "Multi-order",
    value: 9,
  },
  {
    label: "Multi credit note",
    value: 10,
  },
  {
    label: "Multi delivery",
    value: 11,
  },
  {
    label: "Reorder",
    value: 12,
  },
  {
    label: "Partial delivery",
    value: 13,
  },
  {
    label: "Subscription",
    value: 14,
  },
  {
    label: "Redistribution",
    value: 15,
  },
];

const REASON_OPTIONS = [
  {
    label: "Incoming items",
    value: 101,
  },
  {
    label: "Booked in by stocktaking",
    value: 102,
  },
  {
    label: "Rebooked into stock because no production errors were found",
    value: 104,
  },
  {
    label: "Maculation canceled",
    value: 106,
  },
  {
    label: "Packing error, items are re-booked",
    value: 107,
  },
  {
    label: "Incoming items (logistics)",
    value: 109,
  },
  {
    label: "Incoming items (second choice)",
    value: 115,
  },
  {
    label: "Booked in by correction",
    value: 116,
  },
  {
    label: "Unpacked item",
    value: 117,
  },
  {
    label: "Incoming items (purchase order)",
    value: 180,
  },
  {
    label: "Incoming items (warehousing)",
    value: 181,
  },
];

const OUTGOING_REASON_OPTIONS = [
  {
    label: "Outbound items",
    value: 201,
  },
  {
    label: "Outbound inventur",
    value: 202,
  },
  {
    label: "Outbound rubbish",
    value: 205,
  },
  {
    label: "Outbound packing error",
    value: 206,
  },
  {
    label: "Outbound defect",
    value: 207,
  },
  {
    label: "Outbound complaint",
    value: 208,
  },
  {
    label: "Outbound logistic",
    value: 209,
  },
  {
    label: "Outbound warehouse movement",
    value: 214,
  },
  {
    label: "Outbound second choise",
    value: 215,
  },
  {
    label: "Outbound correction",
    value: 216,
  },
  {
    label: "Outbound purchase order",
    value: 280,
  },
  {
    label: "Outbound loss",
    value: 281,
  },
];

const PAYMENT_STATUS_OPTIONS = [
  {
    label: "Unpaid",
    value: "unpaid",
  },
  {
    label: "Partly paid",
    value: "partlyPaid",
  },
  {
    label: "Fully paid",
    value: "fullyPaid",
  },
  {
    label: "Overpaid",
    value: "overpaid",
  },
];

const ORDER_WITH_OPTIONS = [
  {
    label: "Addresses - The address objects that are associated with the order.",
    value: "addresses",
  },
  {
    label: "Relations - The order relation reference instances that are associated with the order. These instances contain information such as the the reference type, the ID of the reference and the relation itself.",
    value: "relations",
  },
  {
    label: "Comments - The order comments.",
    value: "comments",
  },
  {
    label: "Location - The accounting location of the order.",
    value: "location",
  },
  {
    label: "Payments - The payments that are associated with the order.",
    value: "payments",
  },
  {
    label: "Documents - The documents that are associated with the order.",
    value: "documents",
  },
  {
    label: "Contact Sender - The associated contact for the contact-sender relation.",
    value: "contactSender",
  },
  {
    label: "Contact Receiver - The associated contact for the contact-receiver relation.",
    value: "contactReceiver",
  },
  {
    label: "Warehouse Sender - The associated warehouse for the warehouse-sender relation.",
    value: "warehouseSender",
  },
  {
    label: "Warehouse Receiver - The associated warehouse for the warehouse-receiver relation.",
    value: "warehouseReceiver",
  },
  {
    label: "Order Items Variation - The variation that is associated with the order item.",
    value: "orderItems.variation",
  },
  {
    label: "Order Items Variation Properties - The properties belonging to the variation.",
    value: "orderItems.variation.propertiesV2",
  },
  {
    label: "Order Items Gift Card Codes - The gift card codes that are associated with the order item.",
    value: "orderItems.giftCardCodes",
  },
  {
    label: "Order Items Transactions - The transactions that are associated with the order item.",
    value: "orderItems.transactions",
  },
  {
    label: "Order Items Serial Numbers - The serial numbers that are associated with the order item.",
    value: "orderItems.serialNumbers",
  },
  {
    label: "Order Items Variation Barcodes - The barcodes that are associated with variation of the order item.",
    value: "orderItems.variationBarcodes",
  },
  {
    label: "Order Items Comments - The comments that are associated with the order item.",
    value: "orderItems.comments",
  },
  {
    label: "Origin Order References - The references to other orders, e.g. returns or credit notes, associated with this order.",
    value: "originOrderReferences",
  },
  {
    label: "Shipping Packages - The shipping packages that are associated with the order.",
    value: "shippingPackages",
  },
  {
    label: "Shipping Packages Items - The orderPackageItems associated with the package.",
    value: "shippingPackages.items",
  },
  {
    label: "Shipping Information - The shipping information for the order.",
    value: "shippingInformation",
  },
  {
    label: "Payment Terms - The payment terms that are associated with the order.",
    value: "paymentTerms",
  },
  {
    label: "Order Items Warehouse Locations - The warehouse locations that are associated with the order item.",
    value: "orderItems.warehouseLocations",
  },
];

const PAYMENT_TYPE_OPTIONS = [
  {
    label: "Credit",
    value: "credit",
  },
  {
    label: "Debit",
    value: "debit",
  },
];

const TRANSACTION_TYPE_OPTIONS = [

  {
    label: "Interim transaction report",
    value: 1,
  },
  {
    label: "Booked payment",
    value: 2,
  },
  {
    label: "Split payment",
    value: 3,
  },
];

const LOCK_STATUS_OPTIONS = [
  {
    label: "Unlocked",
    value: "unlocked",
  },
  {
    label: "Permanently locked",
    value: "permanentlyLocked",
  },
  {
    label: "Reversible locked",
    value: "reversibleLocked",
  },
];
export {
  LOCK_STATUS_OPTIONS,
  ORDER_TYPE_OPTIONS,
  ORDER_WITH_OPTIONS,
  OUTGOING_REASON_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
  PAYMENT_TYPE_OPTIONS,
  REASON_OPTIONS,
  TRANSACTION_TYPE_OPTIONS,
};

