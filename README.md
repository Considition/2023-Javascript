# Considition 2023 Starter Kit

This is a starter kit for Considition 2023, designed for people who might be new to programming. It provides a simple JavaScript project structure to help you get started with the contest.

Project Structure
api.js: This file contains functions for making API requests.
main.js: Your main application file. Modify this to create your solution.
scoring.js: A utility for scoring your solution.
package.json: Contains project metadata and dependencies.
package-lock.json: Lock file for managing dependency versions.
node_modules/: Directory containing project dependencies.

## Getting Started

#### 1. Clone the Repository

First, clone this repository to your local machine in your choice of terminal:

```bash
git clone https://github.com/your-username/considition-2023-js-starter-kit.git
```

Go to the project directory:

```bash
cd considition-2023-js-starter-kit
```

#### 2. Install Node.js

Make sure you have Node.js installed on your machine. You can download it [here](https://nodejs.org/en/download), or check if you already have it installed

```bash
node -v
npm -v
```

#### 3. Install project dependencies using npm:

```bash
npm install
```

#### 4. Configure Your API Key & algorithm

Open main.js in your favorite code editor (we recommend [Visual Studio Code](https://code.visualstudio.com/)) and replace "your-api-key" with your actual API key:

```bash
const apiKey = 'your-api-key';
```

and start trixing around with the algorithm!

```bash
  // <---- Your algorithm starts here ---->

  Object.entries(mapData.locations).forEach(([locationKey, location]) => {
    const salesVolume = location.salesVolume;
    if (salesVolume > 100) {
      solution.Locations[location.locationName] = {
        freestyle3100Count: 0,
        freestyle9100Count: 1,
      };
    }
  });

  // <---- Your algorithm ends here ---->
```

#### 5. Check your score and submit your solution

When you're done configuring your algorithm and API-Key you can check your score and submit your solution by running the following command:

```bash
npm start
```

and follow the prompts in the console.

If you only want to check your score you can comment out the below rows:

```bash
const prodScore = await api.sumbitAsync(mapName, solution, apiKey); // You can comment me
console.log(`GameId: ${prodScore.id}`); // and me out to not submit your solution and only get your score!
```

Good luck with your Considition 2023 project! 🚀
