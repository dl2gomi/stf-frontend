import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAppKitAccount } from '@reown/appkit/react';
import { useERC20, useToken, useVault } from '@/hooks';
import { formatUnits, isAddress, parseUnits } from 'ethers';
import Toaster from '@/helpers/Toaster';
import TaxModal from '@/components/elements/TaxModal';

export default function ProfitShareTab() {
  const { address, isConnected } = useAppKitAccount();
  const [taxYear, setTaxYear] = useState('');
  const [amount, setAmount] = useState('');
  const [taxDocs, setTaxDocs] = useState([]);
  const [profitPool, setProfitPool] = useState(0n);
  const [usdtDecimal, setUSDTDecimal] = useState(0);
  const [stfDecimal, setSTFDecimal] = useState(0);
  const [counter, setCounter] = useState(0);

  const [isTaxModal, setTaxModal] = useState(false);
  const handleTaxModal = () => setTaxModal(!isTaxModal);

  const { contract: vaultContract, getProfitPool, getTaxYears, getTaxDetail, depositProfit, uploadTaxDoc } = useVault();
  const {
    contract: usdtContract,
    getDecimals: getUSDTDecimals,
    getBalance: getUSDTBalance,
    approve,
  } = useERC20(process.env.NEXT_PUBLIC_USDT_ADDRESS);
  const { contract: tokenContract, getDecimals } = useToken();

  useEffect(() => {
    (async () => {
      const years = await getTaxYears();
      const pp = await getProfitPool();

      if (years) {
        setTaxDocs(
          await Promise.all(
            years.map(async (year, index) => {
              const detail = await getTaxDetail(year);

              return {
                year,
                totalSupply: detail.currentTotalSupply,
                profit: detail.profit,
                time: new Date(Number(detail.timestamp) * 1000),
              };
            })
          )
        );
      }

      setProfitPool(pp ?? 0n);
    })();
  }, [vaultContract, counter]);

  useEffect(() => {
    (async () => {
      setUSDTDecimal(await getUSDTDecimals());
    })();
  }, [usdtContract]);

  useEffect(() => {
    (async () => {
      setSTFDecimal(await getDecimals());
    })();
  }, [tokenContract]);

  const handleShareProfit = async (cid) => {
    try {
      if (amount <= 0) {
        Toaster.warning('Invalid profit amount!');
        return;
      }

      if ((await getUSDTBalance(address)) < parseUnits(amount, usdtDecimal)) {
        Toaster.warning('You have insufficient funds.');
        return;
      }

      // upload doc
      await uploadTaxDoc(taxYear, cid, amount);

      // approve
      await approve(await vaultContract.getAddress(), parseUnits(amount, usdtDecimal));

      // deposit
      await depositProfit(taxYear, amount);

      setTaxYear('');
      setAmount('');
      setCounter(counter + 1);

      handleTaxModal();
      Toaster.success('You have successfully shared profit.');
    } catch (error) {
      Toaster.error(error?.reason ?? error?.message ?? 'There was an error during execution.');
    }
  };

  return (
    <>
      <div className="wrapper-content">
        <div className="inner-content">
          <div className="heading-section">
            <h2 className="tf-title pb-30">Share Profits</h2>
          </div>
          <div className="widget-edit mb-30 avatar">
            <div className="title">
              <h4 className="text-truncate">
                New Profit Share{' '}
                {`(Current Profit Pool: ${parseFloat(formatUnits(profitPool, usdtDecimal)).toLocaleString('en-US')})`}
              </h4>
              <i className="icon-keyboard_arrow_up" />
            </div>
            <form>
              <fieldset>
                <label>Tax Year and some details</label>
                <input
                  type="text"
                  placeholder="Enter Tax Year"
                  tabIndex={2}
                  aria-required="true"
                  value={taxYear}
                  onChange={(e) => setTaxYear(e.target.value)}
                />
              </fieldset>
              <fieldset>
                <label>Amount</label>
                <input
                  type="text"
                  placeholder="Enter the amount of profit to share"
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
                    setTaxYear('');
                    setAmount('');
                  }}
                >
                  Cancel
                </button>
                <button
                  className="w242"
                  disabled={!taxYear || !amount}
                  onClick={(e) => {
                    e.preventDefault();
                    handleTaxModal();
                  }}
                >
                  Share Profit
                </button>
              </div>
            </form>
          </div>
          <ul className="widget-menu-tab">
            <li className="item-title active">
              <span className="inner">All Documents</span>
            </li>
          </ul>
          <div className="widget-content-tab pt-10">
            <div className="widget-content-inner" style={{ display: 'block' }}>
              <div className="widget-history">
                {taxDocs.length === 0 && (
                  <div className="widget-creators-item flex items-center">
                    <div className="author flex items-center flex-grow">
                      <div className="info">
                        <span>
                          <span style={{ color: '#a0a0a0' }}>Not shared any profit yet</span>
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                {taxDocs.length > 0 &&
                  taxDocs.map((doc) => (
                    <div className="widget-creators-item flex items-center" key={doc.year}>
                      <div className="author flex items-center flex-grow">
                        <div className="info">
                          <h6>
                            <Link href="#" style={{ fontFamily: 'Consolas' }}>
                              {doc.year}
                            </Link>
                          </h6>
                          <span>
                            <span style={{ color: '#a0a0a0' }}>{`Amount: ${parseFloat(
                              formatUnits(doc.profit, usdtDecimal)
                            ).toLocaleString('en-US')}, STF Total: ${parseFloat(
                              formatUnits(doc.totalSupply, stfDecimal)
                            ).toLocaleString('en-US')}, Time: ${doc.time.toLocaleString()}`}</span>
                          </span>
                        </div>
                      </div>
                      <button className="follow hidden-sm-down">Detail</button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
        <div className="side-bar">
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
        </div>
      </div>
      <TaxModal
        handleTaxModal={handleTaxModal}
        isOn={isTaxModal}
        taxYear={taxYear}
        profitAmount={amount}
        handleShare={handleShareProfit}
      />
    </>
  );
}
