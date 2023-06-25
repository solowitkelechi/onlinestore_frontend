import {Routes, Route} from 'react-router-dom'
import {DAppProvider, Config, Sepolia, Goerli} from '@usedapp/core'
import { getDefaultProvider } from 'ethers';
import './App.css';
import Home from './components/Home'
import ProductContent from './routes/ProductContent'
import NoMatch from './routes/NoMatch'
import Layout from './components/Layout'
import Cart from './routes/Cart'
import Account from './routes/Account'
import Category from './routes/Category'
import PasswordReset from './routes/PasswordReset'
import AccountOverview from './routes/AccountOverview'
import {Linea, Base, Scroll, Taiko} from './CustomChain'

function App() {

  const config: Config = {
    readOnlyChainId: Sepolia.chainId,
    readOnlyUrls: {
      [Sepolia.chainId]: 'https://sepolia.infura.io/v3/dd85bc7d582d4eba92d544785bdc2097',
      [Linea.chainId]: 'https://rpc.goerli.linea.build',
      [Taiko.chainId]: 'https://rpc.test.taiko.xyz',
      [Base.chainId]: 'https://goerli.base.org',
      [Scroll.chainId]: 'https://scroll-alphanet.public.blastapi.io'
    },
    networks: [Sepolia, Linea, Taiko, Base, Scroll],
    notifications: {
      expirationPeriod: 0
    },
  }

  return (
    <DAppProvider config={config}>
      <Routes>
        <Route path="/" element={<Layout config={config}/>}>
          <Route index element={<Home/>}/>
          <Route path="/product/:slug" element={<ProductContent/>}/>
          <Route path="/products/:slug" element={<Category />} />
          <Route path="/account" element={<Account />} />
          <Route path ="/accountoverview" element={<AccountOverview/>} />
          <Route path="/cart" element={<Cart/> } />
          <Route path="/password-reset/:slug" element={<PasswordReset/>}/>
          <Route path="*" element={<NoMatch/>} />
        </Route>
      </Routes>
    </DAppProvider>
  );
}

export default App;
