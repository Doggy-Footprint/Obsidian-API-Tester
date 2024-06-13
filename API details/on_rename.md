# Applying API

## obisidian.d.ts

```ts
/**
 * Registers an event to be detached when unloading
 * @public
 */
registerEvent(eventRef: EventRef): void;

...

/**
 * @public
 */
export interface EventRef {

}

...
export class Vault extends Events {
    ...
    on(name: 'rename', callback: (file: TAbstractFile, oldPath: string) => any, ctx?: any): EventRef;
}
```


## usage
```ts
this.registerEvent(this.app.vault.on('rename', (file, oldPath) => {
    console.log(file);
    console.log(oldPath);
    console.log('---');
}));
```

## Cases

### renaming a single file
**def.md** -> **abc.md**

#### console
```ts
t {parent: t, deleted: false, vault: t, path: 'def.md', name: 'def.md', …}
abc.md
---
```
works well

### renaming directory
**rename_test** -> **rename_test2**
```
rename_test/
    aaa.md
    Untitled.md
    Untitled 1.md
```

#### console
```ts
t {parent: t, deleted: false, vault: t, path: 'rename_test2', name: 'rename_test2', …}
rename_test
---
t {parent: t, deleted: false, vault: t, path: 'rename_test2/aaa.md', name: 'aaa.md', …}
rename_test/aaa.md
---
t {parent: t, deleted: false, vault: t, path: 'rename_test2/Untitled 1.md', name: 'Untitled 1.md', …}
rename_test/Untitled 1.md
---
t {parent: t, deleted: false, vault: t, path: 'rename_test2/Untitled.md', name: 'Untitled.md', …}
rename_test/Untitled.md
---
```

its all included files name are changed and call `rename` event

## Programming Considerations

### Will `TFile` object remain same after rename?
```ts
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
     * result
     * rename_test_file === rename_test_2_file:  true
     * rename_test_file object basename:  rename_test_2
     * rename_test_2_file object basename:  rename_test_2
     */
```
**YES**
