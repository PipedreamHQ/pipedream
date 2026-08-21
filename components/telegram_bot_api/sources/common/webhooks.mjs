import telegramBotApi from "../../telegram_bot_api.app.mjs";
import constants from "./constants.mjs";
import { v4 as uuid } from "uuid";
import { ConfigurationError } from "@pipedream/platform";

/**
 * Origin + path of `url`, with any trailing slash removed, or `null` when the
 * value is not a parseable absolute URL. Comparing the parsed form rather than
 * the raw string avoids both false negatives from a trailing slash and
 * substring-based spoofing such as `https://evil.com/?u=<our endpoint>`.
 */
function normalizeUrl(url) {
  try {
    const {
      origin, pathname,
    } = new URL(url);
    return `${origin}${pathname.replace(/\/+$/, "")}`;
  } catch {
    return null;
  }
}

/**
 * Returns true only when the webhook currently registered on the bot is this
 * source's own endpoint. Ownership is decided by exact endpoint identity, so a
 * webhook belonging to an external service — or to a different Pipedream source
 * sharing the same bot token — is never treated as ours and is left untouched.
 */
function isOwnWebhook(currentUrl, ownEndpoint) {
  const current = normalizeUrl(currentUrl);
  const own = ownEndpoint
    ? normalizeUrl(ownEndpoint)
    : null;
  return !!current && !!own && current === own;
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
       * Telegram supports only one webhook per bot. If a stale registration for
       * *this* source survives from a prior deploy (e.g. the source was removed
       * with ignoreHookErrors so deactivate() never ran), clear it before
       * registering again — otherwise activate() stores a fresh secret while
       * Telegram keeps signing with the old one, and run() silently rejects
       * every incoming event.
       *
       * Any webhook that is not this source's own endpoint — external services
       * and other Pipedream sources alike — is left intact, and the original
       * ConfigurationError is thrown so the user is warned before an existing
       * integration is disrupted.
       */
      const { result } = await this.telegramBotApi.getWebhookInfo();
      if (result.url?.length > 0) {
        if (isOwnWebhook(result.url, this.http?.endpoint)) {
          console.log(`Removing stale webhook for this source (${result.url}) before deploying...`);
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
       * Clear this source's own stale registration before registering again.
       * Anything else is owned by another integration, so throw
       * ConfigurationError before createHook() runs — Telegram's setWebhook
       * would otherwise overwrite it and silently break that integration.
       */
      const { result } = await this.telegramBotApi.getWebhookInfo();
      if (result.url?.length > 0) {
        if (isOwnWebhook(result.url, this.http?.endpoint)) {
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
