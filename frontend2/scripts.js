/* =========================================================
   BACKEND CONFIGURATION
========================================================= */

const API_BASE_URL =
  window.API_BASE_URL || "http://192.168.29.241:8000";

const QUIZ_ID =
  new URLSearchParams(window.location.search).get("quiz") || "exam1";


/* =========================================================
   STUDENT
========================================================= */

const STUDENT = {
  name: "Sun Lee",
  rollNo: "2023000950",
  initials: "SL"
};


/* =========================================================
   EXAM STATE
========================================================= */

let questions = [];
let attemptId = null;

let current = 1;
let seconds = 0;

const answers = {};


/* =========================================================
   SHORTCUT
========================================================= */

const $ = id => document.getElementById(id);


/* =========================================================
   API HELPER
========================================================= */

async function api(path, options = {}) {

  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      ...options,

      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    }
  );


  if (!response.ok) {

    let message =
      `API request failed (${response.status})`;

    try {

      const data = await response.json();

      if (data.detail) {
        message = data.detail;
      }

    } catch (_) {}

    throw new Error(message);
  }


  return response.status === 204
    ? null
    : response.json();
}


/* =========================================================
   NORMALIZE BACKEND QUESTION
========================================================= */

function normalizeQuestion(x) {

  const type =
    String(x.question_type || "reading")
      .toLowerCase();


  const listening =
    ["audio_option", "image_audio"].includes(type)
    || !!x.audio_url;


  return {

    id: x.question_number,

    backendId: x.id,

    section:
      listening
        ? "listening"
        : "reading",

    group:
      listening
        ? "Listening"
        : "Reading",

    text:
      x.text || "",

    media:
      x.image_url || null,

    audio:
      x.audio_url || null,

    options:
      (x.options || []).map(option => {

        /*
         Supports backend objects:

         {
           id: 1,
           text: "..."
         }

         and also simple strings if necessary.
        */

        if (typeof option === "object") {

          return {
            id: option.id,
            text: option.text || "",
            audio_url:
              option.audio_url || null
          };

        }

        return {
          id: option,
          text: String(option),
          audio_url: null
        };

      })

  };
}


/* =========================================================
   STUDENT PROFILE
========================================================= */

function renderStudentProfile() {

  const name =
    $("studentName");

  const roll =
    $("studentId");

  const initials =
    $("studentInitials");


  if (name)
    name.textContent = STUDENT.name;

  if (roll)
    roll.textContent = STUDENT.rollNo;

  if (initials)
    initials.textContent = STUDENT.initials;
}


/* =========================================================
   RENDER QUESTION
========================================================= */

function render() {

  const item =
    questions[current - 1];


  if (!item)
    return;


  /* -------------------------
     Section
  ------------------------- */

  const readingCount =
  questions.filter(
    question => question.section === "reading"
  ).length;

const listeningCount =
  questions.filter(
    question => question.section === "listening"
  ).length;

$("sectionBar").firstChild.textContent =
  item.section === "reading"
    ? `읽기 (${readingCount}문항)`
    : `듣기 (${listeningCount}문항)`;


  /* -------------------------
     Question information
  ------------------------- */

  $("group").textContent =
    item.group;

  $("qTitle").textContent =
    `${item.id}.`;

  $("prompt").textContent =
    item.text;


  /* -------------------------
     Elements
  ------------------------- */

  const image =
    $("mediaImage");

  const audio =
    $("audioPlaceholder");

  const options =
    $("options");

  const contentRow =
    document.querySelector(".content-row");

  const mediaPanel =
    $("mediaPanel");


  /* =====================================================
     Q36 / Q37 SPECIAL LAYOUT
  ===================================================== */

  if (item.id === 36 || item.id === 37) {

    contentRow.classList.add(
      "picture-question"
    );

  } else {

    contentRow.classList.remove(
      "picture-question"
    );

  }


  /* =====================================================
     RESET MEDIA
  ===================================================== */

  image.classList.add("hidden");

  audio.classList.add("hidden");

  mediaPanel.classList.remove(
    "text-content"
  );


  const oldText =
    mediaPanel.querySelector(
      ".media-text"
    );


  if (oldText)
    oldText.remove();


  /* =====================================================
     MEDIA
  ===================================================== */

  if (item.media) {

    image.src =
      item.media;

    image.classList.remove(
      "hidden"
    );

  }


  /*
     If there is no image and no audio,
     display the text in the media panel.
  */

  else if (
    item.text &&
    !item.audio &&
    item.id !== 36 &&
    item.id !== 37
  ) {

    const textBox =
      document.createElement("div");

    textBox.className =
      "media-text";

    textBox.textContent =
      item.text;

    mediaPanel.appendChild(
      textBox
    );

    mediaPanel.classList.add(
      "text-content"
    );

  }


  /* =====================================================
     AUDIO
  ===================================================== */

  if (item.audio) {

    audio.classList.remove(
      "hidden"
    );

  }


  /* =====================================================
     Q36 / Q37
  ===================================================== */

  if (
    item.id === 36 ||
    item.id === 37
  ) {

    audio.classList.remove(
      "hidden"
    );

    image.classList.add(
      "hidden"
    );

  }


  /* =====================================================
     ANSWER OPTIONS
  ===================================================== */

  options.innerHTML = "";


  /* =====================================================
     Q36 / Q37 PICTURE OPTIONS
  ===================================================== */

  if (
    item.id === 36 ||
    item.id === 37
  ) {

    options.className =
      "options picture-options";


    item.options.forEach(
      (option, index) => {

        const button =
          document.createElement(
            "button"
          );


        button.className =
          "picture-option";


        if (
          answers[item.backendId] ===
          option.id
        ) {

          button.classList.add(
            "selected"
          );

        }


        const picture =
          document.createElement(
            "img"
          );


        /*
           Keep your existing local
           picture choices for Q36/Q37.
        */

        if (item.id === 36) {

          picture.src =
            `assets/q36-${index + 1}.png`;

        } else {

          picture.src =
            `assets/q37-${index + 1}.png`;

        }


        picture.alt =
          `Question ${item.id}, option ${index + 1}`;


        button.appendChild(
          picture
        );


        button.addEventListener(
          "click",
          () => {

            selectAnswer(
              item,
              option.id
            );

          }
        );


        options.appendChild(
          button
        );

      }
    );

  }


  /* =====================================================
     NORMAL OPTIONS
  ===================================================== */

  else {

    options.className =
      "options";


    item.options.forEach(
      (option, index) => {

        const button =
          document.createElement(
            "button"
          );


        button.className =
          "option";


        if (
          answers[item.backendId] ===
          option.id
        ) {

          button.classList.add(
            "selected"
          );

        }


        const num =
          document.createElement(
            "span"
          );


        num.className =
          "option-num";


        num.textContent =
          `①②③④`[index]
          || `${index + 1}.`;


        const label =
          document.createElement(
            "span"
          );


        label.textContent =
          option.text;


        button.append(
          num,
          label
        );


        button.addEventListener(
          "click",
          () => {

            selectAnswer(
              item,
              option.id
            );

          }
        );


        options.appendChild(
          button
        );

      }
    );

  }


  /* =====================================================
     NAVIGATION BUTTONS
  ===================================================== */

  $("prevBtn").disabled =
    current === 1;


  $("nextBtn").textContent =
    current === questions.length
      ? "Submit >>"
      : "Next >>";


  renderNavigation();

  updateStats();
}


/* =========================================================
   SAVE ANSWER TO BACKEND
========================================================= */

async function selectAnswer(
  item,
  optionId
) {

  /*
     Show the selection immediately.
  */

  answers[item.backendId] =
    optionId;

  render();


  try {

    await api(
      `/api/attempts/${attemptId}/answer`,
      {
        method: "POST",

        body: JSON.stringify({

          question_id:
            item.backendId,

          selected_option_id:
            optionId

        })

      }
    );

  } catch (error) {

    /*
       Backend rejected the answer.
       Remove local answer.
    */

    delete answers[
      item.backendId
    ];

    render();


    alert(
      `Could not save this answer:\n\n${error.message}`
    );

  }

}


/* =========================================================
   QUESTION NAVIGATION
========================================================= */

function renderNavigation() {

  const reading =
    $("readingGrid");

  const listening =
    $("listeningGrid");


  reading.innerHTML = "";

  listening.innerHTML = "";


  questions.forEach(
    item => {

      const button =
        document.createElement(
          "button"
        );


      button.className =
        "number";


      button.textContent =
        item.id;


      if (
        item.id === current
      ) {

        button.classList.add(
          "current"
        );

      }


      if (
        answers[item.backendId] !==
        undefined
      ) {

        button.classList.add(
          "answered"
        );

      }


      button.onclick =
        () => {

          current =
            item.id;

          render();

        };


      (
        item.section === "reading"
          ? reading
          : listening
      ).appendChild(
        button
      );

    }
  );
}


/* =========================================================
   STATISTICS
========================================================= */

function updateStats() {

  const solved =
    Object.keys(answers).length;

  const total =
    questions.length;

  $("solved").textContent =
    solved;

  $("unsolved").textContent =
    total - solved;

  $("totalQuestions").textContent =
    total;

  $("sectionTotal").textContent =
    `Total Questions: ${total}`;

  $("resultTotal").textContent =
    total;

  $("resultUnanswered").textContent =
    total - solved;
}

/* =========================================================
   NEXT
========================================================= */

function next() {

  if (
    current <
    questions.length
  ) {

    current++;

    render();

  } else {

    openSubmit();

  }
}


/* =========================================================
   PREVIOUS
========================================================= */

function previous() {

  if (current > 1) {

    current--;

    render();

  }

}


/* =========================================================
   ALL QUESTIONS
========================================================= */

function openAllQuestions() {

  const grid =
    $("allGrid");


  grid.innerHTML = "";


  questions.forEach(
    item => {

      const button =
        document.createElement(
          "button"
        );


      button.className =
        "number";


      button.textContent =
        item.id;


      if (
        item.id === current
      ) {

        button.classList.add(
          "current"
        );

      }


      if (
        answers[item.backendId] !==
        undefined
      ) {

        button.classList.add(
          "answered"
        );

      }


      button.onclick =
        () => {

          current =
            item.id;

          $("allModal")
            .classList
            .add("hidden");

          render();

        };


      grid.appendChild(
        button
      );

    }
  );


  $("allModal")
    .classList
    .remove("hidden");
}


/* =========================================================
   SUBMIT CONFIRMATION
========================================================= */

function openSubmit() {

  const unanswered =
    questions.length -
    Object.keys(answers).length;


  $("submitText").textContent =

    unanswered

      ? `You still have ${unanswered} unanswered question${unanswered === 1 ? "" : "s"}. Are you sure you want to submit?`

      : `You have answered all ${questions.length} questions. Are you sure you want to submit?`;


  $("submitModal")
    .classList
    .remove("hidden");
}


/* =========================================================
   SUBMIT EXAM
========================================================= */

async function submitExam() {

  $("submitModal")
    .classList
    .add("hidden");


  try {

    const result =
      await api(
        `/api/attempts/${attemptId}/submit`,
        {
          method: "POST"
        }
      );


    $("resultAnswered")
      .textContent =
      Object.keys(answers).length;


    $("resultUnanswered")
      .textContent =
      questions.length -
      Object.keys(answers).length;


    $("resultModal")
      .classList
      .remove("hidden");


    console.log(
      "Exam submitted:",
      result
    );


  } catch (error) {

    alert(
      `Could not submit the exam:\n\n${error.message}`
    );

  }

}


/* =========================================================
   TIMER
========================================================= */

function tick() {

  const minutes =
    Math.floor(seconds / 60);

  const secs =
    seconds % 60;


  $("timer").textContent =
    `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;


  if (seconds > 0) {

    seconds--;

  }

}


/* =========================================================
   REFRESH TIMER FROM BACKEND
========================================================= */

async function refreshServerTimer() {

  if (!attemptId)
    return;


  try {

    const status =
      await api(
        `/api/attempts/${attemptId}/status`
      );


    seconds =
      Math.max(
        0,
        status.time_remaining_seconds
      );


  } catch (error) {

    console.error(
      "Could not refresh timer:",
      error
    );

  }

}


/* =========================================================
   AUDIO
========================================================= */

async function playAudio() {

  const item =
    questions[current - 1];


  if (
    !item ||
    !attemptId
  ) {

    return;

  }


  if (!item.audio) {

    alert(
      "No audio is available for this question."
    );

    return;

  }


  try {

    const result =
      await api(
        `/api/attempts/${attemptId}/audio-play`,
        {
          method: "POST",

          body: JSON.stringify({

            question_id:
              item.backendId

          })

        }
      );


    /*
       The backend controls the
       maximum number of plays.
    */

    alert(
      `Audio plays remaining: ${result.plays_remaining}`
    );


    /*
       Actually play the audio.
    */

    const player =
      new Audio(item.audio);

    await player.play();


  } catch (error) {

    alert(
      `Audio cannot be played:\n\n${error.message}`
    );

  }

}


/* =========================================================
   INITIALIZE EXAM
========================================================= */

async function initializeExam() {

  try {

    /*
       STEP 1
       Start an exam attempt.
    */

    const started =
      await api(
        `/api/attempts/start/${encodeURIComponent(QUIZ_ID)}`,
        {
          method: "POST"
        }
      );


    attemptId =
      started.attempt_id;


    /*
       STEP 2
       Timer comes from backend.
    */

    seconds =
      Math.max(
        0,
        Math.floor(
          started.expires_at -
          Date.now() / 1000
        )
      );


    /*
       STEP 3
       Get questions from backend.
    */

    const payload =
      await api(
        `/api/attempts/${encodeURIComponent(attemptId)}/questions`
      );


    questions =
      (payload.questions || [])
        .map(normalizeQuestion);


    if (!questions.length) {

      throw new Error(
        "The backend returned no questions."
      );

    }


    /*
       STEP 4
       Make sure current question
       is valid.
    */

    current =
      Math.max(
        1,
        Math.min(
          questions.length,
          current
        )
      );


    /*
       STEP 5
       Render the exam.
    */

    renderStudentProfile();

    render();

    tick();


    /*
       STEP 6
       Local timer.
    */

    setInterval(
      tick,
      1000
    );


    /*
       STEP 7
       Synchronize with backend
       every 10 seconds.
    */

    setInterval(
      refreshServerTimer,
      10000
    );


  } catch (error) {

    console.error(
      "Exam initialization failed:",
      error
    );


    alert(
      `Could not connect to the quiz API at ${API_BASE_URL}.\n\n${error.message}`
    );

  }

}


/* =========================================================
   BUTTON EVENTS
========================================================= */

$("prevBtn").onclick =
  previous;


$("nextBtn").onclick =
  next;


$("allBtn").onclick =
  openAllQuestions;


$("submitBtn").onclick =
  openSubmit;


$("confirmSubmit").onclick =
  submitExam;


$("cancelSubmit").onclick =
  () => {

    $("submitModal")
      .classList
      .add("hidden");

  };


$("audioButton").onclick =
  playAudio;


$("closeResult").onclick =
  () => {

    $("resultModal")
      .classList
      .add("hidden");

  };


document
  .querySelectorAll("[data-close]")
  .forEach(
    button => {

      button.onclick =
        () => {

          $(button.dataset.close)
            .classList
            .add("hidden");

        };

    }
  );


/* =========================================================
   START
========================================================= */

renderStudentProfile();

initializeExam();