import whop from "../../whop.app.mjs";

export default {
  key: "whop-terminate-membership",
  name: "Terminate Membership",
  description: "Permanently invalidates a specified membership using its unique ID, effectively unfulfilling the user's product experiences. Termination is irreversible. [See the documentation](https://dev.whop.com/api-reference/v2/memberships/terminate-a-membership)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    whop,
    membershipId: {
      propDefinition: [
        whop,
        "membershipId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.whop.terminateMembership({
      membershipId: this.membershipId,
    });

    $.export("$summary", `Successfully terminated membership with ID: ${this.membershipId}`);
    return response;
  },
};
