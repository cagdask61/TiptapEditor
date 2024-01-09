import { DOCUMENT, NgStyle } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild, effect, inject, signal } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  templateUrl: './dropdown.component.html',
  imports: [NgStyle],
})
export default class DropdownComponent implements OnInit {

  private readonly _window = <Window>inject(DOCUMENT).defaultView;

  readonly active = signal(false);

  @ViewChild('dropdownBoxRef', { static: true }) private readonly dropdownBoxRef!: ElementRef<HTMLDivElement>;

  dropdownBoxStyle = {
    'left.px': 0,
    'top.px': 0,
    'visibility': 'hidden'
  };

  private _target!: HTMLElement;
  get target(): HTMLElement {
    return this._target;
  }
  @Input({ alias: 'target', required: true }) set setTarget(value: HTMLElement) {
    this._target = value;
  }

  @Input({ alias: 'active' }) set setActive(value: boolean) {
    this.active.set(value);
  }

  constructor() {
    effect(() => {
      if (this.active()) {
        this.dropdownBoxStyle.visibility = "visible";
      } else {
        this.dropdownBoxStyle.visibility = "hidden";
      }
    });
  }

  ngOnInit(): void {
    this.dropdownBoxStyle = {
      "left.px": this.target.offsetLeft,
      "top.px": this.target.offsetTop + 30,
      visibility: "hidden"
    }
    this.target.addEventListener('click', () => {
      if (this.active()) {
        this.active.set(false);
      } else {
        this.active.set(true);
      }
    });
    this._window.addEventListener('click', (e) => {
      if (e.composedPath().includes(this.target) || e.composedPath().includes(this.dropdownBoxRef.nativeElement)) {

      } else {
        this.active.set(false);
      }
    })
  }
}