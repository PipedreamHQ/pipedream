import app from "../../dataforseo.app.mjs";

export default {
  key: "dataforseo-get-business-listings",
  name: "Get Business Listings",
  description: "Get Business Listings. [See the documentation](https://docs.dataforseo.com/v3/business_data/business_listings/search/live/?bash)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    locationCoordinate: {
      propDefinition: [
        app,
        "locationCoordinate",
      ],
    },
    categories: {
      propDefinition: [
        app,
        "categories",
      ],
    },
    title: {
      propDefinition: [
        app,
        "title",
      ],
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
    },
    isClaimed: {
      propDefinition: [
        app,
        "isClaimed",
      ],
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getBusinessListings({
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
