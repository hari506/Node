const Review = ({ review }) => {
  return (
    <div className="reviews__card">
      <div className="reviews__avatar">
        <img
          src={`img/users/${review.user.photo}`}
          alt={review.user.name}
          className="reviews__avatar-img"
        />
        <h6 className="reviews__user">{review.user.name}</h6>
      </div>
      <p className="reviews__text">{review.review}</p>
      <div className="reviews__rating">
        {[1, 2, 3, 4, 5].map((item) => {
          return (
            <svg
              className={`reviews__star reviews__star--${
                review.rating >= item ? 'active' : 'inactive'
              }`}
            >
              <img src="img/icons.svg#icon-star" />
            </svg>
          );
        })}
      </div>
    </div>
  );
};

export default Review;
