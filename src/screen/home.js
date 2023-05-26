import '../App.css';
import { gContractAddress, gFromAddress, gToAddress } from '../constant/constant';
import { useEffect, useState } from 'react';

import TokenArtifact from "../constant/MyToken.json";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { Wheel } from 'react-custom-roulette'
import CustomButton from '../component/CustomButton';
import { faUpload, faArrowsRotate, faArrowsLeftRightToLine } from "@fortawesome/free-solid-svg-icons";
import TopBar from '../component/TopBar';
import Info from '../assets/info.png';
import CustomWheel from '../component/CustomWheel';


let web3 = new Web3('https://rpc-mumbai.maticvigil.com/');
const randomColors = [
  '#3fa576', 
  '#a5a5a5', 
  '#dfcb75', 
  '#5a9cfe', 
  '#b658de', 
  'yellow', 
  'red',  
  '#4fb988', 
  '#a5a5a5', 
  '#dfcb75', 
  '#5a9cfe', 
  '#b658de' 
]

function Home() {


  const [account, setAccount] = useState("");
  const [tokenList , setTokenList] = useState(null);

  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [tokenData, setTokenData] = useState(null);

  const [buttonExpand, setButtonExpand] = useState(false);
  const [spinState , setspinState] = useState(false)

  const handleSpinClick = () => {
    setspinState(!spinState)
  }

  const handleExpandClick = () => {
    setButtonExpand(true);
  }

  const handleStayClick = () => {
    setButtonExpand(false);
  }

  
  useEffect(() => {
    getNFTs().then((myTokens) => {
      setTokenList([...myTokens])
      let tempData = []
      myTokens.forEach((element, index) => {
        tempData.push(
          {
            option: element,
            style: { backgroundColor: randomColors[index], textColor: 'black' }
          }
        )
      });
      console.log('tempdaaga', tempData)
      setTokenData([...tempData])
    })
  },[])

  async function getUserNFTs() {
    
    const nftContract = new web3.eth.Contract(TokenArtifact.abi, gContractAddress);
    return new Promise((resolve, reject) => {
      let myTokens = [];
      
      nftContract.methods.balanceOf(gFromAddress).call()
      .then((balance) => {
        console.log(balance)

        let promises = [];
        for (let i = 0; i < balance; i++) {
          let promise = nftContract.methods.tokenOfOwnerByIndex(gFromAddress, i).call()
            .then((tokenId) => {
              return nftContract.methods.tokenURI(tokenId).call()
                .then((uri) => {
                  console.log(`NFT ${tokenId}: ${uri}`);
                  myTokens.push("Token: " + tokenId);
                  console.log("myTokens", myTokens)
                });
            });
          promises.push(promise);
        }
        Promise.all(promises)
          .then(() => resolve(myTokens))
          .catch((err) => reject(err));
      });
    });
  }

  async function getNFTs() {
    
    const nftContract = new web3.eth.Contract(TokenArtifact.abi, gContractAddress);
    return new Promise((resolve, reject) => {
      let myTokens = [];
      
      nftContract.methods.balanceOf(gFromAddress).call()
      .then((balance) => {
        console.log(balance)

        let promises = [];
        for (let i = 0; i < balance; i++) {
          let promise = nftContract.methods.tokenOfOwnerByIndex(gFromAddress, i).call()
            .then((tokenId) => {
              return nftContract.methods.tokenURI(tokenId).call()
                .then((uri) => {
                  console.log(`NFT ${tokenId}: ${uri}`);
                  myTokens.push("Token: " + tokenId);
                  console.log("myTokens", myTokens)
                });
            });
          promises.push(promise);
        }
        Promise.all(promises)
          .then(() => resolve(myTokens))
          .catch((err) => reject(err));
      });
    });
  }

  async function requestFee() {
    let flag = true;
    const web3 = new Web3(window.ethereum);
    let transactionObject = {
      from: account,
      to: gFromAddress,
      value: web3.utils.toWei('0.1', 'ether')
    };
        
    // Send the transaction
    web3.eth.sendTransaction(transactionObject)
      .on('transactionHash', (hash) => {
        console.log('Transaction hash:', hash);
      })
      .on('receipt', (receipt) => {
        console.log('Transaction receipt:', receipt);
      })
      .on('error', (error) => {
        console.error('Transaction error:', error);
        flag = false;
      });
    return flag;
  }

  async function canExchangeToken() {
    let balance = await web3.eth.getBalance(account);
    if ( (balance / 10 ** 18) < 0.1 ) {
      return false;
    } 
    return true;
  }

  async function sendSignedTransaction() {


    canExchangeToken().then(result => {
      if (!result) {
        alert("Not enough");
        return;
      } else {
        requestFee()
      }
    })
    // let isAvailable = await canExchangeToken();
    // if (!isAvailable) {
    //   alert("Not enough");
    //   return;
    // } else {
    //   requestFee()
    // }
    // Set up the transaction parameters
    const gasLimit = web3.utils.toHex(500000);
    const gasPrice = web3.utils.toHex(20000000000); // 20 Gwei
    const nonce = await web3.eth.getTransactionCount(gFromAddress); // Replace with the sender's address

    // Set up the transaction data
    const contract = new web3.eth.Contract(TokenArtifact.abi, gContractAddress);
    const transferData = contract.methods.safeTransferFrom(gFromAddress, gToAddress, 8002).encodeABI();

    // Create the transaction object
    const txObject = {
      nonce: web3.utils.toHex(nonce),
      gasLimit: gasLimit,
      gasPrice: gasPrice,
      to: gContractAddress,
      value: '0x0',
      data: transferData,
    };

    // Sign the transaction with a private key
    const privateKey = '0x23866fb6e2d293a06458cb058d8b0d5e816ac33205ea3e0b054634b798d60779';
    const signedTx = await web3.eth.accounts.signTransaction(txObject, privateKey);

    // Send the signed transaction to the network
    web3.eth.sendSignedTransaction(signedTx.rawTransaction)
      .on('transactionHash', (hash) => {
        console.log(`Transaction hash: ${hash}`);
        alert(`Transaction hash: ${hash}`);
      })
      .on('receipt', (receipt) => {
        console.log(`Transaction receipt: ${JSON.stringify(receipt, null, 2)}`);
        alert(`Transaction receipt: ${JSON.stringify(receipt, null, 2)}`);
      })
      .on('error', (error) => {
        console.error(`Error sending transaction: ${error}`);
      });
  }

  async function connectToMetamask() {
    const provider = await detectEthereumProvider();
    if (provider) {
      const accounts = await provider.request({ method: "eth_requestAccounts" });
      // const account = accounts[0];
      setAccount(accounts[0]);

      console.log("Connected to network account:", account);

      const web3 = new Web3(provider);

      const networkId = await web3.eth.net.getId();
      console.log("Connected to network with ID:", networkId);
    } else {
      // Metamask not found, display an error message
      console.log("Metamask not found");
    }
  }

  const renderButtons = () => {
    return buttonExpand ? 
      (<>
      <CustomButton onClick={sendSignedTransaction} label="Swap" icon={faArrowsLeftRightToLine}></CustomButton>
      <CustomButton onClick={handleSpinClick} label="Spin" icon={faArrowsRotate}></CustomButton>
      <CustomButton onClick={handleStayClick} label="Stay" icon={faUpload}></CustomButton>
      </>) 
      : 
      (<CustomButton onClick={handleExpandClick} label="Swap your BB"></CustomButton>)
  }

  const render = () => {
    return true == true ? 
    (
      <div className="App">
        <TopBar handleConnection={connectToMetamask}/>
        <div className='bb-div' style={{display: 'flex', justifyContent: 'center'}}>
            <img src={Info} alt='Logo' style={{width: '1.3rem', height: '1.3rem', marginRight: '2rem'}}></img>
            {renderButtons()}
        </div>
        <CustomWheel spin={spinState} />
      </div>
    ) 
    : 
    (<></>)
  }
  return ( 
    <>
        {render()}
    </>
  );
}

export default Home;