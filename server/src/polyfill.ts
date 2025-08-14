// Polyfill dla globalnego `crypto` (Node < 19)
// Używany przez @nestjs/typeorm (crypto.randomUUID()).
;(global as any).crypto = require('crypto');
