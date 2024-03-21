import vimeo from "../../vimeo.app.mjs";

export default {
  key: "vimeo-new-video-by-search",
  name: "New Video by Search",
  description: "Emits an event each time a new video matching the search terms is added.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    vimeo,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    searchTerm: {
      propDefinition: [
        vimeo,
        "searchTerm",
      ],
    },
  },
  methods: {
    generateMeta(video) {
      const {
        id, name, created_time,
      } = video;
      return {
        id,
        summary: name,
        ts: new Date(created_time).getTime(),
      };
    },
    _getPrevSearchResults() {
      return this.db.get("prevSearchResults") ?? [];
    },
    _setPrevSearchResults(results) {
      this.db.set("prevSearchResults", results);
    },
  },
  async run() {
    // Fetch the latest videos
    const searchResults = await this.vimeo.searchVideos(this.searchTerm);

    // Get the previous search results
    const prevSearchResults = this._getPrevSearchResults();

    // Find the new videos
    const newVideos = searchResults.data.filter((video) => !prevSearchResults.includes(video.uri));

    // Emit an event for each new video
    newVideos.forEach((video) => {
      const meta = this.generateMeta(video);
      this.$emit(video, meta);
    });

    // Store the latest search results
    this._setPrevSearchResults(searchResults.data.map((video) => video.uri));
  },
};
