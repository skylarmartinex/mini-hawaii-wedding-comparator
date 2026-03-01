import type { PersistenceAdapter } from "../persistence";

let _adapter: PersistenceAdapter | null = null;

export function setPersistenceAdapter(adapter: PersistenceAdapter): void {
  _adapter = adapter;
}

export function getAdapter(): PersistenceAdapter {
  if (!_adapter) {
    throw new Error(
      "PersistenceAdapter not initialized. Call setPersistenceAdapter() before using stores."
    );
  }
  return _adapter;
}
