import onfleet from "../../app/onfleet.app";
import {
  clearObj, prepareData,
} from "../common/utils";

export default {
  key: "onfleet-create-pickup-dropoff-task",
  name: "Create Linked Pickup & Dropoff Tasks",
  description: "Create a pickup task and dropoff task linked with each other. [See the docs here](https://docs.onfleet.com/reference/create-task)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    onfleet,
    merchant: {
      propDefinition: [
        onfleet,
        "merchant",
      ],
    },
    executor: {
      propDefinition: [
        onfleet,
        "merchant",
      ],
      label: "Executor",
      description: "The ID of the organization that will be responsible for fulfilling the task. Defaults to the creating organization. If you delegate your deliveries to a third party, provide their organization ID.",
    },
    hasPickupRecipient: {
      type: "boolean",
      label: "Has A Pickup Recipient",
      description: "If the pickup have a recipient who should be notified of task status changes.",
      reloadProps: true,
    },
    hasDropoffRecipient: {
      type: "boolean",
      label: "Has A Dropoff Recipient",
      description: "If the dropoff have a recipient who should be notified of task status changes.",
      reloadProps: true,
    },
    latitude: {
      propDefinition: [
        onfleet,
        "latitude",
      ],
      optional: true,
    },
    longitude: {
      propDefinition: [
        onfleet,
        "longitude",
      ],
      optional: true,
    },
    street: {
      propDefinition: [
        onfleet,
        "street",
      ],
    },
    apartment: {
      propDefinition: [
        onfleet,
        "apartment",
      ],
      optional: true,
    },
    city: {
      propDefinition: [
        onfleet,
        "city",
      ],
    },
    state: {
      propDefinition: [
        onfleet,
        "state",
      ],
    },
    postalCode: {
      propDefinition: [
        onfleet,
        "postalCode",
      ],
    },
    country: {
      propDefinition: [
        onfleet,
        "country",
      ],
    },
    taskLinkOrder: {
      type: "integer",
      label: "Task Link Order",
      description: "The order in which to create the linked task relationship. By default, the pickup is created as the prerequisite to the dropoff. Choose \"Dropoff first\" to reverse this order, requiring completion of the dropoff before the pickup.",
      default: 1,
      options: [
        {
          label: "Pickup first",
          value: 1,
        },
        {
          label: "Dropoff first",
          value: 2,
        },
      ],
    },
    autoAssign: {
      propDefinition: [
        onfleet,
        "autoAssign",
      ],
      reloadProps: true,
    },
    quantity: {
      propDefinition: [
        onfleet,
        "quantity",
      ],
      optional: true,
    },
    serviceTime: {
      propDefinition: [
        onfleet,
        "serviceTime",
      ],
      optional: true,
    },
    signatureRequirement: {
      propDefinition: [
        onfleet,
        "signatureRequirement",
      ],
    },
    photoRequirement: {
      propDefinition: [
        onfleet,
        "photoRequirement",
      ],
    },
    notesRequirement: {
      propDefinition: [
        onfleet,
        "notesRequirement",
      ],
    },
    minimumAgeRequirement: {
      propDefinition: [
        onfleet,
        "minimumAgeRequirement",
      ],
      optional: true,
    },
    completeAfter: {
      propDefinition: [
        onfleet,
        "completeAfter",
      ],
      optional: true,
    },
    completeBefore: {
      propDefinition: [
        onfleet,
        "completeBefore",
      ],
      optional: true,
    },
    notes: {
      propDefinition: [
        onfleet,
        "notes",
      ],
      optional: true,
    },
    appearance: {
      propDefinition: [
        onfleet,
        "appearance",
      ],
      optional: true,
    },
  },
  async additionalProps() {
    let props = {};
    if (this.hasPickupRecipient) {
      props = {
        ...props,
        pickupRecipientName: {
          type: "string",
          label: "Pickup Recipient Name",
          description: "The person to be notified that the pickup is occurring.",
        },
        pickupRecipientPhone: {
          type: "string",
          label: "Pickup Recipient Phone",
          description: "The phone of the pickup recipient.",
        },
        pickupRecipientNotes: {
          type: "string",
          label: "Pickup Recipient Notes",
          description: "Notes related the recipient or the destination like door codes, beware of dog, etc.",
          optional: true,
        },
      };
    }
    if (this.hasDropoffRecipient) {
      props = {
        ...props,
        dropoffRecipientName: {
          type: "string",
          label: "Dropoff Recipient Name",
          description: "The person to be notified that the pickup is occurring.",
        },
        dropoffRecipientPhone: {
          type: "string",
          label: "Dropoff Recipient Phone",
          description: "The phone of the dropoff recipient.",
        },
        dropoffRecipientNotes: {
          type: "string",
          label: "Dropoff Recipient Notes",
          description: "Notes related the recipient or the destination like door codes, beware of dog, etc.",
          optional: true,
        },
      };
    }
    if (this.autoAssign) {
      if (this.autoAssign != "auto-assign") {
        props = {
          ...props,
          team: {
            type: "string",
            label: "Team Id",
            description: "The team's Id",
            options: async () =>  {
              const teams = await this.onfleet.listTeams();

              return teams.map(({
                id: value,
                name: label,
              }) => ({
                label,
                value,
              }));
            },
          },
        };
      }

      if (this.autoAssign === "driver") {
        props = {
          ...props,
          worker: {
            type: "string",
            label: "Driver",
            description: "The driver's Id",
            options: async () =>  {
              const drivers = await this.onfleet.listWorkers({
                teamId: this.team,
              });

              return drivers.map(({
                id: value,
                name: label,
              }) => ({
                label,
                value,
              }));
            },
          },
        };
      }
    }
    return props;
  },
  methods: {
    async createTask(onfleet, data) {
      const preparedData = prepareData(data);
      return await onfleet.createTask(clearObj(preparedData));
    },
  },
  async run({ $ }) {
    const {
      onfleet,
      pickupRecipientName,
      pickupRecipientPhone,
      pickupRecipientNotes,
      dropoffRecipientName,
      dropoffRecipientPhone,
      dropoffRecipientNotes,
      taskLinkOrder,
      pickupLatitude,
      pickupLongitude,
      pickupAddress,
      dropoffLatitude,
      dropoffLongitude,
      dropoffAddress,
      recipientPickup,
      recipientDropoff,
      ...data
    } = this;

    const pickupObject = {
      ...data,
      recipientName: pickupRecipientName,
      recipientPhone: pickupRecipientPhone,
      recipientNotes: pickupRecipientNotes,
      recipient: recipientPickup,
      latitude: pickupLatitude,
      longitude: pickupLongitude,
      address: pickupAddress,
    };
    const dropoffObject = {
      ...data,
      recipientName: dropoffRecipientName,
      recipientPhone: dropoffRecipientPhone,
      recipientNotes: dropoffRecipientNotes,
      recipient: recipientDropoff,
      latitude: dropoffLatitude,
      longitude: dropoffLongitude,
      address: dropoffAddress,
    };

    let pickupResponse: { id?: string } = {};
    let dropoffResponse: { id?: string } = {};
    let response = {};
    let summary = "";

    if (taskLinkOrder == "1") {
      pickupResponse = await this.createTask(onfleet, {
        ...pickupObject,
      });
      dropoffResponse = await this.createTask(onfleet, {
        dependencies: [
          pickupResponse.id,
        ],
        ...dropoffObject,
      });
      summary = `A new pickup task with id ${pickupResponse.id} was successfully created, then a new dropff task with id ${dropoffResponse.id} was successfully created!`;
    } else {
      dropoffResponse = await this.createTask(onfleet, {
        ...dropoffObject,
      });
      pickupResponse = await this.createTask(onfleet, {
        dependencies: [
          dropoffResponse.id,
        ],
        ...pickupObject,
      });
      summary = `A new dropff task with id ${dropoffResponse.id} was successfully created, then a new pickup task with id ${pickupResponse.id} was successfully created!`;
    }

    response = {
      dropoffResponse,
      pickupResponse,
    };

    $.export("$summary", summary);
    return response;
  },
};
