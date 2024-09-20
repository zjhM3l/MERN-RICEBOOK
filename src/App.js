import { Box, createTheme, Stack, ThemeProvider } from '@mui/material';
import { Sidebar } from './components/Sidebar';
import { Rightbar } from './components/Rightbar';
import { Feed } from './components/Feed';
import { Navbar } from './components/Navbar';
import { Add } from './components/Add';
import { useState } from 'react';
import Profile from './components/Profile';

function App() {

  const [mode,setMode] = useState('light');

  const darkTheme = createTheme ({
    palette: {
      mode: mode,
    }
  })

  return (
    <ThemeProvider theme={darkTheme}>
      <Box bgcolor={"background.default"} color={"text.primary"}>
        <Navbar/>
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Sidebar setMode={setMode} mode={mode}/>
          <Feed/>
          {/* <Profile /> */}
          <Rightbar/>
        </Stack>
        <Add/>
      </Box>
    </ThemeProvider>
  );
}

export default App;
