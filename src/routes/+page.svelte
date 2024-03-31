<script>
    import { writable } from "svelte/store";
    import Editor from "../lib/components/Editor.svelte";
    import Presentation from "../lib/components/Presentation.svelte";



    let editing = true;

    function changeMode() {
        editing = !editing;
    }
 
    let slides = writable(['slide1', 'slide2', 'slide3'])
    // let slides = ['slide1', 'slide2', 'slide3']; // Array of slide names
</script>

<div>
    {#each $slides as slide}
        <a href={`/${slide}`}>{slide}</a> <!-- Links to each slide -->
    {/each}
</div>
<a href="/langchain">langchain</a>