import app from "../../dynapictures.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "dynapictures-new-image-instant",
  name: "New Image (Instant)",
  description: "Emit new event when an image has been generated. [See the documentation](https://dynapictures.com/docs/#webhook-notification)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    templateId: {
      propDefinition: [
        app,
        "templateId",
      ],
    },
  },
  hooks: {
    async activate() {
      const {
        createWebhook,
        getWebhookData,
      } = this;

      const response = await createWebhook(getWebhookData());
      if (response?.error) {
        const msg = "Error creating webhook";
        console.log(msg, response);
        throw new Error(response?.message || msg);
      }
    },
    async deactivate() {
      const {
        deleteWebhook,
        getWebhookData,
      } = this;

      const response = await deleteWebhook(getWebhookData());
      if (response?.error) {
        const msg = "Error deleting webhook";
        console.log(msg, response);
        throw new Error(response?.message || msg);
      }
    },
  },
  methods: {
    getWebhookData() {
      const {
        http,
        templateId,
      } = this;

      return {
        data: {
          targetUrl: http.endpoint,
          eventType: constants.EVENT.NEW_IMAGE,
          templateId,
        },
      };
    },
    createWebhook(args = {}) {
      return this.app.post({
        path: "/hooks",
        ...args,
      });
    },
    deleteWebhook(args = {}) {
      return this.app.delete({
        path: "/hooks",
        ...args,
      });
    },
  },
  async run({ body }) {
    this.http.respond({
      status: 200,
    });

    this.$emit(body, {
      id: body.id,
      summary: `New Image: ${body.id}`,
      ts: Date.now(),
    });
  },
};
