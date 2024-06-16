import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Constants from '../../../constants';
import Review from '../review';

const Tour = () => {
  let params = useParams();
  const [tour, setTour] = useState({});

  useEffect(() => {
    const getTour = async () => {
      let res = await axios.get(
        Constants.SERVER_URL + `tours/get-tour-by-slug?slug=${params.slug}`
      );
      console.log(res.data);
      setTour(res.data.tour);
    };

    getTour();
  }, []);
  return (
    <>
      <section className="section-header">
        <div className="header__hero">
          <div className="header__hero-overlay">&nbsp;</div>
          <img
            className="header__hero-img"
            src={`img/tours/${tour.imageCover}`}
            alt={tour.name}
          />
        </div>
        <div className="heading-box">
          <h1 className="heading-primary">
            <span>{tour.name}</span>
          </h1>
          <div className="heading-box__group">
            <div className="heading-box__detail">
              <svg className="heading-box__icon">
                <img src="/img/icons.svg#icon-clock" />
              </svg>
              <span className="heading-box__text">{tour.duration} days</span>
            </div>
            <div className="heading-box__detail">
              <svg className="heading-box__icon">
                <img src="/img/icons.svg#icon-map-pin" />
              </svg>
              <span className="heading-box__text">
                {tour.startLocation?.description}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-description">
        <div className="overview-box">
          <div>
            <div className="overview-box__group">
              <h2 className="heading-secondary ma-bt-lg">Quick facts</h2>
              <div className="overview-box__detail">
                <svg className="overview-box__icon">
                  <img src="" />
                </svg>
                <span className="overview-box__label">Next date</span>
                <span className="overview-box__text">
                  {tour.startDates
                    ? tour.startDates[0].toLocaleString('en-us', {
                        month: 'long',
                        year: 'numeric',
                      })
                    : ''}
                </span>
              </div>
              <div className="overview-box__detail">
                <svg className="overview-box__icon">
                  <img src="img/icons.svg#icon-trending-up" />
                </svg>
                <span className="overview-box__label">Difficulty</span>
                <span className="overview-box__text">{tour.difficulty}</span>
              </div>
              <div className="overview-box__detail">
                <svg className="overview-box__icon">
                  <img src="img/icons.svg#icon-user" />
                </svg>
                <span className="overview-box__label">Participants</span>
                <span className="overview-box__text">
                  {tour.maxGroupSize} people
                </span>
              </div>
              <div className="overview-box__detail">
                <svg className="overview-box__icon">
                  <img src="img/icons.svg#icon-star" />
                </svg>
                <span className="overview-box__label">Rating</span>
                <span className="overview-box__text">
                  {tour.ratingsAverage} / 5
                </span>
              </div>
            </div>

            <div className="overview-box__group">
              <h2 className="heading-secondary ma-bt-lg">Your tour guides</h2>

              {tour.guides?.map((guide) => {
                return (
                  <div className="overview-box__detail">
                    <img
                      src={`img/users/${guide.photo}`}
                      alt={guide.name}
                      className="overview-box__img"
                    />
                    <span className="overview-box__label">{guide.role}</span>
                    <span className="overview-box__text">{guide.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="description-box">
          <h2 className="heading-secondary ma-bt-lg">About {tour.name}</h2>
          {tour.description?.split('\n').map((item) => {
            return <p className="description__text">{item}</p>;
          })}
        </div>
      </section>

      <section className="section-pictures">
        {tour.images?.map((img, index) => {
          return (
            <div className="picture-box">
              <img
                className={`picture-box__img picture-box__img--${index + 1}`}
                src={`img/tours/${img}`}
                alt={`The Park Camper Tour ${index + 1}`}
              />
            </div>
          );
        })}
      </section>
      <section className="section-reviews">
        <div className="reviews">
          {tour.reviews?.map((review) => {
            return <Review review={review} />;
          })}
        </div>
      </section>

      <section className="section-cta">
        <div className="cta">
          <div className="cta__img cta__img--logo">
            <img src="img/logo-white.png" alt="Natours logo" className="" />
          </div>
          {tour.images ? (
            <img
              src={`img/${tour.images[1]}`}
              alt=""
              className="cta__img cta__img--1"
            />
          ) : (
            ''
          )}
          {tour.images ? (
            <img
              src={`img/${tour.images[2]}`}
              alt=""
              className="cta__img cta__img--2"
            />
          ) : (
            ''
          )}

          <div className="cta__content">
            <h2 className="heading-secondary">What are you waiting for?</h2>
            <p className="cta__text">
              {tour.duration} days. 1 adventure. Infinite memories. Make it
              yours today!
            </p>
            <button className="btn btn--green span-all-rows">
              Book tour now!
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Tour;
