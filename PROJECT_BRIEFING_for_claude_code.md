# Project Briefing: Rank & Rent Target List Website

Read this in full before doing anything else. This document contains everything
you need to build the site — you do not need to do any new research, web searches,
or market analysis. All the data below is already final and verified.

## What This Project Is

The user runs Rock Solid Tile, a tile installation contractor in Port Charlotte,
FL, and is exploring a "rank and rent" side business: build small local-SEO
websites targeting a specific service niche in a specific city, rank them on
Google, then rent the site/lead-flow to a real business owner in that niche once
it's producing calls. Over an extended research process, the user and a previous
Claude session worked out a rigorous methodology for finding which (niche, city)
combinations are actually winnable, and tested a large number of real candidates
using live Google Maps data.

## What To Build

**A personal data tool the user can browse and edit from phone or computer** —
not a marketing site, not a new research tool. Requirements:

1. **Full dataset, browsable and filterable.** All the target data below —
   niche, city, population, verdict (GOOD/MODERATE/AVOID), the actual top-3
   review counts, and notes — needs to be genuinely browsable, not just dumped
   as flat text. Filtering/sorting by verdict, by niche category, and probably
   by region/state would be useful. This is the part the user will reference
   most, so prioritize it.
2. **Full CRUD.** The user needs to be able to add a new listing, edit any
   field of an existing listing, and delete a listing, all from the UI itself
   — no code editing required for routine updates.
3. **Bulk import.** The user wants to hand the site a document containing new
   research findings (formatted similarly to the tables in this briefing — a
   niche name, a city, review counts, a verdict) and have it added to the
   dataset without manually re-typing every field. A simple, well-documented
   paste-in format (e.g., a textarea that accepts one listing per line in a
   defined pattern, or a small CSV/table upload) is sufffiction — this does not
   need AI-powered free-text parsing unless that's easy to add; a clear
   structured format the user pastes into is a perfectly good solution.
4. **Playbook / strategy content** should live as readable page(s) on the site
   too (Section: "The Playbook" below) — this is reference material, not part
   of the editable dataset.
5. **Methodology summary** should be visible somewhere on the site (Section:
   "How This Data Was Gathered" below) so the numbers make sense at a glance.
6. Needs to work well on both a phone browser and a desktop browser. Keep it
   fast and simple — this is a working reference tool for one person, not a
   product.
7. Since it needs to persist edits/additions long-term, use a real lightweight
   database or persistent storage rather than in-memory/static data — use your
   judgment on the simplest approach that reliably survives restarts (e.g.
   SQLite file, or whatever fits the hosting approach you choose).

## How This Data Was Gathered (methodology — include as a page on the site)

Every (niche, city) pair below was evaluated using this process:

1. Search Google Maps for `[niche] [city, state]` and read the actual local
   3-pack / map pack results — business name, category, review count.
2. **Relevance-filter the results.** Google Maps text search often returns
   businesses that share a keyword but don't actually compete for the specific
   service (examples encountered repeatedly: piano tuners showing up for "pipe
   organ repair," dentist offices showing up for "dental equipment repair,"
   thrift/clothing stores showing up for "closet organization," truck weigh
   stations showing up for "scale calibration," a replacement-window company
   showing up for "historic window restoration"). These are excluded from the
   competitive read entirely, regardless of review count.
3. **Scoring rule**, applied to the top 3 genuinely relevant results by review
   count:
   - **GOOD** — only one of the three sits in the ~50–100+ review range, and
     the other two are meaningfully below it (well under 50). Realistically
     winnable — not fighting for #1, fighting for #2 or #3, which still means
     real leads.
   - **MODERATE** — two or all three of the top results sit at/above ~50–100
     reviews. Harder, still possibly worth it.
   - **AVOID** — real dominant incumbents (multiple in the hundreds), or a
     single wildly dominant outlier (200+) combined with non-trivial #2/#3
     too.
   - A franchise or company merely *claiming* to serve a wide area does not
     count against a niche — only what actually shows up with real reviews in
     that specific city's map pack counts.
4. **Every niche marked GOOD or MODERATE was tested in at least two different,
   comparably-sized towns in different regions of the country** before being
   trusted — single-city results were repeatedly shown to be misleading in
   both directions (regional climate effects, cultural/historical depth of a
   trade in a given region, and town population size all change competition
   levels independently of the niche itself).
5. Two extra failure modes to watch for, independent of review count:
   - **Channel mismatch** — the map pack returns almost nothing relevant
     because real buyers of that service don't discover vendors through
     Google Maps at all (e.g. grain bin cleaning — farm co-ops source vendors
     through industry relationships, not search).
   - **Category collision** — the search term itself returns an entirely
     different, unrelated business type (e.g. "EV charger installation"
     returning physical charging stations; "tower clock repair" returning
     consumer watch/jewelry shops).

## The Full Target List

### Tier 1 — Institutional / B2B Buyer Niches (Confirmed GOOD, Multi-Region)

The buyer is a business, church, school, or facility manager, not a
homeowner — reliably thin because consumer lead-gen platforms never built
coverage.

| Niche | City / Population | Top-3 reviews | City / Population | Top-3 reviews | Verdict | Notes |
|---|---|---|---|---|---|---|
| Pipe organ tuning/repair | Denver, CO (~715,000) | 0, 1, 2 | Portland, OR (~635,000) | 1, 1, 3 | GOOD | Also tested Salt Lake City, UT (~200,000): 2, 8, 22, and Birmingham, AL (~197,000): 4, 15, 169 — more contested but still workable |
| Forklift repair | Boise, ID (~235,000) | 1–26 range across 9 results | Chattanooga, TN (~185,000) | 23, 49, 54 | GOOD | |
| Elevator inspection | Boise, ID (~235,000) | 0–21 range across 9 results | Chattanooga, TN (~185,000) | 0, 4, 5, 9, 47 | GOOD | Even Otis/Schindler/KONE/TK Elevator show under 10 reviews locally |
| Warehouse pallet racking install/repair | Boise, ID (~235,000) | 0, 0, 2, 2, 4, 5, 12 | Chattanooga, TN (~185,000) | 17, 18, 25 | GOOD | |
| Industrial scale calibration | Boise, ID (~235,000) | 0, 3, 3, 5, 8 | Chattanooga, TN (~185,000) | 2, 14, 32 | GOOD | Watch for truck weigh-stations polluting results |
| Vending machine repair | Boise, ID (~235,000) | 8, 8, 13 | Chattanooga, TN (~185,000) | 6, 7, 22 | GOOD | Watch for laundromats/appliance repair polluting results |
| Dental equipment repair | Boise, ID (~235,000) | 3, 11 | Chattanooga, TN (~185,000) | 1, 1, 2 | GOOD | Watch for dentist offices (not repairers) polluting results |
| Church steeple/bell tower repair | Denver, CO (~715,000) | no real specialist present | Nashville, TN (~685,000) | 0, 1 (the two "nationwide" specialists that appear) | GOOD | |
| Playground equipment (CPSI) inspection | Boise, ID (~235,000) | 0 for real specialist | Chattanooga, TN (~185,000) | 0 for real specialist | GOOD | Watch for general home inspectors polluting results |
| Historic wood window restoration | Bangor, ME (~32,000) | 3 | Galena, IL (~3,300) | 4 | GOOD | Watch for replacement-window companies polluting results |
| Commercial kitchen hood cleaning | Boise, ID (~235,000) | 0–62 range | Chattanooga, TN (~185,000) | 1, 4, 6 (only 3 total results) | GOOD | |
| Fire alarm system inspection | Boise, ID (~235,000) | 29, 45, 78 (MODERATE) | Hattiesburg, MS (~48,700) | 13, 13, 40 (GOOD) | GOOD in smaller market | |

### Tier 1 — Fragmented Small-Business / Everyday Niches (Confirmed GOOD, Multi-Region)

No license required; competitors are just thin/weak digitally.

| Niche | City / Population | Top-3 reviews | City / Population | Top-3 reviews | 3rd City | Verdict | Notes |
|---|---|---|---|---|---|---|---|
| Interior design / home decorating | Port Charlotte, Punta Gorda, Sebring, Arcadia, Wauchula, FL (5 towns, ~10,000–60,000 each) | 0–97 range across 5 towns | Twin Falls, ID (~51,000) | 5, 6, 16 | — | GOOD | Best/most repeatable find of the whole project |
| Tile installation | Twin Falls, ID (~51,000) | 4, 7, 17 | Hattiesburg, MS (~48,700) | 0, 25, 32 | — | GOOD | User's own trade — real personal evaluation edge |
| Concrete / driveway contractor | Twin Falls, ID (~51,000) | 24, 40, 124 (outlier) | Hattiesburg, MS (~48,700) | 6, 18, 35 | Mankato, MN (~46,000) | GOOD | Most consistent result across all 3 regions |
| Cabinet refacing / countertops | Twin Falls, ID (~51,000) | 32, 36, 124 (outlier) | Hattiesburg, MS (~48,700) | 21, 24, 32 | Mankato, MN (~46,000): 16, 16, 64 | GOOD | |
| Deck building | Twin Falls, ID (~51,000) | 20, 39, 52 | Hattiesburg, MS (~48,700) | 23, 24, 58 | Mankato, MN (~46,000): 10, 45, 138 (outlier) | GOOD | True deck specialists all under 5 reviews in Mankato |
| Well pump repair/service | Twin Falls, ID (~51,000) | 28, 30, 47 | Rural Maine (small towns) | one 477-review regional outlier found | — | GOOD | Treat the Maine outlier as an exception, not the norm; check each specific market |
| Screened porch / sunroom construction | Hattiesburg, MS (~48,700) | 19, 19, 76 | Twin Falls, ID (~51,000) | 3, 20, 62 | — | GOOD | |
| Custom shed building | Twin Falls, ID (~51,000) | 33, 47, 62 | Hattiesburg, MS (~48,700) | 23, 29, 42 | — | GOOD | |
| Closet organization/installation | Twin Falls, ID (~51,000) | 17, 18, 20 | Hattiesburg, MS (~48,700) | 10, 29 (only 2 relevant) | — | GOOD | Search term collides badly with thrift/clothing stores — filter aggressively every time |
| Driveway / asphalt sealcoating | Twin Falls, ID (~51,000) | 14, 17, 24 | Hattiesburg, MS (~48,700) | 18, 19, 35 | — | GOOD | Distinct from concrete contractors |
| Fence installation | Hattiesburg, MS (~48,700) | 22, 26, 42 | Twin Falls, ID (~51,000) | 91, 115, 124 (tougher) | — | GOOD (town-dependent) | Check locally |
| Flooring installation | Hattiesburg, MS (~48,700) | 25, 30, 66 | Twin Falls, ID (~51,000) | 80, 88, 129 (tougher) | — | GOOD (town-dependent) | Check locally |
| Kitchen remodeling | Hattiesburg, MS (~48,700) | 23, 24, 32 | Twin Falls, ID (~51,000) | 39, 69, 71 (moderate) | — | GOOD (town-dependent) | Check locally |
| House painting | Hattiesburg, MS (~48,700) | 29, 29, 32 | Twin Falls, ID (~51,000) | 54, 74, 90 (moderate) | Chattanooga, TN (~185,000): 224, 348, 420 (AVOID) | Size-dependent | Avoid larger metros (150k+) for this one |

### Tier 2 — MODERATE (Real but More Contested, Confirmed Consistent)

| Niche | City / Population | Top-3 reviews | City / Population | Top-3 reviews | Notes |
|---|---|---|---|---|---|
| Landscaping design | Twin Falls, ID (~51,000) | 47, 63, 179 (outlier) | Hattiesburg, MS (~48,700) | 42, 50, 58 | One dominant #1 in most markets, #2/#3 still workable |
| Auto detailing | Twin Falls, ID (~51,000) | 61, 70, 126 | Hattiesburg, MS (~48,700) | 30, 56, 61 | |
| Fire sprinkler system inspection | Boise, ID (~235,000) | dense field, individually beatable | Chattanooga, TN (~185,000) | 26, 28, 36 | Real recurring commercial compliance demand |
| Parking lot striping/sealcoating | Boise, ID (~235,000) | dense field, individually beatable | Chattanooga, TN (~185,000) | 48, 56, 71 | |
| Bronze statue/monument conservation | Philadelphia, PA (~1,550,000) | 0, 17 | Chicago, IL (~2,700,000) | 13, 36, 98 (more contested) | Likely low real search volume (rare/institutional purchase); city-size dependent; lowest priority on this list |
| Cemetery monument/headstone restoration | York, PA (~44,000) | 1, 22, 29 (GOOD) | Springfield, MA (~155,000) | 10, 15, 227 (outlier — AVOID) | Region-dependent — New England has a much deeper monument-making tradition; check locally, don't assume it travels |

### Tier 3 — AVOID (Confirmed Real Incumbents — full detail, do not re-test without new evidence)

| Niche | City tested | Top reviews found | Why avoid |
|---|---|---|---|
| Boat lift repair | Punta Gorda, FL (~19,000) | 510 (top competitor, 4.8★) | Extremely dominant local incumbent |
| Marine dock/seawall repair | Charlotte County, FL | 510, 180 | Same dominant incumbent plus a second strong player |
| Mobile home skirting/leveling | Zephyrhills, FL (~17,000) | 34, 123, 163, 386 | Real established incumbents despite looking thin on web search |
| Stained glass restoration | Boise ID, Denver CO, Salt Lake City UT, Birmingham AL | national operators "Church Stained Glass Restoration" and "Scottish Stained Glass" confirmed present with real local reviews in every region checked | Deep, genuine local-SEO colonization, not just organic content |
| Artificial turf installation | New Holland, PA — GOOD; Ohio (various towns) — AVOID | PA: thin, real. OH: "Turf Pros Solution" templated operator covers nearly every town | State-dependent, do not assume it generalizes |
| Marine dock/boat lift ("any smaller lake" strategy) | Lake Wateree, SC (deliberately obscure test) | 5+ established competitors incl. a lake-specific landing page | General strategy failed; Florida-specific finding above still stands separately |
| Carpet cleaning | Twin Falls, ID | 278, 411, 435 | |
| Window replacement | Twin Falls, ID | 191, 258, 288, 722 (DaBella franchise) | |
| Siding installation | Twin Falls, ID | 258, 722 (DaBella) | |
| Gutter installation | Twin Falls, ID | 115, 117, 204/205, 722 (DaBella) | |
| Water heater/plumbing | Twin Falls, ID | 1,619, 1,655, 2,435 | |
| Dryer vent cleaning | Twin Falls, ID | 236, 1,263, 1,619 (general HVAC giants) | |
| Fireplace installation/repair | Twin Falls, ID | 114–1,655 range (HVAC collision) | |
| Basement waterproofing | Twin Falls, ID | up to 278 (water damage restoration collision) | |
| Retaining wall installation | Twin Falls, ID | up to 179 | Not a distinct niche — same pool as landscaping/concrete |
| Paver/hardscape installation | Twin Falls, ID | same as landscaping | Not a distinct niche |
| Epoxy garage floor coating | Boise, ID | 26–137 across 9 competitors | |
| Crawl space encapsulation | Boise, ID | 44–176 | |
| Pool resurfacing/replastering | Boise, ID | up to 271 | |
| Commercial security camera/access control | Boise, ID | up to 410, plus a regional consolidator | |
| Garage/commercial door repair | Boise, ID | up to 1,015 | Collides with residential garage door giants |
| Septic system inspection (real estate) | Boise, ID | up to 2,126 | |
| Certified arborist/tree services | Boise, ID | up to 510, incl. SavATree franchise | |
| Dumpster/compactor repair | Boise, ID | up to 1,439 (Junk King) | Collides with dumpster rental |
| Propane tank installation | Boise, ID | up to 414 | National propane franchises |
| Antique/player piano restoration | Denver, CO | up to 305 | |
| Flagpole installation | Denver, CO | up to 451 | |
| Locksmith/safe & vault work | Denver, CO | up to 2,040 | |
| Grease trap cleaning | Boise, ID | up to 1,664 | Plumbing giants |
| Wheelchair/mobility scooter repair | Boise, ID | up to 207, incl. national franchises (Mobility City, 101 Mobility) | |
| Commercial fitness/gym equipment repair | Boise, ID | 127 (Gym Masters) | |
| Commercial laundry equipment repair | Boise, ID | up to 173 | Collides with general appliance repair |
| Pool table/billiards repair | Boise, ID | up to 91 | |
| Portable restroom/event rental | Boise, ID | 9+ real competitors incl. national player United Site Services | |
| Tree removal/trimming | Twin Falls, ID (moderate: 29, 32, 290 outlier) → Hattiesburg, MS | 94, 118, 127 (AVOID) | Worse in storm-prone Southern regions |
| Moving companies | Twin Falls, ID (moderate: 80, 88, 123) → Hattiesburg, MS | 204, 493, 538 (College Hunks franchise) | Worse in 2nd region |
| Pressure washing | Twin Falls, ID (GOOD: 45, 47, 80) → Hattiesburg, MS and Mankato, MN | Hattiesburg: 123, 149, 310. Mankato: 197, 208, 221 | Climate-dependent — dry Mountain West only, avoid humid regions |
| Chimney sweep, radon mitigation, mudjacking/concrete leveling, Christmas light installation, standby generators, stairlifts, septic pumping | Multiple towns across FL, OH, KS, NE, IA, MO, VT, MT | All colonized by national franchises/multi-city templated operators, several confirmed reaching towns as small as ~1,200 people | See Playbook notes on franchise colonization |
| EV charger installation | Multiple attempts, VT/NH area | Category collision (results are physical charging stations, not installers); also intercepted by Qmerit, a massive automaker-referral network | Structurally poor fit for local-search lead gen |
| Tower clock repair | Denver, CO | Category collision (results are consumer watch/jewelry repair shops) | Real specialists exist but hard to search for cleanly |
| Grain bin/silo cleaning | Grand Island, NE | Zero relevant results (dumpster rental, hazmat companies only) | Channel mismatch — real buyers don't use Google Maps for this |

## The Playbook (business strategy — separate from the target list above)

### Is Rank & Rent Still Viable?
Yes, but the model has matured. Mainstream consumer home-service trades are
colonized nationwide by franchises/multi-city operators even in towns of
~1,200 people — town size does not protect you. The categories that work now
are structurally different from the classic playbook: institutional/B2B buyer
niches and fragmented small-business niches (see target list above), not
generic "plumber/electrician/landscaper."

### Realistic Timeline
- **Organic-only phase (no Google Business Profile yet):** Months 1–2, site
  indexed, ranking page 2–3, minimal leads. Months 3–4, early long-tail
  movement, a lead trickle begins. Months 5–6, first-page rankings on core
  terms — this is when the site is demo-able to a prospective tenant.
- **After adding a GBP (month 6+):** Weeks 1–2, listing goes live for
  low-competition long-tail searches. Weeks 4–8, real map-pack movement as
  reviews/citations build. Months 3–6 post-GBP, competitive positions on core
  terms.

### Building Multiple Sites Without Triggering Spam Detection
- Stagger builds — don't launch everything on the same day from the same
  IP/registrar/template.
- Genuinely differentiate design, hosting, and content between sites.
- Write real, specific local content, not templated city-swaps.
- Use a real, working phone number with call tracking from day one (Google
  Voice or CallRail), forwarded to yourself before a tenant exists, so there's
  provable lead data to demo.
- Word every site as a referral/marketing service connecting customers to
  licensed providers — not as the business itself offering the (possibly
  licensed) work. This both reduces spam-policy risk and sidesteps
  advertising-disclosure law concerns for regulated trades.
- Recommended pace: 2–3 sites at a time, well differentiated, not 10 at once.

### Domains & Hosting
- Registrar (Namecheap, GoDaddy, Cloudflare) = where the domain is purchased.
  Host (Netlify) = where the site actually lives. Buy from a registrar, point
  DNS at Netlify.
- Always use a real custom domain, never the free `netlify.app` subdomain —
  it hurts conversion trust and citation-building.
- Spread domain purchases across a couple of registrars and stagger purchase
  dates to avoid an obvious "network" footprint.

### International Expansion
The premise that other English-speaking countries are automatically less
saturated than the US does not hold up. The US advantage is sheer size (a
huge number of mid-size towns), not lower saturation generally.
- **Canada** is the most natural fit if expanding — same map-pack mechanics,
  similar franchise landscape, large landmass with many mid-size towns
  similar to the US pattern. Quebec needs genuine French content.
- **UK** is smaller and denser; London absorbs disproportionate competition.
  Older architectural/religious history means some "dying craft" niches that
  work well in the US (pipe organs, confirmed) are actually *more* saturated
  there — the UK has a much deeper centuries-old tradition of church organs.
- **Australia/New Zealand** are extremely urban-concentrated (population
  clustered in a handful of major metros) — neither has the long tail of
  independent mid-size towns that made the US target list work.
- **Mexico** has the same ranking mechanics but requires genuinely fluent
  (not machine-translated) Spanish content, and real buyer behavior in many
  SMB sectors leans more on WhatsApp/word-of-mouth than Google search —
  validate real search volume before committing.

## A Note on Tone/Content

This is a working tool for the user's own reference, not a public-facing or
investor-facing document. Keep language plain and direct — no marketing fluff,
just the facts and numbers needed to decide where to build next. Population
figures above are approximate (city-proper estimates, current as of
mid-2026) — close enough for comparing town sizes, not meant to be
authoritative census data.
