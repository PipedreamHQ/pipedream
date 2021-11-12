import typeform from "../../typeform.app.mjs";
import common from "../common.mjs";

export default {
  key: "typeform-list-responses",
  name: "List Responses",
  description: "Returns form responses and date and time of form landing and submission. [See the docs here](https://developer.typeform.com/responses/reference/retrieve-responses/)",
  type: "action",
  version: "0.0.1",
  methods: common.methods,
  props: {
    typeform,
    formId: {
      propDefinition: [
        typeform,
        "formId",
      ],
    },
    pageSize: {
      propDefinition: [
        typeform,
        "pageSize",
      ],
    },
    since: {
      propDefinition: [
        typeform,
        "since",
      ],
    },
    until: {
      propDefinition: [
        typeform,
        "until",
      ],
    },
    after: {
      propDefinition: [
        typeform,
        "after",
      ],
    },
    before: {
      propDefinition: [
        typeform,
        "before",
      ],
    },
    includedResponseIds: {
      type: "string[]",
      label: "Included response IDs",
      description: "Limit request to the specified `response_id` values. Use a comma-separated list to specify more than one `response_id` value. Please bear in mind that if you set a list of included response ids you won't be able to use the list of excluded response ids",
      optional: true,
      propDefinition: [
        typeform,
        "responseId",
        ({
          page, formId,
        }) => ({
          page,
          formId,
        }),
      ],
    },
    excludedResponseIds: {
      type: "string[]",
      label: "Excluded response IDs",
      description: "Comma-separated list of `response_ids` to be excluded from the response. Please bear in mind that if you set a list of excluded response ids you won't be able to use the list of included response ids",
      optional: true,
      propDefinition: [
        typeform,
        "responseId",
        ({
          page, formId,
        }) => ({
          page,
          formId,
        }),
      ],
    },
    completed: {
      type: "boolean",
      label: "Completed",
      description: "Limit responses only to those which were submitted. This parameter changes `since/until` filter, so if `completed=true`, it will filter by `submitted_at`, otherwise - `landed_at`.",
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Responses order in `{fieldID},{asc|desc}` format. You can use built-in `submitted_at/landed_at` field IDs or any field ID from your typeform, possible directions are `asc/desc`. Default value is `submitted_at,desc`.",
      optional: true,
      default: "submitted_at,desc",
    },
    query: {
      optional: true,
      propDefinition: [
        typeform,
        "query",
      ],
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Show only specified fields in answers section. If response does not have answers for specified fields, there will be `null`. Use a comma-separated list to specify more than one field value.",
      optional: true,
      propDefinition: [
        typeform,
        "field",
        ({ formId }) => ({
          formId,
        }),
      ],
    },
    answeredFields: {
      type: "string[]",
      label: "Answered fields",
      description: "Limit request to only responses that include the specified fields in answers section. Use a comma-separated list to specify more than one field value - response will contain at least one of the specified fields.",
      optional: true,
      propDefinition: [
        typeform,
        "field",
        ({ formId }) => ({
          formId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      formId,
      pageSize,
      since,
      until,
      after,
      before,
      includedResponseIds,
      excludedResponseIds,
      completed,
      sort,
      query,
      fields,
      answeredFields,
    } = this;

    const params = {
      page_size: pageSize,
      since,
      until,
      after,
      before,
      included_response_ids: includedResponseIds?.join(","),
      excluded_response_ids: excludedResponseIds?.join(","),
      completed,
      sort,
      query,
      fields: fields?.join(","),
      answered_fields: answeredFields?.join(","),
    };

    try {
      const { items } = await this.typeform.getResponses({
        $,
        formId,
        params,
      });

      return items;

    } catch (error) {
      throw new Error(error);
    }
  },
};
