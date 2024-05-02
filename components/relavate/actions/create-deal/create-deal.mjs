import relavate from "../../relavate.app.mjs";

export default {
  key: "relavate-create-deal",
  name: "Create Deal",
  description: "Creates a new deal with specified details and priority. [See the documentation](https://api.relavate.co/)",
  version: "0.0.1",
  type: "action",
  props: {
    relavate,
    dealDetails: relavate.propDefinitions.dealDetails,
    priority: relavate.propDefinitions.priority,
  },
  async run({ $ }) {
    const response = await this.relavate.createDeal(this.dealDetails, this.priority);
    $.export("$summary", `Successfully created deal with priority ${this.priority}`);
    return response;
  },
};
