import app from "../../docupost.app.mjs";

export default {
  key: "docupost-mail-letter",
  name: "Mail Letter",
  description: "Sends a physical letter via USPS first class mail. [See the documentation](https://help.docupost.com/help/send-letter-api)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    pdf: {
      type: "string",
      label: "PDF URL",
      description: "A valid PDF URL for the letter content. `10mb` max. 8.5x11 recommended.",
    },
    color: {
      type: "boolean",
      label: "Color",
      description: "Whether the document should be in color. `true` or `false`. Defaults to `false`.",
      optional: true,
    },
    doublesided: {
      type: "string",
      label: "Double-Sided",
      description: "Whether the document should be printed double-sided. `true` or `false`. Defaults to `true`.",
      optional: true,
    },
    mailingClass: {
      type: "string",
      label: "Class",
      description: "Must be `usps_first_class` or `usps_standard`. Defaults to `usps_first_class`.",
      options: [
        "usps_first_class",
        "usps_standard",
      ],
      optional: true,
    },
    servicelevel: {
      type: "string",
      label: "Service Level",
      description: "Only available for `usps_first_class` mailings. Should be blank for non-certified, or `certified` or `certified_return_receipt`.",
      options: [
        {
          value: "",
          label: "Non-Certified",
        },
        {
          value: "certified",
          label: "Certified",
        },
        {
          value: "certified_return_receipt",
          label: "Certified Return Receipt",
        },
      ],
      optional: true,
    },
    toName: {
      propDefinition: [
        app,
        "toName",
      ],
    },
    toAddress1: {
      propDefinition: [
        app,
        "toAddress1",
      ],
    },
    toAddress2: {
      propDefinition: [
        app,
        "toAddress2",
      ],
    },
    toCity: {
      propDefinition: [
        app,
        "toCity",
      ],
    },
    toState: {
      propDefinition: [
        app,
        "toState",
      ],
    },
    toZip: {
      propDefinition: [
        app,
        "toZip",
      ],
    },
    fromName: {
      propDefinition: [
        app,
        "fromName",
      ],
    },
    fromAddress1: {
      propDefinition: [
        app,
        "fromAddress1",
      ],
    },
    fromAddress2: {
      propDefinition: [
        app,
        "fromAddress2",
      ],
    },
    fromCity: {
      propDefinition: [
        app,
        "fromCity",
      ],
    },
    fromState: {
      propDefinition: [
        app,
        "fromState",
      ],
    },
    fromZip: {
      propDefinition: [
        app,
        "fromZip",
      ],
    },
  },
  methods: {
    sendLetter(args = {}) {
      return this.app.post({
        path: "/sendletter",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      sendLetter,
      pdf,
      color,
      doublesided,
      mailingClass,
      servicelevel,
      toName,
      toAddress1,
      toAddress2,
      toCity,
      toState,
      toZip,
      fromName,
      fromAddress1,
      fromAddress2,
      fromCity,
      fromState,
      fromZip,
    } = this;

    const response = await sendLetter({
      $,
      params: {
        pdf,
        color,
        doublesided,
        class: mailingClass,
        servicelevel,
        to_name: toName,
        to_address1: toAddress1,
        to_address2: toAddress2,
        to_city: toCity,
        to_state: toState,
        to_zip: toZip,
        from_name: fromName,
        from_address1: fromAddress1,
        from_address2: fromAddress2,
        from_city: fromCity,
        from_state: fromState,
        from_zip: fromZip,
      },
    });

    $.export("$summary", "Successfully sent letter");
    return response;
  },
};
