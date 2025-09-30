import app from "../../gainsight_px.app.mjs";

export default {
  key: "gainsight_px-create-user",
  name: "Create User",
  description: "Creates a new user with the given data. [See the documentation](https://gainsightpx.docs.apiary.io/#reference/users/v1users/create-user)",
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
      label: "Identify ID",
      description: "Identifier of the user",
    },
    propertyKeys: {
      propDefinition: [
        app,
        "propertyKeys",
      ],
    },
    type: {
      propDefinition: [
        app,
        "type",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    firstName: {
      propDefinition: [
        app,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        app,
        "lastName",
      ],
    },
  },

  async run({ $ }) {
    const response = await this.app.createUser({
      $,
      data: {
        identifyId: this.id,
        propertyKeys: this.propertyKeys,
        type: this.type,
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
      },
    });

    $.export("$summary", `Successfully created user with ID '${this.id}'`);

    return response;
  },
};
