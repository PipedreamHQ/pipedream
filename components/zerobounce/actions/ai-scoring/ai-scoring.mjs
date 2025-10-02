import zerobounce from "../../zerobounce.app.mjs";

export default {
  key: "zerobounce-ai-scoring",
  name: "AI Scoring",
  description: "Estimates a reliability score based on ZeroBounce's AI for the provided email. [See the documentation](https://www.zerobounce.net/docs/ai-scoring-api/#single_email_scoring)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    zerobounce,
    email: {
      type: "string",
      label: "Email",
      description: "The email address that you want to retrieve Scoring data for",
    },
  },
  async run({ $ }) {
    const response = await this.zerobounce.getReliabilityScore({
      $,
      params: {
        email: this.email,
      },
    });
    $.export("$summary", `Successfully estimated reliability score for email: ${this.email}`);
    return response;
  },
};
