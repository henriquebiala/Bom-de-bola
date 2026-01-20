
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

// Verifica se ainda é o código de exemplo ou se já temos a chave real
export const isPlaceholder = firebaseConfig.apiKey.includes("COLE_AQUI");

let app, auth: any, db: any;

try {
  // Inicializa o estádio real
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (e) {
  console.warn("Erro ao ligar ao estádio (Firebase):", e);
}

export const loginAdmin = (email: string, pass: string) => {
  if (isPlaceholder) return Promise.resolve({ user: { email } });
  return signInWithEmailAndPassword(auth, email, pass);
};

export const logoutAdmin = () => {
  if (isPlaceholder) return Promise.resolve();
  return signOut(auth);
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  if (isPlaceholder) return () => {};
  return onAuthStateChanged(auth, callback);
};

export const addSuggestion = async (suggestion: Omit<Suggestion, "id" | "timestamp"> & { options?: string[] }) => {
  if (isPlaceholder) {
    const newSug = { ...suggestion, id: Math.random().toString(), timestamp: Date.now(), status: "pending" };
    const saved = JSON.parse(localStorage.getItem('bomdebola_suggestions') || '[]');
    saved.push(newSug);
    localStorage.setItem('bomdebola_suggestions', JSON.stringify(saved));
    return Promise.resolve(newSug);
  }
  return addDoc(collection(db, "suggestions"), {
    ...suggestion,
    timestamp: Date.now(),
    status: "pending"
  });
};

export const subscribeToSuggestions = (callback: (suggestions: Suggestion[]) => void) => {
  if (isPlaceholder) {
    const load = () => {
      const saved = JSON.parse(localStorage.getItem('bomdebola_suggestions') || '[]');
      callback(saved);
    };
    load();
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }
  const q = query(collection(db, "suggestions"), orderBy("timestamp", "desc"));
  return onSnapshot(q, (snapshot) => {
    const suggestions = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    })) as Suggestion[];
    callback(suggestions);
  }, (err) => {
    console.error("Erro no relvado (Firestore):", err);
    callback([]);
  });
};

export const rejectSuggestion = async (id: string) => {
  if (isPlaceholder) {
    const saved = JSON.parse(localStorage.getItem('bomdebola_suggestions') || '[]');
    const filtered = saved.filter((s: any) => s.id !== id);
    localStorage.setItem('bomdebola_suggestions', JSON.stringify(filtered));
    return Promise.resolve();
  }
  return deleteDoc(doc(db, "suggestions", id));
};

export const approveSuggestion = async (suggestion: Suggestion & { options?: string[] }) => {
  const finalOptions = suggestion.options || [suggestion.answer, "Opção Errada 1", "Opção Errada 2", "Opção Errada 3"];
  
  if (isPlaceholder) {
    const approved = JSON.parse(localStorage.getItem('bomdebola_questions') || '[]');
    approved.push({
      ...suggestion,
      correctAnswer: suggestion.answer,
      options: finalOptions,
      explanation: "Aprovado no modo offline."
    });
    localStorage.setItem('bomdebola_questions', JSON.stringify(approved));
    return rejectSuggestion(suggestion.id);
  }
  
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
  if (isPlaceholder) {
    const approved = JSON.parse(localStorage.getItem('bomdebola_questions') || '[]');
    approved.push({ ...question, id: Math.random().toString() });
    localStorage.setItem('bomdebola_questions', JSON.stringify(approved));
    return Promise.resolve();
  }
  return addDoc(collection(db, "questions"), {
    ...question,
    timestamp: Date.now()
  });
};

export const fetchApprovedQuestions = async (category: Category): Promise<Question[]> => {
  if (isPlaceholder) {
    const saved = JSON.parse(localStorage.getItem('bomdebola_questions') || '[]');
    return saved.filter((q: any) => q.category === category || category === Category.MIXED);
  }
  try {
    const queryRef = query(collection(db, "questions"));
    const snapshot = await getDocs(queryRef);
    return snapshot.docs
      .map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Question))
      .filter(item => item.category === category || category === Category.MIXED);
  } catch (e) {
    console.error("Erro ao carregar mambos do banco:", e);
    return [];
  }
};
