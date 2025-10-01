import app from "../../missive.app.mjs";

export default {
  key: "missive-get-contact",
  name: "Get Contact",
  description: "Get a contact. [See the Documentation](https://missiveapp.com/help/api-documentation/rest-endpoints#get-contact)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    contactBookId: {
      propDefinition: [
        app,
        "contactBookId",
      ],
    },
    contactId: {
      propDefinition: [
        app,
        "contactId",
        ({ contactBookId }) => ({
          contactBookId,
        }),
      ],
    },
  },
  methods: {
    getContact({
      contactId, ...args
    } = {}) {
      return this.app.makeRequest({
        path: `/contacts/${contactId}`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const response = await this.getContact({
      step,
      contactId: this.contactId,
    });

    step.export("$summary", `Successfully fetched contact with ID ${response.contacts[0].id}`);

    return response;
  },
};
