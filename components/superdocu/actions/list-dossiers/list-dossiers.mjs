import superdocu from "../../superdocu.app.mjs";
import { DEFAULT_PER_PAGE } from "../../common/constants.mjs";

export default {
  key: "superdocu-list-dossiers",
  name: "List Dossiers",
  description: "List the dossiers (the API calls these `contact workflows`) assigned to a specific Superdocu contact. Returns an array of dossier objects, each with an `id` (the contact-workflow ID) and a `status`. Run **List Contacts** first to obtain a valid contactId. Use a returned dossier `id` as the **contactWorkflowId** input to **Get Dossier** or **Delete Dossier**. [See the documentation](https://developers.superdocu.com/api/index.html).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    superdocu,
    contactId: {
      propDefinition: [
        superdocu,
        "contactId",
      ],
    },
    limit: {
      propDefinition: [
        superdocu,
        "limit",
      ],
      description: "Maximum number of dossiers to return per page (min 1, max 100; the Superdocu API rejects values above 100). Defaults to 25.",
    },
    after: {
      propDefinition: [
        superdocu,
        "after",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.superdocu.listContactWorkflows({
      $,
      contactId: this.contactId,
      params: {
        per_page: this.limit ?? DEFAULT_PER_PAGE,
        after: this.after,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? 0} dossier(s) for contact ${this.contactId}`);
    return response;
  },
};
