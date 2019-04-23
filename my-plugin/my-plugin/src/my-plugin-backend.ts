
/**
 * Generated using theia-plugin-generator
 */

import * as theia from '@theia/plugin';
import { QPUVendorExplorer } from './qpuVendorExplorer'

export function start(context: theia.PluginContext) {

    new QPUVendorExplorer(context);

    console.log(theia.window.state);
}

export function stop() {

}
