import { ConfigurationError } from "@pipedream/platform";
import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-get-person-details",
  name: "Get person details",
  description: "Retrieves a single person (contact) by ID, including name, emails, phones, owner, organization, label IDs and custom fields."
    + " Use **Search persons** (by name, email or phone) or **List Persons** to find the ID. Example: `Person ID` `42`."
    + " Use **Update Person** to change the person."
    + " [See the documentation](https://developers.pipedrive.com/docs/api/v1/Persons#getPerson)",
  version: "0.0.12",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    pipedriveApp,
    personId: {
      propDefinition: [
        pipedriveApp,
        "personId",
      ],
      optional: false,
      description: "The ID of the person to retrieve, e.g. `42`. Use **Search persons** or **List Persons** to find it (the `id` field).",
    },
  },
  async run({ $ }) {
    try {
      const resp = await this.pipedriveApp.getPerson(this.personId);

      $.export("$summary", `Successfully retrieved details for person ID: ${this.personId}`);

      return resp;

    } catch ({ error }) {
      throw new ConfigurationError(error);
    }
  },
};
