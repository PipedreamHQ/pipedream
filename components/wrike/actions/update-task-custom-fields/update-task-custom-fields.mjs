import wrike from "../../wrike.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "wrike-update-task-custom-fields",
  name: "Update Task Custom Fields",
  description: "Update the custom fields for a task. [See the documentation](https://developers.wrike.com/api/v4/tasks/#modify-tasks)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    wrike,
    taskId: {
      propDefinition: [
        wrike,
        "taskId",
      ],
    },
    customFieldsKeys: {
      propDefinition: [
        wrike,
        "customFieldsKeys",
      ],
    },
    customFieldsValues: {
      type: "string[]",
      label: "Custom Fields Values",
      description: "The custom field values, in the respective key order of selection, to set on the task",
    },
  },
  methods: {
    parseArray(array) {
      return Array.isArray(array)
        ? array
        : JSON.parse(array || "[]");
    },
  },
  async run({ $ }) {
    const customFieldsKeys = this.parseArray(this.customFieldsKeys);
    const customFieldsValues = this.parseArray(this.customFieldsValues);

    if (customFieldsKeys.length !== customFieldsValues.length) {
      throw new ConfigurationError("The number of custom fields keys and values must be equal");
    }

    const customFields = customFieldsKeys.map((id, index) => ({
      id,
      value: this.customFieldsValues[index],
    }));

    const task = await this.wrike.updateTask({
      $,
      taskId: this.taskId,
      data: {
        customFields,
      },
    });

    $.export("$summary", `Successfully updated task ${task.title} custom fields`);

    return task;
  },
};
