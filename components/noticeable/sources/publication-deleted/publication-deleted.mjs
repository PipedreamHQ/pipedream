import common from "../common/common.mjs";

export default {
  ...common,
  key: "noticeable-publication-deleted",
  name: "New Publication Deleted Event",
  description: "Emit new events when a new publication deleted. [See the docs](https://graphdoc.noticeable.io/publication.doc.html)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    projectId: {
      propDefinition: [
        common.props.app,
        "projectId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getConfig() {
      return {
        queryFnName: "getPublicationsQuery",
        resourceKey: "data.project.data.edges",
        cursorKey: "data.project.data.pageInfo.endCursor",
        compare: "delete",
        itemKey: "node",
        queryArgs: {
          projectId: this.projectId,
        },
      };
    },
    getSummary(item) {
      return `Publication deleted. ID(${item?.id})`;
    },
  },
};
