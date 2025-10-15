import app from "../../viral_loops.app.mjs";

export default {
  name: "Get Participant",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "viral_loops-get-participant",
  description: "Get a participant. [See documentation here](https://developers.viral-loops.com/reference/post_campaign-participant-query)",
  type: "action",
  props: {
    app,
    email: {
      type: "string",
      label: "Email",
      description: "The email of the user that will be returned. If this field is ommited, will return all participants",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {};

    if (this.email) {
      data.participants = [
        {
          email: this.email,
        },
      ];
    }

    const response = await this.app.getParticipant({
      $,
      data,
    });

    if (response) {
      $.export("$summary", `Successfully retrieved \`${response.data.length}\` participants`);
    }

    return response;
  },
};
