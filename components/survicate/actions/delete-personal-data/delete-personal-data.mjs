import app from "../../survicate.app.mjs";

export default {
  key: "survicate-delete-personal-data",
  name: "Delete Personal Data",
  description: "Deletes personal data associated with an email address for GDPR compliance. [See the documentation](https://developers.survicate.com/data-export/personal-data/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    openWorldHint: true,
  },
  props: {
    app,
    email: {
      type: "string",
      label: "Email",
      description: "The email address for which to delete all associated data. The search is case-insensitive and handles whitespace.",
    },
  },
  async run({ $ }) {
    const {
      app,
      email,
    } = this;

    const response = await app.deletePersonalData({
      $,
      params: {
        email,
      },
    });

    $.export("$summary", "Successfully deleted personal data");
    return response;
  },
};
