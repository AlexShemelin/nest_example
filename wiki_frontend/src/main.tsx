import ReactDOM from 'react-dom/client';
import App from './App';
import { ApiClient } from './store/apiClient';

window.apiClient = new ApiClient('http://localhost:3001');

declare global {
  interface Window {
    apiClient: ApiClient;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
