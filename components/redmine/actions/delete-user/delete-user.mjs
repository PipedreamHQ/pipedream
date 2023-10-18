import redmine from "../../redmine.app.mjs";

export default {
  key: "redmine-delete-user",
  name: "Delete User",
  description: "Deletes a user from the Redmine platform. [See the documentation](https://www.redmine.org/projects/redmine/wiki/rest_users#delete)",
  version: "0.0.1",
  type: "action",
  props: {
    redmine,
    userId: {
      propDefinition: [
        redmine,
        "userId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.redmine.deleteUser({
      userId: this.userId,
    });
    $.export("$summary", `Successfully deleted user with ID: ${this.userId}`);
    return response;
  },
};
