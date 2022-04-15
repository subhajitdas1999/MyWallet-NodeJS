import { ethers } from 'ethers';
import dotenv from 'dotenv';
import { abi } from '../abis/MyERC20Token.json';

dotenv.config({ path: '../config.env' });


const sendTokens = async (senderPrivateKey=null,ReceiverAddress, tokenAmount) => {
  const provider = new ethers.providers.JsonRpcProvider(
    `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`
  );
  const privateKey =senderPrivateKey || process.env.ADMIN_PRIVATE_KEY;

  //who is going to sign the Transaction
  const signer = new ethers.Wallet(privateKey, provider);
  
    //token contract address
  const address = '0x75E50fe353A31609A1F7E8EDF681b4d6388FC73B';
  
  const contract = new ethers.Contract(address, abi, provider);
 
  const contractWithSigner = contract.connect(signer);

  //token decimal is 18
  const tx = await contractWithSigner.transfer(
    ReceiverAddress,
    ethers.utils.parseUnits(tokenAmount, 18)
  );

  return tx;
};

export default sendTokens;
