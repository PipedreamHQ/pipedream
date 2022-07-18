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
};
