//Setup info button
const infoButton = document.getElementById("infoButton");
const infoPopup = document.getElementById("infoPopup");

var selectedText = "";
var parsing = false;
let currentPage = 1;
window.currentPage = currentPage;
let globalArray = [0];
let globalAlgorithm = "test";
let iframe = document.getElementById('frameExplanation');

if (infoButton) {
    //Toggle info popup
    infoButton.addEventListener("click", function () {
        // Check if the popup is currently visible
        if (infoPopup.style.display === "block") {
            infoPopup.style.display = "none"; // Hide the popup if it's already visible
            infoButton.innerHTML = " 🛈 Info "; // Change button text back
        } else {
            infoPopup.style.display = "block"; // Show the popup if it's hidden
            infoButton.innerHTML = " ✖ Close "; // Change button text to "Close"
        }
    });
}

//Initialize conversation history array w/ prompt
let conversationHistory = [{
    role: 'system',
    content: [
        /* PROMPT */
        'You are the best software engineer in the world. ',
        'You have decades of experience in understanding and ',
        'explaining any kind of code you encounter.'
    ].join('')
}]

//Setup parse function
var goButton = document.getElementById('goButton');
if (goButton) {
    goButton.addEventListener('click', function (event) {
        parsing = true;
        event.preventDefault();
        console.log('Parsing!');

        //Get references to page elements
        var textarea = document.getElementById('codeInput');
        var submitButton = document.getElementById('goButton');

        //Send button click to explanation frame
        if (iframe.contentWindow) {
            iframe.contentWindow.postMessage({
                action: 'goButtonClicked'
            }, '*');
        } else {
            console.log("no iframe!")
        }

        //Create new elements
        var highlightArea = document.createElement('pre');
        var backButton = document.createElement('button');

        //Create the highlight area
        highlightArea.classList.add('highlightArea');
        highlightArea.id = 'highlightArea';
        highlightArea.textContent = textarea.value;
        textarea.parentNode.replaceChild(highlightArea, textarea); //Replace text area w highlight area

        //Create the back button
        // backButton.classList.add('btn', 'btn-dark');
        backButton.id = 'backButton'
        backButton.textContent = "⮜ (Back!)";
        submitButton.parentNode.replaceChild(backButton, submitButton); //Replace submit button w back button


        //Make back button restore textarea and submit button
        backButton.addEventListener('click', function () {
            parsing = false;
            highlightArea.parentNode.replaceChild(textarea, highlightArea);
            backButton.parentNode.replaceChild(submitButton, backButton);


            if (iframe.contentWindow) {
                iframe.contentWindow.postMessage({
                    action: 'backButtonClicked'
                }, '*');
            } else {
                console.log("no iframe!")
            }
        });
    });
}


// Check highlighted text
function checkHighlightedText() {
    // Store selected text as a string and where selection starts (anchor node)
    const newSelectedText = window.getSelection().toString();
    // const selectionAnchorNode = window.getSelection().anchorNode;


    // Check if highlighted text is in the highlight area and if anything is highlighted
    if (newSelectedText && highlightArea.textContent.includes(newSelectedText)) {
        selectedText = newSelectedText;
        console.log("Highlighted: ", selectedText);
    } else {
        console.log("No text highlighted.");
    }
}


//Check for enter keypress and parse selected text if yes
document.addEventListener('keydown', async function (event) {
    if (event.key === 'Enter' && parsing == true) {
        console.log("Enter key pressed!");
        checkHighlightedText();

        // CASE 1: USER IS ON PAGE EXPLANATION //
        if (window.currentPage == 1) {
            console.log("Entered explanation case!");

            // Define iframe variables
            // let iframe = document.querySelector("iframe");

            // ----- First Prompt: Full AI Explanation -----
            conversationHistory.push({
                role: 'system',
                content: [
                    'As explained in the last prompt ',
                    'You are the best software engineer in the world. ',
                    'You have decades of experience in understanding and ',
                    'explaining any kind of code you encounter. ',
                    'First, understand the function and purpose of the code. ',
                    'After, craft a concise but detailed explanation ',
                    'that summarizes what the code does. Ensure that the ',
                    'response is given in plain text. ',
                    'You understand everything in the code submitted. ',
                    'Under no circumstances will you prompt the user ',
                    'for more information. The response should not reveal ',
                    'your persona, keep the response impersonable and analytic.',
                    'You should also format your response nicely in HTML. DO NOT just output',
                    'a block of text. HTML Bullet points, Line seperators, ',
                    'paragraph breaks, and more. Keep headers consistent in size.',
                    'Make sure to include blank lines for readability.'
                ].join('')
            });

            //Check for duplicate input
            // if (selectedText === document.getElementById('aiOutput').getAttribute('data-last-query')) {
            //     console.log("bruh");
            //     return;
            // }
            // document.getElementById('aiOutput').setAttribute('data-last-query', selectedText);

            //Dummy loading text
            // if (aiOutput) aiOutput.innerHTML = "Generating response...";
            iframe.contentWindow.postMessage({
                explanation: 'Generating response...'
            }, "*");

            conversationHistory.push({
                role: 'user',
                content: selectedText
            });

            try {
                const response1 = await fetch(`https://parserpro.onrender.com/parse`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        messages: conversationHistory,
                        model: 'llama-3.3-70b-versatile'
                    })
                });

                const completion1 = await response1.json();
                conversationHistory.push({
                    role: 'assistant',
                    content: completion1.choices[0].message.content
                });

                iframe.contentWindow.postMessage({
                    explanation: completion1.choices[0].message.content
                }, "*");
            } catch (error) {
                console.error('Error: ', error.message);
            }
        }

        // CASE 2: USER IS ON PAGE VISUALIZATAION //
        else if (currentPage == 2) {
            console.log("Entered visualization case!");
            // ----- Second Prompt: Single Word (Sorting Algorithm) -----
            conversationHistory.push({
                role: 'system',
                content: [
                    'As explained in the last prompt ',
                    'You are the best software engineer in the world. ',
                    'You have decades of experience in understanding and ',
                    'explaining any kind of code you encounter. ',
                    'First, analyze the code to see if there are any sorting algorithms. ',
                    'If one of the sorting algorithms is on the following list, ',
                    'your response should be solely that word: ',
                    'bubble, insertion, selection, quick, merge, counting, radix, heap, bucket. ',
                    'If it is not on the list, print out "default".'
                ].join('')
            });
            conversationHistory.push({
                role: 'user',
                content: selectedText
            });

            let codeAlgorithm = '';
            try {
                const response2 = await fetch(`https://parserpro.onrender.com/parse`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        messages: conversationHistory,
                        model: 'llama-3.3-70b-versatile'
                    })
                });

                const completion2 = await response2.json();
                conversationHistory.push({
                    role: 'assistant',
                    content: completion2.choices[0].message.content
                });

                codeAlgorithm = completion2.choices[0].message.content.trim();
                //sets global variable
                window.codeAlgorithm = codeAlgorithm;
                console.log(codeAlgorithm);
                console.log("Detected Sorting Algorithm:", codeAlgorithm);
            } catch (error) {
                console.error('Error: ', error.message);
            }

            // ----- Third Prompt: Extract Array or Create Dummy Array -----
            // Only proceed if a sorting algorithm was detected (i.e., not "default").
            if (codeAlgorithm !== 'default') {
                conversationHistory.push({
                    role: 'system',
                    content: [
                        'As explained in the last prompt ',
                        'You are the best software engineer in the world. ',
                        'You have decades of experience in understanding and ',
                        'explaining any kind of code you encounter. ',
                        'Examine the submitted code and extract an array literal if one exists. ',
                        'If no array literal is present, return a dummy array with random values. '
                    ].join('')
                });
                conversationHistory.push({
                    role: 'user',
                    content: selectedText
                });

                let codeArray = '';
                try {
                    const response3 = await fetch(`https://parserpro.onrender.com/parse`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            messages: conversationHistory,
                            model: 'llama-3.3-70b-versatile'
                        })
                    });

                    const completion3 = await response3.json();
                    conversationHistory.push({
                        role: 'assistant',
                        content: completion3.choices[0].message.content
                    });
                    codeArray = completion3.choices[0].message.content.trim();
                    //sets global variable
                    window.codeArray = codeArray;
                    console.log(codeArray);
                    console.log("Extracted Array or Dummy Array:", codeArray);
                } catch (error) {
                    console.error('Error: ', error.message);
                }
            } else {
                console.log("No sorting algorithm found; skipping array extraction.");
            }
        }

        // CASE 3: USER IS ON PAGE TREES//
        else if (currentPage == 3) {
            console.log("Entered tree case!");
            // ----- Second Prompt: Single Word (Sorting Algorithm) -----
            conversationHistory.push({
                role: 'system',
                content: [
                    'As explained in the last prompt ',
                    'You are the best software engineer in the world. ',
                    'You have decades of experience in understanding and ',
                    'explaining any kind of code you encounter. ',
                    'First, analyze the code to see if there are any sorting algorithms. ',
                    'If one of the sorting algorithms is on the following list, ',
                    'your response should be solely that word: ',
                    'bubble, insertion, selection, quick, merge, counting, radix, heap, bucket. ',
                    'If it is not on the list, print out "default".'
                ].join('')
            });
            conversationHistory.push({
                role: 'user',
                content: selectedText
            });

            let codeAlgorithm = '';
            try {
                const response2 = await fetch(`https://parserpro.onrender.com/parse`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        messages: conversationHistory,
                        model: 'llama-3.3-70b-versatile'
                    })
                });

                const completion2 = await response2.json();
                conversationHistory.push({
                    role: 'assistant',
                    content: completion2.choices[0].message.content
                });

                codeAlgorithm = completion2.choices[0].message.content.trim();
                globalAlgorithm = codeAlgorithm;
                localStorage.setItem("sortingAlgorithm", codeAlgorithm);
                console.log("Saved to localStorage:", codeAlgorithm);
            } catch (error) {
                console.error('Error: ', error.message);
            }

            // ----- Third Prompt: Extract Array or Create Dummy Array -----
            // Only proceed if a sorting algorithm was detected (i.e., not "default").

            conversationHistory.push({
                role: 'system',
                content: [
                    'As explained in the last prompt ',
                    'You are the best software engineer in the world. ',
                    'You have decades of experience in understanding and ',
                    'explaining any kind of code you encounter. ',
                    'Examine the submitted code and extract an array literal if one exists. ',
                    'If no array literal is present, return a dummy array with random values. ',
                    'The format of the array should be as follow 64, 25, 12, 22, 11 do not ',
                    'change the brackets or commas and do not add any other characters to this format'
                ].join('')
            });
            conversationHistory.push({
                role: 'user',
                content: selectedText
            });

            let codeArray = '';
            try {
                const response3 = await fetch(`https://parserpro.onrender.com/parse`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        messages: conversationHistory,
                        model: 'llama-3.3-70b-versatile'
                    })
                });

                const completion3 = await response3.json();
                conversationHistory.push({
                    role: 'assistant',
                    content: completion3.choices[0].message.content
                });
                codeArray = completion3.choices[0].message.content.trim();
                //sets global variable
                globalArray = codeArray;
                localStorage.setItem("globalArray", JSON.stringify(codeArray));
                console.log("Saved to localStorage:", JSON.stringify(codeArray));
            } catch (error) {
                console.error('Error: ', error.message);
            }
        }
    }
});