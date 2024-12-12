import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAppKitAccount } from '@reown/appkit/react';
import { useERC20, useToken, useVault } from '@/hooks';
import { formatUnits, isAddress, parseUnits } from 'ethers';
import Toaster from '@/helpers/Toaster';
import { SpinLoading } from 'respinner';

export default function RewardsTab() {
  const { address, isConnected } = useAppKitAccount();
  const [rewardDetails, setRewardDetails] = useState([]);
  const [usdtDecimal, setUSDTDecimal] = useState(0);
  const [stfDecimal, setSTFDecimal] = useState(0);
  const [counter, setCounter] = useState(0);

  const [isClaiming, setClaiming] = useState({});

  const {
    contract: vaultContract,
    getTaxYears,
    getTaxDetail,
    getProfitAmount,
    getProfitClaimedAt,
    claimProfit,
    listAllClaims,
  } = useVault();
  const { contract: usdtContract, getDecimals: getUSDTDecimals } = useERC20(process.env.NEXT_PUBLIC_USDT_ADDRESS);
  const { contract: tokenContract, getDecimals, getBalance } = useToken();

  useEffect(() => {
    if (!address) return;
    if (!vaultContract) return;

    (async () => {
      try {
        const years = await listAllClaims(address);

        if (years) {
          setRewardDetails(
            (
              await Promise.all(
                years.map(async (year) => {
                  if (!year) return;

                  const detail = await getTaxDetail(year);
                  const claimedAt = await getProfitClaimedAt(address, year);
                  const claimedAmount = await getProfitAmount(address, year);
                  const balance = await getBalance(address);

                  if (balance === 0n) return;

                  return {
                    year,
                    cid: detail.cid,
                    docTime: new Date(Number(detail.timestamp) * 1000),
                    totalSupply: detail.currentTotalSupply,
                    totalProfit: detail.profit,
                    time: claimedAt !== 0n ? new Date(Number(claimedAt) * 1000) : null,
                    yourProfit:
                      claimedAt !== 0n
                        ? claimedAmount
                        : Math.floor((Number(balance) / Number(detail.currentTotalSupply)) * Number(detail.profit)),
                    yourSTF:
                      claimedAt !== 0n
                        ? Math.ceil(Number(claimedAmount) / Number(detail.profit)) * Number(detail.currentTotalSupply)
                        : balance,
                    perc:
                      claimedAt !== 0n
                        ? (Number(claimedAmount) * 100) / Number(detail.profit)
                        : (Number(balance) * 100) / Number(detail.currentTotalSupply),
                  };
                })
              )
            ).filter((ele) => ele !== undefined)
          );
        }
      } catch (error) {
        Toaster.warning(error?.reason ?? error?.message ?? 'Something went wrong!');
      }
    })();
  }, [vaultContract, counter, address]);

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

  return (
    <>
      <div className="wrapper-content">
        <div className="inner-content" style={{ maxWidth: '100%', minHeight: '90vh' }}>
          <div className="heading-section">
            <h2 className="tf-title pb-30">Claim Rewards</h2>
          </div>
          <div className="widget-content-tab pt-10">
            <div className="widget-tabs relative">
              <div className="widget-content-tab pt-10">
                <div className="widget-content-inner">
                  <div className="widget-table-ranking">
                    <div data-wow-delay="0s" className="wow fadeInUp table-ranking-heading">
                      <div className="column">
                        <h3>Tax Document</h3>
                      </div>
                      <div className="column">
                        <h3>Total Profit</h3>
                      </div>
                      <div className="column">
                        <h3>Share Date</h3>
                      </div>
                      <div className="column">
                        <h3>Total STF(timed)</h3>
                      </div>
                      <div className="column">
                        <h3>Your STF(timed)</h3>
                      </div>
                      <div className="column">
                        <h3>Share %</h3>
                      </div>
                      <div className="column">
                        <h3>Your Profit</h3>
                      </div>
                      <div className="column">
                        <h3>Claim</h3>
                      </div>
                    </div>
                    <div className="table-ranking-content">
                      {rewardDetails.length === 0 && (
                        <div data-wow-delay="0s" className="wow fadeInUp fl-row-ranking justify-between">
                          <div className="justify-center flex" style={{ width: '100%' }}>
                            <span style={{ color: '#a0a0a0', fontSize: '16px' }}>No rewards to claim yet.</span>
                          </div>
                        </div>
                      )}
                      {rewardDetails.length > 0 &&
                        rewardDetails.map(
                          (detail) =>
                            detail && (
                              <div
                                data-wow-delay="0s"
                                className="wow fadeInUp fl-row-ranking justify-between"
                                key={detail.year}
                              >
                                <div className="td3">
                                  <div
                                    className="item-name"
                                    style={{ textDecoration: 'underline', cursor: 'pointer', color: 'lightgreen' }}
                                    onClick={() => {
                                      window.open(`${process.env.NEXT_PUBLIC_PINATA_URL}${detail.cid}`, '_blank');
                                    }}
                                  >
                                    {detail.year}
                                  </div>
                                </div>
                                <div className="td3">
                                  <h6 className="price gem">
                                    ${parseFloat(formatUnits(detail.totalProfit, usdtDecimal)).toLocaleString('en-US')}
                                  </h6>
                                </div>
                                <div className="td3">
                                  <h6 style={{ fontWeight: '400', fontFamily: 'arial' }}>
                                    {detail.docTime?.toLocaleDateString()}
                                  </h6>
                                </div>
                                <div className="td3">
                                  <h6>
                                    {parseFloat(formatUnits(detail.totalSupply, stfDecimal)).toLocaleString('en-US')}
                                  </h6>
                                </div>
                                <div className="td4">
                                  <h6>{parseFloat(formatUnits(detail.yourSTF, stfDecimal)).toLocaleString('en-US')}</h6>
                                </div>
                                <div className="td5">
                                  <h6 className="price gem">{detail.perc.toFixed(2)}%</h6>
                                </div>
                                <div className="td6 warning">
                                  <h6>
                                    $
                                    {parseFloat(formatUnits(BigInt(detail.yourProfit), stfDecimal)).toLocaleString(
                                      'en-US'
                                    )}
                                  </h6>
                                </div>
                                <div className="td7">
                                  <h6 style={{ fontWeight: '400', fontFamily: 'arial' }}>
                                    {detail.time ? (
                                      <div style={{ padding: '10px 0', lineHeight: '16px' }}>
                                        {detail.time.toLocaleDateString()}
                                      </div>
                                    ) : (
                                      <button
                                        className=""
                                        style={{
                                          height: '36px',
                                          lineHeight: '16px',
                                          overflow: 'hidden',
                                          width: '70px',
                                          padding: '8px',
                                        }}
                                        onClick={async (e) => {
                                          try {
                                            e.preventDefault();

                                            setClaiming({
                                              ...isClaiming,
                                              [detail.year]: true,
                                            });

                                            await claimProfit(detail.year);
                                            setCounter(counter + 1);

                                            Toaster.success('You have successfully claimed your profit.');
                                          } catch (error) {
                                            Toaster.error(error?.reason ?? 'There was an error during execution.');
                                          } finally {
                                            setClaiming({
                                              ...isClaiming,
                                              [detail.year]: false,
                                            });
                                          }
                                        }}
                                      >
                                        {!isClaiming[detail.year] && 'Claim'}
                                        {isClaiming[detail.year] && (
                                          <div>
                                            <SpinLoading
                                              size={20}
                                              count={10}
                                              barWidth={3}
                                              barHeight={5}
                                              borderRadius={1}
                                              fill="gray"
                                              className="align-middle mx-2"
                                            />
                                          </div>
                                        )}
                                      </button>
                                    )}
                                  </h6>
                                </div>
                              </div>
                            )
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
