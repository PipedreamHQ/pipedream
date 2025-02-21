export default {
  LIST_VIDEOS_USE_CASES: [
    {
      label: "By Video ID",
      value: "id",
    },
    {
      label: "Most Popular Videos",
      value: "chart",
    },
    {
      label: "My Liked Videos",
      value: "myRating",
    },
  ],
  LIST_VIDEOS_MY_RATING_OPTS: [
    "like",
    "dislike",
  ],
  LIST_VIDEOS_PART_OPTS: [
    "contentDetails",
    "fileDetails",
    "id",
    "liveStreamingDetails",
    "localizations",
    "player",
    "processingDetails",
    "recordingDetails",
    "snippet",
    "statistics",
    "status",
    "suggestions",
    "topicDetails",
  ],
  LIST_PLAYLISTS_USE_CASE: [
    {
      label: "By Playlist ID",
      value: "id",
    },
    {
      label: "All Playlists for a Channel",
      value: "channelId",
    },
    {
      label: "My Playlists",
      value: "mine",
    },
  ],
  LIST_PLAYLISTS_PART_OPTS: [
    "contentDetails",
    "id",
    "localizations",
    "player",
    "snippet",
    "status",
  ],
  LIST_CHANNEL_STATISTICS_USE_CASES: [
    {
      label: "By Channel ID",
      value: "id",
    },
    {
      label: "My Channels",
      value: "mine",
    },
    {
      label: "Managed by Me (exclusively for YouTube content partners)",
      value: "managedByMe",
    },
  ],
  LIST_CHANNEL_STATISTICS_PART: [
    "brandingSettings",
    "contentDetails",
    "contentOwnerDetails",
    "id",
    "localizations",
    "snippet",
    "statistics",
    "status",
    "topicDetails",
  ],
  LIST_ACTIVITIES_USE_CASES: [
    {
      label: "By Channel ID",
      value: "channelId",
    },
    {
      label: "My Activities",
      value: "mine",
    },
  ],
  LIST_ACTIVITIES_PART: [
    "id",
    "snippet",
    "contentDetails",
  ],
  UPDATE_PLAYLIST_PART: [
    "id",
    "snippet",
    "status",
  ],
  UPDATE_PLAYLIST_PRIVACY_STATUS_OPTS: [
    "private",
    "public",
    "unlisted",
  ],
  LIST_PLAYLIST_ITEMS_PART: [
    "id",
    "snippet",
    "contentDetails",
    "status",
  ],
  LIST_COMMENT_THREAD_PART: [
    "id",
    "replies",
    "snippet",
  ],
  VIDEO_DURATIONS: [
    {
      label: "Do not filter video search results based on their duration. This is the default value.",
      value: "any",
    },
    {
      label: "Only include videos longer than 20 minutes",
      value: "long",
    },
    {
      label: "Only include videos that are between four and 20 minutes long (inclusive)",
      value: "medium",
    },
    {
      label: "Only include videos that are less than four minutes long",
      value: "short",
    },
  ],
  VIDEO_SORT_ORDER: [
    "date",
    "rating",
    "relevance",
    "title",
    "viewCount",
  ],
  VIDEO_CAPTION_OPTIONS: [
    {
      label: "Do not filter results based on caption availability",
      value: "any",
    },
    {
      label: "Only include videos that have captions",
      value: "closedCaption",
    },
    {
      label: "Only include videos that do not have captions",
      value: "none",
    },
  ],
  VIDEO_DEFINITION: [
    "any",
    "high",
    "standard",
  ],
  VIDEO_LICENSE: [
    {
      label: "Return all videos",
      value: "any",
    },
    {
      label: "Only return videos that have a Creative Commons license. Users can reuse videos with this license in other videos that they create.",
      value: "creativeCommon",
    },
    {
      label: "Only return videos that have the standard YouTube license",
      value: "youtube",
    },
  ],
};
