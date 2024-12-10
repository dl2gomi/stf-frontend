import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAppKitAccount } from '@reown/appkit/react';
import { useERC20, useToken, useVault } from '@/hooks';
import { formatUnits, isAddress, parseUnits } from 'ethers';
import Toaster from '@/helpers/Toaster';

export default function WithdrawTab() {
  const [availFunds, setAvailFunds] = useState(0);
  const [addressTo, setAddressTo] = useState('');
  const [amount, setAmount] = useState('');

  const { contract: vaultContract, getProfitPool, withdraw } = useVault();
  const {
    contract: usdtContract,
    getBalance: getUSDTBalance,
    getDecimals,
  } = useERC20(process.env.NEXT_PUBLIC_USDT_ADDRESS);

  useEffect(() => {
    (async () => {
      if (usdtContract && vaultContract) {
        setAvailFunds(
          formatUnits(
            (await getUSDTBalance(await vaultContract.getAddress())) - (await getProfitPool()),
            await getDecimals()
          )
        );
      }
    })();
  }, [vaultContract, usdtContract]);

  return (
    <>
      <div className="wrapper-content">
        <div className="inner-content" style={{ maxWidth: '100%', minHeight: '90vh' }}>
          <div className="heading-section">
            <h2 className="tf-title pb-30">Withdraw Funds</h2>
          </div>
          <div className="widget-edit mb-30 avatar">
            <div className="title">
              <h4 className="text-truncate">Available Funds to Withdraw: {availFunds}</h4>
              <i className="icon-keyboard_arrow_up" />
            </div>
            <form>
              <fieldset className="password">
                <label>To</label>
                <input
                  type="text"
                  placeholder="Enter an address to withdraw to"
                  name="addressTo"
                  tabIndex={2}
                  aria-required="true"
                  value={addressTo}
                  onChange={(e) => setAddressTo(e.target.value)}
                />
              </fieldset>
              <fieldset className="password">
                <label>Amount</label>
                <input
                  type="text"
                  placeholder="Enter an amount to withdraw"
                  name="amount"
                  tabIndex={2}
                  aria-required="true"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </fieldset>
              <div className="btn-submit">
                <button
                  className="w242 active mr-30"
                  onClick={(e) => {
                    e.preventDefault();
                    setAddressTo('');
                    setAmount('');
                  }}
                >
                  Cancel
                </button>
                <button
                  className="w242"
                  disabled={!addressTo || !amount}
                  onClick={async (e) => {
                    try {
                      e.preventDefault();
                      if (!isAddress(addressTo)) {
                        Toaster.warning('Invalid address format!');
                        return;
                      }

                      await withdraw(addressTo, parseUnits(amount, await getDecimals()));
                      setAvailFunds(
                        formatUnits(
                          (await getUSDTBalance(await vaultContract.getAddress())) - (await getProfitPool()),
                          await getDecimals()
                        )
                      );
                      setAddressTo('');
                      setAmount('');

                      Toaster.success('You have successfully withdrawn funds.');
                    } catch (error) {
                      Toaster.error(error?.reason ?? 'There was an error during execution.');
                    }
                  }}
                >
                  Withdraw
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
