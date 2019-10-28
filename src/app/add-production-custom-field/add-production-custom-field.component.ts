import {FocusMonitor} from '@angular/cdk/a11y';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {Component, ElementRef, Input, OnDestroy, Optional, Self} from '@angular/core';
import {FormBuilder, FormGroup, ControlValueAccessor, NgControl} from '@angular/forms';
import {MatFormFieldControl} from '@angular/material/form-field';
import {Subject} from 'rxjs';


/** Data structure for holding telephone number. */
export class ProductQty {
  constructor(public qtyUsed: number, public qtyWaste: number) {}
}

@Component({
  selector: 'app-add-production-custom-field',
  templateUrl: './add-production-custom-field.component.html',
  providers: [{provide: MatFormFieldControl, useExisting: AddProductionCustomFieldComponent}],
  styleUrls: ['./add-production-custom-field.component.less'],
  host: {
    '[class.example-floating]': 'shouldLabelFloat',
    '[id]': 'id',
    '[attr.aria-describedby]': 'describedBy',
  }
})
export class AddProductionCustomFieldComponent implements ControlValueAccessor, MatFormFieldControl<ProductQty>, OnDestroy {
  static nextId = 0;

  parts: FormGroup;
  stateChanges = new Subject<void>();
  focused = false;
  errorState = false;
  controlType = 'production-custom-field';
  id = `production-custom-field-${AddProductionCustomFieldComponent.nextId++}`;
  describedBy = '';
  onChange = (_: any) => {};
  onTouched = () => {};

  get empty() {
    const {value: {qtyUsed, qtyWaste}} = this.parts;

    return !qtyUsed && !qtyWaste;
  }

  get shouldLabelFloat() { return this.focused || !this.empty; }

  @Input()
  get placeholder(): string { return this._placeholder; }
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  private _placeholder: string;

  @Input()
  get required(): boolean { return this._required; }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _required = false;

  @Input()
  get disabled(): boolean { return this._disabled; }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this._disabled ? this.parts.disable() : this.parts.enable();
    this.stateChanges.next();
  }
  private _disabled = false;

  @Input()
  get value(): ProductQty | null {
    const {value: {qtyUsed, qtyWaste}} = this.parts;
    return new ProductQty(qtyUsed, qtyWaste);
  }

  set value(tel: ProductQty | null) {
    const {qtyUsed, qtyWaste} = tel || new ProductQty(null, null);
    this.parts.setValue({qtyUsed, qtyWaste});
    this.stateChanges.next();
  }

  constructor(
    formBuilder: FormBuilder,
    private _focusMonitor: FocusMonitor,
    private _elementRef: ElementRef<HTMLElement>,
    @Optional() @Self() public ngControl: NgControl) {

    this.parts = formBuilder.group({
      qtyUsed: '',
      qtyWaste: '',
    });

    _focusMonitor.monitor(_elementRef, true).subscribe(origin => {
      if (this.focused && !origin) {
        this.onTouched();
      }
      this.focused = !!origin;
      this.stateChanges.next();
    });

    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() != 'input') {
      this._elementRef.nativeElement.querySelector('input')!.focus();
    }
  }

  writeValue(tel: ProductQty | null): void {
    this.value = tel;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  _handleInput(): void {
    this.onChange(this.parts.value);
  }
}

