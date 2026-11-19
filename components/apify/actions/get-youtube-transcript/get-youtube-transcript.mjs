import { ConfigurationError } from "@pipedream/platform";
import apify from "../../apify.app.mjs";
import {
  buildActorInput,
  formatCount,
} from "../../common/utils.mjs";
import { runSyncGetDatasetItems } from "../../common/run-sync.mjs";

const YOUTUBE_TRANSCRIPT_ACTOR_ID = "vncntlabs~youtube-transcript-scraper";

export default {
  key: "apify-get-youtube-transcript",
  name: "Get YouTube Transcript",
  description: "Get the transcript, and optional caption lines with start and end times, for one or more YouTube videos. Pass video links or ids, search keywords, or a channel. Provide at least one of those. Videos with no captions are returned and are not charged. [See the documentation](https://apify.com/vncntlabs/youtube-transcript-scraper)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    apify,
    videos: {
      type: "string[]",
      label: "Videos",
      description: "Watch, youtu.be, Shorts, embed or live links, or bare 11-character video ids. One transcript row per video. e.g. `[\"https://www.youtube.com/watch?v=jNQXAC9IVRw\", \"https://youtu.be/dQw4w9WgXcQ\"]`.",
      optional: true,
    },
    keywords: {
      type: "string[]",
      label: "Keywords",
      description: "Get transcripts of the top YouTube search results for each keyword (up to 20 keywords). e.g. `[\"sourdough starter\"]`.",
      optional: true,
    },
    maxVideosPerKeyword: {
      type: "integer",
      label: "Videos per Keyword",
      description: "How many top search results to transcribe for each keyword. Used with `keywords`. e.g. `10`.",
      optional: true,
      default: 10,
    },
    excludeShorts: {
      type: "boolean",
      label: "Skip Shorts",
      description: "Leave YouTube Shorts out of keyword and channel results. e.g. `false`.",
      optional: true,
      default: false,
    },
    channels: {
      type: "string[]",
      label: "Channels",
      description: "YouTube channels as `@handle`, a channel link (`youtube.com/@name` or `/channel/UC...`) or a `UC...` channel id (up to 10). Videos are found through YouTube search for the channel, newest first, so a very large or very old back catalog may not be complete. e.g. `[\"@Google\"]`.",
      optional: true,
    },
    maxVideosPerChannel: {
      type: "integer",
      label: "Videos per Channel",
      description: "How many of each channel's videos to transcribe. Used with `channels`. e.g. `20`.",
      optional: true,
      default: 20,
    },
    channelSort: {
      type: "string",
      label: "Channel Videos Order",
      description: "Which of the channel's videos to take first. One of `newest`, `relevance`. e.g. `newest`.",
      optional: true,
      default: "newest",
      options: [
        {
          label: "Newest",
          value: "newest",
        },
        {
          label: "Relevance",
          value: "relevance",
        },
      ],
    },
    language: {
      type: "string",
      label: "Caption Language",
      description: "Language code of the caption track you want. Leave empty for the video's own language. If the video has no captions in that language you get a `no_captions` row, which is not charged. e.g. `en`, `es`, or `de`.",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Country for keyword searches, and the YouTube region captions are read from. Name or 2-letter code. e.g. `United States`, `GB`, or `Germany`.",
      optional: true,
      default: "United States",
    },
    includeSegments: {
      type: "boolean",
      label: "Include Timestamped Segments",
      description: "Add every caption line with `start`, `duration` and `end` in seconds. e.g. `true`.",
      optional: true,
      default: true,
    },
    includeTimestampedText: {
      type: "boolean",
      label: "Include Timestamped Text",
      description: "Add one text field with a `[mm:ss]` timestamp before every line. e.g. `false`.",
      optional: true,
      default: false,
    },
    fastMode: {
      type: "boolean",
      label: "Fast Mode",
      description: "Use the provider's priority queue. Standard is usually done within 1 to 2 minutes per 100 videos. Fast mode helps big batches that are close to the timeout. Fast-mode transcripts are charged as a separate event. e.g. `false`.",
      optional: true,
      default: false,
    },
    maxVideos: {
      type: "integer",
      label: "Maximum Videos",
      description: "Hard cap on videos processed per run (links and search results together). You are only charged for transcripts that are delivered. e.g. `100`.",
      optional: true,
      default: 100,
    },
  },
  async run({ $ }) {
    const hasVideos = Array.isArray(this.videos) && this.videos.length > 0;
    const hasKeywords = Array.isArray(this.keywords) && this.keywords.length > 0;
    const hasChannels = Array.isArray(this.channels) && this.channels.length > 0;

    if (!hasVideos && !hasKeywords && !hasChannels) {
      throw new ConfigurationError("Provide at least one video link or id, keyword, or channel.");
    }

    const input = buildActorInput({
      videos: this.videos,
      keywords: this.keywords,
      maxVideosPerKeyword: this.maxVideosPerKeyword,
      excludeShorts: this.excludeShorts,
      channels: this.channels,
      maxVideosPerChannel: this.maxVideosPerChannel,
      channelSort: this.channelSort,
      language: this.language,
      country: this.country,
      includeSegments: this.includeSegments,
      includeTimestampedText: this.includeTimestampedText,
      fastMode: this.fastMode,
      maxVideos: this.maxVideos,
    });
    const items = await runSyncGetDatasetItems(this.apify, {
      actorId: YOUTUBE_TRANSCRIPT_ACTOR_ID,
      input,
    });

    $.export(
      "$summary",
      `Successfully retrieved ${formatCount(items.length, "YouTube transcript result", "YouTube transcript results")}`,
    );
    return items;
  },
};
