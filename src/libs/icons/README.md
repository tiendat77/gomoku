# Icon

## API reference for Icon

```ts
import { IconsModule } from '@libs/icons';
```

## IconRegistry

Service to register and display icons used by the `<icon>` component.

Registers icon URLs by namespace and name.
Registers icon set URLs by namespace.
Registers aliases for CSS classes, for use with icon fonts.
Loads icons from URLs and extracts individual icons from icon sets.

Examples:

```ts
import { NgModule } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IconRegistry } from '@libs/icons/icon-registry';

@NgModule({})
export class IconsModule {
  constructor(
    private _domSanitizer: DomSanitizer,
    private _iconRegistry: IconRegistry
  ) {
    this._iconRegistry.addSvgIconSetInNamespace(
      'heroicons_outline',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/svg-icons/heroicons-outline.svg')
    );
  }
}
```

## Icon
Component to display an icon. It can be used by specify the `name` input to load an SVG icon from a URL previously registered with IconRegistry. If the name value contains a colon it is assumed to be in the format "[namespace]:[name]", if not the value will be the name of an icon in the default namespace.

Examples:

```html
<icon name="left-arrow"></icon>
<icon svgIcon="animals:cat"></icon>
```
