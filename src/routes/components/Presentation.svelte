<script>
    import { onMount } from 'svelte';
    import Slide from './Slide.svelte';

    let htmlContent = '';
    export let filename;

    async function loadSlideContent(filename) {
        const response = await fetch(`/slides/${filename}`);
        if (response.ok) {
            htmlContent = await response.text();
        } else {
            console.error('Failed to load slide:', response.status);
        }
    }

    onMount(() => {
        loadSlideContent(filename); // Replace 'slide1.html' with your filename
    });
</script>

<div>
    <Slide>{@html htmlContent}</Slide>
</div>
