# Teamatch Backend Route Map

## Architecture

routes → controller → service → repository → database

routes:
- Defines endpoint path
- Adds middleware like authMiddleware
- Sends request to controller

controller:
- Handles HTTP request and response
- Validates request body with Zod
- Converts known errors into HTTP responses

service:
- Handles business logic
- Calls repositories
- Uses mappers before returning data

repository:
- Runs SQL queries
- Talks directly to PostgreSQL
- Returns raw database rows

mapper:
- Converts DB snake_case to API camelCase

validation:
- Contains Zod schemas for request body validation

---


# Routes

## Auth

### POST /auth/register

Protected:
No

Body:
{
  "email": "user@example.com",
  "username": "username",
  "password": "Password123"
}

Purpose:
Creates a new user and an empty profile in one database transaction.

Common responses:
- 201: user created
- 400: invalid request body
- 409: duplicate email or username

---

### POST /auth/login

Protected:
No

Body:
{
  "email": "user@example.com",
  "password": "Password123"
}

Purpose:
Authenticates the user and returns a JWT access token.

Response includes:
- message
- accessToken
- user

---

## Profile

### GET /profile

Protected:
Yes

Body:
None

Purpose:
Returns the authenticated user's profile.

Important:
Uses req.user.id from authMiddleware.

Common responses:
- 200: profile returned
- 401: missing or invalid token
- 404: profile not found

---

### PATCH /profile

Protected:
Yes

Body:
{
  "displayName": "Player One",
  "bio": "Looking for teammates",
  "avatarUrl": "https://example.com/avatar.png",
  "region": "EU",
  "competitiveLevel": "Gold",
  "micPreference": "yes"
}

All fields are optional.

Purpose:
Updates only the provided profile fields.

Important:
- Uses Zod validation
- Unknown fields are rejected
- Empty body / no valid fields is rejected
- DB fields are snake_case
- API fields are camelCase

Common responses:
- 200: profile updated
- 400: invalid request body
- 401: missing or invalid token

---

## Discovery

### GET /discover

Protected:
Yes

Body:
None

Purpose:
Returns potential teammate candidates.

Current V1 behavior:
- Uses current user's profile
- Requires current user to have region
- Returns users from the same region
- Excludes the current user

Common responses:
- 200: candidates returned
- 400: current profile missing required discovery fields
- 401: missing or invalid token

Future:
Discovery should later use shared games, swipes, matches, compatibility scoring, and maybe AI.

---

## Games

### GET /games

Protected:
No

Body:
None

Purpose:
Returns the platform game catalog.

Example response:
{
  "games": [
    {
      "id": 1,
      "name": "Valorant",
      "createdAt": "..."
    }
  ]
}

Important:
- User/frontend sees the game name
- Backend uses the game id
- This endpoint gives the frontend the available games to choose from

---

## User Games

### POST /me/games

Protected:
Yes

Body:
{
  "gameId": 1,
  "rank": "Gold",
  "isMain": true
}

Required:
- gameId

Optional:
- rank
- isMain

Purpose:
Adds a game from the catalog to the authenticated user's profile.

Important behavior:
- userId comes from req.user.id
- gameId comes from request body
- rank is optional
- isMain is optional and defaults to false
- duplicate user/game is blocked by UNIQUE(user_id, game_id)

Common responses:
- 201: game added to profile
- 400: invalid request body
- 401: missing or invalid token
- 404: game not found
- 409: game already added to profile
- 500: unexpected server error

Current status:
Implemented and manually tested.

Tested cases:
- valid add game works
- duplicate game returns 409
- invalid gameId returns 404
- invalid body returns 400

---

### GET /me/games

Protected:
Yes

Status:
Not implemented yet

Body:
None

Purpose:
Returns all games added by the authenticated user.

Expected response:
{
  "games": [
    {
      "id": 1,
      "userId": 3,
      "gameId": 1,
      "gameName": "Valorant",
      "rank": "Gold",
      "isMain": true,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}

Planned implementation:
1. Add repository function findUserGamesByUserId(userId)
2. Use JOIN between user_games and games
3. Add mapper support for gameName
4. Add service function getCurrentUserGames(userId)
5. Add controller function getCurrentUserGames(req, res)
6. Add route GET /me/games
7. Test with token

Repository query idea:
SELECT
  ug.id,
  ug.user_id,
  ug.game_id,
  g.name AS game_name,
  ug.rank,
  ug.is_main,
  ug.created_at,
  ug.updated_at
FROM user_games ug
INNER JOIN games g
  ON g.id = ug.game_id
WHERE ug.user_id = $1
ORDER BY ug.is_main DESC, g.name ASC

---

# Database Tables

## users

Purpose:
Stores account/authentication data.

Important fields:
- id
- email
- username
- password_hash
- created_at

---

## user_profiles

Purpose:
Stores one profile per user.

Relationship:
users 1 → 1 user_profiles

Important fields:
- id
- user_id
- display_name
- bio
- avatar_url
- region
- competitive_level
- mic_preference
- created_at
- updated_at

Important rule:
- user_id references users(id)
- user_id is unique
- profile depends on existing user

---

## games

Purpose:
Stores the platform game catalog.

Important fields:
- id
- name
- created_at

Seeded games:
- Valorant
- Counter-Strike 2
- League of Legends
- Fortnite
- Apex Legends

---

## user_games

Purpose:
Connects users to games they play.

Relationship:
users many-to-many games, implemented through user_games.

Important fields:
- id
- user_id
- game_id
- rank
- is_main
- created_at
- updated_at

Important rules:
- user_id references users(id)
- game_id references games(id)
- UNIQUE(user_id, game_id)

Meaning:
A user cannot add the same game twice.

---

# Error Handling Pattern

Repository:
- Runs SQL
- Returns rows/null
- Lets database errors bubble unless special handling is needed

Service:
- Handles business rules
- Throws Error with custom error.code

Controller:
- Maps error.code to HTTP status

Current custom service errors:
- GAME_NOT_FOUND
- USER_GAME_ALREADY_EXISTS

Controller mapping:
- ZodError → 400
- GAME_NOT_FOUND → 404
- USER_GAME_ALREADY_EXISTS → 409
- unknown error → 500

---

# Comeback Checklist

When returning after a break:

1. git checkout feature/user-games
2. git status
3. git pull origin feature/user-games
4. npm start
5. Test GET /games
6. Login and get token
7. Test POST /me/games
8. Read only the userGames module
9. Continue with GET /me/games

Important:
Do not reread the entire project before coding.
Review only the module needed for the next task.