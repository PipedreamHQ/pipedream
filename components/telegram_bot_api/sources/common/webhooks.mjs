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
       * From the docs: https://core.telegram.org/bots/api#getting-updates
       *
       * Incoming updates are stored on the server until the bot receives them either way,
       * but they will not be kept longer than 24 hours.
       *
       * So there's a big change that no historical event is emitted.
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
