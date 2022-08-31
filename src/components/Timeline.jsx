import React, { useEffect, useState, memo } from 'react'
import { db } from "../firebase";
import { collection, getDocs, onSnapshot, orderBy, query } from "firebase/firestore";

const Timeline = memo(() => {
  const [posts, setPosts] = useState([]);
  // const [postID, setPostID] = useState([]);

  useEffect(() => {

    const postData = collection(db, "post");
    const q = query(postData, orderBy("timestamp", "desc"))

    // ページ読み込み時にデータ取得
    // getDocs(q).then((querySnapshot) => {
    //   setPosts(querySnapshot.docs.map((doc) => doc.data()));
    // });

    // リアルタイムでデータ取得 ドキュメントIDも追加
    onSnapshot(q, (querySnapshot) => {
      let results = [];
      querySnapshot.docs.map((doc) => {
        results.push({ ...doc.data(), id: doc.id })
      })
      setPosts(results);
    })
  }, [])

  return (
    <div>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <div className='userName'>{post.user_id}：</div>
            <div className='post'>{post.text}</div>
          </li>
        ))}
      </ul>
    </div>
  )
})

export default Timeline