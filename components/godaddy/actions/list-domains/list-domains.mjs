import godaddy from "../../godaddy.app.mjs";

export default {
  key: "godaddy-list-domains",
  name: "List Domains",
  description: "List domains in GoDaddy. [See the documentation](https://developer.godaddy.com/doc/endpoint/domains#/v1/list)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    godaddy,
    statuses: {
      propDefinition: [
        godaddy,
        "statuses",
      ],
    },
    statusGroups: {
      propDefinition: [
        godaddy,
        "statusGroups",
      ],
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of domains to return",
      optional: true,
    },
    marker: {
      type: "string",
      label: "Marker",
      description: "Marker Domain to use as the offset in results",
      optional: true,
    },
    includes: {
      propDefinition: [
        godaddy,
        "includes",
      ],
    },
    modifiedDate: {
      type: "string",
      label: "Modified Date",
      description: "Only include results that have been modified since the specified date",
      optional: true,
    },
  },
  async run({ $ }) {
    const domains = await this.godaddy.listDomains({
      $,
      params: {
        statuses: this.statuses,
        statusGroups: this.statusGroups,
        limit: this.limit,
        marker: this.marker,
        includes: this.includes,
        modifiedDate: this.modifiedDate,
      },
    });

    $.export("$summary", `Found ${domains.length} domain(s)`);
    return domains;
  },
};
