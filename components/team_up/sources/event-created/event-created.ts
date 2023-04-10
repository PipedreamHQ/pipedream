import { defineSource } from "@pipedream/types";
import { DOCS_LINK } from "../../actions/list-events/list-events";
import { EventTimestamps } from "../../common/responseSchemas";
import common from "../common";

export default defineSource({
  ...common,
  key: "team_up-event-created",
  name: "Event Created",
  description: `Emit new event when an event is created [See docs here](${DOCS_LINK})`,
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getEntityName(): string {
      return "created";
    },
    getFilterField(): keyof EventTimestamps {
      return "creation_dt";
    },
  },
});
