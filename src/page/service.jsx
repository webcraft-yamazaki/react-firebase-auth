import { useState, useEffect, memo, useCallback } from 'react'
//ルーティング用react-route関数
import { Navigate, useNavigate } from "react-router-dom";
//firebase通信用関数
import { getAuth, signOut, db, storage, ref, uploadBytes, getDownloadURL } from '../firebase';
//ログイン用firebase関数
import { onAuthStateChanged } from 'firebase/auth';
//投稿用firebase関数
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

//コンポーネント
import Timeline from '../components/Timeline';
import MyDropzone from '../components/MyDropzone';



const Service = memo(() => {

  const auth = getAuth();
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();
  const [tweetMessage, setTweetMessage] = useState("");
  const [urls, setUrls] = useState([]);
  const [tweetImage, setTweetImage] = useState([]);

  const [dataImgName, setDataImgName] = useState([]);
  const [dataImgPath, setDataImgPath] = useState([]);

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

  const sendTweet = (e, imgs) => {
    e.preventDefault();
    new Promise((resolve, reject) => {
      console.log('最初に実行');
      let imgName = [];
      let imgPath = [];
      if (imgs.length) {
        Object.keys(imgs).forEach((key) => {
          const storageRef = ref(storage, `images/${imgs[key].name}`);
          // 'file' comes from the Blob or File API
          uploadBytes(storageRef, imgs[key])
            .then((snapshot) => {
              console.log(imgs[key].name + "のアップロードが成功しました");
              imgName.push(snapshot.metadata.name);
              imgPath.push(snapshot.metadata.fullPath);
              resolve([imgName, imgPath]);
            })
            .catch((error) => {
              console.log(imgs[key].name + "のアップロードが失敗しました");
              if (key === 0) {
                alert("画像のアップロードが失敗しました");
              } else {
                alert(`${key}枚目以降の画像のアップロードが失敗しました`);
              }
              resolve([imgName, imgPath]);
            });
        })
      } else {
        resolve();
      }
    })
      .then((resolve) => { //resolveの引数１を受けとる
        //firebaseのデータベースにデータを追加する
        addDoc(collection(db, "post"), {
          user_id: user.uid,
          text: tweetMessage,
          imgName: resolve[0],
          imgPath: resolve[1],
          timestamp: serverTimestamp(),
        })
        setTweetMessage("");
      })
      .catch((error) => {
        //firebaseのデータベースにデータを追加する
        addDoc(collection(db, "post"), {
          user_id: user.uid,
          text: tweetMessage,
          imgName: [],
          imgPath: [],
          timestamp: serverTimestamp(),
        })
        setTweetMessage("");
      })
  }

  //MyDropzone内で使用
  const onDrop = (acceptedFiles) => {
    // console.log(acceptedFiles)
    if (acceptedFiles) {
      setUrls(acceptedFiles.map(acceptedFile => URL.createObjectURL(acceptedFile)));
      setTweetImage(acceptedFiles);
    }
  }

  const handleChangeImage = (e) => {
    if (e.target.files[0]) {
      // const randomId = Math.random().toString(32).substring(2);

    }
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
              <>
                <p>サービスページ</p>
                <button onClick={handleSubmit}>ログアウト</button><br />
                <hr />
                <textarea name="post" id="" cols="100" rows="10" value={tweetMessage} onChange={(e) => setTweetMessage(e.target.value)}></textarea><br />
                <MyDropzone onDrop={onDrop} /><br />
                <button className='tweetButton' type='submit' onClick={(e) => sendTweet(e, tweetImage)}>ツイートする</button>
                <hr />
                <Timeline />
              </>
            ) : (
              <Navigate to="/" replace={true} />
            )}
          </>
        )
      }

    </div >
  )
});

export default Service