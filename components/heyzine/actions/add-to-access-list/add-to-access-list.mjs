import heyzine from "../../heyzine.app.mjs";

export default {
  key: "heyzine-add-to-access-list",
  name: "Add to Access List",
  description: "Adds a new user, password, or one-time password (otp) to the flipbook access list.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    heyzine,
    flipbookId: {
      propDefinition: [
        heyzine,
        "flipbookId",
      ],
    },
    accessType: {
      propDefinition: [
        heyzine,
        "accessType",
      ],
    },
    identifier: {
      propDefinition: [
        heyzine,
        "identifier",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.heyzine.addUserToAccessList(this.flipbookId, this.accessType, this.identifier);
    $.export("$summary", `Successfully added ${this.accessType} to access list of flipbook with ID: ${this.flipbookId}`);
    return response;
  },
};
