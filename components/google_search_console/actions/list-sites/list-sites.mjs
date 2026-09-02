import googleSearchConsole from "../../google_search_console.app.mjs";

const DOMAIN_PREFIX = "sc-domain:";

export default {
  name: "List Sites",
  description: "Lists every Google Search Console property the connected Google account can access, "
    + "together with the email address of that account."
    + "\n\n**Purpose.** Property identifiers are opaque strings that every other Search Console tool "
    + "requires byte-for-byte. This tool is where they come from, and it is also the only tool that "
    + "reports which Google account is connected."
    + "\n\n**When to use.** Call this FIRST on any per-site task, before running traffic, sitemap or "
    + "index-status tools, unless the user already gave you an exact identifier such as "
    + "`sc-domain:example.com`. Call it again after any 403 to see what the account really has. "
    + "Do NOT call it when Search Console cannot do the task at all - backlinks or the Links "
    + "report, requesting indexing of an ordinary page, adding or removing property owners: say "
    + "that first, and call this only if the user then asks for something the tools can do."
    + "\n\n**Returns.** `{ account_email, sites: [{ siteUrl, permissionLevel, property_type }], count }`. "
    + "`property_type` is `\"domain\"` when `siteUrl` starts with `sc-domain:` (that property covers "
    + "every subdomain and both http and https) and `\"url_prefix\"` otherwise (an exact scheme + host "
    + "+ path prefix, trailing slash included). Domain properties are listed first, then alphabetically. "
    + "The list is complete: the underlying API has no pagination. `account_email` is `null` when "
    + "the account's email could not be read; the site list is still returned."
    + "\n\n**Permission levels.** `siteOwner` - full access; can submit and delete sitemaps and inspect "
    + "URLs. `siteFullUser` - same data and sitemap access as an owner, but cannot manage users. "
    + "`siteRestrictedUser` - read-only on most reports; **cannot submit sitemaps and cannot inspect "
    + "URLs** (those calls return 403). `siteUnverifiedUser` - verification was never completed, so no "
    + "data is available. Check the level here before promising a write."
    + "\n\n**Cross-references.** Pass the `siteUrl` you find here into **Query Search Analytics** "
    + "(traffic, queries, pages), **Compare Search Analytics** (period-over-period deltas), **Inspect "
    + "URLs** (index status of individual pages), **List Sitemaps** (sitemap health) and **Submit "
    + "Sitemap** (submit or resubmit a sitemap)."
    + "\n\n**Parameter guidance.** None. This action takes no parameters."
    + "\n\n**Common mistakes.** Never construct a property identifier by hand; copy `siteUrl` verbatim "
    + "from this list. When several variants of one host are present (for example "
    + "`sc-domain:example.com`, `https://www.example.com/` and `http://example.com/`), prefer the "
    + "`sc-domain:` property for traffic questions because it aggregates every subdomain and scheme - "
    + "unless the user names a specific prefix, in which case use exactly that one. A URL-prefix "
    + "identifier missing its trailing slash, or with the wrong scheme or subdomain, returns 403 "
    + "\"User does not have sufficient permission for site\" even when the account is authorized."
    + "\n\n**Example.** No inputs -> "
    + "`{ account_email: \"owner@example.com\", count: 5, sites: ["
    + "{ siteUrl: \"sc-domain:example.com\", permissionLevel: \"siteOwner\", property_type: \"domain\" }, "
    + "{ siteUrl: \"http://example.com/\", permissionLevel: \"siteOwner\", property_type: \"url_prefix\" }, "
    + "{ siteUrl: \"https://www.example.com/\", permissionLevel: \"siteOwner\", property_type: \"url_prefix\" }] }`. "
    + "For \"how did example.com do last month?\" you would then call **Query Search Analytics** "
    + "with `siteUrl=\"sc-domain:example.com\"`."
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
