const express = require("express");
const router = express.Router();
const { pool } = require("../db/connection");

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
};

// Role-based middleware
const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.session.user || req.session.user.role !== role) {
      return res.redirect("/login");
    }
    next();
  };
};

// Home page - redirect to role selection
router.get("/", (req, res) => {
  res.render("role_selection");
});

// Role selection page
router.get("/role-selection", (req, res) => {
  res.render("role_selection");
});

// Staff Login page
router.get("/login", (req, res) => {
  if (req.session.user) {
    return res.redirect(
      req.session.user.role === "staff"
        ? "/staff-dashboard"
        : "/technician-dashboard"
    );
  }
  // Clear any existing error state and don't pass any error
  delete req.session.error;
  // Prevent caching
  res.set("Cache-Control", "no-cache, no-store, must-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  res.render("login", { error: undefined });
});

// Technician Login page
router.get("/technician-login", (req, res) => {
  if (req.session.user) {
    return res.redirect(
      req.session.user.role === "staff"
        ? "/staff-dashboard"
        : "/technician-dashboard"
    );
  }
  // Clear any existing error state and don't pass any error
  delete req.session.error;
  // Prevent caching
  res.set("Cache-Control", "no-cache, no-store, must-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  res.render("technician_login", { error: undefined });
});

// Staff Login POST
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const isAjax =
    req.headers["x-requested-with"] === "XMLHttpRequest" ||
    req.headers["content-type"]?.includes("multipart/form-data") ||
    req.headers["accept"]?.includes("application/json");

  // Server-side validation
  if (!username || !password) {
    if (isAjax) {
      return res
        .status(400)
        .render("login", { error: "Username and password are required" });
    }
    return res.render("login", { error: "Username and password are required" });
  }

  // Hardcoded authentication for staff
  if (username === "staffmember" && password === "letmein!123") {
    req.session.user = { username, role: "staff" };
    if (isAjax) {
      return res
        .status(200)
        .json({ success: true, redirect: "/staff-dashboard" });
    }
    res.redirect("/staff-dashboard");
  } else {
    if (isAjax) {
      return res
        .status(401)
        .render("login", { error: "Invalid username or password" });
    }
    res.render("login", { error: "Invalid username or password" });
  }
});

// Technician Login POST
router.post("/technician-login", (req, res) => {
  const { username, password } = req.body;
  const isAjax =
    req.headers["x-requested-with"] === "XMLHttpRequest" ||
    req.headers["content-type"]?.includes("multipart/form-data") ||
    req.headers["accept"]?.includes("application/json");

  // Server-side validation
  if (!username || !password) {
    if (isAjax) {
      return res.status(400).render("technician_login", {
        error: "Username and password are required",
      });
    }
    return res.render("technician_login", {
      error: "Username and password are required",
    });
  }

  // Hardcoded authentication for technician
  if (username === "admin" && password === "heretohelp!456") {
    req.session.user = { username, role: "technician" };
    if (isAjax) {
      return res
        .status(200)
        .json({ success: true, redirect: "/technician-dashboard" });
    }
    res.redirect("/technician-dashboard");
  } else {
    if (isAjax) {
      return res
        .status(401)
        .render("technician_login", { error: "Invalid username or password" });
    }
    res.render("technician_login", { error: "Invalid username or password" });
  }
});

// Staff Dashboard
router.get(
  "/staff-dashboard",
  requireAuth,
  requireRole("staff"),
  (req, res) => {
    let formData = null;

    // Parse formData from query parameters if it exists
    if (req.query.formData) {
      try {
        formData = JSON.parse(req.query.formData);
      } catch (error) {
        console.error("Error parsing formData:", error);
        formData = null;
      }
    }

    res.render("staff_dashboard", {
      username: req.session.user.username,
      success: req.query.success,
      error: req.query.error,
      formData: formData,
    });
  }
);

// Success page
router.get("/success", requireAuth, requireRole("staff"), (req, res) => {
  res.render("success");
});

// Submit Issue
router.post(
  "/submit-issue",
  requireAuth,
  requireRole("staff"),
  async (req, res) => {
    const { name, email, location, description } = req.body;
    const isAjax =
      req.headers["x-requested-with"] === "XMLHttpRequest" ||
      req.headers["accept"]?.includes("application/json");

    // Server-side validation
    const errors = [];

    if (!name || !name.trim()) {
      errors.push("Name is required");
    } else if (!/^[A-Za-z\s]+$/.test(name.trim())) {
      errors.push("Name must contain only letters and spaces");
    }
    if (!email || !email.trim()) {
      errors.push("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.push("Please enter a valid email address");
    }
    if (!location || !location.trim()) {
      errors.push("Location is required");
    }
    if (!description || !description.trim()) {
      errors.push("Description is required");
    } else if (description.trim().length < 10) {
      errors.push("Description must be at least 10 characters long");
    }

    if (errors.length > 0) {
      if (isAjax) {
        return res
          .status(400)
          .json({ success: false, error: errors.join(", ") });
      }
      const formData = { name, email, location, description };
      return res.redirect(
        `/staff-dashboard?error=${encodeURIComponent(
          errors.join(", ")
        )}&formData=${encodeURIComponent(JSON.stringify(formData))}`
      );
    }

    try {
      // Sanitize inputs
      const sanitizedName = name.trim();
      const sanitizedEmail = email.trim().toLowerCase();
      const sanitizedLocation = location.trim();
      const sanitizedDescription = description.trim();

      // Insert into database
      const [result] = await pool.execute(
        "INSERT INTO faults (name, email, location, description) VALUES (?, ?, ?, ?)",
        [sanitizedName, sanitizedEmail, sanitizedLocation, sanitizedDescription]
      );

      if (isAjax) {
        return res.status(200).json({ success: true, redirect: "/success" });
      }
      res.redirect("/success");
    } catch (error) {
      if (isAjax) {
        return res.status(500).json({
          success: false,
          error: "Failed to submit issue. Please try again.",
        });
      }
      res.redirect(
        "/staff-dashboard?error=Failed to submit issue. Please try again."
      );
    }
  }
);

// Technician Dashboard
router.get(
  "/technician-dashboard",
  requireAuth,
  requireRole("technician"),
  async (req, res) => {
    try {
      // Get both incomplete and completed jobs
      const [incompleteJobs] = await pool.execute(
        'SELECT * FROM faults WHERE status = "incomplete" ORDER BY created_at DESC'
      );

      const [completedJobs] = await pool.execute(
        'SELECT * FROM faults WHERE status = "complete" ORDER BY created_at DESC'
      );

      res.render("technician_dashboard", {
        incompleteJobs,
        completedJobs,
        success: req.query.success,
        error: req.query.error,
      });
    } catch (error) {
      console.error("Database error:", error);
      res.render("technician_dashboard", {
        incompleteJobs: [],
        completedJobs: [],
        error: "Failed to load jobs. Please try again.",
      });
    }
  }
);

// Mark Job as Complete
router.post(
  "/complete-job",
  requireAuth,
  requireRole("technician"),
  async (req, res) => {
    const { jobId } = req.body;

    if (!jobId || isNaN(jobId)) {
      return res.redirect("/technician-dashboard?error=Invalid job ID");
    }

    try {
      // Update job status
      const [result] = await pool.execute(
        'UPDATE faults SET status = "complete" WHERE id = ?',
        [jobId]
      );

      if (result.affectedRows === 0) {
        return res.redirect("/technician-dashboard?error=Job not found");
      }

      res.redirect(
        "/technician-dashboard?success=Job marked as complete successfully"
      );
    } catch (error) {
      console.error("Database error:", error);
      res.redirect("/technician-dashboard?error=Failed to update job status");
    }
  }
);

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Session destruction error:", err);
    }
    res.redirect("/role-selection");
  });
});

module.exports = router;
