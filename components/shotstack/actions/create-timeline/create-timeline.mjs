import app from "../../shotstack.app.mjs";
import constants from "../../common/constants.mjs";

const { SEP } = constants;

export default {
  key: "shotstack-create-timeline",
  name: "Create Timeline",
  description: "Generate a timeline with layers and assets for a new video project. [See the documentation here](https://github.com/shotstack/shotstack-sdk-node#timeline).",
  type: "action",
  version: "0.0.3",
  props: {
    app,
    howManyTracks: {
      type: "integer",
      label: "How Many Tracks?",
      description: "The number of tracks to create.",
      reloadProps: true,
      min: 1,
    },
  },
  additionalProps() {
    return Array.from({
      length: this.howManyTracks,
    }).reduce((acc, _, index) => {
      const trackNumber = index + 1;
      const trackName = `track${trackNumber}`;
      const trackHowManyVideoClips = `${trackName}HowManyVideoClips`;
      const trackHowManyImageClips = `${trackName}HowManyImageClips`;
      const trackHowManyAudioClips = `${trackName}HowManyAudioClips`;
      const trackHowManyTitleClips = `${trackName}HowManyTitleClips`;
      const trackHowManyHtmlClips = `${trackName}HowManyHtmlClips`;
      const trackHowManyLumaClips = `${trackName}HowManyLumaClips`;

      const videoClips = Array.from({
        length: this[trackHowManyVideoClips],
      }).map((_, index) => {
        const clipNumber = index + 1;
        const clipName = `${trackName}${SEP}clip${clipNumber}${SEP}video`;
        const clipAssetSrc = `${clipName}${SEP}src`;
        const clipAssetStart = `${clipName}${SEP}start`;
        const clipAssetLength = `${clipName}${SEP}length`;
        return {
          [clipAssetSrc]: {
            type: "string",
            label: `Track ${trackNumber}: Video Clip ${clipNumber} Source`,
            description: "The source of the asset.",
          },
          [clipAssetStart]: {
            type: "integer",
            label: `Track ${trackNumber}: Video Clip ${clipNumber} Start`,
            description: "The start time of the asset.",
          },
          [clipAssetLength]: {
            type: "integer",
            label: `Track ${trackNumber}: Video Clip ${clipNumber} Length`,
            description: "The length of the asset.",
          },
        };
      });

      const imageClips = Array.from({
        length: this[trackHowManyImageClips],
      }).map((_, index) => {
        const clipNumber = index + 1;
        const clipName = `${trackName}${SEP}clip${clipNumber}${SEP}image`;
        const clipAssetSrc = `${clipName}${SEP}src`;
        const clipAssetStart = `${clipName}${SEP}start`;
        const clipAssetLength = `${clipName}${SEP}length`;
        return {
          [clipAssetSrc]: {
            type: "string",
            label: `Track ${trackNumber}: Image Clip ${clipNumber} Source`,
            description: "The source of the asset.",
          },
          [clipAssetStart]: {
            type: "integer",
            label: `Track ${trackNumber}: Image Clip ${clipNumber} Start`,
            description: "The start time of the asset.",
          },
          [clipAssetLength]: {
            type: "integer",
            label: `Track ${trackNumber}: Image Clip ${clipNumber} Length`,
            description: "The length of the asset.",
          },
        };
      });

      const audioClips = Array.from({
        length: this[trackHowManyAudioClips],
      }).map((_, index) => {
        const clipNumber = index + 1;
        const clipName = `${trackName}${SEP}clip${clipNumber}${SEP}audio`;
        const clipAssetSrc = `${clipName}${SEP}src`;
        const clipAssetStart = `${clipName}${SEP}start`;
        const clipAssetLength = `${clipName}${SEP}length`;
        return {
          [clipAssetSrc]: {
            type: "string",
            label: `Track ${trackNumber} Audio Clip ${clipNumber} Asset Source`,
            description: "The source of the asset.",
          },
          [clipAssetStart]: {
            type: "integer",
            label: `Track ${trackNumber} Audio Clip ${clipNumber} Asset Start`,
            description: "The start time of the asset.",
          },
          [clipAssetLength]: {
            type: "integer",
            label: `Track ${trackNumber} Audio Clip ${clipNumber} Asset Length`,
            description: "The length of the asset.",
          },
        };
      });

      const titleClips = Array.from({
        length: this[trackHowManyTitleClips],
      }).map((_, index) => {
        const clipNumber = index + 1;
        const clipName = `${trackName}${SEP}clip${clipNumber}${SEP}title`;
        const clipAssetText = `${clipName}${SEP}text`;
        const clipAssetStart = `${clipName}${SEP}start`;
        const clipAssetLength = `${clipName}${SEP}length`;
        return {
          [clipAssetText]: {
            type: "string",
            label: `Track ${trackNumber} Title Clip ${clipNumber} Asset Text`,
            description: "The source of the asset.",
          },
          [clipAssetStart]: {
            type: "integer",
            label: `Track ${trackNumber} Title Clip ${clipNumber} Asset Start`,
            description: "The start time of the asset.",
          },
          [clipAssetLength]: {
            type: "integer",
            label: `Track ${trackNumber} Title Clip ${clipNumber} Asset Length`,
            description: "The length of the asset.",
          },
        };
      });

      const htmlClips = Array.from({
        length: this[trackHowManyHtmlClips],
      }).map((_, index) => {
        const clipNumber = index + 1;
        const clipName = `${trackName}${SEP}clip${clipNumber}${SEP}html`;
        const clipAssetHtml = `${clipName}${SEP}html`;
        const clipAssetStart = `${clipName}${SEP}start`;
        const clipAssetLength = `${clipName}${SEP}length`;
        return {
          [clipAssetHtml]: {
            type: "string",
            label: `Track ${trackNumber} HTML Clip ${clipNumber} Asset`,
            description: "The source of the asset.",
          },
          [clipAssetStart]: {
            type: "integer",
            label: `Track ${trackNumber} HTML Clip ${clipNumber} Asset Start`,
            description: "The start time of the asset.",
          },
          [clipAssetLength]: {
            type: "integer",
            label: `Track ${trackNumber} HTML Clip ${clipNumber} Asset Length`,
            description: "The length of the asset.",
          },
        };
      });

      const lumaClips = Array.from({
        length: this[trackHowManyLumaClips],
      }).map((_, index) => {
        const clipNumber = index + 1;
        const clipName = `${trackName}${SEP}clip${clipNumber}${SEP}luma`;
        const clipAssetSrc = `${clipName}${SEP}src`;
        const clipAssetStart = `${clipName}${SEP}start`;
        const clipAssetLength = `${clipName}${SEP}length`;
        return {
          [clipAssetSrc]: {
            type: "string",
            label: `Track ${trackNumber} Luma Clip ${clipNumber} Asset Source`,
            description: "The source of the asset.",
          },
          [clipAssetStart]: {
            type: "integer",
            label: `Track ${trackNumber} Luma Clip ${clipNumber} Asset Start`,
            description: "The start time of the asset.",
          },
          [clipAssetLength]: {
            type: "integer",
            label: `Track ${trackNumber} Luma Clip ${clipNumber} Asset Length`,
            description: "The length of the asset.",
          },
        };
      });

      return {
        ...acc,
        [trackHowManyVideoClips]: {
          type: "integer",
          label: `Track ${trackNumber} How Many Video Clips?`,
          description: "The number of video clips to create.",
          reloadProps: true,
          optional: true,
        },
        [trackHowManyImageClips]: {
          type: "integer",
          label: `Track ${trackNumber} How Many Image Clips?`,
          description: "The number of image clips to create.",
          reloadProps: true,
          optional: true,
        },
        [trackHowManyAudioClips]: {
          type: "integer",
          label: `Track ${trackNumber} How Many Audio Clips?`,
          description: "The number of audio clips to create.",
          reloadProps: true,
          optional: true,
        },
        [trackHowManyTitleClips]: {
          type: "integer",
          label: `Track ${trackNumber} How Many Title Clips?`,
          description: "The number of title clips to create.",
          reloadProps: true,
          optional: true,
        },
        [trackHowManyHtmlClips]: {
          type: "integer",
          label: `Track ${trackNumber} How Many HTML Clips?`,
          description: "The number of HTML clips to create.",
          reloadProps: true,
          optional: true,
        },
        [trackHowManyLumaClips]: {
          type: "integer",
          label: `Track ${trackNumber} How Many Luma Clips?`,
          description: "The number of Luma clips to create.",
          reloadProps: true,
          optional: true,
        },
        ...videoClips.reduce((acc, next) => ({
          ...acc,
          ...next,
        }), {}),
        ...imageClips.reduce((acc, next) => ({
          ...acc,
          ...next,
        }), {}),
        ...audioClips.reduce((acc, next) => ({
          ...acc,
          ...next,
        }), {}),
        ...titleClips.reduce((acc, next) => ({
          ...acc,
          ...next,
        }), {}),
        ...htmlClips.reduce((acc, next) => ({
          ...acc,
          ...next,
        }), {}),
        ...lumaClips.reduce((acc, next) => ({
          ...acc,
          ...next,
        }), {}),
      };
    }, {});
  },
  async run({ $: step }) {

    step.export("$summary", "Success");
    return this;
  },
};
