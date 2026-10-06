import {
  DEFAULT_LIMIT, OBJECT_TYPES,
} from "../../common/constants.mjs";
import common from "../common/common.mjs";

export default {
  ...common,
  key: "hubspot-new-task",
  name: "New Task Created",
  description:
    "Emit new event for each new task created. [See the documentation](https://developers.hubspot.com/docs/api-reference/latest/crm/activities/tasks/search/search-tasks)",
  version: "1.0.28",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTs(task) {
      return Date.parse(task.createdAt);
    },
    generateMeta(task) {
      return {
        id: task.id,
        summary: `New Task: ${task.properties.hs_task_subject || task.id}`,
        ts: this.getTs(task),
      };
    },
    isRelevant(task, createdAfter) {
      return this.getTs(task) > createdAfter;
    },
    async getParams(after) {
      const { results: allProperties } = await this.hubspot.getProperties({
        objectType: "tasks",
      });
      return this.addDateFilter({
        object: "tasks",
        data: {
          limit: DEFAULT_LIMIT,
          properties: allProperties.map(({ name }) => name),
          sorts: [
            {
              propertyName: "hs_createdate",
              direction: "DESCENDING",
            },
          ],
        },
      }, "hs_createdate", after);
    },
    async getAssociationTypes() {
      const { results: custom } = await this.hubspot.listSchemas();
      return [
        ...OBJECT_TYPES.map(({ value }) => value),
        ...(custom?.map(({ fullyQualifiedName }) => fullyQualifiedName) || []),
      ];
    },
    async processResults(after, params) {
      const associationTypes = await this.getAssociationTypes();
      await this.paginate(
        params,
        async (opts) => {
          const page = await this.hubspot.searchCRM(opts);
          return {
            ...page,
            results: await this.withAssociations("tasks", page.results || [], associationTypes),
          };
        },
        "results",
        after,
      );
    },
  },
};
