# Devzz Tech 48-Hour Full-Stack Challenge

🔒 **Privacy:** This is your own **private** repo. You will **not** see any other candidate’s work. Complete all tasks in **48 hours**.

---

## 📆 Timeline

- **Start:** Immediately after cloning  
- **Deadline:** 48 hours later — **4 July 2025 9 PM PKT**  
- **Submission:**  
  1. Open **one PR per task** (7 total + optional bonus)  
  2. Notify us via WhatsApp: **+923311384111** with your repo URL  

> **Time-tracking:**  
> - Create an issue “🟢 Challenge Started” immediately.  
> - Create an issue “✅ Challenge Complete” when your final PR is open.

---

## 🚀 What You’ll Receive

A **backend skeleton** under `backend/` with:

- `backend/seed-data.json` (sample users, courses, projects, notifications)  
- Express app in `backend/src/` with stub routes and JWT middleware  
- `.env.example` with `JWT_SECRET=changeme`  
- `package.json` scripts:  
  ```json
  {
    "scripts": {
      "dev": "nodemon src/app.js",
      "test": "jest --coverage"
    }
  }
````

Your job is to **extend the backend** and **build a frontend** from scratch.

---

## 🚧 Setup

### Backend

```bash
cd backend
cp .env.example .env         # sets JWT_SECRET=changeme
npm install
npm run dev                  # API on http://localhost:4000
```

Endpoints must load `seed-data.json` into memory on start.

### Frontend

You are free to choose your stack (e.g., Create-React-App, Vite+React, Next.js).
Your app must run on **[http://localhost:3000](http://localhost:3000)** and use `http://localhost:4000` as its API URL.

---

## 📝 Your Tasks (7 required + 1 bonus)

Open **one PR per task**, on branches named:

```
task-1-yourname
…
task-7-yourname
bonus-yourname
```

| Task                                                        | Area                     |  Pts |
| ----------------------------------------------------------- | ------------------------ | :--: |
| 1. Advanced CRUD & Bulk Operations                          | Backend & API            |  20  |
| 2. JWT Auth, RBAC & Token Management                        | Security                 |  15  |
| 3. Search, Filter, Sort & Pagination                        | API Design & Performance |  15  |
| 4. Real-Time Notifications via Socket.io                    | Real-Time & UX           |  15  |
| 5. Reporting Endpoint & CSV Export                          | Data Aggregation         |  10  |
| 6. Frontend: Build UI, State Mgmt & Optimistic Bulk Actions | Front-End Implementation |  15  |
| 7. Dockerize & GitHub Actions CI/CD                         | DevOps & Quality         |  10  |
| **Bonus:** End-to-End Testing & Load Simulation             | Testing & QA             |  10  |
| **Total:**                                                  |                          | 100+ |

---

### Task 1 (20 pts): Advanced CRUD & Bulk Operations

* **Courses** and **Projects** resources:

  * Full CRUD:

    ```
    GET    /courses
    GET    /courses/:id
    POST   /courses
    PATCH  /courses/:id
    DELETE /courses/:id
    ```

    (and same for `/projects`)
  * **Bulk update**:
    `PATCH /projects/bulk-status` accepts

    ```json
    { "ids": [101,102], "status": "done" }
    ```
* **Ownership**: non-admin users may only operate on their own items; admins may operate on any.
* **HTTP codes**: use 400 for bad data, 403 for forbidden, 404 for not found.
* **Tests**: Jest + Supertest covering single & bulk flows, unauthorized attempts.

---

### Task 2 (15 pts): JWT Auth, RBAC & Token Management

* Implement in `backend/src/routes/auth.js`:

  * `POST /auth/login` → returns JWT with `{ userId, role }`
  * `POST /auth/refresh` → returns new JWT
  * `POST /auth/logout` → blacklists current token in memory
* Middleware to enforce:

  * Authenticated access for all endpoints
  * `admin` role required for `/projects/bulk-status`
* **Tests**: full auth flow, role enforcement, token expiry (simulate via short TTL).

---

### Task 3 (15 pts): Search, Filter, Sort & Pagination

* Enhance `GET /courses` & `GET /projects`:

  * Support query parameters:

    * `?search=` (case-insensitive substring on `title` or `name`)
    * `?status=` (projects only)
    * `?ownerId=`
    * `?sortBy=`\[`title`|`name`|`status`|`progress`], `?order=`\[`asc`|`desc`]
    * `?page=` & `?limit=`
* **In-memory cache**: cache each unique query result for **30 seconds**, invalidate on create/update/delete.
* **Tests**: combinations of filters, sorting, pagination; cache invalidation.

---

### Task 4 (15 pts): Real-Time Notifications via Socket.io

* On `POST /notifications`:

  * Persist notification to memory
  * Emit event via Socket.io on namespace `/notify`
* Clients subscribe to their own `userId` room.
* **Front-end**:

  * Connect, join your `userId` room
  * Display real-time toast alerts
* **Tests**: simulate HTTP + socket flow, assert client UI updates.

---

### Task 5 (10 pts): Reporting Endpoint & CSV Export

* Implement `GET /reports/user-progress`:

  * Returns JSON summary per user:

    ```json
    [{ "userId":1, "avgProgress":50, "projectCount":2 }, …]
    ```
* Implement `GET /reports/user-progress.csv`:

  * Returns same data as a downloadable CSV
* **Tests**: JSON structure, CSV formatting (headers, rows).

---

### Task 6 (15 pts): Front-End: Build UI, State Mgmt & Optimistic Bulk Actions

* **Tailwind** your own front-end project (React, Vite, Next.js, etc.).
* **Pages**:

  1. **Dashboard** showing course cards with progress bars
  2. **Projects** list with checkboxes for bulk actions
* **State Management**: React Context or Redux Toolkit
* **Bulk UI**: select multiple projects, choose status, perform optimistic update, rollback on failure
* **Tests**: React Testing Library for main flows and rollback scenario

---

### Task 7 (10 pts): Dockerize & GitHub Actions CI/CD

* **Docker**:

  * `Dockerfile` for backend
  * `Dockerfile` for frontend
  * `docker-compose.yml` to run both services
* **GitHub Actions**:

  1. `npm ci` + lint both backend & frontend
  2. Run all tests
  3. Build Docker images
* Add CI badge to your README

---

### Bonus (10 pts): End-to-End Testing & Load Simulation

* Write **Cypress** E2E tests for login, CRUD, bulk, real-time notify
* Use **autocannon** or **Artillery** to simulate 200 concurrent `GET /projects`
* Report P95 latency & error rate in CI logs

---

## 📋 Branching & PR Guidelines

* **Branches:** `task-1-yourname`, …, `task-7-yourname`, `bonus-yourname`
* **PR titles:** “Task 3: Search & Pagination” etc.
* **Commits:** small, descriptive, reference task number
* **CI:** all checks must pass before merge

---

## ✅ Submission

1. Ensure you have:

   * Issue **“🟢 Challenge Started”**
   * PRs for **Tasks 1–7**
   * Optional **Bonus** PR
   * Issue **“✅ Challenge Complete”**
2. Open all PRs **within 48 hours**
3. Notify us via WhatsApp (+92 331 138 4111) with your **repo link**

We will review and invite top performers to a **final interview** on system design, leadership, and mentoring.

---

**Good luck!** We look forward to your comprehensive full-stack solution.

```
```