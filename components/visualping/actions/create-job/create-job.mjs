import visualping from "../../visualping.app.mjs";

export default {
  key: "visualping-create-job",
  name: "Create A New Job",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Creates a new Visualping monitoring job that checks a web page on a"
    + " schedule and alerts on a detected change. Use for requests like \"monitor this"
    + " page for changes\" or \"watch this URL and tell me when the price changes\"."
    + " Set `active: false` to create the job paused (useful for testing before it"
    + " starts consuming your plan's active-job quota)."
    + " Example: to watch a pricing page for any change every hour, call with"
    + " `url=\"https://example.com/pricing\"`, `mode=\"VISUAL\"`, `interval=\"60\"`,"
    + " `trigger=\"5\"`, `targetDevice=\"4\"`, `active=true` → returns the created job"
    + " object with its new `id`, which you'll need for **Get Job Details By Id**,"
    + " **Update Job**, or **Delete Job**."
    + " For `mode=\"TEXT\"` jobs, also set `keywordAction` and `keywords` to watch for"
    + " specific text changes. For AREA crawling (`targetDevice` `1` or `3`), also set"
    + " `cropX`/`cropY`/`cropWidth`/`cropHeight`."
    + " [See the docs here](https://develop.api.visualping.io/doc.html#tag/Jobs/paths/~1v2~1jobs/post)",
  type: "action",
  ai: "optimized",
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
    },
    keywordAction: {
      type: "string",
      label: "Keyword Action",
      description: "Keyword detection mode. Only used when `mode` is `TEXT`.",
      optional: true,
      options: [
        "ADDED",
        "ALL",
        "DELETED",
      ],
    },
    keywords: {
      type: "string[]",
      label: "Keywords",
      description: "List of keywords to detect. Only used when `mode` is `TEXT`.",
      optional: true,
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
    },
    cropX: {
      type: "integer",
      label: "Crop X",
      description: "Start X position of the crop. Only used when `targetDevice` is `1` (Area) or `3` (Specific Fold).",
      optional: true,
    },
    cropY: {
      type: "integer",
      label: "Crop Y",
      description: "Start Y position of the crop. Only used when `targetDevice` is `1` (Area) or `3` (Specific Fold).",
      optional: true,
    },
    cropWidth: {
      type: "integer",
      label: "Crop Width",
      description: "The width of the crop. Only used when `targetDevice` is `1` (Area) or `3` (Specific Fold).",
      optional: true,
    },
    cropHeight: {
      type: "integer",
      label: "Crop Height",
      description: "The height of the crop. Only used when `targetDevice` is `1` (Area) or `3` (Specific Fold).",
      optional: true,
    },
    proxyId: {
      propDefinition: [
        visualping,
        "proxyId",
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
    },
    stopTime: {
      type: "integer",
      min: 0,
      max: 24,
      label: "Stop Time",
      description: "The hour to stop monitoring (0-24). Only used when `advancedScheduleActive` is `true`.",
      optional: true,
    },
    startTime: {
      type: "integer",
      min: 0,
      max: 24,
      label: "Start Time",
      description: "The hour to start monitoring (0-24). Only used when `advancedScheduleActive` is `true`.",
      optional: true,
    },
    activeDays: {
      type: "integer[]",
      label: "Active Days",
      description: "List of days from 1 to 7 the schedule is active. Only used when `advancedScheduleActive` is `true`.",
      optional: true,
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
    },
    slackUrl: {
      type: "string",
      label: "Slack URL",
      description: "The URL to the slack notification. Only used when `useSlackNotification` is `true`.",
      optional: true,
    },
    slackChannels: {
      type: "string[]",
      label: "Slack Channels",
      description: "A list of slack's channels. Only used when `useSlackNotification` is `true`.",
      optional: true,
    },
    useTeamsNotification: {
      propDefinition: [
        visualping,
        "useTeamsNotification",
      ],
      default: false,
    },
    teamsUrl: {
      type: "string",
      label: "Teams URL",
      description: "The URL to the teams notification. Only used when `useTeamsNotification` is `true`.",
      optional: true,
    },
    useWebhookNotification: {
      propDefinition: [
        visualping,
        "useWebhookNotification",
      ],
      default: false,
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "The URL to the webhook notification. Only used when `useWebhookNotification` is `true`.",
      optional: true,
    },
    useDiscordNotification: {
      propDefinition: [
        visualping,
        "useDiscordNotification",
      ],
      default: false,
    },
    discordUrl: {
      type: "string",
      label: "Discord URL",
      description: "The URL to the discord notification. Only used when `useDiscordNotification` is `true`.",
      optional: true,
    },
    useSlackAppNotification: {
      propDefinition: [
        visualping,
        "useSlackAppNotification",
      ],
      default: false,
    },
    slackAppUrl: {
      type: "string",
      label: "Slack App URL",
      description: "The URL to the slack app notification. Only used when `useSlackAppNotification` is `true`.",
      optional: true,
    },
    slackAppChannels: {
      type: "string[]",
      label: "Slack App Channels",
      description: "A list of slack app's channels. Only used when `useSlackAppNotification` is `true`.",
      optional: true,
    },
    workspaceId: {
      propDefinition: [
        visualping,
        "workspaceId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      visualping,
      adCampaign,
      targetDevice,
      proxyId,
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
      : undefined;

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

    const hasCrop = (this.targetDevice === "1" || this.targetDevice === "3")
      && cropX != undefined && cropY != undefined
      && cropWidth != undefined && cropHeight != undefined;
    const crop = hasCrop
      ? {
        x: cropX,
        y: cropY,
        width: cropWidth,
        height: cropHeight,
      }
      : undefined;

    const response = await visualping.createJob({
      $,
      data: {
        ...data,
        ad_campaign: adCampaign,
        target_device: targetDevice,
        proxy_id: proxyId,
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

    // The create response's own `id` field is an opaque tracking token, not the
    // numeric job id every other endpoint (`get`/`update`/`delete`/`find`) expects —
    // `jobid` is that numeric id. Normalize `id` to match so callers can chain
    // straight into those tools without hitting a 404 on the wrong identifier.
    const result = {
      ...response,
      id: response.jobid,
    };

    // Visualping's create endpoint always creates jobs active regardless of the
    // `active` flag in this request — pause it with an immediate follow-up call
    // when the caller asked for a paused job, so `active: false` actually means paused.
    if (this.active === false) {
      await visualping.updateJob({
        $,
        jobId: result.id,
        data: {
          workspaceId,
          active: false,
        },
      });
      result.active = "0";
    }

    $.export("$summary", `A new job with id ${result.id} was successfully created!`);
    return result;
  },
};
