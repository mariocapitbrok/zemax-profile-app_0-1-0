# Zemax Profile app

## Installation

Install [Node.js](https://nodejs.org/) v14+ (including Chocolatey if installing on Windows)
Allow everything to be installed (this will take several minutes)

Extract profile app zip file into a folder

Intall [VSCodium](https://vscodium.com/) (or equivalent editor app)

Open your editor app, and open the profile app folder inside it

From inside the folder (which should contain the package.json file), open a new terminal, and type in:
```sh
npm install
```
press Enter.

This will install all the necessary dependencies, and this will take some time.
If there are no errors (it may say something about vulnerabilities, but they can be ignored), you can now proceed with file modification and building/compilation.

> Note: All modifications would be done in the "src" folder (such as the locales json files in the locales folder).

If there are any errors within the files, it will refuse to build/compile, so make sure to retain proper code structure.
Make sure the root of your app folder contains an .env file (created just like that ".env") with the following content (if the file does not exist, create it):
```sh
REACT_APP_AUTH0_DOMAIN=zemax.auth0.com
REACT_APP_AUTH0_CLIENT_ID=rRlmkvpiVxUmv6E3ZJ8P3kHLAYjx9HVY
REACT_APP_AUTH0_AUDIENCE=https://express.jwt
REACT_APP_AUTH0_ALGORITHM=['RS256']
REACT_APP_SERVER_URL=http://localhost:5001
REACT_APP_AZURE_BASE_URL=https://zemaxportalfunctions.azurewebsites.net/api/
```
Save all your changes/modifications.
If you want to test how the app works on the localhost, type in
```
npm start
```
into the terminal (for this to work, localhost URLs would have to be added to the Auth0 App and Azure Functions by Feridun, since I assume we would be removing them for launch, as it may not be very secure to leave the localhost URLs just sitting there).

The log out button on localhost is a small square button at the bottom left of the page. Software downloads are not visible because they are now part of Shopify.

When you are done, press Ctrl+C in your editor to close the localhost server batch job.

Same applies for if a process fails in the terminal, press Ctrl+C to close the process and try something else.

> Note: if for some reason a dependency is missing (you would a message regarding this when attempting to run or build the app), it would tell you what's missing.

You would stop the process, and type
```sh 
npm install dependency-name
```
where dependency-name would be whatever dependency is missing.
This shouldn't happen, but it might in the future, if something were to change on the backend of node.js.
When you are ready to build/compile, type in
```sh
npm run-script build
```
into the terminal
After a while, 4 files will be created in the build\static\ folder (3 js files and a css file)
They would look like this in the terminal (numbers might be different, but the structure would be the same):
```
207.71 KB        build\static\js\2.658116ff.chunk.js
32.38 KB         build\static\css\main.870c1476.chunk.css
29.18 KB (+7 B)  build\static\js\main.8998c8e1.chunk.js
781 B            build\static\js\runtime-main.dc249765.js
```
If you made a small change to one of the app files, only one file would have been updated, and the change would be noted by the change of the file size.
In this case, having changed something to do with localization, the third file increased by (+7 B).
Now you head to the Shopify Admin dashboard, and edit the code of your chosen theme.
At the bottom of the list, there is an Assets folder.
Within the folder there are 4 files to match the files above.
They are named:
```
profile.chunk.js
main.profile.chunk.css
main.profile.chunk.js
runtime-main.profile.js
```

You would copy the contents of the modified file in the build folder, and paste it into it's respective file in the theme code, replacing everything inside it.
Save your changes.

P.S. This should only be done by one person, not several different people. Rather, this should only ever be done using one set of "source files", not several different sets of source files, with different modifications between them.
