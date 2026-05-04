import { doc, getDoc, Firestore } from "firebase/firestore";

export function generateGameCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function generateUniqueCode(db: Firestore): Promise<string> {
  let code = generateGameCode();
  let attempts = 0;
  while (attempts < 10) {
    const snap = await getDoc(doc(db, "games", code));
    if (!snap.exists()) return code;
    code = generateGameCode();
    attempts++;
  }
  throw new Error("Could not generate unique game code after 10 attempts");
}
