import { parseObjectEntries } from "../../common/utils.mjs";
import dataforseo from "../../dataforseo.app.mjs";

export default {
  key: "dataforseo-get-categories-aggregation",
  name: "Get Categories Aggregation",
  description:
    "Get information about groups of related categories and the number of entities in each category. [See the documentation](https://docs.dataforseo.com/v3/business_data/business_listings/categories_aggregation/live/)",
  version: "0.0.2",
  type: "action",
  methods: {
    getCategoriesAggregation(args = {}) {
      return this.dataforseo._makeRequest({
        path: "/business_data/business_listings/categories_aggregation/live",
        method: "post",
        ...args,
      });
    },
  },
  props: {
    dataforseo,
    categories: {
      propDefinition: [
        dataforseo,
        "categories",
      ],
    },
    description: {
      propDefinition: [
        dataforseo,
        "description",
      ],
    },
    title: {
      propDefinition: [
        dataforseo,
        "title",
      ],
    },
    locationCoordinate: {
      propDefinition: [
        dataforseo,
        "locationCoordinate",
      ],
      optional: true,
    },
    tag: {
      propDefinition: [
        dataforseo,
        "tag",
      ],
    },
    additionalOptions: {
      propDefinition: [
        dataforseo,
        "additionalOptions",
      ],
      description:
        "Additional parameters to send in the request. [See the documentation](https://docs.dataforseo.com/v3/business_data/business_listings/categories_aggregation/live/) for all available parameters. Values will be parsed as JSON where applicable.",
    },
  },
  async run({ $ }) {
    const response = await this.getCategoriesAggregation({
      $,
      data: [
        {
          categories: this.categories,
          description: this.description,
          title: this.title,
          location_coordinate: this.locationCoordinate,
          tag: this.tag,
          ...parseObjectEntries(this.additionalOptions),
        },
      ],
    });
    $.export("$summary", "Successfully retrieved categories aggregation");
    return response;
  },
};
