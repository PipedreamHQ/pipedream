import slack from "../../slack.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "slack-update-profile",
  name: "Update Profile",
  description: "Update basic profile field such as name or title. [See the documentation](https://api.slack.com/methods/users.profile.set)",
  version: "0.0.24",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    slack,
    displayName: {
      type: "string",
      label: "Display Name",
      description: "The display name the user has chosen to identify themselves by in their workspace profile",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The user's first name",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The user's last name",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The user's phone number, in any format",
      optional: true,
    },
    pronouns: {
      type: "string",
      label: "Pronouns",
      description: "The user's pronouns",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The user's title",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The user's email address. You cannot update your own email using this method. This field can only be changed by admins for users on paid teams.",
      optional: true,
    },
    user: {
      propDefinition: [
        slack,
        "user",
      ],
      description: "ID of user to change. This argument may only be specified by admins on paid teams.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.displayName
      && !this.firstName
      && !this.lastName
      && !this.phone
      && !this.pronouns
      && !this.title
      && !this.email
    ) {
      throw new ConfigurationError("Please provide at least one value to update");
    }
    const response = await this.slack.updateProfile({
      profile: {
        display_name: this.displayName,
        first_name: this.firstName,
        last_name: this.lastName,
        phone: this.phone,
        pronouns: this.pronouns,
        title: this.title,
        email: this.email,
      },
      user: this.user,
    });
    $.export("$summary", "Successfully updated profile");
    return response;
  },
};
