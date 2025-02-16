import tave from "../../tave.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "tave-find-contact",
  name: "Find Contact",
  description: "Searches for an existing contact in the Tave system. [See the documentation](https://tave.io/v2)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    tave,
    searchContact: {
      propDefinition: [
        tave,
        "searchContact",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.tave.searchContact(this.searchContact);
    $.export("$summary", `Successfully found contact(s) based on the query: ${this.searchContact}`);
    return response;
  },
};
