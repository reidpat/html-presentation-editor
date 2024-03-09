<script>
    import { onMount } from "svelte";
    import Slide from "./Slide.svelte";
    import EditorBox from "./EditorBox.svelte";

    export let filename;

    async function loadSlideContent(filename) {
        const response = await fetch(`/slides/${filename}`);
        if (response.ok) {
            htmlContent = await response.text();
            console.log(htmlContent);
        } else {
            console.error("Failed to load slide:", response.status);
        }
    }

    onMount(async() => {
        await loadSlideContent(filename); // Replace 'slide1.html' with your filename
    });
    let htmlContent = ""; // HTML content
    let isRawMode = false; // Variable to track raw HTML mode

    // Function to save the content with debounce
    let saveTimeout; // Variable to store the timeout ID
    const debounceSave = () => {
        clearTimeout(saveTimeout); // Clear previous timeout
        saveTimeout = setTimeout(saveContent, 500); // Set new timeout for 500 milliseconds
    };

    // Function to save the content
    async function saveContent() {
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

    function handleContentChange(event){
        htmlContent = event.detail.htmlContent;
        // htmlContent = htmlContent;
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

    // Function to handle changes in the rendered content (using Svelte reactive statement)
    // $: {
    //     debounceSave(); // Debounced save operation
    // }

    // Load initial content when component is mounted (optional)
</script>

<Slide>
    <EditorBox bind:htmlContent bind:isRawMode on:contentChanged={handleContentChange}/>
</Slide>
