
async function fetchAIResponse(prompt) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "user",
                content: prompt
            }, ],
            temperature: 0.8,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0.5,
            stop: ["Human"],
        }),
    };
    try {
        const response = await fetch(apiUrl, requestOptions);
        const data = await response.json();
        const aiResponse = data.choices[0].message.content;
        return aiResponse;
    } catch (error) {
		console.error('ERROR : ', error);
    }
}

function call_alert(content) {
    try {
        clearTimeout(cutalert);
    } catch {}

    document.querySelector("alert-content").innerHTML = content;
    document.querySelector("alert-box").classList.remove("alert-hidden");

    cutalert = setTimeout(() => {
        document.querySelector("alert-box").classList.add("alert-hidden");
    }, 1000);
}