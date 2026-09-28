/* =========================================
   NEET TRACKER
   ========================================= */


/* ---------- DATA ---------- */

let chapters = JSON.parse(localStorage.getItem("neetTrackerData")) || [];


/* ---------- SAVE DATA ---------- */

function saveData() {
    localStorage.setItem("neetTrackerData", JSON.stringify(chapters));
}


/* ---------- ADD / UPDATE CHAPTER ---------- */

function addChapter() {

    const subject = document.getElementById("subject").value;
    const chapter = document.getElementById("chapter").value.trim();
    const total = Number(document.getElementById("total").value);
    const completed = Number(document.getElementById("completed").value);


    /* VALIDATION */

    if (chapter === "") {
        alert("Chapter name enter karo.");
        return;
    }

    if (total <= 0) {
        alert("Total lectures 1 ya usse zyada hona chahiye.");
        return;
    }

    if (completed < 0) {
        alert("Completed lectures 0 se kam nahi ho sakte.");
        return;
    }

    if (completed > total) {
        alert("Completed lectures total lectures se zyada nahi ho sakte.");
        return;
    }


    /* CHECK EXISTING CHAPTER */

    const existingIndex = chapters.findIndex(
        item =>
            item.subject === subject &&
            item.chapter.toLowerCase() === chapter.toLowerCase()
    );


    if (existingIndex !== -1) {

        chapters[existingIndex].total = total;
        chapters[existingIndex].completed = completed;

        alert("Chapter successfully updated! ✅");

    } else {

        chapters.push({
            id: Date.now(),
            subject: subject,
            chapter: chapter,
            total: total,
            completed: completed
        });

        alert("Chapter successfully added! ✅");
    }


    saveData();

    clearForm();

    render();
}


/* ---------- CLEAR FORM ---------- */

function clearForm() {

    document.getElementById("chapter").value = "";
    document.getElementById("total").value = "";
    document.getElementById("completed").value = "";

}


/* ---------- RENDER EVERYTHING ---------- */

function render() {

    updateOverallStats();

    updateSubjectStats();

    renderChapters();

}


/* ---------- OVERALL STATS ---------- */

function updateOverallStats() {

    let total = 0;
    let completed = 0;


    chapters.forEach(item => {

        total += item.total;
        completed += item.completed;

    });


    const backlog = total - completed;


    let percent = 0;

    if (total > 0) {
        percent = Math.round((completed / total) * 100);
    }


    document.getElementById("totalLectures").textContent = total;

    document.getElementById("completedLectures").textContent = completed;

    document.getElementById("backlogLectures").textContent = backlog;

    document.getElementById("syllabusPercent").textContent = percent + "%";

    document.getElementById("overallPercent").textContent = percent + "%";

    document.getElementById("overallProgress").style.width = percent + "%";

}


/* ---------- SUBJECT STATS ---------- */

function updateSubjectStats() {

    const subjects = ["Physics", "Chemistry", "Biology"];


    subjects.forEach(subject => {

        const subjectChapters = chapters.filter(
            item => item.subject === subject
        );


        let total = 0;
        let completed = 0;


        subjectChapters.forEach(item => {

            total += item.total;
            completed += item.completed;

        });


        let percent = 0;

        if (total > 0) {
            percent = Math.round((completed / total) * 100);
        }


        const id = subject.toLowerCase();


        document.getElementById(id + "Info").textContent =
            completed + " / " + total + " lectures";


        document.getElementById(id + "Percent").textContent =
            percent + "%";


        document.getElementById(id + "Progress").style.width =
            percent + "%";

    });

}


/* ---------- RENDER CHAPTERS ---------- */

function renderChapters() {

    const container = document.getElementById("chapterList");


    if (chapters.length === 0) {

        container.innerHTML = `
            <div class="empty">
                <h3>📭 No chapters added yet</h3>
                <p>Upar se apna chapter add karo.</p>
            </div>
        `;

        return;
    }


    /* SORT SUBJECT */

    const subjectOrder = {
        Physics: 1,
        Chemistry: 2,
        Biology: 3
    };


    const sortedChapters = [...chapters].sort(
        (a, b) => subjectOrder[a.subject] - subjectOrder[b.subject]
    );


    container.innerHTML = "";


    sortedChapters.forEach(item => {

        const backlog = item.total - item.completed;

        const percent = item.total > 0
            ? Math.round((item.completed / item.total) * 100)
            : 0;


        const card = document.createElement("div");

        card.className = "chapter-card";


        card.innerHTML = `

            <div class="chapter-top">

                <div class="chapter-name">
                    ${escapeHTML(item.chapter)}
                </div>

                <div class="subject-tag">
                    ${item.subject}
                </div>

            </div>


            <div class="chapter-stats">

                <span>
                    📚 Total: <b>${item.total}</b>
                </span>

                <span>
                    ✅ Done: <b>${item.completed}</b>
                </span>

                <span>
                    🔴 Backlog: <b>${backlog}</b>
                </span>

                <span>
                    📊 Progress: <b>${percent}%</b>
                </span>

            </div>


            <div class="chapter-progress">

                <span>
                    ${item.completed} / ${item.total} lectures
                </span>

                <b>${percent}%</b>

            </div>


            <div class="progress-bg">

                <div
                    class="progress-fill"
                    style="width: ${percent}%"
                ></div>

            </div>


            <div class="chapter-actions">

                <button
                    class="done-btn"
                    onclick="completeLecture(${item.id})"
                >
                    +1 Lecture Done
                </button>


                <button
                    class="edit-btn"
                    onclick="editChapter(${item.id})"
                >
                    ✏️ Edit
                </button>


                <button
                    class="delete-btn"
                    onclick="deleteChapter(${item.id})"
                >
                    🗑️ Delete
                </button>

            </div>

        `;


        container.appendChild(card);

    });

}


/* ---------- +1 LECTURE ---------- */

function completeLecture(id) {

    const chapter = chapters.find(item => item.id === id);


    if (!chapter) {
        return;
    }


    if (chapter.completed >= chapter.total) {

        alert("Ye chapter already 100% complete hai! 🎉");

        return;
    }


    chapter.completed += 1;


    saveData();

    render();

}


/* ---------- EDIT CHAPTER ---------- */

function editChapter(id) {

    const chapter = chapters.find(item => item.id === id);


    if (!chapter) {
        return;
    }


    document.getElementById("subject").value = chapter.subject;

    document.getElementById("chapter").value = chapter.chapter;

    document.getElementById("total").value = chapter.total;

    document.getElementById("completed").value = chapter.completed;


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* ---------- DELETE CHAPTER ---------- */

function deleteChapter(id) {

    const chapter = chapters.find(item => item.id === id);


    if (!chapter) {
        return;
    }


    const confirmDelete = confirm(
        'Kya tum "' +
        chapter.chapter +
        '" ko delete karna chahte ho?'
    );


    if (!confirmDelete) {
        return;
    }


    chapters = chapters.filter(item => item.id !== id);


    saveData();

    render();

}


/* ---------- RESET EVERYTHING ---------- */

function resetData() {

    if (chapters.length === 0) {

        alert("Abhi koi data hai hi nahi.");

        return;
    }


    const confirmReset = confirm(
        "⚠️ Kya tumhara poora NEET Tracker data delete karna hai?"
    );


    if (!confirmReset) {
        return;
    }


    chapters = [];


    localStorage.removeItem("neetTrackerData");


    render();

}


/* ---------- SECURITY ---------- */

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* ---------- START WEBSITE ---------- */

render();