# LUNA Backend API v1.0

Base URL: `https://api.luna.example.com`

## Authentication

All endpoints except `/user/login` require Bearer token:

```
Authorization: Bearer <jwt_token>
```

---

## User

### POST /user/login
Login or create user account.

**Request**: `{ openid: string }`
**Response**: `{ token: string, user: UserProfile }`

### GET /user/profile
Get current user profile.

**Response**: `UserProfile`

### PATCH /user/profile
Update user settings.

**Request**: `{ nickname?: string, settings?: object }`

---

## Music

### GET /songs
List user's songs. Supports `?page=1`.

**Response**: `{ songs: Song[], total: number }`

### POST /songs/upload
Upload a new song. File goes to COS storage first.

**Request**: `{ fileID: string, songName: string }`
**Response**: `{ songId: string, url: string }`

### DELETE /songs/:id
Remove a song.

### GET /songs/history
Get play history.

---

## Character

### GET /characters
List all available character forms.

**Response**: `{ characters: Character[] }`

### POST /characters/switch
Switch LUNA's current form.

**Request**: `{ form: 'graduation' | 'live' | 'CEO' }`

### GET /characters/current
Get current character state.

---

## Memory

### GET /memories
List user's memories.

### POST /memories
Save a new memory.

**Request**: `{ type: string, title: string, content: string }`

### PATCH /memories/:id
Update a memory.

---

## AI

### POST /ai/chat
Send a message to LUNA.

**Request**: `{ message: string }`
**Response**: `{ reply: string, mood: string }`

### POST /ai/dialogue
Get scene-specific dialogue.

**Request**: `{ scene: string }`

### GET /ai/story
Get story/chapter progress.

---

## Growth

### GET /growth/:userId
Get user's growth level and unlocks.
