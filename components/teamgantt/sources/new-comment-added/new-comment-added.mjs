import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import teamgantt from "../../teamgantt.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "teamgantt-new-comment-added",
  name: "New Comment Added",
  version: "0.0.1",
  description: "Emit new event when a new comment is created.",
  type: "source",
  dedupe: "unique",
  props: {
    teamgantt,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the TeamGantt on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    type: {
      type: "string",
      label: "Target",
      description: "The resource type that contains the respective comments.",
      options: [
        "projects",
        "groups",
        "tasks",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    const projectId = {
      type: "string",
      label: "Project Id",
      description: "The id of the project that contains the respective comments.",
      options: async () => {
        const { projects } = await this.teamgantt.listProjects();

        return projects.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    };
    switch (this.type) {
    case "projects":
      props.projectId = projectId;
      break;
    case "groups":
      props.projectId = projectId;
      props.groupId = {
        type: "string",
        label: "Group Id",
        description: "The id of the group that contains the respective comments.",
        options: async () => {
          const groups = await this.teamgantt.listGroups({
            params: {
              project_ids: [
                this.projectId,
              ],
            },
          });

          return groups.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          }));
        },
      };
      break;
    case "tasks":
      props.taskId = {
        type: "string",
        label: "Task Id",
        description: "The id of the task that contains the respective comments.",
        options: async () => {
          const tasks = await this.teamgantt.listTasks();

          return tasks.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          }));
        },
      };
      break;
    }
    return props;
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || 0;
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async startEvent(maxResults = 0) {
      let responseArray = [];
      const { teamgantt } = this;
      const lastDate = this._getLastDate();
      let items = await teamgantt.listComments({
        ...this,
      });

      if (maxResults) {
        items = items.slice(-maxResults);
      }

      for await (const item of items.reverse()) {
        if (item.id <= lastDate) break;
        responseArray.push(item);
      }
      if (responseArray.length) this._setLastDate(responseArray[0].id);

      for (const item of responseArray.reverse()) {
        this.$emit(
          item,
          {
            id: item.id,
            summary: `A new comment with id: "${item.id}" was added!`,
            ts: new Date(),
          },
        );
      }
    },
  },
  hooks: {
    async deploy() {
      await this.startEvent(25);
    },
  },
  async run() {
    await this.startEvent();
  },
  sampleEmit,
};
