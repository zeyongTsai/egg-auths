'use strict';

const mock = require('egg-mock');

describe('test/auths.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/auths-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, auths')
      .expect(200);
  });
});
