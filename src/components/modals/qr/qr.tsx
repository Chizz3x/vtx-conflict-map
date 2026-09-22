import React from "react";
import styled from "styled-components";
import { QRCodeSVG } from "qrcode.react";
import { useDispatch } from "../../../redux/hooks";
import { ModalRoot } from "../layout";
import { NModals } from "../modals";
import { closeModal } from "../../../redux/slices/modals";

export const name = "ModalQr";

interface IProps extends NModals.IDefaultProps {
  url?: string;
}

const Modal = (props: IProps) => {
  const dispatch = useDispatch();
  const url = props.url ?? window.location.href;

  return (
    <ModalRoot onClose={() => dispatch(closeModal(name))} zIndex={props.zIndex}>
      <QrModalStyle>
        <p className="hint">Scan to open this frequency plan on another device</p>
        <div className="qr">
          <QRCodeSVG value={url} size={220} />
        </div>
        <p className="url">{url}</p>
        <button type="button" className="close-button" onClick={() => dispatch(closeModal(name))}>
          Close
        </button>
      </QrModalStyle>
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

  .close-button {
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
    font-size: 14px;
    cursor: pointer;
    border: 1px solid ${({ theme }) => theme.palette.border};
    border-radius: ${({ theme }) => theme.radius.md};
    background: ${({ theme }) => theme.palette.surface};
    color: ${({ theme }) => theme.palette.text.primary};

    &:hover {
      border-color: ${({ theme }) => theme.palette.primary};
      color: ${({ theme }) => theme.palette.primary};
    }
  }
`;
