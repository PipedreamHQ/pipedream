import { DEFAULT_MEETING_PROPERTIES } from "../../common/constants.mjs";
import { OBJECT_TYPE } from "../../common/object-types.mjs";
import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-get-associated-meetings",
  name: "Get Associated Meetings",
  description: "Retrieves meetings associated with a specific object (contact, company, or deal) with optional time filtering. [See the documentation](https://developers.hubspot.com/docs/reference/api/crm/associations/association-details#get-%2Fcrm%2Fv4%2Fobjects%2F%7Bobjecttype%7D%2F%7Bobjectid%7D%2Fassociations%2F%7Btoobjecttype%7D)",
  version: "0.0.6",
  type: "action",
  props: {
    hubspot,
    objectType: {
      propDefinition: [
        hubspot,
        "objectType",
        () => ({
          includeCustom: true,
        }),
      ],
      label: "From Object Type",
      description: "The type of the object being associated",
    },
    objectId: {
      type: "string",
      label: "Object ID",
      description: "The ID of the object to get associated meetings for. For contacts, you can search by email.",
      propDefinition: [
        hubspot,
        "objectIds",
        ({ objectType }) => ({
          objectType,
        }),
      ],
    },
    timeframe: {
      propDefinition: [
        hubspot,
        "timeframe",
      ],
    },
    mostRecent: {
      propDefinition: [
        hubspot,
        "mostRecent",
      ],
    },
    additionalProperties: {
      type: "string[]",
      label: "Additional Properties",
      description: "Additional properties to retrieve for the meetings",
      optional: true,
    },
  },
  additionalProps() {
    const { timeframe } = this;
    if (timeframe !== "custom") {
      return {};
    }
    return {
      startDate: {
        type: "string",
        label: "Start Date",
        description: "The start date to filter meetings from (ISO 8601 format). Eg. `2025-01-01T00:00:00Z`",
      },
      endDate: {
        type: "string",
        label: "End Date",
        description: "The end date to filter meetings to (ISO 8601 format). Eg. `2025-01-31T23:59:59Z`",
      },
    };
  },
  methods: {
    getMeetingTimeFilter(timeframe, startDate, endDate) {
      const now = new Date();
      const startOfDay = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          0,
          0,
          0,
          0,
        ),
      ).toISOString();
      const endOfDay = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          23,
          59,
          59,
          999,
        ),
      ).toISOString();

      switch (timeframe) {
      case "today":
        return {
          hs_meeting_start_time: {
            operator: "GTE",
            value: startOfDay,
          },
          hs_meeting_end_time: {
            operator: "LTE",
            value: endOfDay,
          },
        };
      case "this_week": {
        const dayOfWeek = now.getUTCDay();
        const startOfWeek = new Date(
          Date.UTC(
            now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - dayOfWeek, 0, 0, 0, 0,
          ),
        ).toISOString();
        const endOfWeek = new Date(
          Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate() + (6 - dayOfWeek),
            23,
            59,
            59,
            999,
          ),
        ).toISOString();
        return {
          hs_meeting_start_time: {
            operator: "GTE",
            value: startOfWeek,
          },
          hs_meeting_end_time: {
            operator: "LTE",
            value: endOfWeek,
          },
        };
      }
      case "this_month": {
        const startOfMonth = new Date(
          Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0),
        ).toISOString();
        const endOfMonth = new Date(
          Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999),
        ).toISOString();
        return {
          hs_meeting_start_time: {
            value: startOfMonth,
            operator: "GTE",
          },
          hs_meeting_end_time: {
            value: endOfMonth,
            operator: "LTE",
          },
        };
      }
      case "last_month": {
        const startOfLastMonth = new Date(
          Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth() - 1,
            1,
            0,
            0,
            0,
            0,
          ),
        ).toISOString();
        const endOfLastMonth = new Date(
          Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            0,
            23,
            59,
            59,
            999,
          ),
        ).toISOString();
        return {
          hs_meeting_start_time: {
            operator: "GTE",
            value: startOfLastMonth,
          },
          hs_meeting_end_time: {
            operator: "LTE",
            value: endOfLastMonth,
          },
        };
      }
      case "custom":
        return {
          hs_meeting_start_time: {
            operator: "LTE",
            value: startDate,
          },
          hs_meeting_end_time: {
            operator: "GTE",
            value: endDate,
          },
        };
      default:
        return {};
      }
    },
    async getAssociatedMeetings({
      objectType,
      objectId,
      timeframe,
      startDate,
      endDate,
      mostRecent,
    }) {
      const { results: associations } = await this.hubspot.getAssociations({
        objectType,
        objectId,
        toObjectType: OBJECT_TYPE.MEETING,
      });

      if (!associations?.length) {
        return [];
      }

      const meetingIds = associations.map(({ toObjectId }) => toObjectId);

      const timeFilter = this.getMeetingTimeFilter(timeframe, startDate, endDate);

      const { results } = await this.hubspot.searchMeetings({
        data: {
          properties: [
            ...DEFAULT_MEETING_PROPERTIES,
            ...(this.additionalProperties || []),
          ],
          filterGroups: [
            {
              filters: [
                {
                  propertyName: "id",
                  operator: "IN",
                  values: meetingIds,
                },
                ...Object.entries(timeFilter)
                  .map(([
                    propertyName,
                    filterProps,
                  ]) => ({
                    propertyName,
                    ...filterProps,
                  })),
              ],
            },
          ],
          sorts: [
            {
              propertyName: "hs_meeting_start_time",
              direction: "DESCENDING",
            },
          ],
          limit: mostRecent
            ? 1
            : 100,
        },
      });

      return results;
    },
  },
  async run({ $ }) {
    let resolvedObjectId = this.objectId;
    if (this.objectType === OBJECT_TYPE.CONTACT && this.objectId.includes("@")) {
      const { results } = await this.hubspot.searchCRM({
        object: OBJECT_TYPE.CONTACT,
        data: {
          filterGroups: [
            {
              filters: [
                {
                  propertyName: "email",
                  operator: "EQ",
                  value: this.objectId,
                },
              ],
            },
          ],
        },
      });
      if (!results?.length) {
        throw new Error(`No contact found with email: ${this.objectId}`);
      }
      resolvedObjectId = results[0].id;
    }

    const meetings = await this.getAssociatedMeetings({
      objectType: this.objectType,
      objectId: resolvedObjectId,
      timeframe: this.timeframe,
      startDate: this.startDate,
      endDate: this.endDate,
      mostRecent: this.mostRecent,
    });

    const summary = this.mostRecent
      ? "Successfully retrieved most recent meeting"
      : `Successfully retrieved ${meetings.length} meeting(s)`;

    $.export("$summary", summary);

    return meetings;
  },
};
