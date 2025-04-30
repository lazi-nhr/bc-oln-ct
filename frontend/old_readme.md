# supply-chain dApp

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have Docker installed on your machine. If you don't have Docker installed, you can download it from [here](https://www.docker.com/products/docker-desktop).

### Clone the Project

Clone this repository to your local machine.

### Building the Docker Image

Navigate into the project directory and build the Docker image:
```bash
cd SCLTokenization/paper/frontend
```
```bash
docker build -t d-app .
```


### Running the Docker Container

Run the Docker container with the following command:

```bash
docker run -p 3000:3000 -d d-app
```


Now, open your web browser and navigate to `http://localhost:3000` to see the application running.

## Stopping the Application

To stop the running Docker container, first get the container ID with `docker ps`, then stop it with `docker stop`:

```bash
docker ps
```
```bash
docker stop d-app
```

--------------------------------------------------------------------

Open the folder "frontend" in your terminal, e.g.:

```bash
cd /path/to/folder/frontend
```

If this your first time running the project or you have added some new code, run this:

### Build
```bash
frontend % npm install
```

### Run
Finally, you can run the application using this command:

```bash
frontend % npm run dev
```