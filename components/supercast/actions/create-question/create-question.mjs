import supercast from "../../supercast.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "supercast-create-question",
  name: "Create a Channel Question",
  description: "Creates a new channel question on Supercast. [See the documentation](https://supercast.readme.io/reference/postquestions)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    supercast,
    channelSubdomain: {
      propDefinition: [
        supercast,
        "channelSubdomain",
      ],
    },
    title: {
      propDefinition: [
        supercast,
        "title",
      ],
    },
    body: {
      propDefinition: [
        supercast,
        "body",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.supercast.createChannelQuestion({
      channelSubdomain: this.channelSubdomain,
      title: this.title,
      body: this.body,
    });

    $.export("$summary", `Created new question with title: ${this.title}`);
    return response;
  },
};
