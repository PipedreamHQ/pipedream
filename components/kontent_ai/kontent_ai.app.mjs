import { createDeliveryClient } from "@kontent-ai/delivery-sdk";
import { createManagementClient } from "@kontent-ai/management-sdk";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "kontent_ai",
  propDefinitions: {
    typeId: {
      type: "string",
      label: "Type Id",
      description: "Reference to the item's content type.",
      async options({ page }) {
        const { data: { items } } = await this.listContentTypes({
          skip: page * LIMIT,
        });

        return items.map(({
          system: {
            id: value, name: label,
          },
        }) => ({
          label,
          value,
        }));
      },
    },
    collectionId: {
      type: "string",
      label: "Collection Id",
      description: "Reference to the item's collection.",
      async options() {
        const { data: { collections } } = await this.listCollections();

        return collections.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    workflowStepId: {
      type: "string",
      label: "Workflow Step Id",
      description: "Reference to the workflow's step.",
      async options() {
        const { data } = await this.listWorkflowSteps();

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _deliveryClient() {
      return createDeliveryClient({
        environmentId: this.$auth.environment_id,
      });
    },
    _managementClient() {
      return createManagementClient({
        environmentId: this.$auth.environment_id,
        subscriptionId: this.$auth.delivery_api_key,
        apiKey: this.$auth.management_api_key,
      });
    },
    createContentItem(data) {
      return this._managementClient()
        .addContentItem()
        .withData(data)
        .toPromise();
    },
    createHook(data) {
      return this._managementClient()
        .addWebhook()
        .withData(data)
        .toPromise();
    },
    deleteHook(hookId) {
      return this._managementClient()
        .deleteWebhook()
        .byId(hookId)
        .toPromise();
    },
    listContentTypes({ skip }) {
      return this._deliveryClient()
        .types()
        .limitParameter(LIMIT)
        .skipParameter(skip)
        .toPromise();
    },
    listCollections() {
      return this._managementClient()
        .listCollections()
        .toPromise();
    },
    listWorkflowSteps() {
      return this._managementClient()
        .listWorkflowSteps()
        .toPromise();
    },
  },
};
