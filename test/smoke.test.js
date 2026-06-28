'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { Web7Client } = require('../index.js');

function fakeFetch(responses) {
  const calls = [];
  const impl = async (url, init) => {
    calls.push({ url, init });
    const match = responses.find((r) => url.includes(r.match));
    const body = match ? match.body : { isError: false, result: {} };
    return {
      ok: match ? match.ok !== false : true,
      status: match?.status || 200,
      text: async () => JSON.stringify(body)
    };
  };
  impl.calls = calls;
  return impl;
}

test('setToken attaches Bearer header to subsequent requests', async () => {
  const fetchImpl = fakeFetch([{ match: 'v1/symbiosis/sessions', body: { isError: false, result: { id: 's1' } } }]);
  const web7 = new Web7Client({ baseUrl: 'https://example.test', persistSession: false, fetchImpl });

  web7.setToken('jwt-abc');
  await web7.symbiosis.startSession({ consentGranted: true });

  const call = fetchImpl.calls[0];
  assert.equal(call.init.headers.Authorization, 'Bearer jwt-abc');
  assert.equal(call.url, 'https://example.test/v1/symbiosis/sessions?consentGranted=true');
  assert.equal(call.init.method, 'POST');
});

test('StartSession is a POST but binds consentGranted/retention from the query string, not the body', async () => {
  const fetchImpl = fakeFetch([{ match: 'v1/symbiosis/sessions', body: { isError: false, result: { id: 's1' } } }]);
  const web7 = new Web7Client({ baseUrl: 'https://example.test', persistSession: false, fetchImpl });

  await web7.symbiosis.startSession({ consentGranted: true, retention: 'Ephemeral' });

  const call = fetchImpl.calls[0];
  assert.equal(call.init.method, 'POST');
  assert.equal(call.init.body, undefined);
  assert.match(call.url, /^https:\/\/example\.test\/v1\/symbiosis\/sessions\?/);
  assert.match(call.url, /consentGranted=true/);
  assert.match(call.url, /retention=Ephemeral/);
});

test('route tokens are consumed from the URL, remaining args become the body', async () => {
  const fetchImpl = fakeFetch([{ match: 'v1/symbiosis/sessions/sess-1/signals', body: { isError: false, result: {} } }]);
  const web7 = new Web7Client({ baseUrl: 'https://example.test', persistSession: false, fetchImpl });

  await web7.symbiosis.submitSignals({ sessionId: 'sess-1', samples: [{ type: 'HeartRate', value: 72 }] });

  const call = fetchImpl.calls[0];
  assert.equal(call.url, 'https://example.test/v1/symbiosis/sessions/sess-1/signals');
  const body = JSON.parse(call.init.body);
  assert.deepEqual(body, { samples: [{ type: 'HeartRate', value: 72 }] });
});

test('GET requests send remaining args as query string', async () => {
  const fetchImpl = fakeFetch([{ match: 'v1/collective-consciousness/spaces/space-1/field', body: { isError: false, result: {} } }]);
  const web7 = new Web7Client({ baseUrl: 'https://example.test', persistSession: false, fetchImpl });

  await web7.collectiveConsciousness.getAggregateField({ spaceId: 'space-1' });

  const call = fetchImpl.calls[0];
  assert.equal(call.url, 'https://example.test/v1/collective-consciousness/spaces/space-1/field');
  assert.equal(call.init.method, 'GET');
});

test('missing required route param throws a clear error', async () => {
  const web7 = new Web7Client({ baseUrl: 'https://example.test', persistSession: false, fetchImpl: fakeFetch([]) });
  await assert.rejects(() => web7.symbiosis.getSession({}), /Missing required route parameter "sessionId"/);
});

test('both generated modules are attached to the client', () => {
  const web7 = new Web7Client({ baseUrl: 'https://example.test', persistSession: false, fetchImpl: fakeFetch([]) });
  for (const name of ['symbiosis', 'collectiveConsciousness']) {
    assert.ok(web7[name], `expected web7.${name} to be attached`);
  }
});
