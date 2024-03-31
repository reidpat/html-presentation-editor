<script>
    import { writable } from "svelte/store";
    import { onMount } from "svelte";
    import { ChatOpenAI } from "@langchain/openai";
    import { ChatMessage } from "@langchain/core/messages";

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

    async function loadFileContent(filename) {
        const response = await fetch(`/files/${filename}`);
        let res = ''
        if (response.ok) {
            res = await response.text();
        } else {
            console.error('Failed to load file:', response.status);
        }
        console.log(res2);
        return res;
    }

    let chatModel;
    let res = ""
    let res2 = ""

    //https://js.langchain.com/docs/modules/model_io/concepts
    let messages = [new ChatMessage("system message content",'system'), new ChatMessage("user message", "user"), new ChatMessage("user message", "assistant")]

    onMount(async () => {
        loadAPIKey();

        chatModel = new ChatOpenAI({
            openAIApiKey: $OpenAI_APIKey,
        });

        res = await chatModel.invoke(messages);
        res2 = await loadFileContent('info.txt');
    });

</script>

<h1>Langchain Testing</h1>
<input type="text" bind:value={$OpenAI_APIKey} />
<button on:click={saveAPIKey}>Save API Key</button>
<p>{res.content}</p>
<p>{res2}</p>


