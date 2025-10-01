import app from "../../companycam.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "companycam-add-photo",
  name: "Add Photo",
  description: "Add a photo to a project. [See the docs](https://docs.companycam.com/reference/createprojectphoto).",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
    photoUri: {
      type: "string",
      label: "Photo URI",
      description: "The URI of the photo.",
    },
    photoCapturedAt: {
      type: "string",
      label: "Photo Captured At",
      description: "The date and time the photo was captured. Unix timestamp when the Photo was captured.",
      default: String(Date.now()),
    },
    coordinateLat: {
      description: "The latitude of the photo.",
      propDefinition: [
        app,
        "coordinateLat",
      ],
    },
    coordinateLon: {
      description: "The longitude of the photo.",
      propDefinition: [
        app,
        "coordinateLon",
      ],
    },
  },
  methods: {
    async addPhoto({
      projectId, ...args
    } = {}) {
      return this.app.create({
        path: `/projects/${projectId}/photos`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      projectId,
      photoUri,
      photoCapturedAt,
      coordinateLat,
      coordinateLon,
    } = this;

    const data = utils.reduceProperties({
      additionalProps: {
        coordinates: [
          {
            lat: utils.strToFloat(coordinateLat),
            lon: utils.strToFloat(coordinateLon),
          },
          coordinateLat && coordinateLon,
        ],
      },
    });

    const response = await this.addPhoto({
      step,
      projectId,
      data: {
        photo: {
          uri: photoUri,
          captured_at: photoCapturedAt,
          ...data,
        },
      },
    });

    step.export("$summary", `Successfully added photo with id ${response.id}.`);

    return response;
  },
};
