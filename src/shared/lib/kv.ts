import * as SecureStore from "expo-secure-store";

export const kv = {
  getString(key: string) {
    return SecureStore.getItemAsync(key);
  },
  set(key: string, value: string) {
    return SecureStore.setItemAsync(key, value);
  },
  delete(key: string) {
    return SecureStore.deleteItemAsync(key);
  },
};
