<script>
    import { onMount } from "svelte";
    import Slide from "./Slide.svelte";
    import EditorBox from "./EditorBox.svelte";

    export let filename;

    async function loadSlideContent(filename) {
        let htmlContent;
        const response = await fetch(`/slides/${filename}`);
        if (response.ok) {
            htmlContent = await response.text();
            console.log(htmlContent);
        } else {
            console.error("Failed to load slide:", response.status);
        }

        return htmlContent;
    }

    let contentBlocks = []; // Array to store individual content blocks

    // Function to parse the main content and find content blocks
    function extractContentBlocks(htmlContent) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, "text/html");
        const blocks = doc.querySelectorAll(".content-block");

        // Extract the innerHTML of each content-block
        return Array.from(blocks).map((block) => block.outerHTML);
    }

    // Load initial content and parse content blocks
    // onMount(async () => {
    //     await loadSlideContent(filename); // Your existing loading function
    //     contentBlocks = extractContentBlocks(htmlContent);
    // });

    let htmlContent = ""; // HTML content
    let isRawMode = false; // Variable to track raw HTML mode

    // Function to save the content with debounce
    let saveTimeout; // Variable to store the timeout ID
    const debounceSave = () => {
        clearTimeout(saveTimeout); // Clear previous timeout
        htmlContent = contentBlocks.join("");
        saveTimeout = setTimeout(() => saveContent(), 100); // Set new timeout for 500 milliseconds
    };

    // Function to save the content
    async function saveContent() {
        console.log(htmlContent);
        try {
            const response = await fetch("/api/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    filename: "slide1.html",
                    content: htmlContent,
                }), // Adjust filename as needed
            });

            if (!response.ok) {
                throw new Error(
                    `Failed to save content: ${response.statusText}`,
                );
            }

            console.log("Content saved successfully");
        } catch (error) {
            console.error("Error saving content:", error);
        }
    }

    onMount(async () => {
        // Load initial content
        const loadedHtmlContent = await loadSlideContent(filename);
        console.log("loadedHTMLContent", loadedHtmlContent);
        contentBlocks = extractContentBlocks(loadedHtmlContent);
        console.log("contentblocks", contentBlocks);
    });

    function handleContentChange(event, index) {
        contentBlocks[index] = event.detail.htmlContent;
        debounceSave();
    }
    // Function to handle input event in the textarea (raw HTML editing)
    function handleRawHTMLInput(event) {
        htmlContent = event.target.value;
        debounceSave(); // Debounced save operation
    }

    function handleRenderedContentInput(event) {
        htmlContent = event.target.innerHTML; // Update htmlContent with edited content
        debounceSave(); // Debounced save operation
    }

    function addNewBlock() {
        // Define the default content for the new block
        const newBlockContent = `<div class="content-block" style="width: 10%; height: 10%; position: relative; left: 0%; top: 0%;"></div>`;

        // Push the new content block into the array of blocks
        contentBlocks = [...contentBlocks, newBlockContent];
    }

    // Function to handle changes in the rendered content (using Svelte reactive statement)
    // $: {
    //     debounceSave(); // Debounced save operation
    // }

    // Load initial content when component is mounted (optional)
</script>

<button on:click={addNewBlock}>Add new block</button>
<Slide>
    {#if contentBlocks}
        {#each contentBlocks as blockHtml, index (index)}
            <EditorBox
                htmlContent={blockHtml}
                on:contentChanged={(event) => handleContentChange(event, index)}
            />
        {/each}
    {/if}
</Slide>
