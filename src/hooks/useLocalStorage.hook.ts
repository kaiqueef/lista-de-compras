function isBrowser(): boolean {
  return (
    typeof window !== "undefined" && typeof window.document !== "undefined"
  );
}

export function useLocalStorage() {
  const get = (key: string) => {
    if (!isBrowser()) return;
    const item = window.localStorage.getItem(key);
    if (!item) return;
    return JSON.parse(item);
  };
  const set = (key: string, value: any) => {
    if (!isBrowser()) return;
    window.localStorage.setItem(key, JSON.stringify(value));
  };
  const remove = (key: string) => {
    if (!isBrowser()) return;
    window.localStorage.removeItem(key);
  };

  return {
    get,
    set,
    remove,
  };
}
