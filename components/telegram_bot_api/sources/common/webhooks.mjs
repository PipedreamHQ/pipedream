import telegramBotApi from "../../telegram_bot_api.app.mjs";
import constants from "./constants.mjs";
import { v4 as uuid } from "uuid";

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
       * Telegram only supports a single webhook per bot. If a stale webhook
       * from a previous deployment exists (e.g. the source was deleted without
       * cleanly deactivating), remove it so this source can register its own.
       * Without this cleanup, redeployment silently fails: activate() registers
       * a new webhook URL and secret, but the old Pipedream source endpoint may
       * still be alive with a different secret, causing the secret-token check
       * in run() to reject every subsequent event.
       */
      const { result } = await this.telegramBotApi.getWebhookInfo();
      if (result.url?.length > 0) {
        console.log(`Removing existing webhook (${result.url}) before deploying...`);
        await this.telegramBotApi.deleteHook();
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
      // Delete any existing webhook first so activate() is idempotent.
      // If a previous source sharing this bot token was not cleanly deactivated
      // (e.g. deleted with ignoreHookErrors), its webhook survives and the
      // new secret registered here will never match incoming requests.
      await this.telegramBotApi.deleteHook();
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
