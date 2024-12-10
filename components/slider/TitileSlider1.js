import Link from 'next/link';
import { Autoplay, EffectCoverflow, FreeMode, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const swiperOptions = {
  modules: [Autoplay, Pagination, Navigation, FreeMode, EffectCoverflow],
  loop: true,
  spaceBetween: 0,
  slidesPerView: 1,
  centeredSlides: true,
  freeMode: true,
  watchSlidesProgress: true,
  effect: 'coverflow',
  grabCursor: true,
  coverflowEffect: {
    rotate: 15,
    stretch: 90,
    depth: 0,
    modifier: 1,
    scale: 0.9,
    slideShadows: false,
  },
  // autoplay: {
  //     delay: 2500,
  //     disableOnInteraction: false,
  // },
  navigation: {
    nextEl: '.next-3d',
    prevEl: '.prev-3d',
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    renderBullet: function (index, className) {
      return '<span className="' + +'">' + (index + 1) + '</span>';
    },
  },
  breakpoints: {
    500: {
      slidesPerView: 2,
    },
    991: {
      slidesPerView: 3,
    },
    1024: {
      slidesPerView: 3,
    },
    1200: {
      slidesPerView: 4,
    },
    1400: {
      slidesPerView: 5,
    },
  },
};

import Countdown from '@/components/elements/Countdown';
import { useState } from 'react';

export default function TitileSlider1() {
  const currentTime = new Date();
  const timerx = <Countdown endDateTime={currentTime.setDate(currentTime.getDate() + 2)} />;
  return (
    <>
      <Swiper {...swiperOptions} className="swiper swiper-3d-7 swiper-container-horizontal">
        <SwiperSlide>
          <div className="tf-card-box">
            <div className="card-media">
              <Link href="/">
                <img src="/assets/images/box-item/banner (1).jpg" alt="certificate" />
              </Link>
            </div>
            <div className="meta-info text-center">
              <h5 className="name">
                <Link href="/">Company Certificate</Link>
              </h5>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="tf-card-box">
            <div className="card-media">
              <Link href="/">
                <img src="/assets/images/box-item/banner (2).jpg" alt="landscape1" />
              </Link>
            </div>
            <div className="meta-info text-center">
              <h5 className="name">
                <Link href="/">City Landscape</Link>
              </h5>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="tf-card-box">
            <div className="card-media">
              <Link href="/">
                <img src="/assets/images/box-item/banner (3).jpg" alt="landscape2" />
              </Link>
            </div>
            <div className="meta-info text-center">
              <h5 className="name">
                <Link href="/">Night Sight</Link>
              </h5>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="tf-card-box">
            <div className="card-media">
              <Link href="/">
                <img src="/assets/images/box-item/banner (4).jpg" alt="landmark" />
              </Link>
            </div>
            <div className="meta-info text-center">
              <h5 className="name">
                <Link href="/">City Landmark</Link>
              </h5>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="tf-card-box">
            <div className="card-media">
              <Link href="/">
                <img src="/assets/images/box-item/banner (5).jpg" alt="Sunset" />
              </Link>
            </div>
            <div className="meta-info text-center">
              <h5 className="name">
                <Link href="/">City Sunset</Link>
              </h5>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="tf-card-box">
            <div className="card-media">
              <Link href="/">
                <img src="/assets/images/box-item/banner (6).jpg" alt="Foundation1" />
              </Link>
            </div>
            <div className="meta-info text-center">
              <h5 className="name">
                <Link href="/">Foundation in Night</Link>
              </h5>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="tf-card-box">
            <div className="card-media">
              <Link href="/">
                <img src="/assets/images/box-item/banner (7).jpg" alt="Foundation2" />
              </Link>
            </div>
            <div className="meta-info text-center">
              <h5 className="name">
                <Link href="/">Foundation in City</Link>
              </h5>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="tf-card-box">
            <div className="card-media">
              <Link href="/">
                <img src="/assets/images/box-item/banner (8).jpg" alt="lake" />
              </Link>
            </div>
            <div className="meta-info text-center">
              <h5 className="name">
                <Link href="/">Peaceful Lake</Link>
              </h5>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="tf-card-box">
            <div className="card-media">
              <Link href="/">
                <img src="/assets/images/box-item/banner (9).jpg" alt="building" />
              </Link>
            </div>
            <div className="meta-info text-center">
              <h5 className="name">
                <Link href="/">Company Building</Link>
              </h5>
            </div>
          </div>
        </SwiperSlide>
        {/* <SwiperSlide>
          <div className="tf-card-box">
            <div className="card-media">
              <Link href="#">
                <img src="/assets/images/box-item/banner-06.jpg" alt="" />
              </Link>
              <span className="wishlist-button icon-heart" />
              <div className="featured-countdown">{timerx}</div>
              <div className="button-place-bid">
                <a onClick={() => {}} href="#" className="tf-button">
                  <span>Place Bid</span>
                </a>
              </div>
            </div>
            <div className="meta-info text-center">
              <h5 className="name">
                <Link href="#">Dayco serpentine belt</Link>
              </h5>
              <h6 className="price gem">
                <i className="icon-gem" />
                0,34
              </h6>
            </div>
          </div>
        </SwiperSlide> */}
        <div className="swiper-pagination pagination-number" />
      </Swiper>
      <div className="swiper-button-next next-3d over" />
      <div className="swiper-button-prev prev-3d over" />
    </>
  );
}
