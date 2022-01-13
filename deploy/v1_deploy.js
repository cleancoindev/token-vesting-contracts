// deploy: npx hardhat deploy --network rinkeby --tags v1_deploy
// verify: npx hardhat etherscan-verify --network rinkeby

// script is built for hardhat-deploy plugin:
// A Hardhat Plugin For Replicable Deployments And Easy Testing
// https://www.npmjs.com/package/hardhat-deploy

// BN utils
const { toBN, print_amt } = require("../scripts/include/bn_utils");

// to be picked up and executed by hardhat-deploy plugin
module.exports = async function ({ deployments, getChainId, getNamedAccounts, getUnnamedAccounts }) {
	// print some useful info on the account we're using for the deployment
	const chainId = await getChainId();
	const [A0] = await web3.eth.getAccounts();
	let nonce = await web3.eth.getTransactionCount(A0);
	let balance = await web3.eth.getBalance(A0);

	// print initial debug information
	console.log("network %o %o", chainId, network.name);
	console.log("service account %o, nonce: %o, balance: %o ETH", A0, nonce, print_amt(balance));

	// read ALI address from named accounts
	let { ali: ali_address } = await getNamedAccounts();

	// deploy TokenVesting implementation v1 if required
	await deployments.deploy("TokenVesting_v1", {
		// address (or private key) that will perform the transaction.
		// you can use `getNamedAccounts` to retrieve the address you want by name.
		from: A0,
		contract: "TokenVesting",
		// the list of argument for the constructor (or the upgrade function in case of proxy)
		// args: [],
		// if set it to true, will not attempt to deploy even if the contract deployed under the same name is different
		skipIfAlreadyDeployed: true,
		// if true, it will log the result of the deployment (tx hash, address and gas used)
		log: true,
	});
	// get TokenVesting implementation v1 deployment details
	const token_vesting_v1_deployment = await deployments.get("TokenVesting_v1");
	const token_vesting_v1_contract = new web3.eth.Contract(token_vesting_v1_deployment.abi, token_vesting_v1_deployment.address);

	// prepare the initialization call bytes
	const token_vesting_proxy_init_data = token_vesting_v1_contract.methods.postConstruct(ali_address).encodeABI();

	// deploy TokenVesting Proxy
	await deployments.deploy("TokenVesting_Proxy", {
		// address (or private key) that will perform the transaction.
		// you can use `getNamedAccounts` to retrieve the address you want by name.
		from: A0,
		contract: "ERC1967Proxy",
		// the list of argument for the constructor (or the upgrade function in case of proxy)
		args: [token_vesting_v1_deployment.address, token_vesting_proxy_init_data],
		// if set it to true, will not attempt to deploy even if the contract deployed under the same name is different
		skipIfAlreadyDeployed: true,
		// if true, it will log the result of the deployment (tx hash, address and gas used)
		log: true,
	});
	// get TokenVesting proxy deployment details
	const token_vesting_proxy_deployment = await deployments.get("TokenVesting_Proxy");
	// print TokenVesting proxy deployment details
	await print_token_vesting_acl_details(A0, token_vesting_v1_deployment.abi, token_vesting_proxy_deployment.address);
};

// prints generic NFT info (name, symbol, etc.) + Ownable (owner)
async function print_token_vesting_acl_details(a0, abi, address) {
	const web3_contract = new web3.eth.Contract(abi, address);
	const owner = await web3_contract.methods.owner().call();
	const token = await web3_contract.methods.getToken().call();
	const amount = await web3_contract.methods.getVestingSchedulesTotalAmount().call();
	const count = await web3_contract.methods.getVestingSchedulesCount().call();
	const withdrawable = toBN(await web3_contract.methods.getWithdrawableAmount().call());
	console.log("successfully connected to TokenVesting at %o", address);
	console.table([
		{ key: "Owner", value: owner }, // 16
		{ key: "Token", value: token },
		{ key: "Total Amount", value: amount.toString(10) },
		{ key: "Count", value: count.toString(10) },
		{ key: "Withdrawable Amount", value: withdrawable.toString(10) }, // 2
	]);
	return { owner, token };
}

// Tags represent what the deployment script acts on. In general, it will be a single string value,
// the name of the contract it deploys or modifies.
// Then if another deploy script has such tag as a dependency, then when the latter deploy script has a specific tag
// and that tag is requested, the dependency will be executed first.
// https://www.npmjs.com/package/hardhat-deploy#deploy-scripts-tags-and-dependencies
module.exports.tags = ["v1_deploy", "deploy", "v1"];
