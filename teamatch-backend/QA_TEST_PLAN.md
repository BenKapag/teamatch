# Teamatch Backend QA Checklist

## Purpose

This document contains a lightweight manual/API QA checklist for the Teamatch backend.

Goals:
- Practice QA thinking.
- Track important API scenarios.
- Verify expected backend behavior.
- Prepare important scenarios for future automation.

---

## Test Environment

Base URL: http://localhost:3000

Tools:
- Postman
- Docker PostgreSQL
- Terminal

---

## General Preconditions

Before running protected endpoint tests:

1. Backend server is running.
2. PostgreSQL Docker container is running.
3. Migrations were executed.
4. Seeds were executed.
5. Test user exists.
6. User can log in successfully.
7. Postman environment has:
   - baseUrl
   - accessToken

---

## Test Data

### Test User A

Email: usera@test.com  
Username: user_a  
Password: Password123

### Seeded Games

1 - Valorant  
2 - Counter-Strike 2  
3 - League of Legends  
4 - Fortnite  
5 - Apex Legends

---

# API Test Checklist

| ID | Feature | Scenario | Endpoint | Expected Result | Status |
|---|---|---|---|---|---|
| AUTH-001 | Auth | Login valid user | POST /auth/login | 200, returns accessToken, saves token to Postman environment | Pass |
| GC-001 | Games Catalog | Get games catalog | GET /games | 200, returns games array sorted by name | Pass |
| UG-001 | User Games | Add valid game | POST /me/games | 201, game added to profile | Not Run |
| UG-002 | User Games | Get current user's games | GET /me/games | 200, returns current user's games array | Not Run |
| UG-003 | User Games | Add duplicate game | POST /me/games | 409, duplicate game rejected | Not Run |
| UG-004 | User Games | Add non-existing game | POST /me/games | 404, game not found | Not Run |
| UG-005 | User Games | Add game with invalid body | POST /me/games | 400, validation error | Not Run |
| UG-006 | User Games | Get current user's games without token | GET /me/games | 401, unauthorized | Not Run |

---

# Notes

## Auth

AUTH-001:
- Login request should save accessToken into Postman environment.
- Protected requests should use: Bearer {{accessToken}}

## Games Catalog

GC-001:
- Endpoint is public.
- Response should contain a games array.
- Each game should include:
  - id
  - name
  - createdAt
- Games should be sorted alphabetically by name.

## User Games

POST /me/games:
- Protected endpoint.
- userId comes from req.user.id.
- gameId comes from request body.
- rank is optional.
- isMain is optional and defaults to false.
- Duplicate user/game rows are blocked by UNIQUE(user_id, game_id).

GET /me/games:
- Protected endpoint.
- Should return only games that belong to the authenticated user.
- Expected item fields:
  - id
  - userId
  - gameId
  - gameName
  - rank
  - isMain
  - createdAt
  - updatedAt

---

# Postman Collection Structure

Collection name:
Teamatch Backend API

Environment:
Teamatch Local

Environment variables:
- baseUrl = http://localhost:3000
- accessToken = saved from login response

Folders:
- Auth
- Games
- User Games
- Profile
- Discovery

Current requests:
- AUTH-001 Login
- GC-001 Get games catalog
- UG-001 Add valid game
- UG-002 Get my games
- UG-003 Add duplicate game
- UG-004 Add non-existing game
- UG-005 Add invalid body
- UG-006 Get my games without token

---

# Status Values

Use one of:

- Not Run
- Pass
- Fail
- Blocked

Meaning:

Not Run:
Test was not executed yet.

Pass:
Actual result matched expected result.

Fail:
Actual result did not match expected result.

Blocked:
Could not run the test because of missing setup, server issue, database issue, or another dependency.

---

# Next QA Steps

1. Continue building the Postman collection.
2. Add Postman tests for User Games requests.
3. Run the checklist manually.
4. Mark each scenario as Pass / Fail / Blocked.
5. Later automate important scenarios with Jest + Supertest.