import { defineAction } from "@pipedream/types";
import rise from "../../app/rise.app";
import constants from "../common/constants";

export default defineAction({
  name: "Create Invitation",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "rise-create-invitation",
  description: "Creates a invitation. [See docs here](https://help.rise.com/en/articles/4177042-invitations-api)",
  type: "action",
  props: {
    rise,
    email: {
      label: "Email",
      description: "The email of user to invite",
      type: "string",
    },
    role: {
      label: "Role",
      description: "The role of user to invite",
      type: "string",
      options: constants.USER_ROLES,
    },
    firstName: {
      label: "First Name",
      description: "The first name of user to invite",
      type: "string",
      optional: true,
    },
    lastName: {
      label: "Last Name",
      description: "The last name of user to invite",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.rise.createInvitation({
      $,
      data: {
        email: this.email,
        role: this.role,
        firstName: this.firstName,
        lastName: this.lastName,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created invitation with id ${response.invitation.id}`);
    }

    return response;
  },
});
