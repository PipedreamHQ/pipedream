import clearlyDefined from "../../clearly_defined.app.mjs";

export default {
  key: "clearly_defined-get-definitions",
  name: "Get Definitions",
  description: "Gets the coordinates for all definitions that match the given pattern in the specified part of the definition. [See the documentation](https://api.clearlydefined.io/api-docs/#/definitions/get_definitions).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    clearlyDefined,
    pattern: {
      type: "string",
      label: "Pattern",
      description: "The string to search for in definition coordinates to get coordinate suggestions",
      optional: true,
    },
    type: {
      propDefinition: [
        clearlyDefined,
        "type",
      ],
      optional: true,
    },
    provider: {
      propDefinition: [
        clearlyDefined,
        "provider",
      ],
      optional: true,
    },
    namespace: {
      propDefinition: [
        clearlyDefined,
        "namespace",
      ],
      optional: true,
    },
    name: {
      propDefinition: [
        clearlyDefined,
        "name",
      ],
      optional: true,
    },
    license: {
      type: "string",
      label: "License",
      description: "The SPDX license identifier",
      optional: true,
    },
    releasedAfter: {
      type: "string",
      label: "Released After",
      description: "The minimum release date for the component. E.g. `2025-01-01`",
      optional: true,
    },
    releasedBefore: {
      type: "string",
      label: "Released Before",
      description: "The maximum release date for the component. E.g. `2025-01-01`",
      optional: true,
    },
    minLicensedScore: {
      type: "integer",
      label: "Min Licensed Score",
      description: "The minimum effective licensed score for the component",
      optional: true,
    },
    maxLicensedScore: {
      type: "integer",
      label: "Max Licensed Score",
      description: "The maximum effective licensed score for the component",
      optional: true,
    },
    minDescribedScore: {
      type: "integer",
      label: "Min Described Score",
      description: "The minimum effective described score for the component",
      optional: true,
    },
    maxDescribedScore: {
      type: "integer",
      label: "Max Described Score",
      description: "The maximum effective described score for the component",
      optional: true,
    },
    sort: {
      propDefinition: [
        clearlyDefined,
        "sort",
      ],
    },
    sortDirection: {
      propDefinition: [
        clearlyDefined,
        "sortDirection",
      ],
    },
    continuationToken: {
      type: "string",
      label: "Continuation Token",
      description: "Used for pagination. Seeded from the results of the previous query",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.clearlyDefined.getDefinitions({
      $,
      params: {
        pattern: this.pattern,
        type: this.type,
        provider: this.provider,
        name: this.name,
        namespace: this.namespace,
        license: this.license,
        releasedAfter: this.releasedAfter,
        releasedBefore: this.releasedBefore,
        minLicensedScore: this.minLicensedScore,
        maxLicensedScore: this.maxLicensedScore,
        minDescribedScore: this.minDescribedScore,
        maxDescribedScore: this.maxDescribedScore,
        sort: this.sort,
        sortDesc: this.sortDirection === "descending",
        continuationToken: this.continuationToken,
      },
    });

    const length = response.data
      ? response.data.length
      : response.length
        ? response.length
        : 0;

    $.export("$summary", `Successfully retrieved ${length} definition${length === 1
      ? ""
      : "s"}`);

    return response;
  },
};
