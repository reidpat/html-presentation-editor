<script>
    import { onMount, onDestroy } from "svelte";
    import { Editor } from "@tiptap/core";
    import StarterKit from "@tiptap/starter-kit";
    import Image from '@tiptap/extension-image';
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

        console.log("outerDiv", outerDiv.innerHTML)

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

    function parseStyleObject(styleObj) {
        return Object.entries(styleObj)
            .map(([k, v]) => `${k}: ${v}`)
            .join("; ");
    }

    function onResize(entry) {
        let editorDiv = entry.target;
        let widthPercentage = Math.round(
            (editorDiv.offsetWidth /
                editorDiv.parentNode.parentNode.offsetWidth) *
                100,
        );
        let heightPercentage = Math.round(
            (editorDiv.offsetHeight /
                editorDiv.parentNode.parentNode.offsetHeight) *
                100,
        );

        heightPercentage = Math.max(5, heightPercentage);

        let width = `${widthPercentage}%`;
        let height = `${heightPercentage}%`;

        // Parse savedStyles into an object
        let styleObj = parseStyleString(savedStyles);

        // Update the object with new dimensions
        styleObj.width = width;
        styleObj.height = height;

        element.style.width = width;
        element.style.height = height;

        // console.log("Resized to:", width, height);

        // Convert the style object back to a string
        savedStyles = parseStyleObject(styleObj);
        // element.style = savedStyles;

        // Update the HTML content with new styles
        let updatedHtmlContent = wrapWithDiv(editor.getHTML(), savedStyles);
        console.log(editor.getJSON())
        console.log("updatedHTML", updatedHtmlContent)

        // Dispatch the updated HTML content
        dispatch("contentChanged", updatedHtmlContent);
    }

    export let content =
        "<p>If you see this, it means that your content did not load correctly</p>";

    let savedStyles;

    onMount(() => {
        let { innerHTML, styles } = stripOuterDiv(content);
        console.log("tipTapinner", innerHTML)
        savedStyles = styles;
        editor = new Editor({
            element: element,
            // editorProps: {
            //     attributes: {
            //         style: "position: absolute; top: 0%; left: 0%",
            //     },
            // },
            extensions: [StarterKit, CustomDiv, Image],
            content: innerHTML,
            onTransaction: () => {
                // force re-render so `editor.isActive` works as expected
                editor = editor;
            },
            // onUpdate: () => {
            //     editor = editor;
            //     dispatch(
            //         "contentChanged",
            //         wrapWithDiv(editor.getHTML(), savedStyles),
            //     );
            // },
        });
        console.log(editor.getHTML());
    });

    let startX, startY, initialX, initialY;
    let isDragging = false;

    let dragStartPosition = { x: 0, y: 0 };
    let editorStartPosition = { x: 0, y: 0 };
    let dragging = false;

    function onDragStart(event) {
        dragStartPosition = {
            x: event.clientX,
            y: event.clientY,
        };
        editorStartPosition = {
            // Calculate initial positions as percentages of the parent dimensions
            x: (element.offsetLeft / element.offsetParent.offsetWidth) * 100,
            y: (element.offsetTop / element.offsetParent.offsetHeight) * 100,
        };
        document.addEventListener("mousemove", onDragMove);
        document.addEventListener("mouseup", onDragEnd);
        dragging = true;
    }

    function onDragMove(event) {
        if (!dragging) return;

        // Get the parent dimensions
        const parentWidth = element.offsetParent.offsetWidth;
        const parentHeight = element.offsetParent.offsetHeight;

        // Calculate the change in mouse position as a percentage of the parent dimensions
        const dx = ((event.clientX - dragStartPosition.x) / parentWidth) * 100;
        const dy = ((event.clientY - dragStartPosition.y) / parentHeight) * 100;

        // Update the element's position in percentages
        element.style.left = `calc(${editorStartPosition.x}% + ${dx}%)`;
        element.style.top = `calc(${editorStartPosition.y}% + ${dy}%)`;
    }

    function onDragEnd(event) {
        dragging = false;
        document.removeEventListener("mousemove", onDragMove);
        document.removeEventListener("mouseup", onDragEnd);
        // Update the savedStyles with the new position
        let styleObj = parseStyleString(savedStyles);
        styleObj.position = "absolute";
        styleObj.left = element.style.left;
        styleObj.top = element.style.top;
        console.log(styleObj);

        savedStyles = parseStyleObject(styleObj);
        console.log(savedStyles);
    

        // savedStyles =
        //     `position: absolute; left: ${element.style.left}; top: ${element.style.top};` +
        //     savedStyles;
        // // Dispatch an update with the new styles
        dispatch("contentChanged", wrapWithDiv(editor.getHTML(), savedStyles));
    }

    onDestroy(() => {
        if (editor) {
            editor.destroy();
        }
    });
</script>

<!-- {#if editor}
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
{/if} -->

<div
    bind:this={element}
    use:resize={onResize}
    class="editor-container"
    style={savedStyles}
>
<!-- <div
    bind:this={element}
    class="editor-container"
    style={savedStyles}
> -->
    <div class="editor-buttons">
        <button class="drag-handle" on:mousedown={onDragStart}>Drag</button>
    </div>
</div>

<style>
    .editor-container {
        position: relative;
        border: 1px solid black; /* Adjust the size as needed */
        border-style: solid; /* Style the border to make it visible or as desired */
        box-sizing: border-box; /* To include the border in width and height calculations */
        resize: both !important;
        overflow: hidden;
        padding: 0px;
        margin: 0px;
        /* Other styles as needed */
    }
    .editor-buttons {
        position: absolute;
        top: 0px;
        right: 0px;
        z-index: 2;
    }

    .drag-handle {
        position: absolute; /* Position the button absolutely within the editor-container */
        top: 0; /* Align to the top edge */
        right: 0; /* Align to the right edge */
        cursor: move; /* Cursor indicates it can be dragged */
        background-color: #fff; /* Background color to cover any underlying content */
        /* Add additional styling to match your button design */
    }

    button.active {
        background: black;
        color: white;
    }
    :global(.tiptap) {
        width: 100%;
        height: 100%;
    }
</style>
