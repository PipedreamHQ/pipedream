import { defineSource } from "@pipedream/types";
import {
  Board, WebhookData, WebhookDataTaskMoved,
} from "../../common/types";
import common from "../common";

export default defineSource({
  ...common,
  name: "Task Moved",
  description: "Emit new event when a **task is moved**",
  key: "kanbanflow-task-moved",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getHookFilter() {
      return {
        filter: {
          changedProperties: [
            "columnId",
            "swimlaneId",
          ],
        },
      };
    },
    getHookName() {
      return "Task Moved";
    },
    getHookType() {
      return "taskChanged";
    },
    getSummary({
      task: { name }, userFullName,
    }: WebhookData) {
      return `"${name}" moved by ${userFullName}`;
    },
    async processHookData(data: WebhookData) {
      const { changedProperties } = data;

      const newData: WebhookDataTaskMoved = {
        ...data,
      };

      const {
        columns, swimlanes,
      }: Board = await this.kanbanflow.getBoard();

      const columnChange = changedProperties.find(
        ({ property }) => property === "columnId",
      );
      if (columnChange) {
        newData.oldColumn = columns.find(
          ({ uniqueId }) => uniqueId === columnChange.oldValue,
        )?.name;
        newData.newColumn = columns.find(
          ({ uniqueId }) => uniqueId === columnChange.newValue,
        )?.name;
      }

      const swimlaneChange = changedProperties.find(
        ({ property }) => property === "swimlaneId",
      );
      if (swimlaneChange) {
        newData.oldSwimlane = swimlanes.find(
          ({ uniqueId }) => uniqueId === swimlaneChange.oldValue,
        )?.name;
        newData.newSwimlane = swimlanes.find(
          ({ uniqueId }) => uniqueId === swimlaneChange.newValue,
        )?.name;
      }

      delete newData.changedProperties;
      return newData;
    },
  },
});
