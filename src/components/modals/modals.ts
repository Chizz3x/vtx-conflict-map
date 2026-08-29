import * as ModalExample from './example';

export const modals = [ModalExample];

export namespace NModals {
  export interface IDefaultProps {
    open?: string | boolean | null;
  }

  export type IModalRegistry = {
    [K in (typeof modals)[number] as (typeof modals)[number]['name']]: React.ComponentProps<
      (typeof modals)[number]['Modal']
    >;
  };
}
