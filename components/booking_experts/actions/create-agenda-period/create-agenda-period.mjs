import bookingExperts from "../../booking_experts.app.mjs";

export default {
  key: "booking_experts-create-agenda-period",
  name: "Create Agenda Period",
  description: "Creates a new agenda period. [See the documentation](https://developers.bookingexperts.com/reference/administration-maintenance-agenda-periods-create)",
  version: "0.0.1",
  type: "action",
  props: {
    bookingExperts,
    administrationId: {
      propDefinition: [
        bookingExperts,
        "administrationId",
      ],
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of agenda period to create",
      options: [
        "maintenance_agenda_periods",
        "external_blocked_agenda_periods",
      ],
    },
    label: {
      type: "string",
      label: "Label",
      description: "The label of the agenda period",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The start date of the agenda period. Example: `2025-08-28`",
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "The end date of the agenda period",
    },
    inventoryObjectId: {
      propDefinition: [
        bookingExperts,
        "inventoryObjectId",
        (c) => ({
          administrationId: c.administrationId,
        }),
      ],
    },
    rentableId: {
      propDefinition: [
        bookingExperts,
        "rentableId",
        (c) => ({
          administrationId: c.administrationId,
          inventoryObjectId: c.inventoryObjectId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const { data } = await this.bookingExperts.createAgendaPeriod({
      $,
      administrationId: this.administrationId,
      type: this.type,
      data: {
        data: {
          type: "agenda_period",
          attributes: {
            label: this.label,
            start_date: this.startDate,
            end_date: this.endDate,
          },
          relationships: {
            inventory_object: this.inventoryObjectId
              ? {
                data: {
                  type: "inventory_object",
                  id: this.inventoryObjectId,
                },
              }
              : undefined,
            rentable: {
              data: {
                type: "rentable",
                id: this.rentableId,
              },
            },
          },
        },
      },
    });
    $.export("$summary", "Agenda period created");
    return data;
  },
};
