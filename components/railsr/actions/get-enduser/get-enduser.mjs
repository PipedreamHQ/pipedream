import app from "../../railsr.app.mjs";

export default {
  key: "railsr-get-enduser",
  name: "Get Enduser",
  description: "Retrieves detailed information about a specific enduser. [See the documentation](https://docs.railsr.com/docs/api/8e78d0954ae83-get-enduser)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    id: {
      propDefinition: [
        app,
        "id",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getEnduser({
      $,
      id: this.id,
    });

    $.export("$summary", `Successfully retrieved the data of Enduser with ID: '${this.id}'`);

    return response;
  },
};
