import { useState, useEffect, memo, useCallback } from 'react'
//ルーティング用react-route関数
import { Navigate, useNavigate } from "react-router-dom";
//firebase通信用関数
import { getAuth, signOut, db, storage, ref, uploadBytes, uploadBytesResumable, getDownloadURL } from '../firebase';
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

  const uploadFunc = (imgs) => {
    let Count = 0;
    const postImg = {
      name: [],
      fullPath: [],
      url: [],
    };
    Object.keys(imgs).forEach((key) => {
      const storageRef = ref(storage, `images/${imgs[key].name}`);
      const uploadTask = uploadBytesResumable(storageRef, imgs[key]);

      uploadTask.on('state_changed',
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            Count++;
            console.log('File available at', downloadURL);
            postImg.name[key] = uploadTask.snapshot.metadata.name;
            postImg.fullPath[key] = uploadTask.snapshot.metadata.fullPath;
            postImg.url[key] = downloadURL;
            if (imgs.length == Count) {
              tweetSubmit(postImg);
            }
          });
        }
      );
    })
  }

  const tweetSubmit = (imgs) => {
    let post_map = {
      user_id: user.uid,
      text: tweetMessage,
      timestamp: serverTimestamp(),
    }
    if (imgs != undefined) {
      const img_map = {
        postImgs: {
          name: imgs.name,
          fullPath: imgs.fullPath,
          url: imgs.url,
        }
      }
      post_map = Object.assign(post_map, img_map);
    }
    //firebaseのデータベースにデータを追加する
    addDoc(collection(db, "post"), post_map)
    setTweetMessage("");

  }

  const sendTweet = (e, imgs) => {
    e.preventDefault();
    if (imgs.length) {
      uploadFunc(imgs);
      onDrop("")
    } else {
      tweetSubmit();
    }
  }

  //MyDropzone内で使用
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles) {
      setUrls(acceptedFiles.map(acceptedFile => URL.createObjectURL(acceptedFile)));
      setTweetImage(acceptedFiles);
    } else {
      setUrls([]);
      setTweetImage([]);
    }
  }, [tweetImage])

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
                <MyDropzone tweetImage={tweetImage} onDrop={onDrop} /><br />
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