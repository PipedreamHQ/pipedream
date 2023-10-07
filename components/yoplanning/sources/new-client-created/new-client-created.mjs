import common from "../common/polling.mjs";
import utils from "../../common/utils.mjs";

export default {
  ...common,
  key: "yoplanning-new-client-created",
  name: "New Client Created",
  description: "Triggers when a new client is created. [See the documentation](https://yoplanning.pro/api/v3.1/swagger/)",
  type: "source",
  version: "0.0.4",
  dedupe: "unique",
  props: {
    ...common.props,
    teamId: {
      propDefinition: [
        common.props.app,
        "teamId",
      ],
    },
  },
  methods: {
    ...common.methods,
    ordering(resources) {
      return utils.sortArrayByDate(resources, "-last_update");
    },
    getResourceFn() {
      return this.app.listClients;
    },
    getResourceFnArgs() {
      return {
        teamId: this.teamId,
        params: {
          ordering: "-last_update",
          last_update__gt: this.getLastUpdate(),
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Client: ${resource.id}`,
        ts: Date.now(),
      };
    },
  },
};
