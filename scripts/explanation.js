window.onload = function () {
    window.currentPage = 1;
    console.log("Current Page:", window.currentPage); // For debugging purposes
};

window.addEventListener("message", function (event) {
    //Establish variables for text replacement
    var aiOutput = document.getElementById('aiOutput');
    var header = aiOutput.querySelector('#explanationHeader');
    var description = aiOutput.querySelector('#explanationDescript');

    //If code highlighted and entered
    if (event.data && event.data.explanation) {
        if (aiOutput) {
            header.textContent = "";
            description.textContent = event.data.explanation;
            description.classList.add('ai-text'); //Make text follow AI text formatting
            console.log("EXPLANATION GENERATED");
        }
    }

    // If go button clicked
    if (event.data && event.data.action === 'goButtonClicked') {
        if (aiOutput) {
            header.classList.add('header-text');
            header.textContent = "PARSING STAGE";
            description.classList.remove('ai-text');
            description.classList.add('descript-text')
            description.textContent = "// To analyze code, highlight code and press -Enter-";
            console.log("PARSING STAGE");
        }
    }

    // If back button clicked
    if (event.data && event.data.action === 'backButtonClicked') {
        if (aiOutput) {
            header.classList.add('header-text');
            header.textContent = "EDITING STAGE";
            description.classList.remove('ai-text');
            description.classList.add('descript-text');
            description.textContent = "// To parse code, press the *parse* button on the top right!"; 
            console.log("EDITING STAGE");
        }
    }
});