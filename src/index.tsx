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
import { AppThemeProvider } from '@theme/index';
import i18n from './i18n';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(`${process.env.PUBLIC_URL}/service-worker.js`)
      .catch(() => {
        // registration failures are non-fatal; the app works online regardless
      });
  });
}

root.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <AppThemeProvider>
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
      </AppThemeProvider>
    </ReduxProvider>
  </React.StrictMode>,
);
