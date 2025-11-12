import copper from "../../copper.app.mjs";

export default {
  key: "copper-get-object",
  name: "Get Object",
  description: "Retrieves an existing CRM object. [See the documentation](https://developer.copper.com/account-and-users/fetch-user-by-id.html)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    copper,
    objectType: {
      propDefinition: [
        copper,
        "objectType",
      ],
    },
    objectId: {
      propDefinition: [
        copper,
        "objectId",
        (c) => ({
          objectType: c.objectType,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.copper.getObject({
      objectType: this.objectType,
      objectId: this.objectId,
      $,
    });
    $.export("$summary", `Successfully retrieved CRM object with ID ${this.objectId}`);
    return response;
  },
};
