/* =========================================================
   NEET PLANNER & TRACKER
   MULTI-SUBJECT + MULTI-CHAPTER VERSION
========================================================= */


/* =========================================================
   BATCH DATA
========================================================= */

const BATCHES = {

  arjuna2027: {
    name: "Arjuna NEET 2027",

    faculty: {
      Physics: "Saleem Ahmad Sir",
      "Physical Chemistry": "Sudhanshu Kumar Sir",
      "Inorganic Chemistry": "Kunwar Om Pandey Sir",
      "Organic Chemistry": "Pankaj Sijariya Sir",
      Botany: "Dr. Vipin Sharma Sir",
      Zoology: "Samapti Sinha Ma'am"
    },

    schedule: {
      Monday: ["Zoology", "Physics"],
      Tuesday: ["Zoology", "Chemistry"],
      Wednesday: ["Chemistry", "Physics"],
      Thursday: ["Chemistry", "Physics"],
      Friday: ["Botany", "Physics"],
      Saturday: ["Botany", "Chemistry"],
      Sunday: []
    }
  },

  arjuna20_2027: {
    name: "Arjuna NEET 2.0 2027",

    faculty: {
      Physics: "Rajwant Singh Sir",
      "Physical Chemistry": "Nikhil Saini Sir",
      "Inorganic Chemistry": "Mohit Dadheech Sir",
      "Organic Chemistry": "Yogesh Jain Sir",
      Botany: "Dr. Vipin Sharma Sir",
      Zoology: "Tulika Jha Ma'am"
    },

    schedule: {
      Monday: ["Botany", "Chemistry"],
      Tuesday: ["Botany", "Chemistry"],
      Wednesday: ["Physics", "Zoology"],
      Thursday: ["Physics", "Zoology"],
      Friday: [],
      Saturday: ["Physics", "Chemistry"],
      Sunday: []
    }
  }

};


/* =========================================================
   SUBJECTS
========================================================= */

const SUBJECTS = [
  "Physics",
  "Physical Chemistry",
  "Inorganic Chemistry",
  "Organic Chemistry",
  "Botany",
  "Zoology"
];


/* =========================================================
   CHAPTER LIST
========================================================= */

const CHAPTERS = {

  Physics: [
    "Units and Measurements",
    "Mathematical Tools",
    "Vectors",
    "Motion in a Straight Line",
    "Motion in a Plane",
    "Laws of Motion",
    "Work, Energy and Power",
    "Centre of Mass and System of Particles",
    "Rotational Motion",
    "Gravitation",
    "Mechanical Properties of Solids",
    "Mechanical Properties of Fluids",
    "Thermal Properties of Matter",
    "Thermodynamics",
    "Kinetic Theory",
    "Oscillations",
    "Waves",
    "Electric Charges and Fields",
    "Electrostatic Potential and Capacitance",
    "Current Electricity",
    "Moving Charges and Magnetism",
    "Magnetism and Matter",
    "Electromagnetic Induction",
    "Alternating Current",
    "Electromagnetic Waves",
    "Ray Optics and Optical Instruments",
    "Wave Optics",
    "Dual Nature of Radiation and Matter",
    "Atoms",
    "Nuclei",
    "Semiconductor Electronics"
  ],

  "Physical Chemistry": [
    "Some Basic Concepts of Chemistry",
    "Structure of Atom",
    "Thermodynamics",
    "Equilibrium",
    "Redox Reactions",
    "Solutions",
    "Electrochemistry",
    "Chemical Kinetics",
    "Surface Chemistry"
  ],

  "Inorganic Chemistry": [
    "Periodic Classification of Elements",
    "Chemical Bonding and Molecular Structure",
    "Hydrogen",
    "s-Block Elements",
    "p-Block Elements",
    "d and f Block Elements",
    "Coordination Compounds",
    "Metallurgy",
    "Environmental Chemistry"
  ],

  "Organic Chemistry": [
    "Some Basic Principles of Organic Chemistry",
    "Hydrocarbons",
    "Haloalkanes and Haloarenes",
    "Alcohols, Phenols and Ethers",
    "Aldehydes, Ketones and Carboxylic Acids",
    "Amines",
    "Biomolecules",
    "Polymers",
    "Chemistry in Everyday Life"
  ],

  Botany: [
    "The Living World",
    "Biological Classification",
    "Plant Kingdom",
    "Morphology of Flowering Plants",
    "Anatomy of Flowering Plants",
    "Structural Organisation in Plants",
    "Cell: The Unit of Life",
    "Biomolecules",
    "Cell Cycle and Cell Division",
    "Transport in Plants",
    "Mineral Nutrition",
    "Photosynthesis in Plants",
    "Respiration in Plants",
    "Plant Growth and Development",
    "Sexual Reproduction in Flowering Plants",
    "Principles of Inheritance and Variation",
    "Molecular Basis of Inheritance",
    "Evolution",
    "Strategies for Enhancement in Food Production",
    "Microbes in Human Welfare",
    "Ecology",
    "Biodiversity and Conservation"
  ],

  Zoology: [
    "Animal Kingdom",
    "Structural Organisation in Animals",
    "Human Physiology",
    "Digestion and Absorption",
    "Breathing and Exchange of Gases",
    "Body Fluids and Circulation",
    "Excretory Products and their Elimination",
    "Locomotion and Movement",
    "Neural Control and Coordination",
    "Chemical Coordination and Integration",
    "Human Reproduction",
    "Reproductive Health",
    "Human Health and Disease",
    "Evolution",
    "Animal Husbandry",
    "Human Welfare",
    "Biotechnology",
    "Ecology"
  ]

};


/* =========================================================
   STATE
========================================================= */

let state = {

  batch: null,

  selectedSubjects: [],

  subjectQueue: [],
  currentSubjectIndex: 0,
  currentSubject: null,

  selectedChapter: null,
  totalLectures: 0,
  selectedBacklogLectures: [],

  chapters: [],

  targetDate: null,

  settings: {
    lectureMinutes: 105,
    notesMinutes: 30,
    dppMinutes: 30,
    questionMinutes: 60,
    revisionMinutes: 45,
    dailyHours: 12
  },

  tasks: [],

  currentStep: 1,
  plannerDateIndex: 0

};


/* =========================================================
   DOM HELPERS
========================================================= */

const $ = id => document.getElementById(id);

function qs(selector) {
  return document.querySelector(selector);
}

function qsa(selector) {
  return document.querySelectorAll(selector);
}


/* =========================================================
   LOCAL STORAGE
========================================================= */

const STORAGE_KEY = "neetPlannerState_v2";


function saveState() {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(state)
  );

}


function loadState() {

  try {

    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return false;

    const parsed = JSON.parse(saved);

    state = {
      ...state,
      ...parsed,
      settings: {
        ...state.settings,
        ...(parsed.settings || {})
      }
    };

    return true;

  } catch (error) {

    console.error(error);

    return false;

  }

}


/* =========================================================
   UTILITY
========================================================= */

function createId() {

  return (
    Date.now().toString(36) +
    Math.random().toString(36).substring(2, 8)
  );

}


function todayString() {

  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;

}


function formatDate(dateString) {

  if (!dateString) return "";

  const date = new Date(dateString + "T00:00:00");

  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  });

}


function getDayName(dateString) {

  const date = new Date(dateString + "T00:00:00");

  return date.toLocaleDateString("en-US", {
    weekday: "long"
  });

}


function addDays(dateString, number) {

  const date = new Date(dateString + "T00:00:00");

  date.setDate(date.getDate() + number);

  return date.toISOString().split("T")[0];

}


function escapeHtml(value) {

  if (value === undefined || value === null) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

  const toast = $("toast");
  const toastMessage = $("toastMessage");

  if (!toast || !toastMessage) return;

  toastMessage.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);

}


/* =========================================================
   STEP NAVIGATION
========================================================= */

function showStep(step) {

  state.currentStep = step;

  qsa(".onboarding-step").forEach(section => {

    section.classList.remove("active");

    if (String(section.dataset.step) === String(step)) {
      section.classList.add("active");
    }

  });


  const normalSteps = 11;

  let numericStep = Number(step);

  if (step === "ready") {

    if ($("stepTitle")) {
      $("stepTitle").textContent = "Complete";
    }

    if ($("stepPercent")) {
      $("stepPercent").textContent = "100%";
    }

    if ($("onboardingProgressBar")) {
      $("onboardingProgressBar").style.width = "100%";
    }

    return;
  }


  const percent = Math.round(
    (numericStep / normalSteps) * 100
  );

  if ($("stepTitle")) {
    $("stepTitle").textContent =
      `Step ${numericStep} of ${normalSteps}`;
  }

  if ($("stepPercent")) {
    $("stepPercent").textContent = `${percent}%`;
  }

  if ($("onboardingProgressBar")) {
    $("onboardingProgressBar").style.width = `${percent}%`;
  }

}


/* =========================================================
   BATCH SELECTION
========================================================= */

function renderBatchOptions() {

  const container = $("batchOptions");

  if (!container) return;

  container.innerHTML = "";

  Object.entries(BATCHES).forEach(([id, batch]) => {

    const card = document.createElement("button");

    card.className = "selection-card";

    if (state.batch === id) {
      card.classList.add("selected");
    }

    card.innerHTML = `
      <div class="selection-icon">🎓</div>

      <div class="selection-content">
        <strong>${escapeHtml(batch.name)}</strong>
        <span>Faculty + weekly schedule automatically loaded</span>
      </div>

      <div class="selection-check">✓</div>
    `;

    card.addEventListener("click", () => {

      state.batch = id;

      qsa("#batchOptions .selection-card")
        .forEach(item => item.classList.remove("selected"));

      card.classList.add("selected");

      $("batchNextBtn").disabled = false;

    });

    container.appendChild(card);

  });

}


function continueFromBatch() {

  if (!state.batch) return;

  renderSubjectOptions();

  showStep(2);

}


/* =========================================================
   SUBJECT SELECTION — MULTIPLE
========================================================= */

function renderSubjectOptions() {

  const container = $("subjectOptions");

  if (!container) return;

  container.innerHTML = "";

  SUBJECTS.forEach(subject => {

    const selected =
      state.selectedSubjects.includes(subject);

    const card = document.createElement("button");

    card.className = "selection-card";

    if (selected) {
      card.classList.add("selected");
    }

    card.innerHTML = `
      <div class="selection-icon">
        ${getSubjectIcon(subject)}
      </div>

      <div class="selection-content">
        <strong>${escapeHtml(subject)}</strong>
        <span>${getTeacher(subject)}</span>
      </div>

      <div class="selection-check">✓</div>
    `;

    card.addEventListener("click", () => {

      if (state.selectedSubjects.includes(subject)) {

        state.selectedSubjects =
          state.selectedSubjects.filter(
            item => item !== subject
          );

        card.classList.remove("selected");

      } else {

        state.selectedSubjects.push(subject);

        card.classList.add("selected");

      }

      updateSubjectNextButton();

    });

    container.appendChild(card);

  });


  updateSubjectNextButton();

}


function updateSubjectNextButton() {

  if (!$("subjectNextBtn")) return;

  $("subjectNextBtn").disabled =
    state.selectedSubjects.length === 0;

}


function continueFromSubjects() {

  if (state.selectedSubjects.length === 0) return;

  state.subjectQueue = [...state.selectedSubjects];

  state.currentSubjectIndex = 0;

  state.currentSubject =
    state.subjectQueue[0];

  state.selectedChapter = null;

  state.totalLectures = 0;

  state.selectedBacklogLectures = [];

  renderChapterSelection();

  showStep(3);

}


/* =========================================================
   SUBJECT / FACULTY
========================================================= */

function getTeacher(subject) {

  if (!state.batch) return "";

  const faculty =
    BATCHES[state.batch].faculty;

  return faculty[subject] || "Current Class";

}


function getSubjectIcon(subject) {

  const icons = {

    Physics: "⚡",

    "Physical Chemistry": "🧪",

    "Inorganic Chemistry": "⚗️",

    "Organic Chemistry": "🧬",

    Botany: "🌿",

    Zoology: "🐸"

  };

  return icons[subject] || "📚";

}


/* =========================================================
   CHAPTER SELECTION
========================================================= */

function renderChapterSelection() {

  const subject = state.currentSubject;

  if (!subject) return;

  const chapterContainer = $("chapterOptions");

  if (!chapterContainer) return;

  if ($("currentSubjectTitle")) {
    $("currentSubjectTitle").textContent =
      `${subject} — Chapter Selection`;
  }

  if ($("chapterSubjectTitle")) {

    $("chapterSubjectTitle").innerHTML = `
      <div class="selected-info-main">
        <span class="selected-info-icon">
          ${getSubjectIcon(subject)}
        </span>

        <div>
          <strong>${escapeHtml(subject)}</strong>

          <small>
            ${escapeHtml(getTeacher(subject))}
          </small>
        </div>
      </div>
    `;

  }


  if ($("subjectProgressCounter")) {

    $("subjectProgressCounter").textContent =
      `Subject ${state.currentSubjectIndex + 1} of ${state.subjectQueue.length}`;

  }


  const subjectChapters =
    state.chapters.filter(
      chapter => chapter.subject === subject
    );


  if ($("subjectChapterSummary")) {

    if (subjectChapters.length > 0) {

      $("subjectChapterSummary")
        .classList.remove("hidden");

      $("subjectChapterList").innerHTML =
        subjectChapters.map(chapter => `
          <div class="mini-list-item">
            <span>
              ${escapeHtml(chapter.chapter)}
            </span>

            <strong>
              ${chapter.backlogLectures.length} backlog
            </strong>
          </div>
        `).join("");

    } else {

      $("subjectChapterSummary")
        .classList.add("hidden");

    }

  }


  chapterContainer.innerHTML = "";

  const chapters =
    CHAPTERS[subject] || [];


  chapters.forEach(chapter => {

    const button = document.createElement("button");

    button.className = "chapter-option";

    if (state.selectedChapter === chapter) {
      button.classList.add("selected");
    }

    button.innerHTML = `
      <span class="chapter-number">
        ${chapters.indexOf(chapter) + 1}
      </span>

      <span class="chapter-name">
        ${escapeHtml(chapter)}
      </span>

      <span class="chapter-check">
        ✓
      </span>
    `;

    button.addEventListener("click", () => {

      state.selectedChapter = chapter;

      qsa("#chapterOptions .chapter-option")
        .forEach(item => item.classList.remove("selected"));

      button.classList.add("selected");

      $("chapterNextBtn").disabled = false;

    });

    chapterContainer.appendChild(button);

  });


  $("chapterNextBtn").disabled =
    !state.selectedChapter;

}


/* =========================================================
   CHAPTER → LECTURE DETAILS
========================================================= */

function continueFromChapter() {

  if (!state.selectedChapter) return;

  state.totalLectures = 0;
  state.selectedBacklogLectures = [];

  $("totalLectures").value = "";

  $("lectureSelectionBox")
    .classList.add("hidden");

  $("lectureNextBtn").disabled = true;

  if ($("selectedChapterInfo")) {

    $("selectedChapterInfo").innerHTML = `
      <div class="selected-info-main">

        <span class="selected-info-icon">
          ${getSubjectIcon(state.currentSubject)}
        </span>

        <div>
          <strong>
            ${escapeHtml(state.currentSubject)}
          </strong>

          <small>
            ${escapeHtml(state.selectedChapter)}
          </small>
        </div>

      </div>
    `;

  }


  const existingChapters =
    state.chapters.filter(
      chapter =>
        chapter.subject === state.currentSubject
    );

  if ($("chapterProgressCounter")) {

    $("chapterProgressCounter").textContent =
      `Chapter ${existingChapters.length + 1}`;

  }

  showStep(4);

}


/* =========================================================
   TOTAL LECTURES
========================================================= */

function handleTotalLecturesChange() {

  const value =
    parseInt($("totalLectures").value, 10);

  if (!value || value < 1) {

    $("lectureSelectionBox")
      .classList.add("hidden");

    $("lectureNextBtn").disabled = true;

    return;
  }

  state.totalLectures = value;

  generateLectureCheckboxes();

}


/* =========================================================
   LECTURE CHECKBOXES
========================================================= */

function generateLectureCheckboxes() {

  const container = $("lectureCheckboxes");

  if (!container) return;

  const total = state.totalLectures;

  container.innerHTML = "";

  $("lectureSelectionBox")
    .classList.remove("hidden");


  for (let i = 1; i <= total; i++) {

    const label = document.createElement("label");

    label.className = "lecture-checkbox";

    label.innerHTML = `
      <input
        type="checkbox"
        value="${i}"
      >

      <span>
        Lecture ${i}
      </span>
    `;

    const checkbox =
      label.querySelector("input");

    if (
      state.selectedBacklogLectures
        .includes(i)
    ) {
      checkbox.checked = true;
    }

    checkbox.addEventListener("change", () => {

      updateSelectedLectureNumbers();

    });

    container.appendChild(label);

  }


  updateSelectedLectureNumbers();

}


function updateSelectedLectureNumbers() {

  state.selectedBacklogLectures =
    Array.from(
      document.querySelectorAll(
        "#lectureCheckboxes input[type='checkbox']:checked"
      )
    )
    .map(input => Number(input.value))
    .sort((a, b) => a - b);


  if ($("backlogLectureCount")) {

    $("backlogLectureCount").textContent =
      `${state.selectedBacklogLectures.length} Backlog`;

  }


  $("lectureNextBtn").disabled =
    state.selectedBacklogLectures.length === 0;

}


/* =========================================================
   RANGE SELECT
========================================================= */

function applyLectureRange() {

  const start =
    parseInt($("rangeStart").value, 10);

  const end =
    parseInt($("rangeEnd").value, 10);

  if (
    !start ||
    !end ||
    start < 1 ||
    end < start ||
    end > state.totalLectures
  ) {

    showToast(
      `Enter a valid range from 1 to ${state.totalLectures}`
    );

    return;
  }


  const checkboxes =
    document.querySelectorAll(
      "#lectureCheckboxes input[type='checkbox']"
    );


  checkboxes.forEach(checkbox => {

    const number =
      Number(checkbox.value);

    checkbox.checked =
      number >= start &&
      number <= end;

  });


  updateSelectedLectureNumbers();

}


/* =========================================================
   SAVE CURRENT CHAPTER
========================================================= */

function saveCurrentChapter() {

  updateSelectedLectureNumbers();

  if (
    !state.currentSubject ||
    !state.selectedChapter ||
    !state.totalLectures ||
    state.selectedBacklogLectures.length === 0
  ) {

    showToast(
      "Please complete the lecture details first."
    );

    return;
  }


  const chapter = {

    id: createId(),

    subject: state.currentSubject,

    chapter: state.selectedChapter,

    totalLectures: state.totalLectures,

    backlogLectures: [
      ...state.selectedBacklogLectures
    ],

    lectures: Array.from(
      { length: state.totalLectures },
      (_, index) => ({
        number: index + 1,
        completed:
          !state.selectedBacklogLectures
            .includes(index + 1)
      })
    ),

    createdAt:
      new Date().toISOString()

  };


  state.chapters.push(chapter);

  saveState();

  renderChapterCompleted();

  showStep(5);

}


/* =========================================================
   CHAPTER COMPLETED SCREEN
========================================================= */

function renderChapterCompleted() {

  const chapter =
    state.chapters[state.chapters.length - 1];

  if (!chapter) return;


  if ($("chapterCompletedTitle")) {

    $("chapterCompletedTitle").textContent =
      `${chapter.chapter} Saved ✓`;

  }


  if ($("chapterCompletedDescription")) {

    $("chapterCompletedDescription").textContent =
      `${chapter.subject} ka chapter successfully add ho gaya.`;

  }


  if ($("chapterCompletedSummary")) {

    $("chapterCompletedSummary").innerHTML = `

      <div class="completion-row">

        <span>Subject</span>

        <strong>
          ${escapeHtml(chapter.subject)}
        </strong>

      </div>


      <div class="completion-row">

        <span>Chapter</span>

        <strong>
          ${escapeHtml(chapter.chapter)}
        </strong>

      </div>


      <div class="completion-row">

        <span>Total Lectures</span>

        <strong>
          ${chapter.totalLectures}
        </strong>

      </div>


      <div class="completion-row">

        <span>Backlog Lectures</span>

        <strong>
          ${chapter.backlogLectures.length}
        </strong>

      </div>

    `;

  }


  const hasNextSubject =
    state.currentSubjectIndex <
    state.subjectQueue.length - 1;


  const addButton =
    $("addAnotherChapterBtn");

  const nextButton =
    $("nextSubjectBtn");

  const allCompleteButton =
    $("allSubjectsCompleteBtn");


  addButton.classList.remove("hidden");


  if (hasNextSubject) {

    nextButton.classList.remove("hidden");

    allCompleteButton.classList.add("hidden");

  } else {

    nextButton.classList.add("hidden");

    allCompleteButton.classList.remove("hidden");

  }

}


/* =========================================================
   ADD ANOTHER CHAPTER — SAME SUBJECT
========================================================= */

function addAnotherChapter() {

  state.selectedChapter = null;
  state.totalLectures = 0;
  state.selectedBacklogLectures = [];

  renderChapterSelection();

  showStep(3);

}


/* =========================================================
   NEXT SUBJECT
========================================================= */

function goToNextSubject() {

  if (
    state.currentSubjectIndex >=
    state.subjectQueue.length - 1
  ) {

    finishAllSubjects();

    return;
  }


  state.currentSubjectIndex++;

  state.currentSubject =
    state.subjectQueue[
      state.currentSubjectIndex
    ];


  state.selectedChapter = null;
  state.totalLectures = 0;
  state.selectedBacklogLectures = [];


  renderChapterSelection();

  showStep(3);

}


/* =========================================================
   FINISH ALL SUBJECTS
========================================================= */

function finishAllSubjects() {

  if (state.chapters.length === 0) {

    showToast(
      "At least one chapter is required."
    );

    return;
  }


  renderOverallBacklogSummary();

  setMinimumTargetDate();

  showStep(6);

}


/* =========================================================
   OVERALL BACKLOG SUMMARY
========================================================= */

function getTotalBacklogCount() {

  return state.chapters.reduce(
    (total, chapter) =>
      total + chapter.backlogLectures.length,
    0
  );

}


function renderOverallBacklogSummary() {

  const container =
    $("overallBacklogSummary");

  if (!container) return;


  const subjectSummary = {};


  state.chapters.forEach(chapter => {

    if (!subjectSummary[chapter.subject]) {

      subjectSummary[chapter.subject] = 0;

    }

    subjectSummary[chapter.subject] +=
      chapter.backlogLectures.length;

  });


  container.innerHTML = `

    <div class="backlog-total">

      <strong>
        ${getTotalBacklogCount()}
      </strong>

      <span>
        Total backlog lectures
      </span>

    </div>


    <div class="backlog-subjects">

      ${Object.entries(subjectSummary)
        .map(([subject, count]) => `

          <div class="backlog-subject-item">

            <span>
              ${getSubjectIcon(subject)}
              ${escapeHtml(subject)}
            </span>

            <strong>
              ${count}
            </strong>

          </div>

        `)
        .join("")}

    </div>

  `;

}


/* =========================================================
   TARGET DATE
========================================================= */

function setMinimumTargetDate() {

  const input = $("targetDate");

  if (!input) return;

  const today = todayString();

  input.min = today;

  if (!input.value) {

    input.value =
      addDays(today, 14);

  }

}


function handleTargetDate() {

  const date =
    $("targetDate").value;

  if (!date) return;

  state.targetDate = date;

  saveState();

  showStep(7);

}


/* =========================================================
   LECTURE TIME
========================================================= */

function selectLectureTime(minutes) {

  state.settings.lectureMinutes =
    Number(minutes);


  qsa(".time-option").forEach(button => {

    button.classList.toggle(
      "selected",
      Number(button.dataset.minutes) ===
      Number(minutes)
    );

  });


  if ($("customLectureTime")) {

    $("customLectureTime").value =
      minutes;

  }

}


function handleCustomLectureTime() {

  const value =
    Number($("customLectureTime").value);

  if (!value || value < 15) return;

  state.settings.lectureMinutes = value;

  qsa(".time-option").forEach(button => {
    button.classList.remove("selected");
  });

}


/* =========================================================
   NOTES + DPP
========================================================= */

function saveNotesSettings() {

  const notes =
    Number($("notesMinutes").value);

  const dpp =
    Number($("dppMinutes").value);


  state.settings.notesMinutes =
    Math.max(0, notes || 0);

  state.settings.dppMinutes =
    Math.max(0, dpp || 0);

  saveState();

  showStep(9);

}


/* =========================================================
   QUESTION PRACTICE
========================================================= */

function saveQuestionSettings() {

  const value =
    Number($("questionMinutes").value);

  state.settings.questionMinutes =
    Math.max(0, value || 0);

  saveState();

  showStep(10);

}


/* =========================================================
   REVISION
========================================================= */

function saveRevisionSettings() {

  const value =
    Number($("revisionMinutes").value);

  state.settings.revisionMinutes =
    Math.max(0, value || 0);

  saveState();

  showStep(11);

}


/* =========================================================
   DAILY CAPACITY + GENERATE PLAN
========================================================= */

function generatePlan() {

  const hours =
    Number($("dailyHours").value);

  if (!hours || hours <= 0) {

    showToast(
      "Please enter your daily study capacity."
    );

    return;
  }


  state.settings.dailyHours = hours;

  saveState();

  generateTasks();

  saveState();

  renderReadySummary();

  showStep("ready");

}


/* =========================================================
   CREATE BACKLOG LECTURE POOL
========================================================= */

function getBacklogLecturePool() {

  const pool = [];


  state.chapters.forEach(chapter => {

    chapter.backlogLectures.forEach(number => {

      pool.push({

        id: createId(),

        type: "lecture",

        chapterId: chapter.id,

        subject: chapter.subject,

        chapter: chapter.chapter,

        lectureNumber: number,

        title:
          `${chapter.chapter} — Lecture ${number}`,

        completed: false

      });

    });

  });


  return pool;

}


/* =========================================================
   CURRENT CLASS TEACHER
========================================================= */

function getCurrentClassTeacher(subject) {

  if (!state.batch) {
    return "Current Class";
  }

  if (subject === "Physics") {
    return BATCHES[state.batch].faculty.Physics;
  }

  if (subject === "Botany") {
    return BATCHES[state.batch].faculty.Botany;
  }

  if (subject === "Zoology") {
    return BATCHES[state.batch].faculty.Zoology;
  }

  if (subject === "Chemistry") {
    return "Chemistry Current Class";
  }

  return "Current Class";

}


/* =========================================================
   GENERATE COMPLETE COMBINED PLAN
========================================================= */

function generateTasks() {

  state.tasks = [];


  const startDate = todayString();

  let targetDate =
    state.targetDate ||
    addDays(startDate, 14);


  if (
    new Date(targetDate) <
    new Date(startDate)
  ) {

    targetDate = startDate;

  }


  const totalDays =
    Math.max(
      1,
      Math.floor(
        (
          new Date(targetDate) -
          new Date(startDate)
        ) /
        (1000 * 60 * 60 * 24)
      ) + 1
    );


  const dailyCapacity =
    state.settings.dailyHours * 60;


  const backlogPool =
    getBacklogLecturePool();


  const dailyLectureCapacity =
    Math.max(
      1,
      Math.floor(
        dailyCapacity /
        (
          state.settings.lectureMinutes +
          state.settings.notesMinutes +
          state.settings.dppMinutes
        )
      )
    );


  let backlogIndex = 0;


  for (
    let dayIndex = 0;
    dayIndex < totalDays;
    dayIndex++
  ) {

    const date =
      addDays(startDate, dayIndex);

    const dayName =
      getDayName(date);


    const currentClasses =
      state.batch
        ? (
            BATCHES[state.batch]
              .schedule[dayName] || []
          )
        : [];


    currentClasses.forEach(subject => {

      state.tasks.push({

        id: createId(),

        date,

        type: "currentClass",

        subject,

        title:
          `${subject} Current Class`,

        teacher:
          getCurrentClassTeacher(subject),

        duration:
          state.settings.lectureMinutes,

        completed: false

      });

    });


    let lecturesForToday =
      Math.min(
        dailyLectureCapacity,
        backlogPool.length - backlogIndex
      );


    const currentClassMinutes =
      currentClasses.length *
      state.settings.lectureMinutes;


    const remainingCapacity =
      Math.max(
        0,
        dailyCapacity -
        currentClassMinutes -
        state.settings.questionMinutes -
        state.settings.revisionMinutes
      );


    const oneLectureLoad =
      state.settings.lectureMinutes +
      state.settings.notesMinutes +
      state.settings.dppMinutes;


    lecturesForToday =
      Math.min(
        lecturesForToday,
        Math.max(
          0,
          Math.floor(
            remainingCapacity /
            Math.max(1, oneLectureLoad)
          )
        )
      );


    if (
      lecturesForToday === 0 &&
      backlogIndex < backlogPool.length &&
      remainingCapacity >= state.settings.lectureMinutes
    ) {

      lecturesForToday = 1;

    }


    for (
      let i = 0;
      i < lecturesForToday;
      i++
    ) {

      const lecture =
        backlogPool[backlogIndex];

      if (!lecture) break;

      backlogIndex++;


      state.tasks.push({

        id: createId(),

        date,

        type: "backlogLecture",

        chapterId:
          lecture.chapterId,

        subject:
          lecture.subject,

        chapter:
          lecture.chapter,

        lectureNumber:
          lecture.lectureNumber,

        title:
          lecture.title,

        duration:
          state.settings.lectureMinutes,

        completed: false

      });


      state.tasks.push({

        id: createId(),

        date,

        type: "notes",

        chapterId:
          lecture.chapterId,

        subject:
          lecture.subject,

        chapter:
          lecture.chapter,

        lectureNumber:
          lecture.lectureNumber,

        title:
          `${lecture.chapter} — Notes ${lecture.lectureNumber}`,

        duration:
          state.settings.notesMinutes,

        completed: false

      });


      state.tasks.push({

        id: createId(),

        date,

        type: "dpp",

        chapterId:
          lecture.chapterId,

        subject:
          lecture.subject,

        chapter:
          lecture.chapter,

        lectureNumber:
          lecture.lectureNumber,

        title:
          `${lecture.chapter} — DPP ${lecture.lectureNumber}`,

        duration:
          state.settings.dppMinutes,

        completed: false

      });

    }


    if (state.settings.questionMinutes > 0) {

      state.tasks.push({

        id: createId(),

        date,

        type: "questions",

        title:
          "NEET Question Practice",

        duration:
          state.settings.questionMinutes,

        completed: false

      });

    }


    if (state.settings.revisionMinutes > 0) {

      state.tasks.push({

        id: createId(),

        date,

        type: "revision",

        title:
          "Daily Revision",

        duration:
          state.settings.revisionMinutes,

        completed: false

      });

    }

  }


  while (backlogIndex < backlogPool.length) {

    const extraDay =
      totalDays +
      Math.floor(
        (
          backlogIndex -
          Math.max(0, backlogPool.length - 1)
        ) /
        Math.max(1, dailyLectureCapacity)
      );


    const date =
      addDays(startDate, extraDay);


    const lecturesToday =
      Math.min(
        dailyLectureCapacity,
        backlogPool.length - backlogIndex
      );


    for (
      let i = 0;
      i < lecturesToday;
      i++
    ) {

      const lecture =
        backlogPool[backlogIndex];

      backlogIndex++;


      state.tasks.push({

        id: createId(),

        date,

        type: "backlogLecture",

        chapterId:
          lecture.chapterId,

        subject:
          lecture.subject,

        chapter:
          lecture.chapter,

        lectureNumber:
          lecture.lectureNumber,

        title:
          lecture.title,

        duration:
          state.settings.lectureMinutes,

        completed: false

      });


      state.tasks.push({

        id: createId(),

        date,

        type: "notes",

        chapterId:
          lecture.chapterId,

        subject:
          lecture.subject,

        chapter:
          lecture.chapter,

        lectureNumber:
          lecture.lectureNumber,

        title:
          `${lecture.chapter} — Notes ${lecture.lectureNumber}`,

        duration:
          state.settings.notesMinutes,

        completed: false

      });


      state.tasks.push({

        id: createId(),

        date,

        type: "dpp",

        chapterId:
          lecture.chapterId,

        subject:
          lecture.subject,

        chapter:
          lecture.chapter,

        lectureNumber:
          lecture.lectureNumber,

        title:
          `${lecture.chapter} — DPP ${lecture.lectureNumber}`,

        duration:
          state.settings.dppMinutes,

        completed: false

      });

    }

  }

}


/* =========================================================
   READY SUMMARY
========================================================= */

function renderReadySummary() {

  const container =
    $("readySummary");

  if (!container) return;


  const subjects =
    [...new Set(
      state.chapters.map(
        chapter => chapter.subject
      )
    )];


  const totalBacklog =
    getTotalBacklogCount();


  container.innerHTML = `

    <div class="ready-stat">

      <strong>
        ${subjects.length}
      </strong>

      <span>
        Subjects
      </span>

    </div>


    <div class="ready-stat">

      <strong>
        ${state.chapters.length}
      </strong>

      <span>
        Chapters
      </span>

    </div>


    <div class="ready-stat">

      <strong>
        ${totalBacklog}
      </strong>

      <span>
        Backlog Lectures
      </span>

    </div>


    <div class="ready-stat">

      <strong>
        ${state.tasks.length}
      </strong>

      <span>
        Total Tasks
      </span>

    </div>


    <div class="ready-subject-list">

      ${subjects.map(subject => `

        <div class="ready-subject">

          <span>
            ${getSubjectIcon(subject)}
            ${escapeHtml(subject)}
          </span>

          <strong>
            ${
              state.chapters
                .filter(c => c.subject === subject)
                .reduce(
                  (sum, c) =>
                    sum + c.backlogLectures.length,
                  0
                )
            }
            lectures
          </strong>

        </div>

      `).join("")}

    </div>

  `;

}


/* =========================================================
   OPEN DASHBOARD
========================================================= */

function openDashboard() {

  $("onboarding")
    .classList.add("hidden");

  $("app")
    .classList.remove("hidden");


  showPage("dashboardPage");

  renderDashboard();

  saveState();

}


/* =========================================================
   SHOW APP PAGE
========================================================= */

function showPage(pageId) {

  qsa(".app-page").forEach(page => {

    page.classList.remove("active");

  });


  const page =
    $(pageId);

  if (page) {

    page.classList.add("active");

  }


  qsa(".nav-item").forEach(item => {

    item.classList.toggle(
      "active",
      item.dataset.page === pageId
    );

  });


  if (pageId === "dashboardPage") {
    renderDashboard();
  }

  if (pageId === "chaptersPage") {
    renderChaptersPage();
  }

  if (pageId === "plannerPage") {
    renderPlannerPage();
  }

  if (pageId === "teachersPage") {
    renderTeachers();
  }

  if (pageId === "settingsPage") {
    loadSettingsPage();
  }

}


/* =========================================================
   DASHBOARD
========================================================= */

function renderDashboard() {

  const today =
    todayString();


  if ($("dashboardDate")) {
    $("dashboardDate").textContent =
      formatDate(today);
  }


  renderOverallProgress();

  renderTodayStudyTime();

  renderTodayTasks();

  renderPendingTasks();

}


/* =========================================================
   STUDY TIME
========================================================= */

function formatStudyMinutes(minutes) {

  const safe =
    Math.max(
      0,
      Math.round(minutes || 0)
    );

  const hours =
    Math.floor(safe / 60);

  const mins =
    safe % 60;


  if (hours === 0) {
    return `${mins}m`;
  }

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${mins}m`;

}


function renderTodayStudyTime() {

  const today =
    todayString();


  const tasks =
    state.tasks.filter(
      task =>
        task.date === today
    );


  const planned =
    tasks.reduce(
      (sum, task) =>
        sum + (Number(task.duration) || 0),
      0
    );


  const completed =
    tasks.reduce(
      (sum, task) =>
        sum +
        (
          task.completed
            ? (Number(task.duration) || 0)
            : 0
        ),
      0
    );


  const remaining =
    Math.max(
      0,
      planned - completed
    );


  const percent =
    planned === 0
      ? 0
      : Math.round(
          (completed / planned) * 100
        );


  if ($("studyTimePlanned")) {

    $("studyTimePlanned").textContent =
      formatStudyMinutes(planned);

  }


  if ($("studyTimeCompleted")) {

    $("studyTimeCompleted").textContent =
      formatStudyMinutes(completed);

  }


  if ($("studyTimeRemaining")) {

    $("studyTimeRemaining").textContent =
      formatStudyMinutes(remaining);

  }


  if ($("studyTimeProgressPercent")) {

    $("studyTimeProgressPercent").textContent =
      `${percent}%`;

  }


  if ($("studyTimeProgressBar")) {

    $("studyTimeProgressBar").style.width =
      `${percent}%`;

  }

}


/* =========================================================
   OVERALL PROGRESS
========================================================= */

function renderOverallProgress() {

  let total = 0;
  let completed = 0;


  state.chapters.forEach(chapter => {

    total += chapter.totalLectures;

    chapter.lectures.forEach(lecture => {

      if (lecture.completed) {
        completed++;
      }

    });

  });


  const percent =
    total === 0
      ? 0
      : Math.round(
          (completed / total) * 100
        );


  if ($("overallProgressText")) {

    $("overallProgressText").textContent =
      `${completed} / ${total}`;

  }


  if ($("overallProgressPercent")) {

    $("overallProgressPercent").textContent =
      `${percent}%`;

  }


  if ($("overallProgressBar")) {

    $("overallProgressBar").style.width =
      `${percent}%`;

  }

}


/* =========================================================
   TODAY TASKS
========================================================= */

function renderTodayTasks() {

  const container =
    $("todayTasks");

  if (!container) return;


  const today =
    todayString();


  const tasks =
    state.tasks.filter(
      task => task.date === today
    );


  const completed =
    tasks.filter(
      task => task.completed
    ).length;


  const total =
    tasks.length;


  const percent =
    total === 0
      ? 0
      : Math.round(
          (completed / total) * 100
        );


  if ($("todayCompletedCount")) {
    $("todayCompletedCount").textContent =
      completed;
  }

  if ($("todayTotalCount")) {
    $("todayTotalCount").textContent =
      total;
  }

  if ($("todayProgressPercent")) {
    $("todayProgressPercent").textContent =
      `${percent}%`;
  }

  if ($("todayProgressBar")) {
    $("todayProgressBar").style.width =
      `${percent}%`;
  }


  if (
    $("dashboardProgressPercent")
  ) {

    $("dashboardProgressPercent").textContent =
      `${percent}%`;

  }


  if (!tasks.length) {

    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🎉</div>
        <h3>No tasks for today</h3>
        <p>Enjoy your free time or revise previous topics.</p>
      </div>
    `;

    return;

  }


  container.innerHTML =
    tasks
      .map(
        task => renderTaskCard(task)
      )
      .join("");

}


/* =========================================================
   TASK CARD
========================================================= */

function renderTaskCard(task) {

  const icon =
    getTaskIcon(task.type);


  const meta =
    getTaskMeta(task);


  return `

    <div
      class="task-card ${
        task.completed ? "completed" : ""
      }"
    >

      <button
        class="task-check ${
          task.completed ? "checked" : ""
        }"
        onclick="toggleTask('${task.id}')"
      >
        ${task.completed ? "✓" : ""}
      </button>


      <div class="task-icon">
        ${icon}
      </div>


      <div class="task-content">

        <strong>
          ${escapeHtml(task.title)}
        </strong>

        <span>
          ${escapeHtml(meta)}
        </span>

      </div>


      <div class="task-duration">
        ${task.duration || 0}m
      </div>

    </div>

  `;

}


function getTaskIcon(type) {

  const icons = {

    currentClass: "🎓",

    backlogLecture: "🎥",

    notes: "📝",

    dpp: "📋",

    questions: "❓",

    revision: "🔁"

  };

  return icons[type] || "📌";

}


function getTaskMeta(task) {

  if (task.type === "currentClass") {

    return task.teacher || "Current Class";

  }

  if (
    task.type === "backlogLecture" ||
    task.type === "notes" ||
    task.type === "dpp"
  ) {

    return `${task.subject} • ${task.chapter}`;

  }

  if (task.type === "questions") {

    return "Physics + Chemistry + Biology";

  }

  if (task.type === "revision") {

    return "Daily revision";

  }

  return "";

}


/* =========================================================
   TOGGLE TASK
========================================================= */

function toggleTask(taskId) {

  const task =
    state.tasks.find(
      item => item.id === taskId
    );

  if (!task) return;


  task.completed =
    !task.completed;


  if (
    task.type === "backlogLecture" &&
    task.chapterId
  ) {

    updateLectureCompletion(
      task.chapterId,
      task.lectureNumber,
      task.completed
    );

  }


  saveState();

  renderDashboard();

  renderChaptersPage();

}


/* =========================================================
   UPDATE LECTURE COMPLETION
========================================================= */

function updateLectureCompletion(
  chapterId,
  lectureNumber,
  completed
) {

  const chapter =
    state.chapters.find(
      item => item.id === chapterId
    );

  if (!chapter) return;


  const lecture =
    chapter.lectures.find(
      item =>
        item.number === lectureNumber
    );


  if (!lecture) return;


  lecture.completed =
    completed;

}


/* =========================================================
   PENDING TASKS
========================================================= */

function renderPendingTasks() {

  const container =
    $("pendingTasks");

  if (!container) return;


  const today =
    todayString();


  const pending =
    state.tasks.filter(
      task =>
        !task.completed &&
        task.date < today
    );


  if (!pending.length) {

    container.innerHTML = `
      <div class="empty-state compact">
        <div class="empty-icon">✨</div>
        <p>No pending work.</p>
      </div>
    `;

    return;

  }


  container.innerHTML =
    pending
      .slice(0, 20)
      .map(
        task => renderTaskCard(task)
      )
      .join("");

}


/* =========================================================
   CHAPTERS PAGE
========================================================= */

function renderChaptersPage() {

  const container =
    $("chaptersContainer");

  if (!container) return;


  if (!state.chapters.length) {

    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📚</div>
        <h3>No chapters yet</h3>
      </div>
    `;

    return;

  }


  const groups = {};


  state.chapters.forEach(chapter => {

    if (!groups[chapter.subject]) {
      groups[chapter.subject] = [];
    }

    groups[chapter.subject].push(chapter);

  });


  container.innerHTML =
    Object.entries(groups)
      .map(
        ([subject, chapters]) =>
          renderSubjectChapterGroup(
            subject,
            chapters
          )
      )
      .join("");

}


function renderSubjectChapterGroup(
  subject,
  chapters
) {

  const total =
    chapters.reduce(
      (sum, chapter) =>
        sum + chapter.totalLectures,
      0
    );


  const completed =
    chapters.reduce(
      (sum, chapter) =>
        sum +
        chapter.lectures.filter(
          lecture =>
            lecture.completed
        ).length,
      0
    );


  const percent =
    total === 0
      ? 0
      : Math.round(
          (completed / total) * 100
        );


  return `

    <div class="subject-group">

      <div class="subject-group-header">

        <div class="subject-group-title">

          <span class="subject-icon">
            ${getSubjectIcon(subject)}
          </span>

          <div>

            <h3>
              ${escapeHtml(subject)}
            </h3>

            <span>
              ${escapeHtml(getTeacher(subject))}
            </span>

          </div>

        </div>


        <strong>
          ${percent}%
        </strong>

      </div>


      <div class="progress-track">

        <div
          class="progress-fill"
          style="width:${percent}%"
        ></div>

      </div>


      <div class="chapter-cards">

        ${chapters
          .map(
            chapter =>
              renderChapterCard(chapter)
          )
          .join("")}

      </div>

    </div>

  `;

}


function renderChapterCard(chapter) {

  const completed =
    chapter.lectures.filter(
      lecture =>
        lecture.completed
    ).length;


  const total =
    chapter.totalLectures;


  const percent =
    total === 0
      ? 0
      : Math.round(
          (completed / total) * 100
        );


  return `

    <div class="chapter-card">

      <div class="chapter-card-top">

        <div>

          <h4>
            ${escapeHtml(chapter.chapter)}
          </h4>

          <span>
            ${chapter.backlogLectures.length}
            backlog lectures
          </span>

        </div>

        <strong>
          ${completed}/${total}
        </strong>

      </div>


      <div class="progress-track">

        <div
          class="progress-fill"
          style="width:${percent}%"
        ></div>

      </div>


      <div class="lecture-grid">

        ${chapter.lectures
          .map(
            lecture => `

              <button
                class="lecture-chip ${
                  lecture.completed
                    ? "done"
                    : ""
                }"
                onclick="
                  toggleLectureManually(
                    '${chapter.id}',
                    ${lecture.number}
                  )
                "
              >

                ${
                  lecture.completed
                    ? "✓"
                    : ""
                }

                L${lecture.number}

              </button>

            `
          )
          .join("")}

      </div>

    </div>

  `;

}


/* =========================================================
   MANUAL LECTURE TOGGLE
========================================================= */

function toggleLectureManually(
  chapterId,
  lectureNumber
) {

  const chapter =
    state.chapters.find(
      item => item.id === chapterId
    );

  if (!chapter) return;


  const lecture =
    chapter.lectures.find(
      item =>
        item.number === lectureNumber
    );

  if (!lecture) return;


  lecture.completed =
    !lecture.completed;


  const task =
    state.tasks.find(
      item =>
        item.type === "backlogLecture" &&
        item.chapterId === chapterId &&
        item.lectureNumber === lectureNumber
    );


  if (task) {

    task.completed =
      lecture.completed;

  }


  saveState();

  renderChaptersPage();

  renderDashboard();

}


/* =========================================================
   PLANNER PAGE
========================================================= */

function renderPlannerPage() {

  const container =
    $("plannerDays");

  if (!container) return;


  if (!state.tasks.length) {

    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📅</div>
        <h3>No plan generated</h3>
      </div>
    `;

    return;

  }


  const dates =
    [
      ...new Set(
        state.tasks.map(
          task => task.date
        )
      )
    ]
    .sort();


  container.innerHTML =
    dates.map(
      date => {

        const tasks =
          state.tasks.filter(
            task =>
              task.date === date
          );


        return renderPlannerDay(
          date,
          tasks
        );

      }
    ).join("");

}


function renderPlannerDay(
  date,
  tasks
) {

  const completed =
    tasks.filter(
      task =>
        task.completed
    ).length;


  const percent =
    tasks.length === 0
      ? 0
      : Math.round(
          (completed / tasks.length) * 100
        );


  return `

    <div class="planner-day">

      <div class="planner-day-header">

        <div>

          <span class="eyebrow">
            ${getDayName(date)}
          </span>

          <h3>
            ${formatDate(date)}
          </h3>

        </div>


        <strong>
          ${completed}/${tasks.length}
        </strong>

      </div>


      <div class="progress-track">

        <div
          class="progress-fill"
          style="width:${percent}%"
        ></div>

      </div>


      <div class="planner-task-list">

        ${tasks
          .map(
            task =>
              renderTaskCard(task)
          )
          .join("")}

      </div>

    </div>

  `;

}


/* =========================================================
   TEACHERS
========================================================= */

function renderTeachers() {

  const container =
    $("teachersContainer");

  if (!container) return;


  if (!state.batch) {

    container.innerHTML =
      "<p>Select a batch first.</p>";

    return;

  }


  const faculty =
    BATCHES[state.batch].faculty;


  container.innerHTML =
    Object.entries(faculty)
      .map(
        ([subject, teacher]) => `

          <div class="teacher-card">

            <div class="teacher-icon">
              ${getSubjectIcon(subject)}
            </div>

            <div>

              <span>
                ${escapeHtml(subject)}
              </span>

              <strong>
                ${escapeHtml(teacher)}
              </strong>

            </div>

          </div>

        `
      )
      .join("");

}


/* =========================================================
   SETTINGS PAGE
========================================================= */

function loadSettingsPage() {

  if ($("settingsLectureMinutes")) {
    $("settingsLectureMinutes").value =
      state.settings.lectureMinutes;
  }

  if ($("settingsDailyHours")) {
    $("settingsDailyHours").value =
      state.settings.dailyHours;
  }

  if ($("settingsNotesMinutes")) {
    $("settingsNotesMinutes").value =
      state.settings.notesMinutes;
  }

  if ($("settingsDppMinutes")) {
    $("settingsDppMinutes").value =
      state.settings.dppMinutes;
  }

  if ($("settingsQuestionMinutes")) {
    $("settingsQuestionMinutes").value =
      state.settings.questionMinutes;
  }

  if ($("settingsRevisionMinutes")) {
    $("settingsRevisionMinutes").value =
      state.settings.revisionMinutes;
  }

}


function saveSettings() {

  state.settings.lectureMinutes =
    Number(
      $("settingsLectureMinutes").value
    ) || 105;

  state.settings.dailyHours =
    Number(
      $("settingsDailyHours").value
    ) || 12;

  state.settings.notesMinutes =
    Number(
      $("settingsNotesMinutes").value
    ) || 0;

  state.settings.dppMinutes =
    Number(
      $("settingsDppMinutes").value
    ) || 0;

  state.settings.questionMinutes =
    Number(
      $("settingsQuestionMinutes").value
    ) || 0;

  state.settings.revisionMinutes =
    Number(
      $("settingsRevisionMinutes").value
    ) || 0;


  if (state.targetDate) {

    generateTasks();

  }


  saveState();

  showToast(
    "Settings saved successfully."
  );

  renderDashboard();

  renderPlannerPage();

}


/* =========================================================
   RESET
========================================================= */

function resetPlanner() {

  const confirmed =
    confirm(
      "Are you sure? This will delete your complete planner and progress."
    );


  if (!confirmed) return;


  localStorage.removeItem(
    STORAGE_KEY
  );


  location.reload();

}


/* =========================================================
   INITIALIZE EVENT LISTENERS
========================================================= */

function setupEventListeners() {

  $("batchNextBtn")
    ?.addEventListener(
      "click",
      continueFromBatch
    );


  $("subjectNextBtn")
    ?.addEventListener(
      "click",
      continueFromSubjects
    );


  $("subjectBackBtn")
    ?.addEventListener(
      "click",
      () => showStep(1)
    );


  $("chapterNextBtn")
    ?.addEventListener(
      "click",
      continueFromChapter
    );


  $("chapterBackBtn")
    ?.addEventListener(
      "click",
      () => showStep(2)
    );


  $("totalLectures")
    ?.addEventListener(
      "input",
      handleTotalLecturesChange
    );


  $("applyRangeBtn")
    ?.addEventListener(
      "click",
      applyLectureRange
    );


  $("lectureBackBtn")
    ?.addEventListener(
      "click",
      () => showStep(3)
    );


  $("lectureNextBtn")
    ?.addEventListener(
      "click",
      saveCurrentChapter
    );


  $("addAnotherChapterBtn")
    ?.addEventListener(
      "click",
      addAnotherChapter
    );


  $("nextSubjectBtn")
    ?.addEventListener(
      "click",
      goToNextSubject
    );


  $("allSubjectsCompleteBtn")
    ?.addEventListener(
      "click",
      finishAllSubjects
    );


  $("targetDate")
    ?.addEventListener(
      "change",
      () => {

        $("targetNextBtn").disabled =
          !$("targetDate").value;

      }
    );


  $("targetBackBtn")
    ?.addEventListener(
      "click",
      () => showStep(5)
    );


  $("targetNextBtn")
    ?.addEventListener(
      "click",
      handleTargetDate
    );


  qsa(".time-option")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          selectLectureTime(
            button.dataset.minutes
          );

        }
      );

    });


  $("customLectureTime")
    ?.addEventListener(
      "input",
      handleCustomLectureTime
    );


  $("lectureTimeBackBtn")
    ?.addEventListener(
      "click",
      () => showStep(6)
    );


  $("lectureTimeNextBtn")
    ?.addEventListener(
      "click",
      () => showStep(8)
    );


  $("notesBackBtn")
    ?.addEventListener(
      "click",
      () => showStep(7)
    );


  $("notesNextBtn")
    ?.addEventListener(
      "click",
      saveNotesSettings
    );


  qsa(".practice-option")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const minutes =
            Number(button.dataset.minutes);

          $("questionMinutes").value =
            minutes;

          qsa(".practice-option")
            .forEach(item =>
              item.classList.remove(
                "selected"
              )
            );

          button.classList.add(
            "selected"
          );

        }
      );

    });


  $("questionBackBtn")
    ?.addEventListener(
      "click",
      () => showStep(8)
    );


  $("questionNextBtn")
    ?.addEventListener(
      "click",
      saveQuestionSettings
    );


  qsa(".revision-option")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const minutes =
            Number(button.dataset.minutes);

          $("revisionMinutes").value =
            minutes;

          qsa(".revision-option")
            .forEach(item =>
              item.classList.remove(
                "selected"
              )
            );

          button.classList.add(
            "selected"
          );

        }
      );

    });


  $("revisionBackBtn")
    ?.addEventListener(
      "click",
      () => showStep(9)
    );


  $("revisionNextBtn")
    ?.addEventListener(
      "click",
      saveRevisionSettings
    );


  qsa(".capacity-option")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const hours =
            Number(button.dataset.hours);

          $("dailyHours").value =
            hours;

          qsa(".capacity-option")
            .forEach(item =>
              item.classList.remove(
                "selected"
              )
            );

          button.classList.add(
            "selected"
          );

        }
      );

    });


  $("capacityBackBtn")
    ?.addEventListener(
      "click",
      () => showStep(10)
    );


  $("generatePlanBtn")
    ?.addEventListener(
      "click",
      generatePlan
    );


  $("openDashboardBtn")
    ?.addEventListener(
      "click",
      openDashboard
    );


  qsa(".nav-item")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          showPage(
            button.dataset.page
          );

        }
      );

    });


  $("refreshTodayBtn")
    ?.addEventListener(
      "click",
      () => {

        renderDashboard();

        showToast(
          "Dashboard refreshed."
        );

      }
    );


  $("saveSettingsBtn")
    ?.addEventListener(
      "click",
      saveSettings
    );


  $("resetAppBtn")
    ?.addEventListener(
      "click",
      resetPlanner
    );


  $("settingsResetBtn")
    ?.addEventListener(
      "click",
      resetPlanner
    );

}


/* =========================================================
   RESUME EXISTING PLAN
========================================================= */

function resumeExistingPlan() {

  if (
    state.batch &&
    state.chapters.length > 0 &&
    state.tasks.length > 0
  ) {

    $("onboarding")
      .classList.add("hidden");

    $("app")
      .classList.remove("hidden");

    showPage("dashboardPage");

    return true;

  }

  return false;

}


/* =========================================================
   INITIALIZE APP
========================================================= */

function initializeApp() {

  loadState();

  setupEventListeners();

  renderBatchOptions();


  if (resumeExistingPlan()) {
    return;
  }


  showStep(1);

}


/* =========================================================
   START
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initializeApp
);


/* =========================================================
   EXPOSE FUNCTIONS TO HTML
========================================================= */

window.toggleTask =
  toggleTask;

window.toggleLectureManually =
  toggleLectureManually;