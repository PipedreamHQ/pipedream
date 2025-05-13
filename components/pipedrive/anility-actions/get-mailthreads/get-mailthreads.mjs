import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "anility-pipedrive-get-mail-threads",
  name: "Get Mail Threads (Anility)",
  description:
    "Returns mail threads in a specified folder ordered by the most recent message within.",
  version: "0.0.2",
  type: "action",
  props: {
    pipedriveApp,
    folder: {
      type: "string",
      label: "The type of folder to fetch",
      description: "The type of folder to fetch (inbox, sent, drafts, archive)",
    },
    start: {
      propDefinition: [
        pipedriveApp,
        "start",
      ],
    },
    limit: {
      propDefinition: [
        pipedriveApp,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const {
      folder, start, limit,
    } = this;

    const person = await this.pipedriveApp.getMailThreads(folder, {
      start: start,
      limit: limit,
    });

    try {
      $.export("$summary", `Successfully found mail threads in ${folder}`);

      return person;
    } catch (error) {
      console.error(error.context?.body || error);
      throw error.context?.body?.error || "Failed to get mail threads";
    }
  },
};
