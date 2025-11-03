import fs from "fs";
import constants from "../../common/constants.mjs";
import { cleanObj } from "../../common/utils.mjs";
import app from "../../qr_api.app.mjs";

export default {
  props: {
    app,
    filename: {
      type: "string",
      label: "Filename",
      description: "The filename that will be used to save in `/tmp` directory without extension",
    },
    size: {
      type: "string",
      label: "Size",
      description: "Parameter valid only if poster.url is not specified. Use this parameter to specify the size preset of the QR Code image (including Quiet Zone which is free area around QR Code to ensure scannability).",
      options: constants.SIZE_OPTIONS,
      optional: true,
    },
    quiteZone: {
      type: "string",
      label: "Quiet Zone",
      description: "Parameter valid only if poster.url is not specified. Use this parameter to specify the size of the Quiet Zone (which is free area around QR Code to ensure scannability). Set the Quiet Zone within a range of 0 to 12 (where 0 indicates no Quiet Zone and 12 the maximum). Tip: To achieve high scannability, it is recommended to set the Quiet Zone value to at least 4 or higher.",
      options: constants.QUITE_ZONE_OPTIONS,
      optional: true,
    },
    customSize: {
      type: "integer",
      label: "Custom Size",
      description: "Parameter valid only if parameter size is set to custom. Use this parameter to specify the custom size of the QR Code image in pixels (including Quiet Zone, which is free area around QR Code to ensure scannability).",
      min: 300,
      max: 6000,
      optional: true,
    },
    errorCorrection: {
      type: "string",
      label: "Error Correction",
      description: "Use this parameter to set error correction level of the QR Code. Error Correction helps maintain scannability of the QR Code even if there is some damage to data modules. Error correction is measured in damage in percentage (%) that it can sustain. Values are L (~7%), M (~15%), Q (~25%), and H (~30%).",
      options: constants.ERROR_CORRECTION_OPTIONS,
      optional: true,
    },
    dataPattern: {
      type: "string",
      label: "Data Pattern",
      description: "Parameter valid and required only if poster.url is not specified. Use this parameter to edit the pattern of data modules of the QR Code. Choose pattern value from drop-down. View all the data patterns [here](https://qrapi.io/patterns-design#dataPatterns).",
      options: constants.DATA_PATTERN_OPTIONS,
      optional: true,
    },
    eyePattern: {
      type: "string",
      label: "Eye Pattern",
      description: "Parameter valid and required only if poster.url is not specified. Use this parameter to edit the pattern of the eyes (position markers in the three corners) of the QR Code. Choose pattern value from drop-down. View all the eye patterns [here](https://qrapi.io/patterns-design#eyePatterns).",
      options: constants.EYE_PATTERN_OPTIONS,
      optional: true,
    },
    dataGradientStyle: {
      type: "string",
      label: "Data Gradient Style",
      description: "Parameter valid and required only if poster.url is not specified. Use this parameter to add a color gradient style to the group of data modules. Choose style value from drop-down. View all the gradient patterns [here](https://qrapi.io/patterns-design#gradientPatterns).",
      options: constants.DATA_GRADIENT_STYLE_OPTIONS,
      optional: true,
    },
    dataGradientStartColor: {
      type: "string",
      label: "Data Gradient Start Color",
      description: "Parameter valid and required only if poster.url is not specified. Use this parameter to EITHER add a color (in hex format #000000) to all data modules (if data_gradient_style is set to None) OR to add the start color to data modules (if data_gradient_style is not set to None).",
      optional: true,
    },
    dataGradientEndColor: {
      type: "string",
      label: "Data Gradient End Color",
      description: "Parameter valid only if poster.url is not specified and data_gradient_style is not set to None. Use this parameter to set the end color (in hex format #000000) to data modules.",
      optional: true,
    },
    eyeColorInner: {
      type: "string",
      label: "Eye Color Inner",
      description: "Parameter valid and required only if poster.url is not specified. Use this parameter to specify color (in hex format #000000) to the inner component of the QR Code (all three) eyes (position markers in the three corners).",
      optional: true,
    },
    eyeColorOuter: {
      type: "string",
      label: "Eye Color Outer",
      description: "Parameter valid and required only if poster.url is not specified. Use this parameter to specify color (in hex format #000000) to the outer component of the QR Code (all three) eyes (position markers in the three corners).",
      optional: true,
    },
    backgroundColor: {
      type: "string",
      label: "Background Color",
      description: "Parameter valid and required only if poster.url is not specified. Use this parameter to specify color (in hex format #000000) of the QR Codes' background including non-dark data modules. To remove background (i.e. make transparent), use value false. Tip: For highest scannability keep the background color as white i.e. #FFFFFF.",
      optional: true,
    },
    logoUrl: {
      type: "string",
      label: "Logo URL",
      description: "Parameter valid only if poster.url is not specified. Use this field if you want to design the QR Code with the 'Custom with Logo' feature. Otherwise, skip. Enter the URL of the image you want as a logo. Tip: Ensure the image source allows cross-domain access. Or simply use the Media feature to upload image and get URL or choose from our list of ready-made logos and icons. See the full list [here](https://qrapi.io/templates).",
      optional: true,
    },
    logoSize: {
      type: "integer",
      label: "Logo Size",
      description: "Parameter valid only if data in logo.url is specified. Enter the size of the logo image as a percentage (%) of size of logo. Tip: High logo size may make the QR Code unscannable. Test thoroughly before finalizing.",
      optional: true,
    },
    logoExcavated: {
      type: "boolean",
      label: "Logo Excavated",
      description: "Parameter valid only if data in logo.url is specified. Use this paramater to specify if the blocks around the logo should be remove (true) or should not be removed (false) Tip: If selecting true, set error correction to a higher-level to ensure loss of blocks doesn't affect scannability.",
      optional: true,
    },
    logoAngle: {
      type: "integer",
      label: "Logo Angle",
      description: "Parameter valid only if data in logo.url is specified. Use this parameter if you wish to rotate the image at an angle. Use values 1-359 (degrees) for clockwise rotation and -1 to -359 (degrees) for anti-clockwise rotation.",
      optional: true,
    },
    logoCache: {
      type: "boolean",
      label: "Logo Cache",
      description: "Parameter valid and required only if logo.url is specified. By default, it will be set to True. When set to True, the logo image provided will be cached for 10 minutes to improve performance. Set to False only if the image uploaded in the URL provided in logo.url field will change frequently, else skip.",
      optional: true,
    },
    posterUrl: {
      type: "string",
      label: "Poster URL",
      description: "Use this field if you want to design the QR Code with the 'Custom with Background' feature. Otherwise, skip. Enter the URL of the image you want as a background image. Tip: Ensure the image source allows cross-domain access. Or simply use the Media feature to upload image and get URL.",
      optional: true,
    },
    posterLeft: {
      type: "integer",
      label: "Poster Left",
      description: "Parameter valid only if poster.url is specified. This parameter will help you position the QR Code from the left edge of the uploaded background image. Specify value in percentage (%) where value is the distance between the left-edge of the image and the centre of the QR Code.Tip: Value 50 is placing the QR Code in the centre of the background image in terms of image width.",
      optional: true,
    },
    posterTop: {
      type: "integer",
      label: "Poster Top",
      description: "Parameter valid only if poster.url is specified. This parameter will help you position the QR Code from the top edge of the uploaded background image. Specify value in percentage (%) where value is the distance between the top-edge of the image and the centre of the QR Code.Tip: Value 50 is placing the QR Code in the centre of the background image in terms of image height.",
      optional: true,
    },
    posterSize: {
      type: "integer",
      label: "Poster Size",
      description: "Parameter valid only if poster.url is specified. This parameter will help you specify the size of the QR Code relative to the size of the uploaded background image. Specify value in percentage (%) where value is the ratio of QR Code size and Uploaded Image size.",
      optional: true,
    },
    posterEyeshape: {
      type: "string",
      label: "Poster Eye Shape",
      description: "Parameter valid only if poster.url is specified. Use this parameter to edit the pattern of the eyes (position markers in the three corners) of the QR Code. Choose pattern value from drop-down. View all the poster eye patterns [here](https://qrapi.io/patterns-design#eyePatterns).",
      options: constants.POSTER_EYE_SHAPE_OPTIONS,
      optional: true,
    },
    posterDataPattern: {
      type: "string",
      label: "Poster Data Pattern",
      description: "Parameter valid only if poster.url is specified. Use this parameter to edit the pattern of data modules of the QR Code. Choose pattern value from drop-down. View all the poster data patterns [here](https://qrapi.io/patterns-design#posterDataPatterns).",
      options: constants.POSTER_DATA_PATTERN_OPTIONS,
      optional: true,
    },
    format: {
      type: "string",
      label: "Format",
      description: "Format of QR Code",
      options: constants.FORMAT_OPTIONS,
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.createQrcode({
      type: this.getType(),
      $,
      maxBodyLength: Infinity,
      responseType: "arraybuffer",
      params: cleanObj({
        ...this.getParams(),
        format: this.format,
        size: this.size,
        quite_zone: this.quiteZone && parseInt(this.quiteZone),
        custom_size: this.customSize,
        error_correction: this.errorCorrection,
        data_pattern: this.dataPattern,
        eye_pattern: this.eyePattern,
        data_gradient_style: this.dataGradientStyle,
        data_gradient_start_color: this.dataGradientStartColor,
        data_gradient_end_color: this.dataGradientEndColor,
        eye_color_inner: this.eyeColorInner,
        eye_color_outer: this.eyeColorOuter,
        background_color: this.backgroundColor,
        ["logo.url"]: this.logoUrl,
        ["logo.size"]: this.logoSize,
        ["logo.excavated"]: this.logoExcavated,
        ["logo.angle"]: this.logoAngle,
        ["logo.cache"]: this.logoCache,
        ["poster.url"]: this.posterUrl,
        ["poster.left"]: this.posterLeft,
        ["poster.top"]: this.posterTop,
        ["poster.size"]: this.posterSize,
        ["poster.eyeshape"]: this.posterEyeshape,
        ["poster.dataPattern"]: this.posterDataPattern,
      }),
    });

    const buffer = new Buffer.from(response);
    const filePath = `/tmp/${this.filename}.${this.format}`;
    fs.writeFileSync(filePath, buffer);

    $.export("$summary", "Successfully created QR Code and saved to `/tmp` directory");
    return {
      filename: this.filename,
      filePath,
    };
  },
};
