import googleSearchConsole from "../../google_search_console.app.mjs";

const DOMAIN_PREFIX = "sc-domain:";

export default {
  name: "List Sites",
  description: "Lists every Google Search Console property the connected Google account can access, "
    + "plus that account's email address."
    + "\n\n**Call this first** on any per-site task, unless the user already gave an exact identifier "
    + "such as `sc-domain:example.com`: every other tool needs the identifier byte-for-byte, and it "
    + "must be copied from here, never constructed. Call it again after a 403 to see what the account "
    + "really has."
    + "\n\n**Do NOT call it** when Search Console cannot do the task at all — backlinks or the Links "
    + "report, requesting indexing of an ordinary page, adding or removing property owners. Say that "
    + "first, and call this only if the user then asks for something the tools do cover."
    + "\n\n**Returns** `{ account_email, sites: [{ siteUrl, permissionLevel, property_type }], count }`, "
    + "domain properties first then alphabetical. The list is complete — the API has no pagination. "
    + "`property_type` is `\"domain\"` for an `sc-domain:` identifier (covers every subdomain and both "
    + "schemes — prefer it for traffic questions unless the user names a specific prefix) and "
    + "`\"url_prefix\"` otherwise (an exact scheme + host + path prefix, trailing slash included). "
    + "`account_email` is `null` if the email could not be read; the site list still returns."
    + "\n\n**Permission levels.** `siteOwner` and `siteFullUser` can submit and delete sitemaps and "
    + "inspect URLs (only an owner can manage users); `siteRestrictedUser` is read-only on reports and "
    + "**cannot submit sitemaps or inspect URLs** (403); `siteUnverifiedUser` has no data at all. Check "
    + "the level here before promising a write."
    + "\n\n**Mistakes.** A URL-prefix identifier with the wrong scheme or subdomain, or missing its "
    + "trailing slash, returns 403 \"User does not have sufficient permission for site\" even when the "
    + "account is authorized — so copy `siteUrl` verbatim. This action takes no parameters."
    + "\n\n[See the documentation](https://developers.google.com/webmaster-tools/v1/sites/list)",
  key: "google_search_console-list-sites",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    googleSearchConsole,
  },
  async run({ $ }) {
    const [
      sitesResponse,
      userInfo,
    ] = await Promise.all([
      this.googleSearchConsole.getSites({
        $,
      }),
      this.googleSearchConsole.getUserInfo({
        $,
      })
        .catch(() => null),
    ]);

    const sites = (sitesResponse?.siteEntry ?? []).map((entry) => ({
      siteUrl: entry?.siteUrl,
      permissionLevel: entry?.permissionLevel,
      property_type: String(entry?.siteUrl ?? "").startsWith(DOMAIN_PREFIX)
        ? "domain"
        : "url_prefix",
    }));

    sites.sort((a, b) => {
      if (a.property_type !== b.property_type) {
        return a.property_type === "domain"
          ? -1
          : 1;
      }
      return String(a.siteUrl).localeCompare(String(b.siteUrl));
    });

    const accountEmail = userInfo?.email ?? null;

    $.export("$summary", `Listed ${sites.length} Search Console properties for ${accountEmail ?? "the connected account"}`);

    return {
      account_email: accountEmail,
      sites,
      count: sites.length,
    };
  },
};
