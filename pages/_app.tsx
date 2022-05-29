import {
  getChainOptions,
  StaticWalletProvider,
  WalletControllerChainOptions,
  WalletProvider,
} from '@terra-money/wallet-provider';
import { AppProps } from 'next/app';
import React from 'react';

export default function App({
  Component,
  defaultNetwork,
  walletConnectChainIds,
}: AppProps & WalletControllerChainOptions) {
  const main = (
    <main>
      <header style={{ display: 'flex', gap: '1em' }}>
        <h1>💸 Anchor Withdrawer 💸</h1>
      </header>
      <pre>A simple tool for withdraw UST from Anchor protocol</pre>
      <p>
      This is a self-made app. I would suggest you to try withdraw a <b>small amount of aUST</b> first.
      <br />
      The source code is open for any contribution here <a href="https://github.com/istudko/anchor-withdrawer-app" target="_blank">https://github.com/istudko/anchor-withdrawer-app</a> (especially UI part 😂)
      </p>
      <Component />
      <br />
      <footer><i>Disclaimer: this is a self-made app. use at your own risk</i></footer>
    </main>
  );

  return typeof window !== 'undefined' ? (
    <WalletProvider
      defaultNetwork={defaultNetwork}
      walletConnectChainIds={walletConnectChainIds}
    >
      {main}
    </WalletProvider>
  ) : (
    <StaticWalletProvider defaultNetwork={defaultNetwork}>
      {main}
    </StaticWalletProvider>
  );
}

App.getInitialProps = async () => {
  const chainOptions = await getChainOptions();
  return {
    ...chainOptions,
  };
};
