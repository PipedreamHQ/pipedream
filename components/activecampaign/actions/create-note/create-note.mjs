// legacy_hash_id: a_zNiJ3R
import { axios } from "@pipedream/platform";

export default {
  key: "activecampaign-create-note",
  name: "Create Note",
  description: "Adds a note, arbitrary information to a contact, deal, or other Active Campaign objects.",
  version: "0.1.2",
  type: "action",
  props: {
    activecampaign: {
      type: "app",
      app: "activecampaign",
    },
    note: {
      type: "string",
      description: "The note's text.",
    },
    reltype: {
      type: "string",
      description: "The related type where the note will be added to. Possible Values: `Activity`, `Deal`, `DealTask`, `Subscriber`, `CustomerAccount`",
      options: [
        "Activity",
        "Deal",
        "DealTask",
        "Subscriber",
        "CustomerAccount",
      ],
    },
    relid: {
      type: "integer",
      description: "Id of the related object where the note is being added.",
    },
  },
  async run({ $ }) {
  // See the API docs: https://developers.activecampaign.com/reference#notes

    if (!this.note || !this.reltype || !this.relid) {
      throw new Error("Must provide note, reltype, and relid parameters.");
    }

    const config = {
      method: "post",
      url: `${this.activecampaign.$auth.base_url}/api/3/notes`,
      headers: {
        "Api-Token": `${this.activecampaign.$auth.api_key}`,
      },
      data: {
        note: {
          note: this.note,
          reltype: this.reltype,
          relid: parseInt(this.relid),
        },
      },
    };
    return await axios($, config);
  },
};
