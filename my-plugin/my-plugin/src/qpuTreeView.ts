import * as theia from '@theia/plugin';

const vendors: Map<string, string[]> = new Map<string, string[]>();
vendors.set('IBM', ['ibmq_20_tokyo', 'ibmq_poughkeepsie']);
vendors.set('D-Wave', ['DW_2000Q_2_1', 'DW_2000Q_VFYC_2_1']);

const test: Map<string, string[]> = new Map<string, string[]>();
test.set("testing", ['hey', 'hi']);

const ON_DID_SELECT_VENDOR = 'QPUTreeView.onDidSelectVendor';
const ON_DID_SELECT_BACKEND = 'QPUTreeView.onDidSelectBackend';


export class QPUTree {

    treeDataProvider: QPUDataProvider;
    tree: theia.TreeView<string>;

    selectedVendor: string | undefined;

    constructor(context: theia.PluginContext) {
        this.treeDataProvider = new QPUDataProvider();

        this.tree = theia.window.createTreeView('QPUs', { treeDataProvider: this.treeDataProvider });

        this.tree.onDidExpandElement(event => {
            // handle expanding
        });

        this.tree.onDidCollapseElement(event => {
            // handle collapsing
        });

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

        if (args && args.length > 0) {
            let selectedBackend = args[0].toString();
            vendors.forEach((vendors, vendor) => {
                vendors.forEach(backend => {
                    if (selectedBackend === backend) {
                        this.selectedVendor = vendor;
                    }
                });
            });
        }
    }

}

export class QPUDataProvider implements theia.TreeDataProvider<string> {

    private onDidChangeTreeDataEmitter: theia.EventEmitter<any> = new theia.EventEmitter<any>();
    readonly onDidChangeTreeData: theia.Event<any> = this.onDidChangeTreeDataEmitter.event;

    public sendDataChanged() {
        this.onDidChangeTreeDataEmitter.fire();
    }

    getTreeItem(element: string): theia.TreeItem | PromiseLike<theia.TreeItem> {
        if (vendors.has(element)) {
            return Promise.resolve({
                label: element,
                command: {
                    id: ON_DID_SELECT_VENDOR,
                    arguments: [element]
                },

                collapsibleState: theia.TreeItemCollapsibleState.Expanded
            });
        }
        return Promise.resolve({
            label: element,
            command: {
                id: ON_DID_SELECT_BACKEND,
                arguments: [element]
            }
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

