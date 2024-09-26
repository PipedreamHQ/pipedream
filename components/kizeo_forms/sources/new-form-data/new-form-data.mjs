import common from "../common/polling.mjs";

export default {
  ...common,
  key: "kizeo_forms-new-form-data",
  name: "New Form Data Created",
  description: "Emit new event each time new form data is created in Kizeo Forms. [See the documentation](https://kizeo.github.io/kizeo-forms-documentations/docs/en/restv3)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    formId: {
      propDefinition: [
        common.props.app,
        "formId",
      ],
    },
    action: {
      propDefinition: [
        common.props.app,
        "action",
      ],
    },
  },
  methods: {
    ...common.methods,
    sortFn(a, b) {
      const dateA = new Date(a._create_time);
      const dateB = new Date(b._create_time);
      return dateA - dateB;
    },
    getResourcesName() {
      return "data";
    },
    getResourcesFn() {
      return this.app.listUnreadFormData;
    },
    getResourcesFnArgs() {
      const {
        formId,
        action,
      } = this;
      return {
        formId,
        action,
      };
    },
    generateMeta(resource) {
      return {
        id: resource._id,
        summary: `New Form Data: ${resource._id}`,
        ts: Date.parse(resource._create_time),
      };
    },
    async processResources(resources) {
      const {
        processEvent,
        formId,
        action,
      } = this;

      Array.from(resources)
        .reverse()
        .forEach(processEvent);

      const dataIds = resources.map(({ _id }) => _id);

      if (dataIds.length) {
        await this.app.markAsReadByAction({
          formId,
          action,
          data: {
            data_ids: dataIds,
          },
        });
      }
    },
  },
};
