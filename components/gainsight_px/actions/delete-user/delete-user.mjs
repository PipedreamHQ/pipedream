import app from "../../gainsight_px.app.mjs";

export default {
  key: "gainsight_px-delete-user",
  name: "Delete User",
  description: "Deletes a user with he specified identifyId. [See the documentation](https://gainsightpx.docs.apiary.io/#reference/users/v1usersdelete/delete-user)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    identifyId: {
      propDefinition: [
        app,
        "identifyId",
      ],
    },
  },

  async run({ $ }) {
    const response = await this.app.deleteUser({
      $,
      data: {
        identifyId: this.identifyId,
      },
    });

    $.export("$summary", `Successfully deleted user with ID ${this.identifyId}`);

    return response;
  },
};
