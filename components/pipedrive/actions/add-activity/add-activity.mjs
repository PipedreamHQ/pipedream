import { ConfigurationError } from "@pipedream/platform";
import constants from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-add-activity",
  name: "Add Activity",
  description: "Adds a new activity. Includes `more_activities_scheduled_in_context` property in response's `additional_data` which indicates whether there are more undone activities scheduled with the same deal, person or organization (depending on the supplied data). See the Pipedrive API docs for Activities [here](https://developers.pipedrive.com/docs/api/v1/#!/Activities). For info on [adding an activity in Pipedrive](https://developers.pipedrive.com/docs/api/v1/Activities#addActivity)",
  version: "0.1.18",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pipedriveApp,
    subject: {
      type: "string",
      label: "Subject",
      description: "Subject of the activity",
    },
    type: {
      type: "string",
      label: "Type",
      description: "Type of the activity. This is in correlation with the `key_string` parameter of ActivityTypes.",
      async options() {
        const { data: activityTypes } = await this.pipedriveApp.getActivityTypes();
        return activityTypes.map(({
          key_string: value, name,
        }) => ({
          label: name,
          value,
        }));
      },
    },
    ownerId: {
      propDefinition: [
        pipedriveApp,
        "userId",
      ],
      description: "ID of the user whom the activity will be assigned to. If omitted, the activity will be assigned to the authorized user.",
    },
    dealId: {
      propDefinition: [
        pipedriveApp,
        "dealId",
      ],
    },
    leadId: {
      propDefinition: [
        pipedriveApp,
        "leadId",
      ],
    },
    orgId: {
      propDefinition: [
        pipedriveApp,
        "organizationId",
      ],
      description: "ID of the organization this activity will be associated with",
    },
    projectId: {
      propDefinition: [
        pipedriveApp,
        "projectId",
      ],
      description: "ID of the project this activity will be associated with",
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "Due date of the activity. Format: `YYYY-MM-DD`",
      optional: true,
    },
    dueTime: {
      type: "string",
      label: "Due Time",
      description: "Due time of the activity in UTC. Format: `HH:MM`",
      optional: true,
    },
    duration: {
      type: "string",
      label: "Duration",
      description: "Duration of the activity. Format: `HH:MM`",
      optional: true,
    },
    busy: {
      type: "boolean",
      label: "Busy",
      description: "Set the activity as 'Busy' or 'Free'. If the flag is set to true, your customers will not be able to book that time slot through any Scheduler links",
      optional: true,
    },
    done: {
      type: "boolean",
      label: "Done",
      description: "Whether the activity is done or not.",
      optional: true,
    },
    location: {
      type: "object",
      label: "Location",
      description: "The address of the activity. Pipedrive will automatically check if the location matches a geo-location on Google maps.",
      optional: true,
    },
    participants: {
      type: "string[]",
      label: "Participants",
      description: "List of multiple persons (participants) this activity will be associated with. If omitted, single participant from `person_id` field is used. It requires a structure as follows: `[{\"person_id\":1,\"primary\":true}]`",
      optional: true,
      propDefinition: [
        pipedriveApp,
        "personId",
      ],
    },
    attendees: {
      type: "string[]",
      label: "Attendees",
      description: "Attendees of the activity. This can be either your existing Pipedrive contacts or an external email address. It requires a structure as follows: `[{\"email\":\"mail@example.org\"}]`",
      optional: true,
      async options({ prevContext }) {
        if (prevContext?.cursor === false) {
          return [];
        }
        const {
          data: persons,
          additional_data: additionalData,
        } = await this.pipedriveApp.getPersons({
          cursor: prevContext.cursor,
          limit: constants.DEFAULT_PAGE_LIMIT,
        });

        return {
          options: persons?.flatMap(({
            name, emails,
          }) => emails?.map(({ value }) => ({
            label: name,
            value,
          })).filter((option) => option?.value)),
          context: {
            cursor: additionalData.next_cursor,
          },
        };
      },
    },
    publicDescription: {
      type: "string",
      label: "Public Description",
      description: "Additional details about the activity that will be synced to your external calendar. Unlike the note added to the activity, the description will be publicly visible to any guests added to the activity.",
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "Note of the activity (HTML format)",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      pipedriveApp,
      dueDate,
      dueTime,
      ownerId,
      dealId,
      leadId,
      orgId,
      projectId,
      location,
      participants,
      attendees,
      publicDescription,
      ...data
    } = this;

    try {
      const resp =
        await pipedriveApp.addActivity({
          due_date: dueDate,
          due_time: dueTime,
          owner_id: ownerId,
          deal_id: dealId,
          lead_id: leadId,
          participants: parseObject(participants)?.map((value, idx) => ({
            person_id: value,
            primary: !idx,
          })),
          org_id: orgId,
          project_id: projectId,
          location: parseObject(location),
          public_description: publicDescription,
          attendees: parseObject(attendees)?.map((value) => ({
            email: value,
          })),
          ...data,
        });

      $.export("$summary", "Successfully added activity");

      return resp;
    } catch ({ error }) {
      throw new ConfigurationError(error);
    }
  },
};
