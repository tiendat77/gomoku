import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { Injectable, Inject, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { environment } from '@environment';
import { Version } from '@models';

export interface Metadata {
  title?: string;
  description?: string;
  image?: string;
  keywords?: string[];
  url?: string;
  type?: string;
}

@Injectable({ providedIn: 'root' })
export class MetaService {

  private _renderer: Renderer2;

  constructor(
    @Inject(DOCUMENT) private _document: any,
    private readonly _meta: Meta,
    private readonly _title: Title,
    private readonly _rendererFactory: RendererFactory2,
  ) {
    this._renderer = _rendererFactory.createRenderer(null, null);
  }

  init() {
    // Init version info
    const version = new Version(environment.version).full;
    const element = this._document.querySelector('[ng-version]');
    this._renderer?.setAttribute(element, 'app-version', version);
  }

  update(meta: Partial<Metadata>) {
    this._meta.addTags(this._generate(meta));
    this._title.setTitle(meta?.title || 'Gomoku');
  }

  private _generate(meta: Partial<Metadata>): MetaDefinition[] {
    const definition: MetaDefinition[] = [];

    if (meta?.title) {
      definition.push({name: 'title', content: meta.title});
      definition.push({property: 'og:title', content: meta.title});
    }

    if (meta?.url) {
      definition.push({property: 'og:url', content: meta.url});
    }

    if (meta?.description) {
      definition.push({name: 'description', content: meta.description});
      definition.push({property: 'og:description', content: meta.description});
    }

    if (meta?.image) {
      definition.push({property: 'og:image', content: meta.image});
    }

    if (meta?.type) {
      definition.push({property: 'og:type', content: meta.type});
    }

    if (meta?.keywords) {
      definition.push({name: 'keywords', content: meta.keywords.join(', ')});
    }

    return definition;
  }

}
