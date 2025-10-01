import gravityForms from "../../gravity_forms.app.mjs";

export default {
  key: "gravity_forms-create-entry",
  name: "Create Entry",
  description: "Creates a new entry in a Gravity Forms form. [See the documentation](https://docs.gravityforms.com/creating-entries-with-the-rest-api-v2/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    gravityForms,
    formId: {
      propDefinition: [
        gravityForms,
        "formId",
      ],
      reloadProps: true,
    },
    createdBy: {
      type: "integer",
      label: "Created By",
      description: "The user ID of the entry submitter.",
      optional: true,
    },
    dateCreated: {
      type: "string",
      label: "Date Created",
      description: "The date the entry was created, in UTC. **Format: YYYY-MM-DD HH:MM:SS**",
      optional: true,
    },
    ip: {
      type: "string",
      label: "IP",
      description: "The IP address of the entry creator.",
      optional: true,
    },
    isFulfilled: {
      type: "boolean",
      label: "Is Fulfilled",
      description: "Whether the transaction has been fulfilled, if applicable.",
      optional: true,
    },
    isRead: {
      type: "boolean",
      label: "Is Read",
      description: "Whether the entry has been read.",
      optional: true,
    },
    isStarred: {
      type: "boolean",
      label: "Is Starred",
      description: "Whether the entry is starred.",
      optional: true,
    },
    sourceUrl: {
      type: "string",
      label: "Source Url",
      description: "The URL where the form was embedded.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the entry.",
      optional: true,
    },
    userAgent: {
      type: "string",
      label: "User Agent",
      description: "The user agent string for the browser used to submit the entry.",
      optional: true,
    },
  },
  methods: {
    async getFields(formId) {
      const formResponse = await this.gravityForms.listForms({
        params: {
          ["include[]"]: formId,
        },
      });

      return formResponse[`${formId}`].fields;
    },
  },
  async additionalProps() {
    let props = {};
    if (this.formId) {
      const fields = await this.getFields(this.formId);

      for (const field of fields) {
        let inputs = {};
        if (field.inputs) {
          for (const input of field.inputs) {
            if (!input.isHidden) {
              inputs[`field_${input.id}`] = {
                type: "string",
                label: input.label,
                description: field.description || input.label,
                optional: !field.isRequired,
              };
            }
          }
        }

        if (!Object.keys(inputs).length) {
          props[`field_${field.id}`] = {
            type: "string",
            label: field.label,
            description: field.description || field.label,
            optional: !field.isRequired,
          };
        }

        props = {
          ...props,
          ...inputs,
        };
      }
    }
    return props;
  },
  async run({ $ }) {
    const formFields = {};

    const fields = await this.getFields(this.formId);
    for (const field of fields) {
      if (field.inputs) {
        for (const input of field.inputs) {
          if (!input.isHidden) {
            formFields[`${input.id}`] = this[`field_${input.id}`];
          }
        }
      }
      formFields[`${field.id}`] = this[`field_${field.id}`];
    }

    const response = await this.gravityForms.createEntry({
      formId: this.formId,
      data: {
        ...formFields,
        created_by: this.createdBy,
        date_created: this.dateCreated,
        ip: this.ip,
        is_fulfilled: `${+this.isFulfilled}`,
        is_read: +this.isRead,
        is_starred: +this.isStarred,
        source_url: this.sourceUrl,
        status: this.status,
        user_agent: this.userAgent,
      },
    });

    $.export("$summary", `Successfully created an entry with ID: ${response.id}`);
    return response;
  },
};
