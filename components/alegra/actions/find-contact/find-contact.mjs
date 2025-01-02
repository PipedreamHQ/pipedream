import alegra from "../../alegra.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "alegra-find-contact",
  name: "Find Contact",
  description: "Search for an existing contact in Alegra based on email, phone number, or name. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    alegra,
    query: {
      propDefinition: [
        "alegra",
        "query",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.alegra.searchContact();
    const contacts = response.items;
    $.export("$summary", `Found ${contacts.length} contact(s) matching your query`);
    return contacts;
  },
};
