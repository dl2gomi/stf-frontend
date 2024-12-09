import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppKitAccount } from '@reown/appkit/react';
import { getAddress } from 'ethers';
import { useVault } from '@/hooks';
import Toaster from './Toaster';

export const forUser = (WrappedComponent) => {
  const Wrapper = (props) => {
    const router = useRouter();
    const { isConnected } = useAppKitAccount();

    useEffect(() => {
      if (!isConnected) {
        router.push('/'); // Redirect to login if not authenticated
      }
    }, [router, isConnected]);

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export const forOwner = (WrappedComponent) => {
  const Wrapper = (props) => {
    const router = useRouter();
    const { contract, getRole } = useVault();
    const { address } = useAppKitAccount();

    useEffect(() => {
      if (contract)
        (async () => {
          if (address) {
            const role = await getRole(address);

            if (role !== 'owner') {
              Toaster.error('Only owner can access this feature.');
              router.push('/');
            }
          } else {
            // Toaster.error('Only owner can access this feature.');
            router.push('/');
          }
        })();
    }, [contract, address]);

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export const forOwnerOrCEO = (WrappedComponent) => {
  const Wrapper = (props) => {
    const router = useRouter();
    const { contract, getRole } = useVault();
    const { address } = useAppKitAccount();

    useEffect(() => {
      if (contract)
        (async () => {
          if (address) {
            const role = await getRole(address);

            if (role !== 'ceo' && role !== 'owner') {
              Toaster.error('Only owner or CEO can access this feature.');
              router.push('/');
            }
          } else {
            // Toaster.error('Only owner or CEO can access this feature.');
            router.push('/');
          }
        })();
    }, [contract, address]);

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export const forAdmin = (WrappedComponent) => {
  const Wrapper = (props) => {
    const router = useRouter();
    const { contract, getRole } = useVault();
    const { address } = useAppKitAccount();

    useEffect(() => {
      if (contract)
        (async () => {
          if (address) {
            const role = await getRole(address);

            if (role !== 'ceo' && role !== 'owner' && role != 'operator') {
              Toaster.error('Only admins can access this feature.');
              router.push('/');
            }
          } else {
            // Toaster.error('Only admins can access this feature.');
            router.push('/');
          }
        })();
    }, [contract, address]);

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};
