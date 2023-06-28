import logo from './logo.svg';
import React from 'react';
import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [nftData, setNftData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  
  async function requestAccount() {
    setLoading(true);
    setError('');

    try {
      // Check if MetaMask extension exists
      if (window.ethereum) {
        console.log('Metamask Detected');

        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        setAddress(accounts[0]);
      } else {
        console.log('Metamask Not Detected');
      }
    } catch (e) {
      console.log(e);
      setError('An error occurred while connecting.');
    }

    setLoading(false);
  }

   // Function to handle the search bar input change
   const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Function to handle the NFT search
  const searchNft = async () => {
    if (!searchTerm) {
      setError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError('');

    try {
      //opensea API
    
    var openSeaHeaders = new Headers();
    openSeaHeaders.append('X-API-KEY', '36bcfeb8b7b848dd9eec125683d47078');

    var openSeaRequestOptions = {
      method: 'GET',
      headers: openSeaHeaders,
      redirect: 'follow',
    };

    const openSeaResponse = await fetch(
      `https://api.opensea.io/v2/orders/ethereum/seaport/listings?order_by=created_date&order_direction=desc`,
      openSeaRequestOptions
    );

    const openSeaData = await openSeaResponse.json();
    console.log('OpenSea Data:', openSeaData);


       // Magic Eden API
    const magicEdenUrl = 'https://api-mainnet.magiceden.dev/v2/collections/symbol/listings';
    const magicEdenOptions = {
      method: 'GET',
      headers: { accept: 'application/json' },
    };

    const magicEdenResponse = await fetch(magicEdenUrl, magicEdenOptions);
    const magicEdenData = await magicEdenResponse.json();
    console.log('Magic Eden Data:', magicEdenData);
    
    // CoinGecko NFT API
    const coingeckoUrl = 'https://api.coingecko.com/api/v3/nfts/list';
    const coingeckoResponse = await axios.get(coingeckoUrl);
    const coingeckoData = coingeckoResponse.data;
     console.log('CoinGecko Data:', coingeckoData);
   
    // Store the fetched NFT data in the state
    setNftData({ openSeaData, magicEdenData });

  } catch (error) {
    setError('An error occurred while fetching NFT data');
  }

  setLoading(false);
};


  useEffect(() => {
    requestAccount(); // Connect to MetaMask when the component mounts
  }, []); // Empty dependency array to run the effect only once

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={requestAccount} disabled={loading}>
          Connect
        </button>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {address && <h3>Wallet Address: {address}</h3>}

        {/* Search Bar */}
        <div>
          <input
            type="text"
            placeholder="Enter search term"
            value={searchTerm}
            onChange={handleInputChange}
          />
          <button onClick={searchNft} disabled={loading}>
            Search NFT
          </button>
        </div>

        {nftData && (
  <div>
    <h2>Search Results</h2>
    {nftData.openSeaData && nftData.openSeaData.orders.length > 0 ? (
      <div>
        {nftData.openSeaData.orders.map((order) => (
          <div key={order.order_hash}>
            <h3>Order Details</h3>
            <p>NFT Name: {order.maker_asset_bundle.assets[0].name}</p>
            <p>Minted Date: {order.maker_asset_bundle.assets[0].created_date}</p>
            {/* Display other order details as needed */}
  
            {order.maker && (
              <div>
                <h3>Maker Details</h3>
                <p>Ethereum Address: {order.maker.address}</p>
                {/* Display other maker details as needed */}
              </div>
            )}
  
            {order.maker_asset_bundle && order.maker_asset_bundle.assets.length > 0 && (
              <div>
                <h3>Assets</h3>
                {order.maker_asset_bundle.assets.map((asset) => (
                  <div key={asset.token}>
                    <p>Token: {asset.token}</p>
                    <img src={asset.image_url} alt={asset.name} />
                    {/* Display other asset details as needed */}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    ) : (
      <p>No NFTs found</p>
    )}
  </div>
)}

      </header>
    </div>
  );
}

export default App;
