import enrow from "../../enrow.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "enrow-find-single-email",
  name: "Find Single Email",
  description: "Executes a single email search using Enrow email finder.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    enrow,
    name: {
      type: "string",
      label: "Full Name",
      description: "The full name of the person you're searching for.",
    },
    domain: {
      type: "string",
      label: "Domain",
      description: "The domain of the email you want to find.",
    },
  },
  async run({ $ }) {
    const response = await this.enrow.executeSearch(this.name, this.domain);
    $.export("$summary", `Successfully executed search for ${this.name}@${this.domain}`);
    return response;
  },
};
