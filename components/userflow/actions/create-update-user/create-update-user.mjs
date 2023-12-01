import userflow from "../../userflow.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "userflow-create-update-user",
  name: "Create or Update User",
  description: "Creates or updates a user in Userflow. If the user does not already exist in Userflow, it will be created. If it already exists, the given attributes will be merged into the existing user's attributes. [See the documentation](https://docs.userflow.com/api/users/create-or-update)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    userflow,
    userId: {
      propDefinition: [
        userflow,
        "userId",
      ],
    },
    email: {
      propDefinition: [
        userflow,
        "email",
        (c) => ({
          optional: !c.userId,
        }), // Make email required only if userId is not provided
      ],
    },
    attributes: {
      type: "object",
      label: "User Attributes",
      description: "A map with attributes to update for the user. You can add any attributes you want here. Existing attributes not included in the request will not be touched.",
      optional: true,
    },
    groups: {
      type: "string[]",
      label: "Groups",
      description: "A list of group IDs to ensure the user is a member of.",
      optional: true,
    },
    memberships: {
      type: "string[]",
      label: "Memberships",
      description: "A list of group/company memberships to create/update for the user.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      userId, email, attributes, groups, memberships,
    } = this;

    // Validate that either userId or email is provided
    if (!userId && !email) {
      throw new Error("User ID or Email is required.");
    }

    // Parse memberships if provided
    const parsedMemberships = memberships
      ? memberships.map(JSON.parse)
      : undefined;

    const response = await this.userflow.createUserOrUpdate({
      userId,
      email,
      attributes,
      groups,
      memberships: parsedMemberships,
    });

    $.export("$summary", `Successfully created or updated user ${userId || email}`);
    return response;
  },
};
