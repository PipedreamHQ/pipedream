// legacy_hash_id: a_0Mioz8
import { axios } from "@pipedream/platform";

export default {
  key: "wrike-new-task",
  name: "Wrike: Create Task",
  description: "Create a Wrike task under a specified folder ID.",
  version: "0.2.1",
  type: "action",
  props: {
    wrike: {
      type: "app",
      app: "wrike",
    },
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

    const task = await axios($, {
      method: "POST",
      url: `https://www.wrike.com/api/v4/folders/${this.folder}/tasks`,
      headers: {
        Authorization: `Bearer ${this.wrike.$auth.oauth_access_token}`,
      },
      data: info,
    });
    console.log(`Created new task ID "${task.data[0].id}".`);

    return task;
  },
};
