import app from "../../quentn.app.mjs";

export default {
  key: "quentn-run-campaign-for-contact",
  name: "Run Campaign for Contact",
  description: "Runs a campaign for a contact. [See the docs](https://help.quentn.com/hc/en-150/articles/4518054010129-Campaign-API).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    email: {
      propDefinition: [
        app,
        "email",
      ],
      description: "This email must be associated with a contact in Quentn.",
    },
    elementId: {
      type: "integer",
      label: "Campaign Receieve Element ID",
      description: "The ID of the campaign receive element can be found in workflow builder.",
    },
  },
  methods: {
    triggerAPIRecieveElement({
      elementId, ...args
    } = {}) {
      return this.app.makeRequest({
        method: "post",
        versionPath: "/public/api/v1",
        path: `/cb/${elementId}`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      email,
      elementId,
    } = this;

    try {
      const response = await this.triggerAPIRecieveElement({
        elementId,
        data: {
          mail: email,
        },
      });

      step.export("$summary", `Successfully ran campaign for contact with email ${email}`);

      return response;

    } catch (error) {
      if (error.response.status === 404) {
        throw new Error("Campaign not found");
      }
      throw error;
    }
  },
};
