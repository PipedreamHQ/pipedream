import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "xola-experience-deleted",
  name: "Experience Deleted",
  description: "Emit new event when an experience is deleted. Note: This source tracks experiences by comparing current list with previous snapshots. [See the documentation](https://xola.github.io/xola-docs/#tag/experiences/operation/listExperiences)",
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
    _getPreviousExperienceIds() {
      return this.db.get("previousExperienceIds") || [];
    },
    _setPreviousExperienceIds(ids) {
      this.db.set("previousExperienceIds", ids);
    },
    generateMeta(experience) {
      return {
        id: `${experience.id}-deleted-${Date.now()}`,
        summary: `Experience Deleted: ${experience.name || experience.id}`,
        ts: Date.now(),
      };
    },
    async processEvent() {
      const previousIds = this._getPreviousExperienceIds();
      const params = this.getParams();

      const { data } = await this.getResourceFn()({
        params,
      });

      const currentIds = data.map((experience) => experience.id);

      if (previousIds.length > 0) {
        const deletedIds = previousIds.filter((id) => !currentIds.includes(id));

        deletedIds.forEach((id) => {
          const deletedExperience = {
            id,
            name: "Deleted Experience",
            deletedAt: new Date().toISOString(),
          };
          const meta = this.generateMeta(deletedExperience);
          this.$emit(deletedExperience, meta);
        });
      }

      this._setPreviousExperienceIds(currentIds);
    },
  },
  sampleEmit,
};
