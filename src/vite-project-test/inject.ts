import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import fs from "node:fs";
import type { GlobalCLIOptions } from "dep-types/cli";

type getViteRootPathType = (url: string) => Promise<string | null>;

export async function injectCodeOnViteProject(options: GlobalCLIOptions) {
  console.log("TODO: ", options);
  const getViteRootPath: getViteRootPathType = async (url: string) => {
    const __filename = url.startsWith("/") ? url : fileURLToPath(url);
    const __dirname = dirname(__filename);
    const packageJsonPath = join(__dirname, "package.json");
    if (__filename === __dirname) {
      return null;
    }
    if (fs.existsSync(packageJsonPath)) {
      const data = fs.readFileSync(packageJsonPath, "utf8");
      const packageJson = JSON.parse(data);
      if (packageJson.name === "@vitejs/vite-monorepo") {
        return __dirname;
      }
    }
    return await getViteRootPath(__dirname);
  };

  var viteRootPath = await getViteRootPath(import.meta.url);

  if (viteRootPath) {
    const gitPostCheckoutHookPath = join(
      viteRootPath,
      ".git/hooks/post-checkout",
    );
    const postCheckoutContent = fs.readFileSync("./post-checkout", "utf8");
    if (fs.existsSync(gitPostCheckoutHookPath)) {
      const data = fs.readFileSync(gitPostCheckoutHookPath, "utf8");
      if (!data.includes("## sci vite-project-inject")) {
        const lines = data.split("\n");
        lines[0] = "\n";
        const newContent = lines.join("\n");
        const newPostCheckoutContent = postCheckoutContent + newContent;
        fs.writeFileSync(
          gitPostCheckoutHookPath,
          newPostCheckoutContent,
          "utf8",
        );
      }
    }
    fs.writeFileSync(gitPostCheckoutHookPath, postCheckoutContent, "utf8");
  }
}
