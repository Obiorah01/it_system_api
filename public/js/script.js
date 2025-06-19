/**
 * WearView Academy IT Support System - Main JavaScript
 * Handles all client-side functionality including form validation, search, filtering, and user interactions
 */

document.addEventListener("DOMContentLoaded", function () {
  // Initialize all components
  initializeLoginForms();
  initializeStaffDashboard();
  initializeTechnicianDashboard();
  initializeRoleSelection();
  initializeGlobalFeatures();
});

/**
 * Initialize login form functionality
 */
function initializeLoginForms() {
  // Staff Login Form
  const staffLoginForm = document.getElementById("login-form");
  if (staffLoginForm) {
    setupLoginForm(staffLoginForm, "staff");
  }

  // Technician Login Form
  const technicianLoginForm = document.getElementById("technician-login-form");
  if (technicianLoginForm) {
    setupLoginForm(technicianLoginForm, "technician");
  }
}

/**
 * Setup login form with validation
 */
function setupLoginForm(form, role) {
  const username = form.querySelector("#username");
  const password = form.querySelector("#password");
  const validationMsg = form.querySelector("#validation-msg");

  form.addEventListener("submit", function (e) {
    const usernameValue = username.value.trim();
    const passwordValue = password.value;

    // Clear previous error messages
    clearValidationMessage(validationMsg);

    // Only validate basic format - let server handle authentication
    if (!usernameValue) {
      e.preventDefault();
      showValidationMessage(validationMsg, "Username is required", "error");
      return;
    }

    if (!passwordValue) {
      e.preventDefault();
      showValidationMessage(validationMsg, "Password is required", "error");
      return;
    }

    // Don't validate credentials on client-side - let server handle authentication errors
  });

  // Real-time validation feedback
  username.addEventListener("input", function () {
    if (this.value.trim()) {
      clearValidationMessage(validationMsg);
    }
  });

  password.addEventListener("input", function () {
    if (this.value) {
      clearValidationMessage(validationMsg);
    }
  });
}

/**
 * Initialize staff dashboard functionality
 */
function initializeStaffDashboard() {
  const requestForm = document.getElementById("request-form");
  if (!requestForm) return;

  const fullName = document.getElementById("fullName");
  const emailAddress = document.getElementById("emailAddress");
  const faultLocation = document.getElementById("faultLocation");
  const faultDescription = document.getElementById("faultDescription");
  const validationMsg = document.getElementById("request-validation-msg");

  // Auto-hide success/error messages after 5 seconds
  autoHideAlerts();

  // Form submission validation
  requestForm.addEventListener("submit", function (e) {
    const nameValue = fullName.value.trim();
    const emailValue = emailAddress.value.trim();
    const locationValue = faultLocation.value.trim();
    const descriptionValue = faultDescription.value.trim();

    // Clear previous error messages
    clearValidationMessage(validationMsg);

    // Client-side validation
    if (!nameValue) {
      e.preventDefault();
      showValidationMessage(validationMsg, "Full Name is required", "error");
      return;
    }

    if (!/^[A-Za-z\s]+$/.test(nameValue)) {
      e.preventDefault();
      showValidationMessage(
        validationMsg,
        "Name must contain only letters and spaces",
        "error"
      );
      return;
    }

    if (!emailValue) {
      e.preventDefault();
      showValidationMessage(
        validationMsg,
        "Email Address is required",
        "error"
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      e.preventDefault();
      showValidationMessage(
        validationMsg,
        "Please enter a valid email address",
        "error"
      );
      return;
    }

    if (!locationValue) {
      e.preventDefault();
      showValidationMessage(
        validationMsg,
        "Fault Location is required",
        "error"
      );
      return;
    }

    if (!descriptionValue) {
      e.preventDefault();
      showValidationMessage(
        validationMsg,
        "Problem Description is required",
        "error"
      );
      return;
    }

    if (descriptionValue.length < 10) {
      e.preventDefault();
      showValidationMessage(
        validationMsg,
        "Description must be at least 10 characters long",
        "error"
      );
      return;
    }
  });

  // Real-time validation feedback
  [fullName, emailAddress, faultLocation, faultDescription].forEach((field) => {
    field.addEventListener("input", function () {
      if (validationMsg.textContent) {
        clearValidationMessage(validationMsg);
      }
    });
  });
}

/**
 * Initialize technician dashboard functionality
 */
function initializeTechnicianDashboard() {
  const incompleteBtn = document.getElementById("incomplete-btn");
  const completeBtn = document.getElementById("complete-btn");
  const incompleteJobs = document.getElementById("incomplete-jobs");
  const completedJobs = document.getElementById("completed-jobs");
  const searchInput = document.getElementById("search-input");
  const statusFilter = document.getElementById("status-filter");

  if (!incompleteBtn || !completeBtn) return;

  // Auto-hide success/error messages after 5 seconds
  autoHideAlerts();

  // Toggle between incomplete and completed jobs
  incompleteBtn.addEventListener("click", function () {
    showIncompleteJobs();
  });

  completeBtn.addEventListener("click", function () {
    showCompletedJobs();
  });

  // Search functionality
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      performSearch(this.value.toLowerCase());
    });
  }

  // Status filter
  if (statusFilter) {
    statusFilter.addEventListener("change", function () {
      performStatusFilter(this.value);
    });
  }

  // Confirm job completion
  setupJobCompletionConfirmation();
}

/**
 * Show incomplete jobs
 */
function showIncompleteJobs() {
  const incompleteJobs = document.getElementById("incomplete-jobs");
  const completedJobs = document.getElementById("completed-jobs");
  const incompleteBtn = document.getElementById("incomplete-btn");
  const completeBtn = document.getElementById("complete-btn");

  if (incompleteJobs) incompleteJobs.classList.remove("hidden");
  if (completedJobs) completedJobs.classList.add("hidden");
  if (incompleteBtn) incompleteBtn.className = "btn-primary";
  if (completeBtn) completeBtn.className = "btn-secondary";
}

/**
 * Show completed jobs
 */
function showCompletedJobs() {
  const incompleteJobs = document.getElementById("incomplete-jobs");
  const completedJobs = document.getElementById("completed-jobs");
  const incompleteBtn = document.getElementById("incomplete-btn");
  const completeBtn = document.getElementById("complete-btn");

  if (incompleteJobs) incompleteJobs.classList.add("hidden");
  if (completedJobs) completedJobs.classList.remove("hidden");
  if (completeBtn) completeBtn.className = "btn-primary";
  if (incompleteBtn) incompleteBtn.className = "btn-secondary";
}

/**
 * Perform search functionality
 */
function performSearch(searchTerm) {
  const jobCards = document.querySelectorAll(".card-hover, .job-card");

  jobCards.forEach((card) => {
    const text = card.textContent.toLowerCase();
    if (text.includes(searchTerm)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

/**
 * Perform status filtering
 */
function performStatusFilter(selectedStatus) {
  const jobCards = document.querySelectorAll(".card-hover, .job-card");

  jobCards.forEach((card) => {
    const statusBadge = card.querySelector(".status-badge");
    if (
      selectedStatus === "all" ||
      statusBadge.textContent.toLowerCase().includes(selectedStatus)
    ) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

/**
 * Setup job completion confirmation
 */
function setupJobCompletionConfirmation() {
  document.querySelectorAll('form[action="/complete-job"]').forEach((form) => {
    form.addEventListener("submit", function (e) {
      if (!confirm("Are you sure you want to mark this job as complete?")) {
        e.preventDefault();
      }
    });
  });
}

/**
 * Initialize role selection functionality
 */
function initializeRoleSelection() {
  // Add any role selection specific functionality here
  const roleCards = document.querySelectorAll(".card-hover");

  roleCards.forEach((card) => {
    card.addEventListener("click", function (e) {
      // Add click animation
      this.style.transform = "scale(0.98)";
      setTimeout(() => {
        this.style.transform = "";
      }, 150);
    });
  });
}

/**
 * Initialize global features
 */
function initializeGlobalFeatures() {
  // Add smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Add loading states to buttons
  document.querySelectorAll('button[type="submit"]').forEach((button) => {
    button.addEventListener("click", function () {
      if (this.form && this.form.checkValidity()) {
        this.disabled = true;
        this.innerHTML =
          '<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Processing...';
      }
    });
  });
}

/**
 * Show validation message
 */
function showValidationMessage(element, message, type = "error") {
  if (!element) return;

  element.textContent = message;
  element.style.color = type === "error" ? "#ef4444" : "#22c55e";
  element.style.display = "block";
}

/**
 * Clear validation message
 */
function clearValidationMessage(element) {
  if (!element) return;

  element.textContent = "";
  element.style.display = "none";
}

/**
 * Auto-hide alerts after 5 seconds
 */
function autoHideAlerts() {
  setTimeout(() => {
    const alerts = document.querySelectorAll(
      '[class*="text-green-400"], [class*="text-red-400"], .alert'
    );
    alerts.forEach((alert) => {
      alert.style.transition = "opacity 0.5s ease-out";
      alert.style.opacity = "0";
      setTimeout(() => alert.remove(), 500);
    });
  }, 5000);
}

/**
 * Utility function to format dates
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Utility function to validate email
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Utility function to sanitize input
 */
function sanitizeInput(input) {
  return input.trim().replace(/[<>]/g, "");
}

/**
 * Show success notification
 */
function showSuccessNotification(message) {
  const notification = document.createElement("div");
  notification.className =
    "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50";
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

/**
 * Show error notification
 */
function showErrorNotification(message) {
  const notification = document.createElement("div");
  notification.className =
    "fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50";
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Export functions for potential use in other scripts
window.WearViewITSupport = {
  showSuccessNotification,
  showErrorNotification,
  formatDate,
  isValidEmail,
  sanitizeInput,
};
