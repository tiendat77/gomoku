import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, ElementRef, inject, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fromEvent, merge, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { InternalDialogRef } from './dialog-ref';
import { coerceCssPixelValue } from './dialog.utils';
import { DialogDraggableDirective, DragOffset } from './draggable.directive';
import { DIALOG_CONFIG, NODES_TO_INSERT } from './providers';

@Component({
  selector: 'ngneat-dialog',
  standalone: true,
  imports: [DialogDraggableDirective, CommonModule],
  template: `
    <div
      #backdrop
      class="ngneat-dialog-backdrop"
      [hidden]="!config.backdrop"
      [class.ngneat-dialog-backdrop-visible]="config.backdrop"
    >
      <div
        #dialog
        class="ngneat-dialog-content"
        [class.ngneat-dialog-resizable]="config.resizable"
        [ngStyle]="styles"
        role="dialog"
      >
        <div
          *ngIf="config.draggable"
          class="ngneat-drag-marker"
          dialogDraggable
          [dialogDragEnabled]="true"
          [dialogDragTarget]="dialog"
          [dragConstraint]="config.dragConstraint"
        ></div>
      </div>
    </div>
  `,
  styleUrls: [`./dialog.component.scss`],
  encapsulation: ViewEncapsulation.None,
})
export class DialogComponent implements OnInit, OnDestroy {
  config = inject(DIALOG_CONFIG);
  dialogRef = inject(InternalDialogRef);

  private size = this.config.sizes?.[this.config.size || 'md'];
  styles = {
    width: coerceCssPixelValue(this.config.width || this.size?.width),
    height: coerceCssPixelValue(this.config.height || this.size?.height),
    minHeight: coerceCssPixelValue(this.config.minHeight || this.size?.minHeight),
    maxHeight: coerceCssPixelValue(this.config.maxHeight || this.size?.maxHeight),
  };

  @ViewChild('backdrop', { static: true })
  private backdrop: ElementRef<HTMLDivElement>;

  @ViewChild('dialog', { static: true })
  private dialogElement: ElementRef<HTMLElement>;

  @ViewChild(DialogDraggableDirective, { static: false })
  private draggable: DialogDraggableDirective;

  private destroy$ = new Subject<void>();

  private nodes = inject(NODES_TO_INSERT);

  private document = inject(DOCUMENT);
  private host: HTMLElement = inject(ElementRef).nativeElement;

  constructor() {
    this.host.id = this.config.id;

    // Append nodes to dialog component, template or component could need
    // something from the dialog component
    // for example, if `[dialogClose]` is used into a directive,
    // DialogRef will be getted from DialogService instead of DI
    this.nodes.forEach((node) => this.host.appendChild(node));

    if (this.config.windowClass) {
      const classNames = this.config.windowClass.split(/\s/).filter((x) => x);
      classNames.forEach((name) => this.host.classList.add(name));
    }
  }

  ngOnInit() {
    const backdrop = this.config.backdrop ? this.backdrop.nativeElement : this.document.body;
    const dialogElement = this.dialogElement.nativeElement;

    const backdropClick$ = fromEvent<MouseEvent>(backdrop, 'click', { capture: true }).pipe(
      filter(({ target }) => !dialogElement.contains(target as Element))
    );

    backdropClick$.pipe(takeUntil(this.destroy$)).subscribe(this.dialogRef.backdropClick$);

    if (this.config.enableClose) {
      merge(
        fromEvent<KeyboardEvent>(this.document.body, 'keyup').pipe(filter(({ key }) => key === 'Escape')),
        backdropClick$
      )
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.closeDialog());
    }

    // `dialogElement` is resolved at this point
    // And here is where dialog finally will be placed
    this.nodes.forEach((node) => dialogElement.appendChild(node));
  }

  reset(offset?: DragOffset): void {
    if (this.config.draggable) {
      this.draggable.reset(offset);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();

    this.dialogRef = null!;
    this.nodes = null!;
  }
}
