import { v4 as uuid } from "uuid";
import { ConfigurationError } from "@pipedream/platform";
import app from "../../formaloo.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    formSlug: {
      propDefinition: [
        app,
        "formSlug",
      ],
    },
  },
  hooks: {
    async activate() {
      const {
        http: { endpoint: url },
        createWebhook,
        formSlug,
        setWebhookSlug,
        setSecret,
        getData,
      } = this;

      const secret = uuid();
      const response =
        await createWebhook({
          formSlug,
          data: {
            url,
            secret,
            active: true,
            send_rendered_data: true,
            send_raw_data: true,
            ...getData(),
          },
        });

      setWebhookSlug(response?.data?.webhook?.slug);
      setSecret(secret);
    },
    async deactivate() {
      const {
        deleteWebhook,
        formSlug,
        getWebhookSlug,
      } = this;

      const webhookSlug = getWebhookSlug();
      if (webhookSlug) {
        await deleteWebhook({
          formSlug,
          webhookSlug,
        });
      }
    },
  },
  methods: {
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
    setWebhookSlug(value) {
      this.db.set(constants.WEBHOOK_SLUG, value);
    },
    getWebhookSlug() {
      return this.db.get(constants.WEBHOOK_SLUG);
    },
    setSecret(value) {
      this.db.set(constants.SECRET, value);
    },
    getSecret() {
      return this.db.get(constants.SECRET);
    },
    getData() {
      throw new ConfigurationError("getData is not implemented");
    },
    processResource(resource) {
      this.$emit(resource, this.generateMeta(resource));
    },
    createWebhook({
      formSlug, ...args
    } = {}) {
      return this.app.post({
        debug: true,
        path: `/forms/${formSlug}/webhooks/`,
        ...args,
      });
    },
    deleteWebhook({
      formSlug, webhookSlug, ...args
    } = {}) {
      return this.app.delete({
        debug: true,
        path: `/forms/${formSlug}/webhooks/${webhookSlug}/`,
        ...args,
      });
    },
  },
  async run({
    body, headers,
  }) {
    const secret = this.getSecret();
    const token = headers["x-formaloo-token"];

    if (token !== secret) {
      throw new Error("Invalid token");
    }

    this.http.respond({
      status: 200,
      body: "",
    });

    this.processResource(body);
  },
};
