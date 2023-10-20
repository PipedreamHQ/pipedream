import { ConfigurationError } from "@pipedream/platform";
import godial from "../../app/godial.app.mjs";
import constants from "../common/constants.mjs";

export default {
  name: "Add Member",
  version: "0.0.1",
  key: "godial-add-member",
  description: "Adds a member. [See docs here](https://godial.stoplight.io/docs/godial/b3A6MzAzMTY1Ng-accounts-add)",
  type: "action",
  props: {
    godial,
    teamsId: {
      label: "Teams ID",
      type: "string[]",
      propDefinition: [
        godial,
        "teamId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the member to add",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the member to add",
      optional: true,
    },
    username: {
      type: "string",
      label: "Username",
      description: "The username of the member to add",
    },
    password: {
      type: "string",
      label: "Password",
      description: "The password of the member to add",
      secret: true,
    },
    role: {
      type: "string",
      label: "Role",
      description: "The role of the member to add",
      options: constants.ROLES,
    },
  },
  async run({ $ }) {
    console.log(this.teamsId);
    this.teamsId = typeof this.teamsId === "string"
      ? JSON.parse(this.teamsId)
      : this.teamsId;

    if (!this.teamsId || !this.teamsId?.length) {
      throw new ConfigurationError("TeamsId is required");
    }

    const response = await this.godial.addMember({
      $,
      data: {
        teamsId: this.teamsId,
        name: this.name,
        email: this.email,
        username: this.username,
        password: this.password,
        role: this.role,
      },
    });

    if (response) {
      $.export("$summary", `Successfully added member with ID ${response.id}`);
    }

    return response;
  },
};
