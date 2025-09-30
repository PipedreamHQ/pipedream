import app from "../../leadfeeder.app.mjs";

export default {
  key: "leadfeeder-find-lead",
  name: "Find Lead",
  description: "Retrieves a specific lead. [See the docs](https://docs.leadfeeder.com/api/#get-a-specific-lead).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    accountId: {
      propDefinition: [
        app,
        "accountId",
      ],
    },
    leadId: {
      propDefinition: [
        app,
        "leadId",
        ({ accountId }) => ({
          accountId,
        }),
      ],
    },
  },
  async run({ $: step }) {
    const {
      accountId,
      leadId,
    } = this;

    const response =
      await this.getLead({
        step,
        accountId,
        leadId,
      });

    step.export("$summary", `Successfully found lead with ID ${response?.data?.id}`);

    return response;
  },
};
