import { NextRequest, NextResponse } from "next/server";
import { fetchCategories, normalizeOpenTDBQuestion } from "@/lib/opentdb";
import type { OpenTDBQuestion } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  // Return cached category list
  if (action === "categories") {
    try {
      const categories = await fetchCategories();
      return NextResponse.json({ categories });
    } catch {
      return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
  }

  // Fetch questions
  const amount    = searchParams.get("amount")     || "10";
  const category  = searchParams.get("category");
  const difficulty = searchParams.get("difficulty");

  const params = new URLSearchParams({
    amount,
    type: "multiple",
  });
  if (category)   params.set("category",   category);
  if (difficulty) params.set("difficulty", difficulty);

  try {
    const res = await fetch(`https://opentdb.com/api.php?${params.toString()}`);
    const data = await res.json() as { response_code: number; results: OpenTDBQuestion[] };

    if (data.response_code === 5) {
      return NextResponse.json(
        { error: "Rate limited by OpenTDB. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    if (data.response_code !== 0) {
      return NextResponse.json(
        { error: `OpenTDB error code: ${data.response_code}` },
        { status: 400 }
      );
    }

    const questions = data.results.map(normalizeOpenTDBQuestion);
    return NextResponse.json({ questions });
  } catch {
    return NextResponse.json({ error: "Failed to fetch from OpenTDB" }, { status: 500 });
  }
}
