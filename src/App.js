import './App.css';
import initializeAuthentication from './Firebase/firebase.initialize';
import { getAuth, signInWithPopup, GithubAuthProvider, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, updateProfile } from "firebase/auth";
import { useState } from 'react';

initializeAuthentication();

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

function App() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(false);

  const auth = getAuth();

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;
        console.log(user);
      }).catch((error) => {
        console.log(error.message);
      });
  }

  const handleGithubSignIn = () => {
    signInWithPopup(auth, githubProvider)
      .then((result) => {
        const user = result.user;
        console.log(user);
      }).catch((error) => {
        console.log(error.message);
      });
  }

  const handleRegistration = e => {
    e.preventDefault();
    console.log(email, password);
    if (password.length < 6) {
      setError('Password Must be at least 6 characters long.');
      return;
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      setError('Password must contains a Upper case latter')
      return;
    }

    isLogin ? processLogin(email, password) : registerNewUser(email, password);

  }

  const registerNewUser = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user;
        console.log(user);
        setError('');
        verifyEmail();
        setUserName();
      })
      .catch(error => {
        setError(error.message);
      })
  }

  const setUserName = () => {
    updateProfile(auth.currentUser, { displayName: name })
      .then(result => { });
  }

  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(result => {
        console.log(result);
      })
  }

  const processLogin = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user;
        console.log(user);
        setError('');
      })
      .catch(error => {
        setError(error.message);
      })
  }

  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(result => {
        console.log(result);
      })
      .catch(error => {
        setError('Invalied Email');
      })
  }

  const handleEmailChange = e => {
    setEmail(e.target.value);
  }
  const handlePasswordChange = e => {
    setPassword(e.target.value);
  }

  const handleNamedChanged = e => {
    setName(e.target.value);
  }

  const toggleLogin = e => {
    setIsLogin(e.target.checked);
  }

  return (
    <div className="mx-5">

      {/* <form onSubmit={handleRegistration}>
        <h3>Please Register</h3>
        <label htmlFor="email">Email: </label>
        <input type="text" name="email" id="" />
        <br />
        <label htmlFor="password">Password: </label>
        <input type="password" name="password" id="" />
        <br />
        <input type="submit" value="Register" />


      </form> */}
      <br /><br /><br />
      <form onSubmit={handleRegistration}>
        <h3 className='text-primary'>Please {isLogin ? 'Login' : 'Register'}</h3>
        {!isLogin && <div className="row mb-3">
          <label htmlFor="inputName" className="col-sm-2 col-form-label">Names</label>
          <input onBlur={handleNamedChanged} type="text" className="form-control" id="inputAddress" placeholder="Enter Your Name" />
        </div>}
        <div className="row mb-3">
          <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Email</label>
          <div onBlur={handleEmailChange} className="col-sm-10">
            <input type="email" className="form-control" id="inputEmail3" required />
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Password</label>
          <div onBlur={handlePasswordChange} className="col-sm-10">
            <input type="password" className="form-control" id="inputPassword3" required />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-sm-10 offset-sm-2">
            <div className="form-check">
              <input onChange={toggleLogin} className="form-check-input" type="checkbox" id="gridCheck1" />
              <label className="form-check-label" htmlFor="gridCheck1">
                Already Registerd?
              </label>
            </div>
          </div>
        </div>
        <div className="row mb-3 text-danger">
          {error}
        </div>
        <button type="submit" className="btn btn-primary">{isLogin ? 'Login' : 'Register'}</button>
        <button onClick={handleResetPassword} type="button" className="btn btn-secondary btn-sm">Forget Password?</button>
      </form>

      <br /><br /><br />
      <div>---------------------</div>
      <br /><br /><br />
      <button onClick={handleGoogleSignIn}>Google Sign In</button>
      <button onClick={handleGithubSignIn}>Github Sign In</button>
    </div>
  );
}

export default App;
