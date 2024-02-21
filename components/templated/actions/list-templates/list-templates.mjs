import templated from "../../templated.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "templated-list-templates",
  name: "List Templates",
  description: "List all templates of a user on Templated. [See the documentation](https://app.templated.io/docs#list-all-templates)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    templated,
    page: {
      type: "integer",
      label: "Page",
      description: "The page number to list the templates from",
      default: 0,
      optional: true,
    },
  },
  async run({ $ }) {
    const templates = await this.templated.listTemplates({
      page: this.page,
    });
    $.export("$summary", "Successfully listed templates");
    return templates;
  },
};
