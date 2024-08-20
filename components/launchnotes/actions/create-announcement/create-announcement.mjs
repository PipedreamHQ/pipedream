import launchnotes from "../../launchnotes.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "launchnotes-create-announcement",
  name: "Create Announcement",
  description: "Generates a draft announcement for the LaunchNotes project. [See the documentation](https://developer.launchnotes.com/index.html)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    launchnotes,
    title: {
      type: "string",
      label: "Title",
      description: "The title of the announcement",
    },
    text: {
      type: "string",
      label: "Text",
      description: "The body text of the announcement",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.launchnotes.generateDraftAnnouncement({
      title: this.title,
      text: this.text,
    });
    $.export("$summary", `Successfully created draft announcement with title: ${this.title}`);
    return response;
  },
};
