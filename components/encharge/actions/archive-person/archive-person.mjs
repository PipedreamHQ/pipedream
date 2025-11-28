import app from "../../encharge.app.mjs";

export default {
  key: "encharge-archive-person",
  name: "Archive Person",
  description: "Archive a person in Encharge. [See the documentation](https://app-encharge-resources.s3.amazonaws.com/redoc.html#/people/archivepeople)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
      description: "The user ID of the person to archive.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the person to archive.",
      optional: true,
    },
    force: {
      type: "boolean",
      label: "Force",
      description: "If set to `true`, will delete the person's data. This is useful for GDPR-compliant removal of user data.",
      default: false,
    },
  },
  async run({ $ }) {
    if (!this.userId && !this.email) {
      throw new Error("You must provide either a user ID or an email.");
    }
    if (this.userId && this.email) {
      throw new Error("You must provide either a user ID or an email, not both.");
    }

    const response = await this.app.archivePerson({
      $,
      params: {
        people: [
          {
            id: this.userId,
            email: this.email,
          },
        ],
        force: this.force,
      },
    });
    $.export("$summary", `Successfully archived person with ${this.userId
      ? `ID ${this.userId}`
      : `email ${this.email}`}`);
    return response;
  },
};
