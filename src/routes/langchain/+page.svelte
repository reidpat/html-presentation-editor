<script>
    import { writable } from "svelte/store";
    import { onMount } from "svelte";

    let OpenAI_APIKey = writable("");

    // Save API key to local storage
    function saveAPIKey() {
        OpenAI_APIKey.subscribe((value) => {
            localStorage.setItem("OpenAI_APIKey", value);
        })();
    }

    // Load API key from local storage
    function loadAPIKey() {
        const savedKey = localStorage.getItem("OpenAI_APIKey");
        if (savedKey) {
            OpenAI_APIKey.set(savedKey);
        }
    }

    let chatModel;
    let res = ""

    onMount(async () => {
        loadAPIKey();

        chatModel = new ChatOpenAI({
            openAIApiKey: $OpenAI_APIKey,
        });

        res = await chatModel.invoke("what is LangSmith?");
        console.log(res);
    });

    import { ChatOpenAI } from "@langchain/openai";
</script>

<h1>Langchain Testing</h1>
<input type="text" bind:value={$OpenAI_APIKey} />
<button on:click={saveAPIKey}>Save API Key</button>
<p>{res.content}</p>
    

