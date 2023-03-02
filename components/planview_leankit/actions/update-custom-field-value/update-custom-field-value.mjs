import { ConfigurationError } from "@pipedream/platform";
import planview_leankit from "../../planview_leankit.app.mjs";

export default {
  key: "planview_leankit-update-custom-field-value",
  name: "Update Custom Field Value",
  version: "0.0.1",
  description: "Update custom field value on a card.  [See the docs here](https://success.planview.com/Planview_AgilePlace/AgilePlace_API/01_v2/card/update)",
  type: "action",
  props: {
    planview_leankit,
    cardId: {
      propDefinition: [
        planview_leankit,
        "cardId",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.cardId) {
      const { customFields } = await this.planview_leankit.getCard({
        cardId: this.cardId,
      });

      customFields.map(({
        label, value, fieldId,
      }) => {
        props["customField" + fieldId] = {
          type: "string",
          label,
          default: value,
          description: `Custom Field ${label}.`,
        };
      });
    }
    return props;
  },
  async run({ $ }) {
    const {
      planview_leankit,
      cardId,
      ...customFields
    } = this;

    const dataFields = [];
    let i = 0;

    for (const [
      key,
      value,
    ] of Object.entries(customFields)) {
      const fieldId = key.substr(11);
      dataFields.push({
        "op": "replace",
        "path": `/customFields/${i++}`,
        "value": {
          fieldId,
          value,
        },
      });
    }

    try {
      const response = await planview_leankit.updateCard({
        $,
        cardId: cardId,
        data: dataFields,
      });

      $.export("$summary", "Custom Fields were successfully updated!");
      return response;
    } catch (error) {
      throw new ConfigurationError(error);
    }

  },
};
