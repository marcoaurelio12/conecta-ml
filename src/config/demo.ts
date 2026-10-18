/**
 * Public demo build (`npm run build:demo`, Vite mode "demo"): the role switcher
 * stays visible and a banner says the data is fictional. Until Entra ID sign-in
 * lands in M1, this is how a visitor sees what each role is allowed to use.
 */
export const isDemoMode = import.meta.env.DEV || import.meta.env.MODE === "demo";

export const repositoryUrl = "https://github.com/marcoaurelio12/conecta-ml";
