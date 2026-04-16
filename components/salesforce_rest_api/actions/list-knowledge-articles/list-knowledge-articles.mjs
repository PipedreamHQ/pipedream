import salesforce from "../../salesforce_rest_api.app.mjs";

export default {
  key: "salesforce_rest_api-list-knowledge-articles",
  name: "List Knowledge Articles",
  description: "Lists all knowledge articles. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_knowledgearticle.htm)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    salesforce,
  },
  async run({ $ }) {
    const fields = (await this.salesforce.getFieldsForObjectType("KnowledgeArticle")).map(({ name }) => name);
    const query = `SELECT ${fields.join(", ")} FROM KnowledgeArticle`;

    const { records } = await this.salesforce.query({
      $,
      query,
    });
    $.export("$summary", `Sucessfully retrieved ${records.length} knowledge articles`);
    return records;
  },
};
