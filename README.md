# 🎓 WearView Academy - IT Support Reporting System (Prototype)

A prototype web-based system for WearView Academy that allows staff to report IT-related issues and technicians to manage them. Built using **Node.js**, **EJS**, **MySQL**, and styled with **Tailwind CSS via CDN**.

> ✅ All pages should be **well-designed**, following **modern product design best practices** including proper spacing, hierarchy, responsiveness, accessibility, and mobile compatibility. Prioritize usability and visual clarity.

---

## 📦 Tech Stack

* **Backend:** Node.js + Express
* **Templating Engine:** EJS
* **Database:** MySQL
* **Styling:** Tailwind CSS (CDN via `https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4`)

---

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm init -y
npm install express ejs mysql2 body-parser
```

---

### 2. Project Structure

```
project-root/
│
├── views/
│   ├── login.ejs
│   ├── staff_dashboard.ejs
│   ├── technician_dashboard.ejs
│   └── layout.ejs
│
├── public/
│   └── (static assets if needed)
│
├── routes/
│   └── index.js
│
├── db/
│   └── connection.js
│
├── tests.md
├── evaluation.md
└── app.js
```

---

## 🖄️ Database Configuration

**MySQL Credentials:**

```
Host:     localhost  
Port:     3306  
User:     root  
Password: TheTitan1123!
Database: support_system
```

### SQL Setup

```sql
CREATE DATABASE support_system;

USE support_system;

CREATE TABLE faults (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  location VARCHAR(100),
  description TEXT,
  status ENUM('incomplete', 'complete') DEFAULT 'incomplete',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔐 Authentication Logic

* **Staff Login:**

  * Username: `staffmember`
  * Password: `letmein!123`
  * Redirect to `/staff-dashboard`

* **Technician Login:**

  * Username: `admin`
  * Password: `heretohelp!456`
  * Redirect to `/technician-dashboard`

> Ensure pages for login, dashboards, and forms follow a clean layout with proper headings, form groupings, and confirmation alerts.

---

## ✏️ Features

### 👩‍🏫 Staff Flow

* Login → `/staff-dashboard`
* Submit IT Issue Form with:

  * Name (text)
  * Email (email)
  * Location (text)
  * Problem Description (textarea)
* Form includes:

  * Client-side HTML5 validation
  * Server-side validation before DB insert

**Insert Query Example:**

```sql
INSERT INTO faults (name, email, location, description) VALUES (?, ?, ?, ?);
```

* Show confirmation alert: “Your issue has been submitted successfully.”
* Use Tailwind classes to create a clean UI for the form and success message.

---

### 👨‍💼 Technician Flow

* Login → `/technician-dashboard`
* View list of **incomplete jobs**:

**Query Example:**

```sql
SELECT * FROM faults WHERE status = 'incomplete';
```

* Each job entry should include:

  * Name, Email, Location, Description, Created Timestamp
  * “Mark as Complete” button

**Update Query:**

```sql
UPDATE faults SET status = 'complete' WHERE id = ?;
```

* Add toggle to view **completed jobs**:

```sql
SELECT * FROM faults WHERE status = 'complete';
```

> Use visual cards or tables styled with Tailwind to clearly distinguish incomplete from completed jobs.

---

## 🎨 Tailwind CSS Setup

Insert in `<head>` of `layout.ejs`:

```html
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
```

Use Tailwind utility classes throughout views. Follow best practices:

* Use consistent padding/margins
* Apply spacing for readability
* Use Tailwind’s responsive classes for mobile friendliness
* Include `aria` attributes for accessibility

---

## 🧪 Testing

Create a file named `tests.md` and document at least **15 test cases**.

### Example Format

| Test # | Title           | Description            | Expected Result              | Actual Result | Fix (if needed) |
| ------ | --------------- | ---------------------- | ---------------------------- | ------------- | --------------- |
| 1      | Login Auth      | Test valid staff login | Redirects to staff dashboard | ✅             | -               |
| 2      | Form Validation | Submit blank form      | Error message shown          | ✅             | -               |
| 3      | Job Completion  | Mark job as complete   | Status changes to complete   | ✅             | -               |
| ...    |                 |                        |                              |               |                 |

---

## 📊 Evaluation

Write a **1000-word critical evaluation** in `evaluation.md` covering:

* System strengths and weaknesses
* Code structure & maintainability
* UI/UX quality
* Data security considerations
* Suggested improvements for future versions

---

## ✅ Deliverables

The following items must be implemented to complete the project successfully:

1. **Login System**

   * Hardcoded login with role-based redirection:

     * `staffmember` / `letmein!123` → Staff Dashboard
     * `admin` / `heretohelp!456` → Technician Dashboard

2. **Staff Dashboard**

   * IT Issue Reporting Form with input fields: name, email, location, and issue description
   * Form with client-side and server-side validation
   * Form submission stores issue to MySQL database
   * Confirmation message upon submission

3. **Technician Dashboard**

   * Display list of incomplete jobs using query:

     ```sql
     SELECT * FROM faults WHERE status = 'incomplete';
     ```
   * Allow job status updates with query:

     ```sql
     UPDATE faults SET status = 'complete' WHERE id = ?;
     ```
   * Ability to view completed jobs using:

     ```sql
     SELECT * FROM faults WHERE status = 'complete';
     ```

4. **Database Integration**

   * MySQL connection using provided credentials
   * Proper table setup with appropriate fields and data types

5. **Validation**

   * HTML5 client-side validation for all form fields
   * Server-side validation to sanitize and validate inputs before database entry

6. **Styling**

   * Use Tailwind CSS CDN
   * Layouts must follow modern product design guidelines: spacing, alignment, responsiveness, and accessibility

7. **Testing**

   * `tests.md` file with at least 15 detailed and relevant test cases

8. **Evaluation**

   * `evaluation.md` file containing a 1000-word critical evaluation of the system covering:

     * Strengths and weaknesses
     * Suggestions for improvement
     * Code and UI/UX review

9. **Product Design Standards**

   * All pages should be responsive, user-friendly, and follow modern design best practices including accessibility and clarity

---

---
