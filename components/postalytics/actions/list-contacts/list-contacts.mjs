import postalytics from "../../postalytics.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "postalytics-list-contacts",
  name: "List Contacts",
  description: "Displays a list of contacts in Postalytics. [See the documentation](https://postalytics.docs.apiary.io/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    postalytics,
    page: {
      type: "integer",
      label: "Page",
      description: "The page number to list the contacts from",
      default: 0,
      optional: true,
    },
  },
  async run({ $ }) {
    const contacts = await this.postalytics.listContacts({
      page: this.page,
    });
    $.export("$summary", `Successfully listed contacts from page ${this.page}`);
    return contacts;
  },
};
