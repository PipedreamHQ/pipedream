import {
  DEFAULT_LIMIT, OBJECT_TYPES,
} from "../../common/constants.mjs";
import common from "../common/common.mjs";

export default {
  ...common,
  key: "hubspot-new-note",
  name: "New Note Created",
  description: "Emit new event for each new note created. [See the documentation](https://developers.hubspot.com/docs/api-reference/legacy/crm/activities/notes/guide#retrieve-notes)",
  version: "1.0.28",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTs(note) {
      return Date.parse(note.createdAt);
    },
    generateMeta(note) {
      return {
        id: note.id,
        summary: `New Note: ${note.properties.hs_body_preview || note.id}`,
        ts: this.getTs(note),
      };
    },
    isRelevant(note, createdAfter) {
      return this.getTs(note) > createdAfter;
    },
    async getParams(after) {
      const { results: allProperties } = await this.hubspot.getProperties({
        objectType: "notes",
      });
      return this.addDateFilter({
        object: "notes",
        data: {
          limit: DEFAULT_LIMIT,
          properties: allProperties.map(({ name }) => name),
          sorts: [
            {
              propertyName: "hs_createdate",
              direction: "DESCENDING",
            },
          ],
        },
      }, "hs_createdate", after);
    },
    async getAssociationTypes() {
      const { results: custom } = await this.hubspot.listSchemas();
      return [
        ...OBJECT_TYPES.map(({ value }) => value),
        ...(custom?.map(({ fullyQualifiedName }) => fullyQualifiedName) || []),
      ];
    },
    async processResults(after, params) {
      const associationTypes = await this.getAssociationTypes();
      await this.paginate(
        params,
        async (opts) => {
          const page = await this.hubspot.searchCRM(opts);
          return {
            ...page,
            results: await this.withAssociations("notes", page.results || [], associationTypes),
          };
        },
        "results",
        after,
      );
    },
  },
};
