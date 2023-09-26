import hostaway from "../../hostaway.app.mjs";

export default {
  key: "hostaway-update-task",
  name: "Update Task",
  description: "Updates an existing task in Hostaway. [See the documentation](https://api.hostaway.com/documentation#update-task)",
  version: "0.0.1",
  type: "action",
  props: {
    hostaway,
  },
  async run({ $ }) {
    $.export("summary", "");
  },
};
