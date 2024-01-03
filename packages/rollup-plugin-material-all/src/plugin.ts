import {type Plugin} from 'rollup';
import {type MaterialAllPluginOptions} from './shared/index.js';

export function materialAll(options: MaterialAllPluginOptions): Plugin {
	return {
		name: 'material-all',
	};
}
