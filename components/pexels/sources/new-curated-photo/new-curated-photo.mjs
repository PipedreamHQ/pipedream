import { axios } from "@pipedream/platform";
import pexels from "../../pexels.app.mjs";

export default {
  key: "pexels-new-curated-photo",
  name: "New Curated Photo",
  description: "Emit an event when a new curated photo is added to the Pexels curated collection. [See the documentation](https://www.pexels.com/api/documentation/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    pexels,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 3600, // Poll every hour
      },
    },
  },
  hooks: {
    async deploy() {
      await this.emitNewCuratedPhotos();
    },
  },
  methods: {
    _getLastPhotoId() {
      return this.db.get("lastPhotoId");
    },
    _setLastPhotoId(photoId) {
      this.db.set("lastPhotoId", photoId);
    },
    async emitNewCuratedPhotos() {
      const photos = await this.pexels.getCuratedPhotos();
      const lastPhotoId = this._getLastPhotoId();

      for (const photo of photos) {
        if (photo.id === lastPhotoId) break;

        this.$emit(photo, {
          id: photo.id.toString(),
          summary: `New curated photo: ${photo.url}`,
          ts: new Date(photo.created_at || Date.now()).getTime(),
        });
      }

      if (photos.length > 0) {
        this._setLastPhotoId(photos[0].id);
      }
    },
  },
  async run() {
    await this.emitNewCuratedPhotos();
  },
};
