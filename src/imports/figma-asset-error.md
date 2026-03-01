The Netlify deploy errored, with the following guidance provided:

**Diagnosis**  
The build stops when Vite attempts to bundle a module that imports `figma:asset/25bb64de2fb1f7d54d5193344f5969437b85ce0e.png`. Rollup can’t resolve that specifier, so it throws a missing-module error and aborts the build ([lines 55-59](#L55-L59)). The `figma:` protocol is part of Figma’s plugin tooling, but that asset isn’t provided in the repository (nor does Vite know how to resolve it), so the production build fails.

**Solution**  
1. Open the file that contains `import ... from 'figma:asset/25bb64de2fb1f7d54d5193344f5969437b85ce0e.png'` (it should be in `src/`—search the repo for that string).  
2. Replace that import with a path Vite can resolve. Either:
   - Add the PNG to the repo (e.g. `src/assets/<your-image>.png`) and update the import to `import heroImage from './assets/<your-image>.png';`, or
   - Use an existing image already committed to the repo via a proper relative path.  
3. Rename every other reference to `figma:asset/...` the same way.  
4. Commit the asset(s) and code changes, then redeploy.

Once every asset import resolves to a real file in the repository, `npm run build` should complete successfully on Netlify.

The relevant error logs are:

Line 44: [96m[1m​[22m[39m
Line 45: [96m[1mBuild command from Netlify app                                [22m[39m
Line 46: [96m[1m────────────────────────────────────────────────────────────────[22m[39m
Line 47: ​
Line 48: [36m$ npm run build[39m
Line 49: > @figma/my-make-file@0.0.1 build
Line 50: > vite build
Line 51: [36mvite v6.3.5 [32mbuilding for production...[36m[39m
Line 52: transforming...
Line 53: [32m✓[39m 5 modules transformed.
Line 54: [31m✗[39m Build failed in 340ms
Line 55: [31merror during build:
Line 56: [31m[vite]: Rollup failed to resolve import "figma:asset/25bb64de2fb1f7d54d5193344f5969437b85ce0e.png" from "/opt/build/repo/sr
Line 57: This is most likely unintended because it can break your application at runtime.
Line 58: If you do want to externalize this module explicitly add it to
Line 59: `build.rollupOptions.external`[31m
Line 60:     at viteLog (file:///opt/build/repo/node_modules/vite/dist/node/chunks/dep-DBxKXgDP.js:46345:15)
Line 61:     at file:///opt/build/repo/node_modules/vite/dist/node/chunks/dep-DBxKXgDP.js:46403:18
Line 62:     at onwarn (file:///opt/build/repo/node_modules/@vitejs/plugin-react/dist/index.js:90:7)
Line 63:     at file:///opt/build/repo/node_modules/vite/dist/node/chunks/dep-DBxKXgDP.js:46401:7
Line 64:     at onRollupLog (file:///opt/build/repo/node_modules/vite/dist/node/chunks/dep-DBxKXgDP.js:46393:5)
Line 65:     at onLog (file:///opt/build/repo/node_modules/vite/dist/node/chunks/dep-DBxKXgDP.js:46043:7)
Line 66:     at file:///opt/build/repo/node_modules/rollup/dist/es/shared/node-entry.js:20981:32
Line 67:     at Object.logger [as onLog] (file:///opt/build/repo/node_modules/rollup/dist/es/shared/node-entry.js:22968:9)
Line 68:     at ModuleLoader.handleInvalidResolvedId (file:///opt/build/repo/node_modules/rollup/dist/es/shared/node-entry.js:21712:26)
Line 69:     at file:///opt/build/repo/node_modules/rollup/dist/es/shared/node-entry.js:21670:26[39m
Line 70: [91m[1m​[22m[39m
Line 71: [91m[1m"build.command" failed                                        [22m[39m
Line 72: [91m[1m────────────────────────────────────────────────────────────────[22m[39m
Line 73: ​
Line 74:   [31m[1mError message[22m[39m
Line 75:   Command failed with exit code 1: npm run build
Line 76: ​
Line 77:   [31m[1mError location[22m[39m
Line 78:   In Build command from Netlify app:
Line 79:   npm run build
Line 80: ​
Line 81:   [31m[1mResolved config[22m[39m
Line 82:   build:
Line 83:     command: npm run build
Line 84:     commandOrigin: ui
Line 85:     publish: /opt/build/repo/dist
Line 86:     publishOrigin: ui
Line 87: Build failed due to a user error: Build script returned non-zero exit code: 2
Line 88: Failing build: Failed to build site
Line 89: Finished processing build request in 30.79s
Line 90: Failed during stage 'building site': Build script returned non-zero exit code: 2