/**
 * Seasonal Diwali highlight: the festive theme and the Diwali Hampers section show until this
 * moment, then disappear on their own. Change the date each year (Diwali 2026 is on 8 November;
 * this keeps the theme up through Bhai Dooj).
 */
export const DIWALI_ACTIVE_UNTIL = new Date("2026-11-12T23:59:59+05:30");

export const isDiwaliSeason = (now: Date = new Date()) => now <= DIWALI_ACTIVE_UNTIL;
