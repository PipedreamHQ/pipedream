import { ConfigurationError } from "@pipedream/platform";
import app from "../../appsflyer.app.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    appId: {
      propDefinition: [
        app,
        "appId",
      ],
    },
  },
  hooks: {
    async activate() {
      const {
        app,
        appId,
        http,
      } = this;
      const { endpoints = [] } = await app.getPushApiConfiguration({
        appId,
      });

      await app.updatePushApiConfiguration({
        appId,
        data: {
          endpoints: [
            ...endpoints,
            {
              method: "POST",
              url: http.endpoint,
              event_types: this.getEventTypes(),
              attributing_entity: "appsflyer",
              enabled: true,
            },
          ],
        },
      });
    },
    async deactivate() {
      const {
        app,
        appId,
        http,
      } = this;
      const { endpoints = [] } = await app.getPushApiConfiguration({
        appId,
      });

      await app.updatePushApiConfiguration({
        appId,
        data: {
          endpoints: endpoints.filter(
            (endpoint) => endpoint.url !== http.endpoint,
          ),
        },
      });
    },
  },
  methods: {
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
    getEventTypes() {
      throw new ConfigurationError("getEventTypes is not implemented");
    },
    processEvent(event) {
      if (this.appId && event.app_id !== this.appId) {
        return;
      }

      this.$emit(event, this.generateMeta(event));
    },
  },
  async run({ body }) {
    this.http.respond({
      status: 200,
    });
    this.processEvent(body);
  },
};
