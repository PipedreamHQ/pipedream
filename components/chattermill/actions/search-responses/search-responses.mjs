import chattermill from "../../chattermill.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "chattermill-search-responses",
  name: "Search Responses",
  description: "Search for responses. [See the documentation](https://apidocs.chattermill.com/#3dd30375-7956-b872-edbd-873eef126b2d)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    chattermill,
    projectId: {
      propDefinition: [
        chattermill,
        "projectId",
      ],
    },
    filterProperty: {
      type: "string",
      label: "Filter Property",
      description: "Segment property to filter by",
      optional: true,
    },
    filterValue: {
      type: "string",
      label: "Filter Value",
      description: "Segment value to filter by",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    if ((this.filterProperty && !this.filterValue)
      || (!this.filterProperty && this.filterValue)) {
      throw new ConfigurationError("Filter Property and Value must be provided together");
    }

    const responses = await this.chattermill.getPaginatedResources({
      fn: this.chattermill.listResponses,
      args: {
        $,
        projectId: this.projectId,
        params: {
          filter_property: this.filterProperty,
          filter_value: this.filterValue,
        },
      },
      resourceKey: "responses",
      max: this.maxResults,
    });

    $.export("$summary", `Found ${responses.length} responses.`);
    return responses;
  },
};
