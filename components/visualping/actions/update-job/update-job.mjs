import visualping from "../../visualping.app.mjs";
import { prepareData } from "../../common/utils.mjs";

export default {
  key: "visualping-update-job",
  name: "Update Job",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Updates one or more settings of an existing Visualping job — schedule,"
    + " trigger, notification config, crop region, and more. Only the fields you pass"
    + " are changed; everything else on the job stays as-is."
    + " Use **Find Jobs** or **Get Job Details By Id** first to confirm the `jobId`"
    + " and current settings if you're not certain which job the user means."
    + " Example: to pause a noisy job, call with just `jobId=\"482913\"` and"
    + " `active=false` → returns the updated job object with `active: false`."
    + " [See the documentation](https://develop.api.visualping.io/doc.html#tag/Jobs/paths/~1v2~1jobs~1%7BjobId%7D/put)",
  type: "action",
  ai: "optimized",
  props: {
    visualping,
    workspaceId: {
      propDefinition: [
        visualping,
        "workspaceId",
      ],
      optional: true,
    },
    jobId: {
      propDefinition: [
        visualping,
        "jobId",
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
      optional: true,
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
    targetDevice: {
      propDefinition: [
        visualping,
        "targetDevice",
      ],
      optional: true,
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
      optional: true,
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
      optional: true,
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
      optional: true,
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
      optional: true,
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
      optional: true,
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

    const updatedJob = prepareData(job, data);

    await visualping.updateJob({
      $,
      jobId,
      data: {
        workspaceId,
        ...updatedJob,
      },
    });

    // The update endpoint's own response is a change-impact summary
    // (e.g. "non-breaking-only"), not the job's fields — return the merged
    // job state instead so callers can see what actually changed.
    const result = {
      ...updatedJob,
      id: jobId,
    };

    $.export("$summary", `The job with id ${jobId} was successfully updated!`);
    return result;
  },
};
