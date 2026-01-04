//example 1
document.getElementById("changeTextBtn").addEventListener("click", function(){
    let paragraph = document.getElementById("myParagraph");
    paragraph.textContent = "The text has been changed!";
});

//example 2
document.getElementById("highlightFirstCityBtn").addEventListener("click", function(){
    let firstCity = document.getElementById("citiesList");
    firstCity.firstElementChild.classList.add("highlight");
});

//example 3
document.getElementById("changeCoffeeOrderBtn").addEventListener("click", function(){
    let coffee = document.getElementById("coffeeType");
    coffee.textContent = "Cappucino";
    coffee.style.color = "pink";
    coffee.style.padding = "10px";
});

//example 4
document.getElementById("addNewItemBtn").addEventListener("click", function(){
    let newItem = document.createElement("li");
    newItem.textContent = "Eggs";
    document.getElementById("shoppingList").appendChild(newItem);
});

//example 5
document.getElementById("removeLastTask").addEventListener("click", function(){
    let taskList = document.getElementById("taskList");
    taskList.lastElementChild.remove();
});

//example 6
document.getElementById("clickMeButton").addEventListener("dblclick", function(){
    alert("Button was double-clicked!");
});

//example 7
document.getElementById("teaList").addEventListener("click", function(event){
    if(event.target && event.target.matches(".teaItem")){
        alert("You selected: " + event.target.textContent);
    }
});

//example 8
document.getElementById("feedbackForm").addEventListener("submit", function(event){
    event.preventDefault();
    let feedback = document.getElementById("feedbackInput").value;
    document.getElementById("feedbackDisplay").textContent = "You submitted: " + feedback;
});

//example 9
document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("domStatus").textContent = "DOM is fully loaded!";
});

//example 10
document.getElementById("toggleHighlight").addEventListener("click", function(){
    let decription = document.getElementById("descriptionText");
    decription.classList.toggle("highlight");

});