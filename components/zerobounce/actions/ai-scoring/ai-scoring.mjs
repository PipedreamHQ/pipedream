import zerobounce from "../../zerobounce.app.mjs";

export default {
  key: "zerobounce-ai-scoring",
  name: "AI Scoring",
  description: "Estimates a reliability score based on ZeroBounce's AI for the provided email. [See the documentation](https://www.zerobounce.net/docs/ai-scoring-api/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    zerobounce,
    email: zerobounce.propDefinitions.email,
  },
  async run({ $ }) {
    const response = await this.zerobounce.getReliabilityScore(this.email);
    $.export("$summary", `Successfully estimated reliability score for email: ${this.email}`);
    return response;
  },
};
