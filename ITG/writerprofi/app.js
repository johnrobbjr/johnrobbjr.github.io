const lessons = [
  {
    id: "grundlagen",
    icon: "🖱️",
    title: "Grundlagen",
    description:
      "Markieren, kopieren, ausschneiden, einfügen, rückgängig machen, speichern und Tastenkürzel.",
    challenges: [
      {
        title: "Ein Wort markieren",
        difficulty: "leicht",
        instruction: "Markiere genau das Wort <strong>Computer</strong>.",
        hint: "Ziehe mit gedrückter Maustaste über das Wort oder doppelklicke darauf.",
        initialHtml: "Der Computer steht im Klassenraum.",
        check: () => checkSelectionExactly("Computer"),
      },
      {
        title: "Einen ganzen Satz markieren",
        difficulty: "leicht",
        instruction:
          "Markiere den zweiten Satz: <strong>Writer ist ein Schreibprogramm.</strong>",
        hint: "Achte darauf, den Punkt am Ende mit zu markieren.",
        initialHtml:
          "Heute üben wir am Computer. Writer ist ein Schreibprogramm.",
        check: () => checkSelectionExactly("Writer ist ein Schreibprogramm."),
      },
      {
        title: "Kopieren und einfügen",
        difficulty: "leicht",
        instruction:
          "Kopiere das Wort <strong>Internet</strong> und füge es am Ende des Textes ein.",
        hint: "Markieren → Kopieren → Cursor ans Ende setzen → Einfügen.",
        initialHtml: "Wir nutzen das Internet.",
        expectedText: "Wir nutzen das Internet. Internet",
        check: (challenge) => checkPlainText(challenge.expectedText),
      },
      {
        title: "Ausschneiden und verschieben",
        difficulty: "mittel",
        instruction:
          "Verschiebe die Wörter <strong>am Computer</strong> ans Ende des Textes.",
        hint: "Markieren → Ausschneiden → Cursor ans Ende setzen → Einfügen.",
        initialHtml: "Wir schreiben am Computer einen Text.",
        expectedText: "Wir schreiben einen Text. am Computer",
        check: (challenge) => checkPlainText(challenge.expectedText),
      },
      {
        title: "Rückgängig mit Tastenkürzel",
        difficulty: "mittel",
        instruction:
          "Tippe am Ende ein <strong>!</strong> und mache die Änderung danach mit <strong>Strg+Z</strong> rückgängig.",
        hint: "Diese Aufgabe zählt nur, wenn du wirklich das Tastenkürzel Strg+Z benutzt.",
        initialHtml: "Writer speichert Texte",
        expectedText: "Writer speichert Texte",
        check: (challenge) => {
          if (!actionWasUsed("shortcut:undo")) {
            return bad("Benutze für diese Aufgabe das Tastenkürzel Strg+Z.");
          }

          if (
            normalize(getEditorText()) === normalize(challenge.expectedText)
          ) {
            return ok(
              "Richtig! Du hast die Änderung mit Strg+Z rückgängig gemacht.",
            );
          }

          return bad("Der Text ist noch nicht wieder im Ausgangszustand.");
        },
      },
      {
        title: "Kopieren mit Tastenkürzeln",
        difficulty: "mittel",
        instruction:
          "Kopiere <strong>digitale Werkzeuge</strong> mit <strong>Strg+C</strong> und füge es am Ende mit <strong>Strg+V</strong> ein.",
        hint: "Diese Aufgabe zählt nur mit Tastenkürzeln, nicht mit den Schaltflächen.",
        initialHtml: "Wir testen digitale Werkzeuge.",
        expectedText: "Wir testen digitale Werkzeuge. digitale Werkzeuge",
        check: (challenge) => {
          if (
            !actionWasUsed("shortcut:copy") ||
            !actionWasUsed("shortcut:paste")
          ) {
            return bad("Benutze Strg+C zum Kopieren und Strg+V zum Einfügen.");
          }

          return checkPlainText(challenge.expectedText);
        },
      },
      {
        title: "Speichern finden",
        difficulty: "mittel",
        instruction:
          "Speichere das Dokument. Nutze entweder die Speichern-Schaltfläche, <strong>Strg+S</strong> oder das Menü <strong>Datei → Speichern</strong>.",
        hint: "In echten Schreibprogrammen solltest du regelmäßig speichern.",
        initialHtml: "Meine erste Writer-Datei",
        check: () => {
          if (
            actionWasUsed("button:save") ||
            actionWasUsed("shortcut:save") ||
            appState.lastMenuPath === "Datei>Speichern"
          ) {
            return ok("Richtig! Du hast den Speicherbefehl gefunden.");
          }

          return bad(
            "Speichere das Dokument mit der Schaltfläche, mit Strg+S oder über Datei → Speichern.",
          );
        },
      },
      {
        title: "Abschluss: Text überarbeiten",
        difficulty: "schwer",
        instruction: `
          Bearbeite den Text sinnvoll:
          <ul>
            <li>Verschiebe <strong>heute</strong> ans Ende des ersten Satzes.</li>
            <li>Kopiere <strong>Writer</strong> ans Ende des Dokuments.</li>
            <li>Speichere danach das Dokument.</li>
          </ul>
        `,
        hint: "Du brauchst Markieren, Ausschneiden, Einfügen, Kopieren und Speichern.",
        initialHtml:
          "Heute lernen wir Writer. Das Programm hilft beim Schreiben.",
        expectedText:
          "lernen wir Writer heute. Das Programm hilft beim Schreiben. Writer",
        check: (challenge) => {
          const textOk =
            normalize(getEditorText()).toLowerCase() ===
            normalize(challenge.expectedText).toLowerCase();
          const saved =
            actionWasUsed("button:save") ||
            actionWasUsed("shortcut:save") ||
            appState.lastMenuPath === "Datei>Speichern";

          if (!textOk) {
            return bad(
              "Der Text ist noch nicht richtig umgestellt und ergänzt.",
            );
          }

          if (!saved) {
            return bad("Der Text stimmt. Speichere jetzt noch das Dokument.");
          }

          return ok("Sehr gut! Du hast mehrere Grundfunktionen kombiniert.");
        },
      },
    ],
  },
  {
    id: "formatieren",
    icon: "🔠",
    title: "Text formatieren",
    description:
      "Fett, kursiv, unterstreichen, durchstreichen, Schriftgröße und kombinierte Formatierung.",
    challenges: [
      {
        title: "Fett formatieren",
        difficulty: "leicht",
        instruction: "Mache nur das Wort <strong>Computer</strong> fett.",
        hint: "Markiere zuerst das Wort und klicke dann auf F.",
        initialHtml: "Der Computer steht im Klassenraum.",
        check: () => checkStyleOnlyTarget("Computer", "bold", "fett"),
      },
      {
        title: "Kursiv formatieren",
        difficulty: "leicht",
        instruction:
          "Mache nur die Wörter <strong>sehr wichtig</strong> kursiv.",
        hint: "Kursiv bedeutet: Der Text steht schräg.",
        initialHtml: "Dieser Hinweis ist sehr wichtig.",
        check: () => checkStyleOnlyTarget("sehr wichtig", "italic", "kursiv"),
      },
      {
        title: "Unterstreichen",
        difficulty: "leicht",
        instruction: "Unterstreiche nur das Wort <strong>Überschrift</strong>.",
        hint: "Nutze die Schaltfläche U.",
        initialHtml: "Eine Überschrift steht oft oben.",
        check: () =>
          checkStyleOnlyTarget("Überschrift", "underline", "unterstrichen"),
      },
      {
        title: "Durchstreichen",
        difficulty: "mittel",
        instruction:
          "Streiche nur das falsche Wort <strong>falsch</strong> durch.",
        hint: "Durchstreichen zeigt oft: Das war nicht richtig oder soll gelöscht werden.",
        initialHtml: "Dieser Satz enthält ein falsches Wort.",
        check: () =>
          checkStyleOnlyTarget("falsches", "strike", "durchgestrichen"),
      },
      {
        title: "Schriftgröße ändern",
        difficulty: "mittel",
        instruction:
          "Mache das Wort <strong>Titel</strong> größer. Wähle Schriftgröße <strong>24</strong>.",
        hint: "Markiere „Titel“ und wähle oben bei Größe 24.",
        initialHtml: "Titel\nDas ist ein kurzer Text.",
        check: () => checkFontSize("Titel", "24px"),
      },
      {
        title: "Mehrere Formatierungen kombinieren",
        difficulty: "mittel",
        instruction: `
          Formatiere den Text:
          <ul>
            <li><strong>Titel</strong> soll fett und Schriftgröße 24 sein.</li>
            <li><strong>Notiz</strong> soll kursiv sein.</li>
            <li><strong>alt</strong> soll durchgestrichen sein.</li>
          </ul>
        `,
        hint: "Du musst drei verschiedene Werkzeuge verwenden.",
        initialHtml: "Titel\nDas ist eine Notiz. Dieses Wort ist alt.",
        check: () => {
          const titleBold = checkStyleOnlyTargetResult("Titel", "bold");
          const titleSize = checkFontSizeResult("Titel", "24px");
          const notizItalic = checkStyleOnlyTargetResult("Notiz", "italic");
          const altStrike = checkStyleOnlyTargetResult("alt", "strike");

          if (titleBold && titleSize && notizItalic && altStrike) {
            return ok(
              "Sehr gut! Du hast mehrere Formatierungen richtig kombiniert.",
            );
          }

          return bad(
            "Noch nicht alles stimmt. Prüfe: Titel fett und Größe 24, Notiz kursiv, alt durchgestrichen.",
          );
        },
      },
      {
        title: "Formatierung entfernen",
        difficulty: "schwer",
        instruction:
          "Entferne die Fettschrift beim Wort <strong>wichtig</strong>, aber lasse <strong>Achtung</strong> fett.",
        hint: "Markiere nur „wichtig“ und klicke noch einmal auf F.",
        initialHtml: "<b>Achtung</b>: Diese Information ist <b>wichtig</b>.",
        check: () => {
          const achtungBold = checkStyleOnlyTargetResult(
            "Achtung",
            "bold",
            false,
          );
          const wichtigNotBold = !checkAnyStyleOnTarget("wichtig", "bold");

          if (achtungBold && wichtigNotBold) {
            return ok(
              "Richtig! Du hast nur die falsche Formatierung entfernt.",
            );
          }

          return bad(
            "Achte darauf: „Achtung“ soll fett bleiben, „wichtig“ nicht.",
          );
        },
      },
      {
        title: "Abschluss: Kleines Dokument gestalten",
        difficulty: "schwer",
        instruction: `
          Gestalte das Mini-Dokument:
          <ul>
            <li><strong>Meine Regeln</strong> soll fett, unterstrichen und Schriftgröße 24 sein.</li>
            <li><strong>wichtig</strong> soll fett sein.</li>
            <li><strong>nie</strong> soll durchgestrichen sein.</li>
            <li><strong>leise arbeiten</strong> soll kursiv sein.</li>
          </ul>
        `,
        hint: "Diese Aufgabe testet, ob du die wichtigsten Formatierungen kombinieren kannst.",
        initialHtml:
          "Meine Regeln\nEs ist wichtig, im Computerraum nie laut zu sein und leise arbeiten zu können.",
        check: () => {
          const titleBold = checkStyleOnTarget("Meine Regeln", "bold");
          const titleUnderline = checkStyleOnTarget(
            "Meine Regeln",
            "underline",
          );
          const titleSize = checkFontSizeResult("Meine Regeln", "24px");
          const importantBold = checkStyleOnTarget("wichtig", "bold");
          const neverStrike = checkStyleOnTarget("nie", "strike");
          const quietItalic = checkStyleOnTarget("leise arbeiten", "italic");

          if (
            titleBold &&
            titleUnderline &&
            titleSize &&
            importantBold &&
            neverStrike &&
            quietItalic
          ) {
            return ok(
              "Ausgezeichnet! Du kannst ein kleines Dokument sinnvoll formatieren.",
            );
          }

          return bad(
            "Noch nicht alles stimmt. Prüfe Titel, wichtig, nie und leise arbeiten.",
          );
        },
      },
    ],
  },
];

const menuData = {
  Datei: ["Neu", "Öffnen …", "Speichern", "Speichern unter …", "Drucken …"],
  Bearbeiten: [
    "Rückgängig",
    "Ausschneiden",
    "Kopieren",
    "Einfügen",
    "Alles auswählen",
  ],
  Ansicht: ["Symbolleisten", "Seitenleiste", "Zoom"],
  Einfügen: ["Bild …", "Tabelle …", "Seitenzahl"],
  Format: ["Zeichen …", "Absatz …", "Aufzählungszeichen und Nummerierung …"],
  Extras: ["Rechtschreibung", "Sprache"],
  Hilfe: ["LibreOffice-Hilfe"],
};

const appState = {
  currentLesson: null,
  currentChallengeIndex: 0,
  savedRange: null,
  clipboardHtml: "",
  undoStack: [],
  actions: [],
  completedLessons: new Set(),
  lastMenuPath: null,
  openMenu: null,
  challengeSolved: false,
  suppressInput: false,
};

const mapScreen = document.querySelector("#mapScreen");
const lessonScreen = document.querySelector("#lessonScreen");
const lessonGrid = document.querySelector("#lessonGrid");
const homeButton = document.querySelector("#homeButton");

const lessonTitle = document.querySelector("#lessonTitle");
const challengeLabel = document.querySelector("#challengeLabel");
const progressPercent = document.querySelector("#progressPercent");
const progressFill = document.querySelector("#progressFill");

const challengeTitle = document.querySelector("#challengeTitle");
const difficultyBadge = document.querySelector("#difficultyBadge");
const instructionBox = document.querySelector("#instructionBox");
const hintBox = document.querySelector("#hintBox");
const feedback = document.querySelector("#feedback");
const mainActionButton = document.querySelector("#mainActionButton");
const retryButton = document.querySelector("#retryButton");

const menubar = document.querySelector("#menubar");
const toolbar = document.querySelector("#toolbar");
const fontSizeSelect = document.querySelector("#fontSizeSelect");
const editor = document.querySelector("#editor");
const statusLeft = document.querySelector("#statusLeft");

init();

function init() {
  renderMap();
  renderMenubar();

  homeButton.addEventListener("click", showMap);
  mainActionButton.addEventListener("click", handleMainAction);
  retryButton.addEventListener("click", resetCurrentChallenge);

  editor.addEventListener("mouseup", saveSelection);
  editor.addEventListener("keyup", saveSelection);
  editor.addEventListener("focus", saveSelection);

  editor.addEventListener("beforeinput", () => {
    if (!appState.suppressInput) saveUndo();
  });

  editor.addEventListener("input", () => {
    saveSelection();
    updateStatus("Text geändert");
  });

  editor.addEventListener("keydown", handleEditorKeydown);

  document.addEventListener("selectionchange", () => {
    if (isSelectionInsideEditor()) saveSelection();
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".menu-wrap")) closeMenus();
  });

  toolbar.addEventListener("mousedown", (event) => {
    if (event.target.closest("button") || event.target.closest("select")) {
      event.preventDefault();
    }
  });

  toolbar.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;

    const action = button.dataset.action;
    const command = button.dataset.command;

    if (action === "save") saveDocument("button");
    if (action === "undo") undo("button");
    if (action === "cut") cutSelection("button");
    if (action === "copy") copySelection("button");
    if (action === "paste") pasteClipboard("button");
    if (command) applyCommand(command);
  });

  fontSizeSelect.addEventListener("change", () => {
    if (fontSizeSelect.value) applyFontSize(fontSizeSelect.value);
  });
}

function renderMap() {
  lessonGrid.innerHTML = "";

  lessons.forEach((lesson) => {
    const completed = appState.completedLessons.has(lesson.id);

    const button = document.createElement("button");
    button.className = "lesson-card";
    button.innerHTML = `
      <div class="lesson-card-header">
        <div>
          <h3>${lesson.title}</h3>
          <p>${lesson.description}</p>
        </div>
        <div class="lesson-icon">${lesson.icon}</div>
      </div>

      <div class="lesson-complete">
        <span class="fake-checkbox ${completed ? "checked" : ""}">${completed ? "✓" : ""}</span>
        <span>${completed ? "Abgeschlossen" : "Noch nicht abgeschlossen"}</span>
      </div>
    `;

    button.addEventListener("click", () => startLesson(lesson.id));
    lessonGrid.appendChild(button);
  });
}

function showMap() {
  mapScreen.classList.remove("hidden");
  lessonScreen.classList.add("hidden");
  homeButton.classList.add("hidden");
  renderMap();
}

function startLesson(id) {
  appState.currentLesson = lessons.find((lesson) => lesson.id === id);
  appState.currentChallengeIndex = 0;

  mapScreen.classList.add("hidden");
  lessonScreen.classList.remove("hidden");
  homeButton.classList.remove("hidden");

  loadChallenge();
}

function getCurrentChallenge() {
  return appState.currentLesson.challenges[appState.currentChallengeIndex];
}

function loadChallenge() {
  const lesson = appState.currentLesson;
  const challenge = getCurrentChallenge();

  appState.challengeSolved = false;
  appState.actions = [];
  appState.clipboardHtml = "";
  appState.undoStack = [];
  appState.lastMenuPath = null;

  lessonTitle.textContent = lesson.title;
  challengeTitle.textContent = challenge.title;
  instructionBox.innerHTML = challenge.instruction;
  hintBox.innerHTML = challenge.hint || "";
  hintBox.classList.toggle("hidden", !challenge.hint);

  difficultyBadge.textContent = `Schwierigkeit: ${challenge.difficulty}`;
  difficultyBadge.className = "difficulty-badge";
  if (challenge.difficulty === "mittel")
    difficultyBadge.classList.add("medium");
  if (challenge.difficulty === "schwer") difficultyBadge.classList.add("hard");

  feedback.className = "feedback hidden";
  feedback.textContent = "";

  mainActionButton.textContent = "Überprüfen";
  mainActionButton.classList.remove("correct-next");

  fontSizeSelect.value = "";

  appState.suppressInput = true;
  editor.innerHTML = challenge.initialHtml;
  appState.suppressInput = false;

  editor.focus();
  placeCaretAtEnd(editor);

  updateProgress();
  updateStatus("Bereit");
}

function updateProgress() {
  const current = appState.currentChallengeIndex + 1;
  const total = appState.currentLesson.challenges.length;
  const percent = Math.round((appState.currentChallengeIndex / total) * 100);

  challengeLabel.textContent = `Challenge ${current} von ${total}`;
  progressPercent.textContent = `${percent}%`;
  progressFill.style.width = `${percent}%`;
}

function updateProgressAfterSolved() {
  const total = appState.currentLesson.challenges.length;
  const percent = Math.round(
    ((appState.currentChallengeIndex + 1) / total) * 100,
  );

  progressPercent.textContent = `${percent}%`;
  progressFill.style.width = `${percent}%`;
}

function handleMainAction() {
  if (appState.challengeSolved) {
    goToNextChallenge();
  } else {
    checkCurrentChallenge();
  }
}

function checkCurrentChallenge() {
  const challenge = getCurrentChallenge();
  const result = challenge.check(challenge);

  feedback.className = `feedback ${result.success ? "success" : "error"}`;
  feedback.textContent = result.message;

  if (result.success) {
    appState.challengeSolved = true;
    mainActionButton.textContent = isLastChallenge()
      ? "Lektion abschließen"
      : "Nächste Challenge";
    mainActionButton.classList.add("correct-next");
    updateProgressAfterSolved();
  }
}

function goToNextChallenge() {
  if (isLastChallenge()) {
    appState.completedLessons.add(appState.currentLesson.id);
    showLessonCompletedMessage();
    return;
  }

  appState.currentChallengeIndex++;
  loadChallenge();
}

function showLessonCompletedMessage() {
  feedback.className = "feedback success";
  feedback.textContent =
    "Lektion abgeschlossen! In der Übersicht wird diese Lektion jetzt mit einem Häkchen angezeigt.";
  mainActionButton.textContent = "Zur Übersicht";
  mainActionButton.classList.add("correct-next");

  appState.challengeSolved = true;

  mainActionButton.onclick = () => {
    mainActionButton.onclick = null;
    mainActionButton.addEventListener("click", handleMainAction);
    showMap();
  };
}

function isLastChallenge() {
  return (
    appState.currentChallengeIndex ===
    appState.currentLesson.challenges.length - 1
  );
}

function resetCurrentChallenge() {
  loadChallenge();
}

function renderMenubar() {
  menubar.innerHTML = "";

  Object.entries(menuData).forEach(([menuName, items]) => {
    const wrap = document.createElement("div");
    wrap.className = "menu-wrap";

    const button = document.createElement("button");
    button.className = "menu-button";
    button.textContent = menuName;

    button.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleMenu(menuName, wrap, button, items);
    });

    wrap.appendChild(button);
    menubar.appendChild(wrap);
  });
}

function toggleMenu(menuName, wrap, button, items) {
  const alreadyOpen = appState.openMenu === menuName;
  closeMenus();

  if (alreadyOpen) return;

  appState.openMenu = menuName;
  button.classList.add("active");

  const dropdown = document.createElement("div");
  dropdown.className = "dropdown";

  items.forEach((item) => {
    const itemButton = document.createElement("button");
    itemButton.textContent = item;

    itemButton.addEventListener("click", (event) => {
      event.stopPropagation();

      appState.lastMenuPath = `${menuName}>${item}`;
      recordAction(`menu:${menuName}>${item}`);

      if (menuName === "Datei" && item === "Speichern") {
        saveDocument("menu");
      }

      if (menuName === "Bearbeiten" && item === "Rückgängig") {
        undo("menu");
      }

      if (menuName === "Bearbeiten" && item === "Ausschneiden") {
        cutSelection("menu");
      }

      if (menuName === "Bearbeiten" && item === "Kopieren") {
        copySelection("menu");
      }

      if (menuName === "Bearbeiten" && item === "Einfügen") {
        pasteClipboard("menu");
      }

      updateStatus(`Menübefehl: ${menuName} > ${item}`);
      closeMenus();
    });

    dropdown.appendChild(itemButton);
  });

  wrap.appendChild(dropdown);
  updateStatus(`Menü geöffnet: ${menuName}`);
}

function closeMenus() {
  document
    .querySelectorAll(".dropdown")
    .forEach((dropdown) => dropdown.remove());
  document
    .querySelectorAll(".menu-button.active")
    .forEach((button) => button.classList.remove("active"));
  appState.openMenu = null;
}

function handleEditorKeydown(event) {
  const key = event.key.toLowerCase();

  if (event.ctrlKey && key === "c") {
    event.preventDefault();
    copySelection("shortcut");
  }

  if (event.ctrlKey && key === "x") {
    event.preventDefault();
    cutSelection("shortcut");
  }

  if (event.ctrlKey && key === "v") {
    event.preventDefault();
    pasteClipboard("shortcut");
  }

  if (event.ctrlKey && key === "z") {
    event.preventDefault();
    undo("shortcut");
  }

  if (event.ctrlKey && key === "s") {
    event.preventDefault();
    saveDocument("shortcut");
  }
}

function saveDocument(source) {
  recordAction(`${source}:save`);
  updateStatus("Dokument gespeichert");
}

function copySelection(source) {
  restoreSelection();

  const selection = window.getSelection();

  if (
    !selection.rangeCount ||
    selection.isCollapsed ||
    !isSelectionInsideEditor()
  ) {
    updateStatus("Markiere zuerst einen Text.");
    return;
  }

  const range = selection.getRangeAt(0);
  const div = document.createElement("div");
  div.appendChild(range.cloneContents());

  appState.clipboardHtml = div.innerHTML;
  recordAction(`${source}:copy`);
  updateStatus("Text kopiert");
}

function cutSelection(source) {
  restoreSelection();

  const selection = window.getSelection();

  if (
    !selection.rangeCount ||
    selection.isCollapsed ||
    !isSelectionInsideEditor()
  ) {
    updateStatus("Markiere zuerst einen Text.");
    return;
  }

  saveUndo();

  const range = selection.getRangeAt(0);
  const div = document.createElement("div");
  div.appendChild(range.cloneContents());

  appState.clipboardHtml = div.innerHTML;
  range.deleteContents();

  recordAction(`${source}:cut`);
  saveSelection();
  updateStatus("Text ausgeschnitten");
}

function pasteClipboard(source) {
  restoreSelection();

  if (!appState.clipboardHtml) {
    updateStatus("Die Zwischenablage ist leer.");
    return;
  }

  if (!isSelectionInsideEditor()) {
    editor.focus();
    placeCaretAtEnd(editor);
  }

  saveUndo();

  const selection = window.getSelection();
  let range;

  if (selection.rangeCount) {
    range = selection.getRangeAt(0);
  } else {
    range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);
  }

  range.deleteContents();

  const fragment = range.createContextualFragment(appState.clipboardHtml);
  const lastNode = fragment.lastChild;

  range.insertNode(fragment);

  if (lastNode) {
    range = document.createRange();
    range.setStartAfter(lastNode);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  recordAction(`${source}:paste`);
  saveSelection();
  updateStatus("Text eingefügt");
}

function undo(source) {
  if (appState.undoStack.length === 0) {
    updateStatus("Nichts zum Rückgängigmachen.");
    return;
  }

  appState.suppressInput = true;
  editor.innerHTML = appState.undoStack.pop();
  appState.suppressInput = false;

  recordAction(`${source}:undo`);
  editor.focus();
  placeCaretAtEnd(editor);
  updateStatus("Rückgängig");
}

function applyCommand(command) {
  restoreSelection();

  if (!isSelectionInsideEditor()) {
    updateStatus("Markiere zuerst Text.");
    return;
  }

  const selection = window.getSelection();

  if (!selection.rangeCount || selection.isCollapsed) {
    updateStatus("Markiere zuerst Text.");
    return;
  }

  saveUndo();
  document.execCommand(command, false, null);
  recordAction(`button:${command}`);
  saveSelection();

  const labels = {
    bold: "Fett",
    italic: "Kursiv",
    underline: "Unterstrichen",
    strikeThrough: "Durchgestrichen",
  };

  updateStatus(`${labels[command]} angewendet`);
}

function applyFontSize(size) {
  restoreSelection();

  const selection = window.getSelection();

  if (
    !selection.rangeCount ||
    selection.isCollapsed ||
    !isSelectionInsideEditor()
  ) {
    updateStatus("Markiere zuerst Text.");
    return;
  }

  saveUndo();

  const range = selection.getRangeAt(0);
  const span = document.createElement("span");
  span.style.fontSize = size;

  try {
    range.surroundContents(span);
  } catch {
    const contents = range.extractContents();
    span.appendChild(contents);
    range.insertNode(span);
  }

  const newRange = document.createRange();
  newRange.selectNodeContents(span);
  selection.removeAllRanges();
  selection.addRange(newRange);

  recordAction(`button:fontSize:${size}`);
  saveSelection();
  updateStatus(`Schriftgröße ${size.replace("px", "")} angewendet`);
}

function saveUndo() {
  appState.undoStack.push(editor.innerHTML);
  if (appState.undoStack.length > 50) appState.undoStack.shift();
}

function recordAction(action) {
  appState.actions.push(action);
}

function actionWasUsed(action) {
  return appState.actions.includes(action);
}

function saveSelection() {
  const selection = window.getSelection();

  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);

  if (editor.contains(range.commonAncestorContainer)) {
    appState.savedRange = range.cloneRange();
  }
}

function restoreSelection() {
  if (!appState.savedRange) {
    editor.focus();
    return;
  }

  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(appState.savedRange);
  editor.focus();
}

function isSelectionInsideEditor() {
  const selection = window.getSelection();

  if (!selection.rangeCount) return false;

  const range = selection.getRangeAt(0);
  return editor.contains(range.commonAncestorContainer);
}

function placeCaretAtEnd(element) {
  const range = document.createRange();
  range.selectNodeContents(element);
  range.collapse(false);

  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);

  saveSelection();
}

function getEditorText() {
  return editor.innerText.replace(/\u00a0/g, " ");
}

function normalize(text) {
  return text
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/ ?\n ?/g, "\n")
    .trim();
}

function ok(message) {
  return { success: true, message };
}

function bad(message) {
  return { success: false, message };
}

function checkSelectionExactly(expected) {
  const selection = window.getSelection();

  if (
    !selection.rangeCount ||
    selection.isCollapsed ||
    !isSelectionInsideEditor()
  ) {
    return bad("Du hast noch keinen Text markiert.");
  }

  const selected = normalize(selection.toString());

  if (selected === expected) {
    return ok("Richtig markiert!");
  }

  return bad(
    `Noch nicht ganz. Markiert ist: „${selected}“. Gesucht ist: „${expected}“.`,
  );
}

function checkPlainText(expected) {
  const actual = normalize(getEditorText());
  const wanted = normalize(expected);

  if (actual === wanted) {
    return ok("Richtig! Der Text steht an der passenden Stelle.");
  }

  return bad(`Noch nicht richtig. Im Dokument steht gerade: „${actual}“`);
}

function getCharacterMap() {
  const chars = [];
  let text = "";

  function walk(node, style) {
    if (node.nodeType === Node.TEXT_NODE) {
      const value = node.nodeValue || "";

      for (const char of value) {
        chars.push({ ...style, char });
        text += char;
      }

      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const element = node;
    const tag = element.tagName.toLowerCase();
    const computed = window.getComputedStyle(element);

    const nextStyle = {
      bold:
        style.bold ||
        tag === "b" ||
        tag === "strong" ||
        parseInt(computed.fontWeight, 10) >= 600,

      italic:
        style.italic ||
        tag === "i" ||
        tag === "em" ||
        computed.fontStyle === "italic",

      underline:
        style.underline ||
        tag === "u" ||
        computed.textDecorationLine.includes("underline"),

      strike:
        style.strike ||
        tag === "s" ||
        tag === "strike" ||
        computed.textDecorationLine.includes("line-through"),

      fontSize:
        element.style && element.style.fontSize
          ? element.style.fontSize
          : style.fontSize,
    };

    if (tag === "br") {
      chars.push({ ...nextStyle, char: "\n" });
      text += "\n";
      return;
    }

    if (tag === "div" || tag === "p") {
      if (text.length > 0 && !text.endsWith("\n")) {
        chars.push({ ...nextStyle, char: "\n" });
        text += "\n";
      }
    }

    node.childNodes.forEach((child) => walk(child, nextStyle));
  }

  editor.childNodes.forEach((child) =>
    walk(child, {
      bold: false,
      italic: false,
      underline: false,
      strike: false,
      fontSize: "",
    }),
  );

  return { text, chars };
}

function findTargetRange(text, target) {
  const index = text.indexOf(target);
  if (index === -1) return null;

  return {
    start: index,
    end: index + target.length,
  };
}

function checkStyleOnlyTarget(target, styleKey, germanName) {
  const result = checkStyleOnlyTargetResult(target, styleKey);

  if (result) {
    return ok(`Geschafft! Nur „${target}“ ist ${germanName}.`);
  }

  if (!checkStyleOnTarget(target, styleKey)) {
    return bad(`„${target}“ ist noch nicht ${germanName}.`);
  }

  return bad(
    `Fast richtig. „${target}“ ist ${germanName}, aber anderer Text auch.`,
  );
}

function checkStyleOnlyTargetResult(target, styleKey, allowOutside = true) {
  const map = getCharacterMap();
  const range = findTargetRange(map.text, target);

  if (!range) return false;

  const targetOk = map.chars
    .slice(range.start, range.end)
    .filter((c) => !/\s/.test(c.char))
    .every((c) => c[styleKey]);

  if (!targetOk) return false;

  if (!allowOutside) return true;

  const outsideStyled = map.chars.some((c, index) => {
    const inside = index >= range.start && index < range.end;
    return !inside && !/\s/.test(c.char) && c[styleKey];
  });

  return !outsideStyled;
}

function checkStyleOnTarget(target, styleKey) {
  const map = getCharacterMap();
  const range = findTargetRange(map.text, target);

  if (!range) return false;

  return map.chars
    .slice(range.start, range.end)
    .filter((c) => !/\s/.test(c.char))
    .every((c) => c[styleKey]);
}

function checkAnyStyleOnTarget(target, styleKey) {
  const map = getCharacterMap();
  const range = findTargetRange(map.text, target);

  if (!range) return false;

  return map.chars
    .slice(range.start, range.end)
    .filter((c) => !/\s/.test(c.char))
    .some((c) => c[styleKey]);
}

function checkFontSize(target, expectedSize) {
  if (checkFontSizeResult(target, expectedSize)) {
    return ok(`Richtig! „${target}“ hat die passende Schriftgröße.`);
  }

  return bad(
    `„${target}“ hat noch nicht die Schriftgröße ${expectedSize.replace("px", "")}.`,
  );
}

function checkFontSizeResult(target, expectedSize) {
  const map = getCharacterMap();
  const range = findTargetRange(map.text, target);

  if (!range) return false;

  return map.chars
    .slice(range.start, range.end)
    .filter((c) => !/\s/.test(c.char))
    .every((c) => c.fontSize === expectedSize);
}

function updateStatus(text) {
  statusLeft.textContent = text;
}
