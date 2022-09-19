import doWrapperModule from "do-wrapper";
import digitalOceanConstants from "./common/constants.mjs";

export default {
  type: "app",
  app: "digital_ocean",
  propDefinitions: {},
  methods: {
    digitalOceanWrapper(pageSize = digitalOceanConstants.defaultCurrentPage) {
      const DigitalOcean = doWrapperModule.default;
      const api = new DigitalOcean(this.$auth.oauth_access_token, pageSize);
      return api;
    },
    async fetchRegionsOpts() {
      const api = this.digitalOceanWrapper();
      const regions = await api.regions.getAll(null, true);
      return regions
        .filter((region) => region.available)
        .map((region) => {
          return {
            label: region.name,
            value: region.slug,
          };
        });
    },
    async fetchImageOpts(region) {
      const api = this.digitalOceanWrapper();
      const images = await api.images.getAll(null, true);
      return images
        .filter((image) => image.status === "available")
        .filter((image) => image.regions.includes(region))
        .map((image) => {
          return {
            label: `${image.distribution} - ${image.name}`,
            value: image.slug || image.id,
          };
        });
    },
    async fetchSizeOpts(region) {
      const api = this.digitalOceanWrapper();
      const sizes = await api.sizes.get(null, true);
      return sizes
        .filter((size) => size.available)
        .filter((size) => size.regions.includes(region))
        .map((size) => {
          return {
            label: `${size.description} - ${size.slug}`,
            value: size.slug,
          };
        });
    },
    async fetchVolumeOpts(region) {
      const api = this.digitalOceanWrapper();
      const response = await api.volumes.getAll(region);
      return response.volumes.map((volume) => {
        return {
          label: `${volume.name} - ${volume.filesystem_type} - ${volume.size_gigabytes}GB`,
          value: volume.id,
        };
      });
    },
    async fetchSshKeys() {
      const api = this.digitalOceanWrapper();
      const keys = await api.keys.getAll(null, true);
      return keys.map((key) => {
        return {
          label: key.name,
          value: key.fingerprint,
        };
      });
    },
    async fetchDropletOps() {
      const api = this.digitalOceanWrapper();
      const droplets = await api.droplets.getAll(null, true);
      return droplets.map((droplet) => {
        return {
          label: droplet.name,
          value: droplet.id,
        };
      });
    },
  },
};
