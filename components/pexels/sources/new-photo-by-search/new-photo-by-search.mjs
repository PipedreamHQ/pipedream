import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import pexels from "../../pexels.app.mjs";

export default {
  key: "pexels-new-photo-by-search",
  name: "New Photo by Search",
  description: "Emit new event when a photo is published that matches a specified search query. [See the documentation](https://www.pexels.com/api/documentation/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    pexels,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    searchQuery: {
      propDefinition: [
        pexels,
        "searchQuery",
      ],
    },
    orientation: {
      propDefinition: [
        pexels,
        "orientation",
      ],
    },
    color: {
      propDefinition: [
        pexels,
        "color",
      ],
    },
  },
  methods: {
    _getLastPhotoId() {
      return this.db.get("lastPhotoId");
    },
    _setLastPhotoId(id) {
      this.db.set("lastPhotoId", id);
    },
  },
  hooks: {
    async deploy() {
      const photos = await this.pexels.searchPhotos({
        query: this.searchQuery,
        orientation: this.orientation,
        color: this.color,
        per_page: 50,
      });

      if (!photos || photos.length === 0) {
        return;
      }

      const orderedPhotos = photos.reverse();
      for (const photo of orderedPhotos.slice(0, 50)) {
        this.$emit(photo, {
          id: photo.id,
          summary: `New photo: ${photo.photographer} - ${photo.src.original}`,
          ts: photo.created_at
            ? Date.parse(photo.created_at)
            : new Date().getTime(),
        });
      }

      this._setLastPhotoId(orderedPhotos[0].id);
    },
  },
  async run() {
    const lastPhotoId = this._getLastPhotoId();

    const photos = await this.pexels.searchPhotos({
      query: this.searchQuery,
      orientation: this.orientation,
      color: this.color,
      per_page: 50,
    });

    if (!photos || photos.length === 0) {
      return;
    }

    const newPhotos = [];
    for (const photo of photos.reverse()) {
      if (photo.id === lastPhotoId) break;
      newPhotos.unshift(photo);
    }

    for (const photo of newPhotos) {
      this.$emit(photo, {
        id: photo.id,
        summary: `New photo: ${photo.photographer} - ${photo.src.original}`,
        ts: photo.created_at
          ? Date.parse(photo.created_at)
          : new Date().getTime(),
      });
    }

    if (newPhotos.length > 0) {
      this._setLastPhotoId(newPhotos[0].id);
    }
  },
};
