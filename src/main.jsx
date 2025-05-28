import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '~/App.jsx'
import theme from '~/theme'
import { ToastContainer } from 'react-toastify'
import { ConfirmProvider } from 'material-ui-confirm'
createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme}>
    <ConfirmProvider defaultOptions={{
      allowClose: false,
      dialogProps: {maxWidth: 'xs' },
      cancellationButtonProps: {color: 'inherit', variant: 'outlined' },
      confirmationButtonProps: {color: 'warning', variant: 'contained' }
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
)