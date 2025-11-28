import gorgias from "../../gorgias_oauth.app.mjs";

export default {
  key: "gorgias_oauth-update-ticket-field-values",
  name: "Update Ticket Field Values",
  description: "Update field values for a ticket. [See the documentation](https://developers.gorgias.com/reference/update-ticket-custom-fields)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    gorgias,
    ticketId: {
      propDefinition: [
        gorgias,
        "ticketId",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.ticketId) {
      return props;
    }
    const { data: customFields } = await this.gorgias.listCustomFields({
      params: {
        object_type: "Ticket",
      },
    });
    for (const field of customFields) {
      const inputType = field?.definition?.input_settings?.input_type;
      const dataType = field?.definition?.data_type;
      props[field.id] = {
        type: dataType === "boolean"
          ? "boolean"
          : "string",
        label: field.label,
        optional: !field.required,
      };
      if (dataType === "boolean") continue;
      if (inputType === "dropdown") {
        props[field.id].options = field.definition.input_settings.choices.map((choice) => `${choice}`);
      }
    }
    return props;
  },
  async run({ $ }) {
    const { data: customFields } = await this.gorgias.listCustomFields({
      params: {
        object_type: "Ticket",
      },
    });

    const { data: fieldValues } = await this.gorgias.listTicketFieldValues({
      ticketId: this.ticketId,
    });
    const data = [];
    for (const field of customFields) {
      if (this[field.id] === undefined) {
        const fieldValue = fieldValues.find((fv) => fv.field.id === field.id);
        if (fieldValue) {
          data.push({
            id: field.id,
            value: fieldValue?.value,
          });
        }
        continue;
      }
      const dataType = field?.definition?.data_type;
      data.push({
        id: field.id,
        value: dataType === "number"
          ? +this[field.id]
          : this[field.id],
      });
    }

    const response = await this.gorgias.updateTicketFieldValues({
      $,
      ticketId: this.ticketId,
      data,
    });

    $.export("$summary", `Successfully updated ticket ${this.ticketId} field values`);
    return response;
  },
};
