import app from "../../pipedrive.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Polling schedule",
      description: "How often to poll the Pipedrive API",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  hooks: {
    async deploy() {
      const fieldId = await this.fetchFieldId();
      const args = await this.getFilterArgs({
        fieldId,
      });
      const { data: { id: filterId } } = await this.app.addFilter(args);
      this.setFilterId(filterId);
    },
    async deactivate() {
      await this.app.deleteFilter(this.getFilterId());
    },
  },
  methods: {
    getFilterId() {
      return this.db.get(constants.FILTER_ID);
    },
    setFilterId(value) {
      this.db.set(constants.FILTER_ID, value);
    },
    getFieldId() {
      return this.db.get(constants.FIELD_ID);
    },
    setFieldId(value) {
      this.db.set(constants.FIELD_ID, value);
    },
    getFieldKey() {
      throw new Error("getFieldKey not implemented");
    },
    getEventObject() {
      throw new Error("getEventObject not implemented");
    },
    getEventAction() {
      throw new Error("getEventAction not implemented");
    },
    getResourceFn() {
      throw new Error("getResourceFn not implemented");
    },
    getResourceFnArgs() {
      throw new Error("getResourceFnArgs not implemented");
    },
    getTimestamp() {
      throw new Error("getTimestamp not implemented");
    },
    getFilterArgs() {
      throw new Error("getFilterArgs not implemented");
    },
    getFieldsFn() {
      throw new Error("getFieldsFn not implemented");
    },
    getMetaId(resource) {
      return resource.id;
    },
    getConditions({
      fieldId, value,
    } = {}) {
      return {
        glue: "and",
        conditions: [
          {
            glue: "or",
            conditions: [],
          },
          {
            glue: "and",
            conditions: [
              {
                object: this.getEventObject(),
                field_id: fieldId,
                operator: ">",
                value,
                extra_value: null,
              },
            ],
          },
        ],
      };
    },
    async fetchFieldId() {
      const fieldId = this.getFieldId();

      if (fieldId) {
        return fieldId;
      }
      const getFields = this.getFieldsFn();
      const { data: fields } = await getFields();
      const field = fields.find(({ key }) => key === this.getFieldKey());

      this.setFieldId(field.id);

      return field.id;
    },
    generateMeta(resource) {
      return {
        id: this.getMetaId(resource),
        summary: `${this.getEventObject()} ${resource.id} was ${this.getEventAction()}`,
        ts: this.getTimestamp(resource),
      };
    },
    processEvent(resource) {
      const meta = this.generateMeta(resource);
      this.$emit(resource, meta);
    },
    async processStreamEvents(stream) {
      const resources = await utils.streamIterator(stream);

      if (resources.length === 0) {
        console.log("No new events detected. Skipping...");
        return;
      }

      const [
        lastResource,
      ] = resources;

      resources.reverse().forEach(this.processEvent);

      if (lastResource) {
        const lastDateTimeStr = lastResource[this.getFieldKey()];

        const fieldId = await this.fetchFieldId();

        const lastDate = new Date(lastDateTimeStr);
        const args = this.getFilterArgs({
          fieldId,
          value: lastDate.toISOString().split("T")[0],
        });
        await this.app.updateFilter({
          filterId: this.getFilterId(),
          ...args,
        });
      }
    },
  },
  async run() {
    const stream =
      await this.app.getResourcesStream({
        resourceFn: this.getResourceFn(),
        resourceFnArgs: this.getResourceFnArgs(),
      });

    await this.processStreamEvents(stream);
  },
};
