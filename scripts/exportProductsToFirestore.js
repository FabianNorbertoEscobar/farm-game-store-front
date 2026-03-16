/* eslint-env node */
/* eslint-disable no-undef */
import { initializeApp } from "firebase/app";
import {
    addDoc,
    collection,
    getDocs,
    getFirestore,
    writeBatch
} from "firebase/firestore";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID
};

const requiredKeys = Object.entries(firebaseConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key);

if (requiredKeys.length) {
    console.error(
        `Faltan variables de entorno: ${requiredKeys.join(", ")}. ` +
        "Revisá tu .env."
    );
    process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const COLLECTION = "products";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const productsPath = resolve(__dirname, "../src/data/products.json");

async function loadProducts() {
    const raw = await readFile(productsPath, "utf-8");
    return JSON.parse(raw);
}

async function clearCollection() {
    const collectionRef = collection(db, COLLECTION);
    const snapshot = await getDocs(collectionRef);

    if (snapshot.empty) {
        console.log(`ℹ️ No había documentos para eliminar en ${COLLECTION}`);
        return;
    }

    const docs = snapshot.docs;
    const batchSize = 500;

    for (let i = 0; i < docs.length; i += batchSize) {
        const batch = writeBatch(db);
        const slice = docs.slice(i, i + batchSize);
        slice.forEach((docSnapshot) => batch.delete(docSnapshot.ref));
        await batch.commit();
    }

    console.log(`🧹 ${docs.length} documentos eliminados de ${COLLECTION}`);
}

async function exportProducts() {
    const collectionRef = collection(db, COLLECTION);

    const products = await loadProducts();

    for (const product of products) {
        const docRef = await addDoc(collectionRef, product);
        console.log("Producto creado:", docRef.id);
    }

    console.log(`✅ ${products.length} productos exportados exitosamente`);
}

async function main() {
    await clearCollection();
    await exportProducts();
}

main().catch((error) => {
    console.error("Error al exportar productos:", error);
    process.exit(1);
});
