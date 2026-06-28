# CollectiveConsciousness — `web7.collectiveConsciousness`

Source controller: [`CollectiveConsciousnessController.cs`](https://github.com/NextGenSoftwareUK/OASIS2/blob/main/WEB7/NextGenSoftware.OASIS.Web7.WebAPI/Controllers/CollectiveConsciousnessController.cs)
Route prefix: `v1/collective-consciousness`
3 operation(s).

Every method takes a single args object: any key matching a `{token}` in the route is substituted into the URL; everything else becomes the query string (GET/DELETE) or JSON body (POST/PUT). Every call resolves to the standard OASIS envelope:

```ts
{
  isError: boolean;
  isWarning: boolean;
  message: string;
  errorCode?: string;
  result: T; // see each endpoint's Response section below
}
```

## Operations

### `createSpace`

Shared intention fields where multiple consenting symbiosis sessions co-create. Only the aggregate state is ever exposed.

**POST** `v1/collective-consciousness/spaces`

**Request**

Body fields:

| Field | Type |
| --- | --- |
| `name` | `string` |

**Response**

Standard `OASISResult` envelope (see top of this page) with:

`result` type: `CollectiveConsciousnessSpace`

| Field | Type |
| --- | --- |
| `Id` | `Guid` |
| `Name` | `string` |
| `ParticipantSessionIds` | `List<Guid>` |
| `AggregateState` | `IntentionState` |
| `CreatedUtc` | `DateTime` |

**Example**

```js
const { isError, message, result } = await web7.collectiveConsciousness.createSpace({
    name: 'example string'
  });
if (isError) throw new Error(message);
console.log(result);
```

Example response:

```json
{
  "isError": false,
  "message": "",
  "result": { "Id": "3fa85f64-5717-4562-b3fc-2c963f66afa6", "Name": "example string", "ParticipantSessionIds": ["3fa85f64-5717-4562-b3fc-2c963f66afa6"], "AggregateState": { "Focus": 1.0, "EmotionalValence": 1.0, "Arousal": 1.0, "CognitiveLoad": 1.0, "Features": { "<string>": 1.0 }, "ComputedUtc": "2026-01-01T00:00:00Z" }, "CreatedUtc": "2026-01-01T00:00:00Z" }
}
```

---

### `getAggregateField`

**GET** `v1/collective-consciousness/spaces/{spaceId}/field`

Route parameters:

| Field | Type |
| --- | --- |
| `spaceId` | `Guid` |

**Request**

No request body.

**Response**

Standard `OASISResult` envelope (see top of this page) with:

`result` type: `CollectiveConsciousnessSpace`

| Field | Type |
| --- | --- |
| `Id` | `Guid` |
| `Name` | `string` |
| `ParticipantSessionIds` | `List<Guid>` |
| `AggregateState` | `IntentionState` |
| `CreatedUtc` | `DateTime` |

**Example**

```js
const { isError, message, result } = await web7.collectiveConsciousness.getAggregateField({
    spaceId: '<spaceId>'
  });
if (isError) throw new Error(message);
console.log(result);
```

Example response:

```json
{
  "isError": false,
  "message": "",
  "result": { "Id": "3fa85f64-5717-4562-b3fc-2c963f66afa6", "Name": "example string", "ParticipantSessionIds": ["3fa85f64-5717-4562-b3fc-2c963f66afa6"], "AggregateState": { "Focus": 1.0, "EmotionalValence": 1.0, "Arousal": 1.0, "CognitiveLoad": 1.0, "Features": { "<string>": 1.0 }, "ComputedUtc": "2026-01-01T00:00:00Z" }, "CreatedUtc": "2026-01-01T00:00:00Z" }
}
```

---

### `joinSpace`

**POST** `v1/collective-consciousness/spaces/{spaceId}/join/{sessionId}`

Route parameters:

| Field | Type |
| --- | --- |
| `spaceId` | `Guid` |
| `sessionId` | `Guid` |

**Request**

No request body.

**Response**

Standard `OASISResult` envelope (see top of this page) with:

`result` type: `bool`

**Example**

```js
const { isError, message, result } = await web7.collectiveConsciousness.joinSpace({
    spaceId: '<spaceId>',
    sessionId: '<sessionId>'
  });
if (isError) throw new Error(message);
console.log(result);
```

Example response:

```json
{
  "isError": false,
  "message": "",
  "result": true
}
```

