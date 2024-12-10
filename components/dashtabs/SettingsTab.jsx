import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAppKitAccount } from '@reown/appkit/react';
import { useToken, useVault } from '@/hooks';
import { isAddress } from 'ethers';
import Toaster from '@/helpers/Toaster';

export default function SettingsTab() {
  const [role, setRole] = useState(undefined);
  const [vaultAddress, setVaultAddress] = useState(undefined);
  const [newVaultAddress, setNewVaultAddress] = useState('');
  const [maxSupply, setMaxSupply] = useState(undefined);
  const [newMaxSupply, setNewMaxSupply] = useState('');
  const [tokenPrice, setTokenPrice] = useState(undefined);
  const [newTokenPrice, setNewTokenPrice] = useState('');
  const [started, setStarted] = useState(false);

  const { address } = useAppKitAccount();
  const {
    contract: vaultContract,
    getRole,
    getTokenPrice,
    getMaxSupply,
    setTokenDetails,
    isStarted,
    startVault,
  } = useVault();
  const { contract: tokenContract, getVault, setVault } = useToken();

  useEffect(() => {
    (async () => {
      if (vaultContract && address) {
        setRole(await getRole(address));
      }
    })();
  }, [vaultContract, address]);

  useEffect(() => {
    (async () => {
      if (tokenContract) {
        setVaultAddress(await getVault());
      }
    })();
  }, [tokenContract]);

  useEffect(() => {
    (async () => {
      if (vaultContract) {
        setMaxSupply(await getMaxSupply());
        setTokenPrice(await getTokenPrice());
        setStarted(await isStarted());
      }
    })();
  }, [vaultContract]);

  return (
    <>
      <div className="wrapper-content">
        <div className="inner-content" style={{ maxWidth: '100%', minHeight: '90vh' }}>
          <div className="heading-section">
            <h2 className="tf-title pb-30">Settings</h2>
          </div>
          {role === 'owner' && (
            <div className="widget-edit mb-30 avatar">
              <div className="title">
                <h4 className="text-truncate">
                  Set Vault Address {`(Current: ${vaultAddress ? vaultAddress : 'Not set'})`}
                </h4>
                <i className="icon-keyboard_arrow_up" />
              </div>
              <form>
                <fieldset className="password">
                  <label>New Vault Address</label>
                  <input
                    type="text"
                    placeholder="Enter a new Vault address"
                    name="vaultAddress"
                    tabIndex={2}
                    aria-required="true"
                    value={newVaultAddress}
                    onChange={(e) => setNewVaultAddress(e.target.value)}
                  />
                </fieldset>
                <div className="btn-submit">
                  <button
                    className="w242 active mr-30"
                    onClick={(e) => {
                      e.preventDefault();
                      setNewVaultAddress('');
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="w242"
                    disabled={!newVaultAddress}
                    onClick={async (e) => {
                      try {
                        e.preventDefault();
                        if (!isAddress(newVaultAddress)) {
                          Toaster.warning('Invalid address format!');
                          return;
                        }

                        await setVault(newVaultAddress);
                        setVaultAddress(await getVault());
                        setNewVaultAddress('');

                        Toaster.success('The vault address has been successfully changed.');
                      } catch (error) {
                        Toaster.error(error?.reason ?? 'There was an error during execution.');
                      }
                    }}
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          )}
          <div className="widget-edit mb-30 profile">
            <div className="title">
              <h4>Token Supply and Price</h4>
              <i className="icon-keyboard_arrow_up" />
            </div>
            <form className="comment-form" noValidate="novalidate">
              <div className="flex gap30">
                <fieldset className="name">
                  <label>Maximum Supply {`(Current: ${maxSupply ?? '----'})`}</label>
                  <input
                    type="text"
                    placeholder="Enter the maximum supply"
                    tabIndex={2}
                    aria-required="true"
                    value={newMaxSupply}
                    onChange={(e) => setNewMaxSupply(e.target.value)}
                  />
                </fieldset>
                <fieldset className="name">
                  <label>STF Token Price {`(Current: ${tokenPrice ?? '----'})`}</label>
                  <input
                    type="text"
                    placeholder="Enter the STF price"
                    tabIndex={2}
                    aria-required="true"
                    value={newTokenPrice}
                    onChange={(e) => setNewTokenPrice(e.target.value)}
                  />
                </fieldset>
              </div>
              <div className="btn-submit">
                <button
                  className="w242 active mr-30"
                  onClick={(e) => {
                    e.preventDefault();
                    setNewMaxSupply('');
                    setNewTokenPrice('');
                  }}
                >
                  Cancel
                </button>
                <button
                  className="w242"
                  disabled={!newMaxSupply || !newTokenPrice}
                  onClick={async (e) => {
                    try {
                      e.preventDefault();
                      if (newMaxSupply <= maxSupply) {
                        Toaster.warning('New max supply should be greater than current one.');
                        return;
                      }

                      await setTokenDetails(newMaxSupply, newTokenPrice);
                      setMaxSupply(await getMaxSupply());
                      setTokenPrice(await getTokenPrice());
                      setNewMaxSupply('');
                      setNewTokenPrice('');

                      Toaster.success('The token details has been successfully set.');
                    } catch (error) {
                      Toaster.error(error?.reason ?? 'There was an error during execution.');
                    }
                  }}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
          <div className="widget-edit mb-30 setting">
            <div className="title">
              <h4>Start vault {`(Current: ${started ? 'Started' : 'Not started yet'})`}</h4>
              <i className="icon-keyboard_arrow_up" />
            </div>
            <form id="commentform" className="comment-form" noValidate="novalidate">
              <div className="notification-setting-item">
                <div className="content">
                  {!started && (
                    <p style={{ color: 'yellow' }}>Warning: Once the vault is started, it cannot be stopped.</p>
                  )}
                  {started && <p style={{ color: 'yellowgreen' }}>This vault has been active.</p>}
                </div>
              </div>
              {!started && (
                <div className="btn-submit">
                  <button
                    className="w242"
                    onClick={async (e) => {
                      try {
                        e.preventDefault();

                        await startVault();
                        setStarted(await isStarted());

                        Toaster.success('The vault has been successfully started.');
                      } catch (error) {
                        Toaster.error(error?.reason ?? 'There was an error during execution.');
                      }
                    }}
                  >
                    Start
                  </button>
                </div>
              )}
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
