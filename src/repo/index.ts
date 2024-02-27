import { Repo, RepoProvider } from "../types";
import GitHubRepo from "./GitHubRepo";
import GitLabRepo from "./GitLabRepo";

const providers = {
    gitlab: GitLabRepo,
    github: GitHubRepo,
} as { [key: string]: RepoProvider };

const RepoProvider = {
    determineProvider(url: string): string {
        if (url.includes("github.com"))
            return "github";
        if (url.includes("gitlab.com"))
            return "gitlab";
        throw new Error("provider not found");
    },

    isUserProfileUrl(url: string) {
        // User profile URL has the format <PROTOCOL>://<DOMAIN>/USER
        // 1. Remove the protocol, which may be empty.
        // 2. Split the remaining URL using the path separator.
        // 3. It is user account if array has only two items (DOMAIN and USER).
        return url.replace(/https?:\/\//, "")
            .replace(/\/$/, "")
            .split("/").length === 3;
    },

    sanitizeUrl(url: string) {
        return url.replace(/\/$/, "");
    },

    async getRepo(url: string, provider: string): Promise<Repo> {
        url = RepoProvider.sanitizeUrl(url);
        return providers[provider].getRepo(url);
    },

    async getUserStarredRepos(url: string, provider: string): Promise<Repo[]> {
        url = RepoProvider.sanitizeUrl(url);
        const userName = url.replace(/.*\//, "");
        return providers[provider].getUserStarredRepos(userName);
    }
}

export default RepoProvider;