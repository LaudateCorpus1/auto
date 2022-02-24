import envCi, { CiEnv } from "env-ci";
import { execSync } from "child_process";

const defaultCiEnvironment = envCi();

/**
 * Validates that the given branch name should be returned by environment context
 */
const isValidBranch = (branch: string | undefined) => typeof branch === "string" && branch !== "undefined"

/** Get the current branch the git repo is set to */
export function getCurrentBranch(env: Partial<CiEnv> = defaultCiEnvironment) {
  const isPR = "isPr" in env && env.isPr;
  let branch: string | undefined;
  // env-ci sets branch to target branch (ex: main) in some CI services.
  // so we should make sure we aren't in a PR just to be safe

  if (isPR && "prBranch" in env && isValidBranch(env.prBranch)) {
    branch = env.prBranch;
  } else if(isValidBranch(env.branch)) {
    branch = env.branch;
  }

  if (!branch) {
    try {
      branch = execSync("git symbolic-ref --short HEAD", {
        encoding: "utf8",
        stdio: "ignore",
      });
    } catch (error) {}
  }

  return branch;
}
