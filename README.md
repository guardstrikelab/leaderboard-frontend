<p align="center"><img width="65%" src="docs/source/_static/img/arena.png"/></p>

------------------------------------------------------------------------------------------

![Static Badge](https://img.shields.io/badge/Arena-leaderboard_frontend-blue)
![workflow](https://img.shields.io/github/actions/workflow/status/guardstrikelab/leaderboard-frontend/ci.yaml)
![issues](https://img.shields.io/github/issues/guardstrikelab/leaderboard-frontend)
![issues-closed](https://img.shields.io/github/issues-closed/guardstrikelab/leaderboard-frontend)
![issues-pr](https://img.shields.io/github/issues-pr/guardstrikelab/leaderboard-frontend)
![last-commit](https://img.shields.io/github/last-commit/guardstrikelab/leaderboard-frontend)
![milestones](https://img.shields.io/github/milestones/all/guardstrikelab/leaderboard-frontend)
![repo-size](https://img.shields.io/github/repo-size/guardstrikelab/leaderboard-frontend)
![language](https://img.shields.io/github/languages/top/guardstrikelab/leaderboard-frontend)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://github.com/guardstrikelab/leaderboard-frontend/blob/main/LICENSE)
![stars](https://img.shields.io/github/stars/guardstrikelab/leaderboard-frontend)

[Arena](https://arena.synkrotron.ai) is an open source platform for [the CARLA Autonomous Driving Challenge](https://leaderboard.carla.org/get_started/) to evaluate and compare machine learning (ML) and artificial intelligence (AI) algorithms at scale, leaderboard-frontend is part of Arena, it is the [leaderboard-cloud](https://github.com/carla-simulator/leaderboard-cloud.git) visual management front-end project.


## Features

- **CLI support**: [arena-cli](https://github.com/guardstrikelab/arena-cli) is designed to extend the functionality of the Arena web application to your command line to make the platform more accessible and terminal-friendly.

- **Evaluation inside environments**: Arena lets participants submit code for their agent in the form of docker images which are evaluated against test environments on the evaluation server. During evaluation, the worker fetches the image, test environment, and the model snapshot and spins up a new container to perform evaluation.

- **Remote evaluation**: Certain large-scale challenges need special compute capabilities for evaluation. If the challenge needs extra computational power, challenge organizers can easily add their own cluster of worker nodes to process participant submissions while we take care of hosting the challenge, handling user submissions, and maintaining the leaderboard.

- **Portability**: Arena is designed with keeping in mind scalability and portability of such a system from the very inception of the idea. Most of the components rely heavily on open-source technologies – Docker, Django, Node.js, and PostgreSQL.

- **Faster evaluation**: We warm-up the worker nodes at start-up by importing the challenge code and pre-loading the dataset in memory. We also split the dataset into small chunks that are simultaneously evaluated on multiple cores. These simple tricks result in faster evaluation and reduces the evaluation time by an order of magnitude in some cases.

## Goal

Our ultimate goal is to build a centralized platform for the CARLA Autonomous Driving Leaderboard to host, participate in, and collaborate on autonomous driving policy challenges organized around the world, and we hope to help set the benchmark for intelligent driving simulation progress.

## Installation instructions

Setting up leaderboard-frontend on your local machine is really easy. This template should help get you started developing with Vue 3 in Vite. 
#### Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

#### Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

You can setup leaderboard-frontend using node.js:
The steps are:

1. Install [node.js](https://nodejs.org/en/download/current) and [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/) on your machine.
    ```shell
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
    nvm install 18.18.0
    nvm alias default 18.18.0
    ```

2. Get the source code on to your machine via git.
    ```shell
    git clone https://github.com/guardstrikelab/leaderboard-frontend.git leaderboard-frontend && cd leaderboard-frontend
    ```

3. Project Setup.
    ```shell
    npm install
    ```

4. Compile and Hot-Reload for Development.
    ```shell
    npm run dev
    ```

5. Compile and Minify for Production.
    ```shell
    npm run build
    ```

6. That's it. Open web browser and hit the URL [http://127.0.0.1:8888](http://127.0.0.1:8888). 

7. For the corresponding backend service, please refer to [EvalAI](https://github.com/guardstrikelab/EvalAI.git) to deploy it.

## Contribution guidelines

If you are interested in contributing to leaderboard-frontend, follow our [contribution guidelines](https://github.com/guardstrikelab/leaderboard-frontend/blob/main/.github/CONTRIBUTING.md).
