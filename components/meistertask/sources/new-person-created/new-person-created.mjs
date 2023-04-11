import common from "../common/base.mjs";

export default {
  ...common,
  key: "meister-new-person-created",
  name: "New Person Created",
  description: "Emit new event when a new person is created. [See the docs](https://developers.meistertask.com/reference/get-persons)",
  version: "0.0.1",
  type: "source",
  props: {
    ...common.props,
    projectId: {
      propDefinition: [
        common.props.meistertask,
        "projectId",
      ],
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.projectId
        ? this.meistertask.listProjectPersons
        : this.meistertask.listPersons;
    },
    getArgs() {
      const params = {
        sort: "-created_at",
      };
      return this.projectId
        ? {
          projectId: this.projectId,
          params,
        }
        : {
          params,
        };
    },
    generateMeta(person) {
      return {
        id: person.id,
        summary: person.email,
        ts: Date.parse(person.created_at),
      };
    },
  },
};
