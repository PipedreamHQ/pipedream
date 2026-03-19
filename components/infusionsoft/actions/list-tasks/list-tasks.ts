import infusionsoft from "../../app/infusionsoft.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "List Tasks",
  description:
    "Retrieves a list of tasks based on the provided filter. Tasks which are not assigned may be queried with user_id==UNASSIGNED. [See the documentation](https://developer.infusionsoft.com/docs/restv2/#tag/Task/operation/listTasks)",
  key: "infusionsoft-list-tasks",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    infusionsoft,
    filter: {
      type: "string",
      label: "Filter",
      description:
        "Filter to apply. Use == for equality, e.g. contact_id==123;is_completed==false. Multiple conditions separated by ;",
      optional: true,
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "Attribute and direction (e.g., due_time desc). Fields: id, create_time, due_time",
      optional: true,
    },
    pageSize: {
      type: "string",
      label: "Page Size",
      description: "Number of items per page (10-1000). Values below 10 are increased to 10",
      optional: true,
    },
    pageToken: {
      type: "string",
      label: "Page Token",
      description: "Page token for pagination",
      optional: true,
    },
  },
  async run({ $ }): Promise<object> {
    const result = await this.infusionsoft.listTasks({
      $,
      filter: this.filter,
      orderBy: this.orderBy,
      pageSize: this.pageSize,
      pageToken: this.pageToken,
    });

    const count = (result as { tasks?: unknown[] }).tasks?.length ?? 0;
    $.export("$summary", `Retrieved ${count} task(s)`);

    return result;
  },
});
