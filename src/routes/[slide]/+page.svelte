<script>
    import { onMount } from "svelte";

    export let data;
    onMount(() => {
        console.log(data);
    })
</script>

<div class="slide-container">
    <div class="slide-content">
        {@html data.content}
    </div>
</div>

<style>
    /* Add styling for the slide container */
    .slide-container {
        /* Center the slide vertically */
        position: absolute; /* Position fixed to cover the entire viewport */
        top: 0; /* Align to the top of the viewport */
        left: 0; /* Align to the left of the viewport */
        width: 100%; /* Take up the entire width of the viewport */
        height: 100%; /* Take up the entire height of the viewport */
        display: flex; /* Use flexbox layout */
        justify-content: center; /* Center horizontally */
        align-items: center; /* Center vertically */
        z-index: -100;
    }

    /* Add styling for the slide content */
    .slide-content {
        /* Define styles for the slide */
        width: 100%; /* Take up the entire width */
        max-width: calc(
            100vh * 16 / 9
        ); /* Set maximum width based on 16:9 aspect ratio */
        height: calc(
            100vw * 9 / 16
        ); /* Maintain aspect ratio of 16:9 based on viewport width */
        /* font-size: 2rem; */
        font-size: 2rem;
        border: 2px solid #cccccc; /* Add a visible border on all sides */
        box-sizing: border-box; /* Include border and padding in the element's total width and height */
        overflow: hidden; /* Hide any overflow content */
        position: relative;
    }
    :global(html) {
        font-size: calc(1.5vw + 1.5vh - 1rem);
    }
</style>
