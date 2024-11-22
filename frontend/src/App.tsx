import React from 'react';
import { ThemeProvider, createTheme, CssBaseline, Container, AppBar, Toolbar, Typography } from '@mui/material';
import FileUpload from './components/upload/FileUpload';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div">
            PST Analyzer
          </Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <FileUpload />
      </Container>
    </ThemeProvider>
  );
}

export default App;
