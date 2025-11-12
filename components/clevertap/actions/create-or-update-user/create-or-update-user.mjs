import app from "../../clevertap.app.mjs";

export default {
  name: "Create Or Update User",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "clevertap-create-or-update-user",
  description: "Create or update an user. [See the documentation](https://developer.clevertap.com/docs/upload-user-profiles-api)",
  type: "action",
  props: {
    app,
    email: {
      type: "string",
      label: "Email",
      description: "Email of the user",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the user",
    },
    phone: {
      type: "string",
      label: "Phone Number, e.g +15555555555",
      description: "Phone number of the user",
    },
    identity: {
      type: "string",
      label: "Identity",
      description: "Identifier of the user",
    },
  },
  async run({ $ }) {
    const response = await this.app.uploadEvent({
      $,
      data: {
        d: [
          {
            $source: "Pipedream",
            type: "profile",
            identity: this.identity,
            profileData: {
              Name: this.name,
              Email: this.email,
              Phone: this.phone,
            },
          },
        ],
      },
    });

    if (response.status === "success") {
      $.export("$summary", "Successfully created or updated user");
    }

    return response;
  },
};
