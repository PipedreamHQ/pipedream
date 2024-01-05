import constants from "../../common/constants.mjs";
import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "anility-pipedrive-get-activities",
  name: "Get Activities (Anility)",
  description:
    "Activities are appointments/tasks/events on a calendar that can be associated with a deal, a lead, a person and an organization. Activities can be of different type (such as call, meeting, lunch or a custom type - see ActivityTypes object) and can be assigned to a particular user. Note that activities can also be created without a specific date/time. See the Pipedrive API docs [here](https://developers.pipedrive.com/docs/api/v1/Activities#getActivities)",
  version: "0.0.26",
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
    getFieldsFn() {
      return this.pipedriveApp.getActivityFields;
    },
    getFieldKey() {
      return constants.FIELD.MARKED_AS_DONE_TIME;
    },
    async fetchFieldId() {
      const getFields = this.getFieldsFn();
      const { data: fields } = await getFields();
      const field = fields.find(({ key }) => key === this.getFieldKey());

      return field.id;
    },
    getConditions({
      fieldId, value, additionalConditions = [],
    } = {}) {
      return {
        glue: "and",
        conditions: [
          {
            glue: "or",
            conditions: additionalConditions,
          },
          {
            glue: "and",
            conditions: [
              {
                object: constants.EVENT_OBJECT.ACTIVITY,
                field_id: fieldId,
                operator: "=",
                value,
                extra_value: null,
              },
            ],
          },
        ],
      };
    },
    getFilterArgs({
      dealCustomFieldId,
      anilityIdFieldValue,
      fieldId,
      value = "later_or_today",
    } = {}) {
      return {
        type: constants.FILTER_TYPE.ACTIVITY,
        name: "Pipedream: Activities done during today or later",
        conditions: this.getConditions({
          fieldId,
          value,
          additionalConditions: [
            {
              object: constants.EVENT_OBJECT.DEAL,
              field_id: dealCustomFieldId,
              operator: "=",
              value: anilityIdFieldValue,
              extra_value: null,
            },
          ],
        }),
      };
    },
  },
  async run({ $ }) {
    const {
      userId,
      dealCustomFieldId,
      anilityIdFieldValue,
      activityFilterId,
      start,
      limit,
    } = this;

    try {
      const fieldId = await this.fetchFieldId();

      const args = this.getFilterArgs({
        dealCustomFieldId,
        anilityIdFieldValue,
        fieldId,
      });

      await this.pipedriveApp.updateFilter({
        filterId: activityFilterId,
        ...args,
      });
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

      return resp.data;
    } catch (error) {
      console.error(error.context?.body || error);
      throw error.context?.body?.error || "Failed to get activities";
    }
  },
};
