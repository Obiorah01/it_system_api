# WearView Academy IT Support System

A modern IT support reporting and management system for WearView Academy, built with Node.js, Express, MySQL, and EJS. The system allows staff to submit IT issues and technicians to manage and resolve them, with a focus on usability, security, and a clean, responsive UI.

## Features
- Staff and technician login with role-based dashboards
- Staff can submit IT support requests with validation
- Technicians can view, manage, and mark jobs as complete
- Real-time job status updates
- Modern, responsive UI (dark theme for login/staff, Tailwind for technician)
- Secure session management and input validation
- MySQL database integration

## Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [MySQL](https://www.mysql.com/) server

## Setup
1. **Clone the repository**
   ```sh
   git clone <your-repo-url>
   cd it_system_api
   ```
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Configure environment variables**
   - Copy `.env.example` to `.env` and fill in your MySQL credentials:
     ```sh
     cp .env.example .env
     # Edit .env with your DB settings
     ```
4. **Set up the database**
   - Ensure your MySQL server is running.
   - Create the database and tables using the provided scripts or let the app auto-create them on first run.

## Environment Variables
The following variables must be set in your `.env` file:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=support_system
```

## Running the Application
Start the server with:
```sh
npm start
```
The app will be available at [http://localhost:3000](http://localhost:3000)

## Default Logins
- **Staff:**
  - Username: `staffmember`
  - Password: `letmein!123`
- **Technician:**
  - Username: `admin`
  - Password: `heretohelp!456`

## Project Structure
```
it_system_api/
├── app.js                # Main Express app
├── db/
│   └── connection.js     # MySQL connection and setup
├── public/               # Static assets (CSS, JS, images)
├── routes/
│   └── index.js          # Main routes
├── views/                # EJS templates for all pages
├── .env.example          # Example environment variables
├── package.json          # Project metadata and scripts
└── README.md             # Project documentation
```

## License
MIT (or specify your license)
