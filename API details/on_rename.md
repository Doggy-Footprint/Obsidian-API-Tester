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