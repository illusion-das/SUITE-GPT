
let history_text = `[대화 기록]\n`;

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
                content: apiContent
            },
            {
                role: "user",
                content: history_text + `\n[현재 대화에 기반한 요청 및 응답]\n` + prompt
            } ],
            temperature: 0.84,
            max_tokens: 1000,
            top_p: 1,
            frequency_penalty: 0.52,
            presence_penalty: 0.5,
            stop: ["Human"],
        }),
    };
    console.log(history_text + `\n[현재 대화에 기반한 요청 및 응답]\n` + prompt);
    try {
        const response = await fetch(apiUrl, requestOptions);
        const data = await response.json();
        const aiResponse = data.choices[0].message.content;
        return aiResponse;
    } catch (error) {
		console.error('오류 : ', error);
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

        document.querySelector("chat-list").innerHTML = document.querySelector("chat-list").innerHTML + `<user-chat>${prompt.replace(/>/g, "〉").replace(/</g, "〈")}</user-chat>`;
        nowchat = document.querySelector("chat-list").innerHTML;

        document.querySelector("chat-list").innerHTML = document.querySelector("chat-list").innerHTML + `<ai-chat class="load">잠시만 기다려주세요.<load-area><load-bar></load-bar></load-area></ai-chat>`;
        document.querySelector("chat-list").scrollTop = document.querySelector("chat-list").scrollHeight;

        fetchAIResponse(prompt)
          .then(response => {
                if (response.length > 0) {
                    document.querySelector("chat-list").innerHTML = nowchat + `<ai-chat>${response.replace(/\n/g, "<br>").replace(/>/g, "〉").replace(/</g, "〈")}</ai-chat>`;
                    document.getElementById("userchat").disabled = false;
                    document.querySelector("chat-list").scrollTop = document.querySelector("chat-list").scrollHeight;
                    history_text += "Human : " + prompt + "\n";
                    history_text += "SUITE GPT : " + response + "\n";
                }
            })
          .catch(error => {
                document.querySelector("chat-list").innerHTML = nowchat + `<ai-chat>오류 : ${error}</ai-chat>`;
                document.getElementById("userchat").disabled = false;
            });
    }
}

function clearChat() {
    document.querySelector("chat-list").innerHTML = "";
    history_text = `모든 대화는 초기화되었고, 처음부터 시작합니다. 사용자가 이전 대화에 대해 물어본다면, 대화가 초기화 되었다고 답하세요. 이를 참고하십시오.\n[대화 기록]\n`;
    call_alert("채팅을 모두 지웠습니다.");
}

function callMore() {
    if (document.querySelector("more-content").classList.contains("hidden-more")) {
        document.querySelector("more-content").classList.remove("hidden-more");
    } else {
        document.querySelector("more-content").classList.add("hidden-more");
    }
}