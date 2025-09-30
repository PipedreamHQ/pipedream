import app from "../../project_broadcast.app.mjs";

export default {
  key: "project_broadcast-add-keyword-to-contact",
  name: "Add Keyword To Contact",
  description: "Add a keyword to a contact. [See the documentation](https://www.projectbroadcast.com/apidoc/#api-Contacts-Apply_Keyword)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    contactId: {
      propDefinition: [
        app,
        "contactId",
      ],
    },
    keywordId: {
      propDefinition: [
        app,
        "keywordId",
      ],
    },
  },
  methods: {
    addKeywordToContact({
      contactId, keywordId, ...args
    } = {}) {
      return this.app.put({
        path: `/contacts/${contactId}/keywords/${keywordId}/apply`,
        ...args,
      });
    },
  },
  run({ $: step }) {
    const {
      addKeywordToContact,
      contactId,
      keywordId,
    } = this;

    return addKeywordToContact({
      step,
      contactId,
      keywordId,
      summary: (response) => `Successfully added keyword with ID \`${response._id}\`.`,
    });
  },
};
