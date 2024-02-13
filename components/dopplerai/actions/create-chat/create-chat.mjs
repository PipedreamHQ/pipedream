import dopplerai from "../../dopplerai.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "dopplerai-create-chat",
  name: "Create Chat",
  description: "Initializes a new chat thread. [See the documentation](https://api.dopplerai.com/docs/reference)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    dopplerai,
  },
  async run({ $ }) {
    const response = await this.dopplerai.initializeChat();
    $.export("$summary", "Successfully initialized a new chat thread");
    return response;
  },
};
