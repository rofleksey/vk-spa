export async function getImagePixels(url: string): Promise<Uint8ClampedArray> {
  const image = new Image();
  image.crossOrigin = "Anonymous";
  image.src = url;
  return new Promise((res, rej) => {
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        rej(new Error("Failed to create canvas"));
        return;
      }
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(
        image,
        0,
        0,
        image.width,
        image.height,
        0,
        0,
        image.width,
        image.height
      );

      try {
        res(ctx.getImageData(0, 0, image.width, image.height).data);
      } catch (e) {
        rej(e);
      }
    };
    image.onerror = rej;
    image.onabort = rej;
  });
}
