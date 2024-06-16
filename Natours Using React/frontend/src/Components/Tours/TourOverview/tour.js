import { useNavigate } from 'react-router-dom';

const TourOverview = ({ tour }) => {
  const navigator = useNavigate();
  return (
    <div className="card">
      <div className="card__header">
        <div className="card__picture">
          <div className="card__picture-overlay">&nbsp;</div>
          <img
            src={`/img/tours/${tour.imageCover}`}
            alt="Tour 1"
            className="card__picture-img"
          />
        </div>

        <h3 className="heading-tertirary">
          <span>{tour.name}</span>
        </h3>
      </div>

      <div className="card__details">
        <h4 className="card__sub-heading">
          {tour.difficulty} {tour.duration}-day tour
        </h4>
        <p className="card__text">{tour.summary}</p>
        <div className="card__data">
          <svg className="card__icon">
            <img src="" alt="card icon" />
          </svg>
          <span>description</span>
        </div>
        <div className="card__data">
          <svg className="card__icon">
            <img src="" alt="card icon" />
          </svg>
          <span>
            {tour.startDates[0].toLocaleString('en-us', {
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>
        <div className="card__data">
          <svg className="card__icon">
            <img src="" alt="card icon3" />
          </svg>
          <span>{tour.locations.length} stops</span>
        </div>
        <div className="card__data">
          <svg className="card__icon">
            <img src="" alt="card icon4" />
          </svg>
          <span>{tour.maxGroupSize} people</span>
        </div>
      </div>

      <div className="card__footer">
        <p>
          <span className="card__footer-value">${tour.price}</span>
          <span className="card__footer-text">per person</span>
        </p>
        <p className="card__ratings">
          <span className="card__footer-value">{tour.ratingsAverage}</span>
          <span className="card__footer-text">
            rating ({tour.ratingsQuantity})
          </span>
        </p>
        <button
          onClick={() => navigator(`/${tour.slug}`)}
          className="btn btn--green btn--small"
        >
          Details
        </button>
      </div>
    </div>
  );
};

export default TourOverview;
