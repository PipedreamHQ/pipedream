import airplane from "../../airplane.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "airplane-execute-runbook",
  name: "Execute Runbook",
  description: "Execute a runbook and receive a session ID to track the runbook's execution. [See the documentation](https://docs.airplane.dev/reference/api#runbooks-execute)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    airplane,
    id: {
      type: "string",
      label: "Runbook ID",
      description: "Unique ID of the runbook. You can find your runbook's ID by visiting the runbook's page on Airplane. The runbook ID is located at the end of the url. e.g. the runbook ID for `https://app.airplane.dev/runbooks/rbk20220120z15kl79` is `rbk20220120z15kl79`",
      optional: true,
    },
    slug: {
      type: "string",
      label: "Slug",
      description: "Unique slug of the runbook. You can find your runbook's slug next to the runbook's name within the runbook editor on Airplane. Either an ID or a slug must be provided.`",
      optional: true,
    },
    paramValues: {
      type: "object",
      label: "Parameter Values",
      description: "Mapping of parameter slug to value. You can find your runbooks's parameter slugs inside the runbook editor on Airplane.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.id && !this.slug) {
      throw new ConfigurationError("Either an ID or a slug must be provided.");
    }

    const response = await this.airplane.executeRunbook({
      data: {
        id: this.id,
        slug: this.slug,
        paramValues: this.paramValues,
      },
      $,
    });

    if (response) {
      $.export("$summary", "Successfully executed runbook.");
    }

    return response;
  },
};
