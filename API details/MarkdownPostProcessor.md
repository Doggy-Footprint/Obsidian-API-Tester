# Applying API

`Plugin.registerMarkdownPostProcessor(MarkdownPostProcessor)`

# obisidian.d.ts

## MarkdownPostProcessor

```ts
export interface MarkdownPostProcessor {
    /**
     * The processor function itself.
     * @public
     */
    (el: HTMLElement, ctx: MarkdownPostProcessorContext): Promise<any> | void;
    /**
     * An optional integer sort order. Defaults to 0. Lower number runs before higher numbers.
     * @public
     */
    sortOrder?: number;
}
```

## el: HTMLElement

DOM object on rendering (reading mode)

### Example

```md
---
tags:
  - sup
aliases:
  - abc
  - def
---
- [ ] abc
- [x] def

```

```ts
this.registerMarkdownPostProcessor((element, context) => {
    // get DOM objects with given condition
    const tasks = element.querySelectorAll('li.task-list-item');
    // modify DOM object. Here, remove checked DOM elements.
    tasks.forEach(task => {
        const el = task.querySelector('input[type="checkbox"]')
        if (el instanceof HTMLInputElement && el.checked) {
            task.remove();
        }
    });
});
```
## context: MarkdownPostProcessorContext

```ts
/**
 * @public
 */
export interface MarkdownPostProcessorContext {
    /**
     * @public
     */
    docId: string;
    /** @public */
    sourcePath: string;
    /** @public */
    frontmatter: any | null | undefined;

    /**
     * Adds a child component that will have its lifecycle managed by the renderer.
     *
     * Use this to add a dependent child to the renderer such that if the containerEl
     * of the child is ever removed, the component's unload will be called.
     * @public
     */
    addChild(child: MarkdownRenderChild): void;
    /**
     * Gets the section information of this element at this point in time.
     * Only call this function right before you need this information to get the most up-to-date version.
     * This function may also return null in many circumstances; if you use it, you must be prepared to deal with nulls.
     * @public
     */
    getSectionInfo(el: HTMLElement): MarkdownSectionInformation | null;
}
```
### console log

```
{docId: 'ae1c4d2cf997eeac', sourcePath: 'Untitled.md', frontmatter: undefined, promises: Array(0), addChild: ƒ, …}
addChild: ƒ (e)
containerEl: div.markdown-preview-sizer.markdown-preview-section
docId: "ae1c4d2cf997eeac"
el: div
frontmatter: 
    aliases: (2) ['abc', 'def']
    tags: ['sup']
    [[Prototype]]: Object
getSectionInfo: ƒ (e)
promises: [Promise]
sourcePath: "Untitled.md"
[[Prototype]]: Object
```
