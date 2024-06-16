import { useState } from 'react';
import Constants from '../../constants';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  let [formData, setFormData] = useState('');
  let navigator = useNavigate();

  const handleFormInput = (e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateLoginForm = async (e) => {
    e.preventDefault();
    try {
      let res = await axios.post(
        Constants.SERVER_URL + 'users/login',
        formData
      );

      console.log(res);
      if (res.status === 200) {
        localStorage.setItem('token', res.data.token);
        navigator('/');
      } else {
        alert('error occured while login');
      }
    } catch (err) {
      console.log(err);
      alert(err.response.data.message);
    }
  };

  return (
    <main className="main">
      <div className="login-form">
        <h2 className="heading-secondary ma-bt-lg">Log into your account</h2>
        <form className="form form--login">
          <div className="form__group">
            <label className="form__label" htmlFor="email">
              Email address
            </label>
            <input
              className="form__input"
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              required=""
              onChange={handleFormInput}
            />
          </div>
          <div className="form__group ma-bt-md">
            <label className="form__label" htmlFor="password">
              Password
            </label>
            <input
              className="form__input"
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              required=""
              minLength="7"
              onChange={handleFormInput}
            />
          </div>
          <div className="form__group">
            <button
              className="btn btn--green"
              onClick={(e) => validateLoginForm(e)}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Login;
