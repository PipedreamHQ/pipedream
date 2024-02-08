import herobotChatbotMarketing from "../../herobot_chatbot_marketing.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "herobot_chatbot_marketing-create-user",
  name: "Create User",
  description: "Saves pertinent information about a new user. [See the documentation](https://my.herobot.app/api/swagger/)",
  version: "0.0.1",
  type: "action",
  props: {
    herobotChatbotMarketing,
    userId: herobotChatbotMarketing.propDefinitions.userId,
    contentMessage: herobotChatbotMarketing.propDefinitions.contentMessage,
    tagName: herobotChatbotMarketing.propDefinitions.tagName,
    tagId: herobotChatbotMarketing.propDefinitions.tagId,
    customFieldName: herobotChatbotMarketing.propDefinitions.customFieldName,
    customFieldType: herobotChatbotMarketing.propDefinitions.customFieldType,
    newUserDetails: herobotChatbotMarketing.propDefinitions.newUserDetails,
    flowId: herobotChatbotMarketing.propDefinitions.flowId,
    productId: herobotChatbotMarketing.propDefinitions.productId,
    orderId: herobotChatbotMarketing.propDefinitions.orderId,
    customFieldId: herobotChatbotMarketing.propDefinitions.customFieldId,
    customFieldValue: herobotChatbotMarketing.propDefinitions.customFieldValue,
  },
  async run({ $ }) {
    const newUserResponse = await this.herobotChatbotMarketing.createUser({
      newUserDetails: this.newUserDetails,
    });

    if (this.tagId) {
      await this.herobotChatbotMarketing.addTagToUser({
        userId: newUserResponse.id,
        tagId: this.tagId,
      });
    }

    if (this.customFieldId && this.customFieldValue) {
      await this.herobotChatbotMarketing.createCustomField({
        customFieldName: this.customFieldName,
        customFieldType: this.customFieldType,
      });
    }

    $.export("$summary", `Successfully created new user with ID ${newUserResponse.id}`);
    return newUserResponse;
  },
};
