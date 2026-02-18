import {
  ACTION_TYPE_OPTIONS, CATEGORY_OPTIONS,
} from "../../common/constants.mjs";
import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "voluum-new-event-log",
  name: "New Event Log Created",
  description: "Emit new event when a new event log is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    actionType: {
      type: "string",
      label: "Action Type",
      description: "The type of action that occurred.",
      options: ACTION_TYPE_OPTIONS,
      optional: true,
    },
    clientId: {
      type: "string",
      label: "Client ID",
      description: "The ID of the client.",
      optional: true,
    },
    entityId: {
      type: "string",
      label: "Entity ID",
      description: "The ID of the entity.",
      optional: true,
    },
    category: {
      type: "string",
      label: "Category",
      description: "The category of the event.",
      options: CATEGORY_OPTIONS,
      optional: true,
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user.",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getParams() {
      return {
        actionType: this.actionType,
        clientId: this.clientId,
        entityId: this.entityId,
        category: this.category,
        userId: this.userId,
      };
    },
    getItemsField() {
      return "eventLogEntries";
    },
    getFunction() {
      return this.voluum.listEventLogs;
    },
    getSummary(item) {
      return `New Event Log: ${item.entityId}`;
    },
  },
  sampleEmit,
};
