/**
 * Compression Middleware
 * Compresses HTTP responses to improve performance
 */

// Simple compression middleware for static HTML sites
// For more complex applications, consider using a library like 'compression'
function compressionMiddleware(req, res, next) {
  // Check if client accepts gzip encoding
  const acceptEncoding = req.headers['accept-encoding'] || '';
  const supportsGzip = acceptEncoding.includes('gzip');
  
  // Store the original response methods
  const originalWrite = res.write;
  const originalEnd = res.end;
  
  // If client doesn't support compression, skip compression
  if (!supportsGzip) {
    return next();
  }
  
  // Set gzip headers
  res.setHeader('Content-Encoding', 'gzip');
  res.setHeader('Vary', 'Accept-Encoding');
  
  // Import zlib only when needed (lazy loading)
  const zlib = require('zlib');
  const gzip = zlib.createGzip();
  
  // Pipe the response through gzip
  let gzipBuffer = Buffer.from([]);
  gzip.on('data', (chunk) => {
    gzipBuffer = Buffer.concat([gzipBuffer, chunk]);
  });
  
  // Override response methods to compress data
  res.write = function(chunk, encoding) {
    if (chunk) {
      gzip.write(chunk, encoding);
    }
    return true;
  };
  
  res.end = function(chunk, encoding) {
    if (chunk) {
      gzip.write(chunk, encoding);
    }
    gzip.end();
    
    // Once gzip has finished, send the compressed response
    gzip.on('end', () => {
      res.setHeader('Content-Length', gzipBuffer.length);
      originalEnd.call(res, gzipBuffer);
    });
  };
  
  next();
}

module.exports = compressionMiddleware; 