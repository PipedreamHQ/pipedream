import constants from "../../common/constants.mjs";
import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "anility-pipedrive-get-activities",
  name: "Get Activities (Anility)",
  description:
    "Activities are appointments/tasks/events on a calendar that can be associated with a deal, a lead, a person and an organization. Activities can be of different type (such as call, meeting, lunch or a custom type - see ActivityTypes object) and can be assigned to a particular user. Note that activities can also be created without a specific date/time. See the Pipedrive API docs [here](https://developers.pipedrive.com/docs/api/v1/Activities#getActivities)",
  version: "0.0.19",
  type: "action",
  props: {
    pipedriveApp,
    dealCustomFieldId: {
      propDefinition: [
        pipedriveApp,
        "dealCustomFieldId",
      ],
    },
    anilityIdFieldValue: {
      type: "string",
      label: "AnilityId field value",
      description: "Anility Id custom field value in Pipedrive",
    },
    userId: {
      propDefinition: [
        pipedriveApp,
        "userId",
      ],
      default: 0,
    },
    activityFilterId: {
      propDefinition: [
        pipedriveApp,
        "activityFilterId",
      ],
      description: "Caution: This filter will be updated with new conditions!",
      optional: false,
    },
    start: {
      propDefinition: [
        pipedriveApp,
        "start",
      ],
    },
    limit: {
      propDefinition: [
        pipedriveApp,
        "limit",
      ],
    },
  },

  methods: {
    getConditions({
      fieldId, value, additionalConditions = [],
    } = {}) {
      return {
        glue: "and",
        conditions: [
          {
            glue: "or",
            conditions: [],
          },
          {
            glue: "or",
            conditions: additionalConditions,
          },
          {
            glue: "and",
            conditions: [
              {
                object: constants.EVENT_OBJECT.DEAL,
                field_id: fieldId,
                operator: ">",
                value,
                extra_value: null,
              },
            ],
          },
        ],
      };
    },
    getFilterArgs({
      fieldId, value = "3_months_ago",
    } = {}) {
      return {
        type: constants.FILTER_TYPE.ACTIVITY,
        name: "Pipedream: Activities done during specific period",
        conditions: this.getConditions({
          fieldId,
          value,
          additionalConditions: [
            {
              object: constants.EVENT_OBJECT.DEAL,
              field_id: "8",
              operator: "=",
              value: "2",
              extra_value: null,
            },
            {
              object: constants.EVENT_OBJECT.DEAL,
              field_id: "8",
              operator: "=",
              value: "3",
              extra_value: null,
            },
            {
              object: constants.EVENT_OBJECT.DEAL,
              field_id: "8",
              operator: "=",
              value: "4",
              extra_value: null,
            },
          ],
        }),
      };
    },
  },
  async run({ $ }) {
    const {
      userId, activityFilterId, start, limit,
    } = this;

    try {
      //const filter = await this.pipedriveApp.getFilter(activityFilterId);

      const args = this.getFilterArgs({
        filterId: activityFilterId,
      });

      // await this.app.updateFilter({
      //   filterId: activityFilterId,
      //   ...args,
      // });
      const resp = await this.pipedriveApp.getActivities({
        userId,
        filterId: activityFilterId,
        start,
        limit,
      });

      $.export(
        "$summary",
        `Successfully found ${resp.data?.length || 0} activities`,
      );

      return args;
    } catch (error) {
      console.error(error.context?.body || error);
      throw error.context?.body?.error || "Failed to get activities";
    }
  },
};
