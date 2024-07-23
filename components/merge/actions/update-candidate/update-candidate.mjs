import app from "../../merge.app.mjs";

export default {
  key: "merge-update-candidate",
  name: "Update Candidate",
  description: "Update a candidate profile with the specified ID. [See the documentation](https://docs.merge.dev/ats/candidates/#candidates_partial_update)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    candidate: {
      propDefinition: [
        app,
        "candidate",
      ],
    },
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
    const response = await this.app.updateCandidate({
      $,
      id: this.candidate,
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

    $.export("$summary", `Successfully updated the candidate with ID ${this.candidate}`);

    return response;
  },
};
