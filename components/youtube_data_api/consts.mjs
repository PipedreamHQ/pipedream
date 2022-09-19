export default {
  LIST_VIDEOS_USE_CASES: [
    {
      label: "By video id",
      value: "id",
    },
    {
      label: "Most popular videos",
      value: "chart",
    },
    {
      label: "My liked videos",
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
      label: "By playlist id",
      value: "id",
    },
    {
      label: "All playlists for a channel",
      value: "channelId",
    },
    {
      label: "My playlists",
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
      label: "By channel id",
      value: "id",
    },
    {
      label: "My channels",
      value: "mine",
    },
    {
      label: "Managed by me",
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
      label: "By channel id",
      value: "channelId",
    },
    {
      label: "My activities",
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
};
