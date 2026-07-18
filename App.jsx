import React, { useState, useEffect, useRef, useCallback } from "react";
import { Users, Crown, Zap, Shield, Swords, Percent, EyeOff, Sparkles, Play, Copy, Check, ArrowRight, Trophy, Clock, Plus, Minus, MapPin, RefreshCw, Skull, Heart, Cast, Info } from "lucide-react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set as fbSet, query, orderByKey, startAt, endAt } from "firebase/database";

/* ---------------------------------------------------------
   FIREBASE
--------------------------------------------------------- */
const firebaseConfig = {
  apiKey: "AIzaSyDN_zRjqn9thVAoRdk5xnevibZvMJ1K7_4",
  authDomain: "quizi-285a1.firebaseapp.com",
  databaseURL: "https://quizi-285a1-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "quizi-285a1",
  storageBucket: "quizi-285a1.firebasestorage.app",
  messagingSenderId: "366463597293",
  appId: "1:366463597293:web:03dabc176d9c4af26daae4",
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

/* ---------------------------------------------------------
   FONTS
--------------------------------------------------------- */
function useGoogleFonts() {
  useEffect(() => {
    const id = "quiz-app-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&family=Nunito:wght@400;600;700;800&family=Space+Mono:wght@400;700&family=Lilita+One&display=swap";
    document.head.appendChild(link);
  }, []);
}
const F = { display: "'Baloo 2', system-ui, sans-serif", body: "'Nunito', system-ui, sans-serif", mono: "'Space Mono', monospace" };
const C = { bg: "#180F2E", bg2: "#241645", pink: "#FF3D7F", gold: "#FFC93C", teal: "#2EE6D6", violet: "#7B4EFF", cream: "#FFF6E9" };

/* ---------------------------------------------------------
   STORAGE (Firebase Realtime Database, même schéma de clés qu'avant)
--------------------------------------------------------- */
async function sGet(key) {
  try {
    const snap = await get(ref(db, `data/${key}`));
    return snap.exists() ? JSON.parse(snap.val()) : null;
  } catch {
    return null;
  }
}
async function sSet(key, value) {
  try {
    await fbSet(ref(db, `data/${key}`), JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
async function sList(prefix) {
  try {
    const q = query(ref(db, "data"), orderByKey(), startAt(prefix), endAt(prefix + "\uf8ff"));
    const snap = await get(q);
    if (!snap.exists()) return [];
    const keys = [];
    snap.forEach((child) => { keys.push(child.key); });
    return keys;
  } catch {
    return [];
  }
}


const roomKey = (code) => `qz:${code}:state`;
const playerKey = (code, pid) => `qz:${code}:player:${pid}`;
const answerKey = (code, qIdx, pid) => `qz:${code}:answer:${qIdx}:${pid}`;
const scoreKey = (code, pid) => `qz:${code}:score:${pid}`;
const timeKey = (code, pid) => `qz:${code}:time:${pid}`;
const debuffKeyPrefix = (code, qIdx, targetId) => `qz:${code}:debuff:${qIdx}:${targetId}:`;

/* ---------------------------------------------------------
   AVATARS (animaux uniquement, plus d'accessoires)
--------------------------------------------------------- */
const ANIMALS = ["🦊", "🐼", "🦁", "🐸", "🦄", "🐙", "🦥", "🐺", "🦉", "🐷", "🦖", "🐨", "🦩", "🐵", "🦔", "🐧", "🐯", "🦈", "🐻", "🦫"];

const FUN_PSEUDOS = [
  "Macron for sure", "Hollande en scoot", "Killian M'raté", "Le J c'est le S", "Tata Monique",
  "La Mélanch", "Jeaaaaaaanne", "Molusquo", "Patoch'", "La licorne dorée",
  "Pascal au bistrot", "Habile, Bill", "Zézette épouse X", "Juste Leblanc", "Jacquouille",
  "Chirac en slibar", "Cathy d'la compta", "Lenny Chon", "Couscous royal", "La moulaga",
  "Dalida en crocs", "Ciaaaaao bambino", "Lenny Bar", "Vegan sanguinaires", "Claquettes chausettes",
  "Pizza ananas", "Carlos big bisous", "Amandine du 38", "Tibo In Shnek",
];
function funPseudo() { return FUN_PSEUDOS[Math.floor(Math.random() * FUN_PSEUDOS.length)]; }

/* ---------------------------------------------------------
   CATEGORIES
--------------------------------------------------------- */
const CATEGORIES = [
  { id: "animaux", label: "Animaux", emoji: "🦁" },
  { id: "geo", label: "Géographie", emoji: "🗺️" },
  { id: "sport", label: "Sport", emoji: "⚽" },
  { id: "films", label: "Films & Séries", emoji: "🎬" },
  { id: "records", label: "Records inutiles", emoji: "🏆" },
  { id: "disney", label: "Disney", emoji: "🏰" },
  { id: "bouffe", label: "Alimentation & Restauration", emoji: "🍔" },
  { id: "logique", label: "Logique", emoji: "🧠" },
  { id: "jv", label: "Jeux vidéo", emoji: "🎮" },
  { id: "actu", label: "Ça a fait l'actu", emoji: "📰" },
  { id: "ortho", label: "Pièges d'orthographe", emoji: "✍️" },
  { id: "annees2000", label: "Ambiance Années 2000", emoji: "📼" },
  { id: "musique", label: "Culture Musicale", emoji: "🎵" },
  { id: "adulte18", label: "Ambiance -18", emoji: "🔞" },
];

const MAP_ZONES = [
  { id: "europe", label: "Europe", x: 47, y: 28 },
  { id: "afrique", label: "Afrique", x: 48, y: 52 },
  { id: "asie", label: "Asie", x: 68, y: 32 },
  { id: "am_nord", label: "Amérique du Nord", x: 20, y: 26 },
  { id: "am_sud", label: "Amérique du Sud", x: 28, y: 62 },
  { id: "oceanie", label: "Océanie", x: 80, y: 68 },
];

/* ---------------------------------------------------------
   QUESTION BANK — niveau ajusté pour un public 30-45 ans
--------------------------------------------------------- */
const QB = {
  animaux: [
    { type: "qcm", text: "Combien de cœurs a une pieuvre ?", options: ["1", "2", "3", "9"], answer: 3 },
    { type: "vf", text: "Les autruches meurent en mettant la tête sous l'eau par peur.", answer: false },
    { type: "qcm", text: "Quel animal dort le plus longtemps par jour ?", options: ["Le koala", "Le paresseux", "Le chat", "La chauve-souris"], answer: 3 },
    { type: "echelle", text: "Combien de mois un escargot peut-il hiberner ?", answer: 3, unit: "mois" },
    { type: "qcm", text: "Quel est le seul mammifère qui ne peut pas sauter ?", options: ["L'éléphant", "L'hippopotame", "Le rhinocéros", "Le tapir"], answer: 0 },
    { type: "vf", text: "Un groupe de flamants roses s'appelle une 'flamboyance'.", answer: true },
    { type: "qcm", text: "Combien de dents possède un escargot ?", options: ["0", "52", "14000", "300"], answer: 2 },
    { type: "qcm", text: "Quel animal a l'empreinte digitale la plus proche de celle de l'humain ?", options: ["Le gorille", "Le koala", "Le chimpanzé", "L'ours"], answer: 1 },
    { type: "qcm", text: "Combien de fois par seconde un colibri peut-il battre des ailes ?", options: ["Environ 5 fois", "Environ 20 fois", "Environ 50 fois", "Environ 80 fois"], answer: 2 },
    { type: "vf", text: "Les requins existaient déjà avant les dinosaures.", answer: true },
    { type: "qcm", text: "Quelle est la durée de gestation d'un éléphant ?", options: ["9 mois", "12 mois", "18 mois", "22 mois"], answer: 3 },
    { type: "echelle", text: "Combien de litres de sang un cœur de baleine bleue pompe-t-il par battement ?", answer: 220, unit: "litres" },
    { type: "qcm", text: "Quel animal peut se régénérer entièrement à partir d'un seul bras ?", options: ["Le crabe", "L'étoile de mer", "La méduse", "Le poulpe"], answer: 1 },
    { type: "vf", text: "Les kangourous ne peuvent pas reculer.", answer: true },
    { type: "qcm", text: "De combien de degrés un caméléon peut-il faire pivoter chaque œil indépendamment ?", options: ["180°", "270°", "360°", "90°"], answer: 1 },
    { type: "qcm", text: "Quel est le seul animal qui ne peut pas roter ni péter ?", options: ["Le crocodile", "Le poulpe", "Le serpent", "La girafe"], answer: 0 },
    { type: "vf", text: "Une crevette a le cœur situé dans la queue.", answer: false },
    { type: "echelle", text: "Combien de cerveaux a une sangsue ?", answer: 32, unit: "" },
    { type: "qcm", text: "Quel animal peut dormir avec la moitié du cerveau éveillée ?", options: ["Le dauphin", "Le chat", "Le hérisson", "Le lion"], answer: 0 },
    { type: "vf", text: "Les girafes n'ont que 7 vertèbres cervicales, comme les humains.", answer: true },
    { type: "qcm", text: "Quel est le plus petit mammifère du monde ?", options: ["La souris", "La musaraigne étrusque", "Le hamster nain", "La chauve-souris bourdon"], answer: 3 },
    { type: "qcm", text: "Combien de temps un ours peut-il hiberner ?", options: ["1 mois", "3 mois", "5-7 mois", "1 an"], answer: 2 },
    { type: "vf", text: "Le koala dort environ 12 heures par jour.", answer: false },
    { type: "qcm", text: "Quel animal marin peut se régénérer entièrement à partir d'un fragment de son corps ?", options: ["Le crabe", "L'oursin", "L'éponge de mer", "La raie"], answer: 2 },
    { type: "echelle", text: "Combien de dents a un requin en moyenne au cours de sa vie (en milliers) ?", answer: 30, unit: "milliers (≈)" },
    { type: "qcm", text: "Quel est le seul serpent qui construit un nid pour ses œufs ?", options: ["Le cobra royal", "La vipère", "Le python", "Le boa"], answer: 0 },
    { type: "vf", text: "Le pouls d'une souris bat plus vite que celui d'un éléphant.", answer: true },
  ],
  geo: [
    { type: "carte", text: "Pointe le continent où se trouve l'Égypte", answer: "afrique" },
    { type: "qcm", text: "Quelle est la capitale de l'Australie ?", options: ["Sydney", "Melbourne", "Canberra", "Perth"], answer: 2 },
    { type: "carte", text: "Pointe le continent où se trouve le Brésil", answer: "am_sud" },
    { type: "vf", text: "La Russie s'étend sur 11 fuseaux horaires.", answer: true },
    { type: "echelle", text: "Combien de pays compte le continent africain ?", answer: 54, unit: "pays" },
    { type: "qcm", text: "Quel est le plus petit État du monde ?", options: ["Monaco", "Le Vatican", "Nauru", "Saint-Marin"], answer: 1 },
    { type: "carte", text: "Pointe le continent où se trouve le Japon", answer: "asie" },
    { type: "qcm", text: "Quel fleuve traverse l'Égypte ?", options: ["Le Tigre", "Le Nil", "L'Euphrate", "Le Congo"], answer: 1 },
    { type: "qcm", text: "Quel pays possède le plus de fuseaux horaires (avec ses territoires) ?", options: ["Russie", "États-Unis", "France", "Chine"], answer: 2 },
    { type: "vf", text: "Le Canada partage une frontière terrestre avec trois autres pays.", answer: false },
    { type: "qcm", text: "Quelle mer sépare l'Europe de l'Afrique au niveau du détroit de Gibraltar ?", options: ["Mer Noire", "Mer Méditerranée", "Mer Rouge", "Mer Baltique"], answer: 1 },
    { type: "echelle", text: "Quelle est l'altitude du Mont Blanc en mètres (arrondie à la centaine) ?", answer: 4800, unit: "m" },
    { type: "carte", text: "Pointe le continent où se trouve l'Australie", answer: "oceanie" },
    { type: "qcm", text: "Quelle capitale européenne est construite sur 7 collines ?", options: ["Lisbonne", "Rome", "Athènes", "Budapest"], answer: 1 },
    { type: "vf", text: "L'Alaska a été acheté par les États-Unis à la Russie.", answer: true },
    { type: "qcm", text: "Quel désert est le plus grand du monde ?", options: ["Le Sahara", "Le désert de Gobi", "L'Antarctique", "Le désert d'Arabie"], answer: 2 },
    { type: "carte", text: "Pointe le continent où se trouve le Canada", answer: "am_nord" },
    { type: "qcm", text: "Quelle est la capitale du Brésil ?", options: ["Rio de Janeiro", "São Paulo", "Brasilia", "Salvador"], answer: 2 },
    { type: "vf", text: "La Suisse possède une petite façade maritime au sud.", answer: false },
    { type: "echelle", text: "Combien de pays sont membres de l'Union Européenne ?", answer: 27, unit: "pays" },
    { type: "qcm", text: "Quel pays possède le plus grand nombre d'îles au monde ?", options: ["Indonésie", "Suède", "Norvège", "Philippines"], answer: 2 },
    { type: "carte", text: "Pointe le continent où se trouve l'Inde", answer: "asie" },
    { type: "qcm", text: "Quelle chaîne de montagnes sépare l'Europe de l'Asie ?", options: ["Les Alpes", "L'Oural", "Les Carpates", "Les Pyrénées"], answer: 1 },
    { type: "vf", text: "Monaco est le plus petit État du monde, devant le Vatican.", answer: false },
    { type: "qcm", text: "Quel pays a pour capitale Ottawa ?", options: ["Les États-Unis", "Le Canada", "L'Australie", "La Nouvelle-Zélande"], answer: 1 },
    { type: "echelle", text: "Quelle est la longueur approximative du fleuve Amazone en kilomètres ?", answer: 6400, unit: "km" },
    { type: "qcm", text: "Dans quel pays se trouve le Machu Picchu ?", options: ["Le Mexique", "Le Chili", "Le Pérou", "La Bolivie"], answer: 2 },
  ],
  sport: [
    { type: "qcm", text: "Tous les combien d'années ont lieu les JO d'été ?", options: ["2 ans", "3 ans", "4 ans", "5 ans"], answer: 2 },
    { type: "vf", text: "Au tennis, 'love' signifie zéro point.", answer: true },
    { type: "echelle", text: "Combien de joueurs sur le terrain par équipe en rugby à XV ?", answer: 15, unit: "joueurs" },
    { type: "qcm", text: "Quel pays a codifié les règles modernes du badminton ?", options: ["Chine", "Inde", "Angleterre", "Japon"], answer: 2 },
    { type: "qcm", text: "Combien de trous compte un parcours de golf classique ?", options: ["9", "12", "18", "24"], answer: 2 },
    { type: "vf", text: "Le marathon doit sa distance à une légende grecque.", answer: true },
    { type: "qcm", text: "Dans quel sport parle-t-on d'un 'ace' ?", options: ["Le golf", "Le tennis", "Le volley", "Les trois"], answer: 3 },
    { type: "qcm", text: "Quelle équipe a remporté le plus de Ligues des Champions ?", options: ["FC Barcelone", "AC Milan", "Real Madrid", "Bayern Munich"], answer: 2 },
    { type: "echelle", text: "Quelle est la distance officielle d'un marathon en kilomètres ?", answer: 42, unit: "km" },
    { type: "vf", text: "Le volley-ball a été inventé au Japon avant d'arriver aux États-Unis.", answer: false },
    { type: "qcm", text: "Combien de sets faut-il gagner pour remporter un match de tennis en Grand Chelem (hommes) ?", options: ["2", "3", "4", "5"], answer: 1 },
    { type: "qcm", text: "Quel pays a inventé le judo ?", options: ["Chine", "Corée", "Japon", "Thaïlande"], answer: 2 },
    { type: "vf", text: "Le contre-la-montre à vélo se court toujours en équipe, jamais en solo.", answer: false },
    { type: "qcm", text: "Combien de temps dure un match de basket NBA (temps réglementaire) ?", options: ["40 minutes", "48 minutes", "60 minutes", "90 minutes"], answer: 1 },
    { type: "echelle", text: "Quelle est la hauteur d'un panier de basket en mètres ?", answer: 3.05, unit: "m" },
    { type: "qcm", text: "Quel pays organise le tournoi de tennis de Roland-Garros ?", options: ["L'Angleterre", "Les États-Unis", "La France", "L'Australie"], answer: 2 },
    { type: "vf", text: "Le ping-pong est aussi appelé tennis de table.", answer: true },
    { type: "qcm", text: "Combien de médailles d'or maximum peut-on gagner en gymnastique artistique individuelle aux JO ?", options: ["4", "6", "8", "Illimité"], answer: 1 },
    { type: "qcm", text: "Quel est le sport national du Japon ?", options: ["Le judo", "Le sumo", "Le karaté", "Le kendo"], answer: 1 },
    { type: "echelle", text: "Combien de manches gagnantes faut-il pour remporter un match de volley ?", answer: 3, unit: "sets" },
    { type: "vf", text: "Le surf fait partie des Jeux Olympiques depuis leur création moderne en 1896.", answer: false },
    { type: "qcm", text: "Quel pays a remporté le plus de Coupes du Monde de football ?", options: ["Allemagne", "Argentine", "Brésil", "Italie"], answer: 2 },
  ],
  films: [
    { type: "qcm", text: "Quel acteur a refusé le rôle de Neo dans Matrix ?", options: ["Will Smith", "Brad Pitt", "Tom Cruise", "Nicolas Cage"], answer: 0 },
    { type: "vf", text: "Dans 'Toy Story', Woody est un cow-boy en plastique.", answer: false },
    { type: "echelle", text: "Combien de saisons compte la série 'Friends' ?", answer: 10, unit: "saisons" },
    { type: "qcm", text: "Quel est le premier long-métrage d'animation Disney ?", options: ["Pinocchio", "Blanche-Neige", "Fantasia", "Bambi"], answer: 1 },
    { type: "vf", text: "Le premier Star Wars a été tourné entièrement en studio, sans extérieurs.", answer: false },
    { type: "qcm", text: "Quel réalisateur apparaît en caméo dans presque tous ses films ?", options: ["Tarantino", "Spielberg", "Nolan", "Hitchcock"], answer: 3 },
    { type: "qcm", text: "Quel film a remporté le premier Oscar du meilleur film en 1929 ?", options: ["Metropolis", "Wings", "Nosferatu", "Sunrise"], answer: 1 },
    { type: "echelle", text: "En quelle année est sorti le premier film Star Wars ?", answer: 1977, unit: "" },
    { type: "vf", text: "Heath Ledger a reçu son Oscar du meilleur acteur en personne, sur scène.", answer: false },
    { type: "qcm", text: "Quel acteur incarne Tony Stark / Iron Man ?", options: ["Chris Evans", "Robert Downey Jr.", "Chris Hemsworth", "Mark Ruffalo"], answer: 1 },
    { type: "qcm", text: "Quelle actrice détenait le record de nominations aux Oscars sans en avoir gagné ?", options: ["Meryl Streep", "Glenn Close", "Amy Adams", "Deborah Kerr"], answer: 1 },
    { type: "vf", text: "James Cameron a refusé de réaliser 'Avatar' pour se consacrer à 'Titanic 2'.", answer: false },
    { type: "qcm", text: "Quel film d'animation a rapporté le plus au box-office mondial ?", options: ["La Reine des Neiges 2", "Le Roi Lion (2019)", "Vice-Versa 2", "Zootopie"], answer: 2 },
    { type: "echelle", text: "Combien de films 'Harry Potter' compte la saga au cinéma ?", answer: 8, unit: "films" },
    { type: "qcm", text: "Quel acteur a joué Jack Sparrow dans Pirates des Caraïbes ?", options: ["Orlando Bloom", "Johnny Depp", "Geoffrey Rush", "Javier Bardem"], answer: 1 },
    { type: "vf", text: "'Breaking Bad' se déroule au Texas.", answer: false },
    { type: "qcm", text: "Quelle série met en scène des dragons et le trône de fer ?", options: ["The Witcher", "Vikings", "Game of Thrones", "The Last Kingdom"], answer: 2 },
    { type: "qcm", text: "Quel est le nom du réalisateur de la trilogie 'Le Seigneur des Anneaux' ?", options: ["Peter Jackson", "Ridley Scott", "James Cameron", "Guillermo del Toro"], answer: 0 },
    { type: "vf", text: "Le personnage de Dark Vador est le père de Luke Skywalker.", answer: true },
    { type: "echelle", text: "En quelle année est sorti le premier film Avengers ?", answer: 2012, unit: "" },
    { type: "qcm", text: "Quel film est connu pour la réplique 'Que la Force soit avec toi' ?", options: ["Star Trek", "Star Wars", "Dune", "Interstellar"], answer: 1 },
  ],
  records: [
    { type: "qcm", text: "Quel est le record du monde de vitesse en marche arrière (course) ?", options: ["Env. 15 km/h", "Env. 20 km/h", "Env. 24 km/h", "Env. 30 km/h"], answer: 2 },
    { type: "qcm", text: "Quel est l'objet le plus volé au monde dans les hôtels ?", options: ["Les serviettes", "Les oreillers", "Les bibles", "Les cintres"], answer: 0 },
    { type: "vf", text: "Le record du plus grand nombre de hot-dogs mangés en 10 min dépasse 70.", answer: true },
    { type: "qcm", text: "Quelle est la durée du plus long baiser filmé au cinéma ?", options: ["Env. 1 min", "Env. 3 min", "Env. 4 min", "Env. 6 min"], answer: 2 },
    { type: "echelle", text: "Quel est le record du monde du plus grand nombre de burpees en 1 heure ?", answer: 1000, unit: "burpees (≈)" },
    { type: "qcm", text: "Quel est le record de la plus longue barbe jamais mesurée ?", options: ["Env. 3 m", "Env. 5,3 m", "Env. 7 m", "Env. 9 m"], answer: 1 },
    { type: "vf", text: "Le record du plus long ongle de main dépasse 8 mètres au total.", answer: true },
    { type: "qcm", text: "Quel est le record de tomates lancées lors d'une édition de la Tomatina espagnole ?", options: ["Env. 20 tonnes", "Env. 60 tonnes", "Env. 150 tonnes", "Env. 300 tonnes"], answer: 2 },
    { type: "echelle", text: "Quel est le record du plus grand nombre de saucisses mangées en 10 minutes ?", answer: 40, unit: "saucisses (≈)" },
    { type: "qcm", text: "Quel est le record de vitesse d'un escargot de course (en mètres par heure environ) ?", options: ["Env. 1 m/h", "Env. 15 m/h", "Env. 47 m/h", "Env. 100 m/h"], answer: 2 },
    { type: "vf", text: "Le record du plus grand gâteau du monde pesait moins de 2 tonnes.", answer: false },
    { type: "qcm", text: "Quel est le record du plus long saut en longueur en trampoline urbain (discipline insolite) ?", options: ["Env. 3 m", "Env. 5 m", "Env. 8 m", "Env. 12 m"], answer: 2 },
    { type: "echelle", text: "Quel est le record du monde du plus grand nombre de pompes en 1 heure ?", answer: 3000, unit: "pompes (≈)" },
    { type: "qcm", text: "Quel est le record du plus grand rassemblement de personnes déguisées en la même chose ?", options: ["Super-héros", "Schtroumpfs", "Zombies", "Père Noël"], answer: 3 },
    { type: "vf", text: "Le record de la plus longue partie de Monopoly ininterrompue dépasse 700 jours.", answer: false },
    { type: "qcm", text: "Quel est le record du plus grand nombre de bougies soufflées d'un coup ?", options: ["Env. 10 000", "Env. 27 000", "Env. 50 000", "Env. 100 000"], answer: 1 },
    { type: "echelle", text: "Quelle est la taille de la plus grande pizza jamais faite, en mètres de diamètre ?", answer: 40, unit: "m (≈)" },
    { type: "qcm", text: "Quel est le record de la plus longue chaîne humaine jamais formée ?", options: ["Quelques centaines de km", "Plus de 600 km", "Plus de 1000 km", "Plus de 5000 km"], answer: 2 },
    { type: "vf", text: "Le record du plus rapide décrochage d'un Rubik's Cube dépasse 30 secondes.", answer: false },
    { type: "qcm", text: "Quel est le record du plus grand nombre de personnes brossant les dents en même temps ?", options: ["Env. 5 000", "Env. 30 000", "Env. 100 000", "Env. 300 000"], answer: 2 },
  ],
  disney: [
    { type: "qcm", text: "Comment s'appelle le crabe dans 'La Petite Sirène' ?", options: ["Sébastien", "Gaston", "Flounder", "Ariel"], answer: 0 },
    { type: "vf", text: "Dans 'Le Roi Lion', Rafiki est un babouin.", answer: true },
    { type: "qcm", text: "Quelle princesse Disney n'a pas de mère présente dans son film ?", options: ["Cendrillon", "Belle", "Les deux", "Aucune"], answer: 2 },
    { type: "echelle", text: "En quelle année est sorti le premier 'Toy Story' ?", answer: 1995, unit: "" },
    { type: "qcm", text: "Quel est le nom du renne dans 'La Reine des Neiges' ?", options: ["Olaf", "Sven", "Kristoff", "Marshmallow"], answer: 1 },
    { type: "vf", text: "Pixar a toujours été une filiale interne de Disney, jamais rachetée.", answer: false },
    { type: "qcm", text: "Quel film Disney se déroule à La Nouvelle-Orléans ?", options: ["Encanto", "La Princesse et la Grenouille", "Vaiana", "Raiponce"], answer: 1 },
    { type: "qcm", text: "Combien de prénoms différents la Belle au Bois Dormant porte-t-elle selon les versions ?", options: ["1", "2", "3", "4"], answer: 2 },
    { type: "qcm", text: "Quel est le nom du tigre ami de Winnie l'Ourson ?", options: ["Bourriquet", "Tigrou", "Coco Lapin", "Porcinet"], answer: 1 },
    { type: "vf", text: "Dans 'Aladdin', le génie est enfermé dans une lampe.", answer: true },
    { type: "qcm", text: "Quel est le métier du père de Vaiana dans le film 'Vaiana' ?", options: ["Pêcheur", "Chef du village", "Navigateur", "Agriculteur"], answer: 1 },
    { type: "echelle", text: "En quelle année est sorti le premier film 'Le Roi Lion' ?", answer: 1994, unit: "" },
    { type: "qcm", text: "Comment s'appelle la pieuvre méchante dans 'La Petite Sirène' ?", options: ["Ursula", "Maléfique", "Cruella", "Yzma"], answer: 0 },
    { type: "vf", text: "Dumbo est un éléphanteau qui vole grâce à une plume magique, sans avoir besoin de ses oreilles.", answer: false },
    { type: "qcm", text: "Quel est le nom du bonhomme de neige dans 'La Reine des Neiges' ?", options: ["Frosty", "Olaf", "Snowy", "Iceman"], answer: 1 },
    { type: "qcm", text: "Dans quel film Disney trouve-t-on le personnage de Baloo ?", options: ["Le Livre de la Jungle", "Robin des Bois", "Tarzan", "Frère des Ours"], answer: 0 },
    { type: "vf", text: "Mulan rejoint l'armée sous sa véritable identité, sans se déguiser.", answer: false },
    { type: "echelle", text: "Combien de films Disney classiques (canon officiel) existaient environ en 2020 ?", answer: 58, unit: "films (≈)" },
    { type: "qcm", text: "Quel est le nom du crabe conseiller du roi Triton ?", options: ["Sébastien", "Flounder", "Ariel", "Ursula"], answer: 0 },
    { type: "vf", text: "Le château emblématique du logo Disney est inspiré du château de Neuschwanstein en Allemagne.", answer: true },
    { type: "qcm", text: "Quel est le prénom de la mère porteuse de Bambi ?", options: ["Faline", "Aucun, elle meurt sans être nommée", "Fleur", "Douce"], answer: 1 },
  ],
  bouffe: [
    { type: "qcm", text: "D'où vient la pizza margherita ?", options: ["Rome", "Naples", "Milan", "Sicile"], answer: 1 },
    { type: "echelle", text: "Combien de litres de lait faut-il en moyenne pour 1 kg de fromage ?", answer: 10, unit: "litres" },
    { type: "vf", text: "Le miel ne se périme jamais s'il est bien conservé.", answer: true },
    { type: "qcm", text: "Quel pays consomme le plus de fromage par habitant ?", options: ["France", "Danemark", "Grèce", "Italie"], answer: 1 },
    { type: "qcm", text: "Quelle épice est la plus chère au monde au poids ?", options: ["La vanille", "Le safran", "La cardamome", "Le poivre noir"], answer: 1 },
    { type: "vf", text: "Le Nutella a été inventé pendant une pénurie de cacao liée à la 2nde Guerre Mondiale.", answer: true },
    { type: "qcm", text: "Les deux ingrédients historiques à l'origine du nom 'Coca-Cola' sont :", options: ["Cola et menthe", "Feuille de coca et noix de cola", "Café et cola", "Canne à sucre et cola"], answer: 1 },
    { type: "echelle", text: "Combien de types de fromages différents recense-t-on environ en France ?", answer: 1200, unit: "(≈)" },
    { type: "qcm", text: "Quel est l'ingrédient principal du houmous ?", options: ["Lentilles", "Pois chiches", "Haricots blancs", "Fèves"], answer: 1 },
    { type: "vf", text: "Le croissant est une invention 100% française, née à Paris.", answer: false },
    { type: "qcm", text: "Quel fromage est traditionnellement utilisé dans la vraie recette de tiramisu ?", options: ["Ricotta", "Mascarpone", "Parmesan", "Mozzarella"], answer: 1 },
    { type: "echelle", text: "Combien de degrés faut-il pour cuire un rôti de bœuf saignant (à cœur) ?", answer: 55, unit: "°C (≈)" },
    { type: "qcm", text: "D'où vient originellement le chocolat (la fève de cacao) ?", options: ["Afrique", "Amérique centrale", "Asie du Sud-Est", "Europe"], answer: 1 },
    { type: "vf", text: "Le sushi signifie littéralement 'poisson cru' en japonais.", answer: false },
    { type: "qcm", text: "Quelle boisson est obtenue par fermentation du raisin ?", options: ["La bière", "Le vin", "Le cidre", "L'hydromel"], answer: 1 },
    { type: "qcm", text: "Quel pays est à l'origine de la fondue au fromage ?", options: ["France", "Suisse", "Italie", "Belgique"], answer: 1 },
    { type: "echelle", text: "Combien de temps faut-il en moyenne pour faire lever une pâte à pain (en heures) ?", answer: 2, unit: "heures" },
    { type: "vf", text: "N'importe quel vin pétillant français peut légalement s'appeler champagne.", answer: false },
    { type: "qcm", text: "Quel est l'ingrédient qui donne sa couleur orange au curry ?", options: ["Le paprika", "Le curcuma", "Le safran", "Le piment"], answer: 1 },
    { type: "vf", text: "Le vrai wasabi japonais est fabriqué à partir de piment vert fermenté.", answer: false },
    { type: "qcm", text: "Quel pays est le plus grand producteur mondial de café ?", options: ["Colombie", "Brésil", "Vietnam", "Éthiopie"], answer: 1 },
  ],
  logique: [
    { type: "qcm", text: "Suite logique : 2, 6, 12, 20, 30, ... ?", options: ["36", "42", "40", "38"], answer: 1 },
    { type: "echelle", text: "Si 5 machines font 5 objets en 5 minutes, en combien de minutes 100 machines font 100 objets ?", answer: 5, unit: "minutes" },
    { type: "qcm", text: "Un menteur dit 'je mens toujours'. Que peut-on en déduire ?", options: ["Il dit vrai", "C'est un paradoxe", "Il ment", "Rien"], answer: 1 },
    { type: "vf", text: "Deux affirmations vraies peuvent sembler se contredire sans être logiquement incompatibles.", answer: true },
    { type: "qcm", text: "Combien de carrés au total dans une grille 3x3 (sous-carrés compris) ?", options: ["9", "13", "14", "16"], answer: 2 },
    { type: "qcm", text: "Trois interrupteurs commandent une ampoule dans une autre pièce, invisible pendant les manipulations. Combien d'allers minimum pour trouver le bon ?", options: ["1", "2", "3", "Impossible"], answer: 0 },
    { type: "echelle", text: "Un escargot grimpe un puits de 10m : il monte 3m le jour et redescend 2m la nuit. En combien de jours atteint-il le sommet ?", answer: 8, unit: "jours" },
    { type: "qcm", text: "Quel nombre complète la suite : 1, 1, 2, 3, 5, 8, ... ?", options: ["10", "11", "13", "15"], answer: 2 },
    { type: "vf", text: "Si tous les chats sont des animaux et que Félix est un chat, alors Félix est un animal.", answer: true },
    { type: "echelle", text: "J'ai 2 fois l'âge qu'avait mon frère quand j'avais l'âge qu'il a maintenant. Si j'ai 40 ans, quel âge a mon frère ?", answer: 30, unit: "ans" },
    { type: "qcm", text: "Combien de fois peut-on soustraire 5 de 25 avant d'obtenir un nombre négatif ?", options: ["4", "5", "6", "25"], answer: 1 },
    { type: "qcm", text: "Trouvez l'intrus : Cercle, Carré, Triangle, Rouge.", options: ["Cercle", "Carré", "Triangle", "Rouge"], answer: 3 },
    { type: "vf", text: "Le contraire du contraire de 'grand' est toujours 'petit'.", answer: false },
    { type: "echelle", text: "Trois amis se partagent 100€ dans un rapport de 1:2:2. Combien reçoit celui qui a la plus petite part ?", answer: 20, unit: "€" },
    { type: "qcm", text: "Si demain était hier, aujourd'hui serait un vendredi. Quel jour sommes-nous réellement ?", options: ["Mercredi", "Jeudi", "Samedi", "Dimanche"], answer: 1 },
    { type: "qcm", text: "Combien de fois l'aiguille des minutes dépasse celle des heures en 12 heures ?", options: ["10 fois", "11 fois", "12 fois", "24 fois"], answer: 1 },
    { type: "vf", text: "Un nombre pair plus un nombre impair donne toujours un nombre pair.", answer: false },
    { type: "echelle", text: "Combien de poignées de main y a-t-il si 5 personnes se serrent chacune la main une fois ?", answer: 10, unit: "poignées" },
    { type: "qcm", text: "Quel mot peut se former en mélangeant les lettres de 'CHIEN' ?", options: ["NICHE", "CHINE", "Les deux", "Aucun"], answer: 2 },
  ],
  jv: [
    { type: "qcm", text: "Quel est le jeu vidéo le plus vendu de tous les temps ?", options: ["GTA V", "Minecraft", "Tetris", "Wii Sports"], answer: 1 },
    { type: "vf", text: "Mario était à l'origine charpentier, pas plombier.", answer: true },
    { type: "qcm", text: "Quelle entreprise a créé 'The Legend of Zelda' ?", options: ["Sega", "Nintendo", "Capcom", "Square Enix"], answer: 1 },
    { type: "echelle", text: "En quelle année est sorti le tout premier jeu Pac-Man ?", answer: 1980, unit: "" },
    { type: "qcm", text: "Quel est le nom du rival de Mario dans Mario Kart ?", options: ["Waluigi", "Wario", "Bowser Jr", "Toad"], answer: 1 },
    { type: "vf", text: "Minecraft a été créé à l'origine par un développeur suédois.", answer: true },
    { type: "qcm", text: "Quel studio a développé 'The Witcher 3' ?", options: ["CD Projekt Red", "Bethesda", "Ubisoft", "FromSoftware"], answer: 0 },
    { type: "qcm", text: "Quelle console Sony a été la première à intégrer un lecteur CD ?", options: ["PS1", "PS2", "Saturn", "N64"], answer: 0 },
    { type: "vf", text: "Fortnite est un jeu développé par Ubisoft.", answer: false },
    { type: "qcm", text: "Quel est le plombier ennemi de Sonic ?", options: ["Bowser", "Dr Eggman", "Wario", "King K. Rool"], answer: 1 },
    { type: "echelle", text: "En quelle année est sortie la première PlayStation ?", answer: 1994, unit: "" },
    { type: "qcm", text: "Quel jeu vidéo met en scène un plombier qui sauve une princesse nommée Peach ?", options: ["Sonic", "Mario", "Kirby", "Donkey Kong"], answer: 1 },
    { type: "vf", text: "League of Legends a été développé par Blizzard.", answer: false },
    { type: "qcm", text: "Quelle entreprise a créé la console Xbox ?", options: ["Sony", "Nintendo", "Microsoft", "Sega"], answer: 2 },
    { type: "qcm", text: "Dans quel jeu incarne-t-on un fermier qui cultive et élève des animaux ?", options: ["Stardew Valley", "Terraria", "Don't Starve", "Subnautica"], answer: 0 },
    { type: "vf", text: "Le jeu 'Among Us' est sorti en 2020, en pleine explosion de sa popularité.", answer: false },
    { type: "echelle", text: "Combien de générations de consoles PlayStation existaient environ en 2024 ?", answer: 5, unit: "" },
    { type: "qcm", text: "Quel est le nom du chasseur de trésors dans la série 'Uncharted' ?", options: ["Nathan Drake", "Lara Croft", "Indiana Jones", "Marcus Fenix"], answer: 0 },
    { type: "vf", text: "Le personnage de Lara Croft est une archéologue aventurière.", answer: true },
    { type: "qcm", text: "Quel jeu de bac à sable en blocs a été racheté par Microsoft en 2014 ?", options: ["Roblox", "Minecraft", "Terraria", "Fortnite"], answer: 1 },
    { type: "echelle", text: "En quelle année est sortie la première Nintendo Switch ?", answer: 2017, unit: "" },
  ],
  actu: [
    { type: "qcm", text: "Quel événement sportif planétaire s'est tenu à Paris en 2024 ?", options: ["La Coupe du Monde", "Les Jeux Olympiques", "L'Euro de foot", "Le Mondial de rugby"], answer: 1 },
    { type: "vf", text: "ChatGPT a été lancé au grand public par OpenAI fin 2022.", answer: true },
    { type: "qcm", text: "Quelle entreprise a lancé le réseau social Threads en 2023 ?", options: ["Twitter/X", "Meta", "Google", "TikTok"], answer: 1 },
    { type: "qcm", text: "Quel pays a accueilli la Coupe du Monde de football masculin en 2022 ?", options: ["Russie", "Brésil", "Qatar", "Japon"], answer: 2 },
    { type: "vf", text: "La reine Elizabeth II est décédée en 2019, avant la pandémie.", answer: false },
    { type: "qcm", text: "Quelle plateforme d'échange de cryptomonnaies s'est effondrée fin 2022 ?", options: ["Coinbase", "Binance", "FTX", "Kraken"], answer: 2 },
    { type: "echelle", text: "En quelle année Notre-Dame de Paris a-t-elle rouvert après l'incendie de 2019 ?", answer: 2024, unit: "" },
    { type: "qcm", text: "Quel réseau social a changé de nom pour devenir 'X' ?", options: ["Facebook", "Twitter", "Instagram", "Snapchat"], answer: 1 },
    { type: "vf", text: "Le Japon a accueilli les Jeux Olympiques d'été de 2021 (décalés en raison du Covid-19).", answer: true },
    { type: "qcm", text: "Quelle entreprise a lancé le casque de réalité mixte 'Vision Pro' ?", options: ["Meta", "Apple", "Google", "Samsung"], answer: 1 },
    { type: "echelle", text: "En quelle année l'entreprise OpenAI a-t-elle été fondée ?", answer: 2015, unit: "" },
    { type: "qcm", text: "Quel pays a accueilli la Coupe du Monde de football féminin en 2023 ?", options: ["France", "Australie et Nouvelle-Zélande", "Brésil", "Canada"], answer: 1 },
    { type: "vf", text: "Le prince Harry et Meghan Markle ont quitté leurs fonctions royales officielles en 2016.", answer: false },
    { type: "qcm", text: "Quel film a remporté l'Oscar du meilleur film en 2023 (pour l'année 2022) ?", options: ["Everything Everywhere All at Once", "Top Gun: Maverick", "Avatar 2", "The Banshees of Inisherin"], answer: 0 },
    { type: "echelle", text: "En quelle année le Royaume-Uni a-t-il officiellement quitté l'Union Européenne (Brexit) ?", answer: 2020, unit: "" },
    { type: "qcm", text: "Quelle entreprise a lancé le premier grand modèle de chatbot IA grand public fin 2022 ?", options: ["Google", "OpenAI", "Microsoft", "Meta"], answer: 1 },
    { type: "vf", text: "Le télescope spatial James Webb a été lancé en 2015.", answer: false },
    { type: "qcm", text: "Quel pays a organisé la Coupe du Monde de rugby en 2023 ?", options: ["Angleterre", "France", "Nouvelle-Zélande", "Afrique du Sud"], answer: 1 },
    { type: "echelle", text: "En quelle année le roi Charles III a-t-il été couronné ?", answer: 2023, unit: "" },
  ],
  ortho: [
    { type: "qcm", text: "Comment écrit-on correctement ?", options: ["Apeler", "Appeler"], answer: 1 },
    { type: "qcm", text: "Quelle orthographe est correcte ?", options: ["Nénuphar", "Nénufar", "Nénufare"], answer: 0 },
    { type: "vf", text: "'Oignon' peut aussi s'écrire 'ognon' depuis la réforme de l'orthographe.", answer: true },
    { type: "qcm", text: "Comment écrit-on le son du coq ?", options: ["Cocorico", "Coccorico", "Coquorico"], answer: 0 },
    { type: "qcm", text: "Quelle est la bonne orthographe ?", options: ["Bonhomie", "Bonhommie", "Bonomie"], answer: 0 },
    { type: "qcm", text: "Comment écrit-on correctement le mot désignant un blocage de circulation ?", options: ["Enbouteillage", "Embouteillage"], answer: 1 },
    { type: "qcm", text: "Quelle est l'orthographe correcte de cette boisson écossaise, en français ?", options: ["Whisky", "Whiskey", "Wisky"], answer: 0 },
    { type: "vf", text: "'Millefeuille' s'écrit sans trait d'union depuis la réforme de 1990.", answer: true },
    { type: "qcm", text: "Comment écrit-on correctement ce fruit exotique ?", options: ["Kiwi", "Kiwie"], answer: 0 },
    { type: "qcm", text: "Quelle est l'orthographe correcte de ce mot signifiant 'de manière secrète' ?", options: ["Suppos ément", "Subrepticement", "Suprepticement"], answer: 1 },
    { type: "qcm", text: "Comment écrit-on correctement : 'il c'est trompé' ou 'il s'est trompé' ?", options: ["Il c'est trompé", "Il s'est trompé"], answer: 1 },
    { type: "vf", text: "'Évènement' et 'événement' sont deux orthographes correctes acceptées.", answer: true },
    { type: "qcm", text: "Quelle est la bonne orthographe de ce mot lié à la météo ?", options: ["Orage", "Horage", "Aurage"], answer: 0 },
    { type: "qcm", text: "Comment écrit-on correctement le verbe à l'infinitif signifiant 'faire une erreur' ?", options: ["Se tromper", "Ce tromper"], answer: 0 },
    { type: "vf", text: "'Chariot' prend deux 'r', comme 'charriot'.", answer: false },
    { type: "qcm", text: "Quelle est la bonne orthographe de ce mot lié aux fêtes ?", options: ["Anniversaire", "Anniversère", "Aniversaire"], answer: 0 },
    { type: "qcm", text: "Comment écrit-on correctement : 'il faut que je fasse' ou 'il faut que je face' ?", options: ["Il faut que je fasse", "Il faut que je face"], answer: 0 },
    { type: "vf", text: "'Parmi' prend toujours un 's' final, comme 'parmis'.", answer: false },
    { type: "qcm", text: "Quelle est l'orthographe correcte de ce mot lié à la cuisine italienne ?", options: ["Spaghetti", "Spaguetti", "Espaghetti"], answer: 0 },
    { type: "qcm", text: "Comment écrit-on correctement : 'malgré que' ou 'bien que' pour une concession correcte ?", options: ["Malgré que", "Bien que"], answer: 1 },
    { type: "vf", text: "'Résonance' s'écrit toujours avec deux 'n', comme 'résonnance'.", answer: false },
  ],
  annees2000: [
    { type: "qcm", text: "Quel réseau social a été fondé en 2004 ?", options: ["MySpace", "Facebook", "Twitter", "LinkedIn"], answer: 1 },
    { type: "vf", text: "L'iPhone original a été présenté par Steve Jobs en 2007.", answer: true },
    { type: "qcm", text: "Quelle console portable a cartonné au début des années 2000 avec les Pokémon ?", options: ["Game Boy Advance", "PSP", "Nintendo DS", "Game Gear"], answer: 0 },
    { type: "qcm", text: "Quelle émission de télé-réalité française a démarré en 2001 ?", options: ["Star Academy", "Loft Story", "Koh-Lanta", "Nice People"], answer: 1 },
    { type: "echelle", text: "En quelle année est sortie la première génération d'iPod ?", answer: 2001, unit: "" },
    { type: "vf", text: "MSN Messenger était l'une des messageries instantanées les plus utilisées dans les années 2000.", answer: true },
    { type: "qcm", text: "Quel film a remporté l'Oscar du meilleur film en l'an 2000 (pour l'année 1999) ?", options: ["Gladiator", "American Beauty", "Le Sixième Sens", "Matrix"], answer: 1 },
    { type: "qcm", text: "En quelle année YouTube a-t-il été lancé ?", options: ["2003", "2005", "2007", "2009"], answer: 1 },
    { type: "vf", text: "Le premier iPhone disposait déjà d'un App Store dès sa sortie en 2007.", answer: false },
    { type: "qcm", text: "Quel jeu de rythme avec guitare en plastique a cartonné dans les années 2000 ?", options: ["Guitar Hero", "Dance Dance Revolution", "Just Dance", "Singstar"], answer: 0 },
    { type: "echelle", text: "En quelle année est sorti le premier film de la saga 'Pirates des Caraïbes' ?", answer: 2003, unit: "" },
    { type: "qcm", text: "Quel site de blog/microblog est devenu populaire en 2006 avec des messages courts ?", options: ["Tumblr", "Twitter", "LiveJournal", "Skyrock"], answer: 1 },
    { type: "vf", text: "Le Nokia 3310 était surtout réputé pour son écran couleur haute définition.", answer: false },
    { type: "qcm", text: "Quelle chanson de R&B/pop a explosé en France dans les années 2000, portée par un boys band ou une popstar de cette décennie ?", options: ["Un titre des années 80", "Un titre des années 2000", "Un titre des années 60", "Un titre des années 90 uniquement"], answer: 1 },
    { type: "echelle", text: "En quelle année Facebook a-t-il été fondé ?", answer: 2004, unit: "" },
    { type: "qcm", text: "Quel jeu vidéo de simulation de vie a cartonné sur PC dans les années 2000 ?", options: ["Les Sims", "Animal Crossing", "Second Life", "Habbo Hotel"], answer: 0 },
    { type: "vf", text: "La Wii de Nintendo, sortie en 2006, ne proposait qu'une manette classique sans détection de mouvement.", answer: false },
    { type: "qcm", text: "Quel film culte de super-héros est sorti en salles en l'an 2000 ?", options: ["X-Men", "Spider-Man", "Batman Begins", "Iron Man"], answer: 0 },
    { type: "echelle", text: "En quelle année la Xbox originale de Microsoft est-elle sortie ?", answer: 2001, unit: "" },
    { type: "qcm", text: "Quel site de streaming musical/partage a été très populaire au tout début des années 2000 avant d'être fermé pour des questions de droits d'auteur ?", options: ["Spotify", "Napster", "Deezer", "SoundCloud"], answer: 1 },
  ],
  musique: [
    { type: "qcm", text: "Quel groupe a interprété 'Bohemian Rhapsody' ?", options: ["Led Zeppelin", "Queen", "The Rolling Stones", "Pink Floyd"], answer: 1 },
    { type: "vf", text: "Michael Jackson était membre des Jackson 5 avant sa carrière solo.", answer: true },
    { type: "qcm", text: "Quel instrument compte traditionnellement 88 touches ?", options: ["L'orgue", "Le piano", "L'accordéon", "Le clavecin"], answer: 1 },
    { type: "echelle", text: "En quelle année est sorti l'album 'Thriller' de Michael Jackson ?", answer: 1982, unit: "" },
    { type: "qcm", text: "Quelle chanteuse est surnommée la 'Reine de la Pop' ?", options: ["Cher", "Madonna", "Whitney Houston", "Mariah Carey"], answer: 1 },
    { type: "vf", text: "La Marseillaise a été composée par Rouget de Lisle.", answer: true },
    { type: "qcm", text: "Quel festival de musique français a lieu chaque année à Bourges ?", options: ["Les Vieilles Charrues", "Le Printemps de Bourges", "Solidays", "Rock en Seine"], answer: 1 },
    { type: "qcm", text: "Quel duo français a composé la musique électro du film 'Drive' ?", options: ["Justice", "Daft Punk", "College & Electric Youth", "Phoenix"], answer: 2 },
    { type: "vf", text: "Daft Punk s'est officiellement séparé en 2013.", answer: false },
    { type: "qcm", text: "Combien de cordes possède une guitare classique ?", options: ["4", "5", "6", "7"], answer: 2 },
    { type: "echelle", text: "En quelle année Édith Piaf est-elle décédée ?", answer: 1963, unit: "" },
    { type: "qcm", text: "Quel chanteur est surnommé 'le King' du rock'n'roll ?", options: ["Elvis Presley", "Chuck Berry", "Little Richard", "Jerry Lee Lewis"], answer: 0 },
    { type: "vf", text: "Les Beatles se sont formés à Londres.", answer: false },
    { type: "qcm", text: "Quel instrument à vent est traditionnellement associé au jazz de la Nouvelle-Orléans ?", options: ["Le saxophone", "La trompette", "La clarinette", "Les trois"], answer: 3 },
    { type: "qcm", text: "Quel opéra célèbre a été composé par Bizet et raconte l'histoire d'une cigarière séduisante ?", options: ["La Traviata", "Carmen", "Aïda", "Madame Butterfly"], answer: 1 },
    { type: "echelle", text: "Combien de temps dure en moyenne un opéra classique (en heures) ?", answer: 3, unit: "heures (≈)" },
    { type: "vf", text: "Mozart n'a commencé à composer qu'à partir de sa majorité, vers 18 ans.", answer: false },
    { type: "qcm", text: "Quel groupe britannique a sorti l'album 'The Dark Side of the Moon' ?", options: ["Led Zeppelin", "Pink Floyd", "The Who", "Genesis"], answer: 1 },
    { type: "vf", text: "Beethoven a continué à composer après être devenu sourd.", answer: true },
    { type: "qcm", text: "Quelle chanteuse française est connue pour 'La Vie en Rose' ?", options: ["Dalida", "Édith Piaf", "Barbara", "Juliette Gréco"], answer: 1 },
  ],
  adulte18: [
    { type: "echelle", text: "Combien de mètres mesure en moyenne le pénis d'une baleine bleue ?", answer: 2.5, unit: "m" },
    { type: "qcm", text: "Quel animal a le plus long pénis par rapport à sa taille corporelle ?", options: ["Le gorille", "Le bernacle (balane)", "L'éléphant", "Le taureau"], answer: 1 },
    { type: "vf", text: "Le canard a un pénis en forme de tire-bouchon (en spirale).", answer: true },
    { type: "qcm", text: "Chez la mante religieuse, que fait souvent la femelle pendant ou après l'accouplement ?", options: ["Elle s'endort", "Elle dévore le mâle", "Elle change de couleur", "Elle pond immédiatement"], answer: 1 },
    { type: "echelle", text: "Combien d'enfants aurait eus le sultan Moulay Ismaïl, détenteur du record historique ?", answer: 888, unit: "enfants (≈)" },
    { type: "vf", text: "L'escargot tire une 'flèche de l'amour' sur son partenaire avant l'accouplement.", answer: true },
    { type: "qcm", text: "Quel primate est réputé utiliser le sexe pour désamorcer les tensions sociales du groupe ?", options: ["Le chimpanzé", "Le bonobo", "L'orang-outan", "Le gorille"], answer: 1 },
    { type: "qcm", text: "Un préservatif aromatisé au bacon a réellement été commercialisé dans quel pays ?", options: ["France", "Royaume-Uni", "Japon", "Brésil"], answer: 1 },
    { type: "vf", text: "Le mot 'clitoris' vient d'un mot grec signifiant 'petite colline'.", answer: false },
    { type: "qcm", text: "D'où vient réellement le mot 'clitoris' en grec ancien ?", options: ["Clé", "Colline", "Fleur", "Perle"], answer: 0 },
    { type: "echelle", text: "Combien de temps dure en moyenne l'accouplement chez les porcs-épics (en minutes) ?", answer: 5, unit: "minutes (≈)" },
    { type: "vf", text: "Les kangourous mâles peuvent se battre en boxant avec leurs pattes avant.", answer: true },
    { type: "qcm", text: "Quel animal marin change de sexe au cours de sa vie selon les besoins du groupe ?", options: ["Le poisson-clown", "Le requin", "Le dauphin", "La méduse"], answer: 0 },
    { type: "vf", text: "Chez certaines espèces d'araignées, le mâle s'auto-mutile après l'accouplement pour empêcher toute concurrence.", answer: true },
    { type: "qcm", text: "Quel est le surnom donné à la ceinture de chasteté, en grande partie un mythe amplifié plus tard qu'au Moyen-Âge ?", options: ["Le cadenas d'amour", "La ceinture de vertu", "Le garde-fidélité", "Le verrou nuptial"], answer: 1 },
    { type: "echelle", text: "Combien de fois par jour un porc-épic mâle peut-il tenter de s'accoupler pendant la saison des amours ?", answer: 8, unit: "fois (≈)" },
    { type: "vf", text: "Le hamster femelle peut parfois manger ses petits si elle se sent menacée.", answer: true },
    { type: "qcm", text: "Chez quel animal le mâle 'chante' pour séduire, parfois pendant des heures sans interruption ?", options: ["La baleine à bosse", "Le lion", "Le paon", "Le grillon"], answer: 0 },
    { type: "vf", text: "Certains escargots sont hermaphrodites et possèdent les deux organes reproducteurs à la fois.", answer: true },
    { type: "qcm", text: "Quel est le nom donné au comportement du dauphin mâle, connu pour être l'un des rares animaux à chercher le plaisir sans but reproductif ?", options: ["Comportement récréatif", "Comportement territorial", "Comportement migratoire", "Comportement social pur"], answer: 0 },
  ],


};

/* ---------------------------------------------------------
   MODE KIDS — fin primaire / collège
--------------------------------------------------------- */
const KIDS_CATEGORIES = [
  { id: "k_animaux", label: "Animaux", emoji: "🐘" },
  { id: "k_nature", label: "Sciences & Nature", emoji: "🌱" },
  { id: "k_contes", label: "Contes & Dessins animés", emoji: "🧚" },
  { id: "k_sport", label: "Sport", emoji: "🏀" },
  { id: "k_geo", label: "Géo Facile", emoji: "🌍" },
  { id: "k_logique", label: "Logique Enfant", emoji: "🧩" },
];

const KIDS_QB = {
  k_animaux: [
    { type: "qcm", text: "Quel est le plus grand animal terrestre ?", options: ["Le rhinocéros", "L'éléphant", "La girafe", "L'hippopotame"], answer: 1 },
    { type: "vf", text: "Les poissons respirent grâce à leurs branchies.", answer: true },
    { type: "qcm", text: "Combien de pattes a une araignée ?", options: ["6", "8", "10", "4"], answer: 1 },
    { type: "qcm", text: "Quel animal est le roi de la savane ?", options: ["Le tigre", "Le lion", "L'éléphant", "Le léopard"], answer: 1 },
    { type: "vf", text: "La chauve-souris est un oiseau.", answer: false },
    { type: "qcm", text: "Comment s'appelle le bébé du chien ?", options: ["Le chiot", "Le poussin", "Le veau", "Le poulain"], answer: 0 },
    { type: "qcm", text: "Quel animal peut changer de couleur ?", options: ["Le caméléon", "Le hérisson", "Le lapin", "Le castor"], answer: 0 },
    { type: "vf", text: "Le panda mange principalement du bambou.", answer: true },
    { type: "qcm", text: "Quel est l'animal le plus rapide sur terre ?", options: ["Le lion", "Le guépard", "Le cheval", "L'aigle"], answer: 1 },
    { type: "echelle", text: "Combien de mois dure la grossesse d'une lionne ?", answer: 4, unit: "mois" },
    { type: "qcm", text: "Où vit le manchot empereur ?", options: ["En Afrique", "En Antarctique", "En Amazonie", "En Australie"], answer: 1 },
    { type: "vf", text: "Les abeilles fabriquent le miel.", answer: true },
  ],
  k_nature: [
    { type: "qcm", text: "De quoi les plantes ont-elles besoin pour pousser ?", options: ["D'eau et de lumière", "Que de nuit", "Que de sable", "Rien du tout"], answer: 0 },
    { type: "vf", text: "La Terre tourne autour du Soleil.", answer: true },
    { type: "qcm", text: "Combien y a-t-il de saisons dans une année ?", options: ["2", "3", "4", "5"], answer: 2 },
    { type: "qcm", text: "Quel est l'état de l'eau quand elle gèle ?", options: ["Liquide", "Solide", "Gazeux", "Elle disparaît"], answer: 1 },
    { type: "vf", text: "Les arbres respirent aussi.", answer: true },
    { type: "qcm", text: "Quelle planète est surnommée la planète rouge ?", options: ["Vénus", "Mars", "Jupiter", "Saturne"], answer: 1 },
    { type: "echelle", text: "Combien de temps met la Terre à faire un tour complet sur elle-même (en heures) ?", answer: 24, unit: "heures" },
    { type: "qcm", text: "Qu'est-ce qui nous donne de la lumière et de la chaleur le jour ?", options: ["La Lune", "Le Soleil", "Les étoiles", "Les nuages"], answer: 1 },
    { type: "vf", text: "L'arc-en-ciel apparaît quand il y a du soleil et de la pluie en même temps.", answer: true },
    { type: "qcm", text: "Combien de couleurs y a-t-il dans l'arc-en-ciel ?", options: ["5", "6", "7", "8"], answer: 2 },
  ],
  k_contes: [
    { type: "qcm", text: "Qui a mangé la grand-mère du Petit Chaperon Rouge ?", options: ["Le chasseur", "Le loup", "Le renard", "L'ours"], answer: 1 },
    { type: "vf", text: "Cendrillon perd sa chaussure de verre au bal.", answer: true },
    { type: "qcm", text: "Combien de nains vivent avec Blanche-Neige ?", options: ["5", "6", "7", "8"], answer: 2 },
    { type: "qcm", text: "Quel est le prénom du poisson-clown dans le film 'Le Monde de Nemo' ?", options: ["Marin", "Nemo", "Bruno", "Dory"], answer: 1 },
    { type: "vf", text: "Pinocchio est un pantin en bois qui devient un vrai petit garçon.", answer: true },
    { type: "qcm", text: "Dans Peter Pan, comment s'appelle le pays imaginaire ?", options: ["Le Pays Merveilleux", "Le Pays Imaginaire", "Neverland en anglais", "Les deux derniers"], answer: 3 },
    { type: "qcm", text: "Quel animal aide Simba à grandir dans 'Le Roi Lion' ?", options: ["Timon et Pumbaa", "Rafiki seul", "Zazu seul", "Mufasa"], answer: 0 },
    { type: "vf", text: "Dans 'La Reine des Neiges', Elsa peut créer de la glace avec ses mains.", answer: true },
    { type: "qcm", text: "Combien de vœux le génie accorde-t-il à Aladdin ?", options: ["1", "2", "3", "Autant qu'il veut"], answer: 2 },
  ],
  k_sport: [
    { type: "qcm", text: "Combien de joueurs sur le terrain dans une équipe de foot ?", options: ["9", "10", "11", "12"], answer: 2 },
    { type: "vf", text: "Au basket, un panier vaut toujours 3 points.", answer: false },
    { type: "qcm", text: "Tous les combien d'années ont lieu les Jeux Olympiques ?", options: ["2 ans", "4 ans", "6 ans", "8 ans"], answer: 1 },
    { type: "qcm", text: "Dans quel sport utilise-t-on une raquette et un filet ?", options: ["Le foot", "Le tennis", "Le rugby", "La natation"], answer: 1 },
    { type: "vf", text: "La natation se pratique dans l'eau.", answer: true },
    { type: "echelle", text: "Combien de joueurs y a-t-il dans une équipe de basket sur le terrain ?", answer: 5, unit: "joueurs" },
    { type: "qcm", text: "Quel sport se joue sur de la glace avec des patins et un palet ?", options: ["Le hockey", "Le curling", "Le ski", "Le patinage"], answer: 0 },
    { type: "vf", text: "Le vélo est un sport qui se pratique aussi aux Jeux Olympiques.", answer: true },
  ],
  k_geo: [
    { type: "qcm", text: "Quelle est la capitale de la France ?", options: ["Lyon", "Marseille", "Paris", "Toulouse"], answer: 2 },
    { type: "carte", text: "Pointe le continent où se trouve la France", answer: "europe" },
    { type: "vf", text: "La France a des montagnes appelées les Alpes.", answer: true },
    { type: "qcm", text: "Quel est le plus grand océan du monde ?", options: ["L'Atlantique", "Le Pacifique", "L'Indien", "L'Arctique"], answer: 1 },
    { type: "carte", text: "Pointe le continent où vivent les kangourous", answer: "oceanie" },
    { type: "qcm", text: "Comment s'appelle le pays en forme de botte en Europe ?", options: ["L'Espagne", "La Grèce", "L'Italie", "Le Portugal"], answer: 2 },
    { type: "vf", text: "La Grande Muraille se trouve en Chine.", answer: true },
    { type: "echelle", text: "Combien de continents y a-t-il sur Terre ?", answer: 6, unit: "continents" },
    { type: "qcm", text: "Quel monument célèbre se trouve à Paris ?", options: ["Big Ben", "La Tour Eiffel", "Le Colisée", "La Statue de la Liberté"], answer: 1 },
  ],
  k_logique: [
    { type: "qcm", text: "Quelle suite continue : 2, 4, 6, 8, ... ?", options: ["9", "10", "11", "12"], answer: 1 },
    { type: "echelle", text: "Combien font 7 + 8 ?", answer: 15, unit: "" },
    { type: "qcm", text: "Si aujourd'hui c'est lundi, quel jour serons-nous après-demain ?", options: ["Mardi", "Mercredi", "Jeudi", "Vendredi"], answer: 1 },
    { type: "vf", text: "Un carré a 4 côtés égaux.", answer: true },
    { type: "qcm", text: "Combien de minutes y a-t-il dans une heure ?", options: ["30", "45", "60", "100"], answer: 2 },
    { type: "echelle", text: "Combien font 5 x 4 ?", answer: 20, unit: "" },
    { type: "qcm", text: "Quel mot ne va pas avec les autres : chat, chien, table, lapin ?", options: ["Chat", "Chien", "Table", "Lapin"], answer: 2 },
    { type: "vf", text: "La moitié de 10 est 5.", answer: true },
  ],
};

function findCategory(id) {
  return CATEGORIES.find((c) => c.id === id) || KIDS_CATEGORIES.find((c) => c.id === id) || null;
}

function echelleMargin(q) {
  if (typeof q.margin === "number") return q.margin;
  const answer = Number(q.answer);
  return Math.max(1, Math.min(10, Math.round(Math.abs(answer) * 0.1)));
}

function pickQuestions(catIds, count, bank = QB) {
  const pool = [];
  catIds.forEach((c) => (bank[c] || []).forEach((q) => pool.push({ ...q, category: c })));
  for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
  return pool.slice(0, Math.min(count, pool.length));
}
function genCode() { const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ"; let s = ""; for (let i = 0; i < 4; i++) s += chars[Math.floor(Math.random() * chars.length)]; return s; }
function uid() { return Math.random().toString(36).slice(2, 10); }
function buildJoinUrl(code) {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}${window.location.pathname}?code=${code}`;
}

/* ---------------------------------------------------------
   JOKERS
--------------------------------------------------------- */
const JOKERS = [
  { id: "5050", label: "50/50", icon: Percent, emoji: "✂️", desc: "Retire 2 mauvaises réponses (QCM uniquement).", targeted: false },
  { id: "x2", label: "x2", icon: Zap, emoji: "⚡", desc: "Double tes points si tu réponds juste à cette question.", targeted: false },
  { id: "steal", label: "Vol de points", icon: Swords, emoji: "🗡️", desc: "Si tu réponds juste, vole 30 points à l'adversaire de ton choix.", targeted: true },
  { id: "block", label: "Blocage", icon: Shield, emoji: "🛡️", desc: "Si tu réponds juste, l'adversaire ciblé ne marque aucun point sur cette question.", targeted: true },
  { id: "flou", label: "Joker flou", icon: EyeOff, emoji: "🌫️", desc: "Floute l'écran de l'adversaire ciblé pendant la moitié du temps restant.", targeted: true },
];
const CARD_BACK_COLORS = [C.pink, C.teal, C.gold, C.violet, "#4ADE80", "#FF8C42"];

/* ---------------------------------------------------------
   SHARED UI
--------------------------------------------------------- */
function Stage({ children, wide }) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center" style={{ background: `radial-gradient(circle at 20% 0%, ${C.bg2}, ${C.bg} 60%)`, fontFamily: F.body, color: C.cream }}>
      <div className="w-full" style={{ height: 10, background: `linear-gradient(90deg, ${C.pink}, ${C.gold}, ${C.teal}, ${C.violet})` }} />
      <div className={`w-full ${wide ? "max-w-4xl" : "max-w-md"} px-5 py-8 flex-1 flex flex-col`}>{children}</div>
    </div>
  );
}
function Logo() {
  return (
    <div className="flex items-center justify-center gap-2 mb-8 select-none">
      <span style={{ fontSize: 34 }}>🎉</span>
      <h1
        style={{
          fontFamily: "'Lilita One', system-ui, sans-serif",
          fontSize: 46,
          letterSpacing: 1,
          color: C.gold,
          transform: "rotate(-3deg)",
          textShadow: `3px 3px 0 ${C.pink}, -1px -1px 0 ${C.violet}, 0 0 22px rgba(255,201,60,0.35)`,
        }}
      >
        Quizi
      </h1>
      <span style={{ fontSize: 34 }}>🎉</span>
    </div>
  );
}
function ScreenHeader({ title, onBack, color = C.gold }) {
  return (
    <div className="mb-6">
      {onBack && (<div className="mb-3"><GhostButton onClick={onBack} small>← Retour</GhostButton></div>)}
      <h2 className="text-center" style={{ fontFamily: F.display, fontSize: 24, color }}>{title}</h2>
    </div>
  );
}
function BigButton({ children, onClick, color = C.pink, disabled, icon: Icon }) {
  return (
    <button onClick={onClick} disabled={disabled} className="w-full rounded-2xl py-4 px-6 flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-40" style={{ background: color, fontFamily: F.display, fontSize: 20, color: "#1B1030", boxShadow: `0 6px 0 rgba(0,0,0,0.25)` }}>
      {Icon && <Icon size={20} />}
      {children}
    </button>
  );
}
function GhostButton({ children, onClick, small }) {
  return (
    <button onClick={onClick} className="rounded-xl border-2 transition-transform active:scale-95" style={{ borderColor: C.teal, color: C.teal, fontFamily: F.body, fontWeight: 700, padding: small ? "6px 12px" : "10px 18px", fontSize: small ? 13 : 15 }}>
      {children}
    </button>
  );
}
function Chip({ children, active, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} className="rounded-full px-4 py-2 text-sm font-bold transition-all disabled:opacity-30" style={{ fontFamily: F.body, background: active ? C.gold : "rgba(255,255,255,0.08)", color: active ? "#1B1030" : C.cream, border: `2px solid ${active ? C.gold : "rgba(255,255,255,0.2)"}` }}>
      {children}
    </button>
  );
}

function CategoryPicker({ cats, setCats, kidsMode, setKidsMode }) {
  const options = kidsMode ? KIDS_CATEGORIES : CATEGORIES;
  const allSelected = options.length > 0 && options.every((c) => cats.includes(c.id));
  function toggleCat(id) { setCats((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id])); }
  function toggleAll() { setCats(allSelected ? [] : options.map((c) => c.id)); }
  function toggleKids() {
    const next = !kidsMode;
    setKidsMode(next);
    setCats((next ? KIDS_CATEGORIES : CATEGORIES).map((c) => c.id));
  }
  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm opacity-70 font-bold">Catégories</p>
        <GhostButton onClick={toggleAll} small>{allSelected ? "Tout décocher" : "Tout cocher"}</GhostButton>
      </div>
      {setKidsMode && (
        <div className="mb-3">
          <Chip active={kidsMode} onClick={toggleKids}>🎈 Mode Kids (fin primaire / collège)</Chip>
        </div>
      )}
      <div className="grid grid-cols-2 gap-2 mb-6">{options.map((c) => (<Chip key={c.id} active={cats.includes(c.id)} onClick={() => toggleCat(c.id)}>{c.emoji} {c.label}</Chip>))}</div>
    </>
  );
}

/* ---------------------------------------------------------
   HOME
--------------------------------------------------------- */
function Home({ onCreate, onJoin, onSolo, onMatchAmor, onTestLab }) {
  return (
    <Stage>
      <Logo />
      <p className="text-center opacity-80 mb-8" style={{ fontSize: 15 }}>
        Culture générale, questions insolites, jokers vicieux. Un écran (TV ou téléphone casté) pour l'hôte, un téléphone par joueur.
      </p>
      <div className="flex flex-col gap-4">
        <BigButton onClick={onCreate} color={C.gold} icon={Crown}>Créer une partie (hôte)</BigButton>
        <BigButton onClick={onJoin} color={C.teal} icon={Users}>Rejoindre une partie</BigButton>
        <BigButton onClick={onMatchAmor} color={C.pink} icon={Skull}>Match Amor (élimination) 💔</BigButton>
        <BigButton onClick={onSolo} color={C.violet} icon={Skull}>Jouer seul / tester</BigButton>
        <GhostButton onClick={onTestLab}>🧪 Espace test (simuler 2 joueurs)</GhostButton>
      </div>
    </Stage>
  );
}

/* ---------------------------------------------------------
   SOLO
--------------------------------------------------------- */
function SoloHome({ onBack, onNormal, onCrash }) {
  return (
    <Stage>
      <ScreenHeader title="Jouer seul" onBack={onBack} color={C.violet} />
      <p className="text-sm opacity-70 mb-6 text-center">Pratique quand tu veux tester tes questions avant une vraie partie. Pas de jokers en solo — ils demandent des adversaires.</p>
      <div className="flex flex-col gap-4">
        <BigButton onClick={onNormal} color={C.teal}>Mode test classique</BigButton>
        <BigButton onClick={onCrash} color={C.pink} icon={Skull}>Mode Crash Test 💀</BigButton>
      </div>
      <p className="text-xs opacity-50 mt-4 text-center">Crash Test : temps illimité par question, mais 3 erreurs et c'est fini.</p>
    </Stage>
  );
}

function SoloProfile({ onBack, onNext }) {
  const [animal, setAnimal] = useState(null);
  const [pseudo, setPseudo] = useState("");
  const [error, setError] = useState("");
  return (
    <Stage>
      <ScreenHeader title="Ton avatar" onBack={onBack} color={C.violet} />
      <AvatarPicker animal={animal} onPick={setAnimal} taken={[]} />
      <div className="flex gap-2 mb-2 mt-4">
        <input value={pseudo} onChange={(e) => setPseudo(e.target.value)} placeholder="Écris ton pseudo..." className="flex-1 rounded-xl px-4 py-2" style={{ background: "rgba(255,255,255,0.08)", color: C.cream, border: `2px solid rgba(255,255,255,0.15)` }} />
        <button onClick={() => setPseudo(funPseudo())} className="rounded-xl px-3" style={{ background: C.gold }}><Sparkles size={18} color="#1B1030" /></button>
      </div>
      <p className="text-xs opacity-60 mb-4">✨ le bouton génère un pseudo fun si tu manques d'inspiration</p>
      {error && <p className="text-sm mb-3 text-center" style={{ color: C.pink }}>{error}</p>}
      <BigButton onClick={() => { if (!animal) return setError("Choisis un animal."); if (!pseudo.trim()) return setError("Choisis un pseudo."); onNext({ animal, pseudo: pseudo.trim() }); }} color={C.violet}>Continuer</BigButton>
    </Stage>
  );
}

function SoloSetup({ onBack, onStart, crash }) {
  const [cats, setCats] = useState(["animaux", "geo", "films"]);
  const [nb, setNb] = useState(10);
  const [seconds, setSeconds] = useState(20);
  const [kidsMode, setKidsMode] = useState(false);
  return (
    <Stage wide>
      <ScreenHeader title={crash ? "Crash Test — réglages" : "Mode test — réglages"} onBack={onBack} color={crash ? C.pink : C.teal} />
      <CategoryPicker cats={cats} setCats={setCats} kidsMode={kidsMode} setKidsMode={setKidsMode} />
      {!crash && (
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm opacity-70 mb-2 font-bold">Nombre de questions</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setNb((n) => Math.max(5, n - 1))} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Minus size={16} /></button>
              <span style={{ fontFamily: F.mono, fontSize: 22 }}>{nb}</span>
              <button onClick={() => setNb((n) => Math.min(30, n + 1))} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Plus size={16} /></button>
            </div>
          </div>
          <div>
            <p className="text-sm opacity-70 mb-2 font-bold">Secondes / question</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setSeconds((n) => Math.max(5, n - 5))} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Minus size={16} /></button>
              <span style={{ fontFamily: F.mono, fontSize: 22 }}>{seconds}s</span>
              <button onClick={() => setSeconds((n) => Math.min(60, n + 5))} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Plus size={16} /></button>
            </div>
          </div>
        </div>
      )}
      <BigButton onClick={() => onStart({ cats: cats.length ? cats : (kidsMode ? KIDS_CATEGORIES : CATEGORIES).map((c) => c.id), nb, seconds, kidsMode })} color={crash ? C.pink : C.teal} icon={Play}>{crash ? "Lancer le Crash Test" : "Commencer"}</BigButton>
    </Stage>
  );
}

function QuestionInput({ q, onSubmit, scaleVal, setScaleVal }) {
  if (q.type === "qcm") return (
    <div className="grid grid-cols-1 gap-3">
      {q.options.map((o, i) => (<button key={i} onClick={() => onSubmit(i)} className="rounded-xl py-3 px-4 text-left" style={{ background: "rgba(255,255,255,0.08)", fontFamily: F.body, fontWeight: 700, color: C.cream }}>{o}</button>))}
    </div>
  );
  if (q.type === "vf") return (
    <div className="flex gap-3">
      <button onClick={() => onSubmit(true)} className="flex-1 rounded-xl py-4" style={{ background: C.teal, color: "#1B1030", fontFamily: F.display, fontSize: 18 }}>Vrai</button>
      <button onClick={() => onSubmit(false)} className="flex-1 rounded-xl py-4" style={{ background: C.pink, color: "#1B1030", fontFamily: F.display, fontSize: 18 }}>Faux</button>
    </div>
  );
  if (q.type === "carte") return (
    <div className="relative rounded-xl" style={{ width: "100%", height: 200, background: "rgba(255,255,255,0.06)" }}>
      {MAP_ZONES.map((z) => (<button key={z.id} onClick={() => onSubmit(z.id)} className="absolute rounded-full px-2 py-1 text-xs" style={{ left: `${z.x}%`, top: `${z.y}%`, transform: "translate(-50%,-50%)", background: "rgba(255,255,255,0.15)", color: C.cream }}><MapPin size={12} className="inline mr-1" />{z.label}</button>))}
    </div>
  );
  if (q.type === "echelle") return (
    <div>
      <div className="flex items-center justify-center gap-3 mb-4">
        <button onClick={() => setScaleVal((v) => Number(v) - 1)} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Minus size={16} /></button>
        <input
          type="number"
          inputMode="decimal"
          value={scaleVal}
          onChange={(e) => setScaleVal(e.target.value === "" ? "" : Number(e.target.value))}
          className="text-center rounded-xl px-4 py-2"
          style={{ fontFamily: F.mono, fontSize: 28, color: C.cream, background: "rgba(255,255,255,0.08)", border: `2px solid rgba(255,255,255,0.2)`, width: 140 }}
        />
        <button onClick={() => setScaleVal((v) => Number(v) + 1)} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Plus size={16} /></button>
      </div>
      <BigButton onClick={() => onSubmit(scaleVal === "" ? 0 : scaleVal)} color={C.gold}>Valider</BigButton>
    </div>
  );
  return null;
}

function SoloQuiz({ config, profile, onExit }) {
  const [questions] = useState(() => pickQuestions(config.cats, config.nb, config.kidsMode ? KIDS_QB : QB));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [scaleVal, setScaleVal] = useState(0);
  const [startedAt, setStartedAt] = useState(Date.now());
  const left = useCountdown(answered ? null : startedAt, config.seconds);
  const q = questions[idx];

  function checkAnswer(value) {
    if (!q) return;
    let correct = false;
    if (q.type === "qcm" || q.type === "vf" || q.type === "carte") correct = value === q.answer;
    else if (q.type === "echelle") correct = Math.abs(Number(value) - Number(q.answer)) <= echelleMargin(q);
    setWasCorrect(correct);
    if (correct) setScore((s) => s + 100);
    setAnswered(true);
  }
  useEffect(() => { if (!answered && left === 0) setAnswered(true); }, [left, answered]);

  if (!q) return (
    <Stage>
      <Logo />
      <div className="text-center mt-8">
        <p style={{ fontFamily: F.display, fontSize: 24, color: C.gold }}>Terminé !</p>
        <p className="mt-2 opacity-80">Score : {score} pts sur {questions.length * 100}</p>
        <div className="mt-6"><BigButton onClick={onExit} color={C.violet}>Retour à l'accueil</BigButton></div>
      </div>
    </Stage>
  );

  return (
    <Stage>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs opacity-60 flex items-center gap-1">{profile?.animal} {profile?.pseudo}</span>
        <span className="text-xs opacity-60">Q{idx + 1}/{questions.length}</span>
        <span style={{ fontFamily: F.mono, fontSize: 18, color: C.teal }}>Score : {score}</span>
        <span style={{ fontFamily: F.mono, fontSize: 18, color: left <= 5 ? C.pink : C.gold }}>{left}s</span>
      </div>
      <div className="rounded-2xl p-5 mb-5" style={{ background: "rgba(255,255,255,0.06)" }}>
        <p className="text-xs uppercase tracking-widest opacity-50 mb-1">{findCategory(q.category)?.emoji} {findCategory(q.category)?.label}</p>
        <p style={{ fontFamily: F.display, fontSize: 20 }}>{q.text}</p>
      </div>
      {!answered ? (
        <QuestionInput q={q} onSubmit={checkAnswer} scaleVal={scaleVal} setScaleVal={setScaleVal} />
      ) : (
        <div className="text-center">
          <p style={{ fontFamily: F.display, fontSize: 22, color: wasCorrect ? C.teal : C.pink }}>{wasCorrect ? "Bonne réponse ! 🎉" : "Raté !"}</p>
          {q.type === "echelle" && <p className="text-sm opacity-70 mt-1">Réponse : {q.answer} {q.unit || ""}</p>}
          <div className="mt-4"><BigButton onClick={() => { setAnswered(false); setScaleVal(0); setStartedAt(Date.now()); setIdx((i) => i + 1); }} color={C.gold} icon={ArrowRight}>Suivant</BigButton></div>
        </div>
      )}
    </Stage>
  );
}

function CrashTest({ config, profile, onExit }) {
  const [pool] = useState(() => pickQuestions(config.cats, 500, config.kidsMode ? KIDS_QB : QB));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [answered, setAnswered] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [scaleVal, setScaleVal] = useState(0);
  const q = pool[idx % pool.length];

  function checkAnswer(value) {
    let correct = false;
    if (q.type === "qcm" || q.type === "vf" || q.type === "carte") correct = value === q.answer;
    else if (q.type === "echelle") correct = Math.abs(Number(value) - Number(q.answer)) <= echelleMargin(q);
    setWasCorrect(correct);
    if (correct) setScore((s) => s + 100); else setLives((l) => l - 1);
    setAnswered(true);
  }
  const dead = lives <= 0;

  return (
    <Stage>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs opacity-60 flex items-center gap-1">{profile?.animal} {profile?.pseudo}</span>
        <span style={{ fontFamily: F.mono, fontSize: 18, color: C.teal }}>Score : {score}</span>
        <span className="flex gap-1">{[0, 1, 2].map((i) => (<Heart key={i} size={18} fill={i < lives ? C.pink : "transparent"} color={C.pink} />))}</span>
      </div>
      {dead ? (
        <div className="text-center mt-8">
          <Skull size={48} className="mx-auto mb-3" color={C.pink} />
          <p style={{ fontFamily: F.display, fontSize: 24, color: C.gold }}>Crash Test terminé</p>
          <p className="mt-2 opacity-80">Score final : {score} pts — {idx} questions vues</p>
          <div className="mt-6"><BigButton onClick={onExit} color={C.violet}>Retour à l'accueil</BigButton></div>
        </div>
      ) : (
        <>
          <div className="rounded-2xl p-5 mb-5" style={{ background: "rgba(255,255,255,0.06)" }}><p className="text-xs uppercase tracking-widest opacity-50 mb-1">{findCategory(q.category)?.emoji} {findCategory(q.category)?.label}</p><p style={{ fontFamily: F.display, fontSize: 20 }}>{q.text}</p></div>
          {!answered ? (
            <QuestionInput q={q} onSubmit={checkAnswer} scaleVal={scaleVal} setScaleVal={setScaleVal} />
          ) : (
            <div className="text-center">
              <p style={{ fontFamily: F.display, fontSize: 22, color: wasCorrect ? C.teal : C.pink }}>{wasCorrect ? "Bonne réponse ! 🎉" : "Raté ! 💔"}</p>
              {q.type === "echelle" && <p className="text-sm opacity-70 mt-1">Réponse : {q.answer} {q.unit || ""}</p>}
              <div className="mt-4"><BigButton onClick={() => { setAnswered(false); setScaleVal(0); setIdx((i) => i + 1); }} color={C.gold} icon={ArrowRight}>Suivant</BigButton></div>
            </div>
          )}
        </>
      )}
    </Stage>
  );
}

/* ---------------------------------------------------------
   AVATAR PICKER
--------------------------------------------------------- */
function AvatarPicker({ animal, onPick, taken }) {
  return (
    <div className="mb-4">
      <div className="flex justify-center mb-3"><div className="flex items-center justify-center rounded-full" style={{ width: 84, height: 84, background: "rgba(255,255,255,0.08)", border: `3px solid ${C.teal}`, fontSize: 42 }}>{animal || "❓"}</div></div>
      <p className="text-xs mb-2 opacity-70 text-center">Choisis ton animal (déjà pris = indisponible)</p>
      <div className="flex flex-wrap gap-2 justify-center">
        {ANIMALS.map((a) => { const isTaken = taken.includes(a) && a !== animal; return (<button key={a} disabled={isTaken} onClick={() => onPick(a)} className="rounded-lg text-xl p-1.5 disabled:opacity-20" style={{ background: a === animal ? C.pink : "rgba(255,255,255,0.06)" }}>{a}</button>); })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   ADMIN: CREATE / SETTINGS
--------------------------------------------------------- */
function CreateRoom({ onCreated, onBack }) {
  const [cats, setCats] = useState(["animaux", "geo", "films"]);
  const [nbQuestions, setNbQuestions] = useState(10);
  const [types, setTypes] = useState({ qcm: true, vf: true, carte: true, echelle: true });
  const [jokers, setJokers] = useState({ "5050": true, x2: true, steal: true, block: false, flou: true });
  const [seconds, setSeconds] = useState(20);
  const [teamsMode, setTeamsMode] = useState(1);
  const [malus, setMalus] = useState(0);
  const [jokerRandom, setJokerRandom] = useState(false);
  const [jokerRandomCount, setJokerRandomCount] = useState(2);
  const [kidsMode, setKidsMode] = useState(false);
  function toggleType(t) { setTypes((s) => ({ ...s, [t]: !s[t] })); }
  function toggleJoker(j) { setJokers((s) => ({ ...s, [j]: !s[j] })); }

  async function create() {
    const activeTypes = Object.entries(types).filter(([, v]) => v).map(([k]) => k);
    const bank = kidsMode ? KIDS_QB : QB;
    const catOptions = kidsMode ? KIDS_CATEGORIES : CATEGORIES;
    let pool = pickQuestions(cats.length ? cats : catOptions.map((c) => c.id), 500, bank).filter((q) => activeTypes.includes(q.type));
    const questions = pool.slice(0, nbQuestions);
    const code = genCode();
    const state = { phase: "lobby", code, settings: { seconds, jokers, teamsMode, malus, jokerRandom, jokerRandomCount, kidsMode }, questions, currentIndex: -1, questionStartedAt: null, createdAt: Date.now() };
    await sSet(roomKey(code), state);
    onCreated(code, state);
  }

  return (
    <Stage wide>
      <ScreenHeader title="Réglages de la partie" onBack={onBack} />
      <p className="text-xs opacity-50 mb-4 text-center flex items-center justify-center gap-1"><Cast size={14} /> Sur téléphone : utilise l'affichage sans fil (AirPlay / Chromecast) pour caster cet écran sur la TV.</p>
      <CategoryPicker cats={cats} setCats={setCats} kidsMode={kidsMode} setKidsMode={setKidsMode} />
      <p className="text-sm opacity-70 mb-2 font-bold">Types de questions</p>
      <div className="flex flex-wrap gap-2 mb-6">
        <Chip active={types.qcm} onClick={() => toggleType("qcm")}>QCM</Chip>
        <Chip active={types.vf} onClick={() => toggleType("vf")}>Vrai / Faux</Chip>
        <Chip active={types.carte} onClick={() => toggleType("carte")}>Pointer sur la carte</Chip>
        <Chip active={types.echelle} onClick={() => toggleType("echelle")}>Réponse chiffrée</Chip>
      </div>
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-sm opacity-70 mb-2 font-bold">Nombre de questions</p>
          <div className="flex items-center gap-3">
            <button onClick={() => setNbQuestions((n) => Math.max(5, n - 1))} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Minus size={16} /></button>
            <span style={{ fontFamily: F.mono, fontSize: 22 }}>{nbQuestions}</span>
            <button onClick={() => setNbQuestions((n) => Math.min(30, n + 1))} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Plus size={16} /></button>
          </div>
        </div>
        <div>
          <p className="text-sm opacity-70 mb-2 font-bold">Secondes par question</p>
          <div className="flex items-center gap-3">
            <button onClick={() => setSeconds((n) => Math.max(5, n - 5))} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Minus size={16} /></button>
            <span style={{ fontFamily: F.mono, fontSize: 22 }}>{seconds}s</span>
            <button onClick={() => setSeconds((n) => Math.min(60, n + 5))} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Plus size={16} /></button>
          </div>
        </div>
      </div>
      <p className="text-sm opacity-70 mb-2 font-bold">Mode équipes (composées par toi, l'hôte, dans le salon)</p>
      <div className="flex gap-2 mb-6">{[1, 2, 3, 4].map((n) => (<Chip key={n} active={teamsMode === n} onClick={() => setTeamsMode(n)}>{n === 1 ? "Chacun pour soi" : `${n} équipes`}</Chip>))}</div>
      <p className="text-sm opacity-70 mb-2 font-bold">Jokers activés (1 fois par partie chacun, 1 joker max par question)</p>
      <div className="flex flex-wrap gap-2 mb-6">{JOKERS.map((j) => (<Chip key={j.id} active={jokers[j.id]} onClick={() => toggleJoker(j.id)}>{j.label}</Chip>))}</div>

      <p className="text-sm opacity-70 mb-2 font-bold">Attribution des jokers</p>
      <div className="flex flex-wrap gap-2 mb-3">
        <Chip active={!jokerRandom} onClick={() => setJokerRandom(false)}>Tous les jokers activés pour tous</Chip>
        <Chip active={jokerRandom} onClick={() => setJokerRandom(true)}>Tirage aléatoire 🎴</Chip>
      </div>
      {jokerRandom && (
        <div className="flex items-center gap-3 mb-6">
          <span className="text-sm opacity-70">Jokers par joueur :</span>
          <button onClick={() => setJokerRandomCount((n) => Math.max(1, n - 1))} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Minus size={16} /></button>
          <span style={{ fontFamily: F.mono, fontSize: 20 }}>{jokerRandomCount}</span>
          <button onClick={() => setJokerRandomCount((n) => Math.min(JOKERS.length, n + 1))} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Plus size={16} /></button>
        </div>
      )}

      <p className="text-sm opacity-70 mb-2 font-bold">Malus en cas de mauvaise réponse (bonus max toujours 100 pts)</p>
      <div className="flex flex-wrap gap-2 mb-8">
        {[0, -25, -50, -100].map((m) => (<Chip key={m} active={malus === m} onClick={() => setMalus(m)}>{m === 0 ? "Aucun" : `${m} pts`}</Chip>))}
      </div>

      <BigButton onClick={create} color={C.pink} icon={Play}>Créer la salle</BigButton>
    </Stage>
  );
}

/* ---------------------------------------------------------
   PLAYER JOIN
--------------------------------------------------------- */
function JoinRoom({ onJoined, onBack, initialCode }) {
  const [step, setStep] = useState("code");
  const [code, setCode] = useState(initialCode || "");
  const [room, setRoom] = useState(null);
  const [players, setPlayers] = useState([]);
  const [animal, setAnimal] = useState(null);
  const [pseudo, setPseudo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const autoTried = useRef(false);

  async function validateCode(codeOverride) {
    setError("");
    const c = (typeof codeOverride === "string" ? codeOverride : code).trim().toUpperCase();
    if (c.length !== 4) return setError("Le code fait 4 lettres.");
    setLoading(true);
    const r = await sGet(roomKey(c));
    if (!r) { setLoading(false); return setError("Salle introuvable, vérifie le code."); }
    const pKeys = await sList(`qz:${c}:player:`);
    const list = (await Promise.all(pKeys.map((k) => sGet(k)))).filter(Boolean);
    setPlayers(list);
    setRoom(r);
    setCode(c);
    setLoading(false);
    setStep("pseudo");
  }

  useEffect(() => {
    if (initialCode && !autoTried.current) {
      autoTried.current = true;
      validateCode(initialCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCode]);

  async function continueFromPseudo() {
    const trimmed = pseudo.trim();
    if (!trimmed) return setError("Choisis un pseudo.");
    setError("");
    const existing = players.find((p) => p.pseudo.trim().toLowerCase() === trimmed.toLowerCase());
    if (existing) {
      setLoading(true);
      const [drawnJokers, usedJokers] = await Promise.all([
        sGet(`qz:${code}:playerjokers:${existing.id}`),
        sGet(`qz:${code}:jokerused:${existing.id}`),
      ]);
      const enabledIds = Object.entries(room.settings.jokers || {}).filter(([, v]) => v).map(([k]) => k);
      const assigned = room.settings.jokerRandom ? (drawnJokers || []) : enabledIds;
      setLoading(false);
      onJoined(code, existing.id, { pseudo: existing.pseudo, animal: existing.animal }, room, { isReconnect: true, assignedJokers: assigned, usedJokersEver: usedJokers || [] });
      return;
    }
    setAnimal(null);
    setStep("avatar");
  }

  async function join() {
    if (!animal) return setError("Choisis un animal.");
    setError(""); setLoading(true);
    const pid = uid();
    const trimmed = pseudo.trim();
    await sSet(playerKey(code, pid), { id: pid, pseudo: trimmed, animal, team: 1, joinedAt: Date.now() });
    await sSet(scoreKey(code, pid), 0);
    setLoading(false);
    onJoined(code, pid, { pseudo: trimmed, animal }, room, null);
  }

  if (step === "code") return (
    <Stage>
      <ScreenHeader title="Rejoindre" onBack={onBack} color={C.teal} />
      <p className="text-sm opacity-70 mb-2 font-bold">Code de la salle</p>
      <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 4))} placeholder="EX: FUNK" className="w-full mb-4 rounded-xl px-4 py-3 text-center tracking-[0.3em]" style={{ fontFamily: F.mono, fontSize: 22, background: "rgba(255,255,255,0.08)", color: C.cream, border: `2px solid ${C.violet}` }} />
      {error && <p className="text-sm mb-3" style={{ color: C.pink }}>{error}</p>}
      <BigButton onClick={() => validateCode()} color={C.teal} disabled={loading}>{loading ? "..." : "Continuer"}</BigButton>
    </Stage>
  );

  if (step === "pseudo") return (
    <Stage>
      <ScreenHeader title="Ton pseudo" onBack={() => setStep("code")} color={C.teal} />
      <div className="flex gap-2 mb-2">
        <input value={pseudo} onChange={(e) => setPseudo(e.target.value)} placeholder="Écris ton pseudo..." className="flex-1 rounded-xl px-4 py-2" style={{ background: "rgba(255,255,255,0.08)", color: C.cream, border: `2px solid rgba(255,255,255,0.15)` }} />
        <button onClick={() => setPseudo(funPseudo())} className="rounded-xl px-3" style={{ background: C.gold }}><Sparkles size={18} color="#1B1030" /></button>
      </div>
      <p className="text-xs opacity-60 mb-4">✨ le bouton génère un pseudo fun si tu manques d'inspiration. Si tu retapes exactement le même pseudo qu'avant dans cette salle, tu retrouves ta place et tes points.</p>
      {error && <p className="text-sm mb-3" style={{ color: C.pink }}>{error}</p>}
      <BigButton onClick={continueFromPseudo} color={C.teal} disabled={loading}>{loading ? "..." : "Continuer"}</BigButton>
    </Stage>
  );

  return (
    <Stage>
      <ScreenHeader title="Ton avatar" onBack={() => setStep("pseudo")} color={C.teal} />
      <AvatarPicker animal={animal} onPick={setAnimal} taken={players.map((p) => p.animal)} />
      {error && <p className="text-sm mb-3 text-center" style={{ color: C.pink }}>{error}</p>}
      <BigButton onClick={join} color={C.teal} disabled={loading}>{loading ? "..." : "Rejoindre la partie"}</BigButton>
    </Stage>
  );
}

function JokerTuto({ room, onDone }) {
  const enabled = JOKERS.filter((j) => room?.settings?.jokers?.[j.id]);
  const isRandom = room?.settings?.jokerRandom;
  return (
    <Stage>
      <div className="text-center mb-2" style={{ fontSize: 40 }}>🎪</div>
      <h2 className="text-center mb-3" style={{ fontFamily: F.display, fontSize: 26, color: C.gold }}>La boîte à jokers</h2>
      <p className="text-sm opacity-70 mb-5 text-center">
        {isRandom
          ? `Tirage au sort ce soir : tu repartiras avec ${room.settings.jokerRandomCount || 2} joker(s) parmi la liste ci-dessous. Un seul joker par question !`
          : "Chaque joker n'est jouable qu'une seule fois par partie, et un seul à la fois par question."}
      </p>
      <div className="flex flex-col gap-3 mb-6">
        {enabled.map((j) => (
          <div key={j.id} className="rounded-2xl p-3 flex items-center gap-3" style={{ background: "rgba(255,255,255,0.06)", border: "2px solid rgba(255,255,255,0.12)" }}>
            <div className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: 46, height: 46, background: "rgba(255,255,255,0.1)", fontSize: 22 }}>{j.emoji}</div>
            <div>
              <p style={{ fontFamily: F.display, fontSize: 17, color: C.gold }}>{j.label}</p>
              <p className="text-xs opacity-80">{j.desc}</p>
            </div>
          </div>
        ))}
        {enabled.length === 0 && <p className="text-sm opacity-60 text-center">Aucun joker activé pour cette partie.</p>}
      </div>
      <BigButton onClick={onDone} color={C.gold}>C'est parti !</BigButton>
    </Stage>
  );
}

function JokerDraw({ room, code, pid, onDone }) {
  const enabledIds = Object.entries(room.settings.jokers || {}).filter(([, v]) => v).map(([k]) => k);
  const jokerDefs = JOKERS.filter((j) => enabledIds.includes(j.id));
  const [deck] = useState(() => {
    const arr = jokerDefs.map((j, i) => ({ ...j, backColor: CARD_BACK_COLORS[i % CARD_BACK_COLORS.length] }));
    for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
    return arr;
  });
  const [flipped, setFlipped] = useState([]);
  const [confirmed, setConfirmed] = useState(false);
  const count = Math.min(room.settings.jokerRandomCount || 2, deck.length);
  const picked = flipped.map((i) => deck[i].id);

  function flip(i) { if (flipped.includes(i) || flipped.length >= count) return; setFlipped((f) => [...f, i]); }
  async function confirm() { await sSet(`qz:${code}:playerjokers:${pid}`, picked); setConfirmed(true); }

  if (confirmed) {
    return (
      <Stage>
        <div className="text-center mb-2" style={{ fontSize: 44 }}>🎉</div>
        <h2 className="text-center mb-4" style={{ fontFamily: F.display, fontSize: 24, color: C.gold }}>Tes jokers pour la partie</h2>
        <div className="flex flex-col gap-3 mb-6">
          {picked.map((id) => { const j = JOKERS.find((x) => x.id === id); return (
            <div key={id} className="rounded-2xl p-3 flex items-center gap-3" style={{ background: "rgba(255,255,255,0.06)", border: "2px solid rgba(255,255,255,0.12)" }}>
              <div className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: 46, height: 46, background: "rgba(255,255,255,0.1)", fontSize: 22 }}>{j.emoji}</div>
              <div><p style={{ fontFamily: F.display, fontSize: 17, color: C.gold }}>{j.label}</p><p className="text-xs opacity-80">{j.desc}</p></div>
            </div>
          ); })}
        </div>
        <BigButton onClick={() => onDone(picked)} color={C.gold}>Rejoindre la salle</BigButton>
      </Stage>
    );
  }

  return (
    <Stage>
      <ScreenHeader title="Tire tes jokers 🎴" color={C.gold} />
      <p className="text-sm opacity-70 mb-4 text-center">Choisis {count} carte{count > 1 ? "s" : ""} parmi {deck.length}. Le mélange est propre à toi seul, personne ne peut tricher.</p>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {deck.map((j, i) => {
          const isFlipped = flipped.includes(i);
          const Icon = j.icon;
          return (
            <button key={i} onClick={() => flip(i)} disabled={isFlipped || flipped.length >= count} className="rounded-2xl aspect-square flex flex-col items-center justify-center gap-1 transition-transform active:scale-95" style={isFlipped ? { background: C.gold, border: `2px solid ${C.gold}`, boxShadow: `0 4px 0 rgba(0,0,0,0.25)` } : { background: `linear-gradient(135deg, ${j.backColor}, ${j.backColor}99)`, border: "2px solid rgba(255,255,255,0.25)", boxShadow: `0 4px 0 rgba(0,0,0,0.2)` }}>
              {isFlipped ? (<><Icon size={28} color="#1B1030" /><span style={{ fontFamily: F.display, fontSize: 13, color: "#1B1030", textAlign: "center", lineHeight: 1.15, padding: "0 2px" }}>{j.label}</span></>) : (<span style={{ fontSize: 28 }}>🃏</span>)}
            </button>
          );
        })}
      </div>
      {picked.length > 0 && (
        <div className="mb-4">
          <p className="text-xs opacity-70 mb-2 text-center">Déjà révélé{picked.length > 1 ? "s" : ""} :</p>
          <div className="flex gap-2 justify-center flex-wrap">
            {picked.map((id) => { const j = JOKERS.find((x) => x.id === id); return <span key={id} className="text-xs rounded-full px-3 py-1 flex items-center gap-1" style={{ background: C.gold, color: "#1B1030", fontWeight: 700 }}>{j.emoji} {j.label}</span>; })}
          </div>
        </div>
      )}
      <BigButton onClick={confirm} color={C.gold} disabled={flipped.length < count}>Valider mes jokers</BigButton>
    </Stage>
  );
}

/* ---------------------------------------------------------
   LOBBIES
--------------------------------------------------------- */
function AdminLobby({ code, room, onStart, buildExtraOnStart, onBack }) {
  const [players, setPlayers] = useState([]);
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const refresh = useCallback(async () => {
    const keys = await sList(`qz:${code}:player:`);
    const list = (await Promise.all(keys.map((k) => sGet(k)))).filter(Boolean);
    if (room.settings.jokerRandom) {
      const withJokers = await Promise.all(list.map(async (p) => ({ ...p, drawnJokers: await sGet(`qz:${code}:playerjokers:${p.id}`) })));
      setPlayers(withJokers);
    } else {
      setPlayers(list);
    }
  }, [code, room.settings.jokerRandom]);
  useEffect(() => { refresh(); const t = setInterval(refresh, 1500); return () => clearInterval(t); }, [refresh]);

  async function setTeam(pid, currentTeam) {
    const n = room.settings.teamsMode;
    const nextTeam = (currentTeam % n) + 1;
    const p = players.find((x) => x.id === pid);
    if (!p) return;
    const updated = { ...p, team: nextTeam };
    await sSet(playerKey(code, pid), updated);
    setPlayers((ps) => ps.map((x) => (x.id === pid ? updated : x)));
  }
  async function start() {
    const extra = buildExtraOnStart ? buildExtraOnStart(players) : {};
    const next = { ...room, phase: "question", currentIndex: 0, questionStartedAt: Date.now(), ...extra };
    await sSet(roomKey(code), next);
    onStart(next);
  }

  const teamColors = [C.pink, C.teal, C.gold, C.violet];
  return (
    <Stage wide>
      {onBack && <div className="mb-3"><GhostButton onClick={onBack} small>← Retour</GhostButton></div>}
      <Logo />
      <div className="text-center mb-6">
        <p className="text-sm opacity-70 mb-1">Rejoignez avec le code</p>
        <div className="flex items-center justify-center gap-3">
          <span style={{ fontFamily: F.mono, fontSize: 48, letterSpacing: 10, color: C.gold }}>{code}</span>
          <button onClick={() => { navigator.clipboard?.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); }} className="rounded-lg p-2" style={{ background: "rgba(255,255,255,0.1)" }}>{copied ? <Check size={18} /> : <Copy size={18} />}</button>
        </div>
        <p className="text-xs opacity-50 mt-2 flex items-center justify-center gap-1"><Cast size={12} /> Sur téléphone : caste cet écran via AirPlay / Chromecast pour l'afficher sur la TV</p>
        <div className="flex flex-col items-center mt-4">
          <GhostButton onClick={() => { navigator.clipboard?.writeText(buildJoinUrl(code)); setLinkCopied(true); setTimeout(() => setLinkCopied(false), 1500); }}>
            {linkCopied ? "Lien copié ✓" : "📋 Copier le lien de la partie"}
          </GhostButton>
          <p className="text-[11px] opacity-50 mt-2 max-w-xs text-center">À coller dans un SMS/WhatsApp — ouvre l'appli avec le code déjà rempli (fonctionne si cette appli est ouverte via un lien partagé, sinon donne le code à la main)</p>
        </div>
      </div>
      <div className="rounded-2xl p-4 mb-6" style={{ background: "rgba(255,255,255,0.05)", minHeight: 140 }}>
        <p className="text-sm font-bold mb-3 opacity-70 flex items-center gap-2"><Users size={16} /> Joueurs ({players.length}){room.settings.teamsMode > 1 && " — clique un joueur pour changer son équipe"}</p>
        <div className="flex flex-wrap gap-3">
          {players.length === 0 && <p className="text-sm opacity-50">En attente de joueurs...</p>}
          {players.map((p) => (
            <button key={p.id} onClick={() => room.settings.teamsMode > 1 && setTeam(p.id, p.team)} className="flex flex-col items-center gap-1" style={{ width: 84 }}>
              <div className="flex items-center justify-center rounded-full" style={{ width: 52, height: 52, background: "rgba(255,255,255,0.08)", fontSize: 26, border: room.settings.teamsMode > 1 ? `3px solid ${teamColors[(p.team - 1) % 4]}` : "none" }}>{p.animal}</div>
              <span className="text-xs text-center truncate w-full">{p.pseudo}</span>
              {room.settings.teamsMode > 1 && <span className="text-[10px] opacity-70">Équipe {p.team}</span>}
              {room.settings.jokerRandom && (
                <div className="flex gap-0.5 flex-wrap justify-center">
                  {p.drawnJokers === undefined ? null : p.drawnJokers === null ? (
                    <span className="text-[9px] opacity-50">tirage...</span>
                  ) : (
                    p.drawnJokers.map((jid) => { const j = JOKERS.find((x) => x.id === jid); return <span key={jid} title={j?.label} style={{ fontSize: 13 }}>{j?.emoji}</span>; })
                  )}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
      <BigButton onClick={start} color={C.pink} disabled={players.length === 0} icon={Play}>Lancer la partie ({room.questions.length} questions)</BigButton>
    </Stage>
  );
}

function PlayerLobby({ profile, code }) {
  return (
    <Stage>
      <Logo />
      <div className="flex flex-col items-center gap-3 mt-6">
        <div className="flex items-center justify-center rounded-full" style={{ width: 88, height: 88, background: "rgba(255,255,255,0.08)", border: `3px solid ${C.teal}`, fontSize: 42 }}>{profile.animal}</div>
        <p style={{ fontFamily: F.display, fontSize: 22 }}>{profile.pseudo}</p>
        <p className="text-sm opacity-60">Salle {code}</p>
        <p className="mt-6 text-center opacity-70">En attente que l'hôte lance la partie... 🎬</p>
      </div>
    </Stage>
  );
}

/* ---------------------------------------------------------
   TIMER HOOK
--------------------------------------------------------- */
function useCountdown(startedAt, seconds) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    if (!startedAt) return;
    const tick = () => { const elapsed = (Date.now() - startedAt) / 1000; setLeft(Math.max(0, Math.ceil(seconds - elapsed))); };
    tick();
    const t = setInterval(tick, 250);
    return () => clearInterval(t);
  }, [startedAt, seconds]);
  return left;
}

/* ---------------------------------------------------------
   ADMIN GAME
--------------------------------------------------------- */
function AdminGame({ code, room, onRoomChange, onFinished }) {
  const q = room.questions[room.currentIndex];
  const left = useCountdown(room.questionStartedAt, room.settings.seconds);
  const [answersCount, setAnswersCount] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const advancingRef = useRef(false);

  const collectAndScore = useCallback(async () => {
    if (advancingRef.current) return;
    advancingRef.current = true;
    const answerKeys = await sList(`qz:${code}:answer:${room.currentIndex}:`);
    const answers = (await Promise.all(answerKeys.map((k) => sGet(k)))).filter(Boolean);
    const playerKeys = await sList(`qz:${code}:player:`);
    const players = (await Promise.all(playerKeys.map((k) => sGet(k)))).filter(Boolean);

    let minDiff = null;
    if (q.type === "echelle") answers.forEach((a) => { const d = Math.abs(Number(a.value) - Number(q.answer)); if (minDiff === null || d < minDiff) minDiff = d; });

    const gained = {}; const correctness = {};
    players.forEach((p) => (gained[p.id] = 0));

    answers.forEach((a) => {
      let correct = false;
      if (q.type === "qcm") correct = a.value === q.answer;
      else if (q.type === "vf") correct = a.value === q.answer;
      else if (q.type === "carte") correct = a.value === q.answer;
      else if (q.type === "echelle") correct = Math.abs(Number(a.value) - Number(q.answer)) === minDiff;
      correctness[a.pid] = correct;
      if (correct) {
        const elapsed = (a.submittedAt - room.questionStartedAt) / 1000;
        const remaining = Math.max(0, room.settings.seconds - elapsed);
        const speedFactor = room.settings.seconds > 0 ? remaining / room.settings.seconds : 0;
        let pts = Math.round(50 + 50 * speedFactor);
        if (a.jokerUsed?.id === "x2") pts *= 2;
        gained[a.pid] = pts;
      } else {
        gained[a.pid] = room.settings.malus || 0;
      }
    });

    answers.forEach((a) => { if (a.jokerUsed?.id === "block" && correctness[a.pid] && a.jokerUsed.targetId) gained[a.jokerUsed.targetId] = 0; });

    for (const p of players) { const prev = (await sGet(scoreKey(code, p.id))) || 0; await sSet(scoreKey(code, p.id), prev + (gained[p.id] || 0)); }

    for (const a of answers) {
      const elapsed = Math.max(0, a.submittedAt - room.questionStartedAt);
      const prevTime = (await sGet(timeKey(code, a.pid))) || 0;
      await sSet(timeKey(code, a.pid), prevTime + elapsed);
    }

    const stealOps = answers.filter((a) => a.jokerUsed?.id === "steal" && correctness[a.pid] && a.jokerUsed.targetId);
    for (const op of stealOps) {
      const targetScore = (await sGet(scoreKey(code, op.jokerUsed.targetId))) || 0;
      const steal = Math.min(30, targetScore);
      await sSet(scoreKey(code, op.jokerUsed.targetId), targetScore - steal);
      const attackerScore = (await sGet(scoreKey(code, op.pid))) || 0;
      await sSet(scoreKey(code, op.pid), attackerScore + steal);
    }
    setRevealed(true);
  }, [code, q, room]);

  useEffect(() => {
    setRevealed(false); advancingRef.current = false;
    const t = setInterval(async () => { const keys = await sList(`qz:${code}:answer:${room.currentIndex}:`); setAnswersCount(keys.length); }, 1000);
    return () => clearInterval(t);
  }, [room.currentIndex, code]);
  useEffect(() => { if (left === 0 && !revealed) collectAndScore(); }, [left, revealed, collectAndScore]);

  async function next() {
    const isLast = room.currentIndex >= room.questions.length - 1;
    if (isLast) { const next = { ...room, phase: "results" }; await sSet(roomKey(code), next); onFinished(next); }
    else { const next = { ...room, currentIndex: room.currentIndex + 1, questionStartedAt: Date.now() }; await sSet(roomKey(code), next); onRoomChange(next); }
  }

  const cat = findCategory(q.category);
  return (
    <Stage wide>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm opacity-60">Question {room.currentIndex + 1} / {room.questions.length}</span>
        <span className="flex items-center gap-1 text-sm opacity-60"><Users size={14} /> {answersCount} réponses</span>
        <span className="flex items-center gap-1" style={{ fontFamily: F.mono, fontSize: 20, color: left <= 5 ? C.pink : C.gold }}><Clock size={18} /> {left}s</span>
      </div>
      <div className="rounded-3xl p-8 mb-6 text-center" style={{ background: "rgba(255,255,255,0.06)" }}>
        <p className="text-xs uppercase tracking-widest opacity-50 mb-2">{cat?.emoji} {cat?.label}</p>
        <p style={{ fontFamily: F.display, fontSize: 28 }}>{q.text}</p>
        {q.type === "qcm" && (<div className="grid grid-cols-2 gap-3 mt-6">{q.options.map((o, i) => (<div key={i} className="rounded-xl p-3" style={{ background: revealed && i === q.answer ? C.teal : "rgba(255,255,255,0.08)", color: revealed && i === q.answer ? "#1B1030" : C.cream, fontFamily: F.body, fontWeight: 700 }}>{o}</div>))}</div>)}
        {q.type === "vf" && (<div className="flex gap-4 justify-center mt-6"><div className="rounded-xl px-6 py-3" style={{ background: revealed && q.answer === true ? C.teal : "rgba(255,255,255,0.08)" }}>Vrai</div><div className="rounded-xl px-6 py-3" style={{ background: revealed && q.answer === false ? C.teal : "rgba(255,255,255,0.08)" }}>Faux</div></div>)}
        {q.type === "carte" && (<div className="relative rounded-xl mt-6 mx-auto" style={{ width: "100%", maxWidth: 420, height: 220, background: "rgba(255,255,255,0.06)" }}>{MAP_ZONES.map((z) => (<div key={z.id} className="absolute rounded-full px-2 py-1 text-xs" style={{ left: `${z.x}%`, top: `${z.y}%`, transform: "translate(-50%,-50%)", background: revealed && z.id === q.answer ? C.teal : "rgba(255,255,255,0.12)", color: revealed && z.id === q.answer ? "#1B1030" : C.cream }}>{z.label}</div>))}</div>)}
        {q.type === "echelle" && revealed && <p className="mt-6" style={{ fontFamily: F.mono, fontSize: 26, color: C.teal }}>Réponse : {q.answer} {q.unit || ""} — le(s) plus proche(s) marquent les points</p>}
      </div>
      {revealed ? (<BigButton onClick={next} color={C.pink} icon={ArrowRight}>{room.currentIndex >= room.questions.length - 1 ? "Voir le classement final" : "Question suivante"}</BigButton>) : (<BigButton onClick={collectAndScore} color={C.violet}>Révéler maintenant</BigButton>)}
    </Stage>
  );
}

/* ---------------------------------------------------------
   PLAYER GAME
--------------------------------------------------------- */
function PlayerGame({ code, pid, room, assignedJokers, usedJokersEver, setUsedJokersEver }) {
  const q = room.questions[room.currentIndex];
  const left = useCountdown(room.questionStartedAt, room.settings.seconds);
  const [submitted, setSubmitted] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState([]);
  const [jokerUsed, setJokerUsed] = useState(null);
  const [scaleVal, setScaleVal] = useState(0);
  const [pickingTargetFor, setPickingTargetFor] = useState(null);
  const [otherPlayers, setOtherPlayers] = useState([]);
  const [blurred, setBlurred] = useState(false);

  useEffect(() => { setSubmitted(false); setHiddenOptions([]); setJokerUsed(null); setScaleVal(0); setPickingTargetFor(null); setBlurred(false); }, [room.currentIndex]);

  useEffect(() => {
    let stop = false;
    const t = setInterval(async () => {
      const keys = await sList(debuffKeyPrefix(code, room.currentIndex, pid));
      if (stop) return;
      if (keys.length === 0) { setBlurred(false); return; }
      const debuffs = (await Promise.all(keys.map((k) => sGet(k)))).filter(Boolean);
      setBlurred(debuffs.some((d) => Date.now() - d.appliedAt < d.duration));
    }, 600);
    return () => { stop = true; clearInterval(t); };
  }, [code, room.currentIndex, pid]);

  async function submit(value) { if (submitted || left === 0) return; setSubmitted(true); await sSet(answerKey(code, room.currentIndex, pid), { pid, value, jokerUsed, submittedAt: Date.now() }); }

  async function pickTarget(jokerId) {
    const keys = await sList(`qz:${code}:player:`);
    setOtherPlayers((await Promise.all(keys.map((k) => sGet(k)))).filter((p) => p && p.id !== pid));
    setPickingTargetFor(jokerId);
  }
  async function confirmTarget(targetId) {
    const jokerId = pickingTargetFor;
    setJokerUsed({ id: jokerId, targetId });
    const nextUsed = [...usedJokersEver, jokerId];
    setUsedJokersEver(nextUsed);
    sSet(`qz:${code}:jokerused:${pid}`, nextUsed);
    setPickingTargetFor(null);
    if (jokerId === "flou") await sSet(`${debuffKeyPrefix(code, room.currentIndex, targetId)}${pid}`, { appliedAt: Date.now(), duration: (room.settings.seconds * 1000) / 2 });
  }
  function useJoker(id) {
    if (jokerUsed || submitted) return;
    const jokerDef = JOKERS.find((j) => j.id === id);
    if (jokerDef.targeted) { pickTarget(id); return; }
    setJokerUsed({ id });
    const nextUsed = [...usedJokersEver, id];
    setUsedJokersEver(nextUsed);
    sSet(`qz:${code}:jokerused:${pid}`, nextUsed);
    if (id === "5050" && q.type === "qcm") { const wrongIdx = q.options.map((_, i) => i).filter((i) => i !== q.answer); setHiddenOptions(wrongIdx.sort(() => Math.random() - 0.5).slice(0, 2)); }
  }

  const enabledJokers = JOKERS.filter((j) => assignedJokers.includes(j.id) && !usedJokersEver.includes(j.id));

  return (
    <Stage>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs opacity-60">Q{room.currentIndex + 1}/{room.questions.length}</span>
        <span style={{ fontFamily: F.mono, fontSize: 20, color: left <= 5 ? C.pink : C.gold }}>{left}s</span>
      </div>
      <div style={{ filter: blurred ? "blur(8px)" : "none", transition: "filter 0.3s" }}>
        <div className="rounded-2xl p-5 mb-5" style={{ background: "rgba(255,255,255,0.06)" }}><p className="text-xs uppercase tracking-widest opacity-50 mb-1">{findCategory(q.category)?.emoji} {findCategory(q.category)?.label}</p><p style={{ fontFamily: F.display, fontSize: 20 }}>{q.text}</p></div>
        {!submitted && left > 0 && !pickingTargetFor && (
          <>
            {q.type === "qcm" && (<div className="grid grid-cols-1 gap-3 mb-5">{q.options.map((o, i) => hiddenOptions.includes(i) ? null : (<button key={i} onClick={() => submit(i)} className="rounded-xl py-3 px-4 text-left" style={{ background: "rgba(255,255,255,0.08)", fontFamily: F.body, fontWeight: 700 }}>{o}</button>))}</div>)}
            {q.type === "vf" && (<div className="flex gap-3 mb-5"><button onClick={() => submit(true)} className="flex-1 rounded-xl py-4" style={{ background: C.teal, color: "#1B1030", fontFamily: F.display, fontSize: 18 }}>Vrai</button><button onClick={() => submit(false)} className="flex-1 rounded-xl py-4" style={{ background: C.pink, color: "#1B1030", fontFamily: F.display, fontSize: 18 }}>Faux</button></div>)}
            {q.type === "carte" && (<div className="relative rounded-xl mb-5" style={{ width: "100%", height: 200, background: "rgba(255,255,255,0.06)" }}>{MAP_ZONES.map((z) => (<button key={z.id} onClick={() => submit(z.id)} className="absolute rounded-full px-2 py-1 text-xs" style={{ left: `${z.x}%`, top: `${z.y}%`, transform: "translate(-50%,-50%)", background: "rgba(255,255,255,0.15)" }}><MapPin size={12} className="inline mr-1" />{z.label}</button>))}</div>)}
            {q.type === "echelle" && (<div className="mb-5"><div className="flex items-center justify-center gap-3 mb-4"><button onClick={() => setScaleVal((v) => Number(v) - 1)} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Minus size={16} /></button><input type="number" inputMode="decimal" value={scaleVal} onChange={(e) => setScaleVal(e.target.value === "" ? "" : Number(e.target.value))} className="text-center rounded-xl px-4 py-2" style={{ fontFamily: F.mono, fontSize: 28, color: C.cream, background: "rgba(255,255,255,0.08)", border: "2px solid rgba(255,255,255,0.2)", width: 140 }} /><button onClick={() => setScaleVal((v) => Number(v) + 1)} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Plus size={16} /></button></div><BigButton onClick={() => submit(scaleVal === "" ? 0 : scaleVal)} color={C.gold}>Valider</BigButton></div>)}
            {enabledJokers.length > 0 && (<div className="flex flex-wrap gap-2 mt-2">{enabledJokers.map((j) => (<button key={j.id} disabled={!!jokerUsed} onClick={() => useJoker(j.id)} className="rounded-lg px-3 py-2 text-xs flex items-center gap-1 disabled:opacity-30" style={{ background: jokerUsed?.id === j.id ? C.violet : "rgba(255,255,255,0.08)" }}><j.icon size={14} /> {j.label}</button>))}</div>)}
          </>
        )}
      </div>
      {pickingTargetFor && (
        <div className="mt-2">
          <p className="text-sm opacity-70 mb-2 text-center">Choisis ta cible</p>
          <div className="flex flex-wrap gap-3 justify-center">{otherPlayers.map((p) => (<button key={p.id} onClick={() => confirmTarget(p.id)} className="flex flex-col items-center gap-1"><div className="rounded-full flex items-center justify-center" style={{ width: 52, height: 52, background: "rgba(255,255,255,0.08)", fontSize: 26 }}>{p.animal}</div><span className="text-xs">{p.pseudo}</span></button>))}</div>
          <div className="mt-3"><GhostButton onClick={() => setPickingTargetFor(null)} small>Annuler</GhostButton></div>
        </div>
      )}
      {(submitted || left === 0) && !pickingTargetFor && (<div className="text-center mt-6 opacity-70"><p style={{ fontFamily: F.display, fontSize: 20 }}>{submitted ? "Réponse envoyée ✅" : "Temps écoulé ⏱️"}</p><p className="text-sm mt-1">En attente des autres joueurs...</p></div>)}
    </Stage>
  );
}

/* ---------------------------------------------------------
   RESULTS
--------------------------------------------------------- */
function Results({ code, room, isAdmin, onRestart }) {
  const [ranking, setRanking] = useState([]);
  const teamsMode = room?.settings?.teamsMode || 1;
  useEffect(() => { (async () => { const pKeys = await sList(`qz:${code}:player:`); const players = (await Promise.all(pKeys.map((k) => sGet(k)))).filter(Boolean); const withScores = await Promise.all(players.map(async (p) => ({ ...p, score: (await sGet(scoreKey(code, p.id))) || 0, time: (await sGet(timeKey(code, p.id))) || 0 }))); withScores.sort((a, b) => b.score - a.score || a.time - b.time); setRanking(withScores); })(); }, [code]);
  const medals = ["🥇", "🥈", "🥉"];

  if (teamsMode > 1) {
    const teams = {};
    ranking.forEach((p) => { teams[p.team] = teams[p.team] || { team: p.team, score: 0, members: [] }; teams[p.team].score += p.score; teams[p.team].members.push(p); });
    const teamList = Object.values(teams).sort((a, b) => b.score - a.score);
    return (
      <Stage>
        <Logo />
        <h2 className="text-center mb-6" style={{ fontFamily: F.display, fontSize: 26, color: C.gold }}><Trophy className="inline mb-1 mr-2" /> Classement par équipe</h2>
        <div className="flex flex-col gap-3">
          {teamList.map((t, i) => (
            <div key={t.team} className="rounded-xl p-3" style={{ background: i === 0 ? "rgba(255,201,60,0.15)" : "rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-3 mb-2"><span style={{ fontSize: 22 }}>{medals[i] || `${i + 1}.`}</span><span className="flex-1" style={{ fontFamily: F.display, fontSize: 18 }}>Équipe {t.team}</span><span style={{ fontFamily: F.mono, fontSize: 18, color: C.teal }}>{t.score}</span></div>
              <div className="flex gap-2 flex-wrap pl-2">{t.members.map((m) => (<span key={m.id} className="text-lg" title={m.pseudo}>{m.animal}</span>))}</div>
            </div>
          ))}
        </div>
        {isAdmin && <div className="mt-8"><BigButton onClick={onRestart} color={C.violet} icon={RefreshCw}>Nouvelle partie</BigButton></div>}
      </Stage>
    );
  }

  return (
    <Stage>
      <Logo />
      <h2 className="text-center mb-6" style={{ fontFamily: F.display, fontSize: 26, color: C.gold }}><Trophy className="inline mb-1 mr-2" /> Classement final</h2>
      <div className="flex flex-col gap-3">
        {ranking.map((p, i) => (<div key={p.id} className="flex items-center gap-3 rounded-xl p-3" style={{ background: i === 0 ? "rgba(255,201,60,0.15)" : "rgba(255,255,255,0.06)" }}><span style={{ fontSize: 22, width: 32 }}>{medals[i] || `${i + 1}.`}</span><span style={{ fontSize: 28 }}>{p.animal}</span><span className="flex-1" style={{ fontFamily: F.body, fontWeight: 700 }}>{p.pseudo}</span><span style={{ fontFamily: F.mono, fontSize: 18, color: C.teal }}>{p.score}</span></div>))}
        {ranking.length === 0 && <p className="text-center opacity-60">Calcul en cours...</p>}
      </div>
      {isAdmin && <div className="mt-8"><BigButton onClick={onRestart} color={C.violet} icon={RefreshCw}>Nouvelle partie</BigButton></div>}
    </Stage>
  );
}

/* ---------------------------------------------------------
   MATCH AMOR — élimination progressive
--------------------------------------------------------- */
function CreateMatchAmor({ onCreated, onBack }) {
  const [cats, setCats] = useState(["animaux", "geo", "films"]);
  const [seconds, setSeconds] = useState(15);
  const [kidsMode, setKidsMode] = useState(false);

  async function create() {
    const catOptions = kidsMode ? KIDS_CATEGORIES : CATEGORIES;
    const catIds = cats.length ? cats : catOptions.map((c) => c.id);
    const pool = pickQuestions(catIds, 300, kidsMode ? KIDS_QB : QB);
    const code = genCode();
    const state = { mode: "matchamor", phase: "lobby", code, settings: { seconds, teamsMode: 1, kidsMode }, pool, currentIndex: 0, questionStartedAt: null, alive: [], createdAt: Date.now() };
    await sSet(roomKey(code), state);
    onCreated(code, state);
  }

  return (
    <Stage wide>
      <ScreenHeader title="Match Amor — réglages" onBack={onBack} color={C.pink} />
      <p className="text-sm opacity-70 mb-4 text-center">Question après question, les mauvaises réponses éliminent. Le dernier debout gagne. 💔</p>
      <CategoryPicker cats={cats} setCats={setCats} kidsMode={kidsMode} setKidsMode={setKidsMode} />
      <p className="text-sm opacity-70 mb-2 font-bold">Secondes par question</p>
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => setSeconds((n) => Math.max(5, n - 5))} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Minus size={16} /></button>
        <span style={{ fontFamily: F.mono, fontSize: 22 }}>{seconds}s</span>
        <button onClick={() => setSeconds((n) => Math.min(60, n + 5))} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Plus size={16} /></button>
      </div>
      <BigButton onClick={create} color={C.pink} icon={Skull}>Créer la salle Match Amor</BigButton>
    </Stage>
  );
}

function MatchAmorAdminGame({ code, room, onRoomChange, onFinished }) {
  const q = room.pool[room.currentIndex % room.pool.length];
  const left = useCountdown(room.questionStartedAt, room.settings.seconds);
  const [revealed, setRevealed] = useState(false);
  const [eliminatedThisRound, setEliminatedThisRound] = useState([]);
  const [pendingAlive, setPendingAlive] = useState(null);
  const [allPlayers, setAllPlayers] = useState([]);
  const advancingRef = useRef(false);

  useEffect(() => { (async () => { const keys = await sList(`qz:${code}:player:`); setAllPlayers((await Promise.all(keys.map((k) => sGet(k)))).filter(Boolean)); })(); }, [code]);

  const collect = useCallback(async () => {
    if (advancingRef.current) return;
    advancingRef.current = true;
    const answerKeys = await sList(`qz:${code}:answer:${room.currentIndex}:`);
    const answers = (await Promise.all(answerKeys.map((k) => sGet(k)))).filter(Boolean);
    let minDiff = null;
    if (q.type === "echelle") answers.forEach((a) => { const d = Math.abs(Number(a.value) - Number(q.answer)); if (minDiff === null || d < minDiff) minDiff = d; });
    const correctPids = new Set();
    answers.forEach((a) => {
      if (!room.alive.includes(a.pid)) return;
      let correct = false;
      if (q.type === "qcm") correct = a.value === q.answer;
      else if (q.type === "vf") correct = a.value === q.answer;
      else if (q.type === "carte") correct = a.value === q.answer;
      else if (q.type === "echelle") correct = Math.abs(Number(a.value) - Number(q.answer)) === minDiff;
      if (correct) correctPids.add(a.pid);
    });
    const eliminated = room.alive.filter((pid) => !correctPids.has(pid));
    const newAlive = eliminated.length === room.alive.length ? room.alive : room.alive.filter((pid) => correctPids.has(pid));
    setPendingAlive(newAlive);
    setEliminatedThisRound(eliminated.length === room.alive.length ? [] : eliminated);
    setRevealed(true);
  }, [code, q, room]);

  useEffect(() => { setRevealed(false); setPendingAlive(null); setEliminatedThisRound([]); advancingRef.current = false; }, [room.currentIndex]);
  useEffect(() => { if (left === 0 && !revealed) collect(); }, [left, revealed, collect]);

  async function next() {
    const newAlive = pendingAlive || room.alive;
    if (newAlive.length <= 1) {
      const finished = { ...room, phase: "results", alive: newAlive, winnerId: newAlive[0] };
      await sSet(roomKey(code), finished);
      onFinished(finished);
    } else {
      const nextRoom = { ...room, alive: newAlive, currentIndex: room.currentIndex + 1, questionStartedAt: Date.now() };
      await sSet(roomKey(code), nextRoom);
      onRoomChange(nextRoom);
    }
  }

  const cat = findCategory(q.category);
  const eliminatedPlayers = allPlayers.filter((p) => eliminatedThisRound.includes(p.id));

  return (
    <Stage wide>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm opacity-60"><Skull size={14} className="inline mr-1" /> {room.alive.length} en course</span>
        <span className="flex items-center gap-1" style={{ fontFamily: F.mono, fontSize: 20, color: left <= 5 ? C.pink : C.gold }}><Clock size={18} /> {left}s</span>
      </div>
      <div className="rounded-3xl p-8 mb-6 text-center" style={{ background: "rgba(255,255,255,0.06)" }}>
        <p className="text-xs uppercase tracking-widest opacity-50 mb-2">{cat?.emoji} {cat?.label}</p>
        <p style={{ fontFamily: F.display, fontSize: 28 }}>{q.text}</p>
        {revealed && (
          <div className="mt-6">
            {q.type === "echelle" ? (
              <p style={{ fontFamily: F.mono, fontSize: 24, color: C.teal }}>Réponse : {q.answer} {q.unit || ""}</p>
            ) : (
              <p style={{ fontFamily: F.mono, fontSize: 22, color: C.teal }}>
                Bonne réponse : {q.type === "qcm" ? q.options[q.answer] : q.type === "vf" ? (q.answer ? "Vrai" : "Faux") : MAP_ZONES.find((z) => z.id === q.answer)?.label}
              </p>
            )}
            {eliminatedPlayers.length > 0 ? (
              <div className="mt-4">
                <p className="text-sm opacity-70 mb-2">💔 Éliminé(s) :</p>
                <div className="flex gap-2 justify-center flex-wrap">{eliminatedPlayers.map((p) => (<span key={p.id} className="text-sm rounded-full px-3 py-1" style={{ background: "rgba(255,61,127,0.2)" }}>{p.animal} {p.pseudo}</span>))}</div>
              </div>
            ) : (
              <p className="text-sm opacity-70 mt-4">Personne d'éliminé ce round, tout le monde continue !</p>
            )}
          </div>
        )}
      </div>
      {revealed ? (<BigButton onClick={next} color={C.pink} icon={ArrowRight}>{(pendingAlive || room.alive).length <= 1 ? "Voir le vainqueur" : "Question suivante"}</BigButton>) : (<BigButton onClick={collect} color={C.violet}>Révéler maintenant</BigButton>)}
    </Stage>
  );
}

function PlayerMatchAmor({ code, pid, room }) {
  const q = room.pool[room.currentIndex % room.pool.length];
  const alive = room.alive.includes(pid);
  const left = useCountdown(room.questionStartedAt, room.settings.seconds);
  const [submitted, setSubmitted] = useState(false);
  const [scaleVal, setScaleVal] = useState(0);
  useEffect(() => { setSubmitted(false); setScaleVal(0); }, [room.currentIndex]);
  async function submit(value) { if (submitted || left === 0) return; setSubmitted(true); await sSet(answerKey(code, room.currentIndex, pid), { pid, value, submittedAt: Date.now() }); }

  if (!alive) return (
    <Stage>
      <div className="text-center mt-10">
        <Skull size={40} className="mx-auto mb-3" color={C.pink} />
        <p style={{ fontFamily: F.display, fontSize: 22 }}>Tu es éliminé 💀</p>
        <p className="text-sm opacity-70 mt-2">Il reste {room.alive.length} joueur{room.alive.length > 1 ? "s" : ""} en course. Regarde la suite sur l'écran !</p>
      </div>
    </Stage>
  );

  return (
    <Stage>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs opacity-60">{room.alive.length} en course</span>
        <span style={{ fontFamily: F.mono, fontSize: 20, color: left <= 5 ? C.pink : C.gold }}>{left}s</span>
      </div>
      <div className="rounded-2xl p-5 mb-5" style={{ background: "rgba(255,255,255,0.06)" }}><p className="text-xs uppercase tracking-widest opacity-50 mb-1">{findCategory(q.category)?.emoji} {findCategory(q.category)?.label}</p><p style={{ fontFamily: F.display, fontSize: 20 }}>{q.text}</p></div>
      {!submitted && left > 0 ? (
        <QuestionInput q={q} onSubmit={submit} scaleVal={scaleVal} setScaleVal={setScaleVal} />
      ) : (
        <div className="text-center mt-6 opacity-70"><p style={{ fontFamily: F.display, fontSize: 20 }}>{submitted ? "Réponse envoyée ✅" : "Temps écoulé ⏱️"}</p><p className="text-sm mt-1">Suspense...</p></div>
      )}
    </Stage>
  );
}

function MatchAmorResults({ code, room, isAdmin, onRestart }) {
  const [winner, setWinner] = useState(null);
  useEffect(() => { (async () => { if (room.winnerId) { const p = await sGet(playerKey(code, room.winnerId)); setWinner(p); } })(); }, [code, room.winnerId]);
  return (
    <Stage>
      <Logo />
      <div className="text-center mt-6">
        <Trophy size={44} className="mx-auto mb-3" color={C.gold} />
        <p style={{ fontFamily: F.display, fontSize: 26, color: C.gold }}>Vainqueur de Match Amor</p>
        {winner ? (
          <div className="flex flex-col items-center gap-2 mt-4">
            <span style={{ fontSize: 56 }}>{winner.animal}</span>
            <span style={{ fontFamily: F.display, fontSize: 22 }}>{winner.pseudo}</span>
          </div>
        ) : <p className="opacity-60 mt-4">Calcul...</p>}
      </div>
      {isAdmin && <div className="mt-8"><BigButton onClick={onRestart} color={C.violet} icon={RefreshCw}>Nouvelle partie</BigButton></div>}
    </Stage>
  );
}

/* ---------------------------------------------------------
   ESPACE TEST — simuler 2 joueurs pour prévisualiser tuto/tirage
--------------------------------------------------------- */
function JokerTutoInline({ room, onDone }) {
  const enabled = JOKERS.filter((j) => room?.settings?.jokers?.[j.id]);
  const isRandom = room?.settings?.jokerRandom;
  return (
    <div className="p-2">
      <div className="text-center mb-1" style={{ fontSize: 26 }}>🎪</div>
      <p className="text-center mb-2" style={{ fontFamily: F.display, fontSize: 16, color: C.gold }}>La boîte à jokers</p>
      <p className="text-[11px] opacity-70 mb-3 text-center">{isRandom ? `Tirage au sort : ${room.settings.jokerRandomCount || 2} joker(s) parmi ceux-ci.` : "Chaque joker : 1 fois par partie, 1 par question."}</p>
      <div className="flex flex-col gap-2 mb-4">
        {enabled.map((j) => (
          <div key={j.id} className="rounded-xl p-2 flex items-center gap-2" style={{ background: "rgba(255,255,255,0.06)", border: "2px solid rgba(255,255,255,0.12)" }}>
            <div className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: 30, height: 30, background: "rgba(255,255,255,0.1)", fontSize: 14 }}>{j.emoji}</div>
            <div><p style={{ fontFamily: F.display, fontSize: 12, color: C.gold }}>{j.label}</p><p className="text-[10px] opacity-80">{j.desc}</p></div>
          </div>
        ))}
      </div>
      <BigButton onClick={onDone} color={C.gold}>C'est parti !</BigButton>
    </div>
  );
}

function JokerDrawInline({ room, onDone }) {
  const enabledIds = Object.entries(room.settings.jokers || {}).filter(([, v]) => v).map(([k]) => k);
  const jokerDefs = JOKERS.filter((j) => enabledIds.includes(j.id));
  const [deck] = useState(() => {
    const arr = jokerDefs.map((j, i) => ({ ...j, backColor: CARD_BACK_COLORS[i % CARD_BACK_COLORS.length] }));
    for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
    return arr;
  });
  const [flipped, setFlipped] = useState([]);
  const count = Math.min(room.settings.jokerRandomCount || 2, deck.length);
  const picked = flipped.map((i) => deck[i].id);
  function flip(i) { if (flipped.includes(i) || flipped.length >= count) return; setFlipped((f) => [...f, i]); }
  return (
    <div className="p-2">
      <p className="text-center mb-2" style={{ fontFamily: F.display, fontSize: 16, color: C.gold }}>Tire tes jokers 🎴</p>
      <p className="text-[11px] opacity-70 mb-3 text-center">Choisis {count} carte{count > 1 ? "s" : ""} parmi {deck.length}</p>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {deck.map((j, i) => {
          const isFlipped = flipped.includes(i);
          const Icon = j.icon;
          return (
            <button key={i} onClick={() => flip(i)} disabled={isFlipped || flipped.length >= count} className="rounded-lg aspect-square flex flex-col items-center justify-center gap-0.5" style={isFlipped ? { background: C.gold, border: `2px solid ${C.gold}` } : { background: `linear-gradient(135deg, ${j.backColor}, ${j.backColor}99)`, border: "2px solid rgba(255,255,255,0.25)" }}>
              {isFlipped ? (<><Icon size={20} color="#1B1030" /><span style={{ fontFamily: F.display, fontSize: 10, color: "#1B1030", textAlign: "center", lineHeight: 1.1, padding: "0 2px" }}>{j.label}</span></>) : (<span style={{ fontSize: 18 }}>🃏</span>)}
            </button>
          );
        })}
      </div>
      <BigButton onClick={() => onDone(picked)} color={C.gold} disabled={flipped.length < count}>Valider</BigButton>
    </div>
  );
}

function TestPlayerColumn({ label, room }) {
  const [step, setStep] = useState("tuto");
  const [picked, setPicked] = useState([]);
  return (
    <div className="rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.2)" }}>
      <p className="text-xs uppercase opacity-50 mb-2 text-center">{label} — écran simulé</p>
      {step === "tuto" && <JokerTutoInline room={room} onDone={() => setStep(room.settings.jokerRandom ? "draw" : "done")} />}
      {step === "draw" && <JokerDrawInline room={room} onDone={(p) => { setPicked(p); setStep("done"); }} />}
      {step === "done" && (
        <div className="text-center p-4">
          <p style={{ fontFamily: F.display, fontSize: 16, color: C.teal }}>Prêt à jouer ✅</p>
          {picked.length > 0 && (
            <div className="flex gap-2 justify-center flex-wrap mt-3">
              {picked.map((id) => { const j = JOKERS.find((x) => x.id === id); return <span key={id} className="text-xs rounded-full px-3 py-1 flex items-center gap-1" style={{ background: C.gold, color: "#1B1030", fontWeight: 700 }}>{j.emoji} {j.label}</span>; })}
            </div>
          )}
          <div className="mt-4"><GhostButton onClick={() => { setStep("tuto"); setPicked([]); }} small>Refaire le test</GhostButton></div>
        </div>
      )}
    </div>
  );
}

function TestLab({ onBack }) {
  const [jokerRandom, setJokerRandom] = useState(true);
  const testRoom = { settings: { jokers: { "5050": true, x2: true, steal: true, block: true, flou: true }, jokerRandom, jokerRandomCount: 2, seconds: 20 } };
  return (
    <Stage wide>
      <ScreenHeader title="🧪 Espace test" onBack={onBack} color={C.violet} />
      <p className="text-sm opacity-70 mb-4 text-center">Simule ce que verraient deux joueurs différents pendant le tuto et le tirage de jokers. Chaque colonne est indépendante — clique et teste librement.</p>
      <div className="flex gap-2 justify-center mb-6">
        <Chip active={jokerRandom} onClick={() => setJokerRandom(true)}>Avec tirage aléatoire</Chip>
        <Chip active={!jokerRandom} onClick={() => setJokerRandom(false)}>Sans tirage (tous les jokers)</Chip>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TestPlayerColumn key={`a-${jokerRandom}`} label="Joueur A" room={testRoom} />
        <TestPlayerColumn key={`b-${jokerRandom}`} label="Joueur B" room={testRoom} />
      </div>
    </Stage>
  );
}

/* ---------------------------------------------------------
   ROOT APP
--------------------------------------------------------- */
export default function QuizApp() {
  useGoogleFonts();
  const [view, setView] = useState("home");
  const [code, setCode] = useState(null);
  const [pid, setPid] = useState(null);
  const [profile, setProfile] = useState(null);
  const [room, setRoom] = useState(null);
  const [soloConfig, setSoloConfig] = useState(null);
  const [soloMode, setSoloMode] = useState("normal");
  const [soloProfile, setSoloProfile] = useState(null);
  const [usedJokersEver, setUsedJokersEver] = useState([]);
  const [assignedJokers, setAssignedJokers] = useState([]);
  const [urlCode, setUrlCode] = useState(null);
  const isAdmin = view.startsWith("admin");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const c = params.get("code");
    if (c && c.length === 4) { setUrlCode(c.toUpperCase()); setView("player-join"); }
  }, []);

  useEffect(() => {
    if (!code) return;
    let stop = false;
    const poll = async () => {
      const r = await sGet(roomKey(code));
      if (r && !stop) {
        setRoom(r);
        const isMatchAmor = r.mode === "matchamor";
        if (r.phase === "question") setView(isAdmin ? (isMatchAmor ? "admin-matchamor" : "admin-game") : (isMatchAmor ? "player-matchamor" : "player-game"));
        else if (r.phase === "results") setView(isMatchAmor ? "results-matchamor" : "results");
      }
    };
    poll();
    const t = setInterval(poll, 1200);
    return () => { stop = true; clearInterval(t); };
  }, [code, isAdmin]);

  function resetAll() { setCode(null); setRoom(null); setUsedJokersEver([]); setAssignedJokers([]); setView("home"); }

  if (view === "home") return <Home onCreate={() => setView("admin-create")} onJoin={() => setView("player-join")} onSolo={() => setView("solo-home")} onMatchAmor={() => setView("matchamor-create")} onTestLab={() => setView("testlab")} />;
  if (view === "testlab") return <TestLab onBack={() => setView("home")} />;
  if (view === "solo-home") return <SoloHome onBack={() => setView("home")} onNormal={() => { setSoloMode("normal"); setView("solo-profile"); }} onCrash={() => { setSoloMode("crash"); setView("solo-profile"); }} />;
  if (view === "solo-profile") return <SoloProfile onBack={() => setView("solo-home")} onNext={(p) => { setSoloProfile(p); setView(soloMode === "crash" ? "crash-setup" : "solo-setup"); }} />;
  if (view === "solo-setup") return <SoloSetup onBack={() => setView("solo-profile")} onStart={(cfg) => { setSoloConfig(cfg); setView("solo-quiz"); }} />;
  if (view === "crash-setup") return <SoloSetup crash onBack={() => setView("solo-profile")} onStart={(cfg) => { setSoloConfig(cfg); setView("crash-test"); }} />;
  if (view === "solo-quiz") return <SoloQuiz config={soloConfig} profile={soloProfile} onExit={() => setView("home")} />;
  if (view === "crash-test") return <CrashTest config={soloConfig} profile={soloProfile} onExit={() => setView("home")} />;

  if (view === "matchamor-create") return <CreateMatchAmor onBack={() => setView("home")} onCreated={(c, r) => { setCode(c); setRoom(r); setView("admin-lobby"); }} />;

  if (view === "admin-create") return <CreateRoom onBack={() => setView("home")} onCreated={(c, r) => { setCode(c); setRoom(r); setView("admin-lobby"); }} />;

  if (view === "player-join") return (
    <JoinRoom
      onBack={() => setView("home")}
      initialCode={urlCode}
      onJoined={(c, p, prof, r, reconnectInfo) => {
        setCode(c); setPid(p); setProfile(prof); setRoom(r);
        if (r.mode === "matchamor") { setView("player-lobby"); return; }
        if (reconnectInfo?.isReconnect) {
          setAssignedJokers(reconnectInfo.assignedJokers || []);
          setUsedJokersEver(reconnectInfo.usedJokersEver || []);
          setView("player-lobby");
        } else {
          setView("player-tuto");
        }
      }}
    />
  );

  if (view === "player-tuto" && room) return (
    <JokerTuto
      room={room}
      onDone={() => {
        if (room.settings.jokerRandom) { setView("player-jokerdraw"); }
        else {
          const ids = Object.entries(room.settings.jokers || {}).filter(([, v]) => v).map(([k]) => k);
          setAssignedJokers(ids);
          setView("player-lobby");
        }
      }}
    />
  );

  if (view === "player-jokerdraw" && room) return <JokerDraw room={room} code={code} pid={pid} onDone={(picked) => { setAssignedJokers(picked); setView("player-lobby"); }} />;

  if (view === "admin-lobby" && room) return (
    <AdminLobby
      code={code}
      room={room}
      onStart={(r) => { setRoom(r); setView(r.mode === "matchamor" ? "admin-matchamor" : "admin-game"); }}
      buildExtraOnStart={room.mode === "matchamor" ? (players) => ({ alive: players.map((p) => p.id) }) : undefined}
      onBack={resetAll}
    />
  );

  if (view === "player-lobby" && profile) return <PlayerLobby profile={profile} code={code} />;

  if (view === "admin-game" && room) return <AdminGame code={code} room={room} onRoomChange={(r) => setRoom(r)} onFinished={(r) => { setRoom(r); setView("results"); }} />;
  if (view === "player-game" && room) return <PlayerGame code={code} pid={pid} room={room} assignedJokers={assignedJokers} usedJokersEver={usedJokersEver} setUsedJokersEver={setUsedJokersEver} />;
  if (view === "results") return <Results code={code} room={room} isAdmin={isAdmin} onRestart={resetAll} />;

  if (view === "admin-matchamor" && room) return <MatchAmorAdminGame code={code} room={room} onRoomChange={(r) => setRoom(r)} onFinished={(r) => { setRoom(r); setView("results-matchamor"); }} />;
  if (view === "player-matchamor" && room) return <PlayerMatchAmor code={code} pid={pid} room={room} />;
  if (view === "results-matchamor") return <MatchAmorResults code={code} room={room} isAdmin={isAdmin} onRestart={resetAll} />;

  return (<Stage><p className="text-center opacity-60 mt-10">Chargement...</p></Stage>);
}
