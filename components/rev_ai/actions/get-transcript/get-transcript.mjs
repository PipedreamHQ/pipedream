// legacy_hash_id: a_3LiVkj
import { axios } from "@pipedream/platform";

export default {
  key: "rev_ai-get-transcript",
  name: "Get Transcript By Id",
  description: "Returns the transcript for a completed transcription job. Transcript can be returned as either JSON or plaintext format.",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    rev_ai: {
      type: "app",
      app: "rev_ai",
    },
    id: {
      type: "string",
      label: "Job ID",
    },
    accept: {
      type: "string",
      description: "MIME type specifying the transcription output format.",
      options: [
        "text/plain",
        "application/vnd.rev.transcript.v1.0+json",
      ],
    },
  },
  async run({ $ }) {
    return await axios($, {
      url: `https://api.rev.ai/speechtotext/v1/jobs/${this.id}/transcript`,
      headers: {
        Authorization: `Bearer ${this.rev_ai.$auth.access_token}`,
        Accept: this.accept,
      },
    });
  },
};
