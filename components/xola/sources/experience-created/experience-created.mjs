import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "xola-experience-created",
  name: "Experience Created",
  description: "Emit new event when a new experience is created. [See the documentation](https://xola.github.io/xola-docs/#tag/experiences/operation/listExperiences)",
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
        id: experience.id,
        summary: `New Experience: ${experience.name}`,
        ts: Date.parse(experience.createdAt),
      };
    },
    async processEvent() {
      const lastCreatedAt = this._getLastCreatedAt();
      let maxCreatedAt = lastCreatedAt;
      const params = this.getParams();

      const { data } = await this.getResourceFn()({
        params,
      });

      const filteredExperiences = data.filter((experience) => {
        const createdAt = experience.createdAt;
        return !lastCreatedAt || new Date(createdAt) > new Date(lastCreatedAt);
      });

      filteredExperiences.forEach((experience) => {
        const createdAt = experience.createdAt;
        if (!maxCreatedAt || new Date(createdAt) > new Date(maxCreatedAt)) {
          maxCreatedAt = createdAt;
        }
        const meta = this.generateMeta(experience);
        this.$emit(experience, meta);
      });

      if (maxCreatedAt) {
        this._setLastCreatedAt(maxCreatedAt);
      }
    },
  },
  sampleEmit,
};
