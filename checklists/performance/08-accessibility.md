# Accessibility

Lighthouse's accessibility category is a floor, not a ceiling — it catches roughly a third of real issues and nothing about whether the page is actually usable.

It is in this domain because it is scored alongside performance and because the overlap is real: a page that is fast for a screen reader user is usually a page with less unnecessary markup and JavaScript.

[← all checklists](../README.md)

---


## Colour and contrast

* [ ] Verify body text meets a 4.5:1 contrast ratio against its background, and large text 3:1.
* [ ] Verify interface components and meaningful graphics meet 3:1 against adjacent colours.
* [ ] Verify text over images or gradients meets contrast at every point it can land.
* [ ] Verify information is never carried by colour alone — errors, status, required fields, chart series.
* [ ] Verify contrast holds in both light and dark themes, and in any high-contrast mode you claim to support.
* [ ] Verify placeholder text is not used as the only label, and that disabled controls are still legible.

## Names, roles and structure

* [ ] Verify every image has an `alt` that describes its purpose, and that decorative images have `alt=""`.
* [ ] Verify every form control has a programmatically associated label, not just adjacent text.
* [ ] Verify every button and link has an accessible name — an icon-only button needs one explicitly.
* [ ] Verify link text makes sense out of context; "read more" repeated twelve times does not.
* [ ] Verify heading levels descend without skipping, and that there is exactly one `h1` per page.
* [ ] Verify landmarks are present — `header`, `nav`, `main`, `footer` — and that `main` wraps the primary content.
* [ ] Verify the page has a `lang` attribute, and that content in another language is marked.
* [ ] Verify tables use `th` with `scope`, and that layout is not done with tables.
* [ ] Verify lists are marked up as lists, and that native elements are preferred over ARIA re-implementations.
* [ ] Verify ARIA roles and properties are valid and match the element's actual behaviour; incorrect ARIA is worse than none.
* [ ] Verify `aria-hidden` is never applied to something focusable.

## Keyboard and focus

* [ ] Verify every interactive element is reachable and operable with the keyboard alone.
* [ ] Verify focus is always visible, and that the indicator meets contrast against its background.
* [ ] Verify focus order follows the visual order, and that positive `tabindex` values are not used.
* [ ] Verify modals trap focus while open, return it on close, and close on Escape.
* [ ] Verify a skip link is present and works, so keyboard users are not walked through the whole navigation.
* [ ] Verify custom controls implement the keyboard interactions their role implies — arrow keys in a listbox, Space and Enter on a button.
* [ ] Verify no keyboard trap exists in embedded content such as iframes and third-party widgets.
* [ ] Verify dropdowns and menus are not hover-only.

## Dynamic content and input

* [ ] Verify content that appears without a page load — validation, toasts, search results, loading states — is announced with a live region.
* [ ] Verify error messages are associated with their field and describe how to fix the problem.
* [ ] Verify required fields are indicated programmatically, not only visually.
* [ ] Verify `autocomplete` attributes are set on personal-data fields.
* [ ] Verify a time limit can be extended or turned off.
* [ ] Verify `prefers-reduced-motion` disables non-essential animation, including autoplaying carousels and parallax.
* [ ] Verify nothing flashes more than three times per second.

## Layout and target size

* [ ] Verify the page is usable at 200% zoom without horizontal scrolling or lost content.
* [ ] Verify it reflows at 320 CSS pixels wide without a horizontal scrollbar.
* [ ] Verify touch targets are at least 24 by 24 CSS pixels, with spacing between adjacent ones.
* [ ] Verify content is usable in both portrait and landscape unless orientation is essential.
* [ ] Verify the viewport meta tag does not disable zooming.

## Beyond the automated check

* [ ] Navigate the primary journey with the keyboard only, and record what breaks.
* [ ] Navigate the same journey with a screen reader — VoiceOver, NVDA or TalkBack — and record what is confusing rather than merely wrong.
* [ ] Verify video has captions and audio has a transcript.
* [ ] Verify an accessibility statement exists and names a way to report a problem.
