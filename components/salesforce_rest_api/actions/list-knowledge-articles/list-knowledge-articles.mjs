// x-pd-ai: optimized
import salesforce from "../../salesforce_rest_api.app.mjs";
import constants from "../../common/constants.mjs";
import {
  buildFieldList, truncationNote,
} from "../../common/soql.mjs";

export default {
  key: "salesforce_rest_api-list-knowledge-articles",
  name: "List Knowledge Articles",
  description: "List Salesforce Knowledge articles, newest first."
    + " Returns the article container records (`KnowledgeArticle`), not the published article bodies - use **Get Knowledge Articles** to read article content, and **List Knowledge Data Category Groups** to discover the categories articles are filed under."
    + " This can return a lot of records on a mature org, so set `Limit`."
    + " [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_knowledgearticle.htm)",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    salesforce,
    fields: {
      propDefinition: [
        salesforce,
        "fieldsToObtain",
        () => ({
          objType: constants.OBJECT_TYPE.KNOWLEDGE_ARTICLE,
        }),
      ],
      label: "Fields",
      description: "The KnowledgeArticle fields to return. Defaults to every field on the object. `Id` is always returned.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: `The maximum number of articles to return. Valid values are integers from 1 through ${constants.MAX_LIMIT}. Omit to return every article Salesforce sends in one batch.`,
      min: 1,
      max: constants.MAX_LIMIT,
      optional: true,
    },
  },
  async run({ $ }) {
    const allFields = (await this.salesforce
      .getFieldsForObjectType(constants.OBJECT_TYPE.KNOWLEDGE_ARTICLE))
      .map(({ name }) => name);
    const fields = buildFieldList(this.fields, allFields);

    let query = `SELECT ${fields.join(", ")} FROM ${constants.OBJECT_TYPE.KNOWLEDGE_ARTICLE}`
      + " ORDER BY CreatedDate DESC, Id DESC";
    if (this.limit) {
      query += ` LIMIT ${this.limit}`;
    }

    const response = await this.salesforce.query({
      $,
      query,
    });
    const { records } = response;
    $.export("$summary", `Successfully retrieved ${records.length} knowledge article${records.length === 1
      ? ""
      : "s"}.${truncationNote(response, records.length)}`);
    return records;
  },
};
