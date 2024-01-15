import renderform from "../../renderform.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "renderform-list-templates",
  name: "List Templates",
  description: "Retrieve a list of your personal templates, optionally filtered by name. [See the documentation](https://renderform.io/docs/api/get-started/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    renderform,
    filterName: {
      type: "string",
      label: "Filter Name",
      description: "Filter templates by name",
      optional: true,
    },
  },
  async run({ $ }) {
    const templates = await this.renderform.listTemplates({
      filterName: this.filterName,
    });

    const summary = `Retrieved ${templates.length} templates`;
    $.export("$summary", summary);
    return templates;
  },
};
