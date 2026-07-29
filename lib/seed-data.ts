import { NewListing } from "./types";

// Transcribed directly from PROJECT_BRIEFING_for_claude_code.md.
// Each source table row (one niche, tested in 2-3 cities) is flattened into
// one row per (niche, city) tested, since that is the natural filter/sort
// granularity. Verdict is per-row: it matches the niche's overall verdict
// unless the briefing explicitly calls out a different verdict word for that
// specific city, in which case the explicit one wins. Reviews text is kept
// verbatim (including "(outlier)", ranges, etc.) rather than reinterpreted.

const INSTITUTIONAL = "Institutional/B2B" as const;
const SMALLBIZ = "Small-Business" as const;
const MODERATE_TIER = "Moderate (Tier 2)" as const;
const AVOID_TIER = "Avoid (Tier 3)" as const;

export const SEED_DATA: NewListing[] = [
  // ---------- Tier 1: Institutional / B2B ----------
  { niche: "Pipe organ tuning/repair", tier: INSTITUTIONAL, city: "Denver", state: "CO", population: 715000, reviews: "0, 1, 2", verdict: "GOOD", notes: "" },
  { niche: "Pipe organ tuning/repair", tier: INSTITUTIONAL, city: "Portland", state: "OR", population: 635000, reviews: "1, 1, 3", verdict: "GOOD", notes: "" },
  { niche: "Pipe organ tuning/repair", tier: INSTITUTIONAL, city: "Salt Lake City", state: "UT", population: 200000, reviews: "2, 8, 22", verdict: "GOOD", notes: "More contested but still workable" },
  { niche: "Pipe organ tuning/repair", tier: INSTITUTIONAL, city: "Birmingham", state: "AL", population: 197000, reviews: "4, 15, 169", verdict: "GOOD", notes: "More contested but still workable" },

  { niche: "Forklift repair", tier: INSTITUTIONAL, city: "Boise", state: "ID", population: 235000, reviews: "1–26 range across 9 results", verdict: "GOOD", notes: "" },
  { niche: "Forklift repair", tier: INSTITUTIONAL, city: "Chattanooga", state: "TN", population: 185000, reviews: "23, 49, 54", verdict: "GOOD", notes: "" },

  { niche: "Elevator inspection", tier: INSTITUTIONAL, city: "Boise", state: "ID", population: 235000, reviews: "0–21 range across 9 results", verdict: "GOOD", notes: "Even Otis/Schindler/KONE/TK Elevator show under 10 reviews locally" },
  { niche: "Elevator inspection", tier: INSTITUTIONAL, city: "Chattanooga", state: "TN", population: 185000, reviews: "0, 4, 5, 9, 47", verdict: "GOOD", notes: "Even Otis/Schindler/KONE/TK Elevator show under 10 reviews locally" },

  { niche: "Warehouse pallet racking install/repair", tier: INSTITUTIONAL, city: "Boise", state: "ID", population: 235000, reviews: "0, 0, 2, 2, 4, 5, 12", verdict: "GOOD", notes: "" },
  { niche: "Warehouse pallet racking install/repair", tier: INSTITUTIONAL, city: "Chattanooga", state: "TN", population: 185000, reviews: "17, 18, 25", verdict: "GOOD", notes: "" },

  { niche: "Industrial scale calibration", tier: INSTITUTIONAL, city: "Boise", state: "ID", population: 235000, reviews: "0, 3, 3, 5, 8", verdict: "GOOD", notes: "Watch for truck weigh-stations polluting results" },
  { niche: "Industrial scale calibration", tier: INSTITUTIONAL, city: "Chattanooga", state: "TN", population: 185000, reviews: "2, 14, 32", verdict: "GOOD", notes: "Watch for truck weigh-stations polluting results" },

  { niche: "Vending machine repair", tier: INSTITUTIONAL, city: "Boise", state: "ID", population: 235000, reviews: "8, 8, 13", verdict: "GOOD", notes: "Watch for laundromats/appliance repair polluting results" },
  { niche: "Vending machine repair", tier: INSTITUTIONAL, city: "Chattanooga", state: "TN", population: 185000, reviews: "6, 7, 22", verdict: "GOOD", notes: "Watch for laundromats/appliance repair polluting results" },

  { niche: "Dental equipment repair", tier: INSTITUTIONAL, city: "Boise", state: "ID", population: 235000, reviews: "3, 11", verdict: "GOOD", notes: "Watch for dentist offices (not repairers) polluting results" },
  { niche: "Dental equipment repair", tier: INSTITUTIONAL, city: "Chattanooga", state: "TN", population: 185000, reviews: "1, 1, 2", verdict: "GOOD", notes: "Watch for dentist offices (not repairers) polluting results" },

  { niche: "Church steeple/bell tower repair", tier: INSTITUTIONAL, city: "Denver", state: "CO", population: 715000, reviews: "No real specialist present", verdict: "GOOD", notes: "" },
  { niche: "Church steeple/bell tower repair", tier: INSTITUTIONAL, city: "Nashville", state: "TN", population: 685000, reviews: "0, 1 (the two “nationwide” specialists that appear)", verdict: "GOOD", notes: "" },

  { niche: "Playground equipment (CPSI) inspection", tier: INSTITUTIONAL, city: "Boise", state: "ID", population: 235000, reviews: "0 for real specialist", verdict: "GOOD", notes: "Watch for general home inspectors polluting results" },
  { niche: "Playground equipment (CPSI) inspection", tier: INSTITUTIONAL, city: "Chattanooga", state: "TN", population: 185000, reviews: "0 for real specialist", verdict: "GOOD", notes: "Watch for general home inspectors polluting results" },

  { niche: "Historic wood window restoration", tier: INSTITUTIONAL, city: "Bangor", state: "ME", population: 32000, reviews: "3", verdict: "GOOD", notes: "Watch for replacement-window companies polluting results" },
  { niche: "Historic wood window restoration", tier: INSTITUTIONAL, city: "Galena", state: "IL", population: 3300, reviews: "4", verdict: "GOOD", notes: "Watch for replacement-window companies polluting results" },

  { niche: "Commercial kitchen hood cleaning", tier: INSTITUTIONAL, city: "Boise", state: "ID", population: 235000, reviews: "0–62 range", verdict: "GOOD", notes: "" },
  { niche: "Commercial kitchen hood cleaning", tier: INSTITUTIONAL, city: "Chattanooga", state: "TN", population: 185000, reviews: "1, 4, 6 (only 3 total results)", verdict: "GOOD", notes: "" },

  { niche: "Fire alarm system inspection", tier: INSTITUTIONAL, city: "Boise", state: "ID", population: 235000, reviews: "29, 45, 78", verdict: "MODERATE", notes: "GOOD in smaller market" },
  { niche: "Fire alarm system inspection", tier: INSTITUTIONAL, city: "Hattiesburg", state: "MS", population: 48700, reviews: "13, 13, 40", verdict: "GOOD", notes: "GOOD in smaller market" },

  // ---------- Tier 1: Fragmented Small-Business ----------
  { niche: "Interior design / home decorating", tier: SMALLBIZ, city: "Port Charlotte, Punta Gorda, Sebring, Arcadia, Wauchula (5 towns)", state: "FL", population: null, reviews: "0–97 range across 5 towns (~10,000–60,000 each)", verdict: "GOOD", notes: "Best/most repeatable find of the whole project" },
  { niche: "Interior design / home decorating", tier: SMALLBIZ, city: "Twin Falls", state: "ID", population: 51000, reviews: "5, 6, 16", verdict: "GOOD", notes: "Best/most repeatable find of the whole project" },

  { niche: "Tile installation", tier: SMALLBIZ, city: "Twin Falls", state: "ID", population: 51000, reviews: "4, 7, 17", verdict: "GOOD", notes: "User's own trade — real personal evaluation edge" },
  { niche: "Tile installation", tier: SMALLBIZ, city: "Hattiesburg", state: "MS", population: 48700, reviews: "0, 25, 32", verdict: "GOOD", notes: "User's own trade — real personal evaluation edge" },

  { niche: "Concrete / driveway contractor", tier: SMALLBIZ, city: "Twin Falls", state: "ID", population: 51000, reviews: "24, 40, 124 (outlier)", verdict: "GOOD", notes: "Most consistent result across all 3 regions" },
  { niche: "Concrete / driveway contractor", tier: SMALLBIZ, city: "Hattiesburg", state: "MS", population: 48700, reviews: "6, 18, 35", verdict: "GOOD", notes: "Most consistent result across all 3 regions" },
  { niche: "Concrete / driveway contractor", tier: SMALLBIZ, city: "Mankato", state: "MN", population: 46000, reviews: "Tested as 3rd region; specific counts not recorded in briefing", verdict: "GOOD", notes: "Most consistent result across all 3 regions" },

  { niche: "Cabinet refacing / countertops", tier: SMALLBIZ, city: "Twin Falls", state: "ID", population: 51000, reviews: "32, 36, 124 (outlier)", verdict: "GOOD", notes: "" },
  { niche: "Cabinet refacing / countertops", tier: SMALLBIZ, city: "Hattiesburg", state: "MS", population: 48700, reviews: "21, 24, 32", verdict: "GOOD", notes: "" },
  { niche: "Cabinet refacing / countertops", tier: SMALLBIZ, city: "Mankato", state: "MN", population: 46000, reviews: "16, 16, 64", verdict: "GOOD", notes: "" },

  { niche: "Deck building", tier: SMALLBIZ, city: "Twin Falls", state: "ID", population: 51000, reviews: "20, 39, 52", verdict: "GOOD", notes: "True deck specialists all under 5 reviews in Mankato" },
  { niche: "Deck building", tier: SMALLBIZ, city: "Hattiesburg", state: "MS", population: 48700, reviews: "23, 24, 58", verdict: "GOOD", notes: "True deck specialists all under 5 reviews in Mankato" },
  { niche: "Deck building", tier: SMALLBIZ, city: "Mankato", state: "MN", population: 46000, reviews: "10, 45, 138 (outlier)", verdict: "GOOD", notes: "True deck specialists all under 5 reviews in Mankato" },

  { niche: "Well pump repair/service", tier: SMALLBIZ, city: "Twin Falls", state: "ID", population: 51000, reviews: "28, 30, 47", verdict: "GOOD", notes: "Treat the Maine outlier as an exception, not the norm; check each specific market" },
  { niche: "Well pump repair/service", tier: SMALLBIZ, city: "Rural Maine (small towns)", state: "ME", population: null, reviews: "One 477-review regional outlier found", verdict: "GOOD", notes: "Treat the Maine outlier as an exception, not the norm; check each specific market" },

  { niche: "Screened porch / sunroom construction", tier: SMALLBIZ, city: "Hattiesburg", state: "MS", population: 48700, reviews: "19, 19, 76", verdict: "GOOD", notes: "" },
  { niche: "Screened porch / sunroom construction", tier: SMALLBIZ, city: "Twin Falls", state: "ID", population: 51000, reviews: "3, 20, 62", verdict: "GOOD", notes: "" },

  { niche: "Custom shed building", tier: SMALLBIZ, city: "Twin Falls", state: "ID", population: 51000, reviews: "33, 47, 62", verdict: "GOOD", notes: "" },
  { niche: "Custom shed building", tier: SMALLBIZ, city: "Hattiesburg", state: "MS", population: 48700, reviews: "23, 29, 42", verdict: "GOOD", notes: "" },

  { niche: "Closet organization/installation", tier: SMALLBIZ, city: "Twin Falls", state: "ID", population: 51000, reviews: "17, 18, 20", verdict: "GOOD", notes: "Search term collides badly with thrift/clothing stores — filter aggressively every time" },
  { niche: "Closet organization/installation", tier: SMALLBIZ, city: "Hattiesburg", state: "MS", population: 48700, reviews: "10, 29 (only 2 relevant)", verdict: "GOOD", notes: "Search term collides badly with thrift/clothing stores — filter aggressively every time" },

  { niche: "Driveway / asphalt sealcoating", tier: SMALLBIZ, city: "Twin Falls", state: "ID", population: 51000, reviews: "14, 17, 24", verdict: "GOOD", notes: "Distinct from concrete contractors" },
  { niche: "Driveway / asphalt sealcoating", tier: SMALLBIZ, city: "Hattiesburg", state: "MS", population: 48700, reviews: "18, 19, 35", verdict: "GOOD", notes: "Distinct from concrete contractors" },

  { niche: "Fence installation", tier: SMALLBIZ, city: "Hattiesburg", state: "MS", population: 48700, reviews: "22, 26, 42", verdict: "GOOD", notes: "Check locally — verdict is town-dependent" },
  { niche: "Fence installation", tier: SMALLBIZ, city: "Twin Falls", state: "ID", population: 51000, reviews: "91, 115, 124 (tougher)", verdict: "GOOD", notes: "Check locally — verdict is town-dependent. Tougher market here, numbers trend high." },

  { niche: "Flooring installation", tier: SMALLBIZ, city: "Hattiesburg", state: "MS", population: 48700, reviews: "25, 30, 66", verdict: "GOOD", notes: "Check locally — verdict is town-dependent" },
  { niche: "Flooring installation", tier: SMALLBIZ, city: "Twin Falls", state: "ID", population: 51000, reviews: "80, 88, 129 (tougher)", verdict: "GOOD", notes: "Check locally — verdict is town-dependent. Tougher market here, numbers trend high." },

  { niche: "Kitchen remodeling", tier: SMALLBIZ, city: "Hattiesburg", state: "MS", population: 48700, reviews: "23, 24, 32", verdict: "GOOD", notes: "Check locally — verdict is town-dependent" },
  { niche: "Kitchen remodeling", tier: SMALLBIZ, city: "Twin Falls", state: "ID", population: 51000, reviews: "39, 69, 71 (moderate)", verdict: "MODERATE", notes: "Check locally — verdict is town-dependent" },

  { niche: "House painting", tier: SMALLBIZ, city: "Hattiesburg", state: "MS", population: 48700, reviews: "29, 29, 32", verdict: "GOOD", notes: "Verdict is size-dependent — avoid larger metros (150k+) for this one" },
  { niche: "House painting", tier: SMALLBIZ, city: "Twin Falls", state: "ID", population: 51000, reviews: "54, 74, 90 (moderate)", verdict: "MODERATE", notes: "Verdict is size-dependent — avoid larger metros (150k+) for this one" },
  { niche: "House painting", tier: SMALLBIZ, city: "Chattanooga", state: "TN", population: 185000, reviews: "224, 348, 420", verdict: "AVOID", notes: "Verdict is size-dependent — avoid larger metros (150k+) for this one" },

  // ---------- Tier 2: MODERATE ----------
  { niche: "Landscaping design", tier: MODERATE_TIER, city: "Twin Falls", state: "ID", population: 51000, reviews: "47, 63, 179 (outlier)", verdict: "MODERATE", notes: "One dominant #1 in most markets, #2/#3 still workable" },
  { niche: "Landscaping design", tier: MODERATE_TIER, city: "Hattiesburg", state: "MS", population: 48700, reviews: "42, 50, 58", verdict: "MODERATE", notes: "One dominant #1 in most markets, #2/#3 still workable" },

  { niche: "Auto detailing", tier: MODERATE_TIER, city: "Twin Falls", state: "ID", population: 51000, reviews: "61, 70, 126", verdict: "MODERATE", notes: "" },
  { niche: "Auto detailing", tier: MODERATE_TIER, city: "Hattiesburg", state: "MS", population: 48700, reviews: "30, 56, 61", verdict: "MODERATE", notes: "" },

  { niche: "Fire sprinkler system inspection", tier: MODERATE_TIER, city: "Boise", state: "ID", population: 235000, reviews: "Dense field, individually beatable", verdict: "MODERATE", notes: "Real recurring commercial compliance demand" },
  { niche: "Fire sprinkler system inspection", tier: MODERATE_TIER, city: "Chattanooga", state: "TN", population: 185000, reviews: "26, 28, 36", verdict: "MODERATE", notes: "Real recurring commercial compliance demand" },

  { niche: "Parking lot striping/sealcoating", tier: MODERATE_TIER, city: "Boise", state: "ID", population: 235000, reviews: "Dense field, individually beatable", verdict: "MODERATE", notes: "" },
  { niche: "Parking lot striping/sealcoating", tier: MODERATE_TIER, city: "Chattanooga", state: "TN", population: 185000, reviews: "48, 56, 71", verdict: "MODERATE", notes: "" },

  { niche: "Bronze statue/monument conservation", tier: MODERATE_TIER, city: "Philadelphia", state: "PA", population: 1550000, reviews: "0, 17", verdict: "MODERATE", notes: "Likely low real search volume (rare/institutional purchase); city-size dependent; lowest priority on this list" },
  { niche: "Bronze statue/monument conservation", tier: MODERATE_TIER, city: "Chicago", state: "IL", population: 2700000, reviews: "13, 36, 98 (more contested)", verdict: "MODERATE", notes: "Likely low real search volume (rare/institutional purchase); city-size dependent; lowest priority on this list" },

  { niche: "Cemetery monument/headstone restoration", tier: MODERATE_TIER, city: "York", state: "PA", population: 44000, reviews: "1, 22, 29", verdict: "GOOD", notes: "Region-dependent — New England has a much deeper monument-making tradition; check locally, don't assume it travels" },
  { niche: "Cemetery monument/headstone restoration", tier: MODERATE_TIER, city: "Springfield", state: "MA", population: 155000, reviews: "10, 15, 227 (outlier)", verdict: "AVOID", notes: "Region-dependent — New England has a much deeper monument-making tradition; check locally, don't assume it travels" },

  // ---------- Tier 3: AVOID ----------
  { niche: "Boat lift repair", tier: AVOID_TIER, city: "Punta Gorda", state: "FL", population: 19000, reviews: "510 (top competitor, 4.8★)", verdict: "AVOID", notes: "Extremely dominant local incumbent" },
  { niche: "Marine dock/seawall repair", tier: AVOID_TIER, city: "Charlotte County", state: "FL", population: null, reviews: "510, 180", verdict: "AVOID", notes: "Same dominant incumbent plus a second strong player" },
  { niche: "Mobile home skirting/leveling", tier: AVOID_TIER, city: "Zephyrhills", state: "FL", population: 17000, reviews: "34, 123, 163, 386", verdict: "AVOID", notes: "Real established incumbents despite looking thin on web search" },

  { niche: "Stained glass restoration", tier: AVOID_TIER, city: "Boise", state: "ID", population: 235000, reviews: "National operators “Church Stained Glass Restoration” and “Scottish Stained Glass” confirmed present with real local reviews", verdict: "AVOID", notes: "Deep, genuine local-SEO colonization, not just organic content" },
  { niche: "Stained glass restoration", tier: AVOID_TIER, city: "Denver", state: "CO", population: 715000, reviews: "National operators “Church Stained Glass Restoration” and “Scottish Stained Glass” confirmed present with real local reviews", verdict: "AVOID", notes: "Deep, genuine local-SEO colonization, not just organic content" },
  { niche: "Stained glass restoration", tier: AVOID_TIER, city: "Salt Lake City", state: "UT", population: 200000, reviews: "National operators “Church Stained Glass Restoration” and “Scottish Stained Glass” confirmed present with real local reviews", verdict: "AVOID", notes: "Deep, genuine local-SEO colonization, not just organic content" },
  { niche: "Stained glass restoration", tier: AVOID_TIER, city: "Birmingham", state: "AL", population: 197000, reviews: "National operators “Church Stained Glass Restoration” and “Scottish Stained Glass” confirmed present with real local reviews", verdict: "AVOID", notes: "Deep, genuine local-SEO colonization, not just organic content" },

  { niche: "Artificial turf installation", tier: AVOID_TIER, city: "New Holland", state: "PA", population: null, reviews: "Thin, real", verdict: "GOOD", notes: "State-dependent, do not assume it generalizes" },
  { niche: "Artificial turf installation", tier: AVOID_TIER, city: "Various towns", state: "OH", population: null, reviews: "“Turf Pros Solution” templated operator covers nearly every town", verdict: "AVOID", notes: "State-dependent, do not assume it generalizes" },

  { niche: "Marine dock/boat lift (“any smaller lake” strategy)", tier: AVOID_TIER, city: "Lake Wateree", state: "SC", population: null, reviews: "5+ established competitors incl. a lake-specific landing page", verdict: "AVOID", notes: "General strategy failed; Florida-specific finding still stands separately" },

  { niche: "Carpet cleaning", tier: AVOID_TIER, city: "Twin Falls", state: "ID", population: 51000, reviews: "278, 411, 435", verdict: "AVOID", notes: "" },
  { niche: "Window replacement", tier: AVOID_TIER, city: "Twin Falls", state: "ID", population: 51000, reviews: "191, 258, 288, 722 (DaBella franchise)", verdict: "AVOID", notes: "" },
  { niche: "Siding installation", tier: AVOID_TIER, city: "Twin Falls", state: "ID", population: 51000, reviews: "258, 722 (DaBella)", verdict: "AVOID", notes: "" },
  { niche: "Gutter installation", tier: AVOID_TIER, city: "Twin Falls", state: "ID", population: 51000, reviews: "115, 117, 204/205, 722 (DaBella)", verdict: "AVOID", notes: "" },
  { niche: "Water heater/plumbing", tier: AVOID_TIER, city: "Twin Falls", state: "ID", population: 51000, reviews: "1,619, 1,655, 2,435", verdict: "AVOID", notes: "" },
  { niche: "Dryer vent cleaning", tier: AVOID_TIER, city: "Twin Falls", state: "ID", population: 51000, reviews: "236, 1,263, 1,619 (general HVAC giants)", verdict: "AVOID", notes: "" },
  { niche: "Fireplace installation/repair", tier: AVOID_TIER, city: "Twin Falls", state: "ID", population: 51000, reviews: "114–1,655 range (HVAC collision)", verdict: "AVOID", notes: "" },
  { niche: "Basement waterproofing", tier: AVOID_TIER, city: "Twin Falls", state: "ID", population: 51000, reviews: "Up to 278 (water damage restoration collision)", verdict: "AVOID", notes: "" },
  { niche: "Retaining wall installation", tier: AVOID_TIER, city: "Twin Falls", state: "ID", population: 51000, reviews: "Up to 179", verdict: "AVOID", notes: "Not a distinct niche — same pool as landscaping/concrete" },
  { niche: "Paver/hardscape installation", tier: AVOID_TIER, city: "Twin Falls", state: "ID", population: 51000, reviews: "Same as landscaping", verdict: "AVOID", notes: "Not a distinct niche" },

  { niche: "Epoxy garage floor coating", tier: AVOID_TIER, city: "Boise", state: "ID", population: 235000, reviews: "26–137 across 9 competitors", verdict: "AVOID", notes: "" },
  { niche: "Crawl space encapsulation", tier: AVOID_TIER, city: "Boise", state: "ID", population: 235000, reviews: "44–176", verdict: "AVOID", notes: "" },
  { niche: "Pool resurfacing/replastering", tier: AVOID_TIER, city: "Boise", state: "ID", population: 235000, reviews: "Up to 271", verdict: "AVOID", notes: "" },
  { niche: "Commercial security camera/access control", tier: AVOID_TIER, city: "Boise", state: "ID", population: 235000, reviews: "Up to 410, plus a regional consolidator", verdict: "AVOID", notes: "" },
  { niche: "Garage/commercial door repair", tier: AVOID_TIER, city: "Boise", state: "ID", population: 235000, reviews: "Up to 1,015", verdict: "AVOID", notes: "Collides with residential garage door giants" },
  { niche: "Septic system inspection (real estate)", tier: AVOID_TIER, city: "Boise", state: "ID", population: 235000, reviews: "Up to 2,126", verdict: "AVOID", notes: "" },
  { niche: "Certified arborist/tree services", tier: AVOID_TIER, city: "Boise", state: "ID", population: 235000, reviews: "Up to 510, incl. SavATree franchise", verdict: "AVOID", notes: "" },
  { niche: "Dumpster/compactor repair", tier: AVOID_TIER, city: "Boise", state: "ID", population: 235000, reviews: "Up to 1,439 (Junk King)", verdict: "AVOID", notes: "Collides with dumpster rental" },
  { niche: "Propane tank installation", tier: AVOID_TIER, city: "Boise", state: "ID", population: 235000, reviews: "Up to 414", verdict: "AVOID", notes: "National propane franchises" },
  { niche: "Grease trap cleaning", tier: AVOID_TIER, city: "Boise", state: "ID", population: 235000, reviews: "Up to 1,664", verdict: "AVOID", notes: "Plumbing giants" },
  { niche: "Wheelchair/mobility scooter repair", tier: AVOID_TIER, city: "Boise", state: "ID", population: 235000, reviews: "Up to 207, incl. national franchises (Mobility City, 101 Mobility)", verdict: "AVOID", notes: "" },
  { niche: "Commercial fitness/gym equipment repair", tier: AVOID_TIER, city: "Boise", state: "ID", population: 235000, reviews: "127 (Gym Masters)", verdict: "AVOID", notes: "" },
  { niche: "Commercial laundry equipment repair", tier: AVOID_TIER, city: "Boise", state: "ID", population: 235000, reviews: "Up to 173", verdict: "AVOID", notes: "Collides with general appliance repair" },
  { niche: "Pool table/billiards repair", tier: AVOID_TIER, city: "Boise", state: "ID", population: 235000, reviews: "Up to 91", verdict: "AVOID", notes: "" },
  { niche: "Portable restroom/event rental", tier: AVOID_TIER, city: "Boise", state: "ID", population: 235000, reviews: "9+ real competitors incl. national player United Site Services", verdict: "AVOID", notes: "" },

  { niche: "Antique/player piano restoration", tier: AVOID_TIER, city: "Denver", state: "CO", population: 715000, reviews: "Up to 305", verdict: "AVOID", notes: "" },
  { niche: "Flagpole installation", tier: AVOID_TIER, city: "Denver", state: "CO", population: 715000, reviews: "Up to 451", verdict: "AVOID", notes: "" },
  { niche: "Locksmith/safe & vault work", tier: AVOID_TIER, city: "Denver", state: "CO", population: 715000, reviews: "Up to 2,040", verdict: "AVOID", notes: "" },
  { niche: "Tower clock repair", tier: AVOID_TIER, city: "Denver", state: "CO", population: 715000, reviews: "Category collision (results are consumer watch/jewelry repair shops)", verdict: "AVOID", notes: "Real specialists exist but hard to search for cleanly" },

  { niche: "Tree removal/trimming", tier: AVOID_TIER, city: "Twin Falls", state: "ID", population: 51000, reviews: "29, 32, 290 (outlier)", verdict: "MODERATE", notes: "First region tested" },
  { niche: "Tree removal/trimming", tier: AVOID_TIER, city: "Hattiesburg", state: "MS", population: 48700, reviews: "94, 118, 127", verdict: "AVOID", notes: "Worse in storm-prone Southern regions" },

  { niche: "Moving companies", tier: AVOID_TIER, city: "Twin Falls", state: "ID", population: 51000, reviews: "80, 88, 123", verdict: "MODERATE", notes: "First region tested" },
  { niche: "Moving companies", tier: AVOID_TIER, city: "Hattiesburg", state: "MS", population: 48700, reviews: "204, 493, 538 (College Hunks franchise)", verdict: "AVOID", notes: "Worse in 2nd region" },

  { niche: "Pressure washing", tier: AVOID_TIER, city: "Twin Falls", state: "ID", population: 51000, reviews: "45, 47, 80", verdict: "GOOD", notes: "Climate-dependent — dry Mountain West only, avoid humid regions" },
  { niche: "Pressure washing", tier: AVOID_TIER, city: "Hattiesburg", state: "MS", population: 48700, reviews: "123, 149, 310", verdict: "AVOID", notes: "Climate-dependent — dry Mountain West only, avoid humid regions" },
  { niche: "Pressure washing", tier: AVOID_TIER, city: "Mankato", state: "MN", population: 46000, reviews: "197, 208, 221", verdict: "AVOID", notes: "Climate-dependent — dry Mountain West only, avoid humid regions" },

  // Combined "colonized by national franchises" row in the briefing lists 7 niches together — split one row per niche, same evidence.
  { niche: "Chimney sweep", tier: AVOID_TIER, city: "Multiple towns (FL, OH, KS, NE, IA, MO, VT, MT)", state: "Multiple", population: null, reviews: "Colonized by national franchises/multi-city templated operators, several confirmed reaching towns as small as ~1,200 people", verdict: "AVOID", notes: "See Playbook notes on franchise colonization" },
  { niche: "Radon mitigation", tier: AVOID_TIER, city: "Multiple towns (FL, OH, KS, NE, IA, MO, VT, MT)", state: "Multiple", population: null, reviews: "Colonized by national franchises/multi-city templated operators, several confirmed reaching towns as small as ~1,200 people", verdict: "AVOID", notes: "See Playbook notes on franchise colonization" },
  { niche: "Mudjacking/concrete leveling", tier: AVOID_TIER, city: "Multiple towns (FL, OH, KS, NE, IA, MO, VT, MT)", state: "Multiple", population: null, reviews: "Colonized by national franchises/multi-city templated operators, several confirmed reaching towns as small as ~1,200 people", verdict: "AVOID", notes: "See Playbook notes on franchise colonization" },
  { niche: "Christmas light installation", tier: AVOID_TIER, city: "Multiple towns (FL, OH, KS, NE, IA, MO, VT, MT)", state: "Multiple", population: null, reviews: "Colonized by national franchises/multi-city templated operators, several confirmed reaching towns as small as ~1,200 people", verdict: "AVOID", notes: "See Playbook notes on franchise colonization" },
  { niche: "Standby generators", tier: AVOID_TIER, city: "Multiple towns (FL, OH, KS, NE, IA, MO, VT, MT)", state: "Multiple", population: null, reviews: "Colonized by national franchises/multi-city templated operators, several confirmed reaching towns as small as ~1,200 people", verdict: "AVOID", notes: "See Playbook notes on franchise colonization" },
  { niche: "Stairlifts", tier: AVOID_TIER, city: "Multiple towns (FL, OH, KS, NE, IA, MO, VT, MT)", state: "Multiple", population: null, reviews: "Colonized by national franchises/multi-city templated operators, several confirmed reaching towns as small as ~1,200 people", verdict: "AVOID", notes: "See Playbook notes on franchise colonization" },
  { niche: "Septic pumping", tier: AVOID_TIER, city: "Multiple towns (FL, OH, KS, NE, IA, MO, VT, MT)", state: "Multiple", population: null, reviews: "Colonized by national franchises/multi-city templated operators, several confirmed reaching towns as small as ~1,200 people", verdict: "AVOID", notes: "See Playbook notes on franchise colonization" },

  { niche: "EV charger installation", tier: AVOID_TIER, city: "Multiple attempts (VT/NH area)", state: "Multiple", population: null, reviews: "Category collision (results are physical charging stations, not installers); also intercepted by Qmerit, a massive automaker-referral network", verdict: "AVOID", notes: "Structurally poor fit for local-search lead gen" },
  { niche: "Grain bin/silo cleaning", tier: AVOID_TIER, city: "Grand Island", state: "NE", population: null, reviews: "Zero relevant results (dumpster rental, hazmat companies only)", verdict: "AVOID", notes: "Channel mismatch — real buyers don't use Google Maps for this" },
];
