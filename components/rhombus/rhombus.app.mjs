import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "rhombus",
  propDefinitions: {
    cameraUuid: {
      type: "string",
      label: "Camera ID",
      description: "The ID of a camera",
      async options() {
        const { cameras } = await this.listCameras();
        return cameras.map((camera) => ({
          label: camera.name,
          value: camera.uuid,
        }));
      },
    },
    doorUuid: {
      type: "string",
      label: "Access Controlled Door ID",
      description: "The ID of an access controlled door",
      async options() {
        const { accessControlledDoors } = await this.findAccessControlledDoors();
        return accessControlledDoors.map((door) => ({
          label: door.name,
          value: door.uuid,
        }));
      },
    },
    audioGatewayUuid: {
      type: "string",
      label: "Audio Gateway ID",
      description: "The ID of an audio gateway",
      async options() {
        const { audioGatewayStates } = await this.getMinimalAudioGatewayStateList();
        return audioGatewayStates.map((gateway) => ({
          label: gateway.name,
          value: gateway.uuid,
        }));
      },
    },
    audioUploadUuid: {
      type: "string",
      label: "Audio Upload ID",
      description: "The ID of an uploaded audio clip",
      async options() {
        const { audioUploadMetadata } = await this.getAudioUploadMetadataForOrg();
        return audioUploadMetadata.map((audio) => ({
          label: audio.displayName,
          value: audio.uuid,
        }));
      },
    },
    doorbellCameraUuid: {
      type: "string",
      label: "Doorbell Camera ID",
      description: "The ID of a doorbell camera",
      async options() {
        const { doorbellCameras } = await this.getMinimalDoorbellCameraStateList();
        return doorbellCameras.map((camera) => ({
          label: camera.name,
          value: camera.uuid,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api2.rhombussystems.com/api";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        method: "POST",
        url: `${this._baseUrl()}${path}`,
        headers: {
          "x-auth-apikey": `${this.$auth.api_token}`,
          "x-auth-scheme": "api-token",
          "content-type": "application/json",
        },
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        path: "/integrations/webhooks/subscribeZapierWebhook",
        ...opts,
      });
    },
    deleteWebhook(opts = {}) {
      return this._makeRequest({
        path: "/integrations/webhooks/unsubscribeZapierWebhook",
        ...opts,
      });
    },
    listCameras(opts = {}) {
      return this._makeRequest({
        path: "/camera/getMinimalList",
        ...opts,
      });
    },
    getAuditFeed(opts = {}) {
      return this._makeRequest({
        path: "/report/getAuditFeed",
        ...opts,
      });
    },
    rebootCamera(opts = {}) {
      return this._makeRequest({
        path: "/camera/reboot",
        ...opts,
      });
    },
    findAccessControlledDoors(opts = {}) {
      return this._makeRequest({
        path: "/component/findAccessControlledDoors",
        data: {},
        ...opts,
      });
    },
    unlockAccessControlledDoor(opts = {}) {
      return this._makeRequest({
        path: "/accesscontrol/unlockAccessControlledDoor",
        ...opts,
      });
    },
    createCustomFootageSeekpoints(opts = {}) {
      return this._makeRequest({
        path: "/camera/createCustomFootageSeekpoints",
        ...opts,
      });
    },
    getMinimalAudioGatewayStateList(opts = {}) {
      return this._makeRequest({
        path: "/audiogateway/getMinimalAudioGatewayStateList",
        data: {},
        ...opts,
      });
    },
    getAudioUploadMetadataForOrg(opts = {}) {
      return this._makeRequest({
        path: "/audioplayback/getAudioUploadMetadataForOrg",
        data: {},
        ...opts,
      });
    },
    playAudioUpload(opts = {}) {
      return this._makeRequest({
        path: "/audioplayback/playAudioUpload",
        ...opts,
      });
    },
    getAudioGatewayConfig(opts = {}) {
      return this._makeRequest({
        path: "/audiogateway/getConfig",
        ...opts,
      });
    },
    updateAudioGatewayConfig(opts = {}) {
      return this._makeRequest({
        path: "/audiogateway/updateConfig",
        ...opts,
      });
    },
    getMinimalDoorbellCameraStateList(opts = {}) {
      return this._makeRequest({
        path: "/doorbellcamera/getMinimalDoorbellCameraStateList",
        data: {},
        ...opts,
      });
    },
    createSharedLiveVideoStream(opts = {}) {
      return this._makeRequest({
        path: "/camera/createSharedLiveVideoStream",
        ...opts,
      });
    },
    createDoorbellSharedLiveVideoStream(opts = {}) {
      return this._makeRequest({
        path: "/doorbellcamera/createSharedLiveVideoStream",
        ...opts,
      });
    },
    spliceV3(opts = {}) {
      return this._makeRequest({
        path: "/video/spliceV3",
        ...opts,
      });
    },
    savePolicyAlertV2(opts = {}) {
      return this._makeRequest({
        path: "/event/savePolicyAlertV2",
        ...opts,
      });
    },
  },
};
