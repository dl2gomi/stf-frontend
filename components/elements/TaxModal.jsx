import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleRight } from '@fortawesome/free-regular-svg-icons';
import { useState } from 'react';
import { uploadFileToPinata } from '@/helpers/pinataHandler';
import Toaster from '@/helpers/Toaster';

export default function TaxModal({ isOn, handleTaxModal, taxYear, profitAmount, handleShare }) {
  const [step, setStep] = useState(0);
  const [cid, setCid] = useState('');
  const [file, setFile] = useState({});
  const [filename, setFilename] = useState('');
  const [isUploading, setUploading] = useState(false);

  return (
    <>
      <div className={`modal fade popup ${isOn ? 'show d-block' : ''} `} tabIndex={-1} role="dialog" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <button
              type="button"
              className="close"
              onClick={() => {
                setStep(0);
                setFilename('');
                setFile({});
                setCid('');
                setUploading(false);

                handleTaxModal();
              }}
            >
              <span aria-hidden="true">×</span>
            </button>
            <div className="modal-body">
              <h2>Share profit</h2>
              <p>You need to upload a tax document before sharing profit.</p>
              <div id="create">
                <ul className="widget-menu-tab" style={{ marginBottom: '20px' }}>
                  <li className={`item-title ${step === 0 ? 'active' : ''}`}>
                    <span className="inner">
                      <span className="order">1</span> Upload your PDF <i className="icon-keyboard_arrow_right" />
                    </span>
                  </li>
                  <li className={`item-title ${step === 1 ? 'active' : ''}`}>
                    <span className="inner">
                      <span className="order">2</span>Confirm
                    </span>
                  </li>
                </ul>
                <div className="widget-content-inner upload active">
                  <div className="wrap-upload w-full" style={{ display: step === 0 ? 'block' : 'none' }}>
                    <form action="#">
                      <label className="uploadfile">
                        <img src="assets/images/box-icon/upload.png" alt="" />
                        <h5>
                          {filename === ''
                            ? `Upload Tax File`
                            : `${filename.substring(filename.lastIndexOf('\\') + 1)}`}
                        </h5>
                        <p className="text">{filename === '' ? 'Choose' : 'Change'} your file to upload</p>
                        <div className="text filename">PDF, png, jpg files. Max 1Gb.</div>
                        <input
                          type="file"
                          name="file"
                          value={filename}
                          disabled={isUploading}
                          onChange={(e) => {
                            setFilename(e.target.value);
                            setFile(e.target.files[0]);
                          }}
                        />
                      </label>
                    </form>
                  </div>
                  <div className="wrap-upload w-full" style={{ display: step === 0 ? 'none' : 'block' }}>
                    <div className="row my-3" style={{ fontSize: '16px', lineHeight: '24px' }}>
                      <div className="col-4">IPFS Hash</div>
                      <div className="col-8 text-truncate" style={{ textDecoration: 'underline' }}>
                        <a href={`${process.env.NEXT_PUBLIC_PINATA_URL}${cid}`}>{cid}</a>
                      </div>
                      <div className="col-4">Tax Year</div>
                      <div className="col-8">{taxYear}</div>
                      <div className="col-4">Profit</div>
                      <div className="col-8">$ {profitAmount.toLocaleString('en-US')}</div>
                      <div className="col-4">File</div>
                      <div className="col-8">{filename.substring(filename.lastIndexOf('\\') + 1)}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  className="follow"
                  style={{ width: '240px' }}
                  disabled={filename === ''}
                  onClick={async (e) => {
                    try {
                      e.preventDefault();

                      if (step === 0) {
                        setUploading(true);
                        const result = await uploadFileToPinata(file, taxYear);

                        setUploading(false);
                        Toaster.success('Successfully uploaded a tax document.');

                        setCid(result?.data?.IpfsHash);
                        setStep(1);
                      } else {
                        handleShare(cid);
                      }
                    } catch (error) {
                      Toaster.error(error?.reason ?? error?.message ?? 'Something went wrong!');
                    }
                  }}
                >
                  {isUploading && <>Uploading...</>}
                  {!isUploading && (
                    <>
                      {step === 0 ? 'Next' : 'Confirm'} <FontAwesomeIcon icon={faArrowAltCircleRight} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`modal-backdrop fade  ${isOn ? 'd-block show' : 'd-none'}`}
        onClick={() => {
          console.log('sdf');
          handleTaxModal();
        }}
      />
    </>
  );
}
