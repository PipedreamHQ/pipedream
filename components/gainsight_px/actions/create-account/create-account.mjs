import app from "../../gainsight_px.app.mjs";

export default {
  key: "gainsight_px-create-account",
  name: "Create Account",
  description: "Create a new account with the given data. [See the documentation](https://gainsightpx.docs.apiary.io/#reference/accounts/v1accounts/create-account)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    id: {
      propDefinition: [
        app,
        "id",
      ],
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    propertyKeys: {
      propDefinition: [
        app,
        "propertyKeys",
      ],
    },
    countryName: {
      propDefinition: [
        app,
        "countryName",
      ],
    },
    stateName: {
      propDefinition: [
        app,
        "stateName",
      ],
    },
    city: {
      propDefinition: [
        app,
        "city",
      ],
    },
  },

  async run({ $ }) {
    const response = await this.app.createAccount({
      $,
      data: {
        id: this.id,
        name: this.name,
        propertyKeys: this.propertyKeys,
        location: {
          countryName: this.countryName,
          stateName: this.stateName,
          city: this.city,
        },
      },
    });

    $.export("$summary", `Successfully created account with the name '${this.name}'`);

    return response;
  },
};
