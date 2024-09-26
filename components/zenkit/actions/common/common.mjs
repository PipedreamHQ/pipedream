import zenkit from "../../zenkit.app.mjs";

export default {
  props: {
    zenkit,
    workspaceId: {
      propDefinition: [
        zenkit,
        "workspaceId",
      ],
    },
  },
  methods: {
    async getListElementProps(listId) {
      const props = {};
      const elements = await this.zenkit.getListElements({
        listId,
      });
      for (const element of elements) {
        const businessDataKeys = Object.keys(element.businessData);
        for (const key of businessDataKeys) {
          props[`${element.uuid}_${key}`] = {
            type: "any",
            label: `${element.name} ${key}`,
            optional: true,
          };
        }
      }
      return props;
    },
  },
};
