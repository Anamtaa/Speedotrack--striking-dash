import React, { useState, useCallback, navigate } from 'react';
import axios from "axios";
import { Link, NavLink, useHistory } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { FacebookOutlined, TwitterOutlined } from '@ant-design/icons';
import { Auth0Lock } from 'auth0-lock';
import { AuthWrapper } from './style';
import { login } from '../../../../redux/authentication/actionCreator';
import { Checkbox } from '../../../../components/checkbox/checkbox';
import Heading from '../../../../components/heading/heading';
import { auth0options } from '../../../../config/auth0';

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.auth.loading);
  const [form] = Form.useForm();
  const [state, setState] = useState({
    checked: null,
  });

  const lock = new Auth0Lock(clientId, domain, auth0options);

  const handleSubmit = useCallback(() => {
    dispatch(login());
    history.push('/admin');
  }, [history, dispatch]);

  const onChange = (checked) => {
    setState({ ...state, checked });
  };

  lock.on('authenticated', authResult => {
    lock.getUserInfo(authResult.accessToken, error => {
      if (error) {
        return;
      }

      handleSubmit();
      lock.hide();
    });
  });

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };


  
  const submit = async (e, navigate) => {
    e.preventDefault();
    if (!username || !password) {
        alert("Please fill in both username and password fields.");
        return;
    }
    const url = "http://23.88.50.20:3000/api/login";
    const requestData = {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };

    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    try {
        const response = await axios.post(url, formData, requestData);
        const responseData = response.data;
        console.log(responseData);
        localStorage.setItem("data", JSON.stringify(responseData));

        if (response?.status === 200)
            navigate(`/admin`);

        else
            alert(response?.message)
    } catch (error) {
        console.log("Error", error);
    }
};





  return (
    <AuthWrapper>
      <p className="auth-notice">
        Don&rsquo;t have an account? <NavLink to="/register">Sign up now</NavLink>
      </p>
      <div className="auth-contents">
        <Form name="login" form={form} onFinish={handleSubmit} layout="vertical">
          <Heading as="h3">
            Sign in to <span className="color-secondary">Admin</span>
          </Heading>
          <Form.Item
            name="username"
            rules={[{ message: 'Please input your username or Email!', required: true }]}
            initialValue="name@example.com"
            label="Username or Email Address"
            onChange={handleUsernameChange}
          >
            <Input />
          </Form.Item>
          <Form.Item name="password" initialValue="123456" label="Password">
            <Input.Password placeholder="Password" onChange={handlePasswordChange} />
          </Form.Item>
          <div className="auth-form-action">
            <Checkbox onChange={onChange} checked={state.checked}>
              Keep me logged in
            </Checkbox>
            <NavLink className="forgot-pass-link" to="/forgotPassword">
              Forgot password?
            </NavLink>
          </div>
          <Form.Item>
            <Button className="btn-signin" htmlType="submit" type="primary" size="large"  onClick={(e) => submit(e, navigate)}>
              {isLoading ? 'Loading...' : 'Sign In'}
            </Button>
          </Form.Item>
          <p className="form-divider">
            <span>Or</span>
          </p>
          <ul className="social-login">
            <li>
              <Link className="google-signup" to="#">
                <img src={require('../../../../static/img/google.png')} alt="" />
                <span>Sign in with Google</span>
              </Link>
            </li>
            <li>
              <Link className="facebook-sign" to="#">
                <FacebookOutlined />
              </Link>
            </li>
            <li>
              <Link className="twitter-sign" to="#">
                <TwitterOutlined />
              </Link>
            </li>
          </ul>
          <div className="auth0-login">
            <Link to="#" onClick={() => lock.show()}>
              Sign In with Auth0
            </Link>
            <Link to="/fbSignIn">Sign In With Firebase</Link>
          </div>
        </Form>
      </div>
    </AuthWrapper>
  );
}

export default SignIn;
