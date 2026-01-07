export const checkImageQuality = (imageURL) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = imageURL;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const { data } = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );

      // 1️⃣ Resolution check
      if (img.width < 224 || img.height < 224) {
        resolve({
          ok: false,
          message: "Image resolution too low. Move closer to the leaf.",
        });
        return;
      }

      // 2️⃣ Brightness check
      let brightness = 0;
      for (let i = 0; i < data.length; i += 4) {
        brightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
      }
      brightness /= data.length / 4;

      if (brightness < 60) {
        resolve({
          ok: false,
          message: "Image is too dark. Capture in better lighting.",
        });
        return;
      }

      resolve({ ok: true });
    };
  });
};
