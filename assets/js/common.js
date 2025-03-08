// TrapFocus
export function getFocusableElements(container) {
    return container.querySelectorAll(
        "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex='-1'], *[contenteditable]"
    );
}

export function trapFocus(event, focusableEls) {
    const firstElement = focusableEls[0];
    const lastElement = focusableEls[focusableEls.length - 1];

    if (event.key === "Tab") {
        if (event.shiftKey) { // Shift + Tab: 첫 요소에서 마지막 요소로 이동
            if (document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            }
        } else { // Tab: 마지막 요소에서 첫 요소로 이동
            if (document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    }
}