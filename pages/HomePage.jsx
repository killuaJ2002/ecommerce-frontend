import { Link } from "react-router-dom";
const HomePage = () => {
  return (
    <>
      <p>Homepage</p>
      <Link to="/login">login</Link>
    </>
  );
};

export default HomePage;
