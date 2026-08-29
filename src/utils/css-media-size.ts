/** Responsive breakpoints matching common device widths. */

/** Max-width media feature conditions, e.g. (max-width: 600px). */
export const CSSMediaRule = {
  phone_small: '(max-width: 400px)',
  phone: '(max-width: 600px)',
  phone_big: '(max-width: 768px)',
  tablet: '(max-width: 992px)',
  pc_small: '(max-width: 1366px)',
  pc: '(max-width: 1440px)',
  pc_big: '(max-width: 1536px)',
  pc_huge: '(max-width: 1600px)',
};

/** Viewport-based media queries derived from maxWidths. */
export const CSSMediaSize = Object.fromEntries(
  Object.entries(CSSMediaRule).map(([key, value]) => [
    key,
    `@media only screen and ${value}`,
  ]),
) as Record<keyof typeof CSSMediaRule, string>;

/** Element-size-based container queries derived from maxWidths. */
export const CSSContainerSize = Object.fromEntries(
  Object.entries(CSSMediaRule).map(([key, value]) => [
    key,
    `@container ${value}`,
  ]),
) as Record<keyof typeof CSSMediaRule, string>;

/** Page container width for each breakpoint, keyed to match maxWidths. */
export const pageWidth = {
  default: '1200px',
  pc_huge: '1200px',
  pc_big: '1152px',
  pc: '1080px',
  pc_small: '960px',
  tablet: '720px',
  phone_big: '100%',
  phone: '100%',
  phone_small: '100%',
};

/**
 * CSS rules applying pageWidth per breakpoint, ordered largest → smallest
 * so the smallest matching breakpoint wins. Interpolate next to
 * `max-width: ${pageWidth.default}`.
 */
export const pageWidthMedia = Object.entries(pageWidth)
  .filter(([key]) => key !== 'default')
  .reverse()
  .map(
    ([key, value]) =>
      `${CSSMediaSize[key as keyof typeof CSSMediaSize]} { max-width: ${value}; }`,
  )
  .join('\n');

export default CSSMediaSize;
