import postgrid from "../../postgrid.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "postgrid-create-letter",
  name: "Create Letter",
  description: "Creates a new letter in PostGrid. [See the documentation](https://docs.postgrid.com/#3359155b-f225-4f6a-b08a-eafe7a52b54d)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    postgrid,
    to: {
      propDefinition: [
        postgrid,
        "contactId",
      ],
      label: "To",
      description: "The id or contact object of the receiver.",
    },
    from: {
      propDefinition: [
        postgrid,
        "contactId",
      ],
      label: "From",
      description: "The id or contact object of the sender.",
    },
    html: {
      type: "string",
      label: "HTML",
      description: "The HTML content of the letter.",
    },
    addressPlacement: {
      type: "string",
      label: "Address Placement",
      description: "The location where the address will be placed.",
      options: constants.ADDRESS_PLACEMENT,
      optional: true,
    },
    doubleSided: {
      type: "boolean",
      label: "Double Sided",
      description: "Indicates if the letter is double sided or not.",
      optional: true,
    },
    color: {
      type: "boolean",
      label: "Color",
      description: "Indicates whether the letter will be printed in color or not.",
      optional: true,
    },
    perforatedPage: {
      type: "integer",
      label: "Perforated Page",
      description: "Indicates if the page is to be perforated (holes).",
      optional: true,
    },
    extraService: {
      type: "string",
      label: "Extra Service",
      description: "Indicates extra services for the letter.",
      options: constants.EXTRA_SERVICE,
      optional: true,
    },
    envelopeType: {
      type: "string",
      label: "Envelope Type",
      description: "Indicates the envelope type for the letter.",
      options: constants.ENVELOPE_TYPE,
      optional: true,
    },
    returnEnvelope: {
      propDefinition: [
        postgrid,
        "returnEnvelopeId",
      ],
    },
    sendDate: {
      type: "string",
      label: "Send Date",
      description: "The desired date for the letter to be sent out.  Example: `2023-02-16T15:40:35.873Z`",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description for the letter.",
      optional: true,
    },
    express: {
      type: "boolean",
      label: "Express",
      description: "See express shipping.",
      optional: true,
    },
    mailingClass: {
      type: "string",
      label: "Mailing Class",
      description: "Defaults to first_class. See mailing class.",
      options: constants.MAILING_CLASS,
      optional: true,
    },
    size: {
      type: "string",
      label: "Size",
      description: "Default size will be chosen based on the destination country, if not provided. Indicates the letter size for the letter being created.",
      options: constants.LETTER_SIZE,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      postgrid,
      ...data
    } = this;

    const response = await postgrid.createLetter({
      data,
      $,
    });

    if (response.id) {
      $.export("$summary", `Successfully created letter with ID ${response.id}.`);
    }

    return response;
  },
};
