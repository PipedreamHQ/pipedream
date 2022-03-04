import discordWebhook from "../discord_webhook.app.mjs";

/* eslint-disable pipedream/required-properties-key, pipedream/required-properties-name,
  pipedream/required-properties-version, pipedream/required-properties-description */
export default {
  type: "action",
  props: {
    discordWebhook,
    message: {
      propDefinition: [
        discordWebhook,
        "message",
      ],
    },
    threadID: {
      propDefinition: [
        discordWebhook,
        "threadID",
      ],
    },
    username: {
      propDefinition: [
        discordWebhook,
        "username",
      ],
    },
    avatarURL: {
      propDefinition: [
        discordWebhook,
        "avatarURL",
      ],
    },
    includeSentViaPipedream: {
      type: "boolean",
      optional: true,
      default: true,
      label: "Include link to workflow",
      description: "Defaults to `true`, includes a link to this workflow at the end of your Discord message.",
    },
  },
  methods: {
    _getWorkflowUrl() {
      const workflowId = process.env.PIPEDREAM_WORKFLOW_ID;
      const traceId = process.env.PIPEDREAM_TRACE_ID;
      return `https://pipedream.com/@/${workflowId}/inspect/${traceId}?origin=action&a=discord_webhook`;
    },
    getSentViaPipedreamText() {
      const link = this._getWorkflowUrl();
      return `Sent via [pipedream.com](<${link}>)`;
    },
  },
};
