import app from "../../predictleads.app.mjs";

export default {
  key: "predictleads-retrieve-companies-by-technology",
  name: "Retrieve Companies By Technology",
  description: "Retrieve companies that use a specific technology. [See the documentation](https://docs.predictleads.com/v3/api_endpoints/technologies_dataset/retrieve_a_single_technology_by_id)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    technologyId: {
      propDefinition: [
        app,
        "technologyId",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      technologyId,
    } = this;
    const response = await app.retrieveCompaniesByTechnology({
      $,
      technologyId,
    });
    $.export("$summary", "Successfully retrieved the first page of companies.");
    return response;
  },
};
