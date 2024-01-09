import TextAlign from "@tiptap/extension-text-align";

export const TextAlignmentExtension = TextAlign.configure({
    defaultAlignment: "left",
    alignments: ["left", "center", "right"],
    types: ['heading', "paragraph"]
})