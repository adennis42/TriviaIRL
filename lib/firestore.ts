import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  Timestamp,
  type Firestore,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import type {
  Game,
  Player,
  Team,
  Answer,
  Question,
  QuestionBank,
  Round,
  Host,
} from "@/types";

// ── Collection refs ────────────────────────────────────────────────────────

export const gamesRef  = () => collection(db, "games");
export const hostsRef  = () => collection(db, "hosts");

export const gameRef   = (gameId: string) => doc(db, "games", gameId);
export const hostRef   = (hostId: string) => doc(db, "hosts", hostId);

export const playersRef  = (gameId: string) => collection(db, "games", gameId, "players");
export const teamsRef    = (gameId: string) => collection(db, "games", gameId, "teams");
export const answersRef  = (gameId: string) => collection(db, "games", gameId, "answers");

export const banksRef     = (hostId: string) => collection(db, "hosts", hostId, "questionBanks");
export const bankRef      = (hostId: string, bankId: string) => doc(db, "hosts", hostId, "questionBanks", bankId);
export const questionsRef = (hostId: string, bankId: string) => collection(db, "hosts", hostId, "questionBanks", bankId, "questions");
export const questionRef  = (hostId: string, bankId: string, questionId: string) => doc(db, "hosts", hostId, "questionBanks", bankId, "questions", questionId);
export const roundsRef    = (hostId: string) => collection(db, "hosts", hostId, "rounds");
export const roundRef     = (hostId: string, roundId: string) => doc(db, "hosts", hostId, "rounds", roundId);

// ── Host ──────────────────────────────────────────────────────────────────

export async function getOrCreateHost(hostId: string, email: string, displayName: string): Promise<Host> {
  const ref = hostRef(hostId);
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data() as Host;

  const host: Host = {
    hostId,
    email,
    displayName,
    plan: "free",
    gamesThisMonth: 0,
    stripeCustomerId: null,
    createdAt: Date.now(),
  };
  await setDoc(ref, host);
  return host;
}

export async function getHost(hostId: string): Promise<Host | null> {
  const snap = await getDoc(hostRef(hostId));
  return snap.exists() ? (snap.data() as Host) : null;
}

// ── Question Banks ─────────────────────────────────────────────────────────

export async function createBank(hostId: string, name: string, description: string): Promise<string> {
  const ref = await addDoc(banksRef(hostId), {
    name,
    description,
    createdAt: Date.now(),
  });
  await updateDoc(ref, { bankId: ref.id });
  return ref.id;
}

export async function getBanks(hostId: string): Promise<QuestionBank[]> {
  const q = query(banksRef(hostId), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as QuestionBank);
}

export async function deleteBank(hostId: string, bankId: string): Promise<void> {
  await deleteDoc(bankRef(hostId, bankId));
}

// ── Questions ──────────────────────────────────────────────────────────────

export async function createQuestion(
  hostId: string,
  bankId: string,
  data: Omit<Question, "questionId" | "createdAt">
): Promise<string> {
  const ref = await addDoc(questionsRef(hostId, bankId), {
    ...data,
    createdAt: Date.now(),
  });
  await updateDoc(ref, { questionId: ref.id });
  return ref.id;
}

export async function getQuestions(hostId: string, bankId: string): Promise<Question[]> {
  const q = query(questionsRef(hostId, bankId), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Question);
}

export async function updateQuestion(
  hostId: string,
  bankId: string,
  questionId: string,
  data: Partial<Question>
): Promise<void> {
  await updateDoc(questionRef(hostId, bankId, questionId), data);
}

export async function deleteQuestion(hostId: string, bankId: string, questionId: string): Promise<void> {
  await deleteDoc(questionRef(hostId, bankId, questionId));
}

// ── Rounds ────────────────────────────────────────────────────────────────

export async function createRound(hostId: string, name: string, bankId: string): Promise<string> {
  const ref = await addDoc(roundsRef(hostId), {
    name,
    questionIds: [],
    bankId,
    createdAt: Date.now(),
  });
  await updateDoc(ref, { roundId: ref.id });
  return ref.id;
}

export async function getRounds(hostId: string): Promise<Round[]> {
  const q = query(roundsRef(hostId), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Round);
}

export async function getRound(hostId: string, roundId: string): Promise<Round | null> {
  const snap = await getDoc(roundRef(hostId, roundId));
  return snap.exists() ? (snap.data() as Round) : null;
}

export async function updateRound(hostId: string, roundId: string, data: Partial<Round>): Promise<void> {
  await updateDoc(roundRef(hostId, roundId), data);
}

export async function deleteRound(hostId: string, roundId: string): Promise<void> {
  await deleteDoc(roundRef(hostId, roundId));
}

// ── Game realtime ─────────────────────────────────────────────────────────

export function subscribeToGame(gameId: string, cb: (game: Game | null) => void): Unsubscribe {
  return onSnapshot(gameRef(gameId), (snap) => {
    cb(snap.exists() ? (snap.data() as Game) : null);
  });
}

export function subscribeToPlayers(gameId: string, cb: (players: Player[]) => void): Unsubscribe {
  return onSnapshot(playersRef(gameId), (snap) => {
    cb(snap.docs.map((d) => d.data() as Player));
  });
}

export function subscribeToAnswers(gameId: string, cb: (answers: Answer[]) => void): Unsubscribe {
  return onSnapshot(answersRef(gameId), (snap) => {
    cb(snap.docs.map((d) => d.data() as Answer));
  });
}
