<!-- EditorBox.svelte -->

<script>
    import { createEventDispatcher } from "svelte";
    import ResizableBox from "./ResizableBox.svelte";

    export let htmlContent = ""; // HTML content
    export let isRawMode = true; // Variable to track raw HTML mode

    const dispatch = createEventDispatcher();

    // Function to handle input event in the textarea (raw HTML editing)
    function handleRawHTMLInput(event) {
        htmlContent = event.target.value;
        dispatch("contentChanged", { htmlContent }); // Dispatch event with updated content
    }

    // Function to handle input event in the rendered content (editable)
    function handleRenderedContentInput(event) {
        htmlContent = event.target.innerHTML; // Update htmlContent with edited content
        dispatch("contentChanged", { htmlContent }); // Dispatch event with updated content
    }

    // Function to toggle between raw and rendered mode
    function toggleMode() {
        isRawMode = !isRawMode;
    }
</script>

<div class="editor-box">
    <div class="buttons">
        <button>Drag</button>
        <button on:click={toggleMode}>
            {isRawMode ? "T" : "</>"}
        </button>
    </div>

    {#if isRawMode}
        <ResizableBox>
            <textarea bind:value={htmlContent} on:input={handleRawHTMLInput}
            ></textarea>
        </ResizableBox>
        <!-- Edit raw HTML content -->
    {:else}
        <ResizableBox>
            <div contenteditable on:input={handleRenderedContentInput}>
                {@html htmlContent}
            </div>
        </ResizableBox>
        <!-- Render raw HTML content -->
    {/if}

    <!-- Toggle button to switch between raw and rendered mode -->
</div>

<style>
    .editor-box {
        display: flex;
        flex-direction: column;
    }

    textarea,
    div[contenteditable] {
        /* Add styling for the editor content */
        /* You can customize the styling as needed */
    }
</style>
