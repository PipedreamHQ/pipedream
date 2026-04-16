import acumbamail from "../../acumbamail.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "acumbamail-add-or-update-subscriber",
  name: "Add or Update Subscriber",
  description: "Adds a new subscriber to a list or updates an existing subscriber. [See the documentation](https://acumbamail.com/en/apidoc/function/addSubscriber/)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    acumbamail,
    listId: {
      propDefinition: [
        acumbamail,
        "listId",
      ],
      reloadProps: true,
    },
    doubleOptin: {
      type: "boolean",
      label: "Double Opt-in",
      description: "Activates sending of confirmation email when adding the subscriber",
      optional: true,
    },
    updateSubscriber: {
      type: "boolean",
      label: "Update Subscriber",
      description: "Modifies the fields in the case of a subscriber who is already on the list",
      optional: true,
    },
    mergeFields: {
      type: "object",
      label: "Merge Fields",
      description: "Optionally, add merge fields as a single object. This is a Dictionary that contains the merge tags of the subscriber as keys and the value that will be added to the subscriber",
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.listId) {
      return props;
    }
    const fields = await this.acumbamail.getFields({
      params: {
        list_id: this.listId,
      },
    });
    for (const key of Object.keys(fields)) {
      props[key] = {
        type: "string",
        label: key,
        optional: true,
      };
    }
    return props;
  },
  async run({ $ }) {
    const mergeFields = parseObject(this.mergeFields);
    const fields = await this.acumbamail.getFields({
      params: {
        list_id: this.listId,
      },
    });
    for (const key of Object.keys(fields)) {
      if (!this[key]) continue;
      mergeFields[key] = this[key];
    }

    const response = await this.acumbamail.addOrUpdateSubscriber({
      $,
      data: {
        list_id: this.listId,
        double_optin: this.doubleOptin,
        update_subscriber: this.updateSubscriber,
        merge_fields: mergeFields,
        complete_json: true,
      },
    });

    $.export("$summary", "Successfully added or updated subscriber.");
    return response;
  },
};
