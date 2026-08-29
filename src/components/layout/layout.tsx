import React from 'react';
import styled from 'styled-components';
import { modals as allModals, NModals } from '../modals/modals';
import { useSelector, useDispatch } from '../../redux/hooks';
import { closeModal, selectAllModals } from '../../redux/slices/modals';

const Layout = (props: NLayout.IProps) => {
  const { children } = props;
  const dispatch = useDispatch();
  const openModals = useSelector(selectAllModals);

  return (
    <LayoutStyle>
      {allModals.map((modal) => {
        const entry = openModals.find(([name]) => name === modal.name);
        if (!entry) return null;
        const [, modalProps] = entry;
        return React.createElement(modal.Modal, {
          key: modal.name,
          ...modalProps,
        });
      })}
      {children}
    </LayoutStyle>
  );
};

export { Layout };

export namespace NLayout {
  export interface IProps {
    children?: React.ReactNode;
    padding?: boolean;
    showHeader?: boolean;
    showFooter?: boolean;
  }
}

const LayoutStyle = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  overflow-x: hidden;
  flex-direction: column;
`;
