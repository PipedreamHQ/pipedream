import { checkWarnings } from "../../common/utils.mjs";
import icontact from "../../icontact.app.mjs";

export default {
  key: "icontact-subscribe-contact-list",
  name: "Subscribe Contact to List",
  description: "Adds a contact to a specific list within iContact. [See the documentation](https://help.icontact.com/customers/s/article/Subscriptions-iContact-API?r=153&ui-knowledge-components-aura-actions.KnowledgeArticleVersionCreateDraftFromOnlineAction.createDraftFromOnlineArticle=1)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    icontact,
    contactId: {
      propDefinition: [
        icontact,
        "contactId",
      ],
    },
    listId: {
      propDefinition: [
        icontact,
        "listId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.icontact.subscribeContactToList({
      data: {
        subscription: {
          contactId: this.contactId,
          listId: this.listId,
          status: "normal",
        },
      },
    });

    checkWarnings(response);

    $.export("$summary", `Successfully created subscription with ID: ${response.subscriptions[0].subscriptionId}`);
    return response.subscriptions[0];
  },
};
