import app from "../../agility_cms.app.mjs";

export default {
  key: "agility_cms-get-content-models",
  name: "Get Content Models",
  description: "Retrieve content models for the Agility instance. [See the documentation](https://api.aglty.io/swagger/index.html#operations-ContentModels-get__guid___apitype__contentmodels)",
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
    const response = await this.app.getContentModels({
      $,
    });

    $.export("$summary", `Successfully retrieved ${Object.keys(response).length} content models`);

    return response;
  },
};
