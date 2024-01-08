import referrizer from "../../referrizer.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "referrizer-create-visit",
  name: "Create Visit",
  description: "Send an invitation to an existing contact in Referrizer. [See the documentation](https://api.referrizer.com/static/docs/index.html#operation/inviteContact)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    referrizer,
    contactId: {
      propDefinition: [
        referrizer,
        "contactId",
        async ({ prevContext }) => {
          const { items } = await referrizer.listContacts({
            page: prevContext.page || 0,
          });
          return {
            options: items.map((contact) => ({
              label: contact.name,
              value: contact.id,
            })),
            context: {
              page: items.length
                ? prevContext.page + 1
                : prevContext.page,
            },
          };
        },
      ],
    },
    invitationMessage: {
      propDefinition: [
        referrizer,
        "invitationMessage",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.referrizer.inviteContact({
      contactId: this.contactId,
      invitationMessage: this.invitationMessage,
    });

    $.export("$summary", `Successfully sent an invitation to contact ID: ${this.contactId}`);
    return response;
  },
};
