import nifty from "../../nifty.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "nifty-create-message",
  name: "Create Message",
  description: "Sends a new message in a team's discussion. [See the documentation](https://openapi.niftypm.com/api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    nifty,
    appId: {
      propDefinition: [
        nifty,
        "appId",
      ],
    },
    webhookId: {
      propDefinition: [
        nifty,
        "webhookId",
      ],
    },
    projectId: {
      propDefinition: [
        nifty,
        "projectId",
      ],
    },
    taskName: {
      propDefinition: [
        nifty,
        "taskName",
      ],
    },
    taskDescription: {
      propDefinition: [
        nifty,
        "taskDescription",
      ],
    },
    messageContent: {
      propDefinition: [
        nifty,
        "messageContent",
      ],
    },
    teamMemberId: {
      propDefinition: [
        nifty,
        "teamMemberId",
      ],
    },
    portfolioId: {
      propDefinition: [
        nifty,
        "portfolioId",
      ],
    },
    projectName: {
      propDefinition: [
        nifty,
        "projectName",
      ],
    },
    projectDescription: {
      propDefinition: [
        nifty,
        "projectDescription",
      ],
    },
    taskAssigneeId: {
      propDefinition: [
        nifty,
        "taskAssigneeId",
      ],
    },
    webhookUrl: {
      propDefinition: [
        nifty,
        "webhookUrl",
      ],
    },
    eventType: {
      propDefinition: [
        nifty,
        "eventType",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.nifty.sendMessage({
      projectId: this.projectId,
      messageContent: this.messageContent,
    });

    $.export("$summary", `Successfully sent message to project ID: ${this.projectId}`);
    return response;
  },
};
