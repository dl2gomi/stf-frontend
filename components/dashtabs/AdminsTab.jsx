import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAppKitAccount } from '@reown/appkit/react';
import { useToken, useVault } from '@/hooks';
import { isAddress } from 'ethers';
import Toaster from '@/helpers/Toaster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

export default function AdminsTab() {
  const [role, setRole] = useState(undefined);
  const [newCEOAddress, setNewCEOAddress] = useState('');
  const [newOperAddress, setNewOperAddress] = useState('');
  const [ceoAddresses, setCEOAddresses] = useState([]);
  const [operatorAddresses, setOperatorAddresses] = useState([]);

  const { address } = useAppKitAccount();
  const {
    contract: vaultContract,
    getRole,
    getCEOAddresses,
    getOperatorAddresses,
    addCEO,
    addOperator,
    removeCEO,
    removeOperator,
  } = useVault();

  useEffect(() => {
    (async () => {
      if (vaultContract && address) {
        setRole(await getRole(address));
      }
    })();
  }, [vaultContract, address]);

  useEffect(() => {
    (async () => {
      if (vaultContract) {
        setCEOAddresses(await getCEOAddresses());
        setOperatorAddresses(await getOperatorAddresses());
      }
    })();
  }, [vaultContract]);

  return (
    <>
      <div className="wrapper-content">
        <div className="inner-content">
          <div className="heading-section">
            <h2 className="tf-title pb-30">Manage Admins</h2>
          </div>
          {(role === 'owner' || role === 'ceo') && (
            <div className="widget-edit mb-30 avatar">
              <div className="title">
                <h4 className="text-truncate">CEO Addresses</h4>
                <i className="icon-keyboard_arrow_up" />
              </div>
              <form>
                {ceoAddresses.map((addr, index) => (
                  <fieldset key={index} className="relative">
                    <input
                      type="text"
                      tabIndex={2}
                      aria-required="true"
                      disabled
                      value={addr}
                      style={{ backgroundColor: '#1f1f1f', color: '#cccccc' }}
                    />
                    <FontAwesomeIcon
                      icon={faTrashCan}
                      size="xl"
                      className="absolute"
                      style={{
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        padding: '10px',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = 'rgba(221, 242, 71, 1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = 'white';
                      }}
                      onClick={async () => {
                        try {
                          await removeCEO(addr);
                          setCEOAddresses(await getCEOAddresses());

                          Toaster.success(`${addr} has been removed from the CEO addresses.`);
                        } catch (error) {
                          Toaster.error(error?.reason ?? 'There was an error during execution.');
                        }
                      }}
                    />
                  </fieldset>
                ))}
                <fieldset>
                  <input
                    type="text"
                    placeholder="Enter a new CEO address"
                    tabIndex={2}
                    aria-required="true"
                    value={newCEOAddress}
                    onChange={(e) => setNewCEOAddress(e.target.value)}
                  />
                </fieldset>
                <div className="btn-submit">
                  <button
                    className="w242 active mr-30"
                    onClick={(e) => {
                      e.preventDefault();
                      setNewCEOAddress('');
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="w242"
                    disabled={!newCEOAddress}
                    onClick={async (e) => {
                      try {
                        e.preventDefault();
                        if (!isAddress(newCEOAddress)) {
                          Toaster.warning('Invalid address format!');
                          return;
                        }

                        await addCEO(newCEOAddress);
                        setCEOAddresses(await getCEOAddresses());
                        setNewCEOAddress('');

                        Toaster.success('New CEO address has been successfully added.');
                      } catch (error) {
                        Toaster.error(error?.reason ?? 'There was an error during execution.');
                      }
                    }}
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          )}
          {role === 'ceo' && (
            <div className="widget-edit mb-30 avatar">
              <div className="title">
                <h4 className="text-truncate">Operator Addresses</h4>
                <i className="icon-keyboard_arrow_up" />
              </div>
              <form>
                {operatorAddresses.map((addr, index) => (
                  <fieldset key={index} className="relative">
                    <input
                      type="text"
                      tabIndex={2}
                      aria-required="true"
                      disabled
                      value={addr}
                      style={{ backgroundColor: '#1f1f1f', color: '#cccccc' }}
                    />
                    <FontAwesomeIcon
                      icon={faTrashCan}
                      size="xl"
                      className="absolute"
                      style={{
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        padding: '10px',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = 'rgba(221, 242, 71, 1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = 'white';
                      }}
                      onClick={async () => {
                        try {
                          await removeOperator(addr);
                          setOperatorAddresses(await getOperatorAddresses());

                          Toaster.success(`${addr} has been removed from the Operator addresses.`);
                        } catch (error) {
                          Toaster.error(error?.reason ?? 'There was an error during execution.');
                        }
                      }}
                    />
                  </fieldset>
                ))}
                <fieldset>
                  <input
                    type="text"
                    placeholder="Enter a new Operator address"
                    tabIndex={2}
                    aria-required="true"
                    value={newOperAddress}
                    onChange={(e) => setNewOperAddress(e.target.value)}
                  />
                </fieldset>
                <div className="btn-submit">
                  <button
                    className="w242 active mr-30"
                    onClick={(e) => {
                      e.preventDefault();
                      setNewOperAddress('');
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="w242"
                    disabled={!newOperAddress}
                    onClick={async (e) => {
                      try {
                        e.preventDefault();
                        if (!isAddress(newOperAddress)) {
                          Toaster.warning('Invalid address format!');
                          return;
                        }

                        await addOperator(newOperAddress);
                        setOperatorAddresses(await getOperatorAddresses());
                        setNewOperAddress('');

                        Toaster.success('New operator address has been successfully added.');
                      } catch (error) {
                        Toaster.error(error?.reason ?? 'There was an error during execution.');
                      }
                    }}
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          )}
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
    </>
  );
}
