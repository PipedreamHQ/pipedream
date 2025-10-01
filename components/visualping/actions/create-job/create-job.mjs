import visualping from "../../app/visualping.app.mjs";

export default {
  key: "visualping-create-job",
  name: "Create A New Job",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Creates a new job that will belong to a given user or workspace. [See the docs here](https://develop.api.visualping.io/doc.html#tag/Jobs/paths/~1v2~1jobs/post)",
  type: "action",
  props: {
    visualping,
    email: {
      propDefinition: [
        visualping,
        "email",
      ],
      optional: true,
    },
    business: {
      propDefinition: [
        visualping,
        "business",
      ],
      optional: true,
    },
    locale: {
      propDefinition: [
        visualping,
        "locale",
      ],
      optional: true,
    },
    siteReferer: {
      propDefinition: [
        visualping,
        "siteReferer",
      ],
      optional: true,
    },
    adCampaign: {
      propDefinition: [
        visualping,
        "adCampaign",
      ],
      optional: true,
    },
    origin: {
      propDefinition: [
        visualping,
        "origin",
      ],
      optional: true,
    },
    contentType: {
      propDefinition: [
        visualping,
        "contentType",
      ],
      optional: true,
    },
    url: {
      propDefinition: [
        visualping,
        "url",
      ],
    },
    description: {
      propDefinition: [
        visualping,
        "description",
      ],
    },
    mode: {
      propDefinition: [
        visualping,
        "mode",
      ],
      reloadProps: true,
    },
    active: {
      propDefinition: [
        visualping,
        "active",
      ],
    },
    interval: {
      propDefinition: [
        visualping,
        "interval",
      ],
    },
    trigger: {
      propDefinition: [
        visualping,
        "trigger",
      ],
    },
    targetDevice: {
      propDefinition: [
        visualping,
        "targetDevice",
      ],
      reloadProps: true,
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
    },
    enableEmailAlert: {
      propDefinition: [
        visualping,
        "enableEmailAlert",
      ],
      default: false,
    },
    useSlackNotification: {
      propDefinition: [
        visualping,
        "useSlackNotification",
      ],
      default: false,
      reloadProps: true,
    },
    useTeamsNotification: {
      propDefinition: [
        visualping,
        "useTeamsNotification",
      ],
      default: false,
      reloadProps: true,
    },
    useWebhookNotification: {
      propDefinition: [
        visualping,
        "useWebhookNotification",
      ],
      default: false,
      reloadProps: true,
    },
    useDiscordNotification: {
      propDefinition: [
        visualping,
        "useDiscordNotification",
      ],
      default: false,
      reloadProps: true,
    },
    useSlackAppNotification: {
      propDefinition: [
        visualping,
        "useSlackAppNotification",
      ],
      default: false,
      reloadProps: true,
    },
    workspaceId: {
      propDefinition: [
        visualping,
        "workspaceId",
      ],
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
      adCampaign,
      targetDevice,
      fixedProxyAlias,
      disableJS,
      pageHeight,
      waitTime,
      preactionsActive,
      preactionsObjects,
      advancedScheduleActive,
      multicheckEnabled,
      enableSmsAlert,
      enableEmailAlert,
      useSlackNotification,
      useTeamsNotification,
      useWebhookNotification,
      useDiscordNotification,
      useSlackAppNotification,
      workspaceId,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      keywordAction,
      keywords,
      mode,
      trigger,
      stopTime,
      startTime,
      activeDays,
      slackUrl,
      slackChannels,
      teamsUrl,
      webhookUrl,
      discordUrl,
      slackAppUrl,
      slackAppChannels,
      ...data
    } = this;

    const advancedSchedule = advancedScheduleActive
      ? {
        stop_time: stopTime,
        start_time: startTime,
        active_days: activeDays,
      }
      : null;

    const nofiticationConfig = {};
    if (useSlackNotification) {
      nofiticationConfig.slack = {
        url: slackUrl,
        active: true,
        channels: slackChannels,
      };
    }
    if (useTeamsNotification) {
      nofiticationConfig.teams = {
        url: teamsUrl,
        active: true,
      };
    }
    if (useWebhookNotification) {
      nofiticationConfig.webhook = {
        url: webhookUrl,
        active: true,
      };
    }
    if (useDiscordNotification) {
      nofiticationConfig.discord = {
        url: discordUrl,
        active: true,
      };
    }
    if (useSlackAppNotification) {
      nofiticationConfig.slack_app = {
        url: slackAppUrl,
        active: true,
        channels: slackAppChannels,
      };
    }

    const crop = (this.targetDevice && (this.targetDevice === "1" || this.targetDevice === "3")) ?
      {
        x: cropX,
        y: cropY,
        width: cropWidth,
        height: cropHeight,
      }
      : null;

    const response = await visualping.createJob({
      $,
      data: {
        ...data,
        ad_campaign: adCampaign,
        target_device: targetDevice,
        fixed_proxy_alias: fixedProxyAlias,
        disable_js: disableJS,
        page_height: pageHeight,
        wait_time: waitTime,
        preactions: {
          active: preactionsActive,
          actions: preactionsObjects,
        },
        trigger,
        advanced_schedule: advancedSchedule,
        mode,
        multicheck_enabled: multicheckEnabled,
        notification: {
          enableSmsAlert,
          enableEmailAlert,
          configuration: {
            ...nofiticationConfig,
          },
          threshold: {
            VISUAL: parseFloat(trigger),
            TEXT: parseFloat(trigger),
            WEB: parseFloat(trigger),
          },
        },
        workspaceId,
        crop,
        keyword_action: keywordAction,
        keywords: keywords && keywords.toString(),
      },
    });

    $.export("$summary", `A new job with id ${response.id} was successfully created!`);
    return response;
  },
};
