import React from 'react';
import styled from 'styled-components';
import { useDispatch } from '../../../redux/hooks';
import { ModalRoot } from '../layout';
import { NModals } from '../modals';
import { closeModal } from '../../../redux/slices/modals';

export const name = 'ModalExample';

const Modal = (props: NModals.IDefaultProps) => {
  const dispatch = useDispatch();

  return (
    <ModalRoot onClose={() => dispatch(closeModal(name))}>
      <ModalExampleStyle>Modal Example</ModalExampleStyle>
    </ModalRoot>
  );
};

export { Modal };

const ModalExampleStyle = styled.div``;
