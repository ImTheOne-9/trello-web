import { cyan, deepOrange, orange, teal } from '@mui/material/colors'
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: teal,
        secondary: deepOrange
      }
    },
    dark: {
      palette: {
        primary: cyan,
        secondary: orange,
        background: {
          default: '#303030',
          paper: '#424242'
        },
        text: {
          primary: '#fff',
          secondary: '#b3b3b3'
        }
      }
    }
  }
})

export default theme