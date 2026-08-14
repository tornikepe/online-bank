/**
 * Test environment setup.
 *
 * Several services read the signed-in user's id straight from localStorage. The
 * test environment does not always expose one (jsdom withholds it for documents
 * on an opaque origin), which made those components throw before reaching their
 * assertions. Provide a simple in-memory stand-in when it is missing.
 */
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map<string, string>();

  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: unknown) => {
        store.set(key, String(value));
      },
      removeItem: (key: string) => {
        store.delete(key);
      },
      clear: () => {
        store.clear();
      },
      key: (index: number) => Array.from(store.keys())[index] ?? null,
      get length() {
        return store.size;
      },
    },
  });
}
