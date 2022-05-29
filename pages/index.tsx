import ConnectWallet from './connect-wallet';
import Withdraw from './withdraw';

export default function Index() {
  return (
    <div>
      <ConnectWallet />
      <Withdraw />
    </div>
  );
}
