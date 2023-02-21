import wrike from "../../wrike.app.mjs";

export default {
  key: "wrike-new-task",
  name: "New Task",
  description: "Create a Wrike task under a specified folder ID. [See the docs]()",
  version: "0.3.0",
  type: "action",
  props: {
    wrike,
    folder: {
      type: "string",
      label: "Folder ID",
    },
    title: {
      type: "string",
    },
    desc: {
      type: "string",
      label: "Description",
    },
    priority: {
      type: "string",
      optional: true,
    },
    status: {
      type: "string",
      optional: true,
    },
    assignee: {
      type: "string",
      label: "Contact ID",
      optional: true,
    },
    custID1: {
      type: "string",
      label: "Custom Field ID",
      optional: true,
    },
    custVal1: {
      type: "string",
      label: "Custom Field Value",
      optional: true,
    },
    custID2: {
      type: "string",
      label: "Custom Field ID",
      optional: true,
    },
    custVal2: {
      type: "string",
      label: "Custom Field Value",
      optional: true,
    },
    custID3: {
      type: "string",
      label: "Custom Field ID",
      optional: true,
    },
    custVal3: {
      type: "string",
      label: "Custom Field Value",
      optional: true,
    },
  },
  async run({ $ }) {
    var info = {
      title: this.title,
      description: this.desc,
    };
    if (this.priority) {
      info.importance = this.priority;
    }
    if (this.status) {
      info.status = this.status;
    }
    if (this.assignee) {
      info.responsibles = [
        this.assignee,
      ];
    }

    var customFields = [];
    if (this.custID1 && this.custVal1) {
      customFields.push({
        id: this.custID1,
        value: this.custVal1,
      });
    }
    if (this.custID2 && this.custVal2) {
      customFields.push({
        id: this.custID2,
        value: this.custVal2,
      });
    }
    if (this.custID3 && this.custVal3) {
      customFields.push({
        id: this.custID3,
        value: this.custVal3,
      });
    }
    if (customFields.length > 0) {
      info.customFields = customFields;
    }

    const task = await this.wrike.createTask({
      $,
      folder: this.folder,
      data: info,
    });

    console.log(`Created new task ID "${task.data[0].id}".`);

    return task;
  },
};
