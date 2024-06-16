import axios from 'axios';
import { useEffect, useState } from 'react';
import Constants from '../../constants';
import TourOverview from './TourOverview/tour';

const Tours = () => {
  const [tours, setTours] = useState([]);

  useEffect(() => {
    let getTours = async () => {
      let res = await axios.get(Constants.SERVER_URL + 'tours');
      setTours(res.data.data);
    };
    getTours();
  }, []);

  return (
    <>
      <main className="main">
        <div className="card-container">
          {tours?.docs?.map((tour, index) => (
            <TourOverview tour={tour} key={index} />
          ))}
        </div>
      </main>
    </>
  );
};

export default Tours;
