import dataforseo from "../../dataforseo.app.mjs";

export default {
  key: "dataforseo-get-business-listings",
  name: "Get Business Listings",
  description: "Get Business Listings. [See the documentation](https://docs.dataforseo.com/v3/business_data/business_listings/search/live/?bash)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    dataforseo,
    locationCoordinate: {
      propDefinition: [
        dataforseo,
        "locationCoordinate",
      ],
    },
    categories: {
      propDefinition: [
        dataforseo,
        "categories",
      ],
    },
    title: {
      propDefinition: [
        dataforseo,
        "title",
      ],
    },
    description: {
      propDefinition: [
        dataforseo,
        "description",
      ],
    },
    isClaimed: {
      propDefinition: [
        dataforseo,
        "isClaimed",
      ],
    },
    limit: {
      propDefinition: [
        dataforseo,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dataforseo.getBusinessListings({
      $,
      data: [
        {
          location_coordinate: this.locationCoordinate,
          categories: this.categories,
          description: this.description,
          title: this.title,
          is_claimed: this.isClaimed,
          limit: this.limit,
        },
      ],
    });
    $.export("$summary", `Successfully sent the request. Status: ${response.tasks[0].status_message}`);
    return response;
  },
};
