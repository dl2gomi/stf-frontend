import axios from 'axios';

export const uploadFileToPinata = async (file, taxYear) => {
  if (!file) {
    throw new Error('Select a file first!');
  }

  const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

  const formData = new FormData();
  formData.append('file', file);

  // Optional: Add metadata
  const metadata = JSON.stringify({
    name: file.name,
    keyvalues: {
      customKey: taxYear,
    },
  });
  formData.append('pinataMetadata', metadata);

  // Optional: Set custom options
  const pinataOptions = JSON.stringify({
    cidVersion: 1,
  });
  formData.append('pinataOptions', pinataOptions);

  try {
    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
        pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_API_SECRET_KEY,
      },
    });

    return response;
  } catch (error) {
    throw error;
  }
};
