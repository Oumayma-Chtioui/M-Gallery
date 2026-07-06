import imageCompression from "browser-image-compression";

// Wraps browser-image-compression. Called right after a file is selected
// in the admin product form, before it's uploaded to Storage, so storage
// usage stays predictable regardless of source photo size.
export async function compressImageFile(file, overrides = {}) {
  const options = {
    maxSizeMB: 0.2,
    maxWidthOrHeight: 1600,
    useWebWorker: true,
    ...overrides,
  };

  try {
    return await imageCompression(file, options);
  } catch (err) {
    // Never block the admin on a compression failure.
    console.error("Image compression failed, using original file:", err);
    return file;
  }
}
