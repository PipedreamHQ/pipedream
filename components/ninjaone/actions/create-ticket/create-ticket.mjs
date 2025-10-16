import { ConfigurationError } from "@pipedream/platform";
import {
  PRIORITY_OPTIONS,
  SEVERITY_OPTIONS,
  TYPE_OPTIONS,
} from "../../common/constants.mjs";
import {
  normalCase,
  parseObject,
} from "../../common/utils.mjs";
import ninjaone from "../../ninjaone.app.mjs";

export default {
  key: "ninjaone-create-ticket",
  name: "Create Support Ticket",
  description: "Creates a new support ticket in NinjaOne. [See the documentation](https://app.ninjarmm.com/apidocs/?links.active=core#/ticketing/create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ninjaone,
    clientId: {
      propDefinition: [
        ninjaone,
        "clientId",
      ],
    },
    ticketFormId: {
      propDefinition: [
        ninjaone,
        "ticketFormId",
      ],
    },
    organizationId: {
      propDefinition: [
        ninjaone,
        "organizationId",
      ],
      optional: true,
    },
    locationId: {
      propDefinition: [
        ninjaone,
        "locationId",
        ({ organizationId }) => ({
          organizationId,
        }),
      ],
      optional: true,
    },
    nodeId: {
      propDefinition: [
        ninjaone,
        "deviceId",
        ({ organizationId }) => ({
          organizationId,
        }),
      ],
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject of the ticket",
    },
    descriptionPublic: {
      type: "boolean",
      label: "Public Description",
      description: "Whether the ticket's description is public or not",
    },
    descriptionBody: {
      type: "string",
      label: "Description Body",
      description: "The description of the ticket",
      optional: true,
    },
    descriptionHTML: {
      type: "string",
      label: "Description HTML",
      description: "The description HTML of the ticket",
      optional: true,
    },
    descriptiontimeTracked: {
      type: "integer",
      label: "Time Tracked",
      description: "Time in seconds",
      optional: true,
    },
    descriptionDuplicateInIncidents: {
      type: "boolean",
      label: "Duplicate In Incidents",
      description: "Whether the ticket will duplicate in the same incident",
      optional: true,
    },
    status: {
      propDefinition: [
        ninjaone,
        "status",
      ],
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of the ticket",
      options: TYPE_OPTIONS,
      optional: true,
    },
    cc: {
      type: "string[]",
      label: "CC",
      description: "A list of emails to be copied in the notification email",
      optional: true,
    },
    assignedAppUserId: {
      propDefinition: [
        ninjaone,
        "assignedAppUserId",
      ],
      optional: true,
    },
    severity: {
      type: "string",
      label: "Severity",
      description: "The severity's level of the ticket",
      options: SEVERITY_OPTIONS,
      optional: true,
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "The priority's level of the ticket",
      options: PRIORITY_OPTIONS,
      optional: true,
    },
    tags: {
      propDefinition: [
        ninjaone,
        "tags",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const {
        ninjaone,
        descriptionPublic,
        descriptionBody,
        descriptionHTML,
        descriptiontimeTracked,
        descriptionDuplicateInIncidents,
        cc,
        tags,
        ...data
      } = this;

      const response = await ninjaone.createSupportTicket({
        $,
        data: {
          ...data,
          description: {
            public: descriptionPublic,
            body: descriptionBody,
            htmlBody: descriptionHTML,
            timeTracked: descriptiontimeTracked,
            duplicateInIncidents: descriptionDuplicateInIncidents,
          },
          cc: {
            emails: parseObject(cc),
          },
          tags: parseObject(tags),
        },
      });

      $.export("$summary", `Ticket created successfully with ID: ${response.id}`);
      return response;
    } catch ({ response }) {
      throw new ConfigurationError(normalCase(response.data.resultCode) || response.data);
    }
  },
};
