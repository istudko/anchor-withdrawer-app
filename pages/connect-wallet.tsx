import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
import React from 'react';

export default function ConnectWallet() {
  const {
    status,
    wallets,
    availableInstallTypes,
    availableConnections,
    connect,
    install,
    disconnect,
  } = useWallet();

  return (
    <div>
      <h1>1. Connect Wallet</h1>
      <section>
        <pre>{status}</pre>
      </section>
      <footer>
        {status === WalletStatus.WALLET_NOT_CONNECTED && (
          <>
            {availableInstallTypes.map((connectType) => (
              <button
                key={'install-' + connectType}
                onClick={() => install(connectType)}
              >
                Install {connectType}
              </button>
            ))}
            {availableConnections.map(
              ({ type, name, icon, identifier = '' }) => (
                <div>
                  <button
                    key={'connection-' + type + identifier}
                    onClick={() => connect(type, identifier)}
                  >
                    <img
                      src={icon}
                      alt={name}
                      style={{ width: '1em', height: '1em' }}
                    />
                    {name} [{identifier}]
                  </button>
                  <br /><br />
                </div>
              ),
            )}
          </>
        )}
        {status === WalletStatus.WALLET_CONNECTED && (
          <button onClick={() => disconnect()}>Disconnect</button>
        )}
      </footer>
    </div>
  );
}
