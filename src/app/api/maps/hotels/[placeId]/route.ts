import { NextRequest, NextResponse } from "next/server";

import { serverEnv } from "@/lib/env";

const GOOGLE_DETAILS_URL = "https://maps.googleapis.com/maps/api/place/details/json" as const;

type Review = {
  author_name?: string;
  rating?: number;
  text?: string;
  relative_time_description?: string;
};

function summarizeReviews(reviews: Review[]) {
  const positives = reviews
    .filter((rev) => (rev.rating ?? 0) >= 4 && (rev.text || "").trim().length > 10)
    .slice(0, 3);
  const negatives = reviews
    .filter((rev) => (rev.rating ?? 0) <= 2 && (rev.text || "").trim().length > 10)
    .slice(0, 3);

  const summarizeSet = (set: Review[]) =>
    set.map((rev) => ({
      rating: rev.rating,
      text: rev.text?.trim(),
      time: rev.relative_time_description,
      author: rev.author_name,
    }));

  return {
    positives: summarizeSet(positives),
    negatives: summarizeSet(negatives),
  };
}

function summarizeText(list: Array<{ text?: string }>, fallback: string) {
  const first = list.find((item) => item.text && item.text.trim().length > 0);
  if (first?.text) {
    const snippet = first.text.length > 220 ? `${first.text.slice(0, 220)}…` : first.text;
    return snippet;
  }
  return fallback;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: NextRequest, { params }: any) {
  if (!serverEnv.GOOGLE_MAPS_API_KEY) {
    return NextResponse.json({ error: "Google Maps is not configured." }, { status: 503 });
  }

  const placeId = params?.placeId as string | undefined;
  if (!placeId) {
    return NextResponse.json({ error: "Missing placeId." }, { status: 400 });
  }

  const searchParams = new URL(request.url).searchParams;
  const locale = searchParams.get("lang") || "en";

  const detailsParams = new URLSearchParams({
    place_id: placeId,
    key: serverEnv.GOOGLE_MAPS_API_KEY,
    language: locale,
    fields: [
      "name",
      "formatted_address",
      "rating",
      "user_ratings_total",
      "reviews",
      "editorial_summary",
      "types",
      "url",
    ].join(","),
  });

  const response = await fetch(`${GOOGLE_DETAILS_URL}?${detailsParams.toString()}`, { cache: "no-store" });
  if (!response.ok) {
    console.error("Hotel details fetch failed", await response.text());
    return NextResponse.json({ error: "Failed to research hotel." }, { status: 502 });
  }

  const data = await response.json();
  if (data.status !== "OK") {
    console.warn("Hotel details status", data.status, data.error_message);
    return NextResponse.json({ error: data.error_message || "Could not load hotel details." }, { status: 200 });
  }

  const result = data.result || {};
  const reviews: Review[] = result.reviews || [];
  const { positives, negatives } = summarizeReviews(reviews);
  const summaryParts: string[] = [];

  if (result.rating) {
    summaryParts.push(`Rating ${result.rating} / 5`);
  }
  if (result.user_ratings_total) {
    summaryParts.push(`${result.user_ratings_total} reviews`);
  }
  if (result.editorial_summary?.overview) {
    summaryParts.push(result.editorial_summary.overview);
  }

  const summary = summaryParts.join(". ");
  const positiveSummary = summarizeText(positives, "No clear positive highlights yet.");
  const negativeSummary = summarizeText(negatives, "No recurring complaints noted.");

  return NextResponse.json({
    name: result.name,
    address: result.formatted_address,
    rating: result.rating,
    userRatingsTotal: result.user_ratings_total,
    summary,
    positiveSummary,
    negativeSummary,
    positives,
    negatives,
    url: result.url,
  });
}
