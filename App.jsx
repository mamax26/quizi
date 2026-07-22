import React, { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext } from "react";
import { Users, Crown, Zap, Shield, Swords, Percent, EyeOff, Sparkles, Play, Copy, Check, ArrowRight, Trophy, Clock, Plus, Minus, MapPin, RefreshCw, Skull, Heart, Info, BarChart3, Hourglass, Headphones, Coins, User, Pause, QrCode, Camera, X } from "lucide-react";
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
/* ---------------------------------------------------------
   INTERNATIONALISATION (FR / EN)
--------------------------------------------------------- */
const LANG_STORAGE_KEY = "quizi_lang";
function getStoredLang() {
  try { const v = localStorage.getItem(LANG_STORAGE_KEY); return v === "en" ? "en" : "fr"; } catch { return "fr"; }
}
function storeLang(l) { try { localStorage.setItem(LANG_STORAGE_KEY, l); } catch {} }

const STRINGS = {
  fr: {
    appTagline: "Culture générale, quiz insolites, blind test, jokers vicieux... enfin un jeu qui va animer nos soirées 🎉",
    createGame: "Créer une partie (hôte)",
    joinGame: "Rejoindre une partie",
    blindTestBtn: "Blind Test musical",
    enchereBtn: "Quitte ou Double",
    matchAmorBtn: "Match Amor",
    soloBtn: "Jouer seul",
    back: "← Retour",
    continueBtn: "C'est parti !",
    yourJokersTitle: "Tes jokers pour la partie",
    joinRoomBtn: "Rejoindre la salle",
    exampleLabel: "💡 Exemple concret",
    explainClassicTitle: "Quiz Classique",
    explainClassicB1: "Réponds juste aux questions.",
    explainClassicB2: "Plus tu réponds vite, plus tu marques de points.",
    explainClassicB3: "Utilise des jokers pour saboter les autres (ou te blinder).",
    explainClassicB4: "Finis en tête et deviens la légende de la soirée. 👑",
    explainClassicExample: "Sur une question à 20 secondes : réponds juste en 2 secondes → 95 points. Réponds juste à la 19ᵉ seconde → seulement 51 points. Une mauvaise réponse ne rapporte rien (ou un malus si l'hôte l'a activé).",
    explainSoloTitle: "Jouer seul",
    explainSoloB1: "Teste-toi tranquille, à ton rythme.",
    explainSoloB2: "Mode Crash Test : 3 erreurs et t'es cramé. 💀",
    explainSoloB3: "Pas de jokers ici, juste toi contre les questions.",
    explainMatchAmorTitle: "Match Amor",
    explainMatchAmorB1: "Une mauvaise réponse et t'es éliminé direct. ☠️",
    explainMatchAmorB2: "Si tout le monde se plante (ou cartonne), personne ne saute.",
    explainMatchAmorB3: "Le dernier survivant rafle toute la mise.",
    explainBlindTestTitle: "Blind Test musical",
    explainBlindTestB1: "Le son passe sur l'écran principal, à toi de deviner. 🎧",
    explainBlindTestB2: "Titre, artiste, année, anecdote... reste concentré.",
    explainBlindTestB3: "Le plus rapide et le plus juste rafle les points.",
    explainEnchereTitle: "Quitte ou Double",
    explainEnchereB1: "Tu pars avec un gros tas de points. 💰",
    explainEnchereB2: "Avant chaque question, mise ce que tu veux.",
    explainEnchereB3: "Bonne réponse = mise doublée. Mauvaise = tout perdu.",
    explainEnchereB4: "À 0 point, t'es cramé, fini pour toi. 💀",
    explainEnchereB5: "Le plus riche à la fin remporte la partie.",
    explainEnchereExample: "Tu as 1000 points et tu mises 300 sur une question annoncée 🔴 Difficile. Bonne réponse → tu gagnes 300 pts (total 1300). Mauvaise réponse → tu perds ta mise (total 700).",
    roomSettingsTitle: "Réglages de la partie",
    categoriesLabel: "Catégories",
    sectionFormatTitle: "Format de la partie",
    checkAll: "Tout cocher",
    uncheckAll: "Tout décocher",
    kidsMode: "🎈 Mode Kids (10-14 ans)",
    questionTypesLabel: "Types de questions",
    qcmLabel: "QCM",
    vfLabel: "Vrai / Faux",
    echelleLabel: "Réponse chiffrée",
    nbQuestionsLabel: "Nombre de questions",
    secondsPerQuestionLabel: "Secondes par question",
    teamsModeLabel: "Mode équipes",
    soloForAll: "Chacun pour soi",
    teamsCount: "équipes",
    jokersEnabledLabel: "Jokers activés",
    jokerAttribLabel: "Attribution des jokers",
    jokerManual: "Les joueurs choisissent eux-mêmes",
    jokerRandomLabel: "Attribution aléatoire 🎴",
    jokerManualHint: "Chaque joueur choisit ses jokers lui-même.",
    jokerRandomHint: "L'ordinateur tire les jokers au hasard.",
    jokersPerPlayerLabel: "Jokers par joueur :",
    malusLabel: "Malus si mauvaise réponse",
    malusNone: "Aucun",
    hostPlaysLabel: "L'hôte joue aussi ?",
    hostPlaysNo: "Non, juste animateur",
    hostPlaysYes: "Oui, je participe aussi",
    hostPlaysWarning: "⚠️ Sans jokers pour toi, pour garder le jeu simple depuis l'écran d'hôte.",
    hostPseudoPlaceholder: "Ton pseudo (optionnel)",
    createRoomBtn: "Créer la salle",
    joinTitle: "Rejoindre",
    roomCodeLabel: "Code de la salle",
    roomCodePlaceholder: "EX: FUNK",
    errCodeLength: "Le code fait 4 lettres.",
    errRoomNotFound: "Salle introuvable, vérifie le code.",
    errChoosePseudo: "Choisis un pseudo.",
    errChooseAnimal: "Choisis un animal.",
    loadingDots: "...",
    continueSimple: "Continuer",
    yourPseudoTitle: "Ton pseudo",
    pseudoPlaceholder: "Écris ton pseudo...",
    pseudoHint: "✨ le bouton génère un pseudo fun si tu manques d'inspiration. Si tu retapes exactement le même pseudo qu'avant dans cette salle, tu retrouves ta place et tes points.",
    yourAvatarTitle: "Ton avatar",
    avatarHint: "Choisis ton animal (déjà pris = indisponible)",
    joinPartyBtn: "Rejoindre la partie",
    jokerBoxTitle: "Jokers activés",
    jokerTutoRandom: "Tirage au sort ce soir : tu repartiras avec {n} joker(s) parmi la liste ci-dessous. Un seul joker par question !",
    jokerTutoManual: "Sur l'écran suivant, choisis toi-même {n} joker(s) parmi la liste ci-dessous. Un seul joker par question !",
    noJokerThisGame: "Aucun joker activé pour cette partie.",
    drawJokersTitle: "Tire tes jokers 🎴",
    pickJokersTitle: "Choisis tes jokers 🎯",
    drawChooseCards: "Choisis {n} carte(s) parmi {total}. Le mélange est propre à toi seul, personne ne peut tricher.",
    pickChooseJokers: "Sélectionne {n} joker(s) parmi {total} — un seul de chaque type. Ce sera les tiens pour toute la partie.",
    alreadyRevealed: "Déjà révélé(s) :",
    selectedCount: "sélectionné(s)",
    validateMyJokers: "Valider mes jokers",
    waitingForHost: "En attente que l'hôte lance la partie... 🎬",
    playersInRoom: "Joueurs dans la salle",
    yourJokersColon: "Tes jokers pour cette partie :",
    noJokerForGame: "Aucun joker pour cette partie.",
    launchGame: "Lancer la partie",
    joinWithCode: "Rejoignez avec le code",
    linkCopiedMsg: "Lien copié ✓",
    copyLinkBtn: "📋 Copier le lien de la partie",
    scanHint: "📷 Scanner pour rejoindre la partie",
    clickToChangeTeam: " — clique un joueur pour changer son équipe",
    waitingPlayersLobby: "En attente de joueurs...",
    teamWord: "Équipe",
    roomWord: "Salle",
    loadingSimple: "Chargement...",
    scanQrBtn: "📷 Scanner un QR code",
    scanCameraHint: "Vise le QR code affiché sur l'écran de l'hôte",
    cameraError: "Impossible d'accéder à la caméra.",
    cameraErrorTitle: "Caméra indisponible",
    cameraErrorHint: "Vérifie que tu as autorisé l'accès à la caméra, ou tape le code à la main ci-dessous.",
    orDivider: "— ou —",
    questionsWord: "questions",
    tracksWord: "morceaux",
    questionWord: "Question",
    answersWord: "réponses",
    hostAnswerTitle: "🎤 Ta réponse (hôte)",
    waitingForTargetAnswer: "👀 En attente de la réponse de {name}...",
    targetAnswered: "👀 {name} a répondu : {value}",
    yourTargetFallback: "ta cible",
    yourTargetFallbackCap: "Ta cible",
    yourJokersShort: "Tes jokers",
    chooseTargetCancelHint: "Choisis ta cible (tu peux aussi répondre directement, ça annulera ce joker)",
    playerAnswersTitle: "Réponses des joueurs",
    seeWinner: "Voir le vainqueur",
    revealResultsNow: "Révéler les résultats maintenant",
    nextTrack: "Morceau suivant",
    timeReducedMsg: "⏱️ Ton temps a été réduit par un adversaire !",
    targetedByMsg: "🎯 {names} {verb} ciblé sur cette question !",
    targetedVerbPlural: "t'ont",
    targetedVerbSingular: "t'a",
    finalRanking: "Classement final",
    teamRanking: "Classement par équipe",
    replaySame: "Rejouer (mêmes joueurs)",
    newGameHome: "Nouvelle partie depuis l'accueil",
    serialKiller: "Serial Killeur",
    victimAward: "Victimos",
    pointsStolen: "pts volés aux autres",
    pointsSuffered: "pts subis",
    calculating: "Calcul en cours...",
    answerSubmitted: "Réponse envoyée ✅",
    timeUp: "Temps écoulé ⏱️",
    waitingOthers: "En attente des autres joueurs...",
    availableJokers: "Jokers disponibles",
    alreadyUsedAll: "Tu as déjà utilisé tous tes jokers.",
    chooseTarget: "Choisis ta cible",
    chooseTargetHint: "(tu peux aussi répondre directement, ça annulera ce joker)",
    cancel: "Annuler",
    provisionalRanking: "🏆 Classement provisoire",
    you: " (toi)",
    revealNow: "Révéler maintenant",
    nextQuestion: "Question suivante",
    finalRankingBtn: "Voir le classement final",
    validate: "Valider",
    trueLabel: "Vrai",
    falseLabel: "Faux",
    listening: "🔊 Écoutez sur cet écran...",
    soloIntro: "Pratique quand tu veux tester tes questions avant une vraie partie. Pas de jokers en solo — ils demandent des adversaires.",
    classicTestMode: "Mode test classique",
    crashTestMode: "Mode Crash Test 💀",
    crashHint: "Crash Test : temps illimité par question, mais 3 erreurs et c'est fini.",
    pseudoGenHint: "✨ le bouton génère un pseudo fun si tu manques d'inspiration",
    soloSettingsTitle: "Mode test — réglages",
    crashSettingsTitle: "Crash Test — réglages",
    startBtn: "Commencer",
    launchCrashBtn: "Lancer le Crash Test",
    scoreLabel: "Score",
    finishedTitle: "Terminé !",
    scoreOnTotal: "Score : {score} pts sur {total}",
    backToHome: "Retour à l'accueil",
    correctAnswerMsg: "Bonne réponse ! 🎉",
    closestWinsHint: "💡 Le plus près l'emporte !",
    wrongAnswerMsg: "Raté !",
    wrongAnswerCrashMsg: "Raté ! 💔",
    answerColonLabel: "Réponse :",
    nextBtn: "Suivant",
    crashFinishedTitle: "Crash Test terminé",
    finalScoreSeen: "Score final : {score} pts — {n} questions vues",
    matchAmorSettingsTitle: "Match Amor — réglages",
    matchAmorIntro: "Question après question, les mauvaises réponses éliminent. Le dernier debout gagne. 💔",
    createMatchAmorRoom: "Créer la salle Match Amor",
    inRace: "en course",
    placeBets: "💰 Placez vos mises !",
    correctAnswerIs: "Bonne réponse :",
    eliminatedLabel: "💔 Éliminé(s) :",
    noOneEliminated: "Personne d'éliminé ce round, tout le monde continue !",
    eliminatedScreenTitle: "Tu es éliminé 💀",
    eliminatedScreenHint: "Il reste {n} joueur(s) en course. Regarde la suite sur l'écran !",
    winnerTitle: "Vainqueur de Match Amor",
    calculatingSimple: "Calcul...",
    suspenseMsg: "Suspense...",
    apiHint: "Extraits fournis par l'API iTunes (30s max, gratuit). Le son se joue depuis l'écran de l'hôte — les joueurs n'ont besoin que de leur téléphone pour répondre.",
    musicCategoriesLabel: "Catégories musicales",
    questionTypesBlindLabel: "Types de questions",
    titleQuestionLabel: "Quel est le titre ?",
    artistQuestionLabel: "Qui chante ?",
    yearQuestionLabel: "Quelle année ?",
    originQuestionLabel: "Origine de l'artiste ?",
    consistencyHint: "Pour \"Qui chante ?\", les propositions restent cohérentes (groupe vs groupe, homme vs homme, femme vs femme) quand l'info est connue.",
    audioEffectLabel: "Effet audio",
    normalLabel: "Normal",
    slowLabel: "Ralenti 🐌",
    fastLabel: "Accéléré 🐇",
    introEffectLabel: "Intro très courte (2s) ⚡",
    nbTracksLabel: "Nombre de morceaux",
    searchingTracks: "Recherche des morceaux...",
    notEnoughTracks: "Pas assez de morceaux trouvés pour ces catégories, réessaie ou change de catégories.",
    chooseCategoryError: "Choisis au moins une catégorie musicale.",
    chooseTypeError: "Choisis au moins un type de question.",
    mysteryTrack: "🔊 Écoute sur l'écran principal !",
    whoSingsQuestion: "Qui chante cette chanson ?",
    whatYearQuestion: "En quelle année est sortie cette chanson ?",
    whereFromQuestion: "D'où vient cet artiste ?",
    trackWordSingular: "Morceau",
    answersPluralWord: "réponses",
    listeningOnScreen: "🔊 Écoutez sur cet écran...",
    bettingPlaced: "💰 Placez vos mises !",
    revealAfterBets: "La question sera révélée une fois toutes les mises reçues.",
    revealQuestionNow: "Révéler la question maintenant",
    yourBetHost: "🎤 Ta mise (hôte) — capital :",
    betSentLabel: "Mise envoyée ✅",
    howMuchBet: "Combien mises-tu ? (max {max})",
    halfBtn: "Moitié",
    allInBtn: "Tout miser",
    validateMyBet: "Valider ma mise",
    betResultsTitle: "Résultats de la mise",
    betWord: "mise",
    seeGrandFinal: "Voir le classement final",
    revealResultsBtn: "Révéler les résultats maintenant",
    eliminatedEnchereTitle: "Éliminé 💀",
    eliminatedEnchereHint: "Tu es tombé à 0 point, tu ne peux plus miser. Regarde la suite sur l'écran principal !",
    waitingForQuestion: "En attente de la question...",
    waitingNextQuestion: "En attente de la question suivante...",
    startingCapitalLabel: "Capital de départ",
    bettingSecondsLabel: "Secondes pour miser",
    answerSecondsLabel: "Secondes pour répondre",
    mixedCategoriesHint: "Toutes les catégories sont mélangées automatiquement — pas de sélection à faire.",
    loadingOptions: "Chargement des options...",
    haveBetSuffix: "ont misé",
    pauseBtn: "⏸ Mettre en pause",
    resumeBtn: "▶️ Reprendre",
    pausedMsg: "En pause — reprends quand tu veux",
    j_5050_label: "50/50", j_5050_desc: "Retire 2 mauvaises réponses (QCM uniquement).",
    j_x2_label: "x2", j_x2_desc: "Double tes points si tu réponds juste à cette question.",
    j_steal_label: "Vol de points", j_steal_desc: "Si tu réponds juste, vole 30 points à l'adversaire de ton choix.",
    j_block_label: "Blocage", j_block_desc: "Si tu réponds juste, l'adversaire ciblé ne marque aucun point sur cette question.",
    j_speedchrono_label: "Speed Chrono", j_speedchrono_desc: "Divise par deux le temps restant d'un adversaire pour répondre à cette question.",
    j_copieur_label: "Copieur", j_copieur_desc: "Espionne la réponse déjà validée d'un adversaire avant de donner la tienne (s'il n'a pas encore répondu, tu ne verras rien).",
    j_bouclier_label: "Bouclier", j_bouclier_desc: "Te protège d'un Vol de points ou d'un Blocage pendant cette question.",
    j_sondage_label: "Sondage", j_sondage_desc: "Affiche en direct le pourcentage de joueurs ayant choisi chaque réponse (QCM uniquement).",
    j_voleurtemps_label: "Voleur du Temps", j_voleurtemps_desc: "Vole 3 secondes à TOUS les autres joueurs sur cette question — le temps volé t'est intégralement reversé.",
    cat_animaux: "Animaux", cat_geo: "Géographie", cat_sport: "Sport", cat_films: "Films & Séries", cat_records: "Records",
    cat_disney: "Disney", cat_bouffe: "Alimentation", cat_logique: "Logique", cat_jv: "Jeux vidéo", cat_actu: "Ça a fait l'actu",
    cat_ortho: "Orthographe", cat_annees2000: "Années 2000", cat_musique: "Musique", cat_adulte18: "Ambiance -18",
    kcat_animaux: "Animaux", kcat_nature: "Sciences & Nature", kcat_contes: "Contes & Dessins animés", kcat_sport: "Sport", kcat_geo: "Géo Facile", kcat_logique: "Logique Enfant",
  },
  en: {
    appTagline: "General knowledge, quirky quizzes, blind test, nasty jokers... finally a game that'll spice up game night 🎉",
    createGame: "Create a game (host)",
    joinGame: "Join a game",
    blindTestBtn: "Music Blind Test",
    enchereBtn: "Double or Nothing",
    matchAmorBtn: "Love Match",
    soloBtn: "Play solo",
    back: "← Back",
    continueBtn: "Let's go!",
    yourJokersTitle: "Your jokers for the game",
    joinRoomBtn: "Join the room",
    exampleLabel: "💡 Concrete example",
    explainClassicTitle: "Classic Quiz",
    explainClassicB1: "Answer the questions right.",
    explainClassicB2: "The faster you answer, the more points you score.",
    explainClassicB3: "Use jokers to sabotage others (or protect yourself).",
    explainClassicB4: "Finish on top and become the legend of the night. 👑",
    explainClassicExample: "On a 20-second question: answer correctly in 2 seconds → 95 points. Answer correctly at second 19 → only 51 points. A wrong answer scores nothing (or a penalty if the host enabled it).",
    explainSoloTitle: "Play Solo",
    explainSoloB1: "Test yourself, at your own pace.",
    explainSoloB2: "Crash Test mode: 3 mistakes and you're toast. 💀",
    explainSoloB3: "No jokers here, just you against the questions.",
    explainMatchAmorTitle: "Love Match",
    explainMatchAmorB1: "One wrong answer and you're out. ☠️",
    explainMatchAmorB2: "If everyone flops (or aces it), nobody's eliminated.",
    explainMatchAmorB3: "The last one standing takes it all.",
    explainBlindTestTitle: "Music Blind Test",
    explainBlindTestB1: "The sound plays on the main screen, guess away. 🎧",
    explainBlindTestB2: "Title, artist, year, trivia... stay sharp.",
    explainBlindTestB3: "Fastest and most accurate wins the points.",
    explainEnchereTitle: "Double or Nothing",
    explainEnchereB1: "You start with a big pile of points. 💰",
    explainEnchereB2: "Before each question, bet whatever you want.",
    explainEnchereB3: "Right answer = bet doubled. Wrong = all gone.",
    explainEnchereB4: "Hit 0 points and you're done. 💀",
    explainEnchereB5: "Richest player at the end wins it all.",
    explainEnchereExample: "You have 1000 points and bet 300 on a question marked 🔴 Hard. Correct answer → you gain 300 pts (total 1300). Wrong answer → you lose your bet (total 700).",
    roomSettingsTitle: "Game settings",
    categoriesLabel: "Categories",
    sectionFormatTitle: "Game format",
    checkAll: "Check all",
    uncheckAll: "Uncheck all",
    kidsMode: "🎈 Kids Mode (ages 10-14)",
    questionTypesLabel: "Question types",
    qcmLabel: "Multiple choice",
    vfLabel: "True / False",
    echelleLabel: "Numeric answer",
    nbQuestionsLabel: "Number of questions",
    secondsPerQuestionLabel: "Seconds per question",
    teamsModeLabel: "Team mode",
    soloForAll: "Everyone for themselves",
    teamsCount: "teams",
    jokersEnabledLabel: "Enabled jokers",
    jokerAttribLabel: "Joker assignment",
    jokerManual: "Players choose their own",
    jokerRandomLabel: "Random assignment 🎴",
    jokerManualHint: "Each player picks their own jokers.",
    jokerRandomHint: "The computer draws jokers at random.",
    jokersPerPlayerLabel: "Jokers per player:",
    malusLabel: "Penalty if wrong",
    malusNone: "None",
    hostPlaysLabel: "Does the host play too?",
    hostPlaysNo: "No, just hosting",
    hostPlaysYes: "Yes, I'm playing too",
    hostPlaysWarning: "⚠️ No jokers for you, to keep things simple from the host screen.",
    hostPseudoPlaceholder: "Your nickname (optional)",
    createRoomBtn: "Create the room",
    joinTitle: "Join",
    roomCodeLabel: "Room code",
    roomCodePlaceholder: "E.G.: FUNK",
    errCodeLength: "The code is 4 letters long.",
    errRoomNotFound: "Room not found, check the code.",
    errChoosePseudo: "Choose a nickname.",
    errChooseAnimal: "Choose an animal.",
    loadingDots: "...",
    continueSimple: "Continue",
    yourPseudoTitle: "Your nickname",
    pseudoPlaceholder: "Type your nickname...",
    pseudoHint: "✨ tap the button to generate a fun nickname if you're out of ideas. If you type the exact same nickname as before in this room, you'll get your spot and points back.",
    yourAvatarTitle: "Your avatar",
    avatarHint: "Pick your animal (already taken = unavailable)",
    joinPartyBtn: "Join the game",
    jokerBoxTitle: "Jokers enabled",
    jokerTutoRandom: "Tonight's random draw: you'll get {n} joker(s) from the list below. Only one joker per question!",
    jokerTutoManual: "On the next screen, choose {n} joker(s) yourself from the list below. Only one joker per question!",
    noJokerThisGame: "No jokers enabled for this game.",
    drawJokersTitle: "Draw your jokers 🎴",
    pickJokersTitle: "Choose your jokers 🎯",
    drawChooseCards: "Choose {n} card(s) out of {total}. The shuffle is yours alone, no one can cheat.",
    pickChooseJokers: "Select {n} joker(s) out of {total} — only one of each type. These will be yours for the whole game.",
    alreadyRevealed: "Already revealed:",
    selectedCount: "selected",
    validateMyJokers: "Confirm my jokers",
    waitingForHost: "Waiting for the host to start the game... 🎬",
    playersInRoom: "Players in the room",
    yourJokersColon: "Your jokers for this game:",
    noJokerForGame: "No jokers for this game.",
    launchGame: "Start the game",
    joinWithCode: "Join with the code",
    linkCopiedMsg: "Link copied ✓",
    copyLinkBtn: "📋 Copy game link",
    scanHint: "📷 Scan to join the game",
    clickToChangeTeam: " — tap a player to change their team",
    waitingPlayersLobby: "Waiting for players...",
    teamWord: "Team",
    roomWord: "Room",
    loadingSimple: "Loading...",
    scanQrBtn: "📷 Scan a QR code",
    scanCameraHint: "Point at the QR code shown on the host's screen",
    cameraError: "Couldn't access the camera.",
    cameraErrorTitle: "Camera unavailable",
    cameraErrorHint: "Check that you've allowed camera access, or type the code manually below.",
    orDivider: "— or —",
    questionsWord: "questions",
    tracksWord: "tracks",
    questionWord: "Question",
    answersWord: "answers",
    hostAnswerTitle: "🎤 Your answer (host)",
    waitingForTargetAnswer: "👀 Waiting for {name}'s answer...",
    targetAnswered: "👀 {name} answered: {value}",
    yourTargetFallback: "your target",
    yourTargetFallbackCap: "Your target",
    yourJokersShort: "Your jokers",
    chooseTargetCancelHint: "Choose your target (you can also answer directly, this will cancel this joker)",
    playerAnswersTitle: "Players' answers",
    seeWinner: "See the winner",
    revealResultsNow: "Reveal results now",
    nextTrack: "Next track",
    timeReducedMsg: "⏱️ Your time was reduced by an opponent!",
    targetedByMsg: "🎯 {names} targeted you on this question!",
    targetedVerbPlural: "",
    targetedVerbSingular: "",
    finalRanking: "Final ranking",
    teamRanking: "Team ranking",
    replaySame: "Play again (same players)",
    newGameHome: "New game from home",
    serialKiller: "Serial Killer",
    victimAward: "Top Victim",
    pointsStolen: "pts stolen from others",
    pointsSuffered: "pts suffered",
    calculating: "Calculating...",
    answerSubmitted: "Answer sent ✅",
    timeUp: "Time's up ⏱️",
    waitingOthers: "Waiting for other players...",
    availableJokers: "Available jokers",
    alreadyUsedAll: "You've already used all your jokers.",
    chooseTarget: "Choose your target",
    chooseTargetHint: "(you can also answer directly, this will cancel this joker)",
    cancel: "Cancel",
    provisionalRanking: "🏆 Provisional ranking",
    you: " (you)",
    revealNow: "Reveal now",
    nextQuestion: "Next question",
    finalRankingBtn: "See final ranking",
    validate: "Confirm",
    trueLabel: "True",
    falseLabel: "False",
    listening: "🔊 Listen on this screen...",
    soloIntro: "Practice whenever you want to try out questions before a real game. No jokers in solo — they need opponents.",
    classicTestMode: "Classic test mode",
    crashTestMode: "Crash Test mode 💀",
    crashHint: "Crash Test: unlimited time per question, but 3 mistakes and it's over.",
    pseudoGenHint: "✨ tap the button to generate a fun nickname if you're out of ideas",
    soloSettingsTitle: "Test mode — settings",
    crashSettingsTitle: "Crash Test — settings",
    startBtn: "Start",
    launchCrashBtn: "Start Crash Test",
    scoreLabel: "Score",
    finishedTitle: "Done!",
    scoreOnTotal: "Score: {score} pts out of {total}",
    backToHome: "Back to home",
    correctAnswerMsg: "Correct answer! 🎉",
    closestWinsHint: "💡 Closest guess wins!",
    wrongAnswerMsg: "Wrong!",
    wrongAnswerCrashMsg: "Wrong! 💔",
    answerColonLabel: "Answer:",
    nextBtn: "Next",
    crashFinishedTitle: "Crash Test over",
    finalScoreSeen: "Final score: {score} pts — {n} questions seen",
    matchAmorSettingsTitle: "Love Match — settings",
    matchAmorIntro: "Question after question, wrong answers eliminate you. The last one standing wins. 💔",
    createMatchAmorRoom: "Create the Love Match room",
    inRace: "still in",
    placeBets: "💰 Place your bets!",
    correctAnswerIs: "Correct answer:",
    eliminatedLabel: "💔 Eliminated:",
    noOneEliminated: "No one eliminated this round, everyone continues!",
    eliminatedScreenTitle: "You're eliminated 💀",
    eliminatedScreenHint: "{n} player(s) still in the race. Watch the rest on the screen!",
    winnerTitle: "Love Match winner",
    calculatingSimple: "Calculating...",
    suspenseMsg: "Suspense...",
    apiHint: "Clips provided by the iTunes API (30s max, free). The sound plays from the host's screen — players only need their phone to answer.",
    musicCategoriesLabel: "Music categories",
    questionTypesBlindLabel: "Question types",
    titleQuestionLabel: "What's the title?",
    artistQuestionLabel: "Who sings it?",
    yearQuestionLabel: "What year?",
    originQuestionLabel: "Artist's origin?",
    consistencyHint: "For \"Who sings it?\", the options stay consistent (group vs group, man vs man, woman vs woman) when known.",
    audioEffectLabel: "Audio effect",
    normalLabel: "Normal",
    slowLabel: "Slowed down 🐌",
    fastLabel: "Sped up 🐇",
    introEffectLabel: "Very short intro (2s) ⚡",
    nbTracksLabel: "Number of tracks",
    searchingTracks: "Searching for tracks...",
    notEnoughTracks: "Not enough tracks found for these categories, try again or change categories.",
    chooseCategoryError: "Choose at least one music category.",
    chooseTypeError: "Choose at least one question type.",
    mysteryTrack: "🔊 Listen on the main screen!",
    whoSingsQuestion: "Who sings this song?",
    whatYearQuestion: "What year was this song released?",
    whereFromQuestion: "Where is this artist from?",
    trackWordSingular: "Track",
    answersPluralWord: "answers",
    listeningOnScreen: "🔊 Listen on this screen...",
    bettingPlaced: "💰 Place your bets!",
    revealAfterBets: "The question will be revealed once all bets are in.",
    revealQuestionNow: "Reveal the question now",
    yourBetHost: "🎤 Your bet (host) — capital:",
    betSentLabel: "Bet sent ✅",
    howMuchBet: "How much do you bet? (max {max})",
    halfBtn: "Half",
    allInBtn: "All in",
    validateMyBet: "Confirm my bet",
    betResultsTitle: "Bet results",
    betWord: "bet",
    seeGrandFinal: "See final ranking",
    revealResultsBtn: "Reveal results now",
    eliminatedEnchereTitle: "Eliminated 💀",
    eliminatedEnchereHint: "You dropped to 0 points, you can no longer bet. Watch the rest on the main screen!",
    waitingForQuestion: "Waiting for the question...",
    waitingNextQuestion: "Waiting for the next question...",
    startingCapitalLabel: "Starting capital",
    bettingSecondsLabel: "Seconds to bet",
    answerSecondsLabel: "Seconds to answer",
    mixedCategoriesHint: "All categories are mixed automatically — nothing to select.",
    loadingOptions: "Loading options...",
    haveBetSuffix: "have bet",
    pauseBtn: "⏸ Pause",
    resumeBtn: "▶️ Resume",
    pausedMsg: "Paused — resume whenever you're ready",
    j_5050_label: "50/50", j_5050_desc: "Removes 2 wrong answers (multiple choice only).",
    j_x2_label: "x2", j_x2_desc: "Doubles your points if you answer this question correctly.",
    j_steal_label: "Point Steal", j_steal_desc: "If you answer correctly, steal 30 points from the opponent of your choice.",
    j_block_label: "Block", j_block_desc: "If you answer correctly, the targeted opponent scores no points on this question.",
    j_speedchrono_label: "Speed Chrono", j_speedchrono_desc: "Halves an opponent's remaining time to answer this question.",
    j_copieur_label: "Copycat", j_copieur_desc: "Spy on an opponent's already-submitted answer before giving yours (if they haven't answered yet, you'll see nothing).",
    j_bouclier_label: "Shield", j_bouclier_desc: "Protects you from a Point Steal or Block on this question.",
    j_sondage_label: "Poll", j_sondage_desc: "Shows live the percentage of players who picked each answer (multiple choice only).",
    j_voleurtemps_label: "Time Thief", j_voleurtemps_desc: "Steals 3 seconds from ALL other players on this question — the stolen time is fully credited to you.",
    cat_animaux: "Animals", cat_geo: "Geography", cat_sport: "Sports", cat_films: "Movies & TV Shows", cat_records: "Records",
    cat_disney: "Disney", cat_bouffe: "Food", cat_logique: "Logic", cat_jv: "Video Games", cat_actu: "In the News",
    cat_ortho: "Spelling", cat_annees2000: "2000s", cat_musique: "Music", cat_adulte18: "18+ Vibes",
    kcat_animaux: "Animals", kcat_nature: "Science & Nature", kcat_contes: "Tales & Cartoons", kcat_sport: "Sports", kcat_geo: "Easy Geography", kcat_logique: "Kids Logic",
  },
};

const LangContext = createContext({ lang: "fr", t: (k) => STRINGS.fr[k] || k });
function useLang() { return useContext(LangContext); }
function t(lang, key) { return (STRINGS[lang] && STRINGS[lang][key]) || STRINGS.fr[key] || key; }
function jokerLabel(j, lang) { return t(lang, `j_${j.id}_label`); }
function jokerDesc(j, lang) { return t(lang, `j_${j.id}_desc`); }
function categoryLabel(cat, lang) { return t(lang, `cat_${cat.id}`); }
function kidsCategoryLabel(cat, lang) { return t(lang, `kcat_${cat.id.replace("k_", "")}`); }

function LangSwitch({ lang, setLang }) {
  return (
    <div className="flex gap-2 justify-center mb-4">
      <button onClick={() => setLang("fr")} className="rounded-full px-3 py-1 text-sm font-bold" style={{ background: lang === "fr" ? C.gold : "rgba(255,255,255,0.08)", color: lang === "fr" ? "#1B1030" : C.cream }}>🇫🇷 FR</button>
      <button onClick={() => setLang("en")} className="rounded-full px-3 py-1 text-sm font-bold" style={{ background: lang === "en" ? C.gold : "rgba(255,255,255,0.08)", color: lang === "en" ? "#1B1030" : C.cream }}>🇬🇧 EN</button>
    </div>
  );
}


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

function loadJsQR() {
  return new Promise((resolve, reject) => {
    if (window.jsQR) return resolve(window.jsQR);
    const id = "quiz-app-jsqr";
    const existing = document.getElementById(id);
    if (existing) {
      existing.addEventListener("load", () => resolve(window.jsQR));
      existing.addEventListener("error", reject);
      return;
    }
    const script = document.createElement("script");
    script.id = id;
    script.src = "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js";
    script.onload = () => resolve(window.jsQR);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function extractCodeFromScan(text) {
  if (!text) return null;
  try {
    const url = new URL(text);
    const c = url.searchParams.get("code");
    if (c && c.length === 4) return c.toUpperCase();
  } catch {
    // Pas une URL — peut-être le code brut a été encodé directement
  }
  const trimmed = text.trim().toUpperCase();
  if (/^[A-Z]{4}$/.test(trimmed)) return trimmed;
  return null;
}

function QRScannerModal({ onScanned, onClose }) {
  const { t: tr } = useLang();
  const videoRef = useRef(null);
  const canvasRef = useRef(document.createElement("canvas"));
  const [error, setError] = useState("");
  const streamRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    let stopped = false;
    (async () => {
      try {
        await loadJsQR();
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (stopped) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        const tick = () => {
          if (stopped) return;
          const video = videoRef.current;
          if (video && video.readyState === video.HAVE_ENOUGH_DATA && window.jsQR) {
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const result = window.jsQR(imageData.data, imageData.width, imageData.height);
            if (result && result.data) {
              const code = extractCodeFromScan(result.data);
              if (code) { onScanned(code); return; }
            }
          }
          rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
      } catch (e) {
        if (!stopped) setError(e?.message || tr("cameraError"));
      }
    })();
    return () => {
      stopped = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 100, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <button onClick={onClose} className="rounded-full p-2 mb-4" style={{ background: "rgba(255,255,255,0.15)", position: "absolute", top: 20, right: 20 }}><X size={22} color="#fff" /></button>
      {error ? (
        <div className="text-center" style={{ color: C.cream, maxWidth: 320 }}>
          <p className="mb-2" style={{ fontFamily: F.display, fontSize: 18, color: C.pink }}>{tr("cameraErrorTitle")}</p>
          <p className="text-sm opacity-80">{tr("cameraErrorHint")}</p>
        </div>
      ) : (
        <>
          <div className="rounded-2xl overflow-hidden relative" style={{ width: "100%", maxWidth: 360, aspectRatio: "1/1", background: "#000" }}>
            <video ref={videoRef} muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 24, border: `3px solid ${C.gold}`, borderRadius: 16, pointerEvents: "none" }} />
          </div>
          <p className="text-sm mt-4 text-center" style={{ color: C.cream, opacity: 0.8 }}>{tr("scanCameraHint")}</p>
        </>
      )}
    </div>
  );
}
const F = { display: "'Baloo 2', system-ui, sans-serif", body: "'Nunito', system-ui, sans-serif", mono: "'Space Mono', monospace" };
const C = { bg: "#180F2E", bg2: "#241645", pink: "#FF3D7F", gold: "#FFC93C", teal: "#2EE6D6", violet: "#7B4EFF", cream: "#FFF6E9", mint: "#4ADE80", orange: "#C2410C" };

/* ---------------------------------------------------------
   ANIMATIONS DE FIN DE PARTIE (confettis / pluie d'emojis)
--------------------------------------------------------- */
function useFallingEmojiStyles() {
  useEffect(() => {
    const id = "quiz-falling-emoji-styles";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `@keyframes quizFall { 0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; } 100% { transform: translateY(110vh) rotate(360deg); opacity: 0.85; } }`;
    document.head.appendChild(style);
  }, []);
}
function FallingEmojis({ emojis, count = 24, side }) {
  useFallingEmojiStyles();
  const [particles] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: side === "left" ? Math.random() * 45 : side === "right" ? 55 + Math.random() * 45 : Math.random() * 100,
      delay: Math.random() * 2.5,
      duration: 3 + Math.random() * 2.5,
      size: 18 + Math.random() * 20,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }))
  );
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
      {particles.map((p) => (
        <span key={p.id} style={{ position: "absolute", left: `${p.left}%`, top: 0, fontSize: p.size, animation: `quizFall ${p.duration}s linear ${p.delay}s infinite` }}>
          {p.emoji}
        </span>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------
   EXPLICATION DE MODE (page ludique avant chaque mode)
--------------------------------------------------------- */
function ModeExplainer({ emoji, title, color, bullets, example, onContinue, onBack }) {
  const { t: tr } = useLang();
  return (
    <Stage wide>
      <ScreenHeader title={`${emoji} ${title}`} onBack={onBack} color={color} />
      <div className="flex flex-col gap-3 mb-6">
        {bullets.map((b, i) => (
          <div key={i} className="rounded-2xl p-4 flex items-center gap-4" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 42, height: 42, background: color, fontFamily: F.display, fontSize: 20, color: "#1B1030", fontWeight: 800 }}>{b.emoji || i + 1}</div>
            <p style={{ fontFamily: F.display, fontSize: 21, lineHeight: 1.25 }}>{b.text}</p>
          </div>
        ))}
      </div>
      {example && (
        <div className="rounded-2xl p-4 mb-6" style={{ background: "rgba(255,201,60,0.08)", border: `2px solid ${color}` }}>
          <p className="text-xs font-bold mb-2 uppercase tracking-wide" style={{ color }}>{tr("exampleLabel")}</p>
          <p className="text-sm opacity-90" style={{ lineHeight: 1.6 }}>{example}</p>
        </div>
      )}
      <BigButton onClick={onContinue} color={color} icon={Play}>{tr("continueBtn")}</BigButton>
    </Stage>
  );
}

const DIFFICULTY_HINT = {
  vf: { label: "Facile", emoji: "🟢" },
  qcm: { label: "Moyen", emoji: "🟡" },
  carte: { label: "Moyen", emoji: "🟡" },
  echelle: { label: "Difficile", emoji: "🔴" },
};
function hintLabel(hint, lang) {
  if (lang !== "en") return hint.label;
  const map = { Facile: "Easy", Moyen: "Medium", Difficile: "Hard" };
  return map[hint.label] || hint.label;
}

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
const killerKey = (code, pid) => `qz:${code}:killer:${pid}`;
const victimKey = (code, pid) => `qz:${code}:victim:${pid}`;
const targetedKey = (code, qIdx, targetId, attackerId) => `qz:${code}:targeted:${qIdx}:${targetId}:${attackerId}`;
const speedChronoKey = (code, qIdx, targetId) => `qz:${code}:speedchrono:${qIdx}:${targetId}`;
const revealedKey = (code, qIdx) => `qz:${code}:revealed:${qIdx}`;
const revealDetailKey = (code, qIdx) => `qz:${code}:revealdetail:${qIdx}`;
const pointsDeltaKey = (code, qIdx, pid) => `qz:${code}:pointsdelta:${qIdx}:${pid}`;
const betKey = (code, qIdx, pid) => `qz:${code}:bet:${qIdx}:${pid}`;
const debuffKeyPrefix = (code, qIdx, targetId) => `qz:${code}:debuff:${qIdx}:${targetId}:`;

/* ---------------------------------------------------------
   AVATARS (animaux uniquement, plus d'accessoires)
--------------------------------------------------------- */
const ANIMALS = ["🦊", "🐼", "🦁", "🐸", "🦄", "🐙", "🦥", "🐺", "🦉", "🐷", "🦖", "🐨", "🦩", "🐵", "🦔", "🐧", "🐯", "🦈", "🐻", "🦫"];

const FUN_PSEUDOS = [
  "Rougail saucisses", "Destructor", "Le boss", "Dieu", "C'est moi",
  "Le buffle", "Quoicoubeh", "Xptdr", "Roule ma poule", "Oasis is good",
  "Gronaldo", "Minimoys", "Ketchup mayo", "Tonton Hervé", "For sure",
  "Hollande en scoot", "Killian M'raté", "Le J c'est le S", "Tata Monique", "La Mélanch'",
  "La larve", "Le Patoch'", "La licorne dorée", "Pascal au bistrot", "Zézette épouse X",
  "Jacquouille", "Chirac en slibar", "Cathy d'la compta", "Lenny Chon", "Couscous royal",
  "La moulaga", "Dalida en crocs", "Ciao bambino", "Lenny Bar", "Vegan enragé",
  "Pizza ananas", "Carlos big bisous", "Amandine du 38", "Tibo In Shnek", "Chérie coco",
  "Femme des îles",
];
function funPseudo(exclude) {
  if (!exclude || FUN_PSEUDOS.length <= 1) return FUN_PSEUDOS[Math.floor(Math.random() * FUN_PSEUDOS.length)];
  const pool = FUN_PSEUDOS.filter((p) => p !== exclude);
  return pool[Math.floor(Math.random() * pool.length)];
}

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
    { type: "qcm", text: "Combien de cœurs a une pieuvre ?", options: ["1", "2", "3", "9"], answer: 2 },
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
    { type: "echelle", text: "Quelle est l'espérance de vie d'un lion dans la nature ?", answer: 15, unit: "ans" },
    { type: "echelle", text: "Combien mesure la langue d'une girafe adulte (à 10cm près) ?", answer: 55, unit: "cm", margin: 10 },
    { type: "echelle", text: "À quelle vitesse un dauphin peut-il nager (à 10km/h près) ?", answer: 50, unit: "km/h", margin: 10 },
    { type: "qcm", text: "Quel est l'oiseau le plus rapide du monde (en piqué) ?", options: ["L'aigle royal", "Le faucon pèlerin", "L'albatros", "L'hirondelle"], answer: 1 },
    { type: "qcm", text: "Quel est le serpent le plus long du monde ?", options: ["L'anaconda vert", "Le python réticulé", "Le cobra royal", "Le mamba noir"], answer: 1 },
    { type: "qcm", text: "Quelle grenouille est considérée comme la plus toxique du monde ?", options: ["La grenouille tomate", "Le dendrobate doré", "Le crapaud buffle", "La rainette verte"], answer: 1 },
    { type: "echelle", text: "Combien d'années une tortue des Galápagos peut-elle vivre (à 20 ans près) ?", answer: 180, unit: "ans", margin: 20 },
    { type: "echelle", text: "Quelle vitesse un crocodile peut-il atteindre en sprint (à 10km/h près) ?", answer: 30, unit: "km/h", margin: 10 },
    { type: "qcm", text: "Quelle race de chien est considérée comme la plus rapide ?", options: ["Le lévrier Greyhound", "Le berger allemand", "Le husky", "Le dalmatien"], answer: 0 },
    { type: "echelle", text: "Quel âge avait le chat le plus vieux jamais enregistré (Crème Puff, à 3 ans près) ?", answer: 38, unit: "ans", margin: 3 },
    { type: "qcm", text: "Quelle fourmi est considérée comme la plus dangereuse au monde (piqûre potentiellement mortelle) ?", options: ["La fourmi charpentière", "La fourmi bulldog", "La fourmi rhino", "La fourmi soleil"], answer: 1 },
    { type: "echelle", text: "Combien peut peser le cœur d'une baleine bleue (à 20kg près) ?", answer: 180, unit: "kg", margin: 20 },
    { type: "qcm", text: "Quel animal pond les plus petits œufs du monde animal ?", options: ["Le moineau", "Le colibri", "La mésange", "L'hirondelle"], answer: 1 },
    { type: "qcm", text: "Quel animal marin possède le venin le plus mortel du monde ?", options: ["Le serpent taïpan", "L'araignée veuve noire", "La méduse-boîte", "Le scorpion jaune"], answer: 2 },
    { type: "vf", text: "Un rat émet des sortes de 'rires' ultrasoniques quand on le chatouille.", answer: true },
    { type: "echelle", text: "Combien d'estomacs possède une vache ?", answer: 4, unit: "", margin: 0 },
    { type: "vf", text: "Un cafard peut survivre plusieurs jours après avoir été décapité.", answer: true },
    { type: "qcm", text: "Quel animal peut vivre toute sa vie sans jamais boire d'eau directement ?", options: ["Le kangourou", "La gerbille", "La souris du désert", "Le dromadaire"], answer: 2 },
    { type: "qcm", text: "Quel insecte est réputé pour avoir la piqûre la plus douloureuse du monde ?", options: ["Le scorpion buffle", "La fourmi balle de fusil", "La guêpe du Tibet", "Le frelon des sommets"], answer: 1 },
    { type: "echelle", text: "Quel âge avait le chien le plus vieux jamais enregistré (Bobi, Portugal), à 2 ans près ?", answer: 31, unit: "ans", margin: 2 },
    { type: "echelle", text: "Quelle est la vitesse de pointe d'un guépard (à 10km/h près) ?", answer: 120, unit: "km/h", margin: 10 },
    { type: "echelle", text: "Combien de tonnes peut peser une baleine bleue, le plus gros animal vivant (à 20 tonnes près) ?", answer: 190, unit: "tonnes", margin: 20 },
    { type: "qcm", text: "Quel est l'animal à la durée de vie la plus longue jamais recensée ?", options: ["La tortue géante", "La baleine boréale", "Le requin du Groenland", "L'huître perlière"], answer: 2 },
    { type: "echelle", text: "Quel est le nombre maximum d'œufs pondus par une poule en un an (à 30 près) ?", answer: 507, unit: "œufs", margin: 30 },
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
    { type: "qcm", text: "Quel pays possède le plus grand nombre d'îles au monde ?", options: ["Indonésie", "Suède", "Norvège", "Philippines"], answer: 1 },
    { type: "carte", text: "Pointe le continent où se trouve l'Inde", answer: "asie" },
    { type: "qcm", text: "Quelle chaîne de montagnes sépare l'Europe de l'Asie ?", options: ["Les Alpes", "L'Oural", "Les Carpates", "Les Pyrénées"], answer: 1 },
    { type: "vf", text: "Monaco est le plus petit État du monde, devant le Vatican.", answer: false },
    { type: "qcm", text: "Quel pays a pour capitale Ottawa ?", options: ["Les États-Unis", "Le Canada", "L'Australie", "La Nouvelle-Zélande"], answer: 1 },
    { type: "echelle", text: "Quelle est la longueur approximative du fleuve Amazone en kilomètres ?", answer: 6400, unit: "km" },
    { type: "qcm", text: "Dans quel pays se trouve le Machu Picchu ?", options: ["Le Mexique", "Le Chili", "Le Pérou", "La Bolivie"], answer: 2 },
    { type: "qcm", text: "Quelles sont les 3 couleurs du drapeau cubain ?", options: ["Bleu, blanc, rouge", "Vert, blanc, rouge", "Bleu, jaune, rouge", "Noir, blanc, rouge"], answer: 0 },
    { type: "qcm", text: "Quel pays a pour capitale Islamabad ?", options: ["L'Inde", "Le Pakistan", "L'Afghanistan", "Le Bangladesh"], answer: 1 },
    { type: "qcm", text: "Quel est le chef-lieu de la Haute-Garonne ?", options: ["Montpellier", "Toulouse", "Bordeaux", "Perpignan"], answer: 1 },
    { type: "qcm", text: "Dans quel océan se trouve Tahiti ?", options: ["Océan Atlantique", "Océan Indien", "Océan Pacifique", "Océan Arctique"], answer: 2 },
    { type: "echelle", text: "Quel est le numéro du département du Jura ?", answer: 39, unit: "", margin: 0 },
    { type: "qcm", text: "Quelle couleur ont en commun les drapeaux de la Colombie et du Yémen ?", options: ["Le bleu", "Le rouge", "Le vert", "Le noir"], answer: 1 },
    { type: "echelle", text: "À 1000 km près, combien de kilomètres séparent Paris de Mexico ?", answer: 9200, unit: "km", margin: 1000 },
    { type: "qcm", text: "Quel est le plus grand pays du monde en superficie ?", options: ["Canada", "États-Unis", "Russie", "Chine"], answer: 2 },
    { type: "qcm", text: "Quel est le plus grand océan du monde ?", options: ["L'océan Indien", "L'océan Atlantique", "L'océan Arctique", "L'océan Pacifique"], answer: 3 },
    { type: "qcm", text: "Quelle monnaie est utilisée au Japon ?", options: ["Le yen", "Le won", "Le yuan", "Le dollar"], answer: 0 },
    { type: "qcm", text: "Quelle est la capitale du Maroc ?", options: ["Casablanca", "Marrakech", "Rabat", "Tanger"], answer: 2 },
    { type: "qcm", text: "Quelle est la capitale de l'Islande ?", options: ["Oslo", "Stockholm", "Reykjavik", "Helsinki"], answer: 2 },
    { type: "echelle", text: "Combien d'états composent les États-Unis ?", answer: 50, unit: "états", margin: 0 },
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
    { type: "echelle", text: "Quel était le score de la finale de la Coupe du Monde de football 2018 (nombre total de buts) ?", answer: 6, unit: "buts (4-2)", margin: 0 },
    { type: "qcm", text: "Où se dérouleront les Jeux Olympiques d'été 2028 ?", options: ["Paris", "Los Angeles", "Brisbane", "Tokyo"], answer: 1 },
    { type: "qcm", text: "Hormis le football, quel est l'autre sport très populaire en Angleterre ?", options: ["Le baseball", "Le cricket", "Le hockey sur gazon", "Le handball"], answer: 1 },
    { type: "echelle", text: "Combien de joueurs compose une équipe de handball sur le terrain ?", answer: 7, unit: "joueurs", margin: 0 },
    { type: "echelle", text: "Combien de fois Teddy Riner a-t-il été champion du monde de judo ?", answer: 11, unit: "fois", margin: 0 },
    { type: "qcm", text: "Qui est le meilleur buteur de l'histoire de l'équipe de France de football ?", options: ["Thierry Henry", "Olivier Giroud", "Kylian Mbappé", "Antoine Griezmann"], answer: 2 },
    { type: "qcm", text: "Dans quelle discipline sportive s'est illustré l'acteur Dwayne Johnson avant Hollywood ?", options: ["La boxe", "Le catch (WWE)", "Le football américain uniquement", "Les arts martiaux mixtes"], answer: 1 },
    { type: "qcm", text: "Quel joueur est le meilleur buteur de l'histoire de la Ligue des Champions ?", options: ["Lionel Messi", "Thierry Henry", "Cristiano Ronaldo", "Karim Benzema"], answer: 2 },
    { type: "echelle", text: "Quelle est la plus large marge de victoire de l'histoire de la Coupe du Monde de football (en buts d'écart) ?", answer: 11, unit: "buts (Hongrie-Salvador, 1982)", margin: 0 },
    { type: "echelle", text: "Combien de Ballons d'Or Lionel Messi a-t-il remportés (record) ?", answer: 8, unit: "", margin: 0 },
    { type: "echelle", text: "Quelle est la capacité du Camp Nou, stade du FC Barcelone (à 5000 places près) ?", answer: 99000, unit: "places", margin: 5000 },
    { type: "echelle", text: "Combien de titres de champion de France de Ligue 1 le PSG possède-t-il (record) ?", answer: 14, unit: "titres", margin: 0 },
    { type: "echelle", text: "Combien de spectateurs le Maracanã a-t-il accueillis pour la finale de la Coupe du Monde 1950 (à 20 000 près) ?", answer: 200000, unit: "spectateurs", margin: 20000 },
    { type: "qcm", text: "Quel pays a organisé la toute première Coupe du Monde de football, en 1930 ?", options: ["Brésil", "Italie", "Uruguay", "France"], answer: 2 },
    { type: "qcm", text: "Qui détient le record du plus grand nombre de points marqués en carrière en NBA ?", options: ["Kareem Abdul-Jabbar", "LeBron James", "Michael Jordan", "Kobe Bryant"], answer: 1 },
    { type: "echelle", text: "Combien de titres NBA Michael Jordan a-t-il gagnés ?", answer: 6, unit: "titres", margin: 0 },
    { type: "qcm", text: "Quel joueur français est le plus titré de l'histoire en NBA ?", options: ["Tony Parker", "Rudy Gobert", "Boris Diaw", "Nicolas Batum"], answer: 0 },
    { type: "echelle", text: "À quelle vitesse a été enregistré le service le plus rapide de l'histoire du tennis (à 10 km/h près) ?", answer: 251, unit: "km/h (Sam Groth)", margin: 10 },
    { type: "qcm", text: "Quelle surface est considérée comme la plus rapide au tennis ?", options: ["Terre battue", "Gazon", "Dur", "Moquette"], answer: 1 },
    { type: "qcm", text: "Quel pays a remporté le plus de Coupes du Monde de rugby ?", options: ["Australie", "Angleterre", "Afrique du Sud", "Nouvelle-Zélande"], answer: 2 },
    { type: "echelle", text: "En quelle année la France a-t-elle accueilli sa première Coupe du Monde de rugby ?", answer: 2007, unit: "" },
    { type: "echelle", text: "Combien de kilomètres fait le Tour de France en moyenne (à 300 km près) ?", answer: 3800, unit: "km", margin: 300 },
    { type: "qcm", text: "Quel coureur cycliste a été déchu de ses 7 titres du Tour de France pour dopage ?", options: ["Jan Ullrich", "Marco Pantani", "Lance Armstrong", "Bjarne Riis"], answer: 2 },
    { type: "qcm", text: "Où ont eu lieu les premiers Jeux Olympiques modernes, en 1896 ?", options: ["Paris", "Athènes", "Londres", "Rome"], answer: 1 },
    { type: "echelle", text: "Combien de médailles d'or Michael Phelps possède-t-il au total ?", answer: 23, unit: "médailles d'or", margin: 0 },
    { type: "qcm", text: "Quelle discipline compte le plus grand nombre d'athlètes aux Jeux Olympiques ?", options: ["Athlétisme", "Natation", "Gymnastique", "Cyclisme"], answer: 0 },
    { type: "echelle", text: "Combien de joueurs compose une équipe de baseball sur le terrain ?", answer: 9, unit: "joueurs", margin: 0 },
    { type: "qcm", text: "Combien de temps dure un match de hockey sur glace (temps réglementaire) ?", options: ["3 x 15 min", "3 x 20 min", "2 x 30 min", "4 x 12 min"], answer: 1 },
    { type: "echelle", text: "Quelle est la distance entre le panier et la ligne à 3 points en NBA (à 20cm près) ?", answer: 7.24, unit: "m", margin: 0.2 },
    { type: "qcm", text: "Quel est le sport le plus pratiqué/suivi au monde ?", options: ["Le basket", "Le tennis", "Le football", "La natation"], answer: 2 },
    { type: "qcm", text: "Quel pays a inventé le cricket ?", options: ["Inde", "Australie", "Angleterre", "Pakistan"], answer: 2 },
    { type: "echelle", text: "À quelle vitesse peut voler la balle (pelote) en pelote basque, l'un des sports les plus rapides au monde (à 20km/h près) ?", answer: 302, unit: "km/h", margin: 20 },
    { type: "qcm", text: "Quelle finale de Grand Chelem détient le record de la plus longue durée de l'histoire ?", options: ["Federer - Nadal 2008", "Djokovic - Nadal (Open d'Australie 2012)", "Isner - Mahut 2010", "Sampras - Agassi 2001"], answer: 1 },
    { type: "echelle", text: "Combien de clubs composent la Premier League anglaise ?", answer: 20, unit: "clubs", margin: 0 },
    { type: "qcm", text: "Quelle nation a remporté le plus de fois la Coupe Davis de tennis ?", options: ["France", "États-Unis", "Australie", "Espagne"], answer: 1 },
    { type: "echelle", text: "Combien de fois Lewis Hamilton a-t-il été champion du monde de Formule 1 ?", answer: 7, unit: "fois", margin: 0 },
    { type: "qcm", text: "Quelle est la durée d'un match officiel de handball ?", options: ["2 x 25 min", "2 x 30 min", "3 x 20 min", "4 x 12 min"], answer: 1 },
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
    { type: "qcm", text: "Quel film d'animation a rapporté le plus au box-office mondial (record actuel) ?", options: ["Ne Zha 2", "Zootopie 2", "Vice-Versa 2", "La Reine des Neiges 2"], answer: 0 },
    { type: "echelle", text: "Combien de films 'Harry Potter' compte la saga au cinéma ?", answer: 8, unit: "films" },
    { type: "qcm", text: "Quel acteur a joué Jack Sparrow dans Pirates des Caraïbes ?", options: ["Orlando Bloom", "Johnny Depp", "Geoffrey Rush", "Javier Bardem"], answer: 1 },
    { type: "vf", text: "'Breaking Bad' se déroule au Texas.", answer: false },
    { type: "qcm", text: "Quelle série met en scène des dragons et le trône de fer ?", options: ["The Witcher", "Vikings", "Game of Thrones", "The Last Kingdom"], answer: 2 },
    { type: "qcm", text: "Quel est le nom du réalisateur de la trilogie 'Le Seigneur des Anneaux' ?", options: ["Peter Jackson", "Ridley Scott", "James Cameron", "Guillermo del Toro"], answer: 0 },
    { type: "vf", text: "Le personnage de Dark Vador est le père de Luke Skywalker.", answer: true },
    { type: "echelle", text: "En quelle année est sorti le premier film Avengers ?", answer: 2012, unit: "" },
    { type: "qcm", text: "Quel film est connu pour la réplique 'Que la Force soit avec toi' ?", options: ["Star Trek", "Star Wars", "Dune", "Interstellar"], answer: 1 },
    { type: "qcm", text: "Dans quelle ville se déroule la série 'Friends' ?", options: ["Los Angeles", "New York", "Chicago", "Boston"], answer: 1 },
    { type: "echelle", text: "En quelle année est sorti le premier film 'Taxi' (avec Samy Naceri) ?", answer: 1998, unit: "" },
    { type: "qcm", text: "Quel acteur joue le rôle de Danny Zuko dans 'Grease' (1978) ?", options: ["John Travolta", "Kevin Bacon", "Patrick Swayze", "Richard Gere"], answer: 0 },
    { type: "qcm", text: "Dans quelle trilogie a été révélé l'acteur Zac Efron ?", options: ["Twilight", "High School Musical", "Hunger Games", "Divergente"], answer: 1 },
    { type: "echelle", text: "Quel âge avait Natalie Portman lors du tournage du film 'Léon' ?", answer: 13, unit: "ans", margin: 0 },
    { type: "qcm", text: "Quel film français a fait le plus d'entrées au cinéma en France de tous les temps ?", options: ["Intouchables", "Bienvenue chez les Ch'tis", "La Grande Vadrouille", "Astérix et Obélix : Mission Cléopâtre"], answer: 1 },
    { type: "qcm", text: "Quels étaient les prénoms des frères Lumière, inventeurs du cinématographe ?", options: ["Auguste et Louis", "Jean et Pierre", "Charles et Henri", "Marcel et Paul"], answer: 0 },
    { type: "qcm", text: "Comment se nomme le personnage de Jamel Debbouze dans 'Astérix et Obélix : Mission Cléopâtre' ?", options: ["Numérobis", "Amonbofis", "Otis", "Panoramix"], answer: 0 },
    { type: "echelle", text: "En quelle année est mort Chadwick Boseman, l'acteur de Black Panther ?", answer: 2020, unit: "" },
    { type: "echelle", text: "En quelle année est sorti le film 'Les Choristes' ?", answer: 2004, unit: "" },
    { type: "qcm", text: "Comment s'appelle le grand-père dans 'Les Simpson' ?", options: ["Abraham", "Herschel", "Clancy", "Mason"], answer: 0 },
    { type: "qcm", text: "Quel film a rapporté le plus au box-office mondial de tous les temps (hors inflation) ?", options: ["Avatar", "Avengers: Endgame", "Titanic", "Star Wars VII"], answer: 0 },
    { type: "qcm", text: "Qui a réalisé 'Jurassic Park' (1993) ?", options: ["George Lucas", "James Cameron", "Steven Spielberg", "Ridley Scott"], answer: 2 },
    { type: "qcm", text: "Quel est le film français le plus vu dans le monde (à l'international) ?", options: ["Amélie Poulain", "Bienvenue chez les Ch'tis", "Intouchables", "La Môme"], answer: 2 },
    { type: "echelle", text: "En quelle année est sorti le tout premier film Pixar, 'Toy Story' ?", answer: 1995, unit: "" },
    { type: "qcm", text: "Quel est le nom du vaisseau de Han Solo dans Star Wars ?", options: ["X-Wing", "Faucon Millenium", "TIE Fighter", "L'Étoile de la Mort"], answer: 1 },
    { type: "qcm", text: "Quel est le nom du Hobbit incarné par Elijah Wood dans 'Le Seigneur des Anneaux' ?", options: ["Bilbo", "Frodon", "Sam", "Pippin"], answer: 1 },
    { type: "qcm", text: "Dans 'Matrix', quelle pilule Neo choisit-il ?", options: ["Rouge", "Bleue", "Verte", "Blanche"], answer: 0 },
    { type: "qcm", text: "Quel film a popularisé la réplique 'Hasta la vista, baby' ?", options: ["Rambo", "Terminator 2", "Die Hard", "Predator"], answer: 1 },
    { type: "qcm", text: "Quel est le titre du tout premier film de la saga Alien (1979) ?", options: ["Alien : Le 8e passager", "Aliens, le retour", "Alien 3", "Alien Resurrection"], answer: 0 },
    { type: "echelle", text: "Combien a rapporté au box-office le film d'horreur 'Ça' (IT, 2017), le plus rentable du genre (en millions de $, à 100M près) ?", answer: 700, unit: "millions $", margin: 100 },
    { type: "qcm", text: "Dans Harry Potter, quelle maison a pour symbole un lion ?", options: ["Gryffondor", "Serpentard", "Poufsouffle", "Serdaigle"], answer: 0 },
    { type: "qcm", text: "Quel film a lancé la trilogie Batman de Christopher Nolan ?", options: ["The Dark Knight", "Batman Begins", "The Dark Knight Rises", "Batman Forever"], answer: 1 },
    { type: "echelle", text: "Combien de temps dure 'Le Seigneur des Anneaux : Le Retour du Roi' en version longue (à 15 min près) ?", answer: 250, unit: "min (4h10)", margin: 15 },
    { type: "echelle", text: "Combien de figurants le film 'Gandhi' a-t-il mobilisé (record du genre), à 20 000 près ?", answer: 300000, unit: "figurants", margin: 20000 },
    { type: "qcm", text: "Quel film détient le record de la bande-annonce la plus vue en 24h ?", options: ["Avengers: Endgame", "Avatar 2", "Spider-Man: No Way Home", "Star Wars IX"], answer: 2 },
    { type: "qcm", text: "Quelle série est la plus regardée de tous les temps sur Netflix dès sa première saison ?", options: ["Squid Game", "Stranger Things", "Wednesday", "La Casa de Papel"], answer: 0 },
    { type: "qcm", text: "Dans 'Friends', quel est le nom du café où se retrouvent les personnages ?", options: ["Central Coffee", "Central Perk", "Manhattan Café", "Big Apple Coffee"], answer: 1 },
    { type: "qcm", text: "Dans 'Stranger Things', comment s'appelle le monde parallèle ?", options: ["The Backworld", "The Underland", "The Upside Down", "The Shadow World"], answer: 2 },
    { type: "qcm", text: "Quelle série met en scène le personnage de Sheldon Cooper ?", options: ["Friends", "The IT Crowd", "The Big Bang Theory", "Silicon Valley"], answer: 2 },
    { type: "qcm", text: "Dans 'Friends', qui chante la chanson 'Smelly Cat' ?", options: ["Rachel", "Monica", "Phoebe", "Janice"], answer: 2 },
    { type: "qcm", text: "Dans 'La Casa de Papel', quel est le surnom du chef du groupe ?", options: ["Le Boss", "El Jefe", "El Profesor", "El Capitan"], answer: 2 },
    { type: "qcm", text: "Dans 'Vikings', qui est le héros principal ?", options: ["Ragnar Lothbrok", "Rollo", "Bjorn", "Lagertha"], answer: 0 },
    { type: "qcm", text: "Dans 'The Crown', quelle reine est au centre de l'intrigue ?", options: ["Victoria", "Élisabeth I", "Élisabeth II", "Marie Stuart"], answer: 2 },
    { type: "qcm", text: "Dans 'Peaky Blinders', qui est le chef du gang ?", options: ["Alfie Solomons", "Thomas Shelby", "Arthur Shelby", "Michael Gray"], answer: 1 },
    { type: "qcm", text: "Dans 'X-Files', comment s'appellent les deux agents principaux ?", options: ["Mulder et Scully", "Skinner et Doggett", "Smith et Wesson", "Locke et Boone"], answer: 0 },
    { type: "qcm", text: "Quelle série met en scène Joe Goldberg, obsédé par ses conquêtes amoureuses ?", options: ["You", "Elite", "Dark", "Sex Education"], answer: 0 },
    { type: "qcm", text: "Quelle série espagnole raconte la vie d'étudiants riches et leurs secrets ?", options: ["Elite", "La Casa de Papel", "Toy Boy", "Velvet"], answer: 0 },
    { type: "echelle", text: "Combien d'épisodes compte 'Les Feux de l'Amour', la série la plus longue de l'histoire (à 500 près) ?", answer: 14000, unit: "épisodes", margin: 500 },
    { type: "qcm", text: "Quelle série animée est la plus longue de l'histoire de la télévision américaine ?", options: ["South Park", "Les Simpson", "Family Guy", "Bob l'éponge"], answer: 1 },
    { type: "qcm", text: "Quelle série française détient le record de longévité (2004-2022) ?", options: ["Joséphine Ange Gardien", "Plus belle la vie", "Navarro", "Hélène et les garçons"], answer: 1 },
    { type: "qcm", text: "Dans 'Smallville', quel super-héros suit-on avant qu'il ne devienne célèbre ?", options: ["Spider-Man", "Batman", "Superman", "Flash"], answer: 2 },
    { type: "qcm", text: "Quelle série française raconte le quotidien d'agents d'artistes ?", options: ["Le Bureau des Légendes", "Engrenages", "Dix pour Cent", "Marseille"], answer: 2 },
    { type: "qcm", text: "Dans 'Friends', qui épouse Monica ?", options: ["Joey", "Chandler", "Ross", "Richard"], answer: 1 },
    { type: "qcm", text: "Quelle série française a cartonné à l'international en 2021 ?", options: ["Family Business", "Dix pour Cent", "Lupin", "Marseille"], answer: 2 },
    { type: "qcm", text: "Quelle série adaptée d'un jeu vidéo a cartonné sur HBO en 2023 ?", options: ["Assassin's Creed", "The Last of Us", "Fallout", "Halo"], answer: 1 },
    { type: "qcm", text: "Quelle série Netflix retrace l'histoire d'un tueur en série réel, Jeffrey Dahmer ?", options: ["Mindhunter", "Dahmer", "True Detective", "Bates Motel"], answer: 1 },
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
    { type: "echelle", text: "Quel est le record du plus grand nombre de buts inscrits par un joueur en un seul match officiel de foot ?", answer: 13, unit: "buts (Archie Thompson, 2001)", margin: 0 },
    { type: "echelle", text: "Quelle est la plus longue série de victoires consécutives en Formule 1 (Max Verstappen, 2023) ?", answer: 10, unit: "victoires", margin: 0 },
    { type: "echelle", text: "Quel est le record du monde de hot-dogs avalés en 10 minutes (Joey Chestnut, 2021) ?", answer: 76, unit: "hot-dogs", margin: 5 },
    { type: "qcm", text: "Le plus grand nombre de pizzas préparées en 12h par une seule personne est d'environ :", options: ["900", "5000", "8000", "32000"], answer: 1 },
    { type: "echelle", text: "Combien mesurait l'homme le plus grand jamais mesuré, Robert Wadlow (à 10cm près) ?", answer: 2.72, unit: "m", margin: 0.1 },
    { type: "echelle", text: "Quelle est la plus longue chevelure jamais mesurée (à 50cm près) ?", answer: 5.6, unit: "m", margin: 0.5 },
    { type: "echelle", text: "Quel est le record de durée sans dormir, établi par Randy Gardner en 1964 ?", answer: 11, unit: "jours", margin: 0 },
    { type: "echelle", text: "Quel était le poids de l'homme le plus lourd jamais enregistré, Jon Brower Minnoch (à 50kg près) ?", answer: 635, unit: "kg", margin: 50 },
    { type: "echelle", text: "Quelle est la durée du plus long film de l'histoire ('Logistics', Suède, 2012), à 5h près ?", answer: 85, unit: "heures", margin: 5 },
    { type: "echelle", text: "Combien de personnes ont participé au plus grand Harlem Shake jamais organisé (à 2000 près) ?", answer: 15000, unit: "personnes", margin: 2000 },
    { type: "echelle", text: "Quelle est l'altitude du sommet le plus haut de la Terre, l'Everest (à 50m près) ?", answer: 8849, unit: "m", margin: 50 },
    { type: "qcm", text: "Quel smartphone détient le record des ventes dans l'histoire (~220 millions d'exemplaires) ?", options: ["iPhone 6", "Nokia 3310", "iPhone X", "Samsung Galaxy S3"], answer: 0 },
    { type: "qcm", text: "Quelle application a dépassé le plus rapidement 100 millions d'utilisateurs (5 jours) ?", options: ["Instagram", "Threads", "ChatGPT", "TikTok"], answer: 1 },
    { type: "echelle", text: "Quelle est la vitesse record d'une voiture homologuée route (SSC Tuatara, 2020), à 20km/h près ?", answer: 500, unit: "km/h", margin: 20 },
    { type: "echelle", text: "Quelle est la vitesse maximale atteinte par un TGV français lors d'un record d'essai en 2007 (à 20km/h près) ?", answer: 515, unit: "km/h", margin: 20 },
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
    { type: "qcm", text: "Quel est le nom de la lampe magique où vit le Génie dans 'Aladdin' ?", options: ["Une théière", "Une lampe à huile", "Un vase", "Un chandelier"], answer: 1 },
    { type: "vf", text: "Le château emblématique du logo Disney est inspiré du château de Neuschwanstein en Allemagne.", answer: true },
    { type: "qcm", text: "Quel est le prénom de la mère porteuse de Bambi ?", options: ["Faline", "Aucun, elle meurt sans être nommée", "Fleur", "Douce"], answer: 1 },
    { type: "qcm", text: "Quel est le vrai prénom de Walt Disney, le fondateur ?", options: ["William", "Walter", "Wallace", "Warren"], answer: 1 },
    { type: "echelle", text: "Combien de parcs Disney existe-t-il dans le monde ?", answer: 6, unit: "parcs", margin: 0 },
    { type: "qcm", text: "Comment Pinocchio fait-il éternuer la baleine qui le retient prisonnier ?", options: ["Il lui chatouille la gorge", "Il fait un feu", "Il crie très fort", "Il la pique"], answer: 1 },
    { type: "qcm", text: "Comment s'appelle le dragon dans 'Mulan' ?", options: ["Mushu", "Shen", "Fa", "Ling"], answer: 0 },
    { type: "qcm", text: "Sur quel continent se déroule principalement 'Le Monde de Nemo' ?", options: ["Amérique du Sud", "Océanie", "Asie", "Afrique"], answer: 1 },
    { type: "qcm", text: "Quel acteur incarne Peter Pan (adulte) dans le film 'Hook' de 1991 ?", options: ["Robin Williams", "Tom Hanks", "Dustin Hoffman", "Bill Murray"], answer: 0 },
    { type: "qcm", text: "Dans 'Rox et Rouky', quels animaux sont les deux héros ?", options: ["Un chat et un chien", "Un renard et un chien", "Un loup et un renard", "Un chien et un lapin"], answer: 1 },
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
    { type: "qcm", text: "Avec le lait de quel animal confectionne-t-on l'authentique mozzarella (di bufala) ?", options: ["La vache", "La bufflonne", "La chèvre", "La brebis"], answer: 1 },
    { type: "echelle", text: "Combien de minutes faut-il en moyenne pour cuire un œuf à la coque ?", answer: 3, unit: "minutes", margin: 0 },
    { type: "qcm", text: "De quel pays le taramas est-il une spécialité ?", options: ["Turquie", "Grèce", "Liban", "Chypre"], answer: 1 },
    { type: "echelle", text: "En quelle année est mort le chef Paul Bocuse ?", answer: 2018, unit: "" },
    { type: "qcm", text: "Quel aromate principal constitue la sauce béarnaise ?", options: ["Le persil", "L'estragon", "Le basilic", "Le thym"], answer: 1 },
    { type: "qcm", text: "De quel pays est originaire le goulasch ?", options: ["Pologne", "Hongrie", "Roumanie", "Autriche"], answer: 1 },
    { type: "qcm", text: "Qu'est-ce qu'un fugu, plat traditionnel japonais ?", options: ["Un poisson (potentiellement mortel)", "Une algue", "Un champignon", "Un crustacé"], answer: 0 },
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
    { type: "qcm", text: "Le groupe de rap NTM est composé de Kool Shen et de quel autre artiste ?", options: ["Booba", "JoeyStarr", "Rohff", "Diam's"], answer: 1 },
    { type: "qcm", text: "Quel est l'instrument de prédilection de Phil Collins ?", options: ["Le piano", "La batterie", "La guitare", "La basse"], answer: 1 },
    { type: "echelle", text: "En quelle année est mort Johnny Hallyday ?", answer: 2017, unit: "" },
    { type: "qcm", text: "Quel artiste a été désigné comme le plus streamé au monde durant les années 2010 ?", options: ["Ed Sheeran", "Drake", "Justin Bieber", "The Weeknd"], answer: 1 },
    { type: "qcm", text: "Quel artiste est à l'origine du disque le plus vendu en France de tous les temps (l'album 'D'eux', 1995) ?", options: ["Céline Dion", "Mylène Farmer", "Johnny Hallyday", "Patricia Kaas"], answer: 0 },
    { type: "echelle", text: "Combien de millions d'exemplaires le single 'White Christmas' de Bing Crosby, le plus vendu de l'histoire, s'est-il écoulé (à 10M près) ?", answer: 50, unit: "millions", margin: 10 },
    { type: "echelle", text: "En quelle année est sorti 'Despacito', le tube de l'été qui a explosé YouTube ?", answer: 2017, unit: "" },
    { type: "qcm", text: "Quelle chanteuse a été la première artiste féminine à dépasser 1 milliard de vues YouTube avec un clip ('Roar') ?", options: ["Katy Perry", "Lady Gaga", "Shakira", "Adele"], answer: 0 },
    { type: "qcm", text: "Quel groupe est considéré comme le plus vendeur de disques de l'histoire ?", options: ["The Beatles", "Queen", "Rolling Stones", "U2"], answer: 0 },
    { type: "qcm", text: "Qui était le chanteur du groupe Nirvana ?", options: ["Kurt Cobain", "Eddie Vedder", "Dave Grohl", "Chris Cornell"], answer: 0 },
    { type: "qcm", text: "Quel rappeur est surnommé 'Slim Shady' ?", options: ["Jay-Z", "Eminem", "Dr Dre", "50 Cent"], answer: 1 },
    { type: "echelle", text: "En quelle année le rappeur Orelsan a-t-il sorti l'album 'Civilisation' ?", answer: 2021, unit: "" },
    { type: "qcm", text: "Quel rappeur est devenu milliardaire grâce à sa marque de baskets Yeezy ?", options: ["Travis Scott", "Kanye West", "Lil Wayne", "Jay-Z"], answer: 1 },
    { type: "qcm", text: "De quel pays vient le didgeridoo ?", options: ["Afrique du Sud", "Australie", "Brésil", "Inde"], answer: 1 },
    { type: "qcm", text: "Quel instrument est surnommé 'le roi des instruments' ?", options: ["Le piano", "L'orgue", "Le violon", "La harpe"], answer: 1 },
    { type: "qcm", text: "De quel instrument Louis Armstrong était-il un virtuose ?", options: ["Le piano", "Le saxophone", "La trompette", "La contrebasse"], answer: 2 },
    { type: "qcm", text: "Quel pays détient le plus de victoires à l'Eurovision ?", options: ["Suède", "Irlande", "Royaume-Uni", "France"], answer: 1 },
    { type: "qcm", text: "Qui a gagné la toute première saison de la Star Academy en France ?", options: ["Jenifer", "Nolwenn Leroy", "Élodie Frégé", "Grégory Lemarchal"], answer: 0 },
    { type: "qcm", text: "Qui chante 'Hips Don't Lie' ?", options: ["Rihanna", "Beyoncé", "Shakira", "Jennifer Lopez"], answer: 2 },
    { type: "qcm", text: "Quel instrument est le plus joué au monde ?", options: ["La guitare", "Le piano", "La flûte", "La batterie"], answer: 1 },
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
    { type: "qcm", text: "Dans quelle ville a ouvert le premier 'musée du pénis' au monde ?", options: ["Berlin", "Reykjavik", "Tokyo", "Paris"], answer: 1 },
    { type: "qcm", text: "Quel animal est réputé avoir l'orgasme le plus long du règne animal (jusqu'à 30 minutes) ?", options: ["Le dauphin", "Le cochon", "Le chien", "La chauve-souris"], answer: 1 },
    { type: "echelle", text: "Combien d'hommes une actrice aurait 'enchaînés' lors du plus grand gang bang recensé (Lisa Sparxxx, 2004) ?", answer: 919, unit: "" },
    { type: "echelle", text: "Quelle est, en centimètres, la plus grande taille de pénis jamais médiatisée (Jonah Falcon) ?", answer: 34, unit: "cm" },
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

/* ---------------------------------------------------------
   BLIND TEST — via iTunes Search API (extraits 30s, gratuit, sans clé)
--------------------------------------------------------- */
const BLIND_CATEGORIES = [
  { id: "annees80", label: "Années 80", emoji: "📻", terms: ["Michael Jackson", "Madonna", "Queen", "Daniel Balavoine", "Indochine", "Jean-Jacques Goldman", "Cyndi Lauper", "Eurythmics"] },
  { id: "annees2000blind", label: "Années 2000", emoji: "💿", terms: ["Britney Spears", "Black Eyed Peas", "Lorie", "Star Academy", "Shakira", "Beyoncé", "Linkin Park", "Christina Aguilera"] },
  { id: "karaoke", label: "Best Karaoké", emoji: "🎤", terms: ["Queen", "ABBA", "Celine Dion", "Jean-Jacques Goldman", "France Gall", "Whitney Houston", "Michel Sardou", "Johnny Hallyday"] },
  { id: "girlspower", label: "Girls Power", emoji: "💅", terms: ["Beyoncé", "Rihanna", "Spice Girls", "Dua Lipa", "Angèle", "Adele", "Lady Gaga", "Ariana Grande"] },
  { id: "duosgroupes", label: "Duos & Groupes", emoji: "🎶", terms: ["Daft Punk", "Fréro Delavega", "ABBA", "Simon & Garfunkel", "Bigflo et Oli", "Wejdene", "Kids United", "Fugees"] },
  { id: "rapfr", label: "Rap Français", emoji: "🎧", terms: ["Nekfeu", "PNL", "Jul", "Booba", "Orelsan", "Bigflo et Oli", "Ninho", "Damso"] },
  { id: "rnb", label: "RnB", emoji: "🎷", terms: ["Beyoncé", "Usher", "Alicia Keys", "Ne-Yo", "Aya Nakamura", "Chris Brown", "Rihanna", "The Weeknd"] },
  { id: "varfr", label: "Variété Française", emoji: "🇫🇷", terms: ["Charles Aznavour", "Francis Cabrel", "Patrick Bruel", "Vanessa Paradis", "Zaz", "Julien Doré", "Louane", "Christophe Maé"] },
];

// type: "solo_h" (homme seul), "solo_f" (femme seule), "groupe" (duo/groupe)
const ARTIST_META = {
  "Michael Jackson": { type: "solo_h", origin: "États-Unis", trivia: [{ text: "Michael Jackson a commencé sa carrière au sein de quel groupe familial ?", options: ["Les Jackson 5", "Les Osmonds", "Les Isley Brothers", "The Commodores"], answer: 0 }] },
  "Madonna": { type: "solo_f", origin: "États-Unis", trivia: [{ text: "Avant de percer dans la musique, Madonna a d'abord été danseuse à :", options: ["Los Angeles", "New York", "Chicago", "Miami"], answer: 1 }] },
  "Queen": { type: "groupe", origin: "Royaume-Uni", trivia: [{ text: "Avant de former Queen, le chanteur Freddie Mercury étudiait :", options: ["Le design graphique", "La médecine", "Le droit", "La musicologie"], answer: 0 }] },
  "Daniel Balavoine": { type: "solo_h", origin: "France" },
  "Indochine": { type: "groupe", origin: "France", trivia: [{ text: "Le groupe Indochine a été fondé au début de quelle décennie ?", options: ["Les années 70", "Les années 80", "Les années 90", "Les années 2000"], answer: 1 }] },
  "Jean-Jacques Goldman": { type: "solo_h", origin: "France" },
  "Cyndi Lauper": { type: "solo_f", origin: "États-Unis" },
  "Eurythmics": { type: "groupe", origin: "Royaume-Uni" },
  "Britney Spears": { type: "solo_f", origin: "États-Unis", trivia: [{ text: "Avant sa carrière musicale, Britney Spears est passée par :", options: ["Le Mickey Mouse Club", "Une école de danse classique", "Un télé-crochet", "Broadway"], answer: 0 }] },
  "Black Eyed Peas": { type: "groupe", origin: "États-Unis" },
  "Lorie": { type: "solo_f", origin: "France" },
  "Star Academy": { type: "groupe", origin: "France" },
  "Shakira": { type: "solo_f", origin: "Colombie", trivia: [{ text: "Shakira est originaire de quelle ville colombienne ?", options: ["Bogotá", "Medellín", "Barranquilla", "Cali"], answer: 2 }] },
  "Beyoncé": { type: "solo_f", origin: "États-Unis", trivia: [{ text: "Beyoncé a commencé sa carrière au sein de quel girls band ?", options: ["Destiny's Child", "TLC", "Spice Girls", "En Vogue"], answer: 0 }] },
  "Linkin Park": { type: "groupe", origin: "États-Unis" },
  "Christina Aguilera": { type: "solo_f", origin: "États-Unis" },
  "Celine Dion": { type: "solo_f", origin: "Canada", trivia: [{ text: "Céline Dion est originaire de quelle province canadienne ?", options: ["L'Ontario", "Le Québec", "L'Alberta", "La Colombie-Britannique"], answer: 1 }] },
  "France Gall": { type: "solo_f", origin: "France" },
  "Whitney Houston": { type: "solo_f", origin: "États-Unis" },
  "Michel Sardou": { type: "solo_h", origin: "France" },
  "Johnny Hallyday": { type: "solo_h", origin: "France", trivia: [{ text: "Johnny Hallyday est considéré comme la star du :", options: ["Rock français", "Jazz manouche", "Rap français", "Reggae français"], answer: 0 }] },
  "ABBA": { type: "groupe", origin: "Suède", trivia: [{ text: "Le nom du groupe ABBA vient de :", options: ["Un lieu suédois", "Les initiales des 4 membres", "Un mot religieux", "Une marque de disques"], answer: 1 }] },
  "Rihanna": { type: "solo_f", origin: "Barbade", trivia: [{ text: "Rihanna est originaire de quelle île des Caraïbes ?", options: ["Jamaïque", "Barbade", "Trinité-et-Tobago", "Cuba"], answer: 1 }] },
  "Spice Girls": { type: "groupe", origin: "Royaume-Uni" },
  "Dua Lipa": { type: "solo_f", origin: "Royaume-Uni", trivia: [{ text: "La famille de Dua Lipa est originaire de quel pays ?", options: ["Albanie / Kosovo", "Italie", "Grèce", "Turquie"], answer: 0 }] },
  "Angèle": { type: "solo_f", origin: "Belgique" },
  "Adele": { type: "solo_f", origin: "Royaume-Uni", trivia: [{ text: "Adele a grandi dans quel quartier de Londres ?", options: ["Tottenham", "Chelsea", "Camden", "Brixton"], answer: 0 }] },
  "Lady Gaga": { type: "solo_f", origin: "États-Unis", trivia: [{ text: "Avant de choisir 'Lady Gaga', quel était le vrai prénom de la chanteuse ?", options: ["Stefani", "Nicole", "Ashley", "Katherine"], answer: 0 }] },
  "Ariana Grande": { type: "solo_f", origin: "États-Unis", trivia: [{ text: "Avant la musique, Ariana Grande était surtout connue comme :", options: ["Actrice dans une série Nickelodeon", "Danseuse professionnelle", "Actrice de cinéma", "Mannequin"], answer: 0 }] },
  "Daft Punk": { type: "groupe", origin: "France", trivia: [{ text: "Les deux membres de Daft Punk se sont rencontrés :", options: ["Au lycée à Paris", "En studio à Los Angeles", "Sur Internet", "Dans un club de jazz"], answer: 0 }] },
  "Fréro Delavega": { type: "groupe", origin: "France" },
  "Simon & Garfunkel": { type: "groupe", origin: "États-Unis" },
  "Bigflo et Oli": { type: "groupe", origin: "France", trivia: [{ text: "Bigflo et Oli sont originaires de quelle ville française ?", options: ["Toulouse", "Marseille", "Lyon", "Bordeaux"], answer: 0 }] },
  "Wejdene": { type: "solo_f", origin: "France" },
  "Kids United": { type: "groupe", origin: "France" },
  "Fugees": { type: "groupe", origin: "États-Unis" },
  "Nekfeu": { type: "solo_h", origin: "France" },
  "PNL": { type: "groupe", origin: "France", trivia: [{ text: "PNL est un groupe composé de :", options: ["Deux frères", "Deux cousins", "Deux amis d'enfance sans lien familial", "Un trio"], answer: 0 }] },
  "Jul": { type: "solo_h", origin: "France", trivia: [{ text: "Jul est originaire de quelle ville ?", options: ["Marseille", "Paris", "Lyon", "Nice"], answer: 0 }] },
  "Booba": { type: "solo_h", origin: "France" },
  "Orelsan": { type: "solo_h", origin: "France", trivia: [{ text: "Orelsan est originaire de quelle ville normande ?", options: ["Caen", "Rouen", "Le Havre", "Cherbourg"], answer: 0 }] },
  "Ninho": { type: "solo_h", origin: "France" },
  "Damso": { type: "solo_h", origin: "Belgique", trivia: [{ text: "Damso est né dans quel pays avant de s'installer en Belgique ?", options: ["République démocratique du Congo", "Rwanda", "Sénégal", "Côte d'Ivoire"], answer: 0 }] },
  "Usher": { type: "solo_h", origin: "États-Unis" },
  "Alicia Keys": { type: "solo_f", origin: "États-Unis", trivia: [{ text: "Alicia Keys a étudié quel instrument dès son plus jeune âge ?", options: ["Le piano classique", "La guitare", "Le violon", "La batterie"], answer: 0 }] },
  "Ne-Yo": { type: "solo_h", origin: "États-Unis" },
  "Aya Nakamura": { type: "solo_f", origin: "France", trivia: [{ text: "Aya Nakamura est née dans quel pays avant de grandir en France ?", options: ["Mali", "Sénégal", "Côte d'Ivoire", "Guinée"], answer: 0 }] },
  "Chris Brown": { type: "solo_h", origin: "États-Unis" },
  "The Weeknd": { type: "solo_h", origin: "Canada", trivia: [{ text: "The Weeknd est d'origine :", options: ["Éthiopienne", "Somalienne", "Érythréenne", "Kenyane"], answer: 0 }] },
  "Charles Aznavour": { type: "solo_h", origin: "France", trivia: [{ text: "Charles Aznavour est d'origine :", options: ["Arménienne", "Grecque", "Turque", "Libanaise"], answer: 0 }] },
  "Francis Cabrel": { type: "solo_h", origin: "France" },
  "Patrick Bruel": { type: "solo_h", origin: "France", trivia: [{ text: "Patrick Bruel est né dans quel pays ?", options: ["Algérie", "Maroc", "Tunisie", "France"], answer: 0 }] },
  "Vanessa Paradis": { type: "solo_f", origin: "France" },
  "Zaz": { type: "solo_f", origin: "France" },
  "Julien Doré": { type: "solo_h", origin: "France" },
  "Louane": { type: "solo_f", origin: "France", trivia: [{ text: "Louane s'est d'abord fait connaître grâce à :", options: ["The Voice", "Nouvelle Star", "Un télé-crochet anglais", "Un film uniquement"], answer: 0 }] },
  "Christophe Maé": { type: "solo_h", origin: "France" },

};

async function itunesSearchTracks(term) {
  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&entity=song&limit=15&country=FR`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).filter((r) => r.previewUrl);
  } catch {
    return [];
  }
}

async function pickBlindTracks(categoryIds, count) {
  const cats = BLIND_CATEGORIES.filter((c) => categoryIds.includes(c.id));
  const allTerms = cats.flatMap((c) => c.terms);
  const shuffledTerms = [...allTerms].sort(() => Math.random() - 0.5).slice(0, Math.max(6, Math.ceil(count / 1.5)));
  const results = await Promise.all(shuffledTerms.map((t) => itunesSearchTracks(t)));
  const pool = [];
  const seen = new Set();
  results.flat().forEach((r) => {
    if (!seen.has(r.trackId)) { seen.add(r.trackId); pool.push(r); }
  });
  for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
  return pool.slice(0, count).map((r) => {
    const meta = ARTIST_META[r.artistName] || null;
    let releaseYear = null;
    if (r.releaseDate) { const y = new Date(r.releaseDate).getFullYear(); if (!Number.isNaN(y)) releaseYear = y; }
    return {
      trackName: r.trackName,
      artistName: r.artistName,
      previewUrl: r.previewUrl,
      artworkUrl: (r.artworkUrl100 || "").replace("100x100", "300x300"),
      artistType: meta?.type || null,
      artistOrigin: meta?.origin || null,
      releaseYear,
      trivia: meta?.trivia || null,
    };
  });
}

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
function withRankChange(sortedPlayers, prevRankRef) {
  const prevMap = prevRankRef.current || {};
  const result = sortedPlayers.map((p, i) => {
    const newRank = i + 1;
    const prevRank = prevMap[p.id];
    const change = prevRank === undefined ? null : prevRank - newRank;
    return { ...p, rankChange: change };
  });
  const newMap = {};
  sortedPlayers.forEach((p, i) => { newMap[p.id] = i + 1; });
  prevRankRef.current = newMap;
  return result;
}
function RankBadge({ change }) {
  if (change === null || change === undefined) return null;
  if (change > 0) return <span style={{ color: C.teal, fontSize: 12, fontWeight: 700 }}>▲{change}</span>;
  if (change < 0) return <span style={{ color: C.pink, fontSize: 12, fontWeight: 700 }}>▼{Math.abs(change)}</span>;
  return <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 700 }}>=</span>;
}
function uid() { return Math.random().toString(36).slice(2, 10); }
function buildJoinUrl(code) {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}${window.location.pathname}?code=${code}`;
}
function qrCodeSrc(url) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&data=${encodeURIComponent(url)}`;
}

/* ---------------------------------------------------------
   JOKERS
--------------------------------------------------------- */
const JOKERS = [
  { id: "5050", label: "50/50", icon: Percent, emoji: "✂️", desc: "Retire 2 mauvaises réponses (QCM uniquement).", targeted: false },
  { id: "x2", label: "x2", icon: Zap, emoji: "⚡", desc: "Double tes points si tu réponds juste à cette question.", targeted: false },
  { id: "steal", label: "Vol de points", icon: Swords, emoji: "🗡️", desc: "Si tu réponds juste, vole 30 points à l'adversaire de ton choix.", targeted: true },
  { id: "block", label: "Blocage", icon: Shield, emoji: "🛡️", desc: "Si tu réponds juste, l'adversaire ciblé ne marque aucun point sur cette question.", targeted: true },
  { id: "speedchrono", label: "Speed Chrono", icon: Clock, emoji: "⏱️", desc: "Divise par deux le temps restant d'un adversaire pour répondre à cette question.", targeted: true },
  { id: "copieur", label: "Copieur", icon: Copy, emoji: "📋", desc: "Espionne la réponse déjà validée d'un adversaire avant de donner la tienne (s'il n'a pas encore répondu, tu ne verras rien).", targeted: true },
  { id: "sondage", label: "Sondage", icon: BarChart3, emoji: "📊", desc: "Affiche en direct le pourcentage de joueurs ayant choisi chaque réponse (QCM uniquement).", targeted: false },
  { id: "voleurtemps", label: "Voleur du Temps", icon: Hourglass, emoji: "⌛", desc: "Vole 3 secondes à TOUS les autres joueurs sur cette question — le temps volé t'est intégralement reversé.", targeted: false },
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
    <div className="flex items-center justify-center mb-6 select-none">
      <h1
        style={{
          fontFamily: "'Lilita One', system-ui, sans-serif",
          fontSize: 56,
          letterSpacing: 1,
          lineHeight: 1,
          color: C.gold,
          textShadow: `3px 3px 0 ${C.pink}, -1px -1px 0 ${C.violet}, 0 0 22px rgba(255,201,60,0.35)`,
        }}
      >
        Quizi
      </h1>
    </div>
  );
}
function ScreenHeader({ title, onBack, color = C.gold }) {
  const { t: tr } = useLang();
  return (
    <div className="mb-6">
      {onBack && (<div className="mb-3"><GhostButton onClick={onBack} small>{tr("back")}</GhostButton></div>)}
      <h2 className="text-center" style={{ fontFamily: F.display, fontSize: 24, color }}>{title}</h2>
    </div>
  );
}
function SettingSection({ number, title, color, children, onInfoClick }) {
  return (
    <div className="rounded-2xl p-4 mb-4" style={{ background: "rgba(255,255,255,0.04)", borderTop: "1px solid rgba(255,255,255,0.08)", borderRight: "1px solid rgba(255,255,255,0.08)", borderBottom: "1px solid rgba(255,255,255,0.08)", borderLeft: `4px solid ${color}` }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 24, height: 24, background: color, color: "#1B1030", fontFamily: F.display, fontSize: 13, fontWeight: 800 }}>{number}</div>
        <p className="flex-1" style={{ fontFamily: F.display, fontSize: 19, color, textTransform: "uppercase", letterSpacing: 0.5 }}>{title}</p>
        {onInfoClick && (
          <button onClick={onInfoClick} className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: 24, height: 24, background: "rgba(255,255,255,0.1)" }}>
            <Info size={14} color={color} />
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
function JokerInfoModal({ onClose }) {
  const { lang, t: tr } = useLang();
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="rounded-t-3xl p-5" style={{ background: C.bg2, width: "100%", maxWidth: 480, maxHeight: "80vh", overflowY: "auto" }}>
        <div className="flex items-center justify-between mb-4">
          <p style={{ fontFamily: F.display, fontSize: 20, color: C.gold }}>{tr("jokersEnabledLabel")}</p>
          <button onClick={onClose} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><X size={18} color={C.cream} /></button>
        </div>
        <div className="flex flex-col gap-3 pb-4">
          {JOKERS.map((j) => {
            const Icon = j.icon;
            return (
              <div key={j.id} className="rounded-2xl p-3 flex items-center gap-3" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: 40, height: 40, background: "rgba(255,255,255,0.1)" }}>
                  <Icon size={20} color={C.gold} />
                </div>
                <div>
                  <p style={{ fontFamily: F.display, fontSize: 16, color: C.gold }}>{jokerLabel(j, lang)}</p>
                  <p className="text-xs opacity-80">{jokerDesc(j, lang)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
function BigButton({ children, onClick, color = C.pink, disabled, icon: Icon }) {
  const textColor = (color === C.violet || color === C.orange) ? C.cream : "#1B1030";
  return (
    <button onClick={onClick} disabled={disabled} className="w-full rounded-2xl py-4 px-6 flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-40" style={{ background: color, fontFamily: F.display, fontSize: 20, color: textColor, boxShadow: `0 6px 0 rgba(0,0,0,0.25)` }}>
      {Icon && <Icon size={20} />}
      {children}
    </button>
  );
}
function EmojiIcon({ children, size = 20 }) {
  return (
    <span style={{ fontSize: size, textShadow: "-1.5px -1.5px 0 #fff, 1.5px -1.5px 0 #fff, -1.5px 1.5px 0 #fff, 1.5px 1.5px 0 #fff, 0 -1.5px 0 #fff, 0 1.5px 0 #fff, -1.5px 0 0 #fff, 1.5px 0 0 #fff" }}>
      {children}
    </span>
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
    <button onClick={onClick} disabled={disabled} className="rounded-full px-4 py-2 text-sm font-bold transition-all disabled:opacity-30 text-left whitespace-nowrap overflow-hidden text-ellipsis" style={{ fontFamily: F.body, background: active ? C.gold : "rgba(255,255,255,0.08)", color: active ? "#1B1030" : C.cream, border: `2px solid ${active ? C.gold : "rgba(255,255,255,0.2)"}` }}>
      {children}
    </button>
  );
}

function CategoryPicker({ cats, setCats, kidsMode, setKidsMode, hideTitle }) {
  const { lang, t: tr } = useLang();
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
      <div className={`flex items-center mb-2 ${hideTitle ? "justify-end" : "justify-between"}`}>
        {!hideTitle && <p className="text-sm opacity-70 font-bold">{tr("categoriesLabel")}</p>}
        <GhostButton onClick={toggleAll} small>{allSelected ? tr("uncheckAll") : tr("checkAll")}</GhostButton>
      </div>
      {setKidsMode && (
        <div className="mb-3">
          <Chip active={kidsMode} onClick={toggleKids}>{tr("kidsMode")}</Chip>
        </div>
      )}
      <div className="grid grid-cols-2 gap-2 mb-6">{options.map((c) => (<Chip key={c.id} active={cats.includes(c.id)} onClick={() => toggleCat(c.id)}>{c.emoji} {kidsMode ? kidsCategoryLabel(c, lang) : categoryLabel(c, lang)}</Chip>))}</div>
    </>
  );
}

/* ---------------------------------------------------------
   HOME
--------------------------------------------------------- */
function Home({ onCreate, onJoin, onSolo, onMatchAmor, onBlindTest, onEnchere }) {
  const { lang, t: tr, setLang } = useLang();
  return (
    <Stage>
      <div className="text-center mb-5 select-none" style={{ paddingTop: 4 }}>
        <h1
          style={{
            fontFamily: "'Lilita One', system-ui, sans-serif",
            fontSize: 76,
            letterSpacing: 1,
            color: C.gold,
            lineHeight: 1,
            textShadow: `4px 4px 0 ${C.pink}, -1px -1px 0 ${C.violet}, 0 0 26px rgba(255,201,60,0.35)`,
          }}
        >
          Quizi
        </h1>
      </div>
      <LangSwitch lang={lang} setLang={setLang} />
      <p className="text-center opacity-80 mb-8" style={{ fontSize: 15 }}>
        {tr("appTagline")}
      </p>
      <div className="flex flex-col gap-4">
        <BigButton onClick={onCreate} color={C.gold} icon={Crown}>{tr("createGame")}</BigButton>
        <BigButton onClick={onJoin} color={C.teal} icon={Users}>{tr("joinGame")}</BigButton>
        <BigButton onClick={onBlindTest} color={C.violet} icon={Headphones}>{tr("blindTestBtn")}</BigButton>
        <BigButton onClick={onEnchere} color={C.orange} icon={Coins}>{tr("enchereBtn")}</BigButton>
        <BigButton onClick={onMatchAmor} color={C.pink} icon={Skull}>{tr("matchAmorBtn")}</BigButton>
        <BigButton onClick={onSolo} color={C.mint} icon={User}>{tr("soloBtn")}</BigButton>
      </div>
    </Stage>
  );
}

/* ---------------------------------------------------------
   SOLO
--------------------------------------------------------- */
function SoloHome({ onBack, onNormal, onCrash }) {
  const { t: tr } = useLang();
  return (
    <Stage>
      <ScreenHeader title={tr("soloBtn")} onBack={onBack} color={C.violet} />
      <p className="text-sm opacity-70 mb-6 text-center">{tr("soloIntro")}</p>
      <div className="flex flex-col gap-4">
        <BigButton onClick={onNormal} color={C.teal}>{tr("classicTestMode")}</BigButton>
        <BigButton onClick={onCrash} color={C.pink} icon={Skull}>{tr("crashTestMode")}</BigButton>
      </div>
      <p className="text-xs opacity-50 mt-4 text-center">{tr("crashHint")}</p>
    </Stage>
  );
}

function SoloProfile({ onBack, onNext }) {
  const { t: tr } = useLang();
  const [animal, setAnimal] = useState(null);
  const [pseudo, setPseudo] = useState("");
  const [error, setError] = useState("");
  return (
    <Stage>
      <ScreenHeader title={tr("yourAvatarTitle")} onBack={onBack} color={C.violet} />
      <AvatarPicker animal={animal} onPick={setAnimal} taken={[]} />
      <div className="flex gap-2 mb-2 mt-4">
        <input value={pseudo} onChange={(e) => setPseudo(e.target.value)} placeholder={tr("pseudoPlaceholder")} className="flex-1 rounded-xl px-4 py-2" style={{ background: "rgba(255,255,255,0.08)", color: C.cream, border: `2px solid rgba(255,255,255,0.15)` }} />
        <button onClick={() => setPseudo(funPseudo(pseudo))} className="rounded-xl px-3" style={{ background: C.gold }}><Sparkles size={18} color="#1B1030" /></button>
      </div>
      <p className="text-xs opacity-60 mb-4">{tr("pseudoGenHint")}</p>
      {error && <p className="text-sm mb-3 text-center" style={{ color: C.pink }}>{error}</p>}
      <BigButton onClick={() => { if (!animal) return setError(tr("errChooseAnimal")); if (!pseudo.trim()) return setError(tr("errChoosePseudo")); onNext({ animal, pseudo: pseudo.trim() }); }} color={C.violet}>{tr("continueBtn")}</BigButton>
    </Stage>
  );
}

function SoloSetup({ onBack, onStart, crash }) {
  const { t: tr } = useLang();
  const [cats, setCats] = useState(["animaux", "geo", "films"]);
  const [nb, setNb] = useState(10);
  const [seconds, setSeconds] = useState(20);
  const [kidsMode, setKidsMode] = useState(false);
  return (
    <Stage wide>
      <ScreenHeader title={crash ? tr("crashSettingsTitle") : tr("soloSettingsTitle")} onBack={onBack} color={crash ? C.pink : C.teal} />
      <CategoryPicker cats={cats} setCats={setCats} kidsMode={kidsMode} setKidsMode={setKidsMode} />
      {!crash && (
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm opacity-70 mb-2 font-bold">{tr("nbQuestionsLabel")}</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setNb((n) => Math.max(5, n - 1))} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Minus size={16} /></button>
              <span style={{ fontFamily: F.mono, fontSize: 22 }}>{nb}</span>
              <button onClick={() => setNb((n) => Math.min(30, n + 1))} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Plus size={16} /></button>
            </div>
          </div>
          <div>
            <p className="text-sm opacity-70 mb-2 font-bold">{tr("secondsPerQuestionLabel")}</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setSeconds((n) => Math.max(10, n - 5))} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Minus size={16} /></button>
              <span style={{ fontFamily: F.mono, fontSize: 22 }}>{seconds}s</span>
              <button onClick={() => setSeconds((n) => Math.min(60, n + 5))} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Plus size={16} /></button>
            </div>
          </div>
        </div>
      )}
      <BigButton onClick={() => onStart({ cats: cats.length ? cats : (kidsMode ? KIDS_CATEGORIES : CATEGORIES).map((c) => c.id), nb, seconds, kidsMode })} color={crash ? C.pink : C.teal} icon={Play}>{crash ? tr("launchCrashBtn") : tr("startBtn")}</BigButton>
    </Stage>
  );
}

function QuestionInput({ q, onSubmit, scaleVal, setScaleVal, hiddenOptions }) {
  const { t: tr } = useLang();
  if (q.type === "qcm") return (
    <div className="grid grid-cols-1 gap-3">
      {q.options.map((o, i) => (hiddenOptions || []).includes(i) ? null : (<button key={i} onClick={() => onSubmit(i)} className="rounded-xl py-3 px-4 text-left" style={{ background: "rgba(255,255,255,0.08)", fontFamily: F.body, fontWeight: 700, color: C.cream, fontSize: 17 }}>{o}</button>))}
    </div>
  );
  if (q.type === "vf") return (
    <div className="flex gap-3">
      <button onClick={() => onSubmit(true)} className="flex-1 rounded-xl py-4" style={{ background: C.teal, color: "#1B1030", fontFamily: F.display, fontSize: 18 }}>{tr("trueLabel")}</button>
      <button onClick={() => onSubmit(false)} className="flex-1 rounded-xl py-4" style={{ background: C.pink, color: "#1B1030", fontFamily: F.display, fontSize: 18 }}>{tr("falseLabel")}</button>
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
          onFocus={() => { if (scaleVal === 0) setScaleVal(""); }}
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
  const { lang, t: tr } = useLang();
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
        <p style={{ fontFamily: F.display, fontSize: 24, color: C.gold }}>{tr("finishedTitle")}</p>
        <p className="mt-2 opacity-80">{tr("scoreOnTotal").replace("{score}", score).replace("{total}", questions.length * 100)}</p>
        <div className="mt-6"><BigButton onClick={onExit} color={C.violet}>{tr("backToHome")}</BigButton></div>
      </div>
    </Stage>
  );

  return (
    <Stage>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs opacity-60 flex items-center gap-1">{profile?.animal} {profile?.pseudo}</span>
        <span className="text-xs opacity-60">Q{idx + 1}/{questions.length}</span>
        <span style={{ fontFamily: F.mono, fontSize: 18, color: C.teal }}>{tr("scoreLabel")} : {score}</span>
        <span style={{ fontFamily: F.mono, fontSize: 18, color: left <= 5 ? C.pink : C.gold }}>{left}s</span>
      </div>
      <div className="rounded-2xl p-5 mb-5" style={{ background: "rgba(255,255,255,0.06)" }}>
        <p className="uppercase tracking-widest mb-2" style={{ fontSize: 16, fontWeight: 800, color: C.gold }}>{findCategory(q.category)?.emoji} {(() => { const c = findCategory(q.category); return c ? (c.id.startsWith("k_") ? kidsCategoryLabel(c, lang) : categoryLabel(c, lang)) : ""; })()}</p>
        <p style={{ fontFamily: F.display, fontSize: 26 }}>{q.text}</p>
      </div>
      {!answered ? (
        <QuestionInput q={q} onSubmit={checkAnswer} scaleVal={scaleVal} setScaleVal={setScaleVal} />
      ) : (
        <div className="text-center">
          <p style={{ fontFamily: F.display, fontSize: 22, color: wasCorrect ? C.teal : C.pink }}>{wasCorrect ? tr("correctAnswerMsg") : tr("wrongAnswerMsg")}</p>
          <p className="text-sm opacity-70 mt-1">
            {tr("answerColonLabel")} {q.type === "qcm" ? q.options[q.answer] : q.type === "vf" ? (q.answer ? tr("trueLabel") : tr("falseLabel")) : q.type === "carte" ? MAP_ZONES.find((z) => z.id === q.answer)?.label : `${q.answer} ${q.unit || ""}`}
          </p>
          <div className="mt-4"><BigButton onClick={() => { setAnswered(false); setScaleVal(0); setStartedAt(Date.now()); setIdx((i) => i + 1); }} color={C.gold} icon={ArrowRight}>{tr("nextBtn")}</BigButton></div>
        </div>
      )}
    </Stage>
  );
}

function CrashTest({ config, profile, onExit }) {
  const { lang, t: tr } = useLang();
  const [pool] = useState(() => pickQuestions(config.cats, 500, config.kidsMode ? KIDS_QB : QB));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [answered, setAnswered] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [scaleVal, setScaleVal] = useState(0);
  const [used5050, setUsed5050] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState([]);
  const q = pool[idx % pool.length];

  function use5050() {
    if (used5050 || q.type !== "qcm") return;
    setUsed5050(true);
    const wrongIdx = q.options.map((_, i) => i).filter((i) => i !== q.answer);
    setHiddenOptions(wrongIdx.sort(() => Math.random() - 0.5).slice(0, 2));
  }

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
        <span style={{ fontFamily: F.mono, fontSize: 18, color: C.teal }}>{tr("scoreLabel")} : {score}</span>
        <span className="flex gap-1">{[0, 1, 2].map((i) => (<Heart key={i} size={18} fill={i < lives ? C.pink : "transparent"} color={C.pink} />))}</span>
      </div>
      {dead ? (
        <div className="text-center mt-8">
          <Skull size={48} className="mx-auto mb-3" color={C.pink} />
          <p style={{ fontFamily: F.display, fontSize: 24, color: C.gold }}>{tr("crashFinishedTitle")}</p>
          <p className="mt-2 opacity-80">{tr("finalScoreSeen").replace("{score}", score).replace("{n}", idx)}</p>
          <div className="mt-6"><BigButton onClick={onExit} color={C.violet}>{tr("backToHome")}</BigButton></div>
        </div>
      ) : (
        <>
          <div className="rounded-2xl p-5 mb-5" style={{ background: "rgba(255,255,255,0.06)" }}><p className="uppercase tracking-widest mb-2" style={{ fontSize: 16, fontWeight: 800, color: C.gold }}>{findCategory(q.category)?.emoji} {(() => { const c = findCategory(q.category); return c ? (c.id.startsWith("k_") ? kidsCategoryLabel(c, lang) : categoryLabel(c, lang)) : ""; })()}</p><p style={{ fontFamily: F.display, fontSize: 26 }}>{q.text}</p></div>
          {!answered ? (
            <>
              <QuestionInput q={q} onSubmit={checkAnswer} scaleVal={scaleVal} setScaleVal={setScaleVal} hiddenOptions={hiddenOptions} />
              {q.type === "qcm" && !used5050 && (
                <button onClick={use5050} className="mt-3 rounded-xl px-4 py-2 flex items-center gap-2 mx-auto" style={{ background: "rgba(255,255,255,0.08)", border: "2px solid rgba(255,255,255,0.15)" }}>
                  <Percent size={16} color={C.gold} />
                  <span style={{ fontFamily: F.display, fontSize: 14, color: C.gold }}>50/50</span>
                </button>
              )}
            </>
          ) : (
            <div className="text-center">
              <p style={{ fontFamily: F.display, fontSize: 22, color: wasCorrect ? C.teal : C.pink }}>{wasCorrect ? tr("correctAnswerMsg") : tr("wrongAnswerCrashMsg")}</p>
              <p className="text-sm opacity-70 mt-1">
                {tr("answerColonLabel")} {q.type === "qcm" ? q.options[q.answer] : q.type === "vf" ? (q.answer ? tr("trueLabel") : tr("falseLabel")) : q.type === "carte" ? MAP_ZONES.find((z) => z.id === q.answer)?.label : `${q.answer} ${q.unit || ""}`}
              </p>
              <div className="mt-4"><BigButton onClick={() => { setAnswered(false); setScaleVal(0); setHiddenOptions([]); setIdx((i) => i + 1); }} color={C.gold} icon={ArrowRight}>{tr("nextBtn")}</BigButton></div>
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
  const { lang, t: tr } = useLang();
  const [cats, setCats] = useState(["animaux", "geo", "films"]);
  const [nbQuestions, setNbQuestions] = useState(10);
  const [jokers, setJokers] = useState({ "5050": true, x2: true, steal: true, block: true, speedchrono: true });
  const [seconds, setSeconds] = useState(20);
  const [teamsMode, setTeamsMode] = useState(1);
  const [malus, setMalus] = useState(0);
  const [jokerRandom, setJokerRandom] = useState(false);
  const [jokerRandomCount, setJokerRandomCount] = useState(5);
  const [kidsMode, setKidsMode] = useState(false);
  const [hostPlays, setHostPlays] = useState(false);
  const [hostAnimal, setHostAnimal] = useState(null);
  const [hostPseudo, setHostPseudo] = useState("");
  const [showJokerInfo, setShowJokerInfo] = useState(false);
  function toggleJoker(j) { setJokers((s) => ({ ...s, [j]: !s[j] })); }

  async function create() {
    const bank = kidsMode ? KIDS_QB : QB;
    const catOptions = kidsMode ? KIDS_CATEGORIES : CATEGORIES;
    // Mix automatique des types de questions, légèrement pondéré en faveur des QCM
    const fullPool = pickQuestions(cats.length ? cats : catOptions.map((c) => c.id), 800, bank);
    const byType = { qcm: fullPool.filter((q) => q.type === "qcm"), vf: fullPool.filter((q) => q.type === "vf"), echelle: fullPool.filter((q) => q.type === "echelle") };
    const targetQcm = Math.ceil(nbQuestions * 0.45);
    const targetVf = Math.ceil(nbQuestions * 0.3);
    const targetEchelle = nbQuestions - targetQcm - targetVf;
    let mixed = [...byType.qcm.slice(0, targetQcm), ...byType.vf.slice(0, targetVf), ...byType.echelle.slice(0, targetEchelle)];
    if (mixed.length < nbQuestions) mixed = [...mixed, ...fullPool.filter((q) => !mixed.includes(q))];
    for (let i = mixed.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [mixed[i], mixed[j]] = [mixed[j], mixed[i]]; }
    const questions = mixed.slice(0, nbQuestions);
    const code = genCode();
    const state = { phase: "lobby", code, settings: { seconds, jokers, teamsMode, malus, jokerRandom, jokerRandomCount, kidsMode, hostPlays }, questions, currentIndex: -1, questionStartedAt: null, createdAt: Date.now() };
    await sSet(roomKey(code), state);
    let hostPid = null;
    if (hostPlays && hostAnimal) {
      hostPid = uid();
      const pseudo = hostPseudo.trim() || (lang === "en" ? "The host" : "L'hôte");
      await sSet(playerKey(code, hostPid), { id: hostPid, pseudo, animal: hostAnimal, team: 1, joinedAt: Date.now() });
      await sSet(scoreKey(code, hostPid), 0);
    }
    onCreated(code, state, hostPid);
  }

  return (
    <Stage wide>
      <ScreenHeader title={tr("roomSettingsTitle")} onBack={onBack} />

      <SettingSection number={1} icon="🎯" title={tr("categoriesLabel")} color={C.teal}>
        <CategoryPicker cats={cats} setCats={setCats} kidsMode={kidsMode} setKidsMode={setKidsMode} hideTitle />
      </SettingSection>

      <SettingSection number={2} icon="⏱️" title={tr("sectionFormatTitle")} color={C.gold}>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm opacity-70 mb-2 font-bold">{tr("nbQuestionsLabel")}</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setNbQuestions((n) => Math.max(5, n - 1))} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Minus size={16} /></button>
              <span style={{ fontFamily: F.mono, fontSize: 22 }}>{nbQuestions}</span>
              <button onClick={() => setNbQuestions((n) => Math.min(30, n + 1))} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Plus size={16} /></button>
            </div>
          </div>
          <div>
            <p className="text-sm opacity-70 mb-2 font-bold">{tr("secondsPerQuestionLabel")}</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setSeconds((n) => Math.max(10, n - 5))} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Minus size={16} /></button>
              <span style={{ fontFamily: F.mono, fontSize: 22 }}>{seconds}s</span>
              <button onClick={() => setSeconds((n) => Math.min(60, n + 5))} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Plus size={16} /></button>
            </div>
          </div>
        </div>
      </SettingSection>

      <SettingSection number={3} icon="👥" title={tr("teamsModeLabel")} color={C.violet}>
        <div className="grid grid-cols-2 gap-2">{[1, 2, 3, 4].map((n) => (<Chip key={n} active={teamsMode === n} onClick={() => setTeamsMode(n)}>{n === 1 ? tr("soloForAll") : `${n} ${tr("teamsCount")}`}</Chip>))}</div>
      </SettingSection>

      <SettingSection number={4} title={tr("jokersEnabledLabel")} color={C.pink} onInfoClick={() => setShowJokerInfo(true)}>
        <div className="grid grid-cols-2 gap-2">{JOKERS.map((j) => (<Chip key={j.id} active={jokers[j.id]} onClick={() => toggleJoker(j.id)}>{jokerLabel(j, lang)}</Chip>))}</div>
      </SettingSection>
      {showJokerInfo && <JokerInfoModal onClose={() => setShowJokerInfo(false)} />}

      <SettingSection number={5} icon="🎲" title={tr("jokerAttribLabel")} color={C.mint}>
        <div className="flex flex-wrap gap-2 mb-3">
          <Chip active={!jokerRandom} onClick={() => setJokerRandom(false)}>{tr("jokerManual")}</Chip>
          <Chip active={jokerRandom} onClick={() => setJokerRandom(true)}>{tr("jokerRandomLabel")}</Chip>
        </div>
        <p className="text-xs opacity-50 mb-3">{jokerRandom ? tr("jokerRandomHint") : tr("jokerManualHint")}</p>
        <div className="flex items-center gap-3">
          <span className="text-sm opacity-70">{tr("jokersPerPlayerLabel")}</span>
          <button onClick={() => setJokerRandomCount((n) => Math.max(1, n - 1))} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Minus size={16} /></button>
          <span style={{ fontFamily: F.mono, fontSize: 20 }}>{jokerRandomCount}</span>
          <button onClick={() => setJokerRandomCount((n) => Math.min(JOKERS.length, n + 1))} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Plus size={16} /></button>
        </div>
      </SettingSection>

      <SettingSection number={6} title={tr("malusLabel")} color={C.orange}>
        <div className="grid grid-cols-2 gap-2">
          {[0, -25, -50, -100].map((m) => (<Chip key={m} active={malus === m} onClick={() => setMalus(m)}>{m === 0 ? tr("malusNone") : `${m} pts`}</Chip>))}
        </div>
      </SettingSection>

      <SettingSection number={7} title={tr("hostPlaysLabel")} color={C.teal}>
        <div className="flex flex-wrap gap-2 mb-3">
          <Chip active={!hostPlays} onClick={() => setHostPlays(false)}>{tr("hostPlaysNo")}</Chip>
          <Chip active={hostPlays} onClick={() => setHostPlays(true)}>{tr("hostPlaysYes")}</Chip>
        </div>
        {hostPlays && (
          <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.05)" }}>
            <p className="text-xs opacity-60 mb-2">{tr("hostPlaysWarning")}</p>
            <div className="flex gap-2 mb-3">
              <input value={hostPseudo} onChange={(e) => setHostPseudo(e.target.value)} placeholder={tr("hostPseudoPlaceholder")} className="flex-1 rounded-xl px-4 py-2" style={{ background: "rgba(255,255,255,0.08)", color: C.cream, border: "2px solid rgba(255,255,255,0.15)" }} />
              <button onClick={() => setHostPseudo(funPseudo(hostPseudo))} className="rounded-xl px-3" style={{ background: C.gold }}><Sparkles size={18} color="#1B1030" /></button>
            </div>
            <AvatarPicker animal={hostAnimal} onPick={setHostAnimal} taken={[]} />
          </div>
        )}
      </SettingSection>

      <div className="mt-6">
        <BigButton onClick={create} color={C.pink} icon={Play} disabled={hostPlays && !hostAnimal}>{tr("createRoomBtn")}</BigButton>
      </div>
    </Stage>
  );
}

/* ---------------------------------------------------------
   PLAYER JOIN
--------------------------------------------------------- */
function JoinRoom({ onJoined, onBack, initialCode }) {
  const { t: tr } = useLang();
  const [step, setStep] = useState("code");
  const [code, setCode] = useState(initialCode || "");
  const [room, setRoom] = useState(null);
  const [players, setPlayers] = useState([]);
  const [animal, setAnimal] = useState(null);
  const [pseudo, setPseudo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const autoTried = useRef(false);

  async function validateCode(codeOverride) {
    setError("");
    const c = (typeof codeOverride === "string" ? codeOverride : code).trim().toUpperCase();
    if (c.length !== 4) return setError(tr("errCodeLength"));
    setLoading(true);
    const r = await sGet(roomKey(c));
    if (!r) { setLoading(false); return setError(tr("errRoomNotFound")); }
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
    if (!trimmed) return setError(tr("errChoosePseudo"));
    setError("");
    const existing = players.find((p) => p.pseudo.trim().toLowerCase() === trimmed.toLowerCase());
    if (existing) {
      setLoading(true);
      const drawnJokers = await sGet(`qz:${code}:playerjokers:${existing.id}`);
      const usedJokers = await sGet(`qz:${code}:jokerused:${existing.id}`);
      const assigned = drawnJokers || [];
      setLoading(false);
      onJoined(code, existing.id, { pseudo: existing.pseudo, animal: existing.animal }, room, { isReconnect: true, assignedJokers: assigned, usedJokersEver: usedJokers || [] });
      return;
    }
    setAnimal(null);
    setStep("avatar");
  }

  async function join() {
    if (!animal) return setError(tr("errChooseAnimal"));
    setError(""); setLoading(true);
    const pid = uid();
    const trimmed = pseudo.trim();
    await sSet(playerKey(code, pid), { id: pid, pseudo: trimmed, animal, team: 1, joinedAt: Date.now() });
    await sSet(scoreKey(code, pid), room.mode === "enchere" ? (room.settings.startingPoints || 10000) : 0);
    setLoading(false);
    onJoined(code, pid, { pseudo: trimmed, animal }, room, null);
  }

  if (step === "code") return (
    <Stage>
      <ScreenHeader title={tr("joinTitle")} onBack={onBack} color={C.teal} />
      <BigButton onClick={() => setScanning(true)} color={C.gold} icon={Camera}>{tr("scanQrBtn")}</BigButton>
      <p className="text-xs opacity-50 text-center my-3">{tr("orDivider")}</p>
      <p className="text-sm opacity-70 mb-2 font-bold">{tr("roomCodeLabel")}</p>
      <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 4))} placeholder={tr("roomCodePlaceholder")} className="w-full mb-4 rounded-xl px-4 py-3 text-center tracking-[0.3em]" style={{ fontFamily: F.mono, fontSize: 22, background: "rgba(255,255,255,0.08)", color: C.cream, border: `2px solid ${C.violet}` }} />
      {error && <p className="text-sm mb-3" style={{ color: C.pink }}>{error}</p>}
      <BigButton onClick={() => validateCode()} color={C.teal} disabled={loading}>{loading ? tr("loadingDots") : tr("continueSimple")}</BigButton>
      {scanning && (
        <QRScannerModal
          onClose={() => setScanning(false)}
          onScanned={(scannedCode) => { setScanning(false); setCode(scannedCode); validateCode(scannedCode); }}
        />
      )}
    </Stage>
  );

  if (step === "pseudo") return (
    <Stage>
      <ScreenHeader title={tr("yourPseudoTitle")} onBack={() => setStep("code")} color={C.teal} />
      <div className="flex gap-2 mb-2">
        <input value={pseudo} onChange={(e) => setPseudo(e.target.value)} placeholder={tr("pseudoPlaceholder")} className="flex-1 rounded-xl px-4 py-2" style={{ background: "rgba(255,255,255,0.08)", color: C.cream, border: `2px solid rgba(255,255,255,0.15)` }} />
        <button onClick={() => setPseudo(funPseudo(pseudo))} className="rounded-xl px-3" style={{ background: C.gold }}><Sparkles size={18} color="#1B1030" /></button>
      </div>
      <p className="text-xs opacity-60 mb-4">{tr("pseudoHint")}</p>
      {error && <p className="text-sm mb-3" style={{ color: C.pink }}>{error}</p>}
      <BigButton onClick={continueFromPseudo} color={C.teal} disabled={loading}>{loading ? tr("loadingDots") : tr("continueSimple")}</BigButton>
    </Stage>
  );

  return (
    <Stage>
      <ScreenHeader title={tr("yourAvatarTitle")} onBack={() => setStep("pseudo")} color={C.teal} />
      <AvatarPicker animal={animal} onPick={setAnimal} taken={players.map((p) => p.animal)} />
      {error && <p className="text-sm mb-3 text-center" style={{ color: C.pink }}>{error}</p>}
      <BigButton onClick={join} color={C.teal} disabled={loading}>{loading ? tr("loadingDots") : tr("joinPartyBtn")}</BigButton>
    </Stage>
  );
}

function JokerTuto({ room, onDone }) {
  const { lang, t: tr } = useLang();
  const enabled = JOKERS.filter((j) => room?.settings?.jokers?.[j.id]);
  return (
    <Stage>
      <div className="text-center mb-2" style={{ fontSize: 40 }}>🎪</div>
      <h2 className="text-center mb-5" style={{ fontFamily: F.display, fontSize: 26, color: C.gold }}>{tr("jokerBoxTitle")}</h2>
      <div className="flex flex-col gap-2 mb-6">
        {enabled.map((j) => (
          <div key={j.id} className="rounded-xl px-4 py-3 flex items-center gap-3" style={{ background: "rgba(255,255,255,0.06)", border: "2px solid rgba(255,255,255,0.12)" }}>
            <span style={{ fontSize: 22 }}>{j.emoji}</span>
            <p style={{ fontFamily: F.display, fontSize: 17, color: C.gold, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{jokerLabel(j, lang)}</p>
          </div>
        ))}
        {enabled.length === 0 && <p className="text-sm opacity-60 text-center">{tr("noJokerThisGame")}</p>}
      </div>
      <BigButton onClick={onDone} color={C.gold}>{tr("continueBtn")}</BigButton>
    </Stage>
  );
}

function JokerDraw({ room, code, pid, onDone }) {
  const { lang, t: tr } = useLang();
  const [picked, setPicked] = useState(null);

  useEffect(() => {
    const enabledIds = Object.entries(room.settings.jokers || {}).filter(([, v]) => v).map(([k]) => k);
    const jokerDefs = JOKERS.filter((j) => enabledIds.includes(j.id));
    const shuffled = [...jokerDefs];
    for (let i = shuffled.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; }
    const count = Math.min(room.settings.jokerRandomCount || 2, shuffled.length);
    const chosen = shuffled.slice(0, count).map((j) => j.id);
    (async () => { await sSet(`qz:${code}:playerjokers:${pid}`, chosen); setPicked(chosen); })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (picked === null) {
    return (
      <Stage>
        <div className="text-center mt-10">
          <div className="text-center mb-4" style={{ fontSize: 44 }}>🎲</div>
          <p className="opacity-70 text-center">{tr("loadingSimple")}</p>
        </div>
      </Stage>
    );
  }

  return (
    <Stage>
      <div className="text-center mb-2" style={{ fontSize: 44 }}>🎉</div>
      <h2 className="text-center mb-4" style={{ fontFamily: F.display, fontSize: 24, color: C.gold }}>{tr("yourJokersTitle")}</h2>
      <div className="flex flex-col gap-2 mb-6">
        {picked.map((id) => { const j = JOKERS.find((x) => x.id === id); return (
          <div key={id} className="rounded-xl px-4 py-3 flex items-center gap-3" style={{ background: "rgba(255,255,255,0.06)", border: "2px solid rgba(255,255,255,0.12)" }}>
            <span style={{ fontSize: 22 }}>{j.emoji}</span>
            <p style={{ fontFamily: F.display, fontSize: 17, color: C.gold, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{jokerLabel(j, lang)}</p>
          </div>
        ); })}
        {picked.length === 0 && <p className="text-sm opacity-60 text-center">{tr("noJokerThisGame")}</p>}
      </div>
      <BigButton onClick={() => onDone(picked)} color={C.gold}>{tr("joinRoomBtn")}</BigButton>
    </Stage>
  );
}

function JokerPick({ room, code, pid, onDone }) {
  const { lang, t: tr } = useLang();
  const enabledIds = Object.entries(room.settings.jokers || {}).filter(([, v]) => v).map(([k]) => k);
  const jokerDefs = JOKERS.filter((j) => enabledIds.includes(j.id));
  const [picked, setPicked] = useState([]);
  const [confirmed, setConfirmed] = useState(false);
  const count = Math.min(room.settings.jokerRandomCount || 2, jokerDefs.length);

  function toggle(id) {
    setPicked((p) => {
      if (p.includes(id)) return p.filter((x) => x !== id);
      if (p.length >= count) return p;
      return [...p, id];
    });
  }
  async function confirm() { await sSet(`qz:${code}:playerjokers:${pid}`, picked); setConfirmed(true); }

  if (confirmed) {
    return (
      <Stage>
        <div className="text-center mb-2" style={{ fontSize: 44 }}>🎉</div>
        <h2 className="text-center mb-4" style={{ fontFamily: F.display, fontSize: 24, color: C.gold }}>{tr("yourJokersTitle")}</h2>
        <div className="flex flex-col gap-3 mb-6">
          {picked.map((id) => { const j = JOKERS.find((x) => x.id === id); return (
            <div key={id} className="rounded-2xl p-3 flex items-center gap-3" style={{ background: "rgba(255,255,255,0.06)", border: "2px solid rgba(255,255,255,0.12)" }}>
              <div className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: 46, height: 46, background: "rgba(255,255,255,0.1)", fontSize: 22 }}>{j.emoji}</div>
              <div><p style={{ fontFamily: F.display, fontSize: 17, color: C.gold }}>{jokerLabel(j, lang)}</p><p className="text-xs opacity-80">{jokerDesc(j, lang)}</p></div>
            </div>
          ); })}
        </div>
        <BigButton onClick={() => onDone(picked)} color={C.gold}>{tr("joinRoomBtn")}</BigButton>
      </Stage>
    );
  }

  return (
    <Stage>
      <ScreenHeader title={tr("pickJokersTitle")} color={C.gold} />
      <p className="text-sm opacity-70 mb-4 text-center">{tr("pickChooseJokers").replace("{n}", count).replace("{total}", jokerDefs.length)}</p>
      <div className="flex flex-col gap-3 mb-6">
        {jokerDefs.map((j) => {
          const isPicked = picked.includes(j.id);
          const Icon = j.icon;
          return (
            <button key={j.id} onClick={() => toggle(j.id)} disabled={!isPicked && picked.length >= count} className="rounded-2xl p-3 flex items-center gap-3 text-left transition-transform active:scale-95 disabled:opacity-30" style={{ background: isPicked ? "rgba(255,201,60,0.15)" : "rgba(255,255,255,0.06)", border: `2px solid ${isPicked ? C.gold : "rgba(255,255,255,0.12)"}` }}>
              <div className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: 46, height: 46, background: isPicked ? C.gold : "rgba(255,255,255,0.1)" }}>
                <Icon size={22} color={isPicked ? "#1B1030" : C.cream} />
              </div>
              <div className="flex-1">
                <p style={{ fontFamily: F.display, fontSize: 17, color: isPicked ? C.gold : C.cream }}>{jokerLabel(j, lang)}</p>
                <p className="text-xs opacity-80">{jokerDesc(j, lang)}</p>
              </div>
              {isPicked && <Check size={20} color={C.gold} />}
            </button>
          );
        })}
      </div>
      <p className="text-xs opacity-60 mb-4 text-center">{picked.length} / {count} {tr("selectedCount")}</p>
      <BigButton onClick={confirm} color={C.gold} disabled={picked.length < count}>{tr("validateMyJokers")}</BigButton>
    </Stage>
  );
}

/* ---------------------------------------------------------
   LOBBIES
--------------------------------------------------------- */
function AdminLobby({ code, room, onStart, buildExtraOnStart, onBack }) {
  const { lang, t: tr } = useLang();
  const [players, setPlayers] = useState([]);
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const refresh = useCallback(async () => {
    const keys = await sList(`qz:${code}:player:`);
    const list = (await Promise.all(keys.map((k) => sGet(k)))).filter(Boolean);
    const withJokers = await Promise.all(list.map(async (p) => ({ ...p, drawnJokers: await sGet(`qz:${code}:playerjokers:${p.id}`) })));
    setPlayers(withJokers);
  }, [code]);
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
      {onBack && <div className="mb-3"><GhostButton onClick={onBack} small>{tr("back")}</GhostButton></div>}
      <Logo />
      <div className="text-center mb-6">
        <p className="text-sm opacity-70 mb-1">{tr("joinWithCode")}</p>
        <div className="flex items-center justify-center gap-3">
          <span style={{ fontFamily: F.mono, fontSize: 48, letterSpacing: 10, color: C.gold }}>{code}</span>
          <button onClick={() => { navigator.clipboard?.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); }} className="rounded-lg p-2" style={{ background: "rgba(255,255,255,0.1)" }}>{copied ? <Check size={18} /> : <Copy size={18} />}</button>
        </div>
        <div className="flex flex-col items-center mt-4">
          <GhostButton onClick={() => { navigator.clipboard?.writeText(buildJoinUrl(code)); setLinkCopied(true); setTimeout(() => setLinkCopied(false), 1500); }}>
            {linkCopied ? tr("linkCopiedMsg") : tr("copyLinkBtn")}
          </GhostButton>
        </div>
        <div className="flex flex-col items-center mt-4">
          <div className="rounded-2xl p-2" style={{ background: C.cream }}>
            <img src={qrCodeSrc(buildJoinUrl(code))} alt="QR code" width={140} height={140} style={{ display: "block" }} />
          </div>
          <p className="text-[11px] opacity-50 mt-2">{tr("scanHint")}</p>
        </div>
      </div>
      <div className="rounded-2xl p-4 mb-6" style={{ background: "rgba(255,255,255,0.05)", minHeight: 140 }}>
        <p className="text-sm font-bold mb-3 opacity-70 flex items-center gap-2"><Users size={16} /> {tr("playersInRoom")} ({players.length}){room.settings.teamsMode > 1 && tr("clickToChangeTeam")}</p>
        <div className="flex flex-wrap gap-3">
          {players.length === 0 && <p className="text-sm opacity-50">{tr("waitingPlayersLobby")}</p>}
          {players.map((p) => (
            <button key={p.id} onClick={() => room.settings.teamsMode > 1 && setTeam(p.id, p.team)} className="flex flex-col items-center gap-1" style={{ width: 84 }}>
              <div className="flex items-center justify-center rounded-full" style={{ width: 52, height: 52, background: "rgba(255,255,255,0.08)", fontSize: 26, border: room.settings.teamsMode > 1 ? `3px solid ${teamColors[(p.team - 1) % 4]}` : "none" }}>{p.animal}</div>
              <span className="text-xs text-center truncate w-full">{p.pseudo}</span>
              {room.settings.teamsMode > 1 && <span className="text-[10px] opacity-70">{tr("teamWord")} {p.team}</span>}
              {room.settings.jokers && (
                <div className="flex gap-0.5 flex-wrap justify-center">
                  {p.drawnJokers === undefined ? null : p.drawnJokers === null ? (
                    <span className="text-[9px] opacity-50">...</span>
                  ) : (
                    p.drawnJokers.map((jid) => { const j = JOKERS.find((x) => x.id === jid); return <span key={jid} title={jokerLabel(j, lang)} style={{ fontSize: 13 }}>{j?.emoji}</span>; })
                  )}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
      <BigButton onClick={start} color={C.pink} disabled={players.length === 0} icon={Play}>{tr("launchGame")} ({(room.questions || room.tracks || []).length} {room.mode === "blindtest" ? tr("tracksWord") : tr("questionsWord")})</BigButton>
    </Stage>
  );
}

function PlayerLobby({ profile, code, assignedJokers }) {
  const { lang, t: tr } = useLang();
  const [players, setPlayers] = useState([]);
  useEffect(() => {
    let stop = false;
    const refresh = async () => {
      const keys = await sList(`qz:${code}:player:`);
      const list = (await Promise.all(keys.map((k) => sGet(k)))).filter(Boolean);
      if (!stop) setPlayers(list);
    };
    refresh();
    const t = setInterval(refresh, 1500);
    return () => { stop = true; clearInterval(t); };
  }, [code]);

  return (
    <Stage>
      <Logo />
      <div className="flex flex-col items-center gap-3 mt-6">
        <div className="flex items-center justify-center rounded-full" style={{ width: 88, height: 88, background: "rgba(255,255,255,0.08)", border: `3px solid ${C.teal}`, fontSize: 42 }}>{profile.animal}</div>
        <p style={{ fontFamily: F.display, fontSize: 22 }}>{profile.pseudo}</p>
        <p className="text-sm opacity-60">{tr("roomWord")} {code}</p>
        <p className="mt-2 text-center opacity-70">{tr("waitingForHost")}</p>
        <div className="mt-4 rounded-2xl p-4 w-full" style={{ background: "rgba(255,255,255,0.05)" }}>
          <p className="text-sm font-bold mb-3 opacity-70 flex items-center gap-2"><Users size={16} /> {tr("playersInRoom")} ({players.length})</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {players.map((p) => (
              <div key={p.id} className="flex flex-col items-center gap-1" style={{ width: 72 }}>
                <div className="flex items-center justify-center rounded-full" style={{ width: 48, height: 48, background: "rgba(255,255,255,0.08)", fontSize: 24, border: p.pseudo === profile.pseudo && p.animal === profile.animal ? `2px solid ${C.gold}` : "none" }}>{p.animal}</div>
                <span className="text-xs text-center truncate w-full">{p.pseudo}</span>
              </div>
            ))}
            {players.length === 0 && <p className="text-xs opacity-50">{tr("loadingSimple")}</p>}
          </div>
        </div>
        <div className="mt-2 rounded-xl p-3 text-center w-full" style={{ background: "rgba(255,255,255,0.05)" }}>
          <p className="text-xs opacity-60 mb-1">{tr("yourJokersColon")}</p>
          {assignedJokers && assignedJokers.length > 0 ? (
            <div className="flex gap-2 justify-center flex-wrap">
              {assignedJokers.map((id) => { const j = JOKERS.find((x) => x.id === id); return j ? <span key={id} className="text-xs rounded-full px-3 py-1" style={{ background: C.gold, color: "#1B1030", fontWeight: 700 }}>{j.emoji} {jokerLabel(j, lang)}</span> : null; })}
            </div>
          ) : (
            <p className="text-xs opacity-50">{tr("noJokerForGame")}</p>
          )}
        </div>
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
function AdminGame({ code, room, onRoomChange, onFinished, hostPid, hostAssignedJokers, hostUsedJokersEver, setHostUsedJokersEver }) {
  const { lang, t: tr } = useLang();
  const q = room.questions[room.currentIndex];
  const left = useCountdown(room.questionStartedAt, room.settings.seconds);
  const [answersCount, setAnswersCount] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [playerAnswers, setPlayerAnswers] = useState([]);
  const [provisional, setProvisional] = useState([]);
  const [autoLeft, setAutoLeft] = useState(7);
  const [hostScaleVal, setHostScaleVal] = useState(0);
  const [hostSubmitted, setHostSubmitted] = useState(false);
  const [hostJokerUsed, setHostJokerUsed] = useState(null);
  const [hostHiddenOptions, setHostHiddenOptions] = useState([]);
  const [hostPickingTargetFor, setHostPickingTargetFor] = useState(null);
  const [hostOtherPlayers, setHostOtherPlayers] = useState([]);
  const [hostCopyPeek, setHostCopyPeek] = useState(null);
  const [hostPollData, setHostPollData] = useState(null);
  const [paused, setPaused] = useState(false);
  const advancingRef = useRef(false);
  const prevRankRef = useRef({});

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

    const blockedDamage = {};
    answers.forEach((a) => { if (a.jokerUsed?.id === "block" && correctness[a.pid] && a.jokerUsed.targetId) { blockedDamage[a.jokerUsed.targetId] = gained[a.jokerUsed.targetId] || 0; gained[a.jokerUsed.targetId] = 0; } });

    const netDelta = { ...gained };

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
      const prevKiller = (await sGet(killerKey(code, op.pid))) || 0;
      await sSet(killerKey(code, op.pid), prevKiller + steal);
      const prevVictim = (await sGet(victimKey(code, op.jokerUsed.targetId))) || 0;
      await sSet(victimKey(code, op.jokerUsed.targetId), prevVictim + steal);
      netDelta[op.pid] = (netDelta[op.pid] || 0) + steal;
      netDelta[op.jokerUsed.targetId] = (netDelta[op.jokerUsed.targetId] || 0) - steal;
    }
    for (const [targetId, dmg] of Object.entries(blockedDamage)) {
      if (dmg > 0) { const prevVictim = (await sGet(victimKey(code, targetId))) || 0; await sSet(victimKey(code, targetId), prevVictim + dmg); }
    }

    const withPlayers = answers.map((a) => {
      const p = players.find((pp) => pp.id === a.pid);
      return { ...a, pseudo: p?.pseudo || "?", animal: p?.animal || "❓", correct: correctness[a.pid], points: netDelta[a.pid] || 0 };
    });
    setPlayerAnswers(withPlayers);
    await sSet(revealDetailKey(code, room.currentIndex), withPlayers.map((a) => ({ pid: a.pid, pseudo: a.pseudo, animal: a.animal, correct: a.correct, points: a.points, value: a.value })));
    for (const p of players) { await sSet(pointsDeltaKey(code, room.currentIndex, p.id), netDelta[p.id] || 0); }
    await sSet(revealedKey(code, room.currentIndex), true);
    const withScores = await Promise.all(players.map(async (p) => ({ ...p, score: (await sGet(scoreKey(code, p.id))) || 0 })));
    withScores.sort((a, b) => b.score - a.score);
    setProvisional(withRankChange(withScores, prevRankRef));
    setAutoLeft(7);
    setRevealed(true);
  }, [code, q, room]);

  useEffect(() => {
    setRevealed(false); advancingRef.current = false; setPlayerAnswers([]); setProvisional([]); setHostSubmitted(false); setHostScaleVal(0); setHostJokerUsed(null); setHostHiddenOptions([]); setHostPickingTargetFor(null); setHostCopyPeek(null); setHostPollData(null); setPaused(false);
    const t = setInterval(async () => {
      const [keys, playerKeys] = await Promise.all([sList(`qz:${code}:answer:${room.currentIndex}:`), sList(`qz:${code}:player:`)]);
      setAnswersCount(keys.length);
      if (playerKeys.length > 0 && keys.length >= playerKeys.length && !advancingRef.current) collectAndScore();
    }, 1000);
    return () => clearInterval(t);
  }, [room.currentIndex, code]);
  useEffect(() => { if (left === 0 && !revealed) collectAndScore(); }, [left, revealed, collectAndScore]);

  async function next() {
    const isLast = room.currentIndex >= room.questions.length - 1;
    if (isLast) { const next = { ...room, phase: "results" }; await sSet(roomKey(code), next); onFinished(next); }
    else { const next = { ...room, currentIndex: room.currentIndex + 1, questionStartedAt: Date.now() }; await sSet(roomKey(code), next); onRoomChange(next); }
  }

  useEffect(() => {
    if (!revealed || paused) return;
    if (autoLeft <= 0) { next(); return; }
    const t = setTimeout(() => setAutoLeft((n) => n - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed, autoLeft, paused]);

  function answerLabel(a) {
    if (q.type === "qcm") return q.options[a.value] ?? "?";
    if (q.type === "vf") return a.value ? "Vrai" : "Faux";
    if (q.type === "carte") return MAP_ZONES.find((z) => z.id === a.value)?.label || "?";
    if (q.type === "echelle") return String(a.value);
    return "?";
  }

  async function hostPickTarget(jokerId) {
    const keys = await sList(`qz:${code}:player:`);
    setHostOtherPlayers((await Promise.all(keys.map((k) => sGet(k)))).filter((p) => p && p.id !== hostPid));
    setHostPickingTargetFor(jokerId);
  }
  async function hostConfirmTarget(targetId) {
    const jokerId = hostPickingTargetFor;
    const targetPlayer = hostOtherPlayers.find((p) => p.id === targetId);
    setHostJokerUsed({ id: jokerId, targetId, targetPseudo: targetPlayer?.pseudo });
    const nextUsed = [...hostUsedJokersEver, jokerId];
    setHostUsedJokersEver(nextUsed);
    sSet(`qz:${code}:jokerused:${hostPid}`, nextUsed);
    setHostPickingTargetFor(null);
    if (jokerId !== "copieur") await sSet(targetedKey(code, room.currentIndex, targetId, hostPid), true);
    if (jokerId === "speedchrono") {
      const elapsed = (Date.now() - room.questionStartedAt) / 1000;
      const remaining = Math.max(0, room.settings.seconds - elapsed);
      await sSet(speedChronoKey(code, room.currentIndex, targetId), { deadline: Date.now() + (remaining * 1000) / 2 });
    }
  }
  function hostUseJoker(id) {
    if (hostJokerUsed || hostSubmitted) return;
    const jokerDef = JOKERS.find((j) => j.id === id);
    if (jokerDef.targeted) { hostPickTarget(id); return; }
    setHostJokerUsed({ id });
    const nextUsed = [...hostUsedJokersEver, id];
    setHostUsedJokersEver(nextUsed);
    sSet(`qz:${code}:jokerused:${hostPid}`, nextUsed);
    if (id === "5050" && q.type === "qcm") { const wrongIdx = q.options.map((_, i) => i).filter((i) => i !== q.answer); setHostHiddenOptions(wrongIdx.sort(() => Math.random() - 0.5).slice(0, 2)); }
    if (id === "voleurtemps") {
      (async () => {
        const keys = await sList(`qz:${code}:player:`);
        const others = (await Promise.all(keys.map((k) => sGet(k)))).filter((p) => p && p.id !== hostPid);
        const elapsed = (Date.now() - room.questionStartedAt) / 1000;
        const remaining = Math.max(0, room.settings.seconds - elapsed);
        for (const o of others) {
          await sSet(speedChronoKey(code, room.currentIndex, o.id), { deadline: Date.now() + Math.max(0, remaining - 3) * 1000 });
        }
      })();
    }
  }

  useEffect(() => {
    if (hostJokerUsed?.id !== "copieur" || hostSubmitted || hostCopyPeek !== null) return;
    let stop = false;
    const t = setInterval(async () => {
      const a = await sGet(answerKey(code, room.currentIndex, hostJokerUsed.targetId));
      if (stop || !a) return;
      clearInterval(t);
      setHostCopyPeek(a.value);
    }, 700);
    return () => { stop = true; clearInterval(t); };
  }, [hostJokerUsed, hostSubmitted, hostCopyPeek, code, room.currentIndex]);

  useEffect(() => {
    if (hostJokerUsed?.id !== "sondage" || q.type !== "qcm" || hostSubmitted) return;
    let stop = false;
    const t = setInterval(async () => {
      const keys = await sList(`qz:${code}:answer:${room.currentIndex}:`);
      const answers = (await Promise.all(keys.map((k) => sGet(k)))).filter(Boolean);
      if (stop) return;
      const counts = q.options.map((_, i) => answers.filter((a) => a.value === i).length);
      setHostPollData({ counts, total: answers.length });
    }, 800);
    return () => { stop = true; clearInterval(t); };
  }, [hostJokerUsed, q, hostSubmitted, code, room.currentIndex]);

  const hostEnabledJokers = hostPid ? JOKERS.filter((j) => (hostAssignedJokers || []).includes(j.id) && !hostUsedJokersEver.includes(j.id) && (j.id !== "5050" || q.type === "qcm") && (j.id !== "sondage" || q.type === "qcm")) : [];

  const cat = findCategory(q.category);
  const catLabelText = cat ? (cat.id.startsWith("k_") ? kidsCategoryLabel(cat, lang) : categoryLabel(cat, lang)) : "";
  return (
    <Stage wide>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm opacity-60">{tr("questionWord")} {room.currentIndex + 1} / {room.questions.length}</span>
        <span className="flex items-center gap-1 text-sm opacity-60"><Users size={14} /> {answersCount} {tr("answersWord")}</span>
        <span className="flex items-center gap-1" style={{ fontFamily: F.mono, fontSize: 20, color: left <= 5 ? C.pink : C.gold }}><Clock size={18} /> {left}s</span>
      </div>
      <div className="rounded-3xl p-8 mb-6 text-center" style={{ background: "rgba(255,255,255,0.06)" }}>
        <p className="uppercase tracking-widest mb-3" style={{ fontSize: 20, fontWeight: 800, color: C.gold }}>{cat?.emoji} {catLabelText}</p>
        <p style={{ fontFamily: F.display, fontSize: 32 }}>{q.text}</p>
        {q.type === "echelle" && !revealed && <p className="text-sm opacity-70 mt-3">{tr("closestWinsHint")}</p>}
        {q.type === "qcm" && (<div className="grid grid-cols-2 gap-3 mt-6">{q.options.map((o, i) => (<div key={i} className="rounded-xl p-3" style={{ background: revealed && i === q.answer ? C.teal : "rgba(255,255,255,0.08)", color: revealed && i === q.answer ? "#1B1030" : C.cream, fontFamily: F.body, fontWeight: 700, fontSize: 18 }}>{o}</div>))}</div>)}
        {q.type === "vf" && (<div className="flex gap-4 justify-center mt-6"><div className="rounded-xl px-6 py-3" style={{ background: revealed && q.answer === true ? C.teal : "rgba(255,255,255,0.08)" }}>{tr("trueLabel")}</div><div className="rounded-xl px-6 py-3" style={{ background: revealed && q.answer === false ? C.teal : "rgba(255,255,255,0.08)" }}>{tr("falseLabel")}</div></div>)}
        {q.type === "carte" && (<div className="relative rounded-xl mt-6 mx-auto" style={{ width: "100%", maxWidth: 420, height: 220, background: "rgba(255,255,255,0.06)" }}>{MAP_ZONES.map((z) => (<div key={z.id} className="absolute rounded-full px-2 py-1 text-xs" style={{ left: `${z.x}%`, top: `${z.y}%`, transform: "translate(-50%,-50%)", background: revealed && z.id === q.answer ? C.teal : "rgba(255,255,255,0.12)", color: revealed && z.id === q.answer ? "#1B1030" : C.cream }}>{z.label}</div>))}</div>)}
        {q.type === "echelle" && revealed && <p className="mt-6" style={{ fontFamily: F.mono, fontSize: 26, color: C.teal }}>{lang === "en" ? `Answer: ${q.answer} ${q.unit || ""}` : `Réponse : ${q.answer} ${q.unit || ""}`}</p>}
      </div>
      {room.settings.hostPlays && hostPid && !revealed && (
        <div className="rounded-2xl p-4 mb-6" style={{ background: "rgba(255,255,255,0.05)", border: `2px solid ${C.violet}` }}>
          <p className="text-sm font-bold mb-3" style={{ color: C.violet }}>{tr("hostAnswerTitle")}</p>
          {hostSubmitted ? (
            <p className="text-sm opacity-70">{tr("answerSubmitted")}</p>
          ) : (
            <>
              {hostJokerUsed?.id === "copieur" && (
                <div className="rounded-xl p-3 mb-3 text-center text-sm" style={{ background: "rgba(255,201,60,0.1)", color: C.gold }}>
                  {hostCopyPeek === null ? tr("waitingForTargetAnswer").replace("{name}", hostJokerUsed.targetPseudo || tr("yourTargetFallback")) : tr("targetAnswered").replace("{name}", hostJokerUsed.targetPseudo || tr("yourTargetFallbackCap")).replace("{value}", q.type === "qcm" ? q.options[hostCopyPeek] : q.type === "vf" ? (hostCopyPeek ? tr("trueLabel") : tr("falseLabel")) : q.type === "carte" ? MAP_ZONES.find((z) => z.id === hostCopyPeek)?.label : hostCopyPeek)}
                </div>
              )}
              {q.type === "qcm" && (<div className="grid grid-cols-1 gap-3 mb-4">{q.options.map((o, i) => hostHiddenOptions.includes(i) ? null : (<button key={i} onClick={async () => { setHostSubmitted(true); await sSet(answerKey(code, room.currentIndex, hostPid), { pid: hostPid, value: i, jokerUsed: hostJokerUsed, submittedAt: Date.now() }); }} className="rounded-xl py-3 px-4 text-left flex items-center justify-between" style={{ background: "rgba(255,255,255,0.1)", fontFamily: F.body, fontWeight: 700 }}><span>{o}</span>{hostPollData && hostPollData.total > 0 && <span className="text-sm opacity-70" style={{ fontFamily: F.mono }}>{Math.round((hostPollData.counts[i] / hostPollData.total) * 100)}%</span>}</button>))}</div>)}
              {q.type === "vf" && (<div className="flex gap-3 mb-4"><button onClick={async () => { setHostSubmitted(true); await sSet(answerKey(code, room.currentIndex, hostPid), { pid: hostPid, value: true, jokerUsed: hostJokerUsed, submittedAt: Date.now() }); }} className="flex-1 rounded-xl py-3" style={{ background: C.teal, color: "#1B1030", fontFamily: F.display }}>{tr("trueLabel")}</button><button onClick={async () => { setHostSubmitted(true); await sSet(answerKey(code, room.currentIndex, hostPid), { pid: hostPid, value: false, jokerUsed: hostJokerUsed, submittedAt: Date.now() }); }} className="flex-1 rounded-xl py-3" style={{ background: C.pink, color: "#1B1030", fontFamily: F.display }}>{tr("falseLabel")}</button></div>)}
              {q.type === "carte" && (<div className="relative rounded-xl mb-4" style={{ width: "100%", height: 180, background: "rgba(255,255,255,0.06)" }}>{MAP_ZONES.map((z) => (<button key={z.id} onClick={async () => { setHostSubmitted(true); await sSet(answerKey(code, room.currentIndex, hostPid), { pid: hostPid, value: z.id, jokerUsed: hostJokerUsed, submittedAt: Date.now() }); }} className="absolute rounded-full px-2 py-1 text-xs" style={{ left: `${z.x}%`, top: `${z.y}%`, transform: "translate(-50%,-50%)", background: "rgba(255,255,255,0.15)" }}>{z.label}</button>))}</div>)}
              {q.type === "echelle" && (
                <QuestionInput
                  q={q}
                  scaleVal={hostScaleVal}
                  setScaleVal={setHostScaleVal}
                  onSubmit={async (value) => { setHostSubmitted(true); await sSet(answerKey(code, room.currentIndex, hostPid), { pid: hostPid, value, jokerUsed: hostJokerUsed, submittedAt: Date.now() }); }}
                />
              )}
              {!hostPickingTargetFor ? (
                hostEnabledJokers.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs opacity-60 mb-2">{tr("yourJokersShort")}</p>
                    <div className="grid grid-cols-3 gap-2">
                      {hostEnabledJokers.map((j) => (
                        <button key={j.id} disabled={!!hostJokerUsed} onClick={() => hostUseJoker(j.id)} className="rounded-xl py-2 px-2 flex flex-col items-center gap-1 disabled:opacity-30 transition-transform active:scale-95" style={{ background: hostJokerUsed?.id === j.id ? C.violet : "rgba(255,255,255,0.1)", border: "2px solid rgba(255,255,255,0.15)" }}>
                          <j.icon size={18} />
                          <span style={{ fontFamily: F.display, fontSize: 11 }}>{jokerLabel(j, lang)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              ) : (
                <div className="mt-2 rounded-xl p-3" style={{ background: "rgba(123,78,255,0.12)", border: `2px solid ${C.violet}` }}>
                  <p className="text-xs opacity-80 mb-2 text-center">{tr("chooseTarget")}</p>
                  <div className="flex flex-wrap gap-3 justify-center">{hostOtherPlayers.map((p) => (<button key={p.id} onClick={() => hostConfirmTarget(p.id)} className="flex flex-col items-center gap-1"><div className="rounded-full flex items-center justify-center" style={{ width: 44, height: 44, background: "rgba(255,255,255,0.08)", fontSize: 22 }}>{p.animal}</div><span className="text-xs">{p.pseudo}</span></button>))}</div>
                  <div className="mt-2 text-center"><GhostButton onClick={() => setHostPickingTargetFor(null)} small>{tr("cancel")}</GhostButton></div>
                </div>
              )}
            </>
          )}
        </div>
      )}
      {revealed && playerAnswers.length > 0 && (
        <div className="rounded-2xl p-4 mb-4" style={{ background: "rgba(255,255,255,0.05)" }}>
          <p className="text-sm font-bold mb-2 opacity-70">{tr("playerAnswersTitle")}</p>
          <div className="flex flex-col gap-2">
            {playerAnswers.map((a) => (
              <div key={a.pid} className="flex items-center gap-2 text-sm">
                <span>{a.animal}</span>
                <span className="flex-1">{a.pseudo}</span>
                <span style={{ color: a.correct ? C.teal : C.pink, fontWeight: 700 }}>{answerLabel(a)}</span>
                <span style={{ fontFamily: F.mono, fontSize: 13, color: a.points > 0 ? C.teal : a.points < 0 ? C.pink : "rgba(255,255,255,0.4)", minWidth: 54, textAlign: "right" }}>{a.points > 0 ? `+${a.points}` : a.points} pts</span>
                {a.correct ? <Check size={16} color={C.teal} /> : <span style={{ color: C.pink }}>✕</span>}
              </div>
            ))}
          </div>
        </div>
      )}
      {revealed && provisional.length > 0 && (
        <div className="rounded-2xl p-4 mb-6" style={{ background: "rgba(255,201,60,0.08)" }}>
          <p className="text-sm font-bold mb-2" style={{ color: C.gold }}>{tr("provisionalRanking")}</p>
          <div className="flex flex-col gap-1">
            {provisional.map((p, i) => (
              <div key={p.id} className="flex items-center gap-2 text-sm">
                <span className="opacity-60" style={{ width: 20 }}>{i + 1}.</span>
                <span>{p.animal}</span>
                <span className="flex-1">{p.pseudo}</span>
                <span style={{ width: 28, textAlign: "center" }}><RankBadge change={p.rankChange} /></span>
                <span style={{ fontFamily: F.mono, color: C.teal }}>{p.score}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {revealed ? (
        <div className="flex flex-col gap-3">
          {paused && <p className="text-xs opacity-60 text-center">{tr("pausedMsg")}</p>}
          <BigButton onClick={next} color={C.pink} icon={ArrowRight}>{room.currentIndex >= room.questions.length - 1 ? tr("finalRankingBtn") : paused ? tr("nextQuestion") : `${tr("nextQuestion")} (${autoLeft}s)`}</BigButton>
          {room.currentIndex < room.questions.length - 1 && (
            <GhostButton onClick={() => setPaused((v) => !v)}>{paused ? tr("resumeBtn") : tr("pauseBtn")}</GhostButton>
          )}
        </div>
      ) : (<BigButton onClick={collectAndScore} color={C.violet}>{tr("revealNow")}</BigButton>)}
    </Stage>
  );
}

/* ---------------------------------------------------------
   PLAYER GAME
--------------------------------------------------------- */
function PlayerGameCore({ code, pid, room, assignedJokers, usedJokersEver, setUsedJokersEver }) {
  const { lang, t: tr } = useLang();
  const q = room.questions[room.currentIndex];
  const globalLeft = useCountdown(room.questionStartedAt, room.settings.seconds);
  const [speedDeadline, setSpeedDeadline] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState([]);
  const [jokerUsed, setJokerUsed] = useState(null);
  const [scaleVal, setScaleVal] = useState(0);
  const [pickingTargetFor, setPickingTargetFor] = useState(null);
  const [otherPlayers, setOtherPlayers] = useState([]);
  const [targeters, setTargeters] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const [myPoints, setMyPoints] = useState(0);
  const [provisional, setProvisional] = useState([]);
  const [copyPeek, setCopyPeek] = useState(null);
  const [pollData, setPollData] = useState(null);
  const [allAnswers, setAllAnswers] = useState([]);
  const prevRankRef = useRef({});

  const left = speedDeadline != null ? Math.max(0, Math.ceil((speedDeadline - Date.now()) / 1000)) : globalLeft;

  useEffect(() => { setSubmitted(false); setHiddenOptions([]); setJokerUsed(null); setScaleVal(0); setPickingTargetFor(null); setSpeedDeadline(null); setTargeters([]); setRevealed(false); setMyPoints(0); setProvisional([]); setCopyPeek(null); setPollData(null); setAllAnswers([]); }, [room.currentIndex]);

  useEffect(() => {
    if (!(submitted || left === 0)) return;
    let stop = false;
    const t = setInterval(async () => {
      const isRevealed = await sGet(revealedKey(code, room.currentIndex));
      if (stop || !isRevealed) return;
      clearInterval(t);
      const [myDelta, playerKeys, detail] = await Promise.all([
        sGet(pointsDeltaKey(code, room.currentIndex, pid)),
        sList(`qz:${code}:player:`),
        sGet(revealDetailKey(code, room.currentIndex)),
      ]);
      setMyPoints(myDelta || 0);
      const players = (await Promise.all(playerKeys.map((k) => sGet(k)))).filter(Boolean);
      const withScores = await Promise.all(players.map(async (p) => ({ ...p, score: (await sGet(scoreKey(code, p.id))) || 0 })));
      withScores.sort((a, b) => b.score - a.score);
      setProvisional(withRankChange(withScores, prevRankRef));
      setAllAnswers(detail || []);
      setRevealed(true);
    }, 800);
    return () => { stop = true; clearInterval(t); };
  }, [submitted, left, code, room.currentIndex, pid]);

  useEffect(() => {
    let stop = false;
    const t = setInterval(async () => {
      const v = await sGet(speedChronoKey(code, room.currentIndex, pid));
      if (stop) return;
      if (v?.deadline) setSpeedDeadline(v.deadline);
    }, 600);
    return () => { stop = true; clearInterval(t); };
  }, [code, room.currentIndex, pid]);

  useEffect(() => {
    if (!(submitted || left === 0)) return;
    let stop = false;
    (async () => {
      const keys = await sList(`qz:${code}:targeted:${room.currentIndex}:${pid}:`);
      if (stop || keys.length === 0) return;
      const attackerIds = keys.map((k) => k.split(":").pop());
      const attackers = (await Promise.all(attackerIds.map((aid) => sGet(playerKey(code, aid))))).filter(Boolean);
      setTargeters(attackers.map((a) => a.pseudo));
    })();
    return () => { stop = true; };
  }, [submitted, left, code, room.currentIndex, pid]);

  async function submit(value) { if (submitted || left === 0) return; setSubmitted(true); setPickingTargetFor(null); await sSet(answerKey(code, room.currentIndex, pid), { pid, value, jokerUsed, submittedAt: Date.now() }); }

  async function pickTarget(jokerId) {
    const keys = await sList(`qz:${code}:player:`);
    setOtherPlayers((await Promise.all(keys.map((k) => sGet(k)))).filter((p) => p && p.id !== pid));
    setPickingTargetFor(jokerId);
  }
  async function confirmTarget(targetId) {
    const jokerId = pickingTargetFor;
    const targetPlayer = otherPlayers.find((p) => p.id === targetId);
    setJokerUsed({ id: jokerId, targetId, targetPseudo: targetPlayer?.pseudo });
    const nextUsed = [...usedJokersEver, jokerId];
    setUsedJokersEver(nextUsed);
    sSet(`qz:${code}:jokerused:${pid}`, nextUsed);
    setPickingTargetFor(null);
    if (jokerId !== "copieur") await sSet(targetedKey(code, room.currentIndex, targetId, pid), true);
    if (jokerId === "speedchrono") {
      const elapsed = (Date.now() - room.questionStartedAt) / 1000;
      const remaining = Math.max(0, room.settings.seconds - elapsed);
      await sSet(speedChronoKey(code, room.currentIndex, targetId), { deadline: Date.now() + (remaining * 1000) / 2 });
    }
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
    if (id === "voleurtemps") {
      (async () => {
        const keys = await sList(`qz:${code}:player:`);
        const others = (await Promise.all(keys.map((k) => sGet(k)))).filter((p) => p && p.id !== pid);
        const elapsed = (Date.now() - room.questionStartedAt) / 1000;
        const remaining = Math.max(0, room.settings.seconds - elapsed);
        const gain = 3 * others.length;
        await sSet(speedChronoKey(code, room.currentIndex, pid), { deadline: Date.now() + (remaining + gain) * 1000 });
        for (const o of others) {
          await sSet(speedChronoKey(code, room.currentIndex, o.id), { deadline: Date.now() + Math.max(0, remaining - 3) * 1000 });
        }
      })();
    }
  }

  useEffect(() => {
    if (jokerUsed?.id !== "copieur" || submitted || copyPeek !== null) return;
    let stop = false;
    const t = setInterval(async () => {
      const a = await sGet(answerKey(code, room.currentIndex, jokerUsed.targetId));
      if (stop || !a) return;
      clearInterval(t);
      setCopyPeek(a.value);
    }, 700);
    return () => { stop = true; clearInterval(t); };
  }, [jokerUsed, submitted, copyPeek, code, room.currentIndex]);

  useEffect(() => {
    if (jokerUsed?.id !== "sondage" || q.type !== "qcm" || submitted) return;
    let stop = false;
    const t = setInterval(async () => {
      const keys = await sList(`qz:${code}:answer:${room.currentIndex}:`);
      const answers = (await Promise.all(keys.map((k) => sGet(k)))).filter(Boolean);
      if (stop) return;
      const counts = q.options.map((_, i) => answers.filter((a) => a.value === i).length);
      setPollData({ counts, total: answers.length });
    }, 800);
    return () => { stop = true; clearInterval(t); };
  }, [jokerUsed, q, submitted, code, room.currentIndex]);

  const enabledJokers = JOKERS.filter((j) => assignedJokers.includes(j.id) && !usedJokersEver.includes(j.id) && (j.id !== "5050" || q.type === "qcm") && (j.id !== "sondage" || q.type === "qcm"));

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs opacity-60">Q{room.currentIndex + 1}/{room.questions.length}</span>
        <span style={{ fontFamily: F.mono, fontSize: 20, color: left <= 5 ? C.pink : C.gold }}>{left}s</span>
      </div>
      {speedDeadline != null && <p className="text-xs text-center mb-2" style={{ color: C.pink }}>{tr("timeReducedMsg")}</p>}
      <div>
        <div className="rounded-2xl p-5 mb-5" style={{ background: "rgba(255,255,255,0.06)" }}><p className="uppercase tracking-widest mb-2" style={{ fontSize: 16, fontWeight: 800, color: C.gold }}>{findCategory(q.category)?.emoji} {(() => { const c = findCategory(q.category); return c ? (c.id.startsWith("k_") ? kidsCategoryLabel(c, lang) : categoryLabel(c, lang)) : ""; })()}</p><p style={{ fontFamily: F.display, fontSize: 26 }}>{q.text}</p>{q.type === "echelle" && <p className="text-xs opacity-70 mt-1">{tr("closestWinsHint")}</p>}</div>
        {jokerUsed?.id === "copieur" && (
          <div className="rounded-xl p-3 mb-4 text-center text-sm" style={{ background: "rgba(255,201,60,0.1)", color: C.gold }}>
            {copyPeek === null ? tr("waitingForTargetAnswer").replace("{name}", jokerUsed.targetPseudo || tr("yourTargetFallback")) : tr("targetAnswered").replace("{name}", jokerUsed.targetPseudo || tr("yourTargetFallbackCap")).replace("{value}", q.type === "qcm" ? q.options[copyPeek] : q.type === "vf" ? (copyPeek ? tr("trueLabel") : tr("falseLabel")) : q.type === "carte" ? MAP_ZONES.find((z) => z.id === copyPeek)?.label : copyPeek)}
          </div>
        )}
        {!submitted && left > 0 && (
          <>
            {q.type === "qcm" && (<div className="grid grid-cols-1 gap-3 mb-5">{q.options.map((o, i) => hiddenOptions.includes(i) ? null : (<button key={i} onClick={() => submit(i)} className="rounded-xl py-3 px-4 text-left flex items-center justify-between" style={{ background: "rgba(255,255,255,0.08)", fontFamily: F.body, fontWeight: 700, fontSize: 17 }}><span>{o}</span>{pollData && pollData.total > 0 && <span className="text-sm opacity-70" style={{ fontFamily: F.mono }}>{Math.round((pollData.counts[i] / pollData.total) * 100)}%</span>}</button>))}</div>)}
            {q.type === "vf" && (<div className="flex gap-3 mb-5"><button onClick={() => submit(true)} className="flex-1 rounded-xl py-4" style={{ background: C.teal, color: "#1B1030", fontFamily: F.display, fontSize: 18 }}>{tr("trueLabel")}</button><button onClick={() => submit(false)} className="flex-1 rounded-xl py-4" style={{ background: C.pink, color: "#1B1030", fontFamily: F.display, fontSize: 18 }}>{tr("falseLabel")}</button></div>)}
            {q.type === "carte" && (<div className="relative rounded-xl mb-5" style={{ width: "100%", height: 200, background: "rgba(255,255,255,0.06)" }}>{MAP_ZONES.map((z) => (<button key={z.id} onClick={() => submit(z.id)} className="absolute rounded-full px-2 py-1 text-xs" style={{ left: `${z.x}%`, top: `${z.y}%`, transform: "translate(-50%,-50%)", background: "rgba(255,255,255,0.15)" }}><MapPin size={12} className="inline mr-1" />{z.label}</button>))}</div>)}
            {q.type === "echelle" && (<div className="mb-5"><div className="flex items-center justify-center gap-3 mb-4"><button onClick={() => setScaleVal((v) => Number(v) - 1)} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Minus size={16} /></button><input type="number" inputMode="decimal" value={scaleVal} onFocus={() => { if (scaleVal === 0) setScaleVal(""); }} onChange={(e) => setScaleVal(e.target.value === "" ? "" : Number(e.target.value))} className="text-center rounded-xl px-4 py-2" style={{ fontFamily: F.mono, fontSize: 28, color: C.cream, background: "rgba(255,255,255,0.08)", border: "2px solid rgba(255,255,255,0.2)", width: 140 }} /><button onClick={() => setScaleVal((v) => Number(v) + 1)} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Plus size={16} /></button></div><BigButton onClick={() => submit(scaleVal === "" ? 0 : scaleVal)} color={C.gold}>{tr("validate")}</BigButton></div>)}
            {!pickingTargetFor && (enabledJokers.length > 0 ? (
              <div className="mt-4">
                <p className="text-xs opacity-60 mb-2 text-center">{tr("availableJokers")}</p>
                <div className="grid grid-cols-2 gap-3">
                  {enabledJokers.map((j) => (
                    <button key={j.id} disabled={!!jokerUsed} onClick={() => useJoker(j.id)} className="rounded-2xl py-3 px-3 flex flex-col items-center gap-1 disabled:opacity-30 transition-transform active:scale-95" style={{ background: jokerUsed?.id === j.id ? C.violet : "rgba(255,255,255,0.1)", border: "2px solid rgba(255,255,255,0.15)" }}>
                      <j.icon size={22} />
                      <span style={{ fontFamily: F.display, fontSize: 14 }}>{jokerLabel(j, lang)}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs opacity-40 mt-4 text-center">
                {assignedJokers.length === 0 ? tr("noJokerThisGame") : tr("alreadyUsedAll")}
              </p>
            ))}
            {pickingTargetFor && (
              <div className="mt-4 rounded-2xl p-3" style={{ background: "rgba(123,78,255,0.12)", border: `2px solid ${C.violet}` }}>
                <p className="text-sm opacity-80 mb-2 text-center">{tr("chooseTarget")} {tr("chooseTargetHint")}</p>
                <div className="flex flex-wrap gap-3 justify-center">{otherPlayers.map((p) => (<button key={p.id} onClick={() => confirmTarget(p.id)} className="flex flex-col items-center gap-1"><div className="rounded-full flex items-center justify-center" style={{ width: 52, height: 52, background: "rgba(255,255,255,0.08)", fontSize: 26 }}>{p.animal}</div><span className="text-xs">{p.pseudo}</span></button>))}</div>
                <div className="mt-3 text-center"><GhostButton onClick={() => setPickingTargetFor(null)} small>{tr("cancel")}</GhostButton></div>
              </div>
            )}
          </>
        )}
      </div>
      {(submitted || left === 0) && !revealed && (
        <div className="text-center mt-6 opacity-90">
          <p style={{ fontFamily: F.display, fontSize: 20 }}>{submitted ? tr("answerSubmitted") : tr("timeUp")}</p>
          <p className="text-sm mt-1 opacity-70">{tr("waitingOthers")}</p>
          {targeters.length > 0 && (
            <p className="text-sm mt-3 rounded-xl py-2 px-3 inline-block" style={{ background: "rgba(255,61,127,0.15)", color: C.pink }}>
              {tr("targetedByMsg").replace("{names}", targeters.join(", ")).replace("{verb}", targeters.length > 1 ? tr("targetedVerbPlural") : tr("targetedVerbSingular"))}
            </p>
          )}
        </div>
      )}
      {revealed && (
        <div className="mt-6">
          <div className="text-center mb-4">
            <p style={{ fontFamily: F.display, fontSize: 26, color: myPoints > 0 ? C.teal : myPoints < 0 ? C.pink : C.cream }}>{myPoints > 0 ? `+${myPoints}` : myPoints} pts</p>
            {q.type === "echelle" && <p className="text-sm opacity-70 mt-1">{lang === "en" ? `Answer: ${q.answer} ${q.unit || ""}` : `Réponse : ${q.answer} ${q.unit || ""}`}</p>}
            {targeters.length > 0 && (
              <p className="text-sm mt-3 rounded-xl py-2 px-3 inline-block" style={{ background: "rgba(255,61,127,0.15)", color: C.pink }}>
                {tr("targetedByMsg").replace("{names}", targeters.join(", ")).replace("{verb}", targeters.length > 1 ? tr("targetedVerbPlural") : tr("targetedVerbSingular"))}
              </p>
            )}
          </div>
          {allAnswers.length > 0 && (
            <div className="rounded-2xl p-4 mb-4" style={{ background: "rgba(255,255,255,0.05)" }}>
              <p className="text-sm font-bold mb-2 opacity-70">{tr("playerAnswersTitle")}</p>
              <div className="flex flex-col gap-2">
                {allAnswers.map((a) => {
                  const label = q.type === "qcm" ? (q.options[a.value] ?? "?") : q.type === "vf" ? (a.value ? tr("trueLabel") : tr("falseLabel")) : q.type === "carte" ? (MAP_ZONES.find((z) => z.id === a.value)?.label || "?") : String(a.value);
                  return (
                    <div key={a.pid} className="flex items-center gap-2 text-sm" style={{ fontWeight: a.pid === pid ? 800 : 400 }}>
                      <span>{a.animal}</span>
                      <span className="flex-1">{a.pseudo}{a.pid === pid ? tr("you") : ""}</span>
                      <span style={{ color: a.correct ? C.teal : C.pink, fontWeight: 700 }}>{label}</span>
                      <span style={{ fontFamily: F.mono, fontSize: 13, color: a.points > 0 ? C.teal : a.points < 0 ? C.pink : "rgba(255,255,255,0.4)", minWidth: 54, textAlign: "right" }}>{a.points > 0 ? `+${a.points}` : a.points} pts</span>
                      {a.correct ? <Check size={16} color={C.teal} /> : <span style={{ color: C.pink }}>✕</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {provisional.length > 0 && (
            <div className="rounded-2xl p-4" style={{ background: "rgba(255,201,60,0.08)" }}>
              <p className="text-sm font-bold mb-2" style={{ color: C.gold }}>{tr("provisionalRanking")}</p>
              <div className="flex flex-col gap-1">
                {provisional.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-2 text-sm" style={{ fontWeight: p.id === pid ? 800 : 400 }}>
                    <span className="opacity-60" style={{ width: 20 }}>{i + 1}.</span>
                    <span>{p.animal}</span>
                    <span className="flex-1">{p.pseudo}{p.id === pid ? tr("you") : ""}</span>
                    <RankBadge change={p.rankChange} />
                    <span style={{ fontFamily: F.mono, color: C.teal }}>{p.score}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

function PlayerGame(props) {
  return (
    <Stage>
      <PlayerGameCore {...props} />
    </Stage>
  );
}

/* ---------------------------------------------------------
   RESULTS
--------------------------------------------------------- */
function Results({ code, room, isAdmin, onRestart, onPlayAgain }) {
  const { t: tr } = useLang();
  const [ranking, setRanking] = useState([]);
  const teamsMode = room?.settings?.teamsMode || 1;
  useEffect(() => { (async () => { const pKeys = await sList(`qz:${code}:player:`); const players = (await Promise.all(pKeys.map((k) => sGet(k)))).filter(Boolean); const withScores = await Promise.all(players.map(async (p) => ({ ...p, score: (await sGet(scoreKey(code, p.id))) || 0, time: (await sGet(timeKey(code, p.id))) || 0, killer: (await sGet(killerKey(code, p.id))) || 0, victim: (await sGet(victimKey(code, p.id))) || 0 }))); withScores.sort((a, b) => b.score - a.score || a.time - b.time); setRanking(withScores); })(); }, [code]);
  const medals = ["🥇", "🥈", "🥉"];

  const topKiller = ranking.length ? ranking.reduce((a, b) => (b.killer > a.killer ? b : a), ranking[0]) : null;
  const topVictim = ranking.length ? ranking.reduce((a, b) => (b.victim > a.victim ? b : a), ranking[0]) : null;
  const awards = (
    <>
      {(topKiller?.killer > 0 || topVictim?.victim > 0) && (
        <div className="flex flex-col gap-3 mt-6">
          {topKiller?.killer > 0 && (
            <div className="rounded-xl p-3 flex items-center gap-3" style={{ background: "rgba(255,61,127,0.12)" }}>
              <span style={{ fontSize: 26 }}>🔪</span>
              <div className="flex-1"><p style={{ fontFamily: F.display, fontSize: 16, color: C.pink, textTransform: "uppercase" }}>{tr("serialKiller")}</p><p className="text-xs opacity-70">{topKiller.animal} {topKiller.pseudo} — {topKiller.killer} {tr("pointsStolen")}</p></div>
            </div>
          )}
          {topVictim?.victim > 0 && (
            <div className="rounded-xl p-3 flex items-center gap-3" style={{ background: "rgba(123,78,255,0.12)" }}>
              <span style={{ fontSize: 26 }}>💀</span>
              <div className="flex-1"><p style={{ fontFamily: F.display, fontSize: 16, color: C.violet, textTransform: "uppercase" }}>{tr("victimAward")}</p><p className="text-xs opacity-70">{topVictim.animal} {topVictim.pseudo} — {topVictim.victim} {tr("pointsSuffered")}</p></div>
            </div>
          )}
        </div>
      )}
    </>
  );

  if (teamsMode > 1) {
    const teams = {};
    ranking.forEach((p) => { teams[p.team] = teams[p.team] || { team: p.team, score: 0, members: [] }; teams[p.team].score += p.score; teams[p.team].members.push(p); });
    const teamList = Object.values(teams).sort((a, b) => b.score - a.score);
    return (
      <Stage>
        {teamList.length > 0 && <FallingEmojis emojis={["🎉", "🎊", "✨", "🥳"]} side="left" count={20} />}
        {teamList.length > 1 && <FallingEmojis emojis={["💩"]} side="right" count={16} />}
        <div style={{ position: "relative", zIndex: 10 }}>
          <Logo />
          <h2 className="text-center mb-6" style={{ fontFamily: F.display, fontSize: 26, color: C.gold }}><Trophy className="inline mb-1 mr-2" /> {tr("teamRanking")}</h2>
          <div className="flex flex-col gap-3">
            {teamList.map((t, i) => (
              <div key={t.team} className="rounded-xl p-3" style={{ background: i === 0 ? "rgba(255,201,60,0.15)" : "rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-3 mb-2"><span style={{ fontSize: 22 }}>{medals[i] || `${i + 1}.`}</span><span className="flex-1" style={{ fontFamily: F.display, fontSize: 18 }}>{tr("teamWord")} {t.team}</span><span style={{ fontFamily: F.mono, fontSize: 18, color: C.teal }}>{t.score}</span></div>
                <div className="flex gap-2 flex-wrap pl-2">{t.members.map((m) => (<span key={m.id} className="text-lg" title={m.pseudo}>{m.animal}</span>))}</div>
              </div>
            ))}
          </div>
          {awards}
          {isAdmin && <div className="mt-8 flex flex-col gap-3"><BigButton onClick={onPlayAgain} color={C.teal} icon={RefreshCw}>{tr("replaySame")}</BigButton><GhostButton onClick={onRestart}>{tr("newGameHome")}</GhostButton></div>}
        </div>
      </Stage>
    );
  }

  return (
    <Stage>
      {ranking.length > 0 && <FallingEmojis emojis={["🎉", "🎊", "✨", "🥳"]} side="left" count={20} />}
      {ranking.length > 1 && <FallingEmojis emojis={["💩"]} side="right" count={16} />}
      <div style={{ position: "relative", zIndex: 10 }}>
        <Logo />
        <h2 className="text-center mb-6" style={{ fontFamily: F.display, fontSize: 26, color: C.gold }}><Trophy className="inline mb-1 mr-2" /> {tr("finalRanking")}</h2>
        <div className="flex flex-col gap-3">
          {ranking.map((p, i) => (<div key={p.id} className="flex items-center gap-3 rounded-xl p-3" style={{ background: i === 0 ? "rgba(255,201,60,0.15)" : "rgba(255,255,255,0.06)" }}><span style={{ fontSize: 22, width: 32 }}>{medals[i] || `${i + 1}.`}</span><span style={{ fontSize: 28 }}>{p.animal}</span><span className="flex-1" style={{ fontFamily: F.body, fontWeight: 700 }}>{p.pseudo}</span><span style={{ fontFamily: F.mono, fontSize: 18, color: C.teal }}>{p.score}</span></div>))}
          {ranking.length === 0 && <p className="text-center opacity-60">{tr("calculating")}</p>}
        </div>
        {awards}
        {isAdmin && <div className="mt-8 flex flex-col gap-3"><BigButton onClick={onPlayAgain} color={C.teal} icon={RefreshCw}>{tr("replaySame")}</BigButton><GhostButton onClick={onRestart}>{tr("newGameHome")}</GhostButton></div>}
      </div>
    </Stage>
  );
}

/* ---------------------------------------------------------
   MATCH AMOR — élimination progressive
--------------------------------------------------------- */
function CreateMatchAmor({ onCreated, onBack }) {
  const { lang, t: tr } = useLang();
  const [cats, setCats] = useState(["animaux", "geo", "films"]);
  const [seconds, setSeconds] = useState(15);
  const [kidsMode, setKidsMode] = useState(false);
  const [hostPlays, setHostPlays] = useState(false);
  const [hostAnimal, setHostAnimal] = useState(null);
  const [hostPseudo, setHostPseudo] = useState("");

  async function create() {
    const catOptions = kidsMode ? KIDS_CATEGORIES : CATEGORIES;
    const catIds = cats.length ? cats : catOptions.map((c) => c.id);
    const pool = pickQuestions(catIds, 300, kidsMode ? KIDS_QB : QB);
    const code = genCode();
    const state = { mode: "matchamor", phase: "lobby", code, settings: { seconds, teamsMode: 1, kidsMode, hostPlays }, pool, currentIndex: 0, questionStartedAt: null, alive: [], createdAt: Date.now() };
    await sSet(roomKey(code), state);
    let hostPid = null;
    if (hostPlays && hostAnimal) {
      hostPid = uid();
      const pseudo = hostPseudo.trim() || (lang === "en" ? "The host" : "L'hôte");
      await sSet(playerKey(code, hostPid), { id: hostPid, pseudo, animal: hostAnimal, team: 1, joinedAt: Date.now() });
      await sSet(scoreKey(code, hostPid), 0);
    }
    onCreated(code, state, hostPid);
  }

  return (
    <Stage wide>
      <ScreenHeader title={tr("matchAmorSettingsTitle")} onBack={onBack} color={C.pink} />
      <p className="text-sm opacity-70 mb-4 text-center">{tr("matchAmorIntro")}</p>

      <SettingSection number={1} icon="🎯" title={tr("categoriesLabel")} color={C.teal}>
        <CategoryPicker cats={cats} setCats={setCats} kidsMode={kidsMode} setKidsMode={setKidsMode} hideTitle />
      </SettingSection>

      <SettingSection number={2} icon="⏱️" title={tr("secondsPerQuestionLabel")} color={C.gold}>
        <div className="flex items-center gap-3">
          <button onClick={() => setSeconds((n) => Math.max(10, n - 5))} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Minus size={16} /></button>
          <span style={{ fontFamily: F.mono, fontSize: 22 }}>{seconds}s</span>
          <button onClick={() => setSeconds((n) => Math.min(60, n + 5))} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Plus size={16} /></button>
        </div>
      </SettingSection>

      <SettingSection number={3} icon="🎤" title={tr("hostPlaysLabel")} color={C.teal}>
        <div className="flex flex-wrap gap-2 mb-3">
          <Chip active={!hostPlays} onClick={() => setHostPlays(false)}>{tr("hostPlaysNo")}</Chip>
          <Chip active={hostPlays} onClick={() => setHostPlays(true)}>{tr("hostPlaysYes")}</Chip>
        </div>
        {hostPlays && (
          <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.05)" }}>
            <div className="flex gap-2 mb-3">
              <input value={hostPseudo} onChange={(e) => setHostPseudo(e.target.value)} placeholder={tr("hostPseudoPlaceholder")} className="flex-1 rounded-xl px-4 py-2" style={{ background: "rgba(255,255,255,0.08)", color: C.cream, border: "2px solid rgba(255,255,255,0.15)" }} />
              <button onClick={() => setHostPseudo(funPseudo(hostPseudo))} className="rounded-xl px-3" style={{ background: C.gold }}><Sparkles size={18} color="#1B1030" /></button>
            </div>
            <AvatarPicker animal={hostAnimal} onPick={setHostAnimal} taken={[]} />
          </div>
        )}
      </SettingSection>

      <div className="mt-6">
        <BigButton onClick={create} color={C.pink} icon={Skull} disabled={hostPlays && !hostAnimal}>{tr("createMatchAmorRoom")}</BigButton>
      </div>
    </Stage>
  );
}

function MatchAmorAdminGame({ code, room, onRoomChange, onFinished, hostPid }) {
  const { lang, t: tr } = useLang();
  const q = room.pool[room.currentIndex % room.pool.length];
  const left = useCountdown(room.questionStartedAt, room.settings.seconds);
  const [revealed, setRevealed] = useState(false);
  const [eliminatedThisRound, setEliminatedThisRound] = useState([]);
  const [pendingAlive, setPendingAlive] = useState(null);
  const [allPlayers, setAllPlayers] = useState([]);
  const [hostSubmitted, setHostSubmitted] = useState(false);
  const [hostScaleVal, setHostScaleVal] = useState(0);
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

  useEffect(() => { setRevealed(false); setPendingAlive(null); setEliminatedThisRound([]); advancingRef.current = false; setHostSubmitted(false); setHostScaleVal(0); }, [room.currentIndex]);
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
  const catLabelText = cat ? (cat.id.startsWith("k_") ? kidsCategoryLabel(cat, lang) : categoryLabel(cat, lang)) : "";
  const eliminatedPlayers = allPlayers.filter((p) => eliminatedThisRound.includes(p.id));

  return (
    <Stage wide>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm opacity-60"><Skull size={14} className="inline mr-1" /> {room.alive.length} {tr("inRace")}</span>
        <span className="flex items-center gap-1" style={{ fontFamily: F.mono, fontSize: 20, color: left <= 5 ? C.pink : C.gold }}><Clock size={18} /> {left}s</span>
      </div>
      <div className="rounded-3xl p-8 mb-6 text-center" style={{ background: "rgba(255,255,255,0.06)" }}>
        <p className="uppercase tracking-widest mb-3" style={{ fontSize: 20, fontWeight: 800, color: C.gold }}>{cat?.emoji} {catLabelText}</p>
        <p style={{ fontFamily: F.display, fontSize: 32 }}>{q.text}</p>
        {q.type === "echelle" && !revealed && <p className="text-sm opacity-70 mt-3">{tr("closestWinsHint")}</p>}
        {revealed && (
          <div className="mt-6">
            {q.type === "echelle" ? (
              <p style={{ fontFamily: F.mono, fontSize: 24, color: C.teal }}>{tr("answerColonLabel")} {q.answer} {q.unit || ""}</p>
            ) : (
              <p style={{ fontFamily: F.mono, fontSize: 22, color: C.teal }}>
                {tr("correctAnswerIs")} {q.type === "qcm" ? q.options[q.answer] : q.type === "vf" ? (q.answer ? tr("trueLabel") : tr("falseLabel")) : MAP_ZONES.find((z) => z.id === q.answer)?.label}
              </p>
            )}
            {eliminatedPlayers.length > 0 ? (
              <div className="mt-4">
                <p className="text-sm opacity-70 mb-2">{tr("eliminatedLabel")}</p>
                <div className="flex gap-2 justify-center flex-wrap">{eliminatedPlayers.map((p) => (<span key={p.id} className="text-sm rounded-full px-3 py-1" style={{ background: "rgba(255,61,127,0.2)" }}>{p.animal} {p.pseudo}</span>))}</div>
              </div>
            ) : (
              <p className="text-sm opacity-70 mt-4">{tr("noOneEliminated")}</p>
            )}
          </div>
        )}
      </div>
      {hostPid && room.alive.includes(hostPid) && !revealed && (
        <div className="rounded-2xl p-4 mb-6" style={{ background: "rgba(255,255,255,0.05)", border: `2px solid ${C.violet}` }}>
          <p className="text-sm font-bold mb-3" style={{ color: C.violet }}>{tr("hostAnswerTitle")}</p>
          {hostSubmitted ? (
            <p className="text-sm opacity-70">{tr("answerSubmitted")}</p>
          ) : (
            <QuestionInput
              q={q}
              scaleVal={hostScaleVal}
              setScaleVal={setHostScaleVal}
              onSubmit={async (value) => { setHostSubmitted(true); await sSet(answerKey(code, room.currentIndex, hostPid), { pid: hostPid, value, submittedAt: Date.now() }); }}
            />
          )}
        </div>
      )}
      {revealed ? (<BigButton onClick={next} color={C.pink} icon={ArrowRight}>{(pendingAlive || room.alive).length <= 1 ? tr("seeWinner") : tr("nextQuestion")}</BigButton>) : (<BigButton onClick={collect} color={C.violet}>{tr("revealNow")}</BigButton>)}
    </Stage>
  );
}

function PlayerMatchAmor({ code, pid, room }) {
  const { lang, t: tr } = useLang();
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
        <p style={{ fontFamily: F.display, fontSize: 22 }}>{tr("eliminatedScreenTitle")}</p>
        <p className="text-sm opacity-70 mt-2">{tr("eliminatedScreenHint").replace("{n}", room.alive.length)}</p>
      </div>
    </Stage>
  );

  return (
    <Stage>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs opacity-60">{room.alive.length} {tr("inRace")}</span>
        <span style={{ fontFamily: F.mono, fontSize: 20, color: left <= 5 ? C.pink : C.gold }}>{left}s</span>
      </div>
      <div className="rounded-2xl p-5 mb-5" style={{ background: "rgba(255,255,255,0.06)" }}><p className="uppercase tracking-widest mb-2" style={{ fontSize: 16, fontWeight: 800, color: C.gold }}>{findCategory(q.category)?.emoji} {(() => { const c = findCategory(q.category); return c ? (c.id.startsWith("k_") ? kidsCategoryLabel(c, lang) : categoryLabel(c, lang)) : ""; })()}</p><p style={{ fontFamily: F.display, fontSize: 26 }}>{q.text}</p>{q.type === "echelle" && <p className="text-xs opacity-70 mt-1">{tr("closestWinsHint")}</p>}</div>
      {!submitted && left > 0 ? (
        <QuestionInput q={q} onSubmit={submit} scaleVal={scaleVal} setScaleVal={setScaleVal} />
      ) : (
        <div className="text-center mt-6 opacity-70"><p style={{ fontFamily: F.display, fontSize: 20 }}>{submitted ? tr("answerSubmitted") : tr("timeUp")}</p><p className="text-sm mt-1">{tr("suspenseMsg")}</p></div>
      )}
    </Stage>
  );
}

function MatchAmorResults({ code, room, isAdmin, onRestart }) {
  const { t: tr } = useLang();
  const [winner, setWinner] = useState(null);
  useEffect(() => { (async () => { if (room.winnerId) { const p = await sGet(playerKey(code, room.winnerId)); setWinner(p); } })(); }, [code, room.winnerId]);
  return (
    <Stage>
      <Logo />
      <div className="text-center mt-6">
        <Trophy size={44} className="mx-auto mb-3" color={C.gold} />
        <p style={{ fontFamily: F.display, fontSize: 26, color: C.gold }}>{tr("winnerTitle")}</p>
        {winner ? (
          <div className="flex flex-col items-center gap-2 mt-4">
            <span style={{ fontSize: 56 }}>{winner.animal}</span>
            <span style={{ fontFamily: F.display, fontSize: 22 }}>{winner.pseudo}</span>
          </div>
        ) : <p className="opacity-60 mt-4">{tr("calculatingSimple")}</p>}
      </div>
      {isAdmin && <div className="mt-8"><BigButton onClick={onRestart} color={C.violet} icon={RefreshCw}>{tr("newGameHome")}</BigButton></div>}
    </Stage>
  );
}

/* ---------------------------------------------------------
   BLIND TEST
--------------------------------------------------------- */
function CreateBlindTest({ onCreated, onBack }) {
  const { lang, t: tr } = useLang();
  const [cats, setCats] = useState(["annees2000blind", "rapfr"]);
  const [nbTracks, setNbTracks] = useState(10);
  const [seconds, setSeconds] = useState(15);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hostPlays, setHostPlays] = useState(false);
  const [hostAnimal, setHostAnimal] = useState(null);
  const [hostPseudo, setHostPseudo] = useState("");
  const allCatsSelected = BLIND_CATEGORIES.every((c) => cats.includes(c.id));

  function toggleCat(id) { setCats((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id])); }
  function toggleAllCats() { setCats(allCatsSelected ? [] : BLIND_CATEGORIES.map((c) => c.id)); }

  async function create() {
    if (cats.length === 0) return setError(tr("chooseCategoryError"));
    setLoading(true);
    setError("");
    const tracks = await pickBlindTracks(cats, nbTracks);
    setLoading(false);
    if (tracks.length < 3) return setError(tr("notEnoughTracks"));
    const code = genCode();
    const state = { mode: "blindtest", phase: "lobby", code, settings: { seconds, effect: "normal", questionTypes: ["titre", "artiste", "annee", "origine", "trivia"], hostPlays }, tracks, currentIndex: -1, questionStartedAt: null, createdAt: Date.now() };
    await sSet(roomKey(code), state);
    let hostPid = null;
    if (hostPlays && hostAnimal) {
      hostPid = uid();
      const pseudo = hostPseudo.trim() || (lang === "en" ? "The host" : "L'hôte");
      await sSet(playerKey(code, hostPid), { id: hostPid, pseudo, animal: hostAnimal, team: 1, joinedAt: Date.now() });
      await sSet(scoreKey(code, hostPid), 0);
    }
    onCreated(code, state, hostPid);
  }

  return (
    <Stage wide>
      <ScreenHeader title="🎧 Blind Test — réglages" onBack={onBack} color={C.violet} />

      <SettingSection number={1} icon="🎵" title={tr("musicCategoriesLabel")} color={C.teal}>
        <div className="flex justify-end mb-2">
          <GhostButton onClick={toggleAllCats} small>{allCatsSelected ? tr("uncheckAll") : tr("checkAll")}</GhostButton>
        </div>
        <div className="grid grid-cols-2 gap-2">{BLIND_CATEGORIES.map((c) => (<Chip key={c.id} active={cats.includes(c.id)} onClick={() => toggleCat(c.id)}>{c.emoji} {c.label}</Chip>))}</div>
      </SettingSection>

      <SettingSection number={2} icon="⏱️" title={tr("sectionFormatTitle")} color={C.gold}>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm opacity-70 mb-2 font-bold">{tr("nbTracksLabel")}</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setNbTracks((n) => Math.max(5, n - 1))} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Minus size={16} /></button>
              <span style={{ fontFamily: F.mono, fontSize: 22 }}>{nbTracks}</span>
              <button onClick={() => setNbTracks((n) => Math.min(25, n + 1))} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Plus size={16} /></button>
            </div>
          </div>
          <div>
            <p className="text-sm opacity-70 mb-2 font-bold">{tr("secondsPerQuestionLabel")}</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setSeconds((n) => Math.max(10, n - 5))} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Minus size={16} /></button>
              <span style={{ fontFamily: F.mono, fontSize: 22 }}>{seconds}s</span>
              <button onClick={() => setSeconds((n) => Math.min(30, n + 5))} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Plus size={16} /></button>
            </div>
          </div>
        </div>
      </SettingSection>

      <SettingSection number={3} icon="🎤" title={tr("hostPlaysLabel")} color={C.teal}>
        <div className="flex flex-wrap gap-2 mb-3">
          <Chip active={!hostPlays} onClick={() => setHostPlays(false)}>{tr("hostPlaysNo")}</Chip>
          <Chip active={hostPlays} onClick={() => setHostPlays(true)}>{tr("hostPlaysYes")}</Chip>
        </div>
        {hostPlays && (
          <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.05)" }}>
            <div className="flex gap-2 mb-3">
              <input value={hostPseudo} onChange={(e) => setHostPseudo(e.target.value)} placeholder={tr("hostPseudoPlaceholder")} className="flex-1 rounded-xl px-4 py-2" style={{ background: "rgba(255,255,255,0.08)", color: C.cream, border: "2px solid rgba(255,255,255,0.15)" }} />
              <button onClick={() => setHostPseudo(funPseudo(hostPseudo))} className="rounded-xl px-3" style={{ background: C.gold }}><Sparkles size={18} color="#1B1030" /></button>
            </div>
            <AvatarPicker animal={hostAnimal} onPick={setHostAnimal} taken={[]} />
          </div>
        )}
      </SettingSection>

      {error && <p className="text-sm mb-4 text-center" style={{ color: C.pink }}>{error}</p>}
      <div className="mt-2">
        <BigButton onClick={create} color={C.violet} icon={Play} disabled={loading || (hostPlays && !hostAnimal)}>{loading ? tr("searchingTracks") : tr("createRoomBtn")}</BigButton>
      </div>
    </Stage>
  );
}

const FALLBACK_ORIGINS = ["France", "États-Unis", "Royaume-Uni", "Belgique", "Canada", "Suède"];

function BlindTestAdminGame({ code, room, onRoomChange, onFinished, hostPid }) {
  const { t: tr } = useLang();
  const track = room.tracks[room.currentIndex];
  const questionKind = useMemo(() => {
    const types = room.settings.questionTypes;
    const valid = types.filter((t) => {
      if (t === "annee") return !!track.releaseYear;
      if (t === "origine") return !!track.artistOrigin;
      if (t === "trivia") return !!(track.trivia && track.trivia.length > 0);
      return true;
    });
    const pool = valid.length > 0 ? valid : ["titre"];
    return pool[Math.floor(Math.random() * pool.length)];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room.currentIndex, track.trackName]);
  const triviaQuestion = useMemo(() => {
    if (questionKind !== "trivia" || !track.trivia || track.trivia.length === 0) return null;
    return track.trivia[Math.floor(Math.random() * track.trivia.length)];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room.currentIndex, questionKind, track.trackName]);
  const left = useCountdown(room.questionStartedAt, room.settings.seconds);
  const [answersCount, setAnswersCount] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [playerAnswers, setPlayerAnswers] = useState([]);
  const [provisional, setProvisional] = useState([]);
  const [autoLeft, setAutoLeft] = useState(7);
  const [paused, setPaused] = useState(false);
  const [options, setOptions] = useState([]);
  const [hostSubmitted, setHostSubmitted] = useState(false);
  const prevRankRef = useRef({});
  const audioRef = useRef(null);
  const advancingRef = useRef(false);

  const correctValue =
    questionKind === "trivia" ? triviaQuestion?.options[triviaQuestion.answer] :
    questionKind === "titre" ? track.trackName :
    questionKind === "artiste" ? track.artistName :
    questionKind === "annee" ? String(track.releaseYear) :
    track.artistOrigin;

  const questionLabel =
    questionKind === "trivia" ? triviaQuestion?.text :
    questionKind === "titre" ? tr("titleQuestionLabel") :
    questionKind === "artiste" ? tr("whoSingsQuestion") :
    questionKind === "annee" ? tr("whatYearQuestion") :
    tr("whereFromQuestion");

  useEffect(() => {
    if (questionKind === "trivia") {
      if (triviaQuestion) { setOptions(triviaQuestion.options); sSet(`qz:${code}:blindoptions:${room.currentIndex}`, triviaQuestion.options); }
      return;
    }
    let pool = [];
    if (questionKind === "artiste") {
      const sameType = room.tracks.filter((t, i) => i !== room.currentIndex && t.artistName !== track.artistName && (!track.artistType || t.artistType === track.artistType));
      pool = sameType.map((t) => t.artistName);
      if (pool.length < 3) pool = room.tracks.filter((t, i) => i !== room.currentIndex && t.artistName !== track.artistName).map((t) => t.artistName);
    } else if (questionKind === "titre") {
      pool = room.tracks.filter((_, i) => i !== room.currentIndex).map((t) => t.trackName);
    } else if (questionKind === "annee") {
      const years = room.tracks.filter((t, i) => i !== room.currentIndex && t.releaseYear && t.releaseYear !== track.releaseYear).map((t) => String(t.releaseYear));
      pool = years;
      while (pool.length < 3) { const fake = track.releaseYear + (Math.floor(Math.random() * 10) - 5) * (Math.random() > 0.5 ? 1 : -1); pool.push(String(fake)); }
    } else {
      const origins = room.tracks.filter((t, i) => i !== room.currentIndex && t.artistOrigin && t.artistOrigin !== track.artistOrigin).map((t) => t.artistOrigin);
      pool = [...origins, ...FALLBACK_ORIGINS.filter((o) => o !== track.artistOrigin)];
    }
    const uniquePool = [...new Set(pool)].filter((v) => v !== correctValue);
    let fillerN = 0;
    while (uniquePool.length < 3) {
      fillerN += 1;
      const filler =
        questionKind === "annee" ? String(Number(correctValue) + fillerN * 3) :
        questionKind === "origine" ? FALLBACK_ORIGINS[fillerN % FALLBACK_ORIGINS.length] :
        questionKind === "artiste" ? `Artiste mystère ${fillerN}` :
        `Titre mystère ${fillerN}`;
      if (!uniquePool.includes(filler) && filler !== correctValue) uniquePool.push(filler);
    }
    const distractors = uniquePool.sort(() => Math.random() - 0.5).slice(0, 3);
    const opts = [...distractors, correctValue].sort(() => Math.random() - 0.5);
    setOptions(opts);
    sSet(`qz:${code}:blindoptions:${room.currentIndex}`, opts);
  }, [room.currentIndex]);

  useEffect(() => {
    setRevealed(false); advancingRef.current = false; setPlayerAnswers([]); setAutoLeft(7); setProvisional([]); setHostSubmitted(false); setPaused(false);
    const t = setInterval(async () => {
      const [keys, playerKeys] = await Promise.all([sList(`qz:${code}:answer:${room.currentIndex}:`), sList(`qz:${code}:player:`)]);
      setAnswersCount(keys.length);
      if (playerKeys.length > 0 && keys.length >= playerKeys.length && !advancingRef.current) collectAndScore();
    }, 1000);
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.playbackRate = room.settings.effect === "ralenti" ? 0.7 : room.settings.effect === "accelere" ? 1.4 : 1;
      audio.play().catch(() => {});
      if (room.settings.effect === "intro") { setTimeout(() => { if (audio && !audio.paused) audio.pause(); }, 2000); }
    }
    return () => { clearInterval(t); if (audio) audio.pause(); };
  }, [room.currentIndex, code]);

  const collectAndScore = useCallback(async () => {
    if (advancingRef.current) return;
    advancingRef.current = true;
    if (audioRef.current) audioRef.current.pause();
    const answerKeys = await sList(`qz:${code}:answer:${room.currentIndex}:`);
    const answers = (await Promise.all(answerKeys.map((k) => sGet(k)))).filter(Boolean);
    const playerKeys = await sList(`qz:${code}:player:`);
    const players = (await Promise.all(playerKeys.map((k) => sGet(k)))).filter(Boolean);
    const pointsByPid = {};
    for (const a of answers) {
      const correct = a.value === correctValue;
      let pts = 0;
      if (correct) {
        const elapsed = (a.submittedAt - room.questionStartedAt) / 1000;
        const remaining = Math.max(0, room.settings.seconds - elapsed);
        pts = Math.round(50 + 50 * (room.settings.seconds > 0 ? remaining / room.settings.seconds : 0));
      }
      pointsByPid[a.pid] = pts;
      const prev = (await sGet(scoreKey(code, a.pid))) || 0;
      await sSet(scoreKey(code, a.pid), prev + pts);
    }
    const withPlayers = answers.map((a) => { const p = players.find((pp) => pp.id === a.pid); return { ...a, pseudo: p?.pseudo || "?", animal: p?.animal || "❓", correct: a.value === correctValue, points: pointsByPid[a.pid] || 0 }; });
    setPlayerAnswers(withPlayers);
    await sSet(revealDetailKey(code, room.currentIndex), withPlayers.map((a) => ({ pid: a.pid, pseudo: a.pseudo, animal: a.animal, correct: a.correct, points: a.points, value: a.value })));
    for (const p of players) { await sSet(pointsDeltaKey(code, room.currentIndex, p.id), pointsByPid[p.id] || 0); }
    await sSet(revealedKey(code, room.currentIndex), true);
    const withScores = await Promise.all(players.map(async (p) => ({ ...p, score: (await sGet(scoreKey(code, p.id))) || 0 })));
    withScores.sort((a, b) => b.score - a.score);
    setProvisional(withRankChange(withScores, prevRankRef));
    setRevealed(true);
  }, [code, room, correctValue]);

  useEffect(() => { if (left === 0 && !revealed) collectAndScore(); }, [left, revealed, collectAndScore]);

  async function next() {
    const isLast = room.currentIndex >= room.tracks.length - 1;
    if (isLast) { const nextRoom = { ...room, phase: "results" }; await sSet(roomKey(code), nextRoom); onFinished(nextRoom); }
    else { const nextRoom = { ...room, currentIndex: room.currentIndex + 1, questionStartedAt: Date.now() }; await sSet(roomKey(code), nextRoom); onRoomChange(nextRoom); }
  }

  useEffect(() => {
    if (!revealed || paused) return;
    if (autoLeft <= 0) { next(); return; }
    const t = setTimeout(() => setAutoLeft((n) => n - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed, autoLeft, paused]);

  return (
    <Stage wide>
      <audio ref={audioRef} src={track.previewUrl} />
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm opacity-60">{tr("trackWordSingular")} {room.currentIndex + 1} / {room.tracks.length}</span>
        <span className="flex items-center gap-1 text-sm opacity-60"><Users size={14} /> {answersCount} {tr("answersPluralWord")}</span>
        <span className="flex items-center gap-1" style={{ fontFamily: F.mono, fontSize: 20, color: left <= 5 ? C.pink : C.gold }}><Clock size={18} /> {left}s</span>
      </div>
      <div className="rounded-3xl p-8 mb-6 text-center" style={{ background: "rgba(255,255,255,0.06)" }}>
        <p className="uppercase tracking-widest mb-3" style={{ fontSize: 20, fontWeight: 800, color: C.gold }}>🎧 {questionLabel}</p>
        <div className="flex justify-center mb-4">
          <div className="rounded-2xl overflow-hidden" style={{ width: 160, height: 160, background: "rgba(255,255,255,0.1)", filter: revealed ? "none" : "blur(20px)", transition: "filter 0.4s" }}>
            {track.artworkUrl && <img src={track.artworkUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
          </div>
        </div>
        {revealed && <p style={{ fontFamily: F.display, fontSize: 26, color: C.teal }}>{track.trackName} — {track.artistName}</p>}
        {!revealed && <p className="text-sm opacity-60">{tr("listeningOnScreen")}</p>}
      </div>
      {!revealed && options.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-6">{options.map((o, i) => (
          room.settings.hostPlays && hostPid ? (
            <button key={i} disabled={hostSubmitted} onClick={async () => { setHostSubmitted(true); await sSet(answerKey(code, room.currentIndex, hostPid), { pid: hostPid, value: o, submittedAt: Date.now() }); }} className="rounded-xl p-3 text-center disabled:opacity-40" style={{ background: "rgba(255,255,255,0.08)", fontFamily: F.body, fontWeight: 700 }}>{o}</button>
          ) : (
            <div key={i} className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.08)", fontFamily: F.body, fontWeight: 700 }}>{o}</div>
          )
        ))}</div>
      )}
      {room.settings.hostPlays && hostPid && !revealed && (
        <p className="text-xs opacity-60 text-center mb-4">{hostSubmitted ? tr("answerSubmitted") : "🎤"}</p>
      )}
      {revealed && playerAnswers.length > 0 && (
        <div className="rounded-2xl p-4 mb-4" style={{ background: "rgba(255,255,255,0.05)" }}>
          <p className="text-sm font-bold mb-2 opacity-70">{tr("playerAnswersTitle")}</p>
          <div className="flex flex-col gap-2">
            {playerAnswers.map((a) => (
              <div key={a.pid} className="flex items-center gap-2 text-sm">
                <span>{a.animal}</span>
                <span className="flex-1">{a.pseudo}</span>
                <span style={{ color: a.correct ? C.teal : C.pink, fontWeight: 700 }}>{a.value}</span>
                <span style={{ fontFamily: F.mono, fontSize: 13, color: a.points > 0 ? C.teal : "rgba(255,255,255,0.4)", minWidth: 54, textAlign: "right" }}>{a.points > 0 ? `+${a.points}` : a.points} pts</span>
                {a.correct ? <Check size={16} color={C.teal} /> : <span style={{ color: C.pink }}>✕</span>}
              </div>
            ))}
          </div>
        </div>
      )}
      {revealed && provisional.length > 0 && (
        <div className="rounded-2xl p-4 mb-6" style={{ background: "rgba(255,201,60,0.08)" }}>
          <p className="text-sm font-bold mb-2" style={{ color: C.gold }}>{tr("provisionalRanking")}</p>
          <div className="flex flex-col gap-1">
            {provisional.map((p, i) => (
              <div key={p.id} className="flex items-center gap-2 text-sm">
                <span className="opacity-60" style={{ width: 20 }}>{i + 1}.</span>
                <span>{p.animal}</span>
                <span className="flex-1">{p.pseudo}</span>
                <RankBadge change={p.rankChange} />
                <span style={{ fontFamily: F.mono, color: C.teal }}>{p.score}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {revealed ? (
        <div className="flex flex-col gap-2">
          <BigButton onClick={next} color={C.pink} icon={ArrowRight}>{room.currentIndex >= room.tracks.length - 1 ? tr("finalRankingBtn") : paused ? tr("nextTrack") : `${tr("nextTrack")} (${autoLeft}s)`}</BigButton>
          {room.currentIndex < room.tracks.length - 1 && <GhostButton onClick={() => setPaused((v) => !v)}>{paused ? tr("resumeBtn") : tr("pauseBtn")}</GhostButton>}
        </div>
      ) : (<BigButton onClick={collectAndScore} color={C.violet}>{tr("revealNow")}</BigButton>)}
    </Stage>
  );
}

function BlindTestPlayerGame({ code, pid, room }) {
  const { t: tr } = useLang();
  const left = useCountdown(room.questionStartedAt, room.settings.seconds);
  const [submitted, setSubmitted] = useState(false);
  const [options, setOptions] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const [myPoints, setMyPoints] = useState(0);
  const [provisional, setProvisional] = useState([]);
  const [allAnswers, setAllAnswers] = useState([]);
  const prevRankRef = useRef({});

  useEffect(() => {
    setSubmitted(false); setOptions([]); setRevealed(false); setMyPoints(0); setProvisional([]); setAllAnswers([]);
    let stop = false;
    const t = setInterval(async () => {
      const opts = await sGet(`qz:${code}:blindoptions:${room.currentIndex}`);
      if (!stop && opts) { setOptions(opts); clearInterval(t); }
    }, 400);
    return () => { stop = true; clearInterval(t); };
  }, [room.currentIndex, code]);

  useEffect(() => {
    if (!(submitted || left === 0)) return;
    let stop = false;
    const t = setInterval(async () => {
      const isRevealed = await sGet(revealedKey(code, room.currentIndex));
      if (stop || !isRevealed) return;
      clearInterval(t);
      const [myDelta, playerKeys, detail] = await Promise.all([
        sGet(pointsDeltaKey(code, room.currentIndex, pid)),
        sList(`qz:${code}:player:`),
        sGet(revealDetailKey(code, room.currentIndex)),
      ]);
      setMyPoints(myDelta || 0);
      const players = (await Promise.all(playerKeys.map((k) => sGet(k)))).filter(Boolean);
      const withScores = await Promise.all(players.map(async (p) => ({ ...p, score: (await sGet(scoreKey(code, p.id))) || 0 })));
      withScores.sort((a, b) => b.score - a.score);
      setProvisional(withRankChange(withScores, prevRankRef));
      setAllAnswers(detail || []);
      setRevealed(true);
    }, 800);
    return () => { stop = true; clearInterval(t); };
  }, [submitted, left, code, room.currentIndex, pid]);

  async function submit(value) { if (submitted || left === 0) return; setSubmitted(true); await sSet(answerKey(code, room.currentIndex, pid), { pid, value, submittedAt: Date.now() }); }

  return (
    <Stage>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs opacity-60">{tr("trackWordSingular")} {room.currentIndex + 1}/{room.tracks.length}</span>
        <span style={{ fontFamily: F.mono, fontSize: 20, color: left <= 5 ? C.pink : C.gold }}>{left}s</span>
      </div>
      <div className="rounded-2xl p-5 mb-5 text-center" style={{ background: "rgba(255,255,255,0.06)" }}>
        <p style={{ fontFamily: F.display, fontSize: 22 }}>{tr("mysteryTrack")}</p>
      </div>
      {!submitted && left > 0 ? (
        options.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">{options.map((o, i) => (<button key={i} onClick={() => submit(o)} className="rounded-xl py-4 px-4 text-left" style={{ background: "rgba(255,255,255,0.08)", fontFamily: F.body, fontWeight: 700, fontSize: 17 }}>{o}</button>))}</div>
        ) : (
          <p className="text-center opacity-60 mt-6">{tr("loadingOptions")}</p>
        )
      ) : !revealed ? (
        <div className="text-center mt-6 opacity-90">
          <p style={{ fontFamily: F.display, fontSize: 20 }}>{submitted ? tr("answerSubmitted") : tr("timeUp")}</p>
          <p className="text-sm mt-1 opacity-70">{tr("waitingOthers")}</p>
        </div>
      ) : (
        <div className="mt-6">
          <p className="text-center mb-4" style={{ fontFamily: F.display, fontSize: 26, color: myPoints > 0 ? C.teal : C.cream }}>{myPoints > 0 ? `+${myPoints}` : myPoints} pts</p>
          {allAnswers.length > 0 && (
            <div className="rounded-2xl p-4 mb-4" style={{ background: "rgba(255,255,255,0.05)" }}>
              <p className="text-sm font-bold mb-2 opacity-70">{tr("playerAnswersTitle")}</p>
              <div className="flex flex-col gap-2">
                {allAnswers.map((a) => (
                  <div key={a.pid} className="flex items-center gap-2 text-sm" style={{ fontWeight: a.pid === pid ? 800 : 400 }}>
                    <span>{a.animal}</span>
                    <span className="flex-1">{a.pseudo}{a.pid === pid ? tr("you") : ""}</span>
                    <span style={{ color: a.correct ? C.teal : C.pink, fontWeight: 700 }}>{a.value}</span>
                    <span style={{ fontFamily: F.mono, fontSize: 13, color: a.points > 0 ? C.teal : "rgba(255,255,255,0.4)", minWidth: 54, textAlign: "right" }}>{a.points > 0 ? `+${a.points}` : a.points} pts</span>
                    {a.correct ? <Check size={16} color={C.teal} /> : <span style={{ color: C.pink }}>✕</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {provisional.length > 0 && (
            <div className="rounded-2xl p-4" style={{ background: "rgba(255,201,60,0.08)" }}>
              <p className="text-sm font-bold mb-2" style={{ color: C.gold }}>{tr("provisionalRanking")}</p>
              <div className="flex flex-col gap-1">
                {provisional.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-2 text-sm" style={{ fontWeight: p.id === pid ? 800 : 400 }}>
                    <span className="opacity-60" style={{ width: 20 }}>{i + 1}.</span>
                    <span>{p.animal}</span>
                    <span className="flex-1">{p.pseudo}{p.id === pid ? tr("you") : ""}</span>
                    <RankBadge change={p.rankChange} />
                    <span style={{ fontFamily: F.mono, color: C.teal }}>{p.score}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Stage>
  );
}

/* ---------------------------------------------------------
   QUITTE OU DOUBLE — enchères
--------------------------------------------------------- */
function CreateEnchere({ onCreated, onBack }) {
  const { lang, t: tr } = useLang();
  const [nbQuestions, setNbQuestions] = useState(10);
  const [bettingSeconds, setBettingSeconds] = useState(15);
  const [answerSeconds, setAnswerSeconds] = useState(20);
  const [startingPoints, setStartingPoints] = useState(10000);
  const [kidsMode, setKidsMode] = useState(false);
  const [hostPlays, setHostPlays] = useState(false);
  const [hostAnimal, setHostAnimal] = useState(null);
  const [hostPseudo, setHostPseudo] = useState("");

  async function create() {
    const bank = kidsMode ? KIDS_QB : QB;
    const catOptions = kidsMode ? KIDS_CATEGORIES : CATEGORIES;
    const questions = pickQuestions(catOptions.map((c) => c.id), nbQuestions, bank);
    const code = genCode();
    const state = {
      mode: "enchere", phase: "lobby", code,
      settings: { bettingSeconds, answerSeconds, nbQuestions, startingPoints, kidsMode, hostPlays },
      questions, currentIndex: -1, stage: "betting", stageStartedAt: null, createdAt: Date.now(),
    };
    await sSet(roomKey(code), state);
    let hostPid = null;
    if (hostPlays && hostAnimal) {
      hostPid = uid();
      const pseudo = hostPseudo.trim() || (lang === "en" ? "The host" : "L'hôte");
      await sSet(playerKey(code, hostPid), { id: hostPid, pseudo, animal: hostAnimal, team: 1, joinedAt: Date.now() });
      await sSet(scoreKey(code, hostPid), startingPoints);
    }
    onCreated(code, state, hostPid);
  }

  return (
    <Stage wide>
      <ScreenHeader title="💰 Quitte ou Double — réglages" onBack={onBack} color={C.gold} />

      <SettingSection number={1} icon="🎈" title={tr("kidsMode")} color={C.teal}>
        <Chip active={kidsMode} onClick={() => setKidsMode((v) => !v)}>{tr("kidsMode")}</Chip>
      </SettingSection>

      <SettingSection number={2} icon="⏱️" title={tr("sectionFormatTitle")} color={C.gold}>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm opacity-70 mb-2 font-bold">{tr("nbQuestionsLabel")}</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setNbQuestions((n) => Math.max(5, n - 1))} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Minus size={16} /></button>
              <span style={{ fontFamily: F.mono, fontSize: 22 }}>{nbQuestions}</span>
              <button onClick={() => setNbQuestions((n) => Math.min(25, n + 1))} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Plus size={16} /></button>
            </div>
          </div>
          <div>
            <p className="text-sm opacity-70 mb-2 font-bold">{tr("startingCapitalLabel")}</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setStartingPoints((n) => Math.max(1000, n - 1000))} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Minus size={16} /></button>
              <span style={{ fontFamily: F.mono, fontSize: 22 }}>{startingPoints}</span>
              <button onClick={() => setStartingPoints((n) => Math.min(50000, n + 1000))} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Plus size={16} /></button>
            </div>
          </div>
          <div>
            <p className="text-sm opacity-70 mb-2 font-bold">{tr("bettingSecondsLabel")}</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setBettingSeconds((n) => Math.max(10, n - 5))} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Minus size={16} /></button>
              <span style={{ fontFamily: F.mono, fontSize: 22 }}>{bettingSeconds}s</span>
              <button onClick={() => setBettingSeconds((n) => Math.min(60, n + 5))} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Plus size={16} /></button>
            </div>
          </div>
          <div>
            <p className="text-sm opacity-70 mb-2 font-bold">{tr("answerSecondsLabel")}</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setAnswerSeconds((n) => Math.max(10, n - 5))} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Minus size={16} /></button>
              <span style={{ fontFamily: F.mono, fontSize: 22 }}>{answerSeconds}s</span>
              <button onClick={() => setAnswerSeconds((n) => Math.min(60, n + 5))} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Plus size={16} /></button>
            </div>
          </div>
        </div>
      </SettingSection>

      <SettingSection number={3} icon="🎤" title={tr("hostPlaysLabel")} color={C.teal}>
        <div className="flex flex-wrap gap-2 mb-3">
          <Chip active={!hostPlays} onClick={() => setHostPlays(false)}>{tr("hostPlaysNo")}</Chip>
          <Chip active={hostPlays} onClick={() => setHostPlays(true)}>{tr("hostPlaysYes")}</Chip>
        </div>
        {hostPlays && (
          <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.05)" }}>
            <div className="flex gap-2 mb-3">
              <input value={hostPseudo} onChange={(e) => setHostPseudo(e.target.value)} placeholder={tr("hostPseudoPlaceholder")} className="flex-1 rounded-xl px-4 py-2" style={{ background: "rgba(255,255,255,0.08)", color: C.cream, border: "2px solid rgba(255,255,255,0.15)" }} />
              <button onClick={() => setHostPseudo(funPseudo(hostPseudo))} className="rounded-xl px-3" style={{ background: C.gold }}><Sparkles size={18} color="#1B1030" /></button>
            </div>
            <AvatarPicker animal={hostAnimal} onPick={setHostAnimal} taken={[]} />
          </div>
        )}
      </SettingSection>

      <div className="mt-6">
        <BigButton onClick={create} color={C.gold} icon={Play} disabled={hostPlays && !hostAnimal}>{tr("createRoomBtn")}</BigButton>
      </div>
    </Stage>
  );
}

function EnchereAdminGame({ code, room, onRoomChange, onFinished, hostPid }) {
  const { lang, t: tr } = useLang();
  const q = room.questions[room.currentIndex];
  const stage = room.stage;
  const left = useCountdown(room.stageStartedAt, stage === "betting" ? room.settings.bettingSeconds : room.settings.answerSeconds);
  const [activeCount, setActiveCount] = useState(0);
  const [readyCount, setReadyCount] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [roundResults, setRoundResults] = useState([]);
  const [hostScore, setHostScore] = useState(null);
  const [hostBetVal, setHostBetVal] = useState(0);
  const [hostBetSubmitted, setHostBetSubmitted] = useState(false);
  const [hostAnswerSubmitted, setHostAnswerSubmitted] = useState(false);
  const prevRankRef = useRef({});
  const advancingRef = useRef(false);
  const hint = DIFFICULTY_HINT[q.type] || DIFFICULTY_HINT.qcm;

  const getActivePlayers = useCallback(async () => {
    const keys = await sList(`qz:${code}:player:`);
    const players = (await Promise.all(keys.map((k) => sGet(k)))).filter(Boolean);
    const withScores = await Promise.all(players.map(async (p) => ({ ...p, score: (await sGet(scoreKey(code, p.id))) || 0 })));
    return withScores.filter((p) => p.score > 0);
  }, [code]);

  const advanceToAnswering = useCallback(async () => {
    if (advancingRef.current) return;
    advancingRef.current = true;
    const nextRoom = { ...room, stage: "answering", stageStartedAt: Date.now() };
    await sSet(roomKey(code), nextRoom);
    onRoomChange(nextRoom);
  }, [code, room, onRoomChange]);

  const collectResults = useCallback(async () => {
    if (advancingRef.current) return;
    advancingRef.current = true;
    const active = await getActivePlayers();
    const answerKeys = await sList(`qz:${code}:answer:${room.currentIndex}:`);
    const answers = (await Promise.all(answerKeys.map((k) => sGet(k)))).filter(Boolean);
    let minDiff = null;
    if (q.type === "echelle") answers.forEach((a) => { const d = Math.abs(Number(a.value) - Number(q.answer)); if (minDiff === null || d < minDiff) minDiff = d; });
    const results = [];
    for (const p of active) {
      const bet = (await sGet(betKey(code, room.currentIndex, p.id))) || 0;
      const ans = answers.find((a) => a.pid === p.id);
      let correct = false;
      if (ans) {
        if (q.type === "qcm" || q.type === "vf" || q.type === "carte") correct = ans.value === q.answer;
        else if (q.type === "echelle") correct = Math.abs(Number(ans.value) - Number(q.answer)) <= echelleMargin(q);
      }
      const delta = correct ? bet : -bet;
      const prevScore = (await sGet(scoreKey(code, p.id))) || 0;
      const newScore = Math.max(0, prevScore + delta);
      await sSet(scoreKey(code, p.id), newScore);
      await sSet(pointsDeltaKey(code, room.currentIndex, p.id), delta);
      results.push({ ...p, bet, correct, delta, newScore });
    }
    await sSet(revealedKey(code, room.currentIndex), true);
    await sSet(revealDetailKey(code, room.currentIndex), results.map((p) => ({ pid: p.id, pseudo: p.pseudo, animal: p.animal, correct: p.correct, points: p.delta, value: p.bet })));
    setRoundResults(withRankChange([...results].sort((a, b) => b.newScore - a.newScore), prevRankRef));
    setRevealed(true);
  }, [code, room, q, getActivePlayers]);

  useEffect(() => {
    setRevealed(false); setRoundResults([]); advancingRef.current = false; setHostBetSubmitted(false); setHostAnswerSubmitted(false); setHostBetVal(0);
    if (hostPid) (async () => { const s = (await sGet(scoreKey(code, hostPid))) ?? 0; setHostScore(s); })();
    const t = setInterval(async () => {
      const active = await getActivePlayers();
      setActiveCount(active.length);
      if (stage === "betting") {
        const bets = await Promise.all(active.map((p) => sGet(betKey(code, room.currentIndex, p.id))));
        const ready = bets.filter((b) => b !== null && b !== undefined).length;
        setReadyCount(ready);
        if (active.length > 0 && ready >= active.length) advanceToAnswering();
      } else {
        const answerKeys = await sList(`qz:${code}:answer:${room.currentIndex}:`);
        setReadyCount(answerKeys.length);
        if (active.length > 0 && answerKeys.length >= active.length && !revealed) collectResults();
      }
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room.currentIndex, stage, code]);

  useEffect(() => {
    if (left === 0) {
      if (stage === "betting") advanceToAnswering();
      else if (!revealed) collectResults();
    }
  }, [left, stage, revealed, advanceToAnswering, collectResults]);

  async function next() {
    const isLast = room.currentIndex >= room.questions.length - 1;
    if (isLast) { const nextRoom = { ...room, phase: "results" }; await sSet(roomKey(code), nextRoom); onFinished(nextRoom); }
    else { const nextRoom = { ...room, currentIndex: room.currentIndex + 1, stage: "betting", stageStartedAt: Date.now() }; await sSet(roomKey(code), nextRoom); onRoomChange(nextRoom); }
  }

  const cat = findCategory(q.category);
  const catLabelText = cat ? (cat.id.startsWith("k_") ? kidsCategoryLabel(cat, lang) : categoryLabel(cat, lang)) : "";

  if (stage === "betting" && !revealed) {
    return (
      <Stage wide>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm opacity-60">{tr("questionWord")} {room.currentIndex + 1} / {room.questions.length}</span>
          <span className="flex items-center gap-1 text-sm opacity-60"><Users size={14} /> {readyCount}/{activeCount} {tr("haveBetSuffix")}</span>
          <span className="flex items-center gap-1" style={{ fontFamily: F.mono, fontSize: 20, color: left <= 5 ? C.pink : C.gold }}><Clock size={18} /> {left}s</span>
        </div>
        <div className="rounded-3xl p-10 mb-6 text-center" style={{ background: "rgba(255,255,255,0.06)" }}>
          <p className="text-xs opacity-60 mb-3">{tr("placeBets")}</p>
          <p className="uppercase tracking-widest mb-4" style={{ fontSize: 22, fontWeight: 800, color: C.gold }}>{cat?.emoji} {catLabelText}</p>
          <p className="text-xs opacity-50 mt-4">{tr("revealAfterBets")}</p>
        </div>
        {hostPid && hostScore > 0 && (
          <div className="rounded-2xl p-4 mb-6" style={{ background: "rgba(255,255,255,0.05)", border: `2px solid ${C.violet}` }}>
            <p className="text-sm font-bold mb-3" style={{ color: C.violet }}>{tr("yourBetHost")} {hostScore}</p>
            {hostBetSubmitted ? (
              <p className="text-sm opacity-70">{tr("betSentLabel")}</p>
            ) : (
              <div>
                <div className="flex items-center justify-center gap-3 mb-3">
                  <button onClick={() => setHostBetVal((v) => Math.max(0, Number(v) - 50))} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Minus size={16} /></button>
                  <input type="number" inputMode="numeric" value={hostBetVal} onFocus={() => { if (hostBetVal === 0) setHostBetVal(""); }} onChange={(e) => setHostBetVal(e.target.value === "" ? "" : Math.max(0, Math.min(hostScore, Number(e.target.value))))} className="text-center rounded-xl px-4 py-2" style={{ fontFamily: F.mono, fontSize: 24, color: C.cream, background: "rgba(255,255,255,0.08)", border: "2px solid rgba(255,255,255,0.2)", width: 140 }} />
                  <button onClick={() => setHostBetVal((v) => Math.min(hostScore, Number(v) + 50))} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Plus size={16} /></button>
                </div>
                <div className="flex gap-2 justify-center mb-3">
                  <GhostButton small onClick={() => setHostBetVal(Math.round(hostScore / 2))}>{tr("halfBtn")}</GhostButton>
                  <GhostButton small onClick={() => setHostBetVal(hostScore)}>{tr("allInBtn")}</GhostButton>
                </div>
                <BigButton onClick={async () => { const amount = Math.max(0, Math.min(hostScore, Number(hostBetVal) || 0)); setHostBetSubmitted(true); await sSet(betKey(code, room.currentIndex, hostPid), amount); }} color={C.violet}>{tr("validateMyBet")}</BigButton>
              </div>
            )}
          </div>
        )}
        <BigButton onClick={advanceToAnswering} color={C.violet}>{tr("revealQuestionNow")}</BigButton>
      </Stage>
    );
  }

  return (
    <Stage wide>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm opacity-60">{tr("questionWord")} {room.currentIndex + 1} / {room.questions.length}</span>
        <span className="flex items-center gap-1 text-sm opacity-60"><Users size={14} /> {readyCount}/{activeCount} {tr("answersWord")}</span>
        <span className="flex items-center gap-1" style={{ fontFamily: F.mono, fontSize: 20, color: left <= 5 ? C.pink : C.gold }}><Clock size={18} /> {left}s</span>
      </div>
      <div className="rounded-3xl p-8 mb-6 text-center" style={{ background: "rgba(255,255,255,0.06)" }}>
        <p className="uppercase tracking-widest mb-3" style={{ fontSize: 20, fontWeight: 800, color: C.gold }}>{cat?.emoji} {catLabelText}</p>
        <p style={{ fontFamily: F.display, fontSize: 32 }}>{q.text}</p>
        {q.type === "qcm" && (<div className="grid grid-cols-2 gap-3 mt-6">{q.options.map((o, i) => (<div key={i} className="rounded-xl p-3" style={{ background: revealed && i === q.answer ? C.teal : "rgba(255,255,255,0.08)", color: revealed && i === q.answer ? "#1B1030" : C.cream, fontFamily: F.body, fontWeight: 700, fontSize: 18 }}>{o}</div>))}</div>)}
        {q.type === "vf" && (<div className="flex gap-4 justify-center mt-6"><div className="rounded-xl px-6 py-3" style={{ background: revealed && q.answer === true ? C.teal : "rgba(255,255,255,0.08)" }}>{tr("trueLabel")}</div><div className="rounded-xl px-6 py-3" style={{ background: revealed && q.answer === false ? C.teal : "rgba(255,255,255,0.08)" }}>{tr("falseLabel")}</div></div>)}
        {q.type === "carte" && (<div className="relative rounded-xl mt-6 mx-auto" style={{ width: "100%", maxWidth: 420, height: 220, background: "rgba(255,255,255,0.06)" }}>{MAP_ZONES.map((z) => (<div key={z.id} className="absolute rounded-full px-2 py-1 text-xs" style={{ left: `${z.x}%`, top: `${z.y}%`, transform: "translate(-50%,-50%)", background: revealed && z.id === q.answer ? C.teal : "rgba(255,255,255,0.12)", color: revealed && z.id === q.answer ? "#1B1030" : C.cream }}>{z.label}</div>))}</div>)}
        {q.type === "echelle" && revealed && <p className="mt-6" style={{ fontFamily: F.mono, fontSize: 26, color: C.teal }}>{tr("answerColonLabel")} {q.answer} {q.unit || ""}</p>}
      </div>
      {hostPid && hostScore > 0 && !revealed && (
        <div className="rounded-2xl p-4 mb-6" style={{ background: "rgba(255,255,255,0.05)", border: `2px solid ${C.violet}` }}>
          <p className="text-sm font-bold mb-3" style={{ color: C.violet }}>{tr("hostAnswerTitle")}</p>
          {hostAnswerSubmitted ? (
            <p className="text-sm opacity-70">{tr("answerSubmitted")}</p>
          ) : (
            <QuestionInput
              q={q}
              scaleVal={hostBetVal}
              setScaleVal={setHostBetVal}
              onSubmit={async (value) => { setHostAnswerSubmitted(true); await sSet(answerKey(code, room.currentIndex, hostPid), { pid: hostPid, value, submittedAt: Date.now() }); }}
            />
          )}
        </div>
      )}
      {revealed && roundResults.length > 0 && (
        <div className="rounded-2xl p-4 mb-6" style={{ background: "rgba(255,255,255,0.05)" }}>
          <p className="text-sm font-bold mb-2 opacity-70">{tr("betResultsTitle")}</p>
          <div className="flex flex-col gap-2">
            {roundResults.map((p) => (
              <div key={p.id} className="flex items-center gap-2 text-sm">
                <span>{p.animal}</span>
                <span className="flex-1">{p.pseudo}</span>
                <span className="opacity-60">{tr("betWord")} {p.bet}</span>
                <span style={{ fontFamily: F.mono, color: p.delta > 0 ? C.teal : p.delta < 0 ? C.pink : "rgba(255,255,255,0.4)", minWidth: 60, textAlign: "right" }}>{p.delta > 0 ? `+${p.delta}` : p.delta}</span>
                <RankBadge change={p.rankChange} />
                <span style={{ fontFamily: F.mono, fontWeight: 700 }}>{p.newScore}</span>
                {p.newScore === 0 && <span style={{ color: C.pink, fontSize: 12 }}>💀</span>}
              </div>
            ))}
          </div>
        </div>
      )}
      {revealed ? (<BigButton onClick={next} color={C.pink} icon={ArrowRight}>{room.currentIndex >= room.questions.length - 1 ? tr("seeGrandFinal") : tr("nextQuestion")}</BigButton>) : (<BigButton onClick={collectResults} color={C.violet}>{tr("revealResultsBtn")}</BigButton>)}
    </Stage>
  );
}

function EnchèrePlayerGame({ code, pid, room }) {
  const { lang, t: tr } = useLang();
  const q = room.questions[room.currentIndex];
  const stage = room.stage;
  const left = useCountdown(room.stageStartedAt, stage === "betting" ? room.settings.bettingSeconds : room.settings.answerSeconds);
  const [myScore, setMyScore] = useState(null);
  const [betVal, setBetVal] = useState(0);
  const [betSubmitted, setBetSubmitted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [myDelta, setMyDelta] = useState(0);
  const [allBets, setAllBets] = useState([]);
  const [provisional, setProvisional] = useState([]);
  const prevRankRef = useRef({});
  const hint = DIFFICULTY_HINT[q.type] || DIFFICULTY_HINT.qcm;

  useEffect(() => { setBetVal(0); setBetSubmitted(false); setSubmitted(false); setRevealed(false); setMyDelta(0); setAllBets([]); setProvisional([]); }, [room.currentIndex]);

  useEffect(() => {
    let stop = false;
    (async () => { const s = (await sGet(scoreKey(code, pid))) ?? 0; if (!stop) setMyScore(s); })();
    return () => { stop = true; };
  }, [code, pid, room.currentIndex]);

  useEffect(() => {
    if (stage !== "betting" || myScore === null) return;
    if (myScore <= 0) { sSet(betKey(code, room.currentIndex, pid), 0); setBetSubmitted(true); }
  }, [stage, myScore, code, room.currentIndex, pid]);

  useEffect(() => {
    if (!(submitted || stage === "answering" && left === 0)) return;
    let stop = false;
    const t = setInterval(async () => {
      const isRevealed = await sGet(revealedKey(code, room.currentIndex));
      if (stop || !isRevealed) return;
      clearInterval(t);
      const [delta, detail, playerKeys] = await Promise.all([
        sGet(pointsDeltaKey(code, room.currentIndex, pid)),
        sGet(revealDetailKey(code, room.currentIndex)),
        sList(`qz:${code}:player:`),
      ]);
      setMyDelta(delta || 0);
      setAllBets(detail || []);
      const players = (await Promise.all(playerKeys.map((k) => sGet(k)))).filter(Boolean);
      const withScores = await Promise.all(players.map(async (p) => ({ ...p, score: (await sGet(scoreKey(code, p.id))) || 0 })));
      withScores.sort((a, b) => b.score - a.score);
      setProvisional(withRankChange(withScores, prevRankRef));
      setRevealed(true);
    }, 800);
    return () => { stop = true; clearInterval(t); };
  }, [submitted, stage, left, code, room.currentIndex, pid]);

  async function submitBet() {
    if (betSubmitted || myScore === null) return;
    const amount = Math.max(0, Math.min(myScore, Number(betVal) || 0));
    setBetSubmitted(true);
    await sSet(betKey(code, room.currentIndex, pid), amount);
  }
  async function submitAnswer(value) {
    if (submitted || left === 0) return;
    setSubmitted(true);
    await sSet(answerKey(code, room.currentIndex, pid), { pid, value, submittedAt: Date.now() });
  }

  if (myScore !== null && myScore <= 0) {
    return (
      <Stage>
        <div className="text-center mt-10">
          <Skull size={40} className="mx-auto mb-3" color={C.pink} />
          <p style={{ fontFamily: F.display, fontSize: 22 }}>{tr("eliminatedEnchereTitle")}</p>
          <p className="text-sm opacity-70 mt-2">{tr("eliminatedEnchereHint")}</p>
        </div>
      </Stage>
    );
  }

  if (stage === "betting") {
    const cat = findCategory(q.category);
    const catLabelText = cat ? (cat.id.startsWith("k_") ? kidsCategoryLabel(cat, lang) : categoryLabel(cat, lang)) : "";
    return (
      <Stage>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs opacity-60">Q{room.currentIndex + 1}/{room.questions.length}</span>
          <span className="text-xs" style={{ fontFamily: F.mono, color: C.gold }}>💰 {myScore ?? "..."}</span>
          <span style={{ fontFamily: F.mono, fontSize: 20, color: left <= 5 ? C.pink : C.gold }}>{left}s</span>
        </div>
        <div className="rounded-2xl p-6 mb-5 text-center" style={{ background: "rgba(255,255,255,0.06)" }}>
          <p className="uppercase tracking-widest mb-3" style={{ fontSize: 16, fontWeight: 800, color: C.gold }}>{cat?.emoji} {catLabelText}</p>
        </div>
        {betSubmitted ? (
          <div className="text-center mt-6 opacity-90"><p style={{ fontFamily: F.display, fontSize: 20 }}>{tr("betSentLabel")}</p><p className="text-sm mt-1 opacity-70">{tr("waitingForQuestion")}</p></div>
        ) : (
          <div>
            <p className="text-sm opacity-70 mb-2 text-center">{tr("howMuchBet").replace("{max}", myScore ?? 0)}</p>
            <div className="flex items-center justify-center gap-3 mb-4">
              <button onClick={() => setBetVal((v) => Math.max(0, Number(v) - 50))} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Minus size={16} /></button>
              <input type="number" inputMode="numeric" value={betVal} onFocus={() => { if (betVal === 0) setBetVal(""); }} onChange={(e) => setBetVal(e.target.value === "" ? "" : Math.max(0, Math.min(myScore ?? 0, Number(e.target.value))))} className="text-center rounded-xl px-4 py-2" style={{ fontFamily: F.mono, fontSize: 28, color: C.cream, background: "rgba(255,255,255,0.08)", border: "2px solid rgba(255,255,255,0.2)", width: 160 }} />
              <button onClick={() => setBetVal((v) => Math.min(myScore ?? 0, Number(v) + 50))} className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.1)" }}><Plus size={16} /></button>
            </div>
            <div className="flex gap-2 justify-center mb-4">
              <GhostButton small onClick={() => setBetVal(Math.round((myScore ?? 0) / 2))}>{tr("halfBtn")}</GhostButton>
              <GhostButton small onClick={() => setBetVal(myScore ?? 0)}>{tr("allInBtn")}</GhostButton>
            </div>
            <BigButton onClick={submitBet} color={C.gold}>{tr("validateMyBet")}</BigButton>
          </div>
        )}
      </Stage>
    );
  }

  return (
    <Stage>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs opacity-60">Q{room.currentIndex + 1}/{room.questions.length}</span>
        <span style={{ fontFamily: F.mono, fontSize: 20, color: left <= 5 ? C.pink : C.gold }}>{left}s</span>
      </div>
      <div className="rounded-2xl p-5 mb-5" style={{ background: "rgba(255,255,255,0.06)" }}><p className="uppercase tracking-widest mb-2" style={{ fontSize: 16, fontWeight: 800, color: C.gold }}>{(() => { const c = findCategory(q.category); return c ? `${c.emoji} ${c.id.startsWith("k_") ? kidsCategoryLabel(c, lang) : categoryLabel(c, lang)}` : ""; })()}</p><p style={{ fontFamily: F.display, fontSize: 26 }}>{q.text}</p></div>
      {!submitted && left > 0 ? (
        <QuestionInput q={q} onSubmit={submitAnswer} scaleVal={betVal} setScaleVal={setBetVal} />
      ) : !revealed ? (
        <div className="text-center mt-6 opacity-90"><p style={{ fontFamily: F.display, fontSize: 20 }}>{submitted ? tr("answerSubmitted") : tr("timeUp")}</p><p className="text-sm mt-1 opacity-70">{tr("waitingOthers")}</p></div>
      ) : (
        <div className="text-center mt-6">
          <p style={{ fontFamily: F.display, fontSize: 28, color: myDelta > 0 ? C.teal : myDelta < 0 ? C.pink : C.cream }}>{myDelta > 0 ? `+${myDelta}` : myDelta} pts</p>
          {allBets.length > 0 && (
            <div className="rounded-2xl p-4 mb-4 mt-4 text-left" style={{ background: "rgba(255,255,255,0.05)" }}>
              <p className="text-sm font-bold mb-2 opacity-70">{tr("betResultsTitle")}</p>
              <div className="flex flex-col gap-2">
                {allBets.map((a) => (
                  <div key={a.pid} className="flex items-center gap-2 text-sm" style={{ fontWeight: a.pid === pid ? 800 : 400 }}>
                    <span>{a.animal}</span>
                    <span className="flex-1">{a.pseudo}{a.pid === pid ? tr("you") : ""}</span>
                    <span className="opacity-60">{tr("betWord")} {a.value}</span>
                    <span style={{ fontFamily: F.mono, fontSize: 13, color: a.points > 0 ? C.teal : a.points < 0 ? C.pink : "rgba(255,255,255,0.4)", minWidth: 54, textAlign: "right" }}>{a.points > 0 ? `+${a.points}` : a.points}</span>
                    {a.correct ? <Check size={16} color={C.teal} /> : <span style={{ color: C.pink }}>✕</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {provisional.length > 0 && (
            <div className="rounded-2xl p-4 text-left" style={{ background: "rgba(255,201,60,0.08)" }}>
              <p className="text-sm font-bold mb-2" style={{ color: C.gold }}>{tr("provisionalRanking")}</p>
              <div className="flex flex-col gap-1">
                {provisional.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-2 text-sm" style={{ fontWeight: p.id === pid ? 800 : 400 }}>
                    <span className="opacity-60" style={{ width: 20 }}>{i + 1}.</span>
                    <span>{p.animal}</span>
                    <span className="flex-1">{p.pseudo}{p.id === pid ? tr("you") : ""}</span>
                    <RankBadge change={p.rankChange} />
                    <span style={{ fontFamily: F.mono, color: C.teal }}>{p.score}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <p className="text-sm opacity-70 mt-4">{tr("waitingNextQuestion")}</p>
        </div>
      )}
    </Stage>
  );
}

/* ---------------------------------------------------------
   ROOT APP
--------------------------------------------------------- */
function QuizAppInner() {
  const { lang, t: tr } = useLang();
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
  const [hostAssignedJokers, setHostAssignedJokers] = useState([]);
  const [hostUsedJokersEver, setHostUsedJokersEver] = useState([]);
  const [urlCode, setUrlCode] = useState(null);
  const isAdmin = view.startsWith("admin");
  const viewRef = useRef(view);
  useEffect(() => { viewRef.current = view; }, [view]);

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
        const isBlindTest = r.mode === "blindtest";
        const isEnchere = r.mode === "enchere";
        if (r.phase === "question") setView(isAdmin ? (isMatchAmor ? "admin-matchamor" : isBlindTest ? "admin-blindgame" : isEnchere ? "admin-enchere" : "admin-game") : (isMatchAmor ? "player-matchamor" : isBlindTest ? "player-blindgame" : isEnchere ? "player-enchere" : "player-game"));
        else if (r.phase === "results") setView(isMatchAmor ? "results-matchamor" : "results");
        else if (r.phase === "lobby") {
          const stillOnboarding = viewRef.current === "player-tuto" || viewRef.current === "player-jokerdraw" || viewRef.current === "player-jokerpick" || viewRef.current === "admin-jokertuto" || viewRef.current === "admin-jokerdraw" || viewRef.current === "admin-jokerpick";
          if (!stillOnboarding) setView(isAdmin ? "admin-lobby" : "player-lobby");
        }
      }
    };
    poll();
    const t = setInterval(poll, 1200);
    return () => { stop = true; clearInterval(t); };
  }, [code, isAdmin]);

  function resetAll() { setCode(null); setRoom(null); setUsedJokersEver([]); setAssignedJokers([]); setHostAssignedJokers([]); setHostUsedJokersEver([]); setPid(null); setView("home"); }

  async function playAgain() {
    const playerKeysList = await sList(`qz:${code}:player:`);
    const resetScore = room.mode === "enchere" ? (room.settings.startingPoints || 10000) : 0;
    for (const k of playerKeysList) {
      const p = await sGet(k);
      if (p) {
        await sSet(scoreKey(code, p.id), resetScore);
        await sSet(timeKey(code, p.id), 0);
        await sSet(killerKey(code, p.id), 0);
        await sSet(victimKey(code, p.id), 0);
      }
    }
    const resetRoom = { ...room, phase: "lobby", currentIndex: -1, questionStartedAt: null, stage: room.mode === "enchere" ? "betting" : room.stage, stageStartedAt: null };
    await sSet(roomKey(code), resetRoom);
    setRoom(resetRoom);
    setUsedJokersEver([]);
    setHostUsedJokersEver([]);
    setView(isAdmin ? "admin-lobby" : "player-lobby");
  }

  if (view === "home") return <Home onCreate={() => setView("explain-classic")} onJoin={() => setView("player-join")} onSolo={() => setView("explain-solo")} onMatchAmor={() => setView("explain-matchamor")} onBlindTest={() => setView("explain-blindtest")} onEnchere={() => setView("explain-enchere")} />;

  if (view === "explain-classic") return (
    <ModeExplainer
      emoji="🎯" title={tr("explainClassicTitle")} color={C.gold}
      onBack={() => setView("home")}
      onContinue={() => setView("admin-create")}
      bullets={[
        { text: tr("explainClassicB1") },
        { text: tr("explainClassicB2") },
        { text: tr("explainClassicB3") },
        { text: tr("explainClassicB4") },
      ]}
    />
  );
  if (view === "explain-solo") return (
    <ModeExplainer
      emoji="🧑‍🎓" title={tr("explainSoloTitle")} color={C.violet}
      onBack={() => setView("home")}
      onContinue={() => setView("solo-home")}
      bullets={[
        { text: tr("explainSoloB1") },
        { text: tr("explainSoloB2") },
        { text: tr("explainSoloB3") },
      ]}
    />
  );
  if (view === "explain-matchamor") return (
    <ModeExplainer
      emoji="💔" title={tr("explainMatchAmorTitle")} color={C.pink}
      onBack={() => setView("home")}
      onContinue={() => setView("matchamor-create")}
      bullets={[
        { text: tr("explainMatchAmorB1") },
        { text: tr("explainMatchAmorB2") },
        { text: tr("explainMatchAmorB3") },
      ]}
    />
  );
  if (view === "explain-blindtest") return (
    <ModeExplainer
      emoji="🎧" title={tr("explainBlindTestTitle")} color={C.violet}
      onBack={() => setView("home")}
      onContinue={() => setView("blindtest-create")}
      bullets={[
        { text: tr("explainBlindTestB1") },
        { text: tr("explainBlindTestB2") },
        { text: tr("explainBlindTestB3") },
      ]}
    />
  );
  if (view === "explain-enchere") return (
    <ModeExplainer
      emoji="💰" title={tr("explainEnchereTitle")} color={C.gold}
      onBack={() => setView("home")}
      onContinue={() => setView("enchere-create")}
      bullets={[
        { text: tr("explainEnchereB1") },
        { text: tr("explainEnchereB2") },
        { text: tr("explainEnchereB3") },
        { text: tr("explainEnchereB4") },
        { text: tr("explainEnchereB5") },
      ]}
    />
  );

  if (view === "solo-home") return <SoloHome onBack={() => setView("home")} onNormal={() => { setSoloMode("normal"); setView("solo-profile"); }} onCrash={() => { setSoloMode("crash"); setView("solo-profile"); }} />;
  if (view === "solo-profile") return <SoloProfile onBack={() => setView("solo-home")} onNext={(p) => { setSoloProfile(p); setView(soloMode === "crash" ? "crash-setup" : "solo-setup"); }} />;
  if (view === "solo-setup") return <SoloSetup onBack={() => setView("solo-profile")} onStart={(cfg) => { setSoloConfig(cfg); setView("solo-quiz"); }} />;
  if (view === "crash-setup") return <SoloSetup crash onBack={() => setView("solo-profile")} onStart={(cfg) => { setSoloConfig(cfg); setView("crash-test"); }} />;
  if (view === "solo-quiz") return <SoloQuiz config={soloConfig} profile={soloProfile} onExit={() => setView("home")} />;
  if (view === "crash-test") return <CrashTest config={soloConfig} profile={soloProfile} onExit={() => setView("home")} />;

  if (view === "matchamor-create") return <CreateMatchAmor onBack={() => setView("home")} onCreated={(c, r, hostPid) => { setCode(c); setRoom(r); setPid(hostPid || null); setView("admin-lobby"); }} />;

  if (view === "blindtest-create") return <CreateBlindTest onBack={() => setView("home")} onCreated={(c, r, hostPid) => { setCode(c); setRoom(r); setPid(hostPid || null); setView("admin-lobby"); }} />;

  if (view === "enchere-create") return <CreateEnchere onBack={() => setView("home")} onCreated={(c, r, hostPid) => { setCode(c); setRoom(r); setPid(hostPid || null); setView("admin-lobby"); }} />;

  if (view === "admin-create") return <CreateRoom onBack={() => setView("home")} onCreated={(c, r, hostPid) => {
    setCode(c); setRoom(r); setPid(hostPid || null);
    if (hostPid && r.settings.hostPlays) {
      setView(r.settings.jokerRandom ? "admin-jokerdraw" : "admin-jokertuto");
    } else {
      setView("admin-lobby");
    }
  }} />;

  if (view === "admin-jokertuto" && room) return (
    <JokerTuto
      room={room}
      onDone={() => {
        const enabledIds = Object.entries(room.settings.jokers || {}).filter(([, v]) => v).map(([k]) => k);
        if ((room.settings.jokerRandomCount || 2) >= enabledIds.length) {
          sSet(`qz:${code}:playerjokers:${pid}`, enabledIds);
          setHostAssignedJokers(enabledIds);
          setView("admin-lobby");
        } else {
          setView("admin-jokerpick");
        }
      }}
    />
  );
  if (view === "admin-jokerdraw" && room) return <JokerDraw room={room} code={code} pid={pid} onDone={(picked) => { setHostAssignedJokers(picked); setView("admin-lobby"); }} />;
  if (view === "admin-jokerpick" && room) return <JokerPick room={room} code={code} pid={pid} onDone={(picked) => { setHostAssignedJokers(picked); setView("admin-lobby"); }} />;


  if (view === "player-join") return (
    <JoinRoom
      onBack={() => setView("home")}
      initialCode={urlCode}
      onJoined={(c, p, prof, r, reconnectInfo) => {
        setCode(c); setPid(p); setProfile(prof); setRoom(r);
        if (r.mode === "matchamor" || r.mode === "blindtest" || r.mode === "enchere") { setView("player-lobby"); return; }
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
        const enabledIds = Object.entries(room.settings.jokers || {}).filter(([, v]) => v).map(([k]) => k);
        if (room.settings.jokerRandom) { setView("player-jokerdraw"); }
        else if ((room.settings.jokerRandomCount || 2) >= enabledIds.length) {
          sSet(`qz:${code}:playerjokers:${pid}`, enabledIds);
          setAssignedJokers(enabledIds);
          setView("player-lobby");
        } else {
          setView("player-jokerpick");
        }
      }}
    />
  );

  if (view === "player-jokerdraw" && room) return <JokerDraw room={room} code={code} pid={pid} onDone={(picked) => { setAssignedJokers(picked); setView("player-lobby"); }} />;
  if (view === "player-jokerpick" && room) return <JokerPick room={room} code={code} pid={pid} onDone={(picked) => { setAssignedJokers(picked); setView("player-lobby"); }} />;

  if (view === "admin-lobby" && room) return (
    <AdminLobby
      code={code}
      room={room}
      onStart={(r) => { setRoom(r); setView(r.mode === "matchamor" ? "admin-matchamor" : r.mode === "blindtest" ? "admin-blindgame" : r.mode === "enchere" ? "admin-enchere" : "admin-game"); }}
      buildExtraOnStart={room.mode === "matchamor" ? (players) => ({ alive: players.map((p) => p.id) }) : room.mode === "enchere" ? () => ({ stage: "betting", stageStartedAt: Date.now() }) : undefined}
      onBack={resetAll}
    />
  );

  if (view === "player-lobby" && profile) return <PlayerLobby profile={profile} code={code} assignedJokers={assignedJokers} />;

  if (view === "admin-game" && room) return <AdminGame code={code} room={room} onRoomChange={(r) => setRoom(r)} onFinished={(r) => { setRoom(r); setView("results"); }} hostPid={pid} hostAssignedJokers={hostAssignedJokers} hostUsedJokersEver={hostUsedJokersEver} setHostUsedJokersEver={setHostUsedJokersEver} />;
  if (view === "player-game" && room) return <PlayerGame code={code} pid={pid} room={room} assignedJokers={assignedJokers} usedJokersEver={usedJokersEver} setUsedJokersEver={setUsedJokersEver} />;
  if (view === "results") return <Results code={code} room={room} isAdmin={isAdmin} onRestart={resetAll} onPlayAgain={playAgain} />;

  if (view === "admin-matchamor" && room) return <MatchAmorAdminGame code={code} room={room} onRoomChange={(r) => setRoom(r)} onFinished={(r) => { setRoom(r); setView("results-matchamor"); }} hostPid={pid} />;
  if (view === "admin-blindgame" && room) return <BlindTestAdminGame code={code} room={room} onRoomChange={(r) => setRoom(r)} onFinished={(r) => { setRoom(r); setView("results"); }} hostPid={pid} />;
  if (view === "player-blindgame" && room) return <BlindTestPlayerGame code={code} pid={pid} room={room} />;
  if (view === "admin-enchere" && room) return <EnchereAdminGame code={code} room={room} onRoomChange={(r) => setRoom(r)} onFinished={(r) => { setRoom(r); setView("results"); }} hostPid={pid} />;
  if (view === "player-enchere" && room) return <EnchèrePlayerGame code={code} pid={pid} room={room} />;
  if (view === "player-matchamor" && room) return <PlayerMatchAmor code={code} pid={pid} room={room} />;
  if (view === "results-matchamor") return <MatchAmorResults code={code} room={room} isAdmin={isAdmin} onRestart={resetAll} />;

  return (<Stage><p className="text-center opacity-60 mt-10">Chargement...</p></Stage>);
}

export default function QuizApp() {
  const [lang, setLang] = useState(getStoredLang());
  useEffect(() => { storeLang(lang); }, [lang]);
  const value = { lang, t: (k) => t(lang, k), setLang };
  return (
    <LangContext.Provider value={value}>
      <QuizAppInner />
    </LangContext.Provider>
  );
}
