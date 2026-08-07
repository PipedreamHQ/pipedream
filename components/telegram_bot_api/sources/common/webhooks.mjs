import telegramBotApi from "../../telegram_bot_api.app.mjs";
import constants from "./constants.mjs";
import { v4 as uuid } from "uuid";
import { ConfigurationError } from "@pipedream/platform";

const PIPEDREAM_WEBHOOK_DOMAIN = "pipedream.net";

/**
 * Returns true only when `url` is hosted on a pipedream.net subdomain or
 * exactly on pipedream.net itself. Parsing the hostname prevents path-based
 * spoofing (e.g. https://evil.com/pipedream.net would pass a naive .includes()
 * check but fails here because the hostname is evil.com).
 */
function isPipedreamWebhook(url) {
  try {
    const { hostname } = new URL(url);
    return hostname === PIPEDREAM_WEBHOOK_DOMAIN
      || hostname.endsWith(`.${PIPEDREAM_WEBHOOK_DOMAIN}`);
  } catch {
    return false;
  }
}

export default {
  props: {
    telegramBotApi,
    db: "$.service.db",
    http: {
      label: "HTTP Responder",
      description: "Exposes a `respond()` method that lets the source issue HTTP responses",
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async deploy() {
      /**
       * Telegram supports only one webhook per bot. If a stale Pipedream-owned
       * webhook survives from a prior deploy (e.g. the source was removed with
       * ignoreHookErrors so deactivate() never ran), clear it before registering
       * the new one — otherwise activate() registers a new endpoint + secret while
       * the old source endpoint stays alive with the old secret, causing run() to
       * silently reject every incoming event.
       *
       * Non-Pipedream webhooks are left intact: the original ConfigurationError is
       * preserved so users are warned before an external integration is disrupted.
       */
      const { result } = await this.telegramBotApi.getWebhookInfo();
      if (result.url?.length > 0) {
        if (isPipedreamWebhook(result.url)) {
          console.log(`Removing stale Pipedream webhook (${result.url}) before deploying...`);
          await this.telegramBotApi.deleteHook();
        } else {
          throw new ConfigurationError("[Telegram only supports](https://core.telegram.org/bots/api#setwebhook) a single webhook at a time, for a given Bot. To get around this, you can reuse an existing Telegram Bot source or disable the active source and try again. [View all your sources here](https://pipedream.com/sources).");
        }
      }
      /**
       * From the docs: https://core.telegram.org/bots/api#getting-updates
       *
       * Incoming updates are stored on the server until the bot receives them either way,
       * but they will not be kept longer than 24 hours.
       *
       * So there's a big chance that no historical event is emitted.
       */
      console.log("Fetching most recent events...");
      const events = await this.telegramBotApi.getUpdates({
        offset: constants.DEPLOY_OFFSET,
        allowed_updates: this.getEventTypes(),
      });
      console.log(`Received ${events.length} event(s)`);
      for (const event of events) {
        this.processEvent(event);
      }
    },
    async activate() {
      const secret = uuid();
      this.setSecret(secret);
      /**
       * Clear any stale Pipedream-owned webhook before registering the new one.
       * If the existing webhook belongs to an external (non-Pipedream) service,
       * throw ConfigurationError — Telegram's setWebhook would overwrite it
       * otherwise, silently breaking the external integration.
       */
      const { result } = await this.telegramBotApi.getWebhookInfo();
      if (result.url?.length > 0) {
        if (isPipedreamWebhook(result.url)) {
          await this.telegramBotApi.deleteHook();
        } else {
          throw new ConfigurationError("[Telegram only supports](https://core.telegram.org/bots/api#setwebhook) a single webhook at a time, for a given Bot. To get around this, you can reuse an existing Telegram Bot source or disable the active source and try again. [View all your sources here](https://pipedream.com/sources).");
        }
      }
      await this.telegramBotApi.createHook(this.http.endpoint, this.getEventTypes(), secret);
    },
    async deactivate() {
      await this.telegramBotApi.deleteHook();
    },
  },
  methods: {
    getSecret() {
      return this.db.get("secret");
    },
    setSecret(secret) {
      this.db.set("secret", secret);
    },
    getEventTypes() {
      throw new Error("getEventTypes is not implemented");
    },
    processEvent() {
      throw new Error("processEvent is not implemented");
    },
  },
  async run(event) {
    // check if event has the same secret
    if (event.headers["x-telegram-bot-api-secret-token"] !== this.getSecret()) {
      console.log("Could not identify sender identity, exiting...");
      return;
    }

    this.http.respond({
      status: 200,
    });

    const { body } = event;

    if (!body) {
      console.log("No body received, exiting...");
      return;
    }

    this.processEvent(body);
  },
};
