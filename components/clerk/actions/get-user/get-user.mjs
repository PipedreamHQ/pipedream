import clerk from "../../clerk.app.mjs";

export default {
  key: "clerk-get-user",
  name: "Get User",
  version: "0.0.1",
  description: "Retrieve the details of a specific user. [See the documentation](https://clerk.com/docs/reference/backend-api/tag/Users#operation/GetUser)",
  type: "action",
  props: {
    clerk,
    userId: {
      propDefinition: [
        clerk,
        "userId",
      ],
    },
  },
  async run({ $ }) {
    const {
      clerk,
      userId,
    } = this;

    const response = await clerk.getUser({
      $,
      userId,
    });

    $.export("$summary", `The user with Id: ${userId} was successfully fetched!`);
    return response;
  },
};
