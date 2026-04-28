const storage = {};
const AsyncStorage = {
  getItem: (key) => Promise.resolve(storage[key] ?? null),
  setItem: (key, value) => { storage[key] = value; return Promise.resolve(); },
  removeItem: (key) => { delete storage[key]; return Promise.resolve(); },
  clear: () => { Object.keys(storage).forEach((k) => delete storage[k]); return Promise.resolve(); },
};
module.exports = { default: AsyncStorage, ...AsyncStorage };
