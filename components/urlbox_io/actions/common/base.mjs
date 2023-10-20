import urlboxIo from "../../urlbox_io.app.mjs";
import { prepareData } from "../common/utils.mjs";

export default {
  props: {
    urlboxIo,
    format: {
      propDefinition: [
        urlboxIo,
        "format",
      ],
    },
    width: {
      propDefinition: [
        urlboxIo,
        "width",
      ],
    },
    height: {
      propDefinition: [
        urlboxIo,
        "height",
      ],
    },
    fullPage: {
      propDefinition: [
        urlboxIo,
        "fullPage",
      ],
    },
    selector: {
      propDefinition: [
        urlboxIo,
        "selector",
      ],
    },
    gpu: {
      propDefinition: [
        urlboxIo,
        "gpu",
      ],
    },
    blockAds: {
      propDefinition: [
        urlboxIo,
        "blockAds",
      ],
    },
    blockUrls: {
      propDefinition: [
        urlboxIo,
        "blockUrls",
      ],
    },
    hideCookieBanners: {
      propDefinition: [
        urlboxIo,
        "hideCookieBanners",
      ],
    },
    clickAccept: {
      propDefinition: [
        urlboxIo,
        "clickAccept",
      ],
    },
    hideSelector: {
      propDefinition: [
        urlboxIo,
        "hideSelector",
      ],
    },
    js: {
      propDefinition: [
        urlboxIo,
        "js",
      ],
    },
    css: {
      propDefinition: [
        urlboxIo,
        "css",
      ],
    },
    darkMode: {
      propDefinition: [
        urlboxIo,
        "darkMode",
      ],
    },
    retina: {
      propDefinition: [
        urlboxIo,
        "retina",
      ],
    },
    thumbWidth: {
      propDefinition: [
        urlboxIo,
        "thumbWidth",
      ],
    },
    thumbHeight: {
      propDefinition: [
        urlboxIo,
        "thumbHeight",
      ],
    },
    quality: {
      propDefinition: [
        urlboxIo,
        "quality",
      ],
    },
    transparent: {
      propDefinition: [
        urlboxIo,
        "transparent",
      ],
    },
    maxHeight: {
      propDefinition: [
        urlboxIo,
        "maxHeight",
      ],
    },
    download: {
      propDefinition: [
        urlboxIo,
        "download",
      ],
    },
    pdfPageSize: {
      propDefinition: [
        urlboxIo,
        "pdfPageSize",
      ],
    },
    pdfPageWidth: {
      propDefinition: [
        urlboxIo,
        "pdfPageWidth",
      ],
    },
    pdfPageHeight: {
      propDefinition: [
        urlboxIo,
        "pdfPageHeight",
      ],
    },
    pdfMargin: {
      propDefinition: [
        urlboxIo,
        "pdfMargin",
      ],
    },
    pdfMarginTop: {
      propDefinition: [
        urlboxIo,
        "pdfMarginTop",
      ],
    },
    pdfMarginRight: {
      propDefinition: [
        urlboxIo,
        "pdfMarginRight",
      ],
    },
    pdfMarginBottom: {
      propDefinition: [
        urlboxIo,
        "pdfMarginBottom",
      ],
    },
    pdfMarginLeft: {
      propDefinition: [
        urlboxIo,
        "pdfMarginLeft",
      ],
    },
    pdfScale: {
      propDefinition: [
        urlboxIo,
        "pdfScale",
      ],
    },
    pdfOrientation: {
      propDefinition: [
        urlboxIo,
        "pdfOrientation",
      ],
    },
    pdfBackground: {
      propDefinition: [
        urlboxIo,
        "pdfBackground",
      ],
    },
    disableLigatures: {
      propDefinition: [
        urlboxIo,
        "disableLigatures",
      ],
    },
    media: {
      propDefinition: [
        urlboxIo,
        "media",
      ],
    },
    force: {
      propDefinition: [
        urlboxIo,
        "force",
      ],
    },
    unique: {
      propDefinition: [
        urlboxIo,
        "unique",
      ],
    },
    ttl: {
      propDefinition: [
        urlboxIo,
        "ttl",
      ],
    },
    proxy: {
      propDefinition: [
        urlboxIo,
        "proxy",
      ],
    },
    header: {
      propDefinition: [
        urlboxIo,
        "header",
      ],
    },
    cookie: {
      propDefinition: [
        urlboxIo,
        "cookie",
      ],
    },
    userAgent: {
      propDefinition: [
        urlboxIo,
        "userAgent",
      ],
    },
    acceptLang: {
      propDefinition: [
        urlboxIo,
        "acceptLang",
      ],
    },
    authorization: {
      propDefinition: [
        urlboxIo,
        "authorization",
      ],
    },
    tz: {
      propDefinition: [
        urlboxIo,
        "tz",
      ],
    },
    delay: {
      propDefinition: [
        urlboxIo,
        "delay",
      ],
    },
    timeout: {
      propDefinition: [
        urlboxIo,
        "timeout",
      ],
    },
    waitUntil: {
      propDefinition: [
        urlboxIo,
        "waitUntil",
      ],
    },
    waitFor: {
      propDefinition: [
        urlboxIo,
        "waitFor",
      ],
    },
    waitToLeave: {
      propDefinition: [
        urlboxIo,
        "waitToLeave",
      ],
    },
    waitTimeout: {
      propDefinition: [
        urlboxIo,
        "waitTimeout",
      ],
    },
    scrollto: {
      propDefinition: [
        urlboxIo,
        "scrollto",
      ],
    },
    click: {
      propDefinition: [
        urlboxIo,
        "click",
      ],
    },
    clickAll: {
      propDefinition: [
        urlboxIo,
        "clickAll",
      ],
    },
    hover: {
      propDefinition: [
        urlboxIo,
        "hover",
      ],
    },
    bgColor: {
      propDefinition: [
        urlboxIo,
        "bgColor",
      ],
    },
    disable_js: {
      propDefinition: [
        urlboxIo,
        "disable_js",
      ],
    },
    fullWidth: {
      propDefinition: [
        urlboxIo,
        "fullWidth",
      ],
    },
    allowInfinite: {
      propDefinition: [
        urlboxIo,
        "allowInfinite",
      ],
    },
    skipScroll: {
      propDefinition: [
        urlboxIo,
        "skipScroll",
      ],
    },
    detectFullHeight: {
      propDefinition: [
        urlboxIo,
        "detectFullHeight",
      ],
    },
    maxSectionHeight: {
      propDefinition: [
        urlboxIo,
        "maxSectionHeight",
      ],
    },
    scrollIncrement: {
      propDefinition: [
        urlboxIo,
        "scrollIncrement",
      ],
    },
    scrollDelay: {
      propDefinition: [
        urlboxIo,
        "scrollDelay",
      ],
    },
    turbo: {
      propDefinition: [
        urlboxIo,
        "turbo",
      ],
    },
    highlight: {
      propDefinition: [
        urlboxIo,
        "highlight",
      ],
    },
    highlightfg: {
      propDefinition: [
        urlboxIo,
        "highlightfg",
      ],
    },
    highlightbg: {
      propDefinition: [
        urlboxIo,
        "highlightbg",
      ],
    },
    latitude: {
      propDefinition: [
        urlboxIo,
        "latitude",
      ],
    },
    longitude: {
      propDefinition: [
        urlboxIo,
        "longitude",
      ],
    },
    accuracy: {
      propDefinition: [
        urlboxIo,
        "accuracy",
      ],
    },
    useS3: {
      propDefinition: [
        urlboxIo,
        "useS3",
      ],
    },
    s3Path: {
      propDefinition: [
        urlboxIo,
        "s3Path",
      ],
    },
    s3Bucket: {
      propDefinition: [
        urlboxIo,
        "s3Bucket",
      ],
    },
    s3StorageClass: {
      propDefinition: [
        urlboxIo,
        "s3StorageClass",
      ],
    },
    failIfSelectorMissing: {
      propDefinition: [
        urlboxIo,
        "failIfSelectorMissing",
      ],
    },
    failIfSelectorPresent: {
      propDefinition: [
        urlboxIo,
        "failIfSelectorPresent",
      ],
    },
    failOn4xx: {
      propDefinition: [
        urlboxIo,
        "failOn4xx",
      ],
    },
    failOn5xx: {
      propDefinition: [
        urlboxIo,
        "failOn5xx",
      ],
    },
  },
  async run({ $ }) {
    const {
      urlboxIo,
      ...data
    } = this;

    const response = await urlboxIo.generateScreenshot({
      $,
      data: prepareData(data),
    });

    $.export("$summary", "Screenshot was successfully generated!");
    return response;
  },
};
