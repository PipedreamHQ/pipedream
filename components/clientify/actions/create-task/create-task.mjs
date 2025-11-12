import clientify from "../../clientify.app.mjs";

export default {
  key: "clientify-create-task",
  name: "Create Task",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Add a new task. [See the documentation](https://developer.clientify.com/#1ee10d02-b3d8-4373-afa4-08d7b678bb26)",
  type: "action",
  props: {
    clientify,
    owner: {
      propDefinition: [
        clientify,
        "userId",
      ],
      optional: true,
    },
    assignedTo: {
      propDefinition: [
        clientify,
        "userId",
      ],
      label: "Assigned To",
      description: "Email of the user to assign the task.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the task",
    },
    description: {
      propDefinition: [
        clientify,
        "description",
      ],
      description: "Will only be shown for videoconferences so it can save its url.",
      optional: true,
    },
    remarks: {
      propDefinition: [
        clientify,
        "remarks",
      ],
      description: "Remarks on the task.",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "Due date of the task in ISO 8601 format, for example `2023‐07‐12T11:00:55+07:00`",
      optional: true,
    },
    startDatetime: {
      type: "string",
      label: "Start Datetime",
      description: "Start datetime of the task in ISO 8601 format, for example `2023‐07‐12T11:00:55+07:00`",
    },
    endDatetime: {
      type: "string",
      label: "End Datetime",
      description: "End datetime of the task in ISO 8601 format, for example `2023‐07‐12T11:00:55+07:00",
    },
    duration: {
      type: "integer",
      label: "Duration",
      description: "Duration of the task.",
      optional: true,
    },
    additionalOption: {
      type: "string",
      label: "Additional Option",
      description: "For videoconferences, stores the `identifier` of the Channel.",
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "For meetings, stores the location of the meeting.",
      optional: true,
    },
    dealId: {
      propDefinition: [
        clientify,
        "dealId",
      ],
      optional: true,
    },
    taskType: {
      propDefinition: [
        clientify,
        "taskType",
      ],
      optional: true,
    },
    taskStage: {
      propDefinition: [
        clientify,
        "taskStage",
      ],
      optional: true,
    },
    relatedCompanies: {
      propDefinition: [
        clientify,
        "companyId",
      ],
      type: "string[]",
      label: "Related Companies",
      description: "A list of URLs of companies.",
      optional: true,
    },
    relatedContacts: {
      propDefinition: [
        clientify,
        "contactId",
        () => ({
          useURL: true,
        }),
      ],
      type: "string[]",
      label: "Related Contacts",
      description: "A list of URLs of contacts.",
      optional: true,
    },
    guestUsers: {
      propDefinition: [
        clientify,
        "userId",
        () => ({
          useURL: true,
        }),
      ],
      type: "string[]",
      label: "Guest Users",
      description: "A list of URLs of users.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      clientify,
      assignedTo,
      dueDate,
      startDatetime,
      endDatetime,
      additionalOption,
      taskType,
      taskStage,
      relatedCompanies,
      relatedContacts,
      guestUsers,
      ...data
    } = this;

    const response = await clientify.createTask({
      $,
      data: {
        ...data,
        assigned_to: assignedTo,
        due_date: dueDate,
        start_datetime: startDatetime,
        end_datetime: endDatetime,
        additional_option: additionalOption,
        task_type: taskType,
        task_stage: taskStage,
        related_companies: relatedCompanies,
        related_contacts: relatedContacts,
        guest_users: guestUsers,
      },
    });

    $.export("$summary", `A new task with Id: ${response.id} was successfully added!`);
    return response;
  },
};
