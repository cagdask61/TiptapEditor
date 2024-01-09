import { Component, ElementRef, OnDestroy, OnInit, ViewChild, effect, forwardRef, inject, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

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
import Highlight from '@tiptap/extension-highlight';

import LinkDialogComponent from '../link-dialog/link-dialog.component';
import { LinkExtension } from '../../extensions/link.extension';
import { ImageExtension } from '../../extensions/image.extension';
import { TextAlignmentExtension } from '../../extensions/text-aligment.extension';

@Component({
  selector: 'app-editor',
  standalone: true,
  templateUrl: './editor.component.html',
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: forwardRef(() => EditorComponent) }
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
    MatMenuModule,
    MatDialogModule,
    MatTooltipModule,
    EditorComponent,
  ],
})
export default class EditorComponent implements ControlValueAccessor, OnInit, OnDestroy {

  private readonly dialog = inject(MatDialog);

  @ViewChild("editorRef", { static: true }) private editorRef!: ElementRef<HTMLDivElement>;

  private content = signal<string>("");
  readonly textColorState = signal("#000000");

  private editor!: Editor;


  private onChange = (value: any) => { };

  writeValue(data: any): void {
    this.content.set(data);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
  }

  constructor() {
    effect(() => {
      this.editor.commands.setContent(this.content());
    }, { allowSignalWrites: true });
  }

  ngOnInit(): void {
    this.editor = new Editor({
      element: this.editorRef.nativeElement,
      extensions: [
        StarterKit,
        Underline,
        TextStyle,
        Highlight,
        Color.configure({
          types: ['textStyle']
        }),
        FontFamily.configure({
          types: ['textStyle']
        }),
        LinkExtension,
        ImageExtension,
        TextAlignmentExtension,
      ],
      content: ``,
      editable: true,
      autofocus: 'end',
      onSelectionUpdate: () => {
        this.getSelectionTextColor();
      },
      onUpdate: ({ editor }) => {
        this.onChange(editor.getHTML());
      }
    })
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  private getSelectionTextColor() {
    const selectionTextColor = <string | undefined>this.editor.getAttributes('textStyle')['color'];
    if (selectionTextColor) {
      this.textColorState.set(selectionTextColor);
    } else {
      this.textColorState.set("#000000");
    }
  }

  undo() {
    this.editor.chain().focus().undo().run();
  }

  redo() {
    this.editor.chain().focus().redo().run();
  }

  clear() {
    this.editor.chain().focus().clearContent().run();
  }

  toggleBold() {
    this.editor.chain().focus().toggleBold().run();
  }

  toggleItalic() {
    this.editor.chain().focus().toggleItalic().run();
  }

  toggleUnderline() {
    this.editor.chain().focus().toggleUnderline().run();
  }

  toggleStrike() {
    this.editor.chain().focus().toggleStrike().run();
  }

  setHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
    this.editor.chain().focus().setHeading({ level: level }).run();
  }

  setParagraph() {
    this.editor.chain().focus().setParagraph().run();
  }

  setLink() {
    firstValueFrom(this.dialog.open(LinkDialogComponent).afterClosed()).then((response) => {
      if (!(typeof response === "boolean") || !(response === false)) {
        this.editor.chain().focus().setLink({
          href: response,
          rel: "noopener noreferrer"
        }).run();
      }
    });
  }

  setColor(color: string) {
    this.textColorState.set(color);
    this.editor.chain().focus().setColor(color).run();
  }

  setFontFamily(name: string) {
    this.editor.chain().focus().setFontFamily(name).run();
  }

  setHighlight() {
    this.editor.chain().focus().toggleHighlight().run();
  }

  setTextFormat(name: "left" | "right" | "center") {
    this.editor.chain().focus().setTextAlign(name).run();
  }

  setImage() {
    this.editor.chain().focus().setImage({
      src: "/assets/mescidi-aksa.jpg",
      alt: "Fotoğraf",
      title: "Mescidi Aksa"
    }).run();
  }

  isActive(name: string, attributes?: {}) {
    return this.editor.isActive(name, attributes);
  }

  isActiveAttributes(attributes: {}) {
    return this.editor.isActive(attributes);
  }
}