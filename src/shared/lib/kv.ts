import { Directory, File, Paths } from "expo-file-system";

const kvDirectory = new Directory(Paths.document, "kv-store");

function ensureKvDirectory() {
  if (!kvDirectory.exists) {
    kvDirectory.create({ intermediates: true });
  }
}

function fileForKey(key: string) {
  const safeKey = encodeURIComponent(key);
  return new File(kvDirectory, `${safeKey}.txt`);
}

export const kv = {
  async getString(key: string): Promise<string | null> {
    ensureKvDirectory();
    const file = fileForKey(key);
    if (!file.exists) return null;
    return file.text();
  },

  async set(key: string, value: string): Promise<void> {
    ensureKvDirectory();
    const file = fileForKey(key);
    file.write(value);
  },

  async delete(key: string): Promise<void> {
    ensureKvDirectory();
    const file = fileForKey(key);
    if (!file.exists) return;
    file.delete();
  },
};
