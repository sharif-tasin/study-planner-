/* =========================================================
   STUDY PLANNER
   Founder: MD. Sharif Hossain Tasin
   ========================================================= */

const STORAGE_KEY = "studyPlannerData";

const defaultData = {
    user: null,

    settings: {
        dailyTarget: 120,
        pomodoro: 25,
        theme: "dark"
    },

    study: {},

    tasks: [],

    goals: [],

    events: [],

    subjects: [],

    streak: 0,

    lastStudyDate: null
};


/* =========================================================
   DATA
   ========================================================= */

let data = loadData();

function loadData() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) {
            return structuredClone(defaultData);
        }

        return {
            ...structuredClone(defaultData),
            ...JSON.parse(saved)
        };

    } catch (error) {
        console.error(error);
        return structuredClone(defaultData);
    }
}


function saveData() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );
}


/* =========================================================
   HELPERS
   ========================================================= */

function todayKey() {
    return new Date().toISOString().split("T")[0];
}


function formatDate(date) {
    return date.toISOString().split("T")[0];
}


function showToast(message) {

    const toast = document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}


function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


/* =========================================================
   AUTHENTICATION
   ========================================================= */

const authScreen = document.getElementById("authScreen");
const app = document.getElementById("app");

const authForm = document.getElementById("authForm");

const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");

const nameField = document.getElementById("nameField");
const nameInput = document.getElementById("nameInput");

const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");

const authButtonText =
    document.getElementById("authButtonText");

const authMessage =
    document.getElementById("authMessage");

const switchAuth =
    document.getElementById("switchAuth");


let signupMode = false;


function updateAuthScreen() {

    nameField.classList.toggle(
        "hidden",
        !signupMode
    );

    loginTab.classList.toggle(
        "active",
        !signupMode
    );

    signupTab.classList.toggle(
        "active",
        signupMode
    );

    authButtonText.textContent =
        signupMode ? "Create Account" : "Log In";

    authMessage.textContent = "";
}


loginTab.addEventListener("click", () => {

    signupMode = false;

    updateAuthScreen();

});


signupTab.addEventListener("click", () => {

    signupMode = true;

    updateAuthScreen();

});


authForm.addEventListener("submit", event => {

    event.preventDefault();

    const email =
        emailInput.value.trim().toLowerCase();

    const password =
        passwordInput.value.trim();

    const name =
        nameInput.value.trim();


    if (!email || !password) {

        authMessage.textContent =
            "Please enter your email and password.";

        return;
    }


    if (signupMode) {

        if (!name) {

            authMessage.textContent =
                "Please enter your name.";

            return;
        }


        data.user = {
            name,
            email,
            password
        };

        saveData();

        showApp();

        showToast(
            `Welcome, ${name}! 🎉`
        );

    } else {

        if (
            !data.user ||
            data.user.email !== email ||
            data.user.password !== password
        ) {

            authMessage.textContent =
                "Incorrect email or password.";

            return;
        }

        showApp();

        showToast("Welcome back! 👋");
    }

});


document
    .getElementById("logoutBtn")
    .addEventListener("click", () => {

        app.classList.add("hidden");

        authScreen.classList.remove("hidden");

        emailInput.value = "";

        passwordInput.value = "";

        showToast("Logged out.");

    });


function showApp() {

    authScreen.classList.add("hidden");

    app.classList.remove("hidden");

    updateDashboard();

    renderCalendar();

    renderGoals();

    renderSubjects();

    updateSettingsUI();

    updateGreeting();

    applyTheme();
}


/* =========================================================
   NAVIGATION
   ========================================================= */

const pageTitles = {

    dashboard: "Dashboard",

    calendar: "Calendar",

    goals: "Goals",

    pomodoro: "Pomodoro",

    subjects: "Subjects",

    settings: "Settings"

};


document
    .querySelectorAll(".nav-item")
    .forEach(button => {

        button.addEventListener("click", () => {

            navigateTo(
                button.dataset.page
            );

        });

    });


function navigateTo(section) {

    document
        .querySelectorAll(".nav-item")
        .forEach(item => {

            item.classList.toggle(
                "active",
                item.dataset.page === section
            );

        });


    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.classList.remove(
                "active-page"
            );

        });


    const target =
        document.getElementById(section);

    if (target) {

        target.classList.add(
            "active-page"
        );

    }


    document.getElementById(
        "pageTitle"
    ).textContent =
        pageTitles[section] || "Dashboard";


    if (section === "calendar") {
        renderCalendar();
    }

    if (section === "goals") {
        renderGoals();
    }

    if (section === "subjects") {
        renderSubjects();
    }

    if (section === "dashboard") {
        updateDashboard();
    }
}


/* =========================================================
   THEME
   ========================================================= */

function applyTheme() {

    document.body.classList.toggle(
        "light",
        data.settings.theme === "light"
    );


    const icon =
        data.settings.theme === "light"
            ? "☀️"
            : "🌙";

    document.getElementById(
        "themeBtn"
    ).textContent = icon;
}


function toggleTheme() {

    data.settings.theme =
        data.settings.theme === "dark"
            ? "light"
            : "dark";

    saveData();

    applyTheme();

    showToast(
        data.settings.theme === "light"
            ? "Light mode enabled ☀️"
            : "Dark mode enabled 🌙"
    );
}


document
    .getElementById("themeBtn")
    .addEventListener(
        "click",
        toggleTheme
    );


document
    .getElementById("settingsThemeBtn")
    .addEventListener(
        "click",
        toggleTheme
    );


/* =========================================================
   GREETING
   ========================================================= */

function updateGreeting() {

    const hour =
        new Date().getHours();

    let greeting = "Good evening";

    if (hour < 12) {
        greeting = "Good morning";
    } else if (hour < 18) {
        greeting = "Good afternoon";
    }


    if (data.user) {

        document.getElementById(
            "greeting"
        ).textContent =
            `${greeting}, ${data.user.name} 👋`;

    } else {

        document.getElementById(
            "greeting"
        ).textContent =
            `${greeting} 👋`;

    }
}


/* =========================================================
   STUDY TIME
   ========================================================= */

function getTodayMinutes() {

    return data.study[todayKey()] || 0;

}


function addStudyMinutes(minutes) {

    const key = todayKey();

    data.study[key] =
        (data.study[key] || 0) + minutes;

    updateStreak();

    saveData();

    updateDashboard();

    showToast(
        `+${minutes} study minutes added 📚`
    );

}


function updateStreak() {

    const today = todayKey();

    if (
        data.lastStudyDate === today
    ) {

        return;

    }


    const yesterdayDate =
        new Date();

    yesterdayDate.setDate(
        yesterdayDate.getDate() - 1
    );

    const yesterday =
        formatDate(yesterdayDate);


    if (
        data.lastStudyDate === yesterday
    ) {

        data.streak += 1;

    } else {

        data.streak = 1;

    }


    data.lastStudyDate = today;

}


/* =========================================================
   DASHBOARD
   ========================================================= */

function updateDashboard() {

    const minutes =
        getTodayMinutes();

    const target =
        Number(data.settings.dailyTarget) || 120;

    const percentage =
        Math.min(
            100,
            Math.round(
                (minutes / target) * 100
            )
        );


    document.getElementById(
        "todayMinutes"
    ).textContent = minutes;


    document.getElementById(
        "todayHours"
    ).textContent =
        formatMinutes(minutes);


    document.getElementById(
        "targetMinutes"
    ).textContent = target;


    document.getElementById(
        "dailyPercentage"
    ).textContent =
        `${percentage}%`;


    document.getElementById(
        "heroProgress"
    ).textContent =
        `${percentage}%`;


    document.getElementById(
        "dailyProgressBar"
    ).style.width =
        `${percentage}%`;


    const circle =
        document.querySelector(
            ".progress-circle"
        );


    if (circle) {

        circle.style.background =
            `radial-gradient(circle at center, #10151d 58%, transparent 59%), conic-gradient(var(--accent) ${percentage * 3.6}deg, rgba(255,255,255,0.08) 0deg)`;

    }


    document.getElementById(
        "streakValue"
    ).textContent =
        data.streak;


    document.getElementById(
        "dashboardStreak"
    ).textContent =
        `${data.streak} days`;


    const completed =
        data.tasks.filter(
            task => task.completed
        ).length;


    document.getElementById(
        "completedTasks"
    ).textContent =
        completed;


    updateWeeklyHours();

    renderTasks();

    renderWeeklyChart();

}


/* =========================================================
   TIME FORMAT
   ========================================================= */

function formatMinutes(minutes) {

    const hours =
        Math.floor(minutes / 60);

    const mins =
        minutes % 60;


    if (hours === 0) {

        return `${mins}m`;

    }


    return `${hours}h ${mins}m`;

}


/* =========================================================
   WEEKLY HOURS
   ========================================================= */

function getLastSevenDays() {

    const days = [];

    for (let i = 6; i >= 0; i--) {

        const date =
            new Date();

        date.setDate(
            date.getDate() - i
        );

        days.push(
            formatDate(date)
        );

    }

    return days;
}


function updateWeeklyHours() {

    const days =
        getLastSevenDays();

    const total =
        days.reduce(
            (sum, day) =>
                sum + (data.study[day] || 0),
            0
        );


    document.getElementById(
        "weekHours"
    ).textContent =
        formatMinutes(total);

}


function renderWeeklyChart() {

    const chart =
        document.getElementById(
            "weeklyChart"
        );

    const days =
        getLastSevenDays();


    const max =
        Math.max(
            ...days.map(
                day =>
                    data.study[day] || 0
            ),
            60
        );


    chart.innerHTML = "";


    const wrapper =
        document.createElement("div");

    wrapper.style.cssText = `
        width:100%;
        height:160px;
        display:flex;
        align-items:flex-end;
        justify-content:space-around;
        gap:8px;
    `;


    days.forEach(day => {

        const minutes =
            data.study[day] || 0;

        const height =
            Math.max(
                5,
                (minutes / max) * 120
            );


        const column =
            document.createElement("div");

        column.style.cssText = `
            flex:1;
            max-width:55px;
            height:100%;
            display:flex;
            flex-direction:column;
            justify-content:flex-end;
            align-items:center;
            gap:6px;
        `;


        const bar =
            document.createElement("div");

        bar.style.cssText = `
            width:100%;
            height:${height}px;
            border-radius:8px 8px 3px 3px;
            background:linear-gradient(
                180deg,
                var(--accent),
                var(--accent-2)
            );
            transition:height .6s ease;
        `;


        const label =
            document.createElement("small");

        label.style.color =
            "var(--muted)";

        label.textContent =
            new Date(day).toLocaleDateString(
                "en-US",
                { weekday: "short" }
            ).slice(0, 2);


        column.appendChild(bar);

        column.appendChild(label);

        wrapper.appendChild(column);

    });


    chart.appendChild(wrapper);

}


/* =========================================================
   TASKS
   ========================================================= */

function renderTasks() {

    const list =
        document.getElementById(
            "taskList"
        );


    const todayTasks =
        data.tasks.filter(
            task =>
                task.date === todayKey()
        );


    if (!todayTasks.length) {

        list.innerHTML = `
            <div class="empty-state">
                No tasks yet.
            </div>
        `;

        return;
    }


    list.innerHTML = "";


    todayTasks.forEach(task => {

        const item =
            document.createElement("div");

        item.className =
            `task-item ${
                task.completed
                    ? "completed"
                    : ""
            }`;


        item.innerHTML = `
            <input
                type="checkbox"
                ${task.completed ? "checked" : ""}
                data-task="${task.id}"
            >

            <span>
                ${escapeHTML(task.title)}
            </span>
        `;


        item
            .querySelector("input")
            .addEventListener(
                "change",
                event => {

                    const current =
                        data.tasks.find(
                            t =>
                                t.id ==
                                task.id
                        );

                    if (current) {

                        current.completed =
                            event.target.checked;

                        saveData();

                        updateDashboard();

                    }

                }
            );


        list.appendChild(item);

    });

}


document
    .getElementById("addTaskBtn")
    .addEventListener(
        "click",
        addTask
    );


function addTask() {

    const title =
        prompt(
            "What task do you want to complete today?"
        );


    if (!title || !title.trim()) {
        return;
    }


    data.tasks.push({

        id: Date.now(),

        title: title.trim(),

        date: todayKey(),

        completed: false

    });


    saveData();

    updateDashboard();

    showToast("Task added ✅");

}


/* =========================================================
   CALENDAR
   ========================================================= */

let calendarDate =
    new Date();

let selectedDate =
    todayKey();


function renderCalendar() {

    const year =
        calendarDate.getFullYear();

    const month =
        calendarDate.getMonth();


    document.getElementById(
        "calendarMonth"
    ).textContent =
        calendarDate.toLocaleDateString(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        );


    const container =
        document.getElementById(
            "calendarDays"
        );


    container.innerHTML = "";


    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    for (let i = 0; i < firstDay; i++) {

        const blank =
            document.createElement("div");

        container.appendChild(blank);

    }


    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const date =
            new Date(
                year,
                month,
                day
            );


        const key =
            formatDate(date);


        const button =
            document.createElement("button");

        button.textContent = day;


        if (key === todayKey()) {

            button.classList.add(
                "today"
            );

        }


        if (key === selectedDate) {

            button.classList.add(
                "selected"
            );

        }


        if (
            data.events.some(
                event =>
                    event.date === key
            )
        ) {

            button.classList.add(
                "has-event"
            );

        }


        button.addEventListener(
            "click",
            () => {

                selectedDate = key;

                renderCalendar();

                renderEvents();

            }
        );


        container.appendChild(button);

    }


    renderEvents();

}


document
    .getElementById("prevMonth")
    .addEventListener(
        "click",
        () => {

            calendarDate.setMonth(
                calendarDate.getMonth() - 1
            );

            renderCalendar();

        }
    );


document
    .getElementById("nextMonth")
    .addEventListener(
        "click",
        () => {

            calendarDate.setMonth(
                calendarDate.getMonth() + 1
            );

            renderCalendar();

        }
    );


document
    .getElementById("addEventBtn")
    .addEventListener(
        "click",
        addCalendarEvent
    );


function addCalendarEvent() {

    const title =
        prompt(
            "What do you want to schedule?"
        );


    if (!title || !title.trim()) {
        return;
    }


    data.events.push({

        id: Date.now(),

        title: title.trim(),

        date: selectedDate

    });


    saveData();

    renderCalendar();

    showToast("Event added to calendar 📅");

}


function renderEvents() {

    const list =
        document.getElementById(
            "eventList"
        );


    document.getElementById(
        "selectedDate"
    ).textContent =
        new Date(
            selectedDate + "T00:00:00"
        ).toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                month: "long",
                day: "numeric"
            }
        );


    const events =
        data.events.filter(
            event =>
                event.date === selectedDate
        );


    if (!events.length) {

        list.innerHTML = `
            <div class="empty-state">
                Nothing planned.
            </div>
        `;

        return;
    }


    list.innerHTML = "";


    events.forEach(event => {

        const div =
            document.createElement("div");

        div.className =
            "task-item";


        div.innerHTML = `
            📌
            <span>
                ${escapeHTML(event.title)}
            </span>
        `;


        list.appendChild(div);

    });

}


/* =========================================================
   GOALS
   ========================================================= */

document
    .getElementById("addGoalBtn")
    .addEventListener(
        "click",
        addGoal
    );


function addGoal() {

    const title =
        prompt(
            "What is your goal?"
        );


    if (!title || !title.trim()) {
        return;
    }


    data.goals.push({

        id: Date.now(),

        title: title.trim(),

        progress: 0

    });


    saveData();

    renderGoals();

    showToast("Goal created 🎯");

}


function renderGoals() {

    const list =
        document.getElementById(
            "goalsList"
        );


    if (!data.goals.length) {

        list.innerHTML = `
            <div class="empty-state glass">
                No goals yet. Create your first goal.
            </div>
        `;

        return;
    }


    list.innerHTML = "";


    data.goals.forEach(goal => {

        const card =
            document.createElement("div");

        card.className =
            "goal-card";


        card.innerHTML = `

            <span class="eyebrow">
                GOAL
            </span>

            <h3>
                ${escapeHTML(goal.title)}
            </h3>

            <p>
                ${goal.progress}% complete
            </p>

            <div
                class="progress-bar"
                style="margin:15px 0;"
            >
                <div
                    class="progress-fill"
                    style="width:${goal.progress}%"
                ></div>
            </div>

            <button
                class="secondary-btn"
                data-goal="${goal.id}"
            >
                +10% Progress
            </button>

        `;


        card
            .querySelector("button")
            .addEventListener(
                "click",
                () => {

                    goal.progress =
                        Math.min(
                            100,
                            goal.progress + 10
                        );

                    saveData();

                    renderGoals();

                    showToast(
                        "Goal progress updated 🎯"
                    );

                }
            );


        list.appendChild(card);

    });

}


/* =========================================================
   SUBJECTS
   ========================================================= */

document
    .getElementById("addSubjectBtn")
    .addEventListener(
        "click",
        addSubject
    );


function addSubject() {

    const name =
        prompt(
            "Subject name?"
        );


    if (!name || !name.trim()) {
        return;
    }


    data.subjects.push({

        id: Date.now(),

        name: name.trim(),

        progress: 0,

        minutes: 0

    });


    saveData();

    renderSubjects();

    showToast("Subject added 📚");

}


function renderSubjects() {

    const list =
        document.getElementById(
            "subjectsList"
        );


    if (!data.subjects.length) {

        list.innerHTML = `
            <div class="empty-state glass">
                Add subjects to start tracking progress.
            </div>
        `;

        return;
    }


    list.innerHTML = "";


    data.subjects.forEach(subject => {

        const card =
            document.createElement("div");

        card.className =
            "subject-card";


        card.innerHTML = `

            <span class="eyebrow">
                SUBJECT
            </span>

            <h3>
                ${escapeHTML(subject.name)}
            </h3>

            <p>
                Preparation progress:
                ${subject.progress}%
            </p>

            <div
                class="progress-bar"
                style="margin:15px 0;"
            >
                <div
                    class="progress-fill"
                    style="width:${subject.progress}%"
                ></div>
            </div>

            <button
                class="secondary-btn"
                data-subject="${subject.id}"
            >
                +10% Progress
            </button>

        `;


        card
            .querySelector("button")
            .addEventListener(
                "click",
                () => {

                    subject.progress =
                        Math.min(
                            100,
                            subject.progress + 10
                        );

                    saveData();

                    renderSubjects();

                    showToast(
                        "Subject progress updated 📈"
                    );

                }
            );


        list.appendChild(card);

    });

}


/* =========================================================
   POMODORO
   ========================================================= */

let timerSeconds =
    data.settings.pomodoro * 60;

let timerInterval = null;

let timerRunning = false;


const timerDisplay =
    document.getElementById(
        "timerDisplay"
    );


function updateTimerDisplay() {

    const minutes =
        Math.floor(
            timerSeconds / 60
        );

    const seconds =
        timerSeconds % 60;


    timerDisplay.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}


document
    .querySelectorAll(".timer-mode-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".timer-mode-btn"
                    )
                    .forEach(
                        btn =>
                            btn.classList.remove(
                                "active"
                            )
                    );


                button.classList.add(
                    "active"
                );


                timerSeconds =
                    Number(
                        button.dataset.minutes
                    ) * 60;


                stopTimer();

                updateTimerDisplay();

            }
        );

    });


document
    .getElementById("startTimer")
    .addEventListener(
        "click",
        () => {

            if (timerRunning) {

                stopTimer();

            } else {

                startTimer();

            }

        }
    );


document
    .getElementById("resetTimer")
    .addEventListener(
        "click",
        () => {

            stopTimer();

            timerSeconds =
                data.settings.pomodoro * 60;

            updateTimerDisplay();

        }
    );


function startTimer() {

    timerRunning = true;

    document.getElementById(
        "startTimer"
    ).textContent =
        "⏸ Pause";


    timerInterval =
        setInterval(
            () => {

                if (timerSeconds > 0) {

                    timerSeconds--;

                    updateTimerDisplay();

                } else {

                    stopTimer();

                    addStudyMinutes(
                        data.settings.pomodoro
                    );

                    showToast(
                        "Pomodoro completed! 🍅"
                    );

                    timerSeconds =
                        data.settings.pomodoro * 60;

                    updateTimerDisplay();

                }

            },
            1000
        );

}


function stopTimer() {

    timerRunning = false;

    clearInterval(
        timerInterval
    );

    document.getElementById(
        "startTimer"
    ).textContent =
        "▶ Start";

}


/* =========================================================
   SETTINGS
   ========================================================= */

function updateSettingsUI() {

    document.getElementById(
        "dailyTargetInput"
    ).value =
        data.settings.dailyTarget;


    document.getElementById(
        "pomodoroInput"
    ).value =
        data.settings.pomodoro;

}


document
    .getElementById("dailyTargetInput")
    .addEventListener(
        "change",
        event => {

            const value =
                Number(event.target.value);


            if (value > 0) {

                data.settings.dailyTarget =
                    value;

                saveData();

                updateDashboard();

                showToast(
                    "Daily target updated 🎯"
                );

            }

        }
    );


document
    .getElementById("pomodoroInput")
    .addEventListener(
        "change",
        event => {

            const value =
                Number(event.target.value);


            if (value > 0) {

                data.settings.pomodoro =
                    value;

                saveData();

                timerSeconds =
                    value * 60;

                updateTimerDisplay();

                showToast(
                    "Pomodoro time updated 🍅"
                );

            }

        }
    );


/* =========================================================
   EXPORT DATA
   ========================================================= */

document
    .getElementById("exportBtn")
    .addEventListener(
        "click",
        () => {

            const json =
                JSON.stringify(
                    data,
                    null,
                    2
                );


            const blob =
                new Blob(
                    [json],
                    {
                        type:
                            "application/json"
                    }
                );


            const url =
                URL.createObjectURL(blob);


            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                "study-planner-backup.json";

            link.click();


            URL.revokeObjectURL(url);

            showToast(
                "Study data exported 💾"
            );

        }
    );


/* =========================================================
   IMPORT DATA
   ========================================================= */

document
    .getElementById("importInput")
    .addEventListener(
        "change",
        event => {

            const file =
                event.target.files[0];


            if (!file) {
                return;
            }


            const reader =
                new FileReader();


            reader.onload = () => {

                try {

                    const imported =
                        JSON.parse(
                            reader.result
                        );


                    data = {
                        ...structuredClone(
                            defaultData
                        ),
                        ...imported
                    };


                    saveData();

                    updateDashboard();

                    renderCalendar();

                    renderGoals();

                    renderSubjects();

                    updateSettingsUI();

                    applyTheme();

                    showToast(
                        "Data imported successfully 📥"
                    );


                } catch {

                    showToast(
                        "Invalid backup file."
                    );

                }

            };


            reader.readAsText(file);

        }
    );


/* =========================================================
   RESET DATA
   ========================================================= */

document
    .getElementById("resetDataBtn")
    .addEventListener(
        "click",
        () => {

            const confirmReset =
                confirm(
                    "Are you sure? This will delete all your study data."
                );


            if (!confirmReset) {
                return;
            }


            data =
                structuredClone(
                    defaultData
                );


            saveData();

            location.reload();

        }
    );


/* =========================================================
   INITIALIZE
   ========================================================= */

updateTimerDisplay();

updateAuthScreen();

applyTheme();


if (data.user) {

    showApp();

} else {

    authScreen.classList.remove(
        "hidden"
    );

    app.classList.add(
        "hidden"
    );

}
