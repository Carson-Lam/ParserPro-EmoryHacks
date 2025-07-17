window.onload = function () {
    window.currentPage = 1;
    console.log("Current Page:", window.currentPage); // For debugging purposes
};

window.addEventListener("message", function (event) {
    //If information sent
    if (event.data && event.data.explanation) {
        document.getElementById("aiOutput").innerText = event.data.explanation;
    }

    //If go button clicked
    if (event.data && event.data.action === 'goButtonClicked') {
        // Handle the button click by changing explanation text
        var aiOutput = document.getElementById('aiOutput');
        if (aiOutput) {
            aiOutput.textContent = "HIGHLIGHTING - No code highlighted! Highlight code and press *enter*";
        }
    }

    //If back button clicked
    if (event.data && event.data.action === 'backButtonClicked') {
        // Handle the button click by changing explanation text
        var aiOutput = document.getElementById('aiOutput');
        if (aiOutput) {
            aiOutput.textContent = "PARSING - No code to parse! Press the *parse* button on the top right.";
        }
    }
});