import Link from '@tiptap/extension-link';

export const LinkExtension = Link.configure({
    autolink: true,
    linkOnPaste: true,
    openOnClick: false,
    HTMLAttributes: {
        class: "editor-link"
    }
});