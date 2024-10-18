import app from "../../runpod.app.mjs";
import mutations from "../../common/mutations.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "runpod-create-pod",
  name: "Create Pod",
  description: "Creates a new pod with the specified parameters. [See the documentation](https://docs.runpod.io/sdks/graphql/manage-pods#create-spot-pod)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    bidPerGpu: {
      propDefinition: [
        app,
        "bidPerGpu",
      ],
    },
    cloudType: {
      type: "string",
      label: "Cloud Type",
      description: "The type of cloud to use for the pod.",
      options: [
        "SECURE",
        "COMMUNITY",
        "ALL",
      ],
    },
    gpuCount: {
      propDefinition: [
        app,
        "gpuCount",
      ],
    },
    volumeInGb: {
      type: "integer",
      label: "Volume In GB",
      description: "The size of the volume in GB.",
    },
    containerDiskInGb: {
      type: "integer",
      label: "Container Disk In GB",
      description: "The size of the container disk in GB.",
    },
    minVcpuCount: {
      type: "integer",
      label: "Minimum VCPU Count",
      description: "The minimum number of VCPUs.",
    },
    minMemoryInGb: {
      type: "integer",
      label: "Minimum Memory In GB",
      description: "The minimum memory size in GB.",
    },
    gpuTypeId: {
      propDefinition: [
        app,
        "gpuTypeId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the pod.",
    },
    imageName: {
      type: "string",
      label: "Image Name",
      description: "The name of the image to use for the pod.",
    },
    ports: {
      type: "string",
      label: "Ports",
      description: "The ports to use for the pod.",
    },
    volumeMountPath: {
      type: "string",
      label: "Volume Mount Path",
      description: "The path where the volume will be mounted.",
    },
    env: {
      type: "string[]",
      label: "Environment Variables",
      description: "The environment variables to set for the pod. Each row should be formated with JSON string like this `{\"key\": \"ENV_NAME\", \"value\": \"ENV_VALUE\"}`",
      optional: true,
    },
    dockerArgs: {
      type: "string",
      label: "Docker Args",
      description: "The arguments to pass to the docker command.",
      optional: true,
    },
    startJupyter: {
      type: "boolean",
      label: "Start Jupyter",
      description: "Whether to start Jupyter for the pod.",
      optional: true,
    },
    startSsh: {
      type: "boolean",
      label: "Start SSH",
      description: "Whether to start SSH for the pod.",
      optional: true,
    },
    stopAfter: {
      type: "string",
      label: "Stop After",
      description: "The duration after which the pod will be stopped.",
      optional: true,
    },
    supportPublicIp: {
      type: "boolean",
      label: "Support Public IP",
      description: "Whether to support public IP for the pod.",
      optional: true,
    },
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the template to use for the pod.",
      optional: true,
    },
  },
  methods: {
    createPod(variables) {
      return this.app.makeRequest({
        query: mutations.createPod,
        variables,
      });
    },
  },
  async run({ $ }) {
    const {
      createPod,
      bidPerGpu,
      cloudType,
      gpuCount,
      volumeInGb,
      containerDiskInGb,
      minVcpuCount,
      minMemoryInGb,
      gpuTypeId,
      name,
      imageName,
      ports,
      volumeMountPath,
      env,
      dockerArgs,
      startJupyter,
      startSsh,
      stopAfter,
      supportPublicIp,
      templateId,
    } = this;

    const response = await createPod({
      input: utils.cleanInput({
        bidPerGpu,
        cloudType,
        gpuCount,
        volumeInGb,
        containerDiskInGb,
        minVcpuCount,
        minMemoryInGb,
        gpuTypeId,
        name,
        imageName,
        ports,
        volumeMountPath,
        env: utils.parseArray(env),
        dockerArgs,
        startJupyter,
        startSsh,
        stopAfter,
        supportPublicIp,
        templateId,
      }),
    });
    $.export("$summary", `Successfully created a new pod with ID \`${response.id}\`.`);
    return response;
  },
};
