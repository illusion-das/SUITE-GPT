
let history_text = `[대화 기록]\n`;
let talk_count = 0;
let final_history_len = 0;

async function fetchAIResponse(prompt) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo-16k",
            messages: [{
                role: "system",
                content: apiContent
            },
            {
                role: "user",
                content: history_text + `\n[현재 대화에 기반한 요청]\n` + prompt
            } ],
            temperature: 0.8,
            max_tokens: 786,
            top_p: 1,
            frequency_penalty: 0.47,
            presence_penalty: 0.49,
            stop: ["Human"],
        }),
    };
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

        if(talk_count > 7) {
            cutarea = history_text.length - final_history_len;
            history_text = `[대화 기록]\n` + history_text.substring(cutarea);
            console.error("Optimized");
            console.warn(history_text);
        }

        if(!document.getElementById("start").classList.contains("hidden-image")) {
            document.getElementById("start").classList.add("hidden-image");
        }

        document.getElementById("userchat").value = "";
        document.getElementById("userchat").disabled = true;
        document.getElementById("userchat").placeholder = "열심히 답변을 생성하고 있어요!"

        document.querySelector("chat-list").innerHTML = document.querySelector("chat-list").innerHTML + `<user-chat>${prompt.replace(/>/g, "〉").replace(/</g, "〈")}</user-chat>`;
        nowchat = document.querySelector("chat-list").innerHTML;

        document.querySelector("chat-list").innerHTML = document.querySelector("chat-list").innerHTML + `<ai-chat class="load">잠시만 기다려주세요.<load-area><load-bar></load-bar></load-area></ai-chat>`;
        document.querySelector("chat-list").scrollTop = document.querySelector("chat-list").scrollHeight;

        fetchAIResponse(prompt)
          .then(response => {
                if (response.length > 0) {
                    talk_count++;
                    document.querySelector("chat-list").innerHTML = nowchat + `<ai-chat>${response.replace(/\n/g, "\newlineTag").replace(/>/g, "〉").replace(/</g, "〈").replace(/\newlineTag/g, "<br>").replace("SUITE AI : ", "").replace("SUITE AI: ", "")}</ai-chat>`;
                    document.getElementById("userchat").disabled = false;
                    document.getElementById("userchat").placeholder = "메세지 보내기...";
                    document.querySelector("chat-list").scrollTop = document.querySelector("chat-list").scrollHeight;
                    history_text += "Human : " + prompt + "\n";
                    history_text += "SUITE AI : " + response + "\n";
                    final_history_len = ("Human : " + prompt + "\n").length + ("SUITE AI : " + response + "\n").length;
                    console.log(history_text);
                    console.warn(final_history_len);
                }
            })
          .catch(error => {
                console.error(error);
                document.querySelector("chat-list").innerHTML = nowchat + `<ai-chat>오류가 발생했어!<br>몇 분만 기다렸다가, 시도해줘!</ai-chat>`;
                document.getElementById("userchat").disabled = false;
                document.getElementById("userchat").placeholder = "메세지 보내기...";
                document.querySelector("chat-list").scrollTop = document.querySelector("chat-list").scrollHeight;
            });
    }
}

function clearChat() {
    document.querySelector("chat-list").innerHTML = '<img src="./res/start.png" id="start"><margin-chat></margin-chat>';
    history_text = `[대화 기록]\n`;
    call_alert("새로운 주제를 시작하였습니다.");
}

function callMore() {
    if (document.querySelector("more-content").classList.contains("hidden-more")) {
        document.querySelector("more-content").classList.remove("hidden-more");
    } else {
        document.querySelector("more-content").classList.add("hidden-more");
    }
}