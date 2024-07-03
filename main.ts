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
            const CREATE_FIRST = true;

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
                if (false && !CREATE_FIRST) {
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
                if (false && !CREATE_FIRST) {
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
            console.log('creating testing files');
            if (DELETE_FIRST && CREATE_FIRST) {
                await this.app.vault.createFolder('event_test');
                await this.app.vault.createFolder('event_test/common_dir');
                await this.app.vault.createFolder('event_test/common_dir/test1');
                await this.app.vault.create('event_test/common_dir/test1/test1.md', 'test1');
                await this.app.vault.createFolder('event_test/common_dir/test2');
                await this.app.vault.create('event_test/common_dir/test2/test2.md', 'test2');
                await this.app.vault.createFolder('event_test/common_dir/TFolder_object');
                await this.app.vault.create('event_test/common_dir/TFile_object.md', 'tfile object');
                await this.app.vault.create('event_test.md', 'event_test');
                console.log('created test files');
            }

            // TODO: what is `ctx?: any` on this.app.vault.on()?
            const watch_TFolder_object = this.app.vault.getFileByPath("event_test/common_dir/TFolder_object");
            const watch_TFile_object = this.app.vault.getFileByPath("event_test/common_dir/TFile_object");

            this.registerEvent(this.app.vault.on('create', obj => {

            }));

            this.registerEvent(this.app.vault.on('modify', obj => {

            }));

            this.registerEvent(this.app.vault.on('delete', obj => {

            }));

            this.registerEvent(this.app.vault.on('rename', (obj, oldPath) => {

            }));
        }
    }

    onunload() {

    }
}
