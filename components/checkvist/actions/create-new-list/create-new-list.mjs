import checkvist from "../../checkvist.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "checkvist-create-new-list",
  name: "Create New List",
  description: "Creates a new list in Checkvist. [See the documentation](https://checkvist.com/auth/api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    checkvist,
    name: {
      propDefinition: [
        checkvist,
        "name",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.checkvist.createList({
      name: this.name,
    });

    $.export("$summary", `Successfully created a new list: ${this.name}`);
    return response;
  },
};
