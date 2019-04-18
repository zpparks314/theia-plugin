
/**
 * Generated using theia-plugin-generator
 */

import * as theia from '@theia/plugin';
import { QPUTree } from './qpuTreeView'

export function start(context: theia.PluginContext) {

    new QPUTree(context);

    console.log(theia.window.state);
}

export function stop() {

}
