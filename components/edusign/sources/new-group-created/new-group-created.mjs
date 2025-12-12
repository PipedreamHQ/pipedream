import common from "../common/base-polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "edusign-new-group-created",
  name: "New Group Created",
  description: "Emit new event when a new group is created. [See the documentation](https://developers.edusign.com/reference/getv1group)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async processEvents(max) {
      const lastCreated = this._getLastCreated();
      let maxCreated = lastCreated;
      const params = {
        page: 0,
      };
      const groups = [];
      let total;

      do {
        const { result = [] } = await this.edusign.listGroups({
          params,
        });
        for (const group of result) {
          if (Date.parse(group.DATE_CREATED) > Date.parse(lastCreated)) {
            groups.push(group);
            if (Date.parse(group.DATE_CREATED) > Date.parse(maxCreated)) {
              maxCreated = group.DATE_CREATED;
            }
          }
        }
        total = result?.length;
        params.page++;
      } while (total);

      this._setLastCreated(maxCreated);

      if (!groups.length) {
        return;
      }

      if (max && groups.length > max) {
        groups.length = max;
      }

      groups.forEach((group) => {
        const meta = this.generateMeta(group);
        this.$emit(group, meta);
      });
    },
    generateMeta(group) {
      return {
        id: group.ID,
        summary: `New Group Created: ${group.NAME}`,
        ts: Date.parse(group.DATE_CREATED),
      };
    },
  },
  sampleEmit,
};
