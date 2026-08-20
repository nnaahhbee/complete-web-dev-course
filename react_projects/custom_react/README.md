# Custom React Renderer

A small educational JavaScript project that demonstrates how React creates and inserts DOM elements using a custom render function.

This project is created solely for learning purposes. It shows the core idea behind React's rendering process in a simplified way, without using the actual React library.

## Project Purpose

This project helps explain how React works internally at a basic level:

- a React element is just a JavaScript object
- the renderer creates a matching DOM node
- attributes are added from the element props
- the element's children are inserted into the DOM
- the result is mounted onto a target container

The idea is to understand the pattern behind React rendering, not to build a production-ready alternative.

## What This Project Does

The project defines a custom function called `customRender()`.

It takes:

- a React-like element object
- a container element

It then:

1. creates a DOM element using the element's `type`
2. sets the inner HTML from `children`
3. loops through the props object
4. applies each attribute to the DOM element
5. appends the element to the provided container

## Learning Takeaways

This project is useful for understanding:

- how React elements are represented as plain objects
- how JSX ultimately compiles to JavaScript objects
- how DOM nodes are created and edited
- how props become DOM attributes
- how rendering is mounted into a real container

## Educational Use Only

This project is created solely for educational purposes. It is not intended for production use, commercial deployment, or as a replacement for the actual React library.


