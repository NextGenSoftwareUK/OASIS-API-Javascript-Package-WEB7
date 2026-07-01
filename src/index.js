'use strict';

const { HttpClient, DEFAULT_BASE_URL } = require('./core/httpClient');
const { TokenStore } = require('./core/tokenStore');
const { attachGeneratedModules } = require('./modules/index');

/**
 * Main SDK entry point. Works in Node 18+ and any modern browser.
 *
 *   const { Web7Client } = require('@oasisomniverse/web7-api');
 *   const web7 = new Web7Client({ baseUrl: 'https://api.web7.oasisomniverse.one' });
 *   web7.setToken(jwtToken); // reuse a WEB4 OASIS JWT - WEB7 has no auth of its own
 *   const session = await web7.symbiosis.startSession({ avatarId, consentGranted: true });
 *
 * Every controller on the WEB7 Symbiosis WebAPI is reachable as a lowerCamel
 * property (web7.symbiosis, web7.collectiveConsciousness). Generated methods
 * take a single args object; route template tokens (e.g. {sessionId}) are
 * consumed from it automatically, remaining keys become the query string
 * (GET/DELETE) or JSON body (POST/PUT).
 */
class Web7Client {
  constructor({ baseUrl = DEFAULT_BASE_URL, persistSession, fetchImpl } = {}) {
    this.tokenStore = new TokenStore({ persist: persistSession });
    this.http = new HttpClient({ baseUrl, tokenStore: this.tokenStore, fetchImpl });

    attachGeneratedModules(this, this.http);
  }

  setBaseUrl(baseUrl) {
    this.http.setBaseUrl(baseUrl);
  }

  /**
   * WEB7 is an internal bio-symbiosis layer sitting behind the same OASIS
   * identity as WEB4/WEB5/WEB6 - it has no avatar/auth endpoints of its own.
   * Reuse a JWT you already obtained from the WEB4 OASIS API (or your own
   * backend) here.
   */
  setToken(jwtToken, sessionExtras = {}) {
    this.tokenStore.setSession({ ...sessionExtras, jwtToken });
  }
}

module.exports = { Web7Client, HttpClient, TokenStore, DEFAULT_BASE_URL };
module.exports.default = Web7Client;
