import { ConfigurationError } from "@pipedream/platform";
import codeqr from "../../codeqr.app.mjs";

export default {
  key: "codeqr-get-link-info",
  name: "Get a Link Info",
  description:
    "Retrieves a short link from CodeQR by linkId, externalId, or domain/key via query string parameters. [See the documentation](https://codeqr.mintlify.app/api-reference/endpoint/retrieve-a-link)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    codeqr,
    linkId: {
      propDefinition: [
        codeqr,
        "linkId",
      ],
      description: "The unique ID of the short link.",
      optional: true,
    },
    externalId: {
      type: "string",
      label: "External ID",
      description:
        "This is the ID of the link in your database. Must be prefixed with ext_.",
      optional: true,
    },
    domain: {
      type: "string",
      label: "Domain",
      description: "The domain of the link to retrieve.",
      optional: true,
    },
    key: {
      type: "string",
      label: "Key",
      description:
        "The key of the link to retrieve. E.g., for codeqr.io/github, the key is github.",
      optional: true,
    },
  },

  async run({ $ }) {
    const {
      linkId, externalId, domain, key,
    } = this;
    if (!linkId && !externalId && !(domain && key)) {
      throw new ConfigurationError(
        "Please provide linkId, externalId, or both domain and key.",
      );
    }

    // Build query parameters
    const params = {};
    linkId && (params.linkId = linkId);
    externalId && (params.externalId = externalId);
    domain && (params.domain = domain);
    key && (params.key = key);

    // Make GET request to /links/info with query string
    const response = await this.codeqr.getLinkInfo({
      $,
      params,
    });
    $.export(
      "$summary",
      `Link retrieved successfully${
        linkId
          ? ` (ID: ${linkId})`
          : externalId
            ? ` (external ID: ${externalId})`
            : ` (${domain}/${key})`
      }.`,
    );
    return response;
  },
};
