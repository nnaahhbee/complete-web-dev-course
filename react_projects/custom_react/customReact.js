function customRender(reactElement, container) {
    // const domElement = document.createElement(reactElement.type);
    // domElement.innerHTML = reactElement.children;
    // domElement.setAttribute('href', reactElement.props.href);
    // domElement.setAttribute('target', reactElement.props.target);
    // container.appendChild(domElement);


    // Create a new DOM element based on the type of the reactElement
    const domElement = document.createElement(reactElement.type);
    domElement.innerHTML = reactElement.children;
    for (const prop in reactElement.props){
        if(prop === 'children') continue;

        domElement.setAttribute(prop, reactElement.props[prop])
    }
    container.appendChild(domElement); 
}


// Define a custom render function that takes a reactElement and a container element
const reactElement = {
    type: 'a', //html element
    props: { // attributes 
        href: 'https://google.com',
        target: '_blank'
    },
    children: 'Click me to visit google' //children you inject
}


// Get the main container element from the DOM
const mainContainer = document.querySelector('#root');


// Render the reactElement into the mainContainer
customRender(reactElement, mainContainer); 