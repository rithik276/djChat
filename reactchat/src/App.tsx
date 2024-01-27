import { Route,RouterProvider,createBrowserRouter, createRoutesFromElements } from "react-router-dom"
import {createMuiTheme} from './theme/theme'

import Home from "./pages/Home"
import { ThemeProvider } from "@emotion/react"


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Home/>}/>
    </Route>
  )
)
const App: React.FC = () =>{
  const theme = createMuiTheme("light");
  return(
    <ThemeProvider theme={theme}>
      <RouterProvider router={router}/>
    </ThemeProvider>
  )
}



export default App