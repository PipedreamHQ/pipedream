import { ConfigurationError } from "@pipedream/platform";
import codeqr from "../../codeqr.app.mjs";

export default {
  key: "codeqr-delete-link",
  name: "Delete a Link",
  description: "Deletes a short link in CodeQR by linkId or externalId. [See the documentation](https://codeqr.mintlify.app/api-reference/endpoint/delete-a-link)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    codeqr,
    linkId: {
      propDefinition: [
        codeqr,
        "linkId",
      ],
      description: "The unique ID of the link to delete.",
      optional: true,
    },
    externalId: {
      type: "string",
      label: "External ID",
      description:
        "This is the ID of the link in your database. Must be prefixed with ext_.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      linkId, externalId,
    } = this;
    if (!linkId && !externalId) {
      throw new ConfigurationError(
        "Please provide either linkId or externalId to delete the link.",
      );
    }

    // Determine identifier to use
    const identifier = linkId || externalId;

    // Perform DELETE request to /links/{identifier}
    await this.codeqr.deleteLink({
      $,
      identifier,
    });
    $.export("$summary", `Link deleted successfully (${identifier}).`);
    return {
      success: true,
    };
  },
};
