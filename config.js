'use strict';

exports.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || '';
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/nousfood';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-nousfood';
exports.PORT = process.env.PORT || 8080;

exports.JWT_SECRET = process.env.JWT_SECRET || 'badatheetathaytheeban12345';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';