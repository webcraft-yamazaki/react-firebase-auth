import { useRef, useState, useEffect } from 'react';
import { getAuth } from '../firebase';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { Navigate, useNavigate } from "react-router-dom";

const Login = () => {

  const emailRef = useRef(null);
  const emailPassword = useRef(null);

  const auth = getAuth();
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();


  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(emailRef.current.value, emailPassword.current.value);

    signInWithEmailAndPassword(auth, emailRef.current.value, emailPassword.current.value)
      .then((userCredential) => {
        // Signed in
        setUser(auth.currentUser);
        // ...
        navigate("/service", { replace: true });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setUser(auth.currentUser);
        setLoading(true);
        // ...
      } else {
        // User is signed out
        // ...
        setLoading(true);
      }
    });
  });

  return (
    <div>
      {
        // ログイン判定後出力
        loading && (
          <>
            {/* ↓ログインしていればマイページを表示 */}
            {user ? (
              <Navigate to="/service" replace={true} />
            ) : (
              <div>
                <h1>ログイン</h1>
                <form onSubmit={handleSubmit}>
                  <div>
                    <label>メールアドレス</label>
                    <input name="email" type="email" placeholder="email" ref={emailRef} />
                  </div>
                  <div>
                    <label>パスワード</label>
                    <input
                      name="password"
                      type="password"
                      placeholder="password"
                      ref={emailPassword}
                    />
                  </div>
                  <div>
                    <button>ログイン</button>
                  </div>
                </form>
              </div>
            )}
          </>
        )
      }
    </div>

  );
};

export default Login;