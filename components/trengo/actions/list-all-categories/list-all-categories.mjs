import utils from "../../common/utils.mjs";
import app from "../../trengo.app.mjs";

export default {
  key: "trengo-list-all-categories",
  name: "List All Categories",
  description: "List all categories in a help center. [See the documentation](https://developers.trengo.com/reference/list-all-categories)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    helpCenterId: {
      propDefinition: [
        app,
        "helpCenterId",
      ],
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of categories to return (if not specified, all results will be returned)",
      optional: true,
    },
  },
  async run({ $ }) {
    const categories = [];
    const resourcesStream = utils.getResourcesStream({
      resourceFn: this.app.listCategories,
      resourceFnArgs: {
        helpCenterId: this.helpCenterId,
      },
    });
    for await (const item of resourcesStream) {
      categories.push(item);
      if (this.maxResults && categories.length >= this.maxResults) {
        break;
      }
    }
    const length = categories.length;
    $.export("$summary", `Successfully retrieved ${length} categor${length === 1
      ? "y"
      : "ies"}`);
    return categories;
  },
};
