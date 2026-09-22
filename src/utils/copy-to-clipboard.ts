const copyToClipboard = (data: string) => {
  navigator.clipboard.writeText(data);
};

const copyImageToClipboard = async (blob: Blob): Promise<boolean> => {
  try {
    if (!navigator.clipboard || typeof ClipboardItem === "undefined") return false;
    await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
    return true;
  } catch {
    return false;
  }
};

export { copyToClipboard, copyImageToClipboard };
