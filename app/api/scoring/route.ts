import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { calculatePoints, calculateTeamScore } from "@/lib/scoring";

export async function POST(request: NextRequest) {
  try {
    const { gameId, questionId, correctAnswerIndex, pointValue, timerSeconds, timerEndsAt } =
      await request.json() as {
        gameId: string;
        questionId: string;
        correctAnswerIndex: number;
        pointValue: number;
        timerSeconds: number;
        timerEndsAt: number;
      };

    // Fetch all answers for this question
    const answersSnap = await getAdminDb()
      .collection("games")
      .doc(gameId)
      .collection("answers")
      .where("questionId", "==", questionId)
      .get();

    const batch = getAdminDb().batch();

    // Map playerId → points
    const playerPoints: Record<string, number> = {};

    // Score each answer
    for (const doc of answersSnap.docs) {
      const answer = doc.data() as {
        playerId: string;
        selectedOptionIndex: number;
        answeredAt: number;
        isCorrect: boolean;
        pointsEarned: number;
      };

      const isCorrect = answer.selectedOptionIndex === correctAnswerIndex;
      const timeRemaining = Math.max(
        0,
        Math.floor((timerEndsAt - answer.answeredAt) / 1000)
      );
      const points = calculatePoints(pointValue, timerSeconds, timeRemaining, isCorrect);

      playerPoints[answer.playerId] = points;

      // Update answer doc with correct flag + points
      batch.update(doc.ref, { isCorrect, pointsEarned: points });
    }

    // Update player total scores
    const playersSnap = await getAdminDb()
      .collection("games")
      .doc(gameId)
      .collection("players")
      .get();

    for (const doc of playersSnap.docs) {
      const player = doc.data() as {
        playerId: string;
        teamName: string | null;
        totalScore: number;
        roundScores: Record<string, number>;
      };
      const earned = playerPoints[player.playerId] ?? 0;
      batch.update(doc.ref, {
        totalScore: (player.totalScore ?? 0) + earned,
      });
    }

    // Update team scores (average of member scores → re-aggregated)
    const teamsSnap = await getAdminDb()
      .collection("games")
      .doc(gameId)
      .collection("teams")
      .get();

    for (const teamDoc of teamsSnap.docs) {
      const team = teamDoc.data() as {
        memberIds: string[];
        totalScore: number;
      };
      const memberScores = team.memberIds.map((id) => playerPoints[id] ?? 0);
      const teamPoints = calculateTeamScore(memberScores);
      batch.update(teamDoc.ref, {
        totalScore: (team.totalScore ?? 0) + teamPoints,
      });
    }

    await batch.commit();

    return NextResponse.json({ success: true, playerPoints });
  } catch (err) {
    console.error("Scoring error:", err);
    return NextResponse.json(
      { error: "Scoring failed" },
      { status: 500 }
    );
  }
}
