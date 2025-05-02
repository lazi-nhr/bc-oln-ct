# Supply-Chain dApp

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Setup/Installation
Firstly, you will need to clone this repository.

Open the  "frontend" folder in your terminal, e.g.:

```bash
cd /path/to/folder/dApp
```
Tipp: in your IDE, you can right-click the folder and open it in an integrated terminal.

### Build (do only once at the beginning)
If this is your first time running the project or you have added some new code, run this:

```bash
npm install
```

and before doing that remove the following files/folders:
- package-lock.json
- node_modules

### Run
Finally, you can run the application using this command:

```bash
npm run dev
```

### View
Now, open your web browser (preferrably Google Chrome) and navigate to `http://localhost:3000` to view the application.

### Blockchain
To successfully interact with the blockchain, e.g. smart contracts, a user needs to use a wallet. 

- Install the MetaMask plugin on Google Chrome. 
- Create a wallet. 
- Next, go to a Sepolia Faucet and ask for Test Token. (Note: You need 0.001 Ethereum funds in your wallet.)

### Stop
Press CTRL+C in the terminal to stop the application from running.

## Content

src: main folder. here, we do the work.

src/pages: here are the individual sites.

src/components: elements that are being reused across different pages.

src/contracts: smart contracts. these have to be deployed independently using Remix IDE.

src/hooks: here, we interact with the blockchain, e.g. smart contracts.

public: media/images that are being used in user interface.

## To-Do (use Google Chrome)

x product/[id].js: connect to new admin smart contract to see full product details
x product/[id].js: implement button functionality that directs to product/update/[id].js
x overview.js: get and display correct product list
o index.js: implement correct metamask activation/initialization (sam)
o hooks/setWeb3.js: call correct methods, infura (sam)
o components/AppBar.js: correctly call metamask (sam)
o register.js: implement full blockchain integration (lazi)
o register.js: elaborate role name system (xirui)
o product/create.js: implement full blockchain integration (lazi)
o product/create.js: elaborate status name system (xirui)
o product/update/[id].js: implement full blockchain integration (lazi)
o product/update/[id].js: elaborate status name system (xirui)
o add modifiers to smart contracts. role restrictions, user restrictions (lennart)
o 

o tests
o final report (jingyi)