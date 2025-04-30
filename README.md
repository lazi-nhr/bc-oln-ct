# supply-chain dApp

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Setup/Installation
Open the folder "frontend" in your terminal, e.g.:

```bash
cd /path/to/folder/frontend
```

If this your first time running the project or you have added some new code, run this:

### Build (do only once at the beginning)
```bash
frontend % npm install
```

### Run
Finally, you can run the application using this command:

```bash
frontend % npm run dev
```

### See Frontend
Now, open your web browser and navigate to `http://localhost:3000` to see the application running.

### Stop
Press CTRL+C in the terminal to stop the application from running.

## Content

src: main folder. here, we do the work.

pages: here are the individual sites.

contracts: smart contracts. these have to be deployed via Remix IDE.

hooks: in our case, here we interact with the blockchain, e.g. smart contracts.

public: media/images that are being used in user interface.

components: elements that are being reused across different pages.