import { AppProvider } from './providers/app';
import { AuthProvider } from './providers/auth';
import { ThemeProvider } from './providers/theme';
import { AppRoutes } from './routes';

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
