// vandelay-test-dr
import app from "../../app/beehiiv.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  key: "beehiiv-list-custom-fields",
  name: "List Custom Fields",
  description:
    "Schema discovery — list all custom fields defined for"
    + " subscribers in a publication."
    + " Use this before **Create Subscriber** or **Update"
    + " Subscriber** to know what custom fields are available"
    + " and their expected types."
    + " Use **Get Publication Info** to get the publication ID."
    + " [See the documentation]"
    + "(https://developers.beehiiv.com/api-reference/"
    + "custom-fields/index)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  props: {
    app,
    publicationId: {
      type: "string",
      label: "Publication ID",
      description:
        "The publication ID. Use **Get Publication Info** to find"
        + " this.",
    },
  },
  async run({ $ }) {
    const response = await this.app.listCustomFields($, this.publicationId);

    const fields = response.data || [];

    $.export(
      "$summary",
      `Found ${fields.length} custom field${fields.length === 1
        ? ""
        : "s"}`,
    );

    return fields;
  },
});
