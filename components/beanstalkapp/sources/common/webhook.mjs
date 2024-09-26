import { ConfigurationError } from "@pipedream/platform";
import common from "./base.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  props: {
    ...common.props,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    repositoryId: {
      propDefinition: [
        common.props.app,
        "repositoryId",
      ],
    },
  },
  hooks: {
    async activate() {
      const { integration } =
        await this.createIntegration({
          repositoryId: this.repositoryId,
          data: {
            type: constants.INTEGRATION_TYPE.WEBHOOKS_INTEGRATION,
            service_url: this.http.endpoint,
            triggers: this.getEventName(),
          },
        });
      this.setIntegrationId(integration.id);
    },
    async deactivate() {
      const integrationId = this.getIntegrationId();
      if (integrationId) {
        await this.deleteIntegration({
          repositoryId: this.repositoryId,
          integrationId,
        });
      }
    },
  },
  methods: {
    ...common.methods,
    setIntegrationId(value) {
      this.db.set(constants.INTEGRATION_ID, value);
    },
    getIntegrationId() {
      return this.db.get(constants.INTEGRATION_ID);
    },
    getEventName() {
      throw new ConfigurationError("getEventName is not implemented");
    },
    createIntegration({
      repositoryId, ...args
    } = {}) {
      return this.app.create({
        path: `/repositories/${repositoryId}/integrations`,
        ...args,
      });
    },
    deleteIntegration({
      repositoryId, integrationId, ...args
    } = {}) {
      return this.app.delete({
        path: `/repositories/${repositoryId}/integrations/${integrationId}`,
        ...args,
      });
    },
  },
  async run({ body }) {
    this.http.respond({
      status: 200,
    });
    const { payload } = body;
    const data = JSON.parse(payload);
    this.$emit(data, this.generateMeta(data));
  },
};
