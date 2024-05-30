import { AppProvider } from './providers/app';
import { ThemeProvider } from './providers/theme';
import { AppRoutes } from './routes';

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
