import React from 'react';
import styled from 'styled-components';

interface ModalRootProps {
  onClose?: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  zIndex?: number;
}

const ModalRoot = (props: ModalRootProps) => {
  const { children, onClose, style, zIndex } = props;

  const handleClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (event.currentTarget === event.target) {
      onClose?.();
    }
  };

  return (
    <ModalRootStyle style={{ zIndex, ...style }} onClick={handleClick}>
      <div className="modal-inner">{children}</div>
    </ModalRootStyle>
  );
};

export { ModalRoot };

const ModalRootStyle = styled.div`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);

  .modal-inner {
    background: ${({ theme }) => theme.palette.surface};
    color: ${({ theme }) => theme.palette.text.primary};
    border-radius: ${({ theme }) => theme.radius.md};
    display: flex;
    flex-direction: column;
    min-width: 320px;
    max-width: 90vw;
    max-height: 90vh;
    overflow: auto;
  }
`;
