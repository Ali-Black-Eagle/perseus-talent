/**
 * Whether the admin panel (/keystatic and /api/keystatic) is switched on for this server.
 *
 * - On the live site it is on only with KEYSTATIC_STORAGE=github. Saves then go to GitHub, and only people
 *   with write access to the repository can sign in and save.
 * - On a developer's computer (npm run dev) it is on with the default "local" storage, which edits the files
 *   in the content folder.
 * - Anywhere else (for example a live site that was misconfigured with local storage) it answers 404, so
 *   nobody can edit the live server's files.
 */
export function isAdminEnabled(): boolean {
  return process.env.KEYSTATIC_STORAGE === "github" || process.env.NODE_ENV === "development";
}
