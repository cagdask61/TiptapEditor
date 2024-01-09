import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

import EditorComponent from './components/editor/editor.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [
    RouterOutlet,
    FormsModule,
    ReactiveFormsModule,
    EditorComponent
  ],
})
export class AppComponent {

  editorForm = new FormControl(`<p>Başla</p>`);

  constructor() {
    this.editorForm.valueChanges.subscribe(res => console.log(res));
  }

}