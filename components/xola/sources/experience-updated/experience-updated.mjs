import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "xola-experience-updated",
  name: "Experience Updated",
  description: "Emit new event when an experience is updated. [See the documentation](https://xola.github.io/xola-docs/#tag/experiences/operation/listExperiences)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.listExperiences;
    },
    getParams() {
      return {
        limit: 100,
        skip: 0,
      };
    },
    generateMeta(experience) {
      return {
        id: `${experience.id}-${experience.updatedAt}`,
        summary: `Experience Updated: ${experience.name}`,
        ts: Date.parse(experience.updatedAt),
      };
    },
    async processEvent() {
      const lastUpdatedAt = this._getLastUpdatedAt();
      let maxUpdatedAt = lastUpdatedAt;
      const params = this.getParams();

      const { data } = await this.getResourceFn()({
        params,
      });

      const filteredExperiences = data.filter((experience) => {
        const updatedAt = experience.updatedAt;
        const createdAt = experience.createdAt;
        return updatedAt !== createdAt
          && experience.status !== "deleted"
          && (!lastUpdatedAt || new Date(updatedAt) > new Date(lastUpdatedAt));
      });

      filteredExperiences.forEach((experience) => {
        const updatedAt = experience.updatedAt;
        if (!maxUpdatedAt || new Date(updatedAt) > new Date(maxUpdatedAt)) {
          maxUpdatedAt = updatedAt;
        }
        const meta = this.generateMeta(experience);
        this.$emit(experience, meta);
      });

      if (maxUpdatedAt) {
        this._setLastUpdatedAt(maxUpdatedAt);
      }
    },
  },
  sampleEmit,
};
