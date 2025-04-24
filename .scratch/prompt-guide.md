# Prompt Guide to Revamp

When you're ready to migrate a specific document, simply replace [SPECIFIC_DOCUMENT] with the document name you want to migrate next, such as `flash.md` or `statistic.md`.

## Prompting

````
I need help migrating the remaining Laravolt documentation from the `docs-old` directory to the new documentation structure in `src/app/v6`. Based on our earlier categorization and the work already completed, I'd like to focus on these remaining documents:

1. UI Components:
   - Flash Messages (`flash.md`)
   - Statistics (`statistic.md`)
   - Charts (`chart.md`)

2. Core Documentation:
   - Introduction (`introduction.md`)
   - Hello World (`hello-world.md`)
   - Starter Kit (`starter-kit.md`)

3. Development Practices:
   - Controller Best Practices (`controller.md`)
   - Naming Conventions (`naming-things.md`)
   - Performance Tips (`performance.md`)
   - Routes (`routes.md`)
   - Editor/IDE Setup (`editor-ide.md`)

4. Additional Topics:
   - React Integration (`integrasi-react.md`)
   - Thunderclap (`thunderclap.md`)
   - News Portal Tutorial (`latihan-portal-berita.md`)
   - Creating Authorized Menu (`membuat-authorized-menu.md`)

For each document, please:

1. Create a properly formatted Markdown file with frontmatter following the structure in the premium template:
   ```md
   ---
   title: [Descriptive Title]
   description: [Brief description of the content]
   nextjs:
      metadata:
         title: [Descriptive Title]
         description: [Brief description of the content]
   ---
   ```

2. Structure the content following the premium template pattern from `docs-ref` folder, with this specific format:
   ```md

   [Brief introduction paragraph explaining the purpose and benefits of the feature/component]

   ---

   ## Overview

   [General explanation of the concept/feature/component]

   ## Installation/Setup (if applicable)

   [Step-by-step instructions for installation or initial setup]

   ## Basic Usage

   [Simple examples for getting started]

   ## Advanced Features

   [Detailed explanations of more complex functionality]

   ## API Reference

   [Complete listing of available options, methods, properties]

   ## Examples

   [Practical examples covering common use cases]

   ## Best Practices

   [Recommendations for optimal use]

   ## Troubleshooting

   [Solutions to common issues]

   ## Related Components/Features

   [Links to related documentation]
   ```

3. Enhance the content by:
   - Improving clarity and consistency
   - Adding more comprehensive examples where needed
   - Including "Best Practices" and "Troubleshooting" sections when relevant
   - Ensuring all code examples are up-to-date

4. Update any internal links to use the new documentation structure (use `/v6/component-name` format)

5. Ensure code examples follow these formatting guidelines:
   - Use proper language identifiers for code blocks (e.g., ```php, ```html, ```bash)
   - Include comments in code examples for clarity
   - For large code examples, focus on the relevant parts with `// ...` for omitted sections

6. Save the file with correct structure:
   - For file `flash.md`, save it as `src/app/v6/flash-messages/page.md`
   - Use kebab-case for folder names
   - Always use `page.md` as the filename

7. Review a reference file from `docs-ref` folder (like `installation/page.md`) to ensure our formatting matches the premium template structure

Please start with [SPECIFIC_DOCUMENT] and prepare it for migration to the corresponding location in the new structure.
````
