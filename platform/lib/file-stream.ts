import { Readable } from "stream";
import { ReadableStream } from "stream/web";
import {
  createReadStream, createWriteStream, promises as fs, Stats,
} from "fs";
import { tmpdir } from "os";
import {
  promises as dns, LookupAddress, LookupOptions,
} from "dns";
import { isIP } from "net";
import {
  join, basename,
} from "path";
import { pipeline } from "stream/promises";
import { v4 as uuidv4 } from "uuid";
import * as mime from "mime-types";
import {
  Agent as UndiciAgent, fetch as undiciFetch, Response as UndiciResponse,
} from "undici";

export interface FileMetadata {
  size: number;
  contentType?: string;
  lastModified?: Date;
  name?: string;
  etag?: string;
}

/**
 * @param pathOrUrl - a file path or a URL
 * @returns a Readable stream of the file content
 */
export async function getFileStream(pathOrUrl: string): Promise<Readable> {
  if (isDataUrl(pathOrUrl)) {
    return getDataUrlStream(pathOrUrl);
  } else if (isUrl(pathOrUrl)) {
    const response = await safeFetch(pathOrUrl);
    if (!response.ok || !response.body) {
      throw new Error(`Failed to fetch ${pathOrUrl}: ${response.status} ${response.statusText}`);
    }
    return Readable.fromWeb(response.body as ReadableStream<Uint8Array>);
  } else {
    await safeStat(pathOrUrl);
    return createReadStream(pathOrUrl);
  }
}

/**
 * @param pathOrUrl - a file path or a URL
 * @returns a Readable stream of the file content and its metadata
 */
export async function getFileStreamAndMetadata(pathOrUrl: string): Promise<{ stream: Readable; metadata: FileMetadata }> {
  if (isDataUrl(pathOrUrl)) {
    return getDataUrlStreamAndMetadata(pathOrUrl);
  } else if (isUrl(pathOrUrl)) {
    return await getRemoteFileStreamAndMetadata(pathOrUrl);
  } else {
    return await getLocalFileStreamAndMetadata(pathOrUrl);
  }
}

const ALLOWED_PROTOCOLS = new Set([
  "http:",
  "https:",
]);
const MAX_REDIRECTS = 5;
const REDIRECT_STATUS_CODES = new Set([
  301,
  302,
  303,
  307,
  308,
]);

function ipv4ToInt(ip: string): number {
  return ip.split(".").reduce((acc, octet) => (acc << 8) + Number(octet), 0) >>> 0;
}

interface Cidr4 {
  base: number;
  mask: number;
}

function parseCidr4(cidr: string): Cidr4 {
  const [
    base,
    bits,
  ] = cidr.split("/");
  const prefixLength = Number(bits);
  const mask = prefixLength === 0
    ? 0
    : (~0 << (32 - prefixLength)) >>> 0;
  return {
    base: ipv4ToInt(base) & mask,
    mask,
  };
}

// IANA special-purpose IPv4 address registry: ranges that are never globally reachable
// and must not be treated as a legitimate remote fetch destination.
const IPV4_BLOCKED_CIDRS: Cidr4[] = [
  "0.0.0.0/8", // "this network"
  "10.0.0.0/8", // private
  "100.64.0.0/10", // shared address space (CGNAT)
  "127.0.0.0/8", // loopback
  "169.254.0.0/16", // link-local, includes cloud metadata (169.254.169.254)
  "172.16.0.0/12", // private
  "192.0.0.0/24", // IETF protocol assignments
  "192.0.2.0/24", // documentation (TEST-NET-1)
  "192.88.99.0/24", // 6to4 relay anycast
  "192.168.0.0/16", // private
  "198.18.0.0/15", // benchmarking
  "198.51.100.0/24", // documentation (TEST-NET-2)
  "203.0.113.0/24", // documentation (TEST-NET-3)
  "224.0.0.0/4", // multicast
  "240.0.0.0/4", // reserved, includes 255.255.255.255/32 broadcast
].map(parseCidr4);

function isPrivateOrReservedIpv4(ip: string): boolean {
  const ipInt = ipv4ToInt(ip);
  return IPV4_BLOCKED_CIDRS.some(({
    base, mask,
  }) => (ipInt & mask) === base);
}

function ipv6ToBigInt(ip: string): bigint {
  let address = ip;
  // Expand an embedded IPv4 tail (e.g. "::ffff:192.168.1.1", "64:ff9b::192.168.1.1") to hex groups.
  const ipv4Tail = address.match(/(\d+\.\d+\.\d+\.\d+)$/);
  if (ipv4Tail) {
    const ipv4Int = ipv4ToInt(ipv4Tail[1]);
    const hi = (ipv4Int >>> 16).toString(16);
    const lo = (ipv4Int & 0xFFFF).toString(16);
    address = `${address.slice(0, -ipv4Tail[1].length)}${hi}:${lo}`;
  }

  let groups: string[];
  if (address.includes("::")) {
    const [
      head,
      tail,
    ] = address.split("::");
    const headParts = head
      ? head.split(":").filter(Boolean)
      : [];
    const tailParts = tail
      ? tail.split(":").filter(Boolean)
      : [];
    const missing = 8 - (headParts.length + tailParts.length);
    groups = [
      ...headParts,
      ...Array(missing).fill("0"),
      ...tailParts,
    ];
  } else {
    groups = address.split(":");
  }

  return groups.reduce((acc, part) => (acc << BigInt(16)) + BigInt(parseInt(part || "0", 16)), BigInt(0));
}

interface Cidr6 {
  base: bigint;
  bits: number;
}

function parseCidr6(cidr: string): Cidr6 {
  const [
    base,
    bits,
  ] = cidr.split("/");
  return {
    base: ipv6ToBigInt(base),
    bits: Number(bits),
  };
}

function matchesCidr6(ip: bigint, {
  base, bits,
}: Cidr6): boolean {
  if (bits === 0) return true;
  const shift = BigInt(128 - bits);
  return (ip >> shift) === (base >> shift);
}

// Special-purpose IPv6 ranges (RFC 4291, 6890, 6052, 7343, etc.), excluding IPv4-mapped
// addresses which are unwrapped and checked against the IPv4 rules instead.
const IPV6_BLOCKED_CIDRS: Cidr6[] = [
  "::/128", // unspecified
  "::1/128", // loopback
  "64:ff9b::/96", // NAT64 well-known prefix (embeds an IPv4 address)
  "100::/64", // discard-only
  "2001::/23", // IETF protocol assignments, includes Teredo (2001::/32)
  "2001:db8::/32", // documentation
  "fc00::/7", // unique local
  "fe80::/10", // link-local
  "ff00::/8", // multicast
].map(parseCidr6);

// ::ffff:0:0/96 -- IPv4-mapped addresses expressed as pure hex groups rather than a
// dotted IPv4 tail; the embedded IPv4 address is unwrapped and checked separately.
const IPV4_MAPPED_CIDR6 = parseCidr6("::ffff:0:0/96");

function isPrivateOrReservedIpv6(ip: string): boolean {
  const lower = ip.toLowerCase();
  const mappedDotted = lower.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mappedDotted) {
    return isPrivateOrReservedIpv4(mappedDotted[1]);
  }
  const value = ipv6ToBigInt(lower);
  if (matchesCidr6(value, IPV4_MAPPED_CIDR6)) {
    const embeddedIpv4 = Number(value & BigInt(0xFFFFFFFF));
    const octets = [
      24,
      16,
      8,
      0,
    ].map((shift) => (embeddedIpv4 >>> shift) & 0xFF);
    return isPrivateOrReservedIpv4(octets.join("."));
  }
  return IPV6_BLOCKED_CIDRS.some((cidr) => matchesCidr6(value, cidr));
}

function isPrivateOrReservedIp(ip: string): boolean {
  const version = isIP(ip);
  if (version === 4) return isPrivateOrReservedIpv4(ip);
  if (version === 6) return isPrivateOrReservedIpv6(ip);
  return true; // not a resolvable literal IP -- treat as unsafe by default
}

// Validates every address a hostname resolves to, at the exact moment a connection is
// made. This is passed as the `lookup` used by the dispatcher below so that resolution
// used for validation and resolution used to connect are one and the same -- closing the
// DNS-rebinding gap where the two would otherwise happen at different times.
function safeLookup(
  hostname: string,
  options: LookupOptions,
  callback: (err: Error | null, address: string | LookupAddress[], family?: number) => void,
): void {
  dns.lookup(hostname, {
    ...options,
    all: true,
  })
    .then((addresses) => {
      const candidates = options?.family
        ? addresses.filter((candidate) => candidate.family === options.family)
        : addresses;
      if (candidates.length === 0) {
        callback(new Error(`Could not resolve host: ${hostname}`), "");
        return;
      }
      for (const { address } of candidates) {
        if (isPrivateOrReservedIp(address)) {
          callback(new Error(`Refusing to connect to a private or reserved address (${address}) for ${hostname}`), "");
          return;
        }
      }
      if (options?.all) {
        callback(null, candidates);
      } else {
        callback(null, candidates[0].address, candidates[0].family);
      }
    })
    .catch((err) => callback(err, ""));
}

// A single shared dispatcher so remote fetches reuse pooled connections, matching the
// behavior of the global fetch() this replaces.
const safeAgent = new UndiciAgent({
  connect: {
    lookup: safeLookup,
  },
});

// Fetches a URL while guarding against SSRF: rejects unsupported protocols, rejects literal
// IP addresses that are private/reserved (net/tls skip the `lookup` hook entirely for
// literal IPs, so they must be checked here), pins every real connection to a validated
// address via safeLookup, and manually validates + re-checks every redirect hop rather than
// letting fetch follow redirects to an unvalidated destination automatically.
async function safeFetch(rawUrl: string, redirectsRemaining = MAX_REDIRECTS): Promise<UndiciResponse> {
  const parsed = new URL(rawUrl);
  if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
    throw new Error(`Refusing to fetch unsupported URL protocol: ${parsed.protocol}`);
  }
  // URL.hostname wraps IPv6 literals in brackets (e.g. "[::1]"); strip them before checking,
  // since isIP() and isPrivateOrReservedIp() operate on the bare address.
  const literalHostname = parsed.hostname.replace(/^\[(.+)\]$/, "$1");
  if (isIP(literalHostname) && isPrivateOrReservedIp(literalHostname)) {
    throw new Error(`Refusing to fetch from a private or reserved address (${literalHostname})`);
  }

  let response: UndiciResponse;
  try {
    response = await undiciFetch(parsed, {
      dispatcher: safeAgent,
      redirect: "manual",
    });
  } catch (err) {
    const cause = (err as { cause?: unknown })?.cause;
    throw cause instanceof Error
      ? cause
      : err;
  }

  if (REDIRECT_STATUS_CODES.has(response.status)) {
    const location = response.headers.get("location");
    if (!location) {
      return response;
    }
    if (redirectsRemaining <= 0) {
      throw new Error(`Too many redirects while fetching ${rawUrl}`);
    }
    return safeFetch(new URL(location, parsed).toString(), redirectsRemaining - 1);
  }

  return response;
}

function isUrl(pathOrUrl: string): boolean {
  try {
    new URL(pathOrUrl);
    return true;
  } catch {
    return false;
  }
}

function isDataUrl(pathOrUrl: string): boolean {
  return pathOrUrl.startsWith("data:");
}

interface ParsedDataUrl {
  mediaType: string;
  isBase64: boolean;
  data: string;
  name?: string;
}

function parseDataUrl(dataUrl: string): ParsedDataUrl {
  // Format: data:[<mediatype>][;parameter=value]*[;base64],<data>
  // Examples:
  //   data:image/png;base64,iVBORw0K...
  //   data:image/png;name=file.png;base64,iVBORw0K...
  //   data:text/plain,Hello%20World
  const match = dataUrl.match(/^data:([^;,]*)?(?:;([^,]*))?,([\s\S]*)$/);
  if (!match) {
    throw new Error("Invalid data URL format");
  }
  const [
    ,
    mediaType = "text/plain;charset=US-ASCII",
    params = "",
    data,
  ] = match;

  // Parse parameters (e.g., "name=file.png;base64" or just "base64")
  const paramParts = params.split(";").filter(Boolean);
  let isBase64 = false;
  let name: string | undefined;

  for (const param of paramParts) {
    if (param.toLowerCase() === "base64") {
      isBase64 = true;
    } else if (param.toLowerCase().startsWith("name=")) {
      name = decodeURIComponent(param.slice(5));
    } else if (param.toLowerCase().startsWith("filename=")) {
      name = decodeURIComponent(param.slice(9));
    }
  }

  return {
    mediaType,
    isBase64,
    data,
    name,
  };
}

function getDataUrlStream(dataUrl: string): Readable {
  const parsed = parseDataUrl(dataUrl);
  const buffer = parsed.isBase64
    ? Buffer.from(parsed.data, "base64")
    : Buffer.from(decodeURIComponent(parsed.data), "utf-8");
  return Readable.from(buffer);
}

function getDataUrlStreamAndMetadata(dataUrl: string): { stream: Readable; metadata: FileMetadata } {
  const parsed = parseDataUrl(dataUrl);
  const buffer = parsed.isBase64
    ? Buffer.from(parsed.data, "base64")
    : Buffer.from(decodeURIComponent(parsed.data), "utf-8");

  // Use name from data URL if available, otherwise generate from media type
  let name = parsed.name;
  if (!name) {
    const ext = mime.extension(parsed.mediaType);
    name = ext
      ? `file.${ext}`
      : "file";
  }

  const metadata: FileMetadata = {
    size: buffer.length,
    contentType: parsed.mediaType || undefined,
    name,
  };

  return {
    stream: Readable.from(buffer),
    metadata,
  };
}

async function safeStat(path: string): Promise<Stats> {
  try {
    return await fs.stat(path);
  } catch {
    throw new Error(`File not found: ${path}`);
  }
}

async function getLocalFileStreamAndMetadata(
  filePath: string,
): Promise<{ stream: Readable; metadata: FileMetadata }> {
  const stats = await safeStat(filePath);
  const contentType = mime.lookup(filePath) || undefined;
  const metadata: FileMetadata = {
    size: stats.size,
    lastModified: stats.mtime,
    name: basename(filePath),
    contentType,
  };
  const stream = createReadStream(filePath);
  return {
    stream,
    metadata,
  };
}

async function getRemoteFileStreamAndMetadata(url: string): Promise<{ stream: Readable; metadata: FileMetadata }> {
  const response = await safeFetch(url);
  if (!response.ok || !response.body) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  const headers = response.headers;
  const contentLength = headers.get("content-length");
  const lastModified = headers.get("last-modified")
    ? new Date(headers.get("last-modified")!)
    : undefined;
  const etag = headers.get("etag") || undefined;
  const urlObj = new URL(url);
  const name = basename(urlObj.pathname);
  const contentType = headers.get("content-type") || mime.lookup(urlObj.pathname) || undefined;

  const baseMetadata = {
    contentType,
    lastModified,
    name,
    etag,
  };

  // If we have content-length, we can stream directly
  if (contentLength) {
    const metadata: FileMetadata = {
      ...baseMetadata,
      size: parseInt(contentLength, 10),
    };
    const stream = Readable.fromWeb(response.body as ReadableStream<Uint8Array>);
    return {
      stream,
      metadata,
    };
  }

  // No content-length header - need to download to temporary file to get size
  return await downloadToTemporaryFile(response, baseMetadata);
}

async function downloadToTemporaryFile(response: UndiciResponse, baseMetadata: Partial<FileMetadata>): Promise<{ stream: Readable; metadata: FileMetadata }> {
  // Generate unique temporary file path
  const tempFileName = `file-stream-${uuidv4()}`;
  const tempFilePath = join(tmpdir(), tempFileName);
  // Download to temporary file
  const fileStream = createWriteStream(tempFilePath);
  const webStream = Readable.fromWeb(response.body as ReadableStream<Uint8Array>);
  try {
    await pipeline(webStream, fileStream);
    const stats = await fs.stat(tempFilePath);
    const metadata: FileMetadata = {
      ...baseMetadata,
      size: stats.size,
    };
    const stream = createReadStream(tempFilePath);

    const cleanup = async () => {
      try {
        await fs.unlink(tempFilePath);
      } catch {
        // Ignore cleanup errors
      }
    };

    stream.once("close", cleanup);
    stream.once("end", cleanup);
    stream.once("error", cleanup);

    return {
      stream,
      metadata,
    };
  } catch (err) {
    // Cleanup on error
    try { await fs.unlink(tempFilePath); } catch {
      // Ignore cleanup errors
    }
    throw err;
  }
}
