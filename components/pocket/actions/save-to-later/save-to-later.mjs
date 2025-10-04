import pocket from "../../pocket.app.mjs";

export default {
  name: "Save To Later",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "pocket-save-to-later",
  description: "Save articles, videos, images and URLs to your Pocket list. [See docs here](https://getpocket.com/developer/docs/v3/add)",
  type: "action",
  props: {
    pocket,
    url: {
      label: "URL",
      description: "The URL of the item you want to save",
      type: "string",
    },
    title: {
      label: "Title",
      description: "This can be included for cases where an item does not have a title, which is typical for image or PDF URLs",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.pocket.saveToLater({
      $,
      data: {
        url: this.url,
        title: this.title,
      },
    });

    if (response) {
      $.export("$summary", `Successfully saved item with id ${response.item.item_id}`);
    }

    return response;
  },
};
