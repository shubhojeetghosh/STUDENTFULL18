//const API_BASE_URL = "https://10.60.227.210:8000";
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
    `${API_BASE_URL}/auth/profile`,

  dashboard:
    `${API_BASE_URL}/student/dashboard`

};
//dahboard
function startTest(testId) {

    localStorage.setItem(
        "selected_test_id",
        testId
    );

    window.location.href =
        "set.html";
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


 const savedUser =
  JSON.parse(localStorage.getItem("user") || "{}");

const name =
  savedUser.name || "";

const email =
  savedUser.email ||
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

    // Get values from register.html
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
    // CHECK PASSWORDS
    // ==========================================

    if (password !== confirmPassword) {

      if (messageBox) {
        messageBox.textContent =
          "Passwords do not match.";
      }

      return;
    }


    try {

      // Disable button while registering
      if (registerButton) {

        registerButton.disabled = true;

        registerButton.textContent =
          "Creating Account...";

      }


      // ==========================================
      // CALL BACKEND REGISTER API
      // ==========================================

      const response = await fetch(
        API_ENDPOINTS.register,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            name: name,

            email: email,

            password: password

          })
        }
      );


      // Get backend response
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
          "Account created successfully!";

      }


      console.log(
        "Registration successful:",
        data
      );


      // Go to login page
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
          "Could not connect to backend. Check whether the backend server is running.";

      } else {

        alert(
          "Could not connect to backend. Check whether the backend server is running."
        );

      }


    } finally {

      if (registerButton) {

        registerButton.disabled = false;

        registerButton.textContent =
          "Create Account";

      }

    }

  });

}

/* =========================================================
   STUDENT / ADMIN LOGIN
   ========================================================= */

let selectedLoginType = "student";


/* =========================================================
   SWITCH LOGIN TYPE
   ========================================================= */

function switchLoginType(type) {

  selectedLoginType = type;

  const studentButton =
    document.getElementById("studentLoginBtn");

  const adminButton =
    document.getElementById("adminLoginBtn");

  const loginEyebrow =
    document.getElementById("loginEyebrow");

  const loginTitle =
    document.getElementById("loginTitle");

  const loginDescription =
    document.getElementById("loginDescription");

  const forgotPasswordLink =
    document.getElementById("forgotPasswordLink");

  const studentDivider =
    document.getElementById("studentDivider");

  const studentRegister =
    document.getElementById("studentRegister");

  const loginButton =
    document.getElementById("loginButton");

  const authCard =
    document.querySelector(".auth-card");


  /* ================= STUDENT ================= */

  if (type === "student") {

    if (studentButton) {
      studentButton.classList.add("active");
    }

    if (adminButton) {
      adminButton.classList.remove("active");
    }

    if (authCard) {
      authCard.classList.remove("admin-mode");
    }

    if (loginEyebrow) {
      loginEyebrow.textContent =
        "EPS TOPIK EXAM";
    }

    if (loginTitle) {
      loginTitle.textContent =
        "Welcome back";
    }

    if (loginDescription) {
      loginDescription.textContent =
        "Log in to continue your Korean language test preparation.";
    }

    if (forgotPasswordLink) {
      forgotPasswordLink.style.display =
        "inline";
    }

    if (studentDivider) {
      studentDivider.style.display =
        "flex";
    }

    if (studentRegister) {
      studentRegister.style.display =
        "block";
    }

    if (loginButton) {
      loginButton.textContent =
        "Log in";
    }

  }


  /* ================= ADMIN ================= */

  else if (type === "admin") {

    if (adminButton) {
      adminButton.classList.add("active");
    }

    if (studentButton) {
      studentButton.classList.remove("active");
    }

    if (authCard) {
      authCard.classList.add("admin-mode");
    }

    if (loginEyebrow) {
      loginEyebrow.textContent =
        "EPS TOPIK ADMIN";
    }

    if (loginTitle) {
      loginTitle.textContent =
        "Admin Portal";
    }

    if (loginDescription) {
      loginDescription.textContent =
        "Sign in to manage the EPS TOPIK examination platform.";
    }

    /*
       Keep forgot password available for admin
       for now. We can create a separate admin
       recovery flow later if required.
    */
    if (forgotPasswordLink) {
      forgotPasswordLink.style.display =
        "inline";
    }

    /*
       Admin does not need student registration.
    */
    if (studentDivider) {
      studentDivider.style.display =
        "none";
    }

    if (studentRegister) {
      studentRegister.style.display =
        "none";
    }

    if (loginButton) {
      loginButton.textContent =
        "Admin Login";
    }

  }

}


/* =========================================================
   LOGIN FORM
   ========================================================= */

const loginForm =
  document.getElementById("loginForm");


if (loginForm) {

  loginForm.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      const email =
        document
          .getElementById("loginEmail")
          .value
          .trim();


      const password =
        document
          .getElementById("loginPassword")
          .value;


      const loginButton =
        document.getElementById("loginButton");


      const messageBox =
        document.getElementById("messageBox");


      if (!email || !password) {

        alert(
          "Please enter email and password."
        );

        return;
      }


      try {

        if (loginButton) {

          loginButton.disabled =
            true;

          loginButton.textContent =
            selectedLoginType === "admin"
              ? "Logging in..."
              : "Logging in...";
        }


        /* =========================================
           LOGIN REQUEST
           ========================================= */

        const response =
          await fetch(
            `${API_BASE_URL}/auth/login`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body: JSON.stringify({
                email: email,
                password: password
              })
            }
          );


        const data =
          await response.json();


        /* =========================================
           BACKEND ERROR
           ========================================= */

        if (!response.ok) {

          const errorMessage =
            data.detail ||
            data.message ||
            "Invalid email or password.";

          if (messageBox) {
            messageBox.textContent =
              errorMessage;
          }

          alert(errorMessage);

          return;
        }


        /* =========================================
           ACCESS TOKEN CHECK
           ========================================= */

        if (!data.access_token) {

          alert(
            "No access token received from backend."
          );

          return;
        }


        /* =========================================
           IMPORTANT:
           CHECK THE REAL BACKEND ROLE
           ========================================= */

        const backendRole =
          String(data.role || "")
            .toLowerCase()
            .trim();


        /*
           ADMIN LOGIN SELECTED
           BUT ACCOUNT IS NOT ADMIN
        */

        if (
          selectedLoginType === "admin" &&
          backendRole !== "admin"
        ) {

          alert(
            "Access denied. This account is not an admin account."
          );

          return;
        }


        /*
           STUDENT LOGIN SELECTED
           BUT ACCOUNT IS ADMIN
        */

        if (
          selectedLoginType === "student" &&
          backendRole === "admin"
        ) {

          alert(
            "Please use the Admin login option for this account."
          );

          return;
        }


        /* =========================================
           SAVE LOGIN INFORMATION
           ========================================= */

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


        localStorage.setItem(
          "user",
          JSON.stringify({

            name:
              data.name,

            email:
              data.email || email,

            id:
              data.user_id,

            role:
              data.role

          })
        );


        /* =========================================
           SAVE LOGIN TYPE
           ========================================= */

        localStorage.setItem(
          "login_type",
          selectedLoginType
        );


        /* =========================================
           REDIRECT
           ========================================= */

        if (backendRole === "admin") {

          alert(
            "Admin login successful!"
          );

          /*
             CHANGE THIS PATH IF YOUR ADMIN
             DASHBOARD HAS A DIFFERENT LOCATION.
          */

          window.location.href =
            "admin/admin.html";

        }

        else {

          alert(
            "Login successful!"
          );

          window.location.href =
            "dashboard.html";

        }

      }


      catch (error) {

        console.error(
          "Login error:",
          error
        );


        alert(
          "Could not connect to backend. Check whether the backend server is running."
        );

      }


      finally {

        if (loginButton) {

          loginButton.disabled =
            false;

          loginButton.textContent =
            selectedLoginType === "admin"
              ? "Admin Login"
              : "Log in";

        }

      }

    }
  );

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
/* =========================================================
   LOAD DASHBOARD USER PROFILE FROM BACKEND
   ========================================================= */

async function loadDashboardUserProfile() {

    // Only run on dashboard
    const profileName =
        document.getElementById("sidebarUserName");

    const profileId =
        document.getElementById("sidebarStudentId");

    const profileAvatar =
        document.getElementById("profileAvatar");

    // If these elements don't exist,
    // this is not the dashboard page.
    if (
        !profileName &&
        !profileId &&
        !profileAvatar
    ) {
        return;
    }

    const token =
        localStorage.getItem("access_token");

    if (!token) {
        console.warn(
            "No access token found."
        );
        return;
    }

    try {

        const response =
            await fetch(
                API_ENDPOINTS.profile,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"
                    }
                }
            );

        if (!response.ok) {

            throw new Error(
                `Profile request failed: ${response.status}`
            );

        }

        const user =
            await response.json();

        console.log(
            "Logged-in user profile:",
            user
        );


        /* =================================================
           NAME
        ================================================= */

        const name =
            user.name ||
            user.full_name ||
            user.fullName ||
            "Student";

        if (profileName) {

            profileName.textContent =
                name;

        }


        /* =================================================
           STUDENT ID
        ================================================= */

        const studentId =
            user.student_id ||
            user.studentId ||
            user.roll_no ||
            user.rollNo ||
            "";

        if (profileId) {

            profileId.textContent =
                studentId;

        }


        /* =================================================
           INITIALS
        ================================================= */

        if (profileAvatar) {

            const parts =
                name
                    .trim()
                    .split(/\s+/);

            let initials = "";

            if (parts.length === 1) {

                initials =
                    parts[0]
                        .substring(0, 2)
                        .toUpperCase();

            } else {

                initials =
                    (
                        parts[0][0] +
                        parts[parts.length - 1][0]
                    ).toUpperCase();

            }

            profileAvatar.textContent =
                initials;

        }


        /* =================================================
           NAVBAR
        ================================================= */

        const navName =
            document.getElementById(
                "navUserName"
            );

        const navStudentId =
            document.getElementById(
                "navStudentId"
            );

        const navAvatar =
            document.getElementById(
                "navUserAvatar"
            );


        if (navName) {

            navName.textContent =
                name;

        }

        if (navStudentId) {

            navStudentId.textContent =
                studentId;

        }

        if (navAvatar) {

            const parts =
                name
                    .trim()
                    .split(/\s+/);

            let initials = "";

            if (parts.length === 1) {

                initials =
                    parts[0]
                        .substring(0, 2)
                        .toUpperCase();

            } else {

                initials =
                    (
                        parts[0][0] +
                        parts[parts.length - 1][0]
                    ).toUpperCase();

            }

            navAvatar.textContent =
                initials;

        }

    } catch (error) {

        console.error(
            "Could not load dashboard profile:",
            error
        );

    }
}


/* =========================================================
   START DASHBOARD PROFILE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadDashboardUserProfile();

    }
);
/* =========================================================
   START DASHBOARD
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadStudentDashboard();

    }
);
/* =========================================================
   LOAD LOGGED-IN STUDENT PROFILE
   ========================================================= */

async function loadDashboardProfile() {

    const nameElement =
        document.getElementById("sidebarUserName");

    const studentIdElement =
        document.getElementById("sidebarStudentId");

    const avatarElement =
        document.getElementById("profileAvatar");

    const navNameElement =
        document.getElementById("navUserName");

    const navStudentIdElement =
        document.getElementById("navStudentId");

    const navAvatarElement =
        document.getElementById("navUserAvatar");

    const welcomeNameElement =
        document.getElementById("dashboardUserName");


    // Make sure this code only runs on the dashboard
    if (
        !nameElement &&
        !studentIdElement &&
        !avatarElement
    ) {
        return;
    }


    // Get JWT token created during login
    const token =
        localStorage.getItem("access_token");

    if (!token) {

        console.error(
            "No access token found."
        );

        return;
    }


    try {

        const response = await fetch(
            "http://127.0.0.1:8000/auth/profile",
            {
                method: "GET",

                headers: {
                    "Authorization":
                        `Bearer ${token}`,

                    "Content-Type":
                        "application/json"
                }
            }
        );


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Profile API error:",
                response.status,
                errorText
            );

            return;
        }


        const user =
            await response.json();


        console.log(
            "PROFILE FROM BACKEND:",
            user
        );


        /* =================================================
           GET NAME
        ================================================= */

        const name =
            user.name ||
            user.full_name ||
            user.fullName ||
            "Student";


        /* =================================================
           GET STUDENT ID
        ================================================= */

        const studentId =
            user.student_id ||
            user.studentId ||
            user.roll_no ||
            user.rollNo ||
            "";


        /* =================================================
           DASHBOARD PROFILE CARD
        ================================================= */

        if (nameElement) {

            nameElement.textContent =
                name;

        }


        if (studentIdElement) {

            studentIdElement.textContent =
                studentId;

        }


        if (avatarElement) {

            avatarElement.textContent =
                getUserInitials(name);

        }
        /* =========================================================
   STUDENT DASHBOARD DATA
   ========================================================= */

async function loadStudentDashboard() {

    // Make sure we are on dashboard page
    const dashboard =
        document.getElementById("tests");

    if (!dashboard) {
        return;
    }

    const token =
        localStorage.getItem("access_token");

    if (!token) {
        console.error(
            "No access token found."
        );
        return;
    }

    try {

        const response =
            await fetch(
                API_ENDPOINTS.dashboard,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"
                    }
                }
            );

        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Dashboard API error:",
                response.status,
                errorText
            );

            return;
        }

        const data =
            await response.json();

        console.log(
            "DASHBOARD DATA FROM BACKEND:",
            data
        );


        /* =================================================
           STATISTICS
        ================================================= */

        renderDashboardStats(
            data.stats
        );


        /* =================================================
           AVAILABLE TESTS
        ================================================= */

        renderAvailableTests(
            data.tests
        );


        /* =================================================
           PROGRESS
        ================================================= */

        renderDashboardProgress(
            data.progress
        );


        /* =================================================
           SCORE TREND
        ================================================= */

        renderScoreTrend(
            data.score_trend,
            data.trend
        );


        /* =================================================
           RECENT RESULTS
        ================================================= */

        renderRecentResults(
            data.recent_results
        );
        /* =========================================================
   RECENT RESULTS
   ========================================================= */

function renderRecentResults(results) {

    const container =
        document.getElementById(
            "recentResultsBody"
        );

    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (!results || results.length === 0) {

        container.innerHTML = `
            <div class="result-row">

                <span>
                    No tests completed yet.
                </span>

                <span>-</span>

                <strong>-</strong>

                <span>-</span>

            </div>
        `;

        return;
    }


    results.forEach(function (result) {

        const row =
            document.createElement("div");

        row.className =
            "result-row";


        const score =
            Number(
                result.percentage || 0
            ).toFixed(1);


        row.innerHTML = `

            <span>
                ${result.test_name || "-"}
            </span>

            <span>
                ${formatDashboardDate(
                    result.date
                )}
            </span>

            <strong>
                ${score}%
            </strong>

            <span class="${
                result.result === "Passed"
                    ? "passed"
                    : ""
            }">
                ${result.result || "-"}
            </span>

        `;


        container.appendChild(row);

    });

}
function formatDashboardDate(dateString) {

    if (!dateString) {
        return "-";
    }


    const date =
        new Date(dateString);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return dateString;
    }


    return date.toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}
        /* =========================================================
   AVAILABLE TESTS
   ========================================================= */
function renderAvailableTests(tests) {

    const container =
        document.getElementById(
            "availableTestsList"
        );

    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (!tests || tests.length === 0) {

        container.innerHTML = `
            <p style="
                text-align: center;
                padding: 30px;
            ">
                No tests available.
            </p>
        `;

        return;
    }


    tests.forEach(function (test) {

        const card =
            document.createElement("article");

        card.className =
            "test-card";


        const setNumber =
            String(
                test.set_number
            ).padStart(2, "0");


        card.innerHTML = `

            <div class="test-number">
                ${setNumber}
            </div>


            <div class="test-details">

                <div class="test-title-row">

                    <h4>
                        Set No. ${setNumber}
                    </h4>

                    ${
                        test.is_free
                            ? `
                                <span class="free-badge">
                                    FREE
                                </span>
                              `
                            : `
                                <span class="locked-badge">
                                    AVAILABLE
                                </span>
                              `
                    }

                </div>


                <p>
                    ${test.set_name || ""}
                </p>


                <div class="test-meta">

                    <span>
                        ${test.total_questions || 0}
                        Questions
                    </span>

                    <span>
                        ${test.reading_questions || 0}
                        Reading
                    </span>

                    <span>
                        ${test.listening_questions || 0}
                        Listening
                    </span>

                </div>

            </div>


            <button
                type="button"
                class="test-button"
            >
                Start Test
            </button>

        `;


        const button =
            card.querySelector(
                ".test-button"
            );


        button.addEventListener(
            "click",
            function () {

                startTest(
                    test.id
                );

            }
        );


        container.appendChild(card);

    });

}

        /* =========================================================
   DASHBOARD STATISTICS
   ========================================================= */

function renderDashboardStats(stats) {

    if (!stats) {
        return;
    }


    /* Tests Completed */

    const testsCompleted =
        document.getElementById(
            "testsCompleted"
        );

    if (testsCompleted) {

        testsCompleted.textContent =
            stats.tests_completed ?? 0;

    }


    /* Average Score */

    const averageScore =
        document.getElementById(
            "averageScore"
        );

    if (averageScore) {

        averageScore.textContent =
            `${Number(
                stats.average_score || 0
            ).toFixed(1)}%`;

    }


    /* Best Score */

    const bestScore =
        document.getElementById(
            "bestScore"
        );

    if (bestScore) {

        bestScore.textContent =
            `${Number(
                stats.best_score || 0
            ).toFixed(1)}%`;

    }


    /* Tests Available */

    const testsAvailable =
        document.getElementById(
            "testsAvailable"
        );

    if (testsAvailable) {

        testsAvailable.textContent =
            stats.tests_available ?? 0;

    }

}


    } catch (error) {

        console.error(
            "Failed to load dashboard:",
            error
        );

    }
}
/* =========================================================
   DASHBOARD PROGRESS
   ========================================================= */

function renderDashboardProgress(progress) {

    if (!progress) {
        return;
    }


    /* Progress percentage */

    const percentage =
        document.getElementById(
            "progressPercentage"
        );

    if (percentage) {

        percentage.textContent =
            `${Number(
                progress.percentage || 0
            ).toFixed(0)}%`;

    }


    /* Tests completed */

    const completed =
        document.getElementById(
            "progressTestsCompleted"
        );

    if (completed) {

        completed.textContent =
            `${progress.completed || 0} / ${progress.total || 0}`;

    }


    /* Average score */

    const average =
        document.getElementById(
            "progressAverageScore"
        );

    if (average) {

        average.textContent =
            `${Number(
                progress.average_score || 0
            ).toFixed(1)}%`;

    }

}


        /* =================================================
           NAVBAR
        ================================================= */

        if (navNameElement) {

            navNameElement.textContent =
                name;

        }


        if (navStudentIdElement) {

            navStudentIdElement.textContent =
                studentId;

        }


        if (navAvatarElement) {

            navAvatarElement.textContent =
                getUserInitials(name);

        }


        /* =================================================
           WELCOME MESSAGE
        ================================================= */

        if (welcomeNameElement) {

            welcomeNameElement.textContent =
                name;

        }

    } catch (error) {

        console.error(
            "Failed to load student profile:",
            error
        );

    }
}


/* =========================================================
   CREATE INITIALS
   ========================================================= */

function getUserInitials(name) {

    if (!name) {
        return "ST";
    }


    const parts =
        name
            .trim()
            .split(/\s+/);


    if (parts.length === 1) {

        return parts[0]
            .substring(0, 2)
            .toUpperCase();

    }


    return (
        parts[0][0] +
        parts[parts.length - 1][0]
    ).toUpperCase();
}


/* =========================================================
   START PROFILE LOADING
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadDashboardProfile();

    }
);
/* =========================================================
   LOAD LOGGED-IN USER ON DASHBOARD
========================================================= */

function loadDashboardUser() {

    const savedUser =
        localStorage.getItem("user");

    console.log("Saved login user:", savedUser);

    if (!savedUser) {

        console.warn(
            "No logged-in user found in localStorage."
        );

        return;
    }

    try {

        const user =
            JSON.parse(savedUser);

        console.log(
            "Dashboard user:",
            user
        );


        /* =========================
           NAME
        ========================= */

        const name =
            user.name ||
            "Student";


        /* =========================
           STUDENT ID
        ========================= */

        const studentId =
            user.student_id ||
            user.studentId ||
            user.roll_no ||
            user.rollNo ||
            user.id ||
            "";


        /* =========================
           INITIALS
        ========================= */

        let initials = "ST";

        const parts =
            name
                .trim()
                .split(/\s+/);

        if (parts.length === 1) {

            initials =
                parts[0]
                    .substring(0, 2)
                    .toUpperCase();

        } else {

            initials =
                (
                    parts[0][0] +
                    parts[parts.length - 1][0]
                ).toUpperCase();

        }


        /* =========================
           WELCOME MESSAGE
        ========================= */

        const welcome =
            document.getElementById(
                "dashboardUserName"
            );

        if (welcome) {
            welcome.textContent = name;
        }


        /* =========================
           NAVBAR
        ========================= */

        const navName =
            document.getElementById(
                "navUserName"
            );

        const navId =
            document.getElementById(
                "navStudentId"
            );

        const navAvatar =
            document.getElementById(
                "navUserAvatar"
            );

        if (navName) {
            navName.textContent = name;
        }

        if (navId) {
            navId.textContent = studentId;
        }

        if (navAvatar) {
            navAvatar.textContent = initials;
        }


        /* =========================
           STUDENT PROFILE CARD
        ========================= */

        const profileName =
            document.getElementById(
                "sidebarUserName"
            );

        const profileId =
            document.getElementById(
                "sidebarStudentId"
            );

        const profileAvatar =
            document.getElementById(
                "profileAvatar"
            );

        if (profileName) {
            profileName.textContent = name;
        }

        if (profileId) {
            profileId.textContent = studentId;
        }

        if (profileAvatar) {
            profileAvatar.textContent = initials;
        }

    } catch (error) {

        console.error(
            "Could not read logged-in user:",
            error
        );

    }
}


/* =========================================================
   RUN ON DASHBOARD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadDashboardUser();

    }
);
