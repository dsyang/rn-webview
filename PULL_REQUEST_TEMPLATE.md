## Problem
The GitHub Actions workflow was failing because:
1. `cache: 'npm'` requires a `package-lock.json` file
2. `npm ci` requires a `package-lock.json` file

Neither file exists in the repository.

## Solution
- Removed `cache: 'npm'` from the Node.js setup step
- Changed `npm ci` to `npm install`

Once merged, consider running `npm install` locally and committing the generated `package-lock.json` to enable caching for faster CI builds.