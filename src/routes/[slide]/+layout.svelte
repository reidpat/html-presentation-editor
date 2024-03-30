<!-- src/routes/index.svelte or a separate component -->
<script>
    let slides = ['slide1', 'slide2', 'slide3']; // Array of slide names
</script>

<div>
    <slot />
    {#each slides as slide}
        <a href={`/${slide}`}>{slide}</a> <!-- Links to each slide -->
    {/each}
</div> 
