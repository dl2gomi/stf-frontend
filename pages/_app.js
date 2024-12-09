import Preloader from '@/components/elements/Preloader';
import { useEffect, useState } from 'react';
// import 'swiper/css';
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import 'swiper/css/free-mode';
import AddClassBody from '@/components/elements/AddClassBody';
import '/public/assets/css/style.css';
import '/public/assets/css/responsive.css';
import 'react-toastify/dist/ReactToastify.css';
import ContextProvider from '@/contexts';
import { ToastContainer } from 'react-toastify';

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  return (
    <>
      <ContextProvider>
        <ToastContainer theme="colored" />
        {!loading ? (
          <>
            <AddClassBody />
            <Component {...pageProps} />
          </>
        ) : (
          <Preloader />
        )}
      </ContextProvider>
    </>
  );
}

export default MyApp;
