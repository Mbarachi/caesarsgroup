
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

// Light-only theme provider: removes system dark mode responsiveness
export function ThemeProvider({ children }: ThemeProviderProps) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            themes={["light"]}
            storageKey="caesars-theme"
        >
            {children}
        </NextThemesProvider>
    );
}