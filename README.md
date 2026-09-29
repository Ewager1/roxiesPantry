# Roxie’s Pantry

> **Work in progress**

Roxie’s Pantry is a pet e-commerce application built around something I enjoy about frontend engineering: creating a fast, intuitive user experience through thoughtful state management and data architecture.

The project focuses on two areas that often become difficult as applications grow:

- **Intelligent caching and data loading** so navigation feels immediate without making unnecessary requests.
- **Advanced, shareable filtering** that allows users to build complex product searches, preserve them in the URL, share them with others, and navigate naturally with the browser’s back and forward controls.

Rather than treating filtering as a collection of disconnected checkboxes, Roxie’s Pantry is designed around a faceted catalog system where available filters can change based on the user’s current search context.

The goal is to build an e-commerce experience that feels simple to use while demonstrating the engineering required to make that simplicity possible.

## Project Goals

### Caching

- Use TanStack Query to manage server state and product-query caching
- Design predictable query keys for catalog state
- Reuse cached results during navigation
- Prefetch likely next requests
- Minimize unnecessary network traffic
- Handle invalidation deliberately rather than relying on broad refetches

### Responsive User Experience

- Build a catalog that works across mobile, tablet, and desktop
- Use modern CSS and CSS Modules
- Minimize layout shifts
- Provide clear loading, empty, and error states
- Optimize product images and catalog rendering

### Shareable Catalog State

Filtering, sorting, search, and pagination will be represented in the URL.

This allows users to:

- bookmark a filtered catalog
- send the exact same results to another person
- refresh without losing their search state
- use browser back and forward navigation naturally

For example:

```text
/products/dog/food/dry-food
  ?brand=roxies-kitchen
  &brand=green-mountain
  &flavor=chicken
  &minPrice=20
  &maxPrice=50
  &rating=4
```
