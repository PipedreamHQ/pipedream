import app from "../../slack_bot.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";
import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL, ConfigurationError,
} from "@pipedream/platform";

export default {
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Polling schedule",
      description: "How often to poll the Slack API",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      const sdk = await this.app.sdk();
      const auth = await sdk.auth.test();
      const scopes = auth.response_metadata.scopes;

      const missingScopes = constants.REQUIRED_SOURCE_SCOPES.filter(
        (scope) => !scopes.includes(scope),
      );
      if (missingScopes.length) {
        throw new ConfigurationError(`Scope(s) \`${missingScopes}\` missing from your Slack app.
          Scopes provided: \`${scopes}\``);
      }

      const botUserId = auth.user_id;
      const { members } = await sdk.conversations.members({
        channel: this.channelId,
      });
      if (!members.includes(botUserId)) {
        throw new ConfigurationError("Bot not added to channel. From the Slack app, right click on the bot name and select `View app details`. Then click `Add this app to a channel` and select the appropriate channel.");
      }
    },
  },
  methods: {
    setLastTimestamp(value) {
      this.db.set(constants.LAST_TIMESTAMP, value);
    },
    getLastTimestamp() {
      return this.db.get(constants.LAST_TIMESTAMP);
    },
    getResourceName() {
      throw new Error("getResourceName is not implemented");
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    getResourceFnArgs() {
      throw new Error("getResourceFnArgs is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    processEvent(resource) {
      const meta = this.generateMeta(resource);
      this.$emit(resource, meta);
    },
    async processStreamEvents(stream) {
      const resources = await utils.streamIterator(stream);

      const [
        lastResource,
      ] = resources;

      if (lastResource?.ts) {
        this.setLastTimestamp(lastResource.ts);
      }

      resources
        .reverse()
        .forEach(this.processEvent);
    },
    async *getResourcesStream({
      resourcesName = constants.RESOURCE_NAME.MESSAGES,
      resourceFn,
      resourceFnArgs,
      max = constants.MAX_RESOURCES,
    }) {
      let cursor;
      let resourcesCount = 0;
      let response;

      while (true) {
        try {
          response =
            await resourceFn({
              ...resourceFnArgs,
              cursor,
            });
        } catch (error) {
          console.log("resourceFn error", error);
          return;
        }

        const nextResources = response[resourcesName];
        cursor = response.response_metadata.next_cursor;

        if (nextResources?.length < 1) {
          return;
        }

        for (const resource of nextResources) {
          resourcesCount += 1;
          yield resource;
        }

        if (!response.has_more || resourcesCount >= max) {
          return;
        }
      }
    },
  },
  async run() {
    const stream = this.getResourcesStream({
      resourcesName: this.getResourceName(),
      resourceFn: this.getResourceFn(),
      resourceFnArgs: this.getResourceFnArgs(),
    });

    await this.processStreamEvents(stream);
  },
};
