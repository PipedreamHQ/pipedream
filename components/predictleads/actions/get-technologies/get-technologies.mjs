import app from "../../predictleads.app.mjs";

export default {
  key: "predictleads-get-technologies",
  name: "Get Technologies",
  description: "Retrieve a list of technologies that PredictLeads tracks. [See the documentation](https://docs.predictleads.com/v3/api_endpoints/technologies_dataset/retrieve_all_tracked_technologies)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.retrieveTechnologies({
      $,
      params: {
        limit: 1000,
      },
    });
    $.export("$summary", "Successfully retrieved the first page of technologies.");
    return response;
  },
};
