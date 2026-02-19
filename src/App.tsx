import { RouterProvider } from '@tanstack/react-router';
import { router } from '@/routes/routeTree';
import './index.css';

function App() {
  return <RouterProvider router={router} />;
}

export default App;
