import aftership from "../aftership.app.mjs";

export default {
  props: {
    aftership,
    trackingNumber: {
      propDefinition: [
        aftership,
        "trackingNumber",
      ],
    },
    slug: {
      propDefinition: [
        aftership,
        "slug",
      ],
      optional: true,
    },
    title: {
      propDefinition: [
        aftership,
        "title",
      ],
      optional: true,
    },
    smses: {
      propDefinition: [
        aftership,
        "smses",
      ],
      optional: true,
    },
    emails: {
      propDefinition: [
        aftership,
        "emails",
      ],
      optional: true,
    },
    customerName: {
      propDefinition: [
        aftership,
        "customerName",
      ],
      optional: true,
    },
    destinationCountryIso3: {
      propDefinition: [
        aftership,
        "destinationCountryIso3",
      ],
      optional: true,
    },
    orderId: {
      propDefinition: [
        aftership,
        "orderId",
      ],
      optional: true,
    },
    orderIdPath: {
      propDefinition: [
        aftership,
        "orderIdPath",
      ],
      optional: true,
    },
    customFields: {
      propDefinition: [
        aftership,
        "customFields",
      ],
      optional: true,
    },
    orderNumber: {
      propDefinition: [
        aftership,
        "orderNumber",
      ],
      optional: true,
    },
    language: {
      propDefinition: [
        aftership,
        "language",
      ],
      optional: true,
    },
  },
};
