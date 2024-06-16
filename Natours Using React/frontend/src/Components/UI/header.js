import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigator = useNavigate();
  return (
    <header className="header">
      <nav className="nav nav--tours">
        <button className="nav__el" onClick={() => navigator('/')}>
          All tours
        </button>
      </nav>
      <div className="header__logo">
        <img src="/img/logo-white.png" alt="Natours logo" />
      </div>
      <nav className="nav nav--user">
        <button className="nav__el" onClick={() => navigator('/login')}>
          Log in
        </button>
        <button
          className="nav__el nav__el--cta"
          onClick={() => navigator('/signUp')}
        >
          Sign up
        </button>
      </nav>
    </header>
  );
};

export default Header;
