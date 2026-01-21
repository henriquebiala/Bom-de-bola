
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy, getDocs } from "firebase/firestore";
import { Category, Suggestion, Question } from "../types";

/**
 * CONFIGURAÇÃO OFICIAL - BOM DE BOLA (ANGOLA/SINGAPURA)
 */
export const firebaseConfig = {
  apiKey: "AIzaSyDD-dya6hAJ6VsjtGNoB2_qdcURRm0HVx8",
  authDomain: "bomdebola-72151.firebaseapp.com",
  databaseURL: "https://bomdebola-72151-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bomdebola-72151",
  storageBucket: "bomdebola-72151.firebasestorage.app",
  messagingSenderId: "6129356698",
  appId: "1:6129356698:web:15c524af863ece0ac9f423",
  measurementId: "G-EJ8ZTH7EXX"
};

// Inicialização segura
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export const isPlaceholder = false;

export const loginAdmin = (email: string, pass: string) => {
  return signInWithEmailAndPassword(auth, email, pass);
};

export const logoutAdmin = () => {
  return signOut(auth);
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const addSuggestion = async (suggestion: Omit<Suggestion, "id" | "timestamp"> & { options?: string[] }) => {
  return addDoc(collection(db, "suggestions"), {
    ...suggestion,
    timestamp: Date.now(),
    status: "pending"
  });
};

export const subscribeToSuggestions = (callback: (suggestions: Suggestion[]) => void) => {
  const q = query(collection(db, "suggestions"), orderBy("timestamp", "desc"));
  return onSnapshot(q, (snapshot) => {
    const suggestions = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    })) as Suggestion[];
    callback(suggestions);
  }, (err) => {
    console.error("Erro no Firestore:", err);
    callback([]);
  });
};

export const rejectSuggestion = async (id: string) => {
  return deleteDoc(doc(db, "suggestions", id));
};

export const approveSuggestion = async (suggestion: Suggestion & { options?: string[] }) => {
  const finalOptions = suggestion.options || [suggestion.answer, "Opção Errada 1", "Opção Errada 2", "Opção Errada 3"];
  
  await addDoc(collection(db, "questions"), {
    category: suggestion.category,
    question: suggestion.question,
    correctAnswer: suggestion.answer,
    options: finalOptions,
    explanation: "Sugestão aprovada pela comunidade.",
    timestamp: Date.now()
  });
  
  return rejectSuggestion(suggestion.id);
};

export const addOfficialQuestion = async (question: Omit<Question, "id">) => {
  return addDoc(collection(db, "questions"), {
    ...question,
    timestamp: Date.now()
  });
};

export const fetchApprovedQuestions = async (category: Category): Promise<Question[]> => {
  try {
    const queryRef = query(collection(db, "questions"));
    const snapshot = await getDocs(queryRef);
    return snapshot.docs
      .map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Question))
      .filter(item => item.category === category || category === Category.MIXED);
  } catch (e) {
    console.error("Erro ao carregar questões:", e);
    return [];
  }
};
