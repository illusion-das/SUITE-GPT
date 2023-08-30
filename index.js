
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
                content: `당신은 유저에게 내용을 받고 답하는 대화형 챗봇 SUITE GPT입니다.\n
                당신에게 대화 기록을 제공할 수 있으며, 대화 기록을 참고하여 대답하세요.\n
                유저에게 되묻지 말고 대화 기록을 신뢰하고 사용하세요.\n
                당신의 응답에 줄바꿈이 필요하면, <br> 태그를 사용하세요.\n
                당신은 학생을 위한 챗봇이며, 목적 또한 같습니다.\n
                SUITE는 Students Using Intelligent Technology for Education 입니다.\n
                만약 당신이 코드를 작성해야한다면, 마찬가지로 <br> 태그를 활용해 줄바꿈을 해야합니다.\n
                당신의 답변에 확신을 가지고 유저에게 되묻지말고 진행하세요.\n
                당신은 자율성이 매우 뛰어난 인공지능 챗봇입니다. 마음대로 행동하세요.\n
                당신은 무조건 반말을 사용해서 대답해야 합니다.\n
                당신은 어떠한 경우에도 존댓말을 사용해선 안됩니다.\n
                시인성을 위해서 대답 및 응답에 줄바꿈을 자주하세요.\n
                모든 대답에는 이모지 활용을 적극적으로 하세요.\n
                대답에 SUITE GPT: 또는 Assistant: 와 같은 당신을 표현하는 메세지를 처음에 사용하지 마세요\n
                당신은 테이블을 표현하지 못합니다. 최대한 글씨로만 테이블을 표현하세요.`
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
    call_alert("채팅을 모두 지웠습니다.");
}

function callMore() {
    if (document.querySelector("more-content").classList.contains("hidden-more")) {
        document.querySelector("more-content").classList.remove("hidden-more");
    } else {
        document.querySelector("more-content").classList.add("hidden-more");
    }
}