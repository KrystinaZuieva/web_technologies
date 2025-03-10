document.getElementsByClassName("message")[0].innerText = "Hello world!";

function showStudentName(name) {
    console.log(name);
}

document.getElementById("showName").onclick = function() {
    showStudentName("Krystina Zuieva");
};
