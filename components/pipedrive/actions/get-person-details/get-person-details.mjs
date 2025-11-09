import { ConfigurationError } from "@pipedream/platform";
import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-get-person-details",
  name: "Get person details",
  description: "Get details of a person by their ID. [See the documentation](https://developers.pipedrive.com/docs/api/v1/Persons#getPerson)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pipedriveApp,
    personId: {
      propDefinition: [
        pipedriveApp,
        "personId",
      ],
      optional: false,
      description: "The ID of the person to get details for.",
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
