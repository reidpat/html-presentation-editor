<script>
    import Editor from "./components/Editor.svelte";
    import Presentation from "./components/Presentation.svelte";

    let editing = true;

    function changeMode() {
        editing = !editing;
    }

    

    
</script>

<!-- {#if editing}
    <button on:click={changeMode}>Present</button>
    <Editor filename="slide1.html"/>
    
{:else} -->
    <!-- <button on:click={changeMode}>Edit</button> -->
    <Presentation filename="slide2.html" />
<!-- {/if} -->
