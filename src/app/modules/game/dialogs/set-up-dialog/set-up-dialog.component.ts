import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DialogRef } from '@libs/dialog';
import { Color, GameConfig, Level, Mode } from '@models';
import { Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-set-up-dialog',
  templateUrl: './set-up-dialog.component.html',
  styleUrls: ['./set-up-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SetUpDialogComponent implements OnInit, OnDestroy {

  ref: DialogRef<{config: GameConfig}> = inject(DialogRef);

  form = new FormGroup({
    mode: new FormControl<Mode>('hvc'),
    color: new FormControl<Color>('white'),
    level: new FormControl<Level>('medium'),
  });

  private _destroyed$ = new Subject<void>();

  constructor() { }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    if (this.ref.data && this.ref.data.config) {
      this._patchForm(this.ref.data.config);
    }

    this.form?.get('mode')?.valueChanges
    .pipe(takeUntil(this._destroyed$))
    .subscribe((mode) => {
      if (mode === 'hvh') {
        this.form?.get('level').disable();
        this.form?.get('color').disable();

      } else {
        this.form?.get('level').enable();
        this.form?.get('color').enable();
      }
    });
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  close(): void {
    this.ref.close();
  }

  submit(): void {
    const config = this._getForm();
    this.ref.close({config});
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  private _patchForm(config: GameConfig): void {
    if (config.mode === 'hvh') {
      this.form.patchValue({mode: 'hvh'});

    } else {
      this.form.patchValue({
        mode: 'hvc',
        level: config.mode as Level,
        color: config.color,
      });
    }
  }

  private _getForm(): GameConfig {
    const form = this.form.value;
    const config: GameConfig = {
      mode: 'medium',
      color: 'white'
    };

    if (form.mode === 'hvh') {
      config.mode = 'hvh';

    } else {
      config.mode = form.level;
      config.color = form.color;
    }

    return config;
  }

}
