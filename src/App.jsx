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
  return <RouterProvider router={router} />;
};

export default App;
