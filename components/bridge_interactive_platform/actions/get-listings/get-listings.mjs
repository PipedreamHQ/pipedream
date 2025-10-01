import bridgeInteractivePlatform from "../../bridge_interactive_platform.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "bridge_interactive_platform-get-listings",
  name: "Get Listings",
  description: "Get MLS listings from a dataset. [See the documentation](https://bridgedataoutput.com/docs/explorer/mls-data)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    bridgeInteractivePlatform,
    dataset: {
      propDefinition: [
        bridgeInteractivePlatform,
        "dataset",
      ],
    },
    near: {
      propDefinition: [
        bridgeInteractivePlatform,
        "near",
      ],
    },
    radius: {
      propDefinition: [
        bridgeInteractivePlatform,
        "radius",
      ],
    },
    box: {
      propDefinition: [
        bridgeInteractivePlatform,
        "box",
      ],
    },
    poly: {
      propDefinition: [
        bridgeInteractivePlatform,
        "poly",
      ],
    },
    geohash: {
      propDefinition: [
        bridgeInteractivePlatform,
        "geohash",
      ],
    },
    sortBy: {
      propDefinition: [
        bridgeInteractivePlatform,
        "field",
        (c) => ({
          dataset: c.dataset,
        }),
      ],
      label: "Sort By",
    },
    order: {
      type: "string",
      label: "Order",
      description: "Order of responses",
      optional: true,
      options: [
        "asc",
        "desc",
      ],
    },
    fields: {
      propDefinition: [
        bridgeInteractivePlatform,
        "field",
        (c) => ({
          dataset: c.dataset,
        }),
      ],
      type: "string[]",
      label: "Fields",
      description: "Filters Response fields",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of responses",
      optional: true,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Number of responses to skip",
      optional: true,
    },
  },
  async run({ $ }) {
    const coords = {
      near: this.near,
      poly: this.poly,
      box: this.box,
      geohash: this.geohash,
    };

    if (Object.values(coords).filter(Boolean).length > 1) {
      throw new ConfigurationError("Only one of near, poly, box, or geohash can be used");
    }

    const response = await this.bridgeInteractivePlatform.getListings({
      dataset: this.dataset,
      params: {
        near: this.near,
        radius: this.radius,
        box: this.box,
        poly: this.poly,
        geohash: this.geohash,
        sortBy: this.sortBy,
        order: this.order,
        fields: this.fields
          ? this.fields.join(",")
          : undefined,
        limit: this.limit,
        offset: this.offset,
      },
    });
    $.export("$summary", `Found ${response.bundle.length} listings`);
    return response;
  },
};
