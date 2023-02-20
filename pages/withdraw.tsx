import { Fee, MsgExecuteContract } from '@terra-money/terra.js';
import {
  CreateTxFailed,
  Timeout,
  TxFailed,
  TxResult,
  TxUnspecifiedError,
  useConnectedWallet,
  UserDenied,
} from '@terra-money/wallet-provider';
import React, { useCallback, useState } from 'react';

const aUSTContract = "terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu";
const anchorMarketContract = "terra1sepfj7s0aeg5967uxnfk4thzlerrsktkpelm5s";
const withdrawMsg = "eyJyZWRlZW1fc3RhYmxlIjp7fX0="; // base64 of {"redeem_stable":{}}

export default function Withdraw() {
  const [txResult, setTxResult] = useState<TxResult | null>(null);
  const [txError, setTxError] = useState<string | null>(null);

  const connectedWallet = useConnectedWallet();

  const proceed = useCallback(async (event) => {
    event.preventDefault()
    const data = {
      amount: event.target.amount.value,
    }
    if (!connectedWallet) {
      return;
    }

    if (connectedWallet.network.chainID != "columbus-5") {
      alert(`Please select "classic" network on your wallet`);
      return;
    }

    setTxResult(null);
    setTxError(null);

    connectedWallet
      .post({
        msgs: [
          new MsgExecuteContract(
            connectedWallet.walletAddress,
            aUSTContract,
            {
              send: {
                contract: anchorMarketContract,
                amount: data.amount,
                msg: withdrawMsg,
              },
            }
          )
        ],
        fee: new Fee(1000000, {"uusd": 1000000}),
      })
      .then((nextTxResult: TxResult) => {
        console.log(nextTxResult);
        setTxResult(nextTxResult);
      })
      .catch((error: unknown) => {
        if (error instanceof UserDenied) {
          setTxError('User Denied');
        } else if (error instanceof CreateTxFailed) {
          setTxError('Create Tx Failed: ' + error.message);
        } else if (error instanceof TxFailed) {
          setTxError('Tx Failed: ' + error.message);
        } else if (error instanceof Timeout) {
          setTxError('Timeout');
        } else if (error instanceof TxUnspecifiedError) {
          setTxError('Unspecified Error: ' + error.message);
        } else {
          setTxError(
            'Unknown Error: ' +
            (error instanceof Error ? error.message : String(error)),
          );
        }
      });
  }, [connectedWallet]);

  return (
    <div>
      <h1>2. Withdraw</h1>
      {connectedWallet?.availablePost && !txResult && !txError && (
        <div>
          <text>Filled in aUST amount in your wallet with 6 digit decimal without , or . symbol</text>
          <br />
          <text>Ex. fill 1000500500 for 1,000.500500 aUST</text>
          <br /><br />
          <form onSubmit={proceed}>
            <label htmlFor="amount">aUST amount:</label><br />
            <input
              type="number"
              id="amount"
              name="amount"
              required
              min="0"
              step="1"
              pattern="\d+"
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
            /><br />
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
      {txResult && (
        <>
          <pre>{JSON.stringify(txResult, null, 2)}</pre>
          {connectedWallet && txResult && (
            <div>
              <a
                href={`https://finder.terra.money/${connectedWallet.network.chainID}/tx/${txResult.result.txhash}`}
                target="_blank"
                rel="noreferrer"
              >
                Open Tx Result in Terra Finder
              </a>
            </div>
          )}
        </>
      )}

      {txError && <pre>{txError}</pre>}

      {(!!txResult || !!txError) && (
        <button
          onClick={() => {
            setTxResult(null);
            setTxError(null);
          }}
        >
          Clear result
        </button>
      )}
      {!connectedWallet && <p>Wallet not connected!</p>}
      {connectedWallet && !connectedWallet.availablePost && (
        <p>This connection does not support post()</p>
      )}
    </div>
  );
}
