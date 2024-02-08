import herobotChatbotMarketing from "../../herobot_chatbot_marketing.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "herobot_chatbot_marketing-create-custom-field",
  name: "Create Custom Field",
  description: "Create a new custom field in the HeroBot account. [See the documentation](https://my.herobot.app/api/swagger/)",
  version: "0.0.1",
  type: "action",
  props: {
    herobotChatbotMarketing,
    customFieldName: {
      propDefinition: [
        herobotChatbotMarketing,
        "customFieldName",
      ],
    },
    customFieldType: {
      propDefinition: [
        herobotChatbotMarketing,
        "customFieldType",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.herobotChatbotMarketing.createCustomField({
      customFieldName: this.customFieldName,
      customFieldType: this.customFieldType,
    });

    $.export("$summary", `Successfully created custom field ${this.customFieldName} of type ${this.customFieldType}`);
    return response;
  },
};
