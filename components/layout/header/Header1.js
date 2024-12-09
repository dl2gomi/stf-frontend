import Link from 'next/link';
import { useState } from 'react';
import Menu from '../Menu';
import MobileMenu from '../MobileMenu';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';

export default function Header1({ scroll, isMobileMenu, handleMobileMenu }) {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  return (
    <>
      <header id="header_main" className={`header_1 header-fixed ${scroll ? 'is-fixed is-small' : ''}`}>
        <div className="themesflat-container">
          <div className="row">
            <div className="col-md-12">
              <div id="site-header-inner">
                <div className="wrap-box flex">
                  <div id="site-logo">
                    <div id="site-logo-inner">
                      <Link href="/" rel="home" className="main-logo">
                        <img
                          id="logo_header"
                          src="/assets/images/logo/logo.png"
                          data-retina="assets/images/logo/logo@2x.png"
                        />
                      </Link>
                    </div>
                  </div>
                  {/* logo */}
                  <div className="mobile-button" onClick={handleMobileMenu}>
                    <span />
                  </div>
                  {/* /.mobile-button */}
                  <nav id="main-nav" className="main-nav">
                    <Menu />
                  </nav>
                  {/* /#main-nav */}
                  <div className="flat-wallet flex" onClick={() => open()}>
                    <div id="wallet-header">
                      <div id="connectbtn" className="tf-button style-1" style={{ cursor: 'pointer' }}>
                        <span>{isConnected ? `${address.slice(0, 4)}...${address.slice(-4)}` : 'Wallet Connect'}</span>
                        <i className="icon-wa" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`mobile-nav-wrap ${isMobileMenu ? 'active' : ''}`}>
          <div className="overlay-mobile-nav" onClick={handleMobileMenu} />
          <div className="inner-mobile-nav">
            <Link href="/" rel="home" className="main-logo">
              <img
                id="mobile-logo_header"
                src="/assets/images/logo/logo.png"
                data-retina="assets/images/logo/logo@2x.png"
              />
            </Link>
            <div className="mobile-nav-close" onClick={handleMobileMenu}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                fill="white"
                x="0px"
                y="0px"
                width="20px"
                height="20px"
                viewBox="0 0 122.878 122.88"
                enableBackground="new 0 0 122.878 122.88"
                xmlSpace="preserve"
              >
                <g>
                  <path d="M1.426,8.313c-1.901-1.901-1.901-4.984,0-6.886c1.901-1.902,4.984-1.902,6.886,0l53.127,53.127l53.127-53.127 c1.901-1.902,4.984-1.902,6.887,0c1.901,1.901,1.901,4.985,0,6.886L68.324,61.439l53.128,53.128c1.901,1.901,1.901,4.984,0,6.886 c-1.902,1.902-4.985,1.902-6.887,0L61.438,68.326L8.312,121.453c-1.901,1.902-4.984,1.902-6.886,0 c-1.901-1.901-1.901-4.984,0-6.886l53.127-53.128L1.426,8.313L1.426,8.313z" />
                </g>
              </svg>
            </div>
            <MobileMenu />
          </div>
        </div>
      </header>
    </>
  );
}
