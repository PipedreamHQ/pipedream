import hostaway from "../../hostaway.app.mjs";

export default {
  key: "hostaway-create-task",
  name: "Create Task",
  description: "Creates a new task in Hostaway. [See the documentation](https://api.hostaway.com/documentation#create-task)",
  version: "0.0.1",
  type: "action",
  props: {
    hostaway,
    title: {
      type: "string",
      label: "Title",
      description: "Title of the new task",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the new task",
      optional: true,
    },
    listingId: {
      propDefinition: [
        hostaway,
        "listingId",
      ],
    },
    reservationId: {
      propDefinition: [
        hostaway,
        "reservationId",
        (c) => ({
          listingId: c.listingId,
        }),
      ],
    },
    assigneeId: {
      propDefinition: [
        hostaway,
        "userId",
      ],
      label: "Assignee",
    },
  },
  async run({ $ }) {
    const response = await this.hostaway.createTask({
      data: {
        title: this.title,
        description: this.description,
        listingMapId: this.listingId,
        reservationId: this.reservationId,
        assigneeUserId: this.assigneeId,
      },
      $,
    });

    if (response?.id) {
      $.export("summary", `Successfully created task with ID ${response.id}`);
    }

    return response;
  },
};
