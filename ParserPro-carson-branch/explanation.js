window.onload = function() {
    window.currentPage = 1;
    console.log("Current Page:", window.currentPage); // For debugging purposes
};

window.addEventListener("message", function(event) {
    if (event.data && event.data.explanation) {
        document.getElementById("aiOutput").innerText = event.data.explanation;
    }
});