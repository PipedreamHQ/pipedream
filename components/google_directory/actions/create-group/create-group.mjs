import googleDirectory from "../../google_directory.app.mjs";

export default {
  key: "google_directory-create-group",
  name: "Create Group",
  description: "Creates a new group. [See the documentation](https://developers.google.com/admin-sdk/directory/reference/rest/v1/groups/insert)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    googleDirectory,
    email: {
      type: "string",
      label: "Email",
      description: "The group's email address. The email domain name must be a domain associated with the account.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The group name",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the group",
      optional: true,
    },
  },
  async run({ $ }) {
    await this.googleDirectory.verifyEmail({
      email: this.email,
      $,
    });

    const data = {
      email: this.email,
      name: this.name,
      description: this.description,
    };

    const response = await this.googleDirectory.createGroup({
      data,
      $,
    });

    $.export("$summary", `Successfully created group with ID ${response.id}.`);

    return response;
  },
};
