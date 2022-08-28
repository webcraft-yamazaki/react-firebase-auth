import { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import { getAuth, signOut } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Navigate, useNavigate } from "react-router-dom";

const Service = () => {
  const auth = getAuth();
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    signOut(auth).then(() => {
      // Sign-out successful.
      navigate("/", { replace: true });
    }).catch((error) => {
      // An error happened.
    });
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setUser(auth.currentUser);
        setLoading(true);
        console.log('1111')
        // ...
      } else {
        // User is signed out
        // ...
        setLoading(true);
        console.log('2222')
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
              <>
                <p>サービスページ</p>
                <button onClick={handleSubmit}>ログアウト</button>
              </>
            ) : (
              <Navigate to="/" replace={true} />
            )}
          </>
        )
      }

    </div>
  )
}

export default Service