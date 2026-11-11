import belco from "../../belco.app.mjs";
import { CONTACT_TYPE_OPTIONS } from "../../common/constants.mjs";

export default {
  key: "belco-list-contacts",
  name: "List Contacts",
  description: "List the contacts of a Belco shop, optionally filtered by email address, phone number or contact type."
    + " Use this to look up a recipient's contact ID by email before calling **Create Conversation**, **Send Message** or **Get Contact Details** — or skip the lookup entirely by passing `To Email` to **Create Conversation** / **Send Message**."
    + " Use **List Shop ID Options** to find the shop ID."
    + " Paginate with `Limit` and `Skip`."
    + " [See the documentation](https://developers.belco.io/reference/get_shops-shopid-contacts)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    belco,
    shopId: {
      propDefinition: [
        belco,
        "shopId",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "Only return contacts with this email address (e.g. `jane@example.com`).",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "Only return contacts with this phone number, in E.164 format (e.g. `+31612345678`).",
      optional: true,
    },
    contactType: {
      type: "string",
      label: "Contact Type",
      description: "Only return contacts of this type.",
      options: CONTACT_TYPE_OPTIONS,
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of contacts to return.",
      default: 50,
      min: 1,
      max: 100,
      optional: true,
    },
    skip: {
      type: "integer",
      label: "Skip",
      description: "Number of contacts to skip, for pagination (e.g. `50` for the second page when `Limit` is `50`).",
      default: 0,
      min: 0,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.belco.listContacts({
      $,
      shopId: this.shopId,
      params: {
        email: this.email,
        phoneNumber: this.phoneNumber,
        type: this.contactType,
        limit: this.limit,
        skip: this.skip,
      },
    });

    const count = response?.contacts?.length ?? 0;
    $.export("$summary", `Retrieved ${count} contact${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
