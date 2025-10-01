import app from "../../gainsight_nxt.app.mjs";

export default {
  key: "gainsight_nxt-create-or-update-person",
  name: "Create or Update Person",
  description: "Create or update a person's record. [See the documentation](https://support.gainsight.com/gainsight_nxt/API_and_Developer_Docs/Person_API/People_API_Documentation#Person)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the person. If a record with this email exists, it will be updated, otherwise a new one will be created.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the person.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the person.",
      optional: true,
    },
    linkedinUrl: {
      type: "string",
      label: "LinkedIn URL",
      description: "The LinkedIn URL of the person.",
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "The location of the person.",
      optional: true,
    },
    additionalFields: {
      type: "object",
      label: "Additional Fields",
      description: "Additional fields to include in the request body. [See the documentation](https://support.gainsight.com/gainsight_nxt/API_and_Developer_Docs/Person_API/People_API_Documentation#Person) for all available fields.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.createOrUpdatePerson({
      $,
      data: {
        Email: this.email,
        FirstName: this.firstName,
        LastName: this.lastName,
        LinkedinUrl: this.linkedinUrl,
        Location: this.location,
        ...this.additionalFields,
      },
    });

    $.export("$summary", `Successfully upserted person with email ${this.email}`);
    return response;
  },
};
