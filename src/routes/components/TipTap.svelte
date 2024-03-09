<script>
    import { onMount, onDestroy } from "svelte";
    import { Editor } from "@tiptap/core";
    import StarterKit from "@tiptap/starter-kit";
    import CustomDiv from "./TipTapCustom/CustomDiv"; // Import your custom node
    // import ReadOnlyOuterElement from "./TipTapCustom/ReadOnlyOuterElement"
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    let element;
    let editor;

    import { resize } from "svelte-resize-observer-action";

    let width;
    let height;

    function parseStyleString(styleString) {
        const styles = {};
        styleString.split(";").forEach((style) => {
            const [key, value] = style.split(":").map((s) => s.trim());
            if (key && value) {
                styles[key] = value;
            }
        });
        return styles;
    }

    function stripOuterDiv(htmlContent) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, "text/html");
        const outerDiv = doc.querySelector(".content-block");

        let explicitStyles = "";
        if (outerDiv) {
            explicitStyles = outerDiv.getAttribute("style") || ""; // Get the style attribute as a string
            return { innerHTML: outerDiv.innerHTML, styles: explicitStyles };
        }

        return { innerHTML: htmlContent, styles: explicitStyles }; // Return original content if no specific div
    }

    // const { innerHTML: editorContent, styles: savedStyles } =
    // stripOuterDiv(htmlContent);
    function wrapWithDiv(editorContent, styles) {
        return `<div class="content-block" style="${styles}">${editorContent}</div>`;
    }
    // Usage:
    // const currentContent = editor.getContent();
    // const htmlContentWithDiv = wrapWithDiv(currentContent, savedStyles);

    function onResize(entry) {
        let editorDiv = entry.target;
        let width = editorDiv.firstChild.offsetWidth + "px";
        let height = editorDiv.firstChild.offsetHeight + "px";

        // Parse savedStyles into an object
        let styleObj = parseStyleString(savedStyles);

        // Update the object with new dimensions
        styleObj.width = width;
        styleObj.height = height;

        console.log("Resized to:", width, height);

        // Convert the style object back to a string
        savedStyles = Object.entries(styleObj)
            .map(([k, v]) => `${k}: ${v}`)
            .join("; ");

        // Update the HTML content with new styles
        let updatedHtmlContent = wrapWithDiv(editor.getHTML(), savedStyles);

        // Dispatch the updated HTML content
        dispatch("contentChanged", updatedHtmlContent);
    }

    export let content =
        "<p>If you see this, it means that your content did not load correctly</p>";

    let savedStyles;

    onMount(() => {
        let { innerHTML, styles } = stripOuterDiv(content);
        savedStyles = styles;
        editor = new Editor({
            element: element,
            editorProps: {
                attributes: {
                    style: styles, // Convert the styles object to a string
                    // You can add additional attributes here if needed
                },
            },
            extensions: [StarterKit, CustomDiv],
            content: innerHTML,
            onTransaction: () => {
                // force re-render so `editor.isActive` works as expected
                editor = editor;
            },
            onUpdate: () => {
                editor = editor;
                dispatch(
                    "contentChanged",
                    wrapWithDiv(editor.getHTML(), savedStyles),
                );
            },
        });
        console.log(editor.getHTML());
    });

    onDestroy(() => {
        if (editor) {
            editor.destroy();
        }
    });
</script>

{#if editor}
    <button
        on:click={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()}
        class:active={editor.isActive("heading", { level: 1 })}
    >
        H1
    </button>
    <button
        on:click={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()}
        class:active={editor.isActive("heading", { level: 2 })}
    >
        H2
    </button>
    <button
        on:click={() => editor.chain().focus().setParagraph().run()}
        class:active={editor.isActive("paragraph")}
    >
        P
    </button>
{/if}

<div bind:this={element} use:resize={onResize} />

<style>
    button.active {
        background: black;
        color: white;
    }
    :global(.tiptap) {
        resize: both !important;
        overflow: hidden;
    }
</style>
