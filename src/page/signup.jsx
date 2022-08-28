import { useRef, useEffect, useState } from 'react';
import { getAuth } from '../firebase';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { Navigate } from "react-router-dom";

const SignUp = () => {
  const emailRef = useRef(null);
  const emailPassword = useRef(null);

  const auth = getAuth();

  const handleSubmit = (event) => {

    event.preventDefault();

    console.log(emailRef.current.value, emailPassword.current.value);

    createUserWithEmailAndPassword(auth, emailRef.current.value, emailPassword.current.value)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(false);
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
              <>
                <h1>ユーザ登録</h1>
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
                    <button>登録</button>
                  </div>
                </form>
              </>
            )}
          </>
        )
      }

    </div>
  );
};

export default SignUp;