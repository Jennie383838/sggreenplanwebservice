# Eco Habit Tracker – Web Service

## Overview
This backend web service supports the Eco Habit Tracker mobile application. It handles CRUD (Create, Read, Update, Delete) operations for habit entries. **No user authentication** is implemented in this version.

---

## Tech Stack
- Node.js + Express
- MySQL (via `mysql2/promise`)
- Environment variables via `.env`

---

## Environment Variables
Create a `.env` file in the project root with:
```
DB_HOST=your_host
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_db
DB_PORT=3306
```

---

## API Routes

### 1) Get All Habits
**GET** `/habits`

**Response:** `200 OK` with JSON array of habits from table `ECOHabitTracker`.

---

### 2) Add New Habit
**POST** `/addhabits`

**Body:**
```json
{
  "title": "string",
  "completed": true,
  "points": 10
}
```
**Response:** `201 Created`
```json
{ "message": "Habit added successfully" }
```

> Notes: values are inserted into columns `Eco_title`, `Eco_completed` (1/0), `Eco_points`.

---

### 3) Update Habit
**PUT** `/updatehabits/:id`

**Params:** `id` – the habit’s `Eco_id`

**Body:**
```json
{
  "title": "string",
  "completed": false,
  "points": 5
}
```
**Responses:**
- `200 OK` `{ "message": "Habit updated successfully" }`
- `404 Not Found` if no row was affected.

---

### 4) Delete Habit
**DELETE** `/deletehabits`

> Matches your current `server.js` which reads `id` from the **request body**.

**Body:**
```json
{ "id": 123 }
```
**Responses:**
- `200 OK` `{ "message": "Habit deleted successfully" }`
- `404 Not Found` if the habit does not exist.

---

## Running the Server
Install dependencies:
```bash
npm install
```

Start the server:
```bash
node server.js
```
The API starts on port `3000`.

---

## Project Structure
- `server.js` – Express server and routes
- `package.json` / `package-lock.json` – dependencies
- `.env` – database credentials (not committed)

---

## Database Table
The service expects a table named `ECOHabitTracker` with (at least) columns:
- `Eco_id` (primary key)
- `Eco_title` (string)
- `Eco_completed` (boolean stored as 1/0)
- `Eco_points` (integer)

---

## Sample Requests (for quick testing)

**Add a habit**
```bash
curl -X POST https://sggreenplanwebservice-2.onrender.com/addhabits \
  -H "Content-Type: application/json" \
  -d '{"title":"Recycle plastic","completed":false,"points":5}'
```

**List habits**
```bash
curl http://sggreenplanwebservice-2.onrender.com/habits
```

**Update a habit**
```bash
curl -X PUT http://sggreenplanwebservice-2.onrender.com/updatehabits/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Bring reusable bag","completed":true,"points":10}'
```

**Delete a habit** (current body-based route)
```bash
curl -X DELETE http://sggreenplanwebservice-2.onrender.com/deletehabits \
  -H "Content-Type: application/json" \
  -d '{"id":1}'
```
