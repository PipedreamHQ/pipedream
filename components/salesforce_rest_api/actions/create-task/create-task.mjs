import salesforce from "../../salesforce_rest_api.app.mjs";
import task from "../../common/sobjects/task.mjs";
import {
  pickBy, pick,
} from "lodash-es";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  key: "salesforce_rest_api-create-task",
  name: "Create Task",
  description: toSingleLineString(`
    Creates a task, which represents a business activity such as making a phone call or other to-do items.
    See [Task SObject](https://developer.salesforce.com/docs/atlas.en-us.228.0.object_reference.meta/object_reference/sforce_api_objects_task.htm)
    and [Create Record](https://developer.salesforce.com/docs/atlas.en-us.228.0.api_rest.meta/api_rest/dome_sobject_create.htm)
  `),
  version: "0.3.3",
  type: "action",
  props: {
    salesforce,
    Priority: {
      type: "string",
      label: "Priority",
      description: "Required. Indicates the importance or urgency of a task, such as high or low.",
    },
    Status: {
      type: "string",
      label: "Status",
      description: "Required. The status of the task, such as In Progress or Completed. Each predefined Status field implies a value for the IsClosed flag. To obtain picklist values, query the TaskStatus object. Note This field can't be updated for recurring tasks (IsRecurrence is true).",
    },
    selector: {
      propDefinition: [
        salesforce,
        "fieldSelector",
      ],
      description: `${salesforce.propDefinitions.fieldSelector.description} Task`,
      options: () => Object.keys(task),
      reloadProps: true,
    },
  },
  async additionalProps() {
    return this.salesforce.additionalProps(this.selector, task);
  },
  async run({ $ }) {
    const data = pickBy(pick(this, [
      "Priority",
      "Status",
      ...this.selector,
    ]));
    const response = await this.salesforce.createTask({
      $,
      data,
    });
    $.export("$summary", "Successfully created task");
    return response;
  },
};
