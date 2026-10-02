import tokportal from "../../tokportal.app.mjs";

export default {
  key: "tokportal-list-accounts",
  name: "List Accounts",
  description: "List the delivered (saved) accounts of the workspace, optionally filtered by platform, country or ban state."
    + " [See the documentation](https://developers.tokportal.com/saved-accounts/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    tokportal,
    platform: {
      propDefinition: [
        tokportal,
        "platform",
      ],
      optional: true,
    },
    country: {
      propDefinition: [
        tokportal,
        "country",
      ],
      description: "Filter by country code (for example `US`).",
      optional: true,
    },
    banned: {
      type: "string",
      label: "Banned",
      description: "Filter by ban state: `true` returns only banned accounts, `false` only non-banned accounts. Leave empty for all.",
      options: [
        "true",
        "false",
      ],
      optional: true,
    },
    maxResults: {
      propDefinition: [
        tokportal,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const accounts = [];
    const items = this.tokportal.paginate({
      $,
      fn: this.tokportal.listAccounts,
      maxResults: this.maxResults,
      params: {
        platform: this.platform,
        country: this.country,
        banned: this.banned,
      },
    });
    for await (const item of items) {
      accounts.push(item);
    }
    $.export("$summary", `Retrieved ${accounts.length} account${accounts.length === 1
      ? ""
      : "s"}`);
    return accounts;
  },
};
