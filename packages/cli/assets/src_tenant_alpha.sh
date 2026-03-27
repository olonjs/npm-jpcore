#!/bin/bash
set -e

echo "Starting project reconstruction..."

mkdir -p ".cursor"
mkdir -p ".cursor/skills-cursor"
mkdir -p ".cursor/skills-cursor/create-rule"
echo "Creating .cursor/skills-cursor/create-rule/SKILL.md..."
cat << 'END_OF_FILE_CONTENT' > ".cursor/skills-cursor/create-rule/SKILL.md"
---
name: create-rule
description: >-
  Create Cursor rules for persistent AI guidance. Use when you want to create a
  rule, add coding standards, set up project conventions, configure
  file-specific patterns, create RULE.md files, or asks about .cursor/rules/ or
  AGENTS.md.
---
# Creating Cursor Rules

Create project rules in `.cursor/rules/` to provide persistent context for the AI agent.

## Gather Requirements

Before creating a rule, determine:

1. **Purpose**: What should this rule enforce or teach?
2. **Scope**: Should it always apply, or only for specific files?
3. **File patterns**: If file-specific, which glob patterns?

### Inferring from Context

If you have previous conversation context, infer rules from what was discussed. You can create multiple rules if the conversation covers distinct topics or patterns. Don't ask redundant questions if the context already provides the answers.

### Required Questions

If the user hasn't specified scope, ask:
- "Should this rule always apply, or only when working with specific files?"

If they mentioned specific files and haven't provided concrete patterns, ask:
- "Which file patterns should this rule apply to?" (e.g., `**/*.ts`, `backend/**/*.py`)

It's very important that we get clarity on the file patterns.

Use the AskQuestion tool when available to gather this efficiently.

---

## Rule File Format

Rules are `.mdc` files in `.cursor/rules/` with YAML frontmatter:

```
.cursor/rules/
  typescript-standards.mdc
  react-patterns.mdc
  api-conventions.mdc
```

### File Structure

```markdown
---
description: Brief description of what this rule does
globs: **/*.ts  # File pattern for file-specific rules
alwaysApply: false  # Set to true if rule should always apply
---

# Rule Title

Your rule content here...
```

### Frontmatter Fields

| Field | Type | Description |
|-------|------|-------------|
| `description` | string | What the rule does (shown in rule picker) |
| `globs` | string | File pattern - rule applies when matching files are open |
| `alwaysApply` | boolean | If true, applies to every session |

---

## Rule Configurations

### Always Apply

For universal standards that should apply to every conversation:

```yaml
---
description: Core coding standards for the project
alwaysApply: true
---
```

### Apply to Specific Files

For rules that apply when working with certain file types:

```yaml
---
description: TypeScript conventions for this project
globs: **/*.ts
alwaysApply: false
---
```

---

## Best Practices

### Keep Rules Concise

- **Under 50 lines**: Rules should be concise and to the point
- **One concern per rule**: Split large rules into focused pieces
- **Actionable**: Write like clear internal docs
- **Concrete examples**: Ideally provide concrete examples of how to fix issues

---

## Example Rules

### TypeScript Standards

```markdown
---
description: TypeScript coding standards
globs: **/*.ts
alwaysApply: false
---

# Error Handling

\`\`\`typescript
// ❌ BAD
try {
  await fetchData();
} catch (e) {}

// ✅ GOOD
try {
  await fetchData();
} catch (e) {
  logger.error('Failed to fetch', { error: e });
  throw new DataFetchError('Unable to retrieve data', { cause: e });
}
\`\`\`
```

### React Patterns

```markdown
---
description: React component patterns
globs: **/*.tsx
alwaysApply: false
---

# React Patterns

- Use functional components
- Extract custom hooks for reusable logic
- Colocate styles with components
```

---

## Checklist

- [ ] File is `.mdc` format in `.cursor/rules/`
- [ ] Frontmatter configured correctly
- [ ] Content under 500 lines
- [ ] Includes concrete examples

END_OF_FILE_CONTENT
mkdir -p ".cursor/skills-cursor/create-skill"
echo "Creating .cursor/skills-cursor/create-skill/SKILL.md..."
cat << 'END_OF_FILE_CONTENT' > ".cursor/skills-cursor/create-skill/SKILL.md"
---
name: create-skill
description: >-
  Guides users through creating effective Agent Skills for Cursor. Use when you
  want to create, write, or author a new skill, or asks about skill structure,
  best practices, or SKILL.md format.
---
# Creating Skills in Cursor

This skill guides you through creating effective Agent Skills for Cursor. Skills are markdown files that teach the agent how to perform specific tasks: reviewing PRs using team standards, generating commit messages in a preferred format, querying database schemas, or any specialized workflow.

## Before You Begin: Gather Requirements

Before creating a skill, gather essential information from the user about:

1. **Purpose and scope**: What specific task or workflow should this skill help with?
2. **Target location**: Should this be a personal skill (~/.cursor/skills/) or project skill (.cursor/skills/)?
3. **Trigger scenarios**: When should the agent automatically apply this skill?
4. **Key domain knowledge**: What specialized information does the agent need that it wouldn't already know?
5. **Output format preferences**: Are there specific templates, formats, or styles required?
6. **Existing patterns**: Are there existing examples or conventions to follow?

### Inferring from Context

If you have previous conversation context, infer the skill from what was discussed. You can create skills based on workflows, patterns, or domain knowledge that emerged in the conversation.

### Gathering Additional Information

If you need clarification, use the AskQuestion tool when available:

```
Example AskQuestion usage:
- "Where should this skill be stored?" with options like ["Personal (~/.cursor/skills/)", "Project (.cursor/skills/)"]
- "Should this skill include executable scripts?" with options like ["Yes", "No"]
```

If the AskQuestion tool is not available, ask these questions conversationally.

---

## Skill File Structure

### Directory Layout

Skills are stored as directories containing a `SKILL.md` file:

```
skill-name/
├── SKILL.md              # Required - main instructions
├── reference.md          # Optional - detailed documentation
├── examples.md           # Optional - usage examples
└── scripts/              # Optional - utility scripts
    ├── validate.py
    └── helper.sh
```

### Storage Locations

| Type | Path | Scope |
|------|------|-------|
| Personal | ~/.cursor/skills/skill-name/ | Available across all your projects |
| Project | .cursor/skills/skill-name/ | Shared with anyone using the repository |

**IMPORTANT**: Never create skills in `~/.cursor/skills-cursor/`. This directory is reserved for Cursor's internal built-in skills and is managed automatically by the system.

### SKILL.md Structure

Every skill requires a `SKILL.md` file with YAML frontmatter and markdown body:

```markdown
---
name: your-skill-name
description: Brief description of what this skill does and when to use it
---

# Your Skill Name

## Instructions
Clear, step-by-step guidance for the agent.

## Examples
Concrete examples of using this skill.
```

### Required Metadata Fields

| Field | Requirements | Purpose |
|-------|--------------|---------|
| `name` | Max 64 chars, lowercase letters/numbers/hyphens only | Unique identifier for the skill |
| `description` | Max 1024 chars, non-empty | Helps agent decide when to apply the skill |

---

## Writing Effective Descriptions

The description is **critical** for skill discovery. The agent uses it to decide when to apply your skill.

### Description Best Practices

1. **Write in third person** (the description is injected into the system prompt):
   - ✅ Good: "Processes Excel files and generates reports"
   - ❌ Avoid: "I can help you process Excel files"
   - ❌ Avoid: "You can use this to process Excel files"

2. **Be specific and include trigger terms**:
   - ✅ Good: "Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction."
   - ❌ Vague: "Helps with documents"

3. **Include both WHAT and WHEN**:
   - WHAT: What the skill does (specific capabilities)
   - WHEN: When the agent should use it (trigger scenarios)

### Description Examples

```yaml
# PDF Processing
description: Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.

# Excel Analysis
description: Analyze Excel spreadsheets, create pivot tables, generate charts. Use when analyzing Excel files, spreadsheets, tabular data, or .xlsx files.

# Git Commit Helper
description: Generate descriptive commit messages by analyzing git diffs. Use when the user asks for help writing commit messages or reviewing staged changes.

# Code Review
description: Review code for quality, security, and best practices following team standards. Use when reviewing pull requests, code changes, or when the user asks for a code review.
```

---

## Core Authoring Principles

### 1. Concise is Key

The context window is shared with conversation history, other skills, and requests. Every token competes for space.

**Default assumption**: The agent is already very smart. Only add context it doesn't already have.

Challenge each piece of information:
- "Does the agent really need this explanation?"
- "Can I assume the agent knows this?"
- "Does this paragraph justify its token cost?"

**Good (concise)**:
```markdown
## Extract PDF text

Use pdfplumber for text extraction:

\`\`\`python
import pdfplumber

with pdfplumber.open("file.pdf") as pdf:
    text = pdf.pages[0].extract_text()
\`\`\`
```

**Bad (verbose)**:
```markdown
## Extract PDF text

PDF (Portable Document Format) files are a common file format that contains
text, images, and other content. To extract text from a PDF, you'll need to
use a library. There are many libraries available for PDF processing, but we
recommend pdfplumber because it's easy to use and handles most cases well...
```

### 2. Keep SKILL.md Under 500 Lines

For optimal performance, the main SKILL.md file should be concise. Use progressive disclosure for detailed content.

### 3. Progressive Disclosure

Put essential information in SKILL.md; detailed reference material in separate files that the agent reads only when needed.

```markdown
# PDF Processing

## Quick start
[Essential instructions here]

## Additional resources
- For complete API details, see [reference.md](reference.md)
- For usage examples, see [examples.md](examples.md)
```

**Keep references one level deep** - link directly from SKILL.md to reference files. Deeply nested references may result in partial reads.

### 4. Set Appropriate Degrees of Freedom

Match specificity to the task's fragility:

| Freedom Level | When to Use | Example |
|---------------|-------------|---------|
| **High** (text instructions) | Multiple valid approaches, context-dependent | Code review guidelines |
| **Medium** (pseudocode/templates) | Preferred pattern with acceptable variation | Report generation |
| **Low** (specific scripts) | Fragile operations, consistency critical | Database migrations |

---

## Common Patterns

### Template Pattern

Provide output format templates:

```markdown
## Report structure

Use this template:

\`\`\`markdown
# [Analysis Title]

## Executive summary
[One-paragraph overview of key findings]

## Key findings
- Finding 1 with supporting data
- Finding 2 with supporting data

## Recommendations
1. Specific actionable recommendation
2. Specific actionable recommendation
\`\`\`
```

### Examples Pattern

For skills where output quality depends on seeing examples:

```markdown
## Commit message format

**Example 1:**
Input: Added user authentication with JWT tokens
Output:
\`\`\`
feat(auth): implement JWT-based authentication

Add login endpoint and token validation middleware
\`\`\`

**Example 2:**
Input: Fixed bug where dates displayed incorrectly
Output:
\`\`\`
fix(reports): correct date formatting in timezone conversion

Use UTC timestamps consistently across report generation
\`\`\`
```

### Workflow Pattern

Break complex operations into clear steps with checklists:

```markdown
## Form filling workflow

Copy this checklist and track progress:

\`\`\`
Task Progress:
- [ ] Step 1: Analyze the form
- [ ] Step 2: Create field mapping
- [ ] Step 3: Validate mapping
- [ ] Step 4: Fill the form
- [ ] Step 5: Verify output
\`\`\`

**Step 1: Analyze the form**
Run: \`python scripts/analyze_form.py input.pdf\`
...
```

### Conditional Workflow Pattern

Guide through decision points:

```markdown
## Document modification workflow

1. Determine the modification type:

   **Creating new content?** → Follow "Creation workflow" below
   **Editing existing content?** → Follow "Editing workflow" below

2. Creation workflow:
   - Use docx-js library
   - Build document from scratch
   ...
```

### Feedback Loop Pattern

For quality-critical tasks, implement validation loops:

```markdown
## Document editing process

1. Make your edits
2. **Validate immediately**: \`python scripts/validate.py output/\`
3. If validation fails:
   - Review the error message
   - Fix the issues
   - Run validation again
4. **Only proceed when validation passes**
```

---

## Utility Scripts

Pre-made scripts offer advantages over generated code:
- More reliable than generated code
- Save tokens (no code in context)
- Save time (no code generation)
- Ensure consistency across uses

```markdown
## Utility scripts

**analyze_form.py**: Extract all form fields from PDF
\`\`\`bash
python scripts/analyze_form.py input.pdf > fields.json
\`\`\`

**validate.py**: Check for errors
\`\`\`bash
python scripts/validate.py fields.json
# Returns: "OK" or lists conflicts
\`\`\`
```

Make clear whether the agent should **execute** the script (most common) or **read** it as reference.

---

## Anti-Patterns to Avoid

### 1. Windows-Style Paths
- ✅ Use: `scripts/helper.py`
- ❌ Avoid: `scripts\helper.py`

### 2. Too Many Options
```markdown
# Bad - confusing
"You can use pypdf, or pdfplumber, or PyMuPDF, or..."

# Good - provide a default with escape hatch
"Use pdfplumber for text extraction.
For scanned PDFs requiring OCR, use pdf2image with pytesseract instead."
```

### 3. Time-Sensitive Information
```markdown
# Bad - will become outdated
"If you're doing this before August 2025, use the old API."

# Good - use an "old patterns" section
## Current method
Use the v2 API endpoint.

## Old patterns (deprecated)
<details>
<summary>Legacy v1 API</summary>
...
</details>
```

### 4. Inconsistent Terminology
Choose one term and use it throughout:
- ✅ Always "API endpoint" (not mixing "URL", "route", "path")
- ✅ Always "field" (not mixing "box", "element", "control")

### 5. Vague Skill Names
- ✅ Good: `processing-pdfs`, `analyzing-spreadsheets`
- ❌ Avoid: `helper`, `utils`, `tools`

---

## Skill Creation Workflow

When helping a user create a skill, follow this process:

### Phase 1: Discovery

Gather information about:
1. The skill's purpose and primary use case
2. Storage location (personal vs project)
3. Trigger scenarios
4. Any specific requirements or constraints
5. Existing examples or patterns to follow

If you have access to the AskQuestion tool, use it for efficient structured gathering. Otherwise, ask conversationally.

### Phase 2: Design

1. Draft the skill name (lowercase, hyphens, max 64 chars)
2. Write a specific, third-person description
3. Outline the main sections needed
4. Identify if supporting files or scripts are needed

### Phase 3: Implementation

1. Create the directory structure
2. Write the SKILL.md file with frontmatter
3. Create any supporting reference files
4. Create any utility scripts if needed

### Phase 4: Verification

1. Verify the SKILL.md is under 500 lines
2. Check that the description is specific and includes trigger terms
3. Ensure consistent terminology throughout
4. Verify all file references are one level deep
5. Test that the skill can be discovered and applied

---

## Complete Example

Here's a complete example of a well-structured skill:

**Directory structure:**
```
code-review/
├── SKILL.md
├── STANDARDS.md
└── examples.md
```

**SKILL.md:**
```markdown
---
name: code-review
description: Review code for quality, security, and maintainability following team standards. Use when reviewing pull requests, examining code changes, or when the user asks for a code review.
---

# Code Review

## Quick Start

When reviewing code:

1. Check for correctness and potential bugs
2. Verify security best practices
3. Assess code readability and maintainability
4. Ensure tests are adequate

## Review Checklist

- [ ] Logic is correct and handles edge cases
- [ ] No security vulnerabilities (SQL injection, XSS, etc.)
- [ ] Code follows project style conventions
- [ ] Functions are appropriately sized and focused
- [ ] Error handling is comprehensive
- [ ] Tests cover the changes

## Providing Feedback

Format feedback as:
- 🔴 **Critical**: Must fix before merge
- 🟡 **Suggestion**: Consider improving
- 🟢 **Nice to have**: Optional enhancement

## Additional Resources

- For detailed coding standards, see [STANDARDS.md](STANDARDS.md)
- For example reviews, see [examples.md](examples.md)
```

---

## Summary Checklist

Before finalizing a skill, verify:

### Core Quality
- [ ] Description is specific and includes key terms
- [ ] Description includes both WHAT and WHEN
- [ ] Written in third person
- [ ] SKILL.md body is under 500 lines
- [ ] Consistent terminology throughout
- [ ] Examples are concrete, not abstract

### Structure
- [ ] File references are one level deep
- [ ] Progressive disclosure used appropriately
- [ ] Workflows have clear steps
- [ ] No time-sensitive information

### If Including Scripts
- [ ] Scripts solve problems rather than punt
- [ ] Required packages are documented
- [ ] Error handling is explicit and helpful
- [ ] No Windows-style paths

END_OF_FILE_CONTENT
mkdir -p ".cursor/skills-cursor/create-subagent"
echo "Creating .cursor/skills-cursor/create-subagent/SKILL.md..."
cat << 'END_OF_FILE_CONTENT' > ".cursor/skills-cursor/create-subagent/SKILL.md"
---
name: create-subagent
description: >-
  Create custom subagents for specialized AI tasks. Use when you want to create
  a new type of subagent, set up task-specific agents, configure code reviewers,
  debuggers, or domain-specific assistants with custom prompts.
disable-model-invocation: true
---
# Creating Custom Subagents

This skill guides you through creating custom subagents for Cursor. Subagents are specialized AI assistants that run in isolated contexts with custom system prompts.

## When to Use Subagents

Subagents help you:
- **Preserve context** by isolating exploration from your main conversation
- **Specialize behavior** with focused system prompts for specific domains
- **Reuse configurations** across projects with user-level subagents

### Inferring from Context

If you have previous conversation context, infer the subagent's purpose and behavior from what was discussed. Create the subagent based on specialized tasks or workflows that emerged in the conversation.

## Subagent Locations

| Location | Scope | Priority |
|----------|-------|----------|
| `.cursor/agents/` | Current project | Higher |
| `~/.cursor/agents/` | All your projects | Lower |

When multiple subagents share the same name, the higher-priority location wins.

**Project subagents** (`.cursor/agents/`): Ideal for codebase-specific agents. Check into version control to share with your team.

**User subagents** (`~/.cursor/agents/`): Personal agents available across all your projects.

## Subagent File Format

Create a `.md` file with YAML frontmatter and a markdown body (the system prompt):

```markdown
---
name: code-reviewer
description: Reviews code for quality and best practices
---

You are a code reviewer. When invoked, analyze the code and provide
specific, actionable feedback on quality, security, and best practices.
```

### Required Fields

| Field | Description |
|-------|-------------|
| `name` | Unique identifier (lowercase letters and hyphens only) |
| `description` | When to delegate to this subagent (be specific!) |

## Writing Effective Descriptions

The description is **critical** - the AI uses it to decide when to delegate.

```yaml
# ❌ Too vague
description: Helps with code

# ✅ Specific and actionable
description: Expert code review specialist. Proactively reviews code for quality, security, and maintainability. Use immediately after writing or modifying code.
```

Include "use proactively" to encourage automatic delegation.

## Example Subagents

### Code Reviewer

```markdown
---
name: code-reviewer
description: Expert code review specialist. Proactively reviews code for quality, security, and maintainability. Use immediately after writing or modifying code.
---

You are a senior code reviewer ensuring high standards of code quality and security.

When invoked:
1. Run git diff to see recent changes
2. Focus on modified files
3. Begin review immediately

Review checklist:
- Code is clear and readable
- Functions and variables are well-named
- No duplicated code
- Proper error handling
- No exposed secrets or API keys
- Input validation implemented
- Good test coverage
- Performance considerations addressed

Provide feedback organized by priority:
- Critical issues (must fix)
- Warnings (should fix)
- Suggestions (consider improving)

Include specific examples of how to fix issues.
```

### Debugger

```markdown
---
name: debugger
description: Debugging specialist for errors, test failures, and unexpected behavior. Use proactively when encountering any issues.
---

You are an expert debugger specializing in root cause analysis.

When invoked:
1. Capture error message and stack trace
2. Identify reproduction steps
3. Isolate the failure location
4. Implement minimal fix
5. Verify solution works

Debugging process:
- Analyze error messages and logs
- Check recent code changes
- Form and test hypotheses
- Add strategic debug logging
- Inspect variable states

For each issue, provide:
- Root cause explanation
- Evidence supporting the diagnosis
- Specific code fix
- Testing approach
- Prevention recommendations

Focus on fixing the underlying issue, not the symptoms.
```

### Data Scientist

```markdown
---
name: data-scientist
description: Data analysis expert for SQL queries, BigQuery operations, and data insights. Use proactively for data analysis tasks and queries.
---

You are a data scientist specializing in SQL and BigQuery analysis.

When invoked:
1. Understand the data analysis requirement
2. Write efficient SQL queries
3. Use BigQuery command line tools (bq) when appropriate
4. Analyze and summarize results
5. Present findings clearly

Key practices:
- Write optimized SQL queries with proper filters
- Use appropriate aggregations and joins
- Include comments explaining complex logic
- Format results for readability
- Provide data-driven recommendations

For each analysis:
- Explain the query approach
- Document any assumptions
- Highlight key findings
- Suggest next steps based on data

Always ensure queries are efficient and cost-effective.
```

## Subagent Creation Workflow

### Step 1: Decide the Scope

- **Project-level** (`.cursor/agents/`): For codebase-specific agents shared with team
- **User-level** (`~/.cursor/agents/`): For personal agents across all projects

### Step 2: Create the File

```bash
# For project-level
mkdir -p .cursor/agents
touch .cursor/agents/my-agent.md

# For user-level
mkdir -p ~/.cursor/agents
touch ~/.cursor/agents/my-agent.md
```

### Step 3: Define Configuration

Write the frontmatter with the required fields (`name` and `description`).

### Step 4: Write the System Prompt

The body becomes the system prompt. Be specific about:
- What the agent should do when invoked
- The workflow or process to follow
- Output format and structure
- Any constraints or guidelines

### Step 5: Test the Agent

Ask the AI to use your new agent:

```
Use the my-agent subagent to [task description]
```

## Best Practices

1. **Design focused subagents**: Each should excel at one specific task
2. **Write detailed descriptions**: Include trigger terms so the AI knows when to delegate
3. **Check into version control**: Share project subagents with your team
4. **Use proactive language**: Include "use proactively" in descriptions

## Troubleshooting

### Subagent Not Found
- Ensure file is in `.cursor/agents/` or `~/.cursor/agents/`
- Check file has `.md` extension
- Verify YAML frontmatter syntax is valid

END_OF_FILE_CONTENT
mkdir -p ".cursor/skills-cursor/jsonpages-tenant"
echo "Creating .cursor/skills-cursor/jsonpages-tenant/SKILL.md..."
cat << 'END_OF_FILE_CONTENT' > ".cursor/skills-cursor/jsonpages-tenant/SKILL.md"
---
name: jsonpages-tenant
description: Use when working on a JsonPages tenant, transforming the base tenant DNA into a branded tenant, adding or modifying tenant sections, maintaining schema-driven editability, or reasoning about what belongs to @jsonpages/core versus the tenant.
---

# JsonPages Tenant

Use this skill for work on the JsonPages ecosystem when the task involves:

- a tenant generated from the JsonPages CLI
- `@jsonpages/core`
- tenant sections/capsules
- `src/data/pages/**/*.json` or `src/data/config/*.json`
- schema-driven editing and inspector compatibility
- generator scripts that turn a base tenant into a branded tenant

Read code first. Treat documents as secondary unless they help interpret code that is otherwise ambiguous.

## Core Model

JsonPages has a hard split between `core` and `tenant`.

- `@jsonpages/core` owns routing, `/admin`, `/admin/preview`, preview stage, studio state, inspector/form factory, and shared engine behavior.
- The tenant owns sections, schemas, type augmentation, page/config JSON, theme/design layer, and local workflow scripts.
- The tenant does not implement the CMS. It implements the tenant protocol consumed by the engine.

In this ecosystem, code is the source of truth.

Compliance priority:

1. Data is bound correctly.
2. Schemas describe fields correctly.
3. Content is editable without breaking the inspector.
4. Tenant structure stays standardized.
5. Context-aware focus/highlight in the legacy admin is desirable but secondary.

## Canonical References

Use these local references when available:

- Base tenant DNA: `\\wsl.localhost\Ubuntu\home\dev\temp\alpha`
- Custom tenant reference: `\\wsl.localhost\Ubuntu\home\dev\temp\gptgiorgio`
- Core engine: `\\wsl.localhost\Ubuntu\home\dev\npm-jpcore\packages\core`
- Generator example: `\\wsl.localhost\Ubuntu\home\dev\temp\clonark\generate_olon.sh`

If these paths are missing, infer the same roles from the current workspace:

- base CLI-generated tenant
- branded tenant
- core package
- generator script

## Tenant Anatomy

Expect these files to move together:

- `src/components/<section>/View.tsx`
- `src/components/<section>/schema.ts`
- `src/components/<section>/types.ts`
- `src/components/<section>/index.ts`
- `src/lib/ComponentRegistry.tsx`
- `src/lib/schemas.ts`
- `src/lib/addSectionConfig.ts`
- `src/types.ts`
- `src/data/pages/**/*.json`
- `src/data/config/site.json`
- `src/data/config/theme.json`
- `src/data/config/menu.json`

Useful rule: if a section type changes, check all of the files above before concluding the task is done.

## What Good Work Looks Like

A good tenant change:

- stays inside tenant boundaries unless the issue is truly in `@jsonpages/core`
- keeps schema, defaults, registry, and type augmentation aligned
- preserves editability for strings, lists, nested objects, CTAs, and image fields
- uses `ImageSelectionSchema`-style image fields when the content is image-driven
- keeps page content JSON-first

A suspicious tenant change:

- patches the core to fix a tenant modeling problem
- adds visual complexity without data bindings
- introduces fields into JSON that are not represented in schema
- changes a section view without updating defaults or types
- optimizes legacy context awareness at the expense of simpler, reliable editability

## Workflow 1: Base Tenant -> Branded Tenant

This is the primary workflow.

Goal:

- transform a CLI-generated base tenant into a branded tenant through a single generator script

Treat the generator script as procedural source of truth for the green build workflow.

When maintaining or authoring a generator:

1. Separate non-deterministic bootstrap from deterministic sync.
2. Make explicit which files are managed output.
3. Keep the script aligned with the current tenant code, not with stale docs.
4. Preserve tenant protocol files: sections, schemas, registries, type augmentation, config JSON, assets, shims.
5. Prefer deterministic local writes after any remote/bootstrap step.

Typical structure of a good generator:

- preflight checks
- remote/bootstrap steps such as `shadcn` or external registries
- deterministic creation/sync of tenant files
- compatibility patches for known unstable upstream payloads
- final validation commands

When asked to update a branded tenant generator:

1. Diff base tenant against branded tenant.
2. Classify differences into:
   - intended branded output
   - reusable generator logic
   - accidental drift
3. Encode only the reusable intended differences into the script.
4. Keep the output reproducible from a fresh base tenant.

## Workflow 2: Add Or Change A Section

When adding a new section type:

1. Create `View.tsx`, `schema.ts`, `types.ts`, `index.ts`.
2. Register the section in `src/lib/ComponentRegistry.tsx`.
3. Register the schema in `src/lib/schemas.ts`.
4. Add defaults and label in `src/lib/addSectionConfig.ts`.
5. Extend `SectionComponentPropsMap` and module augmentation in `src/types.ts`.
6. Add or update page JSON using the new section type.

When changing an existing section:

1. Read the section schema first.
2. Read the page JSON using it.
3. Check the view for `data-jp-field` usage and binding shape.
4. Update defaults if the data shape changed.
5. Verify the inspector still has a path to edit the content.

## Workflow 3: Images, Rich Content, Nested Routes

Images:

- Prefer structured image objects compatible with tenant base schemas.
- Assume the core supports image picking and upload flows.
- The tenant is responsible for declaring image fields in schema and rendering them coherently.

Rich editorial content:

- Tiptap-style sections are tenant-level integrations.
- Treat page JSON using `type: "tiptap"` as runtime usage examples, and section code as the real source of truth.

Nested routes:

- Files under `src/data/pages/**/*.json` may represent nested slugs.
- Preserve slug/path consistency and do not replace file-based routing with manual lists.

## Decision Rules

Use `alpha` patterns when the task is about:

- tenant DNA
- capability reference
- baseline protocol shape
- proving what the base system already supports

Use `gptgiorgio` patterns when the task is about:

- stronger branded frontend customization
- richer domain-specific sections
- image-heavy schema design
- proving how far customization can go without changing the bootstrap

Do not treat `gptgiorgio` as canonical for legacy admin context awareness.

## Default Operating Procedure

When you receive a JsonPages tenant task:

1. Identify whether the problem belongs to `core`, tenant, or generator.
2. Read the smallest code surface that proves it.
3. Prefer fixing the tenant contract before touching visual polish.
4. Keep generated and deterministic workflows reproducible.
5. State assumptions when inferring intended branded output from examples.

END_OF_FILE_CONTENT
mkdir -p ".cursor/skills-cursor/migrate-to-skills"
echo "Creating .cursor/skills-cursor/migrate-to-skills/SKILL.md..."
cat << 'END_OF_FILE_CONTENT' > ".cursor/skills-cursor/migrate-to-skills/SKILL.md"
---
name: migrate-to-skills
description: >-
  Convert 'Applied intelligently' Cursor rules (.cursor/rules/*.mdc) and slash
  commands (.cursor/commands/*.md) to Agent Skills format (.cursor/skills/). Use
  when you want to migrate rules or commands to skills, convert .mdc rules to
  SKILL.md format, or consolidate commands into the skills directory.
disable-model-invocation: true
---
# Migrate Rules and Slash Commands to Skills

Convert Cursor rules ("Applied intelligently") and slash commands to Agent Skills format.

**CRITICAL: Preserve the exact body content. Do not modify, reformat, or "improve" it - copy verbatim.**

## Locations

| Level | Source | Destination |
|-------|--------|-------------|
| Project | `{workspaceFolder}/**/.cursor/rules/*.mdc`, `{workspaceFolder}/.cursor/commands/*.md` |
| User | `~/.cursor/commands/*.md` |

Notes:
- Cursor rules inside the project can live in nested directories. Be thorough in your search and use glob patterns to find them.
- Ignore anything in ~/.cursor/worktrees
- Ignore anything in ~/.cursor/skills-cursor. This is reserved for Cursor's internal built-in skills and is managed automatically by the system.

## Finding Files to Migrate

**Rules**: Migrate if rule has a `description` but NO `globs` and NO `alwaysApply: true`.

**Commands**: Migrate all - they're plain markdown without frontmatter.

## Conversion Format

### Rules: .mdc → SKILL.md

```markdown
# Before: .cursor/rules/my-rule.mdc
---
description: What this rule does
globs:
alwaysApply: false
---
# Title
Body content...
```

```markdown
# After: .cursor/skills/my-rule/SKILL.md
---
name: my-rule
description: What this rule does
---
# Title
Body content...
```

Changes: Add `name` field, remove `globs`/`alwaysApply`, keep body exactly.

### Commands: .md → SKILL.md

```markdown
# Before: .cursor/commands/commit.md
# Commit current work
Instructions here...
```

```markdown
# After: .cursor/skills/commit/SKILL.md
---
name: commit
description: Commit current work with standardized message format
disable-model-invocation: true
---
# Commit current work
Instructions here...
```

Changes: Add frontmatter with `name` (from filename), `description` (infer from content), and `disable-model-invocation: true`, keep body exactly.

**Note:** The `disable-model-invocation: true` field prevents the model from automatically invoking this skill. Slash commands are designed to be explicitly triggered by the user via the `/` menu, not automatically suggested by the model.

## Notes

- `name` must be lowercase with hyphens only
- `description` is critical for skill discovery
- Optionally delete originals after verifying migration works

### Migrate a Rule (.mdc → SKILL.md)

1. Read the rule file
2. Extract the `description` from the frontmatter
3. Extract the body content (everything after the closing `---` of the frontmatter)
4. Create the skill directory: `.cursor/skills/{skill-name}/` (skill name = filename without .mdc)
5. Write `SKILL.md` with new frontmatter (`name` and `description`) + the EXACT original body content (preserve all whitespace, formatting, code blocks verbatim)
6. Delete the original rule file

### Migrate a Command (.md → SKILL.md)

1. Read the command file
2. Extract description from the first heading (remove `#` prefix)
3. Create the skill directory: `.cursor/skills/{skill-name}/` (skill name = filename without .md)
4. Write `SKILL.md` with new frontmatter (`name`, `description`, and `disable-model-invocation: true`) + blank line + the EXACT original file content (preserve all whitespace, formatting, code blocks verbatim)
5. Delete the original command file

**CRITICAL: Copy the body content character-for-character. Do not reformat, fix typos, or "improve" anything.**

## Workflow

If you have the Task tool available:
DO NOT start to read all of the files yourself. That function should be delegated to the subagents. Your job is to dispatch the subagents for each category of files and wait for the results.

1. [ ] Create the skills directories if they don't exist (`.cursor/skills/` for project, `~/.cursor/skills/` for user)
2. Dispatch three fast general purpose subagents (NOT explore) in parallel to do the following steps for project rules (pattern: `{workspaceFolder}/**/.cursor/rules/*.mdc`), user commands (pattern: `~/.cursor/commands/*.md`), and project commands (pattern: `{workspaceFolder}/**/.cursor/commands/*.md`):
  I. [ ] Find files to migrate in the given pattern
  II. [ ] For rules, check if it's an "applied intelligently" rule (has `description`, no `globs`, no `alwaysApply: true`). Commands are always migrated. DO NOT use the terminal to read files. Use the read tool.
  III. [ ] Make a list of files to migrate. If empty, done.
  IV. [ ] For each file, read it, then write the new skill file preserving the body content EXACTLY. DO NOT use the terminal to write these files. Use the edit tool.
  V. [ ] Delete the original file. DO NOT use the terminal to delete these files. Use the delete tool.
  VI. [ ] Return a list of all the skill files that were migrated along with the original file paths.
3. [ ] Wait for all subagents to complete and summarize the results to the user. IMPORTANT: Make sure to let them know if they want to undo the migration, to ask you to.
4. [ ] If the user asks you to undo the migration, do the opposite of the above steps to restore the original files.


If you don't have the Task tool available:
1. [ ] Create the skills directories if they don't exist (`.cursor/skills/` for project, `~/.cursor/skills/` for user)
2. [ ] Find files to migrate in both project (`.cursor/`) and user (`~/.cursor/`) directories
3. [ ] For rules, check if it's an "applied intelligently" rule (has `description`, no `globs`, no `alwaysApply: true`). Commands are always migrated. DO NOT use the terminal to read files. Use the read tool.
4. [ ] Make a list of files to migrate. If empty, done.
5. [ ] For each file, read it, then write the new skill file preserving the body content EXACTLY. DO NOT use the terminal to write these files. Use the edit tool.
6. [ ] Delete the original file. DO NOT use the terminal to delete these files. Use the delete tool.
7. [ ] Summarize the results to the user. IMPORTANT: Make sure to let them know if they want to undo the migration, to ask you to.
8. [ ] If the user asks you to undo the migration, do the opposite of the above steps to restore the original files.

END_OF_FILE_CONTENT
mkdir -p ".cursor/skills-cursor/olonjs"
echo "Creating .cursor/skills-cursor/olonjs/SKILL.md..."
cat << 'END_OF_FILE_CONTENT' > ".cursor/skills-cursor/olonjs/SKILL.md"
---
name: olonjs-tenant
description: Use when working on a OlonJS tenant, transforming the base tenant DNA into a branded tenant, adding or modifying tenant sections, maintaining schema-driven editability, or reasoning about what belongs to @olonjs/core versus the tenant.
---

# OlonJS Tenant

Use this skill for work on the OlonJS ecosystem when the task involves:

- a tenant generated from the OlonJS CLI
- `@olonjs/core`
- tenant sections/capsules
- `src/data/pages/**/*.json` or `src/data/config/*.json`
- schema-driven editing and inspector compatibility
- generator scripts that turn a base tenant into a branded tenant

Read code first. Treat documents as secondary unless they help interpret code that is otherwise ambiguous.

## Architecture Specifications 

**Normative:** OlonJS Architecture Specifications **v1.5** (`olonjsSpecs_V_1_5.md`): three-layer CSS theme bridge (engine → `:root` → `@theme`), `ThemeConfig` / appendix A.2.6, path-based Studio selection (`itemPath`), local tokens (`--local-*`), IDAC, TOCC, JSP, TBP, CIP, ECIP, JEB, JAP.

Use this document as the architectural law for each tenant; compliance is judged against it:

- `\\wsl.localhost\Ubuntu\home\dev\npm-jpcore\specs\olonjsSpecs_V_1_5.md`




## Core Model

OlonJS has a hard split between `core` and `tenant`.

- `@olonjs/core` owns routing, `/admin`, `/admin/preview`, preview stage, studio state, inspector/form factory, and shared engine behavior.
- The tenant owns sections, schemas, type augmentation, page/config JSON, theme/design layer, and local workflow scripts.
- The tenant does not implement the CMS. It implements the tenant protocol consumed by the engine.

In this ecosystem, code is the source of truth.

Compliance priority:

1. Data is bound correctly.
2. Schemas describe fields correctly.
3. Content is editable without breaking the inspector.
4. Tenant structure stays standardized.
5. Context-aware focus/highlight in the legacy admin is desirable but secondary.

## Canonical References

Use these local references when available:

- Base tenant DNA: `\\wsl.localhost\Ubuntu\home\dev\temp\alpha`
- Custom tenant reference: `\\wsl.localhost\Ubuntu\home\dev\temp\gptgiorgio`
- Core engine: `\\wsl.localhost\Ubuntu\home\dev\npm-jpcore\packages\core`
- Generator example: `\\wsl.localhost\Ubuntu\home\dev\temp\clonark\generate_olon.sh`

If these paths are missing, infer the same roles from the current workspace:

- base CLI-generated tenant
- branded tenant
- core package
- generator script

## Tenant Anatomy

Expect these files to move together:

- `src/components/<section>/View.tsx`
- `src/components/<section>/schema.ts`
- `src/components/<section>/types.ts`
- `src/components/<section>/index.ts`
- `src/lib/ComponentRegistry.tsx`
- `src/lib/schemas.ts`
- `src/lib/addSectionConfig.ts`
- `src/types.ts`
- `src/data/pages/**/*.json`
- `src/data/config/site.json`
- `src/data/config/theme.json`
- `src/data/config/menu.json`

Useful rule: if a section type changes, check all of the files above before concluding the task is done.

## What Good Work Looks Like

A good tenant change:

- stays inside tenant boundaries unless the issue is truly in `@olonjs/core`
- keeps schema, defaults, registry, and type augmentation aligned
- preserves editability for strings, lists, nested objects, CTAs, and image fields
- uses `ImageSelectionSchema`-style image fields when the content is image-driven
- keeps page content JSON-first

A suspicious tenant change:

- patches the core to fix a tenant modeling problem
- adds visual complexity without data bindings
- introduces fields into JSON that are not represented in schema
- changes a section view without updating defaults or types
- optimizes legacy context awareness at the expense of simpler, reliable editability

## Workflow 1: Base Tenant -> Branded Tenant

This is the primary workflow.

Goal:

- transform a CLI-generated base tenant into a branded tenant through a single generator script

Treat the generator script as procedural source of truth for the green build workflow.

When maintaining or authoring a generator:

1. Separate non-deterministic bootstrap from deterministic sync.
2. Make explicit which files are managed output.
3. Keep the script aligned with the current tenant code, not with stale docs.
4. Preserve tenant protocol files: sections, schemas, registries, type augmentation, config JSON, assets, shims.
5. Prefer deterministic local writes after any remote/bootstrap step.

Typical structure of a good generator:

- preflight checks
- remote/bootstrap steps such as `shadcn` or external registries
- deterministic creation/sync of tenant files
- compatibility patches for known unstable upstream payloads
- final validation commands

When asked to update a branded tenant generator:

1. Diff base tenant against branded tenant.
2. Classify differences into:
   - intended branded output
   - reusable generator logic
   - accidental drift
3. Encode only the reusable intended differences into the script.
4. Keep the output reproducible from a fresh base tenant.

## Workflow 2: Add Or Change A Section

When adding a new section type:

1. Create `View.tsx`, `schema.ts`, `types.ts`, `index.ts`.
2. Register the section in `src/lib/ComponentRegistry.tsx`.
3. Register the schema in `src/lib/schemas.ts`.
4. Add defaults and label in `src/lib/addSectionConfig.ts`.
5. Extend `SectionComponentPropsMap` and module augmentation in `src/types.ts`.
6. Add or update page JSON using the new section type.

When changing an existing section:

1. Read the section schema first.
2. Read the page JSON using it.
3. Check the view for `data-jp-field` usage and binding shape.
4. Update defaults if the data shape changed.
5. Verify the inspector still has a path to edit the content.

## Workflow 3: Images, Rich Content, Nested Routes

Images:

- Prefer structured image objects compatible with tenant base schemas.
- Assume the core supports image picking and upload flows.
- The tenant is responsible for declaring image fields in schema and rendering them coherently.

Rich editorial content:

- Tiptap-style sections are tenant-level integrations.
- Treat page JSON using `type: "tiptap"` as runtime usage examples, and section code as the real source of truth.

Nested routes:

- Files under `src/data/pages/**/*.json` may represent nested slugs.
- Preserve slug/path consistency and do not replace file-based routing with manual lists.

## Decision Rules

Use `alpha` patterns when the task is about:

- tenant DNA
- capability reference
- baseline protocol shape
- proving what the base system already supports

Use `gptgiorgio` patterns when the task is about:

- stronger branded frontend customization
- richer domain-specific sections
- image-heavy schema design
- proving how far customization can go without changing the bootstrap

Do not treat `gptgiorgio` as canonical for legacy admin context awareness.

## Default Operating Procedure

When you receive a OlonJS tenant task:

1. Identify whether the problem belongs to `core`, tenant, or generator.
2. Read the smallest code surface that proves it.
3. Prefer fixing the tenant contract before touching visual polish.
4. Keep generated and deterministic workflows reproducible.
5. State assumptions when inferring intended branded output from examples.

END_OF_FILE_CONTENT
# SKIP: .cursor/skills-cursor/olonjs/SKILL.md:Zone.Identifier is binary and cannot be embedded as text.
mkdir -p ".cursor/skills-cursor/shell"
echo "Creating .cursor/skills-cursor/shell/SKILL.md..."
cat << 'END_OF_FILE_CONTENT' > ".cursor/skills-cursor/shell/SKILL.md"
---
name: shell
description: >-
  Runs the rest of a /shell request as a literal shell command. Use only when
  the user explicitly invokes /shell and wants the following text executed
  directly in the terminal.
disable-model-invocation: true
---
# Run Shell Commands

Use this skill only when the user explicitly invokes `/shell`.

## Behavior

1. Treat all user text after the `/shell` invocation as the literal shell command to run.
2. Execute that command immediately with the terminal tool.
3. Do not rewrite, explain, or "improve" the command before running it.
4. Do not inspect the repository first unless the command itself requires repository context.
5. If the user invokes `/shell` without any following text, ask them which command to run.

## Response

- Run the command first.
- Then briefly report the exit status and any important stdout or stderr.

END_OF_FILE_CONTENT
mkdir -p ".cursor/skills-cursor/update-cursor-settings"
echo "Creating .cursor/skills-cursor/update-cursor-settings/SKILL.md..."
cat << 'END_OF_FILE_CONTENT' > ".cursor/skills-cursor/update-cursor-settings/SKILL.md"
---
name: update-cursor-settings
description: >-
  Modify Cursor/VSCode user settings in settings.json. Use when you want to
  change editor settings, preferences, configuration, themes, font size, tab
  size, format on save, auto save, keybindings, or any settings.json values.
---
# Updating Cursor Settings

This skill guides you through modifying Cursor/VSCode user settings. Use this when you want to change editor settings, preferences, configuration, themes, keybindings, or any `settings.json` values.

## Settings File Location

| OS | Path |
|----|------|
| macOS | ~/Library/Application Support/Cursor/User/settings.json |
| Linux | ~/.config/Cursor/User/settings.json |
| Windows | %APPDATA%\Cursor\User\settings.json |

## Before Modifying Settings

1. **Read the existing settings file** to understand current configuration
2. **Preserve existing settings** - only add/modify what the user requested
3. **Validate JSON syntax** before writing to avoid breaking the editor

## Modifying Settings

### Step 1: Read Current Settings

```typescript
// Read the settings file first
const settingsPath = "~/Library/Application Support/Cursor/User/settings.json";
// Use the Read tool to get current contents
```

### Step 2: Identify the Setting to Change

Common setting categories:
- **Editor**: `editor.fontSize`, `editor.tabSize`, `editor.wordWrap`, `editor.formatOnSave`
- **Workbench**: `workbench.colorTheme`, `workbench.iconTheme`, `workbench.sideBar.location`
- **Files**: `files.autoSave`, `files.exclude`, `files.associations`
- **Terminal**: `terminal.integrated.fontSize`, `terminal.integrated.shell.*`
- **Cursor-specific**: Settings prefixed with `cursor.` or `aipopup.`

### Step 3: Update the Setting

When modifying settings.json:
1. Parse the existing JSON (handle comments - VSCode settings support JSON with comments)
2. Add or update the requested setting
3. Preserve all other existing settings
4. Write back with proper formatting (2-space indentation)

### Example: Changing Font Size

If user says "make the font bigger":

```json
{
  "editor.fontSize": 16
}
```

### Example: Enabling Format on Save

If user says "format my code when I save":

```json
{
  "editor.formatOnSave": true
}
```

### Example: Changing Theme

If user says "use dark theme" or "change my theme":

```json
{
  "workbench.colorTheme": "Default Dark Modern"
}
```

## Important Notes

1. **JSON with Comments**: VSCode/Cursor settings.json supports comments (`//` and `/* */`). When reading, be aware comments may exist. When writing, preserve comments if possible.

2. **Restart May Be Required**: Some settings take effect immediately, others require reloading the window or restarting Cursor. Inform the user if a restart is needed.

3. **Backup**: For significant changes, consider mentioning the user can undo via Ctrl/Cmd+Z in the settings file or by reverting git changes if tracked.

4. **Workspace vs User Settings**:
   - User settings (what this skill covers): Apply globally to all projects
   - Workspace settings (`.vscode/settings.json`): Apply only to the current project

5. **Commit Attribution**: When the user asks about commit attribution, clarify whether they want to edit the **CLI agent** or the **IDE agent**. For the CLI agent, modify `~/.cursor/cli-config.json`. For the IDE agent, it is controlled from the UI at **Cursor Settings > Agent > Attribution** (not settings.json).

## Common User Requests → Settings

| User Request | Setting |
|--------------|---------|
| "bigger/smaller font" | `editor.fontSize` |
| "change tab size" | `editor.tabSize` |
| "format on save" | `editor.formatOnSave` |
| "word wrap" | `editor.wordWrap` |
| "change theme" | `workbench.colorTheme` |
| "hide minimap" | `editor.minimap.enabled` |
| "auto save" | `files.autoSave` |
| "line numbers" | `editor.lineNumbers` |
| "bracket matching" | `editor.bracketPairColorization.enabled` |
| "cursor style" | `editor.cursorStyle` |
| "smooth scrolling" | `editor.smoothScrolling` |

## Workflow

1. Read ~/Library/Application Support/Cursor/User/settings.json
2. Parse the JSON content
3. Add/modify the requested setting(s)
4. Write the updated JSON back to the file
5. Inform the user the setting has been changed and whether a reload is needed

END_OF_FILE_CONTENT
echo "Creating index.html..."
cat << 'END_OF_FILE_CONTENT' > "index.html"
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Olon — Agentic Content Infrastructure" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link href="https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-sans/style.css" rel="stylesheet" />
    <link href="https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-mono/style.css" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,500;0,700;1,300;1,500;1,700&display=swap" rel="stylesheet" />
    <link href="https://cdn.jsdelivr.net/npm/@fontsource-variable/merriweather@5.2.6/wdth.css" rel="stylesheet" />
    <title>Olon</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>


END_OF_FILE_CONTENT
echo "Creating package.json..."
cat << 'END_OF_FILE_CONTENT' > "package.json"
{
  "name": "tenant-alpha",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "dev:clean": "vite --force",
    "prebuild": "node scripts/sync-pages-to-public.mjs",
    "build": "tsc && vite build",
    "dist": "bash ./src2Code.sh --template alpha src .cursor vercel.json index.html tsconfig.json tsconfig.node.json vite.config.ts scripts specs package.json",
    "preview": "vite preview",
    "bake:email": "tsx scripts/bake-email.tsx",
    "bakemail": "npm run bake:email --",
    "dist:dna": "npm run dist"
  },
  "dependencies": {
    "@tiptap/extension-image": "^2.11.5",
    "@tiptap/extension-link": "^2.11.5",
    "@tiptap/react": "^2.11.5",
    "@tiptap/starter-kit": "^2.11.5",
    "@olonjs/core": "^1.0.83",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.474.0",
    "motion": "^12.23.24",
    "react": "^19.0.0",
    "react-markdown": "^9.0.1",
    "react-dom": "^19.0.0",
    "react-router-dom": "^6.30.3",
    "rehype-sanitize": "^6.0.0",
    "remark-gfm": "^4.0.1",
    "tailwind-merge": "^3.0.1",
    "tiptap-markdown": "^0.8.10",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.0.0",
    "@types/react": "^19.0.8",
    "@types/react-dom": "^19.0.3",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.7.3",
    "vite": "^6.0.11",
    "@react-email/components": "^0.0.41",
    "@react-email/render": "^1.0.5",
    "tsx": "^4.20.5"
  }
}

END_OF_FILE_CONTENT
mkdir -p "scripts"
echo "Creating scripts/bake-email.tsx..."
cat << 'END_OF_FILE_CONTENT' > "scripts/bake-email.tsx"
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { render } from "@react-email/render";
import React from "react";

type Args = {
  entry?: string;
  out?: string;
  outDir?: string;
  exportName?: string;
  propsFile?: string;
  siteConfig?: string;
  themeConfig?: string;
};

type BakeTarget = {
  entryAbs: string;
  outAbs: string;
};

type SiteConfig = {
  identity?: {
    title?: string;
    logoUrl?: string;
  };
  header?: {
    data?: {
      logoImageUrl?: {
        url?: string;
        alt?: string;
      };
    };
  };
  footer?: {
    data?: {
      brandText?: string;
      brandHighlight?: string;
      tagline?: string;
      logoImageUrl?: {
        url?: string;
        alt?: string;
      };
    };
  };
};

type ThemeConfig = {
  tokens?: {
    colors?: Record<string, string>;
    typography?: {
      fontFamily?: Record<string, string>;
    };
    borderRadius?: Record<string, string>;
  };
};

const DEFAULT_EMAIL_DIR = "src/emails";
const DEFAULT_OUT_DIR = "email-templates";
const DEFAULT_SITE_CONFIG = "src/data/config/site.json";
const DEFAULT_THEME_CONFIG = "src/data/config/theme.json";

function parseArgs(argv: string[]): Args {
  const args: Args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    const next = argv[i + 1];
    if (!next) continue;
    if (key === "--entry") {
      args.entry = next;
      i += 1;
      continue;
    }
    if (key === "--out") {
      args.out = next;
      i += 1;
      continue;
    }
    if (key === "--out-dir") {
      args.outDir = next;
      i += 1;
      continue;
    }
    if (key === "--export") {
      args.exportName = next;
      i += 1;
      continue;
    }
    if (key === "--props") {
      args.propsFile = next;
      i += 1;
      continue;
    }
    if (key === "--site-config") {
      args.siteConfig = next;
      i += 1;
      continue;
    }
    if (key === "--theme-config") {
      args.themeConfig = next;
      i += 1;
    }
  }
  return args;
}

function isComponentExport(value: unknown): value is React.ComponentType<any> {
  return typeof value === "function";
}

function toKebabCase(value: string): string {
  return value
    .replace(/Email$/i, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .toLowerCase();
}

function deriveOutAbs(entryAbs: string, outDirAbs: string): string {
  const base = path.basename(entryAbs).replace(/\.[^.]+$/, "");
  const fileName = `${toKebabCase(base)}.html`;
  return path.join(outDirAbs, fileName);
}

async function discoverEmailEntries(rootDir: string): Promise<string[]> {
  const abs = path.resolve(process.cwd(), rootDir);
  const dirEntries = await fs.readdir(abs, { withFileTypes: true }).catch(() => []);
  return dirEntries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => /\.(tsx|jsx)$/i.test(name))
    .map((name) => path.join(abs, name));
}

function normalizeUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
}

async function readJsonObject<T>(filePath: string): Promise<T | null> {
  const abs = path.resolve(process.cwd(), filePath);
  const raw = await fs.readFile(abs, "utf8").catch(() => null);
  if (!raw) return null;
  const parsed = JSON.parse(raw);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
  return parsed as T;
}

function buildDefaultProps(site: SiteConfig | null, theme: ThemeConfig | null): Record<string, unknown> {
  const footerBrandText = site?.footer?.data?.brandText?.trim() ?? "";
  const footerBrandHighlight = site?.footer?.data?.brandHighlight?.trim() ?? "";
  const brandName = `${footerBrandText}${footerBrandHighlight}`.trim() || "{{tenantName}}";

  const tenantName = site?.identity?.title?.trim() || brandName;
  const logoUrl =
    normalizeUrl(site?.header?.data?.logoImageUrl?.url) ||
    normalizeUrl(site?.footer?.data?.logoImageUrl?.url) ||
    normalizeUrl(site?.identity?.logoUrl) ||
    "";
  const logoAlt =
    site?.header?.data?.logoImageUrl?.alt?.trim() ||
    site?.footer?.data?.logoImageUrl?.alt?.trim() ||
    brandName;
  const tagline = site?.footer?.data?.tagline?.trim() || "";

  return {
    tenantName,
    brandName,
    logoUrl,
    logoAlt,
    tagline,
    theme: theme?.tokens ?? {},
    correlationId: "{{correlationId}}",
    replyTo: "{{replyTo}}",
    leadData: {
      name: "{{lead.name}}",
      email: "{{lead.email}}",
      phone: "{{lead.phone}}",
      checkin: "{{lead.checkin}}",
      checkout: "{{lead.checkout}}",
      guests: "{{lead.guests}}",
      notes: "{{lead.notes}}",
    },
  };
}

async function readProps(
  propsFile: string | undefined,
  siteConfigPath: string,
  themeConfigPath: string
): Promise<Record<string, unknown>> {
  if (propsFile) {
    const raw = await fs.readFile(path.resolve(process.cwd(), propsFile), "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("--props must point to a JSON object file");
    }
    return parsed as Record<string, unknown>;
  }

  const site = await readJsonObject<SiteConfig>(siteConfigPath);
  const theme = await readJsonObject<ThemeConfig>(themeConfigPath);
  return buildDefaultProps(site, theme);
}

async function buildTargets(args: Args): Promise<BakeTarget[]> {
  const outDirAbs = path.resolve(process.cwd(), args.outDir ?? DEFAULT_OUT_DIR);

  if (args.entry) {
    const entryAbs = path.resolve(process.cwd(), args.entry);
    const outAbs = args.out ? path.resolve(process.cwd(), args.out) : deriveOutAbs(entryAbs, outDirAbs);
    return [{ entryAbs, outAbs }];
  }

  const discovered = await discoverEmailEntries(DEFAULT_EMAIL_DIR);
  if (discovered.length === 0) {
    throw new Error(`No templates found in ${DEFAULT_EMAIL_DIR}`);
  }

  return discovered.map((entryAbs) => ({
    entryAbs,
    outAbs: deriveOutAbs(entryAbs, outDirAbs),
  }));
}

async function bakeTemplate(target: BakeTarget, args: Args, props: Record<string, unknown>) {
  const moduleUrl = pathToFileURL(target.entryAbs).href;
  const mod = (await import(moduleUrl)) as Record<string, unknown>;
  const picked = args.exportName ? mod[args.exportName] : mod.default;

  if (!isComponentExport(picked)) {
    const available = Object.keys(mod).join(", ") || "(none)";
    throw new Error(
      `Template export not found or not a component. Requested: ${args.exportName ?? "default"}. Available exports: ${available}. Entry: ${target.entryAbs}`
    );
  }

  const element = React.createElement(picked, props);
  const html = await render(element, { pretty: true });

  await fs.mkdir(path.dirname(target.outAbs), { recursive: true });
  await fs.writeFile(target.outAbs, html, "utf8");

  console.log(`Baked email template: ${path.relative(process.cwd(), target.outAbs)}`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const targets = await buildTargets(args);
  const props = await readProps(
    args.propsFile,
    args.siteConfig ?? DEFAULT_SITE_CONFIG,
    args.themeConfig ?? DEFAULT_THEME_CONFIG
  );

  for (const target of targets) {
    await bakeTemplate(target, args, props);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

END_OF_FILE_CONTENT
echo "Creating scripts/bake.mjs..."
cat << 'END_OF_FILE_CONTENT' > "scripts/bake.mjs"
/**
 * olon bake - production SSG
 *
 * 1) Build client bundle (dist/)
 * 2) Build SSR entry bundle (dist-ssr/)
 * 3) Discover all page slugs from JSON files under src/data/pages
 * 4) Render each slug via SSR and write dist/<slug>/index.html
 */

import { build } from 'vite';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import fs from 'fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const pagesDir = path.resolve(root, 'src/data/pages');

function toCanonicalSlug(relativeJsonPath) {
  const normalized = relativeJsonPath.replace(/\\/g, '/');
  const slug = normalized.replace(/\.json$/i, '').replace(/^\/+|\/+$/g, '');
  if (!slug) throw new Error('[bake] Invalid page slug: empty path segment');
  return slug;
}

async function listJsonFilesRecursive(dir) {
  const items = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...(await listJsonFilesRecursive(fullPath)));
      continue;
    }
    if (item.isFile() && item.name.toLowerCase().endsWith('.json')) files.push(fullPath);
  }
  return files;
}

async function discoverTargets() {
  let files = [];
  try {
    files = await listJsonFilesRecursive(pagesDir);
  } catch {
    files = [];
  }

  const rawSlugs = files.map((fullPath) => toCanonicalSlug(path.relative(pagesDir, fullPath)));
  const slugs = Array.from(new Set(rawSlugs)).sort((a, b) => a.localeCompare(b));

  return slugs.map((slug) => {
    const depth = slug === 'home' ? 0 : slug.split('/').length;
    const out = slug === 'home' ? 'dist/index.html' : `dist/${slug}/index.html`;
    return { slug, out, depth };
  });
}

console.log('\n[bake] Building client...');
await build({ root, mode: 'production', logLevel: 'warn' });
console.log('[bake] Client build done.');

console.log('\n[bake] Building SSR bundle...');
await build({
  root,
  mode: 'production',
  logLevel: 'warn',
  build: {
    ssr: 'src/entry-ssg.tsx',
    outDir: 'dist-ssr',
    rollupOptions: {
      output: { format: 'esm' },
    },
  },
  ssr: {
    noExternal: ['@olonjs/core'],
  },
});
console.log('[bake] SSR build done.');

const targets = await discoverTargets();
if (targets.length === 0) {
  throw new Error('[bake] No pages discovered under src/data/pages');
}
console.log(`[bake] Targets: ${targets.map((t) => t.slug).join(', ')}`);

const ssrEntryUrl = pathToFileURL(path.resolve(root, 'dist-ssr/entry-ssg.js')).href;
const { render, getCss, getPageMeta } = await import(ssrEntryUrl);

const template = await fs.readFile(path.resolve(root, 'dist/index.html'), 'utf-8');
const hasCommentMarker = template.includes('<!--app-html-->');
const hasRootDivMarker = template.includes('<div id="root"></div>');
if (!hasCommentMarker && !hasRootDivMarker) {
  throw new Error('[bake] Missing template marker. Expected <!--app-html--> or <div id="root"></div>.');
}

const inlinedCss = getCss();
const styleTag = `<style data-bake="inline">${inlinedCss}</style>`;

for (const { slug, out, depth } of targets) {
  console.log(`\n[bake] Rendering /${slug === 'home' ? '' : slug}...`);

  const appHtml = render(slug);
  const { title, description } = getPageMeta(slug);
  const safeTitle = String(title).replace(/"/g, '&quot;');
  const safeDescription = String(description).replace(/"/g, '&quot;');
  const metaTags = [
    `<meta name="description" content="${safeDescription}">`,
    `<meta property="og:title" content="${safeTitle}">`,
    `<meta property="og:description" content="${safeDescription}">`,
  ].join('\n    ');

  const prefix = depth > 0 ? '../'.repeat(depth) : './';
  const fixedTemplate = depth > 0 ? template.replace(/(['"])\.\//g, `$1${prefix}`) : template;

  let bakedHtml = fixedTemplate
    .replace('</head>', `  ${styleTag}\n</head>`)
    .replace(/<title>.*?<\/title>/, `<title>${safeTitle}</title>\n    ${metaTags}`);

  if (hasCommentMarker) {
    bakedHtml = bakedHtml.replace('<!--app-html-->', appHtml);
  } else {
    bakedHtml = bakedHtml.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
  }

  const outPath = path.resolve(root, out);
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, bakedHtml, 'utf-8');
  console.log(`[bake] Written -> ${out} [title: "${safeTitle}"]`);
}

console.log('\n[bake] All pages baked. OK\n');

END_OF_FILE_CONTENT
# SKIP: scripts/bake.mjs:Zone.Identifier is binary and cannot be embedded as text.
echo "Creating scripts/sync-pages-to-public.mjs..."
cat << 'END_OF_FILE_CONTENT' > "scripts/sync-pages-to-public.mjs"
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const sourceDir = path.join(rootDir, 'src', 'data', 'pages');
const targetDir = path.join(rootDir, 'public', 'pages');

if (!fs.existsSync(sourceDir)) {
  console.warn('[sync-pages-to-public] Source directory not found:', sourceDir);
  process.exit(0);
}

fs.rmSync(targetDir, { recursive: true, force: true });
fs.mkdirSync(targetDir, { recursive: true });
fs.cpSync(sourceDir, targetDir, { recursive: true });

console.log('[sync-pages-to-public] Synced pages to public/pages');

END_OF_FILE_CONTENT
mkdir -p "specs"
echo "Creating specs/olonjsSpecs_V.1.3.md..."
cat << 'END_OF_FILE_CONTENT' > "specs/olonjsSpecs_V.1.3.md"
# 📐 OlonJS Architecture Specifications v1.3

**Status:** Mandatory Standard  
**Version:** 1.3.0 (Sovereign Core Edition — Architecture + Studio/ICE UX, Path-Deterministic Nested Editing)  
**Target:** Senior Architects / AI Agents / Enterprise Governance  

**Scope v1.3:** This edition preserves the complete v1.2 architecture (MTRP, JSP, TBP, CIP, ECIP, JAP + Studio/ICE UX contract: IDAC, TOCC, BSDS, ASC, JEB + Tenant Type & Code-Generation Annex) as a **faithful superset**, and adds strict path-based/nested-array behavior for Studio selection and Inspector expansion.  
**Scope note (breaking):** In strict v1.3 Studio semantics, the legacy flat protocol (`itemField` / `itemId`) is removed in favor of `itemPath` (root-to-leaf path segments).

---

## 1. 📐 Modular Type Registry Pattern (MTRP) v1.2

**Objective:** Establish a strictly typed, open-ended protocol for extending content data structures where the **Core Engine** is the orchestrator and the **Tenant** is the provider.

### 1.1 The Sovereign Dependency Inversion
The **Core** defines the empty `SectionDataRegistry`. The **Tenant** "injects" its specific definitions using **Module Augmentation**. This allows the Core to be distributed as a compiled NPM package while remaining aware of Tenant-specific types at compile-time.

### 1.2 Technical Implementation (`@olonjs/core/kernel`)
```typescript
export interface SectionDataRegistry {} // Augmented by Tenant
export interface SectionSettingsRegistry {} // Augmented by Tenant

export interface BaseSection<K extends keyof SectionDataRegistry> {
  id: string;
  type: K;
  data: SectionDataRegistry[K];
  settings?: K extends keyof SectionSettingsRegistry
    ? SectionSettingsRegistry[K]
    : BaseSectionSettings;
}

export type Section = {
  [K in keyof SectionDataRegistry]: BaseSection<K>
}[keyof SectionDataRegistry];
```

**SectionType:** Core exports (or Tenant infers) **`SectionType`** as **`keyof SectionDataRegistry`**. After Tenant module augmentation, this is the union of all section type keys (e.g. `'header' | 'footer' | 'hero' | ...`). The Tenant uses this type for the ComponentRegistry and SECTION_SCHEMAS keys.

**Perché servono:** Il Core deve poter renderizzare section senza conoscere i tipi concreti a compile-time; il Tenant deve poter aggiungere nuovi tipi senza modificare il Core. I registry vuoti + module augmentation permettono di distribuire Core come pacchetto NPM e mantenere type-safety end-to-end (Section, registry, config). Senza MTRP, ogni nuovo tipo richiederebbe cambi nel Core o tipi deboli (`any`).

---

## 2. 📐 JsonPages Site Protocol (JSP) v1.8

**Objective:** Define the deterministic file system and the **Sovereign Projection Engine** (CLI).

### 2.1 The File System Ontology (The Silo Contract)
Every site must reside in an isolated directory. Global Governance is physically separated from Local Content.
*   **`/config/site.json`** — Global Identity & Reserved System Blocks (Header/Footer). See Appendix A for typed shape.
*   **`/config/menu.json`** — Navigation Tree (SSOT for System Header). See Appendix A.
*   **`/config/theme.json`** — Theme tokens (optional but recommended). See Appendix A.
*   **`/pages/[slug].json`** — Local Body Content per page. See Appendix A (PageConfig).

**Application path convention:** The runtime app typically imports these via an alias (e.g. **`@/data/config/`** and **`@/data/pages/`**). The physical silo may be `src/data/config/` and `src/data/pages/` so that `site.json`, `menu.json`, `theme.json` live under `src/data/config/`, and page JSONs under `src/data/pages/`. The CLI or projection script may use `/config/` and `/pages/` at repo root; the **contract** is that the app receives **siteConfig**, **menuConfig**, **themeConfig**, and **pages** as defined in JEB (§10) and Appendix A.

### 2.2 Deterministic Projection (CLI Workflow)
The CLI (`@olonjs/cli`) creates new tenants by:
1.  **Infra Projection:** Generating `package.json`, `tsconfig.json`, and `vite.config.ts` (The Shell).
2.  **Source Projection:** Executing a deterministic script (`src_tenant_alpha.sh`) to reconstruct the `src` folder (The DNA).
3.  **Dependency Resolution:** Enforcing specific versions of React, Radix, and Tailwind v4.

**Perché servono:** Una struttura file deterministica (config vs pages) separa governance globale (site, menu, theme) dal contenuto per pagina; il CLI può rigenerare tenant e tooling può trovare dati e schemi sempre negli stessi path. Senza JSP, ogni tenant sarebbe una struttura ad hoc e ingestione/export/Bake sarebbero fragili.

---

## 3. 🧱 Tenant Block Protocol (TBP) v1.0

**Objective:** Standardize the "Capsule" structure for components to enable automated ingestion (Pull) by the SaaS.

### 3.1 The Atomic Capsule Structure
Components are self-contained directories under **`src/components/<sectionType>/`**:
*   **`View.tsx`** — The pure React component (Dumb View). Props: see Appendix A (SectionComponentPropsMap).
*   **`schema.ts`** — Zod schema(s) for the **data** contract (and optionally **settings**). Exports at least one schema (e.g. `HeroSchema`) used as the **data** schema for that type. Must extend BaseSectionData (§8) for data; array items must extend BaseArrayItem (§8).
*   **`types.ts`** — TypeScript interfaces inferred from the schema (e.g. `HeroData`, `HeroSettings`). Export types with names **`<SectionType>Data`** and **`<SectionType>Settings`** (or equivalent) so the Tenant can aggregate them in a single types module.
*   **`index.ts`** — Public API: re-exports View, schema(s), and types.

### 3.2 Reserved System Types
*   **`type: 'header'`** — Reserved for `site.json`. Receives **`menu: MenuItem[]`** in addition to `data` and `settings`. Menu is sourced from `menu.json` (see Appendix A). The Tenant **must** type `SectionComponentPropsMap['header']` as `{ data: HeaderData; settings?: HeaderSettings; menu: MenuItem[] }`.
*   **`type: 'footer'`** — Reserved for `site.json`. Props: `{ data: FooterData; settings?: FooterSettings }` only (no `menu`).
*   **`type: 'sectionHeader'`** — A standard local block. Must define its own `links` array in its local schema if used.

**Perché servono:** La capsula (View + schema + types + index) è l’unità di estensione: il Core e il Form Factory possono scoprire tipi e contratti per tipo senza convenzioni ad hoc. Header/footer riservati evitano conflitti tra globale e locale. Senza TBP, aggregazione di SECTION_SCHEMAS e registry sarebbe incoerente e l’ingestion da SaaS non sarebbe automatizzabile.

---

## 4. 🧱 Component Implementation Protocol (CIP) v1.5

**Objective:** Ensure system-wide stability and Admin UI integrity.

1.  **The "Sovereign View" Law:** Components receive `data` and `settings` (and `menu` for header only) and return JSX. They are metadata-blind (never import Zod schemas).
2.  **Z-Index Neutrality:** Components must not use `z-index > 1`. Layout delegation (sticky/fixed) is managed by the `SectionRenderer`.
3.  **Agnostic Asset Protocol:** Use `resolveAssetUrl(path, tenantId)` for all media. Resolved URLs are under **`/assets/...`** with no tenantId segment in the path (e.g. relative `img/hero.jpg` → `/assets/img/hero.jpg`).

### 4.4 Local Design Tokens (v1.2)
Section Views that control their own background, text, borders, or radii **shall** define a **local scope** via an inline `style` object on the section root: e.g. `--local-bg`, `--local-text`, `--local-text-muted`, `--local-surface`, `--local-border`, `--local-radius-lg`, `--local-accent`, mapped to theme variables. All Tailwind classes that affect color or radius in that section **must** use these variables (e.g. `bg-[var(--local-bg)]`, `text-[var(--local-text)]`). No naked utilities (e.g. `bg-blue-500`). An optional **`label`** in section data may be rendered with class **`jp-section-label`** for overlay type labels.

### 4.5 Z-Index & Overlay Governance (v1.2)
Section content root **must** stay at **`z-index` ≤ 1** (prefer `z-0`) so the Sovereign Overlay can sit above with high z-index in Tenant CSS (§7). Header/footer may use a higher z-index (e.g. 50) only as a documented exception for global chrome.

**Perché servono (CIP):** View “dumb” (solo data/settings) e senza import di Zod evita accoppiamento e permette al Form Factory di essere l’unica fonte di verità sugli schemi. Z-index basso evita che il contenuto copra l’overlay di selezione in Studio. Asset via `resolveAssetUrl`: i path relativi vengono risolti in `/assets/...` (senza segmento tenantId nel path). Token locali (`--local-*`) rendono le section temabili e coerenti con overlay e tema; senza, stili “nudi” creano drift visivo e conflitti con l’UI di editing.

---

## 5. 🛠️ Editor Component Implementation Protocol (ECIP) v1.5

**Objective:** Standardize the Polymorphic ICE engine.

1.  **Recursive Form Factory:** The Admin UI builds forms by traversing the Zod ontology.
2.  **UI Metadata:** Use `.describe('ui:[widget]')` in schemas to pass instructions to the Form Factory.
3.  **Deterministic IDs:** Every object in a `ZodArray` must extend `BaseArrayItem` (containing an `id`) to ensure React reconciliation stability during reordering.

### 5.4 UI Metadata Vocabulary (v1.2)
Standard keys for the Form Factory:

| Key | Use case |
|-----|----------|
| `ui:text` | Single-line text input. |
| `ui:textarea` | Multi-line text. |
| `ui:select` | Enum / single choice. |
| `ui:number` | Numeric input. |
| `ui:list` | Array of items; list editor (add/remove/reorder). |
| `ui:icon-picker` | Icon selection. |

Unknown keys may be treated as `ui:text`. Array fields must use `BaseArrayItem` for items.

### 5.5 Path-Only Nested Selection & Expansion (v1.3, breaking)
In strict v1.3 Studio/Inspector behavior, nested editing targets are represented by **path segments from root to leaf**.

```typescript
export type SelectionPathSegment = { fieldKey: string; itemId?: string };
export type SelectionPath = SelectionPathSegment[];
```

Rules:
*   Expansion and focus for nested arrays **must** be computed from `SelectionPath` (root → leaf), not from a single flat pair.
*   Matching by `fieldKey` alone is non-compliant for nested structures.
*   Legacy flat payload fields **`itemField`** and **`itemId`** are removed from strict v1.3 selection protocol.

**Perché servono (ECIP):** Il Form Factory deve sapere quale widget usare (text, textarea, select, list, …) senza hardcodare per tipo; `.describe('ui:...')` è il contratto. BaseArrayItem con `id` su ogni item di array garantisce chiavi stabili in React e reorder/delete corretti nell’Inspector. In v1.3 la selezione/espansione path-only elimina ambiguità su array annidati: senza path completo root→leaf, la sidebar può aprire il ramo sbagliato o non aprire il target.

---

## 6. 🎯 ICE Data Attribute Contract (IDAC) v1.1

**Objective:** Mandatory data attributes so the Stage (iframe) and Inspector can bind selection and field/item editing without coupling to Tenant DOM.

### 6.1 Section-Level Markup (Core-Provided)
**SectionRenderer** (Core) wraps each section root with:
*   **`data-section-id`** — Section instance ID (e.g. UUID). On the wrapper that contains content + overlay.
*   Sibling overlay element **`data-jp-section-overlay`** — Selection ring and type label. **Tenant does not add this;** Core injects it.

Tenant Views render the **content** root only (e.g. `<section>` or `<div>`), placed **inside** the Core wrapper.

### 6.2 Field-Level Binding (Tenant-Provided)
For every **editable scalar field** the View **must** attach **`data-jp-field="<fieldKey>"`** (key matches schema path: e.g. `title`, `description`, `sectionTitle`, `label`).

### 6.3 Array-Item Binding (Tenant-Provided)
For every **editable array item** the View **must** attach:
*   **`data-jp-item-id="<stableId>"`** — Prefer `item.id`; fallback e.g. `legacy-${index}` only outside strict mode.
*   **`data-jp-item-field="<arrayKey>"`** — e.g. `cards`, `layers`, `products`, `paragraphs`.

### 6.4 Compliance
**Reserved types** (`header`, `footer`): ICE attributes optional unless Studio edits them. **All other section types** in the Stage and in `SECTION_SCHEMAS` **must** implement §6.2 and §6.3 for every editable field and array item.

### 6.5 Strict Path Extraction for Nested Arrays (v1.3, breaking)
For nested array targets, the Core/Inspector contract is path-based:
*   The runtime selection target is expressed as `itemPath: SelectionPath` (root → leaf).
*   Flat identity (`itemField` + `itemId`) is not sufficient for nested structures and is removed in strict v1.3 payloads.
*   In strict mode, index-based identity fallback is non-compliant for editable object arrays.

**Perché servono (IDAC):** Lo Stage è in un iframe e l’Inspector deve sapere **quale campo o item** corrisponde al click (o alla selezione) senza conoscere la struttura DOM del Tenant. **`data-jp-field`** associa un nodo DOM al path dello schema (es. `title`, `description`): così il Core può evidenziare la riga giusta nella sidebar, applicare opacità attivo/inattivo e aprire il form sul campo corretto. **`data-jp-item-id`** e **`data-jp-item-field`** fanno lo stesso per gli item di array (liste, reorder, delete). In v1.3, `itemPath` rende deterministico anche il caso nested (array dentro array), eliminando mismatch tra selezione canvas e ramo aperto in sidebar.

---

## 7. 🎨 Tenant Overlay CSS Contract (TOCC) v1.0

**Objective:** The Stage iframe loads only Tenant HTML/CSS. Core injects overlay **markup** but does **not** ship overlay styles. The Tenant **must** supply CSS so overlay is visible.

### 7.1 Required Selectors (Tenant global CSS)
1. **`[data-jp-section-overlay]`** — `position: absolute; inset: 0`; `pointer-events: none`; base state transparent.
2. **`[data-section-id]:hover [data-jp-section-overlay]`** — Hover: e.g. dashed border, subtle tint.
3. **`[data-section-id][data-jp-selected] [data-jp-section-overlay]`** — Selected: solid border, optional tint.
4. **`[data-jp-section-overlay] > div`** (type label) — Position and visibility (e.g. visible on hover/selected).

### 7.2 Z-Index
Overlay **z-index** high (e.g. 9999). Section content at or below CIP limit (§4.5).

### 7.3 Responsibility
**Core:** Injects wrapper and overlay DOM; sets `data-jp-selected`. **Tenant:** All overlay **visual** rules.

**Perché servono (TOCC):** L’iframe dello Stage carica solo HTML/CSS del Tenant; il Core inietta il markup dell’overlay ma non gli stili. Senza CSS Tenant per i selettori TOCC, bordo hover/selected e type label non sarebbero visibili: l’autore non vedrebbe quale section è selezionata né il label del tipo. TOCC chiarisce la responsabilità (Core = markup, Tenant = aspetto) e garantisce UX uniforme tra tenant.

---

## 8. 📦 Base Section Data & Settings (BSDS) v1.0

**Objective:** Standardize base schema fragments for anchors, array items, and section settings.

### 8.1 BaseSectionData
Every section data schema **must** extend a base with at least **`anchorId`** (optional string). Canonical Zod (Tenant `lib/base-schemas.ts` or equivalent):

```typescript
export const BaseSectionData = z.object({
  anchorId: z.string().optional().describe('ui:text'),
});
```

### 8.2 BaseArrayItem
Every array item schema editable in the Inspector **must** include **`id`** (optional string minimum). Canonical Zod:

```typescript
export const BaseArrayItem = z.object({
  id: z.string().optional(),
});
```

Recommended: required UUID for new items. Used by `data-jp-item-id` and React reconciliation.

### 8.3 BaseSectionSettings (Optional)
Common section-level settings. Canonical Zod (name **BaseSectionSettingsSchema** or as exported by Core):

```typescript
export const BaseSectionSettingsSchema = z.object({
  paddingTop: z.enum(['none', 'sm', 'md', 'lg', 'xl', '2xl']).default('md').describe('ui:select'),
  paddingBottom: z.enum(['none', 'sm', 'md', 'lg', 'xl', '2xl']).default('md').describe('ui:select'),
  theme: z.enum(['dark', 'light', 'accent']).default('dark').describe('ui:select'),
  container: z.enum(['boxed', 'fluid']).default('boxed').describe('ui:select'),
});
```

Capsules may extend this for type-specific settings. Core may export **BaseSectionSettings** as the TypeScript type inferred from this or a superset.

**Perché servono (BSDS):** anchorId permette deep-link e navigazione in-page; id sugli array item è necessario per `data-jp-item-id`, reorder e React reconciliation. BaseSectionSettings comuni (padding, theme, container) evitano ripetizione e allineano il Form Factory tra capsule. Senza base condivisi, ogni capsule inventa convenzioni e validazione/add-section diventano fragili.

---

## 9. 📌 AddSectionConfig (ASC) v1.0

**Objective:** Formalize the "Add Section" contract used by the Studio.

**Type (Core exports `AddSectionConfig`):**
```typescript
interface AddSectionConfig {
  addableSectionTypes: readonly string[];
  sectionTypeLabels: Record<string, string>;
  getDefaultSectionData(sectionType: string): Record<string, unknown>;
}
```

**Shape:** Tenant provides one object (e.g. `addSectionConfig`) with:
*   **`addableSectionTypes`** — Readonly array of section type keys. Only these types appear in the Add Section Library. Must be a subset of (or equal to) the keys in SectionDataRegistry.
*   **`sectionTypeLabels`** — Map type key → display string (e.g. `{ hero: 'Hero', 'cta-banner': 'CTA Banner' }`).
*   **`getDefaultSectionData(sectionType: string): Record<string, unknown>`** — Returns default `data` for a new section. Must conform to the capsule’s data schema so the new section validates.

Core creates a new section with deterministic UUID, `type`, and `data` from `getDefaultSectionData(type)`.

**Perché servono (ASC):** Lo Studio deve mostrare una libreria “Aggiungi sezione” con nomi leggibili e, alla scelta, creare una section con dati iniziali validi. addableSectionTypes, sectionTypeLabels e getDefaultSectionData sono il contratto: il Tenant è l’unica fonte di verità su quali tipi sono addabili e con quali default. Senza ASC, il Core non saprebbe cosa mostrare in modal né come popolare i dati della nuova section.

---

## 10. ⚙️ JsonPagesConfig & Engine Bootstrap (JEB) v1.1

**Objective:** Bootstrap contract between Tenant app and `@olonjs/core`.

### 10.1 JsonPagesConfig (required fields)
The Tenant passes a single **config** object to **JsonPagesEngine**. Required fields:

| Field | Type | Description |
|-------|------|-------------|
| **tenantId** | string | Passed to `resolveAssetUrl(path, tenantId)`; resolved asset URLs are **`/assets/...`** with no tenantId segment in the path. |
| **registry** | `{ [K in SectionType]: React.FC<SectionComponentPropsMap[K]> }` | Component registry. Must match MTRP keys. See Appendix A. |
| **schemas** | `Record<SectionType, ZodType>` or equivalent | SECTION_SCHEMAS: type → **data** Zod schema. Form Factory uses this. See Appendix A. |
| **pages** | `Record<string, PageConfig>` | Slug → page config. See Appendix A. |
| **siteConfig** | SiteConfig | Global site (identity, header/footer blocks). See Appendix A. |
| **themeConfig** | ThemeConfig | Theme tokens. See Appendix A. |
| **menuConfig** | MenuConfig | Navigation tree (SSOT for header menu). See Appendix A. |
| **themeCss** | `{ tenant: string }` | At least **tenant**: string (inline CSS or URL) for Stage iframe injection. |
| **addSection** | AddSectionConfig | Add-section config (§9). |

Core may define optional fields. The Tenant must not omit required fields.

### 10.2 JsonPagesEngine
Root component: **`<JsonPagesEngine config={config} />`**. Responsibilities: route → page, SectionRenderer per section; in Studio mode Sovereign Shell (Inspector, Control Bar, postMessage); section wrappers and overlay per IDAC and JAP. Tenant does not implement the Shell.

### 10.3 Studio Selection Event Contract (v1.3, breaking)
In strict v1.3 Studio, section selection payload for nested targets is path-based:

```typescript
type SectionSelectMessage = {
  type: 'SECTION_SELECT';
  section: { id: string; type: string; scope: 'global' | 'local' };
  itemPath?: SelectionPath; // root -> leaf
};
```

Removed from strict protocol:
*   `itemField`
*   `itemId`

**Perché servono (JEB):** Un unico punto di bootstrap (config + Engine) evita che il Tenant replichi logica di routing, Shell e overlay. I campi obbligatori in JsonPagesConfig (tenantId, registry, schemas, pages, siteConfig, themeConfig, menuConfig, themeCss, addSection) sono il minimo per far funzionare rendering, Studio e Form Factory; omissioni causano errori a runtime. In v1.3, il payload `itemPath` sincronizza in modo non ambiguo Stage e Inspector su nested arrays.

---

# 🏛️ OlonJS_ADMIN_PROTOCOL (JAP) v1.2

**Status:** Mandatory Standard  
**Version:** 1.2.0 (Sovereign Shell Edition — Path/Nested Strictness)  
**Objective:** Deterministic orchestration of the "Studio" environment (ICE Level 1).

---

## 1. The Sovereign Shell Topology
The Admin interface is a **Sovereign Shell** from `@olonjs/core`.
1.  **The Stage (Canvas):** Isolated Iframe; postMessage for data updates and selection mirroring. Section markup follows **IDAC** (§6); overlay styling follows **TOCC** (§7).
2.  **The Inspector (Sidebar):** Consumes Tenant Zod schemas to generate editors; binding via `data-jp-field` and `data-jp-item-*`.
3.  **The Control Bar:** Save, Export, Add Section.

## 2. State Orchestration & Persistence
*   **Working Draft:** Reactive local state for unsaved changes.
*   **Sync Law:** Inspector changes → Working Draft → Stage via `STUDIO_EVENTS.UPDATE_DRAFTS`.
*   **Bake Protocol:** "Bake HTML" requests snapshot from Iframe, injects `ProjectState` as JSON, triggers download.

## 3. Context Switching (Global vs. Local)
*   **Header/Footer** selection → Global Mode, `site.json`.
*   Any other section → Page Mode, current `[slug].json`.

## 4. Section Lifecycle Management
1.  **Add Section:** Modal from Tenant `SECTION_SCHEMAS`; UUID + default data via **AddSectionConfig** (§9).
2.  **Reorder:** Inspector or Stage Overlay; array mutation in Working Draft.
3.  **Delete:** Confirmation; remove from array, clear selection.

## 5. Stage Isolation & Overlay
*   **CSS Shielding:** Stage in Iframe; Tenant CSS does not leak into Admin.
*   **Sovereign Overlay:** Selection ring and type labels injected per **IDAC** (§6); Tenant styles them per **TOCC** (§7).

## 6. "Green Build" Validation
Studio enforces `tsc && vite build`. No export with TypeScript errors.

## 7. Path-Deterministic Selection & Sidebar Expansion (v1.3, breaking)
*   Section/item focus synchronization uses `itemPath` (root → leaf), not flat `itemField/itemId`.
*   Sidebar expansion state for nested arrays must be derived from all path segments.
*   Flat-only matching may open/close wrong branches and is non-compliant in strict mode.

**Perché servono (JAP):** Stage in iframe + Inspector + Control Bar separano il contesto di editing dal sito; postMessage e Working Draft permettono modifiche senza toccare subito i file. Bake ed Export richiedono uno stato coerente. Global vs Page mode evita confusione su dove si sta editando (site.json vs [slug].json). Add/Reorder/Delete sono gestiti in un solo modo (Working Draft + ASC). Green Build garantisce che ciò che si esporta compili. In v1.3, il path completo elimina ambiguità nella sincronizzazione Stage↔Sidebar su strutture annidate.

---

## Compliance: Legacy vs Full UX (v1.3)

| Dimension | Legacy / Less UX | Full UX (Core-aligned) |
|-----------|-------------------|-------------------------|
| **ICE binding** | No `data-jp-*`; Inspector cannot bind. | IDAC (§6) on every editable section/field/item. |
| **Section wrapper** | Plain `<section>`; no overlay contract. | Core wrapper + overlay; Tenant CSS per TOCC (§7). |
| **Design tokens** | Raw BEM / fixed classes. | Local tokens (§4.4); `var(--local-*)` only. |
| **Base schemas** | Ad hoc. | BSDS (§8): BaseSectionData, BaseArrayItem, BaseSectionSettings. |
| **Add Section** | Ad hoc defaults. | ASC (§9): addableSectionTypes, labels, getDefaultSectionData. |
| **Bootstrap** | Implicit. | JEB (§10): JsonPagesConfig + JsonPagesEngine. |
| **Selection payload** | Flat `itemField/itemId`. | Path-only `itemPath: SelectionPath` (JEB §10.3). |
| **Nested array expansion** | Single-segment or field-only heuristics. | Root-to-leaf path expansion (ECIP §5.5, JAP §7). |
| **Array item identity (strict)** | Index fallback tolerated. | Stable `id` required for editable object arrays. |

**Rule:** Every page section (non-header/footer) that appears in the Stage and in `SECTION_SCHEMAS` must comply with §6, §7, §4.4, §8, §9, §10 for full Studio UX.

---

## Summary of v1.3 Additions

| § | Title | Purpose |
|---|--------|--------|
| 5.5 | Path-Only Nested Selection & Expansion | ECIP: root→leaf `SelectionPath`; remove flat matching in strict mode. |
| 6.5 | Strict Path Extraction for Nested Arrays | IDAC: path-based nested targeting; no strict flat fallback. |
| 10.3 | Studio Selection Event Contract | JEB: `SECTION_SELECT` uses `itemPath`; remove `itemField/itemId`. |
| JAP §7 | Path-Deterministic Selection & Sidebar Expansion | Studio state synchronization for nested arrays. |
| Compliance | Legacy vs Full UX (v1.3) | Explicit breaking delta for flat protocol removal and strict IDs. |
| **Appendix A.6** | **v1.3 Path/Nested Strictness Addendum** | Type/export and migration checklist for path-only protocol. |

---

# Appendix A — Tenant Type & Code-Generation Annex

**Objective:** Make the specification **sufficient** to generate or audit a full tenant (new site, new components, new data) without a reference codebase. Defines TypeScript types, JSON shapes, schema contract, file paths, and integration pattern.

**Status:** Mandatory for code-generation and governance. Compliance ensures generated tenants are typed and wired like the reference implementation.

---

## A.1 Core-Provided Types (from `@olonjs/core`)

The following are assumed to be exported by Core. The Tenant augments **SectionDataRegistry** and **SectionSettingsRegistry**; all other types are consumed as-is.

| Type | Description |
|------|-------------|
| **SectionType** | `keyof SectionDataRegistry` (after Tenant augmentation). Union of all section type keys. |
| **Section** | Union of `BaseSection<K>` for all K in SectionDataRegistry. See MTRP §1.2. |
| **BaseSectionSettings** | Optional base type for section settings (may align with BSDS §8.3). |
| **MenuItem** | Navigation item. **Minimum shape:** `{ label: string; href: string }`. Core may extend (e.g. `children?: MenuItem[]`). |
| **AddSectionConfig** | See §9. |
| **JsonPagesConfig** | See §10.1. |

**Perché servono (A.1):** Il Tenant deve conoscere i tipi esportati dal Core (SectionType, MenuItem, AddSectionConfig, JsonPagesConfig) per tipizzare registry, config e augmentation senza dipendere da implementazioni interne.

---

## A.2 Tenant-Provided Types (single source: `src/types.ts` or equivalent)

The Tenant **must** define the following in one module (e.g. **`src/types.ts`**). This module **must** perform the **module augmentation** of `@olonjs/core` for **SectionDataRegistry** and **SectionSettingsRegistry**, and **must** export **SectionComponentPropsMap** and re-export from `@olonjs/core` so that **SectionType** is available after augmentation.

### A.2.1 SectionComponentPropsMap

Maps each section type to the props of its React component. **Header** is the only type that receives **menu**.

**Option A — Explicit (recommended for clarity and tooling):** For each section type K, add one entry. Header receives **menu**.

```typescript
import type { MenuItem } from '@olonjs/core';
// Import Data/Settings from each capsule.

export type SectionComponentPropsMap = {
  'header': { data: HeaderData; settings?: HeaderSettings; menu: MenuItem[] };
  'footer': { data: FooterData; settings?: FooterSettings };
  'hero': { data: HeroData; settings?: HeroSettings };
  // ... one entry per SectionType, e.g. 'feature-grid', 'cta-banner', etc.
};
```

**Option B — Mapped type (DRY, requires SectionDataRegistry/SectionSettingsRegistry in scope):**

```typescript
import type { MenuItem } from '@olonjs/core';

export type SectionComponentPropsMap = {
  [K in SectionType]: K extends 'header'
    ? { data: SectionDataRegistry[K]; settings?: SectionSettingsRegistry[K]; menu: MenuItem[] }
    : { data: SectionDataRegistry[K]; settings?: K extends keyof SectionSettingsRegistry ? SectionSettingsRegistry[K] : BaseSectionSettings };
};
```

SectionType is imported from Core (after Tenant augmentation). In practice Option A is the reference pattern; Option B is valid if the Tenant prefers a single derived definition.

**Perché servono (A.2):** SectionComponentPropsMap e i tipi di config (PageConfig, SiteConfig, MenuConfig, ThemeConfig) definiscono il contratto tra dati (JSON, API) e componente; l’augmentation è l’unico modo per estendere i registry del Core senza fork. Senza questi tipi, generazione tenant e refactor sarebbero senza guida e il type-check fallirebbe.

### A.2.2 ComponentRegistry type

The registry object **must** be typed as:

```typescript
import type { SectionType } from '@olonjs/core';
import type { SectionComponentPropsMap } from '@/types';

export const ComponentRegistry: {
  [K in SectionType]: React.FC<SectionComponentPropsMap[K]>;
} = { /* ... */ };
```

File: **`src/lib/ComponentRegistry.tsx`** (or equivalent). Imports one View per section type and assigns it to the corresponding key.

### A.2.3 PageConfig

Minimum shape for a single page (used in **pages** and in each **`[slug].json`**):

```typescript
export interface PageConfig {
  id?: string;
  slug: string;
  meta?: {
    title?: string;
    description?: string;
  };
  sections: Section[];
}
```

**Section** is the union type from MTRP (§1.2). Each element of **sections** has **id**, **type**, **data**, **settings** and conforms to the capsule schemas.

### A.2.4 SiteConfig

Minimum shape for **site.json** (and for **siteConfig** in JsonPagesConfig):

```typescript
export interface SiteConfigIdentity {
  title?: string;
  logoUrl?: string;
}

export interface SiteConfig {
  identity?: SiteConfigIdentity;
  pages?: Array<{ slug: string; label: string }>;
  header: {
    id: string;
    type: 'header';
    data: HeaderData;
    settings?: HeaderSettings;
  };
  footer: {
    id: string;
    type: 'footer';
    data: FooterData;
    settings?: FooterSettings;
  };
}
```

**HeaderData**, **FooterData**, **HeaderSettings**, **FooterSettings** are the types exported from the header and footer capsules.

### A.2.5 MenuConfig

Minimum shape for **menu.json** (and for **menuConfig** in JsonPagesConfig). Structure is tenant-defined; Core expects the header to receive **MenuItem[]**. Common pattern: an object with a key (e.g. **main**) whose value is **MenuItem[]**.

```typescript
export interface MenuConfig {
  main?: MenuItem[];
  [key: string]: MenuItem[] | undefined;
}
```

Or simply **`MenuItem[]`** if the app uses a single flat list. The Tenant must ensure that the value passed to the header component as **menu** conforms to **MenuItem[]** (e.g. `menuConfig.main` or `menuConfig` if it is the array).

### A.2.6 ThemeConfig

Minimum shape for **theme.json** (and for **themeConfig** in JsonPagesConfig). Tenant-defined; typically tokens for colors, typography, radius.

```typescript
export interface ThemeConfig {
  name?: string;
  tokens?: {
    colors?: Record<string, string>;
    typography?: Record<string, string | Record<string, string>>;
    borderRadius?: Record<string, string>;
  };
  [key: string]: unknown;
}
```

---

## A.3 Schema Contract (SECTION_SCHEMAS)

**Location:** **`src/lib/schemas.ts`** (or equivalent).

**Contract:**
*   **SECTION_SCHEMAS** is a **single object** whose keys are **SectionType** and whose values are **Zod schemas for the section data** (not settings, unless the Form Factory contract expects a combined or per-type settings schema; then each value may be the data schema only, and settings may be defined per capsule and aggregated elsewhere if needed).
*   The Tenant **must** re-export **BaseSectionData**, **BaseArrayItem**, and optionally **BaseSectionSettingsSchema** from **`src/lib/base-schemas.ts`** (or equivalent). Each capsule’s data schema **must** extend BaseSectionData; each array item schema **must** extend or include BaseArrayItem.
*   **SECTION_SCHEMAS** is typed as **`Record<SectionType, ZodType>`** or **`{ [K in SectionType]: ZodType }`** so that keys match the registry and SectionDataRegistry.

**Export:** The app imports **SECTION_SCHEMAS** and passes it as **config.schemas** to JsonPagesEngine. The Form Factory traverses these schemas to build editors.

**Perché servono (A.3):** Un unico oggetto SECTION_SCHEMAS con chiavi = SectionType e valori = schema data permette al Form Factory di costruire form per tipo senza convenzioni ad hoc; i base schema garantiscono anchorId e id su item. Senza questo contratto, l’Inspector non saprebbe quali campi mostrare né come validare.

---

## A.4 File Paths & Data Layout

| Purpose | Path (conventional) | Description |
|---------|---------------------|-------------|
| Site config | **`src/data/config/site.json`** | SiteConfig (identity, header, footer, pages list). |
| Menu config | **`src/data/config/menu.json`** | MenuConfig (e.g. main nav). |
| Theme config | **`src/data/config/theme.json`** | ThemeConfig (tokens). |
| Page data | **`src/data/pages/<slug>.json`** | One file per page; content is PageConfig (slug, meta, sections). |
| Base schemas | **`src/lib/base-schemas.ts`** | BaseSectionData, BaseArrayItem, BaseSectionSettingsSchema. |
| Schema aggregate | **`src/lib/schemas.ts`** | SECTION_SCHEMAS; re-exports base schemas. |
| Registry | **`src/lib/ComponentRegistry.tsx`** | ComponentRegistry object. |
| Add-section config | **`src/lib/addSectionConfig.ts`** | addSectionConfig (AddSectionConfig). |
| Tenant types & augmentation | **`src/types.ts`** | SectionComponentPropsMap, PageConfig, SiteConfig, MenuConfig, ThemeConfig; **declare module '@olonjs/core'** for SectionDataRegistry and SectionSettingsRegistry; re-export from Core. |
| Bootstrap | **`src/App.tsx`** | Imports config (site, theme, menu, pages), registry, schemas, addSection, themeCss; builds JsonPagesConfig; renders **<JsonPagesEngine config={config} />**. |

The app entry (e.g. **main.tsx**) renders **App**. No other bootstrap contract is specified; the Tenant may use Vite aliases (e.g. **@/**) for the paths above.

**Perché servono (A.4):** Path fissi (data/config, data/pages, lib/schemas, types.ts, App.tsx) permettono a CLI, tooling e agenti di trovare sempre gli stessi file; l’onboarding e la generazione da spec sono deterministici. Senza convenzione, ogni tenant sarebbe una struttura diversa.

---

## A.5 Integration Checklist (Code-Generation)

When generating or auditing a tenant, ensure the following in order:

1. **Capsules** — For each section type, create **`src/components/<type>/`** with View.tsx, schema.ts, types.ts, index.ts. Data schema extends BaseSectionData; array items extend BaseArrayItem; View complies with CIP and IDAC (§6.2–6.3 for non-reserved types).
2. **Base schemas** — **src/lib/base-schemas.ts** exports BaseSectionData, BaseArrayItem, BaseSectionSettingsSchema (and optional CtaSchema or similar shared fragments).
3. **types.ts** — Define SectionComponentPropsMap (header with **menu**), PageConfig, SiteConfig, MenuConfig, ThemeConfig; **declare module '@olonjs/core'** and augment SectionDataRegistry and SectionSettingsRegistry; re-export from `@olonjs/core`.
4. **ComponentRegistry** — Import every View; build object **{ [K in SectionType]: ViewComponent }**; type as **{ [K in SectionType]: React.FC<SectionComponentPropsMap[K]> }**.
5. **schemas.ts** — Import base schemas and each capsule’s data schema; export SECTION_SCHEMAS as **{ [K in SectionType]: SchemaK }**; export SectionType as **keyof typeof SECTION_SCHEMAS** if not using Core’s SectionType.
6. **addSectionConfig** — addableSectionTypes, sectionTypeLabels, getDefaultSectionData; export as AddSectionConfig.
7. **App.tsx** — Import site, theme, menu, pages from data paths; build config (tenantId, registry, schemas, pages, siteConfig, themeConfig, menuConfig, themeCss: { tenant }, addSection); render JsonPagesEngine.
8. **Data files** — Create or update site.json, menu.json, theme.json, and one or more **<slug>.json** under the paths in A.4. Ensure JSON shapes match SiteConfig, MenuConfig, ThemeConfig, PageConfig.
9. **Tenant CSS** — Include TOCC (§7) selectors in global CSS so the Stage overlay is visible.
10. **Reserved types** — Header and footer capsules receive props per SectionComponentPropsMap; menu is populated from menuConfig (e.g. menuConfig.main) when building the config or inside Core when rendering the header.

**Perché servono (A.5):** La checklist in ordine evita di dimenticare passi (es. augmentation prima del registry, TOCC dopo le View) e rende la spec sufficiente per generare o verificare un tenant senza codebase di riferimento.

---

## A.6 v1.3 Path/Nested Strictness Addendum (breaking)

This addendum extends Appendix A without removing prior v1.2 obligations:

1. **Type exports** — Core and/or shared types module should expose `SelectionPathSegment` and `SelectionPath` for Studio messaging and Inspector expansion logic.
2. **Protocol migration** — Replace flat payload fields `itemField` / `itemId` with `itemPath?: SelectionPath` in strict v1.3 channels.
3. **Nested array compliance** — For editable object arrays, item identity must be stable (`id`) and propagated to DOM attributes (`data-jp-item-id`), schema items (BaseArrayItem), and selection path segments (`itemId` when segment targets array item).
4. **Backward compatibility policy** — Legacy flat fields may exist only in transitional adapters outside strict mode; normative v1.3 contract is path-only.

---

**Validation:** Align with current `@olonjs/core` exports (SectionType, MenuItem, AddSectionConfig, JsonPagesConfig, and in v1.3 path types for Studio selection).  
**Distribution:** Core via `.yalc`; tenant projections via `@olonjs/cli`. This annex makes the spec **necessary and sufficient** for tenant code-generation and governance at enterprise grade.

END_OF_FILE_CONTENT
mkdir -p "src"
echo "Creating src/App.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/App.tsx"
/**
 * Thin Entry Point (Tenant).
 * Data from getHydratedData (file-backed or draft); assets from public/assets/images.
 * Supports Hybrid Persistence: Local Filesystem (Dev) or Cloud Bridge (Prod).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { JsonPagesEngine } from '@olonjs/core';
import type { JsonPagesConfig, LibraryImageEntry, ProjectState } from '@olonjs/core';
import { ComponentRegistry } from '@/lib/ComponentRegistry';
import { SECTION_SCHEMAS } from '@/lib/schemas';
import { addSectionConfig } from '@/lib/addSectionConfig';
import { getHydratedData } from '@/lib/draftStorage';
import type { SiteConfig, ThemeConfig, MenuConfig, PageConfig } from '@/types';
import type { DeployPhase, StepId } from '@/types/deploy';
import { DEPLOY_STEPS } from '@/lib/deploySteps';
import { startCloudSaveStream } from '@/lib/cloudSaveStream';
import siteData from '@/data/config/site.json';
import themeData from '@/data/config/theme.json';
import menuData from '@/data/config/menu.json';
import { getFilePages } from '@/lib/getFilePages';
import { DopaDrawer } from '@/components/save-drawer/DopaDrawer';
import { Skeleton } from '@/components/ui/skeleton';
import { ThemeProvider } from '@/components/ThemeProvider';

import tenantCss from './index.css?inline';

// Cloud Configuration (Injected by Vercel/Netlify Env Vars)
const CLOUD_API_URL =
  import.meta.env.VITE_OLONJS_CLOUD_URL ?? import.meta.env.VITE_JSONPAGES_CLOUD_URL;
const CLOUD_API_KEY =
  import.meta.env.VITE_OLONJS_API_KEY ?? import.meta.env.VITE_JSONPAGES_API_KEY;

const themeConfig = themeData as unknown as ThemeConfig;
const menuConfig = menuData as unknown as MenuConfig;
const TENANT_ID = 'alpha';

const filePages = getFilePages();
const fileSiteConfig = siteData as unknown as SiteConfig;
const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;
const ASSET_UPLOAD_MAX_RETRIES = 2;
const ASSET_UPLOAD_TIMEOUT_MS = 20_000;
const ALLOWED_IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']);

interface CloudSaveUiState {
  isOpen: boolean;
  phase: DeployPhase;
  currentStepId: StepId | null;
  doneSteps: StepId[];
  progress: number;
  errorMessage?: string;
  deployUrl?: string;
}

type ContentMode = 'cloud' | 'error';
type ContentStatus = 'ok' | 'empty_namespace' | 'legacy_fallback';

type ContentResponse = {
  ok?: boolean;
  siteConfig?: unknown;
  pages?: unknown;
  items?: unknown;
  error?: string;
  code?: string;
  correlationId?: string;
  contentStatus?: ContentStatus;
  usedUnscopedFallback?: boolean;
  namespace?: string;
  namespaceMatchedKeys?: number;
};

type CachedCloudContent = {
  keyFingerprint: string;
  savedAt: number;
  siteConfig: unknown | null;
  pages: Record<string, unknown>;
};

const CLOUD_CACHE_KEY = 'jp_cloud_content_cache_v1';
const CLOUD_CACHE_TTL_MS = 5 * 60 * 1000;

function normalizeApiBase(raw: string): string {
  return raw.trim().replace(/\/+$/, '');
}

function buildApiCandidates(raw: string): string[] {
  const base = normalizeApiBase(raw);
  const withApi = /\/api\/v1$/i.test(base) ? base : `${base}/api/v1`;
  const candidates = [withApi, base];
  return Array.from(new Set(candidates.filter(Boolean)));
}

function getInitialData() {
  return getHydratedData(TENANT_ID, filePages, fileSiteConfig);
}

function getInitialCloudSaveUiState(): CloudSaveUiState {
  return {
    isOpen: false,
    phase: 'idle',
    currentStepId: null,
    doneSteps: [],
    progress: 0,
  };
}

function stepProgress(doneSteps: StepId[]): number {
  return Math.round((doneSteps.length / DEPLOY_STEPS.length) * 100);
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function asString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

function normalizeRouteSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9/_-]/g, '-')
    .replace(/^\/+|\/+$/g, '') || 'home';
}

function coercePageConfig(slug: string, value: unknown): PageConfig | null {
  let input = value;
  if (typeof input === 'string') {
    try {
      input = JSON.parse(input) as unknown;
    } catch {
      return null;
    }
  }
  if (!isObjectRecord(input) || !Array.isArray(input.sections)) return null;

  const inputMeta = isObjectRecord(input.meta) ? input.meta : {};
  const normalizedSlug = asString(input.slug, slug);
  const normalizedId = asString(input.id, `${normalizedSlug}-page`);
  const title = asString(inputMeta.title, normalizedSlug);
  const description = asString(inputMeta.description, '');

  return {
    id: normalizedId,
    slug: normalizedSlug,
    meta: { title, description },
    sections: input.sections as PageConfig['sections'],
    ...(typeof input['global-header'] === 'boolean' ? { 'global-header': input['global-header'] } : {}),
  };
}

function coerceSiteConfig(value: unknown): SiteConfig | null {
  let input = value;
  if (typeof input === 'string') {
    try {
      input = JSON.parse(input) as unknown;
    } catch {
      return null;
    }
  }
  if (!isObjectRecord(input)) return null;
  if (!isObjectRecord(input.identity)) return null;
  if (!Array.isArray(input.pages)) return null;

  return input as unknown as SiteConfig;
}

function toPagesRecord(value: unknown): Record<string, PageConfig> | null {
  const directPage = coercePageConfig('home', value);
  if (directPage) {
    const directSlug = normalizeRouteSlug(asString(directPage.slug, 'home'));
    return { [directSlug]: { ...directPage, slug: directSlug } };
  }

  if (!isObjectRecord(value)) return null;
  const next: Record<string, PageConfig> = {};
  for (const [rawKey, payload] of Object.entries(value)) {
    const rawKeyTrimmed = rawKey.trim();
    const slugFromNamespacedKey = rawKeyTrimmed.match(/^t_[a-z0-9-]+_page_(.+)$/i)?.[1];
    const slug = normalizeRouteSlug(slugFromNamespacedKey ?? rawKeyTrimmed);
    const page = coercePageConfig(slug, payload);
    if (!page) continue;
    next[slug] = { ...page, slug };
  }
  return next;
}

function normalizePageRegistry(value: unknown): Record<string, PageConfig> {
  if (!isObjectRecord(value)) return {};
  const normalized: Record<string, PageConfig> = {};

  for (const [registrySlug, rawPageValue] of Object.entries(value)) {
    const canonicalSlug = normalizeRouteSlug(registrySlug);
    const direct = coercePageConfig(canonicalSlug, rawPageValue);
    if (direct) {
      // Canonical key comes from registry/path, not from page JSON internal slug.
      normalized[canonicalSlug] = { ...direct, slug: canonicalSlug };
      continue;
    }

    const nested = toPagesRecord(rawPageValue);
    if (nested && Object.keys(nested).length > 0) {
      Object.assign(normalized, nested);
    }
  }

  return normalized;
}

function extractContentSources(payload: ContentResponse | Record<string, unknown>): {
  pagesSource: unknown;
  siteSource: unknown;
} {
  // Canonical contract: { pages, siteConfig }
  if (isObjectRecord(payload) && isObjectRecord(payload.pages)) {
    return { pagesSource: payload.pages, siteSource: payload.siteConfig };
  }

  // Edge public JSON contract: { digest, updatedAt, items: { ... } }
  if (isObjectRecord(payload) && isObjectRecord(payload.items)) {
    const items = payload.items;
    let siteSource: unknown = null;
    const pageEntries: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(items)) {
      if (/(_config_site|config_site|config:site)$/i.test(key)) {
        siteSource = value;
        continue;
      }
      if (/(_page_|^page_|page:)/i.test(key)) {
        pageEntries[key] = value;
      }
    }
    return { pagesSource: pageEntries, siteSource };
  }

  // Raw map fallback: treat payload object itself as page map.
  return { pagesSource: payload, siteSource: null };
}

type CloudLoadFailure = {
  reasonCode: string;
  message: string;
  correlationId?: string;
};

function isCloudLoadFailure(value: unknown): value is CloudLoadFailure {
  return (
    isObjectRecord(value) &&
    typeof value.reasonCode === 'string' &&
    typeof value.message === 'string'
  );
}

function toCloudLoadFailure(value: unknown): CloudLoadFailure {
  if (isCloudLoadFailure(value)) return value;
  if (value instanceof Error) {
    return { reasonCode: 'CLOUD_LOAD_FAILED', message: value.message };
  }
  return { reasonCode: 'CLOUD_LOAD_FAILED', message: 'Cloud content unavailable.' };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableStatus(status: number): boolean {
  return status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
}

function backoffDelayMs(attempt: number): number {
  const base = 250 * Math.pow(2, attempt);
  const jitter = Math.floor(Math.random() * 120);
  return base + jitter;
}

function logBootstrapEvent(event: string, details: Record<string, unknown>) {
  console.info('[boot]', { event, at: new Date().toISOString(), ...details });
}

function cloudFingerprint(apiBase: string, apiKey: string): string {
  return `${normalizeApiBase(apiBase)}::${apiKey.slice(-8)}`;
}

function normalizeSlugForCache(slug: string): string {
  return (
    slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9/_-]/g, '-')
      .replace(/^\/+|\/+$/g, '') || 'home'
  );
}

function readCachedCloudContent(fingerprint: string): CachedCloudContent | null {
  try {
    const raw = localStorage.getItem(CLOUD_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedCloudContent;
    if (!parsed || parsed.keyFingerprint !== fingerprint) return null;
    if (!parsed.savedAt || Date.now() - parsed.savedAt > CLOUD_CACHE_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCachedCloudContent(entry: CachedCloudContent): void {
  try {
    localStorage.setItem(CLOUD_CACHE_KEY, JSON.stringify(entry));
  } catch {
    // non-blocking cache path
  }
}

function buildThemeFontVarsCss(input: unknown): string {
  if (!isObjectRecord(input)) return '';
  const tokens = isObjectRecord(input.tokens) ? input.tokens : null;
  const typography = tokens && isObjectRecord(tokens.typography) ? tokens.typography : null;
  const fontFamily = typography && isObjectRecord(typography.fontFamily) ? typography.fontFamily : null;
  const primary = typeof fontFamily?.primary === 'string' ? fontFamily.primary : "'Instrument Sans', system-ui, sans-serif";
  const serif = typeof fontFamily?.serif === 'string' ? fontFamily.serif : "'Instrument Serif', Georgia, serif";
  const mono = typeof fontFamily?.mono === 'string' ? fontFamily.mono : "'JetBrains Mono', monospace";
  return `:root{--theme-font-primary:${primary};--theme-font-serif:${serif};--theme-font-mono:${mono};}`;
}

function setTenantPreviewReady(ready: boolean): void {
  if (typeof window !== 'undefined') {
    (window as Window & { __TENANT_PREVIEW_READY__?: boolean }).__TENANT_PREVIEW_READY__ = ready;
  }
  if (typeof document !== 'undefined' && document.body) {
    document.body.dataset.previewReady = ready ? '1' : '0';
  }
}

function App() {
  const isCloudMode = Boolean(CLOUD_API_URL && CLOUD_API_KEY);
  const localInitialData = useMemo(() => (isCloudMode ? null : getInitialData()), [isCloudMode]);
  const localInitialPages = useMemo(() => {
    if (!localInitialData) return {};
    const normalized = normalizePageRegistry(localInitialData.pages as unknown);
    return Object.keys(normalized).length > 0 ? normalized : localInitialData.pages;
  }, [localInitialData]);
  const [pages, setPages] = useState<Record<string, PageConfig>>(localInitialPages);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(
    localInitialData?.siteConfig ?? fileSiteConfig
  );
  const [assetsManifest, setAssetsManifest] = useState<LibraryImageEntry[]>([]);
  const [cloudSaveUi, setCloudSaveUi] = useState<CloudSaveUiState>(getInitialCloudSaveUiState);
  const [contentMode, setContentMode] = useState<ContentMode>('cloud');
  const [contentFallback, setContentFallback] = useState<CloudLoadFailure | null>(null);
  const [showTopProgress, setShowTopProgress] = useState(false);
  const [hasInitialCloudResolved, setHasInitialCloudResolved] = useState(!isCloudMode);
  const [bootstrapRunId, setBootstrapRunId] = useState(0);
  const activeCloudSaveController = useRef<AbortController | null>(null);
  const contentLoadInFlight = useRef<Promise<void> | null>(null);
  const pendingCloudSave = useRef<{ state: ProjectState; slug: string } | null>(null);
  const cloudApiCandidates = useMemo(
    () => (isCloudMode && CLOUD_API_URL ? buildApiCandidates(CLOUD_API_URL) : []),
    [isCloudMode, CLOUD_API_URL]
  );

  const loadAssetsManifest = useCallback(async (): Promise<void> => {
    if (isCloudMode && CLOUD_API_URL && CLOUD_API_KEY) {
      const apiBases = cloudApiCandidates.length > 0 ? cloudApiCandidates : [normalizeApiBase(CLOUD_API_URL)];
      for (const apiBase of apiBases) {
        try {
          const res = await fetch(`${apiBase}/assets/list?limit=200`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${CLOUD_API_KEY}`,
            },
          });
          const body = (await res.json().catch(() => ({}))) as { items?: LibraryImageEntry[] };
          if (!res.ok) continue;
          const items = Array.isArray(body.items) ? body.items : [];
          setAssetsManifest(items);
          return;
        } catch {
          // try next candidate
        }
      }
      setAssetsManifest([]);
      return;
    }

    fetch('/api/list-assets')
      .then((r) => (r.ok ? r.json() : []))
      .then((list: LibraryImageEntry[]) => setAssetsManifest(Array.isArray(list) ? list : []))
      .catch(() => setAssetsManifest([]));
  }, [isCloudMode, CLOUD_API_URL, CLOUD_API_KEY, cloudApiCandidates]);

  useEffect(() => {
    void loadAssetsManifest();
  }, [loadAssetsManifest]);

  useEffect(() => {
    return () => {
      activeCloudSaveController.current?.abort();
    };
  }, []);

  useEffect(() => {
    setTenantPreviewReady(false);
    return () => {
      setTenantPreviewReady(false);
    };
  }, []);

  useEffect(() => {
    if (!isCloudMode || !CLOUD_API_URL || !CLOUD_API_KEY) {
      setContentMode('cloud');
      setContentFallback(null);
      setShowTopProgress(false);
      setHasInitialCloudResolved(true);
      logBootstrapEvent('boot.local.ready', { mode: 'local' });
      return;
    }
    if (contentLoadInFlight.current) {
      return;
    }

    const controller = new AbortController();
    const maxRetryAttempts = 2;
    const startedAt = Date.now();
    const primaryApiBase = cloudApiCandidates[0] ?? normalizeApiBase(CLOUD_API_URL);
    const fingerprint = cloudFingerprint(primaryApiBase, CLOUD_API_KEY);
    const cached = readCachedCloudContent(fingerprint);
    const cachedPages = cached ? toPagesRecord(cached.pages) : null;
    const cachedSite = cached ? coerceSiteConfig(cached.siteConfig) : null;
    const hasCachedFallback = Boolean((cachedPages && Object.keys(cachedPages).length > 0) || cachedSite);
    if (cached) {
      logBootstrapEvent('boot.cloud.cache_hit', { ageMs: Date.now() - cached.savedAt });
    }
    setContentMode('cloud');
    setContentFallback(null);
    setShowTopProgress(true);
    setHasInitialCloudResolved(false);
    logBootstrapEvent('boot.start', { mode: 'cloud', apiCandidates: cloudApiCandidates.length });

    const loadCloudContent = async () => {
      try {
        let payload: ContentResponse | null = null;
        let lastFailure: CloudLoadFailure | null = null;

        for (const apiBase of cloudApiCandidates) {
          for (let attempt = 0; attempt <= maxRetryAttempts; attempt += 1) {
            try {
              const res = await fetch(`${apiBase}/content`, {
                method: 'GET',
                cache: 'no-store',
                headers: {
                  Authorization: `Bearer ${CLOUD_API_KEY}`,
                },
                signal: controller.signal,
              });

              const contentType = (res.headers.get('content-type') || '').toLowerCase();
              if (!contentType.includes('application/json')) {
                lastFailure = {
                  reasonCode: 'NON_JSON_RESPONSE',
                  message: `Non-JSON response from ${apiBase}/content`,
                };
                break;
              }

              const parsed = (await res.json().catch(() => ({}))) as ContentResponse;
              if (!res.ok) {
                lastFailure = {
                  reasonCode: parsed.code || `HTTP_${res.status}`,
                  message: parsed.error || `Cloud content read failed: ${res.status} (${apiBase}/content)`,
                  correlationId: parsed.correlationId,
                };
                if (isRetryableStatus(res.status) && attempt < maxRetryAttempts) {
                  await sleep(backoffDelayMs(attempt));
                  continue;
                }
                break;
              }

              payload = parsed;
              break;
            } catch (error: unknown) {
              if (controller.signal.aborted) throw error;
              const message = error instanceof Error ? error.message : 'Network error';
              lastFailure = {
                reasonCode: 'NETWORK_TRANSIENT',
                message: `${message} (${apiBase}/content)`,
              };
              if (attempt < maxRetryAttempts) {
                await sleep(backoffDelayMs(attempt));
                continue;
              }
            }
          }
          if (payload) {
            break;
          }
        }

        if (!payload) {
          throw (
            lastFailure || {
              reasonCode: 'CLOUD_ENDPOINT_UNREACHABLE',
              message: 'Cloud content endpoint not reachable as JSON.',
            }
          );
        }

        const { pagesSource, siteSource } = extractContentSources(payload);
        const remotePages = toPagesRecord(pagesSource);
        const remoteSite = coerceSiteConfig(siteSource);
        const remotePageCount = remotePages ? Object.keys(remotePages).length : 0;
        if (remotePageCount === 0 && !remoteSite) {
          throw {
            reasonCode: payload.contentStatus === 'empty_namespace' ? 'EMPTY_NAMESPACE' : 'EMPTY_PAYLOAD',
            message: 'Cloud payload is empty for this tenant namespace.',
            correlationId: payload.correlationId,
          } satisfies CloudLoadFailure;
        }
        if (import.meta.env.DEV) {
          console.info('[content] cloud diagnostics', {
            contentStatus: payload.contentStatus ?? 'ok',
            namespace: payload.namespace,
            namespaceMatchedKeys: payload.namespaceMatchedKeys,
            usedUnscopedFallback: payload.usedUnscopedFallback,
            correlationId: payload.correlationId,
          });
        }
        if (remotePages && remotePageCount > 0) {
          setPages(remotePages);
        }
        if (remoteSite) {
          setSiteConfig(remoteSite);
        }
        writeCachedCloudContent({
          keyFingerprint: fingerprint,
          savedAt: Date.now(),
          siteConfig: remoteSite ?? null,
          pages: (remotePages ?? {}) as Record<string, unknown>,
        });
        setContentMode('cloud');
        setContentFallback(null);
        setHasInitialCloudResolved(true);
        logBootstrapEvent('boot.cloud.success', {
          mode: 'cloud',
          elapsedMs: Date.now() - startedAt,
          contentStatus: payload.contentStatus ?? 'ok',
          correlationId: payload.correlationId ?? null,
        });
      } catch (error: unknown) {
        if (controller.signal.aborted) return;
        const failure = toCloudLoadFailure(error);
        if (hasCachedFallback) {
          if (cachedPages && Object.keys(cachedPages).length > 0) {
            setPages(cachedPages);
          }
          if (cachedSite) {
            setSiteConfig(cachedSite);
          }
          setContentMode('cloud');
          setContentFallback({
            reasonCode: 'CLOUD_REFRESH_FAILED',
            message: failure.message,
            correlationId: failure.correlationId,
          });
          setHasInitialCloudResolved(true);
        } else {
          setContentMode('error');
          setContentFallback(failure);
          setHasInitialCloudResolved(true);
        }
        logBootstrapEvent('boot.cloud.error', {
          mode: 'cloud',
          elapsedMs: Date.now() - startedAt,
          reasonCode: failure.reasonCode,
          correlationId: failure.correlationId ?? null,
        });
      }
    };

    let inFlight: Promise<void> | null = null;
    inFlight = loadCloudContent().finally(() => {
      setShowTopProgress(false);
      if (contentLoadInFlight.current === inFlight) {
        contentLoadInFlight.current = null;
      }
    });
    contentLoadInFlight.current = inFlight;
    return () => controller.abort();
  }, [isCloudMode, CLOUD_API_KEY, CLOUD_API_URL, cloudApiCandidates, bootstrapRunId]);

  const runCloudSave = useCallback(
    async (
      payload: { state: ProjectState; slug: string },
      rejectOnError: boolean
    ): Promise<void> => {
      if (!CLOUD_API_URL || !CLOUD_API_KEY) {
        const noCloudError = new Error('Cloud mode is not configured.');
        if (rejectOnError) throw noCloudError;
        return;
      }

      pendingCloudSave.current = payload;
      activeCloudSaveController.current?.abort();
      const controller = new AbortController();
      activeCloudSaveController.current = controller;

      setCloudSaveUi({
        isOpen: true,
        phase: 'running',
        currentStepId: null,
        doneSteps: [],
        progress: 0,
      });

      try {
        await startCloudSaveStream({
          apiBaseUrl: CLOUD_API_URL,
          apiKey: CLOUD_API_KEY,
          path: `src/data/pages/${payload.slug}.json`,
          content: payload.state.page,
          message: `Content update for ${payload.slug} via Visual Editor`,
          signal: controller.signal,
          onStep: (event) => {
            setCloudSaveUi((prev) => {
              if (event.status === 'running') {
                return {
                  ...prev,
                  isOpen: true,
                  phase: 'running',
                  currentStepId: event.id,
                  errorMessage: undefined,
                };
              }

              if (prev.doneSteps.includes(event.id)) {
                return prev;
              }

              const nextDone = [...prev.doneSteps, event.id];
              return {
                ...prev,
                isOpen: true,
                phase: 'running',
                currentStepId: event.id,
                doneSteps: nextDone,
                progress: stepProgress(nextDone),
              };
            });
          },
          onDone: (event) => {
            const completed = DEPLOY_STEPS.map((step) => step.id);
            setCloudSaveUi({
              isOpen: true,
              phase: 'done',
              currentStepId: 'live',
              doneSteps: completed,
              progress: 100,
              deployUrl: event.deployUrl,
            });
          },
        });
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Cloud save failed.';
        setCloudSaveUi((prev) => ({
          ...prev,
          isOpen: true,
          phase: 'error',
          errorMessage: message,
        }));
        if (rejectOnError) throw new Error(message);
      } finally {
        if (activeCloudSaveController.current === controller) {
          activeCloudSaveController.current = null;
        }
      }
    },
    []
  );

  const closeCloudDrawer = useCallback(() => {
    setCloudSaveUi(getInitialCloudSaveUiState());
  }, []);

  const retryCloudSave = useCallback(() => {
    if (!pendingCloudSave.current) return;
    void runCloudSave(pendingCloudSave.current, false);
  }, [runCloudSave]);

  const config: JsonPagesConfig = {
    tenantId: TENANT_ID,
    registry: ComponentRegistry as JsonPagesConfig['registry'],
    schemas: SECTION_SCHEMAS as unknown as JsonPagesConfig['schemas'],
    pages,
    siteConfig,
    themeConfig,
    menuConfig,
    themeCss: { tenant: `${buildThemeFontVarsCss(themeConfig)}\n${tenantCss}` },
    addSection: addSectionConfig,
    persistence: {
      async saveToFile(state: ProjectState, slug: string): Promise<void> {
        // 💻 LOCAL FILESYSTEM (Development / legacy fallback)
        console.log(`💻 Saving ${slug} to Local Filesystem...`);
        const res = await fetch('/api/save-to-file', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectState: state, slug }),
        });
        
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        if (!res.ok) throw new Error(body.error ?? `Save to file failed: ${res.status}`);
      },
      async hotSave(state: ProjectState, slug: string): Promise<void> {
        if (!isCloudMode || !CLOUD_API_URL || !CLOUD_API_KEY) {
          throw new Error('Cloud mode is not configured for hot save.');
        }
        const apiBase = CLOUD_API_URL.replace(/\/$/, '');
        const res = await fetch(`${apiBase}/hotSave`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CLOUD_API_KEY}`,
          },
          body: JSON.stringify({
            slug,
            page: state.page,
            siteConfig: state.site,
          }),
        });
        const body = (await res.json().catch(() => ({}))) as { error?: string; code?: string };
        if (!res.ok) {
          throw new Error(body.error || body.code || `Hot save failed: ${res.status}`);
        }
        const keyFingerprint = cloudFingerprint(apiBase, CLOUD_API_KEY);
        const normalizedSlug = normalizeSlugForCache(slug);
        const existing = readCachedCloudContent(keyFingerprint);
        writeCachedCloudContent({
          keyFingerprint,
          savedAt: Date.now(),
          siteConfig: state.site ?? null,
          pages: {
            ...(existing?.pages ?? {}),
            [normalizedSlug]: state.page,
          },
        });
      },
      showLegacySave: !isCloudMode,
      showHotSave: isCloudMode,
    },
    assets: {
      assetsBaseUrl: '/assets',
      assetsManifest,
      async onAssetUpload(file: File): Promise<string> {
        if (!file.type.startsWith('image/')) throw new Error('Invalid file type.');
        if (!ALLOWED_IMAGE_MIME_TYPES.has(file.type)) {
          throw new Error('Unsupported image format. Allowed: jpeg, png, webp, gif, avif.');
        }
        if (file.size > MAX_UPLOAD_SIZE_BYTES) throw new Error(`File too large. Max ${MAX_UPLOAD_SIZE_BYTES / 1024 / 1024}MB.`);

        if (isCloudMode && CLOUD_API_URL && CLOUD_API_KEY) {
          const apiBases = cloudApiCandidates.length > 0 ? cloudApiCandidates : [normalizeApiBase(CLOUD_API_URL)];
          let lastError: Error | null = null;
          for (const apiBase of apiBases) {
            for (let attempt = 0; attempt <= ASSET_UPLOAD_MAX_RETRIES; attempt += 1) {
              try {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('filename', file.name);
                const controller = new AbortController();
                const timeout = window.setTimeout(() => controller.abort(), ASSET_UPLOAD_TIMEOUT_MS);
                const res = await fetch(`${apiBase}/assets/upload`, {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${CLOUD_API_KEY}`,
                    'X-Correlation-Id': crypto.randomUUID(),
                  },
                  body: formData,
                  signal: controller.signal,
                }).finally(() => window.clearTimeout(timeout));
                const body = (await res.json().catch(() => ({}))) as { url?: string; error?: string; code?: string };
                if (res.ok && typeof body.url === 'string') {
                  await loadAssetsManifest().catch(() => undefined);
                  return body.url;
                }
                lastError = new Error(body.error || body.code || `Cloud upload failed: ${res.status}`);
                if (isRetryableStatus(res.status) && attempt < ASSET_UPLOAD_MAX_RETRIES) {
                  await sleep(backoffDelayMs(attempt));
                  continue;
                }
                break;
              } catch (error: unknown) {
                const message = error instanceof Error ? error.message : 'Cloud upload failed.';
                lastError = new Error(message);
                if (attempt < ASSET_UPLOAD_MAX_RETRIES) {
                  await sleep(backoffDelayMs(attempt));
                  continue;
                }
                break;
              }
            }
          }
          throw lastError ?? new Error('Cloud upload failed.');
        }

        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as string).split(',')[1] ?? '');
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        });

        const res = await fetch('/api/upload-asset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, mimeType: file.type || undefined, data: base64 }),
        });
        const body = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
        if (!res.ok) throw new Error(body.error || `Upload failed: ${res.status}`);
        if (typeof body.url !== 'string') throw new Error('Invalid server response: missing url');
        await loadAssetsManifest().catch(() => undefined);
        return body.url;
      },
    },
  };

  const shouldRenderEngine = !isCloudMode || hasInitialCloudResolved;

  useEffect(() => {
    if (!shouldRenderEngine) {
      setTenantPreviewReady(false);
      return;
    }
    let cancelled = false;
    let raf1 = 0;
    let raf2 = 0;
    raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(() => {
        if (!cancelled) setTenantPreviewReady(true);
      });
    });
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
      setTenantPreviewReady(false);
    };
  }, [shouldRenderEngine, pages, siteConfig]);

  return (
    <ThemeProvider>
      <>
      {isCloudMode && showTopProgress ? (
        <>
          <style>
            {`@keyframes jp-top-progress-slide { 0% { transform: translateX(-120%); } 100% { transform: translateX(320%); } }`}
          </style>
          <div
            role="status"
            aria-live="polite"
            aria-label="Cloud loading progress"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              zIndex: 1300,
              background: 'rgba(255,255,255,0.08)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: '32%',
                height: '100%',
                background: 'linear-gradient(90deg, rgba(88,166,255,0.15) 0%, rgba(88,166,255,0.85) 50%, rgba(88,166,255,0.15) 100%)',
                animation: 'jp-top-progress-slide 1.15s ease-in-out infinite',
                willChange: 'transform',
              }}
            />
          </div>
        </>
      ) : null}
      {isCloudMode && !hasInitialCloudResolved ? (
        <div className="fixed inset-0 z-[1290] bg-background/80 backdrop-blur-sm">
          <div className="mx-auto w-full max-w-[1600px] p-6">
            <div className="grid gap-4 lg:grid-cols-[1fr_420px]">
              <div className="space-y-4">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-[220px] w-full rounded-xl" />
                <Skeleton className="h-[220px] w-full rounded-xl" />
              </div>
              <div className="space-y-3 rounded-xl border border-border/50 bg-card/60 p-4">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-5/6" />
                <Skeleton className="h-5 w-4/6" />
                <Skeleton className="h-24 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {shouldRenderEngine ? <JsonPagesEngine config={config} /> : null}
      {isCloudMode && (contentMode === 'error' || contentFallback?.reasonCode === 'CLOUD_REFRESH_FAILED') ? (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            top: 12,
            right: 12,
            zIndex: 1200,
            background: 'rgba(179, 65, 24, 0.92)',
            border: '1px solid rgba(255,255,255,0.18)',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: 10,
            fontSize: 12,
            maxWidth: 360,
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          }}
        >
          {contentMode === 'error' ? 'Cloud content unavailable.' : 'Cloud refresh failed, showing cached content.'}
          {contentFallback ? (
            <div style={{ opacity: 0.85, marginTop: 4 }}>
              <div>{contentFallback.message}</div>
              <div style={{ marginTop: 2 }}>
                Reason: {contentFallback.reasonCode}
                {contentFallback.correlationId ? ` | Correlation: ${contentFallback.correlationId}` : ''}
              </div>
              <div style={{ marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => {
                    contentLoadInFlight.current = null;
                    setContentMode('cloud');
                    setContentFallback(null);
                    setHasInitialCloudResolved(false);
                    setShowTopProgress(true);
                    setBootstrapRunId((prev) => prev + 1);
                  }}
                  style={{
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: 8,
                    padding: '4px 10px',
                    background: 'transparent',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: 12,
                  }}
                >
                  Retry
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
      <DopaDrawer
        isOpen={cloudSaveUi.isOpen}
        phase={cloudSaveUi.phase}
        currentStepId={cloudSaveUi.currentStepId}
        doneSteps={cloudSaveUi.doneSteps}
        progress={cloudSaveUi.progress}
        errorMessage={cloudSaveUi.errorMessage}
        deployUrl={cloudSaveUi.deployUrl}
        onClose={closeCloudDrawer}
        onRetry={retryCloudSave}
      />
      </>
    </ThemeProvider>
  );
}

export default App;


END_OF_FILE_CONTENT
# SKIP: src/App.tsx:Zone.Identifier is binary and cannot be embedded as text.
echo "Creating src/App_.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/App_.tsx"
/**
 * Thin Entry Point (Tenant).
 * Data from getHydratedData (file-backed or draft); assets from public/assets/images.
 * Supports Hybrid Persistence: Local Filesystem (Dev) or Cloud Bridge (Prod).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { JsonPagesEngine } from '@olonjs/core';
import type { JsonPagesConfig, LibraryImageEntry, ProjectState } from '@olonjs/core';
import { ComponentRegistry } from '@/lib/ComponentRegistry';
import { SECTION_SCHEMAS } from '@/lib/schemas';
import { addSectionConfig } from '@/lib/addSectionConfig';
import { getHydratedData } from '@/lib/draftStorage';
import type { SiteConfig, ThemeConfig, MenuConfig, PageConfig } from '@/types';
import type { DeployPhase, StepId } from '@/types/deploy';
import { DEPLOY_STEPS } from '@/lib/deploySteps';
import { startCloudSaveStream } from '@/lib/cloudSaveStream';
import siteData from '@/data/config/site.json';
import themeData from '@/data/config/theme.json';
import menuData from '@/data/config/menu.json';
import { getFilePages } from '@/lib/getFilePages';
import { DopaDrawer } from '@/components/save-drawer/DopaDrawer';
import { Skeleton } from '@/components/ui/skeleton';

import tenantCss from './index.css?inline';

// Cloud Configuration (Injected by Vercel/Netlify Env Vars)
const CLOUD_API_URL =
  import.meta.env.VITE_OLONJS_CLOUD_URL ?? import.meta.env.VITE_JSONPAGES_CLOUD_URL;
const CLOUD_API_KEY =
  import.meta.env.VITE_OLONJS_API_KEY ?? import.meta.env.VITE_JSONPAGES_API_KEY;

const themeConfig = themeData as unknown as ThemeConfig;
const menuConfig = menuData as unknown as MenuConfig;
const TENANT_ID = 'alpha';

const filePages = getFilePages();
const fileSiteConfig = siteData as unknown as SiteConfig;
const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;
const ASSET_UPLOAD_MAX_RETRIES = 2;
const ASSET_UPLOAD_TIMEOUT_MS = 20_000;
const ALLOWED_IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']);

interface CloudSaveUiState {
  isOpen: boolean;
  phase: DeployPhase;
  currentStepId: StepId | null;
  doneSteps: StepId[];
  progress: number;
  errorMessage?: string;
  deployUrl?: string;
}

type ContentMode = 'cloud' | 'error';
type ContentStatus = 'ok' | 'empty_namespace' | 'legacy_fallback';

type ContentResponse = {
  ok?: boolean;
  siteConfig?: unknown;
  pages?: unknown;
  items?: unknown;
  error?: string;
  code?: string;
  correlationId?: string;
  contentStatus?: ContentStatus;
  usedUnscopedFallback?: boolean;
  namespace?: string;
  namespaceMatchedKeys?: number;
};

type CachedCloudContent = {
  keyFingerprint: string;
  savedAt: number;
  siteConfig: unknown | null;
  pages: Record<string, unknown>;
};

const CLOUD_CACHE_KEY = 'jp_cloud_content_cache_v1';
const CLOUD_CACHE_TTL_MS = 5 * 60 * 1000;

function normalizeApiBase(raw: string): string {
  return raw.trim().replace(/\/+$/, '');
}

function buildApiCandidates(raw: string): string[] {
  const base = normalizeApiBase(raw);
  const withApi = /\/api\/v1$/i.test(base) ? base : `${base}/api/v1`;
  const candidates = [withApi, base];
  return Array.from(new Set(candidates.filter(Boolean)));
}

function getInitialData() {
  return getHydratedData(TENANT_ID, filePages, fileSiteConfig);
}

function getInitialCloudSaveUiState(): CloudSaveUiState {
  return {
    isOpen: false,
    phase: 'idle',
    currentStepId: null,
    doneSteps: [],
    progress: 0,
  };
}

function stepProgress(doneSteps: StepId[]): number {
  return Math.round((doneSteps.length / DEPLOY_STEPS.length) * 100);
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function asString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

function coercePageConfig(slug: string, value: unknown): PageConfig | null {
  let input = value;
  if (typeof input === 'string') {
    try {
      input = JSON.parse(input) as unknown;
    } catch {
      return null;
    }
  }
  if (!isObjectRecord(input) || !Array.isArray(input.sections)) return null;

  const inputMeta = isObjectRecord(input.meta) ? input.meta : {};
  const normalizedSlug = asString(input.slug, slug);
  const normalizedId = asString(input.id, `${normalizedSlug}-page`);
  const title = asString(inputMeta.title, normalizedSlug);
  const description = asString(inputMeta.description, '');

  return {
    id: normalizedId,
    slug: normalizedSlug,
    meta: { title, description },
    sections: input.sections as PageConfig['sections'],
    ...(typeof input['global-header'] === 'boolean' ? { 'global-header': input['global-header'] } : {}),
  };
}

function coerceSiteConfig(value: unknown): SiteConfig | null {
  let input = value;
  if (typeof input === 'string') {
    try {
      input = JSON.parse(input) as unknown;
    } catch {
      return null;
    }
  }
  if (!isObjectRecord(input)) return null;
  if (!isObjectRecord(input.identity)) return null;
  if (!Array.isArray(input.pages)) return null;

  return input as unknown as SiteConfig;
}

function toPagesRecord(value: unknown): Record<string, PageConfig> | null {
  const directPage = coercePageConfig('home', value);
  if (directPage) {
    const directSlug = asString(directPage.slug, 'home')
      .toLowerCase()
      .replace(/[^a-z0-9/_-]/g, '-')
      .replace(/^\/+|\/+$/g, '') || 'home';
    return { [directSlug]: directPage };
  }

  if (!isObjectRecord(value)) return null;
  const next: Record<string, PageConfig> = {};
  for (const [rawKey, payload] of Object.entries(value)) {
    const rawKeyTrimmed = rawKey.trim();
    const slugFromNamespacedKey = rawKeyTrimmed.match(/^t_[a-z0-9-]+_page_(.+)$/i)?.[1];
    const normalizedSlug = (slugFromNamespacedKey ?? rawKeyTrimmed)
      .toLowerCase()
      .replace(/[^a-z0-9/_-]/g, '-')
      .replace(/^\/+|\/+$/g, '');
    const slug = normalizedSlug || 'home';
    const page = coercePageConfig(slug, payload);
    if (!page) continue;
    next[slug] = page;
  }
  return next;
}

function normalizePageRegistry(value: unknown): Record<string, PageConfig> {
  if (!isObjectRecord(value)) return {};
  const normalized: Record<string, PageConfig> = {};

  for (const [registrySlug, rawPageValue] of Object.entries(value)) {
    const direct = coercePageConfig(registrySlug, rawPageValue);
    if (direct) {
      normalized[direct.slug || registrySlug] = direct;
      continue;
    }

    const nested = toPagesRecord(rawPageValue);
    if (nested && Object.keys(nested).length > 0) {
      Object.assign(normalized, nested);
    }
  }

  return normalized;
}

function extractContentSources(payload: ContentResponse | Record<string, unknown>): {
  pagesSource: unknown;
  siteSource: unknown;
} {
  // Canonical contract: { pages, siteConfig }
  if (isObjectRecord(payload) && isObjectRecord(payload.pages)) {
    return { pagesSource: payload.pages, siteSource: payload.siteConfig };
  }

  // Edge public JSON contract: { digest, updatedAt, items: { ... } }
  if (isObjectRecord(payload) && isObjectRecord(payload.items)) {
    const items = payload.items;
    let siteSource: unknown = null;
    const pageEntries: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(items)) {
      if (/(_config_site|config_site|config:site)$/i.test(key)) {
        siteSource = value;
        continue;
      }
      if (/(_page_|^page_|page:)/i.test(key)) {
        pageEntries[key] = value;
      }
    }
    return { pagesSource: pageEntries, siteSource };
  }

  // Raw map fallback: treat payload object itself as page map.
  return { pagesSource: payload, siteSource: null };
}

type CloudLoadFailure = {
  reasonCode: string;
  message: string;
  correlationId?: string;
};

function isCloudLoadFailure(value: unknown): value is CloudLoadFailure {
  return (
    isObjectRecord(value) &&
    typeof value.reasonCode === 'string' &&
    typeof value.message === 'string'
  );
}

function toCloudLoadFailure(value: unknown): CloudLoadFailure {
  if (isCloudLoadFailure(value)) return value;
  if (value instanceof Error) {
    return { reasonCode: 'CLOUD_LOAD_FAILED', message: value.message };
  }
  return { reasonCode: 'CLOUD_LOAD_FAILED', message: 'Cloud content unavailable.' };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableStatus(status: number): boolean {
  return status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
}

function backoffDelayMs(attempt: number): number {
  const base = 250 * Math.pow(2, attempt);
  const jitter = Math.floor(Math.random() * 120);
  return base + jitter;
}

function logBootstrapEvent(event: string, details: Record<string, unknown>) {
  console.info('[boot]', { event, at: new Date().toISOString(), ...details });
}

function cloudFingerprint(apiBase: string, apiKey: string): string {
  return `${normalizeApiBase(apiBase)}::${apiKey.slice(-8)}`;
}

function normalizeSlugForCache(slug: string): string {
  return (
    slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9/_-]/g, '-')
      .replace(/^\/+|\/+$/g, '') || 'home'
  );
}

function readCachedCloudContent(fingerprint: string): CachedCloudContent | null {
  try {
    const raw = localStorage.getItem(CLOUD_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedCloudContent;
    if (!parsed || parsed.keyFingerprint !== fingerprint) return null;
    if (!parsed.savedAt || Date.now() - parsed.savedAt > CLOUD_CACHE_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCachedCloudContent(entry: CachedCloudContent): void {
  try {
    localStorage.setItem(CLOUD_CACHE_KEY, JSON.stringify(entry));
  } catch {
    // non-blocking cache path
  }
}

function buildThemeFontVarsCss(input: unknown): string {
  if (!isObjectRecord(input)) return '';
  const tokens = isObjectRecord(input.tokens) ? input.tokens : null;
  const typography = tokens && isObjectRecord(tokens.typography) ? tokens.typography : null;
  const fontFamily = typography && isObjectRecord(typography.fontFamily) ? typography.fontFamily : null;
  const primary = typeof fontFamily?.primary === 'string' ? fontFamily.primary : "'Instrument Sans', system-ui, sans-serif";
  const serif = typeof fontFamily?.serif === 'string' ? fontFamily.serif : "'Instrument Serif', Georgia, serif";
  const mono = typeof fontFamily?.mono === 'string' ? fontFamily.mono : "'JetBrains Mono', monospace";
  return `:root{--theme-font-primary:${primary};--theme-font-serif:${serif};--theme-font-mono:${mono};}`;
}

function App() {
  const isCloudMode = Boolean(CLOUD_API_URL && CLOUD_API_KEY);
  const localInitialData = useMemo(() => (isCloudMode ? null : getInitialData()), [isCloudMode]);
  const localInitialPages = useMemo(() => {
    if (!localInitialData) return {};
    const normalized = normalizePageRegistry(localInitialData.pages as unknown);
    return Object.keys(normalized).length > 0 ? normalized : localInitialData.pages;
  }, [localInitialData]);
  const [pages, setPages] = useState<Record<string, PageConfig>>(localInitialPages);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(
    localInitialData?.siteConfig ?? fileSiteConfig
  );
  const [assetsManifest, setAssetsManifest] = useState<LibraryImageEntry[]>([]);
  const [cloudSaveUi, setCloudSaveUi] = useState<CloudSaveUiState>(getInitialCloudSaveUiState);
  const [contentMode, setContentMode] = useState<ContentMode>('cloud');
  const [contentFallback, setContentFallback] = useState<CloudLoadFailure | null>(null);
  const [showTopProgress, setShowTopProgress] = useState(false);
  const [hasInitialCloudResolved, setHasInitialCloudResolved] = useState(!isCloudMode);
  const [bootstrapRunId, setBootstrapRunId] = useState(0);
  const activeCloudSaveController = useRef<AbortController | null>(null);
  const contentLoadInFlight = useRef<Promise<void> | null>(null);
  const pendingCloudSave = useRef<{ state: ProjectState; slug: string } | null>(null);
  const cloudApiCandidates = useMemo(
    () => (isCloudMode && CLOUD_API_URL ? buildApiCandidates(CLOUD_API_URL) : []),
    [isCloudMode, CLOUD_API_URL]
  );

  const loadAssetsManifest = useCallback(async (): Promise<void> => {
    if (isCloudMode && CLOUD_API_URL && CLOUD_API_KEY) {
      const apiBases = cloudApiCandidates.length > 0 ? cloudApiCandidates : [normalizeApiBase(CLOUD_API_URL)];
      for (const apiBase of apiBases) {
        try {
          const res = await fetch(`${apiBase}/assets/list?limit=200`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${CLOUD_API_KEY}`,
            },
          });
          const body = (await res.json().catch(() => ({}))) as { items?: LibraryImageEntry[] };
          if (!res.ok) continue;
          const items = Array.isArray(body.items) ? body.items : [];
          setAssetsManifest(items);
          return;
        } catch {
          // try next candidate
        }
      }
      setAssetsManifest([]);
      return;
    }

    fetch('/api/list-assets')
      .then((r) => (r.ok ? r.json() : []))
      .then((list: LibraryImageEntry[]) => setAssetsManifest(Array.isArray(list) ? list : []))
      .catch(() => setAssetsManifest([]));
  }, [isCloudMode, CLOUD_API_URL, CLOUD_API_KEY, cloudApiCandidates]);

  useEffect(() => {
    void loadAssetsManifest();
  }, [loadAssetsManifest]);

  useEffect(() => {
    return () => {
      activeCloudSaveController.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (!isCloudMode || !CLOUD_API_URL || !CLOUD_API_KEY) {
      setContentMode('cloud');
      setContentFallback(null);
      setShowTopProgress(false);
      setHasInitialCloudResolved(true);
      logBootstrapEvent('boot.local.ready', { mode: 'local' });
      return;
    }
    if (contentLoadInFlight.current) {
      return;
    }

    const controller = new AbortController();
    const maxRetryAttempts = 2;
    const startedAt = Date.now();
    const primaryApiBase = cloudApiCandidates[0] ?? normalizeApiBase(CLOUD_API_URL);
    const fingerprint = cloudFingerprint(primaryApiBase, CLOUD_API_KEY);
    const cached = readCachedCloudContent(fingerprint);
    const cachedPages = cached ? toPagesRecord(cached.pages) : null;
    const cachedSite = cached ? coerceSiteConfig(cached.siteConfig) : null;
    const hasCachedFallback = Boolean((cachedPages && Object.keys(cachedPages).length > 0) || cachedSite);
    if (cached) {
      logBootstrapEvent('boot.cloud.cache_hit', { ageMs: Date.now() - cached.savedAt });
    }
    setContentMode('cloud');
    setContentFallback(null);
    setShowTopProgress(true);
    setHasInitialCloudResolved(false);
    logBootstrapEvent('boot.start', { mode: 'cloud', apiCandidates: cloudApiCandidates.length });

    const loadCloudContent = async () => {
      try {
        let payload: ContentResponse | null = null;
        let lastFailure: CloudLoadFailure | null = null;

        for (const apiBase of cloudApiCandidates) {
          for (let attempt = 0; attempt <= maxRetryAttempts; attempt += 1) {
            try {
              const res = await fetch(`${apiBase}/content`, {
                method: 'GET',
                cache: 'no-store',
                headers: {
                  Authorization: `Bearer ${CLOUD_API_KEY}`,
                },
                signal: controller.signal,
              });

              const contentType = (res.headers.get('content-type') || '').toLowerCase();
              if (!contentType.includes('application/json')) {
                lastFailure = {
                  reasonCode: 'NON_JSON_RESPONSE',
                  message: `Non-JSON response from ${apiBase}/content`,
                };
                break;
              }

              const parsed = (await res.json().catch(() => ({}))) as ContentResponse;
              if (!res.ok) {
                lastFailure = {
                  reasonCode: parsed.code || `HTTP_${res.status}`,
                  message: parsed.error || `Cloud content read failed: ${res.status} (${apiBase}/content)`,
                  correlationId: parsed.correlationId,
                };
                if (isRetryableStatus(res.status) && attempt < maxRetryAttempts) {
                  await sleep(backoffDelayMs(attempt));
                  continue;
                }
                break;
              }

              payload = parsed;
              break;
            } catch (error: unknown) {
              if (controller.signal.aborted) throw error;
              const message = error instanceof Error ? error.message : 'Network error';
              lastFailure = {
                reasonCode: 'NETWORK_TRANSIENT',
                message: `${message} (${apiBase}/content)`,
              };
              if (attempt < maxRetryAttempts) {
                await sleep(backoffDelayMs(attempt));
                continue;
              }
            }
          }
          if (payload) {
            break;
          }
        }

        if (!payload) {
          throw (
            lastFailure || {
              reasonCode: 'CLOUD_ENDPOINT_UNREACHABLE',
              message: 'Cloud content endpoint not reachable as JSON.',
            }
          );
        }

        const { pagesSource, siteSource } = extractContentSources(payload);
        const remotePages = toPagesRecord(pagesSource);
        const remoteSite = coerceSiteConfig(siteSource);
        const remotePageCount = remotePages ? Object.keys(remotePages).length : 0;
        if (remotePageCount === 0 && !remoteSite) {
          throw {
            reasonCode: payload.contentStatus === 'empty_namespace' ? 'EMPTY_NAMESPACE' : 'EMPTY_PAYLOAD',
            message: 'Cloud payload is empty for this tenant namespace.',
            correlationId: payload.correlationId,
          } satisfies CloudLoadFailure;
        }
        if (import.meta.env.DEV) {
          console.info('[content] cloud diagnostics', {
            contentStatus: payload.contentStatus ?? 'ok',
            namespace: payload.namespace,
            namespaceMatchedKeys: payload.namespaceMatchedKeys,
            usedUnscopedFallback: payload.usedUnscopedFallback,
            correlationId: payload.correlationId,
          });
        }
        if (remotePages && remotePageCount > 0) {
          setPages(remotePages);
        }
        if (remoteSite) {
          setSiteConfig(remoteSite);
        }
        writeCachedCloudContent({
          keyFingerprint: fingerprint,
          savedAt: Date.now(),
          siteConfig: remoteSite ?? null,
          pages: (remotePages ?? {}) as Record<string, unknown>,
        });
        setContentMode('cloud');
        setContentFallback(null);
        setHasInitialCloudResolved(true);
        logBootstrapEvent('boot.cloud.success', {
          mode: 'cloud',
          elapsedMs: Date.now() - startedAt,
          contentStatus: payload.contentStatus ?? 'ok',
          correlationId: payload.correlationId ?? null,
        });
      } catch (error: unknown) {
        if (controller.signal.aborted) return;
        const failure = toCloudLoadFailure(error);
        if (hasCachedFallback) {
          if (cachedPages && Object.keys(cachedPages).length > 0) {
            setPages(cachedPages);
          }
          if (cachedSite) {
            setSiteConfig(cachedSite);
          }
          setContentMode('cloud');
          setContentFallback({
            reasonCode: 'CLOUD_REFRESH_FAILED',
            message: failure.message,
            correlationId: failure.correlationId,
          });
          setHasInitialCloudResolved(true);
        } else {
          setContentMode('error');
          setContentFallback(failure);
          setHasInitialCloudResolved(true);
        }
        logBootstrapEvent('boot.cloud.error', {
          mode: 'cloud',
          elapsedMs: Date.now() - startedAt,
          reasonCode: failure.reasonCode,
          correlationId: failure.correlationId ?? null,
        });
      }
    };

    let inFlight: Promise<void> | null = null;
    inFlight = loadCloudContent().finally(() => {
      setShowTopProgress(false);
      if (contentLoadInFlight.current === inFlight) {
        contentLoadInFlight.current = null;
      }
    });
    contentLoadInFlight.current = inFlight;
    return () => controller.abort();
  }, [isCloudMode, CLOUD_API_KEY, CLOUD_API_URL, cloudApiCandidates, bootstrapRunId]);

  const runCloudSave = useCallback(
    async (
      payload: { state: ProjectState; slug: string },
      rejectOnError: boolean
    ): Promise<void> => {
      if (!CLOUD_API_URL || !CLOUD_API_KEY) {
        const noCloudError = new Error('Cloud mode is not configured.');
        if (rejectOnError) throw noCloudError;
        return;
      }

      pendingCloudSave.current = payload;
      activeCloudSaveController.current?.abort();
      const controller = new AbortController();
      activeCloudSaveController.current = controller;

      setCloudSaveUi({
        isOpen: true,
        phase: 'running',
        currentStepId: null,
        doneSteps: [],
        progress: 0,
      });

      try {
        await startCloudSaveStream({
          apiBaseUrl: CLOUD_API_URL,
          apiKey: CLOUD_API_KEY,
          path: `src/data/pages/${payload.slug}.json`,
          content: payload.state.page,
          message: `Content update for ${payload.slug} via Visual Editor`,
          signal: controller.signal,
          onStep: (event) => {
            setCloudSaveUi((prev) => {
              if (event.status === 'running') {
                return {
                  ...prev,
                  isOpen: true,
                  phase: 'running',
                  currentStepId: event.id,
                  errorMessage: undefined,
                };
              }

              if (prev.doneSteps.includes(event.id)) {
                return prev;
              }

              const nextDone = [...prev.doneSteps, event.id];
              return {
                ...prev,
                isOpen: true,
                phase: 'running',
                currentStepId: event.id,
                doneSteps: nextDone,
                progress: stepProgress(nextDone),
              };
            });
          },
          onDone: (event) => {
            const completed = DEPLOY_STEPS.map((step) => step.id);
            setCloudSaveUi({
              isOpen: true,
              phase: 'done',
              currentStepId: 'live',
              doneSteps: completed,
              progress: 100,
              deployUrl: event.deployUrl,
            });
          },
        });
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Cloud save failed.';
        setCloudSaveUi((prev) => ({
          ...prev,
          isOpen: true,
          phase: 'error',
          errorMessage: message,
        }));
        if (rejectOnError) throw new Error(message);
      } finally {
        if (activeCloudSaveController.current === controller) {
          activeCloudSaveController.current = null;
        }
      }
    },
    []
  );

  const closeCloudDrawer = useCallback(() => {
    setCloudSaveUi(getInitialCloudSaveUiState());
  }, []);

  const retryCloudSave = useCallback(() => {
    if (!pendingCloudSave.current) return;
    void runCloudSave(pendingCloudSave.current, false);
  }, [runCloudSave]);

  const config: JsonPagesConfig = {
    tenantId: TENANT_ID,
    registry: ComponentRegistry as JsonPagesConfig['registry'],
    schemas: SECTION_SCHEMAS as unknown as JsonPagesConfig['schemas'],
    pages,
    siteConfig,
    themeConfig,
    menuConfig,
    themeCss: { tenant: `${buildThemeFontVarsCss(themeConfig)}\n${tenantCss}` },
    addSection: addSectionConfig,
    persistence: {
      async saveToFile(state: ProjectState, slug: string): Promise<void> {
        // 💻 LOCAL FILESYSTEM (Development / legacy fallback)
        console.log(`💻 Saving ${slug} to Local Filesystem...`);
        const res = await fetch('/api/save-to-file', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectState: state, slug }),
        });
        
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        if (!res.ok) throw new Error(body.error ?? `Save to file failed: ${res.status}`);
      },
      async hotSave(state: ProjectState, slug: string): Promise<void> {
        if (!isCloudMode || !CLOUD_API_URL || !CLOUD_API_KEY) {
          throw new Error('Cloud mode is not configured for hot save.');
        }
        const apiBase = CLOUD_API_URL.replace(/\/$/, '');
        const res = await fetch(`${apiBase}/hotSave`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CLOUD_API_KEY}`,
          },
          body: JSON.stringify({
            slug,
            page: state.page,
            siteConfig: state.site,
          }),
        });
        const body = (await res.json().catch(() => ({}))) as { error?: string; code?: string };
        if (!res.ok) {
          throw new Error(body.error || body.code || `Hot save failed: ${res.status}`);
        }
        const keyFingerprint = cloudFingerprint(apiBase, CLOUD_API_KEY);
        const normalizedSlug = normalizeSlugForCache(slug);
        const existing = readCachedCloudContent(keyFingerprint);
        writeCachedCloudContent({
          keyFingerprint,
          savedAt: Date.now(),
          siteConfig: state.site ?? null,
          pages: {
            ...(existing?.pages ?? {}),
            [normalizedSlug]: state.page,
          },
        });
      },
      showLegacySave: !isCloudMode,
      showHotSave: isCloudMode,
    },
    assets: {
      assetsBaseUrl: '/assets',
      assetsManifest,
      async onAssetUpload(file: File): Promise<string> {
        if (!file.type.startsWith('image/')) throw new Error('Invalid file type.');
        if (!ALLOWED_IMAGE_MIME_TYPES.has(file.type)) {
          throw new Error('Unsupported image format. Allowed: jpeg, png, webp, gif, avif.');
        }
        if (file.size > MAX_UPLOAD_SIZE_BYTES) throw new Error(`File too large. Max ${MAX_UPLOAD_SIZE_BYTES / 1024 / 1024}MB.`);

        if (isCloudMode && CLOUD_API_URL && CLOUD_API_KEY) {
          const apiBases = cloudApiCandidates.length > 0 ? cloudApiCandidates : [normalizeApiBase(CLOUD_API_URL)];
          let lastError: Error | null = null;
          for (const apiBase of apiBases) {
            for (let attempt = 0; attempt <= ASSET_UPLOAD_MAX_RETRIES; attempt += 1) {
              try {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('filename', file.name);
                const controller = new AbortController();
                const timeout = window.setTimeout(() => controller.abort(), ASSET_UPLOAD_TIMEOUT_MS);
                const res = await fetch(`${apiBase}/assets/upload`, {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${CLOUD_API_KEY}`,
                    'X-Correlation-Id': crypto.randomUUID(),
                  },
                  body: formData,
                  signal: controller.signal,
                }).finally(() => window.clearTimeout(timeout));
                const body = (await res.json().catch(() => ({}))) as { url?: string; error?: string; code?: string };
                if (res.ok && typeof body.url === 'string') {
                  await loadAssetsManifest().catch(() => undefined);
                  return body.url;
                }
                lastError = new Error(body.error || body.code || `Cloud upload failed: ${res.status}`);
                if (isRetryableStatus(res.status) && attempt < ASSET_UPLOAD_MAX_RETRIES) {
                  await sleep(backoffDelayMs(attempt));
                  continue;
                }
                break;
              } catch (error: unknown) {
                const message = error instanceof Error ? error.message : 'Cloud upload failed.';
                lastError = new Error(message);
                if (attempt < ASSET_UPLOAD_MAX_RETRIES) {
                  await sleep(backoffDelayMs(attempt));
                  continue;
                }
                break;
              }
            }
          }
          throw lastError ?? new Error('Cloud upload failed.');
        }

        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as string).split(',')[1] ?? '');
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        });

        const res = await fetch('/api/upload-asset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, mimeType: file.type || undefined, data: base64 }),
        });
        const body = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
        if (!res.ok) throw new Error(body.error || `Upload failed: ${res.status}`);
        if (typeof body.url !== 'string') throw new Error('Invalid server response: missing url');
        await loadAssetsManifest().catch(() => undefined);
        return body.url;
      },
    },
  };

  const shouldRenderEngine = !isCloudMode || hasInitialCloudResolved;

  return (
    <>
      {isCloudMode && showTopProgress ? (
        <>
          <style>
            {`@keyframes jp-top-progress-slide { 0% { transform: translateX(-120%); } 100% { transform: translateX(320%); } }`}
          </style>
          <div
            role="status"
            aria-live="polite"
            aria-label="Cloud loading progress"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              zIndex: 1300,
              background: 'rgba(255,255,255,0.08)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: '32%',
                height: '100%',
                background: 'linear-gradient(90deg, rgba(88,166,255,0.15) 0%, rgba(88,166,255,0.85) 50%, rgba(88,166,255,0.15) 100%)',
                animation: 'jp-top-progress-slide 1.15s ease-in-out infinite',
                willChange: 'transform',
              }}
            />
          </div>
        </>
      ) : null}
      {isCloudMode && !hasInitialCloudResolved ? (
        <div className="fixed inset-0 z-[1290] bg-background/80 backdrop-blur-sm">
          <div className="mx-auto w-full max-w-[1600px] p-6">
            <div className="grid gap-4 lg:grid-cols-[1fr_420px]">
              <div className="space-y-4">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-[220px] w-full rounded-xl" />
                <Skeleton className="h-[220px] w-full rounded-xl" />
              </div>
              <div className="space-y-3 rounded-xl border border-border/50 bg-card/60 p-4">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-5/6" />
                <Skeleton className="h-5 w-4/6" />
                <Skeleton className="h-24 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {shouldRenderEngine ? <JsonPagesEngine config={config} /> : null}
      {isCloudMode && (contentMode === 'error' || contentFallback?.reasonCode === 'CLOUD_REFRESH_FAILED') ? (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            top: 12,
            right: 12,
            zIndex: 1200,
            background: 'rgba(179, 65, 24, 0.92)',
            border: '1px solid rgba(255,255,255,0.18)',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: 10,
            fontSize: 12,
            maxWidth: 360,
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          }}
        >
          {contentMode === 'error' ? 'Cloud content unavailable.' : 'Cloud refresh failed, showing cached content.'}
          {contentFallback ? (
            <div style={{ opacity: 0.85, marginTop: 4 }}>
              <div>{contentFallback.message}</div>
              <div style={{ marginTop: 2 }}>
                Reason: {contentFallback.reasonCode}
                {contentFallback.correlationId ? ` | Correlation: ${contentFallback.correlationId}` : ''}
              </div>
              <div style={{ marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => {
                    contentLoadInFlight.current = null;
                    setContentMode('cloud');
                    setContentFallback(null);
                    setHasInitialCloudResolved(false);
                    setShowTopProgress(true);
                    setBootstrapRunId((prev) => prev + 1);
                  }}
                  style={{
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: 8,
                    padding: '4px 10px',
                    background: 'transparent',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: 12,
                  }}
                >
                  Retry
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
      <DopaDrawer
        isOpen={cloudSaveUi.isOpen}
        phase={cloudSaveUi.phase}
        currentStepId={cloudSaveUi.currentStepId}
        doneSteps={cloudSaveUi.doneSteps}
        progress={cloudSaveUi.progress}
        errorMessage={cloudSaveUi.errorMessage}
        deployUrl={cloudSaveUi.deployUrl}
        onClose={closeCloudDrawer}
        onRetry={retryCloudSave}
      />
    </>
  );
}

export default App;


END_OF_FILE_CONTENT
mkdir -p "src/components"
echo "Creating src/components/NotFound.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/NotFound.tsx"
import React from 'react';
import { Icon } from '@/lib/IconResolver';

export const NotFound: React.FC = () => {
  return (
    <div 
      style={{
        '--local-bg': 'var(--color-background)',
        '--local-text': 'var(--color-text)',
        '--local-text-muted': 'var(--color-text-muted)',
        '--local-primary': 'var(--color-primary)',
        '--local-radius-md': 'var(--radius-md)',
      } as React.CSSProperties}
      className="min-h-screen flex flex-col items-center justify-center bg-[var(--local-bg)] px-6"
    >
      <h1 className="text-6xl font-bold text-[var(--local-text)] mb-4">404</h1>
      <p className="text-xl text-[var(--local-text-muted)] mb-8">Page not found</p>
      <a
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-[var(--local-radius-md)] bg-[var(--local-primary)] text-[var(--local-bg)] font-semibold text-sm hover:opacity-90 transition-opacity"
      >
        <span>Back to Home</span>
        <Icon name="arrow-right" size={16} />
      </a>
    </div>
  );
};





END_OF_FILE_CONTENT
echo "Creating src/components/OlonWordmark.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/OlonWordmark.tsx"
import { cn } from '@/lib/utils'
import { useTheme } from './ThemeProvider'

interface OlonMarkProps {
  size?: number
  className?: string
}

interface OlonWordmarkProps {
  markSize?: number
  className?: string
}

/* ── Mark only ──────────────────────────────────────────── */
export function OlonMark({ size = 32, className }: OlonMarkProps) {
  const { theme } = useTheme()

  // Dark:  nucleus = Parchment #E2D5B0 (warm, human)
  // Light: nucleus = Primary   #1E1814 (brand, on white bg)
  const nucleusFill = theme === 'dark' ? '#E2D5B0' : '#1E1814'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={cn('shrink-0', className)}
    >
      <defs>
        <linearGradient id="olon-ring" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B8A4E0" />
          <stop offset="100%" stopColor="#5B3F9A" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="38" stroke="url(#olon-ring)" strokeWidth="20" />
      <circle cx="50" cy="50" r="15" fill={nucleusFill} style={{ transition: 'fill 0.2s ease' }} />
    </svg>
  )
}

/* ── Wordmark — mark + "Olon" as live SVG text (DM Serif Display) ── */
export function OlonWordmark({ markSize = 48, className }: OlonWordmarkProps) {
  const scale = markSize / 48
  const w = 168 * scale
  const h = 52 * scale

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 168 52"
      fill="none"
      overflow="visible"
      className={cn('shrink-0', className)}
    >
      <defs>
        <linearGradient id="olon-wm-ring" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B8A4E0" />
          <stop offset="100%" stopColor="#5B3F9A" />
        </linearGradient>
      </defs>

      {/* Mark */}
      <circle cx="24" cy="24" r="18.24" stroke="url(#olon-wm-ring)" strokeWidth="9.6" />
      <circle cx="24" cy="24" r="7.2" fill="#E2D5B0" />

      {/* "Olon" — Merriweather via --wordmark-* tokens (style prop required for var() in SVG) */}
      <text
        x="57"
        y="38"
        fill="#E2D5B0"
        style={{
          fontFamily:           'var(--wordmark-font)',
          fontSize:             '48px',
          letterSpacing:        'var(--wordmark-tracking)',
          fontWeight:           'var(--wordmark-weight)',
          fontVariationSettings: '"wdth" var(--wordmark-width)',
        }}
      >
        Olon
      </text>
    </svg>
  )
}

END_OF_FILE_CONTENT
echo "Creating src/components/ThemeProvider.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/ThemeProvider.tsx"
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
  setTheme: (t: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {},
})

const STORAGE_KEY = 'olon:theme'

function isTheme(value: unknown): value is Theme {
  return value === 'dark' || value === 'light'
}

function resolveInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'

  const fromDom = document.documentElement.getAttribute('data-theme')
  if (isTheme(fromDom)) return fromDom

  const fromStorage = window.localStorage.getItem(STORAGE_KEY)
  if (isTheme(fromStorage)) return fromStorage

  const prefersLight = window.matchMedia?.('(prefers-color-scheme: light)').matches
  return prefersLight ? 'light' : 'dark'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(resolveInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  function setTheme(t: Theme) {
    setThemeState(t)
  }

  function toggleTheme() {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const value = useMemo(() => ({ theme, toggleTheme, setTheme }), [theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}

END_OF_FILE_CONTENT
# SKIP: src/components/ThemeProvider.tsx:Zone.Identifier is binary and cannot be embedded as text.
echo "Creating src/components/ThemeToggle.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/ThemeToggle.tsx"
import { Sun, Moon } from 'lucide-react'
import { useTheme } from './ThemeProvider'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'inline-flex items-center justify-center w-8 h-8 rounded-md',
        'text-muted-foreground hover:text-foreground hover:bg-elevated',
        'transition-colors duration-150',
        className
      )}
    >
      {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  )
}

END_OF_FILE_CONTENT
# SKIP: src/components/ThemeToggle.tsx:Zone.Identifier is binary and cannot be embedded as text.
mkdir -p "src/components/cloud-ai-native-grid"
echo "Creating src/components/cloud-ai-native-grid/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/cloud-ai-native-grid/View.tsx"
import type { CloudAiNativeGridData, CloudAiNativeGridSettings } from './types';

interface CloudAiNativeGridViewProps {
  data: CloudAiNativeGridData;
  settings?: CloudAiNativeGridSettings;
}

export function CloudAiNativeGridView({ data }: CloudAiNativeGridViewProps) {
  const mattersMatch = data.titleGradient.match(/^(.*)\s(MATTERS|Matters|matters)$/);
  const gradientPart = mattersMatch ? mattersMatch[1] : data.titleGradient;
  const whiteSuffix  = mattersMatch ? ` ${mattersMatch[2]}` : null;

  return (
    <section id={data.anchorId} className="max-w-4xl mx-auto px-6 mb-24 animate-fadeInUp delay-500 section-anchor">

      <h1 className="text-left text-5xl font-display font-bold mb-4 text-foreground">
        <span data-jp-field="titlePrefix">{data.titlePrefix} </span>
        <span
          className="bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent"
          data-jp-field="titleGradient"
        >
          {gradientPart}
        </span>
        {whiteSuffix && <span className="text-foreground">{whiteSuffix}</span>}
      </h1>
      <p
        className="text-left text-base text-muted-foreground mb-12 max-w-2xl "
        data-jp-field="description"
      >
        {data.description}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.cards.map((card) => (
          <article
            key={card.id ?? card.title}
            data-jp-item-id={card.id ?? card.title}
            data-jp-item-field="cards"
            className="jp-feature-card card-hover p-8 rounded-2xl"
          >
            <img
              src={card.icon.url}
              alt={card.icon.alt ?? card.title}
              className="w-10 h-10 mb-4"
              data-jp-field="icon"
            />
            <h3 className="text-xl font-display mb-3 text-foreground" data-jp-field="title">{card.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed" data-jp-field="description">{card.description}</p>
          </article>
        ))}
      </div>

    </section>
  );
}

END_OF_FILE_CONTENT
echo "Creating src/components/cloud-ai-native-grid/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/cloud-ai-native-grid/index.ts"
export { CloudAiNativeGridView }              from './View';
export { CloudAiNativeGridSchema, CloudAiNativeGridSettingsSchema } from './schema';
export type { CloudAiNativeGridData, CloudAiNativeGridSettings }    from './types';

END_OF_FILE_CONTENT
echo "Creating src/components/cloud-ai-native-grid/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/cloud-ai-native-grid/schema.ts"
import { z } from 'zod';
import { BaseArrayItem, BaseSectionData, ImageSelectionSchema } from '@/lib/base-schemas';

const FeatureCardSchema = BaseArrayItem.extend({
  icon:        ImageSelectionSchema.describe('ui:image-picker'),
  title:       z.string().describe('ui:text'),
  description: z.string().describe('ui:textarea'),
});

export const CloudAiNativeGridSchema = BaseSectionData.extend({
  titlePrefix:   z.string().describe('ui:text'),
  titleGradient: z.string().describe('ui:text'),
  description:   z.string().describe('ui:textarea'),
  cards:         z.array(FeatureCardSchema).describe('ui:list'),
});

export const CloudAiNativeGridSettingsSchema = z.object({});

END_OF_FILE_CONTENT
echo "Creating src/components/cloud-ai-native-grid/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/cloud-ai-native-grid/types.ts"
import { z } from 'zod';
import { CloudAiNativeGridSchema, CloudAiNativeGridSettingsSchema } from './schema';

export type CloudAiNativeGridData     = z.infer<typeof CloudAiNativeGridSchema>;
export type CloudAiNativeGridSettings = z.infer<typeof CloudAiNativeGridSettingsSchema>;

END_OF_FILE_CONTENT
mkdir -p "src/components/contact"
echo "Creating src/components/contact/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/contact/View.tsx"
import { useState, type CSSProperties } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ContactData, ContactSettings } from './types';

interface ContactViewProps {
  data: ContactData;
  settings?: ContactSettings;
}

export function Contact({ data, settings }: ContactViewProps) {
  const [submitted, setSubmitted] = useState(false);
  const showTiers = settings?.showTiers ?? true;
  const tiers = data.tiers ?? [];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section
      id="contact"
      className="py-24 px-6 border-t border-border section-anchor"
      style={{
        '--local-bg': 'var(--background)',
        '--local-text': 'var(--foreground)',
        '--local-text-muted': 'var(--muted-foreground)',
        '--local-border': 'var(--border)',
      } as CSSProperties}
    >
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-16 items-start">

          {/* Left */}
          <div className="max-w-md">
            {data.label && (
              <p className="font-mono-olon text-xs font-medium tracking-label uppercase text-muted-foreground mb-5" data-jp-field="label">
                {data.label}
              </p>
            )}
            <h2 className="font-display font-normal text-foreground leading-tight tracking-tight mb-5" data-jp-field="title">
              {data.title}
              {data.titleHighlight && (
                <>
                  <br />
                  <em className="not-italic text-primary-light" data-jp-field="titleHighlight">{data.titleHighlight}</em>
                </>
              )}
            </h2>
            {data.description && (
              <p className="text-base text-muted-foreground leading-relaxed mb-10" data-jp-field="description">
                {data.description}
              </p>
            )}

            {/* Tiers */}
            {showTiers && tiers.length > 0 && (
              <div className="space-y-0 border border-border rounded-lg overflow-hidden">
                {tiers.map((tier, i) => (
                  <div
                    key={tier.id ?? tier.label}
                    data-jp-item-id={tier.id ?? tier.label}
                    data-jp-item-field="tiers"
                    className={`flex items-start gap-4 px-5 py-4 ${i < tiers.length - 1 ? 'border-b border-border' : ''}`}
                  >
                    <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium tracking-wide bg-primary-900 text-primary-light border border-primary-800 rounded-sm mt-0.5 shrink-0 min-w-[64px] justify-center" data-jp-field="label">
                      {tier.label}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground leading-snug" data-jp-field="desc">{tier.desc}</p>
                      {tier.sub && (
                        <p className="text-[12px] text-muted-foreground mt-0.5" data-jp-field="sub">{tier.sub}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right — form */}
          <div className="rounded-lg border border-border bg-card p-6">
            {submitted ? (
              <div className="py-12 text-center">
                <div className="w-10 h-10 rounded-full bg-primary-900 border border-primary flex items-center justify-center mx-auto mb-4">
                  <ArrowRight size={15} className="text-primary-light" />
                </div>
                <p className="text-base font-medium text-foreground mb-1.5" data-jp-field="successTitle">
                  {data.successTitle ?? 'Message received'}
                </p>
                <p className="text-sm text-muted-foreground" data-jp-field="successBody">
                  {data.successBody ?? "We'll respond within one business day."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-foreground mb-4" data-jp-field="formTitle">
                    {data.formTitle ?? 'Get in touch'}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="contact-first">First name</Label>
                    <Input id="contact-first" placeholder="Ada" required />
                  </div>
                  <div>
                    <Label htmlFor="contact-last">Last name</Label>
                    <Input id="contact-last" placeholder="Lovelace" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="contact-email">Work email</Label>
                  <Input id="contact-email" type="email" placeholder="ada@acme.com" required />
                </div>
                <div>
                  <Label htmlFor="contact-company">Company</Label>
                  <Input id="contact-company" placeholder="Acme Corp" />
                </div>
                <div>
                  <Label htmlFor="contact-usecase">Use case</Label>
                  <textarea
                    id="contact-usecase"
                    rows={3}
                    placeholder="Tell us about your deployment context..."
                    className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-150 resize-none font-primary"
                  />
                </div>
                <Button type="submit" variant="accent" className="w-full">
                  Send message <ArrowRight size={14} />
                </Button>
                {data.disclaimer && (
                  <p className="text-xs text-muted-foreground text-center" data-jp-field="disclaimer">
                    {data.disclaimer}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

END_OF_FILE_CONTENT
echo "Creating src/components/contact/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/contact/index.ts"
export * from './View';
export * from './schema';
export * from './types';

END_OF_FILE_CONTENT
echo "Creating src/components/contact/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/contact/schema.ts"
import { z } from 'zod';
import { BaseSectionData, BaseArrayItem } from '@/lib/base-schemas';

export const ContactTierSchema = BaseArrayItem.extend({
  label: z.string().describe('ui:text'),
  desc:  z.string().describe('ui:text'),
  sub:   z.string().optional().describe('ui:text'),
});

export const ContactSchema = BaseSectionData.extend({
  label:          z.string().optional().describe('ui:text'),
  title:          z.string().describe('ui:text'),
  titleHighlight: z.string().optional().describe('ui:text'),
  description:    z.string().optional().describe('ui:textarea'),
  tiers:          z.array(ContactTierSchema).optional().describe('ui:list'),
  formTitle:      z.string().optional().describe('ui:text'),
  successTitle:   z.string().optional().describe('ui:text'),
  successBody:    z.string().optional().describe('ui:text'),
  disclaimer:     z.string().optional().describe('ui:text'),
});

export const ContactSettingsSchema = z.object({
  showTiers: z.boolean().default(true).describe('ui:checkbox'),
});

END_OF_FILE_CONTENT
echo "Creating src/components/contact/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/contact/types.ts"
import { z } from 'zod';
import { ContactSchema, ContactSettingsSchema } from './schema';

export type ContactData     = z.infer<typeof ContactSchema>;
export type ContactSettings = z.infer<typeof ContactSettingsSchema>;

END_OF_FILE_CONTENT
mkdir -p "src/components/cta-banner"
echo "Creating src/components/cta-banner/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/cta-banner/View.tsx"
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { OlonMark } from '@/components/ui/OlonMark';
import type { CtaBannerData, CtaBannerSettings } from './types';

export const CtaBanner: React.FC<{
  data: CtaBannerData;
  settings?: CtaBannerSettings;
}> = ({ data }) => {
  return (
    <section
      id="get-started"
      className="jp-cta-banner py-32 text-center relative overflow-hidden"
    >
      {/* Radial glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: '60vw',
          height: '60vw',
          background: 'radial-gradient(circle, rgba(23,99,255,.07) 0%, transparent 60%)',
        }}
        aria-hidden
      />

      <div className="relative max-w-[1040px] mx-auto px-8">

        {/* Spinning OlonMark */}
        <div
          className="w-[72px] h-[72px] mx-auto mb-9"
          style={{ animation: 'spin 22s linear infinite' }}
          aria-hidden
        >
          <OlonMark size={72} />
        </div>

        <h2
          className="font-display font-bold tracking-[-0.038em] leading-[1.1] text-foreground mx-auto mb-5"
          style={{ fontSize: 'clamp(28px, 4.5vw, 50px)', maxWidth: '620px' }}
          data-jp-field="title"
        >
          {data.title}
        </h2>

        {data.description && (
          <p
            className="text-[16px] text-muted-foreground leading-[1.65] mx-auto mb-10"
            style={{ maxWidth: '460px' }}
            data-jp-field="description"
          >
            {data.description}
          </p>
        )}

        {data.ctas && data.ctas.length > 0 && (
          <div className="flex gap-3 justify-center flex-wrap">
            {data.ctas.map((cta, idx) => (
              <Button
                key={cta.id ?? idx}
                asChild
                variant={cta.variant === 'primary' ? 'default' : 'outline'}
                size="lg"
                className={cn(
                  'gap-2 px-7',
                  cta.variant === 'primary' && 'shadow-[0_0_32px_rgba(23,99,255,.38)]'
                )}
              >
                <a
                  href={cta.href}
                  data-jp-item-id={cta.id ?? `cta-${idx}`}
                  data-jp-item-field="ctas"
                  target={cta.href?.startsWith('http') ? '_blank' : undefined}
                  rel={cta.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {cta.variant === 'primary' ? (
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.8 }}>
                      <rect x="2.5" y="2" width="11" height="12" rx="2" stroke="currentColor" strokeWidth="1.4"/>
                      <path d="M5.5 6h5M5.5 9h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.7 }}>
                      <path d="M8 1C4.13 1 1 4.13 1 8c0 3.09 2.01 5.71 4.79 6.63.35.06.48-.15.48-.34v-1.2c-1.95.42-2.36-.94-2.36-.94-.32-.81-.78-1.02-.78-1.02-.64-.43.05-.42.05-.42.7.05 1.07.72 1.07.72.62 1.07 1.64.76 2.04.58.06-.45.24-.76.44-.93-1.56-.18-3.2-.78-3.2-3.47 0-.77.27-1.4.72-1.89-.07-.18-.31-.9.07-1.87 0 0 .59-.19 1.93.72A6.7 6.7 0 0 1 8 5.17c.6 0 1.2.08 1.76.24 1.34-.91 1.93-.72 1.93-.72.38.97.14 1.69.07 1.87.45.49.72 1.12.72 1.89 0 2.7-1.64 3.29-3.2 3.47.25.22.48.65.48 1.31v1.94c0 .19.12.4.48.34C12.99 13.71 15 11.09 15 8c0-3.87-3.13-7-7-7z" fill="currentColor"/>
                    </svg>
                  )}
                  {cta.label}
                </a>
              </Button>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

END_OF_FILE_CONTENT
echo "Creating src/components/cta-banner/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/cta-banner/index.ts"
export * from './View';
export * from './schema';
export * from './types';

END_OF_FILE_CONTENT
echo "Creating src/components/cta-banner/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/cta-banner/schema.ts"
import { z } from 'zod';
import { BaseSectionData, CtaSchema } from '@/lib/base-schemas';

export const CtaBannerSchema = BaseSectionData.extend({
  label:      z.string().optional().describe('ui:text'),
  title:      z.string().describe('ui:text'),
  description: z.string().optional().describe('ui:textarea'),
  cliCommand: z.string().optional().describe('ui:text'),
  ctas:       z.array(CtaSchema).optional().describe('ui:list'),
});

END_OF_FILE_CONTENT
echo "Creating src/components/cta-banner/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/cta-banner/types.ts"
import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { CtaBannerSchema } from './schema';

export type CtaBannerData     = z.infer<typeof CtaBannerSchema>;
export type CtaBannerSettings = z.infer<typeof BaseSectionSettingsSchema>;

END_OF_FILE_CONTENT
mkdir -p "src/components/design-system"
echo "Creating src/components/design-system/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/design-system/View.tsx"
import { useState, useEffect, useRef } from 'react';
import { OlonMark, OlonWordmark } from '@/components/OlonWordmark';
import { cn } from '@/lib/utils';
import type { DesignSystemData, DesignSystemSettings } from './types';

interface DesignSystemViewProps {
  data: DesignSystemData;
  settings?: DesignSystemSettings;
}

const nav = [
  {
    group: 'Foundation',
    links: [
      { id: 'tokens',     label: 'Tokens' },
      { id: 'colors',     label: 'Colors' },
      { id: 'typography', label: 'Typography' },
      { id: 'spacing',    label: 'Spacing & Radius' },
    ],
  },
  {
    group: 'Identity',
    links: [
      { id: 'mark', label: 'Mark & Logo' },
    ],
  },
  {
    group: 'Components',
    links: [
      { id: 'buttons', label: 'Button' },
      { id: 'badges',  label: 'Badge' },
      { id: 'inputs',  label: 'Input' },
      { id: 'cards',   label: 'Card' },
      { id: 'code',    label: 'Code Block' },
    ],
  },
];

const tokenRows: { group: string; rows: { name: string; varName: string; tw: string; swatch?: boolean }[] }[] = [
  {
    group: 'Backgrounds',
    rows: [
      { name: 'background', varName: '--background', tw: 'bg-background', swatch: true },
      { name: 'card', varName: '--card', tw: 'bg-card', swatch: true },
      { name: 'elevated', varName: '--elevated', tw: 'bg-elevated', swatch: true },
    ],
  },
  {
    group: 'Text',
    rows: [
      { name: 'foreground', varName: '--foreground', tw: 'text-foreground', swatch: true },
      { name: 'muted-foreground', varName: '--muted-foreground', tw: 'text-muted-foreground', swatch: true },
    ],
  },
  {
    group: 'Brand',
    rows: [
      { name: 'primary', varName: '--primary', tw: 'bg-primary / text-primary', swatch: true },
      { name: 'primary-foreground', varName: '--primary-foreground', tw: 'text-primary-foreground', swatch: true },
    ],
  },
  {
    group: 'Accent',
    rows: [
      { name: 'accent', varName: '--accent', tw: 'bg-accent / text-accent', swatch: true },
    ],
  },
  {
    group: 'Border',
    rows: [
      { name: 'border', varName: '--border', tw: 'border-border', swatch: true },
      { name: 'border-strong', varName: '--border-strong', tw: 'border-border-strong', swatch: true },
    ],
  },
  {
    group: 'Feedback',
    rows: [
      { name: 'destructive', varName: '--destructive', tw: 'bg-destructive', swatch: true },
      { name: 'success', varName: '--success', tw: 'bg-success', swatch: true },
      { name: 'warning', varName: '--warning', tw: 'bg-warning', swatch: true },
      { name: 'info', varName: '--info', tw: 'bg-info', swatch: true },
    ],
  },
  {
    group: 'Typography',
    rows: [
      { name: 'font-primary', varName: '--theme-font-primary', tw: 'font-primary' },
      { name: 'font-display', varName: '--theme-font-display', tw: 'font-display' },
      { name: 'font-mono', varName: '--theme-font-mono', tw: 'font-mono' },
    ],
  },
];

const ramp = [
  { stop: '50', varName: '--primary-50', dark: false },
  { stop: '100', varName: '--primary-100', dark: false },
  { stop: '200', varName: '--primary-200', dark: false },
  { stop: '300', varName: '--primary-300', dark: false },
  { stop: '400', varName: '--primary-400', dark: true },
  { stop: '500', varName: '--primary-500', dark: true },
  { stop: '600', varName: '--primary-600', dark: true, brand: true },
  { stop: '700', varName: '--primary-700', dark: true },
  { stop: '800', varName: '--primary-800', dark: true },
  { stop: '900', varName: '--primary-900', dark: true },
] as { stop: string; varName: string; dark: boolean; brand?: boolean }[];

const backgroundSwatches = [
  { label: 'Base', varName: '--background', tw: 'bg-background' },
  { label: 'Surface', varName: '--card', tw: 'bg-card' },
  { label: 'Elevated', varName: '--elevated', tw: 'bg-elevated' },
  { label: 'Border', varName: '--border', tw: 'border-border' },
] as const;

const feedbackSwatches = [
  { label: 'Destructive', bgVarName: '--destructive', fgVarName: '--destructive-foreground' },
  { label: 'Success', bgVarName: '--success', fgVarName: '--success-foreground' },
  { label: 'Warning', bgVarName: '--warning', fgVarName: '--warning-foreground' },
  { label: 'Info', bgVarName: '--info', fgVarName: '--info-foreground' },
] as const;

function readCssVar(varName: string): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return value || 'n/a';
}

export function DesignSystemView({ data, settings }: DesignSystemViewProps) {
  const [activeId, setActiveId] = useState('tokens');
  const [cssVars, setCssVars] = useState<Record<string, string>>(settings?.initialCssVars ?? {});
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const allVars = new Set<string>();
    tokenRows.forEach((group) => group.rows.forEach((row) => allVars.add(row.varName)));
    ramp.forEach((item) => allVars.add(item.varName));
    backgroundSwatches.forEach((item) => allVars.add(item.varName));
    allVars.add('--accent');
    feedbackSwatches.forEach((item) => {
      allVars.add(item.bgVarName);
      allVars.add(item.fgVarName);
    });

    const syncVars = () => {
      const next: Record<string, string> = {};
      for (const varName of allVars) next[varName] = readCssVar(varName);
      setCssVars(next);
    };

    syncVars();
    const observer = new MutationObserver(syncVars);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('section[data-ds-id]');
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActiveId(e.target.getAttribute('data-ds-id') ?? '');
          }
        }
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">

      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col fixed top-0 left-0 h-screen w-60 border-r border-border bg-background z-40 overflow-y-auto">
        <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
          <a href="/" className="flex items-center gap-2.5 shrink-0" aria-label="OlonJS home">
            <OlonMark size={22} />
            <span className="text-lg font-display text-accent tracking-[-0.04em] leading-none">
              {data.title ?? 'Olon'}
            </span>
          </a>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-5">
          {nav.map((section) => (
            <div key={section.group}>
              <div className="text-[10px] font-medium tracking-[0.12em] uppercase text-muted-foreground px-3 mb-2">
                {section.group}
              </div>
              {section.links.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className={cn('nav-link w-full text-left', activeId === link.id && 'active')}
                >
                  {link.label}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-border">
          <div className="font-mono-olon text-[11px] text-muted-foreground">
            v1.4 · Labradorite · Merriweather Variable
          </div>
        </div>
      </aside>

      {/* Main */}
      <main ref={mainRef} className="flex-1 lg:ml-60 px-6 lg:px-12 py-12 max-w-4xl">

        {/* Page header */}
        <div className="mb-16">
          <div className="inline-flex items-center text-[11px] font-medium tracking-[0.1em] uppercase text-primary-light bg-primary-900 border border-primary px-3 py-1 rounded-sm mb-6">
            Design System
          </div>
          <div className="mb-3">
            <OlonWordmark markSize={64} />
          </div>
          <p className="font-display text-2xl font-normal text-primary-light tracking-[-0.01em] mb-3">
            Design Language
          </p>
          <p className="text-muted-foreground text-[15px] max-w-lg leading-relaxed">
            A contract layer for the agentic web — and a design system built to communicate it.
            Every token, component, and decision is grounded in the concept of the holon:
            whole in itself, part of something greater.
          </p>
        </div>

        <hr className="ds-divider mb-16" />

        {/* TOKENS */}
        <section id="tokens" data-ds-id="tokens" className="section-anchor mb-16">
          <div className="mb-8">
            <h2 className="text-xl font-medium text-foreground mb-1">Token Reference</h2>
            <p className="text-sm text-muted-foreground">
              All tokens defined in{' '}
              <code className="code-inline">theme.json</code>
              {' '}and bridged via{' '}
              <code className="code-inline">index.css</code>.
            </p>
          </div>
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-elevated border-b border-border">
                  {['Token', 'CSS var', 'Value', 'Tailwind class'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tokenRows.map((group) => (
                  <>
                    <tr key={group.group} className="border-b border-border">
                      <td colSpan={4} className="px-4 py-2 text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground bg-card">
                        {group.group}
                      </td>
                    </tr>
                    {group.rows.map((row) => (
                      <tr key={row.name} className="border-b border-border hover:bg-elevated transition-colors">
                        <td className="px-4 py-3 text-foreground font-medium text-sm">{row.name}</td>
                        <td className="px-4 py-3 font-mono-olon text-xs text-primary-light">{row.varName}</td>
                        <td className="px-4 py-3 font-mono-olon text-xs text-muted-foreground">
                          <span className="flex items-center gap-2">
                            {row.swatch && (
                              <span className="inline-block w-3 h-3 rounded-sm border border-border-strong shrink-0" style={{ background: `var(${row.varName})` }} />
                            )}
                            {cssVars[row.varName] ?? 'n/a'}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono-olon text-xs text-accent">{row.tw}</td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <hr className="ds-divider mb-16" />

        {/* COLORS */}
        <section id="colors" data-ds-id="colors" className="section-anchor mb-16">
          <div className="mb-8">
            <h2 className="text-xl font-medium text-foreground mb-1">Color System</h2>
            <p className="text-sm text-muted-foreground">Labradorite brand ramp + semantic layer. Dark-first. Every stop has a role.</p>
          </div>
          <div className="mb-6">
            <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-3">Backgrounds</div>
            <div className="grid grid-cols-4 gap-2">
              {backgroundSwatches.map((s) => (
                <div key={s.label}>
                  <div className="h-14 rounded-md border border-border-strong" style={{ background: `var(${s.varName})` }} />
                  <div className="mt-2">
                    <div className="text-xs font-medium text-foreground">{s.label}</div>
                    <div className="font-mono-olon text-[11px] text-muted-foreground">{cssVars[s.varName] ?? 'n/a'}</div>
                    <div className="font-mono-olon text-[10px] text-primary-light">{s.tw}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-3">Brand Ramp — Labradorite</div>
            <div className="flex rounded-lg overflow-hidden h-16 border border-border">
              {ramp.map((s) => (
                <div key={s.stop} className="flex-1 flex flex-col justify-end p-1.5 relative" style={{ background: `var(${s.varName})` }}>
                  <span className="font-mono-olon text-[9px] font-medium" style={{ color: s.dark ? '#EDE8F8' : '#3D2770' }}>
                    {s.stop}
                  </span>
                  {s.brand && (
                    <span className="absolute top-1 right-1 text-[8px] font-medium text-primary-200 font-mono-olon">brand</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-3">Accent — Parchment</div>
              <div className="h-14 rounded-md border border-border" style={{ background: 'var(--accent)' }} />
              <div className="mt-2">
                <div className="text-xs font-medium text-foreground">Accent</div>
                <div className="font-mono-olon text-[11px] text-muted-foreground">{cssVars['--accent'] ?? 'n/a'}</div>
                <div className="font-mono-olon text-[10px] text-primary-light">text-accent</div>
              </div>
            </div>
            <div>
              <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-3">Feedback</div>
              <div className="space-y-2">
                {feedbackSwatches.map((f) => (
                  <div key={f.label} className="flex items-center gap-3 px-3 py-2 rounded-md" style={{ background: `var(${f.bgVarName})` }}>
                    <span className="text-[12px] font-medium" style={{ color: `var(${f.fgVarName})` }}>{f.label}</span>
                    <span className="font-mono-olon text-[10px] ml-auto" style={{ color: `var(${f.fgVarName})` }}>
                      {cssVars[f.bgVarName] ?? 'n/a'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <hr className="ds-divider mb-16" />

        {/* TYPOGRAPHY */}
        <section id="typography" data-ds-id="typography" className="section-anchor mb-16">
          <div className="mb-8">
            <h2 className="text-xl font-medium text-foreground mb-1">Typography</h2>
            <p className="text-sm text-muted-foreground">Three typefaces, three voices. Built on contrast.</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 mb-4">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-1">Display · font-display</div>
                <div className="text-sm font-medium text-foreground">Merriweather Variable</div>
              </div>
              <span className="font-mono-olon text-[11px] text-muted-foreground border border-border px-2 py-1 rounded-sm">Google Fonts</span>
            </div>
            <div className="space-y-4 border-t border-border pt-5">
              <div className="font-display text-5xl font-normal text-foreground leading-none">The contract layer</div>
              <div className="font-display text-3xl font-normal text-primary-light leading-tight italic">for the agentic web.</div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 mb-4">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-1">UI · font-primary</div>
                <div className="text-sm font-medium text-foreground">Geist</div>
              </div>
              <span className="font-mono-olon text-[11px] text-muted-foreground border border-border px-2 py-1 rounded-sm">400 · 500</span>
            </div>
            <div className="border-t border-border pt-5">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div><div className="text-[10px] text-muted-foreground mb-2">15px / 400</div><div className="text-foreground">Machine-readable endpoints.</div></div>
                <div><div className="text-[10px] text-muted-foreground mb-2">13px / 500</div><div className="text-[13px] font-medium text-foreground">Schema contracts.</div></div>
                <div><div className="text-[10px] text-muted-foreground mb-2">11px / 400 · muted</div><div className="text-[11px] text-muted-foreground">Governance, audit.</div></div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-1">Code · font-mono</div>
                <div className="text-sm font-medium text-foreground">Geist Mono</div>
              </div>
            </div>
            <div className="border-t border-border pt-5 space-y-1.5">
              <div className="font-mono-olon text-sm"><span className="syntax-keyword">import</span> <span className="text-accent">Olon</span> <span className="syntax-keyword">from</span> <span className="syntax-string">'olonjs'</span></div>
              <div className="font-mono-olon text-sm text-muted-foreground"><span className="syntax-keyword">const</span> <span className="text-foreground">page</span> = <span className="text-accent">Olon</span>.<span className="text-primary-light">contract</span>(<span className="syntax-string">'/about.json'</span>)</div>
            </div>
          </div>
        </section>

        <hr className="ds-divider mb-16" />

        {/* SPACING & RADIUS */}
        <section id="spacing" data-ds-id="spacing" className="section-anchor mb-16">
          <div className="mb-8">
            <h2 className="text-xl font-medium text-foreground mb-1">Spacing & Radius</h2>
            <p className="text-sm text-muted-foreground">Radius scale is deliberate — corners communicate hierarchy.</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { token: 'radius-sm · 4px',  r: 4,  desc: 'Badges, tags, chips.' },
              { token: 'radius-md · 8px',  r: 8,  desc: 'Inputs, buttons, inline.' },
              { token: 'radius-lg · 12px', r: 12, desc: 'Cards, panels, modals.' },
            ].map((item) => (
              <div key={item.r} className="rounded-lg border border-border bg-card p-5">
                <div className="w-full h-14 border border-primary bg-primary-900 mb-4" style={{ borderRadius: item.r }} />
                <div className="font-mono-olon text-xs text-primary-light mb-1">{item.token}</div>
                <div className="text-xs text-muted-foreground">{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <hr className="ds-divider mb-16" />

        {/* MARK & LOGO */}
        <section id="mark" data-ds-id="mark" className="section-anchor mb-16">
          <div className="mb-8">
            <h2 className="text-xl font-medium text-foreground mb-1">Mark & Logo</h2>
            <p className="text-sm text-muted-foreground">The mark is a holon: a nucleus held inside a ring. Two circles, one concept.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="rounded-lg border border-border bg-card p-8 flex flex-col items-center gap-4">
              <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground">Mark · Dark</div>
              <OlonMark size={64} />
            </div>
            <div className="rounded-lg border border-border bg-elevated p-8 flex flex-col items-center gap-4">
              <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground">Mark · Mono</div>
              <svg width="64" height="64" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="38" stroke="#F2EDE6" strokeWidth="20" />
                <circle cx="50" cy="50" r="15" fill="#F2EDE6" />
              </svg>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 space-y-6">
            <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground">Logo Lockups</div>
            <div>
              <div className="text-xs text-muted-foreground mb-3">Standard (nav, sidebar ≥ 18px)</div>
              <OlonWordmark markSize={36} />
            </div>
            <div className="border-t border-border pt-5">
              <div className="text-xs text-muted-foreground mb-3">Hero display (marketing · ≥ 48px)</div>
              <OlonWordmark markSize={64} />
            </div>
          </div>
        </section>

        <hr className="ds-divider mb-16" />

        {/* BUTTON */}
        <section id="buttons" data-ds-id="buttons" className="section-anchor mb-16">
          <div className="mb-8">
            <h2 className="text-xl font-medium text-foreground mb-1">Button</h2>
            <p className="text-sm text-muted-foreground">Five variants. All use semantic tokens — no hardcoded colors.</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 space-y-6">
            {[
              {
                label: 'Default (primary)',
                buttons: [
                  <button key="1" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity">Get started</button>,
                ],
              },
              {
                label: 'Accent (CTA)',
                buttons: [
                  <button key="1" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-accent text-accent-foreground rounded-md hover:opacity-90 transition-opacity">Get started →</button>,
                ],
              },
              {
                label: 'Secondary (outline)',
                buttons: [
                  <button key="1" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-transparent text-primary-light border border-primary rounded-md hover:bg-primary-900 transition-colors">Documentation</button>,
                  <button key="2" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-transparent text-foreground border border-border rounded-md hover:bg-elevated transition-colors">View on GitHub</button>,
                ],
              },
              {
                label: 'Ghost',
                buttons: [
                  <button key="1" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-transparent text-muted-foreground hover:text-foreground hover:bg-elevated rounded-md transition-colors">Cancel</button>,
                ],
              },
            ].map((group, i, arr) => (
              <div key={group.label} className={i < arr.length - 1 ? 'border-b border-border pb-6' : ''}>
                <div className="text-xs text-muted-foreground mb-4">{group.label}</div>
                <div className="flex flex-wrap gap-3">{group.buttons}</div>
              </div>
            ))}
          </div>
        </section>

        <hr className="ds-divider mb-16" />

        {/* BADGE */}
        <section id="badges" data-ds-id="badges" className="section-anchor mb-16">
          <div className="mb-8">
            <h2 className="text-xl font-medium text-foreground mb-1">Badge</h2>
            <p className="text-sm text-muted-foreground">Status, versioning, feature flags. Small but precise.</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium bg-primary-900 text-primary-light border border-primary rounded-sm">Stable</span>
              <span className="inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium bg-primary-900 text-primary-200 border border-primary-800 rounded-sm">OSS</span>
              <span className="inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium bg-elevated text-muted-foreground border border-border rounded-sm">v1.4</span>
              <span className="inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium bg-primary text-primary-foreground rounded-sm">New</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-medium bg-elevated text-muted-foreground border border-border rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-success-indicator inline-block" />
                Deployed
              </span>
            </div>
          </div>
        </section>

        <hr className="ds-divider mb-16" />

        {/* INPUT */}
        <section id="inputs" data-ds-id="inputs" className="section-anchor mb-16">
          <div className="mb-8">
            <h2 className="text-xl font-medium text-foreground mb-1">Input</h2>
            <p className="text-sm text-muted-foreground">Form elements. Precision over decoration.</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 space-y-5">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Tenant slug</label>
              <input type="text" placeholder="my-tenant" className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Schema version <span className="text-destructive-foreground ml-1">Invalid format</span>
              </label>
              <input type="text" defaultValue="1.x.x" className="w-full px-3 py-2 text-sm bg-background border border-destructive-border rounded-md text-foreground focus:outline-none focus:border-destructive-ring focus:ring-1 focus:ring-destructive-ring transition-colors" />
              <p className="mt-1.5 text-xs text-destructive-foreground">Must follow semver (e.g. 1.4.0)</p>
            </div>
          </div>
        </section>

        <hr className="ds-divider mb-16" />

        {/* CARD */}
        <section id="cards" data-ds-id="cards" className="section-anchor mb-16">
          <div className="mb-8">
            <h2 className="text-xl font-medium text-foreground mb-1">Card</h2>
            <p className="text-sm text-muted-foreground">The primary container primitive. Three elevation levels.</p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-4">Default · bg-card</div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-medium text-foreground mb-1">JsonPages contract</div>
                  <div className="text-xs text-muted-foreground">Tenant: acme-corp · 4 routes · Last sync 2m ago</div>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium bg-primary-900 text-primary-light border border-primary rounded-sm">Active</span>
              </div>
            </div>
            <div className="rounded-lg border border-border-strong bg-elevated p-5">
              <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-4">Elevated · bg-elevated</div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-md bg-primary-900 border border-primary flex items-center justify-center shrink-0">
                  <OlonMark size={18} />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">OlonJS Enterprise</div>
                  <div className="text-xs text-muted-foreground mt-0.5">NX monorepo · Private cloud · SOC2 ready</div>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-primary bg-primary-900 p-5">
              <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-primary-light mb-4">Accent · border-primary bg-primary-900</div>
              <div className="font-display text-lg font-normal text-foreground mb-2">
                Ship your first tenant in hours,<br />
                <em className="not-italic text-accent">not weeks.</em>
              </div>
              <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity">
                Start building →
              </button>
            </div>
          </div>
        </section>

        <hr className="ds-divider mb-16" />

        {/* CODE BLOCK */}
        <section id="code" data-ds-id="code" className="section-anchor mb-16">
          <div className="mb-8">
            <h2 className="text-xl font-medium text-foreground mb-1">Code Block</h2>
            <p className="text-sm text-muted-foreground">Developer-first. Syntax highlighting uses brand ramp stops only.</p>
          </div>
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-elevated border-b border-border">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-border-strong" />
                <span className="w-2.5 h-2.5 rounded-full bg-border-strong" />
                <span className="w-2.5 h-2.5 rounded-full bg-border-strong" />
              </div>
              <span className="font-mono-olon text-[11px] text-muted-foreground">olon.config.ts</span>
              <button className="font-mono-olon text-[11px] text-muted-foreground hover:text-foreground transition-colors">Copy</button>
            </div>
            <div className="bg-card px-5 py-5 overflow-x-auto">
              <pre className="font-mono-olon text-sm leading-relaxed">
                <code>
                  <span className="syntax-keyword">import</span>{' '}
                  <span className="text-foreground">{'{ defineConfig }'}</span>{' '}
                  <span className="syntax-keyword">from</span>{' '}
                  <span className="syntax-string">'olonjs'</span>
                  {'\n\n'}
                  <span className="syntax-keyword">export default</span>{' '}
                  <span className="syntax-value">defineConfig</span>
                  <span className="text-foreground">{'({'}</span>
                  {'\n  '}
                  <span className="syntax-property">tenants</span>
                  <span className="text-foreground">{': [{'}</span>
                  {'\n    '}
                  <span className="syntax-property">slug</span>
                  <span className="text-foreground">{': '}</span>
                  <span className="syntax-string">'olon-ds'</span>
                  {'\n  '}
                  <span className="text-foreground">{'}]'}</span>
                  {'\n'}
                  <span className="text-foreground">{'}'}</span>
                </code>
              </pre>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

END_OF_FILE_CONTENT
echo "Creating src/components/design-system/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/design-system/index.ts"
export * from './View';
export * from './schema';
export * from './types';

END_OF_FILE_CONTENT
echo "Creating src/components/design-system/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/design-system/schema.ts"
import { z } from 'zod';
import { BaseSectionData } from '@/lib/base-schemas';

export const DesignSystemSchema = BaseSectionData.extend({
  title: z.string().optional().describe('ui:text'),
});

export const DesignSystemSettingsSchema = z.object({
  /** Pre-resolved CSS var map injected at SSG bake time. Keys are var names (e.g. "--background"), values are resolved hex strings. */
  initialCssVars: z.record(z.string()).optional(),
});

END_OF_FILE_CONTENT
echo "Creating src/components/design-system/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/design-system/types.ts"
import { z } from 'zod';
import { DesignSystemSchema, DesignSystemSettingsSchema } from './schema';

export type DesignSystemData     = z.infer<typeof DesignSystemSchema>;
export type DesignSystemSettings = z.infer<typeof DesignSystemSettingsSchema>;

END_OF_FILE_CONTENT
mkdir -p "src/components/devex"
echo "Creating src/components/devex/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/devex/View.tsx"
import React from 'react';
import type { DevexData, DevexSettings } from './types';

const ENDPOINTS = [
  '/homepage.json',
  '/products/shoes.json',
  '/blog/ai-agents.json',
  '/contact.json',
] as const;

export const Devex: React.FC<{ data: DevexData; settings?: DevexSettings }> = ({ data }) => {
  return (
    <section id="developer-velocity" className="jp-devex py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="max-w-[1040px] mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">

        {/* LEFT */}
        <div>
          {data.label && (
            <div className="inline-flex items-center gap-2 text-[10.5px] font-mono font-bold uppercase tracking-[.12em] text-muted-foreground/60 mb-5">
              <span className="w-[18px] h-px bg-border" aria-hidden />
              {data.label}
            </div>
          )}
          <h2
            className="font-display font-bold tracking-[-0.03em] leading-[1.15] text-foreground mb-5"
            style={{ fontSize: 'clamp(24px, 3.5vw, 36px)' }}
            data-jp-field="title"
          >
            {data.title}
          </h2>
          {data.description && (
            <p
              className="text-[14px] text-muted-foreground leading-[1.78] mb-6"
              data-jp-field="description"
            >
              {data.description}
            </p>
          )}

          {data.features && data.features.length > 0 && (
            <ul className="flex flex-col mb-8" data-jp-field="features">
              {data.features.map((f, idx) => (
                <li
                  key={(f as { id?: string }).id ?? idx}
                  className="flex items-start gap-2.5 text-[13.5px] text-muted-foreground py-3 border-b border-border last:border-b-0 hover:text-foreground hover:pl-1 transition-all"
                  data-jp-item-id={(f as { id?: string }).id ?? `f-${idx}`}
                  data-jp-item-field="features"
                >
                  <span className="flex-shrink-0 w-[18px] h-[18px] rounded-sm bg-primary/10 flex items-center justify-center mt-0.5">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5.5L4 7.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"/>
                    </svg>
                  </span>
                  {f.text}
                </li>
              ))}
            </ul>
          )}

          {data.stats && data.stats.length > 0 && (
            <div className="flex gap-7 flex-wrap" data-jp-field="stats">
              {data.stats.map((stat, idx) => (
                <div
                  key={(stat as { id?: string }).id ?? idx}
                  className="flex flex-col gap-0.5"
                  data-jp-item-id={(stat as { id?: string }).id ?? `st-${idx}`}
                  data-jp-item-field="stats"
                >
                  <span
                    className="text-[28px] font-bold tracking-[-0.03em] leading-none bg-gradient-to-br from-[#84ABFF] to-[#1763FF] bg-clip-text text-transparent"
                    data-jp-item-field="value"
                  >
                    {stat.value}
                  </span>
                  <span className="text-[11.5px] text-muted-foreground/60 font-medium" data-jp-item-field="label">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — Endpoint display window */}
        <div
          className="rounded-xl border border-border overflow-hidden"
          style={{ background: '#060d14', boxShadow: '0 24px 56px rgba(0,0,0,.35)' }}
        >
          <div className="flex items-center gap-1.5 px-4 py-3 bg-card border-b border-border">
            <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
            <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
            <span className="w-2 h-2 rounded-full bg-[#10b981]" />
            <span className="flex-1 text-center font-mono text-[11px] text-muted-foreground/60">
              canonical endpoints
            </span>
            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
              GET
            </span>
          </div>
          <div className="px-4 py-4">
            {ENDPOINTS.map((ep, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg mb-0.5 hover:bg-muted/20 transition-colors"
              >
                <span className="font-mono text-[12.5px] text-[#84ABFF] flex-1">{ep}</span>
                <span className="text-[11px] text-muted-foreground/40">→</span>
                <span className="font-mono text-[10.5px] text-emerald-500">200 OK</span>
              </div>
            ))}
            <div className="mt-3.5 mx-2.5 p-3.5 bg-muted/20 rounded-lg border border-border">
              <div className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-[.08em] mb-2">
                Contract
              </div>
              <div className="font-mono text-[11.5px] text-muted-foreground leading-[1.8]">
                <span className="text-[#84ABFF]">slug</span>
                {' · '}
                <span className="text-[#84ABFF]">meta</span>
                {' · '}
                <span className="text-[#84ABFF]">sections[]</span>
                <br />
                <span className="text-emerald-500">type-safe</span>
                {' · '}
                <span className="text-emerald-500">versioned</span>
                {' · '}
                <span className="text-emerald-500">schema-validated</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

END_OF_FILE_CONTENT
echo "Creating src/components/devex/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/devex/index.ts"
export * from './View';
export * from './schema';
export * from './types';

END_OF_FILE_CONTENT
echo "Creating src/components/devex/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/devex/schema.ts"
import { z } from 'zod';
import { BaseSectionData, BaseArrayItem } from '@/lib/base-schemas';

const FeatureSchema = BaseArrayItem.extend({
  text: z.string().describe('ui:text'),
});

const StatSchema = BaseArrayItem.extend({
  value: z.string().describe('ui:text'),
  label: z.string().describe('ui:text'),
});

export const DevexSchema = BaseSectionData.extend({
  label:       z.string().optional().describe('ui:text'),
  title:       z.string().describe('ui:text'),
  description: z.string().optional().describe('ui:textarea'),
  features:    z.array(FeatureSchema).optional().describe('ui:list'),
  stats:       z.array(StatSchema).optional().describe('ui:list'),
});

END_OF_FILE_CONTENT
echo "Creating src/components/devex/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/devex/types.ts"
import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { DevexSchema } from './schema';

export type DevexData     = z.infer<typeof DevexSchema>;
export type DevexSettings = z.infer<typeof BaseSectionSettingsSchema>;

END_OF_FILE_CONTENT
mkdir -p "src/components/docs-layout"
mkdir -p "src/components/feature-grid"
echo "Creating src/components/feature-grid/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/feature-grid/View.tsx"
import type { CSSProperties } from 'react';
import type { FeatureGridData, FeatureGridSettings } from './types';

interface FeatureGridViewProps {
  data: FeatureGridData;
  settings?: FeatureGridSettings;
}

export function FeatureGrid({ data, settings }: FeatureGridViewProps) {
  const columns = settings?.columns ?? 3;
  const cards = data.cards ?? [];
  const tiers = data.tiers ?? [];

  const colClass =
    columns === 2 ? 'sm:grid-cols-2' :
    columns === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' :
    'sm:grid-cols-2 lg:grid-cols-3';

  return (
    <section
      id="features"
      className="py-24 px-6 border-t border-border section-anchor"
      style={{
        '--local-bg': 'var(--background)',
        '--local-text': 'var(--foreground)',
        '--local-text-muted': 'var(--muted-foreground)',
        '--local-border': 'var(--border)',
      } as CSSProperties}
    >
      <div className="max-w-4xl mx-auto">

        {/* Section header */}
        <div className="max-w-xl mb-16">
          {data.label && (
            <p className="font-mono-olon text-xs font-medium tracking-label uppercase text-muted-foreground mb-5" data-jp-field="label">
              {data.label}
            </p>
          )}
          <h2 className="font-display font-normal text-foreground leading-tight tracking-tight mb-5" data-jp-field="sectionTitle">
            {data.sectionTitle}
            {data.sectionTitleItalic && (
              <>
                <br />
                <em className="not-italic text-primary-light" data-jp-field="sectionTitleItalic">{data.sectionTitleItalic}</em>
              </>
            )}
          </h2>
          {data.sectionLead && (
            <p className="text-base text-muted-foreground leading-relaxed" data-jp-field="sectionLead">
              {data.sectionLead}
            </p>
          )}
        </div>

        {/* Feature grid */}
        <div className={`grid grid-cols-1 ${colClass} gap-px bg-border`}>
          {cards.map((card) => {
            return (
              <div
                key={card.id ?? card.title}
                data-jp-item-id={card.id ?? card.title}
                data-jp-item-field="cards"
                className="bg-background p-7 flex flex-col gap-4 group hover:bg-card transition-colors duration-200"
              >
                {card.icon && (
                  <img
                    src={card.icon.url}
                    alt={card.icon.alt ?? ''}
                    aria-hidden={card.icon.alt ? undefined : true}
                    data-jp-field="icon"
                    className="w-10 h-10 shrink-0"
                  />
                )}
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-2 leading-snug" data-jp-field="title">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed" data-jp-field="description">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Proof strip */}
        {(data.proofStatement || tiers.length > 0) && (
          <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 px-7 py-5 rounded-lg border border-border bg-card">
            {data.proofStatement && (
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground mb-0.5">
                  <span data-jp-field="proofStatement">{data.proofStatement}</span>
                </p>
                {data.proofSub && (
                  <p className="text-[12px] text-muted-foreground" data-jp-field="proofSub">
                    {data.proofSub}
                  </p>
                )}
              </div>
            )}
            {tiers.length > 0 && (
              <div className="flex items-center gap-4 shrink-0">
                {tiers.map((tier) => (
                  <div
                    key={tier.id ?? tier.label}
                    data-jp-item-id={tier.id ?? tier.label}
                    data-jp-item-field="tiers"
                    className="text-center"
                  >
                    <div className="text-xs font-medium text-foreground" data-jp-field="label">{tier.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

END_OF_FILE_CONTENT
echo "Creating src/components/feature-grid/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/feature-grid/index.ts"
export * from './View';
export * from './schema';
export * from './types';

END_OF_FILE_CONTENT
echo "Creating src/components/feature-grid/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/feature-grid/schema.ts"
import { z } from 'zod';
import { BaseSectionData, BaseArrayItem, ImageSelectionSchema } from '@/lib/base-schemas';

export const FeatureCardSchema = BaseArrayItem.extend({
  icon:        ImageSelectionSchema.optional().describe('ui:image-picker'),
  title:       z.string().describe('ui:text'),
  description: z.string().describe('ui:textarea'),
});

export const ProofTierSchema = BaseArrayItem.extend({
  label: z.string().describe('ui:text'),
});

export const FeatureGridSchema = BaseSectionData.extend({
  label:              z.string().optional().describe('ui:text'),
  sectionTitle:       z.string().describe('ui:text'),
  sectionTitleItalic: z.string().optional().describe('ui:text'),
  sectionLead:        z.string().optional().describe('ui:textarea'),
  cards:              z.array(FeatureCardSchema).describe('ui:list'),
  proofStatement:     z.string().optional().describe('ui:text'),
  proofSub:           z.string().optional().describe('ui:text'),
  tiers:              z.array(ProofTierSchema).optional().describe('ui:list'),
});

export const FeatureGridSettingsSchema = z.object({
  columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).default(3).describe('ui:number'),
});

END_OF_FILE_CONTENT
echo "Creating src/components/feature-grid/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/feature-grid/types.ts"
import { z } from 'zod';
import { FeatureGridSchema, FeatureGridSettingsSchema } from './schema';

export type FeatureGridData     = z.infer<typeof FeatureGridSchema>;
export type FeatureGridSettings = z.infer<typeof FeatureGridSettingsSchema>;

END_OF_FILE_CONTENT
mkdir -p "src/components/footer"
echo "Creating src/components/footer/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/footer/View.tsx"
import { OlonMark } from '@/components/OlonWordmark';
import type { FooterData, FooterSettings } from './types';

interface FooterViewProps {
  data: FooterData;
  settings?: FooterSettings;
}

export function Footer({ data, settings }: FooterViewProps) {
  const showLogo = settings?.showLogo ?? true;
  const links = data.links ?? [];

  return (
    <footer className="border-t border-border px-6 py-8">
      <div className="max-w-6xl px-6 mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          {showLogo && (
            <div className="flex items-center gap-2.5">
              <OlonMark size={18} />
              <span className="text-base  font-display text-foreground tracking-[-0.02em]">
                {data.brandText}
              </span>
            </div>
          )}
          {links.length > 0 && (
            <div className="flex items-center gap-4">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[12px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
              {data.designSystemHref && (
                <a
                  href={data.designSystemHref}
                  className="text-[12px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  Design System
                </a>
              )}
            </div>
          )}
        </div>
        <span className="font-mono-olon text-[11px] text-muted-foreground">
          {data.copyright}
        </span>
      </div>
    </footer>
  );
}

END_OF_FILE_CONTENT
echo "Creating src/components/footer/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/footer/index.ts"
export * from './View';
export * from './schema';
export * from './types';

END_OF_FILE_CONTENT
echo "Creating src/components/footer/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/footer/schema.ts"
import { z } from 'zod';

export const FooterSchema = z.object({
  brandText:        z.string().describe('ui:text'),
  copyright:        z.string().describe('ui:text'),
  links: z.array(z.object({
    label: z.string().describe('ui:text'),
    href:  z.string().describe('ui:text'),
  })).optional().describe('ui:list'),
  designSystemHref: z.string().optional().describe('ui:text'),
});

export const FooterSettingsSchema = z.object({
  showLogo: z.boolean().default(true).describe('ui:checkbox'),
});

END_OF_FILE_CONTENT
echo "Creating src/components/footer/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/footer/types.ts"
import { z } from 'zod';
import { FooterSchema, FooterSettingsSchema } from './schema';

export type FooterData     = z.infer<typeof FooterSchema>;
export type FooterSettings = z.infer<typeof FooterSettingsSchema>;

END_OF_FILE_CONTENT
mkdir -p "src/components/git-section"
echo "Creating src/components/git-section/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/git-section/View.tsx"
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { GitSectionData, GitSectionSettings } from './types';

export const GitSection: React.FC<{
  data: GitSectionData;
  settings?: GitSectionSettings;
}> = ({ data }) => {
  return (
    <div
      id="why"
      className="jp-git-section border-y border-border bg-card py-20"
    >
      <div className="max-w-[1040px] mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-16 items-center">

          {/* Left: title */}
          <div>
            {data.label && (
              <div className="inline-flex items-center gap-2 text-[10.5px] font-mono font-bold uppercase tracking-[.12em] text-muted-foreground/60 mb-4">
                <span className="w-[18px] h-px bg-border" aria-hidden />
                {data.label}
              </div>
            )}
            <h2
              className="font-display font-bold tracking-[-0.03em] leading-[1.2] text-foreground"
              style={{ fontSize: 'clamp(26px, 3.5vw, 34px)' }}
              data-jp-field="title"
            >
              {data.title}
              {data.titleAccent && (
                <>
                  <br />
                  <span
                    className="bg-gradient-to-br from-[#84ABFF] to-[#1763FF] bg-clip-text text-transparent"
                    data-jp-field="titleAccent"
                  >
                    {data.titleAccent}
                  </span>
                </>
              )}
            </h2>
          </div>

          {/* Right: 2×2 card grid */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            data-jp-field="cards"
          >
            {data.cards?.map((card, idx) => (
              <Card
                key={(card as { id?: string }).id ?? idx}
                className="bg-background border-border p-5"
                data-jp-item-id={(card as { id?: string }).id ?? `wc-${idx}`}
                data-jp-item-field="cards"
              >
                <CardContent className="p-0">
                  <div className="text-[13px] font-semibold text-foreground mb-1.5">
                    {card.title}
                  </div>
                  <p className="text-[12.5px] text-muted-foreground leading-[1.6]">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

END_OF_FILE_CONTENT
echo "Creating src/components/git-section/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/git-section/index.ts"
export * from './View';
export * from './schema';
export * from './types';

END_OF_FILE_CONTENT
echo "Creating src/components/git-section/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/git-section/schema.ts"
import { z } from 'zod';
import { BaseSectionData, BaseArrayItem } from '@/lib/base-schemas';

const WhyCardSchema = BaseArrayItem.extend({
  title: z.string().describe('ui:text'),
  description: z.string().describe('ui:textarea'),
});

export const GitSectionSchema = BaseSectionData.extend({
  label: z.string().optional().describe('ui:text'),
  title: z.string().describe('ui:text'),
  titleAccent: z.string().optional().describe('ui:text'),
  cards: z.array(WhyCardSchema).describe('ui:list'),
});

END_OF_FILE_CONTENT
echo "Creating src/components/git-section/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/git-section/types.ts"
import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { GitSectionSchema } from './schema';

export type GitSectionData     = z.infer<typeof GitSectionSchema>;
export type GitSectionSettings = z.infer<typeof BaseSectionSettingsSchema>;

END_OF_FILE_CONTENT
mkdir -p "src/components/header"
echo "Creating src/components/header/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/header/View.tsx"
import { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { OlonMark } from '@/components/OlonWordmark';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
import type { HeaderData, HeaderSettings } from './types';
import type { MenuItem } from '@olonjs/core';

interface NavChild {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href: string;
  variant?: string;
  children?: NavChild[];
}

interface HeaderViewProps {
  data: HeaderData;
  settings?: HeaderSettings;
  menu: MenuItem[];
}

function isMenuRef(value: unknown): value is { $ref: string } {
  if (!value || typeof value !== 'object') return false;
  const rec = value as Record<string, unknown>;
  return typeof rec.$ref === 'string' && rec.$ref.trim().length > 0;
}

function toNavItem(raw: unknown): NavItem | null {
  if (!raw || typeof raw !== 'object') return null;
  const rec = raw as Record<string, unknown>;
  if (typeof rec.label !== 'string' || typeof rec.href !== 'string') return null;
  const children = Array.isArray(rec.children)
    ? (rec.children as unknown[])
        .map((c) => toNavItem(c))
        .filter((c): c is NavChild => c !== null)
    : undefined;
  const variant = typeof rec.variant === 'string' ? rec.variant : undefined;
  return { label: rec.label, href: rec.href, ...(variant ? { variant } : {}), ...(children && children.length > 0 ? { children } : {}) };
}

export function Header({ data, settings, menu }: HeaderViewProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const isSticky = settings?.sticky ?? true;
  const navRef = useRef<HTMLElement>(null);

  const linksField = data.links as unknown;
  const rawLinks = Array.isArray(linksField) ? linksField : [];
  const menuItems = Array.isArray(menu) ? (menu as unknown[]) : [];
  // If tenant explicitly uses a JSON ref for links, resolve from menu config.
  const source =
    isMenuRef(linksField)
      ? menuItems
      : (rawLinks.length > 0 ? rawLinks : menuItems);
  const navItems: NavItem[] = source.map(toNavItem).filter((i): i is NavItem => i !== null);

  useEffect(() => {
    if (!openDropdown) return;
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [openDropdown]);

  return (
    <header
      className={cn(
        'top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-md',
        isSticky ? 'fixed' : 'relative'
      )}
    >
      <div className="max-w-6xl mx-auto px-6 h-18 flex items-center gap-8">

        {/* Logo */}
        <a href="/" className="flex items-center gap-2 shrink-0" aria-label="OlonJS home">
          <OlonMark size={26} className="mb-0.5" />
          <span
            className="text-2xl text-accent leading-none"
            style={{
              fontFamily:           'var(--wordmark-font)',
              letterSpacing:        'var(--wordmark-tracking)',
              fontWeight:           'var(--wordmark-weight)',
              fontVariationSettings: '"wdth" var(--wordmark-width)',
            }}
          >
            {data.logoText}
          </span>
          {data.badge && (
            <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium font-mono-olon bg-primary-900 text-primary-light border border-primary-800 rounded-sm">
              {data.badge}
            </span>
          )}
        </a>

        {/* Desktop nav */}
        <nav ref={navRef} className="hidden md:flex items-center gap-0.5 flex-1">
          {navItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isOpen = openDropdown === item.label;
            const isSecondary = item.variant === 'secondary';

            if (isSecondary) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-1 px-3 py-1.5 text-[13px] text-muted-foreground hover:text-foreground rounded-md border border-border bg-elevated hover:bg-elevated/70 transition-colors duration-150"
                >
                  {item.label}
                </a>
              );
            }

            if (!hasChildren) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-1 px-3 py-1.5 text-[13px] text-muted-foreground hover:text-foreground rounded-md transition-colors duration-150 hover:bg-elevated"
                >
                  {item.label}
                </a>
              );
            }

            return (
              <div key={item.label} className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDropdown(isOpen ? null : item.label)}
                  className={cn(
                    'flex items-center gap-1 px-3 py-1.5 text-[13px] rounded-md transition-colors duration-150',
                    isOpen ? 'text-foreground bg-elevated' : 'text-muted-foreground hover:text-foreground hover:bg-elevated'
                  )}
                  aria-expanded={hasChildren ? isOpen : undefined}
                >
                  {item.label}
                  {hasChildren && (
                    <ChevronDown
                      size={11}
                      className={cn('opacity-40 mt-px transition-transform duration-150', isOpen && 'rotate-180 opacity-70')}
                    />
                  )}
                </button>

                {hasChildren && (
                  <div
                    className={cn(
                      'absolute left-0 top-[calc(100%+8px)] min-w-[220px] rounded-lg border border-border bg-card shadow-lg shadow-black/20 overflow-hidden',
                      'transition-all duration-150 origin-top-left',
                      isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
                    )}
                  >
                    <div className="p-1.5">
                      {item.children!.map((child, i) => (
                        <a
                          key={child.label}
                          href={child.href}
                          onClick={() => setOpenDropdown(null)}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] text-muted-foreground hover:text-foreground hover:bg-elevated transition-colors duration-100 group',
                            i < item.children!.length - 1 && ''
                          )}
                        >
                          <span className="w-6 h-6 rounded-md bg-primary-900 border border-primary-800 flex items-center justify-center shrink-0 text-[10px] font-medium font-mono-olon text-primary-light group-hover:border-primary transition-colors">
                            {child.label.slice(0, 2).toUpperCase()}
                          </span>
                          <span className="font-medium">{child.label}</span>
                        </a>
                      ))}
                    </div>
                    <div className="px-3 py-2 border-t border-border bg-elevated/50">
                      <a
                        href={item.href}
                        onClick={() => setOpenDropdown(null)}
                        className="text-[11px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                      >
                        View all {item.label.toLowerCase()} →
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-1 ml-auto shrink-0">
          <ThemeToggle />
          {data.signinHref && (
            <a
              href={data.signinHref}
              className="text-[13px] text-muted-foreground hover:text-foreground transition-colors duration-150 px-3 py-1.5 rounded-md hover:bg-elevated"
            >
              Sign in
            </a>
          )}
          {data.ctaHref && (
            <Button variant="accent" size="sm" className="h-8 px-4 text-[13px] font-medium" asChild>
              <a href={data.ctaHref}>{data.ctaLabel ?? 'Get started →'}</a>
            </Button>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden ml-auto p-1.5 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={cn(
        'md:hidden border-t border-border bg-card overflow-hidden transition-all duration-200',
        mobileOpen ? 'max-h-[32rem]' : 'max-h-0'
      )}>
        <nav className="px-4 py-3 flex flex-col gap-0.5">
          {navItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = mobileExpanded === item.label;
            const isSecondary = item.variant === 'secondary';

            if (isSecondary) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="mt-1 flex items-center px-3 py-2.5 text-[13px] text-muted-foreground hover:text-foreground border border-border bg-elevated hover:bg-elevated/70 rounded-md transition-colors"
                >
                  {item.label}
                </a>
              );
            }

            if (!hasChildren) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center px-3 py-2.5 text-[13px] text-muted-foreground hover:text-foreground hover:bg-elevated rounded-md transition-colors"
                >
                  {item.label}
                </a>
              );
            }

            return (
              <div key={item.label}>
                <button
                  type="button"
                  onClick={() => {
                    if (hasChildren) {
                      setMobileExpanded(isExpanded ? null : item.label);
                    }
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-[13px] text-muted-foreground hover:text-foreground hover:bg-elevated rounded-md transition-colors text-left"
                >
                  <span>{item.label}</span>
                  {hasChildren && (
                    <ChevronDown
                      size={13}
                      className={cn('opacity-40 transition-transform duration-150', isExpanded && 'rotate-180 opacity-70')}
                    />
                  )}
                </button>

                {hasChildren && isExpanded && (
                  <div className="ml-3 pl-3 border-l border-border mt-0.5 mb-1 flex flex-col gap-0.5">
                    {item.children!.map((child) => (
                      <a
                        key={child.label}
                        href={child.href}
                        onClick={() => { setMobileOpen(false); setMobileExpanded(null); }}
                        className="flex items-center gap-2.5 px-3 py-2 text-[12px] text-muted-foreground hover:text-foreground hover:bg-elevated rounded-md transition-colors"
                      >
                        <span className="w-5 h-5 rounded bg-primary-900 border border-primary-800 flex items-center justify-center shrink-0 text-[9px] font-medium font-mono-olon text-primary-light">
                          {child.label.slice(0, 2).toUpperCase()}
                        </span>
                        {child.label}
                      </a>
                    ))}
                    <a
                      href={item.href}
                      onClick={() => { setMobileOpen(false); setMobileExpanded(null); }}
                      className="px-3 py-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      View all →
                    </a>
                  </div>
                )}
              </div>
            );
          })}

          <div className="flex gap-2 pt-3 mt-2 border-t border-border">
            {data.signinHref && (
              <Button variant="outline" size="sm" className="flex-1 text-[13px]" asChild>
                <a href={data.signinHref}>Sign in</a>
              </Button>
            )}
            {data.ctaHref && (
              <Button variant="accent" size="sm" className="flex-1 text-[13px]" asChild>
                <a href={data.ctaHref}>{data.ctaLabel ?? 'Get started'}</a>
              </Button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

END_OF_FILE_CONTENT
echo "Creating src/components/header/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/header/index.ts"
export * from './View';
export * from './schema';
export * from './types';

END_OF_FILE_CONTENT
echo "Creating src/components/header/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/header/schema.ts"
import { z } from 'zod';

export const HeaderSchema = z.object({
  logoText:         z.string().describe('ui:text'),
  badge:            z.string().optional().describe('ui:text'),
  links: z.array(z.object({
    label:    z.string().describe('ui:text'),
    href:     z.string().describe('ui:text'),
    variant:  z.string().optional().describe('ui:text'),
    children: z.array(z.object({
      label: z.string().describe('ui:text'),
      href:  z.string().describe('ui:text'),
    })).optional().describe('ui:list'),
  })).describe('ui:list'),
  ctaLabel:         z.string().optional().describe('ui:text'),
  ctaHref:          z.string().optional().describe('ui:text'),
  signinHref:       z.string().optional().describe('ui:text'),
});

export const HeaderSettingsSchema = z.object({
  sticky: z.boolean().default(true).describe('ui:checkbox'),
});

END_OF_FILE_CONTENT
echo "Creating src/components/header/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/header/types.ts"
import { z } from 'zod';
import { HeaderSchema, HeaderSettingsSchema } from './schema';

export type HeaderData     = z.infer<typeof HeaderSchema>;
export type HeaderSettings = z.infer<typeof HeaderSettingsSchema>;

END_OF_FILE_CONTENT
mkdir -p "src/components/hero"
echo "Creating src/components/hero/RadialBackground.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/hero/RadialBackground.tsx"
import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

// CSS var names — order matches STOPS
const TOKEN_VARS = [
  '--background',   // #0B0907 center
  '--background',         // #130F0D
  '--background',     // #1E1814
  '--background',       // #2E271F
  '--background',      // #241D17
  '--elevated',     // #1E1814
  '--background',   // #0B0907 outer
] as const;

const STOPS = [0, 30, 55, 72, 84, 93, 100] as const;

function readTokenColors(): string[] {
  if (typeof document === 'undefined') return TOKEN_VARS.map(() => '#000');
  const s = getComputedStyle(document.documentElement);
  return TOKEN_VARS.map((v) => s.getPropertyValue(v).trim() || '#000');
}

export function RadialBackground({
  startingGap =80, 
  breathing = true,
  animationSpeed = 0.01,
  breathingRange = 180,
  topOffset = 0,
}: {
  startingGap?: number;
  breathing?: boolean;
  animationSpeed?: number;
  breathingRange?: number;
  topOffset?: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [colors, setColors] = useState<string[]>(() => readTokenColors());

  // Re-read tokens when data-theme changes (dark ↔ light)
  useEffect(() => {
    setColors(readTokenColors());
    const observer = new MutationObserver(() => setColors(readTokenColors()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let animationFrame: number;
    let width = startingGap;
    let direction = 1;

    const animate = () => {
      if (width >= startingGap + breathingRange) direction = -1;
      if (width <= startingGap - breathingRange) direction = 1;
      if (!breathing) direction = 0;
      width += direction * animationSpeed;

      const stops = STOPS.map((s, i) => `${colors[i]} ${s}%`).join(', ');
      const gradient = `radial-gradient(${width}% ${width + topOffset}% at 50% 20%, ${stops})`;

      if (containerRef.current) {
        containerRef.current.style.background = gradient;
      }
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [startingGap, breathing, animationSpeed, breathingRange, topOffset, colors]);

  return (
    <motion.div
      animate={{ opacity: 1, scale: 1, transition: { duration: 2, ease: [0.25, 0.1, 0.25, 1] } }}
      className="absolute inset-0 overflow-hidden"
      initial={{ opacity: 0, scale: 1.5 }}
    >
      <div className="absolute inset-0" ref={containerRef} />
    </motion.div>
  );
}

END_OF_FILE_CONTENT
echo "Creating src/components/hero/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/hero/View.tsx"
import type { CSSProperties } from 'react';
import { ArrowRight, Github, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadialBackground } from './RadialBackground';
import type { HeroData, HeroSettings } from './types';

interface HeroViewProps {
  data: HeroData;
  settings?: HeroSettings;
}

export function Hero({ data, settings }: HeroViewProps) {
  const showCode = settings?.showCode ?? true;
  const ctas = data.ctas ?? [];
  const heroImage = data.heroImage;

  return (
    <section
      className="relative overflow-hidden pt-36 pb-28 px-6"
      id={data.anchorId}
      style={{
        '--local-bg': 'var(--background)',
        '--local-text': 'var(--foreground)',
        '--local-text-muted': 'var(--muted-foreground)',
        '--local-border': 'var(--border)',
      } as CSSProperties}
    >
      <RadialBackground />
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-20 gap-8 lg:gap-10 items-start">
          <div className="order-2 md:order-1 md:col-span-11">

          {/* Eyebrow */}
          {data.eyebrow && (
            <p className="font-mono-olon text-xs font-medium tracking-label uppercase text-muted-foreground mb-3" data-jp-field="eyebrow">
              {data.eyebrow}
            </p>
          )}

          {/* Headline */}
          <h1 className="font-display font-normal text-7xl  text-foreground leading-tight tracking-display mb-1" data-jp-field="title">
            {data.title}
          </h1>
          {data.titleHighlight && (
            <h2 className="font-display font-normal italic text-5xl md:text-6xl text-primary-light leading-tight tracking-display mb-7" data-jp-field="titleHighlight">
              {data.titleHighlight}
            </h2>
          )}

          {/* Body */}
          {data.description && (
            <p className="text-md text-muted-foreground leading-relaxed max-w-xl mb-10" data-jp-field="description">
              {data.description}
            </p>
          )}

          {/* CTA row */}
          <div className="flex flex-wrap items-center gap-3 mb-16">
            {ctas.map((cta) => (
              <Button
                key={cta.id ?? cta.label}
                variant={cta.variant === 'accent' ? 'accent' : cta.variant === 'secondary' ? 'outline' : 'default'}
                size="lg"
                className="text-base"
                asChild
              >
                <a
                  href={cta.href}
                  data-jp-item-id={cta.id ?? cta.label}
                  data-jp-item-field="ctas"
                  data-jp-field="href"
                >
                  {cta.variant === 'accent' ? (
                    <><span data-jp-field="label">{cta.label}</span> <ArrowRight className="h-4 w-4" /></>
                  ) : cta.variant === 'secondary' ? (
                    <><Github className="h-4 w-4" /> <span data-jp-field="label">{cta.label}</span></>
                  ) : (
                    <span data-jp-field="label">{cta.label}</span>
                  )}
                </a>
              </Button>
            ))}
            {data.docsHref && (
              <a
                href={data.docsHref}
                data-jp-field="docsHref"
                className="text-base text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
              >
                <Terminal className="h-4 w-4" />
                <span data-jp-field="docsLabel">{data.docsLabel ?? 'Read the docs'}</span>
              </a>
            )}
          </div>

            {/* Code block */}
            {showCode && (
              <div className="rounded-lg border border-border overflow-hidden max-w-2xl">
                <div className="flex items-center justify-between px-4 py-2.5 bg-elevated border-b border-border">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-border-strong" />
                    <span className="w-2.5 h-2.5 rounded-full bg-border-strong" />
                    <span className="w-2.5 h-2.5 rounded-full bg-border-strong" />
                  </div>
                  <span className="font-mono-olon text-xs text-muted-foreground">olon.config.ts</span>
                  <span className="font-mono-olon text-xs text-primary-400 hover:text-primary-light cursor-default transition-colors" data-jp-field="codeLabel">
                    {data.codeLabel ?? 'Copy'}
                  </span>
                </div>
                <pre className="px-5 py-5 bg-card font-mono-olon text-sm leading-[1.8] overflow-x-auto">
                  <code>
                    <span><span className="text-primary-400">import</span><span className="text-foreground"> {'{ defineConfig }'} </span><span className="text-primary-400">from</span><span className="text-primary-200"> 'olonjs'</span></span>
                    {'\n\n'}
                    <span><span className="text-primary-400">export default</span><span className="text-primary-light"> defineConfig</span><span className="text-foreground">{'({'}</span></span>
                    {'\n  '}
                    <span><span className="text-accent">tenants</span><span className="text-foreground">: [{'{'}</span></span>
                    {'\n    '}
                    <span><span className="text-accent">slug</span><span className="text-foreground">: </span><span className="text-primary-200">'acme-corp'</span><span className="text-muted-foreground">,</span></span>
                    {'\n    '}
                    <span><span className="text-accent">routes</span><span className="text-foreground">: </span><span className="text-primary-light">autoDiscover</span><span className="text-foreground">(</span><span className="text-primary-200">'./src/pages'</span><span className="text-foreground">),</span></span>
                    {'\n    '}
                    <span><span className="text-accent">schema</span><span className="text-foreground">: </span><span className="text-primary-200">'./schemas/page.json'</span><span className="text-foreground">,</span></span>
                    {'\n  '}
                    <span><span className="text-foreground">{'}],'}</span></span>
                    {'\n  '}
                    <span><span className="text-accent">output</span><span className="text-foreground">: </span><span className="text-primary-200">'vercel'</span><span className="text-muted-foreground">,  </span><span className="text-muted-foreground">{'// \'nx\' | \'vercel\' | \'custom\''}</span></span>
                    {'\n  '}
                    <span><span className="text-accent">governance</span><span className="text-foreground">: {'{'} </span><span className="text-accent">audit</span><span className="text-foreground">: </span><span className="text-primary-light">true</span><span className="text-foreground">, </span><span className="text-accent">strict</span><span className="text-foreground">: </span><span className="text-primary-light">true</span><span className="text-foreground"> {'}'}</span></span>
                    {'\n'}
                    <span><span className="text-foreground">{'}'}</span></span>
                  </code>
                </pre>
              </div>
            )}
          </div>

          {/* Right column (40%) - image placeholder */}
          <div className="order-1 md:order-2 md:col-span-9">
            <div className="relative rounded-md overflow-hidden bg-card hero-media-portrait">
              <img
                src={heroImage?.url ?? '/images/olon-hero.png'}
                alt={heroImage?.alt ?? 'Olon hero visual'}
                data-jp-field="heroImage"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 pointer-events-none hero-media-overlay" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

END_OF_FILE_CONTENT
echo "Creating src/components/hero/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/hero/index.ts"
export * from './View';
export * from './schema';
export * from './types';

END_OF_FILE_CONTENT
echo "Creating src/components/hero/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/hero/schema.ts"
import { z } from 'zod';
import { BaseSectionData, CtaSchema, ImageSelectionSchema } from '@/lib/base-schemas';

export const HeroSchema = BaseSectionData.extend({
  eyebrow:          z.string().optional().describe('ui:text'),
  title:            z.string().describe('ui:text'),
  titleHighlight:   z.string().optional().describe('ui:text'),
  description:      z.string().optional().describe('ui:textarea'),
  ctas:             z.array(CtaSchema).optional().describe('ui:list'),
  docsLabel:        z.string().optional().describe('ui:text'),
  docsHref:         z.string().optional().describe('ui:text'),
  codeLabel:        z.string().optional().describe('ui:text'),
  heroImage:        ImageSelectionSchema.optional().describe('ui:image-picker'),
});

export const HeroSettingsSchema = z.object({
  showCode: z.boolean().default(true).describe('ui:checkbox'),
});

END_OF_FILE_CONTENT
echo "Creating src/components/hero/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/hero/types.ts"
import { z } from 'zod';
import { HeroSchema, HeroSettingsSchema } from './schema';

export type HeroData     = z.infer<typeof HeroSchema>;
export type HeroSettings = z.infer<typeof HeroSettingsSchema>;

END_OF_FILE_CONTENT
mkdir -p "src/components/login"
echo "Creating src/components/login/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/login/View.tsx"
import { useState } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OlonMark } from '@/components/OlonWordmark';
import type { LoginData, LoginSettings } from './types';

interface LoginViewProps {
  data: LoginData;
  settings?: LoginSettings;
}

const GoogleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

export function Login({ data, settings }: LoginViewProps) {
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const showOauth = settings?.showOauth ?? true;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  }

  return (
    <section id="login" className="py-24 px-6 border-t border-border section-anchor">
      <div className="max-w-4xl mx-auto flex justify-center">
        <div className="w-full max-w-[360px]">

          {/* Header */}
          <div className="flex flex-col items-center mb-8 text-center">
            <OlonMark size={32} className="mb-5" />
            <h2 className="text-[18px] font-display text-foreground tracking-[-0.02em] mb-1.5" data-jp-field="title">
              {data.title}
            </h2>
            {data.subtitle && (
              <p className="text-[13px] text-muted-foreground" data-jp-field="subtitle">{data.subtitle}</p>
            )}
          </div>

          {/* OAuth */}
          {showOauth && (
            <div className="space-y-2 mb-6">
              {[
                { label: 'Continue with Google', icon: <GoogleIcon />, id: 'google' },
                { label: 'Continue with GitHub', icon: <GitHubIcon />, id: 'github' },
              ].map(({ label, icon, id }) => (
                <button
                  key={id}
                  type="button"
                  className="w-full flex items-center justify-center gap-2.5 h-9 px-4 text-[13px] font-medium text-foreground border border-border rounded-md bg-transparent hover:bg-elevated transition-colors duration-150"
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[11px] text-muted-foreground font-mono-olon tracking-wide">OR</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <Label htmlFor="login-email">Email</Label>
              <Input id="login-email" type="email" placeholder="ada@acme.com" autoComplete="email" required />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="login-password" className="mb-0">Password</Label>
                {data.forgotHref && (
                  <a href={data.forgotHref} data-jp-field="forgotHref" className="text-[11px] text-primary-400 hover:text-primary-light transition-colors">
                    Forgot password?
                  </a>
                )}
              </div>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPwd(!showPwd)}
                >
                  {showPwd ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>
            <Button type="submit" variant="accent" className="w-full" disabled={loading}>
              {loading ? 'Signing in…' : <><span>Sign in</span><ArrowRight size={14} /></>}
            </Button>
          </form>

          {data.signupHref && (
            <p className="text-center text-[12px] text-muted-foreground mt-6">
              No account?{' '}
              <a href={data.signupHref} data-jp-field="signupHref" className="text-primary-light hover:text-primary-200 transition-colors">
                Request access →
              </a>
            </p>
          )}

          {(data.termsHref || data.privacyHref) && (
            <p className="text-center text-[11px] text-muted-foreground/60 mt-4">
              By signing in you agree to our{' '}
              {data.termsHref && (
                <a href={data.termsHref} data-jp-field="termsHref" className="hover:text-muted-foreground transition-colors underline underline-offset-2">Terms</a>
              )}
              {data.termsHref && data.privacyHref && ' and '}
              {data.privacyHref && (
                <a href={data.privacyHref} data-jp-field="privacyHref" className="hover:text-muted-foreground transition-colors underline underline-offset-2">Privacy Policy</a>
              )}.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

END_OF_FILE_CONTENT
echo "Creating src/components/login/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/login/index.ts"
export * from './View';
export * from './schema';
export * from './types';

END_OF_FILE_CONTENT
echo "Creating src/components/login/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/login/schema.ts"
import { z } from 'zod';
import { BaseSectionData } from '@/lib/base-schemas';

export const LoginSchema = BaseSectionData.extend({
  title:       z.string().describe('ui:text'),
  subtitle:    z.string().optional().describe('ui:text'),
  forgotHref:  z.string().optional().describe('ui:text'),
  signupHref:  z.string().optional().describe('ui:text'),
  termsHref:   z.string().optional().describe('ui:text'),
  privacyHref: z.string().optional().describe('ui:text'),
});

export const LoginSettingsSchema = z.object({
  showOauth: z.boolean().default(true).describe('ui:checkbox'),
});

END_OF_FILE_CONTENT
echo "Creating src/components/login/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/login/types.ts"
import { z } from 'zod';
import { LoginSchema, LoginSettingsSchema } from './schema';

export type LoginData     = z.infer<typeof LoginSchema>;
export type LoginSettings = z.infer<typeof LoginSettingsSchema>;

END_OF_FILE_CONTENT
mkdir -p "src/components/page-hero"
echo "Creating src/components/page-hero/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/page-hero/View.tsx"
import React from 'react';
import type { PageHeroData, PageHeroSettings } from './types';

interface PageHeroViewProps {
  data: PageHeroData;
  settings?: PageHeroSettings;
}

export function PageHero({ data }: PageHeroViewProps) {
  const crumbs = data.breadcrumb ?? [];

  return (
    <section
      className="py-14 px-6 border-b border-[var(--local-border)] bg-[var(--local-bg)]"
      style={{
        '--local-bg':        'var(--card)',
        '--local-text':      'var(--foreground)',
        '--local-text-muted':'var(--muted-foreground)',
        '--local-border':    'var(--border)',
      } as React.CSSProperties}
    >
      <div className="max-w-4xl mx-auto">

        {/* Breadcrumb */}
        {crumbs.length > 0 && (
          <nav className="flex items-center gap-2 font-mono-olon text-xs tracking-label uppercase text-muted-foreground mb-6">
            {crumbs.map((item, idx) => (
              <React.Fragment key={item.id ?? `crumb-${idx}`}>
                {idx > 0 && <span className="text-border-strong select-none">/</span>}
                <a
                  href={item.href}
                  data-jp-item-id={item.id ?? `crumb-${idx}`}
                  data-jp-item-field="breadcrumb"
                  className="hover:text-[var(--local-text)] transition-colors"
                >
                  {item.label}
                </a>
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* Badge */}
        {data.badge && (
          <div
            className="inline-flex items-center font-mono-olon text-xs font-medium tracking-label uppercase text-primary-light bg-primary-900 border border-primary px-3 py-1 rounded-sm mb-5"
            data-jp-field="badge"
          >
            {data.badge}
          </div>
        )}

        {/* Title */}
        <h1
          className="font-display font-normal text-4xl md:text-5xl leading-tight tracking-display text-[var(--local-text)] mb-1"
          data-jp-field="title"
        >
          {data.title}
        </h1>

        {/* Title italic accent line */}
        {data.titleItalic && (
          <p
            className="font-display font-normal italic text-4xl md:text-5xl leading-tight tracking-display text-primary-light mb-0"
            data-jp-field="titleItalic"
          >
            {data.titleItalic}
          </p>
        )}

        {/* Description */}
        {data.description && (
          <p
            className="text-base text-[var(--local-text-muted)] leading-relaxed max-w-xl mt-5"
            data-jp-field="description"
          >
            {data.description}
          </p>
        )}

      </div>
    </section>
  );
}

END_OF_FILE_CONTENT
echo "Creating src/components/page-hero/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/page-hero/index.ts"
export { PageHero } from './View';
export { PageHeroSchema } from './schema';
export type { PageHeroData, PageHeroSettings } from './types';

END_OF_FILE_CONTENT
echo "Creating src/components/page-hero/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/page-hero/schema.ts"
import { z } from 'zod';
import { BaseSectionData, BaseArrayItem } from '@/lib/base-schemas';

const BreadcrumbItemSchema = BaseArrayItem.extend({
  label: z.string().describe('ui:text'),
  href:  z.string().describe('ui:text'),
});

export const PageHeroSchema = BaseSectionData.extend({
  badge:       z.string().optional().describe('ui:text'),
  title:       z.string().describe('ui:text'),
  titleItalic: z.string().optional().describe('ui:text'),
  description: z.string().optional().describe('ui:textarea'),
  breadcrumb:  z.array(BreadcrumbItemSchema).optional().describe('ui:list'),
});

END_OF_FILE_CONTENT
echo "Creating src/components/page-hero/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/page-hero/types.ts"
import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { PageHeroSchema } from './schema';

export type PageHeroData     = z.infer<typeof PageHeroSchema>;
export type PageHeroSettings = z.infer<typeof BaseSectionSettingsSchema>;

END_OF_FILE_CONTENT
mkdir -p "src/components/problem-statement"
echo "Creating src/components/problem-statement/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/problem-statement/View.tsx"
import React from 'react';
import type { ProblemStatementData, ProblemStatementSettings } from './types';

export const ProblemStatement: React.FC<{
  data: ProblemStatementData;
  settings?: ProblemStatementSettings;
}> = ({ data }) => {
  return (
    <section id="problem" className="jp-problem py-24">
      <div className="max-w-[1040px] mx-auto px-8">

        {data.label && (
          <div className="inline-flex items-center gap-2 text-[10.5px] font-mono font-bold uppercase tracking-[.12em] text-muted-foreground/60 mb-5">
            <span className="w-[18px] h-px bg-border" aria-hidden />
            {data.label}
          </div>
        )}

        {/* Split grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 rounded-xl overflow-hidden border border-border"
          style={{ gap: '1px', background: 'var(--border)' }}
        >
          {/* Problem cell */}
          <div className="bg-background p-10 md:p-[40px_42px]" data-jp-field="problemTitle">
            <div className="text-[10.5px] font-bold tracking-[.10em] uppercase text-red-500 mb-5">
              {data.problemTag}
            </div>
            <h3 className="text-[21px] font-bold tracking-[-0.02em] leading-[1.2] text-foreground mb-6">
              {data.problemTitle}
            </h3>
            <ul className="flex flex-col gap-3.5" data-jp-field="problemItems">
              {data.problemItems?.map((item, idx) => (
                <li
                  key={(item as { id?: string }).id ?? idx}
                  className="flex gap-2.5 text-[13.5px] text-muted-foreground leading-[1.65]"
                  data-jp-item-id={(item as { id?: string }).id ?? `p-${idx}`}
                  data-jp-item-field="problemItems"
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded-sm bg-red-500/10 text-red-500 flex items-center justify-center text-[10px] font-bold mt-0.5">
                    ✕
                  </span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Solution cell */}
          <div className="bg-card p-10 md:p-[40px_42px]" data-jp-field="solutionTitle">
            <div className="text-[10.5px] font-bold tracking-[.10em] uppercase text-emerald-500 mb-5">
              {data.solutionTag}
            </div>
            <h3 className="text-[21px] font-bold tracking-[-0.02em] leading-[1.2] text-foreground mb-6">
              {data.solutionTitle}
            </h3>
            <ul className="flex flex-col gap-3.5" data-jp-field="solutionItems">
              {data.solutionItems?.map((item, idx) => (
                <li
                  key={(item as { id?: string }).id ?? idx}
                  className="flex gap-2.5 text-[13.5px] text-muted-foreground leading-[1.65]"
                  data-jp-item-id={(item as { id?: string }).id ?? `s-${idx}`}
                  data-jp-item-field="solutionItems"
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded-sm bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-[10px] font-bold mt-0.5">
                    ✓
                  </span>
                  <span>
                    {item.text}
                    {item.code && (
                      <> <code className="font-mono text-[11px] bg-muted border border-border rounded px-1.5 py-0.5 text-primary">
                        {item.code}
                      </code></>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

END_OF_FILE_CONTENT
echo "Creating src/components/problem-statement/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/problem-statement/index.ts"
export * from './View';
export * from './schema';
export * from './types';

END_OF_FILE_CONTENT
echo "Creating src/components/problem-statement/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/problem-statement/schema.ts"
import { z } from 'zod';
import { BaseSectionData, BaseArrayItem } from '@/lib/base-schemas';

const ProblemItemSchema = BaseArrayItem.extend({
  text: z.string().describe('ui:text'),
  code: z.string().optional().describe('ui:text'),
});

export const ProblemStatementSchema = BaseSectionData.extend({
  label: z.string().optional().describe('ui:text'),
  problemTag: z.string().describe('ui:text'),
  problemTitle: z.string().describe('ui:text'),
  problemItems: z.array(ProblemItemSchema).describe('ui:list'),
  solutionTag: z.string().describe('ui:text'),
  solutionTitle: z.string().describe('ui:text'),
  solutionItems: z.array(ProblemItemSchema).describe('ui:list'),
});

END_OF_FILE_CONTENT
echo "Creating src/components/problem-statement/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/problem-statement/types.ts"
import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { ProblemStatementSchema } from './schema';

export type ProblemStatementData = z.infer<typeof ProblemStatementSchema>;
export type ProblemStatementSettings = z.infer<typeof BaseSectionSettingsSchema>;

END_OF_FILE_CONTENT
mkdir -p "src/components/save-drawer"
echo "Creating src/components/save-drawer/DeployConnector.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/save-drawer/DeployConnector.tsx"
import type { StepState } from '@/types/deploy';

interface DeployConnectorProps {
  fromState: StepState;
  toState: StepState;
  color: string;
}

export function DeployConnector({ fromState, toState, color }: DeployConnectorProps) {
  const filled = fromState === 'done' && toState === 'done';
  const filling = fromState === 'done' && toState === 'active';
  const lit = filled || filling;

  return (
    <div className="jp-drawer-connector">
      <div className="jp-drawer-connector-base" />

      <div
        className="jp-drawer-connector-fill"
        style={{
          background: `linear-gradient(90deg, ${color}cc, ${color}66)`,
          width: filled ? '100%' : filling ? '100%' : '0%',
          transition: filling ? 'width 2s cubic-bezier(0.4,0,0.2,1)' : 'none',
          boxShadow: lit ? `0 0 8px ${color}77` : 'none',
        }}
      />

      {filling && (
        <div
          className="jp-drawer-connector-orb"
          style={{
            background: color,
            boxShadow: `0 0 14px ${color}, 0 0 28px ${color}88`,
            animation: 'orb-travel 2s cubic-bezier(0.4,0,0.6,1) forwards',
          }}
        />
      )}
    </div>
  );
}


END_OF_FILE_CONTENT
echo "Creating src/components/save-drawer/DeployNode.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/save-drawer/DeployNode.tsx"
import type { CSSProperties } from 'react';
import type { DeployStep, StepState } from '@/types/deploy';

interface DeployNodeProps {
  step: DeployStep;
  state: StepState;
}

export function DeployNode({ step, state }: DeployNodeProps) {
  const isActive = state === 'active';
  const isDone = state === 'done';
  const isPending = state === 'pending';

  return (
    <div className="jp-drawer-node-wrap">
      <div
        className={`jp-drawer-node ${isPending ? 'jp-drawer-node-pending' : ''}`}
        style={
          {
            background: isDone ? step.color : isActive ? 'rgba(0,0,0,0.5)' : undefined,
            borderWidth: isDone ? 0 : 1,
            borderColor: isActive ? `${step.color}80` : undefined,
            boxShadow: isDone
              ? `0 0 20px ${step.color}55, 0 0 40px ${step.color}22`
              : isActive
                ? `0 0 14px ${step.color}33`
                : undefined,
            animation: isActive ? 'node-glow 2s ease infinite' : undefined,
            ['--glow-color' as string]: step.color,
          } as CSSProperties
        }
      >
        {isDone && (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-label="Done">
            <path
              className="stroke-dash-30 animate-check-draw"
              d="M5 13l4 4L19 7"
              stroke="#0a0f1a"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}

        {isActive && (
          <span
            className="jp-drawer-node-glyph jp-drawer-node-glyph-active"
            style={{ color: step.color, animation: 'glyph-rotate 9s linear infinite' }}
            aria-hidden
          >
            {step.glyph}
          </span>
        )}

        {isPending && (
          <span className="jp-drawer-node-glyph jp-drawer-node-glyph-pending" aria-hidden>
            {step.glyph}
          </span>
        )}

        {isActive && (
          <span
            className="jp-drawer-node-ring"
            style={{
              inset: -7,
              borderColor: `${step.color}50`,
              animation: 'ring-expand 2s ease-out infinite',
            }}
          />
        )}
      </div>

      <span
        className="jp-drawer-node-label"
        style={{ color: isDone ? step.color : isActive ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.18)' }}
      >
        {step.label}
      </span>
    </div>
  );
}


END_OF_FILE_CONTENT
echo "Creating src/components/save-drawer/DopaDrawer.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/save-drawer/DopaDrawer.tsx"
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import type { StepId, StepState } from '@/types/deploy';
import { DEPLOY_STEPS } from '@/lib/deploySteps';
import fontsCss from '@/fonts.css?inline';
import saverStyleCss from './saverStyle.css?inline';
import { DeployNode } from './DeployNode';
import { DeployConnector } from './DeployConnector';
import { BuildBars, ElapsedTimer, Particles, SuccessBurst } from './Visuals';

interface DopaDrawerProps {
  isOpen: boolean;
  phase: 'idle' | 'running' | 'done' | 'error';
  currentStepId: StepId | null;
  doneSteps: StepId[];
  progress: number;
  errorMessage?: string;
  deployUrl?: string;
  onClose: () => void;
  onRetry: () => void;
}

export function DopaDrawer({
  isOpen,
  phase,
  currentStepId,
  doneSteps,
  progress,
  errorMessage,
  deployUrl,
  onClose,
  onRetry,
}: DopaDrawerProps) {
  const [shadowMount, setShadowMount] = useState<HTMLElement | null>(null);
  const [burst, setBurst] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const isRunning = phase === 'running';
  const isDone = phase === 'done';
  const isError = phase === 'error';

  useEffect(() => {
    const host = document.createElement('div');
    host.setAttribute('data-jp-drawer-shadow-host', '');

    const shadowRoot = host.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = `${fontsCss}\n${saverStyleCss}`;

    const mount = document.createElement('div');
    shadowRoot.append(style, mount);

    document.body.appendChild(host);
    setShadowMount(mount);

    return () => {
      setShadowMount(null);
      host.remove();
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setBurst(false);
      setCountdown(3);
      return;
    }
    if (isDone) setBurst(true);
  }, [isDone, isOpen]);

  useEffect(() => {
    if (!isOpen || !isDone) return;
    setCountdown(3);
    const interval = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isDone, isOpen, onClose]);

  const currentStep = useMemo(
    () => DEPLOY_STEPS.find((step) => step.id === currentStepId) ?? null,
    [currentStepId]
  );

  const activeColor = isDone ? '#34d399' : isError ? '#f87171' : (currentStep?.color ?? '#60a5fa');
  const particleCount = isDone ? 40 : doneSteps.length === 3 ? 28 : doneSteps.length === 2 ? 16 : doneSteps.length === 1 ? 8 : 4;

  const stepState = (index: number): StepState => {
    const step = DEPLOY_STEPS[index];
    if (doneSteps.includes(step.id)) return 'done';
    if (phase === 'running' && currentStepId === step.id) return 'active';
    return 'pending';
  };

  if (!shadowMount || !isOpen || phase === 'idle') return null;

  return createPortal(
    <div className="jp-drawer-root">
      <div
        className="jp-drawer-overlay animate-fade-in"
        onClick={isDone || isError ? onClose : undefined}
        aria-hidden
      />

      <div
        role="status"
        aria-live="polite"
        aria-label={isDone ? 'Deploy completed' : isError ? 'Deploy failed' : 'Deploying'}
        className="jp-drawer-shell animate-drawer-up"
        style={{ bottom: 'max(2.25rem, env(safe-area-inset-bottom))' }}
      >
        <div
          className="jp-drawer-card"
          style={{
            backgroundColor: 'hsl(222 18% 7%)',
            boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 -20px 60px rgba(0,0,0,0.6), 0 0 80px ${activeColor}0d`,
            transition: 'box-shadow 1.2s ease',
          }}
        >
          <div
            className="jp-drawer-ambient"
            style={{
              background: `radial-gradient(ellipse 70% 60% at 50% 110%, ${activeColor}12 0%, transparent 65%)`,
              transition: 'background 1.5s ease',
              animation: 'ambient-pulse 3.5s ease infinite',
            }}
            aria-hidden
          />

          {isDone && (
            <div className="jp-drawer-shimmer" aria-hidden>
              <div
                className="jp-drawer-shimmer-bar"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
                  animation: 'shimmer-sweep 1.4s 0.1s ease forwards',
                }}
              />
            </div>
          )}

          <Particles count={particleCount} color={activeColor} />
          {burst && <SuccessBurst />}

          <div className="jp-drawer-content">
            <div className="jp-drawer-header">
              <div className="jp-drawer-header-left">
                <div className="jp-drawer-status" style={{ color: activeColor }}>
                  <span
                    className="jp-drawer-status-dot"
                    style={{
                      background: activeColor,
                      boxShadow: `0 0 6px ${activeColor}`,
                      animation: isRunning ? 'ambient-pulse 1.5s ease infinite' : 'none',
                    }}
                    aria-hidden
                  />
                  {isDone ? 'Live' : isError ? 'Build failed' : currentStep?.verb ?? 'Saving'}
                </div>

                <div key={currentStep?.id ?? phase} className="jp-drawer-copy animate-text-in">
                  {isDone ? (
                    <div className="animate-success-pop">
                      <p className="jp-drawer-copy-title jp-drawer-copy-title-lg">Your content is live.</p>
                      <p className="jp-drawer-copy-sub">Deployed to production successfully</p>
                    </div>
                  ) : isError ? (
                    <>
                      <p className="jp-drawer-copy-title jp-drawer-copy-title-md">Deploy failed at build.</p>
                      <p className="jp-drawer-copy-sub jp-drawer-copy-sub-error">{errorMessage ?? 'Check your Vercel logs or retry below'}</p>
                    </>
                  ) : currentStep ? (
                    <>
                      <p className="jp-drawer-poem-line jp-drawer-poem-line-1">{currentStep.poem[0]}</p>
                      <p className="jp-drawer-poem-line jp-drawer-poem-line-2">{currentStep.poem[1]}</p>
                    </>
                  ) : null}
                </div>
              </div>

              <div className="jp-drawer-right">
                {isDone ? (
                  <div className="jp-drawer-countdown-wrap animate-fade-up">
                    <span className="jp-drawer-countdown-text" aria-live="polite">
                      Chiusura in {countdown}s
                    </span>
                    <div className="jp-drawer-countdown-track">
                      <div className="jp-drawer-countdown-bar countdown-bar" style={{ boxShadow: '0 0 6px #34d39988' }} />
                    </div>
                  </div>
                ) : (
                  <ElapsedTimer running={isRunning} />
                )}
              </div>
            </div>

            <div className="jp-drawer-track-row">
              {DEPLOY_STEPS.map((step, i) => (
                <div key={step.id} style={{ display: 'flex', alignItems: 'center', flex: i < DEPLOY_STEPS.length - 1 ? 1 : 'none' }}>
                  <DeployNode step={step} state={stepState(i)} />
                  {i < DEPLOY_STEPS.length - 1 && (
                    <DeployConnector fromState={stepState(i)} toState={stepState(i + 1)} color={DEPLOY_STEPS[i + 1].color} />
                  )}
                </div>
              ))}
            </div>

            <div className="jp-drawer-bars-wrap">
              <BuildBars active={stepState(2) === 'active'} />
            </div>

            <div className="jp-drawer-separator" />

            <div className="jp-drawer-footer">
              <div className="jp-drawer-progress">
                <div
                  className="jp-drawer-progress-indicator"
                  style={{
                    width: `${Math.max(0, Math.min(100, progress))}%`,
                    background: `linear-gradient(90deg, ${DEPLOY_STEPS[0].color}, ${activeColor})`,
                  }}
                />
              </div>

              <div className="jp-drawer-cta">
                {isDone && (
                  <div className="jp-drawer-btn-row animate-fade-up">
                    <button type="button" className="jp-drawer-btn jp-drawer-btn-secondary" onClick={onClose}>
                      Chiudi
                    </button>
                    <button
                      type="button"
                      className="jp-drawer-btn jp-drawer-btn-emerald"
                      onClick={() => {
                        if (deployUrl) window.open(deployUrl, '_blank', 'noopener,noreferrer');
                      }}
                      disabled={!deployUrl}
                    >
                      <span aria-hidden>↗</span> Open site
                    </button>
                  </div>
                )}

                {isError && (
                  <div className="jp-drawer-btn-row animate-fade-up">
                    <button type="button" className="jp-drawer-btn jp-drawer-btn-ghost" onClick={onClose}>
                      Annulla
                    </button>
                    <button type="button" className="jp-drawer-btn jp-drawer-btn-destructive" onClick={onRetry}>
                      Retry
                    </button>
                  </div>
                )}

                {isRunning && (
                  <span className="jp-drawer-running-step" aria-hidden>
                    {doneSteps.length + 1} / {DEPLOY_STEPS.length}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    shadowMount
  );
}


END_OF_FILE_CONTENT
echo "Creating src/components/save-drawer/Visuals.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/save-drawer/Visuals.tsx"
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  dur: number;
  delay: number;
}

const PARTICLE_POOL: Particle[] = Array.from({ length: 44 }, (_, i) => ({
  id: i,
  x: 5 + Math.random() * 90,
  y: 15 + Math.random() * 70,
  size: 1.5 + Math.random() * 2.5,
  dur: 2.8 + Math.random() * 3.5,
  delay: Math.random() * 4,
}));

interface ParticlesProps {
  count: number;
  color: string;
}

export function Particles({ count, color }: ParticlesProps) {
  return (
    <div className="jp-drawer-particles" aria-hidden>
      {PARTICLE_POOL.slice(0, count).map((particle) => (
        <div
          key={particle.id}
          className="jp-drawer-particle"
          style={{
            left: `${particle.x}%`,
            bottom: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: color,
            boxShadow: `0 0 ${particle.size * 3}px ${color}`,
            opacity: 0,
            animation: `particle-float ${particle.dur}s ${particle.delay}s ease-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

const BAR_H = [0.45, 0.75, 0.55, 0.9, 0.65, 0.8, 0.5, 0.72, 0.6, 0.85, 0.42, 0.7];

interface BuildBarsProps {
  active: boolean;
}

export function BuildBars({ active }: BuildBarsProps) {
  if (!active) return <div className="jp-drawer-bars-placeholder" />;

  return (
    <div className="jp-drawer-bars" aria-hidden>
      {BAR_H.map((height, i) => (
        <div
          key={i}
          className="jp-drawer-bar"
          style={{
            height: `${height * 100}%`,
            animation: `bar-eq ${0.42 + i * 0.06}s ${i * 0.04}s ease-in-out infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

const BURST_COLORS = ['#34d399', '#60a5fa', '#a78bfa', '#f59e0b', '#f472b6'];

export function SuccessBurst() {
  return (
    <div className="jp-drawer-burst" aria-hidden>
      {Array.from({ length: 16 }).map((_, i) => (
        <div
          key={i}
          className="jp-drawer-burst-dot"
          style={
            {
              background: BURST_COLORS[i % BURST_COLORS.length],
              ['--r' as string]: `${i * 22.5}deg`,
              animation: `burst-ray 0.85s ${i * 0.03}s cubic-bezier(0,0.6,0.5,1) forwards`,
              transform: `rotate(${i * 22.5}deg)`,
              transformOrigin: '50% 50%',
              opacity: 0,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

interface ElapsedTimerProps {
  running: boolean;
}

export function ElapsedTimer({ running }: ElapsedTimerProps) {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    if (!startRef.current) startRef.current = performance.now();

    const tick = () => {
      if (!startRef.current) return;
      setElapsed(Math.floor((performance.now() - startRef.current) / 1000));
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [running]);

  const sec = String(elapsed % 60).padStart(2, '0');
  const min = String(Math.floor(elapsed / 60)).padStart(2, '0');
  return <span className="jp-drawer-elapsed" aria-live="off">{min}:{sec}</span>;
}


END_OF_FILE_CONTENT
echo "Creating src/components/save-drawer/saverStyle.css..."
cat << 'END_OF_FILE_CONTENT' > "src/components/save-drawer/saverStyle.css"
/* Save Drawer strict_full isolated stylesheet */

.jp-drawer-root {
  --background: 222 18% 6%;
  --foreground: 210 20% 96%;
  --card: 222 16% 8%;
  --card-foreground: 210 20% 96%;
  --primary: 0 0% 95%;
  --primary-foreground: 222 18% 6%;
  --secondary: 220 14% 13%;
  --secondary-foreground: 210 20% 96%;
  --destructive: 0 72% 51%;
  --destructive-foreground: 0 0% 98%;
  --border: 220 14% 13%;
  --radius: 0.6rem;
  font-family: 'Geist', system-ui, sans-serif;
}

.jp-drawer-overlay {
  position: fixed;
  inset: 0;
  z-index: 2147483600;
  background: rgb(0 0 0 / 0.4);
  backdrop-filter: blur(2px);
}

.jp-drawer-shell {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 2147483601;
  display: flex;
  justify-content: center;
  padding: 0 1rem;
}

.jp-drawer-card {
  position: relative;
  width: 100%;
  max-width: 31rem;
  overflow: hidden;
  border-radius: 1rem;
  border: 1px solid rgb(255 255 255 / 0.07);
}

.jp-drawer-ambient {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.jp-drawer-shimmer {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.jp-drawer-shimmer-bar {
  position: absolute;
  inset-block: 0;
  width: 35%;
}

.jp-drawer-content {
  position: relative;
  z-index: 10;
  padding: 2rem 2rem 1.75rem;
}

.jp-drawer-header {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.jp-drawer-header-left {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.jp-drawer-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: color 0.5s;
}

.jp-drawer-status-dot {
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 9999px;
  display: inline-block;
}

.jp-drawer-copy {
  min-height: 52px;
}

.jp-drawer-copy-title {
  margin: 0;
  color: white;
  line-height: 1.25;
  font-weight: 600;
}

.jp-drawer-copy-title-lg {
  font-size: 1.125rem;
}

.jp-drawer-copy-title-md {
  font-size: 1rem;
}

.jp-drawer-copy-sub {
  margin: 0.125rem 0 0;
  color: rgb(255 255 255 / 0.4);
  font-size: 0.875rem;
}

.jp-drawer-copy-sub-error {
  color: rgb(255 255 255 / 0.35);
}

.jp-drawer-poem-line {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 300;
  line-height: 1.5;
}

.jp-drawer-poem-line-1 {
  color: rgb(255 255 255 / 0.55);
}

.jp-drawer-poem-line-2 {
  color: rgb(255 255 255 / 0.3);
}

.jp-drawer-right {
  margin-left: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  flex-shrink: 0;
}

.jp-drawer-countdown-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.jp-drawer-countdown-text {
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.75rem;
  font-weight: 600;
  color: #34d399;
}

.jp-drawer-countdown-track {
  width: 6rem;
  height: 0.125rem;
  border-radius: 9999px;
  overflow: hidden;
  background: rgb(255 255 255 / 0.1);
}

.jp-drawer-countdown-bar {
  width: 100%;
  height: 100%;
  border-radius: 9999px;
  background: #34d399;
}

.jp-drawer-track-row {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}

.jp-drawer-bars-wrap {
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
}

.jp-drawer-separator {
  margin-bottom: 1rem;
  height: 1px;
  width: 100%;
  border: 0;
  background: rgb(255 255 255 / 0.06);
}

.jp-drawer-footer {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.jp-drawer-progress {
  flex: 1;
  height: 2px;
  border-radius: 9999px;
  overflow: hidden;
  background: rgb(255 255 255 / 0.06);
}

.jp-drawer-progress-indicator {
  height: 100%;
}

.jp-drawer-cta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.jp-drawer-running-step {
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.75rem;
  color: rgb(255 255 255 / 0.2);
}

.jp-drawer-btn-row {
  display: flex;
  gap: 0.5rem;
}

.jp-drawer-btn {
  border: 1px solid transparent;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1;
  height: 2.25rem;
  padding: 0 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
}

.jp-drawer-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.jp-drawer-btn-secondary {
  background: hsl(var(--secondary));
  color: hsl(var(--secondary-foreground));
}

.jp-drawer-btn-secondary:hover {
  filter: brightness(1.08);
}

.jp-drawer-btn-emerald {
  background: #34d399;
  color: #18181b;
  font-weight: 600;
}

.jp-drawer-btn-emerald:hover {
  background: #6ee7b7;
}

.jp-drawer-btn-ghost {
  background: transparent;
  color: rgb(255 255 255 / 0.9);
}

.jp-drawer-btn-ghost:hover {
  background: rgb(255 255 255 / 0.08);
}

.jp-drawer-btn-destructive {
  background: hsl(var(--destructive));
  color: hsl(var(--destructive-foreground));
}

.jp-drawer-btn-destructive:hover {
  filter: brightness(1.06);
}

.jp-drawer-node-wrap {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;
}

.jp-drawer-node {
  position: relative;
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s;
}

.jp-drawer-node-pending {
  border-color: rgb(255 255 255 / 0.08);
  background: rgb(255 255 255 / 0.02);
}

.jp-drawer-node-glyph {
  font-size: 1.125rem;
  line-height: 1;
}

.jp-drawer-node-glyph-active {
  display: inline-block;
}

.jp-drawer-node-glyph-pending {
  color: rgb(255 255 255 / 0.15);
}

.jp-drawer-node-ring {
  position: absolute;
  border-radius: 9999px;
  border: 1px solid transparent;
}

.jp-drawer-node-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: color 0.5s;
}

.jp-drawer-connector {
  position: relative;
  z-index: 0;
  flex: 1;
  height: 2px;
  margin-top: -24px;
}

.jp-drawer-connector-base {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background: rgb(255 255 255 / 0.08);
}

.jp-drawer-connector-fill {
  position: absolute;
  left: 0;
  right: auto;
  top: 0;
  bottom: 0;
  border-radius: 9999px;
}

.jp-drawer-connector-orb {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  border-radius: 9999px;
}

.jp-drawer-particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.jp-drawer-particle {
  position: absolute;
  border-radius: 9999px;
}

.jp-drawer-bars {
  height: 1.75rem;
  display: flex;
  align-items: flex-end;
  gap: 3px;
}

.jp-drawer-bars-placeholder {
  height: 1.75rem;
}

.jp-drawer-bar {
  width: 3px;
  border-radius: 2px;
  background: #f59e0b;
  transform-origin: bottom;
}

.jp-drawer-burst {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.jp-drawer-burst-dot {
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 9999px;
}

.jp-drawer-elapsed {
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: rgb(255 255 255 / 0.25);
}

/* Animation helper classes */
.animate-drawer-up { animation: drawer-up 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
.animate-fade-in { animation: fade-in 0.25s ease forwards; }
.animate-fade-up { animation: fade-up 0.35s ease forwards; }
.animate-text-in { animation: text-in 0.3s ease forwards; }
.animate-success-pop { animation: success-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
.countdown-bar { animation: countdown-drain 3s linear forwards; }

.stroke-dash-30 {
  stroke-dasharray: 30;
  stroke-dashoffset: 30;
}

.animate-check-draw {
  animation: check-draw 0.4s 0.05s ease forwards;
}

@keyframes check-draw {
  to { stroke-dashoffset: 0; }
}

@keyframes drawer-up {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(8px); }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes text-in {
  from { opacity: 0; transform: translateX(-6px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes success-pop {
  0% { transform: scale(0.88); opacity: 0; }
  60% { transform: scale(1.04); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes ambient-pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.65; }
}

@keyframes shimmer-sweep {
  from { transform: translateX(-100%); }
  to { transform: translateX(250%); }
}

@keyframes node-glow {
  0%, 100% { box-shadow: 0 0 12px var(--glow-color,#60a5fa55); }
  50% { box-shadow: 0 0 28px var(--glow-color,#60a5fa88), 0 0 48px var(--glow-color,#60a5fa22); }
}

@keyframes glyph-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes ring-expand {
  from { transform: scale(1); opacity: 0.7; }
  to { transform: scale(2.1); opacity: 0; }
}

@keyframes orb-travel {
  from { left: 0%; }
  to { left: calc(100% - 10px); }
}

@keyframes particle-float {
  0% { transform: translateY(0) scale(1); opacity: 0; }
  15% { opacity: 1; }
  100% { transform: translateY(-90px) scale(0.3); opacity: 0; }
}

@keyframes bar-eq {
  from { transform: scaleY(0.4); }
  to { transform: scaleY(1); }
}

@keyframes burst-ray {
  0% { transform: rotate(var(--r, 0deg)) translateX(0); opacity: 1; }
  100% { transform: rotate(var(--r, 0deg)) translateX(56px); opacity: 0; }
}

@keyframes countdown-drain {
  from { width: 100%; }
  to { width: 0%; }
}


END_OF_FILE_CONTENT
mkdir -p "src/components/tiptap"
echo "Creating src/components/tiptap/INTEGRATION.md..."
cat << 'END_OF_FILE_CONTENT' > "src/components/tiptap/INTEGRATION.md"
# Tiptap Editorial — Integration Guide

How to add the `tiptap` section to a new tenant.

---

## 1. Copy the component

Copy the entire folder into the new tenant:

```
src/components/tiptap/
  index.ts
  types.ts
  View.tsx
```

---

## 2. Install npm dependencies

Add to the tenant's `package.json` and run `npm install`:

```json
"@tiptap/extension-image": "^2.11.5",
"@tiptap/extension-link": "^2.11.5",
"@tiptap/react": "^2.11.5",
"@tiptap/starter-kit": "^2.11.5",
"react-markdown": "^9.0.1",
"rehype-sanitize": "^6.0.0",
"remark-gfm": "^4.0.1",
"tiptap-markdown": "^0.8.10"
```

---

## 3. CSS in `src/index.css`

**tenant-alpha:** typography for visitor markdown (`.jp-tiptap-content`) and Studio (`.jp-simple-editor .ProseMirror`) lives in **`src/index.css`**, section **`4b. TIPTAP`** — only `:root` bridge variables (`--theme-text-*`, `--theme-font-*`, `--theme-leading-*`, `--theme-tracking-*`, `--theme-radius-*`, `--foreground`, `--primary`, `--border`, …) so prose tracks **`theme.json`** via the engine.

When copying this capsule into another tenant, copy that block from **tenant-alpha** `index.css` (or ensure your tenant’s global CSS exposes the same semantic vars).

---

## 4. Register in `src/lib/schemas.ts`

```ts
import { TiptapSchema } from '@/components/tiptap';

export const SECTION_SCHEMAS = {
  // ... existing schemas
  'tiptap': TiptapSchema,
} as const;
```

---

## 5. Register in `src/lib/addSectionConfig.ts`

```ts
const addableSectionTypes = [
  // ... existing types
  'tiptap',
] as const;

const sectionTypeLabels = {
  // ... existing labels
  'tiptap': 'Tiptap Editorial',
};

function getDefaultSectionData(type: string) {
  switch (type) {
    // ... existing cases
    case 'tiptap': return { content: '# Post title\n\nStart writing in Markdown...' };
  }
}
```

---

## 6. Register in `src/lib/ComponentRegistry.tsx`

```tsx
import { Tiptap } from '@/components/tiptap';

export const ComponentRegistry = {
  // ... existing components
  'tiptap': Tiptap,
};
```

---

## 7. Register in `src/types.ts`

```ts
import type { TiptapData, TiptapSettings } from '@/components/tiptap';

export type SectionComponentPropsMap = {
  // ... existing entries
  'tiptap': { data: TiptapData; settings?: TiptapSettings };
};

declare module '@jsonpages/core' {
  export interface SectionDataRegistry {
    // ... existing entries
    'tiptap': TiptapData;
  }
  export interface SectionSettingsRegistry {
    // ... existing entries
    'tiptap': TiptapSettings;
  }
}
```

---

## Notes

- Typography uses tenant CSS variables (`--primary`, `--border`, `--muted-foreground`, `--font-mono`) — no hardcoded colors.
- `@tailwindcss/typography` is **not** required; the CSS blocks above replace it.
- The toolbar is admin-only (studio mode). In visitor mode, content is rendered via `ReactMarkdown`.
- Underline is intentionally excluded: `tiptap-markdown` with `html: false` cannot round-trip `<u>` tags.

END_OF_FILE_CONTENT
echo "Creating src/components/tiptap/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/tiptap/View.tsx"
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import type { Components, ExtraProps } from 'react-markdown';
import { useEditor, EditorContent } from '@tiptap/react';
import type { Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Markdown } from 'tiptap-markdown';
import {
  Undo2, Redo2,
  List, ListOrdered,
  Bold, Italic, Strikethrough,
  Code2, Quote, SquareCode,
  Link2, Unlink2, ImagePlus, Eraser,
} from 'lucide-react';
import { STUDIO_EVENTS, useConfig, useStudio } from '@olonjs/core';
import type { TiptapData, TiptapSettings } from './types';

// ── TOC helpers ───────────────────────────────────────────────────────────────

type TocEntry = { id: string; text: string; level: 2 | 3 };

function slugify(raw: string): string {
  return raw
    .replace(/[\u{1F300}-\u{1FFFF}]/gu, '')
    .replace(/[*_`#[\]()]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s.-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function extractToc(markdown: string): TocEntry[] {
  const entries: TocEntry[] = [];
  for (const line of markdown.split('\n')) {
    const h2 = line.match(/^## (.+)/);
    const h3 = line.match(/^### (.+)/);
    if (h2) {
      const text = h2[1].replace(/[*_`#[\]]/g, '').replace(/[\u{1F300}-\u{1FFFF}]/gu, '').trim();
      entries.push({ id: slugify(h2[1]), text, level: 2 });
    } else if (h3) {
      const text = h3[1].replace(/[*_`#[\]]/g, '').trim();
      entries.push({ id: slugify(h3[1]), text, level: 3 });
    }
  }
  return entries;
}

/** Plain text from react-markdown heading children — must match extractToc slugify input semantics. */
function mdChildrenToPlainText(node: React.ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(mdChildrenToPlainText).join('');
  if (React.isValidElement(node)) {
    const ch = (node.props as { children?: React.ReactNode }).children;
    if (ch != null) return mdChildrenToPlainText(ch);
  }
  return '';
}

function readScrollSpyOffsetPx(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--theme-header-h').trim();
  const n = parseFloat(raw);
  const header = Number.isFinite(n) ? n : 56;
  return header + 24;
}

/** Last TOC id whose heading is at or above the activation line (viewport top + offset). */
function computeActiveTocId(ids: readonly string[], offsetPx: number): string {
  let active = '';
  for (const id of ids) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (el.getBoundingClientRect().top <= offsetPx) active = id;
  }
  return active;
}

/** Studio: ProseMirror headings usually have no `id`; match slug(text) to TOC ids in DOM order. */
function computeActiveTocIdFromHeadings(
  container: HTMLElement,
  toc: readonly TocEntry[],
  offsetPx: number
): string {
  const allowed = new Set(toc.map((e) => e.id));
  let active = '';
  container.querySelectorAll<HTMLElement>('h2, h3').forEach((h) => {
    const id = slugify(h.textContent ?? '');
    if (!allowed.has(id)) return;
    if (h.getBoundingClientRect().top <= offsetPx) active = id;
  });
  return active;
}

// ── Sidebar (always rendered, both in Studio and Public) ──────────────────────

const DocsSidebar: React.FC<{
  toc: TocEntry[];
  activeId: string;
  onNav: (id: string) => void;
}> = ({ toc, activeId, onNav }) => {
  const navScrollRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (!activeId || !navScrollRef.current) return;
    const btn = navScrollRef.current.querySelector<HTMLButtonElement>(
      `button[data-toc-id="${CSS.escape(activeId)}"]`
    );
    btn?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [activeId, toc]);

  return (
    <aside
      className="hidden w-[min(240px,28vw)] flex-shrink-0 flex-col lg:flex lg:sticky lg:self-start"
      style={{
        top: 'calc(var(--theme-header-h, 56px) + 1rem)',
        maxHeight: 'calc(100vh - var(--theme-header-h, 56px) - 4rem)',
      }}
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[var(--local-radius-md)] border border-[var(--local-border)] bg-[color-mix(in_srgb,var(--local-toolbar-bg)_40%,transparent)]">
        <div className="shrink-0 border-b border-[var(--local-border)] px-3 py-2.5">
          <div className="text-[9px] font-mono font-bold uppercase tracking-[0.14em] text-[var(--local-toolbar-text)]">
            On this page
          </div>
        </div>
        <nav
          ref={navScrollRef}
          className="jp-docs-toc-scroll flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto overscroll-y-contain px-1.5 py-2"
          aria-label="Table of contents"
        >
          {toc.map((entry) => (
            <button
              key={entry.id}
              type="button"
              data-toc-id={entry.id}
              onClick={() => onNav(entry.id)}
              className={[
                'text-left rounded-[var(--local-radius-sm)] transition-colors duration-150 no-underline',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--local-bg)]',
                entry.level === 3
                  ? 'pl-[22px] pr-2 py-1.5 text-[0.72rem] ml-0.5'
                  : 'px-2.5 py-2 font-bold text-[0.76rem]',
                activeId === entry.id
                  ? entry.level === 2
                    ? 'text-[var(--local-primary)] bg-[var(--local-toolbar-hover-bg)] border-l-2 border-[var(--local-primary)] pl-[8px]'
                    : 'text-[var(--local-primary)] font-semibold bg-[var(--local-toolbar-active-bg)]'
                  : 'text-[var(--local-text-muted)] hover:text-[var(--local-text)] hover:bg-[var(--local-toolbar-hover-bg)]',
              ].join(' ')}
            >
              {entry.level === 3 && (
                <span
                  className={`mr-2 inline-block h-[5px] w-[5px] flex-shrink-0 rounded-full align-middle mb-px ${
                    activeId === entry.id ? 'bg-[var(--local-primary)]' : 'bg-[var(--local-border)]'
                  }`}
                />
              )}
              <span className="line-clamp-3">{entry.text}</span>
            </button>
          ))}
        </nav>
        <div className="shrink-0 border-t border-[var(--local-border)] px-2 py-2.5">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex w-full items-center gap-2 px-2 font-mono text-[0.58rem] uppercase tracking-widest text-[var(--local-text-muted)] transition-colors hover:text-[var(--local-primary)]"
          >
            ↑ Back to top
          </button>
        </div>
      </div>
    </aside>
  );
};

// ── UI primitives ─────────────────────────────────────────────────────────────

const Btn: React.FC<{
  active?: boolean;
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active = false, title, onClick, children }) => (
  <button
    type="button"
    title={title}
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    className={[
      'inline-flex h-7 min-w-7 items-center justify-center rounded-[var(--local-radius-sm)] px-2 text-xs transition-colors',
      active
        ? 'bg-[var(--local-toolbar-active-bg)] text-[var(--local-text)]'
        : 'text-[var(--local-toolbar-text)] hover:bg-[var(--local-toolbar-hover-bg)] hover:text-[var(--local-text)]',
    ].join(' ')}
  >
    {children}
  </button>
);

const Sep: React.FC = () => (
  <span className="mx-0.5 h-5 w-px shrink-0 bg-[var(--local-toolbar-border)]" aria-hidden />
);

// ── Image extension with upload metadata ──────────────────────────────────────

const UploadableImage = Image.extend({
  addAttributes() {
    const bool = (attr: string) => ({
      default: false,
      parseHTML: (el: HTMLElement) => el.getAttribute(attr) === 'true',
      renderHTML: (attrs: Record<string, unknown>) =>
        attrs[attr.replace('data-', '').replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())]
          ? { [attr]: 'true' }
          : {},
    });
    return {
      ...this.parent?.(),
      uploadId: {
        default: null,
        parseHTML: (el: HTMLElement) => el.getAttribute('data-upload-id'),
        renderHTML: (attrs: Record<string, unknown>) =>
          attrs.uploadId ? { 'data-upload-id': String(attrs.uploadId) } : {},
      },
      uploading: bool('data-uploading'),
      uploadError: bool('data-upload-error'),
      awaitingUpload: bool('data-awaiting-upload'),
    };
  },
});

// ── Helpers ───────────────────────────────────────────────────────────────────

const getMarkdown = (ed: Editor | null | undefined): string =>
  (ed?.storage as { markdown?: { getMarkdown?: () => string } } | undefined)
    ?.markdown?.getMarkdown?.() ?? '';

const svg = (body: string) =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='420' viewBox='0 0 1200 420'>${body}</svg>`
  );

const RECT = `<rect width='1200' height='420' fill='#090B14' stroke='#3F3F46' stroke-width='3' stroke-dasharray='10 10' rx='12'/>`;

const UPLOADING_SRC = svg(
  RECT +
  `<text x='600' y='215' font-family='Inter,Arial,sans-serif' font-size='28' font-weight='700' fill='#A1A1AA' text-anchor='middle'>Uploading image…</text>`
);

const PICKER_SRC = svg(
  RECT +
  `<text x='600' y='200' font-family='Inter,Arial,sans-serif' font-size='32' font-weight='700' fill='#E4E4E7' text-anchor='middle'>Click to upload or drag &amp; drop</text>` +
  `<text x='600' y='248' font-family='Inter,Arial,sans-serif' font-size='22' fill='#A1A1AA' text-anchor='middle'>Max 5 MB per file</text>`
);

const patchImage = (
  ed: Editor,
  uploadId: string,
  patch: Record<string, unknown>
): boolean => {
  let pos: number | null = null;
  ed.state.doc.descendants(
    (node: { type: { name: string }; attrs?: Record<string, unknown> }, p: number) => {
      if (node.type.name === 'image' && node.attrs?.uploadId === uploadId) {
        pos = p;
        return false;
      }
      return true;
    }
  );
  if (pos == null) return false;
  const cur = ed.state.doc.nodeAt(pos);
  if (!cur) return false;
  ed.view.dispatch(ed.state.tr.setNodeMarkup(pos, undefined, { ...cur.attrs, ...patch }));
  return true;
};

// Extensions defined outside component — stable reference, no re-creation on render
const EXTENSIONS = [
  StarterKit,
  Link.configure({ openOnClick: false, autolink: true }),
  UploadableImage,
  // NOTE: Underline is intentionally excluded.
  // tiptap-markdown with html:false cannot round-trip <u> tags, so underline
  // would be silently dropped on save. Use bold/italic instead.
  Markdown.configure({ html: false }),
];

const EDITOR_CLASSES =
  'min-h-[220px] p-4 outline-none';

// ── Studio editor component ───────────────────────────────────────────────────

const StudioTiptapEditor: React.FC<{ data: TiptapData }> = ({ data }) => {
  const { assets } = useConfig();

  // DOM refs
  const hostRef = React.useRef<HTMLDivElement | null>(null);
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Editor & upload state
  const editorRef = React.useRef<Editor | null>(null);
  const pendingUploads = React.useRef<Map<string, Promise<void>>>(new Map());
  const pendingPickerId = React.useRef<string | null>(null);

  // Markdown sync refs
  const latestMd = React.useRef<string>(data.content ?? '');
  const emittedMd = React.useRef<string>(data.content ?? '');

  // Link popover state
  const [linkOpen, setLinkOpen] = React.useState(false);
  const [linkUrl, setLinkUrl] = React.useState('');
  const linkInputRef = React.useRef<HTMLInputElement | null>(null);

  // ── Core helpers ────────────────────────────────────────────────────────

  const getSectionId = React.useCallback((): string | null => {
    const el =
      sectionRef.current ??
      (hostRef.current?.closest('[data-section-id]') as HTMLElement | null);
    sectionRef.current = el;
    return el?.getAttribute('data-section-id') ?? null;
  }, []);

  const emit = React.useCallback(
    (markdown: string) => {
      latestMd.current = markdown;
      const sectionId = getSectionId();
      if (!sectionId) return;
      window.parent.postMessage(
        {
          type: STUDIO_EVENTS.INLINE_FIELD_UPDATE,
          sectionId,
          fieldKey: 'content',
          value: markdown,
        },
        window.location.origin
      );
      emittedMd.current = markdown;
    },
    [getSectionId]
  );

  const setFocusLock = React.useCallback((on: boolean) => {
    sectionRef.current?.classList.toggle('jp-editorial-focus', on);
  }, []);

  // ── Image upload ─────────────────────────────────────────────────────────

  const insertPlaceholder = React.useCallback(
    (uploadId: string, src: string, awaitingUpload: boolean) => {
      const ed = editorRef.current;
      if (!ed) return;
      ed.chain()
        .focus()
        .setImage({
          src,
          alt: 'upload-placeholder',
          title: awaitingUpload ? 'Click to upload' : 'Uploading…',
          uploadId,
          uploading: !awaitingUpload,
          awaitingUpload,
          uploadError: false,
        } as any)
        .run();
      emit(getMarkdown(ed));
    },
    [emit]
  );

  const doUpload = React.useCallback(
    async (uploadId: string, file: File) => {
      const uploadFn = assets?.onAssetUpload;
      if (!uploadFn) return;
      const ed = editorRef.current;
      if (!ed) return;
      patchImage(ed, uploadId, {
        src: UPLOADING_SRC,
        alt: file.name,
        title: file.name,
        uploading: true,
        awaitingUpload: false,
        uploadError: false,
      });
      const task = (async () => {
        try {
          const url = await uploadFn(file);
          const cur = editorRef.current;
          if (cur) {
            patchImage(cur, uploadId, {
              src: url,
              alt: file.name,
              title: file.name,
              uploadId: null,
              uploading: false,
              awaitingUpload: false,
              uploadError: false,
            });
            emit(getMarkdown(cur));
          }
        } catch (err) {
          console.error('[tiptap] upload failed', err);
          const cur = editorRef.current;
          if (cur)
            patchImage(cur, uploadId, {
              uploading: false,
              awaitingUpload: false,
              uploadError: true,
            });
        } finally {
          pendingUploads.current.delete(uploadId);
        }
      })();
      pendingUploads.current.set(uploadId, task);
      await task;
    },
    [assets, emit]
  );

  const uploadFile = React.useCallback(
    async (file: File) => {
      const id = crypto.randomUUID();
      insertPlaceholder(id, UPLOADING_SRC, false);
      await doUpload(id, file);
    },
    [insertPlaceholder, doUpload]
  );

  // ── Stable editorProps via refs (avoids stale closures in useEditor) ─────
  // Reads refs at call-time so useEditor never needs to rebuild the editor.

  const uploadFileRef = React.useRef(uploadFile);
  uploadFileRef.current = uploadFile;
  const assetsRef = React.useRef(assets);
  assetsRef.current = assets;

  const editorProps = React.useMemo(
    () => ({
      attributes: { class: EDITOR_CLASSES },
      handleDrop: (_v: unknown, event: DragEvent) => {
        const file = event.dataTransfer?.files?.[0];
        if (!file?.type.startsWith('image/') || !assetsRef.current?.onAssetUpload) return false;
        event.preventDefault();
        void uploadFileRef.current(file).catch((e) =>
          console.error('[tiptap] drop upload failed', e)
        );
        return true;
      },
      handlePaste: (_v: unknown, event: ClipboardEvent) => {
        const file = Array.from(event.clipboardData?.files ?? []).find((f: File) =>
          f.type.startsWith('image/')
        );
        if (!file || !assetsRef.current?.onAssetUpload) return false;
        event.preventDefault();
        void uploadFileRef.current(file).catch((e) =>
          console.error('[tiptap] paste upload failed', e)
        );
        return true;
      },
      handleClickOn: (
        _v: unknown,
        _p: number,
        node: { type: { name: string }; attrs?: Record<string, unknown> }
      ) => {
        if (node.type.name !== 'image' || node.attrs?.awaitingUpload !== true) return false;
        const uploadId =
          typeof node.attrs?.uploadId === 'string' ? node.attrs.uploadId : null;
        if (!uploadId) return false;
        pendingPickerId.current = uploadId;
        fileInputRef.current?.click();
        return true;
      },
    }),
    [] // intentionally empty — reads refs at call-time
  );

  // ── useEditor ─────────────────────────────────────────────────────────────

  const emitRef = React.useRef(emit);
  emitRef.current = emit;

  const editor = useEditor({
    extensions: EXTENSIONS,
    content: data.content ?? '',
    autofocus: false,
    editorProps,
    onUpdate: ({ editor: e }: { editor: Editor }) => emitRef.current(getMarkdown(e)),
    onFocus: () => setFocusLock(true),
    onBlur: ({ editor: e }: { editor: Editor }) => {
      const md = getMarkdown(e);
      if (md !== emittedMd.current) emitRef.current(md);
      setFocusLock(false);
    },
  });

  // ── Effects ───────────────────────────────────────────────────────────────

  React.useEffect(() => {
    sectionRef.current =
      hostRef.current?.closest('[data-section-id]') as HTMLElement | null;
  }, []);

  React.useEffect(() => {
    editorRef.current = editor ?? null;
  }, [editor]);

  // Sync external content changes into editor (e.g. engine-level undo)
  React.useEffect(() => {
    if (!editor) return;
    const next = data.content ?? '';
    if (next === latestMd.current) return;
    editor.commands.setContent(next);
    latestMd.current = next;
  }, [data.content, editor]);

  // PreviewEntry receives REQUEST_INLINE_FLUSH via postMessage and re-dispatches
  // it as a DOM CustomEvent. Listen to the DOM event — do NOT send INLINE_FLUSHED
  // back (PreviewEntry already handles that acknowledgement).
  React.useEffect(() => {
    const handler = () => {
      void (async () => {
        if (pendingUploads.current.size > 0) {
          await Promise.allSettled(Array.from(pendingUploads.current.values()));
        }
        emitRef.current(getMarkdown(editorRef.current));
      })();
    };
    window.addEventListener(STUDIO_EVENTS.REQUEST_INLINE_FLUSH, handler);
    return () => window.removeEventListener(STUDIO_EVENTS.REQUEST_INLINE_FLUSH, handler);
  }, []);

  // File input cancel: modern browsers fire a 'cancel' event when user
  // closes the picker without selecting a file.
  React.useEffect(() => {
    const input = fileInputRef.current;
    if (!input) return;
    const onCancel = () => {
      const pickId = pendingPickerId.current;
      if (pickId && editorRef.current) {
        patchImage(editorRef.current, pickId, {
          uploading: false,
          awaitingUpload: false,
          uploadError: true,
        });
      }
      pendingPickerId.current = null;
    };
    input.addEventListener('cancel', onCancel);
    return () => input.removeEventListener('cancel', onCancel);
  }, []);

  // Emit on unmount (safety flush)
  React.useEffect(
    () => () => {
      const md = getMarkdown(editorRef.current);
      if (md !== emittedMd.current) emitRef.current(md);
      setFocusLock(false);
    },
    [setFocusLock]
  );

  // Focus link input when popover opens
  React.useEffect(() => {
    if (linkOpen) {
      const t = setTimeout(() => linkInputRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [linkOpen]);

  // ── Toolbar actions ───────────────────────────────────────────────────────

  const openLink = () => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href as string | undefined;
    setLinkUrl(prev ?? 'https://');
    setLinkOpen(true);
  };

  const applyLink = () => {
    if (!editor) return;
    const href = linkUrl.trim();
    if (href === '' || href === 'https://') {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
    }
    setLinkOpen(false);
  };

  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const pickId = pendingPickerId.current;
    e.target.value = '';

    if (!file?.type.startsWith('image/') || !assets?.onAssetUpload) {
      // File picker opened but no valid file selected — clean up placeholder
      if (pickId && editorRef.current) {
        patchImage(editorRef.current, pickId, {
          uploading: false,
          awaitingUpload: false,
          uploadError: true,
        });
      }
      pendingPickerId.current = null;
      return;
    }

    void (async () => {
      try {
        if (pickId) {
          await doUpload(pickId, file);
          pendingPickerId.current = null;
        } else {
          await uploadFile(file);
        }
      } catch (err) {
        console.error('[tiptap] picker upload failed', err);
        pendingPickerId.current = null;
      }
    })();
  };

  const onPickImage = () => {
    if (pendingPickerId.current) return;
    const id = crypto.randomUUID();
    pendingPickerId.current = id;
    insertPlaceholder(id, PICKER_SRC, true);
  };

  const isActive = (name: string, attrs?: Record<string, unknown>) =>
    editor?.isActive(name, attrs) ?? false;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div ref={hostRef} data-jp-field="content" className="space-y-2">
      {editor && (
        <div
          data-jp-ignore-select="true"
          className="sticky top-0 z-[65] border-b border-[var(--local-toolbar-border)] bg-[var(--local-toolbar-bg)]"
        >
          {/* ── Main toolbar ── */}
          <div className="flex flex-wrap items-center justify-center gap-1 p-2">
            {/* History */}
            <Btn title="Undo" onClick={() => editor.chain().focus().undo().run()}>
              <Undo2 size={13} />
            </Btn>
            <Btn title="Redo" onClick={() => editor.chain().focus().redo().run()}>
              <Redo2 size={13} />
            </Btn>
            <Sep />

            {/* Block type */}
            <Btn
              active={isActive('paragraph')}
              title="Paragraph"
              onClick={() => editor.chain().focus().setParagraph().run()}
            >
              P
            </Btn>
            <Btn
              active={isActive('heading', { level: 1 })}
              title="Heading 1"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            >
              H1
            </Btn>
            <Btn
              active={isActive('heading', { level: 2 })}
              title="Heading 2"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
              H2
            </Btn>
            <Btn
              active={isActive('heading', { level: 3 })}
              title="Heading 3"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            >
              H3
            </Btn>
            <Sep />

            {/* Inline marks */}
            <Btn
              active={isActive('bold')}
              title="Bold (Ctrl+B)"
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold size={13} />
            </Btn>
            <Btn
              active={isActive('italic')}
              title="Italic (Ctrl+I)"
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic size={13} />
            </Btn>
            <Btn
              active={isActive('strike')}
              title="Strikethrough"
              onClick={() => editor.chain().focus().toggleStrike().run()}
            >
              <Strikethrough size={13} />
            </Btn>
            <Btn
              active={isActive('code')}
              title="Inline code"
              onClick={() => editor.chain().focus().toggleCode().run()}
            >
              <Code2 size={13} />
            </Btn>
            <Sep />

            {/* Lists & block nodes */}
            <Btn
              active={isActive('bulletList')}
              title="Bullet list"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <List size={13} />
            </Btn>
            <Btn
              active={isActive('orderedList')}
              title="Ordered list"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <ListOrdered size={13} />
            </Btn>
            <Btn
              active={isActive('blockquote')}
              title="Blockquote"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
              <Quote size={13} />
            </Btn>
            <Btn
              active={isActive('codeBlock')}
              title="Code block"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            >
              <SquareCode size={13} />
            </Btn>
            <Sep />

            {/* Link / image / clear */}
            <Btn
              active={isActive('link') || linkOpen}
              title="Set link"
              onClick={openLink}
            >
              <Link2 size={13} />
            </Btn>
            <Btn
              title="Remove link"
              onClick={() => editor.chain().focus().unsetLink().run()}
            >
              <Unlink2 size={13} />
            </Btn>
            <Btn title="Insert image" onClick={onPickImage}>
              <ImagePlus size={13} />
            </Btn>
            <Btn
              title="Clear formatting"
              onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
            >
              <Eraser size={13} />
            </Btn>
          </div>

          {/* ── Link popover row (replaces window.prompt) ── */}
          {linkOpen && (
            <div className="flex items-center gap-2 border-t border-[var(--local-toolbar-border)] px-2 py-1.5">
              <Link2 size={12} className="shrink-0 text-[var(--local-toolbar-text)]" />
              <input
                ref={linkInputRef}
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    applyLink();
                  }
                  if (e.key === 'Escape') setLinkOpen(false);
                }}
                placeholder="https://example.com"
                className="min-w-0 flex-1 bg-transparent text-xs text-[var(--local-text)] placeholder:text-[var(--local-toolbar-text)] outline-none"
              />
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={applyLink}
                className="shrink-0 rounded-[var(--local-radius-sm)] px-2 py-0.5 text-xs bg-[var(--local-primary)] hover:brightness-110 text-white transition-colors"
              >
                Set
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setLinkOpen(false)}
                className="shrink-0 rounded-[var(--local-radius-sm)] px-2 py-0.5 text-xs bg-[var(--local-toolbar-active-bg)] hover:bg-[var(--local-toolbar-hover-bg)] text-[var(--local-text)] transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      <EditorContent editor={editor} className="jp-simple-editor" />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileSelected}
      />
    </div>
  );
};

// ── Public view ───────────────────────────────────────────────────────────────

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & ExtraProps;

const mdHeading =
  (level: 2 | 3) =>
  ({ children, node: _node, ...rest }: HeadingProps) => {
    const plain = mdChildrenToPlainText(children);
    const id = slugify(plain);
    const Tag = `h${level}` as 'h2' | 'h3';
    return (
      <Tag id={id} {...rest}>
        {children}
      </Tag>
    );
  };

const MD_COMPONENTS: Components = {
  h2: mdHeading(2),
  h3: mdHeading(3),
};

const PublicTiptapContent: React.FC<{ content: string }> = ({ content }) => (
  <article className="jp-tiptap-content max-w-none" data-jp-field="content">
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSanitize]}
      components={MD_COMPONENTS}
    >
      {content}
    </ReactMarkdown>
  </article>
);

// ── Export ────────────────────────────────────────────────────────────────────

export const Tiptap: React.FC<{ data: TiptapData; settings?: TiptapSettings }> = ({ data, settings: _settings }) => {
  const { mode } = useStudio();
  const isStudio = mode === 'studio';

  const toc = React.useMemo(() => extractToc(data.content ?? ''), [data.content]);
  const [activeId, setActiveId] = React.useState<string>('');
  const contentRef = React.useRef<HTMLDivElement | null>(null);

  // Scroll-spy: last TOC heading at/above viewport line (public: id on headings; Studio: slug from text).
  React.useEffect(() => {
    if (toc.length === 0) return;
    const ids = toc.map((e) => e.id);
    let raf = 0;
    const tick = () => {
      const offset = readScrollSpyOffsetPx();
      const next = isStudio
        ? contentRef.current
          ? computeActiveTocIdFromHeadings(contentRef.current, toc, offset)
          : ''
        : computeActiveTocId(ids, offset);
      if (next) setActiveId((prev) => (prev === next ? prev : next));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };
    const t = setTimeout(() => {
      tick();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
    }, 100);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [toc, isStudio]);

  const handleNav = React.useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
      return;
    }
    // Studio mode: headings are in ProseMirror, no IDs — find by text in editor DOM
    if (contentRef.current) {
      const headings = Array.from(
        contentRef.current.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6')
      );
      const target = headings.find((h) => slugify(h.textContent ?? '') === id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveId(id);
      }
    }
  }, []);

  return (
    <section
      style={{
        '--local-bg': 'var(--background)',
        '--local-text': 'var(--foreground)',
        '--local-text-muted': 'var(--muted-foreground)',
        '--local-primary': 'var(--primary)',
        '--local-accent': 'var(--accent)',
        '--local-border': 'var(--border)',
        '--local-radius-sm': 'var(--theme-radius-sm)',
        '--local-radius-md': 'var(--theme-radius-md)',
        '--local-radius-lg': 'var(--theme-radius-lg)',
        '--local-toolbar-bg': 'var(--demo-surface-strong)',
        '--local-toolbar-hover-bg': 'var(--demo-surface)',
        '--local-toolbar-active-bg': 'var(--demo-accent-soft)',
        '--local-toolbar-border': 'var(--demo-border-soft)',
        '--local-toolbar-text': 'var(--demo-text-faint)',
      } as React.CSSProperties}
      className="w-full py-12 bg-[var(--local-bg)]"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex gap-8 py-12">
          {toc.length > 0 && (
            <DocsSidebar toc={toc} activeId={activeId} onNav={handleNav} />
          )}
          <div ref={contentRef} className="flex-1 min-w-0">
            {isStudio ? (
              <StudioTiptapEditor data={data} />
            ) : (
              <PublicTiptapContent content={data.content ?? ''} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

END_OF_FILE_CONTENT
echo "Creating src/components/tiptap/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/tiptap/index.ts"
export * from './View';
export * from './schema';
export * from './types';

END_OF_FILE_CONTENT
echo "Creating src/components/tiptap/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/tiptap/schema.ts"
import { z } from 'zod';
import { BaseSectionData } from '@/lib/base-schemas';

export const TiptapSchema = BaseSectionData.extend({
  content: z.string().default('').describe('ui:editorial-markdown'),
});

export const TiptapSettingsSchema = z.object({});

END_OF_FILE_CONTENT
echo "Creating src/components/tiptap/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/tiptap/types.ts"
import { z } from 'zod';
import { TiptapSchema, TiptapSettingsSchema } from './schema';

export type TiptapData = z.infer<typeof TiptapSchema>;
export type TiptapSettings = z.infer<typeof TiptapSettingsSchema>;

END_OF_FILE_CONTENT
mkdir -p "src/components/ui"
echo "Creating src/components/ui/OlonMark.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/ui/OlonMark.tsx"
import { cn } from '@/lib/utils'

interface OlonMarkProps {
  size?: number
  /** mono: uses currentColor — for single-colour print/emboss contexts */
  variant?: 'default' | 'mono'
  className?: string
}

export function OlonMark({ size = 32, variant = 'default', className }: OlonMarkProps) {
  const gid = `olon-ring-${size}`

  if (variant === 'mono') {
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        aria-label="Olon mark"
        className={cn('flex-shrink-0', className)}
      >
        <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="20"/>
        <circle cx="50" cy="50" r="15" fill="currentColor"/>
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      aria-label="Olon mark"
      className={cn('flex-shrink-0', className)}
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="var(--olon-ring-top)"/>
          <stop offset="100%" stopColor="var(--olon-ring-bottom)"/>
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="38" stroke={`url(#${gid})`} strokeWidth="20"/>
      <circle cx="50" cy="50" r="15" fill="var(--olon-nucleus)"/>
    </svg>
  )
}

interface OlonLogoProps {
  markSize?: number
  fontSize?: number
  variant?: 'default' | 'mono'
  className?: string
}

export function OlonLogo({
  markSize = 32,
  fontSize = 24,
  variant = 'default',
  className,
}: OlonLogoProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <OlonMark size={markSize} variant={variant}/>
      <span
        style={{
          fontFamily: "'Instrument Sans', Helvetica, Arial, sans-serif",
          fontWeight: 700,
          fontSize,
          letterSpacing: '-0.02em',
          color: 'hsl(var(--foreground))',
          lineHeight: 1,
        }}
      >
        Olon
      </span>
    </div>
  )
}

END_OF_FILE_CONTENT
echo "Creating src/components/ui/badge.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/ui/badge.tsx"
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default:  'bg-primary-900 text-primary-light border border-primary rounded-sm',
        outline:  'bg-elevated text-muted-foreground border border-border rounded-sm',
        accent:   'text-accent border border-border-strong rounded-sm',
        solid:    'bg-primary text-primary-foreground rounded-sm',
        pill:     'bg-elevated text-muted-foreground border border-border rounded-full gap-1.5',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }

END_OF_FILE_CONTENT
echo "Creating src/components/ui/button.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/ui/button.tsx"
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 shrink-0',
  {
    variants: {
      variant: {
        default:     'bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98]',
        secondary:   'bg-transparent text-primary-light border border-primary hover:bg-primary-900 active:scale-[0.98]',
        outline:     'bg-transparent text-foreground border border-border hover:bg-elevated active:scale-[0.98]',
        ghost:       'bg-transparent text-muted-foreground hover:text-foreground hover:bg-elevated active:scale-[0.98]',
        accent:      'bg-accent text-accent-foreground hover:opacity-90 active:scale-[0.98]',
        destructive: 'bg-destructive text-destructive-foreground border border-destructive-border hover:opacity-90 active:scale-[0.98]',
      },
      size: {
        default: 'h-9 px-4 text-sm rounded-md',
        sm:      'h-8 px-3.5 text-sm rounded-md',
        lg:      'h-10 px-5 text-base rounded-md',
        icon:    'h-9 w-9 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size, className }))

    // asChild: clone the single child element, merging our classes onto it
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<{ className?: string }>, {
        className: cn(classes, (children as React.ReactElement<{ className?: string }>).props.className),
      })
    }

    return (
      <button className={classes} ref={ref} {...props}>
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }

END_OF_FILE_CONTENT
echo "Creating src/components/ui/card.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/ui/card.tsx"
import * as React from 'react'
import { cn } from '@/lib/utils'

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-lg border border-border bg-card text-card-foreground', className)}
      {...props}
    />
  )
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-1.5 p-5', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-sm font-medium text-foreground leading-tight', className)} {...props} />
  )
)
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-xs text-muted-foreground leading-relaxed', className)} {...props} />
  )
)
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('px-5 pb-5', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center px-5 pb-5', className)} {...props} />
  )
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }

END_OF_FILE_CONTENT
echo "Creating src/components/ui/checkbox.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/ui/checkbox.tsx"
"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "border-input dark:bg-input/30 data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary data-checked:border-primary aria-invalid:aria-checked:border-primary aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 flex size-4 items-center justify-center rounded-[4px] border transition-colors group-has-disabled/field:opacity-50 focus-visible:ring-3 aria-invalid:ring-3 peer relative shrink-0 outline-none after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="[&>svg]:size-3.5 grid place-content-center text-current transition-none"
      >
        <CheckIcon
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }





END_OF_FILE_CONTENT
echo "Creating src/components/ui/input.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/ui/input.tsx"
import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground',
          'focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'transition-colors duration-150',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }

END_OF_FILE_CONTENT
echo "Creating src/components/ui/label.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/ui/label.tsx"
import * as React from 'react'
import { cn } from '@/lib/utils'

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn('block text-xs font-medium text-foreground mb-1.5 cursor-default', className)}
    {...props}
  />
))
Label.displayName = 'Label'

export { Label }

END_OF_FILE_CONTENT
echo "Creating src/components/ui/select.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/ui/select.tsx"
import * as React from "react"
import { Select as SelectPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { ChevronDownIcon, CheckIcon, ChevronUpIcon } from "lucide-react"

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1 p-1", className)}
      {...props}
    />
  )
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "border-input data-placeholder:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 gap-1.5 rounded-lg border bg-transparent py-2 pr-2 pl-2.5 text-sm transition-colors select-none focus-visible:ring-3 aria-invalid:ring-3 data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] *:data-[slot=select-value]:gap-1.5 [&_svg:not([class*='size-'])]:size-4 flex w-full items-center justify-between whitespace-nowrap outline-none disabled:cursor-not-allowed disabled:opacity-50 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="text-muted-foreground size-4 pointer-events-none" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = "popper",
  align = "center",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        data-align-trigger={position === "item-aligned"}
        className={cn(
          "bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 min-w-36 rounded-lg shadow-md ring-1 duration-100 relative z-[110] max-h-(--radix-select-content-available-height) origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto data-[align-trigger=true]:animate-none", 
          position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", 
          className 
        )}
        position={position}
        align={align}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          data-position={position}
          className={cn(
            "p-1",
            position === "popper" && "h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width)"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("text-muted-foreground px-1.5 py-1 text-xs", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2 relative flex w-full cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="pointer-events-none" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border -mx-1 my-1 h-px pointer-events-none", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn("bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4", className)}
      {...props}
    >
      <ChevronUpIcon />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn("bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4", className)}
      {...props}
    >
      <ChevronDownIcon />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}




END_OF_FILE_CONTENT
echo "Creating src/components/ui/select.txt..."
cat << 'END_OF_FILE_CONTENT' > "src/components/ui/select.txt"
import * as React from "react"
import { Select as SelectPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { ChevronDownIcon, CheckIcon, ChevronUpIcon } from "lucide-react"

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1 p-1", className)}
      {...props}
    />
  )
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "border-input data-placeholder:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 gap-1.5 rounded-lg border bg-transparent py-2 pr-2 pl-2.5 text-sm transition-colors select-none focus-visible:ring-3 aria-invalid:ring-3 data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] *:data-[slot=select-value]:gap-1.5 [&_svg:not([class*='size-'])]:size-4 flex w-full items-center justify-between whitespace-nowrap outline-none disabled:cursor-not-allowed disabled:opacity-50 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="text-muted-foreground size-4 pointer-events-none" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = "popper",
  align = "center",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        data-align-trigger={position === "item-aligned"}
        className={cn(
          "bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 min-w-36 rounded-lg shadow-md ring-1 duration-100 relative z-[110] max-h-(--radix-select-content-available-height) origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto data-[align-trigger=true]:animate-none", 
          position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", 
          className 
        )}
        position={position}
        align={align}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          data-position={position}
          className={cn(
            "p-1",
            position === "popper" && "h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width)"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("text-muted-foreground px-1.5 py-1 text-xs", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2 relative flex w-full cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="pointer-events-none" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border -mx-1 my-1 h-px pointer-events-none", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn("bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4", className)}
      {...props}
    >
      <ChevronUpIcon />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn("bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4", className)}
      {...props}
    >
      <ChevronDownIcon />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}




END_OF_FILE_CONTENT
echo "Creating src/components/ui/separator.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/ui/separator.tsx"
import * as React from 'react'
import { cn } from '@/lib/utils'

const Separator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { orientation?: 'horizontal' | 'vertical' }
>(({ className, orientation = 'horizontal', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'shrink-0 bg-border',
      orientation === 'horizontal' ? 'h-[0.5px] w-full' : 'h-full w-[0.5px]',
      className
    )}
    {...props}
  />
))
Separator.displayName = 'Separator'

export { Separator }

END_OF_FILE_CONTENT
echo "Creating src/components/ui/skeleton.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/ui/skeleton.tsx"
import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  );
}

export { Skeleton };

END_OF_FILE_CONTENT
echo "Creating src/components/ui/textarea.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/ui/textarea.tsx"
import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 disabled:bg-input/50 dark:disabled:bg-input/80 rounded-lg border bg-transparent px-2.5 py-2 text-base transition-colors focus-visible:ring-3 aria-invalid:ring-3 md:text-sm placeholder:text-muted-foreground flex field-sizing-content min-h-16 w-full outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }





END_OF_FILE_CONTENT
mkdir -p "src/data"
mkdir -p "src/data/config"
echo "Creating src/data/config/menu.json..."
cat << 'END_OF_FILE_CONTENT' > "src/data/config/menu.json"
{
  "main": [
    {
      "label": "Platform",
      "href": "/platform",
      "children": [
        {
          "label": "Overview",
          "href": "/platform/overview"
        },
        {
          "label": "Architecture",
          "href": "/platform/architecture"
        },
        {
          "label": "Security",
          "href": "/platform/security"
        },
        {
          "label": "Integrations",
          "href": "/platform/integrations"
        },
        {
          "label": "Roadmap",
          "href": "/platform/roadmap"
        }
      ]
    },
    {
      "label": "Solutions",
      "href": "/solutions"
    },
    {
      "label": "Pricing",
      "href": "/pricing"
    },
    {
      "label": "Resources",
      "href": "/resources"
    }
  ]
}
END_OF_FILE_CONTENT
# SKIP: src/data/config/menu.json:Zone.Identifier is binary and cannot be embedded as text.
echo "Creating src/data/config/site.json..."
cat << 'END_OF_FILE_CONTENT' > "src/data/config/site.json"
{
  "identity": {
    "title": "OlonJS",
    "logoUrl": "/brand/mark/olon-mark-dark.svg"
  },
  "pages": [
    {
      "slug": "home",
      "label": "Home"
    },
    {
      "slug": "design-system",
      "label": "Design System"
    }
  ],
  "header": {
    "id": "global-header",
    "type": "header",
    "data": {
      "logoText": "Olon",
      "badge": "",
      "links": [
        {
          "label": "Platform",
          "href": "/platform",
          "children": [
            {
              "label": "Overview",
              "href": "/platform/overview"
            },
            {
              "label": "Architecture",
              "href": "/platform/architecture"
            },
            {
              "label": "Security",
              "href": "/platform/security"
            },
            {
              "label": "Integrations",
              "href": "/platform/integrations"
            },
            {
              "label": "Roadmap",
              "href": "/platform/roadmap"
            }
          ]
        },
        {
          "label": "Solutions",
          "href": "/solutions"
        },
        {
          "label": "Pricing",
          "href": "/pricing"
        },
        {
          "label": "Resources",
          "href": "/resources"
        }
      ],
      "ctaLabel": "Get started →",
      "ctaHref": "#contact",
      "signinHref": "#login"
    }
  },
  "footer": {
    "id": "global-footer",
    "type": "footer",
    "data": {
      "brandText": "Olon",
      "copyright": "© 2025 OlonJS · v1.4 · Holon",
      "links": [
        {
          "label": "Docs",
          "href": "/docs"
        },
        {
          "label": "GitHub",
          "href": "#"
        },
        {
          "label": "Privacy",
          "href": "#"
        },
        {
          "label": "Terms",
          "href": "#"
        }
      ],
      "designSystemHref": "/design-system"
    },
    "settings": {
      "showLogo": true
    }
  }
}
END_OF_FILE_CONTENT
# SKIP: src/data/config/site.json:Zone.Identifier is binary and cannot be embedded as text.
echo "Creating src/data/config/theme.json..."
cat << 'END_OF_FILE_CONTENT' > "src/data/config/theme.json"
{
  "name": "Olon",
  "tokens": {
    "colors": {
      "background": "#0B0907",
      "card": "#130F0D",
      "elevated": "#1E1814",
      "overlay": "#241D17",
      "popover": "#1A1410",
      "popover-foreground": "#F2EDE6",
      "foreground": "#F2EDE6",
      "card-foreground": "#F2EDE6",
      "muted-foreground": "#9A8D80",
      "placeholder": "#5C5248",
      "primary": "#5B3F9A",
      "primary-foreground": "#EDE8F8",
      "primary-light": "#B8A4E0",
      "primary-dark": "#3D2770",
      "primary-50": "#EDE8F8",
      "primary-100": "#CEC1F0",
      "primary-200": "#B8A4E0",
      "primary-300": "#A48ED5",
      "primary-400": "#8B6FC6",
      "primary-500": "#7254B0",
      "primary-600": "#5B3F9A",
      "primary-700": "#4C3482",
      "primary-800": "#3D2770",
      "primary-900": "#271852",
      "accent": "#E2D5B0",
      "accent-foreground": "#0B0907",
      "secondary": "#1E1814",
      "secondary-foreground": "#F2EDE6",
      "muted": "#1E1814",
      "border": "#2E271F",
      "border-strong": "#4A3D30",
      "input": "#2E271F",
      "ring": "#5B3F9A",
      "destructive": "#7F1D1D",
      "destructive-foreground": "#FCA5A5",
      "destructive-border": "#991B1B",
      "destructive-ring": "#EF4444",
      "success": "#14532D",
      "success-foreground": "#86EFAC",
      "success-border": "#166534",
      "success-indicator": "#22C55E",
      "warning": "#78350F",
      "warning-foreground": "#FCD34D",
      "warning-border": "#92400E",
      "info": "#1E3A5F",
      "info-foreground": "#93C5FD",
      "info-border": "#1E40AF"
    },
    "modes": {
      "light": {
        "colors": {
          "background": "#F2EDE6",
          "card": "#FFFFFF",
          "elevated": "#F5F2EE",
          "overlay": "#EDE9E3",
          "popover": "#FFFFFF",
          "popover-foreground": "#1A1410",
          "foreground": "#1A1410",
          "card-foreground": "#1A1410",
          "muted-foreground": "#6B6058",
          "placeholder": "#A89E96",
          "primary": "#5B3F9A",
          "primary-foreground": "#FAFAF8",
          "primary-light": "#7254B0",
          "primary-dark": "#3D2770",
          "primary-50": "#EDE8F8",
          "primary-100": "#CEC1F0",
          "primary-200": "#B8A4E0",
          "primary-300": "#A48ED5",
          "primary-400": "#8B6FC6",
          "primary-500": "#7254B0",
          "primary-600": "#5B3F9A",
          "primary-700": "#4C3482",
          "primary-800": "#3D2770",
          "primary-900": "#271852",
          "accent": "#2E271F",
          "accent-foreground": "#FFFFFF",
          "secondary": "#F5F2EE",
          "secondary-foreground": "#1A1410",
          "muted": "#F5F2EE",
          "border": "#DDD8D2",
          "border-strong": "#C4BEB8",
          "input": "#DDD8D2",
          "ring": "#5B3F9A",
          "destructive": "#FEF2F2",
          "destructive-foreground": "#991B1B",
          "destructive-border": "#FECACA",
          "destructive-ring": "#EF4444",
          "success": "#F0FDF4",
          "success-foreground": "#166534",
          "success-border": "#BBF7D0",
          "success-indicator": "#16A34A",
          "warning": "#FFFBEB",
          "warning-foreground": "#92400E",
          "warning-border": "#FDE68A",
          "info": "#EFF6FF",
          "info-foreground": "#1E40AF",
          "info-border": "#BFDBFE"
        }
      }
    },
    "typography": {
      "fontFamily": {
        "primary": "'Geist', 'Geist Fallback', system-ui, sans-serif",
        "mono": "'Geist Mono', 'Geist Mono Fallback', monospace",
        "display": "'Merriweather Variable', Georgia, serif"
      },
      "wordmark": {
        "fontFamily": "'Merriweather Variable', sans-serif",
        "weight": "500",
        "width": "112"
      },
      "scale": {
        "xs": "11px",
        "sm": "13px",
        "base": "1rem",
        "md": "1.125rem",
        "lg": "1.25rem",
        "xl": "1.5rem",
        "2xl": "1.625rem",
        "3xl": "1.75rem",
        "4xl": "2rem",
        "5xl": "2.5rem",
        "6xl": "3rem",
        "7xl": "4.5rem"
      },
      "tracking": {
        "tight": "-0.03em",
        "display": "-0.035em",
        "normal": "0em",
        "wide": "0.04em",
        "label": "0.12em"
      },
      "leading": {
        "none": "1",
        "tight": "1.2",
        "snug": "1.35",
        "normal": "1.65",
        "relaxed": "1.75"
      }
    },
    "borderRadius": {
      "xl": "16px",
      "lg": "12px",
      "md": "8px",
      "sm": "4px",
      "full": "9999px"
    },
    "spacing": {
      "container-max": "1152px",
      "section-y": "96px",
      "header-h": "56px",
      "sidebar-w": "240px"
    },
    "zIndex": {
      "base": "0",
      "elevated": "10",
      "dropdown": "100",
      "sticky": "200",
      "overlay": "300",
      "modal": "400",
      "toast": "500"
    }
  }
}
END_OF_FILE_CONTENT
# SKIP: src/data/config/theme.json:Zone.Identifier is binary and cannot be embedded as text.
mkdir -p "src/data/pages"
echo "Creating src/data/pages/design-system.json..."
cat << 'END_OF_FILE_CONTENT' > "src/data/pages/design-system.json"
{
  "id": "design-system-page",
  "slug": "design-system",
  "global-header": false,
  "meta": {
    "title": "Olon Design System — Design Language",
    "description": "Token reference, color system, typography, components and brand identity for the OlonJS design language."
  },
  "sections": [
   
    {
      "id": "ds-main",
      "type": "design-system",
      "data": {
        "title": "Olon"
      },
      "settings": {}
    }
  ]
}

END_OF_FILE_CONTENT
# SKIP: src/data/pages/design-system.json:Zone.Identifier is binary and cannot be embedded as text.
echo "Creating src/data/pages/docs.json..."
cat << 'END_OF_FILE_CONTENT' > "src/data/pages/docs.json"
{
  "id": "docs-page",
  "slug": "docs",
  "meta": {
    "title": "OlonJS Architecture Specifications v1.3",
    "description": "Mandatory Standard — Sovereign Core Edition. Architecture, Studio/ICE UX, Path-Deterministic Nested Editing."
  },
  "sections": [
    {
      "id": "docs-main",
      "type": "tiptap",
      "data": {
        "content": "# 📐 OlonJS Architecture Specifications v1.5s\n\n**Status:** Mandatory Standard\\\n**Version:** 1.5.0 (Sovereign Core Edition — Architecture + Studio/ICE UX, Path-Deterministic Nested Editing, Deterministic Local Design Tokens, Three-Layer CSS Bridge Contract)\\\n**Target:** Senior Architects / AI Agents / Enterprise Governance\n\n**Scope v1.5:** This edition preserves the complete v1.4 architecture (MTRP, JSP, TBP, CIP, ECIP, JAP + Studio/ICE UX contract: IDAC, TOCC, BSDS, ASC, JEB + Tenant Type & Code-Generation Annex + strict path-based/nested-array behavior) as a **faithful superset**, and upgrades **Local Design Tokens** from a principle to a deterministic implementation contract.\\\n⚠️ **Scope note (breaking):** In strict v1.3+ Studio semantics, the legacy flat protocol (`itemField` / `itemId`) is removed in favor of `itemPath` (root-to-leaf path segments).\\\nℹ️ **Scope note (clarification):** In v1.5, `theme.json` is the tenant theme source of truth for themed tenants; runtime theme publication is mandatory for compliant themed tenants; section-local tokens (`--local-*`) are the required scoping layer for section-owned color and radius concerns.\n\n---\n\n## 1. 📐 Modular Type Registry Pattern (MTRP) v1.2\n\n**Objective:** Establish a strictly typed, open-ended protocol for extending content data structures where the **Core Engine** is the orchestrator and the **Tenant** is the provider.\n\n### 1.1 The Sovereign Dependency Inversion\n\nThe **Core** defines the empty `SectionDataRegistry`. The **Tenant** \"injects\" its specific definitions using **Module Augmentation**. This allows the Core to be distributed as a compiled NPM package while remaining aware of Tenant-specific types at compile-time.\n\n### 1.2 Technical Implementation (`@olonjs/core/kernel`)\n\n```typescript\nexport interface SectionDataRegistry {} // Augmented by Tenant\nexport interface SectionSettingsRegistry {} // Augmented by Tenant\n\nexport interface BaseSection<K extends keyof SectionDataRegistry> {\n  id: string;\n  type: K;\n  data: SectionDataRegistry[K];\n  settings?: K extends keyof SectionSettingsRegistry\n    ? SectionSettingsRegistry[K]\n    : BaseSectionSettings;\n}\n\nexport type Section = {\n  [K in keyof SectionDataRegistry]: BaseSection<K>\n}[keyof SectionDataRegistry];\n```\n\n**SectionType:** Core exports (or Tenant infers) `SectionType` as `keyof SectionDataRegistry`. After Tenant module augmentation, this is the union of all section type keys (e.g. `'header' | 'footer' | 'hero' | ...`). The Tenant uses this type for the ComponentRegistry and SECTION_SCHEMAS keys.\n\n**Why ❔:** The Core must be able to render section without knowing the concrete types to compile-time; the Tenant must be able to add new types without modifying the Core. Empty registry + module augmentation allow you to deploy Core as an NPM package and keep type-safety end-to-end (Section, registry, config). Without MTRP, each new type would require changes in the Core or weak types (any).\n\n---\n\n## 2. 📐 JsonPages Site Protocol (JSP) v1.8\n\n**Objective:** Define the deterministic file system and the **Sovereign Projection Engine** (CLI).\n\n### 2.1 The File System Ontology (The Silo Contract)\n\nEvery site must reside in an isolated directory. Global Governance is physically separated from Local Content.\n\n- `/config/site.json` — Global Identity & Reserved System Blocks (Header/Footer). See Appendix A for typed shape.\n- `/config/menu.json` — Navigation Tree (SSOT for System Header). See Appendix A.\n- `/config/theme.json` — Theme tokens for themed tenants. See Appendix A.\n- `/pages/[slug].json` — Local Body Content per page. See Appendix A (PageConfig).\n\n**Application path convention:** The runtime app typically imports these via an alias (e.g. `@/data/config/` and `@/data/pages/`). The physical silo may be `src/data/config/` and `src/data/pages/` so that `site.json`, `menu.json`, `theme.json` live under `src/data/config/`, and page JSONs under `src/data/pages/`. The CLI or projection script may use `/config/` and `/pages/` at repo root; the **contract** is that the app receives **siteConfig**, **menuConfig**, **themeConfig**, and **pages** as defined in JEB (§10) and Appendix A.\n\n**Rule:** For a tenant that claims v1.4 design-token compliance, `theme.json` is not optional in practice. If a tenant omits a physical `theme.json`, it must still provide an equivalent `ThemeConfig` object before bootstrap; otherwise the tenant is outside full v1.4 theme compliance.\n\n### 2.2 Deterministic Projection (CLI Workflow)\n\nThe CLI (`@olonjs/cli`) creates new tenants by:\n\n1. **Infra Projection:** Generating `package.json`, `tsconfig.json`, and `vite.config.ts` (The Shell).\n2. **Source Projection:** Executing a deterministic script (`src_tenant_alpha.sh`) to reconstruct the `src` folder (The DNA).\n3. **Dependency Resolution:** Enforcing specific versions of React, Radix, and Tailwind v4.\n\n**Why they are needed:** A deterministic file structure (config vs pages) separates global governance (site, menu, theme) from content per page; CLI can regenerate tenants and tooling can find data and schematics always in the same paths. Without JSP, each tenant would be an ad hoc structure and ingestion/export/Bake would be fragile.\n\n---\n\n## 3. 🧱 Tenant Block Protocol (TBP) v1.0\n\n**Objective:** Standardize the \"Capsule\" structure for components to enable automated ingestion (Pull) by the SaaS.\n\n### 3.1 The Atomic Capsule Structure\n\nComponents are self-contained directories under `src/components/<sectionType>/`:\n\n- `View.tsx` — The pure React component (Dumb View). Props: see Appendix A (SectionComponentPropsMap).\n- `schema.ts` — Zod schema(s) for the **data** contract (and optionally **settings**). Exports at least one schema (e.g. `HeroSchema`) used as the **data** schema for that type. Must extend BaseSectionData (§8) for data; array items must extend BaseArrayItem (§8).\n- `types.ts` — TypeScript interfaces inferred from the schema (e.g. `HeroData`, `HeroSettings`). Export types with names `<SectionType>Data` and `<SectionType>Settings` (or equivalent) so the Tenant can aggregate them in a single types module.\n- `index.ts` — Public API: re-exports View, schema(s), and types.\n\n### 3.2 Reserved System Types\n\n- `type: 'header'` — Reserved for `site.json`. Receives `menu: MenuItem[]` in addition to `data` and `settings`. Menu is sourced from `menu.json` (see Appendix A). The Tenant **must** type `SectionComponentPropsMap['header']` as `{ data: HeaderData; settings?: HeaderSettings; menu: MenuItem[] }`.\n- `type: 'footer'` — Reserved for `site.json`. Props: `{ data: FooterData; settings?: FooterSettings }` only (no `menu`).\n- `type: 'sectionHeader'` — A standard local block. Must define its own `links` array in its local schema if used.\n\n**Perché servono:** La capsula (View + schema + types + index) è l’unità di estensione: il Core e il Form Factory possono scoprire tipi e contratti per tipo senza convenzioni ad hoc. Header/footer riservati evitano conflitti tra globale e locale. Senza TBP, aggregazione di SECTION_SCHEMAS e registry sarebbe incoerente e l’ingestion da SaaS non sarebbe automatizzabile.\n\n---\n\n## 4. 🧱 Component Implementation Protocol (CIP) v1.6\n\n**Objective:** Ensure system-wide stability and Admin UI integrity.\n\n1. **The \"Sovereign View\" Law:** Components receive `data` and `settings` (and `menu` for header only) and return JSX. They are metadata-blind (never import Zod schemas).\n2. **Z-Index Neutrality:** Components must not use `z-index > 1`. Layout delegation (sticky/fixed) is managed by the `SectionRenderer`.\n3. **Agnostic Asset Protocol:** Use `resolveAssetUrl(path, tenantId)` for all media. Resolved URLs are under `/assets/...` with no tenantId segment in the path (e.g. relative `img/hero.jpg` → `/assets/img/hero.jpg`).\n\n### 4.4 Local Design Tokens (v1.4)\n\n**Objective:** Standardize how a section consumes tenant theme values without leaking global styling assumptions into the section implementation.\n\n#### 4.4.1 The Required Four-Layer Chain\n\nFor any section that controls background, text color, border color, accent color, or radii, the following chain is normative:\n\n1. **Tenant theme source of truth** — Values are declared in `src/data/config/theme.json`.\n2. **Runtime theme publication** — The Core and/or tenant bootstrap **must** publish those values as CSS custom properties.\n3. **Section-local scope** — The View root **must** define `--local-*` variables mapped to the published theme variables for the concerns the section owns.\n4. **Rendered classes** — Section-owned color/radius utilities **must** consume `var(--local-*)`.\n\n**Rule:** A section may not skip layer 3 when it visually owns those concerns. Directly using global theme variables throughout the JSX is non-canonical for a fully themed section and must be treated as non-compliant unless the usage falls under an explicitly allowed exception.\n\n#### 4.4.2 Source Of Truth: `theme.json`\n\n`theme.json` is the tenant-level source of truth for theme values. Example:\n\n```json\n{\n  \"name\": \"JsonPages Landing\",\n  \"tokens\": {\n    \"colors\": {\n      \"primary\": \"#3b82f6\",\n      \"secondary\": \"#22d3ee\",\n      \"accent\": \"#60a5fa\",\n      \"background\": \"#060d1b\",\n      \"surface\": \"#0b1529\",\n      \"surfaceAlt\": \"#101e38\",\n      \"text\": \"#e2e8f0\",\n      \"textMuted\": \"#94a3b8\",\n      \"border\": \"#162a4d\"\n    },\n    \"typography\": {\n      \"fontFamily\": {\n        \"primary\": \"'Instrument Sans', system-ui, sans-serif\",\n        \"mono\": \"'JetBrains Mono', monospace\",\n        \"display\": \"'Bricolage Grotesque', system-ui, sans-serif\"\n      }\n    },\n    \"borderRadius\": {\n      \"sm\": \"0px\",\n      \"md\": \"0px\",\n      \"lg\": \"2px\"\n    }\n  }\n}\n```\n\n**Rule:** For a themed tenant, `theme.json` must contain the canonical semantic keys defined in Appendix A. Extra brand-specific keys are allowed only as extensions to those canonical groups, not as replacements for them.\n\n#### 4.4.3 Runtime Theme Publication\n\nThe tenant and/or Core **must** expose theme values as CSS variables before section rendering. The compliant bridge is a **three-layer chain** implemented in the tenant's `index.css`. Runtime publication is mandatory for themed tenants.\n\n##### Layer architecture\n\n```\ntheme.json  →  engine injection  →  :root bridge  →  @theme (Tailwind)  →  JSX classes\n```\n\n**Layer 0 — Engine injection (Core-provided)** `@olonjs/core` reads `theme.json` and injects all token values as flattened CSS custom properties before section rendering. The naming convention is:\n\nJSON path Injected CSS var `tokens.colors.{name}` `--theme-colors-{name}` `tokens.typography.fontFamily.{role}` `--theme-font-{role}` `tokens.typography.scale.{step}` `--theme-typography-scale-{step}` `tokens.typography.tracking.{name}` `--theme-typography-tracking-{name}` `tokens.typography.leading.{name}` `--theme-typography-leading-{name}` `tokens.typography.wordmark.*` `--theme-typography-wordmark-*` `tokens.borderRadius.{name}` `--theme-border-radius-{name}` `tokens.spacing.{name}` `--theme-spacing-{name}` `tokens.zIndex.{name}` `--theme-z-index-{name}` `tokens.modes.{mode}.colors.{name}` `--theme-modes-{mode}-colors-{name}`\n\nThe engine also publishes shorthand aliases for the most common radius and font tokens (e.g. `--theme-radius-sm`, `--theme-font-primary`). Tokens not covered by the shorthand aliases must be bridged in the tenant `:root`.\n\n**Layer 1 —** `:root` **semantic bridge (Tenant-provided,** `index.css`**)** The tenant maps engine-injected vars to its own semantic naming. **The naming in this layer is the tenant's sovereign choice** — it is not imposed by the Core. Any naming convention is valid as long as it is consistent throughout the tenant.\n\n```css\n:root {\n  /* Backgrounds */\n  --background:           var(--theme-colors-background);\n  --card:                 var(--theme-colors-card);\n  --elevated:             var(--theme-colors-elevated);\n  --overlay:              var(--theme-colors-overlay);\n  --popover:              var(--theme-colors-popover);\n  --popover-foreground:   var(--theme-colors-popover-foreground);\n\n  /* Foregrounds */\n  --foreground:           var(--theme-colors-foreground);\n  --card-foreground:      var(--theme-colors-card-foreground);\n  --muted-foreground:     var(--theme-colors-muted-foreground);\n  --placeholder:          var(--theme-colors-placeholder);\n\n  /* Brand ramp */\n  --primary:              var(--theme-colors-primary);\n  --primary-foreground:   var(--theme-colors-primary-foreground);\n  --primary-light:        var(--theme-colors-primary-light);\n  --primary-dark:         var(--theme-colors-primary-dark);\n  /* ... full ramp --primary-50 through --primary-900 ... */\n\n  /* Accent, secondary, muted, border, input, ring */\n  --accent:               var(--theme-colors-accent);\n  --accent-foreground:    var(--theme-colors-accent-foreground);\n  --secondary:            var(--theme-colors-secondary);\n  --secondary-foreground: var(--theme-colors-secondary-foreground);\n  --muted:                var(--theme-colors-muted);\n  --border:               var(--theme-colors-border);\n  --border-strong:        var(--theme-colors-border-strong);\n  --input:                var(--theme-colors-input);\n  --ring:                 var(--theme-colors-ring);\n\n  /* Feedback */\n  --destructive:              var(--theme-colors-destructive);\n  --destructive-foreground:   var(--theme-colors-destructive-foreground);\n  --success:                  var(--theme-colors-success);\n  --success-foreground:       var(--theme-colors-success-foreground);\n  --warning:                  var(--theme-colors-warning);\n  --warning-foreground:       var(--theme-colors-warning-foreground);\n  --info:                     var(--theme-colors-info);\n  --info-foreground:          var(--theme-colors-info-foreground);\n\n  /* Typography scale, tracking, leading */\n  --theme-text-xs:        var(--theme-typography-scale-xs);\n  --theme-text-sm:        var(--theme-typography-scale-sm);\n  /* ... full scale ... */\n  --theme-tracking-tight: var(--theme-typography-tracking-tight);\n  --theme-leading-normal: var(--theme-typography-leading-normal);\n  /* ... */\n\n  /* Spacing */\n  --theme-container-max:  var(--theme-spacing-container-max);\n  --theme-section-y:      var(--theme-spacing-section-y);\n  --theme-header-h:       var(--theme-spacing-header-h);\n  --theme-sidebar-w:      var(--theme-spacing-sidebar-w);\n\n  /* Z-index */\n  --z-base:     var(--theme-z-index-base);\n  --z-elevated: var(--theme-z-index-elevated);\n  --z-dropdown: var(--theme-z-index-dropdown);\n  --z-sticky:   var(--theme-z-index-sticky);\n  --z-overlay:  var(--theme-z-index-overlay);\n  --z-modal:    var(--theme-z-index-modal);\n  --z-toast:    var(--theme-z-index-toast);\n}\n```\n\n**Layer 2 —** `@theme` **Tailwind v4 bridge (Tenant-provided,** `index.css`**)** Every semantic variable from Layer 1 is re-exposed under the Tailwind v4 `@theme` namespace so it becomes a utility class. Pattern: `--color-{slug}: var(--{slug})`.\n\n```css\n@theme {\n  --color-background:    var(--background);\n  --color-card:          var(--card);\n  --color-foreground:    var(--foreground);\n  --color-primary:       var(--primary);\n  --color-accent:        var(--accent);\n  --color-border:        var(--border);\n  /* ... full token set ... */\n\n  --font-primary:        var(--theme-font-primary);\n  --font-mono:           var(--theme-font-mono);\n  --font-display:        var(--theme-font-display);\n\n  --radius-sm:           var(--theme-radius-sm);\n  --radius-md:           var(--theme-radius-md);\n  --radius-lg:           var(--theme-radius-lg);\n  --radius-xl:           var(--theme-radius-xl);\n  --radius-full:         var(--theme-radius-full);\n}\n```\n\nAfter this bridge, the full Tailwind utility vocabulary (`bg-primary`, `text-foreground`, `rounded-lg`, `font-display`, etc.) resolves to live theme values — with no hardcoded hex anywhere in the React layer.\n\n**Light mode / additional modes** are bridged by overriding the Layer 1 semantic vars under a `[data-theme=\"light\"]` selector (or equivalent), pointing to the engine-injected mode vars (`--theme-modes-light-colors-*`). The `@theme` layer requires no changes.\n\n**Rule:** A tenant `index.css` must implement all three layers. Skipping Layer 2 breaks Tailwind utility resolution. Skipping Layer 1 couples sections to engine-internal naming. Hardcoding values in either layer is non-compliant.\n\n#### 4.4.4 Section-Local Scope\n\nIf a section controls its own visual language, it **shall** establish a local token scope on the section root. Example:\n\n```tsx\n<section\n  style={{\n    '--local-bg': 'var(--background)',\n    '--local-text': 'var(--foreground)',\n    '--local-text-muted': 'var(--muted-foreground)',\n    '--local-primary': 'var(--primary)',\n    '--local-border': 'var(--border)',\n    '--local-surface': 'var(--card)',\n    '--local-radius-sm': 'var(--theme-radius-sm)',\n    '--local-radius-md': 'var(--theme-radius-md)',\n    '--local-radius-lg': 'var(--theme-radius-lg)',\n  } as React.CSSProperties}\n>\n```\n\n**Rule:** `--local-*` values must map to published theme variables. They must **not** be defined as hardcoded brand values such as `#fff`, `#111827`, `12px`, or `Inter, sans-serif` if those values belong to the tenant theme layer.\n\n**Rule:** Local tokens are **mandatory** for section-owned color and radius concerns. They are **optional** for font-family concerns unless the section must remap or isolate font roles locally.\n\n#### 4.4.5 Canonical Typography Rule\n\nTypography follows a deterministic rule distinct from color/radius:\n\n1. **Canonical font publication** — Tenant/Core must publish semantic font variables such as `--theme-font-primary`, `--theme-font-mono`, and `--theme-font-display` when those roles exist in the theme.\n2. **Canonical font consumption** — Sections must consume typography through semantic tenant font utilities or variables backed by those published theme roles (for example `.font-display` backed by `--font-display`, itself backed by `--theme-font-display`).\n3. **Local font tokens** — `--local-font-*` is optional and should be used only when a section needs to remap a font role locally rather than simply consume the canonical tenant font role.\n\nExample of canonical global semantic bridge:\n\n```css\n:root {\n  --font-primary: var(--theme-font-primary);\n  --font-display: var(--theme-font-display);\n}\n\n.font-display {\n  font-family: var(--font-display, var(--font-primary));\n}\n```\n\n**Rule:** A section is compliant if it consumes themed fonts through this published semantic chain. It is **not** required to define `--local-font-display` unless the section needs local remapping. This closes the ambiguity between global semantic typography utilities and local color/radius scoping.\n\n#### 4.4.6 View Consumption\n\nAll section-owned classes that affect color or radius must consume local variables. Font consumption must follow the typography rule above. Example:\n\n```tsx\n<section\n  style={{\n    '--local-bg': 'var(--background)',\n    '--local-text': 'var(--foreground)',\n    '--local-primary': 'var(--primary)',\n    '--local-border': 'var(--border)',\n    '--local-radius-md': 'var(--theme-radius-md)',\n    '--local-radius-lg': 'var(--theme-radius-lg)',\n  } as React.CSSProperties}\n  className=\"bg-[var(--local-bg)]\"\n>\n  <h1 className=\"font-display text-[var(--local-text)]\">Build Tenant DNA</h1>\n\n  <a className=\"bg-[var(--local-primary)] rounded-[var(--local-radius-md)] text-white\">\n    Read the Docs\n  </a>\n\n  <div className=\"border border-[var(--local-border)] rounded-[var(--local-radius-lg)]\">\n    {/* illustration / mockup / card */}\n  </div>\n</section>\n```\n\n#### 4.4.7 Compliance Rules\n\nA section is compliant when all of the following are true:\n\n1. `theme.json` is the source of truth for the theme values being used.\n2. Those values are published at runtime as CSS custom properties before the section renders.\n3. The section root defines a local token scope for the color/radius concerns it controls.\n4. Local color/radius tokens map to published theme variables rather than hardcoded literals.\n5. JSX classes use `var(--local-*)` for section-owned color/radius concerns.\n6. Fonts are consumed through the published semantic font chain, and only use local font tokens when local remapping is required.\n7. Hardcoded colors/radii are absent from the primary visual contract of the section.\n\n#### 4.4.8 Allowed Exceptions\n\nThe following are acceptable if documented and intentionally limited:\n\n- Tiny decorative one-off values that are not part of the tenant theme contract (for example an isolated translucent pixel-grid overlay).\n- Temporary compatibility shims during migration, provided the section still exposes a clear compliant path and the literal is not the primary themed value.\n- Semantic alias bridges in tenant CSS (for example `--font-display: var(--theme-font-display)`), as long as the source remains the theme layer.\n\n#### 4.4.9 Non-Compliant Patterns\n\nThe following are non-compliant:\n\n- `style={{ '--local-bg': '#060d1b' }}` when that background belongs to tenant theme.\n- Buttons using `rounded-[7px]`, `bg-blue-500`, `text-zinc-100`, or similar hardcoded utilities inside a section that claims to be theme-driven.\n- A section root that defines `--local-*`, but child elements still use raw `bg-*`, `text-*`, or `rounded-*` utilities for the same owned concerns.\n- Reading `theme.json` directly inside a View instead of consuming published runtime theme variables.\n- Treating brand-specific extension keys as a replacement for canonical semantic keys such as `primary`, `background`, `text`, `border`, or `fontFamily.primary`.\n\n#### 4.4.10 Practical Interpretation\n\n`--local-*` is not the source of truth. It is the **local scoping layer** between tenant theme and section implementation.\n\nCanonical chain:\n\n`theme.json` → published runtime theme vars → section `--local-*` → JSX classes\\`\n\nCanonical font chain:\n\n`theme.json` → published semantic font vars → tenant font utility/variable → section typography\\`\n\n### 4.5 Z-Index & Overlay Governance (v1.2)\n\nSection content root **must** stay at `z-index` **≤ 1** (prefer `z-0`) so the Sovereign Overlay can sit above with high z-index in Tenant CSS (§7). Header/footer may use a higher z-index (e.g. 50) only as a documented exception for global chrome.\n\n**Perché servono (CIP):** View “dumb” (solo data/settings) e senza import di Zod evita accoppiamento e permette al Form Factory di essere l’unica fonte di verità sugli schemi. Z-index basso evita che il contenuto copra l’overlay di selezione in Studio. Asset via `resolveAssetUrl`: i path relativi vengono risolti in `/assets/...` (senza segmento tenantId nel path). In v1.4 la catena `theme.json -> runtime vars -> --local-* -> JSX classes` rende i tenant temabili, riproducibili e compatibili con la Studio UX; senza questa separazione, stili “nudi” o valori hardcoded creano drift visivo, rompono il contratto del brand, e rendono ambiguo ciò che appartiene al tema contro ciò che appartiene alla section.\n\n---\n\n## 5. 🛠️ Editor Component Implementation Protocol (ECIP) v1.5\n\n**Objective:** Standardize the Polymorphic ICE engine.\n\n1. **Recursive Form Factory:** The Admin UI builds forms by traversing the Zod ontology.\n2. **UI Metadata:** Use `.describe('ui:[widget]')` in schemas to pass instructions to the Form Factory.\n3. **Deterministic IDs:** Every object in a `ZodArray` must extend `BaseArrayItem` (containing an `id`) to ensure React reconciliation stability during reordering.\n\n### 5.4 UI Metadata Vocabulary (v1.2)\n\nStandard keys for the Form Factory:\n\nKey Use case `ui:text` Single-line text input. `ui:textarea` Multi-line text. `ui:select` Enum / single choice. `ui:number` Numeric input. `ui:list` Array of items; list editor (add/remove/reorder). `ui:icon-picker` Icon selection.\n\nUnknown keys may be treated as `ui:text`. Array fields must use `BaseArrayItem` for items.\n\n### 5.5 Path-Only Nested Selection & Expansion (v1.3, breaking)\n\nIn strict v1.3 Studio/Inspector behavior, nested editing targets are represented by **path segments from root to leaf**.\n\n```typescript\nexport type SelectionPathSegment = { fieldKey: string; itemId?: string };\nexport type SelectionPath = SelectionPathSegment[];\n```\n\nRules:\n\n- Expansion and focus for nested arrays **must** be computed from `SelectionPath` (root → leaf), not from a single flat pair.\n- Matching by `fieldKey` alone is non-compliant for nested structures.\n- Legacy flat payload fields `itemField` and `itemId` are removed in strict v1.3 selection protocol.\n\n**Perché servono (ECIP):** Il Form Factory deve sapere quale widget usare (text, textarea, select, list, …) senza hardcodare per tipo; `.describe('ui:...')` è il contratto. BaseArrayItem con `id` su ogni item di array garantisce chiavi stabili in React e reorder/delete corretti nell’Inspector. In v1.3 la selezione/espansione path-only elimina ambiguità su array annidati: senza path completo root→leaf, la sidebar può aprire il ramo sbagliato o non aprire il target.\n\n---\n\n## 6. 🎯 ICE Data Attribute Contract (IDAC) v1.1\n\n**Objective:** Mandatory data attributes so the Stage (iframe) and Inspector can bind selection and field/item editing without coupling to Tenant DOM.\n\n### 6.1 Section-Level Markup (Core-Provided)\n\n**SectionRenderer** (Core) wraps each section root with:\n\n- `data-section-id` — Section instance ID (e.g. UUID). On the wrapper that contains content + overlay.\n- Sibling overlay element `data-jp-section-overlay` — Selection ring and type label. **Tenant does not add this;** Core injects it.\n\nTenant Views render the **content** root only (e.g. `<section>` or `<div>`), placed **inside** the Core wrapper.\n\n### 6.2 Field-Level Binding (Tenant-Provided)\n\nFor every **editable scalar field** the View **must** attach `data-jp-field=\"<fieldKey>\"` (key matches schema path: e.g. `title`, `description`, `sectionTitle`, `label`).\n\n### 6.3 Array-Item Binding (Tenant-Provided)\n\nFor every **editable array item** the View **must** attach:\n\n- `data-jp-item-id=\"<stableId>\"` — Prefer `item.id`; fallback e.g. `legacy-${index}` only outside strict mode.\n- `data-jp-item-field=\"<arrayKey>\"` — e.g. `cards`, `layers`, `products`, `paragraphs`.\n\n### 6.4 Compliance\n\n**Reserved types** (`header`, `footer`): ICE attributes optional unless Studio edits them. **All other section types** in the Stage and in `SECTION_SCHEMAS` **must** implement §6.2 and §6.3 for every editable field and array item.\n\n### 6.5 Strict Path Extraction for Nested Arrays (v1.3, breaking)\n\nFor nested array targets, the Core/Inspector contract is path-based:\n\n- The runtime selection target is expressed as `itemPath: SelectionPath` (root → leaf).\n- Flat identity (`itemField` + `itemId`) is not sufficient for nested structures and is removed in strict v1.3 payloads.\n- In strict mode, index-based identity fallback is non-compliant for editable object arrays.\n\n**Perché servono (IDAC):** Lo Stage è in un iframe e l’Inspector deve sapere **quale campo o item** corrisponde al click (o alla selezione) senza conoscere la struttura DOM del Tenant. `data-jp-field` associa un nodo DOM al path dello schema (es. `title`, `description`): così il Core può evidenziare la riga giusta nella sidebar, applicare opacità attivo/inattivo e aprire il form sul campo corretto. `data-jp-item-id` e `data-jp-item-field` fanno lo stesso per gli item di array (liste, reorder, delete). In v1.3, `itemPath` rende deterministico anche il caso nested (array dentro array), eliminando mismatch tra selezione canvas e ramo aperto in sidebar.\n\n---\n\n## 7. 🎨 Tenant Overlay CSS Contract (TOCC) v1.0\n\n**Objective:** The Stage iframe loads only Tenant HTML/CSS. Core injects overlay **markup** but does **not** ship overlay styles. The Tenant **must** supply CSS so overlay is visible.\n\n### 7.1 Required Selectors (Tenant global CSS)\n\n1. `[data-jp-section-overlay]` — `position: absolute; inset: 0`; `pointer-events: none`; base state transparent.\n2. `[data-section-id]:hover [data-jp-section-overlay]` — Hover: e.g. dashed border, subtle tint.\n3. `[data-section-id][data-jp-selected] [data-jp-section-overlay]` — Selected: solid border, optional tint.\n4. `[data-jp-section-overlay] > div` (type label) — Position and visibility (e.g. visible on hover/selected).\n\n### 7.2 Z-Index\n\nOverlay **z-index** high (e.g. 9999). Section content at or below CIP limit (§4.5).\n\n### 7.3 Responsibility\n\n**Core:** Injects wrapper and overlay DOM; sets `data-jp-selected`. **Tenant:** All overlay **visual** rules.\n\n**Perché servono (TOCC):** L’iframe dello Stage carica solo HTML/CSS del Tenant; il Core inietta il markup dell’overlay ma non gli stili. Senza CSS Tenant per i selettori TOCC, bordo hover/selected e type label non sarebbero visibili: l’autore non vedrebbe quale section è selezionata né il label del tipo. TOCC chiarisce la responsabilità (Core = markup, Tenant = aspetto) e garantisce UX uniforme tra tenant.\n\n---\n\n## 8. 📦 Base Section Data & Settings (BSDS) v1.0\n\n**Objective:** Standardize base schema fragments for anchors, array items, and section settings.\n\n### 8.1 BaseSectionData\n\nEvery section data schema **must** extend a base with at least `anchorId` (optional string). Canonical Zod (Tenant `lib/base-schemas.ts` or equivalent):\n\n```typescript\nexport const BaseSectionData = z.object({\n  anchorId: z.string().optional().describe('ui:text'),\n});\n```\n\n### 8.2 BaseArrayItem\n\nEvery array item schema editable in the Inspector **must** include `id` (optional string minimum). Canonical Zod:\n\n```typescript\nexport const BaseArrayItem = z.object({\n  id: z.string().optional(),\n});\n```\n\nRecommended: required UUID for new items. Used by `data-jp-item-id` and React reconciliation.\n\n### 8.3 BaseSectionSettings (Optional)\n\nCommon section-level settings. Canonical Zod (name **BaseSectionSettingsSchema** or as exported by Core):\n\n```typescript\nexport const BaseSectionSettingsSchema = z.object({\n  paddingTop: z.enum(['none', 'sm', 'md', 'lg', 'xl', '2xl']).default('md').describe('ui:select'),\n  paddingBottom: z.enum(['none', 'sm', 'md', 'lg', 'xl', '2xl']).default('md').describe('ui:select'),\n  theme: z.enum(['dark', 'light', 'accent']).default('dark').describe('ui:select'),\n  container: z.enum(['boxed', 'fluid']).default('boxed').describe('ui:select'),\n});\n```\n\nCapsules may extend this for type-specific settings. Core may export **BaseSectionSettings** as the TypeScript type inferred from this or a superset.\n\n**Perché servono (BSDS):** anchorId permette deep-link e navigazione in-page; id sugli array item è necessario per `data-jp-item-id`, reorder e React reconciliation. BaseSectionSettings comuni (padding, theme, container) evitano ripetizione e allineano il Form Factory tra capsule. Senza base condivisi, ogni capsule inventa convenzioni e validazione/add-section diventano fragili.\n\n---\n\n## 9. 📌 AddSectionConfig (ASC) v1.0\n\n**Objective:** Formalize the \"Add Section\" contract used by the Studio.\n\n**Type (Core exports** `AddSectionConfig`**):**\n\n```typescript\ninterface AddSectionConfig {\n  addableSectionTypes: readonly string[];\n  sectionTypeLabels: Record<string, string>;\n  getDefaultSectionData(sectionType: string): Record<string, unknown>;\n}\n```\n\n**Shape:** Tenant provides one object (e.g. `addSectionConfig`) with:\n\n- `addableSectionTypes` — Readonly array of section type keys. Only these types appear in the Add Section Library. Must be a subset of (or equal to) the keys in SectionDataRegistry.\n- `sectionTypeLabels` — Map type key → display string (e.g. `{ hero: 'Hero', 'cta-banner': 'CTA Banner' }`).\n- `getDefaultSectionData(sectionType: string): Record<string, unknown>` — Returns default `data` for a new section. Must conform to the capsule’s data schema so the new section validates.\n\nCore creates a new section with deterministic UUID, `type`, and `data` from `getDefaultSectionData(type)`.\n\n**Perché servono (ASC):** Lo Studio deve mostrare una libreria “Aggiungi sezione” con nomi leggibili e, alla scelta, creare una section con dati iniziali validi. addableSectionTypes, sectionTypeLabels e getDefaultSectionData sono il contratto: il Tenant è l’unica fonte di verità su quali tipi sono addabili e con quali default. Senza ASC, il Core non saprebbe cosa mostrare in modal né come popolare i dati della nuova section.\n\n---\n\n## 10. ⚙️ JsonPagesConfig & Engine Bootstrap (JEB) v1.1\n\n**Objective:** Bootstrap contract between Tenant app and `@olonjs/core`.\n\n### 10.1 JsonPagesConfig (required fields)\n\nThe Tenant passes a single **config** object to **JsonPagesEngine**. Required fields:\n\nField Type Description **tenantId** string Passed to `resolveAssetUrl(path, tenantId)`; resolved asset URLs are `/assets/...` with no tenantId segment in the path. **registry** `{ [K in SectionType]: React.FC<SectionComponentPropsMap[K]> }` Component registry. Must match MTRP keys. See Appendix A. **schemas** `Record<SectionType, ZodType>` or equivalent SECTION_SCHEMAS: type → **data** Zod schema. Form Factory uses this. See Appendix A. **pages** `Record<string, PageConfig>` Slug → page config. See Appendix A. **siteConfig** SiteConfig Global site (identity, header/footer blocks). See Appendix A. **themeConfig** ThemeConfig Theme tokens. See Appendix A. **menuConfig** MenuConfig Navigation tree (SSOT for header menu). See Appendix A. **themeCss** `{ tenant: string }` At least **tenant**: string (inline CSS or URL) for Stage iframe injection. **addSection** AddSectionConfig Add-section config (§9).\n\nCore may define optional fields. The Tenant must not omit required fields.\n\n### 10.2 JsonPagesEngine\n\nRoot component: `<JsonPagesEngine config={config} />`. Responsibilities: route → page, SectionRenderer per section; in Studio mode Sovereign Shell (Inspector, Control Bar, postMessage); section wrappers and overlay per IDAC and JAP. Tenant does not implement the Shell.\n\n### 10.3 Studio Selection Event Contract (v1.3, breaking)\n\nIn strict v1.3 Studio, section selection payload for nested targets is path-based:\n\n```typescript\ntype SectionSelectMessage = {\n  type: 'SECTION_SELECT';\n  section: { id: string; type: string; scope: 'global' | 'local' };\n  itemPath?: SelectionPath; // root -> leaf\n};\n```\n\nRemoved from strict protocol:\n\n- `itemField`\n- `itemId`\n\n**Perché servono (JEB):** Un unico punto di bootstrap (config + Engine) evita che il Tenant replichi logica di routing, Shell e overlay. I campi obbligatori in JsonPagesConfig (tenantId, registry, schemas, pages, siteConfig, themeConfig, menuConfig, themeCss, addSection) sono il minimo per far funzionare rendering, Studio e Form Factory; omissioni causano errori a runtime. In v1.3, il payload `itemPath` sincronizza in modo non ambiguo Stage e Inspector su nested arrays.\n\n---\n\n# 🏛️ OlonJS_ADMIN_PROTOCOL (JAP) v1.2\n\n**Status:** Mandatory Standard\\\n**Version:** 1.2.0 (Sovereign Shell Edition — Path/Nested Strictness)\\\n**Objective:** Deterministic orchestration of the \"Studio\" environment (ICE Level 1).\n\n---\n\n## 1. The Sovereign Shell Topology\n\nThe Admin interface is a **Sovereign Shell** from `@olonjs/core`.\n\n1. **The Stage (Canvas):** Isolated Iframe; postMessage for data updates and selection mirroring. Section markup follows **IDAC** (§6); overlay styling follows **TOCC** (§7).\n2. **The Inspector (Sidebar):** Consumes Tenant Zod schemas to generate editors; binding via `data-jp-field` and `data-jp-item-*`.\n3. **The Control Bar:** Save, Export, Add Section.\n\n## 2. State Orchestration & Persistence\n\n- **Working Draft:** Reactive local state for unsaved changes.\n- **Sync Law:** Inspector changes → Working Draft → Stage via `STUDIO_EVENTS.UPDATE_DRAFTS`.\n- **Bake Protocol:** \"Bake HTML\" requests snapshot from Iframe, injects `ProjectState` as JSON, triggers download.\n\n## 3. Context Switching (Global vs. Local)\n\n- **Header/Footer** selection → Global Mode, `site.json`.\n- Any other section → Page Mode, current `[slug].json`.\n\n## 4. Section Lifecycle Management\n\n1. **Add Section:** Modal from Tenant `SECTION_SCHEMAS`; UUID + default data via **AddSectionConfig** (§9).\n2. **Reorder:** Inspector or Stage Overlay; array mutation in Working Draft.\n3. **Delete:** Confirmation; remove from array, clear selection.\n\n## 5. Stage Isolation & Overlay\n\n- **CSS Shielding:** Stage in Iframe; Tenant CSS does not leak into Admin.\n- **Sovereign Overlay:** Selection ring and type labels injected per **IDAC** (§6); Tenant styles them per **TOCC** (§7).\n\n## 6. \"Green Build\" Validation\n\nStudio enforces `tsc && vite build`. No export with TypeScript errors.\n\n## 7. Path-Deterministic Selection & Sidebar Expansion (v1.3, breaking)\n\n- Section/item focus synchronization uses `itemPath` (root → leaf), not flat `itemField/itemId`.\n- Sidebar expansion state for nested arrays must be derived from all path segments.\n- Flat-only matching may open/close wrong branches and is non-compliant in strict mode.\n\n**Perché servono (JAP):** Stage in iframe + Inspector + Control Bar separano il contesto di editing dal sito; postMessage e Working Draft permettono modifiche senza toccare subito i file. Bake ed Export richiedono uno stato coerente. Global vs Page mode evita confusione su dove si sta editando (site.json vs \\[slug\\].json). Add/Reorder/Delete sono gestiti in un solo modo (Working Draft + ASC). Green Build garantisce che ciò che si esporta compili. In v1.3, il path completo elimina ambiguità nella sincronizzazione Stage↔Sidebar su strutture annidate.\n\n---\n\n## Compliance: Legacy vs Full UX (v1.4)\n\nDimension Legacy / Less UX Full UX (Core-aligned) **ICE binding** No `data-jp-*`; Inspector cannot bind. IDAC (§6) on every editable section/field/item. **Section wrapper** Plain `<section>`; no overlay contract. Core wrapper + overlay; Tenant CSS per TOCC (§7). **Design tokens** Raw BEM / fixed classes, or local vars fed by literals. `theme.json` as source of truth, mandatory runtime publication, local color/radius scope via `--local-*`, typography via canonical semantic font chain, no primary hardcoded themed values. **Base schemas** Ad hoc. BSDS (§8): BaseSectionData, BaseArrayItem, BaseSectionSettings. **Add Section** Ad hoc defaults. ASC (§9): addableSectionTypes, labels, getDefaultSectionData. **Bootstrap** Implicit. JEB (§10): JsonPagesConfig + JsonPagesEngine. **Selection payload** Flat `itemField/itemId`. Path-only `itemPath: SelectionPath` (JEB §10.3). **Nested array expansion** Single-segment or field-only heuristics. Root-to-leaf path expansion (ECIP §5.5, JAP §7). **Array item identity (strict)** Index fallback tolerated. Stable `id` required for editable object arrays.\n\n**Rule:** Every page section (non-header/footer) that appears in the Stage and in `SECTION_SCHEMAS` must comply with §6, §7, §4.4, §8, §9, §10 for full Studio UX.\n\n---\n\n## Summary of v1.5 Additions\n\n§ Title Purpose 4.4.3 Three-Layer CSS Bridge Replaces the informal \"publish CSS vars\" rule with the deterministic Layer 0 (engine injection) → Layer 1 (`:root` semantic bridge) → Layer 2 (`@theme` Tailwind bridge) architecture. Documents the engine's `--theme-colors-{name}` naming convention and the tenant's sovereign naming freedom in Layer 1. A.2.6 ThemeConfig (v1.5) Replaces the incorrect `surface/surfaceAlt/text/textMuted` canonical keys with the actual schema-aligned keys (`card`, `elevated`, `foreground`, `muted-foreground`, etc.). Adds `spacing`, `zIndex`, full typography sub-interfaces (`scale`, `tracking`, `leading`, `wordmark`), and `modes`. Establishes `theme.json` as SOT with schema as the formalisation layer.\n\n---\n\n## Summary of v1.4 Additions\n\n§ Title Purpose 4.4 Local Design Tokens Makes the `theme.json -> runtime vars -> --local-* -> JSX classes` chain explicit and normative. 4.4.3 Runtime Theme Publication Makes runtime CSS publication mandatory for themed tenants. 4.4.5 Canonical Typography Rule Removes ambiguity between global semantic font utilities and local token scoping. 4.4.7 Compliance Rules Turns Local Design Tokens into a checklist-grade compliance contract. 4.4.9 Non-Compliant Patterns Makes hardcoded token anti-patterns explicit. **Appendix A.2.6** **Deterministic ThemeConfig** Aligns the spec-level theme contract with the core’s structured semantic keys plus extension policy. **Appendix A.7** **Local Design Tokens Implementation Addendum** Operational checklist and implementation examples for compliant tenant sections.\n\n---\n\n# Appendix A — Tenant Type & Code-Generation Annex\n\n**Objective:** Make the specification **sufficient** to generate or audit a full tenant (new site, new components, new data) without a reference codebase. Defines TypeScript types, JSON shapes, schema contract, file paths, and integration pattern.\n\n**Status:** Mandatory for code-generation and governance. Compliance ensures generated tenants are typed and wired like the reference implementation.\n\n---\n\n## A.1 Core-Provided Types (from `@olonjs/core`)\n\nThe following are assumed to be exported by Core. The Tenant augments **SectionDataRegistry** and **SectionSettingsRegistry**; all other types are consumed as-is.\n\nType Description **SectionType** `keyof SectionDataRegistry` (after Tenant augmentation). Union of all section type keys. **Section** Union of `BaseSection<K>` for all K in SectionDataRegistry. See MTRP §1.2. **BaseSectionSettings** Optional base type for section settings (may align with BSDS §8.3). **MenuItem** Navigation item. **Minimum shape:** `{ label: string; href: string }`. Core may extend (e.g. `children?: MenuItem[]`). **AddSectionConfig** See §9. **JsonPagesConfig** See §10.1.\n\n**Perché servono (A.1):** Il Tenant deve conoscere i tipi esportati dal Core (SectionType, MenuItem, AddSectionConfig, JsonPagesConfig) per tipizzare registry, config e augmentation senza dipendere da implementazioni interne.\n\n---\n\n## A.2 Tenant-Provided Types (single source: `src/types.ts` or equivalent)\n\nThe Tenant **must** define the following in one module (e.g. `src/types.ts`). This module **must** perform the **module augmentation** of `@olonjs/core` for **SectionDataRegistry** and **SectionSettingsRegistry**, and **must** export **SectionComponentPropsMap** and re-export from `@olonjs/core` so that **SectionType** is available after augmentation.\n\n### A.2.1 SectionComponentPropsMap\n\nMaps each section type to the props of its React component. **Header** is the only type that receives **menu**.\n\n**Option A — Explicit (recommended for clarity and tooling):** For each section type K, add one entry. Header receives **menu**.\n\n```typescript\nimport type { MenuItem } from '@olonjs/core';\n// Import Data/Settings from each capsule.\n\nexport type SectionComponentPropsMap = {\n  'header': { data: HeaderData; settings?: HeaderSettings; menu: MenuItem[] };\n  'footer': { data: FooterData; settings?: FooterSettings };\n  'hero': { data: HeroData; settings?: HeroSettings };\n  // ... one entry per SectionType, e.g. 'feature-grid', 'cta-banner', etc.\n};\n```\n\n**Option B — Mapped type (DRY, requires SectionDataRegistry/SectionSettingsRegistry in scope):**\n\n```typescript\nimport type { MenuItem } from '@olonjs/core';\n\nexport type SectionComponentPropsMap = {\n  [K in SectionType]: K extends 'header'\n    ? { data: SectionDataRegistry[K]; settings?: SectionSettingsRegistry[K]; menu: MenuItem[] }\n    : { data: SectionDataRegistry[K]; settings?: K extends keyof SectionSettingsRegistry ? SectionSettingsRegistry[K] : BaseSectionSettings };\n};\n```\n\nSectionType is imported from Core (after Tenant augmentation). In practice Option A is the reference pattern; Option B is valid if the Tenant prefers a single derived definition.\n\n**Perché servono (A.2):** SectionComponentPropsMap e i tipi di config (PageConfig, SiteConfig, MenuConfig, ThemeConfig) definiscono il contratto tra dati (JSON, API) e componente; l’augmentation è l’unico modo per estendere i registry del Core senza fork. Senza questi tipi, generazione tenant e refactor sarebbero senza guida e il type-check fallirebbe.\n\n### A.2.2 ComponentRegistry type\n\nThe registry object **must** be typed as:\n\n```typescript\nimport type { SectionType } from '@olonjs/core';\nimport type { SectionComponentPropsMap } from '@/types';\n\nexport const ComponentRegistry: {\n  [K in SectionType]: React.FC<SectionComponentPropsMap[K]>;\n} = { /* ... */ };\n```\n\nFile: `src/lib/ComponentRegistry.tsx` (or equivalent). Imports one View per section type and assigns it to the corresponding key.\n\n### A.2.3 PageConfig\n\nMinimum shape for a single page (used in **pages** and in each `[slug].json`):\n\n```typescript\nexport interface PageConfig {\n  id?: string;\n  slug: string;\n  meta?: {\n    title?: string;\n    description?: string;\n  };\n  sections: Section[];\n}\n```\n\n**Section** is the union type from MTRP (§1.2). Each element of **sections** has **id**, **type**, **data**, **settings** and conforms to the capsule schemas.\n\n### A.2.4 SiteConfig\n\nMinimum shape for **site.json** (and for **siteConfig** in JsonPagesConfig):\n\n```typescript\nexport interface SiteConfigIdentity {\n  title?: string;\n  logoUrl?: string;\n}\n\nexport interface SiteConfig {\n  identity?: SiteConfigIdentity;\n  pages?: Array<{ slug: string; label: string }>;\n  header: {\n    id: string;\n    type: 'header';\n    data: HeaderData;\n    settings?: HeaderSettings;\n  };\n  footer: {\n    id: string;\n    type: 'footer';\n    data: FooterData;\n    settings?: FooterSettings;\n  };\n}\n```\n\n**HeaderData**, **FooterData**, **HeaderSettings**, **FooterSettings** are the types exported from the header and footer capsules.\n\n### A.2.5 MenuConfig\n\nMinimum shape for **menu.json** (and for **menuConfig** in JsonPagesConfig). Structure is tenant-defined; Core expects the header to receive **MenuItem\\[\\]**. Common pattern: an object with a key (e.g. **main**) whose value is **MenuItem\\[\\]**.\n\n```typescript\nexport interface MenuConfig {\n  main?: MenuItem[];\n  [key: string]: MenuItem[] | undefined;\n}\n```\n\nOr simply `MenuItem[]` if the app uses a single flat list. The Tenant must ensure that the value passed to the header component as **menu** conforms to **MenuItem\\[\\]** (e.g. `menuConfig.main` or `menuConfig` if it is the array).\n\n### A.2.6 ThemeConfig\n\nMinimum shape for **theme.json** (and for **themeConfig** in JsonPagesConfig). `theme.json` is the **source of truth** for the entire visual contract of the tenant. The schema (`design-system.schema.json`) is the machine-readable formalisation of this contract — if the TypeScript interfaces and the JSON Schema diverge, the JSON Schema wins.\n\n**Naming policy:** The keys within `tokens.colors` are the tenant's sovereign choice. The engine flattens all keys to `--theme-colors-{name}` regardless of naming convention. The required keys listed below are the ones the engine's `:root` bridge and the `@theme` Tailwind bridge must be able to resolve. Extra brand-specific keys are always allowed as additive extensions.\n\n```typescript\nexport interface ThemeColors {\n  /* Required — backgrounds */\n  background: string;\n  card: string;\n  elevated: string;\n  overlay: string;\n  popover: string;\n  'popover-foreground': string;\n\n  /* Required — foregrounds */\n  foreground: string;\n  'card-foreground': string;\n  'muted-foreground': string;\n  placeholder: string;\n\n  /* Required — brand */\n  primary: string;\n  'primary-foreground': string;\n  'primary-light': string;\n  'primary-dark': string;\n\n  /* Optional — brand ramp (50–900) */\n  'primary-50'?: string;\n  'primary-100'?: string;\n  'primary-200'?: string;\n  'primary-300'?: string;\n  'primary-400'?: string;\n  'primary-500'?: string;\n  'primary-600'?: string;\n  'primary-700'?: string;\n  'primary-800'?: string;\n  'primary-900'?: string;\n\n  /* Required — accent, secondary, muted */\n  accent: string;\n  'accent-foreground': string;\n  secondary: string;\n  'secondary-foreground': string;\n  muted: string;\n\n  /* Required — border, form */\n  border: string;\n  'border-strong': string;\n  input: string;\n  ring: string;\n\n  /* Required — feedback */\n  destructive: string;\n  'destructive-foreground': string;\n  'destructive-border': string;\n  'destructive-ring': string;\n  success: string;\n  'success-foreground': string;\n  'success-border': string;\n  'success-indicator': string;\n  warning: string;\n  'warning-foreground': string;\n  'warning-border': string;\n  info: string;\n  'info-foreground': string;\n  'info-border': string;\n\n  [key: string]: string | undefined;\n}\n\nexport interface ThemeFontFamily {\n  primary: string;\n  mono: string;\n  display?: string;\n  [key: string]: string | undefined;\n}\n\nexport interface ThemeWordmark {\n  fontFamily: string;\n  weight: string;\n  width: string;\n}\n\nexport interface ThemeTypography {\n  fontFamily: ThemeFontFamily;\n  wordmark?: ThemeWordmark;\n  scale?: Record<string, string>;     /* xs sm base md lg xl 2xl 3xl 4xl 5xl 6xl 7xl */\n  tracking?: Record<string, string>;  /* tight display normal wide label */\n  leading?: Record<string, string>;   /* none tight snug normal relaxed */\n}\n\nexport interface ThemeBorderRadius {\n  sm: string;\n  md: string;\n  lg: string;\n  xl?: string;\n  full?: string;\n  [key: string]: string | undefined;\n}\n\nexport interface ThemeSpacing {\n  'container-max'?: string;\n  'section-y'?: string;\n  'header-h'?: string;\n  'sidebar-w'?: string;\n  [key: string]: string | undefined;\n}\n\nexport interface ThemeZIndex {\n  base?: string;\n  elevated?: string;\n  dropdown?: string;\n  sticky?: string;\n  overlay?: string;\n  modal?: string;\n  toast?: string;\n  [key: string]: string | undefined;\n}\n\nexport interface ThemeModes {\n  [mode: string]: { colors: Partial<ThemeColors> };\n}\n\nexport interface ThemeTokens {\n  colors: ThemeColors;\n  typography: ThemeTypography;\n  borderRadius: ThemeBorderRadius;\n  spacing?: ThemeSpacing;\n  zIndex?: ThemeZIndex;\n  modes?: ThemeModes;\n}\n\nexport interface ThemeConfig {\n  name: string;\n  tokens: ThemeTokens;\n}\n```\n\n**Rule:** `theme.json` is the single source of truth. All layers downstream (engine injection, `:root` bridge, `@theme` bridge, React JSX) are read-only consumers. No layer below `theme.json` may hardcode a value that belongs to the theme contract.\n\n**Rule:** Brand-specific extension keys (e.g. `colors.primary-50` through `primary-900`, custom spacing tokens) are always allowed as additive extensions within the canonical groups. They must not replace the required semantic keys.\n\n---\n\n## A.3 Schema Contract (SECTION_SCHEMAS)\n\n**Location:** `src/lib/schemas.ts` (or equivalent).\n\n**Contract:**\n\n- **SECTION_SCHEMAS** is a **single object** whose keys are **SectionType** and whose values are **Zod schemas for the section data** (not settings, unless the Form Factory contract expects a combined or per-type settings schema; then each value may be the data schema only, and settings may be defined per capsule and aggregated elsewhere if needed).\n- The Tenant **must** re-export **BaseSectionData**, **BaseArrayItem**, and optionally **BaseSectionSettingsSchema** from `src/lib/base-schemas.ts` (or equivalent). Each capsule’s data schema **must** extend BaseSectionData; each array item schema **must** extend or include BaseArrayItem.\n- **SECTION_SCHEMAS** is typed as `Record<SectionType, ZodType>` or `{ [K in SectionType]: ZodType }` so that keys match the registry and SectionDataRegistry.\n\n**Export:** The app imports **SECTION_SCHEMAS** and passes it as **config.schemas** to JsonPagesEngine. The Form Factory traverses these schemas to build editors.\n\n**Perché servono (A.3):** Un unico oggetto SECTION_SCHEMAS con chiavi = SectionType e valori = schema data permette al Form Factory di costruire form per tipo senza convenzioni ad hoc; i base schema garantiscono anchorId e id su item. Senza questo contratto, l’Inspector non saprebbe quali campi mostrare né come validare.\n\n---\n\n## A.4 File Paths & Data Layout\n\nPurpose Path (conventional) Description Site config `src/data/config/site.json` SiteConfig (identity, header, footer, pages list). Menu config `src/data/config/menu.json` MenuConfig (e.g. main nav). Theme config `src/data/config/theme.json` ThemeConfig (tokens). Page data `src/data/pages/<slug>.json` One file per page; content is PageConfig (slug, meta, sections). Base schemas `src/lib/base-schemas.ts` BaseSectionData, BaseArrayItem, BaseSectionSettingsSchema. Schema aggregate `src/lib/schemas.ts` SECTION_SCHEMAS; re-exports base schemas. Registry `src/lib/ComponentRegistry.tsx` ComponentRegistry object. Add-section config `src/lib/addSectionConfig.ts` addSectionConfig (AddSectionConfig). Tenant types & augmentation `src/types.ts` SectionComponentPropsMap, PageConfig, SiteConfig, MenuConfig, ThemeConfig; **declare module '@olonjs/core'** for SectionDataRegistry and SectionSettingsRegistry; re-export from `@olonjs/core`. Bootstrap `src/App.tsx` Imports config (site, theme, menu, pages), registry, schemas, addSection, themeCss; builds JsonPagesConfig; renders .\n\nThe app entry (e.g. **main.tsx**) renders **App**. No other bootstrap contract is specified; the Tenant may use Vite aliases (e.g. **@/**) for the paths above.\n\n**Perché servono (A.4):** Path fissi (data/config, data/pages, lib/schemas, types.ts, App.tsx) permettono a CLI, tooling e agenti di trovare sempre gli stessi file; l’onboarding e la generazione da spec sono deterministici. Senza convenzione, ogni tenant sarebbe una struttura diversa.\n\n---\n\n## A.5 Integration Checklist (Code-Generation)\n\nWhen generating or auditing a tenant, ensure the following in order:\n\n 1. **Capsules** — For each section type, create `src/components/<type>/` with View.tsx, schema.ts, types.ts, index.ts. Data schema extends BaseSectionData; array items extend BaseArrayItem; View complies with CIP and IDAC (§6.2–6.3 for non-reserved types).\n 2. **Base schemas** — **src/lib/base-schemas.ts** exports BaseSectionData, BaseArrayItem, BaseSectionSettingsSchema (and optional CtaSchema or similar shared fragments).\n 3. **types.ts** — Define SectionComponentPropsMap (header with **menu**), PageConfig, SiteConfig, MenuConfig, ThemeConfig; **declare module '@olonjs/core'** and augment SectionDataRegistry and SectionSettingsRegistry; re-export from `@olonjs/core`.\n 4. **ComponentRegistry** — Import every View; build object **{ \\[K in SectionType\\]: ViewComponent }**; type as **{ \\[K in SectionType\\]: React.FC&lt;SectionComponentPropsMap\\[K\\]&gt; }**.\n 5. **schemas.ts** — Import base schemas and each capsule’s data schema; export SECTION_SCHEMAS as **{ \\[K in SectionType\\]: SchemaK }**; export SectionType as **keyof typeof SECTION_SCHEMAS** if not using Core’s SectionType.\n 6. **addSectionConfig** — addableSectionTypes, sectionTypeLabels, getDefaultSectionData; export as AddSectionConfig.\n 7. **App.tsx** — Import site, theme, menu, pages from data paths; build config (tenantId, registry, schemas, pages, siteConfig, themeConfig, menuConfig, themeCss: { tenant }, addSection); render JsonPagesEngine.\n 8. **Data files** — Create or update site.json, menu.json, theme.json, and one or more **.json** under the paths in A.4. Ensure JSON shapes match SiteConfig, MenuConfig, ThemeConfig, PageConfig.\n 9. **Runtime theme publication** — Publish the theme contract as runtime CSS custom properties before themed sections render.\n10. **Tenant CSS** — Include TOCC (§7) selectors in global CSS so the Stage overlay is visible, and bridge semantic theme variables where needed.\n11. **Reserved types** — Header and footer capsules receive props per SectionComponentPropsMap; menu is populated from menuConfig (e.g. menuConfig.main) when building the config or inside Core when rendering the header.\n\n**Perché servono (A.5):** La checklist in ordine evita di dimenticare passi (es. augmentation prima del registry, TOCC dopo le View) e rende la spec sufficiente per generare o verificare un tenant senza codebase di riferimento.\n\n---\n\n## A.6 v1.3 Path/Nested Strictness Addendum (breaking)\n\nThis addendum extends Appendix A without removing prior v1.2 obligations:\n\n1. **Type exports** — Core and/or shared types module should expose `SelectionPathSegment` and `SelectionPath` for Studio messaging and Inspector expansion logic.\n2. **Protocol migration** — Replace flat payload fields `itemField` / `itemId` with `itemPath?: SelectionPath` in strict v1.3 channels.\n3. **Nested array compliance** — For editable object arrays, item identity must be stable (`id`) and propagated to DOM attributes (`data-jp-item-id`), schema items (BaseArrayItem), and selection path segments (`itemId` when segment targets array item).\n4. **Backward compatibility policy** — Legacy flat fields may exist only in transitional adapters outside strict mode; normative v1.3 contract is path-only.\n\n---\n\n## A.7 v1.4 Local Design Tokens Implementation Addendum\n\nThis addendum extends Appendix A without removing prior v1.3 obligations:\n\n1. **Theme source of truth** — Tenant theme values belong in `src/data/config/theme.json`.\n2. **Runtime publication** — Core and/or tenant bootstrap **must** expose those values as runtime CSS custom properties before section rendering.\n3. **Local scope** — A themed section must define `--local-*` variables on its root for the color/radius concerns it owns.\n4. **Class consumption** — Section-owned color/radius utilities must consume `var(--local-*)`, not raw hardcoded theme values.\n5. **Typography policy** — Fonts must consume the published semantic font chain; local font tokens are optional and only for local remapping.\n6. **Migration policy** — Hardcoded colors/radii may exist only as temporary compatibility shims or purely decorative exceptions, not as the primary section contract.\n\nCanonical implementation pattern:\n\n```text\ntheme.json -> published runtime theme vars -> section --local-* -> JSX classes\n```\n\nCanonical typography pattern:\n\n```text\ntheme.json -> published semantic font vars -> tenant font utility/variable -> section typography\n```\n\nMinimal compliant example:\n\n```tsx\n<section\n  style={{\n    '--local-bg': 'var(--background)',\n    '--local-text': 'var(--foreground)',\n    '--local-primary': 'var(--primary)',\n    '--local-radius-md': 'var(--theme-radius-md)',\n  } as React.CSSProperties}\n  className=\"bg-[var(--local-bg)]\"\n>\n  <h2 className=\"font-display text-[var(--local-text)]\">Title</h2>\n  <a className=\"bg-[var(--local-primary)] rounded-[var(--local-radius-md)]\">CTA</a>\n</section>\n```\n\nDeterministic compliance checklist:\n\n1. Canonical semantic theme keys exist.\n2. Runtime publication exists.\n3. Section-local color/radius scope exists.\n4. Section-owned color/radius classes consume `var(--local-*)`.\n5. Fonts consume the semantic published font chain.\n6. Primary themed values are not hardcoded.\n\n---\n\n**Validation:** Align with current `@olonjs/core` exports (SectionType, MenuItem, AddSectionConfig, JsonPagesConfig, and in v1.3+ path types for Studio selection), with the deterministic `ThemeConfig` contract, and with the runtime theme publication contract used by tenant CSS.\\\n**Distribution:** Core via `.yalc`; tenant projections via `@olonjs/cli`. This annex makes the spec **necessary and sufficient** for tenant code-generation and governance at enterprise grade."
      },
      "settings": {}
    }
  ]
}
END_OF_FILE_CONTENT
echo "Creating src/data/pages/home.json..."
cat << 'END_OF_FILE_CONTENT' > "src/data/pages/home.json"
{
  "id": "home-page",
  "slug": "home",
  "meta": {
    "title": "OlonJS — The Contract Layer for the Agentic Web",
    "description": "OlonJS standardizes machine-readable web content across tenants. Predictable page endpoints for agents, typed schema contracts, repeatable governance."
  },
  "sections": [
    {
      "id": "global-header",
      "type": "header",
      "data": {
        "logoText": "Olon",
        "badge": "",
        "links": {
          "$ref": "../config/menu.json#/main"
        },
        "ctaLabel": "Get started →",
        "ctaHref": "#contact",
        "signinHref": "#login"
      },
      "settings": {
        "sticky": true
      }
    },
    {
      "id": "hero-main",
      "type": "hero",
      "data": {
        "eyebrow": "Contract layer · v1.4 · Open Core",
        "title": "Start building   ",
        "titleHighlight": "for the agentic web.",
        "description": "AI agents are becoming operational actors in commerce, marketing, and support. But websites are still built for humans first: HTML-heavy, CMS-fragmented, and inconsistent across properties. That makes agent integration slow, brittle, and expensive. Olon introduces a deterministic machine contract for websites OlonJS. This makes content reliably readable and operable by agents while preserving normal human UI.",
        "ctas": [
          {
            "id": "cta-started",
            "label": "Get started",
            "href": "#contact",
            "variant": "accent"
          },
          {
            "id": "cta-github",
            "label": "GitHub",
            "href": "#",
            "variant": "secondary"
          }
        ],
        "docsLabel": "Read the docs",
        "docsHref": "#",
        "heroImage": {
          "url": "https://bat5elmxofxdroan.public.blob.vercel-storage.com/tenant-assets/511f18d7-d8ac-4292-ad8a-b0efa99401a3/1774286598548-adac7c36-9001-451d-9b16-c3787ac27f57-signup-hero-olon-graded_1_.png",
          "alt": ""
        }
      },
      "settings": {
        "showCode": false
      }
    },
    {
      "id": "features-section",
      "type": "feature-grid",
      "data": {
        "label": "Why OlonJS",
        "sectionTitle": "A whole in itself,",
        "sectionTitleItalic": "part of something greater.",
        "sectionLead": "Built on the concept of the holon — every component autonomous yet part of the larger contract. Governance and developer experience, unified.",
        "cards": [
          {
            "id": "card-endpoints",
            "icon": {
              "url": "/icons/features/icon-json-files.svg",
              "alt": "JSON files icon"
            },
            "title": "Canonical JSON endpoints",
            "description": "Every page available at /{slug}.json — deterministic, typed, agent-readable. No custom integration per tenant."
          },
          {
            "id": "card-schema",
            "icon": {
              "url": "/icons/features/icon-zod-schemas.svg",
              "alt": "Zod schemas icon"
            },
            "title": "Schema-driven contracts",
            "description": "Typed components validated against your schema. Shared conventions eliminate prompt ambiguity across teams."
          },
          {
            "id": "card-ai",
            "icon": {
              "url": "/icons/features/icon-ai-specs.svg",
              "alt": "AI specs icon"
            },
            "title": "AI-native velocity",
            "description": "Structure is deterministic, so AI can scaffold and evolve tenants faster. Ship new experiences in hours, not weeks."
          },
          {
            "id": "card-multitenant",
            "icon": {
              "url": "/icons/features/icon-own-data.svg",
              "alt": "Own data icon"
            },
            "title": "Multi-tenant at scale",
            "description": "One convention across many tenants enables reusable automations. No per-tenant custom integration work."
          },
          {
            "id": "card-governance",
            "icon": {
              "url": "/icons/features/icon-governance.svg",
              "alt": "Governance icon"
            },
            "title": "Enterprise governance",
            "description": "Audit trails, compliance controls, and private cloud deployment via NX monorepo. SOC2-ready by design."
          },
          {
            "id": "card-deploy",
            "icon": {
              "url": "/icons/features/icon-clean-commits.svg",
              "alt": "Clean commits icon"
            },
            "title": "Deployment flexibility",
            "description": "OSS core you can trust. Vercel-native cloud for speed. Private cloud for governance-heavy orgs."
          }
        ],
        "proofStatement": "Working end-to-end with production routing parity.",
        "proofSub": "Early customer usage across real tenant deployments · Clear hardening path to enterprise-grade governance.",
        "tiers": [
          {
            "id": "tier-oss",
            "label": "OSS"
          },
          {
            "id": "tier-cloud",
            "label": "Cloud"
          },
          {
            "id": "tier-enterprise",
            "label": "Enterprise"
          }
        ]
      },
      "settings": {
        "columns": 3
      }
    },
    {
      "id": "contact-section",
      "type": "contact",
      "data": {
        "label": "Contact",
        "title": "Ready to define",
        "titleHighlight": "your contract?",
        "description": "Whether you're running a single tenant or deploying enterprise-grade governance across dozens of properties — let's talk.",
        "tiers": [
          {
            "id": "tier-oss",
            "label": "OSS",
            "desc": "Open source core — free forever",
            "sub": "Adoption, trust, ecosystem growth"
          },
          {
            "id": "tier-cloud",
            "label": "Cloud",
            "desc": "Vercel-native self-serve workflow",
            "sub": "Fast for modern dev teams"
          },
          {
            "id": "tier-enterprise",
            "label": "Enterprise",
            "desc": "Private cloud + NX monorepo",
            "sub": "Security, compliance, controlled deployment"
          }
        ],
        "formTitle": "Get in touch",
        "successTitle": "Message received",
        "successBody": "We'll respond within one business day.",
        "disclaimer": "No spam. Unsubscribe at any time."
      },
      "settings": {
        "showTiers": true
      }
    },
    {
      "id": "login-section",
      "type": "login",
      "data": {
        "title": "Start your journey",
        "subtitle": "Enter your credentials to continue",
        "forgotHref": "#",
        "signupHref": "#contact",
        "termsHref": "#",
        "privacyHref": "#"
      },
      "settings": {
        "showOauth": true
      }
    }
  ],
  "global-header": false
}
END_OF_FILE_CONTENT
mkdir -p "src/data/pages/platform"
# SKIP: src/data/pages/platform.json:Zone.Identifier is binary and cannot be embedded as text.
echo "Creating src/data/pages/platform/overview.json..."
cat << 'END_OF_FILE_CONTENT' > "src/data/pages/platform/overview.json"
{
  "id": "overview-page",
  "slug": "platform/overview",
  "meta": {
    "title": "OlonJS — Documentation",
    "description": "Architecture specifications, tenant protocol, and developer reference for the OlonJS contract layer."
  },
  "sections": [
    {
      "id": "doc-page-hero",
      "type": "page-hero",
      "data": {
        "breadcrumb": [
          {
            "id": "crumb-home",
            "label": "Home",
            "href": "/"
          },
          {
            "id": "crumb-docs",
            "label": "Docs",
            "href": "/doc"
          }
        ],
        "badge": "",
        "title": "Platform",
        "titleItalic": "Overview",
        "description": "The platform overview page."
      }
    }
  ]
}
END_OF_FILE_CONTENT
echo "Creating src/data/pages/post.json..."
cat << 'END_OF_FILE_CONTENT' > "src/data/pages/post.json"
{
  "id": "post-page",
  "slug": "post",
  "meta": {
    "title": "Post",
    "description": "Smoke test page for header + tiptap + footer flow."
  },
  "sections": [
    {
      "id": "post-editorial-main",
      "type": "tiptap",
      "data": {
        "content": "# JsonPages Cloud – Terms of Service & EULA\n\n---\n\n### **Last Updated:** March 2026\n\n### 1. THE SERVICE\n\nJsonPages provides a hybrid content management infrastructure consisting of:\n\n- **The Core:** An open-source library (@jsonpages/core) governed by the **MIT License**.\n- **The Cloud:** A proprietary SaaS platform (`cloud.jsonpages.io`) that provides the \"Git Bridge,\" Asset Pipeline, and Managed Infrastructure.\n\nBy using the Cloud Service, you agree to these terms.\n\n### 2. DATA SOVEREIGNTY & OWNERSHIP\n\n- **Your Content:** All data (JSON files), code, and assets managed through JsonPages remain your exclusive property. JsonPages acts only as an **orchestrator**.\n- **The Bridge:** You grant JsonPages the necessary permissions to perform Git operations (commits/pushes) on your behalf to your designated repositories (GitHub/GitLab).\n- **Portability:** Since your content is stored as flat JSON files in your own repository, you retain the right to migrate away from the Cloud Service at any time without data lock-in.\n- \n\n### 3. SUBSCRIPTIONS & ENTITLEMENTS\n\n- **Billing:** The Cloud Service is billed on a subscription basis (**Monthly Recurring Revenue**).\n- **Entitlements:** Each \"Project\" or \"Tenant\" consumes one entitlement. Active entitlements grant access to the Visual Studio (ICE) and the Cloud Save API.\n- **Third-Party Costs:** You are solely responsible for any costs incurred on third-party platforms (e.g., **Vercel** hosting, **GitHub** storage, **Cloudflare** workers).\n\n### 4. ACCEPTABLE USE\n\nYou may not use JsonPages Cloud to:\n\n- Host or manage illegal, harmful, or offensive content.\n- Attempt to reverse-engineer the proprietary Cloud Bridge or bypass entitlement checks.\n- Interfere with the stability of the API for other users.\n- \n\n### 5. LIMITATION OF LIABILITY\n\n- **\"As-Is\" Basis:** The service is provided \"as-is.\" While we strive for 99.9% uptime, JsonPages is not liable for data loss resulting from Git conflicts, third-party outages (Vercel/GitHub), or user error.\n- **No Warranty:** We do not warrant that the service will be error-free or uninterrupted.\n- \n\n### 6. TERMINATION\n\n- **By You:** You can cancel your subscription at any time. Your Studio access will remain active until the end of the current billing cycle.\n- \n- **By Us:** We reserve the right to suspend accounts that violate these terms or fail to settle outstanding invoices.\n\n### 7. GOVERNING LAW\n\nThese terms are governed by the laws of **Italy/European Union**, without regard to conflict of law principles."
      },
      "settings": {}
    }
  ]
}
END_OF_FILE_CONTENT
mkdir -p "src/emails"
echo "Creating src/emails/LeadNotificationEmail.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/emails/LeadNotificationEmail.tsx"
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type LeadData = Record<string, unknown>;

type EmailTheme = {
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    surface?: string;
    surfaceAlt?: string;
    text?: string;
    textMuted?: string;
    border?: string;
  };
  typography?: {
    fontFamily?: {
      primary?: string;
      display?: string;
      mono?: string;
    };
  };
  borderRadius?: {
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };
};

export type LeadNotificationEmailProps = {
  tenantName: string;
  correlationId: string;
  replyTo?: string | null;
  leadData: LeadData;
  brandName?: string;
  logoUrl?: string;
  logoAlt?: string;
  tagline?: string;
  theme?: EmailTheme;
};

function safeString(value: unknown): string {
  if (value == null) return "-";
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || "-";
  }
  return JSON.stringify(value);
}

function flattenLeadData(data: LeadData) {
  return Object.entries(data)
    .filter(([key]) => !key.startsWith("_"))
    .slice(0, 20)
    .map(([key, value]) => ({ label: key, value: safeString(value) }));
}

export function LeadNotificationEmail({
  tenantName,
  correlationId,
  replyTo,
  leadData,
  brandName,
  logoUrl,
  logoAlt,
  tagline,
  theme,
}: LeadNotificationEmailProps) {
  const fields = flattenLeadData(leadData);
  const brandLabel = brandName || tenantName;

  const colors = {
    primary: theme?.colors?.primary || "#2D5016",
    background: theme?.colors?.background || "#FAFAF5",
    surface: theme?.colors?.surface || "#FFFFFF",
    text: theme?.colors?.text || "#1C1C14",
    textMuted: theme?.colors?.textMuted || "#5A5A4A",
    border: theme?.colors?.border || "#D8D5C5",
  };

  const fonts = {
    primary: theme?.typography?.fontFamily?.primary || "Inter, Arial, sans-serif",
    display: theme?.typography?.fontFamily?.display || "Georgia, serif",
  };

  const radius = {
    md: theme?.borderRadius?.md || "10px",
    lg: theme?.borderRadius?.lg || "16px",
  };

  return (
    <Html>
      <Head />
      <Preview>Nuovo lead ricevuto da {brandLabel}</Preview>
      <Body style={{ backgroundColor: colors.background, color: colors.text, fontFamily: fonts.primary, padding: "24px" }}>
        <Container style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}`, borderRadius: radius.lg, padding: "24px" }}>
          <Section>
            {logoUrl ? <Img src={logoUrl} alt={logoAlt || brandLabel} height="44" style={{ marginBottom: "8px" }} /> : null}
            <Text style={{ color: colors.text, fontSize: "18px", fontWeight: 700, margin: "0 0 6px 0" }}>{brandLabel}</Text>
            <Text style={{ color: colors.textMuted, marginTop: "0", marginBottom: "0" }}>{tagline || "Notifica automatica lead"}</Text>
          </Section>

          <Hr style={{ borderColor: colors.border, margin: "20px 0" }} />

          <Heading as="h2" style={{ color: colors.text, margin: "0 0 12px 0", fontSize: "22px", fontFamily: fonts.display }}>
            Nuovo lead da {tenantName}
          </Heading>
          <Text style={{ color: colors.textMuted, marginTop: "0", marginBottom: "16px" }}>Correlation ID: {correlationId}</Text>

          <Section style={{ border: `1px solid ${colors.border}`, borderRadius: radius.md, padding: "12px" }}>
            {fields.length === 0 ? (
              <Text style={{ color: colors.textMuted, margin: 0 }}>Nessun campo lead disponibile.</Text>
            ) : (
              fields.map((field) => (
                <Text key={field.label} style={{ margin: "0 0 8px 0", color: colors.text, fontSize: "14px", wordBreak: "break-word" }}>
                  <strong>{field.label}:</strong> {field.value}
                </Text>
              ))
            )}
          </Section>

          <Section style={{ marginTop: "18px" }}>
            <Button
              href={replyTo ? `mailto:${replyTo}` : "mailto:"}
              style={{
                backgroundColor: colors.primary,
                color: "#ffffff",
                borderRadius: radius.md,
                textDecoration: "none",
                padding: "12px 18px",
                fontWeight: 600,
              }}
            >
              Rispondi ora
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default LeadNotificationEmail;

END_OF_FILE_CONTENT
echo "Creating src/emails/LeadSenderConfirmationEmail.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/emails/LeadSenderConfirmationEmail.tsx"
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type LeadData = Record<string, unknown>;

type EmailTheme = {
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    surface?: string;
    surfaceAlt?: string;
    text?: string;
    textMuted?: string;
    border?: string;
  };
  typography?: {
    fontFamily?: {
      primary?: string;
      display?: string;
      mono?: string;
    };
  };
  borderRadius?: {
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };
};

export type LeadSenderConfirmationEmailProps = {
  tenantName: string;
  correlationId: string;
  leadData: LeadData;
  brandName?: string;
  logoUrl?: string;
  logoAlt?: string;
  tagline?: string;
  theme?: EmailTheme;
};

function safeString(value: unknown): string {
  if (value == null) return "-";
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || "-";
  }
  return JSON.stringify(value);
}

function flattenLeadData(data: LeadData) {
  const skipKeys = new Set(["recipientEmail", "tenant", "source", "submittedAt", "email_confirm"]);
  return Object.entries(data)
    .filter(([key]) => !key.startsWith("_") && !skipKeys.has(key))
    .slice(0, 12)
    .map(([key, value]) => ({ label: key, value: safeString(value) }));
}

export function LeadSenderConfirmationEmail({
  tenantName,
  correlationId,
  leadData,
  brandName,
  logoUrl,
  logoAlt,
  tagline,
  theme,
}: LeadSenderConfirmationEmailProps) {
  const fields = flattenLeadData(leadData);
  const brandLabel = brandName || tenantName;

  const colors = {
    primary: theme?.colors?.primary || "#2D5016",
    background: theme?.colors?.background || "#FAFAF5",
    surface: theme?.colors?.surface || "#FFFFFF",
    text: theme?.colors?.text || "#1C1C14",
    textMuted: theme?.colors?.textMuted || "#5A5A4A",
    border: theme?.colors?.border || "#D8D5C5",
  };

  const fonts = {
    primary: theme?.typography?.fontFamily?.primary || "Inter, Arial, sans-serif",
    display: theme?.typography?.fontFamily?.display || "Georgia, serif",
  };

  const radius = {
    md: theme?.borderRadius?.md || "10px",
    lg: theme?.borderRadius?.lg || "16px",
  };

  return (
    <Html>
      <Head />
      <Preview>Conferma invio richiesta - {brandLabel}</Preview>
      <Body style={{ backgroundColor: colors.background, color: colors.background, fontFamily: fonts.primary, padding: "24px" }}>
        <Container style={{ backgroundColor: colors.primary, color: colors.background, border: `1px solid ${colors.border}`, borderRadius: radius.lg, padding: "24px" }}>
          <Section>
            {logoUrl ? <Img src={logoUrl} alt={logoAlt || brandLabel} height="44" style={{ marginBottom: "8px" }} /> : null}
            <Text style={{ color: colors.background, fontSize: "18px", fontWeight: 700, margin: "0 0 6px 0" }}>{brandLabel}</Text>
            <Text style={{ color: colors.background, marginTop: "0", marginBottom: "0" }}>{tagline || "Conferma automatica di ricezione"}</Text>
          </Section>

          <Hr style={{ borderColor: colors.border, margin: "20px 0" }} />

          <Heading as="h2" style={{ color: colors.background, margin: "0 0 12px 0", fontSize: "22px", fontFamily: fonts.display }}>
            Richiesta ricevuta
          </Heading>
          <Text style={{ color: colors.background, marginTop: "0", marginBottom: "16px" }}>
            Grazie, abbiamo ricevuto la tua richiesta per {tenantName}. Ti risponderemo il prima possibile.
          </Text>

          <Section style={{ border: `1px solid ${colors.border}`, borderRadius: radius.md, padding: "12px" }}>
            <Text style={{ margin: "0 0 8px 0", color: colors.background, fontWeight: 600 }}>Riepilogo inviato</Text>
            {fields.length === 0 ? (
              <Text style={{ color: colors.background, margin: 0 }}>Nessun dettaglio disponibile.</Text>
            ) : (
              fields.map((field) => (
                <Text key={field.label} style={{ margin: "0 0 8px 0", color: colors.background, fontSize: "14px", wordBreak: "break-word" }}>
                  <strong>{field.label}:</strong> {field.value}
                </Text>
              ))
            )}
          </Section>

          <Hr style={{ borderColor: colors.border, margin: "20px 0 12px 0" }} />
          <Text style={{ color: colors.background, fontSize: "12px", margin: 0 }}>Riferimento richiesta: {correlationId}</Text>
        </Container>
      </Body>
    </Html>
  );
}

export default LeadSenderConfirmationEmail;

END_OF_FILE_CONTENT
echo "Creating src/entry-ssg.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/entry-ssg.tsx"
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { ConfigProvider, PageRenderer, StudioProvider } from '@olonjs/core';
import type { JsonPagesConfig, MenuConfig, PageConfig, SiteConfig, ThemeConfig } from '@/types';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ComponentRegistry } from '@/lib/ComponentRegistry';
import { SECTION_SCHEMAS } from '@/lib/schemas';
import { getFilePages } from '@/lib/getFilePages';
import siteData from '@/data/config/site.json';
import menuData from '@/data/config/menu.json';
import themeData from '@/data/config/theme.json';
import tenantCss from '@/index.css?inline';

const siteConfig = siteData as unknown as SiteConfig;
const menuConfig = menuData as unknown as MenuConfig;
const themeConfig = themeData as unknown as ThemeConfig;
const pages = getFilePages();

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeSlug(input: string): string {
  return input.trim().toLowerCase().replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
}

function getSortedSlugs(): string[] {
  return Object.keys(pages).sort((a, b) => a.localeCompare(b));
}

function resolvePage(slug: string): { slug: string; page: PageConfig } {
  const normalized = normalizeSlug(slug);
  if (normalized && pages[normalized]) {
    return { slug: normalized, page: pages[normalized] };
  }

  const slugs = getSortedSlugs();
  if (slugs.length === 0) {
    throw new Error('[SSG_CONFIG_ERROR] No pages found under src/data/pages');
  }

  const home = slugs.find((item) => item === 'home');
  const fallbackSlug = home ?? slugs[0];
  return { slug: fallbackSlug, page: pages[fallbackSlug] };
}

function flattenThemeTokens(
  input: unknown,
  pathSegments: string[] = [],
  out: Array<{ name: string; value: string }> = []
): Array<{ name: string; value: string }> {
  if (typeof input === 'string') {
    const cleaned = input.trim();
    if (cleaned.length > 0 && pathSegments.length > 0) {
      out.push({ name: `--theme-${pathSegments.join('-')}`, value: cleaned });
    }
    return out;
  }

  if (!isRecord(input)) return out;

  const entries = Object.entries(input).sort(([a], [b]) => a.localeCompare(b));
  for (const [key, value] of entries) {
    flattenThemeTokens(value, [...pathSegments, key], out);
  }
  return out;
}

function buildThemeCssFromSot(theme: ThemeConfig): string {
  const root: Record<string, unknown> = isRecord(theme) ? theme : {};
  const tokens = root['tokens'];
  const flattened = flattenThemeTokens(tokens);
  if (flattened.length === 0) return '';
  const serialized = flattened.map((item) => `${item.name}:${item.value}`).join(';');
  return `:root{${serialized}}`;
}

function resolveTenantId(): string {
  const site: Record<string, unknown> = isRecord(siteConfig) ? siteConfig : {};
  const identityRaw = site['identity'];
  const identity: Record<string, unknown> = isRecord(identityRaw) ? identityRaw : {};
  const titleRaw = typeof identity.title === 'string' ? identity.title : '';
  const title = titleRaw.trim();
  if (title.length > 0) {
    const normalized = title.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
    if (normalized.length > 0) return normalized;
  }

  const slugs = getSortedSlugs();
  if (slugs.length === 0) {
    throw new Error('[SSG_CONFIG_ERROR] Cannot resolve tenantId without site.identity.title or pages');
  }
  return slugs[0].replace(/\//g, '-');
}

export function render(slug: string): string {
  const resolved = resolvePage(slug);
  const location = resolved.slug === 'home' ? '/' : `/${resolved.slug}`;

  return renderToString(
    <StaticRouter location={location}>
      <ConfigProvider
        config={{
          registry: ComponentRegistry as JsonPagesConfig['registry'],
          schemas: SECTION_SCHEMAS as unknown as JsonPagesConfig['schemas'],
          tenantId: resolveTenantId(),
        }}
      >
        <StudioProvider mode="visitor">
          <ThemeProvider>
            <PageRenderer pageConfig={resolved.page} siteConfig={siteConfig} menuConfig={menuConfig} />
          </ThemeProvider>
        </StudioProvider>
      </ConfigProvider>
    </StaticRouter>
  );
}

export function getCss(): string {
  const themeCss = buildThemeCssFromSot(themeConfig);
  if (!themeCss) return tenantCss;
  return `${themeCss}\n${tenantCss}`;
}

export function getPageMeta(slug: string): { title: string; description: string } {
  const resolved = resolvePage(slug);
  const rawMeta = isRecord((resolved.page as unknown as { meta?: unknown }).meta)
    ? ((resolved.page as unknown as { meta?: Record<string, unknown> }).meta as Record<string, unknown>)
    : {};

  const title = typeof rawMeta.title === 'string' ? rawMeta.title : resolved.slug;
  const description = typeof rawMeta.description === 'string' ? rawMeta.description : '';
  return { title, description };
}

END_OF_FILE_CONTENT
# SKIP: src/entry-ssg.tsx:Zone.Identifier is binary and cannot be embedded as text.
echo "Creating src/fonts.css..."
cat << 'END_OF_FILE_CONTENT' > "src/fonts.css"
@import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap');

END_OF_FILE_CONTENT
mkdir -p "src/hooks"
echo "Creating src/hooks/useDocumentMeta.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/hooks/useDocumentMeta.ts"
import { useEffect } from 'react';
import type { PageMeta } from '@/types';

export const useDocumentMeta = (meta: PageMeta): void => {
  useEffect(() => {
    // Set document title
    document.title = meta.title;

    // Set or update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', meta.description);
  }, [meta.title, meta.description]);
};





END_OF_FILE_CONTENT
echo "Creating src/index.css..."
cat << 'END_OF_FILE_CONTENT' > "src/index.css"
@import "tailwindcss";

/* ═══════════════════════════════════════════════════════════════
   OLON DESIGN SYSTEM — index.css
   v1.4 · Holon · Labradorite

   Architecture:
   1. :root      — bridge: reads vars injected by @olonjs/core from theme.json
                   SOT lives in src/data/config/theme.json
   2. @theme      — Tailwind v4 bridge: --color-{slug}: var(--{slug})
   3. @layer base — global resets + base element styles
   4. @layer utilities — custom utility classes
═══════════════════════════════════════════════════════════════ */


/* ─────────────────────────────────────────────────────────────
   1. TOKEN BRIDGE
   Reads CSS vars injected by @olonjs/core engine from theme.json.
   engine injects: --theme-colors-{name}, --theme-typography-*,
                   --theme-border-radius-*, --theme-spacing-*
   Aliases: --theme-font-*, --theme-radius-*, --theme-primary etc.
───────────────────────────────────────────────────────────── */
:root {

  /* ── Backgrounds ─────────────────────────────────────────── */
  --background:           var(--theme-colors-background);
  --card:                 var(--theme-colors-card);
  --elevated:             var(--theme-colors-elevated);
  --overlay:              var(--theme-colors-overlay);
  --popover:              var(--theme-colors-popover);
  --popover-foreground:   var(--theme-colors-popover-foreground);

  /* ── Foregrounds ─────────────────────────────────────────── */
  --foreground:           var(--theme-colors-foreground);
  --card-foreground:      var(--theme-colors-card-foreground);
  --muted-foreground:     var(--theme-colors-muted-foreground);
  --placeholder:          var(--theme-colors-placeholder);

  /* ── Brand — Labradorite ramp ────────────────────────────── */
  --primary:              var(--theme-colors-primary);
  --primary-foreground:   var(--theme-colors-primary-foreground);
  --primary-light:        var(--theme-colors-primary-light);
  --primary-dark:         var(--theme-colors-primary-dark);
  --primary-50:           var(--theme-colors-primary-50);
  --primary-100:          var(--theme-colors-primary-100);
  --primary-200:          var(--theme-colors-primary-200);
  --primary-300:          var(--theme-colors-primary-300);
  --primary-400:          var(--theme-colors-primary-400);
  --primary-500:          var(--theme-colors-primary-500);
  --primary-600:          var(--theme-colors-primary-600);
  --primary-700:          var(--theme-colors-primary-700);
  --primary-800:          var(--theme-colors-primary-800);
  --primary-900:          var(--theme-colors-primary-900);

  /* ── Accent ──────────────────────────────────────────────── */
  --accent:               var(--theme-colors-accent);
  --accent-foreground:    var(--theme-colors-accent-foreground);

  /* ── Secondary ───────────────────────────────────────────── */
  --secondary:            var(--theme-colors-secondary);
  --secondary-foreground: var(--theme-colors-secondary-foreground);

  /* ── Muted ───────────────────────────────────────────────── */
  --muted:                var(--theme-colors-muted);

  /* ── Border ──────────────────────────────────────────────── */
  --border:               var(--theme-colors-border);
  --border-strong:        var(--theme-colors-border-strong);

  /* ── Form ────────────────────────────────────────────────── */
  --input:                var(--theme-colors-input);
  --ring:                 var(--theme-colors-ring);

  /* ── Feedback — Destructive ──────────────────────────────── */
  --destructive:              var(--theme-colors-destructive);
  --destructive-foreground:   var(--theme-colors-destructive-foreground);
  --destructive-border:       var(--theme-colors-destructive-border);
  --destructive-ring:         var(--theme-colors-destructive-ring);

  /* ── Feedback — Success ──────────────────────────────────── */
  --success:              var(--theme-colors-success);
  --success-foreground:   var(--theme-colors-success-foreground);
  --success-border:       var(--theme-colors-success-border);
  --success-indicator:    var(--theme-colors-success-indicator);

  /* ── Feedback — Warning ──────────────────────────────────── */
  --warning:              var(--theme-colors-warning);
  --warning-foreground:   var(--theme-colors-warning-foreground);
  --warning-border:       var(--theme-colors-warning-border);

  /* ── Feedback — Info ─────────────────────────────────────── */
  --info:                 var(--theme-colors-info);
  --info-foreground:      var(--theme-colors-info-foreground);
  --info-border:          var(--theme-colors-info-border);

  /* ── Radius (xl/full not aliased by engine, bridge here) ─── */
  --theme-radius-xl:      var(--theme-border-radius-xl);
  --theme-radius-full:    var(--theme-border-radius-full);

  /* ── Typography — scale ──────────────────────────────────── */
  --theme-text-xs:        var(--theme-typography-scale-xs);
  --theme-text-sm:        var(--theme-typography-scale-sm);
  --theme-text-base:      var(--theme-typography-scale-base);
  --theme-text-md:        var(--theme-typography-scale-md);
  --theme-text-lg:        var(--theme-typography-scale-lg);
  --theme-text-xl:        var(--theme-typography-scale-xl);
  --theme-text-2xl:       var(--theme-typography-scale-2xl);
  --theme-text-3xl:       var(--theme-typography-scale-3xl);
  --theme-text-4xl:       var(--theme-typography-scale-4xl);
  --theme-text-5xl:       var(--theme-typography-scale-5xl);
  --theme-text-6xl:       var(--theme-typography-scale-6xl);
  --theme-text-7xl:       var(--theme-typography-scale-7xl);

  /* ── Typography — tracking ───────────────────────────────── */
  --theme-tracking-tight:   var(--theme-typography-tracking-tight);
  --theme-tracking-display: var(--theme-typography-tracking-display);
  --theme-tracking-normal:  var(--theme-typography-tracking-normal);
  --theme-tracking-wide:    var(--theme-typography-tracking-wide);
  --theme-tracking-label:   var(--theme-typography-tracking-label);

  /* ── Typography — wordmark ───────────────────────────────── */
  --wordmark-font:     var(--theme-typography-wordmark-font-family);
  --wordmark-tracking: var(--theme-typography-wordmark-tracking);
  --wordmark-weight:   var(--theme-typography-wordmark-weight);
  --wordmark-width:    var(--theme-typography-wordmark-width);

  /* ── Typography — leading ────────────────────────────────── */
  --theme-leading-none:    var(--theme-typography-leading-none);
  --theme-leading-tight:   var(--theme-typography-leading-tight);
  --theme-leading-snug:    var(--theme-typography-leading-snug);
  --theme-leading-normal:  var(--theme-typography-leading-normal);
  --theme-leading-relaxed: var(--theme-typography-leading-relaxed);

  /* ── Spacing ─────────────────────────────────────────────── */
  --theme-container-max:  var(--theme-spacing-container-max);
  --theme-section-y:      var(--theme-spacing-section-y);
  --theme-header-h:       var(--theme-spacing-header-h);
  --theme-sidebar-w:      var(--theme-spacing-sidebar-w);

  /* ── Z-index ─────────────────────────────────────────────── */
  --z-base:     var(--theme-z-index-base);
  --z-elevated: var(--theme-z-index-elevated);
  --z-dropdown: var(--theme-z-index-dropdown);
  --z-sticky:   var(--theme-z-index-sticky);
  --z-overlay:  var(--theme-z-index-overlay);
  --z-modal:    var(--theme-z-index-modal);
  --z-toast:    var(--theme-z-index-toast);
}


/* ─────────────────────────────────────────────────────────────
   2. @theme — Tailwind v4 TOKEN BRIDGE
   Pattern: --color-{slug}: var(--{slug})
   Every token exposed here becomes a Tailwind utility class.
───────────────────────────────────────────────────────────── */
@theme {

  /* Colors — Backgrounds */
  --color-background:              var(--background);
  --color-card:                    var(--card);
  --color-elevated:                var(--elevated);
  --color-overlay:                 var(--overlay);
  --color-popover:                 var(--popover);
  --color-popover-foreground:      var(--popover-foreground);

  /* Colors — Foregrounds */
  --color-foreground:              var(--foreground);
  --color-card-foreground:         var(--card-foreground);
  --color-muted-foreground:        var(--muted-foreground);
  --color-placeholder:             var(--placeholder);

  /* Colors — Brand ramp */
  --color-primary:                 var(--primary);
  --color-primary-foreground:      var(--primary-foreground);
  --color-primary-light:           var(--primary-light);
  --color-primary-dark:            var(--primary-dark);
  --color-primary-50:              var(--primary-50);
  --color-primary-100:             var(--primary-100);
  --color-primary-200:             var(--primary-200);
  --color-primary-300:             var(--primary-300);
  --color-primary-400:             var(--primary-400);
  --color-primary-500:             var(--primary-500);
  --color-primary-600:             var(--primary-600);
  --color-primary-700:             var(--primary-700);
  --color-primary-800:             var(--primary-800);
  --color-primary-900:             var(--primary-900);

  /* Colors — Accent */
  --color-accent:                  var(--accent);
  --color-accent-foreground:       var(--accent-foreground);

  /* Colors — Secondary */
  --color-secondary:               var(--secondary);
  --color-secondary-foreground:    var(--secondary-foreground);

  /* Colors — Muted */
  --color-muted:                   var(--muted);

  /* Colors — Border */
  --color-border:                  var(--border);
  --color-border-strong:           var(--border-strong);

  /* Colors — Form */
  --color-input:                   var(--input);
  --color-ring:                    var(--ring);

  /* Colors — Feedback */
  --color-destructive:             var(--destructive);
  --color-destructive-foreground:  var(--destructive-foreground);
  --color-destructive-border:      var(--destructive-border);
  --color-destructive-ring:        var(--destructive-ring);
  --color-success:                 var(--success);
  --color-success-foreground:      var(--success-foreground);
  --color-success-border:          var(--success-border);
  --color-success-indicator:       var(--success-indicator);
  --color-warning:                 var(--warning);
  --color-warning-foreground:      var(--warning-foreground);
  --color-warning-border:          var(--warning-border);
  --color-info:                    var(--info);
  --color-info-foreground:         var(--info-foreground);
  --color-info-border:             var(--info-border);

  /* Radius */
  --radius-xl:                     var(--theme-radius-xl);
  --radius-lg:                     var(--theme-radius-lg);
  --radius-md:                     var(--theme-radius-md);
  --radius-sm:                     var(--theme-radius-sm);
  --radius-full:                   var(--theme-radius-full);

  /* Fonts */
  --font-primary:                  var(--theme-font-primary);
  --font-mono:                     var(--theme-font-mono);
  --font-display:                  var(--theme-font-display);

  /* Text scale */
  --text-xs:                       var(--theme-text-xs);
  --text-sm:                       var(--theme-text-sm);
  --text-base:                     var(--theme-text-base);
  --text-md:                       var(--theme-text-md);
  --text-lg:                       var(--theme-text-lg);
  --text-xl:                       var(--theme-text-xl);
  --text-2xl:                      var(--theme-text-2xl);
  --text-3xl:                      var(--theme-text-3xl);
  --text-4xl:                      var(--theme-text-4xl);
  --text-5xl:                      var(--theme-text-5xl);
  --text-6xl:                      var(--theme-text-6xl);
  --text-7xl:                      var(--theme-text-7xl);

  /* Line heights */
  --leading-none:                  var(--theme-leading-none);
  --leading-tight:                 var(--theme-leading-tight);
  --leading-snug:                  var(--theme-leading-snug);
  --leading-normal:                var(--theme-leading-normal);
  --leading-relaxed:               var(--theme-leading-relaxed);

  /* Tracking */
  --tracking-tight:                var(--theme-tracking-tight);
  --tracking-display:              var(--theme-tracking-display);
  --tracking-normal:               var(--theme-tracking-normal);
  --tracking-wide:                 var(--theme-tracking-wide);
  --tracking-label:                var(--theme-tracking-label);
}


/* ─────────────────────────────────────────────────────────────
   3. BASE LAYER
───────────────────────────────────────────────────────────── */
@layer base {
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
    text-size-adjust: 100%;
  }

  body {
    background-color: var(--background);
    color: var(--foreground);
    font-family: var(--theme-font-primary);
    font-size: var(--theme-text-base);
    line-height: var(--theme-leading-normal);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--theme-font-primary);
    font-weight: 500;
    line-height: var(--theme-leading-tight);
    color: var(--foreground);
  }

  h1 {
    font-size: var(--theme-text-5xl);
  }
  h2 {
    font-size: var(--theme-text-4xl);
  }
  h3 {
    font-size: var(--theme-text-3xl);
  }
  h4 {
    font-size: var(--theme-text-2xl);
  }
  h5 {
    font-size: var(--theme-text-xl);
  }
  h6 {
    font-size: var(--theme-text-lg);
  }

  @media (min-width: 768px) {
    h1 { font-size: var(--theme-text-6xl); }
    h2 { font-size: var(--theme-text-5xl); }
    h3 { font-size: var(--theme-text-4xl); }
    h4 { font-size: var(--theme-text-3xl); }
    h5 { font-size: var(--theme-text-2xl); }
    h6 { font-size: var(--theme-text-xl);  }
  }

  @media (min-width: 1024px) {
    h1 { font-size: var(--theme-text-7xl); }
    h2 { font-size: var(--theme-text-6xl); }
    h3 { font-size: var(--theme-text-5xl); }
    h4 { font-size: var(--theme-text-4xl); }
    h5 { font-size: var(--theme-text-3xl); }
    h6 { font-size: var(--theme-text-2xl); }
  }

  p {
    line-height: var(--theme-leading-normal);
  }

  code, pre, kbd, samp {
    font-family: var(--theme-font-mono);
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    cursor: pointer;
  }

  input, textarea, select {
    font-family: var(--theme-font-primary);
    font-size: var(--theme-text-sm);
  }

  ::selection {
    background-color: var(--primary);
    color: var(--primary-foreground);
  }

  /* Scrollbar */
  ::-webkit-scrollbar           { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track     { background: var(--background); }
  ::-webkit-scrollbar-thumb     { background: var(--border); border-radius: 2px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--border-strong); }
}


/* ─────────────────────────────────────────────────────────────
   4. UTILITIES LAYER
───────────────────────────────────────────────────────────── */
@layer utilities {

  /* ── Typography helpers ─────────────────────────────────── */
  .font-display   { font-family: var(--theme-font-display); }
  .font-mono-olon { font-family: var(--theme-font-mono); }

  .tracking-label { letter-spacing: var(--theme-tracking-label); }
  .tracking-display { letter-spacing: var(--theme-tracking-display); }

  /* ── Layout ─────────────────────────────────────────────── */
  .container-olon {
    width: 100%;
    max-width: var(--theme-container-max);
    margin-left: auto;
    margin-right: auto;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  .section-anchor {
    scroll-margin-top: calc(var(--theme-header-h) + 24px);
  }

  /* TOCC — required overlay visuals for Studio stage */
  [data-section-id] {
    position: relative;
  }

  [data-jp-section-overlay] {
    position: absolute;
    inset: 0;
    pointer-events: none;
    border: 1px dashed transparent;
    background: transparent;
    z-index: 9999;
    transition: border-color 0.15s ease, background-color 0.15s ease;
  }

  [data-section-id]:hover [data-jp-section-overlay] {
    border-color: color-mix(in srgb, var(--primary-light) 75%, transparent);
    background-color: color-mix(in srgb, var(--primary-900) 12%, transparent);
  }

  [data-section-id][data-jp-selected] [data-jp-section-overlay] {
    border-color: var(--primary-light);
    background-color: color-mix(in srgb, var(--primary-900) 20%, transparent);
  }

  [data-jp-section-overlay] > div {
    position: absolute;
    top: 8px;
    left: 8px;
    font-family: var(--theme-font-mono);
    font-size: var(--theme-text-xs);
    letter-spacing: var(--theme-tracking-label);
    text-transform: uppercase;
    color: var(--primary-light);
    background: color-mix(in srgb, var(--background) 82%, transparent);
    border: 1px solid color-mix(in srgb, var(--primary-light) 50%, transparent);
    border-radius: var(--theme-radius-sm);
    padding: 2px 8px;
    opacity: 0;
    transform: translateY(-2px);
    transition: opacity 0.15s ease, transform 0.15s ease;
  }

  [data-section-id]:hover [data-jp-section-overlay] > div,
  [data-section-id][data-jp-selected] [data-jp-section-overlay] > div {
    opacity: 1;
    transform: translateY(0);
  }

  /* ── DS-specific ────────────────────────────────────────── */
  .ds-divider {
    border: none;
    border-top: 0.5px solid var(--border);
    margin: 0;
  }

  .token-label {
    font-family: var(--theme-font-mono);
    font-size: var(--theme-text-xs);
    color: var(--muted-foreground);
  }

  /* ── DS Sidebar nav link ────────────────────────────────── */
  .nav-link {
    display: block;
    font-size: var(--theme-text-sm);
    color: var(--muted-foreground);
    padding: 5px 12px;
    border-radius: var(--theme-radius-sm);
    transition: color 0.15s, background-color 0.15s;
    cursor: pointer;
    text-decoration: none;
  }
  .nav-link:hover {
    color: var(--foreground);
    background-color: var(--elevated);
  }
  .nav-link.active {
    color: var(--primary-light);
    background-color: var(--elevated);
  }

  /* ── Focus ring ─────────────────────────────────────────── */
  .focus-ring {
    outline: none;
    box-shadow: 0 0 0 2px var(--ring);
  }

  /* ── Inline code ────────────────────────────────────────── */
  .code-inline {
    font-family: var(--theme-font-mono);
    font-size: 0.85em;
    background-color: var(--primary-900);
    color: var(--primary-light);
    padding: 1px 6px;
    border-radius: var(--theme-radius-sm);
  }

  /* ── Surface elevations ─────────────────────────────────── */
  .surface-base     { background-color: var(--background); }
  .surface-card     { background-color: var(--card); }
  .surface-elevated { background-color: var(--elevated); }
  .surface-overlay  { background-color: var(--overlay); }

  /* ── Feedback surfaces ──────────────────────────────────── */
  .surface-destructive {
    background-color: var(--destructive);
    color: var(--destructive-foreground);
    border-color: var(--destructive-border);
  }
  .surface-success {
    background-color: var(--success);
    color: var(--success-foreground);
    border-color: var(--success-border);
  }
  .surface-warning {
    background-color: var(--warning);
    color: var(--warning-foreground);
    border-color: var(--warning-border);
  }
  .surface-info {
    background-color: var(--info);
    color: var(--info-foreground);
    border-color: var(--info-border);
  }

  /* ── Syntax highlight roles (code blocks) ───────────────── */
  .syntax-keyword   { color: var(--primary-400); }
  .syntax-string    { color: var(--primary-200); }
  .syntax-property  { color: var(--accent); }
  .syntax-variable  { color: var(--primary-light); }
  .syntax-comment   { color: var(--muted-foreground); }
  .syntax-value     { color: var(--primary-light); }

  /* Hero image blend overlay */
  .hero-media-overlay {
    background:
      linear-gradient(
        to right,
        color-mix(in srgb, var(--background) 100%, transparent) 0%,
        color-mix(in srgb, var(--background) 82%, transparent) 16%,
        color-mix(in srgb, var(--background) 56%, transparent) 34%,
        color-mix(in srgb, var(--background) 22%, transparent) 54%,
        color-mix(in srgb, var(--background) 6%, transparent) 74%,
        color-mix(in srgb, var(--background) 0%, transparent) 100%
      ),
      linear-gradient(
        to top,
        color-mix(in srgb, var(--background) 24%, transparent) 0%,
        color-mix(in srgb, var(--background) 8%, transparent) 28%,
        color-mix(in srgb, var(--background) 0%, transparent) 56%
      );
  }

  .hero-media-portrait {
    aspect-ratio: 3 / 4;
    min-height: 26rem;
  }

  @media (min-width: 768px) {
    .hero-media-portrait {
      min-height: 34rem;
    }
  }
}


/* ─────────────────────────────────────────────────────────────
   4b. TIPTAP — visitor markdown (.jp-tiptap-content) + Studio ProseMirror
   Typography, color, radius: :root bridge only (theme.json → engine).
───────────────────────────────────────────────────────────── */

.jp-simple-editor .ProseMirror {
  outline: none;
  word-break: break-word;
}

.jp-tiptap-content,
.jp-simple-editor .ProseMirror {
  color: var(--foreground);
  font-family: var(--theme-font-primary);
  font-size: var(--theme-text-md);
  line-height: var(--theme-leading-relaxed);
}

.jp-tiptap-content > * + *,
.jp-simple-editor .ProseMirror > * + * {
  margin-top: 0.75em;
}

.jp-tiptap-content h1,
.jp-simple-editor .ProseMirror h1 {
  font-family: var(--theme-font-display, var(--theme-font-primary));
  font-size: var(--theme-text-4xl);
  font-weight: 700;
  line-height: var(--theme-leading-tight);
  letter-spacing: var(--theme-tracking-display);
  color: var(--foreground);
  margin-top: 1.25em;
  margin-bottom: 0.25em;
}

@media (min-width: 768px) {
  .jp-tiptap-content h1,
  .jp-simple-editor .ProseMirror h1 {
    font-size: var(--theme-text-5xl);
  }
}

.jp-tiptap-content h2,
.jp-simple-editor .ProseMirror h2 {
  font-family: var(--theme-font-display, var(--theme-font-primary));
  font-size: var(--theme-text-3xl);
  font-weight: 700;
  line-height: var(--theme-leading-tight);
  letter-spacing: var(--theme-tracking-tight);
  color: var(--foreground);
  margin-top: 1.25em;
  margin-bottom: 0.25em;
}

.jp-tiptap-content h3,
.jp-simple-editor .ProseMirror h3 {
  font-size: var(--theme-text-2xl);
  font-weight: 600;
  line-height: var(--theme-leading-snug);
  color: var(--foreground);
  margin-top: 1.25em;
  margin-bottom: 0.25em;
}

.jp-tiptap-content h4,
.jp-simple-editor .ProseMirror h4 {
  font-size: var(--theme-text-xl);
  font-weight: 600;
  line-height: var(--theme-leading-snug);
  color: var(--foreground);
  margin-top: 1em;
  margin-bottom: 0.25em;
}

.jp-tiptap-content h5,
.jp-simple-editor .ProseMirror h5 {
  font-size: var(--theme-text-lg);
  font-weight: 600;
  line-height: var(--theme-leading-snug);
  color: var(--foreground);
  margin-top: 1em;
  margin-bottom: 0.25em;
}

.jp-tiptap-content h6,
.jp-simple-editor .ProseMirror h6 {
  font-size: var(--theme-text-md);
  font-weight: 600;
  line-height: var(--theme-leading-normal);
  letter-spacing: var(--theme-tracking-wide);
  color: var(--muted-foreground);
  margin-top: 1em;
  margin-bottom: 0.25em;
}

.jp-tiptap-content p,
.jp-simple-editor .ProseMirror p {
  line-height: var(--theme-leading-relaxed);
}

.jp-tiptap-content strong,
.jp-simple-editor .ProseMirror strong {
  font-weight: 700;
}

.jp-tiptap-content em,
.jp-simple-editor .ProseMirror em {
  font-style: italic;
}

.jp-tiptap-content s,
.jp-simple-editor .ProseMirror s {
  text-decoration: line-through;
}

.jp-tiptap-content a,
.jp-simple-editor .ProseMirror a {
  color: var(--primary);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.jp-tiptap-content a:hover,
.jp-simple-editor .ProseMirror a:hover {
  opacity: 0.88;
}

.jp-tiptap-content code,
.jp-simple-editor .ProseMirror code {
  font-family: var(--theme-font-mono);
  font-size: var(--theme-text-sm);
  background: color-mix(in srgb, var(--foreground) 10%, transparent);
  border-radius: var(--theme-radius-sm);
  padding: 0.1em 0.35em;
}

.jp-tiptap-content pre,
.jp-simple-editor .ProseMirror pre {
  background: var(--elevated);
  border: 1px solid var(--border);
  border-radius: var(--theme-radius-md);
  padding: 1em 1.25em;
  overflow-x: auto;
  font-size: var(--theme-text-sm);
  line-height: var(--theme-leading-relaxed);
}

.jp-tiptap-content pre code,
.jp-simple-editor .ProseMirror pre code {
  background: none;
  padding: 0;
  font-size: inherit;
}

.jp-tiptap-content ul,
.jp-simple-editor .ProseMirror ul {
  list-style-type: disc;
  padding-left: 1.625em;
}

.jp-tiptap-content ol,
.jp-simple-editor .ProseMirror ol {
  list-style-type: decimal;
  padding-left: 1.625em;
}

.jp-tiptap-content li,
.jp-simple-editor .ProseMirror li {
  line-height: var(--theme-leading-relaxed);
  margin-top: 0.25em;
}

.jp-tiptap-content li + li,
.jp-simple-editor .ProseMirror li + li {
  margin-top: 0.25em;
}

.jp-tiptap-content blockquote,
.jp-simple-editor .ProseMirror blockquote {
  border-left: 3px solid var(--border);
  padding-left: 1em;
  color: var(--muted-foreground);
  font-style: italic;
}

.jp-tiptap-content hr,
.jp-simple-editor .ProseMirror hr {
  border: none;
  border-top: 1px solid var(--border);
  margin: 1.5em 0;
}

.jp-tiptap-content img,
.jp-simple-editor .ProseMirror img {
  max-width: 100%;
  height: auto;
  border-radius: var(--theme-radius-md);
}

.jp-simple-editor .ProseMirror img[data-uploading="true"] {
  opacity: 0.6;
  filter: grayscale(0.25);
  outline: 2px dashed color-mix(in srgb, var(--primary) 70%, transparent);
  outline-offset: 2px;
}

.jp-simple-editor .ProseMirror img[data-upload-error="true"] {
  outline: 2px solid color-mix(in srgb, var(--destructive) 85%, transparent);
  outline-offset: 2px;
}

.jp-simple-editor .ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  color: var(--muted-foreground);
  opacity: 0.5;
  pointer-events: none;
  float: left;
  height: 0;
}

/* Tiptap docs — scrollable TOC rail */
.jp-docs-toc-scroll {
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
}

.jp-docs-toc-scroll::-webkit-scrollbar {
  width: 6px;
}

.jp-docs-toc-scroll::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: var(--theme-radius-sm);
}

.jp-docs-toc-scroll::-webkit-scrollbar-thumb:hover {
  background: var(--border-strong);
}


/* ─────────────────────────────────────────────────────────────
   5. CLOUD-AI-NATIVE-GRID — ported from platform-frontend
   Classes used by cloud-ai-native-grid component.
───────────────────────────────────────────────────────────── */
.animate-fadeInUp {
  animation: fadeInUp 0.6s ease forwards;
}

.card-hover:hover {
  transform: translateY(-2px);
}

.jp-feature-card {
  border-radius: 1rem;
  border-width: 1px;
  border-style: solid;
  transition: all 0.2s;
  background-color: var(--card);
  border-color: var(--border);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


/* ─────────────────────────────────────────────────────────────
   6. LIGHT MODE
   Applied when <html data-theme="light">.
   Overrides the bridge vars directly.
   SOT future: move to theme.json when engine supports modes.
───────────────────────────────────────────────────────────── */
[data-theme="light"] {

  /* Backgrounds — warm whites */
  --background:                 var(--theme-modes-light-colors-background);
  --card:                       var(--theme-modes-light-colors-card);
  --elevated:                   var(--theme-modes-light-colors-elevated);
  --overlay:                    var(--theme-modes-light-colors-overlay);
  --popover:                    var(--theme-modes-light-colors-popover);
  --popover-foreground:         var(--theme-modes-light-colors-popover-foreground);

  /* Foregrounds */
  --foreground:                 var(--theme-modes-light-colors-foreground);
  --card-foreground:            var(--theme-modes-light-colors-card-foreground);
  --muted-foreground:           var(--theme-modes-light-colors-muted-foreground);
  --placeholder:                var(--theme-modes-light-colors-placeholder);

  /* Brand — Labradorite (same hues, adjusted for light bg) */
  --primary:                    var(--theme-modes-light-colors-primary);
  --primary-foreground:         var(--theme-modes-light-colors-primary-foreground);
  --primary-light:              var(--theme-modes-light-colors-primary-light);
  --primary-dark:               var(--theme-modes-light-colors-primary-dark);
  --primary-50:                 var(--theme-modes-light-colors-primary-50);
  --primary-100:                var(--theme-modes-light-colors-primary-100);
  --primary-200:                var(--theme-modes-light-colors-primary-200);
  --primary-300:                var(--theme-modes-light-colors-primary-300);
  --primary-400:                var(--theme-modes-light-colors-primary-400);
  --primary-500:                var(--theme-modes-light-colors-primary-500);
  --primary-600:                var(--theme-modes-light-colors-primary-600);
  --primary-700:                var(--theme-modes-light-colors-primary-700);
  --primary-800:                var(--theme-modes-light-colors-primary-800);
  --primary-900:                var(--theme-modes-light-colors-primary-900);

  /* Accent — Parchment darker for light bg contrast */
  --accent:                     var(--theme-modes-light-colors-accent);
  --accent-foreground:          var(--theme-modes-light-colors-accent-foreground);

  /* Secondary */
  --secondary:                  var(--theme-modes-light-colors-secondary);
  --secondary-foreground:       var(--theme-modes-light-colors-secondary-foreground);

  /* Muted */
  --muted:                      var(--theme-modes-light-colors-muted);

  /* Border */
  --border:                     var(--theme-modes-light-colors-border);
  --border-strong:              var(--theme-modes-light-colors-border-strong);

  /* Form */
  --input:                      var(--theme-modes-light-colors-input);
  --ring:                       var(--theme-modes-light-colors-ring);

  /* Feedback */
  --destructive:                var(--theme-modes-light-colors-destructive);
  --destructive-foreground:     var(--theme-modes-light-colors-destructive-foreground);
  --destructive-border:         var(--theme-modes-light-colors-destructive-border);
  --destructive-ring:           var(--theme-modes-light-colors-destructive-ring);
  --success:                    var(--theme-modes-light-colors-success);
  --success-foreground:         var(--theme-modes-light-colors-success-foreground);
  --success-border:             var(--theme-modes-light-colors-success-border);
  --success-indicator:          var(--theme-modes-light-colors-success-indicator);
  --warning:                    var(--theme-modes-light-colors-warning);
  --warning-foreground:         var(--theme-modes-light-colors-warning-foreground);
  --warning-border:             var(--theme-modes-light-colors-warning-border);
  --info:                       var(--theme-modes-light-colors-info);
  --info-foreground:            var(--theme-modes-light-colors-info-foreground);
  --info-border:                var(--theme-modes-light-colors-info-border);
}

END_OF_FILE_CONTENT
mkdir -p "src/lib"
echo "Creating src/lib/ComponentRegistry.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/lib/ComponentRegistry.tsx"
import type { SectionType } from '@/types';
import type { SectionComponentPropsMap } from '@/types';
import { Header }           from '@/components/header';
import { Footer }           from '@/components/footer';
import { Hero }             from '@/components/hero';
import { FeatureGrid }      from '@/components/feature-grid';
import { Contact }          from '@/components/contact';
import { Login }            from '@/components/login';
import { DesignSystemView }       from '@/components/design-system';
import { CloudAiNativeGridView } from '@/components/cloud-ai-native-grid';
import { PageHero }             from '@/components/page-hero';
import { Tiptap }           from '@/components/tiptap';

export const ComponentRegistry: {
  [K in SectionType]: React.FC<SectionComponentPropsMap[K]>;
} = {
  'header':                Header               as React.FC<SectionComponentPropsMap['header']>,
  'footer':                Footer               as React.FC<SectionComponentPropsMap['footer']>,
  'hero':                  Hero                 as React.FC<SectionComponentPropsMap['hero']>,
  'feature-grid':          FeatureGrid          as React.FC<SectionComponentPropsMap['feature-grid']>,
  'contact':               Contact              as React.FC<SectionComponentPropsMap['contact']>,
  'login':                 Login                as React.FC<SectionComponentPropsMap['login']>,
  'design-system':         DesignSystemView     as React.FC<SectionComponentPropsMap['design-system']>,
  'cloud-ai-native-grid':  CloudAiNativeGridView as React.FC<SectionComponentPropsMap['cloud-ai-native-grid']>,
  'page-hero':             PageHero             as React.FC<SectionComponentPropsMap['page-hero']>,
  'tiptap':                Tiptap               as React.FC<SectionComponentPropsMap['tiptap']>,
};

END_OF_FILE_CONTENT
echo "Creating src/lib/IconResolver.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/lib/IconResolver.tsx"
import React from 'react';
import {
  Layers,
  Github,
  ArrowRight,
  Box,
  Terminal,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  Zap,
  type LucideIcon
} from 'lucide-react';

const iconMap = {
  'layers': Layers,
  'github': Github,
  'arrow-right': ArrowRight,
  'box': Box,
  'terminal': Terminal,
  'chevron-right': ChevronRight,
  'menu': Menu,
  'x': X,
  'sparkles': Sparkles,
  'zap': Zap,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof iconMap;

export function isIconName(s: string): s is IconName {
  return s in iconMap;
}

interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, size = 20, className }) => {
  const IconComponent = isIconName(name) ? iconMap[name] : undefined;

  if (!IconComponent) {
    if (import.meta.env.DEV) {
      console.warn(`[IconResolver] Unknown icon: "${name}". Add it to iconMap.`);
    }
    return null;
  }

  return <IconComponent size={size} className={className} />;
};



END_OF_FILE_CONTENT
echo "Creating src/lib/addSectionConfig.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/lib/addSectionConfig.ts"
import type { AddSectionConfig } from '@olonjs/core';

const addableSectionTypes = [
  'hero', 'feature-grid', 'problem-statement',
  'cta-banner', 'git-section', 'devex', 'tiptap',
] as const;

const sectionTypeLabels: Record<string, string> = {
  'hero':              'Hero',
  'feature-grid':      'Feature Grid',
  'problem-statement': 'Problem Statement',
  'cta-banner':        'CTA Banner',
  'git-section':       'Git Versioning',
  'devex':             'Developer Experience',
  'tiptap':            'Tiptap Editorial',
};

function getDefaultSectionData(type: string): Record<string, unknown> {
  switch (type) {
    case 'hero':              return { title: 'New Hero', description: '' };
    case 'feature-grid':      return { sectionTitle: 'Features', cards: [] };
    case 'problem-statement': return { problemTag: 'Problem', problemTitle: '', problemItems: [], solutionTag: 'Solution', solutionTitle: '', solutionItems: [] };
    case 'cta-banner':        return { title: 'Call to Action', description: '', cliCommand: '' };
    case 'git-section':       return { title: 'Your content is code.', cards: [] };
    case 'devex':             return { title: 'Developer Experience', description: '', features: [] };
    case 'tiptap':            return { content: '# Post title\n\nStart writing in Markdown...' };
    default:                  return {};
  }
}

export const addSectionConfig: AddSectionConfig = {
  addableSectionTypes: [...addableSectionTypes],
  sectionTypeLabels,
  getDefaultSectionData,
};

END_OF_FILE_CONTENT
echo "Creating src/lib/base-schemas.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/lib/base-schemas.ts"
import { z } from 'zod';

/**
 * Image picker field: object { url, alt? } with ui:image-picker for Form Factory.
 * Use in section data and resolve with resolveAssetUrl(url, tenantId) in View.
 */
export const ImageSelectionSchema = z
  .object({
    url: z.string(),
    alt: z.string().optional(),
  }) 
  .describe('ui:image-picker');

/**
 * Base schemas shared by section capsules (CIP governance).
 * Capsules extend these for consistent anchorId, array items, and settings.
 */
export const BaseSectionData = z.object({
  anchorId: z.string().optional().describe('ui:text'),
});

export const BaseArrayItem = z.object({
  id: z.string().optional(),
});

export const BaseSectionSettingsSchema = z.object({
  paddingTop: z.enum(['none', 'sm', 'md', 'lg', 'xl', '2xl']).default('md').describe('ui:select'),
  paddingBottom: z.enum(['none', 'sm', 'md', 'lg', 'xl', '2xl']).default('md').describe('ui:select'),
  theme: z.enum(['dark', 'light', 'accent']).default('dark').describe('ui:select'),
  container: z.enum(['boxed', 'fluid']).default('boxed').describe('ui:select'),
});

export const CtaSchema = z.object({
  id: z.string().optional(),
  label: z.string().describe('ui:text'),
  href: z.string().describe('ui:text'),
  variant: z.enum(['primary', 'secondary', 'accent']).default('primary').describe('ui:select'),
});

END_OF_FILE_CONTENT
echo "Creating src/lib/cloudSaveStream.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/lib/cloudSaveStream.ts"
import type { StepId } from '@/types/deploy';

interface SaveStreamStepEvent {
  id: StepId;
  status: 'running' | 'done';
  label?: string;
}

interface SaveStreamLogEvent {
  stepId: StepId;
  message: string;
}

interface SaveStreamDoneEvent {
  deployUrl?: string;
  commitSha?: string;
}

interface SaveStreamErrorEvent {
  message?: string;
}

interface StartCloudSaveStreamInput {
  apiBaseUrl: string;
  apiKey: string;
  path: string;
  content: unknown;
  message?: string;
  signal?: AbortSignal;
  onStep: (event: SaveStreamStepEvent) => void;
  onLog?: (event: SaveStreamLogEvent) => void;
  onDone: (event: SaveStreamDoneEvent) => void;
}

function parseSseEventBlock(rawBlock: string): { event: string; data: string } | null {
  const lines = rawBlock
    .split('\n')
    .map((line) => line.trimEnd())
    .filter((line) => line.length > 0);

  if (lines.length === 0) return null;

  let eventName = 'message';
  const dataLines: string[] = [];
  for (const line of lines) {
    if (line.startsWith('event:')) {
      eventName = line.slice(6).trim();
      continue;
    }
    if (line.startsWith('data:')) {
      dataLines.push(line.slice(5).trim());
    }
  }
  return { event: eventName, data: dataLines.join('\n') };
}

export async function startCloudSaveStream(input: StartCloudSaveStreamInput): Promise<void> {
  const response = await fetch(`${input.apiBaseUrl}/save-stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${input.apiKey}`,
    },
    body: JSON.stringify({
      path: input.path,
      content: input.content,
      message: input.message,
    }),
    signal: input.signal,
  });

  if (!response.ok || !response.body) {
    const body = (await response.json().catch(() => ({}))) as SaveStreamErrorEvent;
    throw new Error(body.message ?? `Cloud save stream failed: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let receivedDone = false;

  while (true) {
    const { value, done } = await reader.read();
    if (!done) {
      buffer += decoder.decode(value, { stream: true });
    } else {
      buffer += decoder.decode();
    }

    const chunks = buffer.split('\n\n');
    buffer = done ? '' : (chunks.pop() ?? '');

    for (const chunk of chunks) {
      const parsed = parseSseEventBlock(chunk);
      if (!parsed) continue;
      if (!parsed.data) continue;

      if (parsed.event === 'step') {
        const payload = JSON.parse(parsed.data) as SaveStreamStepEvent;
        input.onStep(payload);
      } else if (parsed.event === 'log') {
        const payload = JSON.parse(parsed.data) as SaveStreamLogEvent;
        input.onLog?.(payload);
      } else if (parsed.event === 'error') {
        const payload = JSON.parse(parsed.data) as SaveStreamErrorEvent;
        throw new Error(payload.message ?? 'Cloud save failed.');
      } else if (parsed.event === 'done') {
        const payload = JSON.parse(parsed.data) as SaveStreamDoneEvent;
        input.onDone(payload);
        receivedDone = true;
      }
    }

    if (done) break;
  }

  if (!receivedDone) {
    throw new Error('Cloud save stream ended before completion.');
  }
}


END_OF_FILE_CONTENT
echo "Creating src/lib/deploySteps.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/lib/deploySteps.ts"
import type { DeployStep } from '@/types/deploy';

export const DEPLOY_STEPS: readonly DeployStep[] = [
  {
    id: 'commit',
    label: 'Commit',
    verb: 'Committing',
    poem: ['Crystallizing your edit', 'into permanent history.'],
    color: '#60a5fa',
    glyph: '◈',
    duration: 2200,
  },
  {
    id: 'push',
    label: 'Push',
    verb: 'Pushing',
    poem: ['Sending your vision', 'across the wire.'],
    color: '#a78bfa',
    glyph: '◎',
    duration: 2800,
  },
  {
    id: 'build',
    label: 'Build',
    verb: 'Building',
    poem: ['Assembling the pieces,', 'brick by digital brick.'],
    color: '#f59e0b',
    glyph: '⬡',
    duration: 7500,
  },
  {
    id: 'live',
    label: 'Live',
    verb: 'Going live',
    poem: ['Your content', 'is now breathing.'],
    color: '#34d399',
    glyph: '✦',
    duration: 1600,
  },
] as const;


END_OF_FILE_CONTENT
echo "Creating src/lib/draftStorage.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/lib/draftStorage.ts"
/**
 * Tenant initial data — file-backed only (no localStorage).
 */

import type { PageConfig, SiteConfig } from '@/types';

export interface HydratedData {
  pages: Record<string, PageConfig>;
  siteConfig: SiteConfig;
}

/**
 * Return pages and siteConfig from file-backed data only.
 */
export function getHydratedData(
  _tenantId: string,
  filePages: Record<string, PageConfig>,
  fileSiteConfig: SiteConfig
): HydratedData {
  return {
    pages: { ...filePages },
    siteConfig: fileSiteConfig,
  };
}

END_OF_FILE_CONTENT
echo "Creating src/lib/getFilePages.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/lib/getFilePages.ts"
/**
 * Page registry loaded from nested JSON files under src/data/pages.
 * Add a JSON file in that directory tree to register a page; no manual list in App.tsx.
 */
import type { PageConfig } from '@/types';

function slugFromPath(filePath: string): string {
  const normalizedPath = filePath.replace(/\\/g, '/');
  const match = normalizedPath.match(/\/data\/pages\/(.+)\.json$/i);
  const rawSlug = match?.[1] ?? normalizedPath.split('/').pop()?.replace(/\.json$/i, '') ?? '';
  const canonical = rawSlug
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean)
    .join('/');
  return canonical || 'home';
}

export function getFilePages(): Record<string, PageConfig> {
  const glob = import.meta.glob<{ default: unknown }>('@/data/pages/**/*.json', { eager: true });
  const bySlug = new Map<string, PageConfig>();
  const entries = Object.entries(glob).sort(([a], [b]) => a.localeCompare(b));
  for (const [path, mod] of entries) {
    const slug = slugFromPath(path);
    const raw = mod?.default;
    if (raw == null || typeof raw !== 'object') {
      console.warn(`[tenant-alpha:getFilePages] Ignoring invalid page module at "${path}".`);
      continue;
    }
    if (bySlug.has(slug)) {
      console.warn(`[tenant-alpha:getFilePages] Duplicate slug "${slug}" at "${path}". Keeping latest match.`);
    }
    bySlug.set(slug, raw as PageConfig);
  }
  const slugs = Array.from(bySlug.keys()).sort((a, b) =>
    a === 'home' ? -1 : b === 'home' ? 1 : a.localeCompare(b)
  );
  const record: Record<string, PageConfig> = {};
  for (const slug of slugs) {
    const config = bySlug.get(slug);
    if (config) record[slug] = config;
  }
  return record;
}

END_OF_FILE_CONTENT
echo "Creating src/lib/schemas.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/lib/schemas.ts"
import { HeaderSchema }        from '@/components/header';
import { FooterSchema }        from '@/components/footer';
import { HeroSchema }          from '@/components/hero';
import { FeatureGridSchema }   from '@/components/feature-grid';
import { ContactSchema }       from '@/components/contact';
import { LoginSchema }         from '@/components/login';
import { DesignSystemSchema }         from '@/components/design-system';
import { CloudAiNativeGridSchema }    from '@/components/cloud-ai-native-grid';
import { PageHeroSchema }             from '@/components/page-hero';
import { TiptapSchema }           from '@/components/tiptap';

export const SECTION_SCHEMAS = {
  'header':                HeaderSchema,
  'footer':                FooterSchema,
  'hero':                  HeroSchema,
  'feature-grid':          FeatureGridSchema,
  'contact':               ContactSchema,
  'login':                 LoginSchema,
  'design-system':         DesignSystemSchema,
  'cloud-ai-native-grid':  CloudAiNativeGridSchema,
  'page-hero':             PageHeroSchema,
  'tiptap':            TiptapSchema,
} as const;

export type SectionType = keyof typeof SECTION_SCHEMAS;

export {
  BaseSectionData,
  BaseArrayItem,
  BaseSectionSettingsSchema,
  CtaSchema,
  ImageSelectionSchema,
} from '@/lib/base-schemas';

END_OF_FILE_CONTENT
echo "Creating src/lib/useFormSubmit.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/lib/useFormSubmit.ts"
import { useState, useCallback } from 'react';

export type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

interface UseFormSubmitOptions {
  source: string;
  tenantId: string;
}

export function useFormSubmit({ source, tenantId }: UseFormSubmitOptions) {
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [message, setMessage] = useState<string>('');

  const submit = useCallback(async (
    formData: FormData, 
    recipientEmail: string, 
    pageSlug: string, 
    sectionId: string
  ) => {
    const cloudApiUrl = import.meta.env.VITE_JSONPAGES_CLOUD_URL as string | undefined;
    const cloudApiKey = import.meta.env.VITE_JSONPAGES_API_KEY as string | undefined;

    if (!cloudApiUrl || !cloudApiKey) {
      setStatus('error');
      setMessage('Configurazione API non disponibile. Riprova tra poco.');
      return false;
    }

    // Trasformiamo FormData in un oggetto piatto per il payload JSON
    const data: Record<string, any> = {};
    formData.forEach((value, key) => {
      data[key] = String(value).trim();
    });

    const payload = {
      ...data,
      recipientEmail,
      page: pageSlug,
      section: sectionId,
      tenant: tenantId,
      source: source,
      submittedAt: new Date().toISOString(),
    };

    // Idempotency Key per evitare doppi invii accidentali
    const idempotencyKey = `form-${sectionId}-${Date.now()}`;

    setStatus('submitting');
    setMessage('Invio in corso...');

    try {
      const apiBase = cloudApiUrl.replace(/\/$/, '');
      const response = await fetch(`${apiBase}/forms/submit`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${cloudApiKey}`,
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify(payload),
      });

      const body = (await response.json().catch(() => ({}))) as { error?: string; code?: string };

      if (!response.ok) {
        throw new Error(body.error || body.code || `Submit failed (${response.status})`);
      }

      setStatus('success');
      setMessage('Richiesta inviata con successo. Ti risponderemo al più presto.');
      return true;
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : 'Invio non riuscito. Riprova tra poco.';
      setStatus('error');
      setMessage(errorMsg);
      return false;
    }
  }, [source, tenantId]);

  const reset = useCallback(() => {
    setStatus('idle');
    setMessage('');
  }, []);

  return { submit, status, message, reset };
}
END_OF_FILE_CONTENT
echo "Creating src/lib/utils.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/lib/utils.ts"
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

END_OF_FILE_CONTENT
echo "Creating src/main.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/main.tsx"
import '@/types'; // TBP: load type augmentation from capsule-driven types
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// ... resto del file

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);




END_OF_FILE_CONTENT
# SKIP: src/registry-types.ts is binary and cannot be embedded as text.
mkdir -p "src/server"
mkdir -p "src/types"
echo "Creating src/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/types.ts"
import type { MenuItem } from '@olonjs/core';
import type { HeaderData,        HeaderSettings        } from '@/components/header';
import type { FooterData,        FooterSettings        } from '@/components/footer';
import type { HeroData,          HeroSettings          } from '@/components/hero';
import type { FeatureGridData,   FeatureGridSettings   } from '@/components/feature-grid';
import type { ContactData,       ContactSettings       } from '@/components/contact';
import type { LoginData,         LoginSettings         } from '@/components/login';
import type { DesignSystemData,        DesignSystemSettings        } from '@/components/design-system';
import type { CloudAiNativeGridData,   CloudAiNativeGridSettings   } from '@/components/cloud-ai-native-grid';
import type { PageHeroData,            PageHeroSettings            } from '@/components/page-hero';
import type { TiptapData,              TiptapSettings              } from '@/components/tiptap';

export type SectionComponentPropsMap = {
  'header':                { data: HeaderData;              settings?: HeaderSettings;              menu: MenuItem[] };
  'footer':                { data: FooterData;              settings?: FooterSettings               };
  'hero':                  { data: HeroData;                settings?: HeroSettings                 };
  'feature-grid':          { data: FeatureGridData;         settings?: FeatureGridSettings          };
  'contact':               { data: ContactData;             settings?: ContactSettings              };
  'login':                 { data: LoginData;               settings?: LoginSettings                };
  'design-system':         { data: DesignSystemData;        settings?: DesignSystemSettings         };
  'cloud-ai-native-grid':  { data: CloudAiNativeGridData;   settings?: CloudAiNativeGridSettings    };
  'page-hero':             { data: PageHeroData;            settings?: PageHeroSettings             };
  'tiptap':                { data: TiptapData;               settings?: TiptapSettings                };
};

declare module '@olonjs/core' {
  export interface SectionDataRegistry {
    'header':                HeaderData;
    'footer':                FooterData;
    'hero':                  HeroData;
    'feature-grid':          FeatureGridData;
    'contact':               ContactData;
    'login':                 LoginData;
    'design-system':         DesignSystemData;
    'cloud-ai-native-grid':  CloudAiNativeGridData;
    'page-hero':             PageHeroData;
    'tiptap':                TiptapData;
  }
  export interface SectionSettingsRegistry {
    'header':                HeaderSettings;
    'footer':                FooterSettings;
    'hero':                  HeroSettings;
    'feature-grid':          FeatureGridSettings;
    'contact':               ContactSettings;
    'login':                 LoginSettings;
    'design-system':         DesignSystemSettings;
    'cloud-ai-native-grid':  CloudAiNativeGridSettings;
    'page-hero':             PageHeroSettings;
    'tiptap':                TiptapSettings;
  }
}

export * from '@olonjs/core';

END_OF_FILE_CONTENT
echo "Creating src/types/deploy.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/types/deploy.ts"
export type StepId = 'commit' | 'push' | 'build' | 'live';

export type StepState = 'pending' | 'active' | 'done';

export type DeployPhase = 'idle' | 'running' | 'done' | 'error';

export interface DeployStep {
  id: StepId;
  label: string;
  verb: string;
  poem: [string, string];
  color: string;
  glyph: string;
  duration: number;
}


END_OF_FILE_CONTENT
echo "Creating src/vite-env.d.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/vite-env.d.ts"
/// <reference types="vite/client" />

declare module '*?inline' {
  const content: string;
  export default content;
}



END_OF_FILE_CONTENT
echo "Creating tsconfig.json..."
cat << 'END_OF_FILE_CONTENT' > "tsconfig.json"
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@olonjs/core": ["../../packages/core/src/index.ts"]
    }
  },
  "include": ["src"],
  "exclude": ["src/emails"],
  "references": [{ "path": "./tsconfig.node.json" }]
}

END_OF_FILE_CONTENT
echo "Creating tsconfig.node.json..."
cat << 'END_OF_FILE_CONTENT' > "tsconfig.node.json"
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}




END_OF_FILE_CONTENT
echo "Creating vercel.json..."
cat << 'END_OF_FILE_CONTENT' > "vercel.json"
{
    "rewrites":  [
                     {
                         "source":  "/:pagePath*.json",
                         "destination":  "/pages/:pagePath*.json"
                     },
                     {
                         "source":  "/(.*)",
                         "destination":  "/index.html"
                     }
                 ],
    "headers":  [
                    {
                        "source":  "/assets/(.*)",
                        "headers":  [
                                        {
                                            "key":  "Cache-Control",
                                            "value":  "public, max-age=31536000, immutable"
                                        }
                                    ]
                    }
                ]
}

END_OF_FILE_CONTENT
echo "Creating vite.config.ts..."
cat << 'END_OF_FILE_CONTENT' > "vite.config.ts"
/**
 * Generated by @jsonpages/cli. Dev server API: /api/save-to-file, /api/upload-asset, /api/list-assets.
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ASSETS_IMAGES_DIR = path.resolve(__dirname, 'public', 'assets', 'images');
const DATA_CONFIG_DIR = path.resolve(__dirname, 'src', 'data', 'config');
const DATA_PAGES_DIR = path.resolve(__dirname, 'src', 'data', 'pages');
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif']);
const IMAGE_MIMES = new Set([
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif',
]);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

function safeFilename(original, mimeType) {
  const base = (original.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '_').slice(0, 128)) || 'image';
  const ext = original.includes('.') ? path.extname(original).toLowerCase() : (mimeType?.startsWith('image/') ? `.${(mimeType.split('/')[1] || 'png').replace('jpeg', 'jpg')}` : '.png');
  return `${Date.now()}-${base}${IMAGE_EXT.has(ext) ? ext : '.png'}`;
}

function listImagesInDir(dir, urlPrefix) {
  const list = [];
  if (!fs.existsSync(dir)) return list;
  for (const name of fs.readdirSync(dir)) {
    if (IMAGE_EXT.has(path.extname(name).toLowerCase())) list.push({ id: name, url: `${urlPrefix}/${name}`, alt: name, tags: [] });
  }
  return list;
}

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function sendJsonFile(res, filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(content);
  } catch (e) {
    sendJson(res, 500, { error: e?.message || 'Read failed' });
  }
}

function isTenantPageJsonRequest(req, pathname) {
  if (req.method !== 'GET' || !pathname.endsWith('.json')) return false;
  const viteOrStaticPrefixes = ['/api/', '/assets/', '/src/', '/node_modules/', '/public/', '/@'];
  return !viteOrStaticPrefixes.some((prefix) => pathname.startsWith(prefix));
}
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'upload-asset-api',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const pathname = (req.url || '').split('?')[0];
          const isPageJsonRequest = isTenantPageJsonRequest(req, pathname);

          if (isPageJsonRequest) {
            const normalizedPath = decodeURIComponent(pathname).replace(/\\/g, '/');
            const slug = normalizedPath.replace(/^\/+/, '').replace(/\.json$/i, '').replace(/^\/+|\/+$/g, '');
            const candidate = path.resolve(DATA_PAGES_DIR, `${slug}.json`);
            const isInsidePagesDir = candidate.startsWith(`${DATA_PAGES_DIR}${path.sep}`) || candidate === DATA_PAGES_DIR;
            if (!slug || !isInsidePagesDir || !fs.existsSync(candidate) || !fs.statSync(candidate).isFile()) {
              sendJson(res, 404, { error: 'Page JSON not found' });
              return;
            }
            sendJsonFile(res, candidate);
            return;
          }
          if (req.method === 'GET' && req.url === '/api/list-assets') {
            try { sendJson(res, 200, listImagesInDir(ASSETS_IMAGES_DIR, '/assets/images')); } catch (e) { sendJson(res, 500, { error: e?.message || 'List failed' }); }
            return;
          }
          if (req.method === 'POST' && pathname === '/api/save-to-file') {
            const chunks = [];
            req.on('data', (chunk) => chunks.push(chunk));
            req.on('end', () => {
              try {
                const raw = Buffer.concat(chunks).toString('utf8');
                if (!raw.trim()) { sendJson(res, 400, { error: 'Empty body' }); return; }
                const body = JSON.parse(raw);
                const { projectState, slug } = body;
                if (!projectState || typeof slug !== 'string') { sendJson(res, 400, { error: 'Missing projectState or slug' }); return; }
                if (!fs.existsSync(DATA_CONFIG_DIR)) fs.mkdirSync(DATA_CONFIG_DIR, { recursive: true });
                if (!fs.existsSync(DATA_PAGES_DIR)) fs.mkdirSync(DATA_PAGES_DIR, { recursive: true });
                if (projectState.site != null) fs.writeFileSync(path.join(DATA_CONFIG_DIR, 'site.json'), JSON.stringify(projectState.site, null, 2), 'utf8');
                if (projectState.theme != null) fs.writeFileSync(path.join(DATA_CONFIG_DIR, 'theme.json'), JSON.stringify(projectState.theme, null, 2), 'utf8');
                if (projectState.menu != null) fs.writeFileSync(path.join(DATA_CONFIG_DIR, 'menu.json'), JSON.stringify(projectState.menu, null, 2), 'utf8');
                if (projectState.page != null) {
                  const safeSlug = (slug.replace(/[^a-zA-Z0-9-_]/g, '_') || 'page');
                  fs.writeFileSync(path.join(DATA_PAGES_DIR, `${safeSlug}.json`), JSON.stringify(projectState.page, null, 2), 'utf8');
                }
                sendJson(res, 200, { ok: true });
              } catch (e) { sendJson(res, 500, { error: e?.message || 'Save to file failed' }); }
            });
            req.on('error', () => sendJson(res, 500, { error: 'Request error' }));
            return;
          }
          if (req.method !== 'POST' || req.url !== '/api/upload-asset') return next();
          const chunks = [];
          req.on('data', (chunk) => chunks.push(chunk));
          req.on('end', () => {
            try {
              const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
              const { filename, mimeType, data } = body;
              if (!filename || typeof data !== 'string') { sendJson(res, 400, { error: 'Missing filename or data' }); return; }
              const buf = Buffer.from(data, 'base64');
              if (buf.length > MAX_FILE_SIZE_BYTES) { sendJson(res, 413, { error: 'File too large. Max 5MB.' }); return; }
              if (mimeType && !IMAGE_MIMES.has(mimeType)) { sendJson(res, 400, { error: 'Invalid file type' }); return; }
              const name = safeFilename(filename, mimeType);
              if (!fs.existsSync(ASSETS_IMAGES_DIR)) fs.mkdirSync(ASSETS_IMAGES_DIR, { recursive: true });
              fs.writeFileSync(path.join(ASSETS_IMAGES_DIR, name), buf);
              sendJson(res, 200, { url: `/assets/images/${name}` });
            } catch (e) { sendJson(res, 500, { error: e?.message || 'Upload failed' }); }
          });
          req.on('error', () => sendJson(res, 500, { error: 'Request error' }));
        });
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'next/link': path.resolve(__dirname, './src/shims/next-link.tsx'),
    },
  },
});





END_OF_FILE_CONTENT
