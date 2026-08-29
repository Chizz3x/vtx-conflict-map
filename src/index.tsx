import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import 'react-toastify/dist/ReactToastify.css';
import Index from '@pages/index';
import { ToastContainer } from 'react-toastify';
import GlobalStyle from './style';
import { BrowserRouter } from 'react-router-dom';
import { store } from './redux/store';
import { AuthProvider } from './contexts/auth';
import i18n from './i18n';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <GlobalStyle />
      <I18nextProvider i18n={i18n}>
        <Suspense fallback={null}>
          <ToastContainer position="bottom-left" />
          <AuthProvider>
            <BrowserRouter>
              <Index />
            </BrowserRouter>
          </AuthProvider>
        </Suspense>
      </I18nextProvider>
    </ReduxProvider>
  </React.StrictMode>,
);
