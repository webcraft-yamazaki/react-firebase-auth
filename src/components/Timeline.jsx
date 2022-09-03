import React, { useEffect, useState, memo } from 'react'
import { db, storage, } from "../firebase";
import { collection, getDocs, onSnapshot, orderBy, query } from "firebase/firestore";
import { css } from '@emotion/css'

const Timeline = memo(() => {
  const [posts, setPosts] = useState([]);

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
          <li id={'post-' + post.id} key={post.id}>
            <div className='userName'>
              {post.user_id}：
            </div>
            <div className='post'>
              {post.text}
            </div>
            {(post.postImgs) ? (
              <div id={'post-img-' + post.id} className='postImage'>
                {post.postImgs.name.map((key, i) => (
                  <img key={post.postImgs.url[i]} className={styles.postImg} src={post.postImgs.url[i]} data-filename={post.postImgs.name[i]} />
                ))}
              </div>
            ) :
              <></>
            }
          </li>
        ))}
      </ul>
    </div>
  )
})

// Emotion CSS
const styles = {

  //example
  container: css`
    width:auto;
  `,
  postImg: css`
    max-height:100px;
    display:inline-block;
  `,
}

export default Timeline