# Images & Media

Usually the largest bytes on the page, and the easiest large win — most of it is configuration rather than engineering.

[← all checklists](../README.md)

---


## Format and compression

* [ ] Verify modern formats are served — AVIF or WebP — with a fallback for browsers that need one.
* [ ] Verify compression quality has been chosen by looking at the result, not left at a library default.
* [ ] Verify photographic and graphic content use appropriate formats; a PNG screenshot of a photo is a common and expensive mistake.
* [ ] Verify SVGs are minified and stripped of editor metadata.
* [ ] Verify animated GIFs are replaced with video; a short GIF routinely costs more than the entire rest of the page.
* [ ] Verify an image CDN or build-time pipeline handles conversion, so correctness does not depend on whoever uploads.

## Sizing and responsiveness

* [ ] Verify no image is served substantially larger than its largest rendered size.
* [ ] Verify `srcset` offers candidates that match the layout's real breakpoints.
* [ ] Verify `sizes` describes the actual rendered width; a wrong `sizes` makes `srcset` pick badly on every device.
* [ ] Verify high-density displays are served appropriate candidates without sending a 3× image to everyone.
* [ ] Verify every image has intrinsic dimensions or an aspect ratio so it reserves space before loading.
* [ ] Verify user-uploaded images are resized on ingest rather than served at whatever size they arrived.

## Loading behaviour

* [ ] Verify images below the fold use `loading="lazy"`.
* [ ] Verify images above the fold do **not** — especially the LCP element.
* [ ] Verify `decoding="async"` is set where decode time would otherwise block.
* [ ] Verify CSS `background-image` is not used for meaningful above-the-fold imagery; the preload scanner cannot see it.
* [ ] Verify placeholders and blur-up techniques do not introduce a layout shift when the real image arrives.
* [ ] Verify offscreen carousel slides are not all loaded eagerly.

## Video and other media

* [ ] Verify video does not autoplay with audio, and that autoplaying background video is muted, short and small.
* [ ] Verify `preload="none"` or `metadata` is used unless the video is the point of the page.
* [ ] Verify a poster image is set so the player does not render an empty box.
* [ ] Verify video is served in a modern codec and adaptively where length justifies it.
* [ ] Verify embedded third-party players use a facade until the user chooses to play.
* [ ] Verify total media weight for the page has a budget, and that it is checked.

## Delivery

* [ ] Verify images are served from a CDN with a long cache lifetime and a content-based URL.
* [ ] Verify images are not passing through the application server on every request.
* [ ] Verify the image pipeline sets correct `Content-Type` and `Vary` headers so caches do not serve the wrong format.

## Art direction and the rest

* [ ] Verify `<picture>` is used where the crop or subject needs to change at breakpoints, rather than squeezing one image.
* [ ] Verify `object-fit` and `object-position` are set where an image must fill a fixed box, so it neither stretches nor shifts.
* [ ] Verify image sprites are not still in use; under HTTP/2 they cost more than they save.
* [ ] Verify the favicon and touch icons are small and cached, and are not a full-size PNG.
* [ ] Verify Open Graph and social preview images are sized to spec and served from a CDN, not generated per request.
* [ ] Verify user-facing image upload has a size limit and rejects formats the pipeline cannot process.
