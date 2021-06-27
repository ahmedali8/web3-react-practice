import React, { useEffect, useState } from 'react';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector';
import { injected, network } from '../connectors';
import { useContract, useEagerConnect, useInactiveListener } from '../hooks';
import { formatEther } from '@ethersproject/units';
import { Spinner } from './Spinner';

import { contractAddress, ABI } from '../data';
import { fromWei } from '../utils';

const connectorsByName = {
  Injected: injected,
  Network: network,
};

function getErrorMessage(error) {
  if (error instanceof NoEthereumProviderError) {
    return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.';
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network.";
  } else if (error instanceof UserRejectedRequestErrorInjected) {
    return error.message;
    // return 'Please authorize this website to access your Ethereum account.';
  } else {
    console.error(error);
    return 'An unknown error occurred. Check the console for more details.';
  }
}

export default function MyComponent() {
  const context = useWeb3React();
  const {
    activate,
    setError,
    deactivate,

    connector,
    library,
    chainId,
    account,

    active,
    error,
  } = context;

  const contract = useContract(contractAddress, ABI, true);
  console.log('contract > ', contract);

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = useState();
  useEffect(() => {
    console.log('running');
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);

  // set up block listener
  const [blockNumber, setBlockNumber] = useState();
  useEffect(() => {
    console.log('running!');
    if (library) {
      let stale = false; // stale means cache

      console.log('fetching block number!');
      console.log(library);
      library
        .getBlockNumber()
        .then((blockNumber) => {
          if (!stale) {
            setBlockNumber(blockNumber);
          }
        })
        .catch(() => {
          if (!stale) {
            setBlockNumber(null);
          }
        });

      const updateBlockNumber = (blockNumber) => {
        setBlockNumber(blockNumber);
      };

      library.on('block', updateBlockNumber);

      return () => {
        library.removeListener('block', updateBlockNumber);
        stale = true;
        setBlockNumber(undefined);
      };
    }
  }, [library, chainId]);

  // fetch eth balance of the connected account
  const [ethBalance, setEthBalance] = useState();
  useEffect(() => {
    console.log('running');
    if (library && account) {
      let stale = false;

      library
        .getBalance(account)
        .then((balance) => {
          if (!stale) {
            setEthBalance(balance);
          }
        })
        .catch(() => {
          if (!stale) {
            setEthBalance(null);
          }
        });

      return () => {
        stale = true;
        setEthBalance(undefined);
      };
    }
  }, [library, account, chainId]);

  useEffect(async () => {
    if (contract) {
      const apy = await contract.apy();
      console.log('apy > ', fromWei(apy));
    }
  }, [contract]);

  return (
    <div style={{ padding: '1rem' }}>
      <h1 style={{ margin: '0', textAlign: 'right' }}>
        {active ? '🟢' : error ? '🔴' : '🟠'}
      </h1>
      <h3
        style={{
          display: 'grid',
          gridGap: '1rem',
          gridTemplateColumns: '1fr min-content 1fr',
          maxWidth: '20rem',
          lineHeight: '2rem',
          margin: 'auto',
        }}
      >
        <span>Chain Id</span>
        <span role="img" aria-label="chain">
          ⛓
        </span>
        <span>{chainId === undefined ? '...' : chainId}</span>

        <span>Block Number</span>
        <span role="img" aria-label="numbers">
          🔢
        </span>
        <span>
          {blockNumber === undefined
            ? '...'
            : blockNumber === null
            ? 'Error'
            : blockNumber.toLocaleString()}
        </span>

        <span>Account</span>
        <span role="img" aria-label="robot">
          🤖
        </span>
        <span>
          {account === undefined
            ? '...'
            : account === null
            ? 'None'
            : `${account.substring(0, 6)}...${account.substring(
                account.length - 4
              )}`}
        </span>

        <span>Balance</span>
        <span role="img" aria-label="gold">
          💰
        </span>
        <span>
          {ethBalance === undefined
            ? '...'
            : ethBalance === null
            ? 'Error'
            : `Ξ${parseFloat(formatEther(ethBalance)).toPrecision(4)}`}
        </span>
      </h3>
      <hr style={{ margin: '2rem' }} />
      <div
        style={{
          display: 'grid',
          gridGap: '1rem',
          gridTemplateColumns: '1fr 1fr',
          maxWidth: '20rem',
          margin: 'auto',
        }}
      >
        {Object.keys(connectorsByName).map((name) => {
          const currentConnector = connectorsByName[name];
          console.log('currentConnector > ', currentConnector);

          const activating = currentConnector === activatingConnector;
          const connected = currentConnector === connector;
          const disabled =
            !triedEager ||
            !!activatingConnector ||
            active ||
            (!!error && error?.message != 'The user rejected the request.');

          return (
            <button
              style={{
                height: '3rem',
                borderRadius: '1rem',
                borderColor: activating ? 'orange' : active ? 'green' : 'unset',
                cursor: disabled ? 'unset' : 'pointer',
                position: 'relative',
              }}
              disabled={disabled}
              key={name}
              onClick={async () => {
                setActivatingConnector(currentConnector);
                const pro = await activate(connectorsByName[name]);
                console.log('activate promise > ', pro);
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  color: 'black',
                  margin: '0 0 0 1rem',
                }}
              >
                {activating && (
                  <Spinner
                    color={'black'}
                    style={{ height: '25%', marginLeft: '-1rem' }}
                  />
                )}
                {active && connected && (
                  <span role="img" aria-label="check">
                    ✅
                  </span>
                )}
              </div>
              {name}
            </button>
          );
        })}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {(active || !!error) && (
          <button
            style={{
              height: '3rem',
              marginTop: '2rem',
              borderRadius: '1rem',
              borderColor: 'red',
              cursor: 'pointer',
            }}
            onClick={() => {
              deactivate();
            }}
          >
            Deactivate
          </button>
        )}

        {!!error && (
          <h4 style={{ marginTop: '1rem', marginBottom: '0' }}>
            {getErrorMessage(error)}
          </h4>
        )}
      </div>

      <hr style={{ margin: '2rem' }} />

      <div
        style={{
          display: 'grid',
          gridGap: '1rem',
          gridTemplateColumns: 'fit-content',
          maxWidth: '20rem',
          margin: 'auto',
        }}
      >
        {!!(library && account) && (
          <button
            style={{
              height: '3rem',
              borderRadius: '1rem',
              cursor: 'pointer',
            }}
            onClick={() => {
              library
                .getSigner(account)
                .signMessage('👋')
                .then((signature) => {
                  window.alert(`Success!\n\n${signature}`);
                })
                .catch((error) => {
                  window.alert(
                    'Failure!' +
                      (error && error.message ? `\n\n${error.message}` : '')
                  );
                });
            }}
          >
            Sign Message
          </button>
        )}
        {!!(connector === network && chainId) && (
          <button
            style={{
              height: '3rem',
              borderRadius: '1rem',
              cursor: 'pointer',
            }}
            onClick={() => {
              connector.changeChainId(chainId === 1 ? 4 : 1);
            }}
          >
            Switch Networks
          </button>
        )}
        {/* {connector === walletconnect && (
          <button
            style={{
              height: '3rem',
              borderRadius: '1rem',
              cursor: 'pointer',
            }}
            onClick={() => {
              connector.close();
            }}
          >
            Kill WalletConnect Session
          </button>
        )} */}
      </div>
    </div>
  );
}
