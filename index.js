
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
                role: "system",
                content: "당신의 이름은 SUITE GPT입니다. 사용자의 질문에 응답해야합니다. 응답에 줄바꿈이 필요하면, <br> 태그를 사용하세요. 또한, 최대한 이는 학생을 위한 챗봇임으로, 최대한 친절하고 이해가 쉬운 표현을 사용하세요."
            },
            {
                role: "user",
                content: prompt
            } ],
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

function CallAI() {
    keyboard_close();
    resetlist();

    const prompt = document.getElementById("userchat").value;
    
    if (prompt.length > 0) {
        document.getElementById("userchat").value = "";
        document.getElementById("userchat").disabled = true;

        document.querySelector("chat-list").innerHTML = document.querySelector("chat-list").innerHTML + `<user-chat>${prompt}</user-chat>`;
        nowchat = document.querySelector("chat-list").innerHTML;

        document.querySelector("chat-list").innerHTML = document.querySelector("chat-list").innerHTML + `<ai-chat class="load">잠시만 기다려주세요.<load-area><load-bar></load-bar></load-area></ai-chat>`;
        document.querySelector("chat-list").scrollTop = document.querySelector("chat-list").scrollHeight;

        fetchAIResponse(prompt)
          .then(response => {
                if (response.length > 0) {
                    document.querySelector("chat-list").innerHTML = nowchat + `<ai-chat>${response.replace(/```/g, "<br><br>")}</ai-chat>`;
                    document.getElementById("userchat").disabled = false;
                    document.querySelector("chat-list").scrollTop = document.querySelector("chat-list").scrollHeight;
                }
            })
          .catch(error => {
                document.querySelector("chat-list").innerHTML = nowchat + `<ai-chat>${error}</ai-chat>`;
                document.getElementById("userchat").disabled = false;
            });
    }
}

function clearChat() {
    document.querySelector("chat-list").innerHTML = "";
    call_alert("채팅을 모두 지웠습니다.");
}

function callMore() {
    if (document.querySelector("more-content").classList.contains("hidden-more")) {
        document.querySelector("more-content").classList.remove("hidden-more");
    } else {
        document.querySelector("more-content").classList.add("hidden-more");
    }
}