import { Menu } from '@headlessui/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import BidModal from '../elements/BidModal';
import AutoSlider1 from '../slider/AutoSlider1';
import AutoSlider2 from '../slider/AutoSlider2';

import CounterUp from '../elements/CounterUp';
import { useERC20, useToken, useVault } from '@/hooks';
import { useAppKitAccount } from '@reown/appkit/react';
import { formatUnits, parseUnits } from 'ethers';
import Toaster from '@/helpers/Toaster';
import invest from '@/pages/invest';

export default function InvestTab() {
  const { address, isConnected } = useAppKitAccount();
  const { contract: vaultContract, getRole, getTokenPrice, invest } = useVault();
  const { contract: tokenContract, getTotalSupply, getBalance, getDecimals } = useToken();
  const {
    contract: usdtContract,
    approve,
    getDecimals: getUSDTDecimals,
    getBalance: getUSDTBalance,
  } = useERC20(process.env.NEXT_PUBLIC_USDT_ADDRESS);

  const [totalInvest, setTotalInvest] = useState(0);
  const [yourInvest, setYourInvest] = useState(0);
  const [yourBalance, setYourBalance] = useState(0);
  const [tokenPrice, setTokenPrice] = useState(0);

  const [amount, setAmount] = useState('');
  const [stf, setStf] = useState('');

  const [counter, setCounter] = useState(0);

  useEffect(() => {
    (async () => {
      if (isConnected && tokenContract && vaultContract && address) {
        const balance = await getBalance(address);
        const price = await getTokenPrice();
        const totalToken = await getTotalSupply();
        const decimal = await getDecimals();

        setTotalInvest(formatUnits(totalToken * price, Number(decimal)));
        setYourInvest(formatUnits(balance * price, Number(decimal)));
        setYourBalance(formatUnits(balance, Number(decimal)));
        setTokenPrice(price);
      }
    })();
  }, [isConnected, address, tokenContract, vaultContract, counter]);

  useEffect(() => {
    try {
      if (isNaN(parseFloat(amount))) {
        setStf('');
        return;
      }
      if (tokenPrice > 0n) setStf((parseFloat(amount) / Number(tokenPrice)).toString());
    } catch (error) {
      console.error(error);
      Toaster.error(error?.reason ?? 'There was an error during execution.');
    }
  }, [amount]);

  return (
    <>
      <div className="wrapper-content">
        <div className="inner-content">
          <div className="mb-3">
            <div className="counter__body">
              <div className="counter">
                <div className="number-counter">
                  <span className="number" data-speed={1000} data-to={15} data-inviewport="yes">
                    <CounterUp count={Math.ceil(totalInvest / 1000)} time={1} />
                  </span>
                  K+
                </div>
                <h6 className="title">Invested in Total</h6>
              </div>
              <div className="counter">
                <div className="number-counter">
                  <span className="number" data-speed={1000} data-to={217} data-inviewport="yes">
                    <CounterUp count={yourInvest} time={1} />
                  </span>
                </div>
                <h6 className="title">Invested by You</h6>
              </div>
              <div className="counter">
                <div className="number-counter">
                  <span className="number" data-speed={1000} data-to={37} data-inviewport="yes">
                    <CounterUp count={yourBalance} time={1} />
                  </span>
                </div>
                <h6 className="title">Your STF</h6>
              </div>
            </div>
            <div className="box-icon-wrap" style={{ gridTemplateColumns: 'none' }}>
              <div className="tf-box-icon style-1 relative m-0">
                <p className="text-center">Please invest more funds and get greater rewards.</p>
              </div>
            </div>
          </div>
          <div className="widget-edit mb-30 profile">
            <div className="title">
              <h4>Invest and buy STF tokens</h4>
              <i className="icon-keyboard_arrow_up" />
            </div>
            <form className="comment-form" noValidate="novalidate">
              <div className="flex gap30">
                <fieldset className="name">
                  <label>Invest Amount</label>
                  <input
                    type="text"
                    placeholder="How much will you invest?"
                    tabIndex={2}
                    aria-required="true"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                    }}
                  />
                </fieldset>
                <fieldset className="name">
                  <label>STF Token Amount</label>
                  <input type="text" placeholder="STF Amount" tabIndex={2} disabled aria-required="true" value={stf} />
                </fieldset>
              </div>
              <div className="btn-submit">
                <button
                  className="w242 active mr-30"
                  onClick={(e) => {
                    e.preventDefault();
                    setAmount('');
                    setStf('');
                  }}
                >
                  Cancel
                </button>
                <button
                  className="w242"
                  disabled={amount.trim() === ''}
                  onClick={async (e) => {
                    try {
                      e.preventDefault();

                      if (!amount || parseFloat(amount) === 0) {
                        Toaster.warning('Invest amount should be valid value.');
                        return;
                      }

                      if ((await getUSDTBalance(address)) < parseUnits(amount, await getUSDTDecimals())) {
                        Toaster.warning('You have insufficient funds.');
                        return;
                      }

                      // approve
                      await approve(await vaultContract.getAddress(), parseUnits(amount, await getUSDTDecimals()));

                      // invest
                      await invest(amount);

                      // trigger counter event
                      setCounter(counter + 1);

                      // reset the values
                      setAmount('');

                      Toaster.success('You have successfully invested and got STF tokens.');
                    } catch (error) {
                      Toaster.error(error?.reason ?? 'There was an error during execution.');
                    }
                  }}
                >
                  Invest
                </button>
              </div>
            </form>
          </div>
        </div>
        {/* <div className="side-bar">
          <div className="widget widget-recently">
            <h5 className="title-widget">Recently added</h5>
            <div className="card-small-main">
              <img src="assets/images/blog/sidebar-05.jpg" alt="" />
              <div className="card-bottom">
                <h5>
                  <Link href="#">Photography</Link>
                </h5>
                <span className="date">16hr ago</span>
              </div>
            </div>
            <div className="card-small">
              <div className="author">
                <img src="assets/images/blog/sidebar-06.jpg" alt="" />
                <div className="info">
                  <h6>
                    <Link href="#">Propw</Link>
                  </h6>
                  <p>
                    <Link href="#">@themes</Link>
                  </p>
                </div>
              </div>
              <span className="date">Mon, 08 May </span>
            </div>
            <div className="card-small">
              <div className="author">
                <img src="assets/images/blog/sidebar-07.jpg" alt="" />
                <div className="info">
                  <h6>
                    <Link href="#">Propw</Link>
                  </h6>
                  <p>
                    <Link href="#">@themes</Link>
                  </p>
                </div>
              </div>
              <span className="date">Mon, 08 May </span>
            </div>
            <div className="card-small">
              <div className="author">
                <img src="assets/images/blog/sidebar-08.jpg" alt="" />
                <div className="info">
                  <h6>
                    <Link href="#">Propw</Link>
                  </h6>
                  <p>
                    <Link href="#">@themes</Link>
                  </p>
                </div>
              </div>
              <span className="date">Mon, 08 May </span>
            </div>
          </div>
          <div className="widget widget-creators">
            <div className="flex items-center justify-between">
              <h5 className="title-widget">Top Creators</h5>
              <Link className="see-all" href="#">
                See all
              </Link>
            </div>
            <div className="widget-creators-item flex items-center mb-20">
              <div className="order">1. </div>
              <div className="author flex items-center flex-grow">
                <img src="assets/images/avatar/avatar-small-01.png" alt="" />
                <div className="info">
                  <h6>
                    <Link href="#">Brooklyn Simmons</Link>
                  </h6>
                  <span>
                    <Link href="#">@themes</Link>
                  </span>
                </div>
              </div>
              <button className="follow">Follow</button>
            </div>
            <div className="widget-creators-item flex items-center mb-20">
              <div className="order">2. </div>
              <div className="author flex items-center flex-grow">
                <img src="assets/images/avatar/avatar-small-02.png" alt="" />
                <div className="info">
                  <h6>
                    <Link href="#">Brooklyn Simmons</Link>
                  </h6>
                  <span>
                    <Link href="#">@themes</Link>
                  </span>
                </div>
              </div>
              <button className="follow">Follow</button>
            </div>
            <div className="widget-creators-item flex items-center mb-20">
              <div className="order">3. </div>
              <div className="author flex items-center flex-grow">
                <img src="assets/images/avatar/avatar-small-03.png" alt="" />
                <div className="info">
                  <h6>
                    <Link href="#">Brooklyn Simmons</Link>
                  </h6>
                  <span>
                    <Link href="#">@themes</Link>
                  </span>
                </div>
              </div>
              <button className="follow">Follow</button>
            </div>
            <div className="widget-creators-item flex items-center mb-20">
              <div className="order">4. </div>
              <div className="author flex items-center flex-grow">
                <img src="assets/images/avatar/avatar-small-04.png" alt="" />
                <div className="info">
                  <h6>
                    <Link href="#">Brooklyn Simmons</Link>
                  </h6>
                  <span>
                    <Link href="#">@themes</Link>
                  </span>
                </div>
              </div>
              <button className="follow">Follow</button>
            </div>
            <div className="widget-creators-item flex items-center">
              <div className="order">5. </div>
              <div className="author flex items-center flex-grow">
                <img src="assets/images/avatar/avatar-small-01.png" alt="" />
                <div className="info">
                  <h6>
                    <Link href="#">Brooklyn Simmons</Link>
                  </h6>
                  <span>
                    <Link href="#">@themes</Link>
                  </span>
                </div>
              </div>
              <button className="follow">Follow</button>
            </div>
          </div>
          <div className="widget widget-coins">
            <h5 className="title-widget">Trending coins</h5>
            <div className="widget-coins-item flex items-center mb-20">
              <img src="assets/images/box-icon/coin-01.png" alt="" />
              <p>
                <Link href="#">Bitcoin</Link>
              </p>
            </div>
            <div className="widget-coins-item flex items-center mb-20">
              <img src="assets/images/box-icon/coin-02.png" alt="" />
              <p>
                <Link href="#">Ethereum</Link>
              </p>
            </div>
            <div className="widget-coins-item flex items-center mb-20">
              <img src="assets/images/box-icon/coin-03.png" alt="" />
              <p>
                <Link href="#">Cardano</Link>
              </p>
            </div>
            <div className="widget-coins-item flex items-center mb-20">
              <img src="assets/images/box-icon/coin-04.png" alt="" />
              <p>
                <Link href="#">Solana</Link>
              </p>
            </div>
            <div className="widget-coins-item flex items-center">
              <img src="assets/images/box-icon/coin-05.png" alt="" />
              <p>
                <Link href="#">Litecoin</Link>
              </p>
            </div>
          </div>
          <div className="widget widget-history">
            <div className="flex items-center justify-between">
              <h5 className="title-widget">History</h5>
              <Link className="see-all" href="#">
                See all
              </Link>
            </div>
            <div className="widget-creators-item flex items-center mb-20">
              <div className="author flex items-center flex-grow">
                <img src="assets/images/avatar/avatar-small-01.png" alt="" />
                <div className="info">
                  <h6>
                    <Link href="#">Lorem NFT sold</Link>
                  </h6>
                  <span>
                    <Link href="#">Sold at 1.32 ETH</Link>
                  </span>
                </div>
              </div>
              <span className="time">Just now</span>
            </div>
            <div className="widget-creators-item flex items-center mb-20">
              <div className="author flex items-center flex-grow">
                <img src="assets/images/avatar/avatar-small-02.png" alt="" />
                <div className="info">
                  <h6>
                    <Link href="#">New NFT uploaded</Link>
                  </h6>
                  <span>
                    <Link href="#">By Marisol Pena</Link>
                  </span>
                </div>
              </div>
              <span className="time">1hr ago</span>
            </div>
            <div className="widget-creators-item flex items-center mb-20">
              <div className="author flex items-center flex-grow">
                <img src="assets/images/avatar/avatar-small-03.png" alt="" />
                <div className="info">
                  <h6>
                    <Link href="#">You followed a creator</Link>
                  </h6>
                  <span>
                    <Link href="#">Jane Cooper</Link>
                  </span>
                </div>
              </div>
              <span className="time">2hr ago</span>
            </div>
            <div className="widget-creators-item flex items-center mb-20">
              <div className="author flex items-center flex-grow">
                <img src="assets/images/avatar/avatar-small-04.png" alt="" />
                <div className="info">
                  <h6>
                    <Link href="#">You placed a bid</Link>
                  </h6>
                  <span>
                    <Link href="#">Whirl wind NFT</Link>
                  </span>
                </div>
              </div>
              <span className="time">4hr ago</span>
            </div>
            <div className="widget-creators-item flex items-center">
              <div className="author flex items-center flex-grow">
                <img src="assets/images/avatar/avatar-small-01.png" alt="" />
                <div className="info">
                  <h6>
                    <Link href="#">You followed a creator</Link>
                  </h6>
                  <span>
                    <Link href="#">Courtney Henry</Link>
                  </span>
                </div>
              </div>
              <span className="time">16hr ago</span>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
}
