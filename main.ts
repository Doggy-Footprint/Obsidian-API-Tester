/* eslint-disable no-unreachable */

import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile, TAbstractFile } from 'obsidian';


export default class MyPlugin extends Plugin {
    async onload() {
        if (false) {
            // postprocessing of Markdown by editing DOM object and 
            this.registerMarkdownPostProcessor((element, context) => {
                const tasks = element.querySelectorAll('li.task-list-item');
            
                tasks.forEach(task => {
                    console.log(task);
                    const el = task.querySelector('input[type="checkbox"]')
                    if (el instanceof HTMLInputElement && el.checked) {
                        console.log('checked');
                        task.remove();
                    }
                });
                console.log(context);
            });
        }
        // tests about TFiles, TFolders
        if (true) {
            const DELETE_FIRST = true;

            console.log('Cleaning up testing files and check some behaviors')
            const event_test_dir = this.app.vault.getFolderByPath('event_test');
            if (event_test_dir && DELETE_FIRST) {
                console.log('event_test exists');
                this.app.vault.delete(event_test_dir, true);
                console.log('deleted directory ---')
                console.log(event_test_dir); // still exists after deletion
                console.log('---------');
                // test if deleted object is used
                // result: not related
                if (false) {
                    const new_event_test_dir = await this.app.vault.createFolder('event_test');
                    console.log('are they same objects?');
                    console.log(`event_test_dir == new_event_test_dir : ${event_test_dir == new_event_test_dir}`);
                    console.log(`event_test_dir === new_event_test_dir : ${event_test_dir === new_event_test_dir}`);
                    console.log('---------');
                }
            } else {
                console.log("can't find event_test");
            }

            const event_test_file = this.app.vault.getFileByPath('event_test.md');
            if (event_test_file && DELETE_FIRST) {
                console.log('event_test file exists');
                this.app.vault.delete(event_test_file, true);
                console.log('deleted file ---')
                console.log(event_test_file); // still exists after deletion
                console.log('---------');
                // test if deleted object is used
                // result: not related
                if (false) {
                    const new_event_test_file = await this.app.vault.create('event_test.md', 'abc');
                    console.log('are they same objects?');
                    console.log(`event_test_dir == new_event_test_dir : ${event_test_file == new_event_test_file}`);
                    console.log(`event_test_dir === new_event_test_dir : ${event_test_file === new_event_test_file}`);
                    console.log('---------');
                }
            } else {
                console.log("can't find event_test_file");
            }
            /**
             * events: create, modify, delete, event
             * event_test/                 
             * └── common_dir/              check how renaming common_dir affect sub files.
             *     ├── test1/               
             *     │   └── test1.md         
             *     ├── test2/               
             *     │   └── test2.md         
             *     ├── TFolder_object/      check if modify, event event changes TFolder object (reference)
             *     └── TFile_object         check if modify, event event changes TFile object (reference)
             * event_test.md
            */

            
            const test_files: string[] = [
                'event_test', 
                'event_test/common_dir', 
                'event_test/common_dir/test1', 
                'event_test/common_dir/test1/test1.md',
                'event_test/common_dir/test2',
                'event_test/common_dir/test2/test2.md',
                'event_test/common_dir/TFolder_object', 
                'event_test/common_dir/TFile_object.md',
                'event_test/Untitled.md',
                'event_test.md',
            ];
            let test_files_and_objects: Record<string, TAbstractFile>;

            this.addRibbonIcon('dice', 'reset test files', () => {
                if (test_files_and_objects) {
                    Object.values(test_files_and_objects).reverse().forEach(async obj => await this.app.vault.delete(obj, true));
                }
                test_files_and_objects = {};
                test_files.forEach(async path => {
                    if (path.endsWith('.md')) {
                        test_files_and_objects[path] = await this.app.vault.create(path, path.split('.')[0]);
                    } else {
                        test_files_and_objects[path] = await this.app.vault.createFolder(path);
                    }
                });
                new Notice("Test files generated!!");
            });

            //user's direct manipulation 
            if (true) {
                /**
                 * test scenario
                 * 
                 * move file & folder: treated as rename (done)
                 * 
                 * rename, modify preserve equality of TFile, TFolder object. (done)
                 * 
                 * rename propagation: not DFS/BFS. seems like created time account for order (not assured) (done)
                 * delete propagation: same order with rename(not assured) but only the highest directory comes last (done)
                 *
                 * note: parent directory is deleted before its containing file is deleted. Thus TAbstractFile does not
                 * represent actual file system.
                 * 
                 * delete TFile is not nullified or undefined, and not resued, but can't read cache data.
                 * To deal with this, Content need to hold all its keywords to delete it in case.
                 */

                // to avoid create events on vault loading.
                this.app.workspace.onLayoutReady(() => {
                    this.registerEvent(this.app.vault.on('create', obj => {
                        /**
                         * When Obsidian app is loaded, 'create' is called
                         */
                        console.log('create');
                        if (obj.path in test_files_and_objects) {
                            console.log('a Test for recreating file/dir with same name after deleting it')
                            console.log(`is TAbstractFile object for deleted file/dir undefined?  test_files_and_objects[obj.path].path = ${test_files_and_objects[obj.path].path}`);
                            if (test_files_and_objects[obj.path]) {
                                console.log(`if remain, is it reused? ${obj === test_files_and_objects[obj.path]}`);
                            }
                        }
                    }));
                });
                this.registerEvent(this.app.vault.on('modify', obj => {
                    /**
                     * Modified contents are not reflected when this callback fn is called.
                     * 
                     * solution 1: run async event loop to reflecting modified, deleted files (V)
                     * solution 2: find API which can read cache to update before on modify ends (X)
                     */

                    console.log(`modify: ${obj.path}`);
                    if (obj instanceof TFile) {
                        const cache = this.app.metadataCache.getFileCache(obj);
                        if (!cache) console.log(`No cache available for ${obj.path}`);
                        else console.log(`aliases: ${cache.frontmatter?.aliases}`);

                        console.log(`aliases from pathcache: ${this.app.metadataCache.getCache(obj.path)?.frontmatter?.aliases}`);
                        console.log('----');

                        console.log(`Check equality of TAbstractFile object: ${test_files_and_objects[obj.path] === obj}`);
                    }
                }));

                this.registerEvent(this.app.vault.on('delete', obj => {
                    /**
                     * this.app.vault.delete(file) call this.
                     * 
                     * Can't read cache from deleted file
                     * solution: find Content using it's name and delete all related keywords (assuming Content has it)
                     */
                    console.log(`delete: ${obj.path}`);
                    if (obj instanceof TFile && true) {
                        const cache = this.app.metadataCache.getFileCache(obj);
                        if (!cache) console.log(`No cache available for ${obj.path}`);
                        else console.log(`metadataCache: ${cache.frontmatter}`);
                    }
                }));

                this.registerEvent(this.app.vault.on('rename', (obj, oldPath) => {
                    /**
                     * rename preserve TFile object -> no problem
                     */
                    console.log(`rename ${oldPath} --> ${obj.path}`);
                    if (oldPath in test_files_and_objects)
                        console.log(`Check equality of TAbstractFile object: ${test_files_and_objects[oldPath] === obj}`);
                    console.log(`new path(obj.path): ${obj.path}`);
                }));
            }
            
            // vault manipulation via API.
            // TODO: for compatibility with other plugins
            if (true) {
                this.app.workspace.onLayoutReady(() => {
                    this.registerEvent(this.app.vault.on('create', obj => {

                    }));
                });
                this.registerEvent(this.app.vault.on('modify', obj => {

                }));

                this.registerEvent(this.app.vault.on('delete', obj => {

                }));

                this.registerEvent(this.app.vault.on('rename', (obj, oldPath) => {
                    console.log(`rename ${oldPath} --> ${obj.path}`);
                }));

            }


        }
    }

    onunload() {

    }
}
