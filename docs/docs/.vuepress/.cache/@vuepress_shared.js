import {
  isArray,
  isFunction,
  isPromise,
  isString
} from "./chunk-CROVZVFQ.js";
import {
  init_define_EXTERNAL_LINK_ICON_LOCALES,
  init_define_MZ_ZOOM_OPTIONS
} from "./chunk-2SZL67VI.js";

// dep:@vuepress_shared
init_define_EXTERNAL_LINK_ICON_LOCALES();
init_define_MZ_ZOOM_OPTIONS();

// node_modules/@vuepress/shared/lib/esm/index.js
init_define_EXTERNAL_LINK_ICON_LOCALES();
init_define_MZ_ZOOM_OPTIONS();

// node_modules/@vuepress/shared/lib/esm/types/index.js
init_define_EXTERNAL_LINK_ICON_LOCALES();
init_define_MZ_ZOOM_OPTIONS();

// node_modules/@vuepress/shared/lib/esm/types/head.js
init_define_EXTERNAL_LINK_ICON_LOCALES();
init_define_MZ_ZOOM_OPTIONS();

// node_modules/@vuepress/shared/lib/esm/types/locale.js
init_define_EXTERNAL_LINK_ICON_LOCALES();
init_define_MZ_ZOOM_OPTIONS();

// node_modules/@vuepress/shared/lib/esm/types/page.js
init_define_EXTERNAL_LINK_ICON_LOCALES();
init_define_MZ_ZOOM_OPTIONS();

// node_modules/@vuepress/shared/lib/esm/types/site.js
init_define_EXTERNAL_LINK_ICON_LOCALES();
init_define_MZ_ZOOM_OPTIONS();

// node_modules/@vuepress/shared/lib/esm/types/ssr.js
init_define_EXTERNAL_LINK_ICON_LOCALES();
init_define_MZ_ZOOM_OPTIONS();

// node_modules/@vuepress/shared/lib/esm/utils/index.js
init_define_EXTERNAL_LINK_ICON_LOCALES();
init_define_MZ_ZOOM_OPTIONS();

// node_modules/@vuepress/shared/lib/esm/utils/dedupeHead.js
init_define_EXTERNAL_LINK_ICON_LOCALES();
init_define_MZ_ZOOM_OPTIONS();

// node_modules/@vuepress/shared/lib/esm/utils/resolveHeadIdentifier.js
init_define_EXTERNAL_LINK_ICON_LOCALES();
init_define_MZ_ZOOM_OPTIONS();
var resolveHeadIdentifier = ([tag, attrs, content]) => {
  if (tag === "meta" && attrs.name) {
    return `${tag}.${attrs.name}`;
  }
  if (["title", "base"].includes(tag)) {
    return tag;
  }
  if (tag === "template" && attrs.id) {
    return `${tag}.${attrs.id}`;
  }
  return JSON.stringify([tag, attrs, content]);
};

// node_modules/@vuepress/shared/lib/esm/utils/dedupeHead.js
var dedupeHead = (head) => {
  const identifierSet = new Set();
  const result = [];
  head.forEach((item) => {
    const identifier = resolveHeadIdentifier(item);
    if (!identifierSet.has(identifier)) {
      identifierSet.add(identifier);
      result.push(item);
    }
  });
  return result;
};

// node_modules/@vuepress/shared/lib/esm/utils/ensureLeadingSlash.js
init_define_EXTERNAL_LINK_ICON_LOCALES();
init_define_MZ_ZOOM_OPTIONS();
var ensureLeadingSlash = (str) => str.replace(/^\/?/, "/");

// node_modules/@vuepress/shared/lib/esm/utils/ensureEndingSlash.js
init_define_EXTERNAL_LINK_ICON_LOCALES();
init_define_MZ_ZOOM_OPTIONS();
var ensureEndingSlash = (str) => /(\.html|\/)$/.test(str) ? str : str + "/";

// node_modules/@vuepress/shared/lib/esm/utils/formatDateString.js
init_define_EXTERNAL_LINK_ICON_LOCALES();
init_define_MZ_ZOOM_OPTIONS();
var formatDateString = (str, defaultDateString = "") => {
  const dateMatch = str.match(/\b(\d{4})-(\d{1,2})-(\d{1,2})\b/);
  if (dateMatch === null) {
    return defaultDateString;
  }
  const [, yearStr, monthStr, dayStr] = dateMatch;
  return [yearStr, monthStr.padStart(2, "0"), dayStr.padStart(2, "0")].join("-");
};

// node_modules/@vuepress/shared/lib/esm/utils/htmlEscape.js
init_define_EXTERNAL_LINK_ICON_LOCALES();
init_define_MZ_ZOOM_OPTIONS();
var htmlEscapeMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "'": "&#39;",
  '"': "&quot;"
};
var htmlEscapeRegexp = /[&<>'"]/g;
var htmlEscape = (str) => str.replace(htmlEscapeRegexp, (char) => htmlEscapeMap[char]);

// node_modules/@vuepress/shared/lib/esm/utils/htmlUnescape.js
init_define_EXTERNAL_LINK_ICON_LOCALES();
init_define_MZ_ZOOM_OPTIONS();
var htmlUnescapeMap = {
  "&amp;": "&",
  "&#38;": "&",
  "&lt;": "<",
  "&#60;": "<",
  "&gt;": ">",
  "&#62;": ">",
  "&apos;": "'",
  "&#39;": "'",
  "&quot;": '"',
  "&#34;": '"'
};
var htmlUnescapeRegexp = /&(amp|#38|lt|#60|gt|#62|apos|#39|quot|#34);/g;
var htmlUnescape = (str) => str.replace(htmlUnescapeRegexp, (char) => htmlUnescapeMap[char]);

// node_modules/@vuepress/shared/lib/esm/utils/isLinkExternal.js
init_define_EXTERNAL_LINK_ICON_LOCALES();
init_define_MZ_ZOOM_OPTIONS();

// node_modules/@vuepress/shared/lib/esm/utils/isLinkFtp.js
init_define_EXTERNAL_LINK_ICON_LOCALES();
init_define_MZ_ZOOM_OPTIONS();
var isLinkFtp = (link) => link.startsWith("ftp://");

// node_modules/@vuepress/shared/lib/esm/utils/isLinkHttp.js
init_define_EXTERNAL_LINK_ICON_LOCALES();
init_define_MZ_ZOOM_OPTIONS();
var isLinkHttp = (link) => /^(https?:)?\/\//.test(link);

// node_modules/@vuepress/shared/lib/esm/utils/isLinkExternal.js
var isLinkExternal = (link, base = "/") => {
  if (isLinkHttp(link) || isLinkFtp(link)) {
    return true;
  }
  if (link.startsWith("/") && !link.startsWith(base)) {
    return true;
  }
  return false;
};

// node_modules/@vuepress/shared/lib/esm/utils/isLinkMailto.js
init_define_EXTERNAL_LINK_ICON_LOCALES();
init_define_MZ_ZOOM_OPTIONS();
var isLinkMailto = (link) => /^mailto:/.test(link);

// node_modules/@vuepress/shared/lib/esm/utils/isLinkTel.js
init_define_EXTERNAL_LINK_ICON_LOCALES();
init_define_MZ_ZOOM_OPTIONS();
var isLinkTel = (link) => /^tel:/.test(link);

// node_modules/@vuepress/shared/lib/esm/utils/isPlainObject.js
init_define_EXTERNAL_LINK_ICON_LOCALES();
init_define_MZ_ZOOM_OPTIONS();
var isPlainObject = (val) => Object.prototype.toString.call(val) === "[object Object]";

// node_modules/@vuepress/shared/lib/esm/utils/normalizePackageName.js
init_define_EXTERNAL_LINK_ICON_LOCALES();
init_define_MZ_ZOOM_OPTIONS();
var normalizePackageName = (request, org, type = null) => {
  const orgPrefix = `${org}-`;
  const typePrefix = type === null ? "" : `${type}-`;
  const scopedMatch = request.match(/^@(.*)\/(.*)$/);
  if (scopedMatch === null) {
    if (request.startsWith(`${orgPrefix}${typePrefix}`)) {
      return request;
    }
    return `${orgPrefix}${typePrefix}${request}`;
  }
  const [, reqOrg, reqName] = scopedMatch;
  if (reqOrg === org) {
    if (reqName.startsWith(typePrefix)) {
      return request;
    }
    return `@${reqOrg}/${typePrefix}${reqName}`;
  }
  if (reqName.startsWith(`${orgPrefix}${typePrefix}`)) {
    return request;
  }
  return `@${reqOrg}/${orgPrefix}${typePrefix}${reqName}`;
};

// node_modules/@vuepress/shared/lib/esm/utils/removeEndingSlash.js
init_define_EXTERNAL_LINK_ICON_LOCALES();
init_define_MZ_ZOOM_OPTIONS();
var removeEndingSlash = (str) => str.replace(/\/$/, "");

// node_modules/@vuepress/shared/lib/esm/utils/removeLeadingSlash.js
init_define_EXTERNAL_LINK_ICON_LOCALES();
init_define_MZ_ZOOM_OPTIONS();
var removeLeadingSlash = (str) => str.replace(/^\//, "");

// node_modules/@vuepress/shared/lib/esm/utils/resolveLocalePath.js
init_define_EXTERNAL_LINK_ICON_LOCALES();
init_define_MZ_ZOOM_OPTIONS();
var resolveLocalePath = (locales, routePath) => {
  const localePaths = Object.keys(locales).sort((a, b) => {
    const levelDelta = b.split("/").length - a.split("/").length;
    if (levelDelta !== 0) {
      return levelDelta;
    }
    return b.length - a.length;
  });
  for (const localePath of localePaths) {
    if (routePath.startsWith(localePath)) {
      return localePath;
    }
  }
  return "/";
};

// node_modules/@vuepress/shared/lib/esm/utils/resolveRoutePathFromUrl.js
init_define_EXTERNAL_LINK_ICON_LOCALES();
init_define_MZ_ZOOM_OPTIONS();
var resolveRoutePathFromUrl = (url, base = "/") => url.replace(/^(https?:)?\/\/[^/]*/, "").replace(new RegExp(`^${base}`), "/");
export {
  dedupeHead,
  ensureEndingSlash,
  ensureLeadingSlash,
  formatDateString,
  htmlEscape,
  htmlUnescape,
  isArray,
  isFunction,
  isLinkExternal,
  isLinkFtp,
  isLinkHttp,
  isLinkMailto,
  isLinkTel,
  isPlainObject,
  isPromise,
  isString,
  normalizePackageName,
  removeEndingSlash,
  removeLeadingSlash,
  resolveHeadIdentifier,
  resolveLocalePath,
  resolveRoutePathFromUrl
};
//# sourceMappingURL=@vuepress_shared.js.map
