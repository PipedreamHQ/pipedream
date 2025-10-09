import { defineAction } from "@pipedream/types";
import nectar_crm from "../../app/nectar_crm.app";

export default defineAction({
  key: "nectar_crm-create-appointment",
  name: "Create Appointment",
  description: "Created a new appointment. [See docs here](https://nectarcrm.docs.apiary.io/#reference/0/compromissos/criar)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    nectar_crm,
    contactId: {
      propDefinition: [
        nectar_crm,
        "contactId",
      ],
    },
    subject: {
      label: "Subject",
      description: "The subject of the appointment",
      type: "string",
    },
    beginDate: {
      label: "Begin Date",
      description: "The begin date of the appointment. E.g. `2022-07-20T00:00:00-03:00`",
      type: "string",
    },
    finishDate: {
      label: "Finish Date",
      description: "The finish date of the appointment. E.g. `2022-07-20T00:00:00-03:00`",
      type: "string",
    },
    description: {
      label: "Description",
      description: "The description of the appointment",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.nectar_crm.createAppointment({
      $,
      data: {
        assunto: this.subject,
        cliente: {
          id: this.contactId,
        },
        dataInicio: this.beginDate,
        dataFim: this.finishDate,
        descricao: this.description,
      },
    });

    $.export("$summary", `Successfully created appointment with id ${response.id}`);

    return response;
  },
});
