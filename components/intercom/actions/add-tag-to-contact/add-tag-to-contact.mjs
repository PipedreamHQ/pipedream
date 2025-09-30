import intercom from "../../intercom.app.mjs";

export default {
  key: "intercom-add-tag-to-contact",
  name: "Add Tag To Contact",
  description: "Adds a specific tag to a contact in Intercom. [See the documentation](https://developers.intercom.com/docs/references/rest-api/api.intercom.io/contacts/attachtagtocontact).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    intercom,
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The unique identifier for the contact which is given by Intercom. Eg. `63a07ddf05a32042dffac965`.",
      propDefinition: [
        intercom,
        "userIds",
        () => ({
          data: {
            query: {
              operator: "OR",
              value: [
                {
                  field: "role",
                  operator: "=",
                  value: "user",
                },
                {
                  field: "role",
                  operator: "=",
                  value: "lead",
                },
              ],
            },
          },
        }),
      ],
    },
    tagId: {
      propDefinition: [
        intercom,
        "tagId",
      ],
    },
  },
  methods: {
    addTagToContact({
      contactId, ...args
    } = {}) {
      return this.intercom.makeRequest({
        method: "POST",
        endpoint: `contacts/${contactId}/tags`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      addTagToContact,
      contactId,
      tagId,
    } = this;

    const response = await addTagToContact({
      $,
      contactId,
      data: {
        id: tagId,
      },
    });

    $.export("$summary", `Successfully added tag to contact with ID \`${response.id}\`.`);
    return response;
  },
};
