import app from "../../postpulse.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "postpulse-upload-media-from-url",
  name: "Upload Media From URL",
  description: "Import an image or video from a public URL into PostPulse and wait until it is ready. Returns the media `path` to pass to **Create Post**. [See the documentation](https://post-pulse.com/api-docs#media-upload)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    url: {
      type: "string",
      label: "Media URL",
      description: "Public URL of the image or video to import, e.g. `https://example.com/videos/launch.mp4`",
    },
    filenameHint: {
      type: "string",
      label: "Filename Hint",
      description: "File name to store the media under, e.g. `launch.mp4`. Defaults to the name in the URL",
      optional: true,
    },
  },
  async run({ $ }) {
    const { id: importId } = await this.app.importMedia({
      $,
      data: {
        url: this.url,
        filenameHint: this.filenameHint,
      },
    });

    for (let attempt = 0; attempt < constants.MEDIA_IMPORT_MAX_ATTEMPTS; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, constants.MEDIA_IMPORT_POLL_INTERVAL_MS));
      const mediaImport = await this.app.getMediaImport({
        $,
        importId,
      });
      if (mediaImport.state === "READY") {
        $.export("$summary", `Imported media ${mediaImport.s3Key}`);
        return {
          importId,
          path: mediaImport.s3Key,
        };
      }
      // FAILED_TEMPORARY is retried by PostPulse, so only FAILED_PERMANENT ends the wait
      if (mediaImport.state === "FAILED_PERMANENT") {
        throw new Error(`Media import ${importId} failed: ${mediaImport.errorMessage || mediaImport.errorCode || mediaImport.state}`);
      }
    }

    throw new Error(`Media import ${importId} is not ready after ${constants.MEDIA_IMPORT_MAX_ATTEMPTS * constants.MEDIA_IMPORT_POLL_INTERVAL_MS / 1000} seconds`);
  },
};
