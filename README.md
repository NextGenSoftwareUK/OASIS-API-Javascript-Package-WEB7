# @oasisomniverse/web7-api

Isomorphic (Node 18+ and browser) JavaScript/TypeScript-friendly client for the
**WEB7 OASIS Symbiosis API** - consenting bio-signal symbiosis sessions and
shared collective-consciousness fields built on the OASIS WEB7 WebAPI.

Zero dependencies. Wraps the global `fetch`. Works the same in Node and the
browser.

## About WEB7

> **"The conscious symbiosis layer — where human intuition and machine intelligence merge as one living system."**

WEB7 bridges human consciousness and machine intelligence through bio-resonant signals (brainwaves, heart rate and other natural body signals), rather than the invasive neural implants other visions of human-AI merging rely on - it's non-invasive, reversible and amplifies human thought instead of replacing it. "Borg-free by design."

WEB7 builds on **[WEB4](https://www.npmjs.com/package/@oasisomniverse/web4-api)** through **[WEB6](https://www.npmjs.com/package/@oasisomniverse/web6-api)**, and is one layer of the wider **[OASIS Omniverse](https://oasisomniverse.one)** (WEB4 through WEB10).

## About The OASIS Omniverse

The OASIS (Open Advanced Sensory Immersion System) is the universal interoperability layer connecting all of WEB2 and WEB3 — every blockchain, database, cloud provider and protocol — into one unified, fault-tolerant API. Rather than picking a single tech stack, the OASIS harnesses the best of every provider (auto-failover, auto-load-balancing, auto-replication) so nothing is ever a single point of failure, and hides the complexity behind one intuitive API so you never need to learn a new stack again — even as underlying tech evolves, your app keeps working with zero changes.

At its core sits one Avatar with one SSO login and one Karma reputation score that travels with you across every app, game and world built on top of it — full transparency and full control over your own data, right down to the field level.

This is the foundation of the OASIS Omniverse: a network of unified layers, WEB4 (identity & unification) through WEB10 (source), each building on the one below to connect blockchains, metaverses, AI, human consciousness and beyond into a single interoperable whole.

👉 See the full ecosystem at **[oasisomniverse.one](https://oasisomniverse.one)**.

## Installation

```bash
npm install @oasisomniverse/web7-api
```

## Quick start

```js
const { Web7Client } = require('@oasisomniverse/web7-api');
// or: import { Web7Client } from '@oasisomniverse/web7-api';

const web7 = new Web7Client({ baseUrl: 'https://api.web7.oasisomniverse.one' });

const { isError, message, result } = await web7.symbiosis.startSession({ consentGranted: true });
if (isError) throw new Error(message);
console.log(result);
```

## Calling any endpoint

Every controller on the OASIS WEB7 WebAPI is reachable as a lowerCamel
property on the client (`web7.symbiosis`, `web7.collectiveConsciousness`).
Every generated method takes a single args object:

- Any key matching a `{token}` in the route template is consumed and
  substituted into the URL (case-insensitive match).
- Any remaining keys become the query string (GET/DELETE) or JSON body
  (POST/PUT) - **matching the real `[FromQuery]`/`[FromBody]` binding of the
  underlying C# action**, not just the HTTP verb. `endpoints.json` records
  exactly which arg names are query-bound per operation (see
  [`docs/`](./docs/README.md) for the per-method breakdown).

```js
// GET v1/symbiosis/sessions/{sessionId} -> sessionId consumed as a route token
const session = await web7.symbiosis.getSession({ sessionId });

// POST v1/symbiosis/sessions/{sessionId}/signals -> sessionId consumed, samples becomes the body
await web7.symbiosis.submitSignals({ sessionId, samples: [{ type: 'HeartRate', value: 72 }] });

// POST v1/symbiosis/sessions -> consentGranted/retention are [FromQuery] even
// though this is a POST, so they're sent on the URL, not as a JSON body
const session2 = await web7.symbiosis.startSession({ consentGranted: true, retention: 'Ephemeral' });
```

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
