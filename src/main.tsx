import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { VITE_API_MOCKING } from './config';

async function enableMocking() {
  if (VITE_API_MOCKING !== 'true') {
    return;
  }

  const { worker } = await import('./mocks/browser');

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start();
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
});
