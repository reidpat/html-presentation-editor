<script>
    import { onMount } from 'svelte';
    import Slide from './Slide.svelte';

    let htmlContent = '';
    export let filename;

    let presentation = ['slide1.html', 'slide2.html']

    async function loadPresentation(presentation){
        
    }

    async function loadSlideContent(filename) {
        const response = await fetch(`/slides/${filename}`);
        if (response.ok) {
            htmlContent = await response.text();
        } else {
            console.error('Failed to load slide:', response.status);
        }
    }

    onMount(() => {
        loadPresentation(presentation);
    });
</script>

<div>
    <Slide>{@html htmlContent}</Slide>
</div>
