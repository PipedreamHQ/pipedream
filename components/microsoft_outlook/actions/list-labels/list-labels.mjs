import microsoftOutlook from "../../microsoft_outlook.app.mjs";

export default {
  key: "microsoft_outlook-list-labels",
  name: "List Labels",
  description: "Get all the labels/categories that have been defined for a user. [See the documentation](https://learn.microsoft.com/en-us/graph/api/outlookuser-list-mastercategories)",
  version: "0.0.1",
  type: "action",
  props: {
    microsoftOutlook,
  },
  async run({ $ }) {
    const { value } = await this.microsoftOutlook.listLabels({
      $,
    });
    $.export("$summary", `Successfully retrieved ${value.length} label${value.length != 1
      ? "s"
      : ""}.`);
    return value;
  },
};
