# rollup-plugin-material-all

Rollup/Vite plugin that imports only the elements needed during runtime.  
That allows you to use `@material/web/all.js` during development so you don't have to bother writing any imports yourself.

## Install

```bash
npm add -D rollup-plugin-material-all
```

_(Indeed, You'll also need to install `@material/web`)_

## Usage

### 🛠️ During development

_do not use the plugin,_ all you need is to import the `all.js` module from the core library:

```js
import `@material/web/all.js`
```

_Note: It can be anywhere_

### 📦 At build time

import the plugin like so

`rollup.config.js`:

```js
import {materialAll} from 'rollup-plugin-material-all';

// Required to prevent using the plugin during development
const DEV = process.env.NODE_ENV == 'DEV';

export default {
	plugins: [DEV ? {} : materialAll()],
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

The plugin will scan your sources to find all md-_ elements used in your code.  
It uses this default pattern `src/\*\*/_.{js,ts,jsx,tsx}` but you can always specify a different value in the options:

```js
materialAll({
	// Only ts files
	include: 'src/**/*.ts',
});
```

### Additional elements

Sometimes md-\* elements are imported from external libraries, in that case `additionalElements` can be used to specify these elements:

```js
materialAll({
	additionalElements: ['md-circular-progress', 'md-dialog'],
});
```
