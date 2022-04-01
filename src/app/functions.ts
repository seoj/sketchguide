export function toImage(blob: Blob): Promise<HTMLImageElement> {
  return new Promise(resolve => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const image = new Image();
      image.onload = () => {
        resolve(image);
      };
      image.src = fileReader.result as string;
    };
    fileReader.readAsDataURL(blob);
  });
}

export function toAspectRatio(
  image: HTMLImageElement,
  aspectRatio: number
): Promise<HTMLImageElement> {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;

  const ctx = canvas.getContext('2d')!;

  const imageAspectRatio = image.width / image.height;
  if (imageAspectRatio < aspectRatio) {
    canvas.width = canvas.height * aspectRatio;
  } else {
    canvas.height = canvas.width / aspectRatio;
  }

  const offsetX = (canvas.width - image.width) / 2;
  const offsetY = (canvas.height - image.height) / 2;

  ctx.drawImage(image, offsetX, offsetY);

  const result = new Image();
  result.src = canvas.toDataURL();
  return new Promise(resolve => {
    result.onload = () => {
      resolve(result);
    };
  });
}
