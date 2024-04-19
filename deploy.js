require("dotenv").config()
const ethers = require("ethers")
const fs = require("fs-extra");

async function main(){
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(
        process.env.PRIVATE_KEY, 
        provider);
    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf-8");
    const binary = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf-8");
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
    console.log("Deploying, please wait...")
    // deploying contract
    const contract = await contractFactory.deploy();
    // wait one block for transaction to be confirmed
    await contract.deployTransaction.wait(1);
    console.log(`Contract Address: ${contract.address}`)
    // get number
    // as retrieve is a view function, contract call will not cost any gas
    // view and pure functions if called outside of contract function call
    // will not cost any gas
    const currentFavouriteNumber = await contract.retrieve();
    // it will return a bignumber, which is a hex and not redable as solidity doesnot use decimal  places
    console.log(`Current Favourite Number: ${currentFavouriteNumber.toString()}`);
    // you get tx response after deploying
    // updating favouriteNumber
    const transactionResponse =  await contract.store("7")
    // you get tx receipt after certain block confirmation
    const transactionReceipt = await transactionResponse.wait(1);
    const updatedFavouriteNumber = await contract.retrieve();
    console.log(`Updated Favourite Number: ${updatedFavouriteNumber}`)
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
