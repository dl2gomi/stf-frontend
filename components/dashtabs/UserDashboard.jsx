import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAppKitAccount } from '@reown/appkit/react';
import { useERC20, useToken, useVault } from '@/hooks';
import { formatUnits, isAddress, parseUnits } from 'ethers';
import Toaster from '@/helpers/Toaster';
import CounterUp from '../elements/CounterUp';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register required chart.js modules
ChartJS.register(ArcElement, Tooltip, Legend);

export default function UserDashboard() {
  const { address, isConnected } = useAppKitAccount();
  const [usdtDecimal, setUSDTDecimal] = useState(0);
  const [totalReward, setTotalReward] = useState(0n);
  const [remainReward, setRemainReward] = useState(0n);

  const [totalInvest, setTotalInvest] = useState(0);
  const [yourInvest, setYourInvest] = useState(0);
  const [yourBalance, setYourBalance] = useState(0);

  const {
    contract: vaultContract,
    getTaxDetail,
    getProfitAmount,
    getProfitClaimedAt,
    getTokenPrice,
    listAllClaims,
  } = useVault();
  const { contract: usdtContract, getDecimals: getUSDTDecimals } = useERC20(process.env.NEXT_PUBLIC_USDT_ADDRESS);
  const { contract: tokenContract, getDecimals, getBalance, getTotalSupply } = useToken();

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
      }
    })();
  }, [isConnected, address, tokenContract, vaultContract]);

  useEffect(() => {
    if (!address) return;
    if (!vaultContract) return;

    (async () => {
      try {
        const years = await listAllClaims(address);
        let sum = 0n;
        let remain = 0n;

        if (years) {
          await Promise.all(
            years.map(async (year) => {
              if (!year) return;

              const detail = await getTaxDetail(year);
              const claimedAt = await getProfitClaimedAt(address, year);
              const claimedAmount = await getProfitAmount(address, year);
              const balance = await getBalance(address);

              if (balance === 0n) return;

              sum += claimedAmount;
              remain +=
                claimedAt === 0n
                  ? BigInt(Math.floor((Number(balance) / Number(detail.currentTotalSupply)) * Number(detail.profit)))
                  : 0n;
            })
          );
          setTotalReward(sum);
          setRemainReward(remain);
        }
      } catch (error) {
        Toaster.warning(error?.reason ?? error?.message ?? 'Something went wrong!');
      }
    })();
  }, [vaultContract, address]);

  useEffect(() => {
    (async () => {
      setUSDTDecimal(await getUSDTDecimals());
    })();
  }, [usdtContract]);

  return (
    <>
      <div className="wrapper-content">
        <div style={{ width: '100%' }}>
          <div className="tf-section-2">
            <div className="themesflat-container">
              <div className="row">
                <div className="col-12">
                  <div className="widget-income" style={{ backgroundColor: '#222' }}>
                    <div className="title">
                      Generate passive income with the platform <span className="tf-color">Santistef</span>
                    </div>
                    <p>Get started with the Santistef investment platform to earn passive income</p>
                    <div className="flex gap4">
                      <Link href="/invest" className="tf-button style-1 h50 w140">
                        Invest
                        <i className="icon-arrow-up-right2" />
                      </Link>
                      <Link href="/rewards" className="tf-button style-1 h50 w140">
                        Rewards
                        <i className="icon-arrow-up-right2" />
                      </Link>
                    </div>
                    <div className="image">
                      <img className="iphone" src="/assets/images/box-icon/iphone.png" alt="" />
                      <img className="icon-1" src="/assets/images/item-background/item11.png" alt="" />
                      <img className="icon-2" src="/assets/images/item-background/item12.png" alt="" />
                      <img className="icon-3" src="/assets/images/item-background/item13.png" alt="" />
                      <img className="icon-4" src="/assets/images/item-background/item14.png" alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="heading-section">
            <h2 className="tf-title pb-10" style={{ fontSize: '24px' }}>
              Investment Overview
            </h2>
          </div>
          <div className="row">
            <div className="col-lg-6 flex items-center justify-center">
              {parseFloat(totalInvest) === 0 && (
                <div style={{ fontSize: '48px', padding: '20px', color: 'yellow' }}>No investment yet</div>
              )}
              {parseFloat(totalInvest) !== 0 && (
                <div style={{ height: '500px', margin: 'auto' }} className="w-100 justify-center flex items-center">
                  <Pie
                    data={{
                      labels: ['Others', 'Yours'],
                      datasets: [
                        {
                          label: 'Investment Overview',
                          data: [totalInvest - yourInvest, yourInvest],
                          backgroundColor: ['#ebc14c', '#ddf247'],
                          borderWidth: 0,
                          hoverOffset: 10,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'right', // Position of the legend
                          labels: {
                            // This more specific font property overrides the global property
                            font: {
                              size: 18,
                            },
                          },
                        },
                        tooltip: {
                          enabled: true, // Display tooltips
                        },
                      },
                    }}
                  />
                </div>
              )}
            </div>
            <div className="col-lg-4 flex items-center">
              <div className="w-100">
                <div data-wow-delay="0s" className="wow fadeInRight product-item details w-100">
                  <h6>
                    <i className="icon-description" />
                    Investment Overview
                  </h6>
                  <i className="icon-keyboard_arrow_down" />
                  <div className="content">
                    <div className="details-item" style={{ height: '32px' }}>
                      <span className="text-truncate">Invested in total</span>
                      <span
                        className="number tf-color"
                        data-speed={1000}
                        data-to={15}
                        data-inviewport="yes"
                        style={{ fontSize: '32px' }}
                      >
                        <CounterUp count={Math.ceil(totalInvest / 1000)} time={1} />
                        K+
                      </span>
                    </div>
                    <div className="details-item" style={{ height: '32px' }}>
                      <span className="text-truncate">Invested by you</span>
                      <span className="number tf-color" data-speed={1000} data-to={217} data-inviewport="yes">
                        <CounterUp count={yourInvest} time={1} />
                      </span>
                    </div>
                    <div className="details-item" style={{ height: '32px' }}>
                      <span className="text-truncate">Your STF</span>
                      <span className="number tf-color" data-speed={1000} data-to={37} data-inviewport="yes">
                        <CounterUp count={yourBalance} time={1} />
                      </span>
                    </div>
                  </div>
                </div>
                <Link href="/invest" className="tf-button style-1 h50 w-100">
                  Invest more
                </Link>
              </div>
            </div>
          </div>
          <div className="heading-section pt-10">
            <h2 className="tf-title pb-10" style={{ fontSize: '24px' }}>
              Rewards Overview
            </h2>
            <Link href="/rewards" className="tf-button style-1 h50">
              Want to claim?
              <i className="icon-arrow-up-right2" />
            </Link>
          </div>
          <div className="widget-content-tab pt-10">
            <div className="widget-tabs relative">
              <div className="widget-content-tab pt-10">
                <div className="widget-content-inner">
                  <div
                    className="counter__body"
                    style={{ gridTemplateColumns: 'repeat(2, 1fr)', borderRadius: '20px' }}
                  >
                    <div className="counter">
                      <div className="number-counter">
                        <span className="number" data-speed={1000} data-to={15} data-inviewport="yes">
                          $ <CounterUp count={parseFloat(formatUnits(totalReward, usdtDecimal))} time={1} />
                        </span>
                      </div>
                      <h6 className="title">You have claimed</h6>
                    </div>
                    <div className="counter">
                      <div className="number-counter">
                        <span
                          className="number"
                          data-speed={1000}
                          data-to={217}
                          data-inviewport="yes"
                          style={{ color: 'yellowgreen' }}
                        >
                          $ <CounterUp count={parseFloat(formatUnits(remainReward, usdtDecimal))} time={1} />
                        </span>
                      </div>
                      <h6 className="title">You can claim</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
