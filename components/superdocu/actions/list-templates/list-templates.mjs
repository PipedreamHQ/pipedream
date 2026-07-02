import superdocu from "../../superdocu.app.mjs";
import { DEFAULT_PER_PAGE } from "../../common/constants.mjs";

export default {
  key: "superdocu-list-templates",
  name: "List Templates",
  description: "List workflow templates in Superdocu (the API calls these `workflows`; the intake refers to them as templates). Returns an array of template objects, each with an `id` and `name`. Use the returned `id` as the **workflowId** input to **Create Dossier**. [See the documentation](https://developers.superdocu.com/api/index.html).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    superdocu,
    limit: {
      propDefinition: [
        superdocu,
        "limit",
      ],
      description: "Maximum number of templates to return per page (min 1, max 100; the Superdocu API rejects values above 100). Defaults to 25.",
    },
    after: {
      propDefinition: [
        superdocu,
        "after",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.superdocu.listTemplates({
      $,
      params: {
        per_page: this.limit ?? DEFAULT_PER_PAGE,
        after: this.after,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? 0} template(s)`);
    return response;
  },
};
