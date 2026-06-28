# web7-oasis-symbiosis-api

Isomorphic (Node 18+ and browser) JavaScript/TypeScript-friendly client for the
**WEB7 OASIS Symbiosis API** - consenting bio-signal symbiosis sessions and
shared collective-consciousness fields built on the OASIS2 WEB7 WebAPI.

Zero dependencies. Wraps the global `fetch`. Works the same in Node and the
browser.

## Installation

```bash
npm install web7-oasis-symbiosis-api
```

## Quick start

```js
const { Web7Client } = require('web7-oasis-symbiosis-api');
// or: import { Web7Client } from 'web7-oasis-symbiosis-api';

const web7 = new Web7Client({ baseUrl: 'https://api.web7.oasisomniverse.one' });

const { isError, message, result } = await web7.symbiosis.startSession({ consentGranted: true });
if (isError) throw new Error(message);
console.log(result);
```

## Calling any endpoint

Every controller on the OASIS2 WEB7 WebAPI is reachable as a lowerCamel
property on the client (`web7.symbiosis`, `web7.collectiveConsciousness`).
Every generated method takes a single args object:

- Any key matching a `{token}` in the route template is consumed and
  substituted into the URL (case-insensitive match).
- Any remaining keys become the query string (GET/DELETE) or JSON body
  (POST/PUT).

```js
// GET v1/symbiosis/sessions/{sessionId} -> sessionId consumed as a route token
const session = await web7.symbiosis.getSession({ sessionId });

// POST v1/symbiosis/sessions/{sessionId}/signals -> sessionId consumed, samples becomes the body
await web7.symbiosis.submitSignals({ sessionId, samples: [{ type: 'HeartRate', value: 72 }] });
```

> **Note:** the underlying C# `StartSession` action reads `consentGranted`
> and `retention` from the query string even though the route is `POST`.
> Most servers also accept them as a JSON body via standard ASP.NET model
> binding, but if you hit a binding mismatch on that one endpoint, pass them
> as query params on the URL yourself instead of relying on the generated
> wrapper's body-based POST behaviour.

Every response has the shape:

```ts
interface OASISResponse<T = any> {
  isError: boolean;
  message: string | null;
  result: T;
  raw: any;
  statusCode: number;
}
```

## Auth

WEB7 is an internal bio-symbiosis layer that sits behind the same OASIS
avatar identity as WEB4/WEB5/WEB6 - it has no avatar/login endpoints of its
own. Reuse a JWT you've already obtained elsewhere (e.g. from
`web4-oasis-api`'s `client.auth.login()`):

```js
web7.setToken(jwtToken);
```

## Module examples

### Symbiosis (`web7.symbiosis`)

```js
const session = await web7.symbiosis.startSession({ consentGranted: true, retention: 'Ephemeral' });
const intentionState = await web7.symbiosis.submitSignals({
  sessionId: session.result.id,
  samples: [{ type: 'HeartRate', value: 72, timestamp: new Date().toISOString() }]
});
await web7.symbiosis.endSession({ sessionId: session.result.id });
```

### Collective Consciousness (`web7.collectiveConsciousness`)

```js
const space = await web7.collectiveConsciousness.createSpace({ name: 'Morning Meditation' });
await web7.collectiveConsciousness.joinSpace({ spaceId: space.result.id, sessionId: session.result.id });
const field = await web7.collectiveConsciousness.getAggregateField({ spaceId: space.result.id });
```

## Module reference

2 modules, 7 operations in total. Full per-method tables live in
[`docs/`](./docs/README.md).

| Client property | Route prefix | Operations |
| --- | --- | --- |
| `web7.collectiveConsciousness` | `v1/collective-consciousness` | 3 |
| `web7.symbiosis` | `v1/symbiosis` | 4 |

See [`docs/README.md`](./docs/README.md) for the full generated reference,
or [`docs/modules/`](./docs/modules) for per-module method tables with
parameter and route details.

## Regenerating

The generated modules, type declarations and docs are produced from
`endpoints.json` (extracted from the WEB7 WebAPI controller source):

```bash
npm run generate   # src/modules/*.js + src/modules/index.js
npm run types      # src/modules/*.d.ts + index.d.ts + src/core/types.d.ts
npm run docs       # docs/README.md + docs/modules/*.md
```

## Testing

```bash
npm test
```

## License

MIT
