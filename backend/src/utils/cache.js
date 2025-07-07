const cache = new Map();

// Generate a unique key based on the request's full URL
function generateKey(req) {
  return `${req.originalUrl}`;
}

// Set cache entry with timestamp
function setCache(key, data) {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
}

// Get valid cache entry (max age = 30 seconds)
function getCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;

  const age = Date.now() - entry.timestamp;
  if (age > 30_000) {
    cache.delete(key); // expire
    return null;
  }

  return entry.data;
}

//  Clear entire cache (e.g., after mutations)
function clearCache() {
  cache.clear();
}

module.exports = {
  generateKey,
  setCache,
  getCache,
  clearCache
};
