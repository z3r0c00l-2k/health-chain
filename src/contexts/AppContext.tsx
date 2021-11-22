import { createContext, FC, useEffect, useState } from 'react';
import { useWeb3, Web3ContextState } from 'react-web3-hook';
import HealthChain from '../abis/HealthChain.json';
import { Contract } from 'web3-eth-contract';

type ContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  web3: Web3ContextState;
  contractAddress: string;
  availableNetworks: string[];
  currentUserData: UserData | null;
  healthChainContract: Contract | null;
  getUserData: () => void;
};

export const AppContext = createContext({} as ContextType);

export const AppContextProvider: FC = ({ children }) => {
  const web3Data = useWeb3();
  const { isWeb3, web3, networkId, currentAddress } = web3Data;

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [healthChainContract, setHealthChainContract] =
    useState<Contract | null>(null);
  const [contractAddress, setContractAddress] = useState('0x0');
  const [availableNetworks, setAvailableNetworks] = useState<string[]>([]);
  const [currentUserData, setCurrentUserData] = useState<UserData | null>(null);

  const toggleDarkMode = () => setIsDarkMode((prevState) => !prevState);

  useEffect(() => {
    if (!healthChainContract && isWeb3 && web3) {
      getDeployedNetworks();
      const networkData = (HealthChain.networks as any)[networkId];
      if (networkData) {
        const healthChain = new web3.eth.Contract(
          HealthChain.abi as any,
          networkData.address,
          { from: currentAddress }
        );
        setHealthChainContract(healthChain);
        setContractAddress(networkData.address);
      } else {
        alert('HealthChain contract not deployed to detected network.');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWeb3, web3, networkId]);

  const getDeployedNetworks = () => {
    const ethNetworks: { [key: string]: string } = {
      '1': 'Mainnet',
      '3': 'Ropsten',
      '4': 'Rinkeby',
      '5': 'Goerli',
    };
    const networkArray: string[] = [];
    for (const networkId in HealthChain.networks) {
      if (ethNetworks[networkId]) {
        networkArray.push(ethNetworks[networkId]);
      }
    }
    setAvailableNetworks(networkArray);
  };

  useEffect(() => {
    if (healthChainContract) {
      getUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [healthChainContract]);

  const getUserData = async () => {
    if (healthChainContract) {
      const userData: UserData = await healthChainContract.methods
        .getUserData()
        .call();
      if (userData.fullName) {
        setCurrentUserData(userData);
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        web3: web3Data,
        contractAddress,
        availableNetworks,
        currentUserData,
        healthChainContract,
        getUserData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
