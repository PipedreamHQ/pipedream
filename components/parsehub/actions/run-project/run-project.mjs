import parsehub from "../../parsehub.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "parsehub-run-project",
  name: "Run Parsehub Project",
  description: "Initiates an instance of a specified project on the Parsehub cloud. [See the documentation](https://www.parsehub.com/docs/ref/api/v2/#run-a-project)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    parsehub,
    projectId: {
      propDefinition: [
        parsehub,
        "projectId",
      ],
    },
    startUrl: {
      type: "string",
      label: "Start URL",
      description: "The URL that Parsehub should start the run on.",
      optional: true,
    },
    startTemplate: {
      type: "string",
      label: "Start Template",
      description: "The name of the template with which Parsehub should start executing the project.",
      optional: true,
    },
    startValueOverride: {
      type: "string",
      label: "Start Value Override",
      description: "JSON stringified value that overrides the initial value used by the project.",
      optional: true,
    },
    sendEmail: {
      type: "boolean",
      label: "Send Email",
      description: "Whether Parsehub should send an email when the run finishes.",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const data = {
      api_key: this.parsehub.$auth.api_key,
    };

    if (this.startUrl) data.start_url = this.startUrl;
    if (this.startTemplate) data.start_template = this.startTemplate;
    if (this.startValueOverride) data.start_value_override = this.startValueOverride;
    if (this.sendEmail) data.send_email = this.sendEmail
      ? 1
      : 0;

    const response = await this.parsehub.runProject({
      projectId: this.projectId,
      data,
    });

    $.export("$summary", `Successfully initiated project run for project ID: ${this.projectId}`);
    return response;
  },
};
