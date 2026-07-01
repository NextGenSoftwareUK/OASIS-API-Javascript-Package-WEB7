# Symbiosis — `web7.symbiosis`

Source controller: [`SymbiosisController.cs`](https://github.com/NextGenSoftwareUK/OASIS/blob/main/WEB7/NextGenSoftware.OASIS.Web7.WebAPI/Controllers/SymbiosisController.cs)
Route prefix: `v1/symbiosis`
4 operation(s).

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

### `endSession`

Ends the session instantly - with Ephemeral retention (the default), all signal-derived data is wiped immediately.

**POST** `v1/symbiosis/sessions/{sessionId}/end`

Route parameters:

| Field | Type |
| --- | --- |
| `sessionId` | `Guid` |

**Request**

No request body.

**Response**

Standard `OASISResult` envelope (see top of this page) with:

`result` type: `bool`

**Example**

```js
const { isError, message, result } = await web7.symbiosis.endSession({
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

---

### `getSession`

**GET** `v1/symbiosis/sessions/{sessionId}`

Route parameters:

| Field | Type |
| --- | --- |
| `sessionId` | `Guid` |

**Request**

No request body.

**Response**

Standard `OASISResult` envelope (see top of this page) with:

`result` type: `SymbiosisSession`

| Field | Type |
| --- | --- |
| `Id` | `Guid` |
| `AvatarId` | `Guid` |
| `ConsentGranted` | `bool` |
| `IsActive` | `bool` |
| `Retention` | `Enums.RetentionMode` |
| `StartedUtc` | `DateTime` |
| `EndedUtc` | `DateTime?` |
| `LastIntentionState` | `IntentionState` |
| `AuditLog` | `List<string>` |

**Example**

```js
const { isError, message, result } = await web7.symbiosis.getSession({
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
  "result": { "Id": "3fa85f64-5717-4562-b3fc-2c963f66afa6", "AvatarId": "3fa85f64-5717-4562-b3fc-2c963f66afa6", "ConsentGranted": true, "IsActive": true, "Retention": /* <Enums.RetentionMode> */, "StartedUtc": "2026-01-01T00:00:00Z", "EndedUtc": "2026-01-01T00:00:00Z", "LastIntentionState": { "Focus": 1.0, "EmotionalValence": 1.0, "Arousal": 1.0, "CognitiveLoad": 1.0, "Features": { "<string>": 1.0 }, "ComputedUtc": "2026-01-01T00:00:00Z" }, "AuditLog": ["example string"] }
}
```

---

### `startSession`

Starts a new symbiosis session. ConsentGranted must be explicitly true.

**POST** `v1/symbiosis/sessions`

**Request**

Body fields:

| Field | Type |
| --- | --- |
| `consentGranted` | `bool` |
| `retention` | `RetentionMode (optional)` |

**Response**

Standard `OASISResult` envelope (see top of this page) with:

`result` type: `SymbiosisSession`

| Field | Type |
| --- | --- |
| `Id` | `Guid` |
| `AvatarId` | `Guid` |
| `ConsentGranted` | `bool` |
| `IsActive` | `bool` |
| `Retention` | `Enums.RetentionMode` |
| `StartedUtc` | `DateTime` |
| `EndedUtc` | `DateTime?` |
| `LastIntentionState` | `IntentionState` |
| `AuditLog` | `List<string>` |

**Example**

```js
const { isError, message, result } = await web7.symbiosis.startSession({
    consentGranted: true,
    retention: '<retention>'
  });
if (isError) throw new Error(message);
console.log(result);
```

Example response:

```json
{
  "isError": false,
  "message": "",
  "result": { "Id": "3fa85f64-5717-4562-b3fc-2c963f66afa6", "AvatarId": "3fa85f64-5717-4562-b3fc-2c963f66afa6", "ConsentGranted": true, "IsActive": true, "Retention": /* <Enums.RetentionMode> */, "StartedUtc": "2026-01-01T00:00:00Z", "EndedUtc": "2026-01-01T00:00:00Z", "LastIntentionState": { "Focus": 1.0, "EmotionalValence": 1.0, "Arousal": 1.0, "CognitiveLoad": 1.0, "Features": { "<string>": 1.0 }, "ComputedUtc": "2026-01-01T00:00:00Z" }, "AuditLog": ["example string"] }
}
```

---

### `submitSignals`

Submits a batch of raw bio-signal samples and returns the freshly computed intention state.

**POST** `v1/symbiosis/sessions/{sessionId}/signals`

Route parameters:

| Field | Type |
| --- | --- |
| `sessionId` | `Guid` |

**Request**

Body type: `BioSignalSample` (array)

| Field | Type |
| --- | --- |
| `SignalType` | `BioSignalType` |
| `Channel` | `string` |
| `SampleRateHz` | `double` |
| `Values` | `List<double>` |
| `CapturedUtc` | `DateTime` |

**Response**

Standard `OASISResult` envelope (see top of this page) with:

`result` type: `IntentionState`

| Field | Type |
| --- | --- |
| `Focus` | `double` |
| `EmotionalValence` | `double` |
| `Arousal` | `double` |
| `CognitiveLoad` | `double` |
| `Features` | `Dictionary<string, double>` |
| `ComputedUtc` | `DateTime` |

**Example**

```js
const { isError, message, result } = await web7.symbiosis.submitSignals({
    sessionId: '<sessionId>',
    signalType: {  },
    channel: "example string",
    sampleRateHz: 1.0,
    values: [1.0],
    capturedUtc: "2026-01-01T00:00:00Z"
  });
if (isError) throw new Error(message);
console.log(result);
```

Example response:

```json
{
  "isError": false,
  "message": "",
  "result": { "Focus": 1.0, "EmotionalValence": 1.0, "Arousal": 1.0, "CognitiveLoad": 1.0, "Features": { "<string>": 1.0 }, "ComputedUtc": "2026-01-01T00:00:00Z" }
}
```

