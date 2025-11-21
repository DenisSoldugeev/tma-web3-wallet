/**
 * View Transitions API utility for smooth page transitions
 * @see https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API
 *
 * Browser support:
 * - Chrome/Edge 111+
 * - Safari 18+ (iOS 18+)
 * - Firefox: in development (behind flag)
 *
 * Gracefully degrades to instant navigation in unsupported browsers
 */

export type TransitionDirection = 'forward' | 'backward';

interface ViewTransition {
    finished: Promise<void>;
    ready: Promise<void>;
    updateCallbackDone: Promise<void>;
    skipTransition(): void;
    types: Set<string>;
}

interface DocumentWithViewTransition extends Document {
    startViewTransition(callback: () => void): ViewTransition;
}

export function supportsViewTransitions(): boolean {
    return 'startViewTransition' in document;
}

export async function navigateWithTransition(
    callback: () => void,
    direction: TransitionDirection = 'forward',
): Promise<void> {
    if (!supportsViewTransitions()) {
        callback();
        return;
    }

    document.documentElement.dataset.transition = direction;

    try {
        const transition = (document as DocumentWithViewTransition).startViewTransition(() => {
            callback();
        });

        // Wait for transition to complete
        await transition.finished;
    } catch (error) {
        console.debug('View transition interrupted:', error);
    } finally {
        delete document.documentElement.dataset.transition;
    }
}

export function createTransitionNavigate<T extends (...args: unknown[]) => void>(
    navigateFn: T,
) {
    return async (
        ...args: Parameters<T>
    ): Promise<void> => {
        await navigateWithTransition(() => {
            navigateFn(...args);
        });
    };
}
