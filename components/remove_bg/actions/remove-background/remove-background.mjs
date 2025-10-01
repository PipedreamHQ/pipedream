// legacy_hash_id: a_4rioN5
import { axios } from "@pipedream/platform";

export default {
  key: "remove_bg-remove-background",
  name: "Remove background",
  description: "Remove the background of an image",
  version: "0.1.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    remove_bg: {
      type: "app",
      app: "remove_bg",
    },
    image_file: {
      type: "string",
      description: "Source image file (binary). (If this parameter is present, the other image source parameters must be empty.)",
      optional: true,
    },
    image_file_b64: {
      type: "string",
      description: "Source image file (base64-encoded string). (If this parameter is present, the other image source parameters must be empty.)",
      optional: true,
    },
    image_url: {
      type: "string",
      description: "Source image URL. (If this parameter is present, the other image source parameters must be empty.)",
    },
    size: {
      type: "string",
      description: "Maximum output image resolution: \"preview\" (default) = Resize image to 0.25 megapixels (e.g. 625×400 pixels)  0.25 credits per image, \"full\" = Use original image resolution, up to 25 megapixels (e.g. 6250x4000) with formats ZIP or JPG, or up to 10 megapixels (e.g. 4000x2500) with PNG  1 credit per image), \"auto\" = Use highest available resolution (based on image size and available credits). For backwards-compatibility this parameter also accepts the values \"medium\" (up to 1.5 megapixels) and \"hd\" (up to 4 megapixels) for 1 credit per image. The value \"full\" is also available under the name \"4k\" and the value \"preview\" is aliased as \"small\" and \"regular\".",
      optional: true,
    },
    type: {
      type: "string",
      description: "Foreground type: \"auto\" = Automatically detect kind of foreground, \"person\" = Use person(s) as foreground, \"product\" = Use product(s) as foreground. \"car\" = Use car as foreground,",
      optional: true,
    },
    format: {
      type: "string",
      description: "Result image format: \"auto\" = Use PNG format if transparent regions exist, otherwise use JPG format (default), \"png\" = PNG format with alpha transparency, \"jpg\" = JPG format, no transparency, \"zip\" = ZIP format, contains color image and alpha matte image, supports transparency (recommended).",
      optional: true,
    },
    roi: {
      type: "string",
      description: "Region of interest: Only contents of this rectangular region can be detected as foreground. Everything outside is considered background and will be removed. The rectangle is defined as two x/y coordinates in the format \"<x1> <y1> <x2> <y2>\". The coordinates can be in absolute pixels (suffix 'px') or relative to the width/height of the image (suffix '%'). By default, the whole image is the region of interest (\"0% 0% 100% 100%\").",
      optional: true,
    },
    crop: {
      type: "boolean",
      description: "Whether to crop off all empty regions (default: false). Note that cropping has no effect on the amount of charged credits.",
      optional: true,
    },
    crop_margin: {
      type: "string",
      description: "Adds a margin around the cropped subject (default: 0). Can be an absolute value (e.g. \"30px\") or relative to the subject size (e.g. \"10%\"). Can be a single value (all sides), two values (top/bottom and left/right) or four values (top, right, bottom, left). This parameter only has an effect when \"crop=true\". The maximum margin that can be added on each side is 50% of the subject dimensions or 500 pixels.",
      optional: true,
    },
    scale: {
      type: "string",
      description: "Scales the subject relative to the total image size. Can be any value from \"10%\" to \"100%\", or \"original\" (default). Scaling the subject implies \"position=center\" (unless specified otherwise).",
      optional: true,
    },
    position: {
      type: "string",
      description: "Positions the subject within the image canvas. Can be \"original\" (default unless \"scale\" is given), \"center\" (default when \"scale\" is given) or a value from \"0%\" to \"100%\" (both horizontal and vertical) or two values (horizontal, vertical).",
      optional: true,
    },
    channels: {
      type: "string",
      description: "Request either the finalized image (\"rgba\", default) or an alpha mask (\"alpha\"). Note: Since remove.bg also applies RGB color corrections on edges, using only the alpha mask often leads to a lower final image quality. Therefore \"rgba\" is recommended.",
      optional: true,
    },
    add_shadow: {
      type: "boolean",
      description: "Whether to add an artificial shadow to the result (default: false).",
      optional: true,
    },
    bg_color: {
      type: "string",
      description: "Adds a solid color background. Can be a hex color code (e.g. 81d4fa, fff) or a color name (e.g. green). For semi-transparency, 4-/8-digit hex codes are also supported (e.g. 81d4fa77). (If this parameter is present, the other bg_ parameters must be empty.)",
      optional: true,
    },
    bg_image_url: {
      type: "string",
      description: "Adds a background image from a URL. The image is centered and resized to fill the canvas while preserving the aspect ratio, unless it already has the exact same dimensions as the foreground image. (If this parameter is present, the other bg_ parameters must be empty.)",
      optional: true,
    },
    bg_image_file: {
      type: "string",
      description: "Adds a background image from a file (binary). The image is centered and resized to fill the canvas while preserving the aspect ratio, unless it already has the exact same dimensions as the foreground image. (If this parameter is present, the other bg_ parameters must be empty.)",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      image_file: this.image_file,
      image_file_b64: this.image_file_b64,
      image_url: this.image_url,
      size: this.size,
      type: this.type,
      format: this.format,
      roi: this.roi,
      crop: this.crop,
      crop_margin: this.crop_margin,
      scale: this.scale,
      position: this.position,
      channels: this.channels,
      add_shadow: this.add_shadow,
      bg_color: this.bg_color,
      bg_image_url: this.bg_image_url,
      bg_image_file: this.bg_image_file,
    };
    const config = {
      method: "post",
      url: "https://api.remove.bg/v1.0/removebg",
      headers: {
        "X-API-Key": `${this.remove_bg.$auth.api_key}`,
        "Accept": "application/json",
      },
      data,
    };
    return await axios($, config);
  },
};
