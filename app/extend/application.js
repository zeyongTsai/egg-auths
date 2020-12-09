/*
 * @Author: caizeyong
 * @Date: 2020-12-08 15:47:12
 * @Description: 
 */
'use strict';
const Realm = require('../../lib/Realm')
const Storage = require('../../lib/Storage')
const AuthenticationToken = require('../../lib/AuthenticationToken')
const { StorageInvalidException } = require('../../lib/AuthException')
const REALMS = Symbol('Application#Realms')
const TOKENS = Symbol('Application#Tokens')
const STORAGE = Symbol('Application#Storage')

module.exports = {
  get realms () {
    if (!this[REALMS]) {
      let realms = [...this.config.auths.realms]
      realms = realms.filter(realm => {
        return Object.getPrototypeOf(realm) === Realm || realm === Realm
      })
      this[REALMS] = realms
    }
    return this[REALMS]
  },
  get authTokens () {
    if (!this[TOKENS]) {
      let tokens = [...this.config.auths.tokens]
      tokens = tokens.filter(token => {
        return Object.getPrototypeOf(token) === AuthenticationToken || token === AuthenticationToken
      })
      this[TOKENS] = tokens
    }
    return this[TOKENS]
  },
  get storage () {
    if (!this[STORAGE]) {
      let storage = this.config.auths.storage
      if (Object.getPrototypeOf(storage) !== Storage && storage !== Storage) {
        throw new StorageInvalidException()
      }
      this[STORAGE] = new storage(this)
    }
    return this[STORAGE]
  }
}