import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '~/App.jsx'
import theme from '~/theme'
import { ToastContainer } from 'react-toastify'
import { ConfirmProvider } from 'material-ui-confirm'
// Config Redux Store
import { store } from '~/redux/store'
import { Provider } from 'react-redux'

// Declare react router
import { BrowserRouter } from 'react-router'
createRoot(document.getElementById('root')).render(
  <BrowserRouter basename='/'>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ConfirmProvider defaultOptions={{
          allowClose: false,
          dialogProps: { maxWidth: 'xs' },
          cancellationButtonProps: { color: 'inherit', variant: 'outlined' },
          confirmationButtonProps: { color: 'warning', variant: 'contained' }
        }}>
          <CssBaseline />
          <App />
          <ToastContainer
            position="bottom-right"
            theme="colored"
            pauseOnHover
            closeOnClick={false}
          />
        </ConfirmProvider>
      </ThemeProvider>
    </Provider>
  </BrowserRouter>
)