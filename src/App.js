import React from 'react';
import {
  // Web3ReactProvider,
  useWeb3React,
  // createWeb3ReactRoot,
  // UnsupportedChainIdError,
} from '@web3-react/core';
import { injected, network } from './connectors';
import MyComponent from './components/MyComponent';

export default function App() {
  console.log('useWeb3React > ', useWeb3React());
  // account: undefined
  // activate: ƒ (connector, onError, throwErrors)
  // active: false
  // chainId: undefined
  // connector: undefined
  // deactivate: ƒ ()
  // error: undefined
  // library: undefined
  // setError: ƒ (error)

  const { connector } = useWeb3React();
  console.log('connector > ', connector);

  console.log('injected > ', injected);
  // handleAccountsChanged: ƒ();
  // handleChainChanged: ƒ();
  // handleClose: ƒ();
  // handleNetworkChanged: ƒ();
  // supportedChainIds: (9)[(1, 3, 4, 5, 42, 56, 97, 137, 80001)];
  // _events: {}
  // _eventsCount: 0;
  // _maxListeners: undefined;
  //   __proto__: AbstractConnector
  // activate: ƒ activate()
  // constructor: ƒ InjectedConnector(kwargs)
  // deactivate: ƒ deactivate()
  // getAccount: ƒ getAccount()
  // getChainId: ƒ getChainId()
  // getProvider: ƒ getProvider()
  // handleAccountsChanged: ƒ handleAccountsChanged(accounts)
  // handleChainChanged: ƒ handleChainChanged(chainId)
  // handleClose: ƒ handleClose(code, reason)
  // handleNetworkChanged: ƒ handleNetworkChanged(networkId)
  // isAuthorized: ƒ isAuthorized()

  console.log('network > ', network);
  //   currentChainId: 1
  // providers: {1: MiniRpcProvider, 3: MiniRpcProvider, 4: MiniRpcProvider, 5: MiniRpcProvider, 42: MiniRpcProvider, 56: MiniRpcProvider, 97: MiniRpcProvider, 137: MiniRpcProvider, 80001: MiniRpcProvider}
  // supportedChainIds: (9) [1, 3, 4, 5, 42, 56, 97, 137, 80001]
  // _events: {}
  // _eventsCount: 0
  // _maxListeners: undefined
  // __proto__: AbstractConnector
  // activate: ƒ activate()
  // changeChainId: ƒ changeChainId(chainId)
  // constructor: ƒ NetworkConnector(_ref)
  // deactivate: ƒ deactivate()
  // getAccount: ƒ getAccount()
  // getChainId: ƒ getChainId()
  // getProvider: ƒ getProvider()

  return <MyComponent />;
}
