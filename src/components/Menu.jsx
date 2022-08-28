import React from 'react'
import { Link } from 'react-router-dom'

function Menu() {
  return (
    <div>
        <Link to="/">HOME</Link><br/>
        <Link to="/login">ログイン</Link><br/>
        <Link to="/signup">新規登録</Link><br/>
        <Link to="/service">サービス</Link><br/>
    </div>
  )
}

export default Menu