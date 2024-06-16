import Tours from './Components/Tours/tours';
import Footer from './Components/UI/Footer';
import Header from './Components/UI/header';
import { Route, Routes } from 'react-router-dom';
import Tour from './Components/Tours/TourDetails/tour';
import Login from './Components/Auth/login';
function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Tours />} />
        <Route path="/login" element={<Login />} />
        <Route path="/:slug" element={<Tour />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
