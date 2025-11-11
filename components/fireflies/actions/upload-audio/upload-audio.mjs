import fireflies from "../../fireflies.app.mjs";
import mutations from "../../common/mutations.mjs";

export default {
  key: "fireflies-upload-audio",
  name: "Upload Audio",
  description: "Creates and stores a new meeting in Fireflies, allowing it to be transcribed and shared. [See the documentation](https://docs.fireflies.ai/graphql-api/mutation/upload-audio)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    fireflies,
    url: {
      type: "string",
      label: "URL",
      description: "The url of media file to be transcribed. It MUST be a valid https string and publicly accessible to enable us download the audio / video file. Double check to see if the media file is downloadable and that the link is not a preview link before making the request. The media file must be either of these formats - mp3, mp4, wav, m4a, ogg",
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title or name of the meeting, this will be used to identify the transcribed file",
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "The URL we should send webhooks to when your transcript is complete",
      optional: true,
    },
    callbackWithRerun: {
      type: "boolean",
      label: "Callback With Rerun",
      description: "Use the `$.flow.rerun` Node.js helper to rerun the step when the transcription is completed. Overrides the `webhookUrl` prop. This will increase execution time and credit usage as a result. [See the documentation(https://pipedream.com/docs/code/nodejs/rerun/#flow-rerun). Not available in Pipedream Connect.",
      optional: true,
    },
  },
  async run({ $ }) {
    let response;
    const context = $.context;
    const run = context
      ? context.run
      : {
        runs: 1,
      };
    if (run.runs === 1) {
      let webhookUrl  = this.webhookUrl;
      if (context && this.callbackWithRerun) {
        ({ resume_url: webhookUrl } = $.flow.rerun(600000, null, 1));
      }
      response = await this.fireflies.query({
        $,
        data: {
          query: mutations.uploadAudio,
          variables: {
            input: {
              url: this.url,
              title: this.title,
              webhook: webhookUrl,
            },
          },
        },
      });
    }
    if (run.runs > 1) {
      response = run.callback_request.body;
    }
    $.export("$summary", "Successfully created and stored a new meeting");
    return response;
  },
};
