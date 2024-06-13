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
        if (true) {
            const rename_test_file = this.app.vault.getFileByPath("rename_test.md");
            if (rename_test_file && true) {
                this.registerEvent(this.app.vault.on('rename', (rename_test_2_file, oldPath) => {
                    if (!(rename_test_2_file instanceof TFile)) return;
                    console.log('rename_test_file === rename_test_2_file: ', rename_test_file === rename_test_2_file);
                    console.log('rename_test_file object basename: ', rename_test_file.basename);
                    console.log('rename_test_2_file object basename: ', rename_test_2_file.basename);
                    console.log('----');
                }));
                // rename rename_test.md -> rename_test_2.md
                /**
                 * result - same object
                 * rename_test_file === rename_test_2_file:  true
                 * rename_test_file object basename:  rename_test_2
                 * rename_test_2_file object basename:  rename_test_2
                 */
            } else if (false) {
                // testing rename event of plugin.app.vault
                this.registerEvent(this.app.vault.on('rename', (file, oldPath) => {
                    console.log(file);
                    console.log(oldPath);
                    console.log('---');
                }));
            }

        }
    }

    onunload() {

    }
}
