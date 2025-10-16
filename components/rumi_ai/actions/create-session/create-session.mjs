import { ConfigurationError } from "@pipedream/platform";
import app from "../../rumi_ai.app.mjs";

export default {
  key: "rumi_ai-create-session",
  name: "Create Session",
  description: "Create a new session/meeting. [See the documentation](https://rumiai.notion.site/Rumi-Public-API-Authentication-02055b7286874bd7b355862f1abe48d9)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    sessionTitle: {
      propDefinition: [
        app,
        "sessionTitle",
      ],
    },
    about: {
      description: "A brief description of the session.",
      propDefinition: [
        app,
        "about",
      ],
    },
    startDateTime: {
      propDefinition: [
        app,
        "startDateTime",
      ],
    },
    endDateTime: {
      propDefinition: [
        app,
        "endDateTime",
      ],
    },
    enableRecording: {
      propDefinition: [
        app,
        "enableRecording",
      ],
    },
    summaAI: {
      propDefinition: [
        app,
        "summaAI",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      sessionTitle,
      about,
      startDateTime,
      endDateTime,
      enableRecording,
      summaAI,
    } = this;

    const startDateTimeObj = new Date(startDateTime);
    const endDateTimeObj = new Date(endDateTime);

    if (isNaN(startDateTimeObj.getTime())) {
      throw new ConfigurationError("Invalid **Start Date Time** provided");
    }
    if (isNaN(endDateTimeObj.getTime())) {
      throw new ConfigurationError("Invalid **End Date Time** provided");
    }
    if (endDateTimeObj <= startDateTimeObj) {
      throw new ConfigurationError("**End Date Time** must be after **Start Date Time**");
    }

    const startTimestamp = Math.floor(startDateTimeObj.getTime() / 1000);
    const endTimestamp = Math.floor(endDateTimeObj.getTime() / 1000);

    const response = await app.createSession({
      $,
      data: {
        sessionTitle,
        about,
        dataVisibility: "team-visible",
        accessStatus: "unlocked",
        startTimestamp,
        endTimestamp,
        sessionSettings: {
          enableRecording,
          summaAI,
          preferredLanguages: [
            "en-US",
          ],
          recurring: 0,
          postSessionSummaries: {
            recipients: {
              email: "everyone",
            },
          },
        },
      },
    });

    $.export("$summary", `Successfully created session: ${sessionTitle}`);
    return response;
  },
};
