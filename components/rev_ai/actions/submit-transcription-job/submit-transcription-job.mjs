// legacy_hash_id: a_NqiqvY
import { axios } from "@pipedream/platform";

export default {
  key: "rev_ai-submit-transcription-job",
  name: "Submit Transcription Job",
  description: "Starts an asynchronous job to transcribe speech-to-text for a media file. Add an optional callback URL to invoke when processing is complete.",
  version: "0.1.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    rev_ai: {
      type: "app",
      app: "rev_ai",
    },
    media_url: {
      type: "string",
      description: "Direct download media url. Ignored if submitting job from file",
    },
    skip_diarization: {
      type: "boolean",
      description: "Specify if speaker diarization will be skipped by the speech engine",
      optional: true,
    },
    skip_punctuation: {
      type: "boolean",
      description: "Specify if \"punct\" type elements will be skipped by the speech engine. For JSON outputs, this includes removing spaces. For text outputs, words will still be delimited by a space",
      optional: true,
    },
    remove_disfluencies: {
      type: "boolean",
      description: "Currently we only define disfluencies as 'ums' and 'uhs'. When set to true, disfluencies will be not appear in the transcript.",
      optional: true,
    },
    filter_profanity: {
      type: "boolean",
      description: "Enabling this option will filter for approx. 600 profanities, which cover most use cases. If a transcribed word matches a word on this list, then all the characters of that word will be replaced by asterisks except for the first and last character.",
      optional: true,
    },
    speaker_channels_count: {
      type: "integer",
      description: "Use to specify the total number of unique speaker channels in the audio.\n\nGiven the number of audio channels provided, each channel will be transcribed separately and the channel id assigned to the speaker label. The final output will be a combination of all individual channel outputs. Overlapping monologues will have ordering broken by the order in which the first spoken element of each monologue occurs. If speaker_channels_count is greater than the actual channels in the audio, the job will fail with invalid_media.\n\nNote:\n\nThe amount charged will be the duration of the file multiplied by the number of channels specified.\nWhen using speaker_channels_count each channel will be diarized as one speaker, and the value of skip_diarization will be ignored if provided",
      optional: true,
    },
    delete_after_seconds: {
      type: "integer",
      description: "Specify the number of seconds after job completion when job is auto-deleted. It may take up to 2 minutes after the scheduled time for the job to be deleted. The number of seconds provided must range from `0` seconds to `2592000` seconds (30 days).",
      optional: true,
    },
    metadata: {
      type: "string",
      description: "Optional metadata that was provided during submission",
      optional: true,
    },
    callback_url: {
      type: "string",
      description: "Optional callback url to invoke when processing is complete",
      optional: true,
    },
    phrases: {
      type: "any",
      description: "Array of phrases not found in normal dictionary. Add technical jargon, proper nouns and uncommon phrases as strings in this array to add them to the lexicon for this job.\n\nA phrase must contain at least 1 alpha character but may contain any non-numeric character from the Basic Latin set. A phrase can contain up to 12 words. Each word can contain up to 34 characters.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      "media_url": this.media_url,
      "skip_diarization": this.skip_diarization,
      "skip_punctuation": this.skip_punctuation,
      "remove_disfluencies": this.remove_disfluencies,
      "filter_profanity": this.filter_profanity,
      "speaker_channels_count": this.speaker_channels_count,
      "delete_after_seconds": this.delete_after_seconds,
      "metadata": this.metadata,
      "callback_url": this.callback_url,
    };

    if (this.phrases) {
      data.phrases = {
        "custom_vocabularies": [
          {
            "phrases": this.phrases,
          },
        ],
      };
    }

    return await axios($, {
      url: "https://api.rev.ai/speechtotext/v1/jobs",
      method: "post",
      headers: {
        Authorization: `Bearer ${this.rev_ai.$auth.access_token}`,
      },
      data,
    });
  },
};
