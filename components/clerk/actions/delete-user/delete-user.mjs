import clerk from "../../clerk.app.mjs";

export default {
  key: "clerk-delete-user",
  name: "Delete User",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Delete the specified user. [See the documentation](https://clerk.com/docs/reference/backend-api/tag/Users#operation/DeleteUser)",
  type: "action",
  props: {
    clerk,
    userId: {
      propDefinition: [
        clerk,
        "userId",
      ],
      description: "The Id of the user to delete.",
    },
  },
  async run({ $ }) {
    const {
      clerk,
      userId,
    } = this;

    const response = await clerk.deleteUser({
      $,
      userId,
    });

    $.export("$summary", `The user with Id: ${userId} was successfully deleted!`);
    return response;
  },
};
