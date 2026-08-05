sakaar.art
Website Requirements & Functional Specification Document
Handmade Gifts, Flowers, Bouquets, Decor & Custom Craft — E-commerce Platform
Prepared for: Bhawna Jha (Founder, sakaar.art)
Document Version 1.0
Date: August 2026
Table of Contents
1. Project Overview
sakaar.art is a girls-oriented, cute pink-themed e-commerce website for handmade and curated gifts — bouquets, flowers, decorative items, purses, and made-to-order craft products. The platform should feel warm, personal and "pookie" (cute, soft, playful) rather than a generic corporate storefront — closer in spirit to a boutique gifting brand than a mass marketplace, while borrowing proven UX patterns from large platforms like Myntra and Amazon (search, cart, reviews, structured product pages).
This document lays out every functional module requested — authentication, search, custom orders, categories, product pages, cart & checkout, reviews, micro-animations, footer/branding, and the landing page — in enough detail that a developer (or Claude Code) can build the site directly from this specification.
1.1 Goals
Let customers browse gifting categories, search products, and check out smoothly on both mobile and desktop.
Support fully custom/made-to-order requests (with image/video reference upload) that the owner can review and follow up on by phone.
Keep the brand feeling personal and handmade — direct owner contact, a founder's note in the footer, and playful micro-animations throughout.
Ship fast with placeholder (stock) images now; swap in real product photography later without restructuring the site.
1.2 Out of Scope (for v1, unless you want it added later)
Online payment gateway integration (Razorpay/Stripe) — v1 uses Cash on Delivery and UPI (manual/QR or a simple UPI deep link); a full payment gateway can be added in v2.
Multi-vendor support — this is a single-seller (sakaar.art) store.
Native mobile app — v1 is a responsive website (mobile web already covers most "app-like" needs).
2. Technology Stack & Architecture
Based on your notes ("next.js, server side (ssd)"), here is the recommended stack. "SSD" is read here as SSR — Server-Side Rendering — which Next.js supports natively and which is the right choice for an e-commerce site (fast first paint, good SEO for product pages).
Layer
Recommendation
Why
Frontend framework
Next.js 14+ (App Router), React, TypeScript
Server-side rendering for fast, SEO-friendly product/category pages; file-based routing; image optimization built in.
Styling
Tailwind CSS + Framer Motion
Rapid, consistent styling for the pink/cute theme; Framer Motion powers the smooth "pookie" micro-animations.
Animation assets
Lottie (via lottie-react) for character/heart/confetti animations; CSS/Framer Motion for page & button transitions
Lightweight, scalable, designer-made animations — no need to hand-draw frame-by-frame art.
Backend / API
Next.js API routes or a small Node.js (Express/Fastify) service
Keeps everything in one JS/TS codebase; easy to deploy together.
Database
PostgreSQL (e.g. via Supabase or Neon) or MongoDB
Stores users, products, categories, orders, cart, reviews, custom-order requests.
Auth
NextAuth.js / Auth.js (email+password plus Google, Facebook, Apple providers)
Ready-made, secure handling of social login and session cookies.
Email/OTP
Resend, SendGrid, or AWS SES for transactional email; a 6-digit OTP stored (hashed) with a short expiry (e.g. 10 minutes) in the DB or Redis
Reliable delivery of verification & reset codes.
Image/video storage
Cloudinary or AWS S3 + CloudFront
Handles user-uploaded custom-order images/videos and product photos, with automatic resizing/optimization.
Hosting
Vercel (ideal for Next.js SSR) with the database hosted separately (Supabase/Neon/Mongo Atlas)
Zero-config SSR deployment, fast global CDN, generous free tier to start.
2.1 High-Level Architecture
Public site (Next.js, SSR): landing page, categories, product pages, search, cart, custom-order form.
Auth service: registration, login, OTP email verification, password reset, social login (Google/Facebook/Apple).
Order service: cart, checkout (COD/UPI), custom-order requests routed to the owner's phone/email.
Review service: product reviews with optional photo upload, tied to a purchase or product ID.
Admin/owner dashboard (can be phase 2): manage products, categories, view custom-order requests and reviews.
3. Branding & Visual Design Guidelines
The overall look should be soft, cute, and girly — pastel pink as the primary palette, rounded shapes, playful iconography, and gentle motion. This should read as a lovingly handmade boutique brand, not a stock template.
3.1 Colour Palette
Role
Suggested Colour
Hex
Primary (brand pink)
Rose / Blush pink
#D6336C or #F06292
Secondary / background
Soft pastel pink / blush white
#FDE2EC / #FFF7FA
Accent
Deeper magenta / rose gold
#C2185B / #E8B4BC
Text
Warm charcoal (not pure black, keeps it soft)
#4A2C33
Success / confirmation
Soft green (used sparingly)
#8BC34A
3.2 Typography & Shape Language
Headings: a rounded, friendly display font (e.g. "Quicksand", "Baloo 2", "Poppins", or a soft handwritten script for the logo/wordmark).
Body text: a clean, readable sans-serif (e.g. "Poppins", "Nunito") for product descriptions and forms.
UI shapes: rounded corners everywhere (buttons, cards, input fields), soft drop shadows, no hard/sharp edges.
Iconography: cute, hand-drawn-style icons (hearts, bows, flowers, gift boxes) rather than plain corporate icons.
3.3 Logo
A logo/wordmark for "sakaar.art" (e.g. the name in a soft script or rounded font, optionally paired with a small icon — a flower, heart, or bow) should appear on every page: top-left of the header/navbar, in the landing-page splash animation, and in the footer.
4. Site Structure (Sitemap)
Landing page (animated splash → home)
Home — categories, featured/trending products, search bar
Category page → Sub-category page → Product listing grid
Product detail page
Search results page
Custom Order page (form)
Cart page
Checkout (Buy Now) flow
Login / Register / Forgot Password / Email Verification pages (or modals)
My Account (order history, saved/liked items, profile — recommended addition, see Section 15)
Footer (visible sitewide): About/founder note, Instagram, contact numbers, credits
5. User Authentication Module
Covers Sign Up (Register), Email Verification via OTP, Login, and Forgot/Reset Password — plus social login (Google, Facebook, Apple).
5.1 Registration (Sign Up) Form
Fields, in order:
Full Name — text field, required.
Email ID — text field, required, validated as a proper email format.
Password — password field, required. Show a real-time strength meter (Weak / Medium / Strong / Very Strong) as the user types, plus a suggested strong password (see 5.2).
Confirm Password — password field, required; must match Password before submission is allowed.
Gender — single-select: Male / Female / Prefer not to say.
Primary action: "Create Account" button.
Divider ("or continue with") followed by three social buttons: Continue with Google, Continue with Facebook, Continue with Apple.
5.2 Password Strength: Suggestion & Live Feedback
Next to the Password field, add a small "Suggest a strong password" link/icon. Clicking it auto-generates and fills a strong random password (and shows a temporary "copied/filled" cute toast) such as, for example: Bl0om&Petal_92! — the key point is the generation logic, not this literal example:
At least 10–12 characters.
A mix of uppercase and lowercase letters.
At least one number.
At least one special character (!, @, #, $, %, &, *).
No dictionary words used alone, and no obvious sequences (123456, qwerty, password).
Live strength indicator: as the user types, evaluate length + character variety and show a coloured bar/label — Weak (red), Medium (orange), Strong (yellow-green), Very Strong (green) — with a one-line tip such as "Add a number and a symbol to make this stronger."
Tips for a Strong Password (show as a small helper/tooltip under the field)
Use 12+ characters — longer passwords are exponentially harder to crack.
Mix uppercase, lowercase, numbers, and symbols.
Avoid personal info (name, birthdate, phone number).
Avoid common words and predictable patterns (password1, 12345678, your own name).
Don't reuse a password from another site/account.
Consider a memorable passphrase style, e.g. three random words plus a number and symbol (Tulip-Ribbon-Moon7!).
5.3 Email Verification (6-Digit OTP)
Immediately after "Create Account" is submitted, send a 6-digit numeric OTP to the registered email and show a verification screen/modal:
Message: "We've sent a 6-digit code to [email]. Enter it below to verify your account."
Six individual input boxes (or one field) for the OTP, numeric only, auto-advance between boxes.
"Submit" button to confirm the code.
"Resend Code" link/button — disabled with a short countdown (e.g. 30–60 seconds) after each send, to prevent spam; generates and emails a fresh code and invalidates the old one.
"Change Email ID" link — lets the user go back and correct a mistyped email before verification, then resends the OTP to the corrected address.
OTP should expire after a set window (e.g. 10 minutes) and be single-use; on success, show a cute confirmation animation (see Section 12) and log the user in.
5.4 Login
Email field and Password field, both required.
"Sign In" button.
"Forgot Password?" link.
Divider ("or continue with") plus Google / Facebook / Apple buttons, same as registration.
If the account's email isn't verified yet, redirect back into the OTP verification flow instead of logging in.
5.5 Forgot Password / Reset Password
Step 1: user enters their registered email; system sends a 6-digit OTP (or a secure reset link — OTP is simpler to keep consistent with the rest of the flow).
Step 2: user enters the OTP, plus a New Password and Confirm New Password field (with the same strength meter and "suggest strong password" helper as registration).
Step 3: on success, show a confirmation message/animation and take the user to Login with the new password.
Include the same "Resend Code" option here as well.
5.6 Social Login (Google, Facebook, Apple)
Implement via NextAuth.js/Auth.js providers for Google, Facebook, and Apple. On first-time social sign-in, still collect Gender (optional at that point) so the profile is complete; email is taken directly from the provider and is considered pre-verified (no OTP needed for social accounts).
6. Global Search Bar
A search bar (with a cute icon) should be visible on every page, most prominently on the Home/landing page, letting users search across all product types — bouquets, flowers, decorative items, purses, gift hampers, and any future categories.
6.1 Behaviour
As the user types, show live/instant suggestions (auto-complete) matching product names, categories, and tags — this is the "most accurate available options" behaviour requested.
Search should match on product title, category/sub-category name, tags, and description keywords, ranked so the closest/most relevant matches appear first (a simple relevance ranking is fine for v1; e.g. Postgres full-text search, or a MongoDB text index, or a hosted search layer like Algolia/Meilisearch if you want typo-tolerance and speed later).
Pressing Enter or tapping a suggestion goes to a Search Results page/grid, using the same product-card layout as category pages.
If nothing matches at all, show a friendly empty state — a cute illustration plus the text "No results found 🌸 Try a different search, or browse our categories instead" — with quick links back to the main categories rather than a dead end.
6.2 Example Searchable Terms
Bouquet, flowers, roses, dried flowers
Decorative items, home decor, showpieces
Purses, bags, pouches
Gift hampers, personalised gifts, custom gifts
7. Custom Order Section
A dedicated "Custom Order" page/section where a customer can request a fully custom/made-to-order product that isn't in the catalogue.
7.1 Form Fields
Full Name — required.
Contact Number — required (this is essential: the owner will call the customer to discuss the request further after reviewing it).
Email ID — optional, for a written follow-up copy.
Description box — "Tell us what you'd like made" — a multi-line text area where the customer describes the custom item they want.
Reference Image/Video Upload — optional file upload (images and short videos), so the customer can show what they're picturing.
Budget range — optional dropdown/field (helps the owner scope the request before calling).
Preferred delivery date — optional date field.
"Submit Request" button.
7.2 Direct Call Option
Alongside the form, show a clearly visible "Call Now" button/banner with the text: "Prefer to explain over the phone? Call us directly — we'll talk it through with you." — linking to a tap-to-call number: 8130422575.
7.3 Workflow After Submission
On submit, show a cute confirmation animation/message: "Your custom request has been received! We'll review it and call you soon 💕"
The request (with any uploaded image/video, description, and contact number) is stored and also notified to the owner (e.g. by email/WhatsApp/dashboard) so she can analyse the request first.
The owner then calls the customer on the number provided to discuss details, feasibility, pricing, and timeline before confirming the order.
8. Categories & Sub-Categories
The catalogue is organised as Category → Sub-category → Product grid, so the same product type (e.g. "Gifts") can branch into many occasions/audiences without cluttering the navigation.
8.1 Example Category Structure
Category
Example Sub-categories
Gifts
Gifts for Him, Gifts for Her, Birthday Gifts, Anniversary Gifts, Gifts for Friends, Valentine's Day Gifts, Gifts for Parents, Gifts for Kids
Bouquets & Flowers
Rose Bouquets, Mixed Flower Bouquets, Dried Flower Bouquets, Flower Baskets, Fresh Bouquets
Decorative Items
Wall Decor, Table Decor, Showpieces, Fairy Lights, Photo Frames
Purses & Bags
Handbags, Pouches, Clutches, Sling Bags
Occasions
Birthday, Anniversary, Valentine's Day, Rakhi, Diwali, Wedding/Engagement
Custom & Personalised
Personalised Hampers, Name-customised Items, Made-to-order (links to Custom Order form)
8.2 Behaviour
Home page shows the top-level categories as cute, tappable tiles/cards (icon or image + name).
Tapping a category shows its sub-categories (as a filter row or a second tile grid).
Tapping a sub-category shows a product grid of everything tagged under it, using the same product-card component used in Search Results.
Categories/sub-categories should be manageable from an admin panel later, so new ones can be added without a code change.
For now, use royalty-free stock/placeholder images (e.g. from Unsplash or Pexels) for every product and category tile; swap in real product photography later without changing the layout.
9. Product Listing & Product Detail Page
9.1 Product Card (used in category grids, search results, "related items")
Product image (square/portrait, rounded corners)
Product name
Price
Small heart/like icon in a corner (with the cute pop animation on tap — see Section 12)
Tapping the card opens the Product Detail Page
9.2 Product Detail Page
On opening a product, show a full detail view with:
Image gallery (multiple photos, swipeable on mobile)
Product title and price (with any discount shown as a strikethrough original price, if applicable)
Full description of the product
Quantity selector (+ / − stepper, minimum 1)
"Add to Cart" button
Like/wishlist heart icon (with the cute animation)
"Add Personalisation" box — an optional text field where the customer can note customisations for this specific product (e.g. "Please write 'Happy Birthday Riya' on the card", "Use pink ribbon instead of red")
"Buy Now" button, which opens the checkout flow directly (see 9.3)
A "You may also like" / "Related Products" row, suggesting similar or complementary items from the same category
Reviews section at the bottom (see Section 11)
9.3 Buy Now / Checkout Details
Whether reached via "Buy Now" on a product or "Checkout" from the cart, collect:
Full Name
Full Address (with fields for house/street, landmark, city, state, pincode)
Contact Number
Payment Method — Cash on Delivery, or UPI (show a UPI ID / QR code, or a UPI deep link for supported apps)
Order summary (items, quantity, personalisation notes, price total) shown alongside for confirmation before placing the order
"Place Order" button, followed by a cute order-confirmation animation/message
10. Shopping Cart
A Cart page/drawer listing every product added via "Add to Cart", each showing image, name, chosen quantity, personalisation note (if any), unit price, and line total.
Ability to change quantity or remove an item directly from the cart.
Order summary: subtotal, delivery charge (if any), and grand total.
"Proceed to Checkout" button leading into the Buy Now details flow (Section 9.3).
A small cart icon with an item-count badge should be visible in the header at all times.
11. Ratings & Reviews
On every Product Detail Page, include a reviews section similar to Myntra/Amazon:
Star rating input (1–5) plus a "Write a Review" text box.
Optional photo upload with the review (customers can show the product they received).
Submitted reviews (rating, text, optional photos, reviewer name, date) are shown publicly to all visitors under the product, most recent first.
Show an average rating and total review count near the product title/price at the top of the page.
(Optional, phase 2) Only allow reviews from customers who've actually ordered the product, marked with a "Verified Purchase" badge.
12. Micro-Animations ("Pookie" Interactions)
Small, delightful animations should appear at key interaction moments — not as boxy pop-up alerts, but as soft, in-context motion (things gently scaling/bouncing/fading near where the action happened, or a small character/mascot reacting).
12.1 Where to Add Animation
Interaction
Suggested Animation
Liking a product (heart icon)
Heart icon pops/bounces and fills with colour, with a few small floating hearts or a soft burst/confetti around it, on tap — not a full-screen popup.
Successful login
A small, warm inline message with a gentle bounce/fade-in — e.g. a cute character waving with "Welcome back! 💕" appearing near the top of the screen, not a blocking modal.
Adding to cart
The cart icon in the header does a little bounce/shake and the item count badge pops in; a small toast slides in from the corner ("Added to your bag! 🛍️") and fades out on its own.
Placing an order (Buy Now / checkout complete)
A short celebratory animation — confetti or floating petals/hearts — with a warm message like "Yay, your order is on its way to being made with love! 🌸", auto-dismissing after a few seconds.
Page/route transitions
Soft fade + slight slide/scale between pages (Framer Motion's page-transition pattern), rather than a hard cut.
OTP verified
A gentle checkmark animation with a cute confirmation line, e.g. "You're verified! 🎉"
12.2 Implementation Approach
Use Framer Motion (framer-motion npm package) for page transitions, button taps, and simple scale/fade/slide effects — it integrates natively with React/Next.js.
Use Lottie animations (via the lottie-react or @lottiefiles/dotlottie-react package) for more illustrated moments — hearts, confetti, a cute mascot — sourced from LottieFiles' free library.
Keep every animation short (roughly 0.3–1.5 seconds) and auto-dismissing, so it never blocks the user from continuing.
12.3 Animation Asset Resources
LottieFiles — free "heart/like" animations — https://lottiefiles.com/free-animations/heart-like
LottieFiles — free "heart button" pop animations — https://lottiefiles.com/free-animations/heart-button
LottieFiles — browse all free animation categories (confetti, loaders, mascots, success states, etc.) — https://lottiefiles.com/free-animations
lottie-react (npm package to embed Lottie animations in React/Next.js) — https://www.npmjs.com/package/lottie-react
Framer Motion (React animation library for transitions & micro-interactions) — https://www.framer.com/motion/
Search LottieFiles directly for themed packs — try terms like "cute heart", "confetti celebration", "cute mascot wave", "success checkmark", "flower bloom" — and pick ones with a pink/pastel colour set (Lottie files can also be recoloured to match the brand palette).
13. Footer & Contact Information
Visible on every page. Contents:
Instagram link: @sakaar.art
A short, warm founder's note, e.g.: "Hi, I'm Bhawna Jha 💕 I put so much love and effort into every piece on sakaar.art — if you enjoyed shopping here, please show us some love and support!"
Credit line: "Website designed & developed by Harsh Jha — 7042834496. Want a website like this for your own business? Get in touch!"
Owner/business contact: Bhawna Jha — 8130422575 (also reused as the Custom Order "Call Now" number).
The sakaar.art logo, repeated in the footer.
Standard links: About, Custom Orders, Categories, Contact, and (optional) Privacy Policy / Terms of Service / Shipping & Returns for a fully professional footer.
14. Landing Page / Splash Screen
On first load, show a short (about 2-second) animated splash before the Home page appears:
Soft pink/pastel animated background (e.g. slowly drifting petals, soft gradient motion, or floating hearts).
"Presenting sakaar.art" text animating in (fade + gentle scale/bounce), followed by the logo settling into place.
Automatically transitions into the Home page after ~2 seconds (or on tap, for users who want to skip it).
This should only need to play once per session (or once per day), not on every single page navigation, so returning visitors aren't slowed down.
15. Additional Recommendations (Not Explicitly Requested, but Worth Considering)
A few standard e-commerce features that pair naturally with what you've described, useful to plan for even if built in a later phase:
My Account / Profile page: order history, saved addresses, and a "My Likes" (wishlist) page pulling together every product the user has hearted.
Order tracking: simple status labels (Received → Confirmed → Preparing → Out for Delivery → Delivered) visible in My Account.
Admin dashboard: for the owner to add/edit products & categories, view custom-order requests, and moderate reviews, without needing a developer for every catalogue change.
SEO basics: since Next.js SSR is being used, make sure each product/category page has a proper title, meta description, and image alt text — this helps sakaar.art show up in Google search and image search.
Mobile-first responsiveness: most gifting traffic is likely to come from phones, especially around occasions like Valentine's Day/Rakhi — every page and animation should be tested on mobile first.
16. Reference Links & Asset Resources
16.1 Placeholder / Stock Images (until real product photos are ready)
Unsplash — free stock photography (flowers, gifts, decor, etc.) — https://unsplash.com/
Pexels — free stock photography & video — https://www.pexels.com/
16.2 Craft / Pipe-cleaner / Handmade-Art Reference & Inspiration
Pinterest — search "pipe cleaner flower bouquet", "handmade gift box ideas", "cute pink packaging" for visual/product inspiration — https://www.pinterest.com/
Etsy — for pricing, presentation, and category-structure inspiration from other handmade-craft sellers — https://www.etsy.com/
16.3 Animation & Motion Assets
LottieFiles (free Lottie animation library) — https://lottiefiles.com/
Framer Motion documentation — https://www.framer.com/motion/
16.4 Fonts
Google Fonts — "Quicksand" (rounded, cute headings) — https://fonts.google.com/specimen/Quicksand
Google Fonts — "Poppins" (clean, readable body text) — https://fonts.google.com/specimen/Poppins
16.5 Core Tech Documentation
Next.js documentation — https://nextjs.org/docs
Auth.js / NextAuth documentation (email, Google, Facebook, Apple providers) — https://authjs.dev/
Tailwind CSS documentation — https://tailwindcss.com/docs
17. Feature Checklist Summary
Module
Key Features
Auth
Register, strong-password suggestion + tips, confirm password, gender, OTP email verification (with resend & change-email), Login, Forgot/Reset Password, Google/Facebook/Apple login
Search
Site-wide search bar, live accurate suggestions, graceful "No results found" state
Custom Orders
Form with description + optional image/video upload, contact number, Call Now (8130422575), owner review workflow
Categories
Multi-level categories & sub-categories (Gifts, Bouquets, Decor, Purses, etc.), placeholder images for now
Product Page
Gallery, price, description, quantity, Add to Cart, Like, Add Personalisation, related items, Buy Now
Cart & Checkout
Cart view, quantities, Buy Now details (name, address, contact, COD/UPI)
Reviews
Star rating, written review, optional photos, public display
Animations
Cute inline animations for like, login, add-to-cart, order placed, page transitions, splash screen
Footer/Branding
Instagram @sakaar.art, founder's note, developer credit (Harsh Jha), owner contact (Bhawna Jha), logo
End of document.