import {
  Bitrix24,
  BxEntitySelector,
  BxInputDate,
  BxInputFile,
  BxInput,
  BxButton,
  BxTextarea,
  BxLink,
  BxAlert
} from 'vue-bitrix24';
import 'vue-bitrix24/css';

const useBitrix24 = {
  install(app) {
    [
      BxEntitySelector,
      BxInputDate,
      BxInputFile,
      BxInput,
      BxButton,
      BxTextarea,
      BxLink,
      BxAlert,
    ].forEach((Component) => {
      app.component(Component.name, Component);
    });
  },
};

export { Bitrix24, useBitrix24 };
