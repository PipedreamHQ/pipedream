import app from "../../shotstack.app.mjs";
import constants from "../../common/constants.mjs";

const { SEP } = constants;

export default {
  key: "shotstack-create-timeline",
  name: "Create Timeline",
  description: "Generate a timeline with layers and assets for a new video project. [See the documentation here](https://github.com/shotstack/shotstack-sdk-node#timeline).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    howManyTracks: {
      type: "integer",
      label: "How Many Tracks?",
      description: "The number of tracks to create.",
      reloadProps: true,
      min: 1,
    },
    soundtrackSrc: {
      type: "string",
      label: "Soundtrack Source",
      description: "The URL of the soundtrack to use.",
      optional: true,
    },
    soundtrackEffect: {
      type: "string",
      label: "Soundtrack Effect",
      description: "The effect to apply to the soundtrack.",
      optional: true,
      options: Object.values(constants.SOUNDTRACK_EFFECT),
    },
    background: {
      type: "string",
      label: "Background",
      description: "A hexadecimal value for the timeline background colour. Defaults to `#000000` (black).",
      optional: true,
    },
    fonts: {
      type: "string[]",
      label: "Fonts",
      description: "An array of custom fonts to be downloaded for use by the HTML assets. The URL must be publicly accessible or include credentials. E.g. `https://s3-ap-northeast-1.amazonaws.com/my-bucket/open-sans.ttf`",
      optional: true,
    },
  },
  methods: {
    getClip({
      start, length, type, src, text, html,
    }) {
      return {
        start,
        length,
        asset: {
          src,
          html,
          text,
          type,
        },
      };
    },
    getClips(trackNumber, assetType, length) {
      return Array.from({
        length,
      }).map((_, index) => {
        const clipNumber = index + 1;
        const trackName = `track${trackNumber}`;
        const clipName = `${trackName}${SEP}clip${clipNumber}${SEP}${assetType}`;
        const clipAssetStart = `${clipName}${SEP}start`;
        const clipAssetLength = `${clipName}${SEP}length`;
        const clipAssetSrc = `${clipName}${SEP}src`;
        const clipAssetText = `${clipName}${SEP}text`;
        const clipAssetHtml = `${clipName}${SEP}html`;
        return this.getClip({
          start: this[clipAssetStart],
          length: this[clipAssetLength],
          type: assetType,
          src: this[clipAssetSrc],
          text: this[clipAssetText],
          html: this[clipAssetHtml],
        });
      });
    },
    getTracks(length) {
      return Array.from({
        length,
      }).map((_, index) => {
        const trackNumber = index + 1;
        const trackName = `track${trackNumber}`;
        const trackHowManyVideoClips = `${trackName}${SEP}HowManyVideoClips`;
        const trackHowManyImageClips = `${trackName}${SEP}HowManyImageClips`;
        const trackHowManyAudioClips = `${trackName}${SEP}HowManyAudioClips`;
        const trackHowManyTitleClips = `${trackName}${SEP}HowManyTitleClips`;
        const trackHowManyHtmlClips = `${trackName}${SEP}HowManyHtmlClips`;
        const trackHowManyLumaClips = `${trackName}${SEP}HowManyLumaClips`;
        return {
          clips: [
            ...this.getClips(trackNumber, constants.ASSET_TYPE.VIDEO, this[trackHowManyVideoClips]),
            ...this.getClips(trackNumber, constants.ASSET_TYPE.IMAGE, this[trackHowManyImageClips]),
            ...this.getClips(trackNumber, constants.ASSET_TYPE.AUDIO, this[trackHowManyAudioClips]),
            ...this.getClips(trackNumber, constants.ASSET_TYPE.TITLE, this[trackHowManyTitleClips]),
            ...this.getClips(trackNumber, constants.ASSET_TYPE.HTML, this[trackHowManyHtmlClips]),
            ...this.getClips(trackNumber, constants.ASSET_TYPE.LUMA, this[trackHowManyLumaClips]),
          ],
        };
      });
    },
    getClipProps(trackNumber, assetType, length) {
      return Array.from({
        length,
      }).map((_, index) => {
        const clipNumber = index + 1;
        const trackName = `track${trackNumber}`;
        const clipName = `${trackName}${SEP}clip${clipNumber}${SEP}${assetType}`;
        const clipAssetStart = `${clipName}${SEP}start`;
        const clipAssetLength = `${clipName}${SEP}length`;
        const description = `Track ${trackNumber} - ${assetType} clip ${clipNumber}.`;

        const commonProps = {
          [clipAssetStart]: {
            type: "integer",
            label: "Start",
            description: `${description} The start time of the asset`,
          },
          [clipAssetLength]: {
            type: "integer",
            label: "Length",
            description: `${description} The length of the asset.`,
          },
        };

        if (assetType === constants.ASSET_TYPE.TITLE) {
          return {
            ...commonProps,
            [`${clipName}${SEP}text`]: {
              type: "string",
              label: "Text",
              description: `${description} The text of the title.`,
            },
          };
        }

        if (assetType === constants.ASSET_TYPE.HTML) {
          return {
            ...commonProps,
            [`${clipName}${SEP}html`]: {
              type: "string",
              label: "HTML",
              description: `${description} The HTML of the asset.`,
            },
          };
        }

        return {
          ...commonProps,
          [`${clipName}${SEP}src`]: {
            type: "string",
            label: "Source",
            description: `${description} The source url of the asset.`,
          },
        };
      })
        .reduce((acc, next) => ({
          ...acc,
          ...next,
        }), {});
    },
  },
  additionalProps() {
    return Array.from({
      length: this.howManyTracks,
    }).reduce((acc, _, index) => {
      const trackNumber = index + 1;
      const trackName = `track${trackNumber}`;
      const trackHowManyVideoClips = `${trackName}${SEP}HowManyVideoClips`;
      const trackHowManyImageClips = `${trackName}${SEP}HowManyImageClips`;
      const trackHowManyAudioClips = `${trackName}${SEP}HowManyAudioClips`;
      const trackHowManyTitleClips = `${trackName}${SEP}HowManyTitleClips`;
      const trackHowManyHtmlClips = `${trackName}${SEP}HowManyHtmlClips`;
      const trackHowManyLumaClips = `${trackName}${SEP}HowManyLumaClips`;
      const commonDescription = `Track ${trackNumber}:`;

      return {
        ...acc,
        [trackHowManyVideoClips]: {
          type: "integer",
          label: "How Many Video Clips?",
          description: `${commonDescription} The number of video clips to create.`,
          reloadProps: true,
          optional: true,
        },
        [trackHowManyImageClips]: {
          type: "integer",
          label: "How Many Image Clips?",
          description: `${commonDescription} The number of image clips to create.`,
          reloadProps: true,
          optional: true,
        },
        [trackHowManyAudioClips]: {
          type: "integer",
          label: "How Many Audio Clips?",
          description: `${commonDescription} The number of audio clips to create.`,
          reloadProps: true,
          optional: true,
        },
        [trackHowManyTitleClips]: {
          type: "integer",
          label: "How Many Title Clips?",
          description: `${commonDescription} The number of title clips to create.`,
          reloadProps: true,
          optional: true,
        },
        [trackHowManyHtmlClips]: {
          type: "integer",
          label: "How Many HTML Clips?",
          description: `${commonDescription} The number of HTML clips to create.`,
          reloadProps: true,
          optional: true,
        },
        [trackHowManyLumaClips]: {
          type: "integer",
          label: "How Many Luma Clips?",
          description: `${commonDescription} The number of luma clips to create.`,
          reloadProps: true,
          optional: true,
        },
        ...this.getClipProps(trackNumber, constants.ASSET_TYPE.VIDEO, this[trackHowManyVideoClips]),
        ...this.getClipProps(trackNumber, constants.ASSET_TYPE.IMAGE, this[trackHowManyImageClips]),
        ...this.getClipProps(trackNumber, constants.ASSET_TYPE.AUDIO, this[trackHowManyAudioClips]),
        ...this.getClipProps(trackNumber, constants.ASSET_TYPE.TITLE, this[trackHowManyTitleClips]),
        ...this.getClipProps(trackNumber, constants.ASSET_TYPE.HTML, this[trackHowManyHtmlClips]),
        ...this.getClipProps(trackNumber, constants.ASSET_TYPE.LUMA, this[trackHowManyLumaClips]),
      };
    }, {});
  },
  async run({ $: step }) {
    const {
      howManyTracks,
      soundtrackSrc,
      soundtrackEffect,
      background,
      fonts,
    } = this;

    const timeline = {
      soundtrack: {
        src: soundtrackSrc,
        effect: soundtrackEffect,
      },
      background,
      fonts: Array.isArray(fonts)
        ? fonts.map((src) => ({
          src,
        }))
        : fonts?.split(",").map((src) => ({
          src,
        })),
      tracks: this.getTracks(howManyTracks),
    };

    step.export("$summary", "Successfully created a timeline.");

    return timeline;
  },
};
