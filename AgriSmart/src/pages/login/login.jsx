import react from "react";
import { render } from "react-dom";
import './login.scss';
import FacebookIcon from '@mui/icons-material/Facebook';

export default function Login() {
  return (
    <div className="login-body">
    <div class="login-container">
        <div class="background-animation">
            <div class="circle"></div>
            <div class="circle"></div>
            <div class="circle"></div>
        </div>
        <div class="login-form">
            <h2>Login to Your Account</h2>
            <form>
                <div class="input-group">
                    <input type="text" id="username" required/>
                    <label for="username">Username</label>
                </div>
                <div class="input-group">
                    <input type="password" id="password" required/>
                    <label for="password">Password</label>
                </div>
                <div class="input-group checkbox-group">
                    <input type="checkbox" id="remember-me"/>
                    <label for="remember-me">Remember Me</label>
                </div>
                <button type="submit" class="login-button">Login</button>
            </form>
            <div class="social-login">
                <p>Or login with</p>
                <div class="social-icons">
                    <a href="#" class="icon facebook"><FacebookIcon/></a>
                    <a href="#" class="icon twitter"></a>
                    <a href="#" class="icon google"></a>
                </div>
            </div>
            <div class="forgot-password">
                <a href="#">Forgot Password?</a>
            </div>
        </div>
    </div>
    </div>
  );
}