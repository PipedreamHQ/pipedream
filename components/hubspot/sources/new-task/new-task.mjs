import {
  DEFAULT_LIMIT, OBJECT_TYPES,
} from "../../common/constants.mjs";
import common from "../common/common.mjs";

export default {
  ...common,
  key: "hubspot-new-task",
  name: "New Task Created",
  description: "Emit new event for each new task created. [See the documentation](https://developers.hubspot.com/docs/reference/api/crm/engagements/tasks#get-%2Fcrm%2Fv3%2Fobjects%2Ftasks)",
  version: "1.0.7",
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
    async getParams() {
      const { results: allProperties } = await this.hubspot.getProperties({
        objectType: "tasks",
      });
      const properties = allProperties.map(({ name }) => name);

      const objectTypes = OBJECT_TYPES.map(({ value }) => value);
      const { results: custom } = await this.hubspot.listSchemas();
      const customObjects = custom?.map(({ fullyQualifiedName }) => fullyQualifiedName);
      const associations = [
        ...objectTypes,
        ...customObjects,
      ];

      return {
        params: {
          limit: DEFAULT_LIMIT,
          properties: properties.join(","),
          associations: associations.join(","),
        },
      };
    },
    async processResults(after, params) {
      const tasks = await this.getPaginatedItems(this.hubspot.listTasks.bind(this), params);
      await this.processEvents(tasks, after);
    },
  },
};
