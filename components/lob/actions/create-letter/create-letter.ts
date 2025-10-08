import { defineAction } from "@pipedream/types";
import lob from "../../app/lob.app";
import constants from "../../app/common/constants";
import { Letter } from "@lob/lob-typescript-sdk";

export default defineAction({
  key: "lob-create-letter",
  name: "Create Letter",
  description: "Creates a new letter. [See docs here](https://docs.lob.com/#tag/Letters/operation/letter_create).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    lob,
    to: {
      propDefinition: [
        lob,
        "addressId",
      ],
      label: "To",
      description: "Must either be an `addressId` or an inline object with correct address parameters",
    },
    description: {
      type: "string",
      label: "Description",
      description: "An internal description that identifies this resource",
    },
    from: {
      propDefinition: [
        lob,
        "addressId",
      ],
      label: "From",
      description: "Required if `to` address is international. Must either be an `addressId` or an inline object with correct address parameters",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the recipient.",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "Company name associated with the recipient.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the recipient.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the recipient.",
      optional: true,
    },
    addressLine1: {
      type: "string",
      label: "Address Line 1",
      description: "First line of the address.",
      optional: true,
    },
    addressLine2: {
      type: "string",
      label: "Address Line 2",
      description: "Second line of the address.",
      optional: true,
    },
    addressCity: {
      type: "string",
      label: "City",
      description: "City of the address.",
      optional: true,
    },
    addressState: {
      type: "string",
      label: "State",
      description: "State of the address.",
      optional: true,
    },
    addressZip: {
      type: "string",
      label: "ZIP Code",
      description: "ZIP code of the address.",
      optional: true,
    },
    addressCountry: {
      type: "string",
      label: "Country",
      description: "Country of the address.",
      optional: true,
    },
    file: {
      type: "string",
      label: "File",
      description: "Letter content in HTML",
    },
    color: {
      type: "boolean",
      label: "Color",
      description: "Set to true if you want to print in color; set to false for black and white.",
    },
    useType: {
      type: "string",
      label: "Use Type",
      description: "The use type of the mail. It can only be null if an account default use_type is selected).",
      options: constants.USE_TYPES,
    },
    mailType: {
      type: "string",
      label: "Mail Type",
      description: "Designates the mail postage type.",
      options: constants.MAIL_TYPES,
      optional: true,
    },
    sendDate: {
      type: "string",
      label: "Send Date",
      description: "Specifies the date to send the letter off for production (ISO 8601 format, up to 180 days in the future).",
      optional: true,
    },
  },
  async run({ $ }) {
    const response: Letter = await this.lob.createLetter({
      to: this.to ?? {
        name: this.name,
        company: this.company,
        email: this.email,
        phone: this.phone,
        address_line1: this.addressLine1,
        address_line2: this.addressLine2,
        address_city: this.addressCity,
        address_state: this.addressState,
        address_zip: this.addressZip,
        address_country: this.addressCountry,
      },
      description: this.description,
      from: this.from,
      file: this.file,
      color: this.color,
      use_type: this.useType,
      mail_type: this.mailType,
      send_date: this.sendDate,
    });

    $.export("$summary", `Successfully created letter with ID ${response.id}`);

    return response;
  },
});
