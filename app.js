const path = require('path')
'use strict';

class AppBootHook {
  constructor (app) {
    this.app = app
  }
  async willReady () {
    // load auth service
    let opt = {
      call: true,
      caseStyle: 'lower',
      fieldClass: 'authClasses',
      override: true, // 允许应用层覆盖插件的auth
      directory: this.app.loader.getLoadUnits().map(unit => path.join(unit.path, 'app/auth')),
    }
    this.app.loader.loadToContext(opt.directory, 'auth', opt)
  }
}

module.exports = AppBootHook