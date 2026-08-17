# PrivPDF Landing Page

Build ONLY the PrivPDF landing/home page.

IMPORTANT:

Do NOT build the PDF processing functionality yet.

Do NOT build Merge/Split/Compress logic yet.

Do NOT add AI Resume.

Do NOT add Supabase/Auth.

Do NOT add fake working features.

For this stage, I only want a polished, production-quality HOME PAGE and the reusable visual/navigation foundation for the future PrivPDF application.

==================================================

PRODUCT

==================================================

Brand: PrivPDF

Concept:

A privacy-first PDF utility platform where PDF tools will eventually process files locally in the browser.

Core brand message:

"Your PDFs. Your device. Your privacy."

Secondary message:

"Simple PDF tools without unnecessary uploads, sign-ups, watermarks, or limits."

The website must feel like a serious premium productivity product.

It must NOT look AI-generated.

==================================================

VERY IMPORTANT — DESIGN DIRECTION

==================================================

DO NOT use:

- blue/purple gradients

- purple/blue AI SaaS styling

- neon colors

- rainbow gradients

- excessive glassmorphism

- excessive glowing effects

- random colorful cards

- generic AI dashboard design

- childish illustrations

- excessive rounded rectangles

- huge meaningless text

- template-like SaaS sections

PrivPDF must have a distinctive professional identity.

The established brand direction is:

- light green primary brand identity

- sophisticated

- premium

- clean

- minimal

- trustworthy

- modern

- privacy-focused

- excellent spacing

- strong typography

- subtle depth

- restrained visual effects

DO NOT invent a different color palette.

If existing PrivPDF brand colors/design tokens already exist in the project, KEEP THEM EXACTLY.

Do not replace them.

Create centralized CSS/design tokens so the colors can be changed from one place later.

==================================================

PAGE STRUCTURE

==================================================

Create this exact structure:

1. HEADER / NAVBAR

2. HERO SECTION

3. TRUST / PRIVACY STATEMENT

4. PDF TOOLS PREVIEW SECTION

5. WHY PRIVPDF SECTION

6. HOW IT WORKS SECTION

7. PRIVACY / SECURITY SECTION

8. FINAL CTA

9. FOOTER

==================================================

1. HEADER / NAVBAR

==================================================

Desktop navbar:

Left:

PrivPDF logo/wordmark

Center/right navigation:

Tools

How It Works

Privacy

About

Primary button:

"Explore Tools"

The navigation should be clean and compact.

Do not overcrowd it.

Mobile:

PrivPDF logo

Menu button

Opening the mobile menu should show:

Tools

How It Works

Privacy

About

The mobile navigation must actually work.

No broken menu.

No horizontal overflow.

==================================================

2. HERO SECTION

==================================================

The hero is the most important section.

Headline:

"PDF tools that respect your privacy."

Subheadline:

"Merge, split, compress and organize PDFs directly in your browser. No unnecessary uploads. No signup required."

Primary CTA:

"Explore PDF Tools"

Secondary CTA:

"How It Works"

Include a subtle visual showing the concept of local PDF processing.

Do NOT use a generic AI robot.

Do NOT use random 3D illustrations.

The visual should communicate:

PDF

→

Browser

→

Your Device

Keep it elegant and minimal.

A small privacy badge can say:

"Processed locally in your browser"

ONLY use this statement as a product promise for tools that will actually be implemented client-side.

==================================================

3. TRUST / PRIVACY STATEMENT

==================================================

Create a compact section directly below the hero.

Show 3–4 concise trust points:

"Local-first processing"

"No signup for core tools"

"No watermark"

"Privacy by design"

Use simple professional icons.

Do not overdesign this section.

==================================================

4. PDF TOOLS PREVIEW

==================================================

Create a section titled:

"Everything you need for everyday PDFs."

Subtitle:

"Simple tools for the tasks you actually need."

Display tool cards for:

Merge PDF

Split PDF

Compress PDF

Organize PDF

Rotate PDF

Image to PDF

PDF to Image

Sign PDF

IMPORTANT:

These are currently PREVIEW cards.

They do not need working PDF functionality yet.

However, structure the routing so these cards can later link to:

/merge-pdf

/split-pdf

/compress-pdf

/organize-pdf

/rotate-pdf

/image-to-pdf

/pdf-to-image

/sign-pdf

Do not create fake functionality.

If the routes do not exist yet, make the buttons visually indicate that these are upcoming tools OR create placeholder routes with a clear "Coming soon" state.

Do not pretend the tools work.

==================================================

5. WHY PRIVPDF

==================================================

Section heading:

"Why PrivPDF?"

Create 4 clean benefits:

Privacy First

"Your files stay under your control."

No Unnecessary Signup

"Open a tool and get to work."

No Watermarks

"Your documents remain yours."

Built for Simplicity

"Useful PDF tools without the clutter."

Use professional icons.

No giant illustrations.

==================================================

6. HOW IT WORKS

==================================================

Heading:

"Simple by design."

Show 3 steps:

01

Choose a tool

02

Process your PDF

03

Download your result

Add a small explanation:

"Where technically possible, processing happens directly in your browser."

Keep this section visually simple.

==================================================

7. PRIVACY / SECURITY SECTION

==================================================

Create a visually strong but restrained privacy section.

Heading:

"Your documents are personal."

Text:

"PrivPDF is designed around a local-first approach. Our goal is to process supported documents directly in your browser so your files do not need to be uploaded to a remote server."

Important:

Do NOT make absolute technical claims about features that have not yet been implemented.

Use accurate language such as:

"Designed for local processing."

"Supported browser-side tools process files locally."

Add a button:

"Learn about Privacy"

Link:

/privacy

==================================================

8. FINAL CTA

==================================================

Heading:

"PDF work, without the unnecessary friction."

Text:

"Get the tools you need and keep your documents under your control."

Primary button:

"Explore PDF Tools"

Secondary:

"How It Works"

==================================================

9. FOOTER

==================================================

Footer should contain:

PrivPDF logo

Short description:

"Privacy-first PDF tools for everyday documents."

Navigation:

Tools

How It Works

Privacy

Security

About

FAQ

Legal:

Privacy Policy

Terms

Do not create fake legal content.

Placeholder routes are acceptable for now.

==================================================

TYPOGRAPHY

==================================================

Use a professional modern sans-serif typeface.

Typography must have:

- clear hierarchy

- readable body text

- restrained heading sizes

- excellent mobile readability

- appropriate line height

Do not use excessively futuristic fonts.

==================================================

BUTTON SYSTEM

==================================================

Create reusable buttons:

Primary

Secondary

Ghost

Icon

Buttons must have:

- consistent height

- consistent padding

- subtle hover state

- active state

- disabled state

- keyboard focus state

Primary buttons should use the established PrivPDF light-green brand color.

Do NOT introduce another primary color.

==================================================

CARD SYSTEM

==================================================

Tool cards should be:

- clean

- professional

- subtle border

- restrained shadow

- consistent spacing

- clear icon

- title

- short description

- hover interaction

Do not make every card look like a floating glass panel.

==================================================

RESPONSIVE REQUIREMENT

==================================================

MOBILE FIRST.

This is extremely important.

The page must work properly on:

- small Android phones

- normal phones

- large phones

- tablets

- laptops

- desktop

- large desktop

Do not simply shrink desktop.

Design the mobile layout intentionally.

Check:

- navbar

- menu

- hero

- buttons

- tool cards

- typography

- spacing

- footer

There must be:

NO horizontal scrolling

NO overlapping elements

NO tiny buttons

NO text cutoffs

NO broken menu

NO overflowing cards

==================================================

PERFORMANCE

==================================================

Keep the landing page lightweight.

Do not add unnecessary libraries.

Do not add unnecessary animations.

Use subtle animations only where they improve UX.

Avoid heavy video backgrounds.

Avoid unnecessary 3D rendering.

==================================================

ACCESSIBILITY

==================================================

Use:

- semantic HTML

- accessible buttons

- accessible navigation

- keyboard focus

- alt text where applicable

- readable contrast

- proper heading hierarchy

==================================================

CODE ARCHITECTURE

==================================================

Create reusable components:

Navbar

MobileMenu

Hero

TrustPoints

ToolCard

ToolGrid

BenefitCard

HowItWorks

PrivacySection

CTASection

Footer

Button

Create centralized design tokens.

Do not scatter styles randomly.

Keep the architecture ready for future PDF tools.

==================================================

ROUTING FOUNDATION

==================================================

Prepare route structure for:

/

 /merge-pdf

 /split-pdf

 /compress-pdf

 /organize-pdf

 /rotate-pdf

 /image-to-pdf

 /pdf-to-image

 /sign-pdf

 /how-it-works

 /privacy

 /security

 /about

 /faq

Only "/" needs to be fully designed right now.

Other routes can be simple placeholders.

==================================================

CRITICAL RULE — DO NOT CHANGE THE DESIGN

==================================================

You are NOT allowed to invent a different visual identity.

Do not decide that blue/purple looks better.

Do not replace light green with another color.

Do not add generic AI gradients.

Do not redesign the brand without permission.

Preserve the established PrivPDF design direction.

==================================================

TESTING

==================================================

After building the landing page, test it.

Test:

1. Desktop layout

2. Mobile layout

3. Tablet layout

4. Navbar

5. Mobile menu

6. All navigation links

7. CTA buttons

8. Tool cards

9. Footer links

10. Direct route navigation

11. Browser refresh

12. No horizontal overflow

13. No console-critical errors

If something fails:

IDENTIFY THE ROOT CAUSE

→ FIX IT

→ TEST AGAIN

Do not stop after finding the first error.

Do not claim the page is complete unless it has been tested.

==================================================

FINAL REQUIREMENT

==================================================

For this stage, DO NOT build the actual PDF processing system.

Only build:

PRIVPDF HOME PAGE

+

DESIGN SYSTEM

+

NAVIGATION FOUNDATION

+

ROUTE STRUCTURE

+

RESPONSIVE LAYOUT

+

TESTING

Once this Home Page is visually approved, we will add PDF tools one at a time.

Do not add extra features on your own.

Do not add AI Resume features yet.

Do not add Supabase yet.

Do not add OpenAI yet.

Do not add random sections.

Focus entirely on making the PrivPDF Home Page look and feel like a polished premium real-world product.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7a9aa9b4-33c9-4178-b49f-ba1eb75f02c9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
