import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { QRCodeSVG } from "qrcode.react";
import { copyImageToClipboard } from "@utils/copy-to-clipboard";
import { useDispatch } from "../../../redux/hooks";
import { ModalRoot, useModalClose } from "../layout";
import { NModals } from "../modals";
import { closeModal } from "../../../redux/slices/modals";

export const name = "ModalQr";

const QR_SIZE = 220;
const QR_MARGIN = 24;
const EXPORT_SCALE = 2;

const svgToPngBlob = (svg: SVGSVGElement): Promise<Blob | null> =>
  new Promise((resolve) => {
    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    const source = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      new XMLSerializer().serializeToString(clone),
    )}`;
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = (QR_SIZE + QR_MARGIN * 2) * EXPORT_SCALE;
      canvas.height = canvas.width;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(null);
        return;
      }
      // The SVG has no background of its own, so paint white first. The
      // margin keeps the QR quiet zone intact when shared on its own.
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const offset = QR_MARGIN * EXPORT_SCALE;
      const size = QR_SIZE * EXPORT_SCALE;
      ctx.drawImage(image, offset, offset, size, size);
      canvas.toBlob((blob) => resolve(blob), "image/png");
    };
    image.onerror = () => resolve(null);
    image.src = source;
  });

type SaveResult = "saved" | "downloaded" | "cancelled" | "failed";

type FileSystemWritable = {
  write: (data: Blob) => Promise<void>;
  close: () => Promise<void>;
};

type FileSystemHandle = { createWritable: () => Promise<FileSystemWritable> };

type SaveFilePicker = (options?: {
  suggestedName?: string;
  types?: { description?: string; accept: Record<string, string[]> }[];
}) => Promise<FileSystemHandle>;

const downloadBlob = (blob: Blob, filename: string) => {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
};

const savePng = async (
  makeBlob: () => Promise<Blob | null>,
  filename: string,
): Promise<SaveResult> => {
  const w = window as unknown as { showSaveFilePicker?: SaveFilePicker };

  // File System Access API (Chromium): opens the OS save dialog so the user
  // picks the location. Two constraints: it must keep window as its receiver
  // (a detached call throws Illegal invocation), and it must run before any
  // await, since generating the PNG can outlast the user activation it needs.
  if (typeof w.showSaveFilePicker === "function") {
    let handle: FileSystemHandle | null = null;
    try {
      handle = await w.showSaveFilePicker({
        suggestedName: filename,
        types: [{ description: "PNG image", accept: { "image/png": [".png"] } }],
      });
    } catch (err) {
      if ((err as DOMException)?.name === "AbortError") return "cancelled";
      handle = null; // unavailable here (e.g. inside an iframe) - fall back
    }
    if (handle) {
      const blob = await makeBlob();
      if (!blob) return "failed";
      try {
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return "saved";
      } catch {
        return "failed";
      }
    }
  }

  // Fallback (Firefox/Safari): goes straight to the browser's download folder.
  // No site can force a location dialog there; users can enable
  // "Ask where to save each file" in their browser settings.
  const blob = await makeBlob();
  if (!blob) return "failed";
  try {
    downloadBlob(blob, filename);
    return "downloaded";
  } catch {
    return "failed";
  }
};

interface IProps extends NModals.IDefaultProps {
  url?: string;
}

// Rendered as a child of ModalRoot: useModalClose reads a context that
// ModalRoot provides, so it only resolves inside the modal, never in the
// component that renders ModalRoot.
const QrContent = ({ url }: { url: string }) => {
  const close = useModalClose();
  const qrRef = useRef<HTMLDivElement>(null);
  const flashTimer = useRef<number>();
  const [flash, setFlash] = useState<{ target: "copy" | "save"; text: string } | null>(null);

  const canCopyImage =
    typeof navigator !== "undefined" &&
    !!navigator.clipboard &&
    typeof ClipboardItem !== "undefined";

  useEffect(() => () => window.clearTimeout(flashTimer.current), []);

  const flashOn = (target: "copy" | "save", text: string) => {
    window.clearTimeout(flashTimer.current);
    setFlash({ target, text });
    flashTimer.current = window.setTimeout(() => setFlash(null), 1500);
  };

  const getPng = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return Promise.resolve<Blob | null>(null);
    return svgToPngBlob(svg as SVGSVGElement);
  };

  const handleCopyImage = async () => {
    const blob = await getPng();
    if (!blob) {
      flashOn("copy", "Copy failed");
      return;
    }
    const ok = await copyImageToClipboard(blob);
    flashOn("copy", ok ? "Copied!" : "Copy failed");
  };

  const handleSave = async () => {
    const result = await savePng(getPng, "vtx-plan-qr.png");
    if (result === "saved") flashOn("save", "Saved!");
    else if (result === "downloaded") flashOn("save", "Downloaded");
    else if (result === "failed") flashOn("save", "Save failed");
  };

  return (
    <QrModalStyle>
      <p className="hint">Scan to open this frequency plan on another device</p>
      <div className="qr" ref={qrRef}>
        <QRCodeSVG value={url} size={QR_SIZE} />
      </div>
      <p className="url">{url}</p>
      <div className="actions">
        <button
          type="button"
          className="action-button"
          onClick={handleCopyImage}
          disabled={!canCopyImage}
          title={canCopyImage ? "Copy the QR code as an image" : "Image clipboard not supported"}
        >
          {flash?.target === "copy" ? flash.text : "Copy image"}
        </button>
        <button type="button" className="action-button" onClick={handleSave}>
          {flash?.target === "save" ? flash.text : "Save PNG"}
        </button>
        <button type="button" className="action-button" onClick={close}>
          Close
        </button>
      </div>
    </QrModalStyle>
  );
};

const Modal = (props: IProps) => {
  const dispatch = useDispatch();
  const url = props.url ?? window.location.href;

  return (
    <ModalRoot onClose={() => dispatch(closeModal(name))} zIndex={props.zIndex}>
      <QrContent url={url} />
    </ModalRoot>
  );
};

export { Modal };

const QrModalStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.palette.surface};
  color: ${({ theme }) => theme.palette.text.primary};

  .hint {
    margin: 0;
    font-size: 14px;
    color: ${({ theme }) => theme.palette.text.secondary};
  }

  .qr {
    padding: ${({ theme }) => theme.spacing.sm};
    background: #ffffff;
    border-radius: ${({ theme }) => theme.radius.sm};
    line-height: 0;
  }

  .url {
    margin: 0;
    max-width: 320px;
    font-size: 12px;
    word-break: break-all;
    text-align: center;
    color: ${({ theme }) => theme.palette.text.secondary};
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: ${({ theme }) => theme.spacing.sm};
  }

  .action-button {
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
    font-size: 14px;
    cursor: pointer;
    border: 1px solid ${({ theme }) => theme.palette.border};
    border-radius: ${({ theme }) => theme.radius.md};
    background: ${({ theme }) => theme.palette.surface};
    color: ${({ theme }) => theme.palette.text.primary};

    &:hover:not(:disabled) {
      border-color: ${({ theme }) => theme.palette.primary};
      color: ${({ theme }) => theme.palette.primary};
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }

`;
