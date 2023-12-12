import activecampaign from "../../activecampaign.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    activecampaign,
    db: "$.service.db",
  },
  methods: {
    setUpdatedTimestamp(updatedTimestamp) {
      this.db.set(constants.UPDATED_TIMESTAMP, updatedTimestamp);
    },
    getUpdatedTimestamp() {
      return this.db.get(constants.UPDATED_TIMESTAMP);
    },
    processEvents(resources) {
      resources.forEach((resource) => {
        this.processEvent(resource);
      });
    },
    processEvent(resource) {
      const meta = this.getMeta(resource);
      this.$emit(resource, meta);
    },
    getResourcesToEmit(resources = []) {
      const updatedTimestamp = this.getUpdatedTimestamp();
      const lastUpdatedTimestamp = Date.parse(updatedTimestamp);
      const propName = this.getUpdatedTimestampPropertyName();

      return Number.isNaN(lastUpdatedTimestamp)
        ? resources
        : resources.filter(({ [propName]: updatedTimestamp }) =>
          Date.parse(updatedTimestamp) > lastUpdatedTimestamp);
    },
    getGreaterUpdatedTimestamp(resources = []) {
      const propName = this.getUpdatedTimestampPropertyName();
      const { [propName]: updatedTimestamp } =
        resources.length && resources.reduce((prevResource, currentResource) => {
          const { [propName]: prevUpdatedTS } = prevResource;
          const { [propName]: currentUpdatedTS } = currentResource;
          return Date.parse(prevUpdatedTS) > Date.parse(currentUpdatedTS)
            ? prevResource
            : currentResource;
        }) || {};
      return updatedTimestamp;
    },
    getCreatedTimestampPropertyName() {
      throw new Error("getCreatedTimestampPropertyName() is not implemented");
    },
    getUpdatedTimestampPropertyName() {
      throw new Error("getUpdatedTimestampPropertyName() is not implemented");
    },
    getMeta() {
      throw new Error("getMeta() is not implemented");
    },
    listResources() {
      throw new Error("listResources() is not implemented");
    },
  },
  async run() {
    const resources = await this.listResources();

    const resourcesToEmit = this.getResourcesToEmit(resources);
    const greaterUpdatedTimestamp = this.getGreaterUpdatedTimestamp(resourcesToEmit);

    if (greaterUpdatedTimestamp) {
      this.setUpdatedTimestamp(greaterUpdatedTimestamp);
    }

    this.processEvents(resourcesToEmit);
  },
};
