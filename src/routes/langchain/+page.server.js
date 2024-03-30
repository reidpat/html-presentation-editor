// export async function load({ params, fetch }) {
//     const { slide } = params;
//     console.log(slide);
//     const response = await fetch(`/slides/${slide}.html`);
//     if (!response.ok) {
//         // Handle error, e.g., redirect to a custom error page or show a message
//         return { status: response.status, error: new Error('Slide not found') };
//     }
//     const content = await response.text();
//     console.log(content);
//     return { content, slide };
// }