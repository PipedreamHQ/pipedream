import workday from "../../workday.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "workday-initiate-home-contact-information-change",
  name: "Initiate Home Contact Information Change",
  description: "Initiates a home contact change for a worker. [See the Documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#person/v4/)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    workday,
    workerId: {
      propDefinition: [
        workday,
        "workerId",
      ],
    },
  },
  async run({ $ }) {
    if (!this.workerId || !this.workerId.trim()) {
      throw new ConfigurationError("Worker ID is required.");
    }
    const response = await this.workday.createHomeContactInformationChange({
      workerId: this.workerId,
      data: {},
      $,
    });
    $.export("$summary", `Home contact change event initiated for worker ID ${this.workerId}`);
    return response;
  },
};
