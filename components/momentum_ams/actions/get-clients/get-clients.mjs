import app from "../../momentum_ams.app.mjs";

export default {
  key: "momentum_ams-get-clients",
  name: "Get Clients",
  description: "Get a list of the clients. [See the documentation](https://docs.google.com/document/d/11Xk7TviRujq806pLK8pQTcdzDF2ClmPvkfnVmdh1bGc/edit?tab=t.0)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    count: {
      propDefinition: [
        app,
        "count",
      ],
    },
    orderby: {
      propDefinition: [
        app,
        "orderby",
      ],
    },
    skip: {
      propDefinition: [
        app,
        "skip",
      ],
    },
    top: {
      propDefinition: [
        app,
        "top",
      ],
    },
    id: {
      propDefinition: [
        app,
        "id",
        (c) => ({
          count: c.count,
          orderby: c.orderby,
          skip: c.skip,
          top: c.top,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getClient({
      $,
      id: this.id,
    });
    $.export("$summary", "Successfully retrieved the client with ID: " + this.id);
    return response;
  },
};
