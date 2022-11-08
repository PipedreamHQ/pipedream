import klaviyo from "../../klaviyo.app.mjs";

export default {
  key: "klaviyo-create-new-list",
  name: "Create New List",
  description: "Creates a new list in an account. [See the docs here](https://developers.klaviyo.com/en/v1-2/reference/create-list)",
  version: "0.0.1",
  type: "action",
  props: {
    klaviyo,
    listName: {
      propDefinition: [
        klaviyo,
        "listName",
      ],
    },
  },
  methods: {
    getSummary() {
      return `"${this.listName}" successfully created!`;
    },
  },
  async run({ $ }) {
    const { listName } = this;
    const response = await this.klaviyo.newList({
      listName,
    });

    $.export("$summary", response || this.getSummary(response));
    return response;
  },
};
