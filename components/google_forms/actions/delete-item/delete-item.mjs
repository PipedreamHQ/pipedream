import googleForms from "../../google_forms.app.mjs";

export default {
  key: "google_forms-delete-item",
  name: "Delete Form Item",
  description: "Permanently deletes one item (question, image, video, or page break) from a Google Form by its item ID."
    + " Use it when the user asks to delete, remove, or drop a question from a form."
    + " Deletion cannot be undone through the API, so if the request is ambiguous, confirm which item is meant first."
    + " To find an item's ID, use **Get Form** and read `items[].itemId`."
    + " The tool looks up the item's current position itself, so earlier deletions never shift which item is removed."
    + " Returns the deleted item's `itemId`, `title`, and former `index`."
    + " Example: formId=`1FAIpQLSdExampleFormId`, itemId=`3f9a21c0` → returns itemId `3f9a21c0`, its title, and the position it held."
    + " [See the documentation](https://developers.google.com/forms/api/reference/rest/v1/forms/batchUpdate#deleteitemrequest)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    googleForms,
    formId: {
      type: "string",
      label: "Form ID",
      description: "The ID of the form to delete the item from, e.g. `1FAIpQLSdExampleFormId`. It is the `formId` returned by **Create Form** or **Get Form**.",
    },
    itemId: {
      type: "string",
      label: "Item ID",
      description: "The stable ID of the item to delete, e.g. `3f9a21c0`. Use **Get Form** and read `items[].itemId` to find it.",
    },
  },
  async run({ $ }) {
    const form = await this.googleForms.getForm({
      $,
      formId: this.formId,
    });
    const items = form.items || [];
    const index = items.findIndex(({ itemId }) => itemId === this.itemId);
    if (index === -1) {
      throw new Error(`Item ${this.itemId} was not found in form ${this.formId}. Use **Get Form** to list valid item IDs.`);
    }
    const title = items[index].title;

    await this.googleForms.updateForm({
      $,
      formId: this.formId,
      data: {
        includeFormInResponse: false,
        requests: [
          {
            deleteItem: {
              location: {
                index,
              },
            },
          },
        ],
      },
    });

    $.export("$summary", `Deleted item ${this.itemId}${title
      ? ` ("${title}")`
      : ""} from position ${index}`);
    return {
      itemId: this.itemId,
      title,
      index,
    };
  },
};
