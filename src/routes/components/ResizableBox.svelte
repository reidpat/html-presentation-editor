<!-- ResizableContent.svelte -->

<script>
    import { onMount } from 'svelte';

    export let minWidth = '0px'; // Minimum width of the content box
    export let minHeight = '0px'; // Minimum height of the content box
  
    // Function to make the content box resizable
    function makeResizable() {
      const resizableContent = document.querySelector('.resizable-content');
      resizableContent.addEventListener('mousedown', function (e) {
        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResize);
      });
  
      function resize(e) {
        resizableContent.style.width = e.clientX - resizableContent.getBoundingClientRect().left + 'px';
        resizableContent.style.height = e.clientY - resizableContent.getBoundingClientRect().top + 'px';
      }
  
      function stopResize() {
        window.removeEventListener('mousemove', resize);
      }
    }
  
    // Make the content box resizable on component mount
    onMount(() => {
      makeResizable();
    });
  </script>
  
  <div class="resizable-content" style="min-width: {minWidth}; min-height: {minHeight};">
    <slot></slot>
  </div>
  
  <style>
    /* Add styling for the resizable content */
    .resizable-content {
      /* Add styles to resemble the appearance of the rendered content */

      border: 1px solid #ccc; /* Add border */
      overflow: auto; /* Add scrollbar if content overflows */
      resize: both; /* Allow resizing */
    }
  
    /* Style the content within the resizable content */
    .resizable-content > * {
      /* Add styles for the content */
      width: 100%; /* Take up full width */
      height: 100%; /* Take up full height */
    }
  </style>
  