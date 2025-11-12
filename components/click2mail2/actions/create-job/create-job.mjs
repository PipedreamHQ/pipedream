import click2mail2 from "../../click2mail2.app.mjs";
import {
  COLOR,
  ENVELOPE,
  LAYOUT,
  MAILCLASS,
  PAPERTYPE,
  PRINTOPTION,
} from "../../common/constants.mjs";

export default {
  key: "click2mail2-create-job",
  name: "Create Job",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Creates a new new job in your account. [See the documentation](https://developers.click2mail.com/reference/post_2).",
  type: "action",
  props: {
    click2mail2,
    documentClass: {
      propDefinition: [
        click2mail2,
        "documentClass",
      ],
    },
    layout: {
      type: "string",
      label: "Layout",
      description: "The specific type of the product",
      options: LAYOUT,
    },
    envelope: {
      type: "string",
      label: "Envelope",
      description: "If this is an enveloped product this determines the envelope in which the product is to be mailed; otherwise provide no value.",
      options: ENVELOPE,
    },
    color: {
      type: "string",
      label: "Color",
      description: "Print in color or black and white.",
      options: COLOR,
    },
    paperType: {
      type: "string",
      label: "Paper Type",
      description: "Sets the paper the mailing is to be printed on.",
      options: PAPERTYPE,
    },
    printOption: {
      type: "string",
      label: "Print Option",
      description: "Sets simplex or duplex printing.",
      options: PRINTOPTION,
    },
    documentId: {
      propDefinition: [
        click2mail2,
        "documentId",
      ],
      optional: true,
    },
    addressId: {
      propDefinition: [
        click2mail2,
        "addressId",
      ],
      optional: true,
    },
    rtnName: {
      type: "string",
      label: "RTN Name",
      description: "Return address Name.",
      optional: true,
    },
    rtnOrganization: {
      type: "string",
      label: "RTN Organization",
      description: "Return address Organization.",
      optional: true,
    },
    rtnaddress1: {
      type: "string",
      label: "RTN Address1",
      description: "Return address line 1.",
      optional: true,
    },
    rtnaddress2: {
      type: "string",
      label: "RTN Address2",
      description: "Return address line 2.",
      optional: true,
    },
    rtnCity: {
      type: "string",
      label: "RTN City",
      description: "Return address City.",
      optional: true,
    },
    rtnState: {
      type: "string",
      label: "RTN State",
      description: "Return address State.",
      optional: true,
    },
    rtnZip: {
      type: "string",
      label: "RTN Zip",
      description: "Return address Zip.",
      optional: true,
    },
    mailClass: {
      type: "string",
      label: "Mail Class",
      description: "Overrides the default of First Class for mailed products.",
      options: MAILCLASS,
      optional: true,
    },
    appSignature: {
      type: "string",
      label: "APP Signature",
      description: "This is a short signature to identify orders that come from your app.",
      optional: true,
    },
    projectId: {
      propDefinition: [
        click2mail2,
        "projectId",
      ],
      optional: true,
    },
    mailingDate: {
      type: "string",
      label: "Mailing Date",
      description: "Used to schedule the mailing date in the future. Format YYYYMMDD. If not provided the order will be mailed on the next available on the next business day. The business day cut off is 8PM EST.",
      optional: true,
    },
    quantity: {
      type: "string",
      label: "Quantity",
      description: "For products that do not use mailing lists. Quantity to print.",
      optional: true,
    },
    jobDocumentId: {
      propDefinition: [
        click2mail2,
        "jobDocumentId",
        ({ documentId }) => ({
          documentId,
        }),
      ],
      optional: true,
    },
    jobAddressId: {
      type: "string",
      label: "Job Address Id",
      description: "Address List Id of the job version.",
      optional: true,
    },
    businessReplyAddressId: {
      type: "integer",
      label: "Business Reply Address Id",
      description: "If you are mailing a business reply mail product use this to specify the busines reply address and permit information already in your account.",
      optional: true,
    },
    courtesyReplyAddressId: {
      type: "integer",
      label: "Courtesy Reply Address Id",
      description: "If you are mailing a courtesy reply mail product use this to specify a courtesy reply address already in your account.",
      optional: true,
    },
    returnAddressId: {
      type: "integer",
      label: "Return Address Id",
      description: "You may use the return address id to specify a return address already in your account.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      click2mail2,
      ...params
    } = this;

    const response = await click2mail2.create({
      $,
      path: "jobs",
      params: {
        productionTime: "Next Day",
        ...params,
      },
    });

    $.export("$summary", `A new job with Id: ${response.id} was successfully created!`);
    return response;
  },
};
