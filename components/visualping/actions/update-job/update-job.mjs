import visualping from "../../app/visualping.app.mjs";
import { prepareData } from "../../common/utils.mjs";

export default {
  key: "visualping-update-job",
  name: "Update Job",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Update an existing job. [See the docs here](https://develop.api.visualping.io/doc.html#tag/Jobs/paths/~1v2~1jobs~1%7BjobId%7D/put)",
  type: "action",
  props: {
    visualping,
    workspaceId: {
      propDefinition: [
        visualping,
        "workspaceId",
      ],
    },
    jobId: {
      propDefinition: [
        visualping,
        "jobId",
        ({ workspaceId }) => ({
          workspaceId,
        }),
      ],
    },
    organisationId: {
      propDefinition: [
        visualping,
        "organisationId",
      ],
      optional: true,
    },
    url: {
      propDefinition: [
        visualping,
        "url",
      ],
      optional: true,
    },
    description: {
      propDefinition: [
        visualping,
        "description",
      ],
      optional: true,
    },
    mode: {
      propDefinition: [
        visualping,
        "mode",
      ],
      reloadProps: true,
      optional: true,
    },
    active: {
      propDefinition: [
        visualping,
        "active",
      ],
      optional: true,
    },
    interval: {
      propDefinition: [
        visualping,
        "interval",
      ],
      optional: true,
    },
    trigger: {
      propDefinition: [
        visualping,
        "trigger",
      ],
      optional: true,
    },
    proxy: {
      propDefinition: [
        visualping,
        "proxy",
      ],
      optional: true,
    },
    fixedProxyAlias: {
      propDefinition: [
        visualping,
        "fixedProxyAlias",
      ],
      optional: true,
    },
    xpath: {
      propDefinition: [
        visualping,
        "xpath",
      ],
      optional: true,
    },
    renderer: {
      propDefinition: [
        visualping,
        "renderer",
      ],
      optional: true,
    },
    disableJS: {
      propDefinition: [
        visualping,
        "disableJS",
      ],
      optional: true,
    },
    pageHeight: {
      propDefinition: [
        visualping,
        "pageHeight",
      ],
      optional: true,
    },
    targetDevice: {
      propDefinition: [
        visualping,
        "targetDevice",
      ],
      reloadProps: true,
      optional: true,
    },
    waitTime: {
      propDefinition: [
        visualping,
        "waitTime",
      ],
      optional: true,
    },
    preactionsActive: {
      propDefinition: [
        visualping,
        "preactionsActive",
      ],
      optional: true,
    },
    preactionsObjects: {
      propDefinition: [
        visualping,
        "preactionsObjects",
      ],
      optional: true,
    },
    advancedScheduleActive: {
      propDefinition: [
        visualping,
        "advancedScheduleActive",
      ],
      optional: true,
      reloadProps: true,
    },
    multicheckEnabled: {
      propDefinition: [
        visualping,
        "multicheckEnabled",
      ],
      optional: true,
    },
    enableSmsAlert: {
      propDefinition: [
        visualping,
        "enableSmsAlert",
      ],
      default: false,
      optional: true,
    },
    enableEmailAlert: {
      propDefinition: [
        visualping,
        "enableEmailAlert",
      ],
      default: false,
      optional: true,
    },
    useSlackNotification: {
      propDefinition: [
        visualping,
        "useSlackNotification",
      ],
      reloadProps: true,
      optional: true,
    },
    useTeamsNotification: {
      propDefinition: [
        visualping,
        "useTeamsNotification",
      ],
      reloadProps: true,
      optional: true,
    },
    useWebhookNotification: {
      propDefinition: [
        visualping,
        "useWebhookNotification",
      ],
      reloadProps: true,
      optional: true,
    },
    useDiscordNotification: {
      propDefinition: [
        visualping,
        "useDiscordNotification",
      ],
      reloadProps: true,
      optional: true,
    },
    useSlackAppNotification: {
      propDefinition: [
        visualping,
        "useSlackAppNotification",
      ],
      reloadProps: true,
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.targetDevice && (this.targetDevice === "1" || this.targetDevice === "3")) {
      props.cropX = {
        type: "integer",
        label: "Crop X",
        description: "Start X position to the crop.",
      };
      props.cropY = {
        type: "integer",
        label: "Crop Y",
        description: "Start Y position to the crop.",
      };
      props.cropWidth = {
        type: "integer",
        label: "Crop Width",
        description: "The width of the crop.",
      };
      props.cropHeight = {
        type: "integer",
        label: "Crop Height",
        description: "The height of the crop.",
      };
    }
    if (this.mode && this.mode === "TEXT") {
      props.keywordAction = {
        type: "string",
        label: "Keyword Action",
        description: "Keyword detection mode.",
        optional: true,
        options: [
          "ADDED",
          "ALL",
          "DELETED",
        ],
      };
      props.keywords = {
        type: "string[]",
        label: "Keywords",
        description: "List of keywords.",
        optional: true,
      };
    }
    if (this.advancedScheduleActive) {
      props.stopTime = {
        type: "integer",
        min: 0,
        max: 24,
        label: "Stop Time",
        description: "The time to stop.",
      };
      props.startTime = {
        type: "integer",
        min: 0,
        max: 24,
        label: "Start Time",
        description: "The time to start.",
      };
      props.activeDays = {
        type: "integer[]",
        label: "Active days",
        description: "List of days from 1 to 7.",
      };
    }
    if (this.useSlackNotification) {
      props.slackUrl = {
        type: "string",
        label: "Slack URL",
        description: "The URL to the slack notification.",
      };
      props.slackChannels = {
        type: "string[]",
        label: "Slack Channels",
        description: "A list of slack's channels.",
      };
    }
    if (this.useTeamsNotification) {
      props.teamsUrl = {
        type: "string",
        label: "Teams URL",
        description: "The URL to the teams notification.",
      };
    }
    if (this.useWebhookNotification) {
      props.webhookUrl = {
        type: "string",
        label: "Webhook URL",
        description: "The URL to the webhook notification.",
      };
    }
    if (this.useDiscordNotification) {
      props.discordUrl = {
        type: "string",
        label: "Discord URL",
        description: "The URL to the discord notification.",
      };
    }
    if (this.useSlackAppNotification) {
      props.slackAppUrl = {
        type: "string",
        label: "Slack App URL",
        description: "The URL to the slack app notification.",
      };
      props.slackAppChannels = {
        type: "string[]",
        label: "Slack App Channels",
        description: "A list of slack app' channels.",
      };
    }
    return props;
  },
  async run({ $ }) {
    const {
      visualping,
      jobId,
      workspaceId,
      ...data
    } = this;

    const job = await visualping.getJob({
      workspaceId,
      jobId,
    });

    const response = await visualping.updateJob({
      $,
      jobId,
      data: {
        workspaceId,
        ...prepareData(job, data),
      },
    });

    $.export("$summary", `The job with id ${jobId} was successfully updated!`);
    return response;
  },
};
