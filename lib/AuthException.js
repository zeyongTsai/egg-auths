/*
 * @Author: caizeyong
 * @Date: 2020-12-02 13:30:52
 * @Description: common exception
 */
/**
 * token 无效异常
 * @class
 * @classdesc implements Error
 * @param {string} message 错误信息
 */
function TokenInvalidException(message) {
  /**
   * 异常名称，用于 catch 后根据异常名称来处理对应逻辑
   * @member TokenInvalidException#name
   * @type {string}
   * @default 'TokenInvalidException'
   */
  this.name = 'TokenInvalidException';
  /**
   * 异常信息
   * @member TokenInvalidException#message
   * @type {string}
   */
  this.message = message || 'token is not an instance of AuthenticationToken';
  this.stack = (new Error()).stack;
}
TokenInvalidException.prototype = Object.create(Error.prototype);
TokenInvalidException.prototype.constructor = TokenInvalidException;

/**
 * realm 无效异常
 * @class
 * @classdesc implements Error
 * @param {string} message 错误信息
 */
function RealmInvalidException(message) {
  /**
   * 异常名称，用于 catch 后根据异常名称来处理对应逻辑
   * @member RealmInvalidException#name
   * @type {string}
   * @default 'RealmInvalidException'
   */
  this.name = 'RealmInvalidException';
  /**
   * 异常信息
   * @member RealmInvalidException#message
   * @type {string}
   */
  this.message = message || 'realm is not an instance of Realm';
  this.stack = (new Error()).stack;
}
RealmInvalidException.prototype = Object.create(Error.prototype);
RealmInvalidException.prototype.constructor = RealmInvalidException;

/**
 * storage 无效异常
 * @class
 * @classdesc implements Error
 * @param {string} message 错误信息
 */
function StorageInvalidException(message) {
  /**
   * 异常名称，用于 catch 后根据异常名称来处理对应逻辑
   * @member StorageInvalidException#name
   * @type {string}
   * @default 'StorageInvalidException'
   */
  this.name = 'StorageInvalidException';
  /**
   * 异常信息
   * @member StorageInvalidException#message
   * @type {string}
   */
  this.message = message || 'storage is not an instance of Storage';
  this.stack = (new Error()).stack;
}
StorageInvalidException.prototype = Object.create(Error.prototype);
StorageInvalidException.prototype.constructor = StorageInvalidException;

/**
 * SessionManager 无效异常
 * @class
 * @classdesc implements Error
 * @param {string} message 错误信息
 */
function SessionManagerInvalidException(message) {
  /**
   * 异常名称，用于 catch 后根据异常名称来处理对应逻辑
   * @member SessionManagerInvalidException#name
   * @type {string}
   * @default 'SessionManagerInvalidException'
   */
  this.name = 'SessionManagerInvalidException';
  /**
   * 异常信息
   * @member SessionManagerInvalidException#message
   * @type {string}
   */
  this.message = message || 'session manager is not an instance of SessionManager';
  this.stack = (new Error()).stack;
}
SessionManagerInvalidException.prototype = Object.create(Error.prototype);
SessionManagerInvalidException.prototype.constructor = SessionManagerInvalidException;


/**
 * 方法未实现异常
 * @class
 * @classdesc implements Error
 * @param {string} message 错误信息
 */
function NotImplementException(message) {
  /**
   * 异常名称，用于 catch 后根据异常名称来处理对应逻辑
   * @member NotImplementException#name
   * @type {string}
   * @default 'NotImplementException'
   */
  this.name = 'NotImplementException';
  /**
   * 异常信息
   * @member NotImplementException#message
   * @type {string}
   */
  this.message = message || 'method is not implement';
  this.stack = (new Error()).stack;
}
NotImplementException.prototype = Object.create(Error.prototype);
NotImplementException.prototype.constructor = NotImplementException;

/**
 * 认证异常
 * @class
 * @classdesc implements Error
 * @param {string} message 错误信息
 */
function AuthenticationException(message) {
  /**
   * 异常名称，用于 catch 后根据异常名称来处理对应逻辑
   * @member AuthenticationException#name
   * @type {string}
   * @default 'AuthenticationException'
   */
  this.name = 'AuthenticationException';
  /**
   * 异常信息
   * @member AuthenticationException#message
   * @type {string}
   */
  this.message = message || 'incorrect account or password';
  this.stack = (new Error()).stack;
}
AuthenticationException.prototype = Object.create(Error.prototype);
AuthenticationException.prototype.constructor = AuthenticationException;

/**
 * 不支持的 Token 类型异常
 * @class
 * @classdesc implements Error
 * @param {string} message 错误信息
 */
function UnsupportedTokenException(message) {
  /**
   * 异常名称，用于 catch 后根据异常名称来处理对应逻辑
   * @member UnsupportedTokenException#name
   * @type {string}
   * @default 'UnsupportedTokenException'
   */
  this.name = 'UnsupportedTokenException';
  /**
   * 异常信息
   * @member UnsupportedTokenException#message
   * @type {string}
   */
  this.message = message || 'no realms support this token';
  this.stack = (new Error()).stack;
}
UnsupportedTokenException.prototype = Object.create(Error.prototype);
UnsupportedTokenException.prototype.constructor = UnsupportedTokenException;

/**
 * 公共异常模块
 * @module AuthException
 */
module.exports = {
  /**
   * TokenInvalidException
   * @type {TokenInvalidException}
   */
  TokenInvalidException,
  /**
   * RealmInvalidException
   * @type {RealmInvalidException}
   */
  RealmInvalidException,
  /**
   * StorageInvalidException
   * @type {StorageInvalidException}
   */
  StorageInvalidException,
  /**
   * SessionManagerInvalidException
   * @type {SessionManagerInvalidException}
   */
  SessionManagerInvalidException,
  /**
   * NotImplementException
   * @type {NotImplementException}
   */
  NotImplementException,
  /**
   * AuthenticationException
   * @type {AuthenticationException}
   */
  AuthenticationException,
  /**
   * UnsupportedTokenException
   * @type {UnsupportedTokenException}
   */
  UnsupportedTokenException
}
