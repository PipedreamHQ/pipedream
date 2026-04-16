import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "palatine_speech",
  propDefinitions: {
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The unique identifier of the transcription task",
    },
    model: {
      type: "string",
      label: "Recognition Model",
      description: "The speech recognition model to use",
      options: [
        {
          label: "Palatine Large Highspeed",
          value: "palatine_large_highspeed",
        },
        {
          label: "Palatine Small",
          value: "palatine_small",
        },
      ],
      optional: true,
    },
    fastInference: {
      type: "boolean",
      label: "Fast Inference",
      description: "Enable accelerated inference for faster processing",
      optional: true,
    },
    fileFormat: {
      type: "string",
      label: "File Format",
      description: "The format for the downloaded transcription file",
      options: [
        "srt",
        "vtt",
        "txt",
        "csv",
        "xlsx",
      ],
    },
    responseFormat: {
      type: "string",
      label: "Response Format",
      description: "Format for the task status response",
      options: [
        "srt",
        "vtt",
      ],
      optional: true,
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
        ...opts,
      });
    },
    transcribeAudio(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/transcribe/do_transcribe",
        ...args,
      });
    },
    getTaskStatus({
      taskId, ...args
    }) {
      return this._makeRequest({
        path: `/transcribe/task_status/${taskId}`,
        ...args,
      });
    },
    downloadTranscription({
      taskId, ...args
    }) {
      return this._makeRequest({
        path: `/transcribe/download_as_file/${taskId}`,
        ...args,
      });
    },
    markTaskDone({
      taskId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/transcribe/task_done/${taskId}`,
        ...args,
      });
    },
  },
};
