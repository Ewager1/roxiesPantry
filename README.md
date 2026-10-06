# Roxie's Pantry

Roxie's Pantry is a full-stack product catalog built to explore three problems that become increasingly important as an application grows: **data-driven filtering, shareable application state, and intentional client-side caching**.

Rather than expanding into checkout, authentication, and other standard e-commerce features, the project stays focused on making a large catalog predictable, fast, and easy to navigate.

![Roxie's Pantry catalog](./docs/images/catalog-overview.png)

## What This Project Demonstrates

### Data-Driven Faceted Filtering

The catalog supports structural filters such as Pet, Brand, Category, Product Type, and Price alongside dynamically available product facets such as Flavor, Material, Durability, and Breed Size.

The filtering system includes:

- multi-select filters
- OR logic within the same facet and AND logic across different facets
- category-dependent Product Types
- Product Type-dependent facets
- automatic removal of invalid dependent filters
- global product counts for major catalog dimensions
- backend filtering through GraphQL and Prisma
- 2,000 deterministic seeded products for meaningful combinations of catalog state

Facets are modeled as data rather than hard-coded UI fields, allowing Product Types to define which filtering dimensions apply to them.

### Shareable URL-Driven State

The URL acts as the public representation of catalog state.

Search, filters, facets, price range, sort, pagination, and result mode can all be represented in query parameters. This allows users to:

- refresh without losing their catalog state
- bookmark a specific product search
- share the exact same result set with someone else
- use browser Back and Forward navigation naturally
- move between catalog states without maintaining a separate client-side source of truth

Invalid or obsolete hierarchical combinations are automatically canonicalized so the URL stays consistent with the available catalog data.

### Intentional and Observable Caching

TanStack Query manages product server state using cache keys derived from normalized catalog inputs.

The application demonstrates:

- a separate cache entry for each distinct catalog state
- separate cache shapes for paginated and infinite results
- next-page prefetching
- background warming of the alternate result mode
- configurable stale times
- product-cache resets without unnecessarily clearing catalog metadata
- simulated slow network behavior for observing cache reuse

The built-in **Demo Worksite** makes those behaviors visible by exposing cached query inputs, result modes, network simulation, and cache-reset controls.

![Roxie's Pantry Demo Worksite cache inspector](./docs/images/demo-worksite-cache.png)

## Scope

Roxie's Pantry is intentionally a **catalog engineering project**, rather than an attempt to reproduce an entire e-commerce platform.

### Included

- responsive product catalog for desktop, tablet, and mobile
- search and explicit sorting
- Pet, Brand, Category, Product Type, and Price filtering
- data-driven dynamic facets
- active-filter chips and filter removal
- global catalog counts
- URL-driven catalog state
- shareable catalog links
- pagination and infinite scrolling
- TanStack Query caching and prefetching
- simulated network latency
- loading, empty, error, and 404 states
- deterministic PostgreSQL seed data
- automated unit tests
- React UI integration tests

### Intentionally Out of Scope

Several extensions were considered and deliberately left out because they either duplicated engineering already demonstrated elsewhere or expanded the application away from its core goals.

**Contextual facet counts**
The current counts are global. Contextual counts would answer questions such as "how many products would remain if I selected this filter while keeping every other current filter?" That requires substantially more per-dimension query logic, including excluding a dimension from its own count calculation.

**Pet-aware facet applicability**
Facet applicability currently comes from Category and Product Type. Making dimensions such as Breed Size depend bidirectionally on Pet selection introduces another dependency layer and more complex canonicalization rules.

**Rating threshold filtering**
A "4 stars & up" filter would be straightforward with the existing filtering architecture, but it would add little new engineering value beyond the structural, facet, price, and search filters already implemented.

**Fuzzy and typo-tolerant search**
The current search behavior demonstrates server-side multi-field search and result ordering. Fuzzy matching would improve search polish but is separate from the main catalog-state problem.

**Bayesian or weighted rating ranking**
A weighted score could prevent products with very few reviews from ranking above products with a larger evidence base. The current rating sort is intentionally simpler.

**Admin product CRUD**
An administrative workflow could demonstrate cross-client cache invalidation after product mutations, but it would introduce an additional application surface outside the shopper-facing catalog.

Product detail pages, authentication, carts, wishlists, checkout, and payment processing are also outside the intended scope. They would broaden the application without strengthening the catalog-state and caching problems this project is designed to demonstrate.

## Engineering Deep Dive

### URL State as Catalog State

Catalog controls do not maintain a separate persistent copy of filter state. Instead, the UI reads normalized state from the URL and writes deliberate user changes back to it.

At a high level:

```text
User interaction
      ↓
URLSearchParams
      ↓
Normalized CatalogQuery
      ↓
TanStack Query key
      ↓
GraphQL variables
      ↓
Apollo Server
      ↓
Prisma
      ↓
PostgreSQL
```

This creates a single public representation of the current catalog view and avoids synchronizing a separate filter store with browser history.

Default values are generally omitted from the URL. For example, page 1 and the default sort do not need explicit parameters.

Changes that alter the result set reset pagination, while unrelated state is preserved.

![URL-driven catalog state](./docs/images/catalog-url-state.png)

### Hierarchical Filtering and Canonicalization

Not every catalog filter is independent.

The catalog hierarchy is roughly:

```text
Category
   ↓
Product Type
   ↓
Applicable Facets
```

Changing Category invalidates its existing Product Types and dynamic facet selections, so those values are removed automatically.

Product Type changes can also alter which facets remain valid. When multiple Product Types are selected, the UI exposes facets shared by the active types rather than presenting options that cannot consistently apply to the selection.

Automatic cleanup uses history replacement rather than creating another deliberate navigation step, so browser Back and Forward behavior remains useful.

### Facet Data Model

Generic product characteristics are modeled through reusable relational entities instead of adding a nullable database column for every possible filter.

The key relationships are:

```text
Product
 ├── Pet
 ├── Brand
 └── ProductType
       └── Category

ProductType
 └── ProductTypeFacet
       └── Facet

Product
 └── ProductFacetOption
       └── FacetOption
             └── Facet
```

For example, `Flavor`, `Material`, and `Durability` are all instances of the same facet system.

This lets new filtering dimensions be represented as data while keeping the core Product model stable.

Within one facet, selected options use OR semantics:

```text
Flavor = Chicken OR Beef
```

Different facets use AND semantics:

```text
(Flavor = Chicken OR Beef)
AND
Special Diet = Grain-Free
```

Structural filters, price, search, and facets are then combined into the final product query.

### Global Counts vs. Contextual Counts

Pet, Brand, and Category display global product counts.

Global counts were chosen deliberately because they remain stable and inexpensive to understand. A contextual count system would need to answer each filter's count while applying every other active constraint, usually excluding the filter's own dimension.

That approach is more powerful but substantially increases query complexity. For this project, global counts provide useful catalog context without obscuring the filtering and caching work with a second analytics system.

### Cache Architecture

Product cache identity is based on the normalized inputs that define the result set.

Conceptually:

```text
[
  "products",
  "list",
  {
    page,
    query: {
      filters,
      facets,
      search,
      sort,
      priceRange
    }
  }
]
```

Equivalent filter selections normalize into stable values before becoming cache inputs.

Paginated and infinite results intentionally use different cache shapes. A paginated query represents one bounded page, while infinite results accumulate multiple pages inside one query.

Keeping them separate avoids forcing two different result structures into the same cache entry.

When a user changes result modes, the alternate mode is warmed in the background so switching views can often reuse already-fetched data.

Paginated results also prefetch the likely next page when one exists.

Catalog metadata uses longer stale times than product results because Brand, Pet, Category, Product Type, and facet metadata change less frequently than the result set.

### Demo Worksite

The Demo Worksite is intentionally separated from shopper-facing controls.

It exposes implementation behavior that would normally remain invisible:

- Paginated vs. Infinite result mode
- Normal vs. simulated Slow network behavior
- product cache reset
- current Paginated cache entries
- current Infinite cache entries
- normalized inputs associated with each cached query

This makes caching behavior inspectable without requiring React Query Devtools or source-code knowledge.

### Search and Sorting

Search is submit-driven rather than updating the URL on every keystroke.

This keeps browser history meaningful and avoids generating a sequence of intermediate URLs while the user is still typing.

Search terms are processed on the backend across relevant product data. The default ordering can prioritize search relevance, while an explicit Price or Rating sort represents a user's deliberate request and therefore takes precedence over relevance ordering.

Rating sort places unrated products after rated products and uses review volume as an additional ordering signal.

### Pagination and Infinite Scrolling

Roxie's Pantry implements both traditional pagination and infinite scrolling against the same catalog query model.

Pagination:

- represents page state in the URL
- prefetches the next page
- maintains independent cache entries per page

Infinite scrolling:

- accumulates pages in a separate TanStack Query cache shape
- requests the next page as the user approaches the end of loaded results
- provides a Return to Top control for long result sets

Switching modes removes pagination state that no longer has meaning while preserving the catalog filters themselves.

### Loading, Error, and Empty States

Initial product loading and query errors are centralized around a Suspense/error boundary rather than requiring every result component to defensively handle missing data.

Once inside the resolved result components, product data can be treated as available.

A short loading delay prevents fast cached requests from flashing a skeleton unnecessarily, while genuinely slow requests still receive visible feedback.

The catalog also provides distinct states for:

- initial loading
- background result updates
- empty result sets
- query failures with retry
- invalid application routes

### Responsive Behavior

The catalog uses CSS Modules and responsive layouts rather than a separate mobile application structure.

At narrower widths:

- search controls reorganize vertically
- desktop filter columns collapse behind a Filters control
- filter counts stay visually associated with their labels
- active-filter chips remain horizontally scrollable
- product grids reduce column count naturally
- pagination controls tighten and wrap when needed
- the Demo Worksite reorganizes its controls and cache inspectors

The same catalog and URL-state architecture is preserved across viewport sizes.

### Testing Strategy

Testing focuses on behavior and state transitions rather than presentation snapshots.

**Unit tests** cover pure catalog logic including:

- filter normalization
- single-value normalization
- price-range normalization
- search normalization
- facet parsing and normalization
- facet URL serialization
- facet pruning
- GraphQL facet-input transformation
- TanStack Query cache-key behavior

**React integration tests** use React Testing Library and `user-event` to simulate user interaction with Search, Sort, and Pagination.

These tests verify the path from:

```text
User interaction
      ↓
React component
      ↓
React Router
      ↓
URL state
```

They also verify that related state is preserved or reset correctly. For example, changing Sort preserves active filters while returning pagination to page 1.

## Tech Stack

| Area                 | Technology                                       |
| -------------------- | ------------------------------------------------ |
| Frontend             | React, TypeScript, Vite                          |
| Routing / URL state  | React Router                                     |
| Server-state caching | TanStack Query                                   |
| API                  | GraphQL, Apollo Server                           |
| Backend              | Node.js, TypeScript                              |
| Database             | PostgreSQL                                       |
| ORM                  | Prisma                                           |
| Styling              | CSS Modules, custom CSS variables                |
| Testing              | Vitest, React Testing Library, user-event, jsdom |
| Tooling              | ESLint, Husky, Git                               |

Apollo Server is used for the GraphQL API. The frontend intentionally uses `fetch` with TanStack Query rather than Apollo Client so TanStack Query remains the single owner of client-side server-state caching.

## Local Development

### Requirements

- Node.js and npm
- PostgreSQL

Clone the repository and install frontend and server dependencies:

```bash
git clone https://github.com/Ewager1/roxiesPantry.git
cd roxiesPantry

npm install
npm install --prefix server
```

Create a frontend environment file at `.env.local`:

```env
VITE_GRAPHQL_URL=http://localhost:4000/
```

Create `server/.env` with your PostgreSQL connection:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/roxies_pantry"
```

Generate the Prisma client, synchronize the database schema, and seed the catalog:

```bash
cd server

npx prisma generate --config prisma7.config.ts
npx prisma db push --config prisma7.config.ts
npx prisma db seed --config prisma7.config.ts

cd ..
```

> The seed script clears and rebuilds the catalog dataset before generating 2,000 deterministic products.

Start the frontend and GraphQL server together:

```bash
npm run dev:all
```

The GraphQL server runs on port `4000`. Vite will report the local frontend URL when it starts.

## Quality Checks

Run linting, client/server type checking, and the test suite:

```bash
npm run verify
```

Build the production frontend:

```bash
npm run build
```
