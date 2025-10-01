import app from "../../viral_loops.app.mjs";

export default {
  name: "Create Participant",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "viral_loops-create-participant",
  description: "Creates a participant. [See documentation here](https://developers.viral-loops.com/reference/post_campaign-participant-1)",
  type: "action",
  props: {
    app,
    firstName: {
      type: "string",
      label: "First name",
      description: "The first name of the participant",
    },
    lastName: {
      type: "string",
      label: "Last name",
      description: "The last name of the participant",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the participant",
    },
  },
  async run({ $ }) {
    const response = await this.app.createParticipant({
      $,
      data: {
        user: {
          email: this.email,
          firstname: this.firstName,
          lasttname: this.lastName,
        },
      },
    });

    if (response) {
      $.export("$summary", `Successfully created participant with referral code \`${response.referralCode}\``);
    }

    return response;
  },
};
