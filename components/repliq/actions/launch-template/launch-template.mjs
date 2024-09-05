import { predefinedProps } from "../../common/props.mjs";
import repliq from "../../repliq.app.mjs";

export default {
  key: "repliq-launch-template",
  name: "Launch Repliq Template",
  description: "Launch a Repliq process by deploying the selected template. [See the documentation](https://developer.repliq.co/)",
  version: "0.0.1",
  type: "action",
  props: {
    repliq,
    templateId: {
      propDefinition: [
        repliq,
        "templateId",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    let props = {};
    if (this.templateId) {
      const templates = await this.repliq.listTemplates();
      const template = templates.find((item) => item.id === this.templateId);

      props = {
        ...predefinedProps[template.type],
        email: {
          type: "string",
          label: "Email",
          description: "The account email you want to send this result to.",
          optional: true,
        },
        webhook: {
          type: "string",
          label: "Webhook",
          description: "Attach a webhook URL that will trigger when the process is ready for you to use. You cannot use multiple URLs.",
          optional: true,
        },
      };
    }
    return props;
  },
  async run({ $ }) {
    const {
      repliq,
      ...data
    } = this;

    const response = await repliq.launchTemplate({
      $,
      data,
    });
    $.export("$summary", `Successfully launched template with ID ${this.templateId}`);
    return response;
  },
};
