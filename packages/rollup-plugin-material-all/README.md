# rollup-plugin-material-all

This rollup plugin lets you use `@material/web/all.js` during development so you don't have to bother importing material elements every time you need them.
It will replace the actual `@material/web/all.js` import during build time with only the elements you use throughout your project, that is optimizing your final bundle.

## Installation

Make sure you don't run the plugin during development so you can use `@material/web/all.js` freely,

### package.json

```json
{
	"scripts": {
		"dev": "NODE_ENV=development rollup -c",
		"build": "rollup -c"
	}
}
```

### rollup.config.js

```js
import {materialAll} from 'rollup-plugin-material-all';

const DEV = process.env.NODE_ENV == 'development';

export default {
	plugins: [
		DEV ? {} : materialAll(),
		//...
	],
};
```

## License

MIT
