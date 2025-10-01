import clerk from "../../clerk.app.mjs";

export default {
  key: "clerk-get-user-membership",
  name: "Get User Memberships",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Retrieve a list of the user's organization memberships. [See the documentation](https://clerk.com/docs/reference/backend-api/tag/Users#operation/GetOAuthAccessToken)",
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

    const responseArray = [];
    const items = clerk.paginate({
      fn: clerk.listUserMemberships,
      userId,
    });

    for await (const item of items) {
      responseArray.push(item);
    }

    $.export("$summary", `The memberships of user with Id: ${userId} was successfully fetched!`);
    return responseArray;
  },
};
