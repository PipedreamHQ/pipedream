import smallImprovements from "../../small_improvements.app.mjs";

export default {
  key: "small_improvements-list-users",
  name: "List All Users",
  description: "List all users from Small Improvements. [See the documentation](https://storage.googleapis.com/si-rest-api-docs/dist/index.html)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    smallImprovements,
    includeGuests: {
      type: "boolean",
      label: "Include Guests",
      description: "whether the request will only bring fully registered users or not.",
      optional: true,
    },
    managerId: {
      type: "string",
      label: "Manager Id",
      description: "The id of a manager to filter the results.",
      optional: true,
    },
    showLocked: {
      type: "boolean",
      label: "Show Locked",
      description: "whether the request will bring blocked users or not",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.smallImprovements.listAllUsers({
      $,
      params: {
        includeGuests: this.includeGuests || false,
        managerId: this.managerId,
        showLocked: this.showLocked || false,
      },
    });
    $.export("$summary", `Successfully listed ${response.length} users`);
    return response;
  },
};
