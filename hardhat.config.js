require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-solhint");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-truffle5");
require("hardhat-abi-exporter");
require("hardhat-deploy");
require("hardhat-docgen");
require("hardhat-tracer");
require("hardhat-gas-reporter");
require("solidity-coverage");

const etherscanApiKey = getEtherscanApiKey();

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
	solidity: {
		version: "0.8.11",
		settings: {
			optimizer: {
				enabled: true,
				runs: 200,
			},
		},
	},
	networks: {
		hardhat: hardhatNetworkConfig(),
		mainnet: mainnetNetworkConfig(),
		rinkeby: rinkebyNetworkConfig(),
		goerli: goerliNetworkConfig(),
		bscMainnet: bscMainnetNetworkConfig(),
		bscTestnet: bscTestnetNetworkConfig(),
	},
	abiExporter: {
		path: "./build/abi",
		clear: true,
		flat: true,
		spacing: 2,
	},
	docgen: {
		path: "./docs",
		clear: true,
		runOnCompile: true,
	},
	gasReporter: {
		currency: "USD",
	},
	etherscan: {
		apiKey: `${etherscanApiKey}`,
	},
	// namedAccounts allows you to associate names to addresses and have them configured per chain
	// https://github.com/wighawag/hardhat-deploy#1-namedaccounts-ability-to-name-addresses
	namedAccounts: {
		// Alethea ERC20 (ALI)
		ali_token: {
			mainnet: "0x6B0b3a982b4634aC68dD83a4DBF02311cE324181",
			rinkeby: "0x088effA8E63DF55F3736f04ED25581326f9798BA",
		},
		treasury: {
			mainnet: "0x0000000000000000000000000000000000000000",
			rinkeby: "0x0000000000000000000000000000000000000000",
		},
	},
};

function hardhatNetworkConfig() {
	return {
		// set networkId to 0xeeeb04de as for all local networks
		chainId: 0xeeeb04de,
		// set the gas price to one for convenient tx costs calculations in tests
		gasPrice: 1,
		// London hard fork fix: impossible to set gas price lower than baseFeePerGas (875,000,000)
		initialBaseFeePerGas: 0,
		accounts: {
			count: 35,
		},
	};
}

function mainnetNetworkConfig() {
	let url = "https://mainnet.infura.io/v3/";
	let accountPrivateKey = "0x0000000000000000000000000000000000000000000000000000000000000000";
	if (process.env.MAINNET_ENDPOINT) {
		url = `${process.env.MAINNET_ENDPOINT}`;
	}

	if (process.env.MAINNET_PRIVATE_KEY) {
		accountPrivateKey = `${process.env.MAINNET_PRIVATE_KEY}`;
	}

	return {
		url: url,
		accounts: [accountPrivateKey],
	};
}

function rinkebyNetworkConfig() {
	let url = "https://rinkeby.infura.io/v3/";
	let accountPrivateKey = "0x0000000000000000000000000000000000000000000000000000000000000000";
	if (process.env.RINKEBY_ENDPOINT) {
		url = `${process.env.RINKEBY_ENDPOINT}`;
	}

	if (process.env.RINKEBY_PRIVATE_KEY) {
		accountPrivateKey = `${process.env.RINKEBY_PRIVATE_KEY}`;
	}

	return {
		url: url,
		accounts: [accountPrivateKey],
	};
}

function goerliNetworkConfig() {
	let url = "https://goerli.infura.io/v3/";
	let accountPrivateKey = "0x0000000000000000000000000000000000000000000000000000000000000000";
	if (process.env.GOERLI_ENDPOINT) {
		url = `${process.env.GOERLI_ENDPOINT}`;
	}

	if (process.env.GOERLI_PRIVATE_KEY) {
		accountPrivateKey = `${process.env.GOERLI_PRIVATE_KEY}`;
	}

	return {
		url: url,
		accounts: [accountPrivateKey],
	};
}

function bscMainnetNetworkConfig() {
	let url = "https://data-seed-prebsc-1-s1.binance.org:8545/";
	let accountPrivateKey = "0x0000000000000000000000000000000000000000000000000000000000000000";
	if (process.env.BSC_MAINNET_ENDPOINT) {
		url = `${process.env.BSC_MAINNET_ENDPOINT}`;
	}

	if (process.env.BSC_MAINNET_PRIVATE_KEY) {
		accountPrivateKey = `${process.env.BSC_MAINNET_PRIVATE_KEY}`;
	}

	return {
		url: url,
		accounts: [accountPrivateKey],
	};
}

function bscTestnetNetworkConfig() {
	let url = "https://data-seed-prebsc-1-s1.binance.org:8545/";
	let accountPrivateKey = "0x0000000000000000000000000000000000000000000000000000000000000000";
	if (process.env.BSC_TESTNET_ENDPOINT) {
		url = `${process.env.BSC_TESTNET_ENDPOINT}`;
	}

	if (process.env.BSC_TESTNET_PRIVATE_KEY) {
		accountPrivateKey = `${process.env.BSC_TESTNET_PRIVATE_KEY}`;
	}

	return {
		url: url,
		accounts: [accountPrivateKey],
	};
}

function getEtherscanApiKey() {
	let apiKey = "";
	if (process.env.ETHERSCAN_API_KEY) {
		apiKey = `${process.env.ETHERSCAN_API_KEY}`;
	}
	return apiKey;
}
