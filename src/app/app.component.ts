import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { firstValueFrom } from 'rxjs';

import { Editor } from '@tiptap/core';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import FontFamily from '@tiptap/extension-font-family';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { ImageExtension } from './extensions/image.extension';
import { LinkExtension } from './extensions/link.extension';

import LinkDialogComponent from './components/link-dialog/link-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [
    RouterOutlet,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
    MatMenuModule,
    MatDialogModule,
    MatTooltipModule
  ],
})
export class AppComponent implements OnInit, OnDestroy {


  @ViewChild("editorRef", { static: true }) private editorRef!: ElementRef<HTMLDivElement>;

  private readonly dialog = inject(MatDialog);

  private readonly _editor = signal<Editor | null>(null);
  readonly editor = this._editor.asReadonly();

  readonly textColorState = signal("#000000");

  ngOnInit(): void {
    this._editor.set(new Editor({
      element: this.editorRef.nativeElement,
      extensions: [
        StarterKit,
        Underline,
        TextStyle,
        Color.configure({
          types: ['textStyle']
        }),
        FontFamily.configure({
          types: ['textStyle']
        }),
        LinkExtension,
        ImageExtension,
        TextAlign.configure({
          defaultAlignment: "left",
          alignments: ["left", "center", "right"],
          types: ['heading', "paragraph", "image"]
        }),
        Highlight
      ],
      content: `<p>Hadi Başla</p>`,
      editable: true,
      autofocus: 'end',
      onSelectionUpdate: () => {
        this.getSelectionTextColor();
      }
    }));
  }

  ngOnDestroy(): void {
    this.editor()?.destroy();
  }

  private getSelectionTextColor() {
    const selectionTextColor = <string | undefined>this.editor()?.getAttributes('textStyle')['color'];
    if (selectionTextColor) {
      this.textColorState.set(selectionTextColor);
    } else {
      this.textColorState.set("#000000");
    }
  }

  undo() {
    this.editor()?.chain().focus().undo().run();
  }

  redo() {
    this.editor()?.chain().focus().redo().run();
  }

  clear() {
    this.editor()?.chain().focus().clearContent().run();
  }

  toggleBold() {
    this.editor()?.chain().focus().toggleBold().run();
  }

  toggleItalic() {
    this.editor()?.chain().focus().toggleItalic().run();
  }

  toggleUnderline() {
    this.editor()?.chain().focus().toggleUnderline().run();
  }

  toggleStrike() {
    this.editor()?.chain().focus().toggleStrike().run();
  }

  setHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
    this.editor()?.chain().focus().setHeading({ level: level }).run();
  }

  setParagraph() {
    this.editor()?.chain().focus().setParagraph().run();
  }


  setLink() {
    firstValueFrom(this.dialog.open(LinkDialogComponent).afterClosed()).then((response) => {
      if (!(typeof response === "boolean") || !(response === false)) {
        this.editor()?.chain().focus().setLink({
          href: response,
          rel: "noopener noreferrer"
        }).run();
      }
    });
  }

  setColor(color: string) {
    this.textColorState.set(color);
    this.editor()?.chain().focus().setColor(color).run();
  }

  setFontFamily(name: string) {
    this.editor()?.chain().focus().setFontFamily(name).run();
  }

  setHighlight() {
    this.editor()?.chain().focus().toggleHighlight().run();
  }

  setTextFormat(name: "left" | "right" | "center") {
    this.editor()?.chain().focus().setTextAlign(name).run();
  }

  setImage() {
    this.editor()?.chain().focus().setImage({
      src: "/assets/mescidi-aksa.jpg",
      alt: "Fotoğraf",
      title: "Mescidi Aksa"
    }).run();
  }

}