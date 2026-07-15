# LUNA Database Schema

## Collections (MongoDB / CloudBase)

### users
| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | |
| openid | string | WeChat OpenID (unique) |
| nickname | string | Display name |
| avatar | string | Avatar URL |
| level | number | 1-4 |
| currentCharacter | string | graduation / live / CEO |
| stats.totalPlays | number | |
| stats.totalSongs | number | |
| stats.interactionDays | number | |
| createdAt | Date | |
| updatedAt | Date | |

### songs
| Field | Type |
|-------|------|
| userId | string |
| name | string |
| url | string (COS fileID) |
| duration | number |
| bpm | number |
| energy | number |
| animationMode | string |
| playCount | number |
| uploadedAt | Date |

### memories
| Field | Type |
|-------|------|
| userId | string |
| type | string (first_upload / milestone / interaction / easter_egg) |
| title | string |
| content | string |
| importance | number (0-1) |
| createdAt | Date |

### characters
| Field | Type |
|-------|------|
| id | string (LUNA-001) |
| name | string |
| forms | Array<{ id, name, theme, scene, unlockLevel }> |
| sprites | Record<string, string> |

### stories
| Field | Type |
|-------|------|
| id | string |
| chapter | number |
| trigger | string |
| dialogues | string[] |
| unlockCondition | object |

### growth
| Field | Type |
|-------|------|
| userId | string (unique) |
| level | number |
| exp.music | number |
| exp.memory | number |
| exp.friendship | number |
| unlocked.actions | string[] |
| unlocked.scenes | string[] |
| unlocked.stories | string[] |

## Indexes

```js
users: { openid: 1 } unique
songs: { userId: 1, playCount: -1 }
memories: { userId: 1, type: 1 }
growth: { userId: 1 } unique
```
