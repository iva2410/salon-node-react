import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
const Footer = () => {
  return (
    <div className='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
          <div className='footer-logo'>
            <p className='left-p'>BeBeauty</p>
            <img src={assets.women} alt="" />
          </div>

          <p>Inspirišemo ljude da pronalaze nove načine da iskažu svoju lepotu, da istražuju najnovije trendove u svetu kozmetike i brige o licu i telu i da uživaju u tome!</p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="" />
            <img src={assets.twitter_icon} alt="" />
            <img src={assets.linkedin_icon} alt="" />
          </div>
        </div>
        <div className="footer-content-center">
          <h2>Kompanija</h2>
          <ul>
            <li>Najčešća pitanja i odgovori</li>
            <li>O nama</li>
            <li>Kontakt</li>
            <li>Privatnost</li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>O nama</h2>
          <ul>
            <li>+381</li>
            <li>contact@gmail.com</li>
          </ul>
        </div>
      </div>
      <hr />
    </div>
  )
}

export default Footer