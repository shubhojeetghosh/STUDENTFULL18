const API_BASE_URL = window.EPS_API?.baseUrl || "http://127.0.0.1:8000";
const API_ENDPOINTS = {

  login:
    `${API_BASE_URL}/auth/login`,

  verifyOtp:
    `${API_BASE_URL}/auth/verify-otp`,

  register:
    `${API_BASE_URL}/auth/register`,

  forgotPassword:
    `${API_BASE_URL}/auth/forgot-password`,

  resetPassword:
    `${API_BASE_URL}/auth/reset-password`,

  profile:
    `${API_BASE_URL}/auth/profile`

};
//dahboard
function startTest(testName) {

  localStorage.setItem(
    "selected_test",
    testName
  );

  window.location.href = "set.html";
}


function editProfile() {

  window.location.href = "profile.html";
}


function logout() {

  const confirmLogout =
    confirm("Are you sure you want to logout?");


  if (!confirmLogout) {
    return;
  }


  localStorage.removeItem("access_token");
  localStorage.removeItem("token_type");

  window.location.href = "login.html";
}
//////profile
/* =========================================================
   PROFILE PAGE
   ========================================================= */

const profileForm =
  document.getElementById("profileForm");


const profilePhotoInput =
  document.getElementById("profilePhotoInput");


/* ================= LOAD PROFILE ================= */

function loadProfilePage() {

  if (!profileForm) {
    return;
  }


  const name =
    localStorage.getItem("user_name") ||
    "Mighty Raju";


  const email =
    localStorage.getItem("user_email") ||
    "";


  const studentId =
    localStorage.getItem("student_id") ||
    "2023000950";


  const photo =
    localStorage.getItem("profile_photo");


  /* Form */

  document.getElementById(
    "profileName"
  ).value = name;


  document.getElementById(
    "profileEmail"
  ).value = email;


  document.getElementById(
    "profileStudentId"
  ).value = studentId;


  /* Left card */

  document.getElementById(
    "profileDisplayName"
  ).textContent = name;


  document.getElementById(
    "profileDisplayId"
  ).textContent = studentId;


  updateProfileInitials(name);


  if (photo) {/* =========================================================
   EXAM RESULT PAGE
   ========================================================= */


/* ================= REVIEW ANSWERS ================= */

function reviewAnswers() {

  window.location.href =
    "review-answers.html";
}


/* ================= RETAKE TEST ================= */

function retakeTest() {

  const confirmRetake =
    confirm(
      "Do you want to retake this test?"
    );


  if (!confirmRetake) {
    return;
  }


  /*
     Change exam.html if your exam page
     uses another filename.
  */

  window.location.href =
    "exam.html";
}


/* ================= DASHBOARD ================= */

function goToDashboard() {

  window.location.href =
    "dashboard.html";
}


/* ================= DOWNLOAD RESULT ================= */

function downloadResult() {

  const testName =
    document.getElementById(
      "resultTestName"
    )?.textContent || "EPS TOPIK Test";


  const percentage =
    document.getElementById(
      "resultPercentage"
    )?.textContent || "-";


  const score =
    document.getElementById(
      "resultScore"
    )?.textContent || "-";


  const correct =
    document.getElementById(
      "correctAnswers"
    )?.textContent || "-";


  const wrong =
    document.getElementById(
      "wrongAnswers"
    )?.textContent || "-";


  const unanswered =
    document.getElementById(
      "unansweredAnswers"
    )?.textContent || "-";


  const resultText = `
EPS TOPIK EXAM RESULT

Test: ${testName}

Score: ${score}
Percentage: ${percentage}

Correct Answers: ${correct}
Incorrect Answers: ${wrong}
Unanswered: ${unanswered}

EPS TOPIK Exam Platform
`;


  const file =
    new Blob(
      [resultText],
      {
        type: "text/plain"
      }
    );


  const url =
    URL.createObjectURL(file);


  const link =
    document.createElement("a");


  link.href = url;

  link.download =
    "EPS-TOPIK-Result.txt";


  document.body.appendChild(link);

  link.click();


  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

    showProfilePhoto(photo);

  }

}



/* ================= INITIALS ================= */

function updateProfileInitials(name) {

  const fallback =
    document.getElementById(
      "profilePhotoFallback"
    );


  if (!fallback) {
    return;
  }


  const parts =
    name
      .trim()
      .split(/\s+/);


  let initials = "ST";


  if (parts.length === 1) {

    initials =
      parts[0]
        .substring(0, 2)
        .toUpperCase();

  }

  else if (parts.length > 1) {

    initials =
      (
        parts[0][0] +
        parts[parts.length - 1][0]
      ).toUpperCase();

  }


  fallback.textContent =
    initials;

}



/* ================= PHOTO PREVIEW ================= */

if (profilePhotoInput) {

  profilePhotoInput.addEventListener(
    "change",
    function () {

      const file =
        this.files[0];


      if (!file) {
        return;
      }


      /* 2 MB */

      const maxSize =
        2 * 1024 * 1024;


      if (file.size > maxSize) {

        showMessage(
          "Profile photo must be smaller than 2 MB.",
          "error"
        );

        this.value = "";

        return;

      }


      if (
        ![
          "image/jpeg",
          "image/png",
          "image/webp"
        ].includes(file.type)
      ) {

        showMessage(
          "Please select a JPG, PNG or WEBP image.",
          "error"
        );

        this.value = "";

        return;

      }


      const reader =
        new FileReader();


      reader.onload =
        function (event) {

          const imageData =
            event.target.result;


          showProfilePhoto(
            imageData
          );


          /*
             Temporary frontend storage.

             Later this should be uploaded
             to the backend/server.
          */

          localStorage.setItem(
            "profile_photo",
            imageData
          );

        };


      reader.readAsDataURL(
        file
      );

    }
  );

}



/* ================= SHOW PHOTO ================= */

function showProfilePhoto(imageData) {

  const preview =
    document.getElementById(
      "profilePhotoPreview"
    );


  const fallback =
    document.getElementById(
      "profilePhotoFallback"
    );


  if (!preview || !fallback) {
    return;
  }


  preview.src =
    imageData;


  preview.style.display =
    "block";


  fallback.style.display =
    "none";

}



/* ================= REMOVE PHOTO ================= */

function removeProfilePhoto() {

  localStorage.removeItem(
    "profile_photo"
  );


  const preview =
    document.getElementById(
      "profilePhotoPreview"
    );


  const fallback =
    document.getElementById(
      "profilePhotoFallback"
    );


  if (preview) {

    preview.src = "";

    preview.style.display =
      "none";

  }


  if (fallback) {

    fallback.style.display =
      "grid";

  }


  if (profilePhotoInput) {

    profilePhotoInput.value =
      "";

  }

}



/* ================= SAVE PROFILE ================= */

if (profileForm) {

  profileForm.addEventListener(
    "submit",
    handleProfileUpdate
  );

}


async function handleProfileUpdate(event) {

  event.preventDefault();


  const name =
    document
      .getElementById("profileName")
      .value
      .trim();


  const email =
    document
      .getElementById("profileEmail")
      .value
      .trim();


  const studentId =
    document
      .getElementById("profileStudentId")
      .value
      .trim();


  const currentPassword =
    document
      .getElementById("currentPassword")
      .value;


  const newPassword =
    document
      .getElementById("newPassword")
      .value;


  const confirmPassword =
    document
      .getElementById("confirmNewPassword")
      .value;


  /* ================= VALIDATION ================= */


  if (!name) {

    showMessage(
      "Please enter your full name.",
      "error"
    );

    return;

  }


  if (!email) {

    showMessage(
      "Please enter your email.",
      "error"
    );

    return;

  }


  if (!studentId) {

    showMessage(
      "Please enter your student ID.",
      "error"
    );

    return;

  }



  /*
     Password fields are optional.

     But if the user enters a new password,
     all required password fields must exist.
  */

  if (
    currentPassword ||
    newPassword ||
    confirmPassword
  ) {


    if (!currentPassword) {

      showMessage(
        "Enter your current password before changing it.",
        "error"
      );

      return;

    }


    if (!newPassword) {

      showMessage(
        "Enter your new password.",
        "error"
      );

      return;

    }


    if (newPassword.length < 6) {

      showMessage(
        "New password must contain at least 6 characters.",
        "error"
      );

      return;

    }


    if (
      newPassword !==
      confirmPassword
    ) {

      showMessage(
        "New passwords do not match.",
        "error"
      );

      return;

    }

  }



  /*
     FRONTEND STORAGE FOR NOW

     Once backend gives the profile endpoint,
     replace this part with authenticatedFetch().
  */


  localStorage.setItem(
    "user_name",
    name
  );


  localStorage.setItem(
    "user_email",
    email
  );


  localStorage.setItem(
    "student_id",
    studentId
  );


  document.getElementById(
    "profileDisplayName"
  ).textContent = name;


  document.getElementById(
    "profileDisplayId"
  ).textContent = studentId;


  updateProfileInitials(
    name
  );


  showMessage(
    "Profile updated successfully.",
    "success"
  );


  /*
     IMPORTANT:

     This does NOT really change the backend
     password yet.

     When backend provides something like:

     PUT /auth/profile
     POST /auth/change-password

     we will send currentPassword/newPassword
     to those APIs.
  */

}



/* ================= START PROFILE PAGE ================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    loadProfilePage();

  }
);
/* =========================================================
   PASSWORD SHOW / HIDE
   ========================================================= */

function togglePassword(inputId, button) {

  const input = document.getElementById(inputId);

  if (!input) {
    return;
  }

  if (input.type === "password") {

    input.type = "text";
    button.textContent = "Hide";

  } else {

    input.type = "password";
    button.textContent = "Show";

  }
}

/* =========================================================
   REGISTER
   Connect register.html to POST /auth/register
   ========================================================= */

const registerForm = document.getElementById("registerForm");

if (registerForm) {

  registerForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    console.log("Register form submitted");


    // ==========================================
    // GET FORM VALUES
    // ==========================================

    const name =
      document.getElementById("registerName").value.trim();

    const email =
      document.getElementById("registerEmail").value.trim();

    const password =
      document.getElementById("registerPassword").value;

    const confirmPassword =
      document.getElementById("confirmPassword").value;

    const messageBox =
      document.getElementById("messageBox");

    const registerButton =
      document.getElementById("registerButton");


    // ==========================================
    // FRONTEND VALIDATION
    // ==========================================

    if (!name) {

      if (messageBox) {
        messageBox.textContent =
          "Please enter your full name.";
      }

      return;
    }


    if (!email) {

      if (messageBox) {
        messageBox.textContent =
          "Please enter your email.";
      }

      return;
    }


    if (!password) {

      if (messageBox) {
        messageBox.textContent =
          "Please enter a password.";
      }

      return;
    }


    if (password !== confirmPassword) {

      if (messageBox) {
        messageBox.textContent =
          "Passwords do not match.";
      }

      return;
    }


    // ==========================================
    // DISABLE BUTTON
    // ==========================================

    if (registerButton) {

      registerButton.disabled = true;

      registerButton.textContent =
        "Creating Account...";

    }


    if (messageBox) {
      messageBox.textContent =
        "Creating your account...";
    }


    try {

      // ==========================================
      // BACKEND REGISTER API
      // ==========================================

      const response = await fetch(
        "http://127.0.0.1:8000/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },

          // IMPORTANT:
          // Swagger confirmed the backend accepts
          // ONLY name, email and password.

          body: JSON.stringify({
            name: name,
            email: email,
            password: password
          })
        }
      );


      console.log(
        "Register HTTP status:",
        response.status
      );


      // ==========================================
      // READ RESPONSE
      // ==========================================

      const data = await response.json();

      console.log(
        "Register API response:",
        data
      );


      // ==========================================
      // BACKEND ERROR
      // ==========================================

      if (!response.ok) {

        let errorMessage =
          "Registration failed.";


        if (data.detail) {

          if (Array.isArray(data.detail)) {

            errorMessage =
              data.detail
                .map(error =>
                  error.msg || "Invalid input"
                )
                .join(", ");

          } else {

            errorMessage =
              data.detail;

          }

        } else if (data.message) {

          errorMessage =
            data.message;

        }


        if (messageBox) {

          messageBox.textContent =
            errorMessage;

          messageBox.className =
            "message-box error";

        } else {

          alert(errorMessage);

        }

        return;
      }


      // ==========================================
      // REGISTRATION SUCCESS
      // ==========================================

      if (messageBox) {

        messageBox.textContent =
          data.message ||
          "Account created successfully!";

        messageBox.className =
          "message-box success";

      }


      console.log(
        "Registration successful:",
        data
      );


      // ==========================================
      // REDIRECT TO LOGIN
      // ==========================================

      setTimeout(function () {

        window.location.href =
          "login.html";

      }, 1000);


    } catch (error) {

      console.error(
        "Register error:",
        error
      );


      if (messageBox) {

        messageBox.textContent =
          "Could not connect to backend. Make sure FastAPI is running.";

        messageBox.className =
          "message-box error";

      } else {

        alert(
          "Could not connect to backend. Make sure FastAPI is running."
        );

      }


    } finally {

      // ==========================================
      // ENABLE BUTTON AGAIN
      // ==========================================

      if (registerButton) {

        registerButton.disabled = false;

        registerButton.textContent =
          "Create Account";

      }

    }

  });

}
/* =========================================================
   LOGIN
   ========================================================= */

const loginForm = document.getElementById("loginForm");

if (loginForm) {

  loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    const email =
      document.getElementById("loginEmail").value.trim();


    const password =
      document.getElementById("loginPassword").value;


    const loginButton =
      document.getElementById("loginButton");


    if (!email || !password) {

      alert("Please enter email and password.");

      return;
    }


    try {

      if (loginButton) {

        loginButton.disabled = true;
        loginButton.textContent = "Logging in...";

      }


      const response = await fetch(
        `${API_BASE_URL}/auth/login`,
        {

          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email: email,
            password: password
          })

        }
      );


      const data = await response.json();


      if (!response.ok) {

        alert(
          data.detail ||
          data.message ||
          "Invalid email or password."
        );

        return;
      }


      if (!data.access_token) {

        alert("No access token received from backend.");

        return;
      }


      localStorage.setItem(
        "access_token",
        data.access_token
      );


      localStorage.setItem(
        "token_type",
        data.token_type || "bearer"
      );


      localStorage.setItem(
        "user_email",
        email
      );


      alert("Login successful!");


      window.location.href =
        "dashboard.html";

    }

    catch (error) {

      console.error("Login error:", error);

      alert(
        "Could not connect to backend. Check whether the backend server is running."
      );

    }

    finally {

      if (loginButton) {

        loginButton.disabled = false;
        loginButton.textContent = "Log in";

      }

    }

  });

}


/* =========================================================
   PASSWORD RECOVERY
   ========================================================= */

const sendOtpButton = document.getElementById("sendOtpButton");

if (sendOtpButton) {
  sendOtpButton.addEventListener("click", async function () {
    const email = document.getElementById("forgotEmail").value.trim();
    const messageBox = document.getElementById("messageBox");
    if (!email) {
      messageBox.textContent = "Enter your registered email address.";
      return;
    }
    sendOtpButton.disabled = true;
    try {
      await window.EPS_API.auth.forgotPassword({ email });
      localStorage.setItem("password_reset_email", email);
      window.location.href = "verify-otp.html";
    } catch (error) {
      messageBox.textContent = error.message || "Unable to send an OTP.";
    } finally {
      sendOtpButton.disabled = false;
    }
  });
}

const verifyOtpForm = document.getElementById("verifyOtpForm");

if (verifyOtpForm) {
  verifyOtpForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const email = localStorage.getItem("password_reset_email");
    const otp = document.getElementById("otp").value.trim();
    const messageBox = document.getElementById("messageBox");
    if (!email) {
      messageBox.textContent = "Restart password recovery and enter your email address.";
      return;
    }
    try {
      await window.EPS_API.auth.verifyOtp({ email, otp });
      localStorage.setItem("password_reset_otp", otp);
      window.location.href = "reset-pass.html";
    } catch (error) {
      messageBox.textContent = error.message || "Unable to verify the OTP.";
    }
  });
}


/* =========================================================
   SET SELECTION BACK BUTTON
   ========================================================= */

const backBtn =
  document.getElementById("backBtn");

if (backBtn) {

  backBtn.addEventListener("click", function () {

    window.location.href =
      "set.html";

  });

}


/* =========================================================
   DASHBOARD TEST BUTTON
   ========================================================= */

function startTest(testName) {

  localStorage.setItem(
    "selected_test",
    testName
  );

  window.location.href =
    "set.html";
}


/* =========================================================
   PROFILE BUTTON
   ========================================================= */

function editProfile() {

  window.location.href =
    "profile.html";
}


/* =========================================================
   SUBSCRIPTION BUTTON
   ========================================================= */

function startSubscription() {

  alert(
    "Payment gateway will be connected here."
  );

}


/* =========================================================
   LOGOUT
   ========================================================= */

function logout() {

  const confirmLogout =
    confirm("Are you sure you want to logout?");


  if (!confirmLogout) {
    return;
  }


  localStorage.removeItem(
    "access_token"
  );

  localStorage.removeItem(
    "token_type"
  );

  localStorage.removeItem(
    "user_email"
  );


  window.location.href =
    "login.html";
}
/* =========================================================
   EXAM RESULT PAGE
   ========================================================= */


/* ================= REVIEW ANSWERS ================= */

function reviewAnswers() {

  window.location.href =
    "review-answers.html";
}


/* ================= RETAKE TEST ================= */

function retakeTest() {

  const confirmRetake =
    confirm(
      "Do you want to retake this test?"
    );


  if (!confirmRetake) {
    return;
  }


  /*
     Change exam.html if your exam page
     uses another filename.
  */

  window.location.href =
    "exam.html";
}


/* ================= DASHBOARD ================= */

function goToDashboard() {

  window.location.href =
    "dashboard.html";
}


/* ================= DOWNLOAD RESULT ================= */

function downloadResult() {

  const testName =
    document.getElementById(
      "resultTestName"
    )?.textContent || "EPS TOPIK Test";


  const percentage =
    document.getElementById(
      "resultPercentage"
    )?.textContent || "-";


  const score =
    document.getElementById(
      "resultScore"
    )?.textContent || "-";


  const correct =
    document.getElementById(
      "correctAnswers"
    )?.textContent || "-";


  const wrong =
    document.getElementById(
      "wrongAnswers"
    )?.textContent || "-";


  const unanswered =
    document.getElementById(
      "unansweredAnswers"
    )?.textContent || "-";


  const resultText = `
EPS TOPIK EXAM RESULT

Test: ${testName}

Score: ${score}
Percentage: ${percentage}

Correct Answers: ${correct}
Incorrect Answers: ${wrong}
Unanswered: ${unanswered}

EPS TOPIK Exam Platform
`;


  const file =
    new Blob(
      [resultText],
      {
        type: "text/plain"
      }
    );


  const url =
    URL.createObjectURL(file);


  const link =
    document.createElement("a");


  link.href = url;

  link.download =
    "EPS-TOPIK-Result.txt";


  document.body.appendChild(link);

  link.click();


  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
