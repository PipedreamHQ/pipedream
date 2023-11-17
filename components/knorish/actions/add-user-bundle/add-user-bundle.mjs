import knorish from "../../knorish.app.mjs";

export default {
  key: "knorish-add-user-bundle",
  name: "Add User to Bundle",
  description: "Adds a user to a specific bundle on your Knorish site. [See the documentation](https://knowledge.knorish.com/api-endpoints-and-postman-dump-publisher-api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    knorish,
    userId: {
      propDefinition: [
        knorish,
        "userId",
      ],
    },
    bundleId: {
      propDefinition: [
        knorish,
        "bundleId",
      ],
    },
    addUserToBundleDetails: {
      propDefinition: [
        knorish,
        "addUserToBundleDetails",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.knorish.addUserToBundle({
      userId: this.userId,
      bundleId: this.bundleId,
      ...this.addUserToBundleDetails,
    });

    $.export("$summary", `Successfully added user ${this.userId} to bundle ${this.bundleId}`);
    return response;
  },
};
