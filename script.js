
let conversationHistory = [{
    role: 'system',
    content: [
        /* PROMPT V2 */
        "PROMPT",
        "HERE"
    ].join('')
}]

document.getElementById('codeForm').addEventListener('submit', function(event) {
    event.preventDefault();
    console.log('HELLO');
    var textarea = document.getElementById('codeInput');
    var pre = document.createElement('pre');
    pre.classList.add('noEditPre');
    pre.id = 'noEditPre'
    pre.textContent = textarea.value;
    textarea.parentNode.replaceChild(pre, textarea);
});

