import Onfleet from "@onfleet/node-onfleet";
import { defineApp } from "@pipedream/types";

export default defineApp({
  type: "app",
  app: "onfleet",
  propDefinitions: {
    apartment: {
      type: "string",
      label: "Address Line 2",
      description: "For display purposes only. Used for Apartment, suite or other descriptive information.",
      optional: true,
    },
    appearance: {
      type: "object",
      label: "Appearance",
      description: "Set triangle colored pins on the map.",
    },
    autoAssign: {
      type: "string",
      label: "Assignment",
      description: "Assignment type",
      options: [
        "auto-assign",
        "team",
        "driver",
      ],
    },
    city: {
      type: "string",
      label: "Address City",
      description: "If coordinates used, for display purposes only. Coordinates will be relied on for actual location.",
    },
    completeAfter: {
      type: "integer",
      label: "Complete After",
      description: "A timestamp in unix time for the earliest time the task should be completed, in milliseconds precision.",
    },
    completeBefore: {
      type: "integer",
      label: "Complete Before",
      description: "A timestamp in unix time for the latest time the task should be completed, in milliseconds precision.",
    },
    country: {
      type: "string",
      label: "Address Country",
      description: "If coordinates used, for display purposes only. Coordinates will be relied on for actual location.",
    },
    dependencies: {
      type: "string[]",
      label: "Dependencies",
      description: "An array of tasks which must be completed prior to this task.",
      async options() {
        const { tasks } = await this.listTasks({
          from: 0,
        });

        return tasks.map(({ id }) => id);
      },
    },
    latitude: {
      type: "string",
      label: "Destination Latitude",
      description: "The Latitude of the destination.",
    },
    longitude: {
      type: "string",
      label: "Destination Longitude",
      description: "The Longitude of the destination.",
    },
    merchant: {
      type: "string",
      label: "Merchant",
      description: "The ID of the organization that will be displayed to the recipient of the task. Defaults to the creating organization. If you perform deliveries on behalf of a connected organization and want to display their name, logo, and branded notifications, provide their organization ID.",
      async options() {
        const {
          id: value, name: label,
        } = await this.getOrganization();

        return [
          {
            label,
            value,
          },
        ];
      },
    },
    minimumAgeRequirement: {
      type: "integer",
      label: "Minimum Age Requirement",
      description: "The recipient's ID must be scanned and their age verified to be greater than or equal to the `minimumAge` in order to complete the task. Must be in a plan that supports ID verification.",
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Notes for the task. Field length cannot exceed 10,000 characters.",
    },
    notesRequirement: {
      type: "boolean",
      label: "Notes Requirement",
      description: "Task completion notes must be submitted to complete this task.",
    },
    photoRequirement: {
      type: "boolean",
      label: "Photo Requirement",
      description: "A photo must be collected to complete this task.",
    },
    pickupTask: {
      type: "boolean",
      label: "Pickup Task",
      description: "Whether the task is a pickup task.",
    },
    postalCode: {
      type: "string",
      label: "Address Post Code / Zip",
      description: "If coordinates used, for display purposes only. Coordinates will be relied on for actual location.",
    },
    quantity: {
      type: "integer",
      label: "Quantity",
      description: "The number of units to be dropped off while completing this task, for route optimization purposes.",
    },
    recipientName: {
      type: "string",
      label: "Recipient Name",
      description: "The person to be notified that the dropoff is occurring.",
    },
    recipientNotes: {
      type: "string",
      label: "Recipient Notes",
      description: "Notes related the recipient or the destination like door codes, beware of dog, etc.",
    },
    recipientPhone: {
      type: "string",
      label: "Recipient Phone",
      description: "The phone of the recipient.",
    },
    serviceTime: {
      type: "integer",
      label: "Service Time",
      description: "The number of minutes to be spent by the worker on arrival at this task's destination, for route optimization purposes.",
    },
    signatureRequirement: {
      type: "boolean",
      label: "Signature Requirement",
      description: "A signature must be collected to complete this task.",
    },
    state: {
      type: "string",
      label: "Address State / Province",
      description: "If coordinates used, for display purposes only. Coordinates will be relied on for actual location.",
    },
    street: {
      type: "string",
      label: "Address Line 1",
      description: "If coordinates used, this will be for display purposes only. Coordinates will be relied on for actual location. Used for the number and name of the street.",
    },
    threshold: {
      type: "string",
      label: "Threshold",
    },
    webhookName: {
      type: "string",
      label: "Name",
      description: "A name for the webhook for identification.",
    },
  },
  methods: {
    sdk() {
      return new Onfleet(this.$auth.api_key);
    },
    async createWebhook(data: object) {
      return this.sdk().webhooks.create(data);
    },
    async createTask(data: object) {
      return this.sdk().tasks.create(data);
    },
    async deleteWebhook(id: number) {
      return this.sdk().webhooks.deleteOne(id);
    },
    async getOrganization() {
      return this.sdk().organization.get();
    },
    async listTasks() {
      return this.sdk().tasks.get({
        "from": 1388563200000,
      });
    },
    async listTeams() {
      return this.sdk().teams.get();
    },
    async listWorkers({ teamId }) {
      return this.sdk().workers.get({
        teams: teamId,
      });
    },
    async *paginate({
      fn, params = {}, field, maxResults = null,
    }) {
      let count = 0;
      let length = 0;
      let id = "";

      do {
        params =
        {
          ...params,
          lastId: id,
        };
        const {
          lastId,
          [field]: data,
        } = await fn(params);
        id = lastId;
        for (const d of data) {
          yield d;
          if (maxResults && ++count === maxResults) {
            return count;
          }
        }
        length = data.length;
      } while (length);
    },
  },
});
