# rollup-plugin-material-all

Rollup/Vite plugin that imports only the elements needed during runtime.  
(So you can use `@material/web/all.js` during development and don't have to worry writing imports yourself ✨)

## Install

```bash
npm add -D rollup-plugin-material-all
```

_(You'll also need to install `@material/web` separately)_

## Usage

### 🛠️ During development

_do not use the plugin,_ all you need to do is to import the `all.js` module from the core library somewhere in your source:

```js
import `@material/web/all.js`
```

That's it _!_

### 📦 At build time

import the plugin like so

`rollup.config.js`:

```js
import {materialAll} from 'rollup-plugin-material-all';

// Required to prevent using the plugin during development
const DEV = process.env.NODE_ENV == 'DEV';

export default {
	plugins: [
		DEV ? {} : materialAll(),
		// other plugins...
	],
};
```

<details>
<summary>Or using Vite</summary>

`vite.config.js`:

```js
import {materialAll} from 'rollup-plugin-material-all';
import {defineConfig} from 'vite';

export default defineConfig({
	plugins: [
		// Won't be used during dev
		materialAll(),
	],
});
```

</details>

## Details

The plugin will scan your sources to find all md-\* elements used in your code.  
By default this pattern will be used: `src/\*\*/_.{js,ts,jsx,tsx}`  
but you can always specify a different value in the options:

```js
materialAll({
	// Only ts files
	include: 'src/**/*.ts',
});
```

### Resolution Mode

If not specified `rollup-plugin-material-all` will use the `perFile` resolution mode (which is probably what you will need), there are 2 different methods:

- `perFile`: Elements are imported in each individual file where they are being used. Use this method to improve code-splitting as your bundler will have a better understanding of your app's module dependencies graph.
- `all`: All imports of elements found in the sources will be written in place of `@material/web/all.js`. Use this method if you'd rather want to bundle all your elements in one location which is not recommended since it can increase your page initial load time.

### Additional elements

Sometimes md-\* elements are imported from external libraries, in that case `additionalElements` can be used to specify these elements:

```js
materialAll({
	additionalElements: ['md-circular-progress', 'md-dialog'],
});
```

## License

MIT
