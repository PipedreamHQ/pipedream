import app from "../../merge.app.mjs";

export default {
  key: "merge-create-candidate",
  name: "Create Candidate",
  description: "Create a new candidate profile. [See the documentation](https://docs.merge.dev/ats/candidates/#candidates_create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    firstName: {
      propDefinition: [
        app,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        app,
        "lastName",
      ],
    },
    canEmail: {
      propDefinition: [
        app,
        "canEmail",
      ],
    },
    emailAddress: {
      propDefinition: [
        app,
        "emailAddress",
      ],
    },
    emailType: {
      propDefinition: [
        app,
        "emailType",
      ],
    },
    remoteUserId: {
      propDefinition: [
        app,
        "remoteUserId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createCandidate({
      $,
      data: {
        model: {
          first_name: this.firstName,
          last_name: this.lastName,
          can_email: this.canEmail,
          email_addresses: [
            {
              value: this.emailAddress,
              email_address_type: this.emailType,
            },
          ],
        },
        remote_user_id: this.remoteUserId,
      },
    });

    $.export("$summary", `Successfully created the candidate '${this.firstName} ${this.lastName}'`);

    return response;
  },
};
