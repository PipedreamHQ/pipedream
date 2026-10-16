// SSRF IP-literal classification for the EventDock Pipedream components.
//
// Ported logic-for-logic from the EventDock backend's canonical validator:
// eventdock-platform/apps/worker/src/routes/webhook-probe.ts
// (parseIPv4 / isPrivateIPv4 / expandIPv6 / isPrivateIPv6 / isPrivateIpLiteral).
//
// Keeping this in lock-step with the backend means the client-side check in the
// "Reliable HTTP Forward" action rejects exactly the same private / loopback /
// link-local / CGNAT / metadata / documentation / IPv6 ULA ranges the platform
// does — no partial, drifting subset. The EventDock BACKEND remains the
// authoritative guard (it re-resolves DNS and re-validates server-side); this is
// a fast client-side check that catches obvious literal-IP mistakes early.

/** Parse a dotted-quad IPv4 string into 4 octets, or null if not a valid IPv4. */
export function parseIPv4(host) {
  const m = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!m) return null;
  const octets = [
    Number(m[1]),
    Number(m[2]),
    Number(m[3]),
    Number(m[4]),
  ];
  if (octets.some((o) => o > 255)) return null;
  return octets;
}

/**
 * Returns true if the given IPv4 octets fall in a private, loopback,
 * link-local, reserved, or otherwise non-publicly-routable range.
 */
export function isPrivateIPv4(octets) {
  const [
    a,
    b,
  ] = octets;

  if (a === 0) return true; // 0.0.0.0/8 — "this network"
  if (a === 10) return true; // 10.0.0.0/8 — RFC1918 private
  if (a === 100 && b >= 64 && b <= 127) return true; // 100.64.0.0/10 — CGNAT (RFC6598)
  if (a === 127) return true; // 127.0.0.0/8 — loopback
  if (a === 169 && b === 254) return true; // 169.254.0.0/16 — link-local (incl. metadata)
  if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12 — RFC1918 private
  if (a === 192 && b === 0 && octets[2] === 0) return true; // 192.0.0.0/24 — IETF
  if (a === 192 && b === 0 && octets[2] === 2) return true; // 192.0.2.0/24 — TEST-NET-1
  if (a === 192 && b === 168) return true; // 192.168.0.0/16 — RFC1918 private
  if (a === 198 && (b === 18 || b === 19)) return true; // 198.18.0.0/15 — benchmarking
  if (a === 198 && b === 51 && octets[2] === 100) return true; // 198.51.100.0/24 — TEST-NET-2
  if (a === 203 && b === 0 && octets[2] === 113) return true; // 203.0.113.0/24 — TEST-NET-3
  if (a >= 224) return true; // 224/4 multicast, 240/4 reserved, 255.255.255.255 broadcast

  return false;
}

/**
 * Expand an IPv6 address (possibly with "::") into 8 16-bit groups, or null if
 * it cannot be parsed. Handles IPv4-mapped/embedded forms by converting the
 * trailing dotted-quad into two hextets.
 */
export function expandIPv6(input) {
  let host = input.trim();
  const pct = host.indexOf("%"); // strip zone id (fe80::1%eth0)
  if (pct !== -1) host = host.slice(0, pct);
  if (host.length === 0) return null;
  if (!host.includes(":")) return null;

  // Normalise an embedded IPv4 suffix (::ffff:127.0.0.1) into two hex groups.
  const lastColon = host.lastIndexOf(":");
  const tail = host.slice(lastColon + 1);
  const v4 = parseIPv4(tail);
  if (v4) {
    const hi = ((v4[0] << 8) | v4[1]).toString(16);
    const lo = ((v4[2] << 8) | v4[3]).toString(16);
    host = `${host.slice(0, lastColon + 1)}${hi}:${lo}`;
  }

  const doubleColon = host.split("::");
  if (doubleColon.length > 2) return null; // more than one "::" is invalid

  const toGroups = (s) => (s === "" ? [] : s.split(":"));

  let groups;
  if (doubleColon.length === 2) {
    const head = toGroups(doubleColon[0]);
    const back = toGroups(doubleColon[1]);
    const fill = 8 - head.length - back.length;
    if (fill < 0) return null;
    groups = [
      ...head,
      ...Array(fill).fill("0"),
      ...back,
    ];
  } else {
    groups = toGroups(host);
  }

  const nums = [];
  for (const g of groups) {
    if (g === "") return null;
    if (!/^[0-9a-fA-F]{1,4}$/.test(g)) return null;
    nums.push(parseInt(g, 16));
  }
  if (nums.length !== 8) return null;
  return nums;
}

/**
 * Returns true if the given IPv6 address is loopback, link-local, unique-local,
 * unspecified, or an IPv4-mapped/embedded address that maps to a private IPv4.
 */
export function isPrivateIPv6(groups) {
  if (groups.length !== 8) return true; // fail closed

  const [
    g0,
    g1,
    g2,
    g3,
    g4,
    g5,
    g6,
    g7,
  ] = groups;

  // :: (unspecified) and ::1 (loopback)
  if (g0 === 0 && g1 === 0 && g2 === 0 && g3 === 0 && g4 === 0 && g5 === 0 && g6 === 0) {
    if (g7 === 0 || g7 === 1) return true;
  }

  // IPv4-mapped (::ffff:a.b.c.d) and IPv4-compatible (::a.b.c.d).
  if (g0 === 0 && g1 === 0 && g2 === 0 && g3 === 0 && g4 === 0) {
    if (g5 === 0xffff || g5 === 0) {
      const a = (g6 >> 8) & 0xff;
      const b = g6 & 0xff;
      const c = (g7 >> 8) & 0xff;
      const d = g7 & 0xff;
      if (isPrivateIPv4([
        a,
        b,
        c,
        d,
      ])) return true;
      if (g5 === 0 && !(a === 0 && b === 0)) return true; // deprecated ::a.b.c.d
    }
  }

  if ((g0 & 0xffc0) === 0xfe80) return true; // fe80::/10 — link-local
  if ((g0 & 0xfe00) === 0xfc00) return true; // fc00::/7 — unique local (fc00::/fd00::)
  if ((g0 & 0xff00) === 0xff00) return true; // ff00::/8 — multicast
  if (g0 === 0x2001 && g1 === 0x0db8) return true; // 2001:db8::/32 — documentation

  // 64:ff9b::/96 NAT64 well-known prefix wraps an embedded IPv4.
  if (g0 === 0x0064 && g1 === 0xff9b && g2 === 0 && g3 === 0 && g4 === 0 && g5 === 0) {
    const a = (g6 >> 8) & 0xff;
    const b = g6 & 0xff;
    const c = (g7 >> 8) & 0xff;
    const d = g7 & 0xff;
    if (isPrivateIPv4([
      a,
      b,
      c,
      d,
    ])) return true;
  }

  return false;
}

/**
 * Normalise a hostname for literal classification: lowercase, strip a trailing
 * FQDN dot, and strip IPv6 brackets. (The host already comes from `URL`, so it's
 * a bare host with no scheme/port.)
 */
export function normalizeHostLiteral(host) {
  let h = String(host).trim().toLowerCase();
  if (h.endsWith(".")) h = h.slice(0, -1);
  if (h.startsWith("[") && h.endsWith("]")) h = h.slice(1, -1);
  return h;
}

/**
 * Classify a string that may be an IP literal. Returns true if it is a
 * private/reserved literal (must be blocked). If it is not a recognisable IP
 * literal it returns false (it is a hostname — DNS is the backend's job).
 */
export function isPrivateIpLiteral(host) {
  const h = normalizeHostLiteral(host);
  const v4 = parseIPv4(h);
  if (v4) return isPrivateIPv4(v4);
  const v6 = expandIPv6(h);
  if (v6) return isPrivateIPv6(v6);
  return false;
}
