import app from "../../scale_ai.app.mjs";

export default {
  key: "scale_ai-create-image-annotation-task",
  name: "Create Image Annotation Task",
  description: "Create an image annotation task. [See the documentation](https://docs.scale.com/reference/general-image-annotation)",
  type: "action",
  version: "0.0.1",
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
    geometriesBoxMinHeight: {
      type: "integer",
      label: "Geometries Box Min Height",
      description: "The minimum height of a box in pixels. See [Boxes](https://docs.scale.com/reference/boxes) for details about the parameter and response fields.",
      optional: true,
    },
    geometriesBoxMinWidth: {
      type: "integer",
      label: "Geometries Box Min Width",
      description: "The minimum width of a box in pixels. See [Boxes](https://docs.scale.com/reference/boxes) for details about the parameter and response fields.",
      optional: true,
    },
    geometriesBoxCanRotate: {
      type: "boolean",
      label: "Geometries Box Can Rotate",
      description: "Whether or not boxes can be rotated. See [Boxes](https://docs.scale.com/reference/boxes) for details about the parameter and response fields.",
      optional: true,
    },
    geometriesBoxIntegerPixels: {
      type: "boolean",
      label: "Geometries Box Integer Pixels",
      description: "Whether or not box coordinates must be integers. See [Boxes](https://docs.scale.com/reference/boxes) for details about the parameter and response fields.",
      optional: true,
    },
    geometriesBoxObjectsToAnnotate: {
      type: "string[]",
      label: "Geometries Box Objects To Annotate",
      description: "An array of strings with the names of the objects to annotate with boxes. See [Boxes](https://docs.scale.com/reference/boxes) for details about the parameter and response fields.",
    },
    geometriesPolygonMinVertices: {
      type: "integer",
      label: "Geometries Polygon Min Vertices",
      description: "The minimum number of vertices a polygon can have. See [Polygons](https://docs.scale.com/reference/polygons) for details about the parameter and response fields.",
      optional: true,
    },
    geometriesPolygonMaxVertices: {
      type: "integer",
      label: "Geometries Polygon Max Vertices",
      description: "The maximum number of vertices a polygon can have. See [Polygons](https://docs.scale.com/reference/polygons) for details about the parameter and response fields.",
      optional: true,
    },
    geometriesPolygonObjectsToAnnotate: {
      type: "string[]",
      label: "Geometries Polygon Objects To Annotate",
      description: "An array of strings with the names of the objects to annotate with polygons. See [Polygons](https://docs.scale.com/reference/polygons) for details about the parameter and response fields.",
    },
    geometriesLineMinVertices: {
      type: "integer",
      label: "Geometries Line Min Vertices",
      description: "The minimum number of vertices a line can have. See [Lines](https://docs.scale.com/reference/lines) for details about the parameter and response fields.",
      optional: true,
    },
    geometriesLineMaxVertices: {
      type: "integer",
      label: "Geometries Line Max Vertices",
      description: "The maximum number of vertices a line can have. See [Lines](https://docs.scale.com/reference/lines) for details about the parameter and response fields.",
      optional: true,
    },
    geometriesLineObjectsToAnnotate: {
      type: "string[]",
      label: "Geometries Line Objects To Annotate",
      description: "An array of strings with the names of the objects to annotate with lines. See [Lines](https://docs.scale.com/reference/lines) for details about the parameter and response fields.",
    },
    geometriesPointObjectsToAnnotate: {
      type: "string[]",
      label: "Geometries Point Objects To Annotate",
      description: "An array of strings with the names of the objects to annotate with points. See [Points](https://docs.scale.com/reference/points) for details about the parameter and response fields.",
    },
    geometriesCuboidMinHeight: {
      type: "integer",
      label: "Geometries Cuboid Min Height",
      description: "The minimum height of a cuboid in pixels. See [Cuboids](https://docs.scale.com/reference/cuboids) for details about the parameter and response fields.",
      optional: true,
    },
    geometriesCuboidMinWidth: {
      type: "integer",
      label: "Geometries Cuboid Min Width",
      description: "The minimum width of a cuboid in pixels. See [Cuboids](https://docs.scale.com/reference/cuboids) for details about the parameter and response fields.",
      optional: true,
    },
    geometriesCuboidCameraIntrinsicsFx: {
      type: "integer",
      label: "Geometries Cuboid Camera Intrinsics Fx",
      description: "The focal length in pixels of the camera used to capture the image. See [Cuboids](https://docs.scale.com/reference/cuboids) for details about the parameter and response fields.",
      optional: true,
    },
    geometriesCuboidCameraIntrinsicsFy: {
      type: "integer",
      label: "Geometries Cuboid Camera Intrinsics Fy",
      description: "The focal length in pixels of the camera used to capture the image. See [Cuboids](https://docs.scale.com/reference/cuboids) for details about the parameter and response fields.",
      optional: true,
    },
    geometriesCuboidCameraIntrinsicsCx: {
      type: "integer",
      label: "Geometries Cuboid Camera Intrinsics Cx",
      description: "The focal length in pixels of the camera used to capture the image. See [Cuboids](https://docs.scale.com/reference/cuboids) for details about the parameter and response fields.",
      optional: true,
    },
    geometriesCuboidCameraIntrinsicsCy: {
      type: "integer",
      label: "Geometries Cuboid Camera Intrinsics Cy",
      description: "The focal length in pixels of the camera used to capture the image. See [Cuboids](https://docs.scale.com/reference/cuboids) for details about the parameter and response fields.",
      optional: true,
    },
    geometriesCuboidCameraIntrinsicsSkew: {
      type: "integer",
      label: "Geometries Cuboid Camera Intrinsics Skew",
      description: "The focal length in pixels of the camera used to capture the image. See [Cuboids](https://docs.scale.com/reference/cuboids) for details about the parameter and response fields.",
      optional: true,
    },
    geometriesCuboidCameraIntrinsicsScaleFactor: {
      type: "integer",
      label: "Geometries Cuboid Camera Intrinsics Scale Factor",
      description: "The focal length in pixels of the camera used to capture the image. See [Cuboids](https://docs.scale.com/reference/cuboids) for details about the parameter and response fields.",
      optional: true,
    },
    geometriesCuboidCameraRotationQuaternionW: {
      type: "integer",
      label: "Geometries Cuboid Camera Rotation Quaternion W",
      description: "The rotation of the camera used to capture the image. See [Cuboids](https://docs.scale.com/reference/cuboids) for details about the parameter and response fields.",
      optional: true,
    },
    geometriesCuboidCameraRotationQuaternionX: {
      type: "integer",
      label: "Geometries Cuboid Camera Rotation Quaternion X",
      description: "The rotation of the camera used to capture the image. See [Cuboids](https://docs.scale.com/reference/cuboids) for details about the parameter and response fields.",
      optional: true,
    },
    geometriesCuboidCameraRotationQuaternionY: {
      type: "integer",
      label: "Geometries Cuboid Camera Rotation Quaternion Y",
      description: "The rotation of the camera used to capture the image. See [Cuboids](https://docs.scale.com/reference/cuboids) for details about the parameter and response fields.",
      optional: true,
    },
    geometriesCuboidCameraRotationQuaternionZ: {
      type: "integer",
      label: "Geometries Cuboid Camera Rotation Quaternion Z",
      description: "The rotation of the camera used to capture the image. See [Cuboids](https://docs.scale.com/reference/cuboids) for details about the parameter and response fields.",
      optional: true,
    },
    geometriesCuboidCameraHeight: {
      type: "integer",
      label: "Geometries Cuboid Camera Height",
      description: "The height of the camera used to capture the image. See [Cuboids](https://docs.scale.com/reference/cuboids) for details about the parameter and response fields.",
      optional: true,
    },
    geometriesCuboidObjectsToAnnotate: {
      type: "string[]",
      label: "Geometries Cuboid Objects To Annotate",
      description: "An array of strings with the names of the objects to annotate with cuboids. See [Cuboids](https://docs.scale.com/reference/cuboids) for details about the parameter and response fields.",
    },
    geometriesEllipseObjectsToAnnotate: {
      type: "string[]",
      label: "Geometries Ellipse Objects To Annotate",
      description: "An array of strings with the names of the objects to annotate with ellipses. See [Ellipse](https://docs.scale.com/reference/ellipses) for details about the parameter and response fields.",
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
      geometriesBoxMinHeight,
      geometriesBoxMinWidth,
      geometriesBoxCanRotate,
      geometriesBoxIntegerPixels,
      geometriesBoxObjectsToAnnotate,
      geometriesPolygonMinVertices,
      geometriesPolygonMaxVertices,
      geometriesPolygonObjectsToAnnotate,
      geometriesLineMinVertices,
      geometriesLineMaxVertices,
      geometriesLineObjectsToAnnotate,
      geometriesPointObjectsToAnnotate,
      geometriesCuboidMinHeight,
      geometriesCuboidMinWidth,
      geometriesCuboidCameraIntrinsicsFx,
      geometriesCuboidCameraIntrinsicsFy,
      geometriesCuboidCameraIntrinsicsCx,
      geometriesCuboidCameraIntrinsicsCy,
      geometriesCuboidCameraIntrinsicsSkew,
      geometriesCuboidCameraIntrinsicsScaleFactor,
      geometriesCuboidCameraRotationQuaternionW,
      geometriesCuboidCameraRotationQuaternionX,
      geometriesCuboidCameraRotationQuaternionY,
      geometriesCuboidCameraRotationQuaternionZ,
      geometriesCuboidCameraHeight,
      geometriesCuboidObjectsToAnnotate,
      geometriesEllipseObjectsToAnnotate,
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
          box: {
            min_height: geometriesBoxMinHeight,
            min_width: geometriesBoxMinWidth,
            can_rotate: geometriesBoxCanRotate,
            integer_pixels: geometriesBoxIntegerPixels,
            objects_to_annotate: geometriesBoxObjectsToAnnotate,
          },
          polygon: {
            min_vertices: geometriesPolygonMinVertices,
            max_vertices: geometriesPolygonMaxVertices,
            objects_to_annotate: geometriesPolygonObjectsToAnnotate,
          },
          line: {
            min_vertices: geometriesLineMinVertices,
            max_vertices: geometriesLineMaxVertices,
            objects_to_annotate: geometriesLineObjectsToAnnotate,
          },
          point: {
            objects_to_annotate: geometriesPointObjectsToAnnotate,
          },
          cuboid: {
            min_height: geometriesCuboidMinHeight,
            min_width: geometriesCuboidMinWidth,
            camera_intrinsics: {
              fx: geometriesCuboidCameraIntrinsicsFx,
              fy: geometriesCuboidCameraIntrinsicsFy,
              cx: geometriesCuboidCameraIntrinsicsCx,
              cy: geometriesCuboidCameraIntrinsicsCy,
              skew: geometriesCuboidCameraIntrinsicsSkew,
              scalefactor: geometriesCuboidCameraIntrinsicsScaleFactor,
            },
            camera_rotation_quaternion: {
              w: geometriesCuboidCameraRotationQuaternionW,
              x: geometriesCuboidCameraRotationQuaternionX,
              y: geometriesCuboidCameraRotationQuaternionY,
              z: geometriesCuboidCameraRotationQuaternionZ,
            },
            camera_height: geometriesCuboidCameraHeight,
            objects_to_annotate: geometriesCuboidObjectsToAnnotate,
          },
          ellipse: {
            objects_to_annotate: geometriesEllipseObjectsToAnnotate,
          },
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
