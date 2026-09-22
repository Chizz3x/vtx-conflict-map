import * as ModalExample from './example';
import * as ModalQr from './qr';

export const modals = [ModalExample, ModalQr];

export namespace NModals {
  export interface IDefaultProps {
    open?: string | boolean | null;
    zIndex?: number;
  }

  export type IModalRegistry = {
    [K in (typeof modals)[number] as (typeof modals)[number]['name']]: React.ComponentProps<
      (typeof modals)[number]['Modal']
    >;
  };
}
