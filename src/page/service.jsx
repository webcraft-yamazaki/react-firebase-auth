import { useState, useEffect } from 'react'
//ルーティング用react-route関数
import { Navigate, useNavigate } from "react-router-dom";
//firebase通信用関数
import { getAuth, signOut, db } from '../firebase';
//ログイン用firebase関数
import { onAuthStateChanged } from 'firebase/auth';
//投稿用firebase関数
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Timeline from '../components/Timeline';

const Service = () => {
  const auth = getAuth();
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();
  const [tweetMessage, setTweetMessage] = useState("");

  //ログアウト
  const handleSubmit = (event) => {
    event.preventDefault();
    signOut(auth).then(() => {
      // Sign-out successful.
      navigate("/", { replace: true });
    }).catch((error) => {
      // An error happened.
    });
  };

  const sendTweet = (e) => {
    //firebaseのデータベースにデータを追加する
    e.preventDefault();

    addDoc(collection(db, "post"), {
      user_id: user.uid,
      text: tweetMessage,
      timestamp: serverTimestamp(),
    })
    setTweetMessage("");
  }

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
              <>
                <p>サービスページ</p>
                <button onClick={handleSubmit}>ログアウト</button><br />
                <hr />
                <textarea name="post" id="" cols="100" rows="10" value={tweetMessage} onChange={(e) => setTweetMessage(e.target.value)}></textarea>
                <button className='tweetButton' type='submit' onClick={sendTweet}>ツイートする</button>
                <hr />
                <Timeline />
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