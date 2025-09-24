import TLDs from "./tlds.mjs";

function isValidDomain(str) {
  return !!TLDs.find((tld) => {
    const i = str.lastIndexOf(tld);
    if (i === -1) {
      return false;
    }
    return str.charAt(i - 1) === "." && i === str.length - tld.length;
  });
}

function utf16IndexToUtf8Index(i, utf16) {
  const encoder = new TextEncoder();
  return encoder.encode(utf16.slice(0, i)).byteLength;
}

async function detectFacets(text, app) {
  let match;
  const facets = [];

  // mentions
  const re1 = /(^|\s|\()(@)([a-zA-Z0-9.-]+)(\b)/g;
  while ((match = re1.exec(text))) {
    if (!isValidDomain(match[3]) && !match[3].endsWith(".test")) {
      continue; // probably not a handle
    }

    const start = text.indexOf(match[3], match.index) - 1;
    const handle = await app.resolveHandle({
      params: {
        handle: match[3],
      },
    });
    facets.push({
      $type: "app.bsky.richtext.facet",
      index: {
        byteStart: utf16IndexToUtf8Index(start, text),
        byteEnd: utf16IndexToUtf8Index(start + match[3].length + 1, text),
      },
      features: [
        {
          $type: "app.bsky.richtext.facet#mention",
          did: handle.did, // must be resolved afterwards
        },
      ],
    });
  }

  // links
  const re2 =
      /(^|\s|\()((https?:\/\/[\S]+)|((?<domain>[a-z][a-z0-9]*(\.[a-z0-9]+)+)[\S]*))/gim;
  while ((match = re2.exec(text))) {
    let uri = match[2];
    if (!uri.startsWith("http")) {
      const domain = match.groups?.domain;
      if (!domain || !isValidDomain(domain)) {
        continue;
      }
      uri = `https://${uri}`;
    }
    const start = text.indexOf(match[2], match.index);
    const index = {
      start,
      end: start + match[2].length,
    };
      // strip ending puncuation
    if (/[.,;!?]$/.test(uri)) {
      uri = uri.slice(0, -1);
      index.end--;
    }
    if (/[)]$/.test(uri) && !uri.includes("(")) {
      uri = uri.slice(0, -1);
      index.end--;
    }
    facets.push({
      index: {
        byteStart: utf16IndexToUtf8Index(index.start, text),
        byteEnd: utf16IndexToUtf8Index(index.end, text),
      },
      features: [
        {
          $type: "app.bsky.richtext.facet#link",
          uri,
        },
      ],
    });
  }

  const re3 = /(?:^|\s)(#[^\d\s]\S*)(?=\s)?/g;
  while ((match = re3.exec(text))) {
    let [
      tag,
    ] = match;
    const hasLeadingSpace = /^\s/.test(tag);

    tag = tag.trim().replace(/\p{P}+$/gu, ""); // strip ending punctuation

    // inclusive of #, max of 64 chars
    if (tag.length > 66) continue;

    const index = match.index + (hasLeadingSpace
      ? 1
      : 0);

    facets.push({
      index: {
        byteStart: utf16IndexToUtf8Index(index, text),
        byteEnd: utf16IndexToUtf8Index(index + tag.length, text), // inclusive of last char
      },
      features: [
        {
          $type: "app.bsky.richtext.facet#tag",
          tag: tag.replace(/^#/, ""),
        },
      ],
    });
  }

  return facets.length > 0
    ? facets
    : undefined;
}

export default {
  detectFacets,
};
