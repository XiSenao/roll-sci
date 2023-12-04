import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import fs from "node:fs";
import type { GlobalCLIOptions } from "dep-types/cli";

type getViteRootPathType = (url: string) => Promise<string | null>;

export async function injectCodeOnViteProject(options: GlobalCLIOptions) {
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
    const vitePackageRootPath = join(viteRootPath, 'packages/vite');
    const gitPostCheckoutHookPath = join(
      viteRootPath,
      ".git/hooks/post-checkout",
    );
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const postCheckoutContent = 
      fs.readFileSync(join(__dirname, './post-checkout'), "utf8")
        .replaceAll("__vitePackageRootPath__", vitePackageRootPath)
        .replaceAll("__viteRootPath__", viteRootPath);
    if (!fs.existsSync(join(
      viteRootPath,
      ".git/hooks",
    ))) {
      console.error(`--------------- Please initialize git ---------------\n`);
      return;
    }
    if (fs.existsSync(gitPostCheckoutHookPath)) {
      const data = fs.readFileSync(gitPostCheckoutHookPath, "utf8");
      if (!data.includes("## sci vite-project-inject")) {
        const lines = data.split("\n");
        lines[0] = "\n";
        const newContent = lines.join("\n");
        const newPostCheckoutContent = postCheckoutContent + newContent;
        return fs.writeFileSync(
          gitPostCheckoutHookPath,
          newPostCheckoutContent,
          "utf8",
        );
      }
    } 
    fs.writeFileSync(gitPostCheckoutHookPath, postCheckoutContent, "utf8");

    fs.chmod(gitPostCheckoutHookPath, '755', (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.error(`--------------- Code injection successful ---------------\n`);
    });

  }
}
