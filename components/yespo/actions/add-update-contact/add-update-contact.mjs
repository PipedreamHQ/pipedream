import { parseObject } from "../../common/utils.mjs";
import yespo from "../../yespo.app.mjs";

export default {
  key: "yespo-add-update-contact",
  name: "Add or Update Contact",
  description: "Adds a new contact or updates an existing one. [See the documentation](https://docs.yespo.io/reference/addcontact-1)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    yespo,
    firstName: {
      type: "string",
      label: "First Name",
      description: "Contact's first name.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Contact's last name.",
      optional: true,
    },
    channels: {
      type: "string[]",
      label: "Channels",
      description: "Channels for the contact. For example: `[ { \"device\": { \"appId\": \"83b77a49-fc28-409b-aeaa-68c9d544ab9d\", \"deviceModel\": \"iPhone\", \"os\": \"iOS\", \"locale\": \"en_UK\", \"clientVersion\": \"native\", \"appVersion\": \"1.23.45\", \"active\": true }, \"type\": \"email\", \"value\": \"pipedream@test.com\" } ]`. [See the documentation to further information](https://docs.yespo.io/reference/addcontact-1)",
    },
    addressRegion: {
      type: "string",
      label: "Region",
      description: "The address region.",
      optional: true,
    },
    addressTown: {
      type: "string",
      label: "Town",
      description: "The address city.",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "The address line.",
      optional: true,
    },
    addressPostcode: {
      type: "string",
      label: "Postcode",
      description: "Postal/ZIP code.",
      optional: true,
    },
    additionalFields: {
      type: "object",
      label: "Additional Fields",
      description: "Values of the additional fields for a contact. Keys are additional field ID.",
      optional: true,
    },
    addressBookId: {
      type: "string",
      label: "Address Book Id",
      description: "The address book unique identifier.",
      optional: true,
    },
    contactId: {
      propDefinition: [
        yespo,
        "contactId",
      ],
      optional: true,
    },
    externalCustomerId: {
      type: "string",
      label: "External Customer Id",
      description: "External contact id.",
      optional: true,
    },
    contactKey: {
      type: "string",
      label: "Contact Key",
      description: "Contact's key.",
      optional: true,
    },
    languageCode: {
      type: "string",
      label: "Language Code",
      description: "Language code for the contact.",
      optional: true,
    },
    timeZone: {
      type: "string",
      label: "TimeZone",
      description: "The contact's time zone. See [TZ database name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).",
      optional: true,
    },
  },
  async run({ $ }) {
    const fields = [];
    if (this.additionalFields) {
      for (const [
        key,
        value,
      ] of Object.entries(this.additionalFields)) {
        fields.push({
          [key]: value,
        });
      }
    }

    const data = {
      firstName: this.firstName,
      lastName: this.lastName,
      channels: this.channels && parseObject(this.channels),
      address: {
        region: this.addressRegion,
        town: this.addressTown,
        address: this.address,
        postcode: this.addressPostcode,
      },
      addressBookId: this.addressBookId,
      contactId: this.contactId,
      externalCustomerId: this.externalCustomerId,
      contactKey: this.contactKey,
      languageCode: this.languageCode,
      timeZone: this.timeZone,
      fields,
    };

    const response = await this.yespo.addOrUpdateContact({
      $,
      data,
    });
    $.export("$summary", `Successfully added or updated the contact with Id: ${response.id}`);
    return response;
  },
};
