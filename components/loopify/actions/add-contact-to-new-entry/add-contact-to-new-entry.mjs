import app from "../../loopify.app.mjs";

export default {
  key: "loopify-add-contact-to-new-entry",
  name: "Add Contact To New Entry",
  description: "Adds a contact to an **API Entry** block in a Loopify flow. [See the documentation](https://api.loopify.com/docs/index.html#tag/Flows/operation/addContactToNewEntry)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    flowId: {
      propDefinition: [
        app,
        "flowId",
      ],
    },
    contactId: {
      propDefinition: [
        app,
        "contactId",
      ],
    },
  },
  methods: {
    addContactToNewEntryBlock({
      flowId, ...args
    } = {}) {
      return this.app.post({
        path: `/flows/${flowId}/new-entry`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      addContactToNewEntryBlock,
      flowId,
      contactId,
    } = this;

    const response = await addContactToNewEntryBlock({
      $,
      flowId,
      data: {
        contactIds: [
          contactId,
        ],
      },
    });

    $.export("$summary", `Successfully added contact to the New Entry Block in the Loopify flow with status \`${response.status}\``);
    return response;
  },
};
