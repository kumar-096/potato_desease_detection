export const autoCropLeaf = (imageURL) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = imageURL;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const { data, width, height } = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );

      let minX = width,
        minY = height,
        maxX = 0,
        maxY = 0;

      // Detect green-ish pixels
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        if (g > r + 20 && g > b + 20) {
          const pixelIndex = i / 4;
          const x = pixelIndex % width;
          const y = Math.floor(pixelIndex / width);

          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }

      // Fallback if no leaf detected
      if (minX >= maxX || minY >= maxY) {
        resolve(imageURL);
        return;
      }

      const cropWidth = maxX - minX;
      const cropHeight = maxY - minY;

      const cropCanvas = document.createElement("canvas");
      cropCanvas.width = cropWidth;
      cropCanvas.height = cropHeight;

      const cropCtx = cropCanvas.getContext("2d");
      cropCtx.drawImage(
        canvas,
        minX,
        minY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );

      resolve(cropCanvas.toDataURL("image/jpeg"));
    };
  });
};
