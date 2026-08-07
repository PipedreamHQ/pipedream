// x-pd-ai: optimized
import fireflies from "../../fireflies.app.mjs";
import mutations from "../../common/mutations.mjs";
import constants from "../../common/constants.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "fireflies-create-meeting-clip",
  name: "Create Meeting Clip",
  description: "Create a clip (a Fireflies \"bite\") from a completed, already-transcribed meeting by specifying a start and end time in seconds. This is the action to use for past meetings — for a meeting that is still running, use **Create Live Meeting Soundbite** instead. To find the moment to clip, read the `sentences` array returned by **Find Meeting by ID**: each sentence carries its own `start_time` and `end_time` in seconds (e.g. `142.5`), so clipping around a quote means passing that sentence's start and end. Clip generation is asynchronous — the returned `status` begins at `pending` or `processing` and later reaches a terminal `ready` (the clip is available at the returned `preview` URL) or `error`. [See the documentation](https://docs.fireflies.ai/graphql-api/mutation/create-bite)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    fireflies,
    meetingId: {
      propDefinition: [
        fireflies,
        "meetingId",
      ],
      description: "The completed meeting to clip. A Fireflies meeting ID and transcript ID are the same value. Use **Find Meeting by ID** or **Find Recent Meeting** to look up a meeting ID.",
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "Where the clip starts, in seconds from the beginning of the meeting, e.g. `142.5`. Fractional seconds are allowed. Copy the `start_time` of a sentence returned by **Find Meeting by ID** to clip around a specific quote.",
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "Where the clip ends, in seconds from the beginning of the meeting, e.g. `168.25`. Must be greater than `Start Time`.",
    },
    name: {
      type: "string",
      label: "Name",
      description: `A title for the clip, e.g. \`Pricing objection\`. Max ${constants.MAX_BITE_NAME_LENGTH} characters.`,
      optional: true,
    },
    mediaType: {
      type: "string",
      label: "Media Type",
      description: "Whether to produce a video or audio clip. A video clip is only possible if the meeting itself was recorded with video.",
      optional: true,
      options: constants.BITE_MEDIA_TYPE_OPTIONS,
    },
    privacies: {
      type: "string[]",
      label: "Privacies",
      description: "Who can view the clip. `public` is viewable by anyone with the link, `team` by your Fireflies team, and `participants` by the meeting's attendees.",
      optional: true,
      options: constants.BITE_PRIVACY_OPTIONS,
    },
    summary: {
      type: "string",
      label: "Summary",
      description: `A short description of what the clip contains, e.g. \`Customer pushes back on the enterprise tier price\`. Max ${constants.MAX_BITE_SUMMARY_LENGTH} characters.`,
      optional: true,
    },
  },
  async run({ $ }) {
    const startTime = parseFloat(this.startTime);
    const endTime = parseFloat(this.endTime);

    if (Number.isNaN(startTime) || Number.isNaN(endTime)) {
      throw new ConfigurationError("Start Time and End Time must be numbers of seconds, e.g. `142.5`.");
    }
    if (startTime < 0) {
      throw new ConfigurationError("Start Time cannot be negative.");
    }
    if (endTime <= startTime) {
      throw new ConfigurationError("End Time must be greater than Start Time.");
    }
    if (this.name?.length > constants.MAX_BITE_NAME_LENGTH) {
      throw new ConfigurationError(`Name must be ${constants.MAX_BITE_NAME_LENGTH} characters or fewer.`);
    }
    if (this.summary?.length > constants.MAX_BITE_SUMMARY_LENGTH) {
      throw new ConfigurationError(`Summary must be ${constants.MAX_BITE_SUMMARY_LENGTH} characters or fewer.`);
    }

    const { data: { createBite } } = await this.fireflies.query({
      $,
      data: {
        query: mutations.createBite,
        variables: {
          transcriptId: this.meetingId,
          startTime,
          endTime,
          name: this.name,
          mediaType: this.mediaType,
          privacies: this.privacies,
          summary: this.summary,
        },
      },
    });

    $.export("$summary", `Created clip ${createBite.id} from meeting ${this.meetingId} (${startTime}s–${endTime}s), status: ${createBite.status}`);
    return createBite;
  },
};
