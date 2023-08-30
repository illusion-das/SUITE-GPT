
/* 타겟 입력 */
const input = document.getElementById("userchat");

const keyboardzone = document.getElementById("keyboardzone");

/* 가상 키보드 등록 */
const keyboard = new customKeyboard(
        keyboardzone,
        input,  /* 입력 대상 */
        null,   /* 입력 시 이벤트 */
        function() {
            CallAI()
        },   /* 엔터 클릭 시 이벤트 */
);

keyboard_move.addEventListener("mousedown", move_start);
keyboard_move.addEventListener("mouseup", move_stop);
keyboard_move.addEventListener("touchstart", move_start);
keyboard_move.addEventListener("touchend", move_stop);

function keyboard_open() {
    keyboardzone.classList.remove("hidden");
    document.querySelector("input-area").classList.add("intext");
    document.querySelector("chat-area").classList.add("hidden-chat");
    document.querySelector("more-content").classList.add("hidden-chat");

    setTimeout(() => {
        keyboardzone.classList.remove("close-animation");
    }, 1);

    setTimeout(() => {
        keyboardzone.classList.remove("keyboard-close-animation");
    }, 250);
}

function keyboard_close() {
    keyboardzone.classList.add("keyboard-close-animation");
    document.querySelector("input-area").classList.remove("intext");
    document.querySelector("chat-area").classList.remove("hidden-chat");

    setTimeout(() => {
        keyboardzone.classList.add("close-animation");
    }, 1);

    setTimeout(() => {
        keyboardzone.classList.add("hidden");
        document.querySelector("more-content").classList.remove("hidden-chat");
    }, 250);
}

document.addEventListener("mousemove", handleMove);
document.addEventListener("touchmove", handleMove);