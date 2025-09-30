import {
  fieldToString,
  getFileFormData,
} from "../../common/methods.mjs";
import imagekitIo from "../../imagekit_io.app.mjs";

export default {
  key: "imagekit_io-upload-image",
  name: "Upload Image",
  version: "1.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Upload a new image to ImageKit.io. [See the documentation](https://docs.imagekit.io/api-reference/upload-file-api/server-side-file-upload)",
  type: "action",
  props: {
    imagekitIo,
    file: {
      type: "string",
      label: "File Path or URL",
      description: "The file to upload. Provide a file URL or a path to a file in the `/tmp` directory. This can be a binary file or a base64-encoded string.",
    },
    fileName: {
      type: "string",
      label: "File Name",
      description: "The name with which the file has to be uploaded. The file name can contain: - Alphanumeric Characters: **a-z , A-Z , 0-9** (including unicode letters, marks, and numerals in other languages) - Special Characters: **.** and **-** Any other character including space will be replaced by **_**",
    },
    useUniqueFileName: {
      type: "boolean",
      label: "Use Unique Filename",
      description: "Whether to use a unique filename for this file or not. If set **true**, ImageKit.io will add a unique suffix to the filename parameter to get a unique filename. If set **false**, then the image is uploaded with the provided filename parameter, and any existing file with the same name is replaced. Default Value is **True**",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Set the tags while uploading the file. `%` is not allowed. If this field is not specified and the file is overwritten then the tags will be removed.",
      optional: true,
    },
    folder: {
      type: "string",
      label: "Folder",
      description: "The folder path **(e.g. /images/folder/)** in which the image has to be uploaded. If the folder(s) didn't exist before, a new folder(s) is created. The nesting of folders can be at most 50 levels deep. The folder name can contain: - Alphanumeric Characters: **a-z , A-Z , 0-9** (including unicode letters, marks, and numerals in other languages). - Special Characters: **/**, **_** and **-**. - Using multiple / creates a nested folder.",
      optional: true,
    },
    isPrivateFile: {
      type: "boolean",
      label: "Is Private File",
      description: "Whether to mark the file as private or not. This is only relevant for image type files.",
      optional: true,
    },
    isPublished: {
      type: "boolean",
      label: "Is Published",
      description: "Whether to upload file as published or not. If set **false**, the file is marked as unpublished, which restricts access to the file only via the media library. Files in [draft or unpublished](https://docs.imagekit.io/media-library/overview/draft-assets) state can only be publicly accessed after being published. - The option to upload in draft state is only available in custom enterprise pricing plans.",
      optional: true,
    },
    customCoordinates: {
      type: "string",
      label: "Custom Coordinates",
      description: "Define an important area in the image. This is only relevant for image type files. The the format **x,y,width,height**. For example - **10,10,100,100**.",
      optional: true,
    },
    responseFields: {
      type: "string[]",
      label: "Response Fields",
      description: "A list of the fields that you want the API to return in the response. For example, set the value of this field to **tags**, **customCoordinates**, **isPrivateFile** to get the value of **tags**, **customCoordinates**, **isPublished** and **isPrivateFile** in the response. Accepts combination of **tags**, **customCoordinates**, **isPrivateFile**, **embeddedMetadata**, **customMetadata**, and **metadata**.",
      optional: true,
    },
    extensions: {
      type: "string[]",
      label: "Extensions",
      description: "An array of stringified object extensions to be applied to the image. For reference about extensions [read here](https://docs.imagekit.io/extensions/overview).",
      optional: true,
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "The final status of pending extensions will be sent to this URL. To learn more about how ImageKit uses webhooks, [refer here](https://docs.imagekit.io/extensions/overview#webhooks).",
      optional: true,
    },
    overwriteFile: {
      type: "boolean",
      label: "Overwrite File",
      description: "Default is **true**. If **overwriteFile** is set to **false** and **useUniqueFileName** is also **false**, and a file already exists at the exact location, upload API will return an error immediately.",
      optional: true,
    },
    overwriteAITags: {
      type: "boolean",
      label: "Overwrite AI Tags",
      description: "Default is **true**. If the request does not have **tags**, **overwriteTags** is set to **true** and a file already exists at the exact location, exiting **tags** will be removed. In case the request body has **tags**, setting **overwriteTags** to **false** has no effect and request's **tags** are set on the asset.",
      optional: true,
    },
    overwriteCustomMetadata: {
      type: "boolean",
      label: "Overwrite Custom Metadata",
      description: "Default is **true**. If the request does not have **customMetadata**, **overwriteCustomMetadata** is set to **true** and a file already exists at the exact location, exiting **customMetadata** will be removed. In case the request body has **customMetadata**, setting **overwriteCustomMetadata** to **false** has no effect and request's **customMetadata** is set on the asset.",
      optional: true,
    },
    customMetadata: {
      type: "object",
      label: "customMetadata",
      description: "A JSON key-value data to be associated with the asset. Checkout **overwriteCustomMetadata** parameter to understand default behaviour. Before setting any custom metadata on an asset you have to create the field using [custom metadata fields API](https://docs.imagekit.io/api-reference/custom-metadata-fields-api).",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      imagekitIo,
      file,
      customMetadata,
      extensions,
      ...appendData
    } = this;

    const data = await getFileFormData(file);

    if (extensions) {
      const processedExtensions = Array.isArray(extensions)
        ? extensions.map((item) => typeof item === "object"
          ? JSON.stringify(item)
          : item)
        : extensions;

      data.append("extensions", JSON.stringify(processedExtensions));
    }

    for (const [
      label,
      value,
    ] of Object.entries(appendData)) {
      data.append(label, value.toString());
    }

    if (customMetadata) {
      data.append("customMetadata", fieldToString(customMetadata));
    }

    const response = await imagekitIo.uploadImage({
      $,
      headers: data.getHeaders(),
      data,
    });

    $.export("$summary", `The file with Id: ${response.fileId} was successfully uploaded!`);
    return response;
  },
};
