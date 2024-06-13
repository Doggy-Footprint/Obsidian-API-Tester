import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';


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
	}

	onunload() {

	}
}
