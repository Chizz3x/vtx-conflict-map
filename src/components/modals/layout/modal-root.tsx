import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { CSSMediaRule, CSSMediaSize } from '@utils/css-media-size';

interface ModalRootProps {
  onClose?: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  zIndex?: number;
}

/** Drag distance past which releasing dismisses the drawer. */
const DRAG_CLOSE_PX = 110;
const COLLAPSE_MS = 180;
/** Must match the exit animation durations in the styles below. */
const EXIT_MS = 200;

// The parent unmounts this modal the moment onClose fires, so the exit
// animation has to run before onClose is called. Children close themselves
// through this context to get the same animated exit.
const ModalCloseContext = React.createContext<() => void>(() => {});

const useModalClose = () => React.useContext(ModalCloseContext);

const ModalRoot = (props: ModalRootProps) => {
  const { children, onClose, style, zIndex } = props;
  const innerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startY: number; dy: number } | null>(null);
  const closeTimer = useRef<number>();
  const closingRef = useRef(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const requestClose = useCallback(() => {
    // Guards against double triggers (e.g. an overlay click landing while a
    // drag-dismiss is already animating out).
    if (closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    closeTimer.current = window.setTimeout(() => onClose?.(), EXIT_MS);
  }, [onClose]);

  const handleClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (event.currentTarget === event.target) {
      requestClose();
    }
  };

  // The drawer layout only applies at this breakpoint, so the gesture is
  // disabled elsewhere rather than relying on the handle being hidden.
  const isDrawer = () =>
    typeof window !== 'undefined' && window.matchMedia(CSSMediaRule.phone_big).matches;

  const handlePointerDown: React.PointerEventHandler<HTMLDivElement> = (event) => {
    if (!isDrawer() || closingRef.current) return;
    dragRef.current = { startY: event.clientY, dy: 0 };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove: React.PointerEventHandler<HTMLDivElement> = (event) => {
    const drag = dragRef.current;
    const el = innerRef.current;
    if (!drag || !el) return;
    // Clamped to downward only; there is nothing above the drawer to reveal.
    drag.dy = Math.max(0, event.clientY - drag.startY);
    el.style.transition = '';
    el.style.transform = `translateY(${drag.dy}px)`;
  };

  const endDrag = () => {
    const drag = dragRef.current;
    const el = innerRef.current;
    dragRef.current = null;
    if (!drag) return;

    if (drag.dy > DRAG_CLOSE_PX) {
      // Already animating from the drag itself, so skip the class-based exit.
      closingRef.current = true;
      if (el) {
        el.style.transition = `transform ${COLLAPSE_MS}ms ease-in`;
        el.style.transform = 'translateY(100%)';
      }
      closeTimer.current = window.setTimeout(() => {
        // Clear the inline transform so a reopened modal is not stuck offscreen.
        if (el) {
          el.style.transition = '';
          el.style.transform = '';
        }
        onClose?.();
      }, COLLAPSE_MS);
      return;
    }

    if (el) {
      el.style.transition = 'transform 0.2s ease-out';
      el.style.transform = 'translateY(0)';
    }
  };

  return (
    <ModalCloseContext.Provider value={requestClose}>
      <ModalRootStyle
        className={closing ? 'closing' : undefined}
        style={{ zIndex, ...style }}
        onClick={handleClick}
      >
        <div className="modal-inner" ref={innerRef}>
          <div
            className="drag-handle"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            <span className="drag-bar" />
          </div>
          {children}
        </div>
      </ModalRootStyle>
    </ModalCloseContext.Provider>
  );
};

export { ModalRoot, useModalClose };

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const popIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.96) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

const popOut = keyframes`
  from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scale(0.96) translateY(8px);
  }
`;

const drawerUp = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

const drawerDown = keyframes`
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
`;

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
  animation: ${fadeIn} 0.2s ease-out;

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
    animation: ${popIn} 0.2s ease-out;
  }

  .drag-handle {
    display: none;
  }

  &.closing {
    animation: ${fadeOut} ${EXIT_MS}ms ease-in forwards;

    .modal-inner {
      animation: ${popOut} ${EXIT_MS}ms ease-in forwards;
    }
  }

  ${CSSMediaSize.phone_big} {
    align-items: flex-end;

    .modal-inner {
      width: 100%;
      min-width: 0;
      max-width: 100%;
      border-radius: ${({ theme }) => theme.radius.md} ${({ theme }) => theme.radius.md} 0 0;
      padding-bottom: env(safe-area-inset-bottom, 0px);
      box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.25);
      animation: ${drawerUp} 0.22s ease-out;
    }

    .drag-handle {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;
      /* Sticky so tall content cannot scroll the grab bar out of reach. */
      position: sticky;
      top: 0;
      z-index: 1;
      padding: 10px 0 6px;
      background: ${({ theme }) => theme.palette.surface};
      cursor: grab;
      touch-action: none;
      user-select: none;

      &:active {
        cursor: grabbing;
      }
    }

    .drag-bar {
      width: 40px;
      height: 4px;
      border-radius: ${({ theme }) => theme.radius.full};
      background: ${({ theme }) => theme.palette.border};
    }

    &.closing .modal-inner {
      animation: ${drawerDown} ${EXIT_MS}ms ease-in forwards;
    }
  }
`;
