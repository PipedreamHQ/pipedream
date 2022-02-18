// legacy_hash_id: a_rJiLMv
import { axios } from "@pipedream/platform";

export default {
  key: "moosend-add-subscriber",
  name: "Add subscriber",
  description: "Add a subscriber",
  version: "0.1.1",
  type: "action",
  props: {
    moosend: {
      type: "app",
      app: "moosend",
    },
    MailingListID: {
      type: "string",
    },
    name: {
      type: "string",
      optional: true,
    },
    email: {
      type: "string",
      optional: true,
    },
    hasExternalDoubleOptIn: {
      type: "string",
      optional: true,
    },
    customFields: {
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    return await axios($, {
      url: `https://api.moosend.com/v3/subscribers/${this.MailingListID}/subscribe.json`,
      method: "post",
      params: {
        apikey: `${this.moosend.$auth.api_key}`,
      },
      data: {
        name: this.name,
        email: this.email,
        hasExternalDoubleOptIn: this.hasExternalDoubleOptIn,
        customFields: this.customFields,
      },
    });
  },
};
