'use strict';
const Realm = require('../lib/Realm')
const AuthenticationToken = require('../lib/AuthenticationToken')
const Storage = require('../lib/Storage')
const SessionManager = require('../lib/SessionManager')
/**
 * egg-auths default config
 * @member Config#auths
 * @property {String} SOME_KEY - some description
 */
exports.auths = {
  realms: [Realm],
  tokens: [AuthenticationToken],
  storage: Storage,
  sessionManager: SessionManager
};
