import * as theia from '@theia/plugin';
import { PythonShell } from 'python-shell';

const vendors: Map<string, string[]> = new Map<string, string[]>();

const ON_DID_SELECT_VENDOR = 'QPUVendorExplorer.onDidSelectVendor';
const ON_DID_SELECT_BACKEND = 'QPUVendorExporer.onDidSelectBackend';
const SELECT_BACKEND_CONNECTIVITY = 'QPUVendorExplorer.showConnectivity';
const OPEN_CONFIG_FILE = 'QPUVendorExplorer.openConfigFile';
const GET_AVAILABLE_ACCELERATORS = 'QPUVendorExplorer.refreshAvailableAccerators';

export class QPUVendorExplorer {

    treeDataProvider: QPUTreeDataProvider;
    tree: theia.TreeView<string>;

    selectedVendor: string | undefined;
    selectedBackend: string | undefined;

    constructor(context: theia.PluginContext) {


        this.treeDataProvider = new QPUTreeDataProvider();
        this.getAvailableAccelerators(this.treeDataProvider);
        this.tree = theia.window.createTreeView('QPUs', { treeDataProvider: this.treeDataProvider });

        this.tree.onDidExpandElement(event => {
            // handle expanding
        });

        this.tree.onDidCollapseElement(event => {
            // handle collapsing
        });

        context.subscriptions.push(
            theia.commands.registerCommand({
                id: SELECT_BACKEND_CONNECTIVITY,
                label: "Show QPU Connectivity"
            }, args => this.showConnectivity(args)));

        context.subscriptions.push(
            theia.commands.registerCommand({
                id: GET_AVAILABLE_ACCELERATORS,
                label: "Refresh Available Accelerators"
            }, args => this.getAvailableAccelerators(this.treeDataProvider)));

        context.subscriptions.push(
            theia.commands.registerCommand({
                id: OPEN_CONFIG_FILE,
                label: 'Open Vendor Config File'
            }, args => this.openConfigFile(args)));

        context.subscriptions.push(
            theia.commands.registerCommand({
                id: ON_DID_SELECT_VENDOR,
                label: 'On did select vendor'
            }, args => this.onDidSelectVendor(args)));

        context.subscriptions.push(
            theia.commands.registerCommand({
                id: ON_DID_SELECT_BACKEND,
                label: 'On did select backend'
            }, args => this.onDidSelectBackend(args)));
    }

    showConnectivity(...args: any[]) {
        if (args && args.length > 0) {
            console.log("Sending args to console" + args[0].toString());
        }
        console.log("Printing Vendor: " + this.selectedVendor);
        console.log("Printing Backend: " + this.selectedBackend);
    }

    openConfigFile(...args: any[]) {
        if (args && args.length > 0) {
            console.log("Open Config file for:" + args[0].toString());
        }
    }

    getAvailableAccelerators(dataProvider: QPUTreeDataProvider) {
        PythonShell.run('get_qpu_info.py', { mode: 'json', pythonPath: 'python3', scriptPath: 'python/' }, function(err: any, results: any[] | undefined) {
            if (err) throw err;
            vendors.clear();
            let length = results!.length;
            console.log("results from python script: %j", results);
            console.log("length of results array: %j", length);
            for (let vendor of results!) {
                console.log(vendor.vendorName);
                console.log(vendor.backends);
                vendors.set(vendor.vendorName, vendor.backends);
            }
            dataProvider.sendDataChanged();
        });
    }

    onDidSelectVendor(...args: any[]) {
        if (args && args.length > 0) {
            this.selectedVendor = args[0].toString();
            console.log(this.selectedVendor);
        } else {
            this.selectedVendor = undefined;
        }
    }

    onDidSelectBackend(...args: any[]) {
        this.selectedVendor = undefined;
        console.log("selected backend");
        if (args && args.length > 0) {
            let selectedBackend = args[0].toString();
            vendors.forEach((vendors, vendor) => {
                vendors.forEach(backend => {
                    if (selectedBackend === backend) {
                        this.selectedVendor = vendor;
                        this.selectedBackend = backend;
                    }
                });
            });
        }
    }

}

export class QPUTreeDataProvider implements theia.TreeDataProvider<string> {

    private onDidChangeTreeDataEmitter: theia.EventEmitter<any> = new theia.EventEmitter<any>();
    readonly onDidChangeTreeData: theia.Event<any> = this.onDidChangeTreeDataEmitter.event;

    public sendDataChanged() {
        this.onDidChangeTreeDataEmitter.fire();
    }

    getTreeItem(element: string): theia.TreeItem | PromiseLike<theia.TreeItem> {
        if (vendors.has(element)) {
            console.log("Vendor has an element");
            return Promise.resolve({
                label: element,
                command: {
                    id: ON_DID_SELECT_VENDOR,
                    arguments: [element]
                },
                contextValue: "vendor",
                collapsibleState: theia.TreeItemCollapsibleState.Collapsed
            });
        }
        return Promise.resolve({
            label: element,
            command: {
                id: ON_DID_SELECT_BACKEND,
                arguments: [element]
            },
            contextValue: "backend"
        });
    }

    async getChildren(element?: string): Promise<string[]> {
        if (element && vendors.has(element)) {
            return vendors.get(element)!;
        } else {
            return await this.getRootChildren();
        }
    }

    async getRootChildren(): Promise<string[]> {
        const arr: string[] = [];
        vendors.forEach((value, key) => {
            arr.push(key);
        })

        return arr;
    }
}