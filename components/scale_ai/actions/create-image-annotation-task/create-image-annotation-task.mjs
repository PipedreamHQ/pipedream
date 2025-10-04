import app from "../../scale_ai.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "scale_ai-create-image-annotation-task",
  name: "Create Image Annotation Task",
  description: "Create an image annotation task. [See the documentation](https://docs.scale.com/reference/general-image-annotation)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    project: {
      propDefinition: [
        app,
        "project",
      ],
    },
    batch: {
      propDefinition: [
        app,
        "batch",
      ],
    },
    instruction: {
      propDefinition: [
        app,
        "instruction",
      ],
    },
    callbackUrl: {
      propDefinition: [
        app,
        "callbackUrl",
      ],
    },
    attachment: {
      propDefinition: [
        app,
        "attachment",
      ],
      optional: false,
    },
    contextAttachments: {
      type: "string[]",
      label: "Context Attachments",
      description: "An array of strings with links to actual attachments (A URI pointing to an attachment that provides additional context. Will be shown to the user below the main attachment, and can be made full screen.) to show to taskers as a reference. Context images themselves can not be labeled. Context images will appear [like this](https://i.imgur.com/MJ7ZbMt.mp4) in the UI. You cannot use the task's attachment url as a context attachment's url.",
      optional: true,
    },
    box: {
      type: "string",
      label: "Box",
      description: "Parameters for box geometries. See [Boxes](https://docs.scale.com/reference/boxes) for details about the parameter and response fields. Eg. `{\"min_height\": 10, \"min_width\": 10, \"can_rotate\": true, \"integer_pixels\": true, \"objects_to_annotate\": [\"car\", \"truck\"]}`",
      optional: true,
    },
    polygon: {
      type: "string",
      label: "Polygon",
      description: "Parameters for polygon geometries. See [Polygons](https://docs.scale.com/reference/polygons) for details about the parameter and response fields. Eg. `{\"min_vertices\": 3, \"max_vertices\": 5, \"objects_to_annotate\": [\"car\", \"truck\"]}`",
      optional: true,
    },
    line: {
      type: "string",
      label: "Line",
      description: "Parameters for line geometries. See [Lines](https://docs.scale.com/reference/lines) for details about the parameter and response fields. Eg. `{\"min_vertices\": 2, \"max_vertices\": 4, \"objects_to_annotate\": [\"car\", \"truck\"]}`",
      optional: true,
    },
    point: {
      type: "string",
      label: "Point",
      description: "Parameters for point geometries. See [Points](https://docs.scale.com/reference/points) for details about the parameter and response fields. Eg. `{\"objects_to_annotate\": [\"car\", \"truck\"]}`",
      optional: true,
    },
    cuboid: {
      type: "string",
      label: "Cuboid",
      description: "Parameters for cuboid geometries. See [Cuboids](https://docs.scale.com/reference/cuboids) for details about the parameter and response fields. Eg. `{\"min_height\": 10, \"min_width\": 10, \"camera_intrinsics\": {\"fx\": 100, \"fy\": 100, \"cx\": 100, \"cy\": 100, \"skew\": 0, \"scalefactor\": 1}, \"camera_rotation_quaternion\": {\"w\": 1, \"x\": 0, \"y\": 0, \"z\": 0}, \"camera_height\": 100, \"objects_to_annotate\": [\"car\", \"truck\"]}`",
      optional: true,
    },
    ellipse: {
      type: "string",
      label: "Ellipse",
      description: "Parameters for ellipse geometries. See [Ellipse](https://docs.scale.com/reference/ellipses) for details about the parameter and response fields. Eg. `{\"objects_to_annotate\": [\"car\", \"truck\"]}`",
      optional: true,
    },
    padding: {
      type: "integer",
      label: "Padding",
      description: "The amount of padding in pixels added to the top, bottom, left, and right of the image. This allows labelers to extend annotations outside of the image. When using padding, annotation coordinates can be a negative value or greater than the width/height of the image. See [visual example](https://i.imgur.com/OMJv9gi.png).",
      optional: true,
    },
    baseAnnotations: {
      type: "object",
      label: "Base Annotations",
      description: "Editable annotations, with the option to be **locked**, that a task should be initialized with. This is useful when you've run a model to prelabel the task and want annotators to refine those prelabels. Must contain the annotations field, which has the same format as the annotations field in the response.",
      optional: true,
    },
    canAddBaseAnnotations: {
      type: "boolean",
      label: "Can Add Base Annotations",
      description: "Whether or not the tasker can add base annotations.",
      optional: true,
    },
    canEditBaseAnnotations: {
      type: "boolean",
      label: "Can Edit Base Annotations",
      description: "Whether or not the tasker can edit base annotations.",
      optional: true,
    },
    canEditBaseAnnotationLabels: {
      type: "boolean",
      label: "Can Edit Base Annotation Labels",
      description: "Whether or not the tasker can edit base annotation labels.",
      optional: true,
    },
    canDeleteBaseAnnotations: {
      type: "boolean",
      label: "Can Delete Base Annotations",
      description: "Whether or not base_annotations can be removed from the task. If set to true, base_annotations can be deleted from the task. If set to false, base_annotations cannot be deleted from the task.",
      optional: true,
    },
    paddingX: {
      type: "integer",
      label: "Padding X",
      description: "The amount of padding in pixels added to the left and right of the image. Overrides *Padding* if set.",
      optional: true,
    },
    paddingY: {
      type: "integer",
      label: "Padding Y",
      description: "The amount of padding in pixels added to the top and bottom of the image. Overrides *Padding* if set.",
      optional: true,
    },
    priority: {
      propDefinition: [
        app,
        "priority",
      ],
    },
    uniqueId: {
      propDefinition: [
        app,
        "uniqueId",
      ],
    },
    clearUniqueIdOnError: {
      type: "boolean",
      label: "Clear Unique ID On Error",
      description: "If set to be true, if a task errors out after being submitted, the *Unique ID* on the task will be unset. This param allows workflows where you can re-submit the same unique id to recover from errors automatically.",
      optional: true,
    },
  },
  methods: {
    createImageAnnotationTask(args = {}) {
      return this.app.post({
        path: "/task/imageannotation",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      createImageAnnotationTask,
      project,
      batch,
      instruction,
      callbackUrl,
      attachment,
      contextAttachments,
      box,
      polygon,
      line,
      point,
      cuboid,
      ellipse,
      padding,
      paddingX,
      paddingY,
      priority,
      baseAnnotations,
      canAddBaseAnnotations,
      canEditBaseAnnotations,
      canEditBaseAnnotationLabels,
      canDeleteBaseAnnotations,
      uniqueId,
      clearUniqueIdOnError,
    } = this;

    const response = await createImageAnnotationTask({
      step,
      data: {
        project,
        batch,
        instruction,
        callback_url: callbackUrl,
        attachment,
        context_attachments: contextAttachments?.map((attachment) => ({
          attachment,
        })),
        geometries: {
          box: utils.parse(box),
          polygon: utils.parse(polygon),
          line: utils.parse(line),
          point: utils.parse(point),
          cuboid: utils.parse(cuboid),
          ellipse: utils.parse(ellipse),
        },
        padding,
        paddingX,
        paddingY,
        priority,
        base_annotations: baseAnnotations,
        can_add_base_annotations: canAddBaseAnnotations,
        can_edit_base_annotations: canEditBaseAnnotations,
        can_edit_base_annotation_labels: canEditBaseAnnotationLabels,
        can_delete_base_annotations: canDeleteBaseAnnotations,
        unique_id: uniqueId,
        clear_unique_id_on_error: clearUniqueIdOnError,
      },
    });

    step.export("$summary", `Successfully created image annotation task with ID \`${response.task_id}\``);

    return response;
  },
};
