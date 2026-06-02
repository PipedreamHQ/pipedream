# Google Ads — Campaign Search Term View: Research & Implementation Notes

Session summary for the client request: *"add a new Google Ads action — `campaign_search_term_view`."*
Use this document to review the implementation against the client's forthcoming requirements.

---

## 1. What `campaign_search_term_view` actually is

It is **not a separate REST endpoint**. There is no `campaignSearchTermViews:get` / `:mutate` call in the Google Ads API. It is a **read-only reporting resource** ("view") that is queried via GAQL through the same mechanism every existing report action in this component already uses:

```
POST /v21/customers/{customerClientId}/googleAds:search   (GoogleAdsService.Search)
```

…with a GAQL `FROM campaign_search_term_view` clause. This maps directly onto the app's existing [`search()`](./google_ads.app.mjs) method and the [`createReportComponent`](./common/common-report.mjs) report pattern.

### Why it is read-only (not a `create-or-update` resource)

The component has two distinct resource families:

| | Mutable resources | View / report resources |
|---|---|---|
| Examples | `campaign`, `ad_group`, `ad_group_ad`, `campaign_budget`, `bidding_strategy` | `campaign_search_term_view`, `keyword_view`, plus `campaign`/`ad_group_ad` *as report sources* |
| API support | `:mutate` endpoint (create / update / remove) | `googleAds:search` only (GAQL query) |
| Action pattern | `create-or-update-*` (e.g. `mutateCampaign`) | `create-*-report` via `createReportComponent` |

The `_view` suffix is Google's convention for a **synthetic, query-only resource**: Google materializes its rows from the search terms that actually triggered your ads. You can only read it. Therefore the correct pattern is a **report action**, not a create-or-update action. This is consistent with the existing `get-keyword-quality-scores` action, which also just queries a `_view` (`keyword_view`).

### Distinguishing it from similarly-named resources

The client asked specifically for the **campaign-level** view. Related resources that were considered and **not** built (out of scope):

| Resource | Granularity / use |
|---|---|
| `search_term_view` | Search terms at **ad-group / keyword** level (classic Search campaigns) |
| **`campaign_search_term_view`** ✅ | Search terms aggregated at the **campaign** level — used where terms aren't tied to a specific keyword/ad group (e.g. Smart / Shopping / DSA) |
| `smart_campaign_search_term_view` | Smart campaigns only |
| `dynamic_search_ads_search_term_view` | DSA campaigns only |

> ⚠️ **Open scope question for the client:** confirm they specifically want the **campaign-level** `campaign_search_term_view`. If they actually need ad-group/keyword-level search terms, that is `search_term_view` (a different resource). Both can be added with the same pattern if required.

---

## 2. What was implemented

### New files

- **`common/resources/campaignSearchTermView.mjs`** — resource definition (`fields` / `segments` / `metrics` / `resourceOption`), same shape as `campaign.mjs` and `ad.mjs`. Field lists are the **authoritative v21 selectable fields** (provided by the user from the live reference page — see §4).
- **`actions/create-campaign-search-term-report/create-campaign-search-term-report.mjs`** — the action. ~15 lines, spreads `createReportComponent(campaignSearchTermView)`, mirroring `create-campaign-report`.
  - `key`: `google_ads-create-campaign-search-term-report`
  - `name`: **Create Campaign Search Term Report**
  - `version`: `0.0.1`
  - `annotations`: read-only (`destructiveHint: false`, `readOnlyHint: true`, `openWorldHint: true`)

### Shared-module change — `common/common-report.mjs`

A `_view` resource has **no `<resource>.id` field**, but the generic report builder previously hard-coded the filter clause as `WHERE <resource>.id IN (...)`. For this view that would have produced invalid GAQL (`campaign_search_term_view.id` does not exist) and a broken "Filter by" picker.

Fix: three **optional, backward-compatible** knobs were added to the resource contract, all defaulting to the previous behavior:

| Knob | Default | Purpose |
|---|---|---|
| `filterResource` | the resource's own `value` | which resource the "Filter by" picker lists |
| `filterLabel` | the resource's own `label` | the picker's label text |
| `filterField` | `<value>.id` (special-cased `ad_group_ad.ad.id`) | the GAQL field used in the `WHERE … IN (…)` clause |

`campaignSearchTermView.mjs` sets these to filter by **campaign** (`filterResource: "campaign"`, `filterLabel: "Campaign"`, `filterField: "campaign.id"`), since campaign is the natural attributed resource for this view.

**Backward compatibility verified:** for every existing resource (`campaign`, `ad_group`, `ad_group_ad`, `customer`) the generated query is byte-identical to before the change. `create-report.mjs` (the legacy combined action) has its own independent `buildQuery` and does **not** import the shared module, so it is unaffected.

### Version bumps

Because their bundled output now includes the edited shared module, the four consuming report actions were bumped:

| Component | Old → New |
|---|---|
| `create-campaign-report` | `0.0.3 → 0.0.4` |
| `create-ad-report` | `0.0.3 → 0.0.4` |
| `create-ad-group-report` | `0.0.3 → 0.0.4` |
| `create-customer-report` | `0.0.3 → 0.0.4` |
| package `@pipedream/google_ads` | `0.8.0 → 0.8.1` |
| **new** `create-campaign-search-term-report` | `0.0.1` |

---

## 3. The resulting action — behavior

Props (inherited from `createReportComponent`): account / managed account selectors, **Campaign(s)** filter (multi-select), date range (+ custom start/end), and multi-selects for **Fields**, **Segments**, **Metrics**, plus Order By / Direction / Limit.

Example generated GAQL (verified via the component's `buildQuery`):

```sql
SELECT campaign_search_term_view.search_term, segments.date, metrics.clicks, metrics.impressions
FROM campaign_search_term_view
WHERE campaign.id IN (1234567890)
AND segments.date DURING LAST_30_DAYS
ORDER BY metrics.clicks DESC
LIMIT 50
```

Returns `{ query, results }` and exports a `$summary` with the result count.

---

## 4. Data provenance & verification

- **Field/segment/metric lists**: the Google Ads field reference pages (`/fields/v21/...`) are JavaScript-rendered SPAs, so automated fetching only returned the nav shell. The **authoritative v21 lists were supplied by the user** from the live reference page and pasted in **verbatim**:
  - Reference: `https://developers.google.com/google-ads/api/fields/v21/campaign_search_term_view`
  - Final counts in the resource file: **3 attribute fields, 19 segments, 38 metrics.**
- **Checks performed this session:**
  - `eslint` clean on all new/changed files.
  - Module load verified (component resolves; `objectFilter` label resolves to "Campaign(s)").
  - `buildQuery` output verified to be valid GAQL.
  - Existing report actions confirmed to generate identical queries (no behavioral regression).

---

## 5. Review checklist against client requirements (to fill in)

- [ ] Confirm the resource is **campaign-level** (`campaign_search_term_view`), not ad-group-level (`search_term_view`).
- [ ] Confirm the **report** model (query-only) fits the use case — no create/update is possible for this resource.
- [ ] Confirm the **Campaign** filter is the desired scoping dimension (vs. e.g. unfiltered / account-wide).
- [ ] Confirm the exposed **fields / segments / metrics** cover what the client wants to report on.
- [ ] Confirm naming (**Create Campaign Search Term Report**) and whether the related `search_term_view` should also be added.
- [ ] Confirm desired output shape (`{ query, results }`) and whether pagination beyond the API default is required.
