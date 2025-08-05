import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import LoginPage from "../pages/LogInPage";
import SignUpPage from "../pages/SignUpPage";
import HomePage from "../pages/HomePage";
import { AuthProvider } from "../context/AuthContext";
const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignUpPage />} />
        <Route index element={<HomePage />} />
      </>
    )
  );
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
