import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "slybroadcast",
  propDefinitions: {
    audioFile: {
      type: "string",
      label: "Audio File",
      description: "The audio file uploaded to your slybroadcast account",
      async options() {
        const files = await this.listAudioFiles();
        const filenames = [
          ...files.matchAll(/"\|"(.*?)"\|"/g),
        ].map((match) => match[1]);
        return filenames;
      },
    },
    recipients: {
      type: "string[]",
      label: "Recipients",
      description: "Array of recipients' phone numbers for the voicemail campaign",
    },
    date: {
      type: "string",
      label: "Date",
      description: "Date/Time of delivery in Eastern Time. YYYY-MM-DD HH:MM:SS *Must use 24-hour time format. Example: 5:00pm = 17:00:00",
      default: "now",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://www.mobile-sphere.com/gateway/";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this, method = "POST", path, data, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: `${this._baseUrl()}${path}`,
        data: {
          ...data,
          c_uid: `${this.$auth.email}`,
          c_password: `${this.$auth.password}`,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
    },
    listAudioFiles(opts = {}) {
      return this._makeRequest({
        path: "/vmb.aflist.php",
        data: {
          c_method: "get_audio_list",
        },
        ...opts,
      });
    },
    startCampaign(opts = {}) {
      return this._makeRequest({
        path: "/vmb.php",
        ...opts,
      });
    },
  },
};
